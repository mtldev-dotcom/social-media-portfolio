# Content Types

Every piece of content on the site is one of these types.

---

## Taxonomy

| Type         | Description                                  |
|--------------|----------------------------------------------|
| POST         | Short thoughts, notes, opinions              |
| PROJECT      | Things I built (polished or not)             |
| NOTE         | Learnings, reflections, reminders            |
| EXPERIMENT   | Tools, playgrounds, weird ideas              |
| STORY        | Timeline / experience / background           |
| ACTIVITY     | Status updates, availability, changes        |

---

## Required fields

Each item must have:

- **type** — one of the types above
- **timestamp** — ISO 8601 date string
- **optional tags** — array of short labels (e.g. `["ai", "automation"]`)
- **optional media** — path or URL to an image/video/demo

---

## Notes

- Types are uppercase by convention in data; rendered as lowercase labels in the UI.
- The feed renders all types in a single chronological stream.
- Filters (e.g. "Notes only") are views on the same feed, not separate pages.
