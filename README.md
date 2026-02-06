# Nicky Bruno — Personal Blog

A **professional personal blog** with the same 3-column layout and Facebook-inspired design — powered by [Payload CMS](https://payloadcms.com) as a headless CMS. Bilingual (EN/FR), dark/light theme, posts, notes, and experiments with native comments.

![Dark mode](https://img.shields.io/badge/theme-dark%20%2F%20light-1877f2)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![Payload CMS](https://img.shields.io/badge/Payload-CMS-2d3748)
![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Features

- **3-column desktop layout**: icon nav / blog feed / profile rail + AI chat panel
- **Dark & light themes**: toggle persists to localStorage; no flash on reload
- **Bilingual (EN/FR)**: route-based localization; Payload collections localized (en/fr)
- **Blog content from Payload CMS**: Posts, Notes, Experiments (Lab) with draft/publish
- **Comments**: managed in Payload (approve/reject); displayed on post and note detail pages
- **Feed/Timeline toggle**: chronological feed and year-grouped timeline
- **Lab page**: experiments and tools (Experiments collection)
- **Notes page**: learnings and reflections (Notes collection)
- **Admin panel**: `/admin` — create and edit content, media, comments, users
- **Strict Facebook-inspired palette**: blue accent only; neutral surfaces; no gradients

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| CMS | Payload CMS 3.x (headless, Local API) |
| Database | SQLite (dev) or Postgres/MongoDB (prod via `DATABASE_URI`) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS variable tokens) |
| i18n | next-intl (route-based, EN/FR) |
| Fonts | Inter, Space Grotesk (via `next/font/google`) |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PAYLOAD_SECRET` | Required. Secret for Payload (e.g. JWT). Use a long random string in production. |
| `DATABASE_URI` | Optional for dev. SQLite defaults to `file:./payload.db`. For production use Postgres or MongoDB connection string. |

Create a `.env` file in the project root (do not commit secrets):

```env
PAYLOAD_SECRET=your-secret-here
# DATABASE_URI=file:./payload.db
# For production: DATABASE_URI=postgresql://... or mongodb://...
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (Payload will create SQLite DB and schema on first run)
npm run dev
```

- **Site**: [http://localhost:3000](http://localhost:3000) — redirects to `/en/` or `/fr/` based on browser language.
- **Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) — create your first user, then add Posts, Notes, Experiments, and Media.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build (Payload data layer returns empty if DB not ready at build time) |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
  layout.tsx              # Root layout (html/body)
  globals.css              # Design tokens (dark + light)
  (payload)/               # Payload routes (no URL segment)
    layout.tsx             # Payload layout
    admin/[[...segments]]/  # Admin UI at /admin
    api/[...slug]/          # REST API at /api
  [locale]/                # Frontend (en, fr)
    layout.tsx              # Locale layout, NextIntlClientProvider
    page.tsx                # Home (feed from Payload)
    about/page.tsx
    lab/page.tsx            # Experiments from Payload
    notes/page.tsx          # Notes from Payload
    [type]/[slug]/page.tsx  # Detail (post | note | experiment) + Comments

payload.config.ts          # Payload config: collections, localization, DB
payload/
  collections/             # Users, Media, Posts, Notes, Experiments, Comments

lib/
  payload/                 # Data layer (replaces file-based CMS)
    types.ts               # BlogEntry, BlogComment, Locale
    loader.ts              # getAllEntries, getEntryBySlug, getTimeline, getCommentsForPost, etc.
    index.ts               # Barrel + React cache()

i18n/                      # next-intl routing and request
messages/                  # en.json, fr.json (UI strings)
components/                # Feed, TimelineView, Comments, Markdown, etc.
```

## Content Authoring

All content is managed in **Payload Admin** at `/admin`:

1. Log in (create first user if needed).
2. **Posts**, **Notes**, **Experiments**: create documents with title, slug, body (Markdown), publishedAt, tags, hero image; enable localization (EN/FR) per field.
3. **Media**: upload images for hero and inline use.
4. **Comments**: approve or reject comments linked to posts/notes.

The frontend reads only **published** documents and **approved** comments. Drafts are hidden from the site.

## Internationalization (i18n)

- **UI**: next-intl — `messages/en.json`, `messages/fr.json`; route-based `/en/`, `/fr/`.
- **Content**: Payload localization — Posts, Notes, Experiments have localized fields (en, fr); default locale `en`, fallback enabled.
- **SEO**: `<html lang>` and hreflang alternates per locale.

## Theme System

Tokens in `app/globals.css`: `:root` (dark default), `html[data-theme="light"]`. Theme toggle in left nav persists to localStorage; script in locale layout applies before paint (no flash).

## Design Constraints

- **Palette**: Facebook blue (`#1877f2`) for emphasis; charcoal/gray neutrals.
- **No gradients**; no secondary accent; no neon.
- **Shadows**: soft, neutral; blue glow only on primary buttons.

## Deploy

1. Set `PAYLOAD_SECRET` and `DATABASE_URI` (e.g. Vercel Postgres, Neon, MongoDB Atlas) in your hosting environment.
2. Build: `npm run build`. (If DB is not connected at build time, blog list/detail pages are generated on first request.)
3. Deploy to [Vercel](https://vercel.com) or any Node.js host that supports Next.js.

## Documentation

### Guides

- [Getting Started](docs/getting-started.md) — run locally and publish your first post
- [User Guide](docs/user-guide.md) — content authoring in Payload Admin (posts, notes, experiments, media, comments)
- [Development Guide](docs/development-guide.md) — project structure, data layer, extending the app
- [Deploy Guide](docs/deploy-guide.md) — production env, database, and hosting (e.g. Vercel)

### Reference

- [Design Context](docs/CONTEXT.md) — product concept, visual rules, layout
- [Content Types](docs/content-types.md) — Payload collections (Posts, Notes, Experiments)
- [Content Authoring](docs/content-authoring.md) — using Payload Admin for blog content
- [Vision](docs/vision.md) — site purpose and positioning
- [Lab](docs/lab.md), [Timeline](docs/timeline.md) — section specs

## License

Private / unlicensed. For personal blog use.
