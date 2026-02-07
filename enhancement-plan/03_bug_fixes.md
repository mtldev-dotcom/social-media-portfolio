# Task 03: Bug Fixes

> **Priority**: 🟠 MEDIUM - Quality improvements
> **Estimated Time**: 20-30 minutes
> **Dependencies**: Tasks 01-02

---

## Overview

This task addresses several bugs and missing features identified in the codebase analysis:

1. Media `alt` field not localized
2. Hardcoded "back to feed" text on detail page
3. Add missing translation keys to messages files

---

## Bug 1: Localize Media Alt Field

### 1.1 Problem

The Media collection's `alt` field is not localized, meaning the same alt text is used for both English and French versions of images. This is bad for SEO and accessibility.

**Current Code** (`payload/collections/Media.ts`):
```typescript
fields: [
  {
    name: "alt",
    type: "text",
    required: true,
  },
],
```

### 1.2 Solution

Add `localized: true` to the alt field.

### 1.3 Implementation

**File**: `payload/collections/Media.ts`

Replace the fields array with:

```typescript
fields: [
  {
    name: "alt",
    type: "text",
    required: true,
    localized: true,
    admin: {
      description: "Describe the image for screen readers and SEO.",
    },
  },
],
```

### 1.4 Full Updated File

```typescript
import type { CollectionConfig } from "payload";

/**
 * Media — uploads for hero images and inline media.
 * Public read; create/update/delete for authenticated users.
 */
export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 1024, position: "centre" },
      { name: "hero", width: 1920, height: undefined, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: "Content",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Describe the image for screen readers and SEO.",
      },
    },
  ],
};
```

### 1.5 Database Migration Note

Since you're starting fresh (existing content can be deleted), no migration is needed. If you had existing media, you'd need to update alt text for each locale.

---

## Bug 2: Translate "Back to Feed" Link

### 2.1 Problem

The detail page has hardcoded English text that doesn't get translated:

**Current Code** (`app/[locale]/[type]/[slug]/page.tsx`, line 100):
```tsx
<Link href="/" ...>
  ← back to feed
</Link>
```

### 2.2 Solution

1. Add translation keys to messages files
2. Use `getTranslations()` in the component

### 2.3 Add Translation Keys

**File**: `messages/en.json`

Add this new section (insert after the "footer" section):

```json
"detail": {
  "backToFeed": "← back to feed"
}
```

**File**: `messages/fr.json`

Add the French translation:

```json
"detail": {
  "backToFeed": "← retour au fil"
}
```

### 2.4 Update the Detail Page

**File**: `app/[locale]/[type]/[slug]/page.tsx`

**Step 1**: Add import for getTranslations (around line 3):

```typescript
import { setRequestLocale, getTranslations } from "next-intl/server";
```

**Step 2**: Get translations in the component (after setRequestLocale, around line 78):

```typescript
export default async function EntryDetailPage({ params }: Props) {
  const { locale, type: rawType, slug } = await params;
  setRequestLocale(locale);
  
  // Add this line
  const t = await getTranslations("detail");

  const entryType = parseType(rawType);
  // ... rest of code
```

**Step 3**: Replace the hardcoded text (around line 100):

```tsx
{/* Back link */}
<Link
  href="/"
  className="inline-block text-xs text-muted transition-colors hover:text-foreground"
>
  {t("backToFeed")}
</Link>
```

### 2.5 Full Updated Section

The complete page component should include:

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
// ... other imports

export default async function EntryDetailPage({ params }: Props) {
  const { locale, type: rawType, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("detail");

  const entryType = parseType(rawType);
  if (!entryType) notFound();

  const entry = await getEntryBySlug(locale as Locale, entryType, slug);
  if (!entry) notFound();

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1260px] px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[72px_minmax(0,1fr)_360px]">
          <div className="md:pr-0">
            <LeftNav />
          </div>

          <main className="space-y-4">
            {/* Back link - now translated */}
            <Link
              href="/"
              className="inline-block text-xs text-muted transition-colors hover:text-foreground"
            >
              {t("backToFeed")}
            </Link>

            <EntryDetail entry={entry} />
            {/* ... rest of component */}
          </main>
          
          {/* ... right rail */}
        </div>
      </div>
    </div>
  );
}
```

---

## Bug 3: Complete Translation Keys Audit

### 3.1 Audit Existing Translation Keys

Run a quick check to find any other hardcoded strings:

```bash
# Search for obvious hardcoded strings in components
grep -r "\"[A-Z].*\"" --include="*.tsx" components/
grep -r "'[A-Z].*'" --include="*.tsx" components/
```

### 3.2 Common Patterns to Check

Look for these patterns in TSX files:
- `<span>Some Text</span>` (should use `{t("key")}`)
- `title="Tooltip"` (should be translated)
- `placeholder="Enter..."` (should be translated)
- `aria-label="..."` (should be translated for accessibility)

### 3.3 Add Any Missing Keys

If you find additional hardcoded strings, follow this pattern:

1. Add key to `messages/en.json`
2. Add French translation to `messages/fr.json`
3. Import `useTranslations` (client) or `getTranslations` (server)
4. Replace hardcoded string with `t("keyName")`

---

## Verification Steps

### Test 1: Media Alt Localization

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/admin`
3. Navigate to Media collection
4. Create or edit a media item
5. **Expected**: Alt field should show a locale switcher (EN/FR tabs)

### Test 2: Back to Feed Translation

1. Navigate to any detail page: `http://localhost:3000/en/post/some-slug`
2. **Expected**: Link says "← back to feed"
3. Navigate to French version: `http://localhost:3000/fr/post/some-slug`
4. **Expected**: Link says "← retour au fil"

### Test 3: Build Verification

```bash
npm run build
```

**Expected**: Build completes without errors.

### Test 4: TypeScript Check

```bash
npx tsc --noEmit
```

**Expected**: No type errors related to translation keys.

---

## Troubleshooting

### Issue: Translation Key Not Found

**Symptoms**: `t("keyName")` returns the key name instead of translated text

**Solutions**:
1. Verify the key exists in both `messages/en.json` and `messages/fr.json`
2. Check for typos in the key name
3. Ensure the namespace is correct (e.g., `getTranslations("detail")`)
4. Restart the dev server

### Issue: Media Alt Not Showing Locale Tabs

**Symptoms**: Alt field doesn't have EN/FR tabs in admin

**Solutions**:
1. Verify `localized: true` is set in the field config
2. Regenerate Payload types: run `npm run dev` and let it rebuild
3. Check payload.config.ts has localization enabled

---

## Completion Checklist

- [ ] Media alt field has `localized: true`
- [ ] `messages/en.json` has "detail.backToFeed" key
- [ ] `messages/fr.json` has "detail.backToFeed" key  
- [ ] Detail page imports `getTranslations`
- [ ] Detail page uses `t("backToFeed")` for link text
- [ ] Back link shows in English on `/en/*` routes
- [ ] Back link shows in French on `/fr/*` routes
- [ ] Build completes without errors
- [ ] No TypeScript errors

---

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `payload/collections/Media.ts` | MODIFY | Add `localized: true` to alt field |
| `messages/en.json` | MODIFY | Add "detail" section with "backToFeed" |
| `messages/fr.json` | MODIFY | Add "detail" section with "backToFeed" |
| `app/[locale]/[type]/[slug]/page.tsx` | MODIFY | Use translations for back link |

---

## Next Task

Proceed to: **[04_auto_slug_generation.md](./04_auto_slug_generation.md)**
