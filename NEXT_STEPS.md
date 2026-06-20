# Next Steps

> **See `progress.md` for the full backlog and deployment guide.**

## If you are new to this repo

1. Read `progress.md`
2. Run `npm run check` and `npm run build`
3. Run `npm run dev` and open http://localhost:5000

## If deployment is broken

1. Confirm you are deploying to the **`quiet-circle`** Vercel project (not a duplicate)
2. Confirm Production env vars: `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `APP_URL`
3. Confirm `https://quiet-circle-gamma.vercel.app/login` works — if yes, the code is fine; fix domain routing
4. Attach `www.quiet-circle.app` to `quiet-circle` in Vercel Domains (see `progress.md` Deploy status)

## Highest-impact feature work

1. Set `DATABASE_URL` on Vercel + `npm run db:push` for persistent mood/journal data
2. Journal edit/delete
3. Community interactions (likes, saves)
