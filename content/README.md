# Content (Payload CMS)

Blog content is **no longer stored in this folder**. The site uses [Payload CMS](https://payloadcms.com) as a headless CMS.

## Where content lives

- **Posts, Notes, Experiments, Comments, Media, Users**: managed in the Payload Admin panel at **`/admin`**.
- **Localization**: Posts, Notes, and Experiments support English and French; edit each locale in the admin.
- **Drafts**: content with status "draft" is hidden from the public site until published.

## Creating and editing content

1. Open [http://localhost:3000/admin](http://localhost:3000/admin) (or your deployed `/admin` URL).
2. Log in with your Payload user.
3. Use **Posts**, **Notes**, or **Experiments** to create or edit entries. Set slug, title, body (Markdown), publishedAt, tags, and optional hero image.
4. Use **Media** to upload images.
5. Use **Comments** to approve or reject comments on posts and notes.

The `content/entries/` folder (if present) is **legacy** from the previous file-based CMS and is not read by the app. You can archive or delete it.
