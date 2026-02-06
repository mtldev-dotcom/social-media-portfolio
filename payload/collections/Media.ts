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
    },
  ],
};
