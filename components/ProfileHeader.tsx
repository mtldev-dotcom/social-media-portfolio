import Image from "next/image";
import { IconVerified } from "./icons";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

/**
 * ProfileHeader
 * - Preconditions: Must match the spec exactly (name/headline/location/status/buttons).
 * - Postconditions: Renders the top "profile header" like a premium social profile.
 */
export function ProfileHeader() {
  return (
    <Card className="overflow-hidden">
      {/* Compact cover strip (neutral, no gradients). */}
      <div className="h-20 w-full border-b border-divider bg-surface-2" />

      <div className="px-5 pb-5">
        <div className="-mt-10 flex items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-divider bg-surface-1 shadow-card">
              <Image
                src="/avatar-nicky.svg"
                alt="Nicky Bruno avatar"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl tracking-tight text-foreground">
                  Nicky Bruno
                </h1>
                <span
                  className="inline-flex items-center justify-center rounded-full bg-accent p-1"
                  aria-label="Verified"
                  title="Verified"
                >
                  <IconVerified className="h-4 w-4" />
                </span>
              </div>

              <p className="mt-1 text-sm text-muted">
                Creative Technologist · AI &amp; Automation
              </p>
              <p className="mt-1 text-sm text-muted-2">Montreal · Remote</p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-divider bg-surface-2 px-3 py-1 text-xs text-muted">
                <span
                  className="h-2 w-2 rounded-full bg-accent"
                  aria-hidden="true"
                />
                Available for projects
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 pb-1 md:flex">
            <Button variant="primary">Follow</Button>
            <Button variant="secondary">Contact</Button>
            <Button variant="secondary">Book a Call</Button>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="mt-4 flex flex-wrap gap-2 md:hidden">
          <Button variant="primary" className="flex-1">
            Follow
          </Button>
          <Button variant="secondary" className="flex-1">
            Contact
          </Button>
          <Button variant="secondary" className="flex-1">
            Book a Call
          </Button>
        </div>
      </div>
    </Card>
  );
}

