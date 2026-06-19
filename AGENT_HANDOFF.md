# MoodMind — Agent Handoff

> **Single source of truth.** See `progress.md` for a detailed feature-complete list and `NEXT_STEPS.md` for additional context. This file is the definitive handoff document.

---

## App Overview

**MoodMind** is a mobile-first mental wellness progressive web app (PWA) built for LGBTQ+ communities. It provides mood tracking, journaling, guided breathing, community connection, crisis resources, and AI-assisted wellness support — all in a safe, affirming space.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TanStack Query v5, Wouter (routing), Framer Motion |
| UI | shadcn/ui, Radix UI primitives, Tailwind CSS v3, Lucide icons |
| Backend | Node.js, Express v5, TypeScript |
| Database | PostgreSQL (Drizzle ORM + drizzle-zod) — schema defined, in-memory store used at runtime |
| Auth | Custom email/password (PBKDF2), Google OAuth via `@react-oauth/google` |
| Sessions | `express-session` + `memorystore` (dev) / `connect-pg-simple` (prod-ready) |
| Build | esbuild (server → `dist/index.cjs`), Vite (client → `dist/public/`) |

---

## All Screens / Routes

| Path | Screen | Description |
|------|--------|-------------|
| `/login` | Login | Email/password + Google OAuth sign-in |
| `/onboarding` | Onboarding | Multi-step new-user setup flow |
| `/auth/verify` | Auth Verify | OTP / verification step |
| `/` | Home | Dashboard: weekly mood summary, Today's Plan, Relax Mode, Milestones, SOS button, AI Chat FAB |
| `/checkin` | Check-In | Interactive mood bubble selector |
| `/breathe` | Breathe | Guided box-breathing exercise (4-4-6-2) with pulsing visual |
| `/journals` | Journals | List of journal entries with mood indicators |
| `/journals/new` | New Journal Entry | Rich journal writing form with mood tagging |
| `/entries` | Entries | Historical mood & journal entry log |
| `/insights` | Insights | 7-day mood trend chart, average score, mood breakdown |
| `/community` | Community | Social feed with tabs by community group; search; create post |
| `/community/new` | New Post | Community post creation form |
| `/community/:id` | Post Detail | Full post view with replies |
| `/contacts` | Contacts / Safety | Emergency contact manager |
| `/contacts/new` | Add Contact | Form to add emergency contacts |
| `/profile` | Profile | User info, settings, avatar |
| `/emergency` | Emergency | High-priority SOS / Live Emergency screen |
| `/crisis` | Crisis | Crisis hotlines and immediate resources |
| `/resources` | Resources | Mental health education and resource links |
| `/ai-chat` | AI Chat | Wellness Consultant chat interface |

---

## All API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/mood-entries` | List all mood entries |
| POST | `/api/mood-entries` | Create a mood entry |
| GET | `/api/journal-entries` | List all journal entries |
| POST | `/api/journal-entries` | Create a journal entry |
| GET | `/api/contacts` | List emergency contacts |
| POST | `/api/contacts` | Create an emergency contact |
| GET | `/api/community-posts` | List community posts |
| GET | `/api/community-posts/:id` | Get a single community post |
| POST | `/api/community-posts` | Create a community post |
| POST | `/api/auth/register` | Register a new account |
| POST | `/api/auth/login` | Sign in with email + password |

---

## Architecture Notes

- **Single port**: Express serves both the API and the Vite-built static files on port 5000. `dist/index.cjs` is the compiled server entry point; `dist/public/` holds the compiled client.
- **IStorage pattern**: All data access goes through the `IStorage` interface in `server/storage.ts`. Currently backed by `MemStorage` (in-memory). Replace with `DatabaseStorage` using Drizzle + pg for persistence.
- **In-memory auth store**: `server/routes.ts` keeps a `Map<string, StoredUser>` for email/password auth. Intentionally temporary — replace with database-backed users when wiring PostgreSQL.
- **Drizzle schema is the single source of truth**: All TypeScript types for database models are inferred from `shared/schema.ts`. Never define model types elsewhere.
- **Google Client ID is public**: `VITE_GOOGLE_CLIENT_ID` is safe to expose in the frontend bundle. The backend token verification step is not yet implemented.
- **Vercel export**: `server/index.ts` exports the Express `app` as its default export. The `listen()` call is guarded by `if (!process.env.VERCEL)` so it only fires outside serverless environments. `api/index.js` is the thin wrapper Vercel uses as the actual serverless function entry — it loads `dist/index.cjs` (the pre-built server) at runtime via a dynamic `require` path so ncc does not re-bundle it.

---

## Required Environment Variables

| Variable | Purpose | How to get it |
|----------|---------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | Provision a database on [Neon](https://neon.tech) or [Supabase](https://supabase.com) and copy the connection string |
| `SESSION_SECRET` | Signs express-session cookies | Run `openssl rand -hex 32` and paste the output |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (public) | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client IDs |

Copy `.env.example` to `.env` and fill in your values before running locally.

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env

# 3. Push Drizzle schema to your database (creates/syncs tables)
npm run db:push

# 4. Start the dev server (Express + Vite HMR on http://localhost:5000)
npm run dev
```

### Useful scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (port 5000) |
| `npm run check` | TypeScript type-check (must pass clean) |
| `npm run build` | Production build → `dist/` |
| `npm start` | Run production build locally |
| `npm run db:push` | Sync Drizzle schema to the database |

---

## Vercel Deployment Guide

### Prerequisites
- The codebase pushed to a GitHub (or GitLab / Bitbucket) repository.
- A serverless-compatible PostgreSQL database (recommended: [Neon](https://neon.tech) — free tier, HTTP-mode connections).

### Step-by-step

1. **Push repo to GitHub**
   ```bash
   git push origin main
   ```

2. **Import the project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository and click **Import**

3. **Configure the build settings** (Vercel usually auto-detects, but verify):
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

4. **Add environment variables** in the Vercel dashboard (Project → Settings → Environment Variables):
   - `DATABASE_URL` — use a Neon or Supabase connection string (serverless/HTTP mode works best on Vercel)
   - `SESSION_SECRET` — random hex string (`openssl rand -hex 32`)
   - `VITE_GOOGLE_CLIENT_ID` — your Google OAuth client ID

5. **Push schema to production database** (run once from your local machine, pointing at the production `DATABASE_URL`):
   ```bash
   DATABASE_URL=<your-production-url> npm run db:push
   ```

6. **Deploy** — click **Deploy** in the Vercel dashboard, or push a new commit to trigger a deployment.

The `vercel.json` at the project root routes all traffic through `dist/index.cjs` using `@vercel/node`.

---

## Known Limitations on Vercel

| Limitation | Detail | Workaround |
|------------|--------|-----------|
| **WebSockets / real-time SOS** | Vercel serverless functions do not support persistent WebSocket connections. The Emergency screen's real-time notification feature will not work. | Use [Pusher](https://pusher.com) or [Ably](https://ably.com) for real-time events |
| **In-memory data** | `MemStorage` is reset on every cold start. Wire `DatabaseStorage` before deploying to production. | Implement `DatabaseStorage` in `server/storage.ts` |
| **Function timeout** | Serverless functions time out after 10 s (Hobby) / 60 s (Pro). Long-running AI Chat requests may hit this. | Stream responses or upgrade the Vercel plan |
| **Session persistence** | `memorystore` sessions are lost between cold starts. Wire `connect-pg-simple` for durable sessions. | See open task: Server-side sessions |

---

## Prioritised Open Backlog

### HIGH — core functionality gaps

1. **Wire PostgreSQL storage** — Create `DatabaseStorage` in `server/storage.ts` implementing `IStorage` with Drizzle + pg. Replace the `MemStorage` export. Everything downstream (persistent mood data, sessions, auth) depends on this.
2. **Server-side sessions** — Connect `express-session` with `connect-pg-simple` so login state survives page refreshes. Auth state currently lives only in `localStorage`.
3. **Sign-out and account switching** — Wire the Profile screen sign-out button to clear the session/localStorage and redirect to `/login`.
4. **Edit and delete journal entries** — Add `PATCH /api/journal-entries/:id` and `DELETE /api/journal-entries/:id` routes + storage methods; build the UI on the Journals screen.

### MEDIUM — UX improvements

5. **Personalise Home dashboard** — Use answers from the Onboarding flow (stored in `localStorage`) to customise the greeting, task list, and suggestions on the Home screen.
6. **Animate mood bubbles** — Add spring/physics-based animation (Framer Motion) to the Check-In bubble selector.
7. **Screen transition animations** — Implement slide-in transitions between screens (Framer Motion is already installed).
8. **Community interactions (likes, comments, saves)** — Add `POST /api/community-posts/:id/like` and `/save` endpoints; persist counts in the database; show them on feed cards and the post detail screen.
9. **Make Breathe screen accessible from main navigation** — Add it to the bottom nav or add a prominent home-screen shortcut.

### FUTURE

10. **Enhanced emergency screen + real-time SOS notifications** — WebSocket or push notification (Pusher / Ably) to trusted contacts when SOS is triggered.
11. **Card illustration polish** — Apply the flat-illustration + larger-headline card layout consistently across Journals, Entries, Insights, and Community screens.

---

## Where to Start

Run `npm run check` first to confirm TypeScript is clean (zero errors expected).

Then tackle **#1 — Wire PostgreSQL storage** (`server/storage.ts`). Create a `DatabaseStorage` class that implements `IStorage` using Drizzle ORM and the `pg` driver, swap the `MemStorage` export, set `DATABASE_URL`, and run `npm run db:push`. Every other persistence task (sessions, mood data, auth, community interactions) depends on this being in place.
