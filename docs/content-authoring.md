# Content Authoring Guide

How to add, edit, and manage content on nickybruno.com.

---

## Where files go

```
content/entries/en/{slug}.{type}.json    # English
content/entries/fr/{slug}.{type}.json    # French
```

**Naming convention**: `{slug}.{type-lowercase}.json`
Example: `automation-studio.project.json`

---

## Required fields

| Field        | Type     | Description                             |
|-------------|----------|-----------------------------------------|
| `id`        | string   | Stable identifier (links EN/FR translations) |
| `type`      | string   | POST, NOTE, PROJECT, EXPERIMENT, STORY, ACTIVITY |
| `slug`      | string   | URL-safe (a-z, 0-9, hyphens only)      |
| `locale`    | string   | "en" or "fr"                            |
| `status`    | string   | "draft" or "published"                  |
| `publishedAt` | string | ISO 8601 date (e.g. "2026-02-05T14:00:00Z") |

---

## Optional fields

| Field        | Type     | Description                             |
|-------------|----------|-----------------------------------------|
| `variant`   | string   | Sub-kind (e.g. "text", "testimonial", "building", "status") |
| `title`     | string   | Display title                           |
| `summary`   | string   | Short description                       |
| `body`      | string   | Markdown content                        |
| `tags`      | string[] | Tags for filtering                      |
| `hero`      | object   | `{ kind: "image", src: "/path.svg", alt: "..." }` |
| `links`     | array    | `[{ label: "GitHub", href: "https://..." }]` |
| `meta`      | object   | Arbitrary metadata (stats, bullets, etc.) |
| `updatedAt` | string   | ISO 8601 last-updated timestamp         |

---

## Bilingual rule

- EN and FR files for the same content share the **same `id`**.
- The `id` links translations across locales.
- Both files use the **same `slug`**.

---

## Draft vs Published

- `status: "draft"` — hidden from all public views.
- `status: "published"` — visible on the site.
- Set to "draft" while writing, flip to "published" when ready.

---

## Quick start

### Option A: Copy template

1. Copy `content/_templates/entry.template.json`
2. Save to `content/entries/en/{slug}.{type}.json`
3. Fill in required fields + content
4. Create FR copy with same `id` and `slug`

### Option B: Use the script

```bash
node scripts/new-entry.mjs
```

Prompts for type, slug, locale. Creates a draft file with timestamps pre-filled.

---

## Adding hero images

1. Place the image in `public/` (e.g. `public/thumb-my-project.svg`)
2. Set `hero.src` to the public path: `"/thumb-my-project.svg"`
3. Set `hero.alt` to a descriptive alt text
4. Set `hero.kind` to `"image"` or `"video"`
