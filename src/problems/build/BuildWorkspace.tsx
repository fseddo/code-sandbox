"use client";

import { useMemo } from "react";
import type { BuildProblem } from "@/problems/data/problem";
import { BuildProblemPanel } from "@/problems/build/BuildProblemPanel";
import { BuildToolbar } from "@/problems/build/BuildToolbar";
import { ProblemTitleBar } from "@/problems/shared/ProblemTitleBar";
import { CoderPad } from "@/pad/CoderPad";
import { typescriptFrontend } from "@/pad/padProfiles/typescriptFrontend";
import type { PadProfile } from "@/pad/padProfiles/typescriptFrontend";

/**
 * A build problem solved in a pad. The pad id is the problem id (deterministic), so a solver's edits
 * persist across visits and Reset rehydrates from the starter. The problem's `files` layer over the
 * TS-frontend base layout — the v1 simplification of the "which template" question in
 * [company-sourcing.md](../../docs/features/company-sourcing.md).
 */
type BuildWorkspaceProps = {
  problem: BuildProblem;
  number: number;
  companies: readonly string[];
};

export const BuildWorkspace = ({ problem, number, companies }: BuildWorkspaceProps) => {
  const profile = useMemo<PadProfile>(
    () => ({
      template: problem.template,
      seedFiles: { ...typescriptFrontend.seedFiles, ...problem.files },
      baseFiles: typescriptFrontend.baseFiles,
    }),
    [problem.template, problem.files],
  );

  return (
    <CoderPad
      padId={problem.id}
      title={problem.title}
      profile={profile}
      leadingPanel={<BuildProblemPanel problem={problem} />}
      headerBar={
        <ProblemTitleBar
          number={number}
          title={problem.title}
          kind={problem.kind}
          difficulty={problem.difficulty}
          tags={problem.tags}
          companies={companies}
        />
      }
      renderToolbar={(state) => <BuildToolbar {...state} title={problem.title} />}
    />
  );
};
