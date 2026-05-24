import type { LearnTopic } from "@/learn/data/topic";

export const intervals = {
  slug: "intervals",
  title: "Intervals",
  category: "algorithms",
  summary: "Ranges [start, end] — sort by an endpoint, then a single linear sweep handles overlaps.",
  tags: ["interval"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Interval problems operate over ranges `[start, end]`. The near-universal first move is to **sort by " +
          "start** (sometimes by end), after which merging, overlap detection, and counting collapse into a " +
          "single linear sweep where you only compare each interval with the running frontier.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for the sort-then-sweep pattern for merging intervals, inserting an interval into a sorted set, " +
          "counting overlapping meetings, and detecting any overlap. A min-heap of end times handles the " +
          "'how many rooms at once?' variants.",
      },
    ],
  },
} satisfies LearnTopic;
