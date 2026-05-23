"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during SSR and the first (hydration) client render, `true` afterward. Gate any value that
 * reads client-only state (localStorage) yet reaches the server-rendered DOM — a button's `disabled`,
 * a status label — so the first client render matches the server and updates only after hydration.
 *
 * Uses `useSyncExternalStore`'s server snapshot (not a `setState` mount effect) for the SSR/client
 * split, the same hydration-safe posture as [useProgress](../problems/progress/useProgress.ts).
 */
export const useIsHydrated = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
