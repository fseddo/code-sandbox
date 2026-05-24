import type { LearnTopic } from "@/learn/data/topic";

export const sorting = {
  slug: "sorting",
  title: "Sorting",
  category: "algorithms",
  summary: "Ordering by a comparator — comparison sorts bottom out at O(n log n); often the cheap first step.",
  tags: ["sorting", "merge-sort"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Sorting arranges elements by a comparator. Comparison sorts can't beat O(n log n) — merge sort " +
          "(stable, divide-and-conquer), heap sort, and quicksort (in-place, O(n²) worst case) all live there. " +
          "JavaScript's `Array.sort` is O(n log n) but sorts *lexicographically* by default, so pass a numeric " +
          "comparator `(a, b) => a - b` for numbers.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Sorting is often the cheap first move that unlocks two pointers, greedy choices, interval sweeps, or " +
          "deduplication. Know merge sort and quicksort at least conceptually, and reach for counting/bucket sort " +
          "when the key range is small (beating the O(n log n) comparison bound).",
      },
    ],
  },
} satisfies LearnTopic;
