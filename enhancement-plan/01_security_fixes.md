# Task 01: Security Fixes

> **Priority**: 🔴 CRITICAL - Must be completed before any production deployment
> **Estimated Time**: 15-20 minutes
> **Dependencies**: None

---

## Overview

This task addresses two critical security vulnerabilities in the PayloadCMS configuration:
1. Users collection allows unauthenticated user creation
2. Weak fallback secret in production

---

## Pre-requisites

- [ ] Ensure you have the project running locally: `npm run dev`
- [ ] Have access to the Payload admin panel at `http://localhost:3000/admin`
- [ ] Backup the SQLite database: copy `payload.db` to `payload.db.backup`

---

## Step 1: Fix Users Collection Access Control

### 1.1 Open the Users Collection File

**File**: `payload/collections/Users.ts`

### 1.2 Locate the Access Configuration

Find this code block (around line 15-20):

```typescript
access: {
  read: () => true,
  create: () => true,  // ⚠️ SECURITY ISSUE - Anyone can create admin accounts
  update: ({ req: { user } }) => Boolean(user),
  delete: ({ req: { user } }) => Boolean(user),
},
```

### 1.3 Replace with Secure Access Control

Replace the entire `access` block with:

```typescript
access: {
  read: () => true,
  create: async ({ req }) => {
    // Allow first user creation (bootstrap admin)
    // After that, require authentication
    const payload = req.payload;
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    });
    
    // If no users exist, allow creation (first admin)
    if (existingUsers.totalDocs === 0) {
      return true;
    }
    
    // Otherwise, require authenticated user
    return Boolean(req.user);
  },
  update: ({ req: { user } }) => Boolean(user),
  delete: ({ req: { user } }) => Boolean(user),
},
```

### 1.4 Verify the Change

The full file should now look like:

```typescript
import type { CollectionConfig } from "payload";

/**
 * Users — auth-enabled collection for admin login.
 * Used by Payload admin panel; single author for blog.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email"],
    group: "Admin",
  },
  access: {
    read: () => true,
    create: async ({ req }) => {
      // Allow first user creation (bootstrap admin)
      const payload = req.payload;
      const existingUsers = await payload.find({
        collection: 'users',
        limit: 1,
      });
      
      // If no users exist, allow creation (first admin)
      if (existingUsers.totalDocs === 0) {
        return true;
      }
      
      // Otherwise, require authenticated user
      return Boolean(req.user);
    },
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
  ],
};
```

---

## Step 2: Remove Fallback Secret

### 2.1 Open the Payload Config File

**File**: `payload.config.ts`

### 2.2 Locate the Secret Configuration

Find this line (around line 27):

```typescript
secret: process.env.PAYLOAD_SECRET || "change-me-in-production",
```

### 2.3 Replace with Strict Validation

Replace with:

```typescript
secret: (() => {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) {
    throw new Error(
      'PAYLOAD_SECRET environment variable is required. ' +
      'Generate one with: openssl rand -base64 32'
    );
  }
  if (secret.length < 32) {
    throw new Error(
      'PAYLOAD_SECRET must be at least 32 characters long for security.'
    );
  }
  return secret;
})(),
```

### 2.4 Create .env File (if not exists)

**File**: `.env`

Ensure it contains:

```env
PAYLOAD_SECRET=your-secure-random-string-at-least-32-chars
DATABASE_URI=file:./payload.db
```

**Generate a secure secret:**
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2.5 Create .env.example

**File**: `.env.example`

```env
# Required: Generate with `openssl rand -base64 32`
PAYLOAD_SECRET=

# Database connection string (SQLite for dev)
DATABASE_URI=file:./payload.db

# OpenAI API key for translation feature
OPENAI_API_KEY=

# Server URL (for image paths)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## Step 3: Update .gitignore

### 3.1 Verify .env is Ignored

Open `.gitignore` and ensure `.env` is listed:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
```

---

## Verification Steps

### Test 1: Server Startup Validation

1. Remove `PAYLOAD_SECRET` from `.env` temporarily
2. Run `npm run dev`
3. **Expected**: Server should fail with error message about missing secret
4. Restore `PAYLOAD_SECRET` in `.env`

### Test 2: User Creation Access

1. Start the server: `npm run dev`
2. Clear existing users (optional):
   - Delete `payload.db` for fresh start
3. Navigate to `http://localhost:3000/admin`
4. Create first admin user → Should succeed
5. Log out
6. Try to access create user page directly → Should redirect to login

### Test 3: Build Verification

```bash
npm run build
```

**Expected**: Build should complete without errors.

---

## Rollback Plan

If something goes wrong:

1. Restore the backup: `copy payload.db.backup payload.db`
2. Revert `Users.ts` to original:
   ```typescript
   access: {
     read: () => true,
     create: () => true,
     update: ({ req: { user } }) => Boolean(user),
     delete: ({ req: { user } }) => Boolean(user),
   },
   ```
3. Revert `payload.config.ts` to original:
   ```typescript
   secret: process.env.PAYLOAD_SECRET || "change-me-in-production",
   ```

---

## Completion Checklist

- [ ] Users.ts access control updated
- [ ] payload.config.ts secret validation added
- [ ] .env file has PAYLOAD_SECRET set
- [ ] .env.example created with all required vars
- [ ] .gitignore includes .env
- [ ] Server starts successfully
- [ ] Build completes without errors
- [ ] First user creation works
- [ ] Unauthorized user creation is blocked

---

## Next Task

Proceed to: **[02_middleware_setup.md](./02_middleware_setup.md)**
