"use client";

import { useSyncExternalStore } from "react";
import { listPads, type PadSummary } from "./pad";

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

// useSyncExternalStore re-renders whenever getSnapshot returns a new ref — cache by content hash.
let cachedSnapshot: PadSummary[] = [];
let cachedKey = "";

const getSnapshot = (): PadSummary[] => {
  const pads = listPads();
  const key = pads.map((pad) => `${pad.id}:${pad.updatedAt}`).join(",");
  if (key !== cachedKey) {
    cachedSnapshot = pads;
    cachedKey = key;
  }
  return cachedSnapshot;
};

// Empty on the server so the SSR markup matches the client's first paint before hydration. Must be a
// stable ref — useSyncExternalStore loops if getServerSnapshot returns a fresh value each call.
const EMPTY: PadSummary[] = [];
const getServerSnapshot = (): PadSummary[] => EMPTY;

/** Pads saved in this browser, most recently edited first. Subscribes to cross-tab localStorage writes. */
export const useRecentPads = (): PadSummary[] =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
