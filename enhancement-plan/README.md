# Enhancement Plan Overview

This folder contains 6 detailed task files for enhancing the Next.js + PayloadCMS blog.

## Task Order

| # | File | Priority | Time Est. |
|---|------|----------|-----------|
| 1 | [01_security_fixes.md](./01_security_fixes.md) | 🔴 Critical | 15-20 min |
| 2 | [02_middleware_setup.md](./02_middleware_setup.md) | 🟠 High | 10-15 min |
| 3 | [03_bug_fixes.md](./03_bug_fixes.md) | 🟠 Medium | 20-30 min |
| 4 | [04_auto_slug_generation.md](./04_auto_slug_generation.md) | 🟢 Enhancement | 30-45 min |
| 5 | [05_manual_translation.md](./05_manual_translation.md) | 🟢 Enhancement | 45-60 min |
| 6 | [06_testing_setup.md](./06_testing_setup.md) | 🟡 Recommended | 30-45 min |

**Total Estimated Time**: 2.5 - 4 hours

## Confirmed Design Decisions

- **Translation API**: OpenAI (gpt-4o-mini)
- **Slug Behavior**: Shared across locales
- **Translation Trigger**: Manual via admin/API
- **Existing Content**: Fresh start (can be deleted)

## Quick Start

1. Complete tasks in order (1 → 6)
2. Each task includes verification steps
3. Run `npm run build` after each task
4. Commit after each completed task

## Files Created Per Task

```
Task 01: Security Fixes
├── payload/collections/Users.ts (MODIFY)
├── payload.config.ts (MODIFY)
└── .env.example (CREATE)

Task 02: Middleware Setup
├── middleware.ts (CREATE)
└── proxy.ts (DELETE)

Task 03: Bug Fixes
├── payload/collections/Media.ts (MODIFY)
├── messages/en.json (MODIFY)
├── messages/fr.json (MODIFY)
└── app/[locale]/[type]/[slug]/page.tsx (MODIFY)

Task 04: Auto-Slug Generation
├── payload/hooks/formatSlug.ts (CREATE)
├── payload/hooks/autoSlug.ts (CREATE)
├── payload/hooks/index.ts (CREATE)
├── payload/collections/Posts.ts (MODIFY)
├── payload/collections/Notes.ts (MODIFY)
└── payload/collections/Experiments.ts (MODIFY)

Task 05: Manual Translation
├── payload/services/openaiTranslation.ts (CREATE)
├── payload/fields/translationStatus.ts (CREATE)
├── app/api/translate/route.ts (CREATE)
├── payload/collections/Posts.ts (MODIFY)
├── payload/collections/Notes.ts (MODIFY)
└── payload/collections/Experiments.ts (MODIFY)

Task 06: Testing Setup
├── vitest.config.ts (CREATE)
├── tests/setup.ts (CREATE)
├── tests/formatSlug.test.ts (CREATE)
├── tests/translation.test.ts (CREATE)
└── package.json (MODIFY)
```
