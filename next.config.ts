import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

/**
 * Wraps the Next.js config with next-intl's plugin.
 * By default it looks for i18n/request.ts for server-side locale resolution.
 */
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
