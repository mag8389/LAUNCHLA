# INNOVA-DASH online deployment handoff

This is an undeployed Cloudflare Workers application, not a file you can upload to GitHub Pages. It preserves the dashboard interface, including resource assignments, multiple reference types, prism colors, and the Favorites toggle at every width.

Data is stored in Cloudflare D1, keyed by the authenticated person's ID and workspace. The application does not read or write localStorage, sessionStorage, or IndexedDB. Sign-in may use authentication cookies. An internet connection is required. Existing browser data is not bundled into this download.

## Before starting

1. In the browser with your latest projects and resources, open the existing dashboard and use Settings → Export Backup. Keep this file until migration is verified. Export each teammate's workspace separately if needed.
2. You need a Cloudflare account, a domain managed in Cloudflare, Node.js 20 or newer, and terminal access. Cloudflare charges and plan limits depend on your account.
3. Keep the existing GitHub Pages site available until the new version passes the checks below.

## Deploy

Unzip this folder, then run these commands inside it:

```sh
npm install
npx wrangler login
npx wrangler d1 create innova-dash-online
```

Copy the returned database_id into wrangler.jsonc. Replace dash.YOUR-DOMAIN.example with the hostname you want, such as dash.example.org.

In Cloudflare Zero Trust, configure your team domain and a self-hosted Access application for that exact hostname. Set an Allow policy for your email and the teammates you want to admit. Use your organization's identity provider, or email one-time PIN if appropriate. Do not use a Bypass or Everyone policy. Copy the application's AUD tag into ACCESS_AUD and set ACCESS_ISSUER to https://YOUR-TEAM.cloudflareaccess.com (no trailing slash).

The Worker verifies the signed Access JWT, its issuer, audience, expiration, and RS256 algorithm before serving data. Client-supplied email addresses are never used to select another person's records. Leave workers_dev and preview_urls disabled so this app has no alternate public endpoint.

```sh
npm run check
npx wrangler d1 migrations apply innova-dash-online --remote
npm run deploy
```

Open your configured hostname and sign in. If you see a sign-in/configuration error, check the Access application hostname, team issuer, AUD tag, and policy. If deployment reports a domain or permission error, resolve that in Cloudflare before proceeding. Never remove authentication to get around an error.

## Move existing data online

Open Settings → Import Backup on the new site and select your latest exported backup. Wait until the header says Saved online. Refresh and confirm the imported projects, Favorites, notes, resource deletions, and reference type assignments are still present.

Each teammate must sign in with their own account and import their own backup. The team directory does not grant access to someone else's dashboard. The main dashboard uses workspace main; template.html?workspace=team-1 and similar links are optional additional workspaces owned by the person who is signed in, not shared accounts.

## Required checks before switching everyone over

- Same account, second browser: sign in at the same URL and confirm the imported dashboard is present without importing again.
- Different account: confirm it starts separately and cannot see your projects, notes, or Favorites.
- Make a change, wait for Saved online, then refresh. Confirm it persists.
- With the same dashboard open in two browsers, save in one and then save in the stale browser. The stale save must be rejected with a reload message. The app never automatically merges simultaneous edits.
- Disconnect the network and attempt an edit. It must report Not saved and block further edits; it must not silently fall back to browser storage. You can explicitly download unsaved changes before reloading.
- Check Favorites show/hide on a wide and a narrow window, resource assignment checkboxes, and mobile navigation.
- Confirm an unsigned request to /api/dashboard returns 401 or is intercepted by Cloudflare Access.

The app loads online data on opening or refreshing. It does not stream changes into another already-open browser; refresh that browser to see updates. Save conflicts prevent it from overwriting newer data.

## Point the old address to the new one

Only after the checks pass, update the old GitHub Pages index.html with a prominent link to the new hostname and migration instructions. Initially keep an old-version link so people can export their existing browser data. Do not immediately redirect everyone: browser-local data belongs to the old origin and cannot be read from the new domain. Once everyone has migrated and backups are retained, you can replace the old landing page with a redirect. No redirect is included in this package because your new hostname is not known yet.

## Verification status

Checked here: JavaScript syntax, embedded browser-script syntax, absence of browser storage calls, database revision conflicts, initial-write races, and owner/workspace isolation. Not checked here: dependency installation, real Cloudflare Access login/JWT verification, D1 integration through Cloudflare, browser layout, and production deployment. Run the required checks above before using this as your only copy.

Source repository at handoff: mag8389/LAUNCHLA. This archive contains application code and database schema only; it contains no credentials and no exported personal dashboard data.
