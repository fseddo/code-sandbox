"use client";

import { useRef, useSyncExternalStore } from "react";

/**
 * `useSyncExternalStore` re-renders whenever `getSnapshot` returns a new reference. This wraps it with
 * a content-hash cache: `read()`'s result is reused until `hashOf` changes, so subscribers only
 * re-render on real content change. `empty` is the (stable) server snapshot, matching SSR's first paint.
 */
export const useCachedExternalStore = <T>(
  subscribe: (notify: () => void) => () => void,
  read: () => T,
  hashOf: (value: T) => string,
  empty: T,
): T => {
  const cache = useRef<{ snapshot: T; key: string | null }>({ snapshot: empty, key: null });

  const getSnapshot = (): T => {
    const value = read();
    const key = hashOf(value);
    if (key !== cache.current.key) cache.current = { snapshot: value, key };
    return cache.current.snapshot;
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => empty);
};
