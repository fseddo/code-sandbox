import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * `Object.entries` for known-shape objects: keys come back as `keyof`-style literals, not `string`.
 * The lone cast is sound for object literals whose runtime keys are exactly their type's keys. Pass
 * `V` explicitly to widen values past their precise literal types — `typedEntries<Key, Detail>(reg)`.
 */
export const typedEntries = <K extends PropertyKey, V>(obj: Record<K, V>): [K, V][] =>
  Object.entries(obj) as [K, V][];
