import Image from "next/image";
import { Card, CardBody } from "./ui/Card";
import { Tag } from "./ui/Tag";
import { Link } from "@/i18n/navigation";
import type { Entry, EntryType } from "@/lib/content/types";

/**
 * TypeLabel — small uppercase badge shown at the top of every card.
 * Helps the reader scan and mentally filter content.
 */
function TypeLabel({ type }: { type: EntryType }) {
  return (
    <span className="mb-2 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
      {type}
    </span>
  );
}

/**
 * Feed
 * - Receives entries from the parent (server-fetched via loader).
 * - Entries are already sorted by the loader (newest first).
 * - All text is read directly from entry fields (no translation hooks for content).
 */
export function Feed({ entries }: { entries: Entry[] }) {
  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        switch (entry.type) {
          case "POST":
            return <PostCard key={entry.id} entry={entry} />;
          case "PROJECT":
            return <ProjectCard key={entry.id} entry={entry} />;
          case "STORY":
            return <StoryCard key={entry.id} entry={entry} />;
          case "ACTIVITY":
            return <ActivityCard key={entry.id} entry={entry} />;
          case "NOTE":
            return <NoteCard key={entry.id} entry={entry} />;
          case "EXPERIMENT":
            return <ExperimentCard key={entry.id} entry={entry} />;
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

/** Helper: get meta field safely. */
function m(entry: Entry, key: string): string {
  return (entry.meta?.[key] as string) ?? "";
}

/**
 * EntryLink — wraps children in a link to the detail page.
 */
function EntryLink({ entry, children }: { entry: Entry; children: React.ReactNode }) {
  return (
    <Link
      href={`/${entry.type.toLowerCase()}/${entry.slug}`}
      className="transition-colors hover:text-accent"
    >
      {children}
    </Link>
  );
}

/**
 * PostCard — short text post (X/Twitter-style) or testimonial.
 */
function PostCard({ entry }: { entry: Entry }) {
  if (entry.variant === "testimonial") {
    return (
      <Card>
        <CardBody className="pt-5">
          <TypeLabel type={entry.type} />
          <p className="text-xs text-muted-2">{m(entry, "time")}</p>
          <div className="mt-3 flex items-start gap-3">
            <div className="h-9 w-9 rounded-full border border-divider bg-surface-2" />
            <div className="min-w-0">
              <p className="text-sm text-foreground/90">
                <span className="font-medium">{m(entry, "from")}</span>{" "}
                <span className="text-muted">· {m(entry, "role")}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <EntryLink entry={entry}>{m(entry, "comment")}</EntryLink>
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  /* Regular text post */
  const stats = entry.meta?.stats as
    | { replies: number; reposts: number; likes: number }
    | undefined;
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={entry.type} />
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-foreground/90">
              <span className="font-medium">{m(entry, "author")}</span>{" "}
              <span className="text-muted">{m(entry, "handle")}</span>{" "}
              <span className="text-muted-2">· {m(entry, "time")}</span>
            </p>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              <EntryLink entry={entry}>{entry.body}</EntryLink>
            </p>
          </div>
        </div>
        {stats && (
          <div className="mt-4 flex items-center gap-4 text-xs text-muted">
            <span>{stats.replies} {m(entry, "repliesLabel")}</span>
            <span>{stats.reposts} {m(entry, "repostsLabel")}</span>
            <span>{stats.likes} {m(entry, "likesLabel")}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/**
 * ProjectCard — project with thumbnail (Instagram-style).
 */
function ProjectCard({ entry }: { entry: Entry }) {
  const tags = entry.tags ?? [];
  return (
    <Card className="overflow-hidden">
      <div className="px-5 pt-5">
        <TypeLabel type={entry.type} />
      </div>
      {entry.hero && (
        <div className="relative aspect-[16/9] w-full border-b border-divider bg-surface-2">
          <Image
            src={entry.hero.src}
            alt={entry.hero.alt ?? `${entry.title} thumbnail`}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardBody className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-2">{m(entry, "time")}</p>
            <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
              <EntryLink entry={entry}>{entry.title}</EntryLink>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {entry.summary}
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
function StoryCard({ entry }: { entry: Entry }) {
  const bullets = (entry.meta?.bullets as string[]) ?? [];
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={entry.type} />
        <p className="text-xs text-muted-2">{m(entry, "time")}</p>
        <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
          <EntryLink entry={entry}>{m(entry, "role")}</EntryLink>
        </h3>
        <p className="mt-1 text-sm text-muted">{m(entry, "org")}</p>
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
 */
function ActivityCard({ entry }: { entry: Entry }) {
  if (entry.variant === "building") {
    const stack = (entry.meta?.stack as string[]) ?? [];
    return (
      <Card>
        <CardBody className="pt-5">
          <TypeLabel type={entry.type} />
          <p className="text-xs text-muted-2">{m(entry, "time")}</p>
          <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
            <EntryLink entry={entry}>{entry.title}</EntryLink>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {entry.summary}
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
        <TypeLabel type={entry.type} />
        <p className="text-xs text-muted-2">{m(entry, "time")}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{m(entry, "label")}</p>
          <p className="text-sm text-foreground">
            <EntryLink entry={entry}>{m(entry, "value")}</EntryLink>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * NoteCard — learning, reflection, or reminder.
 */
function NoteCard({ entry }: { entry: Entry }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={entry.type} />
        <p className="text-xs text-muted-2">{m(entry, "time")}</p>
        <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
          <EntryLink entry={entry}>{entry.title}</EntryLink>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          {entry.body}
        </p>
      </CardBody>
    </Card>
  );
}

/**
 * ExperimentCard — tool, playground, or weird idea.
 */
function ExperimentCard({ entry }: { entry: Entry }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={entry.type} />
        <p className="text-xs text-muted-2">{m(entry, "time")}</p>
        <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
          <EntryLink entry={entry}>{entry.title}</EntryLink>
        </h3>
        <div className="mt-3 space-y-2 text-sm leading-relaxed">
          <p className="text-foreground/80">{m(entry, "what")}</p>
          <p className="text-muted">
            <span className="font-medium text-foreground/60">why — </span>
            {m(entry, "why")}
          </p>
          <p className="text-muted">
            <span className="font-medium text-foreground/60">learned — </span>
            {m(entry, "learned")}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
