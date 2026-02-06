# Implementation TODOs

This is the working task list for building the "social-profile portfolio" UI described in `docs/CONTEXT.md`.

---

## Completed

### Core UI

- [x] Build 3-column layout shell (left nav / center feed / right rail)
  - [x] Sticky left icon rail (grayscale icons)
  - [x] Center column with profile header at top
  - [x] Right column with profile summary + stats + skills/tags
  - [ ] Responsive collapse rules (tablet/mobile) — *partially done; needs polish*
- [x] Implement profile header
  - [x] Circular avatar + verified badge
  - [x] Name/headline/location/status fields
  - [x] Primary blue-accent buttons: Follow / Contact / Book a Call
  - [x] Hover/active/focus states (blue glow only on primary/active)
- [x] Build feed card system (stacked, consistent spacing)
  - [x] Short text post (X/Twitter-style)
  - [x] Project card with thumbnail (Instagram-style)
  - [x] Case study / experience post (LinkedIn-style)
  - [x] Testimonial as comment thread
  - [x] "Currently building" card
  - [x] Activity/status card
- [x] Floating AI chat panel (right rail)
  - [x] Floating container (glass effect)
  - [x] Minimal chat UI (input + message list)
  - [x] UI-only placeholder (no real AI integration yet)

### Design system + consistency

- [x] Add minimal reusable components
  - [x] `Card` (surface + divider + padding)
  - [x] `Button` (primary/secondary/ghost; strict palette)
  - [x] `Tag` (tech stack labels)
  - [x] `IconVerified` badge
  - [x] `Icon` set (simple inline SVGs, grayscale)
- [x] Enforce strict palette rules
  - [x] No gradients anywhere
  - [x] No additional accent colors introduced via shadows/images
  - [x] Neutral imagery/placeholders
- [x] Typography pass
  - [x] Use display font only where it adds hierarchy (name/section headers)
  - [x] Comfortable feed spacing (line-height, rhythm)

### Theme system

- [x] Define dark-mode tokens in `:root`
- [x] Define light-mode token overrides in `html[data-theme="light"]`
- [x] Add `ThemeToggle` client component (localStorage + DOM)
- [x] Add inline script in layout to prevent theme flash
- [x] Mount toggle in left nav

### Content/data

- [x] Create a typed "feed items" data model (local array) to render the feed
- [x] Add realistic placeholder content for:
  - [x] Projects (2 items)
  - [x] Experiences/case studies (1 item)
  - [x] Testimonials (2 comments)
  - [x] Current build + activity
- [x] Add neutral avatar and thumbnail placeholders (SVGs in `public/`)

### Internationalization (i18n)

- [x] Install and configure `next-intl` with `createNextIntlPlugin`
- [x] Set up `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`
- [x] Create `proxy.ts` (Next.js 16 middleware) for locale detection + redirects
- [x] Restructure `app/` into `app/[locale]/` with locale-aware layout and page
- [x] Create full translation files (`messages/en.json`, `messages/fr.json`)
  - [x] Navigation labels
  - [x] Profile header (name, headline, location, status, buttons)
  - [x] All feed items (text posts, projects, experience, testimonials, building, status)
  - [x] Right rail (profile summary, tech stack, stats)
  - [x] AI Guide panel (renamed from "AI Concierge")
  - [x] Theme toggle labels
  - [x] SEO metadata (title, description)
- [x] Update all components to use `useTranslations()` hooks — no hardcoded strings
- [x] Build `LanguageSwitcher` component (EN/FR toggle in left nav)
- [x] Add `generateStaticParams` for static rendering of both locales
- [x] Add `generateMetadata` with locale-aware title, description, and `hreflang` links
- [x] Verify build passes and both `/en` and `/fr` render correctly

---

## Remaining / polish

### Responsive

- [ ] Refine tablet breakpoint (768–1024px): stack right rail below feed
- [ ] Refine mobile breakpoint (<768px): left nav as bottom bar or hamburger
- [ ] Chat panel: dock or hide on mobile

### Accessibility

- [ ] Full keyboard navigation audit (tab order, visible focus ring)
- [ ] Contrast check on text + dividers against surfaces (both themes)
- [ ] Screen reader labels for all interactive elements

### Performance

- [ ] Audit blur usage; ensure no heavy glass on large areas
- [ ] Lazy-load project thumbnails if list grows

### Content expansion

- [ ] Add more projects (3–5 total)
- [ ] Add more testimonials (4–6 total)
- [ ] Add more experience entries (2–3 total)

### QA checklist

- [ ] Visual check at 1440px / 1280px / 1024px / 768px / 390px
- [ ] Theme toggle works in both directions; persists on refresh
- [ ] No hydration warnings in console

---

## Verification commands

```bash
npm run lint
npm run build
```

---

### i18n polish

- [ ] Add additional locales if needed (e.g. Spanish, Portuguese)
- [ ] Content management: consider CMS or external tool for non-dev translation updates
- [ ] Verify French translations with a native speaker for natural phrasing

---

## Not in scope (for now)

- Real authentication / "Follow" backend
- Real messaging system
- Real AI integration (LLM, streaming, tools, memory)
- CMS integration for posts/projects
