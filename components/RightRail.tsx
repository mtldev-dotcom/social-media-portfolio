import { useTranslations } from "next-intl";
import { Card, CardBody, CardHeader } from "./ui/Card";
import { Tag } from "./ui/Tag";
import { ChatPanel } from "./ChatPanel";

/**
 * RightRail
 * Profile summary + skills/tags + stats + floating AI panel.
 * - Preconditions: Must feel like a premium profile sidebar.
 * - Postconditions: Adds context and "AI-native" affordance without extra colors.
 * - All text resolved from "rightRail" translation namespace.
 */
export function RightRail() {
  const t = useTranslations("rightRail");

  // Tech stack items from translations (may differ by locale).
  const tech = t.raw("profileSummary.techStack") as string[];

  return (
    <aside className="space-y-4">
      <Card>
        <CardHeader
          title={t("profileSummary.title")}
          subtitle={t("profileSummary.subtitle")}
        />
        <CardBody className="pt-4">
          <p className="text-sm leading-relaxed text-muted">
            {t("profileSummary.description")}
          </p>

          <div className="mt-4">
            <p className="text-xs text-muted-2">{t("profileSummary.techStackLabel")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tech.map((item: string) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={t("stats.title")} subtitle={t("stats.subtitle")} />
        <CardBody className="pt-4">
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-divider bg-surface-2 p-3">
              <dt className="text-xs text-muted">{t("stats.followers")}</dt>
              <dd className="mt-1 font-display text-lg text-foreground">12.4k</dd>
            </div>
            <div className="rounded-2xl border border-divider bg-surface-2 p-3">
              <dt className="text-xs text-muted">{t("stats.projects")}</dt>
              <dd className="mt-1 font-display text-lg text-foreground">28</dd>
            </div>
            <div className="rounded-2xl border border-divider bg-surface-2 p-3">
              <dt className="text-xs text-muted">{t("stats.clients")}</dt>
              <dd className="mt-1 font-display text-lg text-foreground">16</dd>
            </div>
            <div className="rounded-2xl border border-divider bg-surface-2 p-3">
              <dt className="text-xs text-muted">{t("stats.availability")}</dt>
              <dd className="mt-1 text-sm text-foreground">{t("stats.open")}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      {/* Floating panel: sticky within the right rail. */}
      <ChatPanel />
    </aside>
  );
}
