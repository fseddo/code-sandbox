import type { LearnTopic } from "@/learn/data/topic";

export const prefixSum = {
  slug: "prefix-sum",
  title: "Prefix sums",
  category: "algorithms",
  summary: "Precompute running totals so any range sum is O(1) — and pair with a hash map for 'sum equals k'.",
  tags: ["prefix-sum"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A prefix-sum array stores the running total up to each index, so the sum of any range `[i, j]` is " +
          "`prefix[j + 1] - prefix[i]` — O(1) per query after an O(n) precompute. The same idea extends to 2D " +
          "grids and to running products or counts.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for prefix sums when you make many range-sum queries, or — paired with a hash map of seen " +
          "prefixes — for 'count/​find subarrays summing to k' in one pass, turning a quadratic scan into linear.",
      },
    ],
  },
} satisfies LearnTopic;
