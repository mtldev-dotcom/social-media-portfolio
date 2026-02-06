import { Feed } from "@/components/Feed";
import { LeftNav } from "@/components/LeftNav";
import { ProfileHeader } from "@/components/ProfileHeader";
import { RightRail } from "@/components/RightRail";

export default function Home() {
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
