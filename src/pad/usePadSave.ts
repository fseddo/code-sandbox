"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSandpack } from "@codesandbox/sandpack-react";

type Snapshot = Record<string, string>;

type SandpackBundlerFiles = ReturnType<typeof useSandpack>["sandpack"]["files"];

const snapshotOf = (files: SandpackBundlerFiles): Snapshot => {
  const out: Snapshot = {};
  for (const [path, file] of Object.entries(files)) {
    out[path] = file.code;
  }
  return out;
};

/** Event-driven save model: save/addFile/deleteFile own the baseline; isDirty is derived. */
export const usePadSave = () => {
  const { sandpack } = useSandpack();

  // React 19 forbids ref writes during render — sync in a layout effect instead.
  const sandpackRef = useRef(sandpack);
  useLayoutEffect(() => {
    sandpackRef.current = sandpack;
  });

  const [savedSnapshot, setSavedSnapshot] = useState<Snapshot>(() =>
    snapshotOf(sandpack.files),
  );

  // runSandpack cold-restarts the bundler — guard the StrictMode remount so the user doesn't pay a multi-second restart twice on every fresh load.
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    sandpackRef.current.runSandpack();
  }, []);

  // updateFile HMR-pushes through the live bundler; runSandpack would cold-restart it.
  const save = useCallback(() => {
    const sp = sandpackRef.current;
    const path = sp.activeFile;
    const code = sp.files[path]?.code;
    if (code === undefined) return;
    sp.updateFile(path, code, true);
    setSavedSnapshot((prev) => ({ ...prev, [path]: code }));
  }, []);

  const addFile = useCallback((path: string, code: string) => {
    const sp = sandpackRef.current;
    sp.addFile(path, code);
    sp.openFile(path);
    setSavedSnapshot((prev) => ({ ...prev, [path]: code }));
  }, []);

  const deleteFile = useCallback((path: string) => {
    sandpackRef.current.deleteFile(path);
    setSavedSnapshot((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  const isDirty = useMemo(() => {
    for (const path of Object.keys(savedSnapshot)) {
      if (savedSnapshot[path] !== sandpack.files[path]?.code) return true;
    }
    return false;
  }, [savedSnapshot, sandpack.files]);

  return { isDirty, save, addFile, deleteFile };
};

const AUTOSAVE_DEBOUNCE_MS = 600;

/** Debounced save on content change. Skips file switches and unchanged toggles. */
export const useAutosave = (enabled: boolean, save: () => void): void => {
  const { sandpack } = useSandpack();
  const activeFile = sandpack.activeFile;
  const activeCode = sandpack.files[activeFile]?.code;
  const lastSeen = useRef<{ path: string; code: string | undefined }>({
    path: activeFile,
    code: activeCode,
  });

  useEffect(() => {
    const changedSameFile =
      lastSeen.current.path === activeFile &&
      lastSeen.current.code !== activeCode;
    lastSeen.current = { path: activeFile, code: activeCode };
    if (!enabled || !changedSameFile) return;
    const timer = setTimeout(save, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [enabled, activeFile, activeCode, save]);
};
