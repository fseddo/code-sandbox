import type { SandpackFiles } from "@codesandbox/sandpack-react";

const PREFIX = "noodle:pad:";
const keyFor = (id: string) => `${PREFIX}${id}`;

type StoredPad = {
  files: SandpackFiles;
  updatedAt: number;
};

/** Generates a short, URL-safe pad id. Runs on both server and client. */
export const newPadId = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

/** Reads a pad's saved files from this browser, or null if none exist. */
export const loadPad = (id: string): SandpackFiles | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(keyFor(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPad;
    return parsed.files ?? null;
  } catch {
    return null;
  }
};

/** Persists a pad's files to this browser. */
export const savePad = (id: string, files: SandpackFiles): void => {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredPad = { files, updatedAt: Date.now() };
    window.localStorage.setItem(keyFor(id), JSON.stringify(payload));
  } catch {
    // localStorage may be full or unavailable — ignore for now.
  }
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

export type PadSummary = {
  id: string;
  updatedAt: number;
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
      });
    }
  } catch {
    return [];
  }
  return pads.sort((a, b) => b.updatedAt - a.updatedAt);
};
