# Content Directory

File-based CMS for nickybruno.com.

## Structure

```
content/
  entries/
    en/           # One JSON file per entry (English)
    fr/           # One JSON file per entry (French)
  _templates/
    entry.template.json
```

## Rules

- **One entry per file.**
- **Stable `id`**: same `id` in both `en/` and `fr/` links translations.
- **Slugs are unique** per locale + type.
- **Naming convention**: `{slug}.{type-lowercase}.json` (e.g. `automation-studio.project.json`)
- **Required fields**: `id`, `type`, `slug`, `locale`, `status`, `publishedAt`
- **Draft filtering**: entries with `status: "draft"` are hidden from public views.
- **Body**: Markdown string for long-form content.

## Adding a new entry

1. Copy `_templates/entry.template.json`
2. Fill in the required fields
3. Save to `entries/en/` (and `entries/fr/` for the translation)
4. Set `status: "published"` when ready

Or run: `npm run new:entry`
