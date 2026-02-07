# Design Context

## Product concept

This project is a **professional personal blog** (EN/FR) with a 3-column layout — powered by **Next.js** and **Payload CMS** as a headless CMS. Content (posts, notes, experiments) and comments are managed in Payload Admin; the frontend reads from the Payload Local API.

The goal is a **living blog** (feed, posts, notes, experiments) with drafts, localization (EN/FR), and native comments.

---

## Brand + visual constraints (non-negotiable)

- **Global palette**: strict Facebook-inspired palette across the entire UI.
  - **Only accent**: Facebook blue (`#1877f2`) for emphasis.
  - **Everything else**: charcoal/gray neutrals.
- **No gradients**
- **No secondary accent colors**
- **No neon**
- **Imagery**: avoid colorful imagery dominating the UI. Prefer neutral/low-saturation placeholders.
- **Effects**: "flat + subtle glassmorphism"
  - Subtle `backdrop-filter` blur is allowed, used sparingly (chat panel).
  - Depth via shadows only (soft, neutral).
  - Soft blue glow only on primary buttons / active elements (still subtle; not neon).
- **Surfaces**: charcoal/gray card surfaces, soft rounded corners (`1rem`), thin grayscale dividers.

---

## Theme system (dark + light)

The app supports **dark mode** (default) and **light mode** with a manual toggle.

### Token architecture

Source of truth is `app/globals.css`:

| Section | Purpose |
|---------|---------|
| `:root { … }` | Dark-mode tokens (surfaces, text, shadows, dividers) |
| `html[data-theme="light"] { … }` | Light-mode overrides for the same tokens |
| `@theme inline { … }` | Tailwind v4 semantic mapping (`--color-background`, etc.) |
| `@layer components { … }` | Minimal utilities: `.card`, `.card-glass`, `.divider` |

### How the toggle works

1. `components/ThemeToggle.tsx` (client component) toggles `data-theme` on `<html>` and saves to `localStorage`.
2. `app/[locale]/layout.tsx` includes an inline `<script>` that reads `localStorage` and sets `data-theme` **before paint** to avoid flash.
3. `html[data-theme="light"]` overrides CSS variables; entire UI updates instantly.

### Key tokens (both themes)

| Token | Dark value | Light value |
|-------|------------|-------------|
| `--app-bg` | `#18191a` | `#f0f2f5` |
| `--surface-1` | `#242526` | `#ffffff` |
| `--surface-2` | `#2d2e30` | `#f5f6f7` |
| `--text-primary` | `#e4e6eb` | `#111418` |
| `--divider` | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.1)` |
| `--fb-blue` | `#1877f2` | `#1877f2` (unchanged) |

---

## Internationalization (i18n)

The app supports **English** and **French** via `next-intl` with route-based localization.

### Routing

- All pages live under `app/[locale]/` (e.g. `/en/`, `/fr/`).
- `proxy.ts` (Next.js 16 middleware) handles automatic locale detection from the `Accept-Language` header, redirects bare `/` to the matched locale, and persists the choice in a `NEXT_LOCALE` cookie.
- Invalid locales return a 404 via `notFound()`.

### Configuration files

| File | Purpose |
|------|---------|
| `i18n/routing.ts` | Defines supported locales (`en`, `fr`) and default locale (`en`) |
| `i18n/request.ts` | Server-side locale resolution + loads `messages/{locale}.json` |
| `i18n/navigation.ts` | Locale-aware wrappers for `Link`, `useRouter`, `usePathname` |
| `proxy.ts` | Middleware for locale detection, redirects, cookie persistence |

### Translation files

All UI text and content lives in `messages/en.json` and `messages/fr.json`, organized by namespace:

| Namespace | Covers |
|-----------|--------|
| `nav` | Navigation labels |
| `profile` | Profile header (name, headline, location, status, buttons) |
| `feed` | All feed items (posts, projects, experience, testimonials, building, status) |
| `rightRail` | Profile summary, tech stack, stats |
| `aiGuide` | AI Guide panel (title, messages, placeholder, inputs) |
| `theme` | Theme toggle aria labels |
| `metadata` | Page title + description |
| `languageSwitcher` | Language toggle labels |

### How components consume translations

- **Server components** (LeftNav, Feed, ProfileHeader, RightRail): call `useTranslations('namespace')` directly.
- **Client components** (ChatPanel, ThemeToggle, LanguageSwitcher): call `useTranslations('namespace')` — translations are delivered via `NextIntlClientProvider` in the root layout.
- Arrays (tags, bullets, tech stack) use `t.raw('key')` to return raw JSON arrays.

### Language switcher

`components/LanguageSwitcher.tsx` is a client component in the left nav. It uses `useRouter().replace()` from `i18n/navigation.ts` to swap the locale segment in the URL without a full page reload.

### SEO

- `<html lang="...">` is set dynamically per locale.
- `generateMetadata()` in the layout produces locale-aware `<title>`, `<meta description>`, and `<link rel="alternate" hreflang="...">` tags.

---

## Layout (desktop-first)

Three-column desktop layout:

| Column | Content |
|--------|---------|
| **Left** | Minimal icon navigation (Home, About, Lab, Notes) + theme toggle + language switcher |
| **Center** | Profile header + blog feed (stacked cards) — or route-specific content (About, Lab, Notes) |
| **Right** | Profile summary, stats, tech stack tags, floating AI chat panel |

### Responsive intent

- **Desktop** (≥1024px): 3-column grid.
- **Tablet/mobile** (<1024px): left nav becomes a horizontal row; right rail stacks below feed; chat panel docks.

---

## Top profile header (center column)

| Element | Value |
|---------|-------|
| Avatar | Circular, neutral placeholder |
| Verified badge | Blue checkmark |
| Name | **Nicky Bruno** |
| Headline | **creative technologist · ai & automation** |
| Tagline | **i build calm systems. sometimes i write about them.** |
| Location | **Montreal · Remote** |
| Status | **currently building · experimenting · available to chat** |

---

## Feed content types

The main feed includes these content types (defined in `/docs/content-types.md` and managed in Payload):

| Type       | Style                         |
|------------|-------------------------------|
| POST       | Blog post (title, body, publishedAt, tags, hero) |
| NOTE       | Learning, reflection, or reminder |
| EXPERIMENT | Lab entry (what / why / learned in meta) |

### Content architecture (Payload CMS)

Content is managed in **Payload Admin** at `/admin` (Posts, Notes, Experiments collections). Localization (EN/FR) is per document. The frontend reads via `lib/payload` (getAllEntries, getEntryBySlug, getTimeline, etc.); only **published** documents are shown. Detail pages: `app/[locale]/[type]/[slug]/page.tsx` (post, note, experiment).

---

## Typography

| Use | Font |
|-----|------|
| Body / UI | **Inter** (variable) |
| Display / headings | **Space Grotesk** (variable) |

Fonts are loaded via `next/font/google` in `app/[locale]/layout.tsx` and exposed through CSS variables (`--font-inter`, `--font-space-grotesk`).

---

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| CMS | Payload CMS 3.x (headless, Local API) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS variable tokens) |
| i18n | next-intl (route-based, EN/FR) |
| Fonts | Inter, Space Grotesk |

---

## Dev commands

```bash
npm run dev      # Start dev server
npm run lint     # Run ESLint
npm run build    # Production build
```

---

## Footer

- "This page is a living document. It changes often."
- Discreet soft link to `aiaa.dev` — no tracking, no emphasis, no pitch.

---

## Acceptance criteria (visual)

- The page reads as a **blog** first (feed, posts, notes, experiments).
- Accent blue is used **only** for emphasis (buttons, active nav, verified badge, subtle focus/glow).
- No gradients; no additional accent colors; no neon.
- Cards feel premium: neutral surfaces, thin dividers, subtle shadow depth, optional soft glass effect.
- Theme toggle works instantly; preference persists across sessions with no flash.
- Language switcher toggles between English and French; locale persists in URL and cookie.
- All text content is fully localized — no hardcoded strings in components.
- Feed/Timeline toggle switches between chronological and year-grouped views.
- Lab and Notes pages render filtered content from seed data.
- `prefers-reduced-motion` is respected (all animations/transitions disabled).
