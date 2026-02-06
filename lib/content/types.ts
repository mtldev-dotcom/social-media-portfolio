/**
 * Content type definitions for the git-based CMS.
 * See /docs/content-types.md for the taxonomy.
 */

export type EntryType =
  | "POST"
  | "NOTE"
  | "PROJECT"
  | "EXPERIMENT"
  | "STORY"
  | "ACTIVITY";

export type EntryStatus = "draft" | "published";

export type Locale = "en" | "fr";

/**
 * Entry — a single content item in the file-based CMS.
 *
 * Each entry is stored as one JSON file per locale:
 *   content/entries/{locale}/{slug}.{type}.json
 *
 * Entries sharing the same `id` across locales are considered translations
 * of the same piece of content.
 */
export type Entry = {
  /** Stable identifier that links translations across locales. */
  id: string;
  /** Content type from the taxonomy. */
  type: EntryType;
  /** Sub-kind variant (e.g. "text", "testimonial", "building", "status"). */
  variant?: string;
  /** URL-safe slug (a-z, 0-9, hyphens only). */
  slug: string;
  /** Which locale this file represents. */
  locale: Locale;
  /** Draft entries are hidden from public views. */
  status: EntryStatus;
  /** ISO 8601 date string. Used for sorting and timeline grouping. */
  publishedAt: string;
  /** ISO 8601 date string. Optional last-updated timestamp. */
  updatedAt?: string;
  /** Display title. Optional for some types (e.g. status ACTIVITY). */
  title?: string;
  /** Short summary / description. */
  summary?: string;
  /** Long-form body content (Markdown string). */
  body?: string;
  /** Tags for filtering and display. */
  tags?: string[];
  /** Hero media (image or video). */
  hero?: { kind: "image" | "video"; src: string; alt?: string };
  /** External links related to this entry. */
  links?: { label: string; href: string }[];
  /** Arbitrary metadata (e.g. stats for posts, bullets for stories). */
  meta?: Record<string, unknown>;
};

/** Valid entry type values for runtime checking. */
export const ENTRY_TYPES: EntryType[] = [
  "POST",
  "NOTE",
  "PROJECT",
  "EXPERIMENT",
  "STORY",
  "ACTIVITY",
];

/** Valid entry status values for runtime checking. */
export const ENTRY_STATUSES: EntryStatus[] = ["draft", "published"];

/** Valid locale values for runtime checking. */
export const LOCALES: Locale[] = ["en", "fr"];
