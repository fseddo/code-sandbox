import type { LearnTopic } from "@/learn/data/topic";

export const greedy = {
  slug: "greedy",
  title: "Greedy",
  category: "algorithms",
  summary: "Take the locally-best choice each step — fast and simple, but only correct when you can prove it.",
  tags: ["greedy"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A greedy algorithm makes the locally-optimal choice at each step and never reconsiders. It's fast and " +
          "simple, but only *correct* when the problem has the greedy-choice property and optimal substructure — " +
          "which must be argued (often via an exchange argument), not assumed.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for greedy on interval scheduling, jump games, and Huffman-style problems — usually after " +
          "sorting. When a greedy choice provably leads to a dead end, the fallback is dynamic programming, which " +
          "considers all choices.",
      },
    ],
  },
} satisfies LearnTopic;
