/**
 * Google Apps Script backend for the Share Your Wish page.
 *
 * Replace the placeholders below before deploying as a Web App:
 * - SPREADSHEET_ID: the ID of the Google Sheet that will store the wishes.
 * - ADMIN_TOKEN: a server-side secret that must match the front-end ADMIN_TOKEN
 *   when calling the destructive `clear` action.
 *
 * Expected actions
 * - GET  ?action=list              -> returns the saved wishes.
 * - POST action=add&text=...       -> stores a new wish.
 * - POST action=clear&token=...    -> deletes all wishes (requires ADMIN_TOKEN).
 */

const SPREADSHEET_ID = 'REPLACE_WITH_SPREADSHEET_ID';
const SHEET_NAME = 'Wishes';
const ADMIN_TOKEN = 'REPLACE_WITH_ADMIN_TOKEN';

function doGet(e) {
  return handleRequest('GET', e);
}

function doPost(e) {
  return handleRequest('POST', e);
}

function handleRequest(method, e) {
  const action = (e?.parameter?.action || '').toLowerCase();

  try {
    switch (action) {
      case 'list':
        return jsonResponse({ wishes: listWishes() });
      case 'add':
        if (method !== 'POST') return badRequest('The add action requires POST.');
        addWish(e);
        return jsonResponse({ success: true });
      case 'clear':
        if (method !== 'POST') return badRequest('The clear action requires POST.');
        clearWishes(e);
        return jsonResponse({ success: true });
      default:
        return badRequest('Unknown action. Use list, add, or clear.');
    }
  } catch (error) {
    console.error('Error handling request', error);
    return jsonResponse({ success: false, message: error.message }, 500);
  }
}

function listWishes() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) return [];

  // Skip header row and map to objects.
  return values.slice(1).map(([timestamp, text]) => ({
    text,
    timestamp,
  }));
}

function addWish(e) {
  const text = (e?.parameter?.text || '').trim();
  if (!text) throw new Error('Wish text cannot be empty.');

  const sheet = getSheet();
  sheet.appendRow([new Date(), text]);
}

function clearWishes(e) {
  const providedToken = e?.parameter?.token;
  if (!providedToken || providedToken !== ADMIN_TOKEN) {
    throw new Error('Unauthorized: invalid admin token.');
  }

  const sheet = getSheet();
  sheet.clearContents();
  sheet.appendRow(['Timestamp', 'Wish']);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Wish']);
  }
  return sheet;
}

function jsonResponse(payload) {
  // ContentService.TextOutput does not provide setResponseCode(), so keep the
  // response simple to avoid runtime errors such as
  // "TypeError: ContentService.createTextOutput(...).setMimeType(...).setResponseCode is not a function".
  // Any status information should be encoded in the payload instead.
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function badRequest(message) {
  return jsonResponse({ success: false, message });
}
