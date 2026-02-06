# Feed Model

The site uses a **feed-first** mental model. Content comes from **Payload CMS** (Posts, Notes, Experiments).

---

## Rules

- Everything appears in one chronological feed.
- No "pages" in the traditional sense.
- Filters are optional views, not navigation.
- Feed is the homepage.

---

## Implications

- The homepage renders all content types (posts, notes, experiments) in a single stream, newest first.
- Data is fetched from Payload via `lib/payload` (getAllEntries, getTimeline, etc.).
- Navigation items like "Notes" or "Lab" are filtered views of the same underlying Payload collections.
- The About page is the only true "static" page — a snapshot, not a feed.
- Timeline mode is an alternate grouping of the same feed data (by year).
