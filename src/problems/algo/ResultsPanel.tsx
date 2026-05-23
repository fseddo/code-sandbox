import type { ClientProblem, RunMode, SubmissionOutcome } from "@/problems/data/problem";
import { TestcaseTab } from "@/problems/algo/TestcaseTab";
import { TestResult } from "@/problems/algo/TestResult";
import { UnderlineTabs } from "@/components/UnderlineTabs";

const TABS = ["testcase", "result"] as const;

/** Which half of the bottom dock is showing. AlgoWorkspace flips it to "result" on Run/Submit. */
export type ResultsTab = (typeof TABS)[number];

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
    <UnderlineTabs
      tabs={TABS}
      labelOf={TAB_LABEL}
      active={tab}
      onSelect={onTabChange}
      className="shrink-0 gap-1 border-b border-sidebar-border px-3 pt-2"
    />
    <div className="min-h-0 flex-1 overflow-auto p-5">
      {tab === "testcase" ? (
        <TestcaseTab problem={problem} />
      ) : (
        <TestResult outcome={outcome} runningMode={runningMode} problem={problem} />
      )}
    </div>
  </div>
);
