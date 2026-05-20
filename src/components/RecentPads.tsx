"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { LuArrowRight } from "react-icons/lu";
import { listPads, type PadSummary } from "@/pad/pad";
import { Card } from "@/components/ui/card";

const relativeTime = (ts: number): string => {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
};

// Only fires on cross-tab writes; same-tab savePad/clearPad don't dispatch `storage`.
const subscribe = (notify: () => void) => {
  window.addEventListener("storage", notify);
  return () => window.removeEventListener("storage", notify);
};

// useSyncExternalStore re-renders whenever getSnapshot returns a new ref — cache by content hash.
let cachedSnapshot: PadSummary[] = [];
let cachedKey = "";

const getSnapshot = (): PadSummary[] => {
  const pads = listPads();
  const key = pads.map((p) => `${p.id}:${p.updatedAt}`).join(",");
  if (key !== cachedKey) {
    cachedSnapshot = pads;
    cachedKey = key;
  }
  return cachedSnapshot;
};

// Empty on the server so the SSR markup matches the client's first paint before hydration.
const getServerSnapshot = (): PadSummary[] => [];

/** Lists pads saved in this browser. Renders nothing until there is one. */
export const RecentPads = () => {
  const pads = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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
            <span className="font-mono">{pad.id}</span>
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
