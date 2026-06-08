// The live judge, in the browser. A dedicated Web Worker so a submission runs off the main thread and
// can be killed with `worker.terminate()` — the only thing that catches an infinite loop (sync or async),
// which a bare timeout inside the same thread can't. Grading itself is the shared, isomorphic core.
import { gradeSubmission } from "./grade.mjs";
import type { ProblemIo, SubmissionOutcome, SupportedLanguage } from "@/problems/data/problem";
import type { PlannedTest } from "./testPlan";

export type JudgeRequest = {
  source: string;
  language: SupportedLanguage;
  functionName: string;
  tests: PlannedTest[];
  io: ProblemIo | null;
  checker: string | null;
};

self.onmessage = (event: MessageEvent<JudgeRequest>) => {
  try {
    const outcome = gradeSubmission(event.data) as SubmissionOutcome;
    self.postMessage(outcome);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ status: "compile-error", message } satisfies SubmissionOutcome);
  }
};
