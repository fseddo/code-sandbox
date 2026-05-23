import type { SandpackFiles } from "@codesandbox/sandpack-react";
import { createKeyedStore } from "@/lib/localStore";

type StoredPad = {
  files: SandpackFiles;
  updatedAt: number;
  /** A user-given display name. Absent until the pad is renamed; the UI falls back to the id. */
  title?: string;
};

const store = createKeyedStore<StoredPad>("noodle:pad:");

/** Generates a short, URL-safe pad id. Runs on both server and client. */
export const newPadId = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

/** Reads a pad's saved files, or null if there are none (an empty file set seeds from the starter). */
export const loadPad = (id: string): SandpackFiles | null => {
  const pad = store.read(id);
  if (!pad?.files || Object.keys(pad.files).length === 0) return null;
  return pad.files;
};

/** The pad's display name, or null if it's never been renamed. */
export const loadPadTitle = (id: string): string | null => store.read(id)?.title ?? null;

/**
 * Persists a pad's files. A `title` is written when given (build problems pass their fixed problem
 * title on every save); omitting it preserves whatever's stored (a scratchpad's user-set name).
 */
export const savePad = (id: string, files: SandpackFiles, title?: string): void => {
  store.write(id, {
    ...store.read(id),
    files,
    updatedAt: Date.now(),
    ...(title !== undefined ? { title } : {}),
  });
};

/** Sets (or clears, when blank) a pad's display name without touching its files. */
export const renamePad = (id: string, title: string): void => {
  const current = store.read(id);
  const trimmed = title.trim();
  store.write(id, {
    files: current?.files ?? {},
    updatedAt: current?.updatedAt ?? Date.now(),
    title: trimmed || undefined,
  });
};

/** Removes a pad from this browser. */
export const clearPad = (id: string): void => store.remove(id);

/** Discards a pad's saved files and reloads, so it rehydrates from its starter seed. */
export const resetPad = (id: string): void => {
  clearPad(id);
  window.location.reload();
};

export type PadSummary = {
  id: string;
  updatedAt: number;
  title?: string;
};

/** Lists every pad saved in this browser, most recently edited first. */
export const listPads = (): PadSummary[] =>
  store
    .entries()
    .map(({ id, value }) => ({ id, updatedAt: value.updatedAt ?? 0, title: value.title }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
