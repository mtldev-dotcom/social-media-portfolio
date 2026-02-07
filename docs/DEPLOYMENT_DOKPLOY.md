# 🚀 Deploying to Dokploy (VPS)

This guide walks you through deploying the Social Media Blog to your VPS using [Dokploy](https://dokploy.com/).

## Prerequisites

- A VPS with Dokploy installed and configured.
- A domain name pointing to your VPS.
- Valid GitHub repository (pushed).

---

## 1. Database Setup (PostgreSQL)

While the project uses SQLite for development, **PostgreSQL** is recommended for production to prevent data loss during deployments and ensure better performance.

### In Dokploy:
1. Go to your Project or create a new one.
2. Click **"Database"** → **"Create Database"**.
3. Select **PostgreSQL**.
4. Giving it a name (e.g., `payload-db`) and create.
5. Once created, copy the **Internal Connection URL** (e.g., `postgres://user:pass@dokploy-postgres:...`).

### Update Project Code (If switching to Postgres):
You need to install the Postgres adapter if you haven't:
```bash
npm install @payloadcms/db-postgres
```
And update `payload.config.ts`:
```typescript
import { postgresAdapter } from '@payloadcms/db-postgres';

// ...
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
// ...
```

> **Note:** If you strictly want to stick with **SQLite**, you MUST configure a persistent volume in Dokploy for the `payload.db` file, otherwise your data will be wiped on every deployment.

---

## 2. Environment Variables

In Dokploy, go to your Application → **Environment**. Add the following:

| Variable | Value / Description |
|----------|---------------------|
| `PAYLOAD_SECRET` | A long random string (generate with `openssl rand -base64 32`). |
| `DATABASE_URI` | Your PostgreSQL Connection URL from Step 1. |
| `NEXT_PUBLIC_SERVER_URL` | Your production domain (e.g., `https://blog.yourdomain.com`). |
| `OPEN_ROUTER_API_KEY` | Your OpenRouter API key for translations. |
| `NODE_ENV` | `production` |
| `PAYLOAD_CONFIG_PATH` | `payload.config.ts` (usually auto-detected but good to enforce). |

---

## 3. Application Deployment

1. **Create Application**:
   - Go to "Applications" → "Create Application".
   - Name: `social-media-blog`.
   - Select your Git Provider and Repository (`mtldev-dotcom/social-media-blog`).
   - Branch: `from-blog-main-dev` (or your production branch).

2. **Build Configuration**:
   - **Build Type**: `Nixpacks` (Recommended for Next.js) or `Dockerfile`.
   - If using **Nixpacks**, it usually auto-detects Next.js.
   - If using **Dockerfile**: The project should have a production Dockerfile. (If not, use Nixpacks).

3. **Persistent Volumes (Media)**:
   - Payload stores uploaded media in the `media` folder by default.
   - Go to **"Volumes"** (or Mounts).
   - Add a volume:
     - **Host Path**: `/var/lib/dokploy/volumes/media` (or any path on VPS).
     - **Container Path**: `/app/media` (Check your `payload.config.ts` for the upload path).
   - This ensures images aren't lost on redeploy.

4. **Domain Configuration**:
   - Go to **"Domains"**.
   - Add your domain: `blog.yourdomain.com`.
   - Enable **SSL** (Let's Encrypt).

5. **Deploy**:
   - Click **"Deploy"**.
   - Monitor the **Logs** tab.

---

## 4. Post-Deployment Checks

1. **Verify Admin Panel**:
   - Go to `https://blog.yourdomain.com/admin`.
   - Create your first admin user.

2. **Test Translation**:
   - Add a post and use the translation buttons to ensure the API key is working.

3. **Check Media**:
   - Upload an image to the Media collection to verify volume permissions.

---

## Troubleshooting

- **"Internal Server Error"**: Check `DATABASE_URI` and `PAYLOAD_SECRET`.
- **404 on API routes**: Ensure `NEXT_PUBLIC_SERVER_URL` matches your domain strictly.
- **Build Fails**: Check if `npm run build` works locally. Dokploy logs usually show the exact error.
