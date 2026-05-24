"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuChevronDown, LuChevronRight, LuCircle, LuCircleCheck, LuFileText } from "react-icons/lu";
import type { GuideChapterView } from "@/learn/data/curriculum";
import { useProgress } from "@/problems/progress/useProgress";
import { cn } from "@/lib/utils";

const DIFFICULTY_DOT: Record<string, string> = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-rose-400",
};

export const GuideSidebar = ({
  trackTitle,
  chapters,
}: {
  trackTitle: string;
  chapters: GuideChapterView[];
}) => {
  const pathname = usePathname();
  const status = useProgress();
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});

  const problemIds = chapters.flatMap((chapter) =>
    chapter.entries.flatMap((entry) => (entry.kind === "problem" ? [entry.id] : [])),
  );
  const completed = problemIds.filter((id) => status(id) === "complete").length;
  const pct = problemIds.length ? Math.round((completed / problemIds.length) * 100) : 0;

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-4 overflow-y-auto border-r border-sidebar-border bg-sidebar px-3 py-5">
      <div className="space-y-2 px-2">
        <h2 className="text-lg font-semibold tracking-tight">{trackTitle}</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="tabular-nums">
            {completed} / {problemIds.length} completed
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <span className="block h-full rounded-full bg-success transition-[width]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {chapters.map((chapter) => {
          const chapterActive = chapter.entries.some((entry) => entry.href === pathname);
          const open = overrides[chapter.number] ?? chapterActive;
          return (
            <div key={chapter.number}>
              <button
                type="button"
                onClick={() => setOverrides((prev) => ({ ...prev, [chapter.number]: !open }))}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-muted"
              >
                {open ? (
                  <LuChevronDown className="size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <LuChevronRight className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {String(chapter.number).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{chapter.title}</span>
              </button>

              {open && (
                <div className="ml-3 flex flex-col gap-0.5 border-l border-sidebar-border pl-2">
                  {chapter.entries.map((entry) => {
                    const active = entry.href === pathname;
                    return (
                      <Link
                        key={entry.href}
                        href={entry.href}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {entry.kind === "topic" ? (
                          <LuFileText className="size-3.5 shrink-0 opacity-70" />
                        ) : status(entry.id) === "complete" ? (
                          <LuCircleCheck className="size-3.5 shrink-0 text-success" />
                        ) : (
                          <LuCircle className={cn("size-3.5 shrink-0", DIFFICULTY_DOT[entry.difficulty])} />
                        )}
                        <span className="min-w-0 flex-1 truncate">{entry.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
