# Task 04: Auto-Generated Slugs

> **Priority**: 🟢 ENHANCEMENT
> **Estimated Time**: 30-45 minutes
> **Dependencies**: Tasks 01-03

---

## Overview

Implement automatic slug generation from title when creating posts/notes/experiments.
- **Shared across locales** (same slug for EN/FR)
- **Auto-generated on create** (from title)
- **URL-safe** (lowercase, hyphens, no special chars)

---

## Step 1: Create Slug Utility

**File**: `payload/hooks/formatSlug.ts`

```typescript
/**
 * Converts a string into a URL-safe slug.
 */
export function formatSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}
```

---

## Step 2: Create beforeChange Hook

**File**: `payload/hooks/autoSlug.ts`

```typescript
import type { CollectionBeforeChangeHook } from 'payload';
import { formatSlug } from './formatSlug';

export const autoGenerateSlug: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  const title = data?.title as string | undefined;
  
  const shouldGenerate = 
    (operation === 'create' && !data?.slug) ||
    (operation === 'update' && !data?.slug && !originalDoc?.slug);

  if (shouldGenerate && title && title.trim()) {
    return { ...data, slug: formatSlug(title) };
  }
  return data;
};
```

---

## Step 3: Create Hooks Index

**File**: `payload/hooks/index.ts`

```typescript
export { formatSlug } from './formatSlug';
export { autoGenerateSlug } from './autoSlug';
```

---

## Step 4: Update Collections

For each collection (Posts, Notes, Experiments):

### 4.1 Add Import

```typescript
import { autoGenerateSlug } from "../hooks";
```

### 4.2 Add Hooks Config

```typescript
hooks: {
  beforeChange: [autoGenerateSlug],
},
```

### 4.3 Update Slug Field

```typescript
{
  name: "slug",
  type: "text",
  required: false,  // Auto-generated
  unique: true,
  index: true,
  admin: { 
    position: "sidebar",
    description: "Auto-generated from title.",
  },
},
```

**Note**: Remove `localized: true` from slug field.

---

## Verification

1. Create new Post with title "My Test Post"
2. Leave slug empty, save
3. **Expected**: Slug auto-generates as "my-test-post"

```bash
npm run build
```

---

## Files Changed

| File | Action |
|------|--------|
| `payload/hooks/formatSlug.ts` | CREATE |
| `payload/hooks/autoSlug.ts` | CREATE |
| `payload/hooks/index.ts` | CREATE |
| `payload/collections/Posts.ts` | MODIFY |
| `payload/collections/Notes.ts` | MODIFY |
| `payload/collections/Experiments.ts` | MODIFY |

---

## Next Task

→ **[05_manual_translation.md](./05_manual_translation.md)**
