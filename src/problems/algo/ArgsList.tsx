import type { ClientProblem } from "@/problems/data/problem";
import { deriveParamNames } from "@/problems/data/problem";
import { ValueBlock } from "@/problems/algo/ValueBlock";
import { stringify } from "@/problems/shared/format";

/** One `ValueBlock` per argument, labelled with the parameter name derived from the JS starter signature. */
export const ArgsList = ({ problem, args }: { problem: ClientProblem; args: readonly unknown[] }) => {
  const paramNames = deriveParamNames(problem.starterCode.javascript, problem.functionName, args.length);
  return (
    <>
      {args.map((arg, index) => (
        <ValueBlock key={index} label={`${paramNames[index]} =`}>
          {stringify(arg)}
        </ValueBlock>
      ))}
    </>
  );
};
