import type { LearnTopic } from "@/learn/data/topic";

export const recursion = {
  slug: "recursion",
  title: "Recursion",
  category: "algorithms",
  summary: "Solve a problem via smaller instances of itself — a base case stops it, the stack pays for it.",
  tags: ["recursion"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Recursion reduces a problem to smaller instances of itself, with a *base case* to stop. Each call adds " +
          "a frame to the call stack, so deep recursion risks a stack overflow, and overlapping subproblems " +
          "(recomputing the same inputs) signal that memoization or dynamic programming will help.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for recursion on self-similar structure — trees, divide-and-conquer, and backtracking's " +
          "'try every option' search. Convert to iteration (or an explicit stack) when the depth could be large " +
          "enough to overflow.",
      },
    ],
  },
} satisfies LearnTopic;
