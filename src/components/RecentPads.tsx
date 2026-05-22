"use client";

import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { relativeTime, useRecentPads } from "@/pad/useRecentPads";
import { Card } from "@/components/ui/card";

/** Lists pads saved in this browser. Renders nothing until there is one. */
export const RecentPads = () => {
  const pads = useRecentPads();
  if (pads.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Recent pads
      </h2>
      <Card className="gap-0 divide-y overflow-hidden py-0">
        {pads.map((pad) => (
          <Link
            key={pad.id}
            href={`/pad/${pad.id}`}
            className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-accent"
          >
            <span className={pad.title ? "font-medium" : "font-mono"}>{pad.title ?? pad.id}</span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              {relativeTime(pad.updatedAt)}
              <LuArrowRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </Card>
    </div>
  );
};
