import type { LearnTopic } from "@/learn/data/topic";

export const redis = {
  slug: "redis",
  title: "Redis",
  category: "databases",
  summary: "In-memory key-value store — sub-millisecond, rich types, TTLs. The default cache layer.",
  tags: ["database", "caching", "backend"],
  sources: [
    { label: "Redis documentation", url: "https://redis.io/docs/latest/" },
    { label: "Hello Interview — Caching", url: "https://www.hellointerview.com/learn/system-design/core-concepts/caching" },
  ],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Redis is an in-memory key-value store: data lives in RAM, so reads and writes are sub-millisecond. " +
          "Beyond strings it offers rich types — hashes, lists, sets, sorted sets — plus TTL expiry and pub/sub. " +
          "Persistence to disk is optional and best-effort.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for Redis as a cache in front of a slower database, for session storage, rate limiting, " +
          "leaderboards (sorted sets), and lightweight queues. It isn't your system of record — memory is finite " +
          "and durability is weaker than a relational database's unless carefully configured.",
      },
    ],
  },
} satisfies LearnTopic;
