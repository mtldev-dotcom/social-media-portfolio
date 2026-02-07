# Task 06: Testing Setup

> **Priority**: 🟡 RECOMMENDED
> **Estimated Time**: 30-45 minutes
> **Dependencies**: Tasks 01-05

---

## Overview

Set up Vitest for unit testing and create tests for critical functionality.

---

## Step 1: Install Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom happy-dom
```

---

## Step 2: Create Vitest Config

**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

---

## Step 3: Create Test Setup

**File**: `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
```

---

## Step 4: Add Test Script

**File**: `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

---

## Step 5: Create formatSlug Tests

**File**: `tests/formatSlug.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { formatSlug } from '../payload/hooks/formatSlug';

describe('formatSlug', () => {
  it('converts to lowercase', () => {
    expect(formatSlug('HELLO WORLD')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(formatSlug('hello world')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(formatSlug('hello!@#$world')).toBe('helloworld');
  });

  it('normalizes accented characters', () => {
    expect(formatSlug('café résumé')).toBe('cafe-resume');
  });

  it('removes duplicate hyphens', () => {
    expect(formatSlug('hello---world')).toBe('hello-world');
  });

  it('trims leading/trailing hyphens', () => {
    expect(formatSlug('---hello---')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(formatSlug('')).toBe('');
  });
});
```

---

## Step 6: Create Translation Service Tests

**File**: `tests/translation.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';

// Mock OpenAI
vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Bonjour le monde' } }],
        }),
      },
    };
  },
}));

describe('translateText', () => {
  it('returns empty string for empty input', async () => {
    const { translateText } = await import('../payload/services/openaiTranslation');
    const result = await translateText('', 'fr');
    expect(result).toBe('');
  });
});
```

---

## Step 7: Run Tests

```bash
npm run test
```

**Expected**: All tests pass.

---

## Verification

```bash
npm run test:run
npm run build
```

---

## Files Changed

| File | Action |
|------|--------|
| `vitest.config.ts` | CREATE |
| `tests/setup.ts` | CREATE |
| `tests/formatSlug.test.ts` | CREATE |
| `tests/translation.test.ts` | CREATE |
| `package.json` | MODIFY |

---

## Summary

All tasks complete! You now have:
- ✅ Security fixes
- ✅ i18n middleware
- ✅ Bug fixes
- ✅ Auto-generated slugs
- ✅ Manual translation API
- ✅ Testing infrastructure
