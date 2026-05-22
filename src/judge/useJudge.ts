"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ClientProblem, RunMode, SubmissionOutcome, SupportedLanguage } from "./problem";
import { loadSolution, saveSolution } from "./solution";
import { markComplete, markInProgress } from "./progress";
import { useJudgeSettings } from "./useJudgeSettings";
import { useSaveShortcut } from "@/components/useSaveShortcut";

type Sources = Record<SupportedLanguage, string>;

const AUTOSAVE_DEBOUNCE_MS = 600;

/**
 * Buffers (one per language), the run request, and the save model.
 *
 * Save persists the buffers to localStorage; Run is the "apply" step, so there's
 * no preview to keep in sync — saving only governs surviving a reload.
 */
export const useJudge = (problem: ClientProblem) => {
  // Lazy initializer, not a mount effect: this page server-renders, but CodeMirror
  // renders a placeholder on the server (no buffer text in the SSR HTML), so reading
  // localStorage here can't cause a hydration mismatch. saved is merged over
  // starterCode so a never-edited language keeps its starter.
  const seed = (): Sources => ({ ...problem.starterCode, ...(loadSolution(problem.id) ?? {}) });

  const { settings, setSetting } = useJudgeSettings();
  const [language, setLanguage] = useState<SupportedLanguage>("typescript");
  const [sources, setSources] = useState<Sources>(seed);
  const [savedSnapshot, setSavedSnapshot] = useState<Sources>(seed);
  const [outcome, setOutcome] = useState<SubmissionOutcome | null>(null);
  // Which mode is in flight (null = idle). Lets the toolbar label Run vs Submit independently while sharing one request path.
  const [runningMode, setRunningMode] = useState<RunMode | null>(null);

  // React 19 forbids ref writes during render — sync in a layout effect so the
  // stable save() reads the latest buffers without re-creating on every keystroke.
  const sourcesRef = useRef(sources);
  useLayoutEffect(() => {
    sourcesRef.current = sources;
  });

  const setSource = (next: string) => setSources((prev) => ({ ...prev, [language]: next }));

  const resetSolution = () =>
    setSources((prev) => ({ ...prev, [language]: problem.starterCode[language] }));

  const save = useCallback(() => {
    const current = sourcesRef.current;
    saveSolution(problem.id, current);
    setSavedSnapshot(current);
  }, [problem.id]);

  useSaveShortcut(save);
  useJudgeAutosave(settings.autosave, save, sources[language], language);

  const isDirty = useMemo(
    () =>
      (Object.keys(sources) as SupportedLanguage[]).some(
        (lang) => sources[lang] !== savedSnapshot[lang],
      ),
    [sources, savedSnapshot],
  );

  const run = async (mode: RunMode) => {
    setRunningMode(mode);
    markInProgress(problem.id);
    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem.id, language, source: sources[language], mode }),
      });
      const result = (await response.json()) as SubmissionOutcome;
      setOutcome(result);
      // Submit is the graded run: passing every case (visible + hidden) is the algo completion oracle.
      if (mode === "submit" && result.status === "ok" && result.results.every((test) => test.passed)) {
        markComplete(problem.id, { language, source: sources[language] });
      }
    } catch (error) {
      setOutcome({ status: "crashed", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setRunningMode(null);
    }
  };

  return {
    language,
    setLanguage,
    source: sources[language],
    setSource,
    resetSolution,
    save,
    isDirty,
    settings,
    setSetting,
    outcome,
    runningMode,
    run,
  };
};

/** Debounced save on content change. Skips language switches and unchanged toggles. */
const useJudgeAutosave = (
  enabled: boolean,
  save: () => void,
  code: string,
  language: SupportedLanguage,
): void => {
  const lastSeen = useRef({ language, code });

  useEffect(() => {
    const changedSameLanguage =
      lastSeen.current.language === language && lastSeen.current.code !== code;
    lastSeen.current = { language, code };
    if (!enabled || !changedSameLanguage) return;
    const timer = setTimeout(save, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [enabled, language, code, save]);
};
