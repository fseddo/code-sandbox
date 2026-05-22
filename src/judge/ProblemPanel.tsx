import { useState } from "react";
import type { ClientProblem, SupportedLanguage } from "./problem";
import { Prose } from "./Prose";
import { SolutionsTab } from "./SolutionsTab";
import { stringify } from "./format";
import { cn } from "@/lib/utils";

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
        {problem.examples.map((example, index) => (
          <li
            key={index}
            className="rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground"
          >
            <div className="text-muted-foreground">{example.name ?? `case ${index + 1}`}</div>
            <div>
              <span className="text-muted-foreground">in </span>
              {example.args.map(stringify).join(", ")}
            </div>
            <div>
              <span className="text-muted-foreground">out </span>
              {stringify(example.expected)}
            </div>
            {example.explanation ? (
              <div className="mt-1 font-sans text-muted-foreground">{example.explanation}</div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>

    {problem.constraints.length > 0 ? (
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Constraints</h2>
        <ul className="flex flex-col gap-1 font-mono text-xs text-muted-foreground">
          {problem.constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>
      </section>
    ) : null}
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
      <header className="flex shrink-0 border-b border-sidebar-border px-5 pt-3">
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
