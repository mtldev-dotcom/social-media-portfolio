import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card, CardBody } from "./ui/Card";
import { Tag } from "./ui/Tag";

/**
 * Structural metadata for each feed item.
 * Text content is resolved from the "feed" translation namespace.
 */
type FeedItemMeta =
  | { id: string; kind: "text"; stats: { replies: number; reposts: number; likes: number } }
  | { id: string; kind: "project"; thumbSrc: string }
  | { id: string; kind: "experience" }
  | { id: string; kind: "testimonial" }
  | { id: string; kind: "building" }
  | { id: string; kind: "status" };

/**
 * Maps the internal kind to the public content-type label.
 * See /docs/content-types.md for the full taxonomy.
 */
const KIND_TO_LABEL: Record<FeedItemMeta["kind"], string> = {
  text: "POST",
  project: "PROJECT",
  experience: "STORY",
  testimonial: "POST",
  building: "ACTIVITY",
  status: "ACTIVITY",
};

/**
 * TypeLabel — small uppercase badge shown at the top of every card.
 * Helps the reader scan and mentally filter content.
 */
function TypeLabel({ kind }: { kind: FeedItemMeta["kind"] }) {
  return (
    <span className="mb-2 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
      {KIND_TO_LABEL[kind]}
    </span>
  );
}

/**
 * Feed
 * - Preconditions: Contains stacked card-based posts with social spacing.
 * - Postconditions: Renders a mix of requested post types (X/IG/LinkedIn-inspired).
 * - All visible text is resolved from the "feed" translation namespace using item ids.
 */
export function Feed() {
  const t = useTranslations("feed");

  /**
   * Structural data only — no hardcoded text.
   * Each item's `id` matches a key in messages/{locale}.json → feed.{id}.*
   */
  const items: FeedItemMeta[] = [
    { id: "t1", kind: "text", stats: { replies: 12, reposts: 7, likes: 148 } },
    { id: "p1", kind: "project", thumbSrc: "/thumb-automation.svg" },
    { id: "e1", kind: "experience" },
    { id: "c1", kind: "project", thumbSrc: "/thumb-case-study.svg" },
    { id: "b1", kind: "building" },
    { id: "s1", kind: "status" },
    { id: "x1", kind: "testimonial" },
    { id: "x2", kind: "testimonial" },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => {
        switch (item.kind) {
          case "text":
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <TypeLabel kind={item.kind} />
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground/90">
                        <span className="font-medium">{t(`${item.id}.author`)}</span>{" "}
                        <span className="text-muted">{t(`${item.id}.handle`)}</span>{" "}
                        <span className="text-muted-2">· {t(`${item.id}.time`)}</span>
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-foreground">
                        {t(`${item.id}.content`)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                    <span>{item.stats.replies} {t(`${item.id}.repliesLabel`)}</span>
                    <span>{item.stats.reposts} {t(`${item.id}.repostsLabel`)}</span>
                    <span>{item.stats.likes} {t(`${item.id}.likesLabel`)}</span>
                  </div>
                </CardBody>
              </Card>
            );

          case "project": {
            const tags = t.raw(`${item.id}.tags`) as string[];
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="px-5 pt-5">
                  <TypeLabel kind={item.kind} />
                </div>
                <div className="relative aspect-[16/9] w-full border-b border-divider bg-surface-2">
                  <Image
                    src={item.thumbSrc}
                    alt={`${t(`${item.id}.title`)} thumbnail`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardBody className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-2">{t(`${item.id}.time`)}</p>
                      <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
                        {t(`${item.id}.title`)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {t(`${item.id}.description`)}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag: string) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          }

          case "experience": {
            const bullets = t.raw(`${item.id}.bullets`) as string[];
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <TypeLabel kind={item.kind} />
                  <p className="text-xs text-muted-2">{t(`${item.id}.time`)}</p>
                  <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
                    {t(`${item.id}.role`)}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{t(`${item.id}.org`)}</p>

                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/90">
                    {bullets.map((b: string) => (
                      <li key={b} className="flex gap-2">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40"
                          aria-hidden="true"
                        />
                        <span className="text-muted">{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            );
          }

          case "testimonial":
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <TypeLabel kind={item.kind} />
                  <p className="text-xs text-muted-2">{t(`${item.id}.time`)}</p>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full border border-divider bg-surface-2" />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground/90">
                        <span className="font-medium">{t(`${item.id}.from`)}</span>{" "}
                        <span className="text-muted">· {t(`${item.id}.role`)}</span>
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {t(`${item.id}.comment`)}
                      </p>
                      <div className="mt-3 text-xs text-muted">
                        {t("actions.reply")} · {t("actions.like")} · {t("actions.share")}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );

          case "building": {
            const stack = t.raw(`${item.id}.stack`) as string[];
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <TypeLabel kind={item.kind} />
                  <p className="text-xs text-muted-2">{t(`${item.id}.time`)}</p>
                  <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
                    {t(`${item.id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(`${item.id}.summary`)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stack.map((s: string) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                </CardBody>
              </Card>
            );
          }

          case "status":
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <TypeLabel kind={item.kind} />
                  <p className="text-xs text-muted-2">{t(`${item.id}.time`)}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-muted">{t(`${item.id}.label`)}</p>
                    <p className="text-sm text-foreground">{t(`${item.id}.value`)}</p>
                  </div>
                </CardBody>
              </Card>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
