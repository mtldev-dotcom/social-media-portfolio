import type { CollectionConfig } from "payload";

/**
 * Comments — related to Posts (and optionally Notes). Moderation via status.
 */
export const Comments: CollectionConfig = {
  slug: "comments",
  admin: {
    useAsTitle: "authorName",
    defaultColumns: ["authorName", "post", "status", "createdAt"],
    group: "Content",
  },
  access: {
    read: ({ req: { user } }) => {
      // Public sees only approved
      if (!user) return { status: { equals: "approved" } };
      return true;
    },
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "authorName",
      type: "text",
      required: true,
      admin: { description: "Display name (no login required)." },
    },
    {
      name: "authorEmail",
      type: "email",
      required: true,
      admin: { description: "Not shown publicly; for moderation." },
    },
    {
      name: "body",
      type: "textarea",
      required: true,
    },
    {
      name: "post",
      type: "relationship",
      relationTo: "posts",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "note",
      type: "relationship",
      relationTo: "notes",
      admin: { position: "sidebar", description: "Optional; for comments on notes." },
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
      defaultValue: "pending",
      required: true,
      admin: { position: "sidebar" },
    },
  ],
  timestamps: true,
};
