import { useTranslations } from "next-intl";

/**
 * Footer — minimal site footer.
 * Shows "this page is a living document" note + discreet link to aiaa.dev.
 * No tracking, no emphasis, no pitch.
 */
export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-8 py-6 text-center">
      <p className="text-xs text-foreground/40">{t("livingDoc")}</p>
      <p className="mt-1 text-xs text-foreground/40">{t("changesOften")}</p>
      <p className="mt-4 text-xs text-foreground/30">
        <a
          href="https://aiaa.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground/50"
        >
          {t("seriousLink")}
        </a>
        {" · "}
        <a
          href="/admin"
          className="transition-colors hover:text-foreground/50"
        >
          {t("admin")}
        </a>
      </p>
    </footer>
  );
}
