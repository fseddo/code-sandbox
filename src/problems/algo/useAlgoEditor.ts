"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ClientProblem, SupportedLanguage } from "@/problems/data/problem";
import { loadSolution, saveSolution } from "@/problems/progress/solution";
import { formatCode } from "@/lib/prettier";
import { useSaveShortcut } from "@/components/useSaveShortcut";
import { useLatestRef } from "@/components/useLatestRef";
import { useDirtyTracker } from "@/components/useDirtyTracker";
import { AUTOSAVE_DEBOUNCE_MS, useDebouncedCallback } from "@/components/useDebouncedCallback";

type Sources = Record<SupportedLanguage, string>;

/**
 * The editing surface for one problem: per-language buffers, the active language, Prettier formatting,
 * and the save model (persist the draft to localStorage + derived `isDirty`). Autosave is event-driven —
 * every buffer write funnels through `setBuffer`, so the debounce rides the edit instead of a `useEffect`.
 */
export const useAlgoEditor = (problem: ClientProblem, autosaveEnabled: boolean) => {
  // Lazy initializer, not a mount effect: the page server-renders, but CodeMirror renders a placeholder
  // on the server (no buffer text in the SSR HTML), so reading localStorage here can't mismatch. Saved
  // buffers merge over starterCode so a never-edited language keeps its starter.
  const seed = (): Sources => ({ ...problem.starterCode, ...(loadSolution(problem.id) ?? {}) });

  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [sources, setSources] = useState<Sources>(seed);
  const { setSavedSnapshot, isDirty } = useDirtyTracker(sources, seed);
  const [isFormatting, setIsFormatting] = useState(false);

  // Stable save() reads the latest buffers through a ref so it doesn't re-create on every keystroke.
  const sourcesRef = useLatestRef(sources);

  const save = useCallback(() => {
    const current = sourcesRef.current;
    saveSolution(problem.id, current);
    setSavedSnapshot(current);
  }, [problem.id, sourcesRef, setSavedSnapshot]);

  const scheduleAutosave = useDebouncedCallback(save, AUTOSAVE_DEBOUNCE_MS);

  // The single funnel for every buffer write, so autosave fires in exactly one place.
  const setBuffer = (lang: SupportedLanguage, code: string) => {
    setSources((prev) => ({ ...prev, [lang]: code }));
    if (autosaveEnabled) scheduleAutosave();
  };

  const setSource = (next: string) => setBuffer(language, next);

  /** Restore the current language's buffer to its starter (Reset's editor half). */
  const resetBuffer = () => setBuffer(language, problem.starterCode[language]);

  /** Prettier-format the current buffer in place; a syntax error surfaces as a toast, not a thrown render. */
  const format = async () => {
    setIsFormatting(true);
    try {
      const formatted = await formatCode(sourcesRef.current[language], language === "typescript" ? "typescript" : "babel");
      setBuffer(language, formatted);
    } catch {
      toast.error("Couldn't format — check for syntax errors.");
    } finally {
      setIsFormatting(false);
    }
  };

  useSaveShortcut(save);

  return { language, setLanguage, source: sources[language], setSource, setBuffer, resetBuffer, format, isFormatting, save, isDirty };
};
