"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * LanguageSwitcher
 * Client component that toggles between supported locales (EN / FR).
 * - Uses next-intl's navigation helpers to swap the locale in the URL.
 * - Active locale is highlighted with the accent colour; others are neutral.
 * - Placed in the LeftNav alongside the ThemeToggle.
 *
 * Design rules:
 * - Matches the grayscale palette; accent blue ONLY on the active locale.
 * - Compact pill shape to fit inside the icon sidebar.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  function switchLocale(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-xl border border-divider bg-surface-1 p-0.5 shadow-card"
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((loc) => {
        const isActive = loc === locale;
        const ariaLabel =
          loc === "en" ? t("switchToEn") : t("switchToFr");

        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            aria-label={ariaLabel}
            aria-pressed={isActive}
            className={
              "inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium " +
              "transition-colors focus-visible:outline-none " +
              (isActive
                ? "bg-accent text-white"
                : "text-foreground/60 hover:bg-surface-2 hover:text-foreground/85")
            }
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
