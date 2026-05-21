import { useState } from "react";
import type { ClientProblem } from "./problem";
import { deriveParamNames } from "./problem";
import { CaseTabs } from "./CaseTabs";
import { ValueBlock } from "./ValueBlock";
import { stringify } from "./format";

/** Read-only view of the problem's example cases: Case chips over the selected case's input args. */
export const TestcaseTab = ({ problem }: { problem: ClientProblem }) => {
  const [active, setActive] = useState(0);
  const testCase = problem.tests[active];
  const paramNames = deriveParamNames(problem.starterCode.javascript, problem.functionName, testCase.args.length);

  return (
    <div className="flex flex-col gap-4">
      <CaseTabs count={problem.tests.length} active={active} onSelect={setActive} />
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
