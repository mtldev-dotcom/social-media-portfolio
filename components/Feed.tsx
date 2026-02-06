import Image from "next/image";
import { Card, CardBody } from "./ui/Card";
import { Tag } from "./ui/Tag";
import { Link } from "@/i18n/navigation";
import type { BlogEntry, BlogEntryType } from "@/lib/payload";

/**
 * TypeLabel — small uppercase badge shown at the top of every card.
 */
function TypeLabel({ type }: { type: BlogEntryType }) {
  return (
    <span className="mb-2 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
      {type}
    </span>
  );
}

/**
 * Feed — blog entries from Payload (posts, notes, experiments).
 * Entries are already sorted by the loader (newest first).
 */
export function Feed({ entries }: { entries: BlogEntry[] }) {
  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        switch (entry.type) {
          case "POST":
            return <PostCard key={entry.id} entry={entry} />;
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
function m(entry: BlogEntry, key: string): string {
  return (entry.meta?.[key] as string) ?? "";
}

/** Format publishedAt for card display. */
function formatDate(entry: BlogEntry): string {
  if (!entry.publishedAt) return "";
  return new Date(entry.publishedAt).toLocaleDateString(entry.locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * EntryLink — wraps children in a link to the detail page.
 */
function EntryLink({ entry, children }: { entry: BlogEntry; children: React.ReactNode }) {
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
 * PostCard — blog post card.
 */
function PostCard({ entry }: { entry: BlogEntry }) {
  if ((entry as BlogEntry & { variant?: string }).variant === "testimonial") {
    return (
      <Card>
        <CardBody className="pt-5">
          <TypeLabel type={entry.type} />
          <p className="text-xs text-muted-2">{formatDate(entry)}</p>
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
              <span className="font-medium">{m(entry, "author") || "Author"}</span>{" "}
              <span className="text-muted">{m(entry, "handle")}</span>{" "}
              <span className="text-muted-2">· {formatDate(entry)}</span>
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
 * NoteCard — learning, reflection, or reminder.
 */
function NoteCard({ entry }: { entry: BlogEntry }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={entry.type} />
        <p className="text-xs text-muted-2">{formatDate(entry)}</p>
        <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
          <EntryLink entry={entry}>{entry.title}</EntryLink>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80 line-clamp-3">
          {entry.body}
        </p>
      </CardBody>
    </Card>
  );
}

/**
 * ExperimentCard — tool, playground, or weird idea.
 */
function ExperimentCard({ entry }: { entry: BlogEntry }) {
  const meta = entry.meta as { what?: string; why?: string; learned?: string } | undefined;
  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={entry.type} />
        <p className="text-xs text-muted-2">{formatDate(entry)}</p>
        <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
          <EntryLink entry={entry}>{entry.title}</EntryLink>
        </h3>
        <div className="mt-3 space-y-2 text-sm leading-relaxed">
          {meta?.what && <p className="text-foreground/80">{meta.what}</p>}
          {meta?.why && (
            <p className="text-muted">
              <span className="font-medium text-foreground/60">why — </span>
              {meta.why}
            </p>
          )}
          {meta?.learned && (
            <p className="text-muted">
              <span className="font-medium text-foreground/60">learned — </span>
              {meta.learned}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
