# Content Authoring (Payload Admin)

How to add, edit, and manage blog content using Payload CMS.

---

## Where content lives

All content is managed in **Payload Admin** at **`/admin`** (e.g. [http://localhost:3000/admin](http://localhost:3000/admin)).

- **Posts** — blog posts (title, slug, summary, body, publishedAt, tags, hero)
- **Notes** — learnings and reflections (title, slug, body, publishedAt, tags, hero)
- **Experiments** — Lab entries (title, slug, summary, body, publishedAt, tags, hero, meta: what/why/learned)
- **Media** — uploads for hero and inline use
- **Comments** — approve or reject comments on posts and notes
- **Users** — admin users (login for `/admin`)

---

## First-time setup

1. Run `npm run dev` and open `/admin`.
2. Create your first user (email + password). This user can log in and manage all content.
3. Optionally add **Media** uploads, then create **Posts**, **Notes**, or **Experiments**.

---

## Creating a post, note, or experiment

1. Log in at `/admin`.
2. Open **Posts**, **Notes**, or **Experiments** in the sidebar.
3. Click **Create New**.
4. Fill in:
   - **Title** (and **Slug**; often auto-generated from title)
   - **Body** (Markdown; supported on the frontend)
   - **Published At** (required)
   - **Tags** (optional)
   - **Hero** (optional — upload or select from Media)
   - For Experiments: **Summary** and **Meta** (what, why, learned) optional
5. Use the **locale** switcher (EN/FR) to add or edit the same document in another language.
6. Save as **Draft** to hide from the site, or set status to **Published** when ready.

---

## Draft vs Published

- **Draft** — hidden from all public views (feed, detail, lab, notes).
- **Published** — visible on the site.
- Only published documents are returned by the frontend data layer.

---

## Comments

- Comments are created (e.g. via a future public form or by you in Admin) and linked to a **Post** or **Note**.
- Set **Status** to **Approved** for the comment to appear on the site; **Pending** or **Rejected** keeps it hidden.

---

## Localization (EN/FR)

- Posts, Notes, and Experiments have **localized** fields (title, slug, body, summary, etc.).
- Switch locale in the document editor to add or edit the French (or English) version.
- The frontend requests content for the current route locale (`/en/` or `/fr/`).
