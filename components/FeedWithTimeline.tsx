"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FeedToggle, type ViewMode } from "./FeedToggle";
import { Feed } from "./Feed";
import { TimelineView } from "./TimelineView";

/**
 * FeedWithTimeline — wraps Feed and TimelineView with a toggle.
 * Client component because it manages view-mode state.
 */
export function FeedWithTimeline() {
  const [mode, setMode] = useState<ViewMode>("feed");

  return (
    <div className="space-y-4">
      {/* Toggle bar */}
      <div className="flex items-center justify-end">
        <FeedToggle active={mode} onChange={setMode} />
      </div>

      {/* Render active view */}
      {mode === "feed" ? <Feed /> : <TimelineView />}
    </div>
  );
}
