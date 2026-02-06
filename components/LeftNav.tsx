import {
  IconBriefcase,
  IconGrid,
  IconHome,
  IconMessage,
  IconSearch,
  IconSettings,
} from "./icons";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
};

/**
 * LeftNav
 * Minimal icon navigation in grayscale.
 * - Accent blue is reserved for the active item only.
 */
export function LeftNav() {
  const items: NavItem[] = [
    {
      id: "home",
      label: "Home",
      href: "#home",
      icon: <IconHome />,
      active: true,
    },
    { id: "search", label: "Search", href: "#search", icon: <IconSearch /> },
    {
      id: "projects",
      label: "Projects",
      href: "#projects",
      icon: <IconGrid />,
    },
    {
      id: "experience",
      label: "Experience",
      href: "#experience",
      icon: <IconBriefcase />,
    },
    {
      id: "testimonials",
      label: "Testimonials",
      href: "#testimonials",
      icon: <IconMessage />,
    },
    {
      id: "settings",
      label: "Settings",
      href: "#settings",
      icon: <IconSettings />,
    },
  ];

  return (
    <nav
      aria-label="Primary"
      className="sticky top-6 flex w-full items-center justify-between gap-2 rounded-2xl border border-divider bg-surface-1 px-2 py-2 shadow-card md:flex-col md:justify-start"
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          aria-label={item.label}
          aria-current={item.active ? "page" : undefined}
          className={
            "group inline-flex h-10 w-10 items-center justify-center rounded-xl " +
            "transition-colors focus-visible:outline-none " +
            (item.active
              ? "bg-accent-soft text-accent"
              : "text-foreground/60 hover:bg-surface-2 hover:text-foreground/85")
          }
          title={item.label}
        >
          {item.icon}
        </a>
      ))}

      {/* Theme toggle: kept grayscale; does not introduce any new accent colors. */}
      <div className="ml-1 md:ml-0 md:mt-2">
        <ThemeToggle />
      </div>
    </nav>
  );
}

