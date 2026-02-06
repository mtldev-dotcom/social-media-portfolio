# Nicky Bruno — Social Profile Portfolio

A **modern personal portfolio website designed as a social media profile page** — a hybrid of LinkedIn, Instagram, X (Twitter), and Facebook, reimagined as a high-end personal brand platform.

![Dark mode](https://img.shields.io/badge/theme-dark%20%2F%20light-1877f2)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Features

- **3-column desktop layout**: icon nav / social feed / profile rail + AI chat panel
- **Dark & light themes**: toggle persists to localStorage; no flash on reload
- **Profile header**: avatar, verified badge, headline, location, status, action buttons
- **Social feed cards**: text posts, project cards, experience/case studies, testimonials, "currently building", activity status
- **Floating AI chat panel**: UI-ready placeholder (no backend yet)
- **Strict Facebook-inspired palette**: blue accent only; neutral surfaces; no gradients

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS variable tokens) |
| Fonts | Inter, Space Grotesk (via `next/font/google`) |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

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
  globals.css      # Design tokens (dark + light), Tailwind theme
  layout.tsx       # Root layout, fonts, theme init script
  page.tsx         # Main 3-column page

components/
  ui/              # Primitives: Card, Button, Tag
  icons.tsx        # Inline SVG icons (grayscale)
  ProfileHeader.tsx
  LeftNav.tsx      # Icon navigation + theme toggle
  Feed.tsx         # Social feed with typed post variants
  RightRail.tsx    # Profile summary, stats, skills
  ChatPanel.tsx    # AI chat placeholder (client component)
  ThemeToggle.tsx  # Dark/light toggle (client component)

public/
  avatar-nicky.svg
  thumb-automation.svg
  thumb-case-study.svg

docs/
  CONTEXT.md       # Design brief + constraints
  TODOS.md         # Implementation checklist
```

## Theme System

Tokens are defined in `app/globals.css` under `:root` (dark default) and `html[data-theme="light"]` (light override). The toggle button in the left nav:

1. Sets `data-theme` on `<html>`
2. Persists choice to `localStorage`
3. A tiny inline script in `layout.tsx` applies the stored theme before paint (no flash)

## Design Constraints

- **Palette**: Facebook blue (`#1877f2`) for emphasis; charcoal/gray neutrals everywhere else
- **No gradients**
- **No secondary accent colors**
- **No neon effects**
- **Glassmorphism**: subtle, used sparingly (chat panel only)
- **Shadows**: soft, neutral; blue glow only on primary buttons

## Documentation

- [Design Context](docs/CONTEXT.md) — product concept, visual rules, layout spec
- [TODOs](docs/TODOS.md) — implementation checklist

## Deploy

The easiest way to deploy is via [Vercel](https://vercel.com/new):

```bash
npm run build
```

Or use any Node.js hosting that supports Next.js.

## License

Private / unlicensed. For personal portfolio use.
