"use client";

import type { ClientProblem, RunMode } from "@/problems/data/problem";
import { useAlgoSettings } from "@/problems/progress/useAlgoSettings";
import { useAlgoEditor } from "@/problems/algo/useAlgoEditor";
import { useAlgoSubmission } from "@/problems/algo/useAlgoSubmission";

/**
 * Composition root for the algo workspace. Wires three concerns — editor settings
 * ([useAlgoSettings](../progress/useAlgoSettings.ts)), the editing surface ([useAlgoEditor](./useAlgoEditor.ts)),
 * and the grading lifecycle ([useAlgoSubmission](./useAlgoSubmission.ts)) — and owns only the actions
 * that span them: Run reads the current buffer, Reset clears buffer *and* outcome, Restore pushes the
 * answer-of-record back into the buffer. Keeping those here is what lets the two leaves stay independent.
 */
export const useAlgo = (problem: ClientProblem) => {
  const { settings, setSetting } = useAlgoSettings();
  const editor = useAlgoEditor(problem, settings.autosave);
  const submission = useAlgoSubmission(problem);

  const run = (mode: RunMode) =>
    submission.run(mode, { language: editor.language, source: editor.source });

  // Reset is problem-level: restore the starter buffer AND clear the last run's results (they live
  // outside the editor), so the panel doesn't show stale output for code that no longer exists.
  const resetSolution = () => {
    editor.resetBuffer();
    submission.clearOutcome();
  };

  /** Load the last passing submission back into its language's buffer (no-op if there isn't one). */
  const restoreSubmission = () => {
    const submitted = submission.submittedSolution;
    if (!submitted) return;
    editor.setLanguage(submitted.language);
    editor.setBuffer(submitted.language, submitted.source);
  };

  return {
    language: editor.language,
    setLanguage: editor.setLanguage,
    source: editor.source,
    setSource: editor.setSource,
    resetSolution,
    restoreSubmission,
    submittedSolution: submission.submittedSolution,
    format: editor.format,
    isFormatting: editor.isFormatting,
    save: editor.save,
    isDirty: editor.isDirty,
    settings,
    setSetting,
    outcome: submission.outcome,
    runningMode: submission.runningMode,
    run,
  };
};
