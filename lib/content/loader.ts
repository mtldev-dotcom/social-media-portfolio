import fs from "fs/promises";
import path from "path";
import { validateEntry } from "./validate";
import type { Entry, EntryType, Locale } from "./types";

/**
 * Root directory for content entries.
 * Resolved relative to the project root (process.cwd()).
 */
const ENTRIES_DIR = path.join(process.cwd(), "content", "entries");

/**
 * Reads and parses all JSON files in content/entries/{locale}/.
 * Validates each entry and filters out drafts by default.
 * Sorts by publishedAt descending (newest first).
 *
 * Preconditions: locale directory exists with .json files.
 * Postconditions: returns only valid, published entries sorted by date.
 * Error path: invalid entries are silently skipped (logged in dev).
 */
export async function getAllEntries(locale: Locale): Promise<Entry[]> {
  const dir = path.join(ENTRIES_DIR, locale);
  let files: string[];

  try {
    files = await fs.readdir(dir);
  } catch {
    /* Directory missing — return empty. */
    return [];
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const entries: Entry[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(dir, file);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(raw);
      const errors = validateEntry(data);

      if (errors.length > 0) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[content] Invalid entry ${file}:`, errors);
        }
        continue;
      }

      /* Filter out drafts. */
      if (data.status !== "published") continue;

      entries.push(data as Entry);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[content] Failed to read ${file}:`, err);
      }
    }
  }

  /* Sort newest first. */
  entries.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return entries;
}

/**
 * Finds a single entry by its type and slug.
 * Returns null if not found or not published.
 */
export async function getEntryBySlug(
  locale: Locale,
  type: EntryType,
  slug: string
): Promise<Entry | null> {
  const entries = await getAllEntries(locale);
  return (
    entries.find(
      (e) => e.type === type && e.slug === slug
    ) ?? null
  );
}

/**
 * Returns all published entries of a given type, sorted newest first.
 */
export async function getEntriesByType(
  locale: Locale,
  type: EntryType
): Promise<Entry[]> {
  const entries = await getAllEntries(locale);
  return entries.filter((e) => e.type === type);
}

/**
 * Returns all published entries that include a given tag (case-insensitive).
 */
export async function getEntriesByTag(
  locale: Locale,
  tag: string
): Promise<Entry[]> {
  const entries = await getAllEntries(locale);
  const lower = tag.toLowerCase();
  return entries.filter((e) =>
    e.tags?.some((t) => t.toLowerCase() === lower)
  );
}

/**
 * Groups entries by year from publishedAt. Returns years descending.
 * Used by the Timeline view.
 */
export async function getTimeline(
  locale: Locale
): Promise<{ year: number; entries: Entry[] }[]> {
  const entries = await getAllEntries(locale);
  const grouped: Record<number, Entry[]> = {};

  for (const entry of entries) {
    const year = new Date(entry.publishedAt).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(entry);
  }

  /* Sort years descending. */
  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)
    .map((year) => ({ year, entries: grouped[year] }));
}

/**
 * Returns all slugs with their types for generateStaticParams.
 * Used by detail pages to pre-render all entries at build time.
 */
export async function getAllSlugs(
  locale: Locale
): Promise<{ type: EntryType; slug: string }[]> {
  const entries = await getAllEntries(locale);
  return entries.map((e) => ({ type: e.type, slug: e.slug }));
}
