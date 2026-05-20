"use client";

import { useEffect } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { savePad } from "@/pad/pad";

const DEBOUNCE_MS = 600;

/** Debounced writeback of pad files to localStorage on every change. */
export const usePadPersistence = (padId: string): void => {
  const { sandpack } = useSandpack();
  const { files } = sandpack;

  useEffect(() => {
    const timer = setTimeout(() => savePad(padId, files), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [files, padId]);
};
