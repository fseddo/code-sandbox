import type { Difficulty } from "@/problems/data/problem";
import type { CatalogItem } from "@/problems/catalog/catalogFilters";

/** Easy → Hard, so a difficulty sort reads top-down by rising challenge. */
const DIFFICULTY_RANK: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

type SortDetail = { label: string; compare: (a: CatalogItem, b: CatalogItem) => number };

/**
 * The catalog's sort options — the **one** place a sort is declared, keyed by id. `as const satisfies`
 * keeps each `compare` contextually typed against `CatalogItem` while leaving the keys literal, so
 * `SortKey` is *derived* below rather than hand-maintained. The stable catalog `number` (authored
 * order) is the newest/oldest axis and the tiebreaker everywhere else.
 */
const SORTS = {
  newest: { label: "Newest first", compare: (a, b) => b.number - a.number },
  oldest: { label: "Oldest first", compare: (a, b) => a.number - b.number },
  difficulty: {
    label: "Difficulty",
    compare: (a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty] || a.number - b.number,
  },
  title: { label: "Title A–Z", compare: (a, b) => a.title.localeCompare(b.title) },
} as const satisfies Record<string, SortDetail>;

export type SortKey = keyof typeof SORTS;

export const DEFAULT_SORT: SortKey = "newest";

/** The sort options as `{ key, label }`, for rendering the sort menu in declared order. */
export const sortOptions = (Object.keys(SORTS) as SortKey[]).map((key) => ({ key, label: SORTS[key].label }));

export const sortLabel = (key: SortKey): string => SORTS[key].label;

/** Return a new array sorted by the chosen key (never mutates the input). */
export const sortItems = (items: readonly CatalogItem[], key: SortKey): CatalogItem[] =>
  [...items].sort(SORTS[key].compare);
