import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale-aware proxy (Next.js 16 equivalent of middleware.ts).
 * - Detects locale from Accept-Language header, cookies, or URL prefix.
 * - Redirects bare "/" to the appropriate locale (e.g. /en/ or /fr/).
 * - Persists locale preference in the NEXT_LOCALE cookie.
 *
 * Note: In Next.js 16, this file replaces the former middleware.ts.
 */
export default createMiddleware(routing);

export const config = {
  /*
   * Match all pathnames EXCEPT:
   * - /api, /trpc, /_next, /_vercel  (internal routes)
   * - Paths containing a dot (static assets like favicon.ico, images, etc.)
   */
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
