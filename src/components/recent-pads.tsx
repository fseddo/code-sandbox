"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { listPads, type PadSummary } from "@/lib/pad";
import { Card } from "@/components/ui/card";

function relativeTime(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

/** Lists pads saved in this browser. Renders nothing until there is one. */
export function RecentPads() {
  const [pads, setPads] = useState<PadSummary[] | null>(null);

  // localStorage is client-only, so read after mount to avoid hydration drift.
  useEffect(() => {
    setPads(listPads());
  }, []);

  if (!pads || pads.length === 0) return null;

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
            <span className="font-mono">{pad.id}</span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              {relativeTime(pad.updatedAt)}
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </Card>
    </div>
  );
}
