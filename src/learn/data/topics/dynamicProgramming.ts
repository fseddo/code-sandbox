import type { LearnTopic } from "@/learn/data/topic";

export const dynamicProgramming = {
  slug: "dynamic-programming",
  title: "Dynamic programming",
  category: "algorithms",
  summary: "Cache overlapping subproblems — top-down memoization or a bottom-up table.",
  tags: ["dynamic-programming", "memoization"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Dynamic programming solves problems with *overlapping subproblems* and *optimal substructure* by " +
          "storing each subproblem's answer instead of recomputing it — either top-down (recursion + a memo) or " +
          "bottom-up (filling a table in dependency order). It trades memory for a large drop in time, often from " +
          "exponential to polynomial.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for DP when a problem asks for an optimum or a count over a sequence of choices and a brute-force " +
          "recursion revisits the same states — climbing stairs, coin change, edit distance, knapsack, longest " +
          "common subsequence. The hard part is defining the state and its transition; start from the recursion.",
      },
    ],
  },
} satisfies LearnTopic;
