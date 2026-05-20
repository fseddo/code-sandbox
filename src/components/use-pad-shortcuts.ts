"use client";

import { useEffect, useRef } from "react";

/**
 * ⌘/Ctrl+S triggers the pad's save action (push code to the preview) instead
 * of opening the browser's native save dialog.
 */
export function usePadShortcuts(save: () => void): void {
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isSave =
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey &&
        event.key.toLowerCase() === "s";
      if (!isSave) return;
      event.preventDefault();
      saveRef.current();
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);
}
