"""Browser integration tests with the real bundled SDK and mocked Supabase HTTP responses.
No real email is sent. SQL authorization is tested separately with PostgreSQL in npm test.
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from functools import partial
import base64, json, time
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}/'
API='https://innova-test.supabase.co'
USER={'id':'00000000-0000-4000-8000-000000000001','email':'alice@example.test','aud':'authenticated','role':'authenticated'}
EMPTY={'favorites':[],'notes':{},'custom':[],'customProjects':[],'referenceTypes':[],'includeBuiltins':False}
def b64(value): return base64.urlsafe_b64encode(json.dumps(value).encode()).decode().rstrip('=')
def session():
    now=int(time.time())
    token=b64({'alg':'HS256','typ':'JWT'})+'.'+b64({'sub':USER['id'],'aud':'authenticated','role':'authenticated','exp':now+3600})+'.test-signature'
    return {'access_token':token,'refresh_token':'test-refresh','token_type':'bearer','expires_in':3600,'expires_at':now+3600,'user':USER}

def run():
  with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    # Unconfigured production defaults fail closed without loading any private data.
    page=browser.new_page()
    page.route('**/auth-config.js',lambda r:r.fulfill(content_type='text/javascript',body='window.INNOVA_AUTH_CONFIG={supabaseUrl:"",publishableKey:""};'))
    page.goto(BASE+'private.html')
    assert page.locator('#send-link').is_disabled()
    assert 'not connected yet' in page.locator('#signin-message').inner_text()
    assert page.locator('#dashboard-app').is_hidden()
    page.close()

    def scenario(signed_in=True, load_error=None):
      ctx=browser.new_context(viewport={'width':390,'height':844})
      page=ctx.new_page(); errors=[]; page.on('pageerror',lambda e: errors.append(str(e)))
      calls=[]; store={'data':None,'revision':0,'save_error':None,'exchange_error':False}
      page.route('**/auth-config.js',lambda r:r.fulfill(content_type='text/javascript',body=f"window.INNOVA_AUTH_CONFIG={{supabaseUrl:'{API}',publishableKey:'sb_publishable_test'}};"))
      if signed_in:
        ctx.add_init_script("if (!sessionStorage.getItem('test-seeded')) { localStorage.setItem('innova-private-auth-v1',"+json.dumps(json.dumps(session()))+");sessionStorage.setItem('test-seeded','yes'); }")
      def backend(route):
        request=route.request; path=request.url.split(API)[1]; payload=request.post_data_json if request.post_data else None
        calls.append((path,payload))
        if path.startswith('/auth/v1/user'): return route.fulfill(json=USER)
        if path.startswith('/auth/v1/logout'): return route.fulfill(json={})
        if path.startswith('/auth/v1/otp'): return route.fulfill(json={})
        if path.startswith('/auth/v1/token'):
          if store['exchange_error']:return route.fulfill(status=400,json={'error':'invalid_grant','error_description':'Expired code'})
          return route.fulfill(json=session())
        if path.startswith('/rest/v1/rpc/load_private_dashboard'):
          if load_error: return route.fulfill(status=403,json=load_error)
          return route.fulfill(json={'data':store['data'],'revision':store['revision']})
        if path.startswith('/rest/v1/rpc/save_private_dashboard'):
          if store['save_error']:return route.fulfill(status=409,json=store['save_error'])
          assert payload['expected_revision']==store['revision']
          store['data']=payload['payload'];store['revision']+=1
          return route.fulfill(json=store['revision'])
        raise AssertionError('Unexpected API operation: '+path)
      page.route(API+'/**',backend)
      return ctx,page,calls,store,errors

    ctx,page,calls,store,errors=scenario(False)
    page.goto(BASE+'private.html')
    page.locator('#send-link').wait_for(state='visible')
    page.wait_for_function("!document.querySelector('#send-link').disabled")
    page.locator('#signin-email').fill('alice@example.test');page.locator('#send-link').click()
    page.wait_for_function("document.querySelector('#signin-message').textContent.includes('on its way')")
    otp=[c for c in calls if c[0].startswith('/auth/v1/otp')][0]
    assert otp[1]['create_user'] is False
    assert otp[1]['code_challenge_method']=='s256'
    assert 'redirect_to=' in otp[0]
    assert page.locator('#dashboard-app').is_hidden()
    # The emailed callback exchanges the code using the verifier in the requesting browser.
    page.goto(BASE+'private.html?code=test-email-code')
    page.locator('#quick-add-project').wait_for(state='visible')
    exchange=[c for c in calls if c[0].startswith('/auth/v1/token')][0]
    assert exchange[1]['auth_code']=='test-email-code' and exchange[1]['code_verifier']
    assert '?' not in page.url
    assert not errors,errors
    ctx.close()

    ctx,page,calls,store,errors=scenario(False)
    store['exchange_error']=True
    page.goto(BASE+'private.html?code=expired-code')
    page.wait_for_function("!document.querySelector('#send-link').disabled")
    assert page.locator('#dashboard-app').is_hidden()
    assert 'fresh link' in page.locator('#signin-message').inner_text()
    assert not any('save_private_dashboard' in c[0] for c in calls)
    ctx.close()

    for load_error in [{'code':'42501','message':'not approved'},{'code':'500','message':'unavailable'}]:
      ctx,page,calls,store,errors=scenario(load_error=load_error)
      page.goto(BASE+'private.html');page.wait_for_function("document.querySelector('#account-bar').hidden===false")
      assert page.locator('#dashboard-app').is_hidden()
      assert not any('save_private_dashboard' in c[0] for c in calls)
      assert not errors,errors
      ctx.close()

    ctx,page,calls,store,errors=scenario()
    page.goto(BASE+'private.html');page.locator('#quick-add-project').wait_for(state='visible')
    assert page.locator('.project-card').count()==0
    assert page.evaluate("localStorage.getItem('workroom-v1')") is None
    page.locator('#quick-add-project').click();page.locator('#project-form [name=name]').fill('Private project');page.locator('#project-form [type=submit]').click()
    page.wait_for_function("document.querySelector('#save-status').textContent==='All changes saved'")
    assert store['data']['customProjects'][0]['name']=='Private project'
    page.reload();page.locator('.project-card').wait_for(state='visible');assert page.locator('.project-card').count()==1
    # Failed saves lock editing and preserve in-memory changes for backup/retry.
    store['save_error']={'code':'503','message':'offline'}
    page.locator('.project-card').click();page.locator('#quick-add-type').click();page.locator('#type-form [name=name]').fill('Private notes');page.locator('#type-form [type=submit]').click()
    page.wait_for_function("document.querySelector('#retry-save').hidden===false")
    assert page.locator('#dashboard-app').evaluate('(el)=>el.inert')
    with page.expect_download() as d: page.locator('#account-export').click()
    assert json.load(open(d.value.path()))['referenceTypes']==['Private notes']
    store['save_error']=None;page.locator('#retry-save').click()
    page.wait_for_function("document.querySelector('#save-status').textContent==='All changes saved'")
    assert not page.locator('#dashboard-app').evaluate('(el)=>el.inert')
    page.locator('#quick-add-resource').click()
    page.locator('#resource-form [name=title]').fill('Cloud resource')
    page.locator('#resource-form [name=url]').fill('https://example.com/private')
    page.locator('#resource-form [type=submit]').click()
    page.locator('.resource-menu summary').click();page.locator('.pin-toggle').click()
    page.locator('.resource-details textarea').fill('Cloud note')
    page.wait_for_function("document.querySelector('#save-status').textContent==='All changes saved'")
    page.reload();page.locator('.project-card').click();page.locator('.resource-menu summary').click()
    assert page.locator('.resource-details textarea').input_value()=='Cloud note'
    assert page.locator('.pin-toggle').get_attribute('aria-pressed')=='true'
    # Stale updates never overwrite another session's revision.
    store['save_error']={'code':'40001','message':'conflict'}
    page.locator('#quick-add-type').click();page.locator('#type-form [name=name]').fill('Conflicting type');page.locator('#type-form [type=submit]').click()
    page.wait_for_function("document.querySelector('#reload-dashboard').hidden===false")
    assert page.locator('#retry-save').is_hidden()
    assert 'newer version' in page.locator('#account-message').inner_text()
    assert store['data']['referenceTypes']==['Private notes']
    assert not errors,errors
    ctx.close()
    # Clean sign out clears the document and prevents reopening cloud data from back navigation.
    ctx,page,calls,store,errors=scenario()
    page.goto(BASE+'private.html');page.locator('#quick-add-project').wait_for(state='visible')
    page.locator('#sign-out').click()
    page.wait_for_function("document.querySelector('#signin-panel').hidden===false && document.querySelector('#dashboard-app').hidden===true")
    assert page.evaluate("localStorage.getItem('innova-private-auth-v1')") is None
    assert not errors,errors
    ctx.close()
    browser.close()
  print('PASS: missing config, real SDK email-link request/PKCE, denied membership/load failure, cloud round-trip, save failure/retry, backup recovery, conflict protection, sign-out and mobile layout. Backend responses mocked; live email delivery not tested.')
try: run()
finally: server.shutdown()
