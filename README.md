# Echo Chamber Mapper

A confidential, 3-question in-class exercise. Participants map their trusted work circle and get a private "Echo Chamber Score." Anonymous results (no names) feed a live facilitator debrief.

- `index.html` — the app (front-end). This is what GitHub Pages serves.
- `Code.gs` — the Google Apps Script backend that stores anonymous responses in a Google Sheet.

Nothing identifying is ever sent or stored. The backend only receives three numbers per response: connectedness, like-mindedness, and the score (plus an automatic timestamp).

**Facilitator debrief is password-protected.** The password is set in `index.html` (`const DEBRIEF_PW`). Responses accumulate across all sessions; the debrief has a **"Show only today's responses"** toggle to focus on a single day.

> Note on the password: it lives in the page's source, so it keeps casual participants out of the debrief tab but is not strong security. If you need the underlying numbers to be truly private, see "Stronger privacy" at the bottom.

---

## Part A — Google Sheet backend (do this first)

You need this done first because it produces the **web app URL** that the app talks to.

1. Go to <https://sheets.new> to create a new blank Google Sheet. Name it something like *Echo Chamber Responses*.
2. In the menu: **Extensions → Apps Script**. A new tab opens.
3. Delete any sample code in the editor, then open `Code.gs` from this folder, copy **all** of it, and paste it in. Click the save icon (💾).
4. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - **Description:** anything (e.g. "echo chamber").
   - **Execute as:** *Me*.
   - **Who has access:** *Anyone*. (This must be "Anyone", not "Anyone with Google account" — participants won't be signed in.)
   - Click **Deploy**.
5. Google will ask you to authorize. Click **Authorize access**, pick your account, and on the "Google hasn't verified this app" screen click **Advanced → Go to [project] (unsafe)** → **Allow**. (This warning is normal for your own scripts.)
6. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy.../exec`.

Keep that URL — you'll paste it into the app in Part B.

> A `responses` tab is created automatically on the first submission, with columns: timestamp, connectedness, likemindedness, score.

---

## Part B — Wire the URL into the app

1. Open `index.html` in any text editor.
2. Near the top of the `<script>` block, find this line:

   ```js
   const ENDPOINT = '';
   ```

3. Paste your web app URL between the quotes:

   ```js
   const ENDPOINT = 'https://script.google.com/macros/s/AKfy.../exec';
   ```

4. Save the file.

That's the only edit the app needs. If you leave `ENDPOINT` empty, the app still runs and shows each person their own result — but nothing is saved and the debrief shows an empty "no responses yet" state.

> **Already deployed the backend before this update?** `Code.gs` now also returns each response's timestamp (so the "today only" filter works). You must push the new version: in Apps Script, **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The web app URL stays the same.

---

## Part C — Publish on GitHub Pages

Your repo: **https://github.com/murattarakci/OrgPolarization**
Your live URL will be: **https://murattarakci.github.io/OrgPolarization/**

### Option 1 — drag and drop in the browser (no command line)

1. Open <https://github.com/murattarakci/OrgPolarization>.
2. Click **Add file → Upload files**.
3. Drag in `index.html` (the edited one from Part B). You can also include `Code.gs` and this README.
4. Click **Commit changes**.
5. Go to **Settings → Pages** (left sidebar).
6. Under **Build and deployment → Source**, choose **Deploy from a branch**.
7. Set **Branch** to `main` and folder to `/ (root)`. Click **Save**.
8. Wait ~1 minute, then refresh. Pages shows your live URL: `https://murattarakci.github.io/OrgPolarization/`

### Option 2 — command line (if you prefer git)

```bash
git clone https://github.com/murattarakci/OrgPolarization.git
cd OrgPolarization
# copy the edited index.html (and Code.gs) into this folder, then:
git add index.html Code.gs README.md
git commit -m "Add Echo Chamber Mapper app"
git push origin main
```

Then do steps 5–8 above to enable Pages.

> **Important:** the file must be named exactly `index.html` and sit at the repo root (or in a `/docs` folder if you select that option in Pages). GitHub Pages serves `index.html` automatically.

---

## Running it in class

- Share the GitHub Pages URL (a QR code works well on a slide).
- Participants open it on their phones, answer 3 questions, see their private score, and can download a names-removed PDF.
- You open the same URL, click the **Facilitator debrief** tab, enter the password (`Firat2674!`), and click **Refresh** to pull live responses for the scatter plot and score distribution.
- Responses build up across every session that uses this app. Tick **"Show only today's responses"** to see just the current group; untick it to compare against everyone so far.

## What the score means

`Score = √(connectedness × like-mindedness)`, both on a 0–1 scale.
- **Connectedness** = of all possible pairs in someone's circle, how many talk to each other.
- **Like-mindedness** = how close their contacts' political views are to their own (averaged, rescaled to 0–1).
- A high score means a tight, like-minded circle — the structural signature of an echo chamber.

## Privacy notes

- Names are entered only on the participant's own device to build their pairs. They are never transmitted. Only the derived numbers (plus a timestamp) leave the browser.
- The downloadable PDF has names stripped (contacts are shown as 1, 2, 3…).
- If you'd rather store nothing at all, leave `ENDPOINT` empty — the debrief then simply shows "no responses yet."

## Troubleshooting

- **Debrief says "no responses yet"** → `ENDPOINT` is empty, no one has submitted, or (with the toggle on) no one has submitted *today*.
- **"Show only today" shows nothing but you expect data** → make sure you redeployed `Code.gs` as a **New version** after this update; older versions don't send the timestamp the filter needs.
- **Submissions don't appear** → re-check Part A: access must be **Anyone**. After any script change you must **Deploy → Manage deployments → Edit → New version**.
- **Authorization error for participants** → you deployed with the wrong access level; redeploy as **Anyone**.
- **Forgot/changed the debrief password** → edit `const DEBRIEF_PW = '...'` near the top of the `<script>` in `index.html`, then re-upload.

## Stronger privacy (optional)

The debrief password only hides the UI. Because the backend's `doGet` is public, someone who finds the web app URL could read the raw numbers (still no names). If that matters, add a secret token: require a `?key=...` parameter in `doGet` and append the same key to the `fetch(ENDPOINT)` call in the debrief. Ask and this can be wired in.
