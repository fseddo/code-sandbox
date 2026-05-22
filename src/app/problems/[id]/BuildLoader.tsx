"use client";

import dynamic from "next/dynamic";
import type { BuildProblem } from "@/judge/problem";

// Sandpack touches the DOM on import, so the build workspace must never render on the server.
const BuildWorkspace = dynamic(
  () => import("@/judge/BuildWorkspace").then((m) => m.BuildWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    ),
  },
);

export const BuildLoader = ({ problem }: { problem: BuildProblem }) => (
  <BuildWorkspace problem={problem} />
);
