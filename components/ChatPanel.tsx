"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

/**
 * ChatPanel (UI-only)
 * - Preconditions: Right rail exists; this panel should feel "floating".
 * - Postconditions: Provides an AI-native affordance without any backend integration.
 * - Renamed from "AI Concierge" to "AI Guide" per content-enhance.md spec.
 *
 * Notes:
 * - Strict palette: neutral surfaces; blue only for CTA emphasis.
 * - No network requests here.
 * - All text resolved from "aiGuide" translation namespace.
 */
export function ChatPanel() {
  const t = useTranslations("aiGuide");

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "m1",
      role: "assistant",
      text: t("initialMessage"),
    },
  ]);
  const [input, setInput] = React.useState("");

  function onSend() {
    const text = input.trim();
    if (!text) return;

    // Error paths: no backend; we echo a premium placeholder response.
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: t("placeholderResponse"),
      },
    ]);
    setInput("");
  }

  return (
    <Card glass className="sticky top-6">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-sm tracking-wide text-foreground/90">
              {t("title")}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t("subtitle")}
            </p>
          </div>
          <span className="rounded-full border border-divider bg-surface-2 px-3 py-1 text-xs text-muted">
            {t("beta")}
          </span>
        </div>
      </div>

      <div className="mt-4 px-5">
        <div className="h-56 space-y-3 overflow-auto rounded-2xl border border-divider bg-surface-1/40 p-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl bg-surface-2 px-3 py-2 text-sm text-foreground"
                  : "mr-auto max-w-[85%] rounded-2xl border border-divider bg-surface-1 px-3 py-2 text-sm text-foreground"
              }
            >
              <p className="leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 px-5 pb-5">
        <label className="sr-only" htmlFor="chat-input">
          {t("inputLabel")}
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          placeholder={t("inputPlaceholder")}
          className="h-10 w-full rounded-full border border-divider bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted focus-visible:outline-none"
        />
        <Button variant="primary" size="sm" ariaLabel={t("send")} onClick={onSend}>
          {t("send")}
        </Button>
      </div>
    </Card>
  );
}
