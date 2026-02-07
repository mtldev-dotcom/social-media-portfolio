import type { CollectionConfig } from "payload";
import { autoGenerateSlug } from "../hooks";
import { translationStatusField } from "../fields/translationStatus";

/**
 * Posts — blog posts. Localized (en/fr), draft/publish, hero image.
 */
export const Posts: CollectionConfig = {
  slug: "posts",
  hooks: {
    beforeChange: [autoGenerateSlug],
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "publishedAt", "updatedAt"],
    group: "Content",
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { _status: { equals: "published" } };
      return true;
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: false,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Auto-generated from title.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      localized: true,
    },
    {
      name: "body",
      type: "textarea",
      localized: true,
      admin: { description: "Markdown supported on frontend." },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      admin: { date: { pickerAppearance: "dayAndTime" }, position: "sidebar" },
    },
    {
      name: "updatedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text", required: true }],
      admin: { position: "sidebar" },
    },
    {
      name: "hero",
      type: "upload",
      relationTo: "media",
      admin: { position: "sidebar" },
    },
    translationStatusField,
  ],
};
