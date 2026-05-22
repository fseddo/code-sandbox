"use client";

import { useMemo } from "react";
import type { BuildProblem } from "./problem";
import { BuildProblemPanel } from "./BuildProblemPanel";
import { BuildToolbar } from "./BuildToolbar";
import { CoderPad } from "@/pad/CoderPad";
import { typescriptFrontend } from "@/pad/padProfiles/typescriptFrontend";
import type { PadProfile } from "@/pad/padProfiles/typescriptFrontend";

/**
 * A build problem solved in a pad. The pad id is the problem id (deterministic), so a solver's edits
 * persist across visits and Reset rehydrates from the starter. The problem's `files` layer over the
 * TS-frontend base layout — the v1 simplification of the "which template" question in
 * [company-sourcing.md](../../docs/features/company-sourcing.md).
 */
export const BuildWorkspace = ({ problem }: { problem: BuildProblem }) => {
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
      profile={profile}
      leadingPanel={<BuildProblemPanel problem={problem} />}
      renderToolbar={(state) => <BuildToolbar {...state} title={problem.title} />}
    />
  );
};
