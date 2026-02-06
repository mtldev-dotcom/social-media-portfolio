# Development Guide

For developers working on the blog codebase: structure, data layer, extending the app, and running checks.

---

## Prerequisites

- Node.js 20.9+
- npm (or pnpm / yarn)
- Familiarity with Next.js App Router and TypeScript

---

## Project structure (overview)

| Area | Purpose |
|------|--------|
| `app/` | Next.js App Router: root layout, Payload routes, locale-based frontend |
| `app/(payload)/` | Payload Admin (`/admin`) and REST API (`/api`) — do not add custom routes here |
| `app/[locale]/` | Frontend: home, about, lab, notes, `[type]/[slug]` detail |
| `payload.config.ts` | Payload config: collections, localization, DB adapter, secret |
| `payload/collections/` | Payload collection configs (Users, Media, Posts, Notes, Experiments, Comments) |
| `lib/payload/` | Data layer: fetch from Payload Local API, map to `BlogEntry` / `BlogComment` |
| `components/` | React components (Feed, TimelineView, Comments, Markdown, UI primitives) |
| `i18n/` | next-intl routing and server request (locales, messages) |
| `messages/` | UI strings: `en.json`, `fr.json` |

See [README](../README.md#project-structure) for a fuller tree.

---

## Data layer (`lib/payload`)

The frontend does **not** call the Payload REST API directly. It uses the **Local API** via `lib/payload`:

- **getPayload()** — uses `getPayload({ config })` from Payload; config comes from `@payload-config`.
- **getAllEntries(locale)** — merged Posts + Notes + Experiments, published only, sorted by `publishedAt` desc.
- **getEntryBySlug(locale, type, slug)** — single entry by type (`POST` | `NOTE` | `EXPERIMENT`) and slug.
- **getEntriesByType(locale, type)** — all published entries of one type.
- **getTimeline(locale)** — same entries grouped by year (for Timeline view).
- **getAllSlugs(locale)** — all `{ type, slug }` for `generateStaticParams`.
- **getCommentsForPost(postId)** / **getCommentsForNote(noteId)** — approved comments only.

All of these are wrapped with React `cache()` in `lib/payload/index.ts` so duplicate calls in one request are deduplicated.

**Error handling**: If the DB is missing or schema not ready (e.g. at build time), the loaders catch errors and return `[]` or `null` so the build and runtime don’t crash.

---

## Types

- **BlogEntry** — shape used by Feed, Timeline, and detail page: `id`, `type`, `slug`, `locale`, `publishedAt`, `title`, `summary`, `body`, `tags`, `hero`, `meta`.
- **BlogEntryType** — `"POST" | "NOTE" | "EXPERIMENT"`.
- **BlogComment** — `id`, `authorName`, `body`, `createdAt`.
- **Locale** — `"en" | "fr"`.

Defined in `lib/payload/types.ts` and re-exported from `lib/payload/index.ts`.

---

## Adding a new collection

1. **Define the collection** in `payload/collections/` (e.g. `payload/collections/MyCollection.ts`).
2. **Register it** in `payload.config.ts` under `collections: [..., MyCollection]`.
3. **Add a loader** in `lib/payload/loader.ts` (e.g. `getMyItems(locale)`) and export from `lib/payload/index.ts`.
4. **Use it** in a page or component (e.g. fetch in a server component and pass as props).
5. **Optional**: Add a route (e.g. `app/[locale]/my-page/page.tsx`) and link from the nav.

Run `npm run dev` so Payload can create the new table (SQLite) or run migrations (Postgres) as per your setup.

---

## Adding a comment form (public)

Comments are stored in Payload with `status: "pending"`. To let visitors submit comments:

1. **Server Action or API route** that calls Payload’s Local API (or REST) to create a document in the `comments` collection with `post` (or `note`), `authorName`, `authorEmail`, `body`, and `status: "pending"`.
2. **Form component** (client) with fields for name, email, body; onSubmit calls that action or API.
3. **Validation** — required fields, max length, optional honeypot or CAPTCHA for spam.
4. **Moderation** — you approve in Admin (**Comments** → set Status to Approved).

See Payload docs for [Local API `create`](https://payloadcms.com/docs/local-api/overview) and [REST `POST /api/comments`](https://payloadcms.com/docs/rest-api/overview).

---

## Styling and design

- **Tokens**: `app/globals.css` — `:root` (dark) and `html[data-theme="light"]`. Use CSS variables (e.g. `--surface-2`, `--text-primary`, `--fb-blue`) and Tailwind theme where applicable.
- **Tailwind**: v4 with `@import "tailwindcss"`. Follow existing patterns (e.g. `Card`, `Tag`, `Button` in `components/ui/`).
- **Design rules**: See [CONTEXT.md](CONTEXT.md) — Facebook blue accent only, no gradients, neutral surfaces.

---

## Scripts and checks

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server; Payload Admin at `/admin`. Do not pass `--turbopack` if you see Payload config errors. |
| `npm run build` | Production build. Payload loaders return empty if DB not available at build time. |
| `npm run start` | Serve production build (run after `npm run build`). |
| `npm run lint` | Run ESLint. |

**PowerShell (Windows)**: Run commands one at a time; do not use `&&`. Close any process using the dev port before starting again.

**Clean install (if Payload Admin shows "Cannot destructure property 'config'" or useConfig is undefined):** Duplicate Payload/React packages can break the admin context. Remove `node_modules`, `.next`, and `package-lock.json`, then run `npm install` and `npm run dev`. See [bug-payload-admin-config.md](bug-payload-admin-config.md).

---

## Environment variables (dev)

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYLOAD_SECRET` | Yes | Secret for Payload (e.g. JWT). Use a strong random value. |
| `DATABASE_URI` | No (dev) | Omit for SQLite default `file:./payload.db`. Set for Postgres/Mongo if needed. |

Use `.env` locally and do not commit it.

---

## Common tasks

- **Change supported locales**: Edit `payload.config.ts` (`localization.locales`) and `i18n/routing.ts` (`locales`) so they match (e.g. `en`, `fr`).
- **Add a field to a collection**: Edit the collection file in `payload/collections/`, add the field to the `fields` array. Restart dev server; SQLite will push schema in dev.
- **Expose a new API**: Prefer Server Actions or Next.js route handlers that use Payload Local API (`getPayload({ config })` then `payload.find` / `payload.create` / etc.). Use REST only if you need external or non-Next clients.
- **Debug Payload**: Check terminal logs from the Next dev server. Payload logs DB and API errors there. For REST, use browser DevTools Network tab for `/api/*`.

---

## Related docs

- [Getting Started](getting-started.md) — first run and first post
- [User Guide](user-guide.md) — content authoring in Admin
- [Deploy Guide](deploy-guide.md) — production env, DB, and hosting
- [Content Types](content-types.md), [Content Authoring](content-authoring.md) — Payload collections and authoring
- [CONTEXT.md](CONTEXT.md) — design and layout
