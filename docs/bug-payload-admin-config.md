# Bug: Payload Admin — “Cannot destructure property 'config'” (Runtime)

**Status:** Fix applied (pending verification)  
**Severity:** High (blocks Admin UI)  
**Last updated:** 2026-02-06

### Fix applied (2026-02-06)

**Root cause (client-side):** `useConfig()` in `@payloadcms/ui` (e.g. CodeEditor) was reading from an empty React context because **duplicate package instances** were loaded — e.g. `@payloadcms/richtext-lexical` and `@payloadcms/next` each depend on `@payloadcms/ui`, and transitive `next` versions differed. See Payload [troubleshooting](https://payloadcms.com/docs/troubleshooting/troubleshooting) and GitHub #14660.

**Changes:**

1. **Pin exact versions (no ^):** All `@payloadcms/*` and `payload` set to **3.75.0** in `package.json`; added direct dependency **@payloadcms/ui@3.75.0**.
2. **npm overrides:** `@payloadcms/ui`, `next`, `react`, `react-dom` forced to single resolution so only one copy of each is installed.
3. **Webpack dedup aliases** in `next.config.ts`: `react`, `react-dom`, `@payloadcms/ui`, `@payload-config` resolve to project root `node_modules` / `payload.config.ts` so the app and Payload admin share one instance.
4. **Layout:** Payload layout now wraps children in **RootLayout** with `config={configPromise}`, `importMap`, `serverFunction` so the admin gets the correct config context.
5. **Admin page:** Pass `config` directly to `RootPage` and `generatePageMetadata` (no extra `Promise.resolve` wrapper).
6. **Clean install (required):** After pulling these changes, delete `node_modules`, `.next`, and `package-lock.json`, then run `npm install` and `npm run dev`. Stale or duplicated modules are a common cause of this error.

**Verification:** Run clean install, then `npm run dev`, open `http://localhost:3000/admin` and confirm the "Create First User" form loads without 500. Run `npm run build` to ensure no regressions.

---

## 1. Summary

When visiting the Payload Admin UI (e.g. `/admin` or `/admin/create-first-user`), the server returns **500** and the runtime throws:

```text
TypeError: Cannot destructure property 'config' of 'se(...)' as it is undefined.
    at ignore-listed frames {
  digest: '4078065643'
}
```

The minified name `se(...)` is internal to Payload/Next; the failure occurs when code tries to destructure `config` from a value that is **undefined**. This prevents the Admin panel and the “create first user” flow from loading. The public frontend (blog, lab, notes) and the Payload REST API may still work.

---

## 2. When and where it happens

| Situation | Result |
|-----------|--------|
| `GET /admin` | 500 (after redirects; error during render) |
| `GET /admin/create-first-user` | 500, error in terminal |
| `GET /admin/...` (other admin routes) | Likely 500 (same failure path) |
| `GET /api/...` (Payload REST) | May work (different code path) |
| Public site (`/`, `/en`, `/lab`, etc.) | Works (no Payload admin) |
| `npm run dev` (plain, no `--turbopack`) | Error still occurs |
| `npm run build` | Build can succeed; error is runtime on dev |

**Environment:** Next.js 16.1.6, Payload 3.75.x, React 19, Windows, Node 20+. Observed with default `next dev` (no Turbopack flag; Next 16 does not support `--no-turbopack`).

---

## 3. Technical analysis

### 3.1 Call chain (from code inspection)

1. **Admin page**  
   `app/(payload)/admin/[[...segments]]/page.tsx` renders `RootPage` from `@payloadcms/next/views`, passing `config` (or `configPromise`), `params`, `searchParams`, `importMap`.

2. **RootPage** (`@payloadcms/next` → `views/Root/index.js`)  
   - Awaits `configPromise` to get `config`.  
   - Calls `initReq({ configPromise: config, importMap, key: 'initPage', overrides: { ... } })`.  
   - Note: it passes the **resolved** config object as `configPromise` (naming is confusing but initReq does `await configPromise`).

3. **initReq** (`@payloadcms/next` → `utilities/initReq.js`)  
   - Uses a React `cache()`-backed “selective” cache.  
   - In the cached factory: `config = await configPromise`, then `payload = await getPayload({ config, cron: true, importMap })`.  
   - Returns `{ req }` where `req.payload` is that `payload` instance.

4. **getPayload** (Payload core)  
   - Initializes/caches the Payload instance.  
   - If initialization fails or returns undefined in an edge case, `payload` would be undefined.

5. **RootPage (continued)**  
   - Destructures `req.payload` and passes `payload` into `getRouteData({ ... payload ... })`.

6. **getRouteData** (`@payloadcms/next` → `views/Root/getRouteData.js`)  
   - First line: `const { config } = payload;`  
   - If `payload` is **undefined**, this throws: **“Cannot destructure property 'config' of … as it is undefined.”**  
   - The minified name in the stack may appear as `se(...)` (the `payload` argument or a wrapper).

So the **observable bug** is: `payload` is undefined when it reaches `getRouteData`, i.e. either:

- `getPayload({ config, cron: true, importMap })` is returning undefined in this context, or  
- The cached result in `initReq` is (or was) undefined so `req.payload` is undefined.

### 3.2 Config loading in this project

- **Config file:** `payload.config.ts` at project root (buildConfig with collections, SQLite, localization).  
- **Payload app imports:**  
  - Previously used alias `import config from "@payload-config"`.  
  - Later changed to **relative imports** so the same file is loaded from the `(payload)` route group:
    - Admin page: `import config from "../../../../payload.config"`.
    - Layout: `import config from "../../payload.config"`.
    - API route: `import config from "../../../../payload.config"`.
  - Admin page and layout also pass `configPromise = Promise.resolve(config)` into Payload’s RootPage / generatePageMetadata / handleServerFunctions.

So config is loaded and passed as both object and as `Promise.resolve(config)`. The failure is not a simple “config is undefined at the page level” (then we’d fail earlier); it’s that **somewhere after initReq, the Payload instance (`payload`) is undefined** when used in getRouteData.

### 3.3 Possible causes (hypotheses)

1. **Caching / request scope**  
   React `cache()` and the selective cache key (`'global'`) might behave differently under Next 16 or in the (payload) route group, so the first or subsequent request gets an incomplete or undefined cached value.

2. **Payload init returning undefined**  
   In some edge case (e.g. config shape, async init, or bundling), `getPayload(...)` might resolve to undefined instead of throwing.

3. **Bundling / module context**  
   The (payload) routes might be bundled or evaluated in a context where Payload’s init (or dependencies like DB adapter, sharp) behave differently, leading to an undefined instance.

4. **Known Payload + Turbopack / RSC issues**  
   Community reports and docs indicate that Payload 3 can have issues when:
   - Turbopack is used (config/Node resolution in RSC).
   - Config is imported in contexts where Node-only modules are not available.

   Here we are not using Turbopack (plain `next dev`), but the same kind of “wrong context” or “wrong bundle” could still occur with Next 16’s default dev setup.

---

## 4. What was tried (no fix yet)

| Attempt | Change | Outcome |
|--------|--------|--------|
| 1. Promise wrapping | Pass `configPromise = Promise.resolve(config)` into RootPage and generatePageMetadata. | No change; error persists. |
| 2. Layout / handleServerFunctions | Pass `configPromise` into handleServerFunctions in `app/(payload)/layout.tsx`. | No change. |
| 3. Relative imports | Replace `@payload-config` with relative paths in admin page, layout, and API route so config is loaded from project root. | No change; error persists. |
| 4. Disable Turbopack | Use `next dev --no-turbopack` so dev uses Webpack. | **Invalid:** Next.js 16 does not support `--no-turbopack` (“unknown option”); reverted to `next dev`. |
| 5. Doc note | Development guide: “Do not pass `--turbopack` if you see Payload config errors.” | N/A (no code fix). |

None of these resolved the runtime error. The dev script is back to plain `next dev`.

---

## 5. Situations to avoid (until resolved)

- **Relying on Payload Admin in dev** for this project until the bug is fixed or a supported workaround is in place.
- **Adding more Turbopack usage** (e.g. enabling `--turbopack` if it becomes available) without verifying Payload Admin works.
- **Changing config import style** (e.g. dynamic import or moving config) without a clear hypothesis; could make the issue harder to trace.
- **Assuming the REST API is broken:** the 500 is in the Admin UI render path; `/api/*` might still work for CRUD.

---

## 6. Impact

- **Admins:** Cannot use the Payload Admin UI to create the first user or manage content via the panel.
- **Workaround:** Create the first user (or manage data) via Payload’s REST API, CLI, or programmatic Local API if the Payload instance is available in other contexts (e.g. API routes or server code outside the admin page).
- **Build / production:** Production build can succeed; if the same code path runs in production, the same error could occur when visiting `/admin` in production.

---

## 7. Open questions and next steps

- Confirm in Payload/Next 16 docs or issues whether:
  - `getPayload()` is ever expected to return undefined.
  - There is a recommended way to run Payload Admin with Next 16 when Turbopack cannot be disabled.
- Add defensive checks (e.g. in a fork or patch of the admin page) to log or throw a clear error when `payload` is undefined before calling getRouteData, to confirm the exact failure point.
- Test production build: run `npm run build` and `npm run start`, then open `/admin` to see if the error reproduces (different bundling might change behavior).
- Check for Payload or @payloadcms/next updates that address “config destructure undefined” or Next 16 compatibility.

---

## 8. References

- Payload 3 + Next: [Payload CMS Docs](https://payloadcms.com/docs).
- Next.js 16 config: [next.config.js (turbopack)](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack) (no documented way to disable Turbopack for dev).
- Community: Reports of “Cannot destructure property” with Payload when config/Node modules are used in RSC or with Turbopack.
- This project: `app/(payload)/admin/[[...segments]]/page.tsx`, `app/(payload)/layout.tsx`, `app/(payload)/api/[...slug]/route.ts`, `payload.config.ts`, `docs/development-guide.md`.

---

*This document is for tracking and triage only. No code changes are made in this bug doc.*



# Cursor AI Prompt: Fix Payload Admin "Cannot destructure property 'config'" Error

## Context

I'm running **Payload CMS 3.75.x** with **Next.js 16.1.6** (React 19, SQLite adapter, Windows, Node 20+). The Payload Admin UI at `/admin` crashes with a **500 error**:

```
TypeError: Cannot destructure property 'config' of 'se(...)' as it is undefined.
```

The root cause: `getPayload()` returns `undefined` (or the cached result from `initReq` yields `req.payload === undefined`), so when `getRouteData` does `const { config } = payload`, it blows up.

The public site and REST API (`/api/*`) work fine — only the Admin UI render path is broken.

## Key Files to Inspect and Fix

1. `app/(payload)/admin/[[...segments]]/page.tsx` — renders `RootPage`, passes `config`/`configPromise`
2. `app/(payload)/layout.tsx` — passes config into `handleServerFunctions`
3. `app/(payload)/api/[...slug]/route.ts` — API route (working, for reference)
4. `payload.config.ts` (project root) — the Payload config (`buildConfig(...)`)
5. `next.config.ts` / `next.config.mjs` — Next.js config (withPayload wrapper, turbopack settings)
6. `package.json` — check exact versions of `payload`, `@payloadcms/next`, `next`

## What Has Already Been Tried (Don't Repeat These)

- Wrapping config in `Promise.resolve(config)` as `configPromise` — no fix
- Passing `configPromise` into `handleServerFunctions` in layout — no fix
- Replacing `@payload-config` alias with relative imports (`../../../../payload.config`) — no fix
- `next dev --no-turbopack` — invalid flag on Next.js 16

## What I Need You To Do

### Step 1: Diagnose
- Read all the key files listed above and `node_modules/@payloadcms/next/dist/views/Root/index.js` (or `.mjs`) to see exactly how `RootPage` calls `initReq` and `getRouteData`.
- Check if `@payload-config` alias is properly configured in `next.config` (Payload's `withPayload()` wrapper should set this up).
- Check if there's a version mismatch between `payload` core and `@payloadcms/next` — they must be the same minor version.
- Look at `tsconfig.json` for any path alias issues with `@payload-config`.

### Step 2: Check Compatibility
- Search for known issues with **Payload 3.75.x + Next.js 16**. Payload 3 was originally built for Next.js 15 — Next.js 16 changed the dev server (Turbopack is now the default with no opt-out) and may have broken Payload's RSC config resolution.
- If Next.js 16 is incompatible with this Payload version, **downgrade Next.js to 15.x** (the latest 15.x that Payload 3.75 officially supports) and adjust any Next.js 16-specific APIs accordingly.
- Alternatively, check if there's a newer Payload version that explicitly supports Next.js 16.

### Step 3: Fix (in priority order)

**Option A — Version alignment (most likely fix):**
- Downgrade `next` to `15.x` (e.g. `15.3.x` or whatever Payload 3.75 documents as supported).
- Ensure `@payloadcms/next`, `payload`, and all `@payloadcms/*` packages are on compatible versions.
- Restore the `@payload-config` alias import pattern (the standard Payload approach) instead of relative imports.
- Verify `next dev` works with `/admin`.

**Option B — Fix the config wiring (if staying on Next 16):**
- Ensure `@payload-config` alias resolves correctly under Turbopack by adding it to `next.config.ts` turbopack resolve aliases:
  ```ts
  // next.config.ts
  const nextConfig = {
    turbopack: {
      resolveAlias: {
        '@payload-config': './payload.config.ts',
      },
    },
  };
  export default withPayload(nextConfig);
  ```
- In the admin page, use `import configPromise from '@payload-config'` (not relative imports, not `Promise.resolve()`). Payload exports a config **promise** from that alias, not a resolved object.
- Make sure the admin page passes `configPromise` directly (not wrapped) to `RootPage`:
  ```tsx
  import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
  import configPromise from '@payload-config'
  import { importMap } from '../importMap'

  export default async function Page({ params, searchParams }) {
    return RootPage({ config: configPromise, params, searchParams, importMap })
  }
  ```

**Option C — Defensive patch (temporary):**
- If the above don't work, add a guard in the admin page before calling RootPage:
  ```tsx
  import { getPayload } from 'payload'
  import configPromise from '@payload-config'

  export default async function Page({ params, searchParams }) {
    const payload = await getPayload({ config: await configPromise })
    if (!payload) {
      throw new Error('Payload failed to initialize — check DB connection, config, and package versions.')
    }
    // proceed with RootPage
  }
  ```

### Step 4: Verify
- Run `npm run dev` and open `http://localhost:3000/admin`
- Confirm the "create first user" page loads without 500
- Confirm the public site still works
- Run `npm run build` to ensure no build regressions

## Important Notes
- **Do not** add `--turbopack` or `--no-turbopack` flags — Next 16 manages this automatically.
- **Do not** change config import style without understanding whether `@payload-config` exports a promise or resolved object (it's a promise in standard Payload setups).
- The most common cause of this exact error in the community is **version mismatch between Next.js and Payload** or **incorrect config import pattern**. Start there.



# Cursor AI Prompt: Fix Payload Admin "Cannot destructure property 'config'" Error

## The Error

On `localhost:3000/admin/create-first-user`, the admin UI crashes with:

```
Runtime TypeError
Cannot destructure property 'config' of 'se(...)' as it is undefined.
    at CodeEditor.tsx:87:31
```

Stack shows it originates from `@payloadcms/ui` — specifically a `useConfig()` hook returning `undefined` inside a client component. The server compiles fine, Payload initializes (schema pulled, email warning shown), but the **client-side React context for Payload config is undefined**.

**Environment:** Next.js 15.4.10 (Webpack mode), Payload 3.75.x, React 19, Windows, Node 20+, SQLite adapter.

## Root Cause (Per Payload's Official Troubleshooting)

This is a **duplicate dependency** problem. From Payload's docs:

> "This happens because one package imports a hook (most commonly `useConfig`) from version A while the context provider comes from version B. The fix is always the same: make sure every Payload-related and React package resolves to the same module."

The `useConfig()` hook in the CodeEditor (or CreateFirstUser) component is importing from a different instance of `@payloadcms/ui` than the one providing the context. This causes the hook to read from an empty/different React context, returning `undefined`.

## Key Files

1. `package.json` — check ALL `@payloadcms/*` package versions
2. `package-lock.json` (or `pnpm-lock.yaml`) — check for duplicate resolutions
3. `next.config.ts` — webpack resolve aliases
4. `tsconfig.json` — path aliases
5. `app/(payload)/admin/[[...segments]]/page.tsx`
6. `app/(payload)/layout.tsx`
7. `payload.config.ts`

## What I Need You To Do

### Step 1: Audit for Duplicate Dependencies

Run these commands and analyze the output:

```bash
# Check for duplicate Payload packages
npm ls @payloadcms/ui
npm ls @payloadcms/next
npm ls payload
npm ls react
npm ls react-dom

# Look for version mismatches — every @payloadcms/* package MUST be the exact same version
npm ls | grep @payloadcms
```

If you see **more than one version** of any `@payloadcms/*` package, or more than one copy of `react` / `react-dom`, that's the bug.

### Step 2: Pin All Payload Packages to the Same Exact Version

In `package.json`, ensure ALL `@payloadcms/*` packages and `payload` itself use the **exact same version** with no caret (`^`) or tilde (`~`):

```json
{
  "dependencies": {
    "payload": "3.75.0",
    "@payloadcms/next": "3.75.0",
    "@payloadcms/ui": "3.75.0",
    "@payloadcms/db-sqlite": "3.75.0",
    "@payloadcms/richtext-lexical": "3.75.0"
    // ... every other @payloadcms/* package must match
  }
}
```

Check the actual installed version with `npm ls payload` and pin everything to that exact number. **Do not use `^` prefixes** — they allow floating to different patch versions which causes duplication.

Also ensure only ONE version of `react` and `react-dom` exists:
```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
```

### Step 3: Clean Install

This is critical — stale `node_modules` is often the actual cause:

```bash
# Delete everything and start fresh
rm -rf node_modules
rm -rf .next
rm package-lock.json

# Reinstall
npm install
```

If using pnpm (recommended by Payload):
```bash
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
```

### Step 4: Add Webpack Dedup Aliases (if still broken after clean install)

In `next.config.ts`, force Webpack to resolve all Payload and React packages to a single instance:

```ts
import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Force single instance of React
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      // Force single instance of Payload UI (prevents duplicate context)
      '@payloadcms/ui': path.resolve(__dirname, 'node_modules/@payloadcms/ui'),
      // Ensure @payload-config resolves
      '@payload-config': path.resolve(__dirname, 'payload.config.ts'),
    }
    return config
  },
}

export default withPayload(nextConfig)
```

### Step 5: Verify Config Import Pattern

Make sure the admin page uses the standard Payload pattern:

```tsx
// app/(payload)/admin/[[...segments]]/page.tsx
import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap })

export default Page
```

**Important:** `config` from `@payload-config` is already a Promise — do NOT wrap it in `Promise.resolve()`. Pass it directly.

Same for layout:
```tsx
// app/(payload)/layout.tsx
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './importMap'
import './custom.scss'

type Args = { children: React.ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

### Step 6: Verify

```bash
npm run dev
# Open http://localhost:3000/admin
# Should see "Create First User" form, no 500 error
# Also verify: http://localhost:3000 (public site still works)

npm run build
# Should complete without errors
```

## Summary of the Fix

The error is NOT about config loading or Turbopack or Next.js version. It's about **duplicate package instances** causing React context to break. The `useConfig()` hook inside `@payloadcms/ui` components reads from a Payload ConfigProvider, but if a second copy of `@payloadcms/ui` is loaded, the hook reads from an empty context and returns `undefined`.

The fix is: pin versions, clean install, and optionally force webpack aliases to deduplicate.

## References

- Payload official troubleshooting: https://payloadcms.com/docs/troubleshooting/troubleshooting
- GitHub issue #14660 (exact same error): https://github.com/payloadcms/payload/issues/14660
- GitHub issue #12640 (useConfig undefined): https://github.com/payloadcms/payload/issues/12640