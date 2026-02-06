import path from "path";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* Standalone output for Docker deployments (copies only needed files). */
  output: "standalone",
  /* Include @swc/helpers in standalone trace (SWC-injected runtime dep, often missed). */
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@swc/helpers/**/*"],
  },
  /* Dedupe React so single context; resolve @payload-config. (Do not alias @payloadcms/ui — breaks /shared subpath.) */
  webpack: (config) => {
    const cwd = process.cwd();
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@payload-config": path.resolve(cwd, "payload.config.ts"),
      react: path.resolve(cwd, "node_modules/react"),
      "react-dom": path.resolve(cwd, "node_modules/react-dom"),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@payload-config": "./payload.config.ts",
    },
  },
};

/**
 * Wraps the Next.js config with next-intl's plugin.
 * By default it looks for i18n/request.ts for server-side locale resolution.
 */
const withNextIntl = createNextIntlPlugin();

/** Payload plugin must wrap the final config for DB/Next compatibility. */
export default withPayload(withNextIntl(nextConfig));
