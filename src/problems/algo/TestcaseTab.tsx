import { useState } from "react";
import type { ClientProblem } from "@/problems/data/problem";
import { CaseTabs } from "@/problems/algo/CaseTabs";
import { ArgsList } from "@/problems/algo/ArgsList";

/** Read-only view of the problem's example cases: Case chips over the selected case's input args. */
export const TestcaseTab = ({ problem }: { problem: ClientProblem }) => {
  const [active, setActive] = useState(0);
  const testCase = problem.examples[active];

  return (
    <div className="flex flex-col gap-4">
      <CaseTabs count={problem.examples.length} active={active} onSelect={setActive} />
      <div className="flex flex-col gap-3">
        <ArgsList problem={problem} args={testCase.args} />
      </div>
    </div>
  );
};
