import { use } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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
  ENTRY_TYPES,
} from "@/lib/content";
import type { Entry, EntryType, Locale } from "@/lib/content";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; type: string; slug: string }>;
};

/** Map lowercase URL type to uppercase EntryType. */
function parseType(raw: string): EntryType | null {
  const upper = raw.toUpperCase();
  return ENTRY_TYPES.includes(upper as EntryType) ? (upper as EntryType) : null;
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
export default function EntryDetailPage({ params }: Props) {
  const { locale, type: rawType, slug } = use(params);
  setRequestLocale(locale);

  const entryType = parseType(rawType);
  if (!entryType) notFound();

  const entry = use(getEntryBySlug(locale as Locale, entryType, slug));
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
              &larr; back to feed
            </Link>

            <EntryDetail entry={entry} />
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
 * EntryDetail — renders full entry content based on type.
 */
function EntryDetail({ entry }: { entry: Entry }) {
  const meta = entry.meta ?? {};

  return (
    <Card>
      <CardBody className="space-y-4 pt-5">
        {/* Type label */}
        <span className="inline-block rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
          {entry.type}
        </span>

        {/* Hero image */}
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

        {/* Title */}
        {entry.title && (
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
            {entry.title}
          </h1>
        )}

        {/* Meta line */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-2">
          {(meta.time as string) && <span>{meta.time as string}</span>}
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

        {/* Summary */}
        {entry.summary && (
          <p className="text-sm leading-relaxed text-muted">{entry.summary}</p>
        )}

        {/* Type-specific content */}
        <TypeSpecificContent entry={entry} />

        {/* Body (Markdown) */}
        {entry.body && (
          <div className="border-t border-divider pt-4">
            <Markdown content={entry.body} />
          </div>
        )}

        {/* Tags */}
        {(entry.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-divider pt-4">
            {(entry.tags ?? []).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        {/* Links */}
        {(entry.links ?? []).length > 0 && (
          <div className="flex flex-wrap gap-3 text-sm">
            {(entry.links ?? []).map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/**
 * Renders type-specific sections (testimonial info, story bullets, experiment fields, etc.)
 */
function TypeSpecificContent({ entry }: { entry: Entry }) {
  const meta = entry.meta ?? {};

  switch (entry.type) {
    case "POST":
      if (entry.variant === "testimonial") {
        return (
          <div className="flex items-start gap-3 rounded-lg bg-surface-2 p-4">
            <div className="h-9 w-9 shrink-0 rounded-full border border-divider bg-surface-1" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {meta.from as string}
              </p>
              <p className="text-xs text-muted">{meta.role as string}</p>
              <p className="mt-2 text-sm italic text-foreground/80">
                &ldquo;{meta.comment as string}&rdquo;
              </p>
            </div>
          </div>
        );
      }
      return null;

    case "STORY": {
      const bullets = (meta.bullets as string[]) ?? [];
      return (
        <div>
          <p className="text-sm font-medium text-foreground">
            {meta.role as string}
          </p>
          <p className="text-xs text-muted">{meta.org as string}</p>
          {bullets.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm leading-relaxed">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                  <span className="text-muted">{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    case "EXPERIMENT":
      return (
        <div className="space-y-2 text-sm leading-relaxed">
          {(meta.what as string) && (
            <p className="text-foreground/80">{meta.what as string}</p>
          )}
          {(meta.why as string) && (
            <p className="text-muted">
              <span className="font-medium text-foreground/60">why — </span>
              {meta.why as string}
            </p>
          )}
          {(meta.learned as string) && (
            <p className="text-muted">
              <span className="font-medium text-foreground/60">learned — </span>
              {meta.learned as string}
            </p>
          )}
        </div>
      );

    case "ACTIVITY":
      if (entry.variant === "building") {
        const stack = (meta.stack as string[]) ?? [];
        return (
          <div className="flex flex-wrap gap-2">
            {stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        );
      }
      if (entry.variant === "status") {
        return (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 p-4">
            <p className="text-sm text-muted">{meta.label as string}</p>
            <p className="text-sm text-foreground">{meta.value as string}</p>
          </div>
        );
      }
      return null;

    default:
      return null;
  }
}
