import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { cn } from "@/lib/utils";
import type { Section } from "@/learn/data/topic";
import type { Difficulty } from "@/problems/data/problem";
import type { ProblemSummary } from "@/problems/data/problems";

type PracticeSection = Extract<Section, { kind: "practice" }>;

/** Difficulty pills (dark shades) — the saturated counterpart to ExampleProblemLink's text-only difficulty. */
const DIFFICULTY_PILL: Record<Difficulty, string> = {
  easy: "bg-emerald-500/15 text-emerald-300",
  medium: "bg-amber-500/15 text-amber-300",
  hard: "bg-rose-500/15 text-rose-300",
};

const TierLabel = ({ children }: { children: string }) => (
  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">{children}</p>
);

export const PracticeList = ({
  section,
  problemsById,
}: {
  section: PracticeSection;
  problemsById: Record<string, ProblemSummary>;
}) => (
  <div className="space-y-4">
    <div>
      <TierLabel>Essential</TierLabel>
      <div className="space-y-2">
        {section.essential.map((id) => {
          const problem = problemsById[id];
          if (!problem) {
            return (
              <div
                key={id}
                className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground"
              >
                <span className="font-mono">{id}</span> (not in the bank yet)
              </div>
            );
          }
          return (
            <Link
              key={id}
              href={`/problems/${problem.id}`}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
            >
              <span className="flex-1 text-sm font-medium">{problem.title}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  DIFFICULTY_PILL[problem.difficulty],
                )}
              >
                {problem.difficulty}
              </span>
              <LuArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          );
        })}
      </div>
    </div>

    {section.recommended && section.recommended.length > 0 && (
      <div>
        <TierLabel>Recommended</TierLabel>
        <div className="flex flex-wrap gap-2">
          {section.recommended.map((id) => {
            const problem = problemsById[id];
            return problem ? (
              <Link
                key={id}
                href={`/problems/${problem.id}`}
                className="rounded-full border border-border bg-card px-3 py-1 text-sm transition-colors hover:border-primary/50"
              >
                {problem.title}
              </Link>
            ) : (
              <span
                key={id}
                className="rounded-full border border-dashed border-border px-3 py-1 font-mono text-xs text-muted-foreground"
              >
                {id}
              </span>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
