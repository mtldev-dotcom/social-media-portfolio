import { useTranslations } from "next-intl";
import { Card, CardBody } from "./ui/Card";
import { Tag } from "./ui/Tag";
import seedData from "@/content/seed.json";

type ContentType = "POST" | "PROJECT" | "NOTE" | "EXPERIMENT" | "STORY" | "ACTIVITY";

type SeedItem = {
  id: string;
  type: ContentType;
  variant: string;
  timestamp: string;
  tags: string[];
  media: string | null;
};

/**
 * TimelineView — groups feed items by year.
 * Renders items as compact timeline entries, grouped under year headings.
 * Doubles as a CV / career overview.
 */
export function TimelineView() {
  const t = useTranslations("feed");

  /* Sort by timestamp descending */
  const sorted = [...(seedData as SeedItem[])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  /* Group by year */
  const grouped: Record<string, SeedItem[]> = {};
  for (const item of sorted) {
    const year = new Date(item.timestamp).getFullYear().toString();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(item);
  }

  /* Sort years descending */
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6">
      {years.map((year) => (
        <div key={year}>
          {/* Year heading */}
          <h2 className="mb-3 font-display text-lg font-bold text-foreground/70">
            {year}
          </h2>

          <div className="space-y-2">
            {grouped[year].map((item) => (
              <TimelineEntry key={item.id} item={item} t={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * TimelineEntry — compact card for a single timeline item.
 * Shows type badge, title/summary, and time.
 */
function TimelineEntry({
  item,
  t,
}: {
  item: SeedItem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}) {
  const title = getTitle(item, t);

  return (
    <Card>
      <CardBody className="flex items-start gap-3 py-3">
        {/* Type badge */}
        <span className="mt-0.5 inline-block shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
          {item.type}
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-2">
            {t(`${item.id}.time`)}
          </p>
        </div>

        {/* Tags (first 2 only for compactness) */}
        {item.tags.length > 0 && (
          <div className="hidden flex-wrap gap-1 sm:flex">
            {item.tags.slice(0, 2).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/**
 * Extracts a display title from the item based on its type/variant.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTitle(item: SeedItem, t: any): string {
  switch (item.type) {
    case "POST":
      if (item.variant === "testimonial") {
        return `${t(`${item.id}.from`)} — "${t(`${item.id}.comment`)}"`.slice(0, 80);
      }
      return t(`${item.id}.content`).slice(0, 80) + "…";
    case "PROJECT":
      return t(`${item.id}.title`);
    case "STORY":
      return `${t(`${item.id}.role`)} · ${t(`${item.id}.org`)}`;
    case "NOTE":
      return t(`${item.id}.title`);
    case "EXPERIMENT":
      return t(`${item.id}.title`);
    case "ACTIVITY":
      if (item.variant === "building") return t(`${item.id}.title`);
      return t(`${item.id}.value`);
    default:
      return item.id;
  }
}
