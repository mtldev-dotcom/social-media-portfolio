# User Guide (Content Authors)

How to manage blog content using the Payload Admin panel. For developers, see [Development Guide](development-guide.md).

---

## Logging in

1. Open **`/admin`** (e.g. http://localhost:3000/admin or your production URL).
2. Enter your **email** and **password**.
3. Use **Log out** in the Admin UI when done.

---

## Posts

**Posts** are standard blog entries (articles, updates, thoughts).

### Creating a post

1. **Content** → **Posts** → **Create New**.
2. Fill in:
   - **Title** — display title.
   - **Slug** — URL segment (e.g. `my-first-post`). Must be unique per locale. Often auto-generated from title.
   - **Summary** — optional short description (e.g. for cards or SEO).
   - **Body** — main content. **Markdown** is supported on the site (headings, lists, links, code, etc.).
   - **Published At** — required. Used for feed order and timeline.
   - **Updated At** — optional; can be read-only.
   - **Tags** — optional list of tags (e.g. "ai", "automation").
   - **Hero** — optional image (upload in Media first, then select here).
3. Use the **locale** switcher (EN / FR) to add or edit the same post in another language.
4. Set **Status** to **Draft** (hidden from site) or **Published** (visible).
5. **Save**.

### Editing or deleting

- **Posts** list → click a row to open. Edit and **Save**, or use **Delete** (confirm when prompted).
- Only **Published** posts appear on the homepage, Lab/Notes filtered views, and detail pages. Drafts are visible only in Admin.

---

## Notes

**Notes** are for learnings, reflections, or short entries (no summary required).

1. **Content** → **Notes** → **Create New**.
2. **Title**, **Slug**, **Body**, **Published At** are the main fields. **Tags**, **Hero**, and **Updated At** are optional.
3. Localize (EN/FR) and set **Status** (Draft / Published) as for Posts.
4. **Save**.

Notes appear on the **Notes** page and in the main feed.

---

## Experiments (Lab)

**Experiments** are for tools, playgrounds, and “Lab” entries.

1. **Content** → **Experiments** → **Create New**.
2. Same core fields as Posts (Title, Slug, Summary, Body, Published At, Tags, Hero).
3. **Meta** (optional): **What**, **Why**, **Learned** — short text shown on cards and detail.
4. Localize and set Status, then **Save**.

Experiments appear on the **Lab** page and in the main feed.

---

## Media

1. **Content** → **Media** → **Upload** (or drag and drop).
2. **Alt** is required (for accessibility).
3. Uploaded files can be chosen as **Hero** on Posts, Notes, and Experiments.

Supported: images (e.g. PNG, JPEG, WebP). Sizes like thumbnail and hero are generated automatically.

---

## Comments

Comments are tied to a **Post** or optionally a **Note**.

- **Content** → **Comments**.
- Each comment has: **Author Name**, **Author Email**, **Body**, **Post** (required), **Note** (optional), **Status** (Pending / Approved / Rejected).
- Only **Approved** comments are shown on the site. Use **Pending** to hide until you review; **Rejected** to hide permanently.
- To add a comment from the site you need a public form (see [Development Guide](development-guide.md)); otherwise create or approve them in Admin.

---

## Localization (EN/FR)

- Posts, Notes, and Experiments support **English** and **French**.
- In the document editor, use the **locale** dropdown (e.g. "English", "French") to switch the form to that language.
- Fill in Title, Slug, Body, etc. for each locale. The site shows the version that matches the visitor’s route (`/en/` or `/fr/`).
- If a translation is missing, Payload can fall back to the default locale (configured in Payload).

---

## Drafts vs Published

- **Draft** — not shown on the public site (feed, detail, Lab, Notes). Use for work-in-progress.
- **Published** — visible everywhere. Switch to Published when the entry is ready.
- You can save as Draft, then change Status to Published and Save when ready to go live.

---

## Feed and navigation

- **Home** — all published Posts, Notes, and Experiments in one chronological feed (newest first). Toggle to **Timeline** view (grouped by year).
- **Lab** — only Experiments.
- **Notes** — only Notes.
- **About** — static page (not managed in Payload).
- Detail URLs: `/en/post/<slug>`, `/en/note/<slug>`, `/en/experiment/<slug>` (and `/fr/...` for French).

---

## Theme and language (visitor)

- Visitors can switch **dark / light** theme via the left nav; the choice is stored in the browser.
- Visitors can switch **EN / FR** via the language switcher; the route and content locale update accordingly.

If you need help with Admin access, backups, or roles, see [Deploy Guide](deploy-guide.md) and [Development Guide](development-guide.md).
