import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { LeftNav } from "@/components/LeftNav";
import { RightRail } from "@/components/RightRail";
import { Card, CardBody } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Markdown } from "@/components/Markdown";
import { Link } from "@/i18n/navigation";
import {
  getEntryBySlug,
  getAllSlugs,
  BLOG_ENTRY_TYPES,
} from "@/lib/payload";
import type { BlogEntry, BlogEntryType, Locale } from "@/lib/payload";
import { routing } from "@/i18n/routing";
import { Comments } from "@/components/Comments";

type Props = {
  params: Promise<{ locale: string; type: string; slug: string }>;
};

/** Map lowercase URL type to BlogEntryType (post, note, experiment only). */
function parseType(raw: string): BlogEntryType | null {
  const upper = raw.toUpperCase();
  return (BLOG_ENTRY_TYPES as readonly string[]).includes(upper)
    ? (upper as BlogEntryType)
    : null;
}

/**
 * Generate static params for all entry detail pages.
 * Produces a param set for every locale × type × slug combination.
 */
export async function generateStaticParams() {
  const params: { locale: string; type: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    const slugs = await getAllSlugs(locale as Locale);
    for (const { type, slug } of slugs) {
      params.push({ locale, type: type.toLowerCase(), slug });
    }
  }

  return params;
}

/**
 * Generate locale-aware metadata for each entry.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type: rawType, slug } = await params;
  const entryType = parseType(rawType);
  if (!entryType) return {};

  const entry = await getEntryBySlug(locale as Locale, entryType, slug);
  if (!entry) return {};

  return {
    title: `${entry.title ?? entry.slug} — Nicky Bruno`,
    description: entry.summary ?? entry.body?.slice(0, 160),
    alternates: {
      languages: {
        en: `/en/${rawType}/${slug}`,
        fr: `/fr/${rawType}/${slug}`,
      },
    },
  };
}

/**
 * Entry detail page — renders a single content entry.
 * Shared route for all content types: /[locale]/[type]/[slug]
 */
export default async function EntryDetailPage({ params }: Props) {
  const { locale, type: rawType, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("detail");

  const entryType = parseType(rawType);
  if (!entryType) notFound();

  const entry = await getEntryBySlug(locale as Locale, entryType, slug);
  if (!entry) notFound();

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1260px] px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[72px_minmax(0,1fr)_360px]">
          <div className="md:pr-0">
            <LeftNav />
          </div>

          <main className="space-y-4">
            {/* Back link */}
            <Link
              href="/"
              className="inline-block text-xs text-muted transition-colors hover:text-foreground"
            >
              {t("backToFeed")}
            </Link>

            <EntryDetail entry={entry} />
            <Comments
              postId={entry.type === "POST" ? entry.id : undefined}
              noteId={entry.type === "NOTE" ? entry.id : undefined}
              locale={locale}
            />
          </main>

          <div className="md:pl-0">
            <RightRail />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * EntryDetail — renders full entry content (post, note, experiment).
 */
function EntryDetail({ entry }: { entry: BlogEntry }) {
  const meta = (entry.meta ?? {}) as Record<string, unknown>;

  return (
    <Card>
      <CardBody className="space-y-4 pt-5">
        <span className="inline-block rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
          {entry.type}
        </span>

        {entry.hero && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-divider bg-surface-2">
            <Image
              src={entry.hero.src}
              alt={entry.hero.alt ?? entry.title ?? ""}
              fill
              className="object-cover"
            />
          </div>
        )}

        {entry.title && (
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
            {entry.title}
          </h1>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-2">
          {entry.publishedAt && (
            <span>
              {new Date(entry.publishedAt).toLocaleDateString(entry.locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {entry.summary && (
          <p className="text-sm leading-relaxed text-muted">{entry.summary}</p>
        )}

        <TypeSpecificContent entry={entry} />

        {entry.body && (
          <div className="border-t border-divider pt-4">
            <Markdown content={entry.body} />
          </div>
        )}

        {(entry.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-divider pt-4">
            {(entry.tags ?? []).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/**
 * Renders type-specific sections (experiment meta: what, why, learned).
 */
function TypeSpecificContent({ entry }: { entry: BlogEntry }) {
  const meta = (entry.meta ?? {}) as { what?: string; why?: string; learned?: string };

  if (entry.type === "EXPERIMENT" && (meta.what || meta.why || meta.learned)) {
    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {meta.what && <p className="text-foreground/80">{meta.what}</p>}
        {meta.why && (
          <p className="text-muted">
            <span className="font-medium text-foreground/60">why — </span>
            {meta.why}
          </p>
        )}
        {meta.learned && (
          <p className="text-muted">
            <span className="font-medium text-foreground/60">learned — </span>
            {meta.learned}
          </p>
        )}
      </div>
    );
  }

  return null;
}
