"use client";

import { useEffect } from "react";

/**
 * Sets document.documentElement.lang from route locale (en/fr).
 * Used when root layout owns <html> and locale comes from [locale] segment.
 */
export function SetLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
