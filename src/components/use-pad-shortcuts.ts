"use client";

import { useEffect, useRef } from "react";
import { useSandpackNavigation } from "@codesandbox/sandpack-react";

/**
 * Cmd/Ctrl+S reloads the preview bundle instead of opening the browser's
 * native save dialog. Must be called inside a <SandpackProvider>.
 */
export function usePadShortcuts(): void {
  const { refresh } = useSandpackNavigation();

  // Keep the latest refresh fn in a ref so the listener attaches only once.
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isSave =
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey &&
        event.key.toLowerCase() === "s";
      if (!isSave) return;
      // Capture phase + preventDefault beats both the browser and the editor.
      event.preventDefault();
      refreshRef.current();
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);
}
