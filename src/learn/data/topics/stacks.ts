import type { LearnTopic } from "@/learn/data/topic";

export const stacks = {
  slug: "stacks",
  title: "Stacks",
  category: "data-structures",
  summary: "Last-in, first-out — push/pop/peek at one end in O(1). The tool for nesting and backtracking.",
  tags: ["stack"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A stack is a **LIFO** (last-in, first-out) collection: you `push` onto the top and `pop` from the " +
          "top, and can `peek` at the top without removing it. Only the top is reachable — that constraint is " +
          "exactly what makes it useful for *nested* and *reverse-order* problems.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "push", average: "amortized O(1)", worst: "O(n)", note: "JS: array.push" },
          { operation: "pop", average: "O(1)", worst: "O(1)" },
          { operation: "peek (top)", average: "O(1)", worst: "O(1)", note: "array[array.length - 1]" },
          { operation: "search", average: "O(n)", worst: "O(n)", note: "only the top is directly reachable" },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a stack when the most recent thing is what you handle next: matching nested brackets/tags, " +
          "undo history, expression evaluation, DFS and backtracking (the call stack *is* a stack), and " +
          "monotonic-stack problems like next-greater-element.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Stack vs queue",
        body:
          "A stack is LIFO; a queue is FIFO (first-in, first-out). In JavaScript a plain array *is* a " +
          "stack — `push` + `pop` are both O(1) at the end. Using an array as a queue is the trap: `shift` from " +
          "the front is O(n).",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "A JS array is a ready-made stack — push and pop operate on the end.",
        source:
          "const stack = [];\n" +
          "stack.push(1);          // [1]\n" +
          "stack.push(2);          // [1, 2]\n" +
          "const top = stack.at(-1); // peek → 2 (no removal)\n" +
          "stack.pop();            // [1], returns 2",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Valid Parentheses** — *does every bracket close in the right order?* Push each opener; on a closer, " +
          "the top of the stack must be its matching opener. A stack works because brackets nest — the most " +
          "recently opened must be the first to close.",
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Push openers; each closer must match the top. Empty at the end = balanced.",
        source:
          "function isValid(s) {\n" +
          "  const closerToOpener = { \")\": \"(\", \"]\": \"[\", \"}\": \"{\" };\n" +
          "  const stack = [];\n" +
          "  for (const ch of s) {\n" +
          "    if (ch in closerToOpener) {\n" +
          "      // closer: the top must be its matching opener, or it's invalid\n" +
          "      if (stack.pop() !== closerToOpener[ch]) return false;\n" +
          "    } else {\n" +
          "      stack.push(ch); // opener: remember it for its future closer\n" +
          "    }\n" +
          "  }\n" +
          "  return stack.length === 0; // leftover openers = unbalanced\n" +
          "}",
      },
      { kind: "exampleProblem", problemId: "valid-parentheses", note: "Now try it yourself." },
    ],
  },
} satisfies LearnTopic;
