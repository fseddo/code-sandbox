"use client";

import { useState } from "react";
import type { ClientProblem, RunMode, SubmissionOutcome } from "@/problems/data/problem";
import { type CompletedSolution, getEntry, markComplete, markInProgress } from "@/problems/progress/progress";

/**
 * The grading lifecycle for one problem: fires a buffer at `/api/judge`, holds the latest `outcome`,
 * tracks which mode is in flight, and captures the passing buffer on a Submit that clears every case
 * (the algo completion oracle). `submittedSolution` is the answer-of-record — distinct from the working
 * draft in `useAlgoEditor`; restoring it back into the editor is the root's job, not this hook's.
 */
export const useAlgoSubmission = (problem: ClientProblem) => {
  const [outcome, setOutcome] = useState<SubmissionOutcome | null>(null);
  // Which mode is in flight (null = idle) — lets the toolbar label Run vs Submit while sharing one path.
  const [runningMode, setRunningMode] = useState<RunMode | null>(null);
  // Seeded from the progress store, refreshed on each pass — drives the "Last submission" restore button.
  const [submittedSolution, setSubmittedSolution] = useState<CompletedSolution | null>(
    () => getEntry(problem.id)?.solution ?? null,
  );

  const run = async (mode: RunMode, buffer: CompletedSolution) => {
    setRunningMode(mode);
    markInProgress(problem.id);
    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem.id, language: buffer.language, source: buffer.source, mode }),
      });
      const result = (await response.json()) as SubmissionOutcome;
      setOutcome(result);
      // Submit is the graded run: passing every case (visible + hidden) is the algo completion oracle.
      if (mode === "submit" && result.status === "ok" && result.results.every((test) => test.passed)) {
        markComplete(problem.id, buffer);
        setSubmittedSolution(buffer);
      }
    } catch (error) {
      setOutcome({ status: "crashed", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setRunningMode(null);
    }
  };

  const clearOutcome = () => setOutcome(null);

  return { outcome, runningMode, run, submittedSolution, clearOutcome };
};
