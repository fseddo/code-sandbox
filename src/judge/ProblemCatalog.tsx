"use client";

import { useMemo, useState } from "react";
import type { ProblemSummary } from "./problems";
import {
  activeFilterCount,
  buildFacetViews,
  filterCatalog,
  type CatalogItem,
  type FacetKey,
  type FacetSelection,
} from "./catalogFilters";
import { FacetFilterBar } from "./FacetFilterBar";
import { ProblemRow } from "./ProblemRow";
import { useProgress } from "./useProgress";

/** Add or remove a value from a facet's selection, dropping the key entirely when it empties. */
const toggleValue = (selection: FacetSelection, key: FacetKey, value: string): FacetSelection => {
  const current = selection[key] ?? [];
  const next = current.includes(value)
    ? current.filter((entry) => entry !== value)
    : [...current, value];
  return { ...selection, [key]: next };
};

/** The filterable problem catalog: progress-aware rows over a generic facet filter. */
export const ProblemCatalog = ({ problems }: { problems: ProblemSummary[] }) => {
  const statusOf = useProgress();
  const [selection, setSelection] = useState<FacetSelection>({});

  // Status comes from the client-side progress store, so items are derived per render, not synced.
  const items: CatalogItem[] = useMemo(
    () => problems.map((problem) => ({ ...problem, status: statusOf(problem.id) })),
    [problems, statusOf],
  );

  // Options come from the full set (not the filtered view) so a facet never hides its own siblings.
  const facets = useMemo(() => buildFacetViews(items), [items]);
  const visible = useMemo(() => filterCatalog(items, selection), [items, selection]);
  const activeCount = activeFilterCount(selection);

  return (
    <div className="flex flex-col gap-4">
      <FacetFilterBar
        facets={facets}
        selection={selection}
        onToggle={(key, value) => setSelection((prev) => toggleValue(prev, key, value))}
        onClear={() => setSelection({})}
        activeCount={activeCount}
      />

      <p className="px-1 text-xs text-muted-foreground">
        {visible.length} of {items.length} problems
      </p>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No problems match these filters.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((item) => (
            <li key={item.id}>
              <ProblemRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
