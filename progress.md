# MoodMind — Project Progress

> **Last updated:** 2026-06-19  
> **GitHub repo:** https://github.com/huabichnhu03-oss/Quiet-Circle  
> **Handoff docs:** Also see `AGENT_HANDOFF.md` and `NEXT_STEPS.md` for broader context.

---

## What is this app?

MoodMind is a mobile-first mental wellness companion web app designed for LGBTQ+ communities. It provides mood tracking, journaling, guided breathing, community connection, crisis resources, and AI-assisted wellness support — all in a safe, affirming space.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TanStack Query v5, Wouter (routing), Framer Motion |
| UI | shadcn/ui, Radix UI primitives, Tailwind CSS v3, Lucide icons |
| Backend | Node.js, Express v5, TypeScript, tsx |
| Database | PostgreSQL (Drizzle ORM + drizzle-zod) — schema defined, **in-memory store used at runtime** |
| Auth | **Resend magic-link email** (no password, no Google OAuth required) |
| Email | Resend (`server/email.ts`) |
| Deployment | Vercel serverless via `api/index.js` → `api/_server/index.cjs` |
| Build | esbuild (server → `api/_server/index.cjs`), Vite (client → `api/_server/public/`) |

---

## Recent Session Log (2026-06-19)

Work completed in the latest agent session. Use this section to pick up where we left off.

### ✅ Completed

#### Deployment & Vercel
- Audited app for Vercel deployment; fixed multiple blockers
- Fixed `package-lock.json` — replaced Replit private registry URLs (`package-firewall.replit.local`) with `registry.npmjs.org` (was breaking `npm install` on Vercel)
- Added `cross-env` for Windows-compatible npm scripts
- Pinned Node to `20.x` in `package.json` engines
- Fixed Windows `reusePort` crash on local `npm start` (only enabled on non-Windows)
- Created/fixed `vercel.json` — modern config with `buildCommand` + `functions.includeFiles` (legacy `builds` was ignoring buildCommand, so `dist/` never existed on GitHub deploys)
- Fixed **“download file instead of website”** bug: server now initializes synchronously in production; `api/index.js` exports Express app directly
- Fixed **“api/index.js doesn't match any Serverless Functions”** — full project pushed to GitHub (drag-and-drop upload had only uploaded ~16 root files, missing `api/`, `client/`, `server/`)
- Fixed **FUNCTION_INVOCATION_FAILED (500)** — two causes:
  1. Legacy `builds` in `vercel.json` **ignored `buildCommand`**, so `dist/` (gitignored) was never built on GitHub/Vercel deploys
  2. `api/index.js` needed ESM + explicit `(req, res) => app(req, res)` handler (not bare `module.exports = app`)
- Migrated `vercel.json` to modern config: `buildCommand`, `functions.includeFiles`, `rewrites` (no legacy `builds`)

#### GitHub
- Initialized git repo locally and pushed full codebase to: **https://github.com/huabichnhu03-oss/Quiet-Circle**
- Git safe-directory fix for `H:/moodmind-source` on Windows: `git config --global --add safe.directory H:/moodmind-source`

#### Auth (replaced password + Google)
- **Removed** email/password login UI and `/api/auth/register`, `/api/auth/login`
- **Added** Resend magic-link auth:
  - `POST /api/auth/magic-link` — sends sign-in email
  - `GET /api/auth/verify?token=...` — verifies link, returns user info
  - `server/auth.ts` — token generation/consumption, in-memory user store
  - `server/email.ts` — Resend integration; logs link to console if `RESEND_API_KEY` missing
- Login page (`/login`) now: enter email → “Email me a sign-in link”
- Auth verify page (`/auth/verify`) already wired to magic-link flow
- Profile sign-out now clears `user_email` and `user_name` from localStorage
- **No Google OAuth or Python backend needed for sign-in**

#### Verified locally
- `npm run check` — passes
- `npm run build` — passes
- Production server serves `text/html` on `/` and JSON on `/api/*`

### ⚠️ Deploy status

- **Live and working:** https://quiet-circle.vercel.app (homepage + `/api/mood-entries` return 200)
- **CLI project preview:** https://quiet-circle-gamma.vercel.app — same codebase, redeployed via Vercel CLI
- Latest commit on GitHub: `7e6a1d4` — auth refactor + DatabaseStorage + Vercel bundle fixes
- Vercel env vars needed for auth emails: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `APP_URL=https://quiet-circle.vercel.app`
- Optional persistence: `DATABASE_URL` (Neon/Supabase) + run `npm run db:push`
- **Dashboard settings:** Framework = Other, Output Directory = `dist/public`, Node.js = 20.x

### ✅ Recently completed (2026-06-20)

- **Auth refactor deployed:** email/password sign-up + 6-digit verification code (replaces magic-link)
  - `POST /api/auth/register`, `/login`, `/verify-email`, `/resend-code`
  - `Login.tsx`, `VerifyEmail.tsx` wired
- **DatabaseStorage** — mood/journal/contacts/posts persist when `DATABASE_URL` is set
- **Vercel bundle fix:** build outputs to `api/_server/`, bundled via `includeFiles`, static copy to `dist/public`

### 🔴 Not done yet — priority for next agent

#### HIGH — production blockers
1. ~~**Wire PostgreSQL storage**~~ — `DatabaseStorage` done; run `npm run db:push` against Neon and set `DATABASE_URL` on Vercel
2. ~~**Persist auth users**~~ — auth uses `users` table when `DATABASE_URL` is set (verification codes still in-memory until sessions wired)
3. **Server-side sessions** — `express-session` + `connect-pg-simple` not wired yet; auth state only in `localStorage`
4. ~~**Confirm Vercel deploy works end-to-end**~~ — https://quiet-circle-gamma.vercel.app confirmed live with new auth
5. **Redeploy `quiet-circle.vercel.app`** — this URL is owned by a *separate* older Vercel project (cannot alias from CLI). User must open Vercel dashboard → find project with `quiet-circle.vercel.app` → Redeploy from GitHub `main` (commit `7e6a1d4`), or delete old project and use `quiet-circle-gamma.vercel.app`

#### MEDIUM — UX / features
5. **Profile shows hardcoded name** “Chiara Advani” — should read from `localStorage` (`user_name`, `user_email`)
6. **Edit / delete journal entries** — no API routes or UI yet
7. **Community likes/comments/saves** — counts displayed but not persisted
8. **Personalise Home dashboard** from onboarding answers in localStorage
9. **AI Chat backend** — UI uses keyword matching only; no LLM API connected
10. **Emergency SOS** — UI-only `setTimeout`; no real notifications to contacts
11. **Mood bubble animations** — spring physics not fully implemented
12. **Screen transition animations** — Framer Motion installed but not used for route transitions

#### LOW / cleanup
13. Remove unused `@react-oauth/google` dependency if Google sign-in is permanently dropped
14. Login title was “MindSpace” in old version — now “MoodMind” (verify consistency across app)
15. Client JS bundle ~780 KB — consider code splitting
16. `resend` package in lockfile was previously pointing at Replit registry — fixed locally; verify on fresh clone

---

## Screens & Features Implemented

### Auth & Onboarding
- **Login (`/login`)** — Email magic-link sign-in (Resend)
- **Onboarding (`/onboarding`)** — Multi-step new user setup flow
- **Auth Verify (`/auth/verify`)** — Magic-link token verification

### Main App (Bottom Navigation)
- **Home (`/`)** — Dashboard with weekly mood summary, Today's Plan, Relax Mode, Milestones, SOS, AI Chat FAB
- **Journals (`/journals`)** — Journal entry list with mood indicators
- **Community (`/community`)** — Social feed with tabs, search, create post
- **Contacts / Safety (`/contacts`)** — Emergency contact manager
- **Profile (`/profile`)** — User info, settings, sign-out button

### Side Drawer Navigation
- Check-In, Breathe, Journals, Entries, Insights, Profile

### Standalone Screens
- **Check-In (`/checkin`)** — Mood bubble selector
- **Breathe (`/breathe`)** — Box-breathing exercise (4-4-6-2)
- **Entries (`/entries`)** — Mood & journal history
- **Insights (`/insights`)** — 7-day mood chart and stats
- **New Journal Entry (`/journals/new`)** — Journal form with mood tagging
- **New Post (`/community/new`)** — Community post form
- **Community Post Detail (`/community/:id`)** — Post detail view
- **Add Contact (`/contacts/new`)** — Add emergency contact
- **Emergency (`/emergency`)** — SOS screen (UI only)
- **Crisis (`/crisis`)** — Crisis hotlines
- **Resources (`/resources`)** — Resource links
- **AI Chat (`/ai-chat`)** — Keyword-based wellness triage (no LLM)

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/mood-entries` | List mood entries |
| POST | `/api/mood-entries` | Create mood entry |
| GET | `/api/journal-entries` | List journal entries |
| POST | `/api/journal-entries` | Create journal entry |
| GET | `/api/contacts` | List contacts |
| POST | `/api/contacts` | Create contact |
| GET | `/api/community-posts` | List community posts |
| GET | `/api/community-posts/:id` | Get single post |
| POST | `/api/community-posts` | Create community post |
| POST | `/api/auth/magic-link` | Send sign-in email via Resend |
| GET | `/api/auth/verify?token=...` | Verify magic link, return user info |

**Removed:** `POST /api/auth/register`, `POST /api/auth/login` (replaced by magic-link flow)

---

## Environment Variables

See `.env.example`. Required for deployment:

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes (prod) | Resend API key for magic-link emails. Without it, links print to server console (dev only). |
| `RESEND_FROM_EMAIL` | Yes (prod) | Sender, e.g. `MoodMind <onboarding@resend.dev>` for testing |
| `APP_URL` | Yes (prod) | Public URL for email links, e.g. `https://your-project.vercel.app` |
| `DATABASE_URL` | For persistence | PostgreSQL connection string (Neon/Supabase recommended for Vercel) |
| `SESSION_SECRET` | For sessions | Random hex string — needed once express-session is wired |

**No longer needed:** `VITE_GOOGLE_CLIENT_ID` (Google OAuth not used)

### Resend setup notes
- Free testing: use `onboarding@resend.dev` as sender — only sends to the email you used to sign up for Resend
- Production: verify your own domain in Resend dashboard

---

## Vercel Deployment

### Architecture
```
Browser → Vercel → api/index.js → dist/index.cjs (Express)
                                  ├── /api/* routes
                                  └── dist/public/ (React SPA)
```

### Key files
| File | Purpose |
|------|---------|
| `vercel.json` | Build config, routes all traffic to `api/index.js` |
| `api/index.js` | Vercel serverless entry — ESM handler that loads `dist/index.cjs` |
| `script/build.ts` | Builds client (`dist/public/`) + server (`dist/index.cjs`) |
| `server/index.ts` | Express app; sync init in production for Vercel |
| `server/static.ts` | Serves `dist/public/` in production |

### Deploy steps
1. Push to GitHub: https://github.com/huabichnhu03-oss/Quiet-Circle
2. Import/connect repo in Vercel
3. Set env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `APP_URL`
4. Clear **Output Directory** in Vercel settings
5. Redeploy after setting `APP_URL` to the actual Vercel URL

### Known Vercel limitations
- In-memory data resets on cold starts until PostgreSQL is wired
- WebSockets / real-time SOS not supported on serverless
- Function timeout: 10s (Hobby) / 60s (Pro)

---

## Local Setup

### Prerequisites
- Node.js 20.x
- PostgreSQL (optional until `DatabaseStorage` is implemented)

### Steps

```bash
npm install
cp .env.example .env   # fill in RESEND_API_KEY, APP_URL, etc.
npm run dev            # http://localhost:5000
```

### Useful commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server (Express + Vite HMR) |
| `npm run check` | TypeScript check |
| `npm run build` | Production build → `dist/` |
| `npm start` | Run production build locally |
| `npm run db:push` | Sync Drizzle schema to PostgreSQL |

### Windows notes
- If git says “dubious ownership” on `H:` drive: `git config --global --add safe.directory H:/moodmind-source`
- Do **not** drag-and-drop upload to GitHub — it skipped subfolders (`api/`, `client/`, `server/`). Use git push instead.

---

## Directory Structure

```
.
├── api/
│   └── index.js           # Vercel serverless entry point (ESM handler)
├── client/                # React frontend (Vite)
│   └── src/
│       ├── pages/         # One file per screen/route
│       ├── components/    # Layout, NavDrawer, Icons, ui/
│       ├── hooks/
│       └── lib/           # queryClient, utils
├── server/
│   ├── index.ts           # Express entry (exports default app)
│   ├── routes.ts          # API route handlers
│   ├── auth.ts            # Magic-link tokens + in-memory users
│   ├── email.ts           # Resend email sender
│   ├── storage.ts         # IStorage + MemStorage
│   └── static.ts          # Serves dist/public/ in production
├── shared/
│   └── schema.ts          # Drizzle tables, Zod schemas, TS types
├── script/
│   └── build.ts           # esbuild + Vite build
├── vercel.json
├── progress.md            # This file
└── .env.example
```

---

## Where the next agent should start

1. Run `npm run check` and `npm run build` — both should pass
2. **Confirm live Vercel deploy** — login page loads at `*.vercel.app`, not a file download
3. Set Vercel env vars if not done: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `APP_URL`
4. **Top priority:** implement `DatabaseStorage` in `server/storage.ts` + persist auth users in PostgreSQL
5. Then wire `express-session` with `connect-pg-simple`

Everything else (UX polish, AI chat, SOS notifications) depends on persistence being in place first.
