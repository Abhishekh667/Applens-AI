# AppLens AI

**Audit any app store listing in seconds.** Paste a Google Play or Apple App Store link and AppLens AI fetches the public listing and runs an AI vision + ASO audit of the icon, screenshots, featured graphic, title, and description — returning a scored, prioritized report with on-screenshot issue markers.

This is a production-style MVP built with Next.js 15, TypeScript, Tailwind, Framer Motion, and OpenRouter (server-side only).

---

## Features

- **Paste-and-go audit** — auto-detects Google Play vs App Store from the URL and extracts the app/package ID.
- **Real listing fetch** — Google Play via `google-play-scraper`; App Store via Apple's public iTunes Lookup API (with `app-store-scraper` for best-effort subtitle enrichment).
- **AI vision audit** — downloads icon, screenshots, and featured graphic server-side, sends them to a multimodal model on OpenRouter, and returns strict JSON.
- **Scored report** — 0–10 score with label (Poor → Excellent), potential uplift estimate, and an animated score ring.
- **Issues grouped by severity** — Critical / High / Medium / Low, each with why-it-matters, a suggested fix, and an impact estimate.
- **Screenshot markups** — numbered bounding-box "reticles" drawn over each screenshot at the exact problem area; hover/tap for the fix. Good screenshots get a green pass.
- **Asset health cards** — Icon, Screenshots, Featured Graphic (Android only), Title, Description, Overall — each scored /100 with improvements.
- **Listing preview** — the live fetched icon, title, developer, rating, reviews, installs/version, category, screenshots carousel, featured graphic, and full description.
- **Icon, text, working-well, and action-plan sections.**
- **Export to PDF** — clean, vector, multi-page report (jsPDF).
- **Robust states** — staged progress UI, granular error states, and a retry button.
- **No login** — reports are stored in the browser (`localStorage`) and viewable at `/report/[id]`.

---

## Tech stack

| Area        | Choice |
|-------------|--------|
| Framework   | Next.js 15 (App Router) + React 19 |
| Language    | TypeScript (strict) |
| Styling     | Tailwind CSS + custom design tokens |
| Animation   | Framer Motion |
| Validation  | Zod |
| AI          | OpenRouter (`google/gemma-4-26b-a4b-it:free`), **server-side only** |
| Scraping    | `google-play-scraper`, Apple iTunes Lookup API, `app-store-scraper` |
| PDF         | jsPDF |
| Icons       | lucide-react |

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Add your OpenRouter key

Copy the example env file and fill in your key:

```bash
cp .env.example .env.local
```

```env
# .env.local
OPENROUTER_API_KEY=sk-or-...        # from https://openrouter.ai/keys
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> The key is read **only** in server code (`src/lib/openrouter.ts`) and is never bundled into the client. Do not prefix it with `NEXT_PUBLIC_`.

### 3. Run locally

```bash
npm run dev
```

Open <http://localhost:3000>.

### 4. Try it without a key

Visit **`/report/demo`** (or click "See a sample report" on the home page) to view a fully rendered audit using bundled demo data. The `GET /api/demo` endpoint returns the same fixture.

---

## Supported URL formats

**Google Play**

```
https://play.google.com/store/apps/details?id=<package.name>
https://play.google.com/store/apps/details?id=<package.name>&hl=en&gl=us
```

**Apple App Store**

```
https://apps.apple.com/<country>/app/<slug>/id<numericId>
https://itunes.apple.com/<country>/app/<slug>/id<numericId>
```

Anything else returns a clear validation error.

---

## How it works

```
Home → paste URL → /report/run?url=…
        │
        ▼
POST /api/audit
  1. Validate + detect platform        (lib/parse-link.ts)
  2. Fetch listing data                (lib/store-fetch.ts)
  3. Download assets → base64 data URLs (lib/openrouter.ts)
  4. Call OpenRouter (multimodal)      (lib/openrouter.ts)
  5. Parse JSON (1 repair retry) + Zod validate
        │
        ▼
Report saved to localStorage → redirect to /report/[id]
```

### API

**`POST /api/audit`**

```jsonc
// request
{ "url": "https://play.google.com/store/apps/details?id=com.whatsapp" }

// success
{ "ok": true, "report": { "id": "...", "createdAt": "...", "listing": {...}, "audit": {...} } }

// failure
{ "ok": false, "error": "Human-readable message", "stage": "Fetching listing assets" }
```

**`GET /api/demo`** — returns a sample report (`{ ok: true, report }`).

The full AI JSON schema is defined and enforced in `src/types/index.ts` (Zod).

---

## Project structure

```
src/
├─ app/
│  ├─ page.tsx                 # Home (hero + features)
│  ├─ layout.tsx               # Fonts + globals
│  ├─ globals.css
│  ├─ api/
│  │  ├─ audit/route.ts        # POST /api/audit
│  │  └─ demo/route.ts         # GET  /api/demo
│  └─ report/
│     ├─ run/page.tsx          # Runs the audit (progress UI)
│     ├─ demo/page.tsx         # Static demo report
│     └─ [id]/page.tsx         # Loads a saved report from localStorage
├─ components/
│  ├─ home/                    # hero, audit-input, features, chrome
│  ├─ audit/                   # report-view, issues, health, screenshot-markup,
│  │                           # listing-preview, audit-sections, progress, error, runner
│  └─ ui/                      # button, primitives, score-ring
├─ lib/
│  ├─ parse-link.ts            # URL → platform + appId
│  ├─ store-fetch.ts           # Play + App Store fetchers
│  ├─ openrouter.ts            # server-side AI client (key, images, JSON repair)
│  ├─ export-pdf.ts            # jsPDF report
│  ├─ report-store.ts          # localStorage persistence
│  ├─ demo-data.ts             # sample report
│  └─ utils.ts
└─ types/
   ├─ index.ts                 # types + Zod schemas + score helpers
   └─ app-store-scraper.d.ts
```

---

## Scripts

```bash
npm run dev      # local dev
npm run build    # production build (type-check + lint)
npm run start    # serve the production build
npm run lint     # eslint
```

---

## Known limitations

- **Store scraping is best-effort.** Google Play has no official public API; `google-play-scraper` parses public pages and can break if Google changes markup or rate-limits the server's IP. App Store metadata comes from Apple's iTunes Lookup API (reliable), but **subtitle / promotional text** are not exposed there and are only retrieved best-effort via `app-store-scraper` — they may be `null`.
- **Free model variability.** `google/gemma-4-26b-a4b-it:free` is a free OpenRouter model; multimodal quality, rate limits, and JSON adherence vary. The client does one JSON-repair retry and Zod-validates; if the model returns an unusable response you'll get a clear error and a retry button. Swap the model in `src/lib/openrouter.ts` (`MODEL`) for higher quality.
- **Image payload limits.** To keep requests reasonable, the audit sends the icon, featured graphic, and up to 4 screenshots; assets over ~4.5 MB are skipped.
- **Persistence is local only.** Reports live in `localStorage` (last 12 kept). A `/report/[id]` link only resolves in the same browser that generated it. There is no database in this MVP (the architecture leaves room to add Prisma/SQLite and make reports shareable).
- **Coordinates are model-provided.** Screenshot bounding boxes are normalized 0–1 values from the model; placement is approximate.

---

## Security notes

- `OPENROUTER_API_KEY` is referenced only in server modules and API routes. It is never imported into a client component and never sent to the browser.
- All AI calls happen in `POST /api/audit` (Node runtime). The frontend only ever sees the structured, validated report — never the raw model response.
- `.env.local` is gitignored.

---

Built as an AI ASO audit MVP. Swap the model, add a database, and ship.
