"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import type { ProblemSummary } from "@/problems/data/problems";
import { searchCatalog } from "@/problems/catalog/catalogFilters";
import { DifficultyBadge } from "@/problems/shared/DifficultyBadge";
import { KindBadge } from "@/problems/shared/KindBadge";
import { titleizeSlug } from "@/problems/shared/format";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MAX_RESULTS = 8;

type CommandPaletteProps = {
  problems: ProblemSummary[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

/** ⌘K command palette: type to fuzzy-match problems by title/topic/company, arrow-navigate, Enter to open. */
export const CommandPalette = ({ problems, isOpen, onOpenChange }: CommandPaletteProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = searchCatalog(problems, query).slice(0, MAX_RESULTS);

  const close = () => {
    onOpenChange(false);
    setQuery("");
    setActiveIndex(0);
  };

  const goTo = (problem: ProblemSummary | undefined) => {
    if (!problem) return;
    router.push(`/problems/${problem.id}`);
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (results.length === 0 ? 0 : (prev + 1) % results.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (results.length === 0 ? 0 : (prev - 1 + results.length) % results.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      goTo(results[activeIndex]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? onOpenChange(true) : close())}>
      <DialogContent
        showCloseButton={false}
        className="top-[12vh] w-full max-w-xl translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Search problems</DialogTitle>

        <div className="flex items-center gap-2 border-b border-border px-3">
          <LuSearch className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Jump to problem, topic, or company…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <ul className="max-h-80 overflow-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No problems found.</li>
          ) : (
            results.map((problem, index) => (
              <li key={problem.id}>
                <button
                  type="button"
                  onClick={() => goTo(problem)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    index === activeIndex ? "bg-muted text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground">{problem.title}</span>
                  {problem.companies[0] ? (
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {titleizeSlug(problem.companies[0])}
                    </span>
                  ) : null}
                  <KindBadge kind={problem.kind} />
                  <DifficultyBadge difficulty={problem.difficulty} />
                </button>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
