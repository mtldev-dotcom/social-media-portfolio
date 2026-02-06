import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* Standalone output for Docker deployments (copies only needed files). */
  output: "standalone",
  /* Include @swc/helpers in standalone trace (SWC-injected runtime dep, often missed). */
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@swc/helpers/**/*"],
  },
};

/**
 * Wraps the Next.js config with next-intl's plugin.
 * By default it looks for i18n/request.ts for server-side locale resolution.
 */
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
