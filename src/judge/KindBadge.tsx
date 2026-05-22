import type { ProblemKind } from "./problem";
import { cn } from "@/lib/utils";

const tint: Record<ProblemKind, string> = {
  algo: "text-muted-foreground bg-muted",
  build: "text-primary bg-primary/10",
};

const label: Record<ProblemKind, string> = {
  algo: "Algorithm",
  build: "Build",
};

/** Pill marking a problem as a worker-graded algorithm or an open-ended build task. */
export const KindBadge = ({ kind }: { kind: ProblemKind }) => (
  <span
    className={cn(
      "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
      tint[kind],
    )}
  >
    {label[kind]}
  </span>
);
