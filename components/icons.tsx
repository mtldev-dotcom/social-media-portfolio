import * as React from "react";

type IconProps = {
  className?: string;
  title?: string;
};

/**
 * Inline SVG icons
 * - Preconditions: Icons must remain grayscale by default.
 * - Postconditions: Color is controlled via currentColor (Tailwind text-* classes).
 */
export function IconHome({ className = "h-5 w-5", title = "Home" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5.5 9.9V21h13V9.9" />
      <path d="M10 21v-7h4v7" />
    </svg>
  );
}

export function IconSearch({
  className = "h-5 w-5",
  title = "Search",
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}

export function IconGrid({
  className = "h-5 w-5",
  title = "Projects",
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path d="M4.5 4.5h6.5v6.5H4.5z" />
      <path d="M13 4.5h6.5v6.5H13z" />
      <path d="M4.5 13h6.5v6.5H4.5z" />
      <path d="M13 13h6.5v6.5H13z" />
    </svg>
  );
}

export function IconBriefcase({
  className = "h-5 w-5",
  title = "Experience",
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path d="M9 6.5V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5v1" />
      <path d="M5.5 7.5h13A2.5 2.5 0 0 1 21 10v8.5A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5V10A2.5 2.5 0 0 1 5.5 7.5z" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function IconMessage({
  className = "h-5 w-5",
  title = "Testimonials",
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path d="M7 18l-3.5 2.5V6.8A2.8 2.8 0 0 1 6.3 4h11.4A2.8 2.8 0 0 1 20.5 6.8v8.4A2.8 2.8 0 0 1 17.7 18H7z" />
      <path d="M7.5 8.5h9" />
      <path d="M7.5 12h6.5" />
    </svg>
  );
}

export function IconSettings({
  className = "h-5 w-5",
  title = "Settings",
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" />
      <path d="M19.4 15.1l1.1-1.9-1.7-3-2.2.3a7.5 7.5 0 0 0-1.6-0.9l-0.7-2.1H9.6l-0.7 2.1c-.6.2-1.1.5-1.6.9l-2.2-.3-1.7 3 1.1 1.9c-.1.6-.1 1.2 0 1.8l-1.1 1.9 1.7 3 2.2-.3c.5.4 1 .7 1.6.9l.7 2.1h4.8l.7-2.1c.6-.2 1.1-.5 1.6-.9l2.2.3 1.7-3-1.1-1.9c.1-.6.1-1.2 0-1.8z" />
    </svg>
  );
}

export function IconVerified({
  className = "h-4 w-4",
  title = "Verified",
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 2l2.2 2.2 3.1-.3.9 3 2.7 1.6-1.6 2.7 1.6 2.7-2.7 1.6-.9 3-3.1-.3L12 22l-2.2-2.2-3.1.3-.9-3-2.7-1.6L4.7 12 3.1 9.3 5.8 7.7l.9-3 3.1.3L12 2z" />
      <path
        d="M10.4 12.7l-1.5-1.5-1 1 2.5 2.5 5.1-5.1-1-1-4.1 4.1z"
        fill="#fff"
      />
    </svg>
  );
}

export function IconSun({ className = "h-5 w-5", title = "Light mode" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5" />
      <path d="M12 19v2.5" />
      <path d="M2.5 12H5" />
      <path d="M19 12h2.5" />
      <path d="M4.1 4.1l1.8 1.8" />
      <path d="M18.1 18.1l1.8 1.8" />
      <path d="M19.9 4.1l-1.8 1.8" />
      <path d="M5.9 18.1l-1.8 1.8" />
    </svg>
  );
}

export function IconMoon({ className = "h-5 w-5", title = "Dark mode" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path d="M21 14.5A7.5 7.5 0 0 1 9.5 3a6.5 6.5 0 1 0 11.5 11.5z" />
    </svg>
  );
}

