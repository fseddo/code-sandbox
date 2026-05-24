import type { LearnTopic } from "@/learn/data/topic";

export const cachingAndCdns = {
  slug: "caching-and-cdns",
  title: "Caching & CDNs",
  category: "systems",
  summary: "Store expensive results close to the request — layered caches, eviction, and the hard part: invalidation.",
  tags: ["caching", "scalability", "networking"],
  sources: [
    { label: "Hello Interview — Caching", url: "https://www.hellointerview.com/learn/system-design/core-concepts/caching" },
    { label: "Educative — The distributed cache", url: "https://www.educative.io/courses/grokking-the-system-design-interview/system-design-the-distributed-cache" },
  ],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A cache stores the result of expensive work close to where it's needed, so repeat requests skip the " +
          "work. The layers stack: browser cache, CDN (geographically distributed edge servers), application cache " +
          "(Redis), and the database's own buffers. The hard parts are *invalidation* and the *eviction policy* " +
          "(LRU vs LFU).",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Cache read-heavy, rarely-changing data, and serve static assets from a CDN to cut latency and origin " +
          "load. The classic pattern is **cache-aside**: check the cache, on a miss load from the database and " +
          "populate it. Always have a TTL or invalidation story, or you'll serve stale data.",
      },
    ],
  },
} satisfies LearnTopic;
