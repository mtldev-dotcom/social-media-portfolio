# Nicky Bruno — Social Profile Portfolio

A **modern personal portfolio website designed as a social media profile page** — a hybrid of LinkedIn, Instagram, X (Twitter), and Facebook, reimagined as a high-end personal brand platform.

![Dark mode](https://img.shields.io/badge/theme-dark%20%2F%20light-1877f2)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Features

- **3-column desktop layout**: icon nav / social feed / profile rail + AI chat panel
- **Dark & light themes**: toggle persists to localStorage; no flash on reload
- **Bilingual (EN/FR)**: route-based localization with automatic language detection and switcher
- **Profile header**: avatar, verified badge, headline, location, status, action buttons
- **Social feed cards**: POSTs, PROJECTs, STORYs, NOTEs, EXPERIMENTs, ACTIVITYs — seed data in `content/seed.json`
- **Floating AI Guide panel**: UI-ready placeholder (no backend yet)
- **Strict Facebook-inspired palette**: blue accent only; neutral surfaces; no gradients

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS variable tokens) |
| i18n | next-intl (route-based, EN/FR) |
| Fonts | Inter, Space Grotesk (via `next/font/google`) |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/en/` or `/fr/` based on your browser language.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
  globals.css            # Design tokens (dark + light), Tailwind theme
  [locale]/
    layout.tsx           # Root layout, fonts, theme init, NextIntlClientProvider
    page.tsx             # Main 3-column page (feed)
    about/page.tsx       # Static profile snapshot
    lab/page.tsx         # Experiments & tools
    notes/page.tsx       # Filtered feed (NOTE type)

i18n/
  routing.ts             # Locale list + default locale
  request.ts             # Server-side locale resolution + message loading
  navigation.ts          # Locale-aware Link, useRouter, usePathname

messages/
  en.json                # English translations (all UI + content)
  fr.json                # French translations (all UI + content)

components/
  ui/                    # Primitives: Card, Button, Tag
  icons.tsx              # Inline SVG icons (grayscale)
  ProfileHeader.tsx
  LeftNav.tsx            # Icon navigation (Home, About, Lab, Notes) + theme/lang toggles
  Feed.tsx               # Social feed with typed post variants
  RightRail.tsx          # Profile summary, stats, skills
  ChatPanel.tsx          # AI Guide placeholder (client component)
  ThemeToggle.tsx        # Dark/light toggle (client component)
  LanguageSwitcher.tsx   # EN/FR locale toggle (client component)

proxy.ts                 # Next.js 16 middleware (locale detection + redirects)

public/
  avatar-nicky.svg
  thumb-automation.svg
  thumb-case-study.svg

docs/
  CONTEXT.md             # Design brief + constraints
  TODOS.md               # Implementation checklist
  content-enhance.md     # Content strategy / build plan
  vision.md              # Site purpose + positioning
  content-types.md       # Content taxonomy
  feed-model.md          # Feed-first mental model
  layout.md              # Layout contract (desktop/mobile)
  cards.md               # Card system spec
  voice.md               # Tone and writing rules

content/
  seed.json              # Structured feed data (12 items, 6 types)
```

## Internationalization (i18n)

The site is fully bilingual (English and French) using [next-intl](https://next-intl.dev/):

- **Route-based**: `/en/` for English, `/fr/` for French
- **Auto-detection**: visiting `/` redirects to the locale matching your browser's `Accept-Language` header
- **Persistence**: locale preference is stored in a `NEXT_LOCALE` cookie
- **Language switcher**: EN/FR toggle in the left nav sidebar
- **Complete coverage**: all UI labels, feed content, profile text, stats, AI Guide, and SEO metadata are translated
- **SEO**: `<html lang>` is set per locale; `<link rel="alternate" hreflang>` tags are generated automatically

Translation files live in `messages/en.json` and `messages/fr.json`.

## Theme System

Tokens are defined in `app/globals.css` under `:root` (dark default) and `html[data-theme="light"]` (light override). The toggle button in the left nav:

1. Sets `data-theme` on `<html>`
2. Persists choice to `localStorage`
3. A tiny inline script in `app/[locale]/layout.tsx` applies the stored theme before paint (no flash)

## Design Constraints

- **Palette**: Facebook blue (`#1877f2`) for emphasis; charcoal/gray neutrals everywhere else
- **No gradients**
- **No secondary accent colors**
- **No neon effects**
- **Glassmorphism**: subtle, used sparingly (chat panel only)
- **Shadows**: soft, neutral; blue glow only on primary buttons

## Documentation

- [Design Context](docs/CONTEXT.md) — product concept, visual rules, layout spec, i18n architecture
- [TODOs](docs/TODOS.md) — implementation checklist
- [Content Strategy](docs/content-enhance.md) — content taxonomy, tone rules, build plan
- [Vision](docs/vision.md) — site purpose and positioning
- [Content Types](docs/content-types.md) — content taxonomy (POST, PROJECT, NOTE, EXPERIMENT, STORY, ACTIVITY)

## Deploy

The easiest way to deploy is via [Vercel](https://vercel.com/new):

```bash
npm run build
```

Or use any Node.js hosting that supports Next.js.

## License

Private / unlicensed. For personal portfolio use.
