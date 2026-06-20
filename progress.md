# MoodMind (Quiet Circle) — Project Progress

> **Last updated:** 2026-06-20  
> **GitHub:** https://github.com/huabichnhu03-oss/Quiet-Circle  
> **Production URL:** https://www.quiet-circle.app  
> **Vercel project:** `quiet-circle` (alias: https://quiet-circle-gamma.vercel.app)

This file is the **single source of truth**. `AGENT_HANDOFF.md` and `NEXT_STEPS.md` are short pointers only.

---

## What is this app?

MoodMind (Quiet Circle) is a mobile-first mental wellness companion for LGBTQ+ communities: mood tracking, journaling, guided breathing, community, crisis resources, and AI-assisted wellness support.

---

## Tech stack (current)

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TanStack Query, Wouter, Framer Motion |
| UI | shadcn/ui, Radix, Tailwind CSS v3 |
| Backend | Node.js, Express v5, TypeScript |
| Database | PostgreSQL via Drizzle ORM — `DatabaseStorage` when `DATABASE_URL` is set, else `MemStorage` |
| Auth | **Clerk** (`@clerk/react` + `@clerk/express`) |
| Deployment | Vercel serverless: `api/index.js` → `api/_server/index.cjs` |

---

## Deploy status

| URL | Status |
|-----|--------|
| https://quiet-circle-gamma.vercel.app | **Working** — `/login` and `/api/health/clerk` return 200 |
| https://www.quiet-circle.app | **Partial** — homepage 200, `/login` and `/api/*` return 500 |

**Root cause:** `quiet-circle.app` is registered on a **different Vercel account/team** than `huabichnhu03-oss-projects`. DNS points at an old/broken deployment, not the `quiet-circle` project.

**Fix (manual — requires domain owner):**

1. Log into the Vercel account that owns `quiet-circle.app`
2. Remove the domain from any old project serving this app
3. In `huabichnhu03-oss-projects` → **quiet-circle** → **Settings → Domains**, add `quiet-circle.app` and `www.quiet-circle.app`
4. In **Clerk Production**, add redirect URLs for `https://www.quiet-circle.app` and `/login`, `/sign-up`
5. Redeploy `quiet-circle` (or push to `main`)

The duplicate **`moodmind-source`** Vercel project was deleted (2026-06-20).

---

## Vercel configuration

### Environment variables (Production)

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key — **must** be set at build time for the client |
| `CLERK_SECRET_KEY` | Yes | Clerk secret — API auth via `@clerk/express` |
| `APP_URL` | Yes | `https://www.quiet-circle.app` |
| `DATABASE_URL` | Optional | PostgreSQL — enables `DatabaseStorage` |
| `SESSION_SECRET` | Future | Not used yet (Clerk handles sessions) |

**Do not set:** `RESEND_*`, `VITE_GOOGLE_CLIENT_ID` — legacy auth removed.

### Build settings

Defined in `vercel.json` — do not override in the dashboard:

- **Build command:** `npm run build`
- **Output directory:** `dist/public`
- **Install command:** `npm install`
- **Framework:** Other

### Architecture

```
Browser → Vercel rewrite → api/index.js → api/_server/index.cjs (Express)
                                            ├── /api/* routes
                                            └── api/_server/public/ (React SPA)
```

Build copies static assets to `dist/public` for Vercel's CDN check; runtime serves from `api/_server/public/`.

### Key files

| File | Purpose |
|------|---------|
| `vercel.json` | Build + rewrites + `includeFiles` for server bundle |
| `api/index.js` | ESM serverless entry |
| `api/_server/index.cjs` | Bundled Express app (gitignored, built on deploy) |
| `script/build.ts` | esbuild server + Vite client |
| `server/index.ts` | Express app; sync init in production for Vercel |
| `server/clerk-auth.ts` | `requireApiAuth`, health check |
| `server/storage.ts` | `MemStorage` / `DatabaseStorage` |

---

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health/clerk` | No | Clerk config health check |
| GET | `/api/auth/me` | Clerk | Current user profile |
| GET/POST | `/api/mood-entries` | Clerk | Mood entries |
| GET/POST | `/api/journal-entries` | Clerk | Journal entries |
| GET/POST | `/api/contacts` | Clerk | Emergency contacts |
| GET/POST | `/api/community-posts` | Mixed | Community feed |

**Removed (legacy):** Resend magic-link, email/password register/login, Google OAuth routes.

---

## Local setup

```bash
npm install
cp .env.example .env   # VITE_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY
npm run dev            # http://localhost:5000
```

| Command | Purpose |
|---------|---------|
| `npm run check` | TypeScript check |
| `npm run build` | Production build |
| `npm start` | Run `api/_server/index.cjs` locally |
| `npm run db:push` | Sync Drizzle schema to PostgreSQL |

---

## Open backlog (real gaps only)

### High

1. **Attach custom domain to `quiet-circle` Vercel project** — see Deploy status above
2. **Clerk production keys** — swap `pk_test_` / `sk_test_` for `pk_live_` / `sk_live_` on Vercel Production to remove "Development mode" badge
3. **Set `DATABASE_URL` on Vercel** + run `npm run db:push` against production DB for persistent wellness data

### Medium (features)

4. Edit/delete journal entries
5. Community likes, comments, saves (persisted)
6. Personalise Home dashboard from onboarding answers
7. AI Chat backend (LLM API)
8. Emergency SOS — real notifications to contacts

### Low (polish)

9. Mood bubble / screen transition animations
10. Client bundle code splitting (~780 KB)
11. Update `index.html` meta title/description from generic "App"

---

## Directory structure

```
.
├── api/
│   ├── index.js              # Vercel serverless entry (ESM)
│   └── _server/              # Built output (gitignored)
│       ├── index.cjs         # Bundled Express server
│       └── public/           # Vite client build
├── client/src/               # React app
├── server/                   # Express routes, Clerk auth, storage
├── shared/schema.ts          # Drizzle tables + Zod schemas
├── script/build.ts           # Production build
├── vercel.json
└── progress.md               # This file
```

---

## Session history (abbreviated)

Earlier sessions fixed: Replit registry lockfile issues, Vercel `builds` vs `buildCommand`, serverless 500s, auth migration Resend → email/password → **Clerk**, `DatabaseStorage`, bundle output to `api/_server/`.

Do not re-implement removed auth paths unless explicitly requested.
