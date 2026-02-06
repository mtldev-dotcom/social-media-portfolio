"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  IconFileText,
  IconFlask,
  IconHome,
  IconUser,
} from "./icons";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavItem = {
  id: string;
  /** Translation key used to resolve the localised label. */
  labelKey: string;
  href: string;
  icon: React.ReactNode;
};

/**
 * LeftNav
 * Minimal icon navigation in grayscale.
 * - 4 items only: Home, About, Lab, Notes.
 * - Accent blue is reserved for the active item only.
 * - All labels are resolved from the "nav" translation namespace.
 * - Uses locale-aware Link for proper routing.
 */
export function LeftNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const items: NavItem[] = [
    {
      id: "home",
      labelKey: "home",
      href: "/",
      icon: <IconHome />,
    },
    {
      id: "about",
      labelKey: "about",
      href: "/about",
      icon: <IconUser />,
    },
    {
      id: "lab",
      labelKey: "lab",
      href: "/lab",
      icon: <IconFlask />,
    },
    {
      id: "notes",
      labelKey: "notes",
      href: "/notes",
      icon: <IconFileText />,
    },
  ];

  return (
    <nav
      aria-label={t("primary")}
      className="sticky top-6 flex w-full items-center justify-between gap-2 rounded-2xl border border-divider bg-surface-1 px-2 py-2 shadow-card md:flex-col md:justify-start"
    >
      {items.map((item) => {
        const label = t(item.labelKey);
        /* Active state: exact match for home ("/"), prefix match for others */
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className={
              "group inline-flex h-10 w-10 items-center justify-center rounded-xl " +
              "transition-colors focus-visible:outline-none " +
              (isActive
                ? "bg-accent-soft text-accent"
                : "text-foreground/60 hover:bg-surface-2 hover:text-foreground/85")
            }
            title={label}
          >
            {item.icon}
          </Link>
        );
      })}

      {/* Theme toggle: kept grayscale; does not introduce any new accent colors. */}
      <div className="ml-1 md:ml-0 md:mt-2">
        <ThemeToggle />
      </div>

      {/* Language switcher: EN / FR toggle */}
      <div className="ml-1 md:ml-0 md:mt-1">
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
