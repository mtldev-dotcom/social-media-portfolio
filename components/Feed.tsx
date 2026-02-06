import Image from "next/image";
import { Card, CardBody } from "./ui/Card";
import { Tag } from "./ui/Tag";

type FeedItem =
  | {
      id: string;
      kind: "text";
      author: string;
      handle: string;
      time: string;
      content: string;
      stats: { replies: number; reposts: number; likes: number };
    }
  | {
      id: string;
      kind: "project";
      title: string;
      description: string;
      thumbSrc: string;
      tags: string[];
      time: string;
    }
  | {
      id: string;
      kind: "experience";
      role: string;
      org: string;
      time: string;
      bullets: string[];
    }
  | {
      id: string;
      kind: "testimonial";
      from: string;
      role: string;
      time: string;
      comment: string;
    }
  | {
      id: string;
      kind: "building";
      title: string;
      summary: string;
      stack: string[];
      time: string;
    }
  | {
      id: string;
      kind: "status";
      label: string;
      value: string;
      time: string;
    };

/**
 * Feed
 * - Preconditions: Contains stacked card-based posts with social spacing.
 * - Postconditions: Renders a mix of requested post types (X/IG/LinkedIn-inspired).
 */
export function Feed() {
  const items: FeedItem[] = [
    {
      id: "t1",
      kind: "text",
      author: "Nicky Bruno",
      handle: "@nickybruno",
      time: "2h",
      content:
        "Shipping an AI-first automation layer for teams that want calm, reliable workflows — no hype, just systems that stay up.",
      stats: { replies: 12, reposts: 7, likes: 148 },
    },
    {
      id: "p1",
      kind: "project",
      title: "Automation Studio",
      description:
        "A premium dashboard for designing and monitoring AI-assisted automations with human-in-the-loop controls.",
      thumbSrc: "/thumb-automation.svg",
      tags: ["AI", "Automation", "Observability"],
      time: "Yesterday",
    },
    {
      id: "e1",
      kind: "experience",
      role: "Creative Technologist",
      org: "Independent · Client work",
      time: "2023 — Present",
      bullets: [
        "Built AI + automation systems focused on reliability, repeatability, and measurable ROI.",
        "Created editorial-grade product surfaces and interaction patterns for high-trust interfaces.",
        "Delivered end-to-end: concept → prototype → production with clean DX.",
      ],
    },
    {
      id: "c1",
      kind: "project",
      title: "Case Study: Calm Ops",
      description:
        "Redesigned incident workflows into a quiet, high-signal interface with clear ownership and next actions.",
      thumbSrc: "/thumb-case-study.svg",
      tags: ["UX", "Systems", "Ops"],
      time: "Last week",
    },
    {
      id: "b1",
      kind: "building",
      title: "Currently building",
      summary:
        "An AI-native profile layer that turns a portfolio into a living feed of proof, progress, and context.",
      stack: ["Next.js", "TypeScript", "Tailwind v4"],
      time: "Now",
    },
    {
      id: "s1",
      kind: "status",
      label: "Activity",
      value: "Available for projects · Remote-friendly",
      time: "Updated today",
    },
    {
      id: "x1",
      kind: "testimonial",
      from: "Alex R.",
      role: "Product Lead",
      time: "2 weeks ago",
      comment:
        "Rare combo of taste + engineering. The work shipped fast, stayed stable, and felt premium from day one.",
    },
    {
      id: "x2",
      kind: "testimonial",
      from: "Maya S.",
      role: "Founder",
      time: "1 month ago",
      comment:
        "Clear thinking, calm delivery, and excellent automation instincts. Everything came with a plan and a test story.",
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => {
        switch (item.kind) {
          case "text":
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground/90">
                        <span className="font-medium">{item.author}</span>{" "}
                        <span className="text-muted">{item.handle}</span>{" "}
                        <span className="text-muted-2">· {item.time}</span>
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-foreground">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                    <span>{item.stats.replies} Replies</span>
                    <span>{item.stats.reposts} Reposts</span>
                    <span>{item.stats.likes} Likes</span>
                  </div>
                </CardBody>
              </Card>
            );

          case "project":
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-[16/9] w-full border-b border-divider bg-surface-2">
                  <Image
                    src={item.thumbSrc}
                    alt={`${item.title} thumbnail`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardBody className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-2">{item.time}</p>
                      <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );

          case "experience":
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <p className="text-xs text-muted-2">{item.time}</p>
                  <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.org}</p>

                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/90">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40"
                          aria-hidden="true"
                        />
                        <span className="text-muted">{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            );

          case "testimonial":
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <p className="text-xs text-muted-2">{item.time}</p>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full border border-divider bg-surface-2" />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground/90">
                        <span className="font-medium">{item.from}</span>{" "}
                        <span className="text-muted">· {item.role}</span>
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {item.comment}
                      </p>
                      <div className="mt-3 text-xs text-muted">
                        Reply · Like · Share
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );

          case "building":
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <p className="text-xs text-muted-2">{item.time}</p>
                  <h3 className="mt-2 font-display text-base tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.stack.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </CardBody>
              </Card>
            );

          case "status":
            return (
              <Card key={item.id}>
                <CardBody className="pt-5">
                  <p className="text-xs text-muted-2">{item.time}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-muted">{item.label}</p>
                    <p className="text-sm text-foreground">{item.value}</p>
                  </div>
                </CardBody>
              </Card>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

