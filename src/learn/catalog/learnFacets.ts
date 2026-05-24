import type { LearnCategory, TopicSummary } from "@/learn/data/topic";
import { titleizeSlug } from "@/problems/shared/format";

/** The coarse split shown as the sidebar's headline facet — the learn analogue of problems' algo/build. */
export type Track = "dsa" | "tech";

const TRACK_OF: Record<LearnCategory, Track> = {
  "data-structures": "dsa",
  algorithms: "dsa",
  complexity: "dsa",
  databases: "tech",
  web: "tech",
  systems: "tech",
};

const TRACK_LABEL: Record<Track, string> = {
  dsa: "Algorithms & data structures",
  tech: "Technologies",
};

export type LearnFacetKey = "track" | "tags";
export type LearnSelection = Partial<Record<LearnFacetKey, string[]>>;
export type LearnFacetOption = { value: string; label: string; count: number };
export type LearnFacetView = { key: LearnFacetKey; options: LearnFacetOption[] };

export const FACET_KEYS: LearnFacetKey[] = ["track", "tags"];

/** The value(s) a topic has for a facet — exactly one track (derived from category), many tags. */
const valuesOf = (topic: TopicSummary, key: LearnFacetKey): string[] =>
  key === "track" ? [TRACK_OF[topic.category]] : (topic.tags ?? []);

export const labelForFacet = (key: LearnFacetKey, value: string): string =>
  key === "track" ? TRACK_LABEL[value as Track] : titleizeSlug(value);

/** Does a topic pass the selection on every facet except `ignore`? (Used so a facet doesn't filter itself.) */
const matchesExcept = (topic: TopicSummary, selection: LearnSelection, ignore?: LearnFacetKey): boolean =>
  FACET_KEYS.every((key) => {
    if (key === ignore) return true;
    const chosen = selection[key];
    if (!chosen || chosen.length === 0) return true;
    return valuesOf(topic, key).some((value) => chosen.includes(value));
  });

/**
 * Build each facet's options from the topics matching the *other* facets' selections — so picking a Type
 * (track) narrows the Tags facet to that track's tags, instead of offering tags that would match nothing.
 * A facet never filters itself, so its own siblings stay visible.
 */
export const buildLearnFacets = (topics: TopicSummary[], selection: LearnSelection): LearnFacetView[] =>
  FACET_KEYS.map((key) => {
    const counts = new Map<string, number>();
    for (const topic of topics) {
      if (!matchesExcept(topic, selection, key)) continue;
      for (const value of valuesOf(topic, key)) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    const options = [...counts.entries()]
      .map(([value, count]) => ({ value, label: labelForFacet(key, value), count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return { key, options };
  });

/** AND across facets, OR within a facet — same semantics as the problems catalog. */
export const filterTopics = (topics: TopicSummary[], selection: LearnSelection): TopicSummary[] =>
  topics.filter((topic) => matchesExcept(topic, selection));

/** Flatten the selection into labeled pills for the active-filters row. */
export const activeLearnSelections = (
  selection: LearnSelection,
): { key: LearnFacetKey; value: string; label: string }[] =>
  FACET_KEYS.flatMap((key) =>
    (selection[key] ?? []).map((value) => ({ key, value, label: labelForFacet(key, value) })),
  );
