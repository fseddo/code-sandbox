import type { ProblemSummary } from "./problems";
import type { ProgressStatus } from "./progress";
import { titleizeSlug } from "./format";
import { typedEntries } from "@/lib/utils";

/** A catalog row is a problem summary plus the solver's progress on it. */
export type CatalogItem = ProblemSummary & { status: ProgressStatus };

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
 * [`JUDGE_SETTINGS`](./settings.ts): `as const satisfies Record<string, FacetDetail>` validates each
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
    labelFor: titleizeSlug,
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

/** One facet rendered for the UI: its label plus only the option values actually present in the bank. */
export type FacetView = {
  key: FacetKey;
  label: string;
  options: { value: string; label: string }[];
};

/**
 * Build the filter bar's facets from the items in hand — options are the values that actually occur,
 * so the UI never offers a filter that would match nothing. Closed-set facets keep their declared
 * order; open sets sort alphabetically by label.
 */
export const buildFacetViews = (items: readonly CatalogItem[]): FacetView[] =>
  facetEntries.map(([key, facet]) => {
    const present = new Set(items.flatMap((item) => facet.valuesOf(item)));
    const values = facet.order
      ? facet.order.filter((value) => present.has(value))
      : [...present].sort((a, b) => facet.labelFor(a).localeCompare(facet.labelFor(b)));
    return {
      key,
      label: facet.label,
      options: values.map((value) => ({ value, label: facet.labelFor(value) })),
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
