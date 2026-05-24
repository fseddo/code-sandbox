import type { LearnTopic } from "@/learn/data/topic";

export const databaseIndexing = {
  slug: "database-indexing",
  title: "Database indexing",
  category: "databases",
  summary: "A B-tree side structure that turns an O(n) table scan into an O(log n) lookup — at a write cost.",
  tags: ["database", "backend"],
  sources: [
    { label: "Use The Index, Luke!", url: "https://use-the-index-luke.com/" },
    { label: "PostgreSQL — Indexes", url: "https://www.postgresql.org/docs/current/indexes.html" },
  ],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "An index is an auxiliary structure (usually a B-tree) that lets the database find rows by a column's " +
          "value without scanning the whole table — turning an O(n) scan into an O(log n) lookup. The cost is " +
          "extra storage and slower writes, since every insert and update must also maintain the index.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Index columns you frequently filter, join, or sort by. Don't over-index: each one taxes writes, and an " +
          "index the query planner never uses is pure overhead. For composite indexes, column order matters — the " +
          "leftmost-prefix rule decides which queries it can serve.",
      },
    ],
  },
} satisfies LearnTopic;
