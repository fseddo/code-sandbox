"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * A ref kept in sync with the latest `value`, written in a layout effect (React 19 forbids ref writes
 * during render). Lets a stable `useCallback` read the current value without re-creating each render.
 */
export const useLatestRef = <T>(value: T) => {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};
