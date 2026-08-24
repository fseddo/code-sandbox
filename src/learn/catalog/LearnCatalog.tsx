"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LuArrowRight, LuSearch, LuX } from "react-icons/lu";
import type { TopicSummary } from "@/learn/data/topic";
import { searchCatalog } from "@/problems/catalog/catalogFilters";
import { FILTER_CACHE_KEY, parseFacetParams, syncFilterUrl } from "@/lib/filterParams";
import { CategoryBadge } from "@/learn/shared/CategoryBadge";
import {
  activeLearnSelections,
  buildLearnFacets,
  FACET_KEYS,
  filterTopics,
  type LearnFacetKey,
  type LearnSelection,
} from "./learnFacets";
import { LearnSidebar } from "./LearnSidebar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** A topic row shaped for the generic `searchCatalog` (title + tags + companies); topics carry no companies. */
type TopicRow = TopicSummary & { tags: string[]; companies: string[] };

/** One top-level row plus the visible children whose `parent` points at it (e.g. BFS/DFS under Graphs). */
type TopicGroup = { topic: TopicRow; children: TopicRow[] };

/**
 * Nest each visible child under its parent, provided the parent is also visible — a child whose parent got
 * filtered/searched out stays at top level instead of disappearing. Order otherwise follows `rows` (registry order).
 */
const groupTopicRows = (rows: TopicRow[]): TopicGroup[] => {
  const visibleSlugs = new Set(rows.map((row) => row.slug));
  const childrenByParent = new Map<string, TopicRow[]>();
  for (const row of rows) {
    if (row.parent && visibleSlugs.has(row.parent)) {
      childrenByParent.set(row.parent, [...(childrenByParent.get(row.parent) ?? []), row]);
    }
  }
  return rows
    .filter((row) => !(row.parent && visibleSlugs.has(row.parent)))
    .map((topic) => ({ topic, children: childrenByParent.get(topic.slug) ?? [] }));
};

/** One catalog row; `compact` renders a child topic nested under its parent (indented, smaller title). */
const TopicListRow = ({ topic, compact }: { topic: TopicRow; compact?: boolean }) => (
  <Link
    href={`/concepts/${topic.slug}`}
    className={cn(
      "group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50",
      compact && "pl-9",
    )}
  >
    <div className="min-w-0 flex-1 space-y-0.5">
      <div className="flex items-center gap-2">
        <span className={cn("truncate font-medium", compact && "text-sm text-muted-foreground")}>{topic.title}</span>
        <CategoryBadge category={topic.category} />
      </div>
      <p className="truncate text-sm text-muted-foreground">{topic.summary}</p>
    </div>
    <LuArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
  </Link>
);

/** Add or remove a value from a facet's selection, dropping the key entirely when it empties. */
const toggleValue = (selection: LearnSelection, key: LearnFacetKey, value: string): LearnSelection => {
  const current = selection[key] ?? [];
  const next = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value];
  return { ...selection, [key]: next };
};

export const LearnCatalog = ({ topics }: { topics: TopicSummary[] }) => {
  const searchParams = useSearchParams();
  const [selection, setSelection] = useState<LearnSelection>(() => parseFacetParams(searchParams, FACET_KEYS));
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  // Mirror filters to the URL (no navigation) so browser-back restores them and the view is shareable.
  useEffect(() => {
    syncFilterUrl(selection, { q: query.trim() }, FILTER_CACHE_KEY.learn);
  }, [selection, query]);

  // Each facet's options reflect the *other* facets' selections (so Type narrows Tags), but never itself.
  const facets = useMemo(() => buildLearnFacets(topics, selection), [topics, selection]);
  const visible = useMemo(() => {
    const rows: TopicRow[] = filterTopics(topics, selection).map((topic) => ({
      ...topic,
      tags: topic.tags ?? [],
      companies: [],
    }));
    return searchCatalog(rows, query);
  }, [topics, selection, query]);
  const groups = useMemo(() => groupTopicRows(visible), [visible]);

  const toggle = (key: LearnFacetKey, value: string) => setSelection((prev) => toggleValue(prev, key, value));
  const clearFacet = (key: LearnFacetKey) =>
    setSelection((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const active = activeLearnSelections(selection);

  return (
    <div className="flex min-h-0 flex-1">
      <LearnSidebar
        facets={facets}
        selection={selection}
        total={topics.length}
        onToggle={toggle}
        onClearFacet={clearFacet}
      />

      <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-auto px-6 py-6">
        <div className="relative">
          <LuSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${topics.length} topics…`}
            className="h-9 pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {active.map((pill) => (
            <button
              key={`${pill.key}:${pill.value}`}
              type="button"
              onClick={() => toggle(pill.key, pill.value)}
              className="flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs text-primary transition-colors hover:bg-primary/20"
            >
              {pill.label}
              <LuX className="size-3" />
            </button>
          ))}
          <span className="text-xs text-muted-foreground">
            {visible.length} of {topics.length}
            {active.length > 0 ? (
              <button
                type="button"
                onClick={() => setSelection({})}
                className="ml-2 text-primary underline-offset-2 hover:underline"
              >
                Clear
              </button>
            ) : null}
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No topics match.
          </div>
        ) : (
          <div className="shrink-0 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {groups.map(({ topic, children }) => (
              <div key={topic.slug} className="divide-y divide-border/60">
                <TopicListRow topic={topic} />
                {children.map((child) => (
                  <TopicListRow key={child.slug} topic={child} compact />
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
