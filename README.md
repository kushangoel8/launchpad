# Launchpad

A living map of competitions, summer programs, olympiads, and fellowships for ambitious STEM students. Discover what fits you, track what you want, and never miss a deadline.

**This is v1** — free discovery + tracker. On purpose, it has:

- No login and no database. Your tracked list saves in your browser. This means it deploys with **zero config**.
- An approximate, hand-picked starter dataset (`app/lib/opportunities.js`). Every card links to the official site and says "confirm deadline on official site."

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Go to vercel.com → New Project → import this repo.
3. Framework auto-detects as Next.js. No environment variables needed. Deploy.

## What's next (roadmap — NOT in v1)

- **v1.1** — real accounts (login + database) so tracking follows you across devices.
- **v2** — the application builder: match a student's profile against each program's real criteria, show fit + gaps + positioning.
- Later — a "suggest an opportunity" form, comments/reviews, program-side accounts.

## Grow the data

The product lives or dies on accurate, growing data. Add entries to `app/lib/opportunities.js`. Later, semi-automate with a scraper + LLM extraction + user submissions.
