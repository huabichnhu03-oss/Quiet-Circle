# MoodMind — Handoff Guide for Next Developer / Agent

## Quick Overview

MoodMind is a mobile-first mental wellness web app for LGBTQ+ communities. It is a full-stack TypeScript application: **React + Vite** frontend, **Express** backend, **Drizzle ORM** with **PostgreSQL**. The app runs as a single server (port 5000) that serves both the API (`/api/*`) and the Vite-built client.

---

## Codebase Structure

```
client/src/pages/       All screens — one file per route
client/src/components/  Layout.tsx, NavDrawer.tsx, Icons.tsx, Illustrations.tsx, ui/ (shadcn)
client/src/hooks/       Custom React hooks (e.g. use-toast)
client/src/lib/         queryClient.ts (TanStack Query setup + apiRequest helper), utils.ts
server/index.ts         Express app entry point
server/routes.ts        All API route handlers (thin — delegate to storage)
server/storage.ts       IStorage interface + MemStorage (in-memory) implementation
server/static.ts        Serves dist/public/ in production
shared/schema.ts        Single source of truth: Drizzle table defs + Zod schemas + TS types
script/build.ts         Production build (esbuild server + Vite client)
```

Key conventions:
- All shared types live in `shared/schema.ts` — never duplicate them.
- Frontend queries use TanStack Query with the pre-configured `queryClient`; mutations use `apiRequest` from `@/lib/queryClient`.
- Use `wouter` (not React Router) for all routing; new pages go in `client/src/pages/` and are registered in `client/src/App.tsx`.
- shadcn/ui components live in `client/src/components/ui/`. Install new ones with `npx shadcn@latest add <component>`.

---

## Environment Setup (first time)

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env
#   → Set DATABASE_URL (PostgreSQL connection string)
#   → Set SESSION_SECRET (random string, e.g. openssl rand -hex 32)
#   → Set VITE_GOOGLE_CLIENT_ID (Google OAuth client ID)

# 3. Push Drizzle schema to your database (creates/syncs tables)
npm run db:push

# 4. Start dev server (Express + Vite HMR on http://localhost:5000)
npm run dev
```

### Useful scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (port 5000) |
| `npm run check` | TypeScript type-check (must pass clean) |
| `npm run build` | Production build → `dist/` |
| `npm start` | Run production build |
| `npm run db:push` | Sync Drizzle schema to database |

---

## What Is Already Implemented

See `progress.md` for the full list. Summary:

- All screens/pages are built (18+ routes, see `client/src/App.tsx`)
- Full bottom navigation + side drawer navigation
- Mood check-in, journal entries, guided breathing, community feed, emergency/crisis screens
- In-memory CRUD for mood entries, journal entries, contacts, community posts (seeded)
- Email/password auth (PBKDF2, in-memory user store in `server/routes.ts`)
- Google OAuth button (frontend only — token not yet verified server-side)
- Database schema and Drizzle config ready for PostgreSQL

---

## What Is Outstanding (Open Task Backlog)

The following features have been scoped but are not yet implemented. They are listed in rough priority order:

### High priority (core functionality gaps)
1. **Wire up PostgreSQL storage** — Create a `DatabaseStorage` class in `server/storage.ts` that implements `IStorage` using Drizzle + pg. Replace the `MemStorage` export. Requires `DATABASE_URL`.
2. **Server-side sessions** — Connect `express-session` with `connect-pg-simple` so login state survives page refreshes. Currently auth state lives only in `localStorage`.
3. **Save mood data persistently** — The mood check-in flow posts to the API but data is lost on restart (see above).
4. **Edit and delete journal entries** — UI missing; add `PATCH /api/journal-entries/:id` and `DELETE /api/journal-entries/:id` routes + storage methods.
5. **Sign-out and account switching** — Wire the Profile screen sign-out button to clear session/localStorage and redirect to `/login`.

### Medium priority (UX improvements)
6. **Animate mood bubbles** — Add spring/physics-based animation to the Check-In bubble selector.
7. **Screen transition animations** — Implement slide-in transitions between screens (Framer Motion is already installed).
8. **Personalise Home dashboard** — Use answers from the Onboarding flow (stored in localStorage) to customise the dashboard greeting, task list, and suggestions.
9. **Community interactions (likes, comments, saves)** — Add `POST /api/community-posts/:id/like` and `/save` endpoints; persist counts in the database.
10. **Make Breathe screen accessible from main navigation** — Add it to the bottom nav or a prominent home-screen shortcut.

### Lower priority / future
11. **Enhanced emergency screen + real-time SOS notifications** — WebSocket or push notification to trusted contacts when SOS is triggered.
12. **AI Chat backend** — Connect the `/ai-chat` screen to an LLM API (e.g., Google Gemini, already in the esbuild allowlist as `@google/generative-ai`).
13. **Post detail interactions** — Like and save from the community post detail screen; show counts on feed cards.
14. **Google OAuth server-side verification** — Verify the Google ID token on the backend, create/find a user record, and issue a proper session.

---

## Key Architectural Decisions / Notes

- **Single port**: Express serves both the API and the Vite-built static files on port 5000. Do not change the Vite or esbuild config without reading `script/build.ts` and `vite.config.ts`.
- **Drizzle schema is the single source of truth**: All TypeScript types for database models are inferred from `shared/schema.ts`. Never define model types elsewhere.
- **In-memory auth store**: `server/routes.ts` keeps a `Map<string, StoredUser>` for the email/password auth. This is intentionally temporary — replace with database-backed users when wiring PostgreSQL storage.
- **Google Client ID is public**: The `VITE_GOOGLE_CLIENT_ID` value in `.replit` is safe to expose in the frontend bundle. It is not a secret.
- **Tailwind v3 + shadcn/ui**: CSS custom properties for theming are in `client/src/index.css`. The tailwind config is in `tailwind.config.ts`.

---

## Where to Start

If you're a fresh agent picking this up:

1. Read `progress.md` to understand what is built.
2. Run `npm run check` to confirm TypeScript is clean (should be zero errors).
3. Run `npm run dev` to see the app running.
4. Pick the highest-priority item from the backlog above and implement it.
5. The most impactful first task is **wiring PostgreSQL storage** — everything downstream (persistent mood data, sessions, auth) depends on it.
