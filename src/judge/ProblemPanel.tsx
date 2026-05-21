import { useState } from "react";
import type { ClientProblem, SupportedLanguage } from "./problem";
import { DifficultyBadge } from "./DifficultyBadge";
import { Prose } from "./Prose";
import { SolutionsTab } from "./SolutionsTab";
import { cn } from "@/lib/utils";

const stringify = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const TABS = ["description", "solutions"] as const;
type ProblemTab = (typeof TABS)[number];

const TAB_LABEL: Record<ProblemTab, string> = {
  description: "Description",
  solutions: "Solutions",
};

const DescriptionTab = ({ problem }: { problem: ClientProblem }) => (
  <div className="flex flex-col gap-6">
    <Prose text={problem.prompt} />

    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Example cases</h2>
      <ul className="flex flex-col gap-2">
        {problem.tests.map((test, index) => (
          <li
            key={index}
            className="rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground"
          >
            <div className="text-muted-foreground">{test.name ?? `case ${index + 1}`}</div>
            <div>
              <span className="text-muted-foreground">in </span>
              {test.args.map(stringify).join(", ")}
            </div>
            <div>
              <span className="text-muted-foreground">out </span>
              {stringify(test.expected)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  </div>
);

export const ProblemPanel = ({
  problem,
  language,
}: {
  problem: ClientProblem;
  language: SupportedLanguage;
}) => {
  const [tab, setTab] = useState<ProblemTab>("description");

  return (
    <div className="flex h-full flex-col bg-card">
      <header className="flex shrink-0 flex-col gap-3 border-b border-sidebar-border px-5 pt-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold tracking-tight">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <div role="tablist" className="flex items-stretch">
          {TABS.map((id) => {
            const active = tab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={cn(
                  "relative px-3 pb-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {TAB_LABEL[id]}
                {active ? (
                  <span aria-hidden className="absolute right-0 bottom-0 left-0 h-0.5 bg-primary" />
                ) : null}
              </button>
            );
          })}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        {tab === "description" ? (
          <DescriptionTab problem={problem} />
        ) : (
          <SolutionsTab solutions={problem.solutions} language={language} />
        )}
      </div>
    </div>
  );
};
