/**
 * Echo Chamber Mapper — Google Sheets backend
 *
 * SETUP
 * 1. Create a new Google Sheet.
 * 2. Extensions > Apps Script. Delete any sample code and paste all of this.
 * 3. Click Deploy > New deployment > type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Copy the Web app URL it gives you.
 * 4. Paste that URL into the ENDPOINT constant at the top of echo-chamber-app.html.
 * 5. Done. Each submission adds a row; the debrief reads them all back.
 *
 * Stored per response: timestamp, connectedness (d), like-mindedness (s), score (eci).
 * No names are ever sent or stored.
 */

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('responses');
  if (!sheet) {
    sheet = ss.insertSheet('responses');
    sheet.appendRow(['timestamp', 'connectedness', 'likemindedness', 'score']);
  }
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), Number(data.d), Number(data.s), Number(data.eci)]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('responses');
  let out = [];
  if (sheet) {
    const rows = sheet.getDataRange().getValues();
    // skip the header row
    out = rows.slice(1).map(function (r) {
      // r[0] is the timestamp; sent as an ISO string so the debrief can filter by day
      return { t: r[0], d: r[1], s: r[2], eci: r[3] };
    });
  }
  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
