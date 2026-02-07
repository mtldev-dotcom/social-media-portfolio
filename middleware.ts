import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * next-intl middleware for automatic locale handling.
 *
 * Features:
 * - Detects user's preferred locale from Accept-Language header
 * - Redirects / to /{defaultLocale}
 * - Adds locale prefix to all public routes
 * - Preserves locale in cookies for subsequent visits
 */
export default createMiddleware(routing);

/**
 * Matcher configuration:
 * - Match all pathnames except:
 *   - /api routes (Payload CMS API)
 *   - /admin routes (Payload Admin Panel)
 *   - /_next (Next.js internals)
 *   - Static files (favicon, images, etc.)
 */
export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/admin` or contain a dot (static files)
    '/((?!api|_next|admin|.*\\..*).*)',
    // Always run for root
    '/',
  ],
};
