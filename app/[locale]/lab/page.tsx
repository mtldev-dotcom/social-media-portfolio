import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { LeftNav } from "@/components/LeftNav";
import { RightRail } from "@/components/RightRail";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import seedData from "@/content/seed.json";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Lab page — experiments, tools, interactive demos, unfinished ideas.
 * Renders EXPERIMENT-type items from content/seed.json.
 */
export default function LabPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1260px] px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[72px_minmax(0,1fr)_360px]">
          {/* Left icon navigation */}
          <div className="md:pr-0">
            <LeftNav />
          </div>

          {/* Center content */}
          <main className="space-y-4">
            <LabContent />
          </main>

          {/* Right rail */}
          <div className="md:pl-0">
            <RightRail />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * LabContent — renders the lab heading and EXPERIMENT items.
 * Falls back to empty state if no experiments exist.
 */
function LabContent() {
  const tLab = useTranslations("lab");
  const tFeed = useTranslations("feed");

  const experiments = seedData
    .filter((item) => item.type === "EXPERIMENT")
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

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
        experiments.map((item) => (
          <Card key={item.id}>
            <CardBody className="pt-5">
              <span className="mb-2 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
                EXPERIMENT
              </span>
              <p className="text-xs text-muted-2">
                {tFeed(`${item.id}.time`)}
              </p>
              <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
                {tFeed(`${item.id}.title`)}
              </h3>
              <div className="mt-3 space-y-2 text-sm leading-relaxed">
                <p className="text-foreground/80">
                  {tFeed(`${item.id}.what`)}
                </p>
                <p className="text-muted">
                  <span className="font-medium text-foreground/60">
                    why —{" "}
                  </span>
                  {tFeed(`${item.id}.why`)}
                </p>
                <p className="text-muted">
                  <span className="font-medium text-foreground/60">
                    learned —{" "}
                  </span>
                  {tFeed(`${item.id}.learned`)}
                </p>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </>
  );
}
