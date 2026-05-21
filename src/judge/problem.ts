/** The two languages a submission can be written in; transpiled to JS server-side before running. */
export type SupportedLanguage = "javascript" | "typescript";

export type Difficulty = "easy" | "medium" | "hard";

/** Which test set a submission runs against: Run hits the exposed examples, Submit adds the hidden set. */
export type RunMode = "run" | "submit";

/** One test case, generic over the solution's argument tuple and its return type. */
export type TestCase<Args extends unknown[], Result> = {
  name?: string;
  args: Args;
  expected: Result;
};

/** One published approach in the Solutions tab: a named write-up plus per-language code. */
export type ProblemSolution = {
  name: string;
  explanation: string;
  code: Partial<Record<SupportedLanguage, string>>;
};

/**
 * A problem, generic over the solution signature `(...args: Args) => Result`.
 * The signature drives the test-case types: `args` and `expected` are checked against it.
 *
 * `hiddenTests` are server-only — they never cross into `ClientProblem`, so the inputs that
 * probe robustness aren't shipped to the browser. Submit runs them; Run does not.
 */
export type Problem<Args extends unknown[] = unknown[], Result = unknown> = {
  id: string;
  title: string;
  difficulty: Difficulty;
  prompt: string;
  /** The function the harness calls. The user's source must declare a function of this name. */
  functionName: string;
  starterCode: Record<SupportedLanguage, string>;
  tests: TestCase<Args, Result>[];
  hiddenTests?: TestCase<Args, Result>[];
  solutions?: ProblemSolution[];
};

/** The client-safe projection: everything except the hidden tests. This is what server pages hand to client components. */
export type ClientProblem<Args extends unknown[] = unknown[], Result = unknown> = Omit<
  Problem<Args, Result>,
  "hiddenTests"
>;

/**
 * Author a problem with the solution signature pinned, so test-case `args`/`expected`
 * are type-checked against it: `defineProblem<[number[], number], number[]>({ … })`.
 */
export const defineProblem = <Args extends unknown[], Result>(
  problem: Problem<Args, Result>,
): Problem<Args, Result> => problem;

/**
 * Best-effort parameter names pulled from the JS starter signature, so the Testcase/Input
 * views can label args (`nums =`) like LeetCode. Falls back to positional `arg N` labels when
 * the signature can't be parsed cleanly (e.g. destructured params), guarded on the arity match.
 */
export const deriveParamNames = (source: string, functionName: string, arity: number): string[] => {
  const fallback = Array.from({ length: arity }, (_, index) => `arg ${index + 1}`);
  const match = source.match(new RegExp(`${functionName}\\s*\\(([^)]*)\\)`));
  if (!match) return fallback;
  const names = match[1]
    .split(",")
    .map((part) => part.split(":")[0].trim())
    .filter(Boolean);
  return names.length === arity ? names : fallback;
};

/**
 * The wire shape the runner reports back per test case. For hidden cases the runner masks
 * `expected`/`actual`/`logs` (they'd leak the probing inputs) — only pass/fail, error, and timing survive.
 */
export type TestResult = {
  name: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  logs: string[];
  error: string | null;
  ms: number;
  hidden: boolean;
};

export type SubmissionOutcome =
  | { status: "ok"; results: TestResult[] }
  | { status: "compile-error"; message: string }
  | { status: "timeout"; ms: number }
  | { status: "crashed"; message: string };
