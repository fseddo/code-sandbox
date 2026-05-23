import type { SupportedLanguage } from "@/problems/data/problem";
import { createKeyedStore } from "@/lib/localStore";

/** Per-language source buffers for one problem, as last edited in this browser. */
type StoredSolution = {
  sources: Partial<Record<SupportedLanguage, string>>;
  updatedAt: number;
};

const store = createKeyedStore<StoredSolution>("noodle:solution:");

/** Reads a problem's saved source buffers from this browser, or null if none exist. */
export const loadSolution = (problemId: string): StoredSolution["sources"] | null =>
  store.read(problemId)?.sources ?? null;

/** Persists a problem's source buffers to this browser. */
export const saveSolution = (problemId: string, sources: StoredSolution["sources"]): void =>
  store.write(problemId, { sources, updatedAt: Date.now() });
