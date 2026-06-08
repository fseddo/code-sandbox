import type { AlgoProblem, RunMode } from "@/problems/data/problem";

/**
 * Per-mode wall-clock budget for the *whole* submission (all cases share one worker). Run hits only the
 * exposed examples, so it stays tight for snappy feedback; Submit adds the hidden set — including scale /
 * runtime cases — so it gets real headroom. The worker is terminated at the limit, so a runaway (or a
 * too-slow algorithm) is still bounded. Shared by both runners (Node worker + browser worker) so the
 * budget can't drift between them.
 */
export const WALL_CLOCK_LIMIT_MS: Record<RunMode, number> = {
  run: 2000,
  submit: 8000,
};

/** One case as the grading core consumes it — tagged `hidden` so the UI can gate hidden-case output. */
export type PlannedTest = {
  name: string;
  args: unknown[];
  expected: unknown;
  hidden: boolean;
};

/** The exposed examples, plus the hidden set when submitting. */
export const testsForMode = ({ examples, hiddenTests }: AlgoProblem, mode: RunMode): PlannedTest[] => [
  ...examples.map((example, index) => ({
    name: example.name ?? `case ${index + 1}`,
    args: example.args,
    expected: example.expected,
    hidden: false,
  })),
  ...(mode === "submit"
    ? hiddenTests.map((test, index) => ({
        name: `hidden case ${index + 1}`,
        args: test.args,
        expected: test.expected,
        hidden: true,
      }))
    : []),
];
