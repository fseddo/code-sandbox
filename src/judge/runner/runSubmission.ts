import path from "node:path";
import { Worker } from "node:worker_threads";
import type { Problem, SubmissionOutcome, SupportedLanguage } from "../problem";

const WALL_CLOCK_LIMIT_MS = 2000;

// Resolved at runtime, not bundled: the worker is plain JS Node runs directly.
// Works under `next dev`; `next build` needs outputFileTracingIncludes to ship the file.
const workerPath = path.join(process.cwd(), "src/judge/runner/judge.worker.mjs");

export type Submission = {
  problem: Problem;
  language: SupportedLanguage;
  source: string;
};

/**
 * Run a submission in a terminable worker thread, racing it against a wall-clock limit.
 * `worker.terminate()` is what catches infinite loops — sync or async — that a bare vm timeout can't.
 */
export const runSubmission = ({ problem, language, source }: Submission): Promise<SubmissionOutcome> =>
  new Promise((resolve) => {
    const worker = new Worker(workerPath, {
      workerData: { source, language, functionName: problem.functionName, tests: problem.tests },
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
