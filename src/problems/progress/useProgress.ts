"use client";

import { loadProgress, subscribeProgress, type ProgressEntry, type ProgressStatus } from "@/problems/progress/progress";
import { useCachedExternalStore } from "@/lib/useCachedExternalStore";

type ProgressMap = Partial<Record<string, ProgressEntry>>;

const hashOf = (map: ProgressMap): string =>
  Object.entries(map)
    .map(([id, entry]) => `${id}:${entry?.status}:${entry?.completedAt ?? ""}`)
    .join(",");

// Empty on the server so the SSR markup (all "not-started") matches the client's first paint.
const EMPTY: ProgressMap = {};

/** Subscribes to progress and resolves a problem's status, defaulting to `not-started` when untouched. */
export const useProgress = (): ((id: string) => ProgressStatus) => {
  const map = useCachedExternalStore(subscribeProgress, loadProgress, hashOf, EMPTY);
  return (id) => map[id]?.status ?? "not-started";
};
