# LAUNCH LA School Bundle Planner

This is a NEW, separate app for school-submitted orders delivered directly by EdTech. Keep the existing department/bundle-distribution planner and its deployment unchanged.

## Ready-to-use export/import version

Open `../../LAUNCHLA-School-Bundle-Planner.html` in a browser. Load full orders and inventory CSV/TSV exports, or paste spreadsheet cells including headers. Data stays in this page's memory; it is not embedded in the app, uploaded, or saved to browser storage. Reloading requires another import. Exports and printouts contain the current filtered order data.

The GitHub Pages copy uses imports; GitHub Pages cannot run Apps Script or read your private Google Sheet automatically.

## Connect to the live workbook in a new Apps Script project

1. Open https://script.google.com/home and create a **New project** named **LAUNCH LA School Bundle Planner**.
2. Replace that new project's `Code.gs` with this folder's `Code.gs`.
3. Add an HTML file named **SchoolOrders** and paste this folder's `SchoolOrders.html`. These two files are sufficient; do not paste the source JavaScript files separately.
4. Choose **Deploy → New deployment → Web app**. Execute as **User accessing the web app** and restrict access to your LAUSD organization. Users need permission to read the workbook. Sign in with your LAUSD account and authorize Google Sheets access when prompted. The code independently checks the active account's `lausd.net` domain.
5. Deploy and copy the NEW `/exec` URL. It opens this planner directly with no `?app=` parameter. Keep the old department planner's URL and project unchanged.
6. Confirm live loading, then compare a school's product quantities against Column P in the source sheet. Verify inventory columns and stock formulas before using it to fulfill orders. Future edits require **Manage deployments → Edit → New version → Deploy**.

The source workbook is `1jWrPNLyDg8dGBs95ru5GiwIWovEMeAME-10kKH09odg`; orders use `gid=354757045` and inventory uses `gid=0`. No secrets or tokens belong in these files. The app only reads data: no writes, approval changes, outgoing email, reservations, or stock deductions.

## What the planner does

- Starts with positive approved quantities from **Column P**. Requested quantities in I and approval text in U do not override P.
- Keeps blank (pending), zero, invalid, and positive approvals distinct. Quantities must be nonnegative whole numbers. Invalid school/code/product identities are flagged and excluded from approved totals and packing sheets.
- Groups by school name and text location code, preserving leading zeros. Repeated school/product lines retain their source row numbers and are summed on packing sheets rather than silently discarded.
- Provides school summaries, school/status/approval/search filters, per-product demand, line/product CSV exports, and a printable packing sheet for each school in view. Printing includes only positive approvals with valid identities, even if the view also contains pending or rejected lines.
- Matches inventory by exact product name after normalizing case and whitespace. Missing and multiple matches require review; there is no fuzzy or guessed match.
- Shows combined stock, inventory approved total, available post-bundling stock, locations, and all loaded approved demand alongside demand in the current view. All-loaded totals still include historical orders; reconcile fulfillment status before using them.
- Includes all fulfillment statuses until explicitly filtered. A source Duplicate flag or delivery date requires review; no automatic assumption is made about whether an order was already picked or delivered. Picking fields on printouts are handwritten and not saved.

**Stock accounting remains unverified:** the formula for inventory Column Q has not been supplied. It may already subtract these approved school orders. The planner does not subtract demand from Q again or claim units are allocated to a school. Stock comparisons are advisory until the worksheet's commitment and fulfillment accounting is confirmed. Unknown availability remains unknown, not zero. Source units (packs, sets, bundles, individual items) are preserved without conversion.

## Validation and source files

`core.js`, `app.js`, `style.css`, and `view.html` are editable sources. Run `python apps-script/launchla-school-orders/build.py` from the repository root to regenerate both HTML copies. Run `node --test apps-script/launchla-school-orders/core.test.cjs` for data regression tests. Browser checks should exercise imports, school filtering, positive-only printing, exports, malformed import handling, inventory ambiguity, and live Apps Script success/failure handlers.

Cloud-machine checks cannot authorize or deploy your Apps Script project. Live account access, the deployed endpoint, and the stock accounting must be checked after deployment; an import-only browser test does not establish live Google Sheets access.
