import * as React from "react";

/**
 * Card
 * - Preconditions: Use for all feed/rail surfaces to keep the UI consistent.
 * - Postconditions: Renders a neutral surface with thin divider border and subtle depth.
 *
 * Design rules:
 * - No gradients.
 * - Neutral surfaces only; blue is reserved for emphasis elsewhere.
 */
export function Card({
  children,
  className = "",
  glass = false,
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * When true, uses subtle glassmorphism.
   * Error paths: if `backdrop-filter` isn't supported, it degrades to a flat surface.
   */
  glass?: boolean;
}) {
  const base = glass ? "card-glass" : "card";
  return <section className={`${base} ${className}`}>{children}</section>;
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4 px-5 pt-5">
      <div className="min-w-0">
        <h2 className="truncate font-display text-sm tracking-wide text-foreground/90">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </header>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>;
}

