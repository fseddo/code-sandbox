"use client";

import { useEffect } from "react";

/** ⌘/Ctrl+S triggers `save()` instead of the browser's native save dialog. */
export const useSaveShortcut = (save: () => void): void => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isSave =
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey &&
        event.key.toLowerCase() === "s";
      if (!isSave) return;
      event.preventDefault();
      save();
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [save]);
};
