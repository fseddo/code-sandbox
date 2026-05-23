import type { SupportedLanguage } from "@/problems/data/problem";

const KEY = "noodle:progress";

/**
 * Per-problem progress, single state per problem. `not-started` is the *absence* of a record, so the
 * map only stores the two touched states. Algo problems reach `complete` automatically when a Submit
 * passes every case; build problems have no pass/fail oracle, so `complete` there is the solver's own
 * "mark as done" — see [navigation.md](../../docs/features/navigation.md).
 */
export type ProgressStatus = "not-started" | "in-progress" | "complete";

/** The answer captured when an algo problem is completed — the buffer that passed Submit. */
export type CompletedSolution = {
  language: SupportedLanguage;
  source: string;
};

/**
 * A stored entry. `status` is the touched state; `completedAt` and `solution` only exist once a
 * problem is `complete` (`solution` only for algo — build completions have no graded answer to keep).
 */
export type ProgressEntry = {
  status: Exclude<ProgressStatus, "not-started">;
  completedAt?: number;
  solution?: CompletedSolution;
};

type ProgressMap = Partial<Record<string, ProgressEntry>>;

const read = (): ProgressMap => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
};

const write = (map: ProgressMap): void => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // localStorage may be full or unavailable — ignore.
  }
  notify();
};

/** Same-tab subscribers — the `storage` event only fires cross-tab. */
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

export const subscribeProgress = (onChange: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

export const loadProgress = (): ProgressMap => read();

export const getEntry = (id: string): ProgressEntry | undefined => read()[id];

export const getStatus = (id: string): ProgressStatus => read()[id]?.status ?? "not-started";

/** Promote to `in-progress`, but never demote a problem already `complete`. */
export const markInProgress = (id: string): void => {
  const map = read();
  if (map[id]) return;
  write({ ...map, [id]: { status: "in-progress" } });
};

/** Mark complete, stamping the time and (for algo) the answer that passed. Re-completing refreshes both. */
export const markComplete = (id: string, solution?: CompletedSolution): void => {
  write({ ...read(), [id]: { status: "complete", completedAt: Date.now(), solution } });
};

/** Build-only manual toggle: flips complete ↔ in-progress (it was opened, so never back to `not-started`). */
export const toggleComplete = (id: string): void => {
  const map = read();
  const next: ProgressEntry =
    map[id]?.status === "complete"
      ? { status: "in-progress" }
      : { status: "complete", completedAt: Date.now() };
  write({ ...map, [id]: next });
};
