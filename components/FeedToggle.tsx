"use client";

import { useState } from "react";

type ViewMode = "feed" | "timeline";

type FeedToggleProps = {
  onChange: (mode: ViewMode) => void;
  active: ViewMode;
};

/**
 * FeedToggle — switches between Feed and Timeline views.
 * Client component (needs state awareness from parent).
 */
export function FeedToggle({ onChange, active }: FeedToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-divider bg-surface-1 p-1">
      <button
        onClick={() => onChange("feed")}
        className={
          "rounded-md px-3 py-1 text-xs font-medium transition-colors " +
          (active === "feed"
            ? "bg-surface-2 text-foreground"
            : "text-foreground/50 hover:text-foreground/70")
        }
      >
        Feed
      </button>
      <button
        onClick={() => onChange("timeline")}
        className={
          "rounded-md px-3 py-1 text-xs font-medium transition-colors " +
          (active === "timeline"
            ? "bg-surface-2 text-foreground"
            : "text-foreground/50 hover:text-foreground/70")
        }
      >
        Timeline
      </button>
    </div>
  );
}

export type { ViewMode };
