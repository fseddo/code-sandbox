"use client";

import { useState } from "react";
import type { Problem, SubmissionOutcome, SupportedLanguage } from "./problem";

/** Owns the editor buffers (one per language), the run request, and the latest outcome. */
export const useJudge = (problem: Problem) => {
  const [language, setLanguage] = useState<SupportedLanguage>("typescript");
  const [sources, setSources] = useState<Record<SupportedLanguage, string>>(problem.starterCode);
  const [outcome, setOutcome] = useState<SubmissionOutcome | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const setSource = (next: string) => setSources((prev) => ({ ...prev, [language]: next }));

  const run = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem.id, language, source: sources[language] }),
      });
      setOutcome((await response.json()) as SubmissionOutcome);
    } catch (error) {
      setOutcome({ status: "crashed", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setIsRunning(false);
    }
  };

  return { language, setLanguage, source: sources[language], setSource, outcome, isRunning, run };
};
