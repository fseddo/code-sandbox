"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";

type Snapshot = Record<string, string>;

function snapshotFiles(files: Record<string, { code: string }>): Snapshot {
  const out: Snapshot = {};
  for (const [path, file] of Object.entries(files)) {
    out[path] = file.code;
  }
  return out;
}

/**
 * Update the saved baseline to match the current file set, preserving the
 * content baseline for files that already existed. Added files adopt their
 * current content as baseline (since addFile already pushed to the bundler);
 * deleted files drop out.
 */
function reconcileSnapshot(prev: Snapshot, current: Snapshot): Snapshot {
  const next: Snapshot = {};
  for (const path of Object.keys(current)) {
    next[path] = path in prev ? prev[path] : current[path];
  }
  return next;
}

function contentDrifted(snap: Snapshot, current: Snapshot): boolean {
  for (const path of Object.keys(snap)) {
    if (snap[path] !== current[path]) return true;
  }
  return false;
}

/**
 * Manual save model: tracks unsaved *content* drift between editor and
 * preview, and exposes save() to apply it (Vite HMR for vite-react-ts).
 *
 * File create/delete is intentionally NOT dirty — those ops auto-push.
 * Must be used inside a <SandpackProvider>.
 */
export function usePadSave() {
  const { sandpack } = useSandpack();
  const [isDirty, setIsDirty] = useState(false);

  const sandpackRef = useRef(sandpack);
  sandpackRef.current = sandpack;

  const savedSnapshot = useRef<Snapshot>({});

  // Save = push the active file's current content into the running bundler
  // via HMR. Calling runSandpack() here would cold-restart the dev server
  // (new port, multi-second white screen); updateFile with shouldUpdatePreview
  // routes through the live bundler, which is what autoReload: false holds back.
  const save = useCallback(() => {
    const sp = sandpackRef.current;
    const path = sp.activeFile;
    const code = sp.files[path]?.code;
    if (code === undefined) return;
    sp.updateFile(path, code, true);
    savedSnapshot.current = { ...savedSnapshot.current, [path]: code };
  }, []);

  // Run the bundler once on mount (autorun is off) and capture the baseline.
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    sandpackRef.current.runSandpack();
    savedSnapshot.current = snapshotFiles(sandpackRef.current.files);
  }, []);

  // Recompute dirty on every file change. File-set changes absorb into the
  // snapshot; only content drift marks dirty.
  useEffect(() => {
    const current = snapshotFiles(sandpack.files);
    const reconciled = reconcileSnapshot(savedSnapshot.current, current);
    savedSnapshot.current = reconciled;
    setIsDirty(contentDrifted(reconciled, current));
  }, [sandpack.files]);

  return { isDirty, save };
}

const AUTOSAVE_DEBOUNCE_MS = 600;

/**
 * When enabled, debounce-saves the active file on every content change.
 * Tracks the last seen active-file code so toggling the switch on doesn't
 * re-save unchanged content, and switching files doesn't push a no-op.
 */
export function useAutosave(enabled: boolean, save: () => void): void {
  const { sandpack } = useSandpack();
  const saveRef = useRef(save);
  saveRef.current = save;

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
    const timer = setTimeout(() => saveRef.current(), AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [enabled, activeFile, activeCode]);
}
