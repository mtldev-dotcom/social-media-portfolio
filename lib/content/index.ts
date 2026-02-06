/**
 * Content CMS barrel export.
 * Re-exports all loader functions and types with React cache() wrappers
 * for deduplication within a single server render pass.
 */
import { cache } from "react";
import {
  getAllEntries as _getAllEntries,
  getEntryBySlug as _getEntryBySlug,
  getEntriesByType as _getEntriesByType,
  getEntriesByTag as _getEntriesByTag,
  getTimeline as _getTimeline,
  getAllSlugs as _getAllSlugs,
} from "./loader";

/* Cached wrappers — deduplicate reads within a single render. */
export const getAllEntries = cache(_getAllEntries);
export const getEntryBySlug = cache(_getEntryBySlug);
export const getEntriesByType = cache(_getEntriesByType);
export const getEntriesByTag = cache(_getEntriesByTag);
export const getTimeline = cache(_getTimeline);
export const getAllSlugs = cache(_getAllSlugs);

/* Re-export types. */
export type { Entry, EntryType, EntryStatus, Locale } from "./types";
export { ENTRY_TYPES, ENTRY_STATUSES, LOCALES } from "./types";
