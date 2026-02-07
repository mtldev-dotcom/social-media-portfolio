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
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
  ],
};
