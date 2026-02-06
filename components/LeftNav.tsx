import { useTranslations } from "next-intl";
import {
  IconBriefcase,
  IconGrid,
  IconHome,
  IconMessage,
  IconSearch,
  IconSettings,
} from "./icons";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavItem = {
  id: string;
  /** Translation key used to resolve the localised label. */
  labelKey: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
};

/**
 * LeftNav
 * Minimal icon navigation in grayscale.
 * - Accent blue is reserved for the active item only.
 * - All labels are resolved from the "nav" translation namespace.
 */
export function LeftNav() {
  const t = useTranslations("nav");

  const items: NavItem[] = [
    {
      id: "home",
      labelKey: "home",
      href: "#home",
      icon: <IconHome />,
      active: true,
    },
    { id: "search", labelKey: "search", href: "#search", icon: <IconSearch /> },
    {
      id: "projects",
      labelKey: "projects",
      href: "#projects",
      icon: <IconGrid />,
    },
    {
      id: "experience",
      labelKey: "experience",
      href: "#experience",
      icon: <IconBriefcase />,
    },
    {
      id: "testimonials",
      labelKey: "testimonials",
      href: "#testimonials",
      icon: <IconMessage />,
    },
    {
      id: "settings",
      labelKey: "settings",
      href: "#settings",
      icon: <IconSettings />,
    },
  ];

  return (
    <nav
      aria-label={t("primary")}
      className="sticky top-6 flex w-full items-center justify-between gap-2 rounded-2xl border border-divider bg-surface-1 px-2 py-2 shadow-card md:flex-col md:justify-start"
    >
      {items.map((item) => {
        const label = t(item.labelKey);
        return (
          <a
            key={item.id}
            href={item.href}
            aria-label={label}
            aria-current={item.active ? "page" : undefined}
            className={
              "group inline-flex h-10 w-10 items-center justify-center rounded-xl " +
              "transition-colors focus-visible:outline-none " +
              (item.active
                ? "bg-accent-soft text-accent"
                : "text-foreground/60 hover:bg-surface-2 hover:text-foreground/85")
            }
            title={label}
          >
            {item.icon}
          </a>
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
