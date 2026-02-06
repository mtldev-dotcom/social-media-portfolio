import { useTranslations } from "next-intl";

/**
 * Footer — minimal site footer.
 * Shows "this page is a living document" note.
 * Gives permission to iterate and evolve the site forever.
 */
export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-8 border-t border-divider py-6 text-center">
      <p className="text-xs text-foreground/40">{t("livingDoc")}</p>
      <p className="mt-1 text-xs text-foreground/40">{t("changesOften")}</p>
    </footer>
  );
}
