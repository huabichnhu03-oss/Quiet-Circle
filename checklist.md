# Quiet Circle — Launch checklist

> **Last updated:** 2026-06-20  
> Split into **Agent** (code) and **You** (dashboards / DNS / env).  
> See also `progress.md` for deploy notes.

---

## Agent (code)

### P0 — Per-user data (must have)

- [x] Add `clerkId` to `mood_entries`, `journal_entries`, `contacts`, and `community_posts` in `shared/schema.ts`
- [x] Update `server/storage.ts` (Mem + Database) to filter reads by `clerkId`
- [x] On create routes in `server/routes.ts`, attach `getAuth(req).userId` to new records
- [x] On PATCH/DELETE, verify record belongs to current user → `403` if not
- [x] Scope demo contacts per user in dev; demo community posts use `DEMO_CLERK_ID` (not editable)

### P1 — Community posts

- [x] Store real author on create (Clerk ID + username from Clerk profile)
- [x] Remove hardcoded `username: "you"` in `NewPost.tsx` — server sets author
- [x] Show Edit/Delete on post detail only when current user is the author
- [x] Keep feed public; restrict content edit/delete to owner (likes/saves open to any signed-in user)

### P1 — Emergency contacts

- [x] `GET /api/contacts` returns only the logged-in user's contacts
- [x] Edit/delete on `/contacts/:id` is owner-only
- [ ] Remove or hide demo-contact banner when user has real contacts (optional polish)

### P2 — Edit everything (UI polish)

- [ ] Confirm journal edit/delete UI is wired end-to-end
- [ ] Confirm mood entry edit/delete in UI where applicable
- [x] Contact edit flow works with scoped API
- [x] Profile page saves via `PATCH /api/profile` (already scoped)

### P2 — Auth hardening

- [x] Auth required for community post create/update/delete
- [x] Community feed GET stays public (browse without login)
- [x] `server/ownership.ts` helper for owner checks

### P3 — Nice to have

- [ ] Persist onboarding answers server-side (not only `localStorage`)
- [ ] Community likes/comments/saves with real persistence
- [ ] Emergency SOS notifications (email/SMS — separate scope)

### After agent schema change — run once

```bash
npm run db:push
```

---

## You (manual) — your checklist

### P0 — Free infrastructure setup

- [ ] **Clerk:** app at https://dashboard.clerk.com
- [ ] Local `.env`: `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- [ ] **Neon:** free PostgreSQL at https://neon.tech → `DATABASE_URL` in `.env`
- [ ] After agent schema change: `npm run db:push` locally **and** on production DB
- [ ] Test: sign up → add contact → create post → sign out/in → data persists

### P0 — Vercel production

- [ ] Vercel project **`quiet-circle`** only
- [ ] Production env: `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`, `APP_URL=https://www.quiet-circle.app`
- [ ] Redeploy after env vars

### P0 — Domain + Clerk URLs

- [ ] Attach `www.quiet-circle.app` to **`quiet-circle`** on Vercel
- [ ] Remove domain from old/broken Vercel projects
- [ ] Clerk redirect URLs: production + preview login/sign-up URLs
- [ ] When live: Clerk **live** keys (`pk_live_` / `sk_live_`)

### P1 — Clerk settings

- [ ] Enable desired sign-up methods (email, Google, etc.)
- [ ] Optional: `npm run bypass-client-trust` for local dev
- [ ] Optional: admin user via Clerk `publicMetadata.role = "admin"`

### P1 — Launch verification

- [ ] `/login` loads on production (no 500)
- [ ] Account A: add contact + post
- [ ] Account B: cannot see or edit A's private data
- [ ] Each user can edit/delete only their own items

### P2 — Optional later

- [ ] Monitor Neon free tier limits
- [ ] Decide on email/SMS for emergency alerts

---

## Order of operations

| Step | Who | Status |
|------|-----|--------|
| Neon DB + Vercel env + Clerk redirect URLs | **You** | Pending |
| `clerkId` scoping + ownership checks | **Agent** | Done |
| `npm run db:push` on production DB | **You** | Pending |
| Two-account end-to-end test | **Both** | Pending |
