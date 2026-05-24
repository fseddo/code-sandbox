import type { LearnTopic } from "@/learn/data/topic";

export const binarySearch = {
  slug: "binary-search",
  title: "Binary search",
  category: "algorithms",
  summary: "Halve a sorted (or monotonic) search space each step — O(log n), if you get the invariant right.",
  tags: ["binary-search"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Binary search discards half the search space each step, finding a target — or a boundary — in O(log n). " +
          "The subtlety is the loop invariant: which half is safe to drop, and whether you want an exact value or " +
          "the *first/last* position where a predicate flips. Off-by-one bugs live in the `lo`/`hi`/`mid` update.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for it on sorted data, and — less obviously — to 'binary search the answer' on any *monotonic* " +
          "predicate: the smallest capacity that works, the minimum feasible value, the rotation point. If you can " +
          "phrase the question as 'what's the boundary where feasible flips to infeasible?', it applies.",
      },
    ],
  },
} satisfies LearnTopic;
