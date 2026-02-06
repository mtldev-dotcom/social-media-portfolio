import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { LeftNav } from "@/components/LeftNav";
import { RightRail } from "@/components/RightRail";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { getEntriesByType } from "@/lib/payload";
import type { BlogEntry, Locale } from "@/lib/payload";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Notes page — filtered feed showing NOTE-type content only.
 * Reads NOTE entries from Payload CMS.
 */
export default function NotesPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const notes = use(getEntriesByType(locale as Locale, "NOTE"));

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1260px] px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[72px_minmax(0,1fr)_360px]">
          <div className="md:pr-0">
            <LeftNav />
          </div>
          <main className="space-y-4">
            <NotesContent notes={notes} />
          </main>
          <div className="md:pl-0">
            <RightRail />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesContent({ notes }: { notes: BlogEntry[] }) {
  const tNotes = useTranslations("notes");

  return (
    <>
      <Card>
        <CardHeader title={tNotes("heading")} subtitle={tNotes("description")} />
      </Card>

      {notes.length === 0 ? (
        <Card>
          <CardBody>
            <p className="py-8 text-center text-sm text-foreground/50">
              {tNotes("emptyState")}
            </p>
          </CardBody>
        </Card>
      ) : (
        notes.map((entry) => (
          <Card key={entry.id}>
            <CardBody className="pt-5">
              <span className="mb-2 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
                NOTE
              </span>
              <p className="text-xs text-muted-2">
                {entry.publishedAt
                  ? new Date(entry.publishedAt).toLocaleDateString(entry.locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : ""}
              </p>
              <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
                <Link
                  href={`/${entry.type.toLowerCase()}/${entry.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {entry.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {entry.body}
              </p>
            </CardBody>
          </Card>
        ))
      )}
    </>
  );
}
