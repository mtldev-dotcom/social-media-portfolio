/**
 * Blog entry type for frontend — maps from Payload collections (posts, notes, experiments).
 * Keeps shape compatible with existing Feed and detail components.
 */
export type BlogEntryType = "POST" | "NOTE" | "EXPERIMENT";

export type Locale = "en" | "fr";

export type BlogEntry = {
  id: string;
  type: BlogEntryType;
  slug: string;
  locale: Locale;
  status: "draft" | "published";
  publishedAt: string;
  updatedAt?: string;
  title?: string;
  summary?: string;
  body?: string;
  tags?: string[];
  hero?: { kind: "image"; src: string; alt?: string };
  meta?: Record<string, unknown>;
};

export type BlogComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};
