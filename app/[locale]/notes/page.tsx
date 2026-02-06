import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { LeftNav } from "@/components/LeftNav";
import { RightRail } from "@/components/RightRail";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Notes page — filtered feed showing NOTE-type content only.
 * Content will be populated from seed data in Phase 3.
 * For now, renders a shell with an empty-state message.
 */
export default function NotesPage({ params }: Props) {
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
            <NotesContent />
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
 * NotesContent — renders the notes heading and items (or empty state).
 * All text resolved from the "notes" translation namespace.
 */
function NotesContent() {
  const t = useTranslations("notes");

  return (
    <Card>
      <CardHeader title={t("heading")} subtitle={t("description")} />
      <CardBody>
        <p className="py-8 text-center text-sm text-foreground/50">
          {t("emptyState")}
        </p>
      </CardBody>
    </Card>
  );
}
