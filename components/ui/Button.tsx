import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

/**
 * Button
 * - Preconditions: Use for all actions to enforce palette + interaction rules.
 * - Postconditions: Blue accent is used ONLY for the primary variant.
 *
 * Error paths:
 * - If `href` is provided, we render an anchor element for proper semantics.
 */
export function Button({
  children,
  variant = "secondary",
  size = "md",
  href,
  target,
  rel,
  className = "",
  ariaLabel,
  onClick,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  className?: string;
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<
    HTMLButtonElement | HTMLAnchorElement
  >;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
    "transition-colors focus-visible:outline-none " +
    "disabled:opacity-60 disabled:pointer-events-none";

  const padding =
    size === "sm" ? "h-9 px-4 text-sm" : "h-10 px-5 text-sm";

  const stylesByVariant: Record<ButtonVariant, string> = {
    primary:
      // Blue accent only here. No gradients; glow uses tokenized shadow.
      "bg-accent text-white hover:bg-[var(--fb-blue-hover)] active:bg-[var(--fb-blue-pressed)] " +
      "shadow-accent-glow",
    secondary:
      "bg-surface-2 text-foreground border border-divider " +
      "hover:bg-surface-1 active:bg-surface-2",
    ghost:
      "bg-transparent text-foreground/90 hover:bg-surface-2 active:bg-surface-1 " +
      "border border-transparent",
  };

  const cls = `${base} ${padding} ${stylesByVariant[variant]} ${className}`;

  if (href) {
    return (
      <a
        className={cls}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  );
}

