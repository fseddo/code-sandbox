import type { Difficulty } from "@/problems/data/problem";
import { getProblem } from "@/problems/data/problems";
import { topicProgressKey } from "@/problems/progress/progress";
import type { Section } from "./topic";
import { getTopic } from "./topics";

/**
 * The Study Guide layer: a curated, sequenced curriculum *over* the existing topic bank (ByteByteGo-style).
 * A track is an ordered list of chapters, in one of two shapes — a *pattern* chapter (an intro article plus
 * its practice problems) or a *concept* chapter (a run of lesson articles). Either way this expresses
 * grouping/order WITHOUT restructuring the topic files — the catalog's flat "all" view and this stepped
 * view stay two reads of the same content.
 */
export type TrackId = "algos" | "system-design";

/** A pattern chapter: one topic's article is the intro, then its problems are the workable steps. */
export type PatternChapter = {
  topic: string;
  /** Override the problem ids; when omitted, derived from the topic's `practice` section. */
  problems?: string[];
};

/**
 * A concept chapter: an ordered run of lesson articles under one title, with nothing to solve. The System
 * design track is built from these — its "problems" are Phase 2 case studies, which don't exist yet.
 */
export type ConceptChapter = {
  title: string;
  topics: string[];
};

/** Narrowed on the presence of `topics`, so a chapter's shape declares which kind it is. */
export type CurriculumChapter = PatternChapter | ConceptChapter;

export type Track = {
  id: TrackId;
  title: string;
  subtitle: string;
  chapters: CurriculumChapter[];
};

/** Pattern order mirrors the ByteByteGo "Coding Interview Patterns" track, mapped onto the topics we have. */
export const TRACKS: Record<TrackId, Track> = {
  algos: {
    id: "algos",
    title: "Algorithms & data structures",
    subtitle: "Work the interview patterns end to end — read the pattern, then step through its problems.",
    chapters: [
      { topic: "two-pointers" },
      { topic: "hash-maps" },
      { topic: "linked-lists" },
      { topic: "sliding-window" },
      { topic: "binary-search" },
      { topic: "stacks" },
      { topic: "heaps" },
      { topic: "intervals" },
      { topic: "prefix-sum" },
      { topic: "trees" },
      { topic: "tries" },
      { topic: "graphs" },
      { topic: "backtracking" },
      { topic: "dynamic-programming" },
      { topic: "greedy" },
      { topic: "sorting" },
      { topic: "bit-manipulation" },
      { topic: "math" },
    ],
  },
  "system-design": {
    id: "system-design",
    title: "System design",
    subtitle: "End-to-end designs on a reusable 4-step framework.",
    chapters: [
      {
        title: "Introduction to system design",
        topics: ["what-is-system-design", "system-design-interview-framework"],
      },
      {
        title: "Core concepts",
        topics: [
          "scalability",
          "availability",
          "reliability",
          "single-point-of-failure-spof",
          "latency-vs-throughput",
          "consistent-hashing",
          "cap-theorem",
          "consistency-models",
        ],
      },
    ],
  },
};

/** Narrow a raw route param to a known track id. */
export const isTrackId = (value: string): value is TrackId => value in TRACKS;

/** Pull the ordered problem ids a topic links in its `practice` section (essential first, then recommended). */
const practiceProblemIds = (slug: string): string[] => {
  const blocks = getTopic(slug)?.parts.practice ?? [];
  const practice = blocks.find((block): block is Extract<Section, { kind: "practice" }> => block.kind === "practice");
  return practice ? [...practice.essential, ...(practice.recommended ?? [])] : [];
};

/**
 * One clickable item in the guide sidebar / content pane — either a topic article or a workable problem.
 * `progressKey` is what the progress store is keyed by: a problem uses its own id, a topic a namespaced
 * slug (the two share one localStorage map, and a topic slug could otherwise collide with a problem id).
 */
export type GuideEntry = { progressKey: string } & (
  | { kind: "topic"; slug: string; title: string; href: string }
  | { kind: "problem"; id: string; title: string; difficulty: Difficulty; href: string }
);

/** A resolved chapter for rendering: a 1-based number, the pattern title, and its ordered entries. */
export type GuideChapterView = { number: number; title: string; entries: GuideEntry[] };

const topicEntry = (trackId: TrackId, slug: string, title: string): GuideEntry => ({
  kind: "topic",
  slug,
  title,
  href: `/study-guide/${trackId}/topic/${slug}`,
  progressKey: topicProgressKey(slug),
});

/** A pattern chapter resolves to its intro article plus one entry per practice problem that exists in the bank. */
const resolvePatternChapter = (trackId: TrackId, chapter: PatternChapter) => {
  const topic = getTopic(chapter.topic);
  const title = topic?.title ?? chapter.topic;
  const problems = (chapter.problems ?? practiceProblemIds(chapter.topic)).flatMap((id): GuideEntry[] => {
    const problem = getProblem(id);
    return problem
      ? [
          {
            kind: "problem",
            id,
            title: problem.title,
            difficulty: problem.difficulty,
            href: `/study-guide/${trackId}/problem/${id}`,
            progressKey: id,
          },
        ]
      : [];
  });
  return { title, entries: [topicEntry(trackId, chapter.topic, `Introduction to ${title}`), ...problems] };
};

/** A concept chapter resolves to one entry per lesson, each keeping its own title. Unknown slugs drop out. */
const resolveConceptChapter = (trackId: TrackId, chapter: ConceptChapter) => ({
  title: chapter.title,
  entries: chapter.topics.flatMap((slug): GuideEntry[] => {
    const topic = getTopic(slug);
    return topic ? [topicEntry(trackId, slug, topic.title)] : [];
  }),
});

/**
 * Resolve a track into render-ready chapters. Server-side (reads the topic + problem registries); the
 * result is plain data, safe to hand to the client sidebar.
 */
export const resolveTrack = (trackId: TrackId): GuideChapterView[] =>
  TRACKS[trackId].chapters.map((chapter, index) => ({
    number: index + 1,
    ...("topics" in chapter ? resolveConceptChapter(trackId, chapter) : resolvePatternChapter(trackId, chapter)),
  }));

/** The first entry's href — where `/study-guide/[track]` redirects so the stepped view always opens on content. */
export const firstEntryHref = (trackId: TrackId): string | undefined =>
  resolveTrack(trackId).find((chapter) => chapter.entries.length > 0)?.entries[0]?.href;
