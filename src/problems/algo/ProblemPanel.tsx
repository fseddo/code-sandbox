import { useState } from "react";
import type { ClientProblem, SupportedLanguage } from "@/problems/data/problem";
import { deriveParamNames } from "@/problems/data/problem";
import { Prose } from "@/problems/shared/Prose";
import { SolutionsTab } from "@/problems/algo/SolutionsTab";
import { ArgValues, ResultValue } from "@/components/dataViews/CallValues";
import { CollapsiblePane, type CollapsiblePaneLayout } from "@/components/CollapsiblePane";
import { UnderlineTabs } from "@/components/UnderlineTabs";

const TABS = ["description", "solutions"] as const;
type ProblemTab = (typeof TABS)[number];

const TAB_LABEL: Record<ProblemTab, string> = {
  description: "Description",
  solutions: "Solutions",
};

const DescriptionTab = ({ problem }: { problem: ClientProblem }) => {
  const paramNames = deriveParamNames(
    problem.starterCode.javascript,
    problem.functionName,
    problem.examples[0]?.args.length ?? 0,
  );
  const paramShapes = problem.io?.params;
  const resultShape = problem.io?.result;
  return (
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
                <ArgValues args={example.args} paramNames={paramNames} paramShapes={paramShapes} />
              </div>
              <div>
                <span className="text-muted-foreground">out </span>
                <ResultValue value={example.expected} shape={resultShape} />
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
};

type ProblemPanelProps = CollapsiblePaneLayout & {
  problem: ClientProblem;
  language: SupportedLanguage;
};

export const ProblemPanel = ({ problem, language, ...layout }: ProblemPanelProps) => {
  const [tab, setTab] = useState<ProblemTab>("description");

  return (
    <CollapsiblePane
      {...layout}
      id="problem"
      className="bg-card"
      header={
        <UnderlineTabs
          tabs={TABS}
          labelOf={TAB_LABEL}
          active={tab}
          onSelect={setTab}
          className="h-full"
          tabClassName="flex items-center px-3 text-sm"
        />
      }
    >
      <div className="h-full overflow-auto p-5">
        {tab === "description" ? (
          <DescriptionTab problem={problem} />
        ) : (
          <SolutionsTab solutions={problem.solutions} language={language} />
        )}
      </div>
    </CollapsiblePane>
  );
};
