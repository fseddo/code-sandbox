"use client";

import { useSyncExternalStore } from "react";
import { loadProgress, subscribeProgress, type ProgressEntry, type ProgressStatus } from "./progress";

type ProgressMap = Partial<Record<string, ProgressEntry>>;

// useSyncExternalStore re-renders whenever getSnapshot returns a new ref — cache by content hash.
let cachedSnapshot: ProgressMap = {};
let cachedKey = "";

const getSnapshot = (): ProgressMap => {
  const map = loadProgress();
  const key = Object.entries(map)
    .map(([id, entry]) => `${id}:${entry?.status}:${entry?.completedAt ?? ""}`)
    .join(",");
  if (key !== cachedKey) {
    cachedSnapshot = map;
    cachedKey = key;
  }
  return cachedSnapshot;
};

// Empty on the server so the SSR markup (all "not-started") matches the client's first paint.
const EMPTY: ProgressMap = {};
const getServerSnapshot = (): ProgressMap => EMPTY;

/** Subscribes to progress and resolves a problem's status, defaulting to `not-started` when untouched. */
export const useProgress = (): ((id: string) => ProgressStatus) => {
  const map = useSyncExternalStore(subscribeProgress, getSnapshot, getServerSnapshot);
  return (id) => map[id]?.status ?? "not-started";
};
