import type { ProblemKind } from "@/problems/data/problem";
import { Badge } from "@/problems/shared/Badge";

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
  <Badge className={tint[kind]}>{label[kind]}</Badge>
);
