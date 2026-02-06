# Content Types (Payload Collections)

Every piece of blog content on the site comes from one of these Payload collections.

---

## Taxonomy

| Collection   | URL type   | Description                                  |
|--------------|------------|----------------------------------------------|
| **Posts**    | `post`     | Blog posts — short or long-form, Markdown body |
| **Notes**    | `note`     | Learnings, reflections, reminders           |
| **Experiments** | `experiment` | Lab: tools, playgrounds, weird ideas       |

Comments are stored in the **Comments** collection and linked to a Post (or optionally a Note). Media (hero images) use the **Media** collection.

---

## Common fields (Posts, Notes, Experiments)

- **title**, **slug** — localized (en, fr)
- **body** — Markdown; localized
- **publishedAt** — required; used for sorting and timeline
- **updatedAt** — optional
- **tags** — array of strings
- **hero** — optional upload (relation to Media)
- **status** — draft or published (Payload `_status`); only published is shown on the site

---

## Notes

- Types are uppercase in code (POST, NOTE, EXPERIMENT); URLs use lowercase (`post`, `note`, `experiment`).
- The feed merges all three collections and sorts by `publishedAt` descending.
- Lab page shows only Experiments; Notes page shows only Notes.
