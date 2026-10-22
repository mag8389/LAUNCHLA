'use strict';
const $=id=>document.getElementById(id),esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const display=n=>n===null||n===undefined?'Unknown':n.toLocaleString();
let orderData={lines:[],ignored:0},inventory=[],all=[],visible=[],busy=false,ordersAt='',inventoryAt='',refreshFailed=false;
function error(e){$('error').textContent=e?.message||String(e||'');}
function options(){
 const current=$('school').value,currentStatus=$('status').value;
 $('school').replaceChildren(new Option('All schools',''));
 for(const s of SchoolOrders.schools(orderData.lines))$('school').add(new Option(s.name+' · '+s.code,s.key));
 $('school').value=[...$('school').options].some(o=>o.value===current)?current:'';
 $('status').replaceChildren(new Option('All statuses',''));
 for(const status of [...new Set(orderData.lines.map(r=>r.status))].sort())$('status').add(new Option(status||'(blank status)',status||'__blank__'));
 $('status').value=[...$('status').options].some(o=>o.value===currentStatus)?currentStatus:'';
}
function render(){
 all=SchoolOrders.attach(orderData.lines,inventory);
 const school=$('school').value,approval=$('approval').value,status=$('status').value,terms=SchoolOrders.norm($('query').value).split(' ').filter(Boolean);
 visible=all.filter(r=>(!school||r.schoolKey===school)&&(!approval||r.approval===approval)&&(!status||(r.status||'__blank__')===status)&&terms.every(t=>SchoolOrders.norm([r.school,r.code,r.program,r.product].join(' ')).includes(t)));
 const schools=SchoolOrders.schools(visible),products=SchoolOrders.products(visible),totals=SchoolOrders.products(all);
 const approved=visible.filter(r=>r.approval==='Approved'&&r.validIdentity);
 $('summary').innerHTML=[[schools.length,'Schools in view'],[visible.length,'Order lines in view'],[approved.length,'Approved lines with school identity'],[visible.filter(r=>r.approval==='Pending').length,'Pending approval lines']].map(([n,label])=>'<div class="stat"><strong>'+n+'</strong><small>'+label+'</small></div>').join('');
 const invalid=all.filter(r=>!r.validIdentity||r.approval==='Invalid approval');
 $('data-review').hidden=!invalid.length&&!orderData.ignored;
 $('data-review').textContent=orderData.ignored+' blank/summary row(s) ignored. '+invalid.length+' row(s) need identity or approval review. Lines missing a school, code, or product cannot enter packing sheets. No rows were merged or deduplicated.';
 $('freshness').textContent='Orders: '+(ordersAt||'not loaded')+' · Inventory: '+(inventoryAt||'not loaded')+(refreshFailed?' · REFRESH FAILED: displayed data may be stale.':' · Refresh before fulfillment.');
 $('schools').innerHTML=schools.map(s=>'<tr><td>'+esc(s.name)+'<small>'+esc([...s.programs].join(' · '))+'</small></td><td>'+esc(s.code)+'</td><td>'+s.lines.length+'</td><td>'+display(s.approved)+'</td><td>'+s.pending+'</td><td><button data-school="'+esc(s.key)+'">Review school</button></td></tr>').join('')||'<tr><td colspan="6">No schools match these filters.</td></tr>';
 $('schools').querySelectorAll('[data-school]').forEach(b=>b.onclick=()=>{$('school').value=b.dataset.school;render();});
 $('products').innerHTML=products.map(g=>{
  const s=g.stock,total=totals.find(t=>t.key===g.key)?.approved??0;
  const warnings=[g.matchStatus!=='Matched'?g.matchStatus:'',s&&s.available===null?'Available stock unknown':'',s&&s.available<0?'Negative availability — review commitments':'',s&&s.combined!==null&&total>s.combined?'All loaded approved demand exceeds combined stock; reconcile open orders and inventory':'',g.rows.some(row=>all.find(r=>r.row===row)?.issues.length)?'Review source rows':''].filter(Boolean);
  return '<tr><td>'+esc(g.name)+'<small>'+esc(s?.part||'')+'</small></td><td>'+display(g.approved)+'</td><td>'+display(total)+'</td><td>'+display(s?.combined)+'</td><td>'+display(s?.approved)+'</td><td>'+display(s?.available)+'</td><td>'+esc(s?.locations||'Location unknown')+'<small>'+esc(warnings.join(' · ')||'Snapshot only; school allocation not verified')+'</small></td></tr>';
 }).join('')||'<tr><td colspan="7">No products match these filters.</td></tr>';
 $('lines').innerHTML=visible.map(r=>'<tr><td>'+esc(r.school||'Missing school')+'<small>'+esc(r.code||'Missing code')+'</small></td><td>'+esc(r.product||'Missing product')+'</td><td>'+esc(r.requested)+'</td><td>'+esc(r.approved||'—')+'</td><td>'+esc(r.approval)+'</td><td>'+esc(r.status||'Not supplied')+'<small>'+esc(r.delivered)+'</small></td><td>'+r.row+'<small>'+esc(r.issues.join(' · '))+'</small></td></tr>').join('')||'<tr><td colspan="7">No order lines match these filters.</td></tr>';
 $('refresh').disabled=busy;$('print').disabled=busy||!approved.length;$('export-lines').disabled=busy||!visible.length;$('export-products').disabled=busy||!products.length;
}
function acceptOrders(rows,source){const next=SchoolOrders.orders(rows);orderData=next;ordersAt=source+' · '+new Date().toLocaleString();refreshFailed=false;options();render();error('');}
function acceptInventory(rows,source){const next=SchoolOrders.inventory(rows);inventory=next;inventoryAt=source+' · '+new Date().toLocaleString();refreshFailed=false;render();error('');}
function refresh(){
 if(busy)return;
 if(typeof google==='undefined'||!google.script?.run){error(Error('Live refresh is available in the Apps Script deployment. Here, import the orders and inventory exports.'));return;}
 busy=true;render();error('');
 google.script.run.withSuccessHandler(data=>{
  try{const nextOrders=SchoolOrders.orders(data.orders.rows),nextInventory=SchoolOrders.inventory(data.inventory.rows);orderData=nextOrders;inventory=nextInventory;ordersAt=data.orders.source+' · '+new Date(data.loadedAt).toLocaleString();inventoryAt=data.inventory.name+' · '+new Date(data.loadedAt).toLocaleString();refreshFailed=false;options();}
  catch(e){refreshFailed=true;error(e);}busy=false;render();
 }).withFailureHandler(e=>{busy=false;refreshFailed=true;error(Error('Could not refresh Google Sheets: '+e.message));render();}).getSchoolOrderData();
}
function download(name,rows){const url=URL.createObjectURL(new Blob(['\uFEFF'+SchoolOrders.csv(rows)],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export-lines').onclick=()=>download('launch-la-school-orders.csv',[
 ['School','Location code','Program','Product','Requested quantity','Approved quantity (P)','Approval','Fulfillment status','Date delivered','Source row','Inventory match','Combined stock','Inventory approved total','Available post bundling','Locations','Review'],
 ...visible.map(r=>[r.school,r.code,r.program,r.product,r.requested,r.approved,r.approval,r.status,r.delivered,r.row,r.matchStatus,r.stock?.combined,r.stock?.approved,r.stock?.available,r.stock?.locations,r.issues.join('; ')])]);
$('export-products').onclick=()=>download('launch-la-school-product-plan.csv',[
 ['Product','Part','Approved in view','Approved across all loaded orders','Combined stock','Inventory approved total','Available post bundling','Locations','Inventory match','Source rows'],
 ...SchoolOrders.products(visible).map(g=>[g.name,g.stock?.part,g.approved,SchoolOrders.products(all).find(t=>t.key===g.key)?.approved,g.stock?.combined,g.stock?.approved,g.stock?.available,g.stock?.locations,g.matchStatus,g.rows.join('; ')])]);
function buildPacking(){
 const approved=visible.filter(r=>r.approval==='Approved'&&r.validIdentity);
 $('print-sheets').innerHTML=SchoolOrders.schools(approved).map(s=>'<section class="packing-sheet"><div class="packing-head"><div><h1>LAUNCH LA School Bundle Planner</h1><h2>'+esc(s.name)+' · '+esc(s.code)+'</h2></div><div>EdTech → School<br>'+esc(new Date().toLocaleDateString())+'</div></div><div class="review-print">APPROVED QUANTITIES · REVIEW BEFORE PICKING · STOCK NOT RESERVED</div><p>'+esc([...s.programs].join(' · '))+'</p><table><thead><tr><th>Product / part</th><th>Approved · P</th><th>Source rows</th><th>Locations</th><th>Available stock*</th><th>Review</th><th>Picked</th></tr></thead><tbody>'+SchoolOrders.products(s.lines).map(g=>'<tr><td>'+esc(g.name)+'<br>'+esc(g.stock?.part||'')+'</td><td>'+display(g.approved)+'</td><td>'+g.rows.join(', ')+'</td><td>'+esc(g.stock?.locations||'Verify location')+'</td><td>'+display(g.stock?.available)+'</td><td>'+esc([g.matchStatus!=='Matched'?g.matchStatus:'',...s.lines.filter(r=>g.rows.includes(r.row)).flatMap(r=>r.issues),...s.lines.filter(r=>g.rows.includes(r.row)&&r.delivered).map(()=> 'Delivery date exists — check prior fulfillment')].filter(Boolean).join('; ')||'Verify prior picks')+'</td><td>______</td></tr>').join('')+'</tbody></table><div class="packing-fields">Packed by: ____________________ &nbsp; Date: ______________ &nbsp; Pallet / batch: ______________</div><div class="packing-note">* Stock is shared across schools, not allocated to this packing sheet. Available stock may already reflect approved orders. Quantities follow the source inventory units; packs and bundles are not converted. Verify prior packing and delivery to prevent duplicate fulfillment.<br>Orders: '+esc(ordersAt)+'. Inventory: '+esc(inventoryAt||'NOT LOADED')+'. '+(refreshFailed?'REFRESH FAILED — VERIFY CURRENT DATA. ':'')+'This printout does not change approvals, deduct inventory, or save progress.</div></section>').join('');
}
$('print').onclick=()=>{buildPacking();window.print();};window.addEventListener('beforeprint',buildPacking);
$('refresh').onclick=refresh;for(const id of ['school','approval','status','query'])$(id).oninput=render;
$('all-schools').onclick=()=>{$('school').value='';render();};
for(const kind of ['orders','inventory']){
 const accept=kind==='orders'?acceptOrders:acceptInventory;
 $(kind+'-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>10e6)throw Error('Use a file smaller than 10 MB.');accept(SchoolOrders.parse(await f.text()),'Imported '+f.name);}catch(err){error(err);}e.target.value='';};
 $('load-'+kind).onclick=()=>{try{accept(SchoolOrders.parse($(kind+'-paste').value),'Pasted '+kind);}catch(err){error(err);}};
}
render();if(typeof google!=='undefined'&&google.script?.run)refresh();
