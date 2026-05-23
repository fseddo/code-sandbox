import type { ProblemSummary } from "@/problems/data/problems";
import type { ProgressStatus } from "@/problems/progress/progress";
import { titleizeSlug } from "@/problems/shared/format";
import { typedEntries } from "@/lib/utils";

/** A catalog row is a problem summary plus the solver's progress and its stable catalog number. */
export type CatalogItem = ProblemSummary & { status: ProgressStatus; number: number };

/** Display labels for progress statuses in the catalog UI (the wireframe's wording, not the raw slug). */
const STATUS_LABEL: Record<ProgressStatus, string> = {
  "not-started": "Not started",
  "in-progress": "Attempted",
  complete: "Completed",
};

/**
 * One filterable dimension's metadata (its key is the registry key). `valuesOf` returns the value(s)
 * an item has for this facet — one for `kind`/`difficulty`/`status`, many for `tags`/`companies` — so
 * the matcher is uniform across one-of and many-of facets. `order` is a fixed display tuple for closed
 * sets; omit it for open sets (topics, companies), which sort alphabetically by label. `labelFor`
 * prettifies a raw value into its chip label.
 */
type FacetDetail = {
  label: string;
  valuesOf: (item: CatalogItem) => readonly string[];
  labelFor: (value: string) => string;
  order?: readonly string[];
};

/**
 * The facet registry — the **one** place a catalog filter is declared, keyed by facet. Mirrors
 * [`ALGO_SETTINGS`](./settings.ts): `as const satisfies Record<string, FacetDetail>` validates each
 * entry's shape (and contextually types `valuesOf`'s param as `CatalogItem`) while keeping the keys
 * literal, so `FacetKey` is *derived* below. Keying by facet makes it exhaustive by construction — a
 * key can't exist without its detail — and drops a redundant `key` field per entry.
 */
const FACETS = {
  kind: {
    label: "Type",
    valuesOf: (item) => [item.kind],
    labelFor: (value) => (value === "algo" ? "Algorithm" : "Build"),
    order: ["algo", "build"],
  },
  difficulty: {
    label: "Difficulty",
    valuesOf: (item) => [item.difficulty],
    labelFor: titleizeSlug,
    order: ["easy", "medium", "hard"],
  },
  status: {
    label: "Status",
    valuesOf: (item) => [item.status],
    labelFor: (value) => STATUS_LABEL[value as ProgressStatus] ?? titleizeSlug(value),
    order: ["not-started", "in-progress", "complete"] satisfies readonly ProgressStatus[],
  },
  tags: {
    label: "Topics",
    valuesOf: (item) => item.tags,
    labelFor: titleizeSlug,
  },
  companies: {
    label: "Companies",
    valuesOf: (item) => item.companies,
    labelFor: titleizeSlug,
  },
} as const satisfies Record<string, FacetDetail>;

/** The filterable dimensions, derived from the registry's keys. */
export type FacetKey = keyof typeof FACETS;

// Passing FacetDetail as the value type widens entries past their precise `as const` literals (so the
// optional `order` reads uniformly), while keys stay FacetKey. The lone cast lives inside the helper.
const facetEntries = typedEntries<FacetKey, FacetDetail>(FACETS);

/** Current selection: per facet, the chosen values. An empty/absent array means "no filter on this facet". */
export type FacetSelection = Partial<Record<FacetKey, string[]>>;

/** One selectable option within a facet: its raw value, display label, and how many items carry it. */
export type FacetOption = { value: string; label: string; count: number };

/** One facet rendered for the UI: its label plus only the option values actually present in the bank. */
export type FacetView = {
  key: FacetKey;
  label: string;
  options: FacetOption[];
};

/**
 * Build the filter bar's facets from the items in hand — options are the values that actually occur
 * (with how many items carry each), so the UI never offers a filter that would match nothing. Closed-set
 * facets keep their declared order; open sets sort alphabetically by label.
 */
export const buildFacetViews = (items: readonly CatalogItem[]): FacetView[] =>
  facetEntries.map(([key, facet]) => {
    const counts = new Map<string, number>();
    for (const item of items)
      for (const value of facet.valuesOf(item)) counts.set(value, (counts.get(value) ?? 0) + 1);

    const values = facet.order
      ? facet.order.filter((value) => counts.has(value))
      : [...counts.keys()].sort((a, b) => facet.labelFor(a).localeCompare(facet.labelFor(b)));

    return {
      key,
      label: facet.label,
      options: values.map((value) => ({ value, label: facet.labelFor(value), count: counts.get(value) ?? 0 })),
    };
  });

/**
 * An item passes when, for every facet that has a selection, at least one of its values is selected —
 * OR within a facet, AND across facets. Facets with no selection are skipped.
 */
const matches = (item: CatalogItem, selection: FacetSelection): boolean =>
  facetEntries.every(([key, facet]) => {
    const chosen = selection[key];
    if (!chosen || chosen.length === 0) return true;
    return facet.valuesOf(item).some((value) => chosen.includes(value));
  });

export const filterCatalog = (
  items: readonly CatalogItem[],
  selection: FacetSelection,
): CatalogItem[] => items.filter((item) => matches(item, selection));

/** Total number of active (non-empty) facet selections — drives the "Clear" affordance. */
export const activeFilterCount = (selection: FacetSelection): number =>
  Object.values(selection).reduce((sum, values) => sum + (values && values.length > 0 ? 1 : 0), 0);

/** One active filter, flattened for the removable-pill row: which facet, the value, and its display label. */
export type ActiveSelection = { key: FacetKey; value: string; label: string };

/** Flatten the selection into labeled (facet, value) pairs, in registry order — drives the "Active:" pills. */
export const activeSelections = (selection: FacetSelection): ActiveSelection[] =>
  facetEntries.flatMap(([key, facet]) =>
    (selection[key] ?? []).map((value) => ({ key, value, label: facet.labelFor(value) })),
  );

/** The fields a free-text search reads — any problem-summary-shaped value qualifies. */
type Searchable = Pick<ProblemSummary, "title" | "tags" | "companies">;

/**
 * Free-text filter over title, topic, and company labels. Generic over the row shape so both the
 * catalog (`CatalogItem`) and the command palette (`ProblemSummary`) share one matcher. An empty
 * query returns the input untouched.
 */
export const searchCatalog = <T extends Searchable>(items: readonly T[], query: string): T[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...items];
  const has = (value: string) => titleizeSlug(value).toLowerCase().includes(needle);
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(needle) || item.tags.some(has) || item.companies.some(has),
  );
};
