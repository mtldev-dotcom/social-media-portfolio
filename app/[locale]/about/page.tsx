import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { LeftNav } from "@/components/LeftNav";
import { RightRail } from "@/components/RightRail";
import { Card, CardBody } from "@/components/ui/Card";
import { IconVerified } from "@/components/icons";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * About page — static profile snapshot.
 * Not a feed; a single-view page with bio, background, and status.
 */
export default function AboutPage({ params }: Props) {
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
            <AboutContent />
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
 * AboutContent — renders the static about snapshot.
 * All text resolved from the "about" translation namespace.
 */
function AboutContent() {
  const t = useTranslations("about");

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-center gap-4 pb-4 text-center md:flex-row md:items-start md:text-left">
          {/* Avatar */}
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src="/avatar-nicky.svg"
              alt={t("heading")}
              width={80}
              height={80}
              className="h-full w-full rounded-full border-2 border-divider object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 text-accent">
              <IconVerified className="h-5 w-5" />
            </span>
          </div>

          {/* Identity */}
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {t("heading")}
            </h1>
            <p className="text-sm text-foreground/60">{t("tagline")}</p>
            <p className="whitespace-pre-line text-base text-foreground/80">
              {t("bio")}
            </p>
          </div>
        </div>

        {/* Background */}
        <div className="space-y-3 border-t border-divider pt-4">
          <p className="text-sm leading-relaxed text-foreground/80">
            {t("background")}
          </p>
          <p className="text-xs text-foreground/50">{t("basedIn")}</p>
          <p className="text-xs text-accent">{t("status")}</p>
        </div>
      </CardBody>
    </Card>
  );
}
