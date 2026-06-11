"use client";

import { useState } from "react";
import { LuServer, LuShapes } from "react-icons/lu";
import type { LearnFacetKey, LearnFacetOption, LearnFacetView, LearnSelection } from "./learnFacets";
import { cn } from "@/lib/utils";

type LearnSidebarProps = {
  facets: LearnFacetView[];
  selection: LearnSelection;
  total: number;
  onToggle: (key: LearnFacetKey, value: string) => void;
  onClearFacet: (key: LearnFacetKey) => void;
};

const TRACK_ICON: Record<string, React.ReactNode> = {
  dsa: <LuShapes className="size-3.5" />,
  tech: <LuServer className="size-3.5" />,
};

const Section = ({
  title,
  selectedCount,
  children,
}: {
  title: string;
  selectedCount?: number;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between px-2">
      <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
      {selectedCount ? <span className="text-[0.7rem] text-primary">{selectedCount} selected</span> : null}
    </div>
    {children}
  </div>
);

const OptionRow = ({
  label,
  count,
  isActive,
  leading,
  onClick,
}: {
  label: string;
  count?: number;
  isActive: boolean;
  leading?: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-pressed={isActive}
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
      isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    )}
  >
    {leading}
    <span className="min-w-0 flex-1 truncate text-left">{label}</span>
    {count !== undefined ? <span className="shrink-0 text-xs tabular-nums opacity-60">{count}</span> : null}
  </button>
);

/** A collapsing chip cloud for the open-ended tag facet. */
const TagChips = ({
  options,
  selection,
  onToggle,
  limit,
}: {
  options: LearnFacetOption[];
  selection: LearnSelection;
  onToggle: (key: LearnFacetKey, value: string) => void;
  limit: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? options : options.slice(0, limit);
  const hidden = options.length - shown.length;

  return (
    <div className="flex flex-wrap gap-1.5 px-2">
      {shown.map((option) => {
        const isActive = selection.tags?.includes(option.value) ?? false;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle("tags", option.value)}
            className={cn(
              "rounded-md border px-1.5 py-0.5 text-xs transition-colors",
              isActive
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
      {hidden > 0 ? (
        <button type="button" onClick={() => setExpanded(true)} className="px-1 text-xs text-primary">
          +{hidden}
        </button>
      ) : null}
      {expanded && options.length > limit ? (
        <button type="button" onClick={() => setExpanded(false)} className="px-1 text-xs text-primary">
          Show less
        </button>
      ) : null}
    </div>
  );
};

/** The learn catalog's left rail: a coarse Type (track) facet and an open-ended Tags facet, with counts. */
export const LearnSidebar = ({ facets, selection, total, onToggle, onClearFacet }: LearnSidebarProps) => {
  const optionsFor = (key: LearnFacetKey): LearnFacetOption[] =>
    facets.find((facet) => facet.key === key)?.options ?? [];
  const trackSelected = (selection.track?.length ?? 0) > 0;

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-6 overflow-y-auto border-r border-sidebar-border bg-sidebar px-3 py-6">
      <div className="flex flex-col gap-1 px-2">
        <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">noodle</span>
        <h1 className="text-2xl font-semibold tracking-tight">Concepts</h1>
      </div>

      <Section title="Type">
        <div className="flex flex-col gap-0.5">
          <OptionRow label="All topics" count={total} isActive={!trackSelected} onClick={() => onClearFacet("track")} />
          {optionsFor("track").map((option) => (
            <OptionRow
              key={option.value}
              label={option.label}
              count={option.count}
              isActive={selection.track?.includes(option.value) ?? false}
              leading={TRACK_ICON[option.value]}
              onClick={() => onToggle("track", option.value)}
            />
          ))}
        </div>
      </Section>

      <Section title="Tags" selectedCount={selection.tags?.length}>
        <TagChips options={optionsFor("tags")} selection={selection} onToggle={onToggle} limit={14} />
      </Section>
    </aside>
  );
};
