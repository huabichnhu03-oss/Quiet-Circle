# Agent Handoff

> **Read `progress.md` first.** It is the single source of truth for stack, deployment, env vars, and backlog.

## Quick facts

- **App:** MoodMind / Quiet Circle — mental wellness PWA for LGBTQ+ communities
- **Auth:** Clerk (not Resend, not email/password, not Google OAuth)
- **GitHub:** `huabichnhu03-oss/Quiet-Circle` — branch `main`
- **Production URL:** https://www.quiet-circle.app (Vercel account: `huabichnhu04@gmail.com`)
- **Preview (huabichnhu03 account):** https://quiet-circle-gamma.vercel.app

## Deploy workflow (default — do this)

**Read `CAUTION.md` before every `git push`.** Local `.env` uses test Clerk keys; production uses live keys on Vercel only.

**Do not** run `vercel deploy` unless the user explicitly asks.

1. Complete the pre-push checklist in `CAUTION.md`
2. Commit changes locally
3. `git push origin main`
4. Vercel redeploys automatically from the GitHub integration

The Vercel project connected to `Quiet-Circle` on `main` is what gets the build. Production domain `quiet-circle.app` only updates if **that** project (on `huabichnhu04@gmail.com`) is the one linked to the repo — not the `huabichnhu03-oss` preview project.

## Before you change anything

```bash
npm run check
npm run build
```

## Required env vars

| Variable | Local `.env` | Vercel Production |
|----------|--------------|-------------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_…` | `pk_live_…` (build time) |
| `CLERK_SECRET_KEY` | `sk_test_…` | `sk_live_…` |
| `APP_URL` | `http://localhost:5000` | `https://www.quiet-circle.app` |
| `DATABASE_URL` | Optional | Optional — enables PostgreSQL persistence |

Live keys in local `.env` may be kept as `*_LIVE` backups only — the app does not read them. See `CAUTION.md`.

## Common mistakes (from stale docs)

- Do **not** add `RESEND_API_KEY` or `VITE_GOOGLE_CLIENT_ID`
- Do **not** reference `dist/index.cjs` — server builds to `api/_server/index.cjs`
- Do **not** clear Output Directory in Vercel dashboard — `vercel.json` sets `dist/public`
- Do **not** wire `express-session` — Clerk owns auth state
- Do **not** deploy via Vercel CLI by default — push to GitHub instead

## Where to start

See the **Open backlog** section in `progress.md`.
