import path from "node:path";
import { Worker } from "node:worker_threads";
import type { AlgoProblem, RunMode, SubmissionOutcome, SupportedLanguage } from "@/problems/data/problem";
import { WALL_CLOCK_LIMIT_MS, testsForMode } from "./testPlan";

// Node-only grader, used by the test/verify tooling (the live app grades client-side — see runTestsClient.ts).
// The worker is plain JS Node runs directly, resolved at runtime, not bundled.
const workerPath = path.join(process.cwd(), "src/problems/algo/tester/problemTester.worker.mjs");

export type Submission = {
  problem: AlgoProblem;
  language: SupportedLanguage;
  source: string;
  mode: RunMode;
};

/**
 * Run a submission in a terminable Node worker thread, racing it against a wall-clock limit.
 * `worker.terminate()` is what catches infinite loops — sync or async — that a bare timeout can't.
 */
export const runTests = ({ problem, language, source, mode }: Submission): Promise<SubmissionOutcome> =>
  new Promise((resolve) => {
    const worker = new Worker(workerPath, {
      workerData: {
        source,
        language,
        functionName: problem.functionName,
        tests: testsForMode(problem, mode),
        io: problem.io ?? null,
        checker: problem.checker ?? null,
      },
    });

    let settled = false;
    const finish = (outcome: SubmissionOutcome) => {
      if (settled) return;
      settled = true;
      worker.terminate();
      clearTimeout(timer);
      resolve(outcome);
    };

    const limitMs = WALL_CLOCK_LIMIT_MS[mode];
    const timer = setTimeout(() => finish({ status: "timeout", ms: limitMs }), limitMs);

    worker.on("message", (outcome: SubmissionOutcome) => finish(outcome));
    worker.on("error", (error) => finish({ status: "crashed", message: error.message }));
    worker.on("exit", (exitCode) => {
      if (exitCode !== 0) finish({ status: "crashed", message: `Worker exited with code ${exitCode}.` });
    });
  });
