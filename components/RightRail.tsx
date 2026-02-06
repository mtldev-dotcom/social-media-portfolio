import { Card, CardBody, CardHeader } from "./ui/Card";
import { Tag } from "./ui/Tag";
import { ChatPanel } from "./ChatPanel";

/**
 * RightRail
 * Profile summary + skills/tags + stats + floating AI panel.
 * - Preconditions: Must feel like a premium profile sidebar.
 * - Postconditions: Adds context and "AI-native" affordance without extra colors.
 */
export function RightRail() {
  const tech = [
    "AI Automation",
    "Agent Systems",
    "Next.js",
    "TypeScript",
    "Workflow Design",
    "APIs",
    "Observability",
  ];

  return (
    <aside className="space-y-4">
      <Card>
        <CardHeader title="Profile summary" subtitle="High-signal overview" />
        <CardBody className="pt-4">
          <p className="text-sm leading-relaxed text-muted">
            Creative technologist focused on calm, reliable systems: AI-assisted
            automation, editorial UX, and production-grade delivery.
          </p>

          <div className="mt-4">
            <p className="text-xs text-muted-2">Tech stack</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tech.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Stats" subtitle="Signals, not vanity" />
        <CardBody className="pt-4">
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-divider bg-surface-2 p-3">
              <dt className="text-xs text-muted">Followers</dt>
              <dd className="mt-1 font-display text-lg text-foreground">12.4k</dd>
            </div>
            <div className="rounded-2xl border border-divider bg-surface-2 p-3">
              <dt className="text-xs text-muted">Projects</dt>
              <dd className="mt-1 font-display text-lg text-foreground">28</dd>
            </div>
            <div className="rounded-2xl border border-divider bg-surface-2 p-3">
              <dt className="text-xs text-muted">Clients</dt>
              <dd className="mt-1 font-display text-lg text-foreground">16</dd>
            </div>
            <div className="rounded-2xl border border-divider bg-surface-2 p-3">
              <dt className="text-xs text-muted">Availability</dt>
              <dd className="mt-1 text-sm text-foreground">Open</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      {/* Floating panel: sticky within the right rail. */}
      <ChatPanel />
    </aside>
  );
}

