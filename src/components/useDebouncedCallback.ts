"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLatestRef } from "@/components/useLatestRef";

/** Shared autosave debounce — the delay between the last edit and the persist. */
export const AUTOSAVE_DEBOUNCE_MS = 600;

/**
 * Returns a stable `trigger` that runs `fn` after `ms` of quiet, restarting the timer on each call and
 * clearing any pending run on unmount. `fn` is read through a ref, so `trigger` never goes stale.
 */
export const useDebouncedCallback = (fn: () => void, ms: number) => {
  const fnRef = useLatestRef(fn);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fnRef.current(), ms);
  }, [fnRef, ms]);
};
