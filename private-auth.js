'use strict';
(function () {
  const find = id => document.getElementById(id);
  const panel = find('signin-panel'), app = find('dashboard-app'), bar = find('account-bar');
  const message = find('signin-message'), status = find('save-status'), accountMessage = find('account-message');
  let client, userId, revision = 0, pending = null, saving = false, saveTimer, saveFailure = false, conflict = false, mounted = false, signingOut = false, invalidated = false;
  const config = window.INNOVA_AUTH_CONFIG || {};
  function setupMessage(text) { message.textContent = text; }
  function errorMessage(text) { accountMessage.textContent = text; accountMessage.hidden = false; }
  function clearDashboard() {
    invalidated = true;
    clearTimeout(saveTimer);
    app.hidden = true;
    app.inert = true;
    // A fresh document clears application state, previews and handlers after any account change.
    if (mounted || userId) {
      document.documentElement.style.visibility = 'hidden';
      location.replace(new URL('private.html', location.href).href);
      return;
    }
    bar.hidden = true;
    panel.hidden = false;
  }
  function lockForSaveFailure(isConflict) {
    saveFailure = true;
    conflict = isConflict;
    app.inert = true;
    status.textContent = 'Changes not saved';
    errorMessage(isConflict
      ? 'Another tab or device saved a newer version. Export your changes, then reload and import your backup to merge. Reloading discards unsaved changes.'
      : 'Cloud saving failed. Your changes are still in this tab. Export a backup or retry before leaving.');
    find('retry-save').hidden = isConflict;
    find('reload-dashboard').hidden = false;
  }
  async function flush() {
    clearTimeout(saveTimer);
    if (saving || !pending || conflict || invalidated) return;
    saving = true;
    status.textContent = 'Saving…';
    try {
      while (pending) {
        const payload = pending;
        const { data, error } = await client.rpc('save_private_dashboard', { payload, expected_revision: revision });
        if (error || !Number.isSafeInteger(data) || data < 1) {
          lockForSaveFailure(error?.code === '40001');
          return;
        }
        revision = data;
        if (pending === payload) pending = null;
      }
      saveFailure = false;
      status.textContent = 'All changes saved';
      accountMessage.hidden = true;
      find('retry-save').hidden = true;
      find('reload-dashboard').hidden = true;
      app.inert = false;
    } catch {
      lockForSaveFailure(false);
    } finally {
      saving = false;
    }
  }
  function queueSave(state) {
    if (invalidated) return;
    pending = JSON.parse(JSON.stringify(state));
    status.textContent = 'Unsaved changes…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 450);
  }
  find('retry-save').onclick = () => { if (!conflict) flush(); };
  find('reload-dashboard').onclick = () => {
    if (pending && !window.confirm('Reloading discards unsaved changes. Export a backup first. Continue?')) return;
    pending = null;
    location.reload();
  };
  find('account-export').onclick = () => window.innovaDashboard?.exportBackup();
  window.addEventListener('beforeunload', event => {
    if (pending || saving) { event.preventDefault(); event.returnValue = ''; }
  });
  find('sign-out').onclick = async () => {
    if (signingOut) return;
    signingOut = true;
    find('sign-out').disabled = true;
    try {
      await flush();
      if (pending || saving || saveFailure) {
        errorMessage('Export a backup and resolve unsaved changes before signing out. You may reload after exporting to discard them.');
        return;
      }
      // Local scope removes this browser's session without signing out other devices.
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) { errorMessage('Sign-out failed. Please try again.'); return; }
      clearDashboard();
    } finally {
      signingOut = false;
      find('sign-out').disabled = false;
    }
  };
  find('signin-form').onsubmit = async event => {
    event.preventDefault();
    const email = find('signin-email').value.trim().toLowerCase();
    if (!find('signin-form').reportValidity()) return;
    find('send-link').disabled = true;
    setupMessage('Sending sign-in link…');
    try {
      const redirect = new URL('private.html', location.href).href;
      const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: redirect } });
      setupMessage(error
        ? 'Could not send a link. Confirm your account is invited, check the address, and try again. If it continues, contact the dashboard owner.'
        : 'If this address has an enabled account, a sign-in link is on its way. Check your inbox and spam folder; open the newest link in this browser.');
    } catch { setupMessage('Could not reach the sign-in service. Please try again.'); }
    finally { find('send-link').disabled = false; }
  };
  async function mount(user) {
    userId = user.id;
    find('send-link').disabled = true;
    setupMessage('Loading your private dashboard…');
    const { data, error } = await client.rpc('load_private_dashboard');
    if (invalidated) return;
    if (error || !data || !Number.isSafeInteger(data.revision) || data.revision < 0) {
      bar.hidden = false;
      find('account-email').textContent = user.email || 'Signed-in account';
      find('account-export').hidden = true;
      setupMessage(error?.code === '42501'
        ? 'This account is not approved for INNOVA-DASH. Ask the owner to enable your email, then reload, or sign out to use another account.'
        : 'Your dashboard could not be loaded. No blank dashboard has been saved over it. Try reloading or contact the owner.');
      return;
    }
    revision = data.revision;
    window.innovaCloud = { initialData: data.data, save: queueSave };
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'private-dashboard.js';
      script.onload = resolve;
      script.onerror = reject;
      const onError = event => { if (event.filename?.endsWith('/private-dashboard.js')) reject(new Error('Dashboard initialization failed')); };
      window.addEventListener('error', onError);
      script.onload = () => { window.removeEventListener('error', onError); resolve(); };
      script.onerror = () => { window.removeEventListener('error', onError); reject(new Error('Dashboard script unavailable')); };
      document.body.append(script);
    });
    if (invalidated) return;
    if (!window.innovaDashboard) throw new Error('Dashboard initialization failed');
    mounted = true;
    find('account-email').textContent = user.email || 'Your account';
    status.textContent = revision ? 'All changes saved' : 'Your new private dashboard';
    document.title = 'Your private dashboard · INNOVA-DASH';
    panel.hidden = true;
    bar.hidden = false;
    app.hidden = false;
  }
  async function init() {
    let url;
    try { url = new URL(config.supabaseUrl); } catch { /* Show the configuration message below. */ }
    const key = config.publishableKey || '';
    let legacyRole;
    if (key.startsWith('eyJ')) {
      try { legacyRole = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role; } catch { /* Invalid public key. */ }
    }
    if (!url || url.protocol !== 'https:' || url.pathname !== '/' || url.username || url.password ||
        !(key.startsWith('sb_publishable_') || legacyRole === 'anon')) {
      setupMessage('Private sign-in is not connected yet. The owner needs to finish the Supabase setup before accounts can be used. Existing local dashboards are unchanged.');
      return;
    }
    if (!window.supabase?.createClient) { setupMessage('The sign-in library could not load. Refresh or contact the owner.'); return; }
    client = window.supabase.createClient(url.href, key, {
      auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, storageKey: 'innova-private-auth-v1' }
    });
    client.auth.onAuthStateChange((event, session) => {
      // Do not await auth operations from inside the auth callback.
      if (userId && (!session || session.user.id !== userId)) clearDashboard();
    });
    const { data: { user }, error } = await client.auth.getUser();
    // Remove expired/error callback details from the visible URL. SDK handles valid callbacks first.
    const hadCallback = Boolean(location.hash || location.search);
    history.replaceState(null, '', new URL('private.html', location.href).pathname);
    if (!user) {
      find('send-link').disabled = false;
      setupMessage(error && hadCallback
        ? 'This sign-in link could not be used. Request a fresh link in this browser.'
        : 'Enter your approved email address to get a sign-in link.');
      return;
    }
    await mount(user);
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden && mounted) {
        try {
          const { data, error } = await client.auth.getUser();
          if (error || data.user?.id !== userId) clearDashboard();
        } catch { /* Save operations still enforce authorization on the server. */ }
      }
    });
  }
  init().catch(() => {
    app.hidden = true;
    panel.hidden = false;
    setupMessage('The private dashboard could not start. No dashboard data has been overwritten. Reload or contact the owner.');
    if (userId) { bar.hidden = false; find('account-export').hidden = true; }
  });
})();
