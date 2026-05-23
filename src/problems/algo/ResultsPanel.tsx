import type { ClientProblem, RunMode, SubmissionOutcome } from "@/problems/data/problem";
import { TestcaseTab } from "@/problems/algo/TestcaseTab";
import { TestResult } from "@/problems/algo/TestResult";
import { cn } from "@/lib/utils";

/** Which half of the bottom dock is showing. AlgoWorkspace flips it to "result" on Run/Submit. */
export type ResultsTab = "testcase" | "result";

const TAB_LABEL: Record<ResultsTab, string> = {
  testcase: "Testcase",
  result: "Test Result",
};

type ResultsPanelProps = {
  problem: ClientProblem;
  outcome: SubmissionOutcome | null;
  runningMode: RunMode | null;
  tab: ResultsTab;
  onTabChange: (tab: ResultsTab) => void;
};

/** Bottom dock: a Testcase / Test Result tab pair, mirroring LeetCode's run panel. */
export const ResultsPanel = ({ problem, outcome, runningMode, tab, onTabChange }: ResultsPanelProps) => (
  <div className="flex h-full flex-col bg-card">
    <div role="tablist" className="flex shrink-0 items-stretch gap-1 border-b border-sidebar-border px-3 pt-2">
      {(Object.keys(TAB_LABEL) as ResultsTab[]).map((id) => {
        const active = tab === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(id)}
            className={cn(
              "relative px-3 pb-2 text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {TAB_LABEL[id]}
            {active && <span aria-hidden className="absolute right-0 bottom-0 left-0 h-0.5 bg-primary" />}
          </button>
        );
      })}
    </div>
    <div className="min-h-0 flex-1 overflow-auto p-5">
      {tab === "testcase" ? (
        <TestcaseTab problem={problem} />
      ) : (
        <TestResult outcome={outcome} runningMode={runningMode} problem={problem} />
      )}
    </div>
  </div>
);
