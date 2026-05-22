"use client";

import { LuX } from "react-icons/lu";
import type { ActiveSelection, FacetKey } from "./catalogFilters";

type ActiveFiltersProps = {
  selections: ActiveSelection[];
  matchCount: number;
  total: number;
  onRemove: (key: FacetKey, value: string) => void;
  onClear: () => void;
};

/** The removable-pill row between the toolbar and the table, with the running "N of M match" tally. */
export const ActiveFilters = ({ selections, matchCount, total, onRemove, onClear }: ActiveFiltersProps) => (
  <div className="flex min-h-7 items-center justify-between gap-4">
    {selections.length > 0 ? (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Active</span>
        {selections.map((selection) => (
          <button
            key={`${selection.key}:${selection.value}`}
            type="button"
            onClick={() => onRemove(selection.key, selection.value)}
            className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs text-primary transition-colors hover:bg-primary/20"
          >
            {selection.label}
            <LuX className="size-3" />
          </button>
        ))}
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      </div>
    ) : (
      <span />
    )}

    <span className="shrink-0 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">{matchCount}</span> of {total} match
    </span>
  </div>
);
