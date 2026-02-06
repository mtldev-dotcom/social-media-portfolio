import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Server-side request configuration for next-intl.
 * - Resolves the locale from the incoming request (typically the [locale] segment).
 * - Falls back to the default locale if the requested locale is unsupported.
 * - Dynamically loads the matching translation JSON file from /messages/.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
