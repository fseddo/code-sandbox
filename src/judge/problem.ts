/** The two languages a submission can be written in; transpiled to JS server-side before running. */
export type SupportedLanguage = "javascript" | "typescript";

export type Difficulty = "easy" | "medium" | "hard";

/** One test case, generic over the solution's argument tuple and its return type. */
export type TestCase<Args extends unknown[], Result> = {
  name?: string;
  args: Args;
  expected: Result;
};

/**
 * A problem, generic over the solution signature `(...args: Args) => Result`.
 * The signature drives the test-case types: `args` and `expected` are checked against it.
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
};

/**
 * Author a problem with the solution signature pinned, so test-case `args`/`expected`
 * are type-checked against it: `defineProblem<[number[], number], number[]>({ … })`.
 */
export const defineProblem = <Args extends unknown[], Result>(
  problem: Problem<Args, Result>,
): Problem<Args, Result> => problem;

/** The wire shape the runner reports back per test case. */
export type TestResult = {
  name: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  logs: string[];
  error: string | null;
  ms: number;
};

export type SubmissionOutcome =
  | { status: "ok"; results: TestResult[] }
  | { status: "compile-error"; message: string }
  | { status: "timeout"; ms: number }
  | { status: "crashed"; message: string };
