import type { Difficulty } from "./problem";
import { cn } from "@/lib/utils";

const tint: Record<Difficulty, string> = {
  easy: "text-ok bg-ok/10",
  medium: "text-warn bg-warn/10",
  hard: "text-danger bg-danger/10",
};

export const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => (
  <span
    className={cn(
      "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium capitalize",
      tint[difficulty],
    )}
  >
    {difficulty}
  </span>
);
