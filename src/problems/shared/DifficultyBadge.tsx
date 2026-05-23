import type { Difficulty } from "@/problems/data/problem";
import { Badge } from "@/problems/shared/Badge";
import { cn } from "@/lib/utils";

const tint: Record<Difficulty, string> = {
  easy: "text-ok bg-ok/10",
  medium: "text-warn bg-warn/10",
  hard: "text-danger bg-danger/10",
};

export const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => (
  <Badge className={cn("capitalize", tint[difficulty])}>{difficulty}</Badge>
);
