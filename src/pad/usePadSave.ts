"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { useLatestRef } from "@/components/useLatestRef";
import { useDirtyTracker } from "@/components/useDirtyTracker";
import { AUTOSAVE_DEBOUNCE_MS, useDebouncedCallback } from "@/components/useDebouncedCallback";

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

  const sandpackRef = useLatestRef(sandpack);

  const { setSavedSnapshot, isDirty } = useDirtyTracker(snapshotOf(sandpack.files), () =>
    snapshotOf(sandpack.files),
  );

  // runSandpack cold-restarts the bundler — guard the StrictMode remount so the user doesn't pay a multi-second restart twice on every fresh load.
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    sandpackRef.current.runSandpack();
  }, [sandpackRef]);

  // updateFile HMR-pushes through the live bundler; runSandpack would cold-restart it.
  const save = useCallback(() => {
    const sp = sandpackRef.current;
    const path = sp.activeFile;
    const code = sp.files[path]?.code;
    if (code === undefined) return;
    sp.updateFile(path, code, true);
    setSavedSnapshot((prev) => ({ ...prev, [path]: code }));
  }, [sandpackRef, setSavedSnapshot]);

  const addFile = useCallback(
    (path: string, code: string) => {
      const sp = sandpackRef.current;
      sp.addFile(path, code);
      sp.openFile(path);
      setSavedSnapshot((prev) => ({ ...prev, [path]: code }));
    },
    [sandpackRef, setSavedSnapshot],
  );

  const deleteFile = useCallback(
    (path: string) => {
      sandpackRef.current.deleteFile(path);
      setSavedSnapshot((prev) => {
        const next = { ...prev };
        delete next[path];
        return next;
      });
    },
    [sandpackRef, setSavedSnapshot],
  );

  return { isDirty, save, addFile, deleteFile };
};

/**
 * Debounced save on content change. Stays effect-driven: the pad edits through Sandpack's own editor,
 * which exposes no change event — the live value is observed as `sandpack.files`. The `lastSeen` ref
 * skips file switches (a new active file isn't an edit).
 */
export const useAutosave = (enabled: boolean, save: () => void): void => {
  const { sandpack } = useSandpack();
  const activeFile = sandpack.activeFile;
  const activeCode = sandpack.files[activeFile]?.code;
  const trigger = useDebouncedCallback(save, AUTOSAVE_DEBOUNCE_MS);
  const lastSeen = useRef<{ path: string; code: string | undefined }>({
    path: activeFile,
    code: activeCode,
  });

  useEffect(() => {
    const changedSameFile =
      lastSeen.current.path === activeFile && lastSeen.current.code !== activeCode;
    lastSeen.current = { path: activeFile, code: activeCode };
    if (enabled && changedSameFile) trigger();
  }, [enabled, activeFile, activeCode, trigger]);
};
