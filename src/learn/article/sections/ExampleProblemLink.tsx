import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { cn } from "@/lib/utils";
import type { Section } from "@/learn/data/topic";
import type { Difficulty } from "@/problems/data/problem";
import type { ProblemSummary } from "@/problems/data/problems";

type ExampleProblemSection = Extract<Section, { kind: "exampleProblem" }>;

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: "text-emerald-500",
  medium: "text-amber-500",
  hard: "text-rose-500",
};

export const ExampleProblemLink = ({
  section,
  problem,
}: {
  section: ExampleProblemSection;
  problem: ProblemSummary | undefined;
}) => {
  // A topic can reference a problem that isn't in the bank yet — degrade to a plain note rather than a dead link.
  if (!problem) {
    return (
      <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
        Example problem <span className="font-mono">{section.problemId}</span> (not in the bank yet)
      </div>
    );
  }

  return (
    <Link
      href={`/problems/${problem.id}`}
      className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{problem.title}</span>
          <span className={cn("text-xs font-medium capitalize", DIFFICULTY_COLOR[problem.difficulty])}>
            {problem.difficulty}
          </span>
        </div>
        {section.note && <p className="mt-0.5 text-xs text-muted-foreground">{section.note}</p>}
      </div>
      <LuArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
};
