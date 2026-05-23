"use client";

import { useMemo, useState } from "react";

type Buffers = Record<string, string>;

/**
 * Tracks "what's on disk" against the live buffers and derives `isDirty`. Both editors reduce their
 * buffers to a string map — algo by language, the pad by file path — so dirtiness is a shallow compare
 * over the union of keys. Call `setSavedSnapshot` (wholesale or functional) when a save lands.
 */
export const useDirtyTracker = <B extends Buffers>(live: B, initial: () => B) => {
  const [savedSnapshot, setSavedSnapshot] = useState<B>(initial);

  const isDirty = useMemo(() => {
    for (const key of new Set([...Object.keys(live), ...Object.keys(savedSnapshot)])) {
      if (live[key] !== savedSnapshot[key]) return true;
    }
    return false;
  }, [live, savedSnapshot]);

  return { savedSnapshot, setSavedSnapshot, isDirty };
};
