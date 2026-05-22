"use client";

import { useEffect } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { savePad } from "@/pad/pad";

const DEBOUNCE_MS = 600;

/**
 * Debounced writeback of pad files to localStorage on every change. A `title` (passed by a build
 * problem) is persisted alongside the files, so the pad lists by name without a separate sync.
 */
export const usePadPersistence = (padId: string, title?: string): void => {
  const { sandpack } = useSandpack();
  const { files } = sandpack;

  useEffect(() => {
    const timer = setTimeout(() => savePad(padId, files, title), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [files, padId, title]);
};
