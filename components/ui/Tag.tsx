import * as React from "react";

/**
 * Tag
 * Neutral pill used for tech stack and skills.
 * - No accent colors (blue reserved for emphasis elements).
 */
export function Tag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border border-divider " +
        "bg-surface-2 px-3 py-1 text-xs text-foreground/85 " +
        "whitespace-nowrap " +
        className
      }
    >
      {children}
    </span>
  );
}

