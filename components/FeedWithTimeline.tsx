"use client";

import { useState } from "react";
import { FeedToggle, type ViewMode } from "./FeedToggle";
import { Feed } from "./Feed";
import { TimelineView } from "./TimelineView";
import type { Entry } from "@/lib/content/types";

/**
 * FeedWithTimeline — wraps Feed and TimelineView with a toggle.
 * Client component because it manages view-mode state.
 * Receives entries from the server parent and passes them through.
 */
export function FeedWithTimeline({ entries }: { entries: Entry[] }) {
  const [mode, setMode] = useState<ViewMode>("feed");

  return (
    <div className="space-y-4">
      {/* Toggle bar */}
      <div className="flex items-center justify-end">
        <FeedToggle active={mode} onChange={setMode} />
      </div>

      {/* Render active view */}
      {mode === "feed" ? (
        <Feed entries={entries} />
      ) : (
        <TimelineView entries={entries} />
      )}
    </div>
  );
}
