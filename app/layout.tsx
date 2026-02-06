/**
 * Root layout — required so Payload routes (/admin, /api) and frontend share one document.
 * Frontend [locale] layout sets lang via client component; theme script runs there.
 */
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
