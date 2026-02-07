# Task 05: Manual Translation Feature

> **Priority**: 🟢 ENHANCEMENT
> **Estimated Time**: 45-60 minutes
> **Dependencies**: Tasks 01-04, OpenAI API key

---

## Overview

Implement manual translation via admin button using OpenAI gpt-4o-mini API.
- Manual trigger (not automatic)
- Translate from source locale to target locale
- Track translation status per document

---

## Prerequisites

- [ ] OpenAI API key available
- [ ] Install OpenAI SDK: `npm install openai`

---

## Step 1: Install OpenAI SDK

```bash
npm install openai
```

---

## Step 2: Update Environment Variables

**File**: `.env`

```env
OPENAI_API_KEY=sk-your-openai-key-here
```

**File**: `.env.example`

```env
OPENAI_API_KEY=
```

---

## Step 3: Create Translation Service

**File**: `payload/services/openaiTranslation.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type SupportedLocale = 'en' | 'fr';

const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  fr: 'French',
};

/**
 * Translates text using OpenAI GPT-4o-mini.
 */
export async function translateText(
  text: string,
  targetLocale: SupportedLocale
): Promise<string> {
  if (!text || !text.trim()) return text;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the following text to ${LOCALE_NAMES[targetLocale]}. 
Preserve all formatting, markdown, and line breaks exactly. 
Only output the translated text, nothing else.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content ?? text;
}

/**
 * Translates multiple fields at once.
 */
export async function translateFields(
  fields: Record<string, string | undefined>,
  targetLocale: SupportedLocale
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(fields)) {
    if (value && value.trim()) {
      result[key] = await translateText(value, targetLocale);
    }
  }
  
  return result;
}
```

---

## Step 4: Create Translation Status Field

**File**: `payload/fields/translationStatus.ts`

```typescript
import type { Field } from 'payload';

export const translationStatusField: Field = {
  name: 'translationStatus',
  type: 'select',
  options: [
    { label: 'Original', value: 'original' },
    { label: 'Pending', value: 'pending' },
    { label: 'Auto-Translated', value: 'auto' },
    { label: 'Reviewed', value: 'reviewed' },
  ],
  defaultValue: 'original',
  localized: true,
  admin: {
    position: 'sidebar',
    description: 'Translation status for this locale.',
  },
};
```

---

## Step 5: Create Translation API Route

**File**: `app/api/translate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { translateText } from '@/payload/services/openaiTranslation';
import type { SupportedLocale } from '@/payload/services/openaiTranslation';

type TranslateRequest = {
  collection: 'posts' | 'notes' | 'experiments';
  docId: string;
  sourceLocale: SupportedLocale;
  targetLocale: SupportedLocale;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as TranslateRequest;
    const { collection, docId, sourceLocale, targetLocale } = body;

    // Validate
    if (!collection || !docId || !sourceLocale || !targetLocale) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // Get source document
    const doc = await payload.findByID({
      collection,
      id: docId,
      locale: sourceLocale,
    });

    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Translate fields
    const translatedTitle = doc.title 
      ? await translateText(doc.title as string, targetLocale)
      : undefined;
    const translatedSummary = doc.summary
      ? await translateText(doc.summary as string, targetLocale)
      : undefined;
    const translatedBody = doc.body
      ? await translateText(doc.body as string, targetLocale)
      : undefined;

    // Update target locale
    await payload.update({
      collection,
      id: docId,
      locale: targetLocale,
      data: {
        ...(translatedTitle && { title: translatedTitle }),
        ...(translatedSummary && { summary: translatedSummary }),
        ...(translatedBody && { body: translatedBody }),
        translationStatus: 'auto',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Translated to ${targetLocale}`,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
```

---

## Step 6: Update Collections

For Posts, Notes, Experiments, add the translation status field:

```typescript
import { translationStatusField } from "../fields/translationStatus";

// In fields array, add:
fields: [
  // ... existing fields
  translationStatusField,
],
```

---

## Step 7: Test Translation

### Using cURL

```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "posts",
    "docId": "YOUR_POST_ID",
    "sourceLocale": "en",
    "targetLocale": "fr"
  }'
```

### Manual Test Steps

1. Create a Post in English
2. Note the document ID from URL
3. Run the cURL command above
4. Check French locale - should have translated content
5. Translation status should show "Auto-Translated"

---

## Verification

```bash
npm run build
```

**Expected**: Build succeeds.

---

## Files Changed

| File | Action |
|------|--------|
| `payload/services/openaiTranslation.ts` | CREATE |
| `payload/fields/translationStatus.ts` | CREATE |
| `app/api/translate/route.ts` | CREATE |
| `payload/collections/Posts.ts` | MODIFY |
| `payload/collections/Notes.ts` | MODIFY |
| `payload/collections/Experiments.ts` | MODIFY |

---

## Future Enhancement: Admin Button

To add a "Translate" button in admin UI, create a custom component:

**File**: `payload/admin/components/TranslateButton.tsx`

This requires PayloadCMS custom component setup - see PayloadCMS docs.

---

## Next Task

→ **[06_testing_setup.md](./06_testing_setup.md)**
