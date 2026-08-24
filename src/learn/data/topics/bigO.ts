import type { LearnTopic } from "@/learn/data/topic";

export const bigO = {
  slug: "big-o",
  title: "Big-O & complexity",
  category: "complexity",
  summary: "How time and space scale with input size — the shared language for comparing approaches.",
  priority: "mid",
  estimatedMinutes: 20,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Big-O describes how an algorithm's time or space grows with the input size n, keeping only the dominant " +
          "term and dropping constants — O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ). It's an *upper bound* on " +
          "growth, and the shared language for comparing approaches before writing any code.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reason about complexity *first* in an interview: state the brute-force cost, then target a better " +
          "bound. Remember that sequential phases add while nested loops multiply, that recursion costs " +
          "O(states) with memoization, and to count *space* (including the call stack) as well as time. The " +
          "data-structure topics list the per-operation costs you'll combine.",
      },
    ],
  },
} satisfies LearnTopic;
