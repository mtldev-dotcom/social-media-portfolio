import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { Feed } from "@/components/Feed";
import { LeftNav } from "@/components/LeftNav";
import { ProfileHeader } from "@/components/ProfileHeader";
import { RightRail } from "@/components/RightRail";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  const { locale } = use(params);

  // Enable static rendering for this page.
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1260px] px-4 py-6">
        {/* Desktop 3-column layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[72px_minmax(0,1fr)_360px]">
          {/* Left icon navigation */}
          <div className="md:pr-0">
            <LeftNav />
          </div>

          {/* Center feed */}
          <main className="space-y-4">
            <ProfileHeader />
            <Feed />
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
