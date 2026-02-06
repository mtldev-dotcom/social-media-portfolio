import { Card, CardBody } from "./ui/Card";
import { Tag } from "./ui/Tag";
import { Link } from "@/i18n/navigation";
import type { BlogEntry } from "@/lib/payload";

/**
 * TimelineView — groups entries by year.
 * Receives entries as a prop (already fetched from Payload).
 */
export function TimelineView({ entries }: { entries: BlogEntry[] }) {
  /* Group by year */
  const grouped: Record<number, BlogEntry[]> = {};
  for (const entry of entries) {
    const year = new Date(entry.publishedAt).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(entry);
  }

  /* Sort years descending */
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {years.map((year) => (
        <div key={year}>
          <h2 className="mb-3 font-display text-lg font-bold text-foreground/70">
            {year}
          </h2>
          <div className="space-y-2">
            {grouped[year].map((entry) => (
              <TimelineEntry key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * TimelineEntry — compact card for a single timeline item.
 */
function TimelineEntry({ entry }: { entry: BlogEntry }) {
  const title = getTitle(entry);
  const dateStr = entry.publishedAt
    ? new Date(entry.publishedAt).toLocaleDateString(entry.locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Card>
      <CardBody className="flex items-start gap-3 py-3">
        <span className="mt-0.5 inline-block shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
          {entry.type}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground">
            <Link
              href={`/${entry.type.toLowerCase()}/${entry.slug}`}
              className="transition-colors hover:text-accent"
            >
              {title}
            </Link>
          </p>
          <p className="mt-0.5 text-xs text-muted-2">{dateStr}</p>
        </div>

        {(entry.tags ?? []).length > 0 && (
          <div className="hidden flex-wrap gap-1 sm:flex">
            {(entry.tags ?? []).slice(0, 2).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/** Extracts a display title from the entry. */
function getTitle(entry: BlogEntry): string {
  switch (entry.type) {
    case "POST":
      return (entry.body ?? entry.title ?? entry.slug).slice(0, 80) +
        ((entry.body && entry.body.length > 80) ? "…" : "");
    case "NOTE":
    case "EXPERIMENT":
      return entry.title ?? entry.slug;
    default:
      return entry.title ?? entry.slug;
  }
}
