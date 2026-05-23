const isBrowser = (): boolean => typeof window !== "undefined";

const readKey = <T>(key: string): T | null => {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeKey = (key: string, value: unknown): void => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be full or unavailable — ignore.
  }
};

const removeKey = (key: string): void => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

/**
 * A typed, SSR-safe, parse-safe handle on persisted storage. This is the seam the DB adapter will
 * replace — domain modules depend on these methods, not on `localStorage` directly.
 */
export type SingletonStore<T> = {
  read: () => T | null;
  write: (value: T) => void;
  remove: () => void;
};

/** A store for one fixed key — a singleton blob (editor settings, the progress map). */
export const createSingletonStore = <T>(key: string): SingletonStore<T> => ({
  read: () => readKey<T>(key),
  write: (value) => writeKey(key, value),
  remove: () => removeKey(key),
});

export type KeyedStore<T> = {
  read: (id: string) => T | null;
  write: (id: string, value: T) => void;
  remove: (id: string) => void;
  /** Every readable `(id, value)` currently stored under the prefix; corrupt records are skipped. */
  entries: () => Array<{ id: string; value: T }>;
};

/** A store for many records under a shared key prefix, one per id (pads, per-problem solutions). */
export const createKeyedStore = <T>(prefix: string): KeyedStore<T> => {
  const keyFor = (id: string) => `${prefix}${id}`;
  return {
    read: (id) => readKey<T>(keyFor(id)),
    write: (id, value) => writeKey(keyFor(id), value),
    remove: (id) => removeKey(keyFor(id)),
    entries: () => {
      if (!isBrowser()) return [];
      const out: Array<{ id: string; value: T }> = [];
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (!key || !key.startsWith(prefix)) continue;
          const value = readKey<T>(key);
          if (value !== null) out.push({ id: key.slice(prefix.length), value });
        }
      } catch {
        return [];
      }
      return out;
    },
  };
};
