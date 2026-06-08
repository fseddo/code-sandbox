import type { AlgoProblem, RunMode, SubmissionOutcome, SupportedLanguage } from "@/problems/data/problem";
import type { JudgeRequest } from "./judge.worker";
import { WALL_CLOCK_LIMIT_MS, testsForMode } from "./testPlan";

export type Submission = {
  problem: AlgoProblem;
  language: SupportedLanguage;
  source: string;
  mode: RunMode;
};

/**
 * Run a submission in a terminable browser Web Worker, racing it against a per-mode wall-clock limit.
 * `worker.terminate()` is what catches infinite loops — sync or async — that a bare timeout can't.
 * Grading happens entirely on the client; nothing reaches the server, so there's no server-side
 * code-execution surface (the historical `/api/judge` route is gone). See docs/features/algo.md.
 */
export const runTestsClient = ({ problem, language, source, mode }: Submission): Promise<SubmissionOutcome> =>
  new Promise((resolve) => {
    const worker = new Worker(new URL("./judge.worker.ts", import.meta.url));

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

    worker.onmessage = (event: MessageEvent<SubmissionOutcome>) => finish(event.data);
    worker.onerror = (event) => finish({ status: "crashed", message: event.message });

    const request: JudgeRequest = {
      source,
      language,
      functionName: problem.functionName,
      tests: testsForMode(problem, mode),
      io: problem.io ?? null,
      checker: problem.checker ?? null,
    };
    worker.postMessage(request);
  });
