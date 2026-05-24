import type { LearnTopic } from "@/learn/data/topic";

export const divideAndConquer = {
  slug: "divide-and-conquer",
  title: "Divide & conquer",
  category: "algorithms",
  summary: "Split into independent subproblems, solve recursively, combine — merge sort is the archetype.",
  tags: ["divide-and-conquer"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Divide and conquer splits a problem into independent subproblems, solves each recursively, and " +
          "*combines* their results — merge sort, quicksort, and binary search are the archetypes. The running " +
          "time follows from the recurrence (formalized by the Master Theorem).",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for it when a problem splits cleanly into similar, independent halves whose answers combine " +
          "cheaply. If the subproblems *overlap* instead of being independent, that's dynamic programming, not " +
          "divide and conquer.",
      },
    ],
  },
} satisfies LearnTopic;
