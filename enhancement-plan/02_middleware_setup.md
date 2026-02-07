# Task 02: Middleware Setup

> **Priority**: 🟠 HIGH - Required for proper i18n functionality
> **Estimated Time**: 10-15 minutes
> **Dependencies**: Task 01 (Security Fixes)

---

## Overview

Create a `middleware.ts` file at the project root to enable next-intl locale detection and automatic redirects. Currently, the project has i18n configured but lacks the middleware to:
- Detect user's preferred language from browser
- Redirect root `/` to `/en` or `/fr`
- Handle locale prefixing for all routes

---

## Pre-requisites

- [ ] Task 01 completed (security fixes)
- [ ] Project builds successfully: `npm run build`

---

## Step 1: Create the Middleware File

### 1.1 Create New File

**File**: `middleware.ts` (in project root, same level as `next.config.ts`)

### 1.2 Add Middleware Code

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * next-intl middleware for automatic locale handling.
 * 
 * Features:
 * - Detects user's preferred locale from Accept-Language header
 * - Redirects / to /{defaultLocale}
 * - Adds locale prefix to all public routes
 * - Preserves locale in cookies for subsequent visits
 */
export default createMiddleware(routing);

/**
 * Matcher configuration:
 * - Match all pathnames except:
 *   - /api routes (Payload CMS API)
 *   - /admin routes (Payload Admin Panel)
 *   - /_next (Next.js internals)
 *   - Static files (favicon, images, etc.)
 */
export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/admin` or contain a dot (static files)
    '/((?!api|_next|admin|.*\\..*).*)',
    // Always run for root
    '/',
  ],
};
```

---

## Step 2: Verify Routing Configuration

### 2.1 Check i18n/routing.ts

Open `i18n/routing.ts` and verify it matches:

```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
});
```

### 2.2 Check i18n/request.ts

Open `i18n/request.ts` and verify it exists with proper configuration:

```typescript
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

---

## Step 3: Handle Existing proxy.ts

### 3.1 Check if proxy.ts Exists

According to the codebase analysis, there's a `proxy.ts` in the root directory. Check its contents.

### 3.2 Evaluate Conflict

If `proxy.ts` contains middleware-like code for locale handling, it may conflict with the new `middleware.ts`.

**Options**:
- **If proxy.ts is a duplicate/old attempt**: Delete it
- **If proxy.ts has other functionality**: Merge into middleware.ts

### 3.3 Delete or Rename proxy.ts

If it's no longer needed:

```bash
# Rename to backup (safer)
mv proxy.ts proxy.ts.backup

# Or delete if confident
rm proxy.ts
```

---

## Step 4: Update next.config.ts (if needed)

### 4.1 Verify Plugin Order

Open `next.config.ts` and ensure the order is correct:

```typescript
import path from "path";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/api/**" },
      { protocol: "https", hostname: "localhost", port: "", pathname: "/api/**" },
    ],
  },
  // ... rest of config
};

// Order matters: next-intl wrapper first, then Payload
const withNextIntl = createNextIntlPlugin();
export default withPayload(withNextIntl(nextConfig));
```

---

## Step 5: Test Locale Detection

### 5.1 Start Development Server

```bash
npm run dev
```

### 5.2 Test Root Redirect

1. Open browser to `http://localhost:3000/`
2. **Expected**: Redirects to `http://localhost:3000/en` (or `/fr` based on browser language)

### 5.3 Test Browser Language Detection

1. Open Chrome DevTools → Network conditions → User agent
2. Change Accept-Language to `fr-FR,fr;q=0.9`
3. Navigate to `http://localhost:3000/` in incognito
4. **Expected**: Should redirect to `/fr`

### 5.4 Test Direct Locale Access

1. Navigate to `http://localhost:3000/en`
2. **Expected**: English version loads
3. Navigate to `http://localhost:3000/fr`
4. **Expected**: French version loads

### 5.5 Test Admin Panel Exclusion

1. Navigate to `http://localhost:3000/admin`
2. **Expected**: Payload admin panel loads (NOT redirected to `/en/admin`)

### 5.6 Test API Route Exclusion

1. Navigate to `http://localhost:3000/api/posts`
2. **Expected**: JSON response from Payload API (NOT redirected)

---

## Verification Steps

### Test 1: Build Verification

```bash
npm run build
```

**Expected**: Build completes without errors.

### Test 2: Middleware Loading

Check terminal output when running `npm run dev`. You should see:
```
- middleware was compiled successfully
```

### Test 3: Redirect Chain

Using curl to test redirects:

```bash
# Test root redirect
curl -I http://localhost:3000/
# Expected: 307 redirect to /en

# Test with French Accept-Language
curl -I -H "Accept-Language: fr-FR" http://localhost:3000/
# Expected: 307 redirect to /fr
```

---

## Troubleshooting

### Issue: Middleware Not Running

**Symptoms**: Root `/` shows 404 or doesn't redirect

**Solutions**:
1. Ensure file is named exactly `middleware.ts` (not `middleware.tsx`)
2. Ensure it's in the project root (same level as `next.config.ts`)
3. Restart the dev server: `npm run dev`
4. Clear `.next` folder: `rm -rf .next && npm run dev`

### Issue: Admin Panel Redirected

**Symptoms**: `/admin` redirects to `/en/admin`

**Solutions**:
1. Check matcher config excludes `admin`:
   ```typescript
   matcher: ['/((?!api|_next|admin|.*\\..*).*)', '/'],
   ```
2. Verify the regex is correct

### Issue: Infinite Redirect Loop

**Symptoms**: Browser shows "too many redirects"

**Solutions**:
1. Clear browser cookies
2. Check for conflicts with `proxy.ts`
3. Verify routing config has valid locales

---

## Completion Checklist

- [ ] middleware.ts created in project root
- [ ] proxy.ts removed or renamed (if conflicting)
- [ ] Root `/` redirects to `/en`
- [ ] Browser language detection works
- [ ] `/admin` is not affected by middleware
- [ ] `/api/*` routes are not affected
- [ ] Build completes successfully
- [ ] Both `/en` and `/fr` routes work correctly

---

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `middleware.ts` | CREATE | next-intl middleware for locale detection |
| `proxy.ts` | DELETE | Remove if conflicting with middleware |

---

## Next Task

Proceed to: **[03_bug_fixes.md](./03_bug_fixes.md)**
