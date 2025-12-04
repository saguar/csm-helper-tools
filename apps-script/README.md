# Share Your Wish — Google Apps Script backend

Use this script to back the **Share Your Wish** page (`share-your-wish.html`). It exposes the `list`, `add`, and `clear` actions that the front-end expects and stores messages inside a Google Sheet.

## Setup
1. Create a Google Sheet (or reuse an existing one) and copy its **Spreadsheet ID** from the URL.
2. Open [Google Apps Script](https://script.google.com/) and create a new project.
3. Replace the default code with the contents of [`share-your-wish.gs`](./share-your-wish.gs).
4. Set the placeholders at the top of the script:
   - `SPREADSHEET_ID` → the ID from step 1.
   - `ADMIN_TOKEN` → a secret string that matches the `ADMIN_TOKEN` constant in `share-your-wish.html` for the `clear` action.

## Deploy as Web App
1. In the Apps Script editor, go to **Deploy → New deployment → Web app**.
2. Set **Execute as** to **Me** (the sheet owner) and **Who has access** to **Anyone**.
3. Click **Deploy** and copy the **Web app URL**.
4. In `share-your-wish.html`, replace `SHEET_ENDPOINT` with this URL so the page calls your Web App.

## Actions exposed
- `GET  ?action=list` → returns `{ wishes: [{ text, timestamp }, ...] }`.
- `POST action=add&text=...` → appends a new wish to the sheet.
- `POST action=clear&token=...` → deletes all rows (requires the correct `ADMIN_TOKEN`).

The script automatically creates a `Wishes` sheet with headers if it does not exist and ensures responses are returned as JSON.
