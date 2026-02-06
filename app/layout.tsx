/**
 * Root layout — fragment only. Do not render <html>/<body> here so that:
 * - Payload routes (/admin) use Payload's RootLayout as their single document.
 * - [locale] routes render their own <html>/<body> in app/[locale]/layout.tsx.
 * This avoids nesting <html> inside <body> (hydration error).
 */
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
