import { getTopic, type TopicSlug } from "@/learn/data/topics";

/**
 * A definable SWE term, marked in prose as `[[term]]` or `[[term|display label]]`. Two shapes, one mechanism:
 * - `definition` — a short inline blurb shown on hover (tooltip-only term).
 * - `topicSlug` — the term has a full topic page; the blurb reuses that topic's `summary` and the hover
 *   card links to it. A term "graduates" from blurb-only to linked simply by gaining a topic — no prose change.
 * A term that isn't in this curated list but matches a real topic slug (e.g. `[[hash-maps]]`) auto-resolves
 * against the topic registry — this is how a Full topic cross-links a sibling per learn-authoring.md.
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

/**
 * Look a `[[term]]` or `[[term|display label]]` up (term case-insensitive). Checks the curated glossary first,
 * then falls back to a direct topic-slug match. With no explicit display label, a matched topic renders under
 * its own `title`. Returns null for an unknown term, which the caller degrades to a marked-but-unlinked span.
 */
export const resolveTerm = (raw: string): ResolvedTerm | null => {
  const [term, displayLabel] = raw.split("|");
  const key = term.toLowerCase();

  const entry = GLOSSARY[key as keyof typeof GLOSSARY];
  if (entry) {
    if ("topicSlug" in entry) {
      const topic = getTopic(entry.topicSlug);
      if (!topic) return { label: displayLabel ?? term, blurb: "" };
      return { label: displayLabel ?? topic.title, blurb: topic.summary, href: `/concepts/${entry.topicSlug}` };
    }
    return { label: displayLabel ?? term, blurb: entry.definition };
  }

  const topic = getTopic(key);
  if (!topic) return null;
  // No alias given: show the topic's own title rather than its slug, so `[[dynamic-programming]]` reads as
  // prose instead of leaking kebab-case into a sentence.
  return { label: displayLabel ?? topic.title, blurb: topic.summary, href: `/concepts/${key}` };
};
