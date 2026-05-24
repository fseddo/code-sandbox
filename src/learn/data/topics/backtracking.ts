import type { LearnTopic } from "@/learn/data/topic";

export const backtracking = {
  slug: "backtracking",
  title: "Backtracking",
  category: "algorithms",
  summary: "DFS over the decision tree — build a candidate, abandon it the moment it can't work.",
  tags: ["backtracking"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Backtracking builds a solution incrementally and *backtracks* — undoes the last choice — the moment a " +
          "partial candidate can't lead to a valid one. It's a depth-first search over the tree of decisions, " +
          "with pruning to skip whole branches that violate a constraint.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for it on combinatorial generation and constraint satisfaction — permutations, subsets, " +
          "combination sum, N-queens, sudoku, word search. The template is: choose, recurse, then *unchoose* " +
          "to restore state before trying the next option.",
      },
    ],
  },
} satisfies LearnTopic;
