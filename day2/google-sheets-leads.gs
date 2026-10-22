// Google Apps Script: receives leads from the TAMM assistant and adds them to this sheet.
// Setup: Extensions > Apps Script, paste this file, Deploy > New deployment > Web app,
// Execute as: Me, Who has access: Anyone. Put the web app URL in LEAD_WEBHOOK_URL.

// Optional: also email each lead (sent from your Google account). Leave '' to turn off.
const NOTIFY_EMAIL = '';

const COLUMNS = [
  'timestamp', 'name', 'phone', 'email', 'intent', 'budget', 'areas', 'property_type',
  'bedrooms', 'timeline', 'interested_in', 'preferred_contact', 'language', 'summary'
];

function doPost(e) {
  const lead = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map((c) => c.replace(/_/g, ' ').toUpperCase()));
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#0d1b2a').setFontColor('#e3c27a');
    sheet.setFrozenRows(1);
  }
  sheet.appendRow(COLUMNS.map((c) => lead[c] || ''));

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(NOTIFY_EMAIL, `New TAMM lead: ${lead.name || 'Unknown'}`, lead.alert_text || JSON.stringify(lead, null, 2));
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
}
