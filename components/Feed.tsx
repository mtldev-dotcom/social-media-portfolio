import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card, CardBody } from "./ui/Card";
import { Tag } from "./ui/Tag";
import seedData from "@/content/seed.json";

/**
 * Content types from /docs/content-types.md.
 * Each seed item has a `type` field matching one of these.
 */
type ContentType = "POST" | "PROJECT" | "NOTE" | "EXPERIMENT" | "STORY" | "ACTIVITY";

/**
 * Shape of a single item in content/seed.json.
 * The `variant` field disambiguates sub-kinds within the same type.
 */
type SeedItem = {
  id: string;
  type: ContentType;
  variant: string;
  timestamp: string;
  tags: string[];
  media: string | null;
  meta?: {
    stats?: { replies: number; reposts: number; likes: number };
  };
};

/**
 * TypeLabel — small uppercase badge shown at the top of every card.
 * Helps the reader scan and mentally filter content.
 */
function TypeLabel({ type }: { type: ContentType }) {
  return (
    <span className="mb-2 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
      {type}
    </span>
  );
}

/**
 * Feed
 * - Reads structured data from content/seed.json.
 * - Renders items sorted by timestamp (newest first).
 * - Text content is resolved from the "feed" translation namespace using item ids.
 * - Supports: POST, PROJECT, NOTE, EXPERIMENT, STORY, ACTIVITY.
 */
export function Feed() {
  const t = useTranslations("feed");

  /* Sort seed items by timestamp descending (newest first). */
  const items = [...(seedData as SeedItem[])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      {items.map((item) => {
        switch (item.type) {
          case "POST":
            return <PostCard key={item.id} item={item} t={t} />;
          case "PROJECT":
            return <ProjectCard key={item.id} item={item} t={t} />;
          case "STORY":
            return <StoryCard key={item.id} item={item} t={t} />;
          case "ACTIVITY":
            return <ActivityCard key={item.id} item={item} t={t} />;
          case "NOTE":
            return <NoteCard key={item.id} item={item} t={t} />;
          case "EXPERIMENT":
            return <ExperimentCard key={item.id} item={item} t={t} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card variants                                                      */
/* ------------------------------------------------------------------ */

type CardProps = {
  item: SeedItem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
};

/**
 * PostCard — short text post (X/Twitter-style) or testimonial.
 * Uses item.variant to distinguish between "text" and "testimonial".
 */
function PostCard({ item, t }: CardProps) {
  if (item.variant === "testimonial") {
    return (
      <Card>
        <CardBody className="pt-5">
          <TypeLabel type={item.type} />
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
  }

  /* Regular text post */
  const stats = item.meta?.stats;
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={item.type} />
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
        {stats && (
          <div className="mt-4 flex items-center gap-4 text-xs text-muted">
            <span>{stats.replies} {t(`${item.id}.repliesLabel`)}</span>
            <span>{stats.reposts} {t(`${item.id}.repostsLabel`)}</span>
            <span>{stats.likes} {t(`${item.id}.likesLabel`)}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/**
 * ProjectCard — project with thumbnail (Instagram-style).
 */
function ProjectCard({ item, t }: CardProps) {
  const tags = t.raw(`${item.id}.tags`) as string[];
  return (
    <Card className="overflow-hidden">
      <div className="px-5 pt-5">
        <TypeLabel type={item.type} />
      </div>
      {item.media && (
        <div className="relative aspect-[16/9] w-full border-b border-divider bg-surface-2">
          <Image
            src={item.media}
            alt={`${t(`${item.id}.title`)} thumbnail`}
            fill
            className="object-cover"
          />
        </div>
      )}
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

/**
 * StoryCard — experience / timeline entry (LinkedIn-style).
 */
function StoryCard({ item, t }: CardProps) {
  const bullets = t.raw(`${item.id}.bullets`) as string[];
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={item.type} />
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

/**
 * ActivityCard — building status or availability update.
 * Uses item.variant to distinguish between "building" and "status".
 */
function ActivityCard({ item, t }: CardProps) {
  if (item.variant === "building") {
    const stack = t.raw(`${item.id}.stack`) as string[];
    return (
      <Card>
        <CardBody className="pt-5">
          <TypeLabel type={item.type} />
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

  /* Simple status card */
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={item.type} />
        <p className="text-xs text-muted-2">{t(`${item.id}.time`)}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{t(`${item.id}.label`)}</p>
          <p className="text-sm text-foreground">{t(`${item.id}.value`)}</p>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * NoteCard — learning, reflection, or reminder.
 */
function NoteCard({ item, t }: CardProps) {
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={item.type} />
        <p className="text-xs text-muted-2">{t(`${item.id}.time`)}</p>
        <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
          {t(`${item.id}.title`)}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          {t(`${item.id}.body`)}
        </p>
      </CardBody>
    </Card>
  );
}

/**
 * ExperimentCard — tool, playground, or weird idea.
 * Shows: what it is, why I built it, what I learned.
 */
function ExperimentCard({ item, t }: CardProps) {
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={item.type} />
        <p className="text-xs text-muted-2">{t(`${item.id}.time`)}</p>
        <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
          {t(`${item.id}.title`)}
        </h3>
        <div className="mt-3 space-y-2 text-sm leading-relaxed">
          <p className="text-foreground/80">{t(`${item.id}.what`)}</p>
          <p className="text-muted">
            <span className="font-medium text-foreground/60">why — </span>
            {t(`${item.id}.why`)}
          </p>
          <p className="text-muted">
            <span className="font-medium text-foreground/60">learned — </span>
            {t(`${item.id}.learned`)}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
