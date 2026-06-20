# CAUTION — read before every GitHub push

> **Agents:** Open this file and complete the checklist below **before** `git push` (especially to `main`).
> Local `.env` changes do **not** deploy by themselves — but code/env docs you commit can.

---

## Local dev vs live site (Clerk keys)

| Environment | Publishable key | Secret key | Where it lives |
|-------------|-----------------|------------|----------------|
| **Local** (`localhost:5000`) | `pk_test_…` | `sk_test_…` | Your machine only — `.env` (gitignored) |
| **Production** (`quiet-circle.app`) | `pk_live_…` | `sk_live_…` | **Vercel** project `quiet-circle` → Environment Variables |

**Rules:**

1. **`pk_live_` / `sk_live_` only work on `quiet-circle.app`** — they will break local preview on `localhost`.
2. **Local `.env` must use test keys** for `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
3. **Do not overwrite live keys in Vercel** with test keys. Production stays on `pk_live_` / `sk_live_`.
4. **Optional backup in local `.env`:** store production keys under `*_LIVE` names (e.g. `CLERK_SECRET_KEY_LIVE`). The app does **not** read those — they are reference-only on your machine.
5. **Never commit** `.env`, live secrets, or `sk_*` keys to GitHub.

Changing local `.env` to test keys **does not affect the live site**. The live site uses Vercel env vars at build/deploy time, not your local file.

---

## Pre-push checklist

Run through this before `git push origin main` (or any branch that triggers deploy):

- [ ] `git status` — **`.env` is not staged** (must stay gitignored)
- [ ] `git diff` — no `pk_live_`, `sk_live_`, `sk_test_`, database passwords, or `DATABASE_URL` in tracked files
- [ ] You did **not** change Vercel Production env vars to test keys
- [ ] You did **not** add live Clerk keys to `.env.example`, `README.md`, or other committed docs
- [ ] `npm run check` and `npm run build` pass (see `AGENT_HANDOFF.md`)

If anything secret was committed by mistake: **do not push** — revert the commit and rotate the exposed key in Clerk / Neon.

---

## What actually updates production

| Action | Affects live site? |
|--------|-------------------|
| Edit local `.env` only | **No** |
| Push code to `main` (GitHub → Vercel) | **Yes** — new build/deploy |
| Change env vars in Vercel dashboard | **Yes** — next deploy |
| `vercel deploy` (only if user asks) | **Yes** |

Default deploy path: commit → `git push origin main` → Vercel auto-deploy. See `AGENT_HANDOFF.md`.

---

## Related docs

- `AGENT_HANDOFF.md` — deploy workflow and required Vercel vars
- `checklist.md` — launch checklist (you + agent)
- `.env.example` — safe template (placeholders only)
