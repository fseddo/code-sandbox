import type { Difficulty } from "@/problems/data/problem";
import { getProblem } from "@/problems/data/problems";
import type { Section } from "./topic";
import { getTopic } from "./topics";

/**
 * The Study Guide layer: a curated, sequenced curriculum *over* the existing topic bank (ByteByteGo-style).
 * A track is an ordered list of chapters; a chapter is a pattern topic whose article is the intro, followed
 * by that topic's practice problems as workable steps. This expresses grouping/order WITHOUT restructuring
 * the topic files — the catalog's flat "all" view and this stepped view are two reads of the same content.
 */
export type TrackId = "algos" | "system-design";

/** One chapter: a topic (its article is the intro) + the problems to step through (defaults to the topic's practice list). */
export type CurriculumChapter = {
  topic: string;
  /** Override the problem ids; when omitted, derived from the topic's `practice` section. */
  problems?: string[];
};

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
    chapters: [],
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

/** One clickable item in the guide sidebar / content pane — either a topic article or a workable problem. */
export type GuideEntry =
  | { kind: "topic"; slug: string; title: string; href: string }
  | { kind: "problem"; id: string; title: string; difficulty: Difficulty; href: string };

/** A resolved chapter for rendering: a 1-based number, the pattern title, and its ordered entries. */
export type GuideChapterView = { number: number; title: string; entries: GuideEntry[] };

/**
 * Resolve a track into render-ready chapters: each chapter's intro article entry + a problem entry per
 * practice problem that exists in the bank. Server-side (reads the topic + problem registries); the
 * result is plain data, safe to hand to the client sidebar.
 */
export const resolveTrack = (trackId: TrackId): GuideChapterView[] =>
  TRACKS[trackId].chapters.map((chapter, index) => {
    const topic = getTopic(chapter.topic);
    const title = topic?.title ?? chapter.topic;
    const intro: GuideEntry = {
      kind: "topic",
      slug: chapter.topic,
      title: `Introduction to ${title}`,
      href: `/study-guide/${trackId}/topic/${chapter.topic}`,
    };
    const problems = (chapter.problems ?? practiceProblemIds(chapter.topic)).flatMap((id): GuideEntry[] => {
      const problem = getProblem(id);
      return problem
        ? [{ kind: "problem", id, title: problem.title, difficulty: problem.difficulty, href: `/study-guide/${trackId}/problem/${id}` }]
        : [];
    });
    return { number: index + 1, title, entries: [intro, ...problems] };
  });

/** The first entry's href — where `/study-guide/[track]` redirects so the stepped view always opens on content. */
export const firstEntryHref = (trackId: TrackId): string | undefined =>
  resolveTrack(trackId).find((chapter) => chapter.entries.length > 0)?.entries[0]?.href;
