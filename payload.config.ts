/**
 * Payload CMS config — blog CMS (Posts, Notes, Experiments, Comments).
 * Localization: en, fr. DB: SQLite (dev) or set DATABASE_URI for Postgres/Mongo.
 */
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Posts } from "./payload/collections/Posts";
import { Notes } from "./payload/collections/Notes";
import { Experiments } from "./payload/collections/Experiments";
import { Comments } from "./payload/collections/Comments";

export default buildConfig({
  editor: lexicalEditor(),

  collections: [Users, Media, Posts, Notes, Experiments, Comments],

  localization: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    fallback: true,
  },

  secret: process.env.PAYLOAD_SECRET || "change-me-in-production",

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.db",
    },
  }),

  sharp,

  routes: {
    admin: "/admin",
    api: "/api",
  },
});
