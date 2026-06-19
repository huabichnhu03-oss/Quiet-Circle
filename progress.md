# MoodMind — Project Progress

## What is this app?

MoodMind is a mobile-first mental wellness companion web app designed for LGBTQ+ communities. It provides mood tracking, journaling, guided breathing, community connection, crisis resources, and AI-assisted wellness support — all in a safe, affirming space.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TanStack Query v5, Wouter (routing), Framer Motion |
| UI | shadcn/ui, Radix UI primitives, Tailwind CSS v3, Lucide icons |
| Backend | Node.js, Express v5, TypeScript, tsx |
| Database | PostgreSQL 16 (Drizzle ORM + drizzle-zod) — schema defined, in-memory store used at runtime |
| Auth | Custom email/password (PBKDF2), Google OAuth via `@react-oauth/google` |
| Sessions | `express-session` + `memorystore` (dev) / `connect-pg-simple` (prod) |
| Build | esbuild (server), Vite (client) |

---

## Screens & Features Implemented

### Auth & Onboarding
- **Login (`/login`)** — Email/password sign-in, Google OAuth sign-in button
- **Onboarding (`/onboarding`)** — Multi-step new user setup flow (preferences, community selection)
- **Auth Verify (`/auth/verify`)** — Verification/OTP step

### Main App (Bottom Navigation)
- **Home (`/`)** — Dashboard with weekly mood summary, Today's Plan checklist, Relax Mode audio player, Milestones tracker, SOS button, AI Chat FAB
- **Journals (`/journals`)** — List of journal entries with mood indicators
- **Community (`/community`)** — Social feed with tabs by community group; search; create post
- **Contacts / Safety (`/contacts`)** — Emergency contact manager (primary + secondary contacts)
- **Profile (`/profile`)** — User info, settings, avatar

### Side Drawer Navigation
- Check-In, Breathe, Journals, Entries, Insights, Profile

### Standalone Screens
- **Check-In (`/checkin`)** — Interactive mood bubble selector (Sadness, Happies, Okay, etc.)
- **Breathe (`/breathe`)** — Guided box-breathing exercise (4-4-6-2) with pulsing visual
- **Entries (`/entries`)** — Historical mood & journal entry log
- **Insights (`/insights`)** — Mood trend line chart (7-day), average score, mood breakdown stats
- **New Journal Entry (`/journals/new`)** — Rich journal writing form with mood tagging
- **New Post (`/community/new`)** — Community post creation form
- **Community Post Detail (`/community/:id`)** — Full post view with replies
- **Add Contact (`/contacts/new`)** — Form to add emergency contacts
- **Emergency (`/emergency`)** — High-priority SOS / Live Emergency screen
- **Crisis (`/crisis`)** — Crisis hotlines and immediate resources
- **Resources (`/resources`)** — Mental health education and resource links
- **AI Chat (`/ai-chat`)** — Wellness Consultant chat interface

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/mood-entries` | List all mood entries |
| POST | `/api/mood-entries` | Create mood entry |
| GET | `/api/journal-entries` | List all journal entries |
| POST | `/api/journal-entries` | Create journal entry |
| GET | `/api/contacts` | List contacts |
| POST | `/api/contacts` | Create contact |
| GET | `/api/community-posts` | List community posts |
| GET | `/api/community-posts/:id` | Get single post |
| POST | `/api/community-posts` | Create community post |
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Sign in |

---

## Known Gaps / In-Progress

- **Data persistence**: The server uses an in-memory store (`MemStorage`). Data is lost on restart. The PostgreSQL schema (`shared/schema.ts`) and Drizzle config are ready — `npm run db:push` will create tables, but a `DatabaseStorage` class needs to be wired in.
- **Auth sessions**: Login state is stored in `localStorage` only (no server-side session). A proper session middleware flow needs connecting.
- **Mood bubble animations**: Bubble animations are partially implemented; full liveness (spring physics) is an open task.
- **Edit / delete journal entries**: Not yet implemented.
- **Real-time SOS notifications**: Emergency screen UI exists; real-time push/WebSocket not wired.
- **Community interactions**: Like/comment/save counts shown but mutations not persisted.
- **Screen transition animations**: Slide-in transitions not yet implemented.
- **Sign-out / account switching**: Profile screen UI present; sign-out logic not fully connected.
- **Personalised Home dashboard**: Onboarding answers not yet used to personalise the dashboard.
- **AI Chat**: UI implemented; no LLM backend connected.

---

## Required Environment Variables

See `.env.example` for a full list. You **must** supply these before running locally:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://user:pass@host:5432/dbname`) |
| `SESSION_SECRET` | Random string used to sign express-session cookies (generate with `openssl rand -hex 32`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID — public, safe to commit (already set in `.replit` for Replit) |

---

## Local Setup & Run Instructions (Cursor / VS Code)

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (local or remote)

### Steps

```bash
# 1. Clone / open the project in Cursor

# 2. Install dependencies
npm install

# 3. Copy the env example and fill in your values
cp .env.example .env
# Edit .env: set DATABASE_URL and SESSION_SECRET

# 4. Push the database schema (creates tables)
npm run db:push

# 5. Start the dev server (Express + Vite on port 5000)
npm run dev
```

Open http://localhost:5000 in your browser.

### Build for production

```bash
npm run build   # outputs dist/index.cjs (server) + dist/public/ (client)
npm start       # runs the production build
```

---

## Directory Structure

```
.
├── client/              # React frontend (Vite)
│   └── src/
│       ├── pages/       # One file per screen/route
│       ├── components/  # Layout, NavDrawer, Icons, Illustrations, shadcn/ui
│       ├── hooks/       # Custom React hooks
│       └── lib/         # queryClient, utils
├── server/              # Express backend
│   ├── index.ts         # Entry point
│   ├── routes.ts        # API route handlers
│   ├── storage.ts       # IStorage interface + MemStorage implementation
│   └── static.ts        # Production static file serving
├── shared/
│   └── schema.ts        # Drizzle table defs, Zod insert schemas, TS types
├── script/
│   └── build.ts         # esbuild + Vite production build script
├── scripts/
│   └── post-merge.sh    # Replit post-merge hook
├── progress.md          # This file
├── NEXT_STEPS.md        # Handoff guide for next developer/agent
└── .env.example         # Environment variable template
```
