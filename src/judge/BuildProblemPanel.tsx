import type { BuildProblem } from "./problem";
import { DifficultyBadge } from "./DifficultyBadge";
import { Prose } from "./Prose";

/** Left column of a build problem: the prompt, tags, and the (human-judged) evaluation rubric. */
export const BuildProblemPanel = ({ problem }: { problem: BuildProblem }) => (
  <div className="flex h-full flex-col bg-card">
    <header className="flex shrink-0 flex-col gap-2 border-b border-sidebar-border px-5 py-5">
      <h1 className="text-lg font-semibold tracking-tight">{problem.title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={problem.difficulty} />
        {problem.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </header>

    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-5">
      <Prose text={problem.prompt} />

      {problem.evaluationNotes && problem.evaluationNotes.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            What we look for
          </h2>
          <ul className="flex list-disc flex-col gap-1 pl-4 text-sm text-muted-foreground">
            {problem.evaluationNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-muted-foreground/70">
        This is an open-ended build task — there are no automated tests. Edit the sandbox and check
        the live preview.
      </p>
    </div>
  </div>
);
