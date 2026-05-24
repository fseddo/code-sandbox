import type { ProblemSolution, SupportedLanguage } from "@/problems/data/problem";
import { LANGUAGE_LABELS } from "@/problems/data/problem";
import { Prose } from "@/problems/shared/Prose";
import { HighlightedCode } from "@/problems/shared/HighlightedCode";

/** One published approach: title, write-up, and code in the editor's language (falling back if absent). */
const SolutionApproach = ({
  solution,
  language,
}: {
  solution: ProblemSolution;
  language: SupportedLanguage;
}) => {
  // Follow the language the user is working in; fall back to whatever this approach provides.
  const provided = Object.keys(solution.code) as SupportedLanguage[];
  const shown = solution.code[language] ? language : provided[0];
  const code = shown ? solution.code[shown] : undefined;

  return (
    <article className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold tracking-tight">{solution.name}</h3>
      <Prose text={solution.explanation} />
      {code && (
        <div className="flex flex-col gap-2">
          {shown !== language && (
            <p className="text-xs text-muted-foreground">
              Shown in {LANGUAGE_LABELS[shown]} — no {LANGUAGE_LABELS[language]} solution provided.
            </p>
          )}
          <HighlightedCode code={code} language={shown} />
        </div>
      )}
    </article>
  );
};

export const SolutionsTab = ({
  solutions,
  language,
}: {
  solutions?: ProblemSolution[];
  language: SupportedLanguage;
}) => {
  if (!solutions || solutions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No solutions published for this problem yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {solutions.map((solution, index) => (
        <SolutionApproach key={index} solution={solution} language={language} />
      ))}
    </div>
  );
};
