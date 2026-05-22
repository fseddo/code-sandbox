import type { SandpackFiles } from "@codesandbox/sandpack-react";

const PREFIX = "noodle:pad:";
const keyFor = (id: string) => `${PREFIX}${id}`;

type StoredPad = {
  files: SandpackFiles;
  updatedAt: number;
  /** A user-given display name. Absent until the pad is renamed; the UI falls back to the id. */
  title?: string;
};

/** Generates a short, URL-safe pad id. Runs on both server and client. */
export const newPadId = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

/** Parses the full stored record for a pad, or null when nothing is saved / it's unreadable. */
const readPad = (id: string): StoredPad | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(keyFor(id));
    return raw ? (JSON.parse(raw) as StoredPad) : null;
  } catch {
    return null;
  }
};

const writePad = (id: string, pad: StoredPad): void => {
  try {
    window.localStorage.setItem(keyFor(id), JSON.stringify(pad));
  } catch {
    // localStorage may be full or unavailable — ignore for now.
  }
};

/** Reads a pad's saved files, or null if there are none (an empty file set seeds from the starter). */
export const loadPad = (id: string): SandpackFiles | null => {
  const pad = readPad(id);
  if (!pad?.files || Object.keys(pad.files).length === 0) return null;
  return pad.files;
};

/** The pad's display name, or null if it's never been renamed. */
export const loadPadTitle = (id: string): string | null => readPad(id)?.title ?? null;

/**
 * Persists a pad's files. A `title` is written when given (build problems pass their fixed problem
 * title on every save); omitting it preserves whatever's stored (a scratchpad's user-set name).
 */
export const savePad = (id: string, files: SandpackFiles, title?: string): void => {
  if (typeof window === "undefined") return;
  writePad(id, {
    ...readPad(id),
    files,
    updatedAt: Date.now(),
    ...(title !== undefined ? { title } : {}),
  });
};

/** Sets (or clears, when blank) a pad's display name without touching its files. */
export const renamePad = (id: string, title: string): void => {
  if (typeof window === "undefined") return;
  const current = readPad(id);
  const trimmed = title.trim();
  writePad(id, {
    files: current?.files ?? {},
    updatedAt: current?.updatedAt ?? Date.now(),
    title: trimmed || undefined,
  });
};

/** Removes a pad from this browser. */
export const clearPad = (id: string): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(keyFor(id));
  } catch {
    // ignore
  }
};

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
export const listPads = (): PadSummary[] => {
  if (typeof window === "undefined") return [];
  const pads: PadSummary[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(PREFIX)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as StoredPad;
      pads.push({
        id: key.slice(PREFIX.length),
        updatedAt: parsed.updatedAt ?? 0,
        title: parsed.title,
      });
    }
  } catch {
    return [];
  }
  return pads.sort((a, b) => b.updatedAt - a.updatedAt);
};
