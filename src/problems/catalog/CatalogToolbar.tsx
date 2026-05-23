"use client";

import { LuArrowDownUp, LuSearch, LuZap } from "react-icons/lu";
import { sortLabel, sortOptions, type SortKey } from "@/problems/catalog/catalogSort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CatalogToolbarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  total: number;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onRandom: () => void;
};

/** Search box, sort menu, and a Random jump — the row above the active filters and the table. */
export const CatalogToolbar = ({
  query,
  onQueryChange,
  total,
  sort,
  onSortChange,
  onRandom,
}: CatalogToolbarProps) => (
  <div className="flex items-center gap-2">
    <div className="relative flex-1">
      <LuSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={`Search ${total} problems…`}
        className="h-9 pl-8"
      />
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="lg">
            <LuArrowDownUp />
            {sortLabel(sort)}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={sort} onValueChange={(value) => onSortChange(value as SortKey)}>
          {sortOptions.map((option) => (
            <DropdownMenuRadioItem key={option.key} value={option.key}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <Button variant="secondary" size="lg" onClick={onRandom}>
      <LuZap />
      Random
    </Button>
  </div>
);
