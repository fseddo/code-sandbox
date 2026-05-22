"use client";

import type { FacetKey, FacetSelection, FacetView } from "./catalogFilters";
import { cn } from "@/lib/utils";

type FacetFilterBarProps = {
  facets: FacetView[];
  selection: FacetSelection;
  onToggle: (key: FacetKey, value: string) => void;
  onClear: () => void;
  activeCount: number;
};

const Chip = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={isActive}
    className={cn(
      "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
      isActive
        ? "border-primary bg-primary/10 text-primary"
        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
    )}
  >
    {label}
  </button>
);

/** Renders each facet as a labeled row of toggle chips, driven entirely by the facet views. */
export const FacetFilterBar = ({
  facets,
  selection,
  onToggle,
  onClear,
  activeCount,
}: FacetFilterBarProps) => (
  <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
    {facets.map((facet) => (
      <div key={facet.key} className="flex flex-wrap items-center gap-2">
        <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {facet.label}
        </span>
        {facet.options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            isActive={selection[facet.key]?.includes(option.value) ?? false}
            onClick={() => onToggle(facet.key, option.value)}
          />
        ))}
      </div>
    ))}

    {activeCount > 0 && (
      <button
        type="button"
        onClick={onClear}
        className="self-start text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
      </button>
    )}
  </div>
);
