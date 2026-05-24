"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import type { ProblemSummary } from "@/problems/data/problems";
import type { TopicSummary } from "@/learn/data/topic";
import { CATEGORY_LABELS } from "@/learn/data/topic";
import { DifficultyBadge } from "@/problems/shared/DifficultyBadge";
import { KindBadge } from "@/problems/shared/KindBadge";
import { titleizeSlug } from "@/problems/shared/format";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MAX_PER_GROUP = 6;

type CommandGroup = "Pages" | "Topics" | "Problems";

type CommandItem = {
  key: string;
  title: string;
  href: string;
  group: CommandGroup;
  /** Extra strings the matcher considers (tags, companies) so "array" finds Two Sum, "graph" finds the topic. */
  keywords: string[];
  /** Trailing meta label (e.g. a topic's category). */
  meta?: string;
  /** Present for problem rows — renders the kind + difficulty badges. */
  problem?: ProblemSummary;
};

/** Top-level destinations — always available, so an empty query turns the palette into a launcher. */
const PAGES: CommandItem[] = [
  { key: "page-home", title: "Home", href: "/", group: "Pages", keywords: [] },
  { key: "page-problems", title: "Problems", href: "/problems", group: "Pages", keywords: ["practice", "challenges"] },
  { key: "page-learn", title: "Learn", href: "/learn", group: "Pages", keywords: ["study", "topics"] },
  { key: "page-pads", title: "Pads", href: "/pads", group: "Pages", keywords: ["new", "free", "coding", "scratchpad"] },
];

const GROUP_ORDER: CommandGroup[] = ["Pages", "Topics", "Problems"];

type CommandPaletteProps = {
  problems: ProblemSummary[];
  topics: TopicSummary[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const matches = (item: CommandItem, needle: string) =>
  item.title.toLowerCase().includes(needle) ||
  item.keywords.some((keyword) => titleizeSlug(keyword).toLowerCase().includes(needle));

/** ⌘K palette: fuzzy-search across pages, learn topics, and problems; arrow-navigate, Enter to open. */
export const CommandPalette = ({ problems, topics, isOpen, onOpenChange }: CommandPaletteProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const topicItems: CommandItem[] = topics.map((topic) => ({
      key: `topic-${topic.slug}`,
      title: topic.title,
      href: `/learn/${topic.slug}`,
      group: "Topics",
      keywords: topic.tags ?? [],
      meta: CATEGORY_LABELS[topic.category],
    }));
    const problemItems: CommandItem[] = problems.map((problem) => ({
      key: `problem-${problem.id}`,
      title: problem.title,
      href: `/problems/${problem.id}`,
      group: "Problems",
      keywords: [...problem.tags, ...problem.companies],
      problem,
    }));

    // Empty query → just the destinations (launcher). Otherwise search everything.
    const pool = needle
      ? [...PAGES, ...topicItems, ...problemItems].filter((item) => matches(item, needle))
      : PAGES;

    return GROUP_ORDER.map((group) => ({
      group,
      items: pool.filter((item) => item.group === group).slice(0, MAX_PER_GROUP),
    })).filter((section) => section.items.length > 0);
  }, [query, topics, problems]);

  const flat = sections.flatMap((section) => section.items);
  const indexByKey = new Map(flat.map((item, index) => [item.key, index]));

  const close = () => {
    onOpenChange(false);
    setQuery("");
    setActiveIndex(0);
  };

  const goTo = (item: CommandItem | undefined) => {
    if (!item) return;
    router.push(item.href);
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (flat.length === 0 ? 0 : (prev + 1) % flat.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (flat.length === 0 ? 0 : (prev - 1 + flat.length) % flat.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      goTo(flat[activeIndex]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? onOpenChange(true) : close())}>
      <DialogContent
        showCloseButton={false}
        className="top-[12vh] w-full max-w-xl translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>

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
            placeholder="Search pages, topics, or problems…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="max-h-80 overflow-auto p-2">
          {flat.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results found.</p>
          ) : (
            sections.map((section) => (
              <div key={section.group}>
                <p className="px-3 pt-2 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {section.group}
                </p>
                <ul>
                  {section.items.map((item) => {
                    const index = indexByKey.get(item.key) ?? 0;
                    return (
                      <li key={item.key}>
                        <button
                          type="button"
                          onClick={() => goTo(item)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                            index === activeIndex ? "bg-muted text-foreground" : "text-muted-foreground",
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate font-medium text-foreground">{item.title}</span>
                          {item.problem ? (
                            <>
                              {item.problem.companies[0] ? (
                                <span className="hidden text-xs text-muted-foreground sm:inline">
                                  {titleizeSlug(item.problem.companies[0])}
                                </span>
                              ) : null}
                              <KindBadge kind={item.problem.kind} />
                              <DifficultyBadge difficulty={item.problem.difficulty} />
                            </>
                          ) : item.meta ? (
                            <span className="text-xs text-muted-foreground">{item.meta}</span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
