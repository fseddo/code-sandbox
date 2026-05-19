"use client";

import { useEffect, useRef, useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { savePad } from "@/lib/pad";

export type SaveState = "saved" | "saving";

const DEBOUNCE_MS = 600;

/**
 * Autosaves the pad's files to localStorage whenever they change.
 * Must be rendered inside a <SandpackProvider>.
 */
export function usePadPersistence(padId: string): SaveState {
  const { sandpack } = useSandpack();
  const { files } = sandpack;
  const [state, setState] = useState<SaveState>("saved");
  const isInitial = useRef(true);

  useEffect(() => {
    // Skip the first run — that's just the pad loading, not an edit.
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    setState("saving");
    const timer = setTimeout(() => {
      savePad(padId, files);
      setState("saved");
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [files, padId]);

  return state;
}
