"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { IconMoon, IconSun } from "./icons";

type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

/**
 * Applies theme to DOM and persists to localStorage.
 * Defined at module level to avoid hoisting issues and make it stable.
 */
function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // localStorage unavailable; ignore
  }
}

/**
 * ThemeToggle
 * - Preconditions: `app/globals.css` defines token overrides for `html[data-theme="light"]`.
 * - Postconditions: Clicking toggles between dark/light and persists to localStorage.
 * - Aria label resolved from "theme" translation namespace.
 *
 * Error paths:
 * - If localStorage is unavailable, we still toggle for the current session.
 */
export function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations("theme");
  const [theme, setTheme] = React.useState<Theme>("dark");

  React.useEffect(() => {
    // Initialize from localStorage (if present) else from current DOM.
    let initialTheme: Theme = "dark";

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        initialTheme = stored;
      } else {
        // No stored preference; check current DOM state
        const domTheme = document.documentElement.dataset.theme;
        if (domTheme === "light") {
          initialTheme = "light";
        }
      }
    } catch {
      // localStorage unavailable; use DOM or default
      const domTheme = document.documentElement.dataset.theme;
      if (domTheme === "light") {
        initialTheme = "light";
      }
    }

    // Apply and sync state
    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";

    // Enable smooth transition, then apply theme.
    document.documentElement.classList.add("theme-transitioning");
    setTheme(next);
    applyTheme(next);

    // Remove class after transition completes to avoid
    // transitions firing on unrelated DOM changes.
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 450);
  }

  const isDark = theme === "dark";
  const label = isDark ? t("switchToLight") : t("switchToDark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={
        "inline-flex h-10 w-10 items-center justify-center rounded-xl " +
        "border border-divider bg-surface-1 text-foreground/70 shadow-card " +
        "transition-colors hover:bg-surface-2 hover:text-foreground/90 " +
        "focus-visible:outline-none " +
        className
      }
    >
      {isDark ? <IconSun /> : <IconMoon />}
    </button>
  );
}
