"use client";

import { useState } from "react";
import { LuCode, LuShapes } from "react-icons/lu";
import type { Difficulty } from "./problem";
import type { FacetKey, FacetOption, FacetSelection, FacetView } from "./catalogFilters";
import { CompanyAvatar } from "./CompanyAvatar";
import { cn } from "@/lib/utils";

type CatalogSidebarProps = {
  facets: FacetView[];
  selection: FacetSelection;
  total: number;
  onToggle: (key: FacetKey, value: string) => void;
  onClearFacet: (key: FacetKey) => void;
};

const DIFFICULTY_DOT: Record<Difficulty, string> = {
  easy: "bg-ok",
  medium: "bg-warn",
  hard: "bg-danger",
};

const KIND_ICON: Record<string, React.ReactNode> = {
  algo: <LuCode className="size-3.5" />,
  build: <LuShapes className="size-3.5" />,
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
      isActive
        ? "bg-muted font-medium text-foreground"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    )}
  >
    {leading}
    <span className="min-w-0 flex-1 truncate text-left">{label}</span>
    {count !== undefined ? <span className="shrink-0 text-xs tabular-nums opacity-60">{count}</span> : null}
  </button>
);

const MoreButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="self-start px-2 py-0.5 text-xs text-primary underline-offset-2 hover:underline"
  >
    {children}
  </button>
);

/** A collapsing list of option rows — shows `limit` rows, then a "Show N more" toggle. */
const RowList = ({
  facetKey,
  options,
  selection,
  onToggle,
  leadingFor,
  limit,
}: {
  facetKey: FacetKey;
  options: FacetOption[];
  selection: FacetSelection;
  onToggle: (key: FacetKey, value: string) => void;
  leadingFor?: (value: string) => React.ReactNode;
  limit: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? options : options.slice(0, limit);
  const hidden = options.length - shown.length;

  return (
    <div className="flex flex-col gap-0.5">
      {shown.map((option) => (
        <OptionRow
          key={option.value}
          label={option.label}
          count={option.count}
          isActive={selection[facetKey]?.includes(option.value) ?? false}
          leading={leadingFor?.(option.value)}
          onClick={() => onToggle(facetKey, option.value)}
        />
      ))}
      {hidden > 0 ? <MoreButton onClick={() => setExpanded(true)}>Show {hidden} more</MoreButton> : null}
      {expanded && options.length > limit ? (
        <MoreButton onClick={() => setExpanded(false)}>Show less</MoreButton>
      ) : null}
    </div>
  );
};

/** A collapsing chip cloud for open-ended topics — collapses behind a "+N" affordance. */
const TopicChips = ({
  options,
  selection,
  onToggle,
  limit,
}: {
  options: FacetOption[];
  selection: FacetSelection;
  onToggle: (key: FacetKey, value: string) => void;
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

/** The catalog's left rail: faceted filters grouped by dimension, each option carrying its bank count. */
export const CatalogSidebar = ({ facets, selection, total, onToggle, onClearFacet }: CatalogSidebarProps) => {
  const optionsFor = (key: FacetKey): FacetOption[] => facets.find((facet) => facet.key === key)?.options ?? [];
  const kindSelected = (selection.kind?.length ?? 0) > 0;

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-3 py-6">
      <div className="flex flex-col gap-1 px-2">
        <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">noodle</span>
        <h1 className="text-2xl font-semibold tracking-tight">Problems</h1>
      </div>

      <Section title="Type">
        <div className="flex flex-col gap-0.5">
          <OptionRow
            label="All problems"
            count={total}
            isActive={!kindSelected}
            onClick={() => onClearFacet("kind")}
          />
          {optionsFor("kind").map((option) => (
            <OptionRow
              key={option.value}
              label={option.label}
              count={option.count}
              isActive={selection.kind?.includes(option.value) ?? false}
              leading={KIND_ICON[option.value]}
              onClick={() => onToggle("kind", option.value)}
            />
          ))}
        </div>
      </Section>

      <Section title="Difficulty">
        <RowList
          facetKey="difficulty"
          options={optionsFor("difficulty")}
          selection={selection}
          onToggle={onToggle}
          limit={3}
          leadingFor={(value) => (
            <span className={cn("size-2 shrink-0 rounded-full", DIFFICULTY_DOT[value as Difficulty])} />
          )}
        />
      </Section>

      <Section title="Status">
        <RowList
          facetKey="status"
          options={optionsFor("status")}
          selection={selection}
          onToggle={onToggle}
          limit={3}
        />
      </Section>

      <Section title="Topics" selectedCount={selection.tags?.length}>
        <TopicChips options={optionsFor("tags")} selection={selection} onToggle={onToggle} limit={11} />
      </Section>

      <Section title="Companies" selectedCount={selection.companies?.length}>
        <RowList
          facetKey="companies"
          options={optionsFor("companies")}
          selection={selection}
          onToggle={onToggle}
          limit={6}
          leadingFor={(value) => <CompanyAvatar company={value} />}
        />
      </Section>
    </aside>
  );
};
