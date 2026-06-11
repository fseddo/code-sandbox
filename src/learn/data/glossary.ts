import { getTopic, type TopicSlug } from "@/learn/data/topics";

/**
 * A definable SWE term, marked in prose as `[[term]]`. Two shapes, one mechanism:
 * - `definition` — a short inline blurb shown on hover (tooltip-only term).
 * - `topicSlug` — the term has a full topic page; the blurb reuses that topic's `summary` and the hover
 *   card links to it. A term "graduates" from blurb-only to linked simply by gaining a topic — no prose change.
 */
export type GlossaryEntry = { definition: string } | { topicSlug: TopicSlug };

const GLOSSARY = {
  acid: {
    definition:
      "A set of guarantees for database transactions — Atomicity, Consistency, Isolation, Durability — that keep data correct under concurrent access and failures.",
  },
  sql: {
    definition:
      "Structured Query Language — the declarative language for defining and querying relational data (SELECT, INSERT, JOIN, …).",
  },
  nosql: { topicSlug: "nosql-databases" },
  orm: {
    definition:
      "Object-Relational Mapping — a library that maps database rows to objects in your code (Prisma, Sequelize, ActiveRecord), so you query in the host language instead of raw SQL.",
  },
  dom: {
    definition:
      "Document Object Model — the browser's in-memory tree of a page's elements that JavaScript reads and mutates to change what's rendered.",
  },
} satisfies Record<string, GlossaryEntry>;

/** The render-ready shape: display text, the hover blurb, and an optional link to a full topic. */
export type ResolvedTerm = { label: string; blurb: string; href?: string };

/** Look a `[[term]]` up (case-insensitive). Returns null for an unknown term so prose falls back to plain text. */
export const resolveTerm = (raw: string): ResolvedTerm | null => {
  const entry = GLOSSARY[raw.toLowerCase() as keyof typeof GLOSSARY];
  if (!entry) return null;
  if ("topicSlug" in entry) {
    const topic = getTopic(entry.topicSlug);
    if (!topic) return { label: raw, blurb: "" };
    return { label: raw, blurb: topic.summary, href: `/concepts/${entry.topicSlug}` };
  }
  return { label: raw, blurb: entry.definition };
};
