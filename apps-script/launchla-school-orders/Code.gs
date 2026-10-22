/** LAUNCH LA School Bundle Planner: deploy in a NEW Apps Script project. */
const SCHOOL_ORDERS_CONFIG = Object.freeze({
  spreadsheetId: '1jWrPNLyDg8dGBs95ru5GiwIWovEMeAME-10kKH09odg',
  ordersGid: 354757045,
  inventoryGid: 0,
  allowedDomain: 'lausd.net'
});
function doGet() {
  try {
    requireSchoolPlannerUser_();
    return HtmlService.createHtmlOutputFromFile('SchoolOrders')
      .setTitle('LAUNCH LA School Bundle Planner')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    return HtmlService.createHtmlOutput('<h2>Access unavailable</h2><p>' +
      String(err.message).replace(/[&<>"']/g, function(c) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
      }) + '</p>');
  }
}
function requireSchoolPlannerUser_() {
  const email = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  if (!email || !email.endsWith('@' + SCHOOL_ORDERS_CONFIG.allowedDomain)) {
    throw new Error('Sign in with your LAUSD Google account. The deployment must allow the app to verify your signed-in account.');
  }
}
function getSchoolOrderData() {
  requireSchoolPlannerUser_();
  const book = SpreadsheetApp.openById(SCHOOL_ORDERS_CONFIG.spreadsheetId);
  function read(gid) {
    const sheet = book.getSheets().find(function(s) { return s.getSheetId() === gid; });
    if (!sheet) throw new Error('Worksheet gid=' + gid + ' was not found.');
    return {name:sheet.getName(), rows:sheet.getDataRange().getDisplayValues()};
  }
  const orders = read(SCHOOL_ORDERS_CONFIG.ordersGid);
  const headers = orders.rows[0] || [];
  if (headers[3] !== 'School' || headers[4] !== 'Location Code' || headers[7] !== 'Product' ||
      !/Approved Quantities/i.test(headers[15] || '')) {
    throw new Error('Orders columns changed. Expected School in D, Location Code in E, Product in H, and approved quantities in P.');
  }
  // Send only the columns used by the planner. Contact and internal notes stay in the sheet.
  const safeRows = orders.rows.map(function(r) {
    return r.map(function(value, index) {
      return [3,4,5,7,8,15,19,20,24].indexOf(index) >= 0 ? value : '';
    });
  });
  return {orders:{rows:safeRows,source:orders.name},inventory:read(SCHOOL_ORDERS_CONFIG.inventoryGid),loadedAt:new Date().toISOString()};
}
