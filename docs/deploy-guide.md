# Deploy Guide

Deploy the blog to production: environment variables, database choice, and hosting (e.g. Vercel).

---

## Overview

- **App**: Next.js 16 (App Router) with Payload CMS and next-intl.
- **Database**: SQLite is fine for local dev; for production use **PostgreSQL** or **MongoDB**.
- **Hosting**: Any Node.js host that supports Next.js (e.g. **Vercel**, Railway, Render, Fly.io). Vercel is the most common.

---

## 1. Environment variables (production)

Set these in your hosting dashboard (e.g. Vercel → Project → Settings → Environment Variables).

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYLOAD_SECRET` | **Yes** | Long random string (e.g. 32+ chars). Use a password generator or `openssl rand -base64 32`. Never commit this. |
| `DATABASE_URI` | **Yes** (prod) | Production database URL. Omit only if you intentionally use SQLite in production (not recommended). |

### PostgreSQL examples

- **Vercel Postgres**: Create a Postgres store in Vercel; copy the connection string into `DATABASE_URI`.
- **Neon**: Create a project, copy the connection string (e.g. `postgresql://user:pass@host/db?sslmode=require`).
- **Supabase**, **Railway**, etc.: Use the provided Postgres URL.

### MongoDB example

- **MongoDB Atlas**: Create a cluster, get connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`), set as `DATABASE_URI`.
- **Payload + MongoDB**: Install `@payloadcms/db-mongodb` and use `mongooseAdapter({ url: process.env.DATABASE_URI })` in `payload.config.ts` (replace SQLite adapter when deploying with MongoDB).

**Important**: For Postgres, Payload 3 with `@payloadcms/db-postgres` uses the URL from `DATABASE_URI`. Ensure SSL is enabled if required by your provider (e.g. `?sslmode=require`).

---

## 2. Database adapter (production)

The repo is set up for **SQLite** by default. For production you typically switch to Postgres or MongoDB.

### Option A: PostgreSQL

1. Install the adapter:  
   `npm install @payloadcms/db-postgres`
2. In `payload.config.ts`:
   - Import: `import { postgresAdapter } from '@payloadcms/db-postgres'`.
   - Replace `db: sqliteAdapter({ ... })` with:
     ```ts
     db: postgresAdapter({
       pool: { connectionString: process.env.DATABASE_URI },
     }),
     ```
3. Set `DATABASE_URI` in production to your Postgres URL.
4. Run Payload migrations in CI or a one-off job if your setup requires it (see Payload docs for `payload migrate`).

### Option B: MongoDB

1. Install: `npm install @payloadcms/db-mongodb`.
2. In `payload.config.ts` use `mongooseAdapter({ url: process.env.DATABASE_URI })` and set `DATABASE_URI` to your MongoDB URL.

Keep SQLite in `payload.config.ts` for local dev and use **different env vars per environment** (e.g. no `DATABASE_URI` locally, so it falls back to `file:./payload.db`; set `DATABASE_URI` only in production).

---

## 3. Build and start

- **Build**: `npm run build`
- **Start**: `npm run start`

On platforms like Vercel, the build step runs in the cloud; you only need to configure the build command (`npm run build`) and output (Next.js default). The start command is used when the platform runs the app (e.g. in serverless or a Node server).

### Build-time behavior

- If **no database is available at build time** (e.g. Vercel build has no `DATABASE_URI` or DB not reachable), the Payload data layer in `lib/payload/loader.ts` catches errors and returns empty arrays / null. So the build succeeds; blog list and detail pages are then rendered on **first request** (or when DB is available).
- If you **do** connect a production DB at build time (e.g. by setting `DATABASE_URI` in the build environment), `generateStaticParams` and server-rendered pages can pre-render with real data.

---

## 4. Vercel (step-by-step)

1. **Repo**: Push the project to GitHub (or connect another Git provider).
2. **Vercel**: Import the repo as a new project. Framework preset: **Next.js**.
3. **Env vars**: In Project → Settings → Environment Variables, add:
   - `PAYLOAD_SECRET` = your production secret (Production only).
   - `DATABASE_URI` = your Postgres (or MongoDB) URL (Production only).
4. **Database**: Create a Postgres database (e.g. Vercel Postgres or Neon) and paste the URL into `DATABASE_URI`.
5. **Deploy**: Trigger a deploy (e.g. push to main). Build should complete; first load may create DB schema if Payload runs migrations on init.
6. **Admin**: Open `https://your-domain.com/admin` and create the first user if the DB was empty.

### Vercel + SQLite

SQLite is not suitable on Vercel’s serverless runtime (read-only filesystem, no persistent local file). Use Postgres or MongoDB for production.

---

## 5. First user and content

- After deploy, open **`https://your-domain.com/admin`**.
- If no user exists, you’ll see **Create first user**. Create an admin account.
- Add **Posts**, **Notes**, **Experiments**, and **Media** as needed. See [User Guide](user-guide.md).

---

## 6. Security checklist

- [ ] `PAYLOAD_SECRET` is set in production and is a long random value.
- [ ] `DATABASE_URI` is set in production and not committed.
- [ ] Admin is at `/admin`; only authenticated users can access it (Payload enforces this).
- [ ] No secrets in client-side code or in the repo.
- [ ] If you add a public comment form, use Server Actions or API routes; validate and sanitize input; consider rate limiting and spam protection.

---

## 7. Troubleshooting

| Issue | What to check |
|------|----------------|
| Build fails | Ensure Node 20+ and `npm run build` works locally. Check for missing env (e.g. `PAYLOAD_SECRET`). |
| “No such table” / DB errors at runtime | DB not connected or schema not created. Set `DATABASE_URI`; run migrations or let Payload create tables on first request (dev push or prod migrate). |
| Admin returns 500 | Check host logs for Payload/DB errors. Verify `PAYLOAD_SECRET` and `DATABASE_URI`. |
| Blank feed on production | Data layer may be returning empty if DB was unreachable at build. Ensure `DATABASE_URI` is set and DB is reachable from the host. Create content in Admin. |
| Locale/redirect issues | Ensure `next-intl` middleware and routing match your domain and locale config (`i18n/routing.ts`). |

---

## Related docs

- [Getting Started](getting-started.md) — local setup and first post
- [User Guide](user-guide.md) — content authoring
- [Development Guide](development-guide.md) — codebase and data layer
- [Payload deployment](https://payloadcms.com/docs/production/deployment) — official Payload deployment notes
