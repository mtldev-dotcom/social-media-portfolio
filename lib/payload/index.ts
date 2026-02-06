/**
 * Payload CMS data layer — barrel export with React cache() for request deduplication.
 */
import { cache } from "react";
import {
  getAllEntries as _getAllEntries,
  getEntryBySlug as _getEntryBySlug,
  getEntriesByType as _getEntriesByType,
  getTimeline as _getTimeline,
  getAllSlugs as _getAllSlugs,
  getCommentsForPost as _getCommentsForPost,
  getCommentsForNote as _getCommentsForNote,
} from "./loader";

export const getAllEntries = cache(_getAllEntries);
export const getEntryBySlug = cache(_getEntryBySlug);
export const getEntriesByType = cache(_getEntriesByType);
export const getTimeline = cache(_getTimeline);
export const getAllSlugs = cache(_getAllSlugs);
export const getCommentsForPost = cache(_getCommentsForPost);
export const getCommentsForNote = cache(_getCommentsForNote);

export type { BlogEntry, BlogEntryType, BlogComment, Locale } from "./types";

export const BLOG_ENTRY_TYPES = ["POST", "NOTE", "EXPERIMENT"] as const;
