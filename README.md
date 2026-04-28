# Wrangling — Wrang

**Local-first content workstation.** No backend, no API rate limits, no waiting on cloud parsers. Drop a CSV, get instant analysis, cache video locally, hand off to your phone via QR.

> Live prototype: open `Wrang Onboarding.html` in any modern browser, or visit the Vercel deployment.

---

## What's in this repo

```
Wrangling/
├── Wrang Onboarding.html     # Entry point — open this
├── styles.css                # Theme tokens + all component styles
├── components.jsx            # SVG primitives (logo, sparklines, chart, QR)
├── auth-corral.jsx           # Login / key-gen modal + Color Corral LUT tool
├── app.jsx                   # Main React app, stage state machine
├── tweaks-panel.jsx          # Tweak-mode helpers
└── README.md
```

The whole prototype is static HTML + Babel-transpiled JSX in the browser. **No build step**, no `npm install`, no node server.

---

## Run locally

Any static server works. Pick one:

```bash
# Python
python3 -m http.server 5173

# Node (one-liner)
npx serve .

# Or just open the file directly
open "Wrang Onboarding.html"
```

Then visit <http://localhost:5173/Wrang%20Onboarding.html>

---

## Push to GitHub

```bash
echo "# Wrangling" >> README.md
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Hotpopize/Wrangling.git
git push -u origin main
```

If the remote already has a README on it, pull first:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## Deploy to Vercel

1. **Connect repo** — log in to [vercel.com](https://vercel.com), click *Add New → Project*, import `Hotpopize/Wrangling`.
2. **Framework Preset** — choose **Other** (it's a static site).
3. **Build Command** — leave empty.
4. **Output Directory** — leave empty (root).
5. Click **Deploy**.

Vercel will serve the project as static files. To make `Wrang Onboarding.html` the default route, either:

- Rename it to `index.html`, **or**
- Add a `vercel.json` rewrite (already supported below).

### Optional `vercel.json`

```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/", "destination": "/Wrang Onboarding.html" }
  ]
}
```

Drop that into the repo root and the bare domain will land on the prototype.

---

## Roadmap (planned for after the static prototype)

These need a tiny edge function — GitHub Pages can't host them, but Vercel can via Edge / Serverless Functions:

- **Login strategy** — magic-link email + passkey via WebAuthn; session JWTs signed at the edge
- **Login tracker** — append-only audit log to a KV store (Vercel KV / Upstash) keyed by user
- **Cookie compiler** — consent-mode cookie banner + per-region preference store, served from `/api/consent`

Suggested folder for the next round:

```
api/
├── auth/
│   ├── magic-link.ts         # POST: send signed link via email
│   ├── verify.ts             # GET: redeem token → set HttpOnly cookie
│   └── passkey.ts            # WebAuthn challenge / verification
├── log/
│   └── login.ts              # POST: write { user, ts, ua, ip } to KV
└── consent/
    ├── set.ts                # POST: { region, prefs } → cookie
    └── get.ts                # GET: read compiled cookie
```

The current prototype already generates a real 256-bit local encryption key and a recovery phrase on signup — that key never leaves the browser, and the future server-side components are designed to never need it.

---

## License

MIT — do whatever feels neighbourly.
