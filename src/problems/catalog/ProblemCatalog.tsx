"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProblemSummary } from "@/problems/data/problems";
import {
  activeSelections,
  buildFacetViews,
  FACET_KEYS,
  filterCatalog,
  searchCatalog,
  type CatalogItem,
  type FacetKey,
  type FacetSelection,
} from "@/problems/catalog/catalogFilters";
import { DEFAULT_SORT, sortItems, sortOptions, type SortKey } from "@/problems/catalog/catalogSort";
import { FILTER_CACHE_KEY, parseFacetParams, syncFilterUrl } from "@/lib/filterParams";
import { CatalogSidebar } from "@/problems/catalog/CatalogSidebar";
import { CatalogToolbar } from "@/problems/catalog/CatalogToolbar";
import { ActiveFilters } from "@/problems/catalog/ActiveFilters";
import { CatalogTable } from "@/problems/catalog/CatalogTable";
import { useProgress } from "@/problems/progress/useProgress";

/** Add or remove a value from a facet's selection, dropping the key entirely when it empties. */
const toggleValue = (selection: FacetSelection, key: FacetKey, value: string): FacetSelection => {
  const current = selection[key] ?? [];
  const next = current.includes(value)
    ? current.filter((entry) => entry !== value)
    : [...current, value];
  return { ...selection, [key]: next };
};

/** The filterable problem catalog: faceted sidebar, search/sort toolbar, and progress-aware rows. */
export const ProblemCatalog = ({ problems }: { problems: ProblemSummary[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusOf = useProgress();
  const [selection, setSelection] = useState<FacetSelection>(() => parseFacetParams(searchParams, FACET_KEYS));
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [sort, setSort] = useState<SortKey>(() => {
    const raw = searchParams.get("sort");
    return sortOptions.some((option) => option.key === raw) ? (raw as SortKey) : DEFAULT_SORT;
  });

  // Mirror filters to the URL (no navigation) so browser-back restores them and the view is shareable.
  useEffect(() => {
    syncFilterUrl(selection, { q: query.trim(), sort: sort === DEFAULT_SORT ? "" : sort }, FILTER_CACHE_KEY.problems);
  }, [selection, query, sort]);

  // Status comes from the client-side progress store, so items are derived per render, not synced.
  // `number` is the problem's stored catalog number — stable across sorts and shown in the "#" column.
  const items: CatalogItem[] = useMemo(
    () => problems.map((problem) => ({ ...problem, status: statusOf(problem.id) })),
    [problems, statusOf],
  );

  // Options come from the full set (not the filtered view) so a facet never hides its own siblings.
  const facets = useMemo(() => buildFacetViews(items), [items]);
  const visible = useMemo(() => {
    const matched = searchCatalog(filterCatalog(items, selection), query);
    return sortItems(matched, sort);
  }, [items, selection, query, sort]);

  const toggle = (key: FacetKey, value: string) =>
    setSelection((prev) => toggleValue(prev, key, value));

  const clearFacet = (key: FacetKey) =>
    setSelection((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const goRandom = () => {
    if (visible.length === 0) return;
    const pick = visible[Math.floor(Math.random() * visible.length)];
    router.push(`/problems/${pick.id}`);
  };

  return (
    <div className="flex min-h-0 flex-1">
      <CatalogSidebar
        facets={facets}
        selection={selection}
        total={items.length}
        onToggle={toggle}
        onClearFacet={clearFacet}
      />

      <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-auto px-6 py-6">
        <CatalogToolbar
          query={query}
          onQueryChange={setQuery}
          total={items.length}
          sort={sort}
          onSortChange={setSort}
          onRandom={goRandom}
        />
        <ActiveFilters
          selections={activeSelections(selection)}
          matchCount={visible.length}
          total={items.length}
          onRemove={toggle}
          onClear={() => setSelection({})}
        />
        <CatalogTable items={visible} />
      </main>
    </div>
  );
};
