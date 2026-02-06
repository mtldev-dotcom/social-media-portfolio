"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import Image from "next/image";

/**
 * LanguageSwitcher
 * Shows a single flag button for the OTHER locale.
 * - If content is in English → show France flag (click to switch to FR).
 * - If content is in French → show USA flag (click to switch to EN).
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  /* The locale we switch TO (the opposite of current). */
  const targetLocale = locale === "en" ? "fr" : "en";
  const label = targetLocale === "en" ? t("switchToEn") : t("switchToFr");
  const flagSrc = targetLocale === "en" ? "/en.png" : "/fr.png";

  function switchLocale() {
    router.replace(pathname, { locale: targetLocale });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={label}
      title={label}
      className={
        "inline-flex h-10 w-10 items-center justify-center rounded-xl " +
        "border border-divider bg-surface-1 shadow-card " +
        "transition-colors hover:bg-surface-2 " +
        "focus-visible:outline-none"
      }
    >
      <Image
        src={flagSrc}
        alt={label}
        width={22}
        height={22}
        className="rounded-sm"
      />
    </button>
  );
}
