import { defineRouting } from "next-intl/routing";

/**
 * Central routing configuration for next-intl.
 * - Supported locales: English (en) and French (fr).
 * - Default locale: English.
 * - All routes are prefixed with the locale segment (e.g. /en/, /fr/).
 */
export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
});
