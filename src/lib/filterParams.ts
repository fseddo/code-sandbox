import type { ReadonlyURLSearchParams } from "next/navigation";

type ReadableParams = Pick<URLSearchParams, "get">;

/** Parse comma-joined multi-value facet params into a selection object — keys with values only. */
export const parseFacetParams = <K extends string>(
  params: ReadableParams,
  keys: readonly K[],
): Partial<Record<K, string[]>> => {
  const selection: Partial<Record<K, string[]>> = {};
  for (const key of keys) {
    const raw = params.get(key);
    if (raw) selection[key] = raw.split(",").filter(Boolean);
  }
  return selection;
};

/** Per-listing sessionStorage keys for the cached filter query string (read by detail-page back-links). */
export const FILTER_CACHE_KEY = {
  learn: "noodle:filters:learn",
  problems: "noodle:filters:problems",
} as const;

/**
 * Mirror a facet selection (+ optional scalar params like search/sort) to the URL **without navigating**,
 * via `history.replaceState`. This keeps the filtered state shareable and restored on browser-back, while
 * the component's `useState` stays the source of truth. Empty values are dropped to keep URLs clean.
 * When `cacheKey` is given, the query string is also cached in `sessionStorage` so a detail page's
 * back-link can rebuild the filtered listing URL (an in-app Link can't read the previous page's state).
 */
export const syncFilterUrl = (
  selection: Partial<Record<string, string[] | undefined>>,
  scalars: Record<string, string> = {},
  cacheKey?: string,
): void => {
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(selection)) {
    if (values && values.length > 0) params.set(key, values.join(","));
  }
  for (const [key, value] of Object.entries(scalars)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  if (cacheKey) window.sessionStorage.setItem(cacheKey, query);
};

export type { ReadonlyURLSearchParams };
