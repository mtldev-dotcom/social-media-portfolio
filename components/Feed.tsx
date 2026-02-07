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
        const key = `${entry.type}-${entry.id}`;
        switch (entry.type) {
          case "POST":
            return <PostCard key={key} entry={entry} />;
          case "NOTE":
            return <NoteCard key={key} entry={entry} />;
          case "EXPERIMENT":
            return <ExperimentCard key={key} entry={entry} />;
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
 * PostCard — enhanced blog post card with title, summary, and hero image.
 */
function PostCard({ entry }: { entry: BlogEntry }) {
  // Get summary or create excerpt from body
  const getExcerpt = (text: string | undefined, maxLength: number = 180): string => {
    if (!text) return "";
    // Remove markdown headers and clean up
    const cleaned = text
      .replace(/^#+\s+/gm, "") // Remove markdown headers
      .replace(/\*\*/g, "") // Remove bold
      .replace(/\n{2,}/g, " ") // Replace multiple newlines with space
      .trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.slice(0, maxLength).trim() + "…";
  };

  const excerpt = entry.summary || getExcerpt(entry.body);
  const hasHero = entry.hero?.src;

  return (
    <Card>
      <CardBody className="pt-5">
        <TypeLabel type={entry.type} />

        {/* Header with author and date */}
        <div className="flex items-center gap-2 text-xs text-muted-2">
          <span className="font-medium text-foreground/70">{m(entry, "author") || "Author"}</span>
          <span>·</span>
          <span>{formatDate(entry)}</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-foreground">
          <EntryLink entry={entry}>{entry.title}</EntryLink>
        </h3>

        {/* Hero image (if exists) */}
        {hasHero && (
          <div className="mt-4 overflow-hidden rounded-lg">
            <EntryLink entry={entry}>
              <Image
                src={entry.hero!.src}
                alt={entry.hero!.alt || entry.title || "Post image"}
                width={600}
                height={300}
                className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </EntryLink>
          </div>
        )}

        {/* Summary/Excerpt */}
        {excerpt && (
          <p className="mt-3 text-sm leading-relaxed text-foreground/70 line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.slice(0, 4).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        {/* Read more link */}
        <div className="mt-4 pt-3 border-t border-divider/50">
          <EntryLink entry={entry}>
            <span className="text-sm font-medium text-accent hover:underline">
              Read more →
            </span>
          </EntryLink>
        </div>
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
