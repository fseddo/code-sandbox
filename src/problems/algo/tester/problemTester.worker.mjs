// Node-side terminable worker, used only by the test/verify tooling (npm test, verifyProblems.mjs,
// verifyGuideTestCases.mjs) — the live app grades client-side in judge.worker.ts. Both wrap the same
// isomorphic grading core; this one adds Node's worker_threads transport + termination for the
// infinite-loop case the tooling exercises.
import { parentPort, workerData } from "node:worker_threads";
import { gradeSubmission } from "./grade.mjs";

parentPort.postMessage(gradeSubmission(workerData));
