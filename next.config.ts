import path from "path";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* Standalone output for Docker deployments (copies only needed files). */
  output: "standalone",
  /* Allow next/image to load Payload media from /api/media/file/... (dev + prod). */
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/api/**" },
      { protocol: "https", hostname: "localhost", port: "", pathname: "/api/**" },
    ],
  },
  /* Include @swc/helpers in standalone trace (SWC-injected runtime dep, often missed). */
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@swc/helpers/**/*"],
  },
  /* Resolve @payload-config. Do not alias react/react-dom — breaks Next.js LayoutRouterContext (useContext null). */
  webpack: (config) => {
    const cwd = process.cwd();
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@payload-config": path.resolve(cwd, "payload.config.ts"),
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
