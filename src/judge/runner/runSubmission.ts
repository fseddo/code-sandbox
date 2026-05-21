import path from "node:path";
import { Worker } from "node:worker_threads";
import type { Problem, RunMode, SubmissionOutcome, SupportedLanguage } from "../problem";

const WALL_CLOCK_LIMIT_MS = 2000;

// Resolved at runtime, not bundled: the worker is plain JS Node runs directly.
// Works under `next dev`; `next build` needs outputFileTracingIncludes to ship the file.
const workerPath = path.join(process.cwd(), "src/judge/runner/judge.worker.mjs");

export type Submission = {
  problem: Problem;
  language: SupportedLanguage;
  source: string;
  mode: RunMode;
};

/** The exposed examples, plus the hidden set when submitting. Each case is tagged so the worker can mask hidden output. */
const testsForMode = ({ tests, hiddenTests }: Problem, mode: RunMode) => [
  ...tests.map((test, index) => ({ name: test.name ?? `case ${index + 1}`, args: test.args, expected: test.expected, hidden: false })),
  ...(mode === "submit"
    ? (hiddenTests ?? []).map((test, index) => ({ name: `hidden case ${index + 1}`, args: test.args, expected: test.expected, hidden: true }))
    : []),
];

/**
 * Run a submission in a terminable worker thread, racing it against a wall-clock limit.
 * `worker.terminate()` is what catches infinite loops — sync or async — that a bare vm timeout can't.
 */
export const runSubmission = ({ problem, language, source, mode }: Submission): Promise<SubmissionOutcome> =>
  new Promise((resolve) => {
    const worker = new Worker(workerPath, {
      workerData: { source, language, functionName: problem.functionName, tests: testsForMode(problem, mode) },
    });

    let settled = false;
    const finish = (outcome: SubmissionOutcome) => {
      if (settled) return;
      settled = true;
      worker.terminate();
      clearTimeout(timer);
      resolve(outcome);
    };

    const timer = setTimeout(() => finish({ status: "timeout", ms: WALL_CLOCK_LIMIT_MS }), WALL_CLOCK_LIMIT_MS);

    worker.on("message", (outcome: SubmissionOutcome) => finish(outcome));
    worker.on("error", (error) => finish({ status: "crashed", message: error.message }));
    worker.on("exit", (exitCode) => {
      if (exitCode !== 0) finish({ status: "crashed", message: `Worker exited with code ${exitCode}.` });
    });
  });
