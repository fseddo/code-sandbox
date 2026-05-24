import type { LearnTopic } from "@/learn/data/topic";

export const heaps = {
  slug: "heaps",
  title: "Heaps & priority queues",
  category: "data-structures",
  summary: "O(1) peek at the min/max, O(log n) insert/extract — the structure for 'top-k' and scheduling.",
  tags: ["heap-priority-queue"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A binary heap is a *complete* binary tree stored compactly in an array, maintaining the heap " +
          "invariant: each parent is ≤ its children (min-heap) or ≥ them (max-heap). That gives O(1) access to " +
          "the extreme element and O(log n) insert and extract — the standard *priority queue* implementation.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a heap when you repeatedly need the smallest or largest of a *changing* set: top-k elements, " +
          "merging k sorted lists, Dijkstra's shortest paths, and running medians (two heaps). If you only need " +
          "the order once, a single sort is simpler.",
      },
    ],
  },
} satisfies LearnTopic;
