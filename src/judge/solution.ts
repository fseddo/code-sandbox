import type { SupportedLanguage } from "./problem";

const PREFIX = "noodle:solution:";
const keyFor = (problemId: string) => `${PREFIX}${problemId}`;

/** Per-language source buffers for one problem, as last edited in this browser. */
type StoredSolution = {
  sources: Partial<Record<SupportedLanguage, string>>;
  updatedAt: number;
};

/** Reads a problem's saved source buffers from this browser, or null if none exist. */
export const loadSolution = (problemId: string): StoredSolution["sources"] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(keyFor(problemId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSolution;
    return parsed.sources ?? null;
  } catch {
    return null;
  }
};

/** Persists a problem's source buffers to this browser. */
export const saveSolution = (problemId: string, sources: StoredSolution["sources"]): void => {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredSolution = { sources, updatedAt: Date.now() };
    window.localStorage.setItem(keyFor(problemId), JSON.stringify(payload));
  } catch {
    // localStorage may be full or unavailable — ignore for now.
  }
};
