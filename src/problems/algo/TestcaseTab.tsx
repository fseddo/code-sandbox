import { useState } from "react";
import type { ClientProblem } from "@/problems/data/problem";
import { deriveParamNames } from "@/problems/data/problem";
import { CaseTabs } from "@/problems/algo/CaseTabs";
import { ValueBlock } from "@/problems/algo/ValueBlock";
import { stringify } from "@/problems/shared/format";

/** Read-only view of the problem's example cases: Case chips over the selected case's input args. */
export const TestcaseTab = ({ problem }: { problem: ClientProblem }) => {
  const [active, setActive] = useState(0);
  const testCase = problem.examples[active];
  const paramNames = deriveParamNames(problem.starterCode.javascript, problem.functionName, testCase.args.length);

  return (
    <div className="flex flex-col gap-4">
      <CaseTabs count={problem.examples.length} active={active} onSelect={setActive} />
      <div className="flex flex-col gap-3">
        {testCase.args.map((arg, index) => (
          <ValueBlock key={index} label={`${paramNames[index]} =`}>
            {stringify(arg)}
          </ValueBlock>
        ))}
      </div>
    </div>
  );
};
