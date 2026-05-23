"use client";

import dynamic from "next/dynamic";
import type { BuildProblem, ProblemHeaderData } from "@/problems/data/problem";

// Sandpack touches the DOM on import, so the build workspace must never render on the server.
const BuildWorkspace = dynamic(
  () => import("@/problems/build/BuildWorkspace").then((m) => m.BuildWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    ),
  },
);

type BuildLoaderProps = ProblemHeaderData & {
  problem: BuildProblem;
};

export const BuildLoader = ({ problem, number, companies }: BuildLoaderProps) => (
  <BuildWorkspace problem={problem} number={number} companies={companies} />
);
