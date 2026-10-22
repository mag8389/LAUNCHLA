# Connect private email-link dashboards

Status: application and database changes are prepared. Supabase is not configured in this repository. `private.html` fails closed until public configuration is supplied; existing local dashboards remain available. No live sign-in or cloud deployment has been validated.

## 1. Create the service

Create a Supabase account and a project in a region appropriate for your organization's requirements. Keep the database password and secret/service-role API keys out of GitHub and out of chat. Check that your organization permits the service before putting work data into it.

From the project's Connect/API settings, obtain its HTTPS Project URL and **publishable** key (or legacy **anon** key). These two values are public browser configuration. Put them in `auth-config.js`; never use a `service_role` JWT or `sb_secret_` key. The browser refuses those keys as an additional guard; row-level database permissions are the actual security boundary.

## 2. Create tables and authorization

Run `supabase/private-dashboards.sql` once using the project's SQL editor. It creates:

- A private approved-email list, readable only by the administrator.
- A dashboard row per Supabase user ID, with row-level access restricted to that user and enabled membership.
- Load/save functions that derive ownership from the authenticated user; callers cannot pick another person's ID.
- Revision checks so stale tabs/devices cannot silently overwrite newer changes.

Do not disable RLS, add public policies, or grant application clients access to the membership list. The migration intentionally is not destructive or a reset script; don't rerun it blindly on an existing database.

Using the SQL editor (not a file committed to GitHub), add the owner's and approved teammates' real addresses, for example:

```sql
insert into public.dashboard_members (email)
values (lower('approved-person@example.org'))
on conflict (email) do update set enabled = true;
```

The example address is a placeholder. Replace it privately for each approved person. Use the email the person will actually sign in with. Names alone are not account identifiers.

To revoke dashboard access:

```sql
update public.dashboard_members set enabled = false
where email = lower('approved-person@example.org');
```

Both load and save recheck enabled membership and the verified address from `auth.users`. Changing user-editable metadata cannot grant membership. Revocation blocks future server operations; it cannot retract data someone already viewed/exported.

## 3. Configure email authentication

In Supabase Authentication settings:

1. Enable the Email provider and email confirmation. Use email magic links, not a password requirement.
2. Set the Site URL to `https://mag8389.github.io/LAUNCHLA/private.html`.
3. Add that exact URL to the allowed redirect URLs. Add a localhost redirect only if you need development testing; don't use broad production redirect wildcards.
4. Keep the normal magic-link template using `{{ .ConfirmationURL }}`. The SDK uses the PKCE flow and validates the callback in the browser that requested the link. Open links in that same browser/profile. Work-email security scanners can consume links; if a link is expired, request a new one.
5. Configure production SMTP with an email provider you control. Supabase's default mail service has recipient/rate restrictions and is not suitable for sending to an arbitrary team. Put SMTP credentials into Supabase's settings only. Configure any required sender-domain verification there; test delivery to the actual work mailboxes.
6. Provision approved accounts through Supabase Authentication → Users using the service's supported add/invite-user flow. If invited users receive an initial invitation, have them complete it using the Supabase-provided link, then return to `private.html` and request a fresh sign-in link. Disable public sign-ups once provisioning is arranged; the app also sets `shouldCreateUser: false`, so it cannot create new users from its sign-in form.

Account provisioning and membership are **both** required. An invited/confirmed account without enabled membership cannot read or save a dashboard. Do not add an email allowlist in public JavaScript or publish team email addresses.

## 4. Deploy and validate before switching the team

Merge the application changes only after reviewing them. GitHub Pages serves `private.html`, `private-auth.js`, `private-dashboard.js`, `auth-config.js`, and the local `vendor` SDK files. There is no application build/install step.

Verify with two actual approved accounts on separate browser profiles:

1. Request and receive a sign-in email for account A. Open its link in the requesting browser. Add a project, type, resource, pin and note, then wait for **All changes saved**.
2. Sign in as A from another browser/device; the saved dashboard must load.
3. Sign in as B. It must start blank and never show A's data. Different `?workspace=` values must not change account ownership.
4. Try an unapproved account. The dashboard must stay hidden and database access must be denied. Revoke a test account and confirm future reads/saves are denied.
5. Sign out and confirm no dashboard is visible, including after a refresh or back navigation. Sign out on shared devices. Authentication sessions persist in the browser until sign-out or expiry; do not treat a shared browser profile as private while an account remains signed in.
6. Change the same dashboard in two tabs/devices. A stale save must show a conflict, not overwrite newer data. Export unsaved changes, reload, then import the backup to merge.
7. Test an offline save. The page must show **Changes not saved**, preserve the in-memory data for export, and allow retry. Unsaved cloud changes are not stored in browser local storage and will be lost if the tab is closed without a backup.

These live tests are required. Local tests do not establish email delivery, correct redirect/SMTP settings, production grants, or deployed isolation.

## 5. Move existing local dashboards deliberately

On each person's existing local dashboard: **Settings → Export backup**. After signing in at `private.html`: **Settings → Import backup**, then wait for **All changes saved**. The private dashboard starts blank and never silently imports whichever local workspace happens to be open on the device. Each account owns its imported data. Imports from the original populated dashboard also carry built-in library memberships, favorites and notes using their original IDs.

The numbered team links and main dashboard still use their existing local storage. They are not made private by adding a sign-in page. After live validation, give everyone the **same private.html sign-in link** and replace/hide the old directory as a separate rollout step. Local backups and already published static files/history are not automatically removed or protected by authentication. Previously published built-in resource links remain publicly retrievable until separately removed; permissions at Google/Microsoft continue to control the underlying documents.

## Development validation

`npm ci --ignore-scripts` installs the pinned PostgreSQL-in-WASM test dependency only; production needs no npm packages. Run `npm test` to execute actual PostgreSQL RLS/function checks (anonymous, approved A/B, unverified, outsider, revocation, and conflicts). Run `python tests/private-auth-browser.py` with Python Playwright and `/usr/bin/chromium` available. Browser tests use the real bundled Supabase SDK against mocked HTTP responses and send no real email. Run `node --check private-auth.js` and `node --check private-dashboard.js` for syntax.
