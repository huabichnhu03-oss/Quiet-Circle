# Agent Handoff

> **Read `progress.md` first.** It is the single source of truth for stack, deployment, env vars, and backlog.

## Quick facts

- **App:** MoodMind / Quiet Circle — mental wellness PWA for LGBTQ+ communities
- **Auth:** Clerk (not Resend, not email/password, not Google OAuth)
- **Vercel project:** `quiet-circle` only — do not create `moodmind-source` or other duplicates
- **Production URL:** https://www.quiet-circle.app (domain must be attached to `quiet-circle` project)
- **Working preview:** https://quiet-circle-gamma.vercel.app

## Before you change anything

```bash
npm run check
npm run build
```

## Required env vars

| Variable | Notes |
|----------|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Required at **build** time on Vercel |
| `CLERK_SECRET_KEY` | Server-side Clerk middleware |
| `APP_URL` | `https://www.quiet-circle.app` |
| `DATABASE_URL` | Optional — enables PostgreSQL persistence |

## Common mistakes (from stale docs)

- Do **not** add `RESEND_API_KEY` or `VITE_GOOGLE_CLIENT_ID`
- Do **not** reference `dist/index.cjs` — server builds to `api/_server/index.cjs`
- Do **not** clear Output Directory in Vercel dashboard — `vercel.json` sets `dist/public`
- Do **not** wire `express-session` — Clerk owns auth state

## Where to start

See the **Open backlog** section in `progress.md`. Top priority: custom domain on the correct Vercel project.
