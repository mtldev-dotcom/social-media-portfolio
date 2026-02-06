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
    create: () => true,
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
