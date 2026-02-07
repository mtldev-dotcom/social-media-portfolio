# Getting Started Guide

Run the blog locally and publish your first post in under 10 minutes.

---

## Prerequisites

- **Node.js** 20.9.0 or higher
- **npm** (or pnpm / yarn)
- A terminal and a browser

---

## 1. Clone and install

```bash
# Clone the repo (or use your existing project folder)
git clone <your-repo-url>
cd <project-directory>   # e.g. the folder name of your clone

# Install dependencies
npm install
```

---

## 2. Environment variables

Create a `.env` file in the project root:

```env
# Required — use a long random string in production
PAYLOAD_SECRET=change-me-to-a-secure-secret

# Optional for local dev — SQLite uses file:./payload.db by default
# DATABASE_URI=file:./payload.db
```

- **PAYLOAD_SECRET**: Required. Payload uses it for signing tokens. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` or `openssl rand -base64 32` or any secure random string.
- **DATABASE_URI**: Optional locally. Omit it to use the default SQLite file `./payload.db`. For production you will set this to a Postgres or MongoDB URL (see [Deploy Guide](deploy-guide.md)).

**Do not commit `.env`** — it should be in `.gitignore`.

---

## 3. Run the development server

```bash
npm run dev
```

- On first run, Payload will create the SQLite database and schema (e.g. `payload.db` in the project root).
- Open **http://localhost:3000** — you will be redirected to `/en/` or `/fr/` based on your browser language.
- Open **http://localhost:3000/admin** — this is the Payload Admin panel.

---

## 4. Create your first user

1. Go to **http://localhost:3000/admin**.
2. You will see the **Create first user** form (no login required yet).
3. Enter an **email** and **password** and submit.
4. You are now logged in and can access the Admin sidebar.

---

## 5. Add your first post

1. In the Admin sidebar, click **Posts** (under Content).
2. Click **Create New**.
3. Fill in:
   - **Title** (e.g. "Hello world")
   - **Slug** (e.g. `hello-world` — often auto-filled from title)
   - **Body** (Markdown supported; e.g. "This is my first post.")
   - **Published At** (pick a date/time)
4. Set status to **Published** (not Draft).
5. Click **Save**.

Your post will appear on the homepage feed at **http://localhost:3000/en/** (or `/fr/`). The detail URL will be **http://localhost:3000/en/post/hello-world**.

---

## 6. Optional: add a Note or Experiment

- **Notes**: Admin → **Notes** → Create New. Same idea as Posts; good for short learnings or reflections.
- **Experiments**: Admin → **Experiments** → Create New. Use for Lab entries (tools, playgrounds). You can optionally fill **Meta** (what, why, learned).

---

## 7. Optional: upload media

1. Admin → **Media** → **Upload**.
2. Upload an image and set **Alt** text.
3. When editing a Post, Note, or Experiment, you can select this media as the **Hero** image.

---

## Next steps

- **Content authoring**: See [User Guide](user-guide.md) for using the Admin panel (localization, drafts, comments).
- **Development**: See [Development Guide](development-guide.md) for project structure and extending the app.
- **Deploy**: See [Deploy Guide](deploy-guide.md) for putting the blog online with a production database.
