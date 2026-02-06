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
 * Lab page — experiments, tools, interactive demos.
 * Reads EXPERIMENT entries from Payload CMS.
 */
export default function LabPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const experiments = use(getEntriesByType(locale as Locale, "EXPERIMENT"));

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1260px] px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[72px_minmax(0,1fr)_360px]">
          <div className="md:pr-0">
            <LeftNav />
          </div>
          <main className="space-y-4">
            <LabContent experiments={experiments} />
          </main>
          <div className="md:pl-0">
            <RightRail />
          </div>
        </div>
      </div>
    </div>
  );
}

function LabContent({ experiments }: { experiments: BlogEntry[] }) {
  const tLab = useTranslations("lab");
  const meta = (entry: BlogEntry) => (entry.meta ?? {}) as { what?: string; why?: string; learned?: string };

  return (
    <>
      <Card>
        <CardHeader title={tLab("heading")} subtitle={tLab("description")} />
      </Card>

      {experiments.length === 0 ? (
        <Card>
          <CardBody>
            <p className="py-8 text-center text-sm text-foreground/50">
              {tLab("emptyState")}
            </p>
          </CardBody>
        </Card>
      ) : (
        experiments.map((entry) => (
          <Card key={entry.id}>
            <CardBody className="pt-5">
              <span className="mb-2 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
                EXPERIMENT
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
              <div className="mt-3 space-y-2 text-sm leading-relaxed">
                <p className="text-foreground/80">
                  {meta(entry).what ?? entry.body}
                </p>
                <p className="text-muted">
                  <span className="font-medium text-foreground/60">why — </span>
                  {meta(entry).why ?? ""}
                </p>
                <p className="text-muted">
                  <span className="font-medium text-foreground/60">learned — </span>
                  {meta(entry).learned ?? ""}
                </p>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </>
  );
}
