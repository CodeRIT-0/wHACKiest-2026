# Registration backend (Google Apps Script)

Two pages on the site post to this one script:

- `/register`: checks the rules again, rejects a USN or leader contact number that's already
  registered, gives the team an ID like `WH26-K7M3QX` and adds one row per team to a Google Sheet.
- `/uplink` (hidden, not linked anywhere): teams enter their team ID + leader email, choose
  their track and upload their idea PPT. The track fills the team's **Track** column; the PPT goes
  to a Drive folder and is linked on the row. Re-uploading replaces both.

## Setup (once, ~10 minutes)

1. **Sheet**: create a new Google Sheet (e.g. "wHACKiest 2026 Registrations").
2. **Folder**: create a Drive folder for the PPTs. Open it and copy the ID from the URL:
   `drive.google.com/drive/folders/<THIS_PART>`.
3. **Script**: in the Sheet, open **Extensions → Apps Script**. Replace the contents of `Code.gs`
   with [`Code.gs`](./Code.gs) from this folder, and paste the folder ID into `PPT_FOLDER_ID`.
4. **Permissions**: pick `setup` in the function dropdown and click **Run**. Approve the
   permissions prompt (on "Google hasn't verified this app", choose *Advanced → Go to project*).
   This creates the `Registrations` tab with its headers and a secret (kept in Script Properties,
   not the code) that team IDs are made from. Don't delete that property, or new IDs won't match
   the pattern of old ones. Existing IDs keep working either way.
5. **Deploy**: **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**

   Copy the web app URL (ends in `/exec`).
6. **Website**: add it to `.env` (and to the hosting provider's environment variables):
   ```
   REGISTRATION_ENDPOINT=https://script.google.com/macros/s/.../exec
   ```
   Restart `npm run dev` / redeploy so Next.js picks it up.

## Changing the script later

Edit `Code.gs`, then **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**.
That keeps the same URL. ("New deployment" makes a new URL, which the website won't know.)

## Running registrations

- **Close registrations / PPT submissions**: set `REGISTRATION_OPEN` or `SUBMISSIONS_OPEN` to
  `false` in `CONFIG` and deploy a new version.
- **Open PPT submissions**: share `<your site>/uplink` with teams (WhatsApp community / email).
- **Free a team's USNs** (e.g. a team withdraws and members re-register elsewhere): set that
  row's **Status** to `Withdrawn`.
- **Team IDs** are `WH26-` + 6 characters made from the leader's email and the secret, so they
  can't be guessed or counted. Prefer marking rows `Withdrawn` over deleting them.
- PPTs stay private in your Drive folder; the sheet links to each one (**PPT** and
  **PPT Submitted At** columns). A re-upload moves the old file to Drive's bin.

## Rules

The rules live in two places that must agree: `src/content/registration.ts` (instant feedback in
the browser) and `Code.gs` (the one that actually enforces them). Change both together.
