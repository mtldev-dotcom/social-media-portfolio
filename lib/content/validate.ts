import { ENTRY_STATUSES, ENTRY_TYPES, LOCALES } from "./types";
import type { Entry } from "./types";

/** Regex for safe slugs: lowercase alphanumeric + hyphens. */
const SLUG_RE = /^[a-z0-9-]+$/;

/**
 * Validates a parsed JSON object as a content Entry.
 * Returns an array of error messages. Empty array = valid.
 *
 * Preconditions: `data` is a parsed JSON object (not null).
 * Postconditions: if no errors, `data` satisfies the Entry type contract.
 */
export function validateEntry(data: unknown): string[] {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return ["Entry must be a JSON object."];
  }

  const obj = data as Record<string, unknown>;

  /* Required string fields */
  for (const field of ["id", "type", "slug", "locale", "status", "publishedAt"]) {
    if (typeof obj[field] !== "string" || (obj[field] as string).trim() === "") {
      errors.push(`Missing or empty required field: "${field}".`);
    }
  }

  if (errors.length > 0) return errors;

  /* Type must be a valid EntryType */
  if (!ENTRY_TYPES.includes(obj.type as Entry["type"])) {
    errors.push(
      `Invalid type "${obj.type}". Must be one of: ${ENTRY_TYPES.join(", ")}.`
    );
  }

  /* Status must be a valid EntryStatus */
  if (!ENTRY_STATUSES.includes(obj.status as Entry["status"])) {
    errors.push(
      `Invalid status "${obj.status}". Must be one of: ${ENTRY_STATUSES.join(", ")}.`
    );
  }

  /* Locale must be a valid Locale */
  if (!LOCALES.includes(obj.locale as Entry["locale"])) {
    errors.push(
      `Invalid locale "${obj.locale}". Must be one of: ${LOCALES.join(", ")}.`
    );
  }

  /* Slug must be safe */
  if (typeof obj.slug === "string" && !SLUG_RE.test(obj.slug)) {
    errors.push(
      `Invalid slug "${obj.slug}". Must match /^[a-z0-9-]+$/.`
    );
  }

  /* publishedAt must parse as a valid date */
  if (typeof obj.publishedAt === "string") {
    const d = new Date(obj.publishedAt);
    if (isNaN(d.getTime())) {
      errors.push(
        `Invalid publishedAt "${obj.publishedAt}". Must be a valid ISO 8601 date.`
      );
    }
  }

  /* updatedAt is optional but must parse if present */
  if (obj.updatedAt !== undefined && typeof obj.updatedAt === "string") {
    const d = new Date(obj.updatedAt);
    if (isNaN(d.getTime())) {
      errors.push(
        `Invalid updatedAt "${obj.updatedAt}". Must be a valid ISO 8601 date.`
      );
    }
  }

  /* tags must be an array of strings if present */
  if (obj.tags !== undefined) {
    if (!Array.isArray(obj.tags) || !obj.tags.every((t) => typeof t === "string")) {
      errors.push(`"tags" must be an array of strings.`);
    }
  }

  return errors;
}
