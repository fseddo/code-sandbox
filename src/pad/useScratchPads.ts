"use client";

import { listScratchPads, type PadSummary } from "./pad";
import { useCachedExternalStore } from "@/lib/useCachedExternalStore";

/** A short relative-time label (`2m ago`, `3d ago`) for a pad's last-edited timestamp. */
export const relativeTime = (ts: number): string => {
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

const hashOf = (pads: PadSummary[]): string => pads.map((pad) => `${pad.id}:${pad.updatedAt}`).join(",");

const EMPTY: PadSummary[] = [];

/** Scratchpads saved in this browser, most recently edited first. Subscribes to cross-tab localStorage writes. */
export const useScratchPads = (): PadSummary[] =>
  useCachedExternalStore(subscribe, listScratchPads, hashOf, EMPTY);
