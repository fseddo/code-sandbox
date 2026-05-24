import Link from "next/link";
import { LuSquareCode } from "react-icons/lu";
import type { AnyProblem, ProblemSolution, SupportedLanguage } from "@/problems/data/problem";
import { deriveParamNames, type Difficulty } from "@/problems/data/problem";
import type { ProblemId, ProblemSummary } from "@/problems/data/problems";
import { companiesForProblem } from "@/problems/data/companies";
import type { Section } from "@/learn/data/topic";
import { renderInline } from "@/learn/article/sections/renderInline";
import { SectionRenderer } from "@/learn/article/SectionRenderer";
import { ArticleSection } from "@/learn/article/ArticleSection";
import { CATEGORY_ACCENT } from "@/learn/shared/categoryTheme";
import { PROBLEM_GUIDES, PROBLEM_EXTRAS } from "@/learn/data/problemGuides";
import { cn } from "@/lib/utils";

// Problems in the study guide live under the Algos track — borrow the algorithms category accent so the
// heading underlines/borders match the corresponding topic pages.
const ACCENT = CATEGORY_ACCENT.algorithms;

/** Turn a stored solution into article sections: the approach write-up, then the implementation (Shiki-highlighted). */
const solutionSections = (solution: ProblemSolution): Section[] => {
  const lang: SupportedLanguage = solution.code.javascript ? "javascript" : "typescript";
  const source = solution.code[lang] ?? Object.values(solution.code)[0];
  return [
    { kind: "prose", heading: solution.name, body: solution.explanation },
    ...(source ? [{ kind: "code", lang, source } satisfies Section] : []),
  ];
};

const DIFFICULTY_PILL: Record<Difficulty, string> = {
  easy: "bg-emerald-500/15 text-emerald-300",
  medium: "bg-amber-500/15 text-amber-300",
  hard: "bg-rose-500/15 text-rose-300",
};

const format = (value: unknown) => JSON.stringify(value);

const OpenInEditor = ({ id }: { id: string }) => (
  <Link
    href={`/problems/${id}`}
    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
  >
    <LuSquareCode className="size-4" />
    Open in editor
  </Link>
);

export const ProblemGuide = ({
  problem,
  problemsById,
}: {
  problem: AnyProblem;
  problemsById: Record<string, ProblemSummary>;
}) => {
  const guide = PROBLEM_GUIDES[problem.id] ?? [];
  const extras = PROBLEM_EXTRAS[problem.id];
  const companies = companiesForProblem(problem.id as ProblemId);
  const paramNames =
    problem.kind === "algo"
      ? deriveParamNames(problem.starterCode.javascript, problem.functionName, problem.examples[0]?.args.length ?? 0)
      : [];

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">#{problem.number}</span>
          <h1 className="mr-1 text-2xl font-semibold tracking-tight">{problem.title}</h1>
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", DIFFICULTY_PILL[problem.difficulty])}>
            {problem.difficulty}
          </span>
          <div className="ml-auto">
            <OpenInEditor id={problem.id} />
          </div>
        </div>
        {(problem.tags.length > 0 || companies.length > 0) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {problem.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
            {companies.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Asked at {companies.slice(0, 4).join(", ")}
                {companies.length > 4 ? ` +${companies.length - 4} more` : ""}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Lede: the problem statement, like the topic page's summary — muted, no heading. */}
      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {problem.prompt.split(/\n\n+/).map((paragraph, index) => (
          <p key={index}>{renderInline(paragraph)}</p>
        ))}
      </section>

      {problem.kind === "algo" && problem.examples.length > 0 && (
        <ArticleSection label="Example" accent={ACCENT}>
          <div className="space-y-3">
            {/* One representative example up top; broader cases live in the Test cases section below. */}
            {problem.examples.slice(0, 1).map((example, index) => (
              <div key={index} className="space-y-2 rounded-lg border border-border bg-card/40 p-4">
                <p className="font-mono text-sm">
                  <span className="text-muted-foreground">Input: </span>
                  {example.args.map((arg, i) => `${paramNames[i] ?? `arg${i + 1}`} = ${format(arg)}`).join(", ")}
                </p>
                <p className="font-mono text-sm">
                  <span className="text-muted-foreground">Output: </span>
                  {format(example.expected)}
                </p>
                {example.explanation && (
                  <p className="text-sm text-muted-foreground">{renderInline(example.explanation)}</p>
                )}
              </div>
            ))}
          </div>
        </ArticleSection>
      )}

      {problem.kind === "algo" && problem.constraints.length > 0 && (
        <ArticleSection label="Constraints" accent={ACCENT}>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{renderInline(constraint)}</li>
            ))}
          </ul>
        </ArticleSection>
      )}

      {/* Authored teaching overlay (intuition + brute-force baseline + walkthrough). */}
      {guide.length > 0 && (
        <ArticleSection label="Intuition" accent={ACCENT}>
          {guide.map((section, index) => (
            <SectionRenderer key={index} section={section} problemsById={problemsById} />
          ))}
        </ArticleSection>
      )}

      {/* The canonical best approach + implementation, from the problem's stored solutions. */}
      {problem.kind === "algo" && problem.solutions && problem.solutions.length > 0 && (
        <ArticleSection label="Optimization" accent={ACCENT}>
          {problem.solutions.flatMap(solutionSections).map((section, index) => (
            <SectionRenderer key={index} section={section} problemsById={problemsById} />
          ))}
        </ArticleSection>
      )}

      {extras?.complexity && extras.complexity.length > 0 && (
        <ArticleSection label="Complexity analysis" accent={ACCENT}>
          {extras.complexity.map((section, index) => (
            <SectionRenderer key={index} section={section} problemsById={problemsById} />
          ))}
        </ArticleSection>
      )}

      {extras?.testCases && extras.testCases.length > 0 && (
        <ArticleSection label="Test cases" accent={ACCENT}>
          <p className="text-sm text-muted-foreground">
            Beyond the example above, these are worth thinking through before you submit.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Input</th>
                  <th className="px-3 py-2 font-medium">Expected output</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {extras.testCases.map((testCase, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-mono text-xs">
                      {testCase.args.map((arg, i) => `${paramNames[i] ?? `arg${i + 1}`} = ${format(arg)}`).join(", ")}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{format(testCase.expected)}</td>
                    <td className="px-3 py-2 text-muted-foreground">{testCase.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ArticleSection>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 p-5">
        <div>
          <p className="font-semibold">Try it yourself</p>
          <p className="text-sm text-muted-foreground">Write your solution against the real judge before checking the reference.</p>
        </div>
        <OpenInEditor id={problem.id} />
      </div>
    </article>
  );
};
