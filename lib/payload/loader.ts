/**
 * Payload CMS data layer — replaces file-based content loader.
 * Queries Payload Local API with locale; maps docs to BlogEntry shape for Feed/detail.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { BlogEntry, BlogEntryType, BlogComment, Locale } from "./types";

const COLLECTION_MAP: Record<BlogEntryType, "posts" | "notes" | "experiments"> = {
  POST: "posts",
  NOTE: "notes",
  EXPERIMENT: "experiments",
};

function mapDocToEntry(
  doc: Record<string, unknown>,
  type: BlogEntryType,
  locale: Locale
): BlogEntry {
  const hero = doc.hero as { url?: string; filename?: string; alt?: string } | undefined;
  const tagsArr = doc.tags as { tag?: string }[] | undefined;
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
  const heroSrc =
    hero?.url ?? (hero?.filename ? `/${hero.filename}` : undefined);
  const src =
    heroSrc && !heroSrc.startsWith("http")
      ? `${baseUrl || "http://localhost:3000"}${heroSrc.startsWith("/") ? "" : "/"}${heroSrc}`
      : heroSrc;

  return {
    id: String(doc.id),
    type,
    slug: String(doc.slug ?? ""),
    locale,
    status: (doc._status as "draft" | "published") ?? "draft",
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt as string).toISOString() : "",
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt as string).toISOString()
      : undefined,
    title: doc.title as string | undefined,
    summary: doc.summary as string | undefined,
    body: doc.body as string | undefined,
    tags: tagsArr?.map((t) => t.tag).filter(Boolean) as string[] | undefined,
    hero: src
      ? { kind: "image", src, alt: hero?.alt }
      : undefined,
    meta: doc.meta as Record<string, unknown> | undefined,
  };
}

/**
 * Fetch Payload instance (cached by getPayload).
 */
async function getPayloadInstance() {
  return getPayload({ config });
}

/**
 * All published entries (posts + notes + experiments) for a locale, merged and sorted by publishedAt desc.
 * Returns [] if DB/schema not ready (e.g. at build time before migrations).
 */
export async function getAllEntries(locale: Locale): Promise<BlogEntry[]> {
  try {
    const payload = await getPayloadInstance();
    const types: BlogEntryType[] = ["POST", "NOTE", "EXPERIMENT"];
    const all: BlogEntry[] = [];

    for (const type of types) {
      const collection = COLLECTION_MAP[type];
      const result = await payload.find({
        collection,
        locale,
        depth: 1,
        where: { _status: { equals: "published" } },
        sort: "-publishedAt",
        limit: 500,
      });
      for (const doc of result.docs) {
        all.push(mapDocToEntry(doc as Record<string, unknown>, type, locale));
      }
    }

    all.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return all;
  } catch {
    return [];
  }
}

/**
 * Single entry by type and slug for a locale. Returns null if not found or not published.
 * Returns null if DB/schema not ready.
 */
export async function getEntryBySlug(
  locale: Locale,
  type: BlogEntryType,
  slug: string
): Promise<BlogEntry | null> {
  try {
    const payload = await getPayloadInstance();
    const collection = COLLECTION_MAP[type];
    const result = await payload.find({
      collection,
      locale,
      depth: 1,
      where: {
        _status: { equals: "published" },
        slug: { equals: slug },
      },
      limit: 1,
    });

    const doc = result.docs[0];
    if (!doc) return null;
    return mapDocToEntry(doc as Record<string, unknown>, type, locale);
  } catch {
    return null;
  }
}

/**
 * All published entries of a given type for a locale, sorted by publishedAt desc.
 * Returns [] if DB/schema not ready.
 */
export async function getEntriesByType(
  locale: Locale,
  type: BlogEntryType
): Promise<BlogEntry[]> {
  try {
    const payload = await getPayloadInstance();
    const collection = COLLECTION_MAP[type];
    const result = await payload.find({
      collection,
      locale,
      depth: 1,
      where: { _status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 500,
    });
    return result.docs.map((doc) =>
      mapDocToEntry(doc as Record<string, unknown>, type, locale)
    );
  } catch {
    return [];
  }
}

/**
 * Entries grouped by year (publishedAt) for timeline view. Years descending.
 * Returns [] if DB/schema not ready.
 */
export async function getTimeline(
  locale: Locale
): Promise<{ year: number; entries: BlogEntry[] }[]> {
  const entries = await getAllEntries(locale);
  const grouped: Record<number, BlogEntry[]> = {};
  for (const entry of entries) {
    const year = new Date(entry.publishedAt).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(entry);
  }
  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)
    .map((year) => ({ year, entries: grouped[year] }));
}

/**
 * All (type, slug) pairs for a locale — for generateStaticParams.
 * Returns [] if DB/schema not ready (e.g. at build time).
 */
export async function getAllSlugs(
  locale: Locale
): Promise<{ type: BlogEntryType; slug: string }[]> {
  try {
    const entries = await getAllEntries(locale);
    return entries.map((e) => ({ type: e.type, slug: e.slug }));
  } catch {
    return [];
  }
}

/**
 * Comments for a post (approved only for public).
 */
export async function getCommentsForPost(
  postId: string
): Promise<BlogComment[]> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "comments",
      where: {
        post: { equals: postId },
        status: { equals: "approved" },
      },
      sort: "createdAt",
      limit: 200,
    });
    return result.docs.map((doc) => {
      const d = doc as Record<string, unknown>;
      return {
        id: String(d.id),
        authorName: String(d.authorName ?? ""),
        body: String(d.body ?? ""),
        createdAt: d.createdAt
          ? new Date(d.createdAt as string).toISOString()
          : "",
      };
    });
  } catch {
    return [];
  }
}

/**
 * Comments for a note (approved only for public).
 */
export async function getCommentsForNote(
  noteId: string
): Promise<BlogComment[]> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "comments",
      where: {
        note: { equals: noteId },
        status: { equals: "approved" },
      },
      sort: "createdAt",
      limit: 200,
    });
    return result.docs.map((doc) => {
      const d = doc as Record<string, unknown>;
      return {
        id: String(d.id),
        authorName: String(d.authorName ?? ""),
        body: String(d.body ?? ""),
        createdAt: d.createdAt
          ? new Date(d.createdAt as string).toISOString()
          : "",
      };
    });
  } catch {
    return [];
  }
}
