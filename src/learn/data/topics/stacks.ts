import type { LearnTopic } from "@/learn/data/topic";

export const stacks = {
  slug: "stacks",
  title: "Stacks",
  category: "data-structures",
  summary: "Last-in, first-out — push/pop/peek at one end in O(1). The tool for nesting, undo, and monotonic scans.",
  tags: ["stack"],
  priority: "high",
  estimatedMinutes: 60,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A stack is a **LIFO** (last-in, first-out) collection: you `push` onto the top and `pop` from the " +
          "top, and `peek` at the top without removing it. Only the top is reachable — and that single " +
          "constraint is exactly what makes it the right tool for *nested* and *reverse-order* problems.\n\n" +
          "Every core operation is **O(1)**. In JavaScript a plain array already *is* a stack: `push` and `pop` " +
          "act on the end in amortized constant time, and `arr.at(-1)` peeks. You almost never implement one " +
          "from scratch — you recognize the *shape* of a problem and reach for the array.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "push", average: "amortized O(1)", worst: "O(n)", note: "JS: array.push; worst case is an internal regrow" },
          { operation: "pop", average: "O(1)", worst: "O(1)" },
          { operation: "peek (top)", average: "O(1)", worst: "O(1)", note: "arr.at(-1) — no removal" },
          { operation: "search", average: "O(n)", worst: "O(n)", note: "only the top is directly reachable" },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a stack when **the most recent thing is what you handle next**. The recognition cues: " +
          "*matching* or *nesting* (brackets, tags, expressions), *undo / backtracking* (the call stack itself " +
          "is a stack), and — the one people miss — *“for each element, the nearest larger/smaller one to its " +
          "left or right.”* That last family is the **monotonic stack**, where the stack holds elements still " +
          "waiting for their answer and a new element resolves all the smaller ones it dominates in one sweep.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Matching / nesting stack** — push openers; each closer must pair with the element on top. The stack " +
          "captures *which context you're inside*, and emptiness at the end means everything closed " +
          "(*valid parentheses*, *simplify path*).\n\n" +
          "**Evaluation stack** — push operands; an operator pops its operands, computes, and pushes the result. " +
          "Postfix needs no parentheses because order *is* the grouping (*evaluate reverse Polish notation*).\n\n" +
          "**Monotonic stack** — keep the stack's values strictly increasing (or decreasing). Before pushing a " +
          "new value, pop everything it violates; each pop is the moment a waiting element finds its " +
          "next-greater (or next-smaller) neighbour. Turns an O(n²) “look ahead for each element” into a single " +
          "O(n) pass (*next larger element*, *largest rectangle in histogram*, *daily temperatures*).\n\n" +
          "**Monotonic deque** — a double-ended variant for sliding-window extrema: push at the back, evict " +
          "dominated values, and drop the front when it slides out of the window so the front is always the " +
          "window's max/min (*sliding window maximum*).\n\n" +
          "**Two stacks** — combine two LIFOs to fake another structure: an *in* and an *out* stack reverse " +
          "order once to give a FIFO queue (*implement queue using stacks*); a second stack tracking running " +
          "extrema gives an O(1) `getMin`.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Stack vs queue",
        body:
          "A stack is LIFO; a [[queue]] is FIFO (first-in, first-out). They're duals — and you can build either " +
          "from the other (*implement queue using stacks* does exactly that). In JavaScript an array is a " +
          "ready-made *stack* (`push` + `pop`, both O(1)); the trap is using it as a *queue*, because `shift` " +
          "from the front is O(n). For a real queue reach for two stacks or a deque with head/tail indices.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "A JS array is a ready-made stack — push and pop operate on the end.",
        source:
          "const stack = [];\n" +
          "stack.push(1);            // [1]\n" +
          "stack.push(2);            // [1, 2]\n" +
          "const top = stack.at(-1); // peek -> 2 (no removal)\n" +
          "stack.pop();              // [1], returns 2\n" +
          "const isEmpty = stack.length === 0;",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Next larger element** — for each value, find the first value to its *right* that is strictly " +
          "greater, or `-1` if none. The brute force re-scans the suffix for every element: O(n²). A " +
          "**monotonic stack** does it in one pass.\n\n" +
          "Keep a stack of *indices* whose values are still waiting for a larger neighbour, decreasing down the " +
          "stack. Each new value resolves — and pops — every waiting value it exceeds. Whatever is left on the " +
          "stack at the end never found anything larger.",
      },
      {
        kind: "walkthrough",
        heading: "nums = [3, 1, 4, 2], next larger to the right",
        lane: [3, 1, 4, 2],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "i", at: 0 }],
            action: "stack empty → push 0",
            caption: "Index 0 (value 3) has no one to compare against yet. Stack of waiting indices: [0].",
          },
          {
            pointers: [{ name: "i", at: 1 }],
            action: "1 < 3 → push 1",
            caption: "Value 1 doesn't exceed the top (3), so it can't resolve it. Both wait. Stack: [0, 1].",
          },
          {
            pointers: [{ name: "i", at: 2 }],
            marked: [0, 1],
            action: "4 > 1 and 4 > 3 → pop both, answer[1]=4, answer[0]=4",
            caption: "Value 4 exceeds the waiting 1 then the waiting 3, resolving both at once. Push 2. Stack: [2].",
          },
          {
            pointers: [{ name: "i", at: 3 }],
            action: "2 < 4 → push 3",
            caption: "Value 2 can't resolve the waiting 4, so it joins the queue. Stack: [2, 3].",
          },
          {
            marked: [0, 1],
            action: "scan ends → indices 2, 3 stay -1",
            caption: "Values 4 and 2 never met anything larger to their right. answer = [4, 4, -1, -1].",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Each index is pushed once and popped at most once, so the whole scan is O(n).",
        source:
          "function nextLargerToRight(nums) {\n" +
          "  const answer = new Array(nums.length).fill(-1);\n" +
          "  const stack = []; // indices still waiting for a larger value\n" +
          "  for (let i = 0; i < nums.length; i++) {\n" +
          "    while (stack.length && nums[i] > nums[stack.at(-1)]) {\n" +
          "      answer[stack.pop()] = nums[i]; // current value is their next-larger\n" +
          "    }\n" +
          "    stack.push(i);\n" +
          "  }\n" +
          "  return answer;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "The inner `while` looks like a nested loop, but each index enters and leaves the stack exactly once " +
          "across the whole run — so the total work is **O(n)** time, **O(n)** space. That amortized argument is " +
          "the heart of every monotonic-stack solution.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Popping an empty stack — guard with `stack.length` first; `[].pop()` is `undefined`, and comparing it can silently pass a check it should fail.",
          "Using an array as a *queue*: `arr.shift()` is O(n), so a loop of shifts is secretly O(n²). Use two stacks or head/tail indices.",
          "Storing values when you need *indices* (or vice-versa). Monotonic-stack width/distance problems need indices to compute spans; matching problems usually want the value.",
          "Forgetting to flush the stack after the loop — leftover openers mean *unbalanced*, and leftover monotonic-stack entries still need their default (`-1`) answer.",
          "On a monotonic stack, picking the wrong strictness (`>` vs `>=`) — it decides whether equal neighbours pop each other, which flips answers on ties.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty input — return the empty result before the loop body matters.",
          "Single element — nothing to match or compare against; the lone element is its own answer or stays at the default.",
          "All-equal values — exercises the `>` vs `>=` choice on a monotonic stack.",
          "Strictly increasing vs strictly decreasing input — one extreme pops on every step, the other never pops until the end.",
          "An unmatched closer with an empty stack (matching problems) — must fail rather than throw.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["valid-parentheses", "next-larger-element"],
        recommended: [
          "evaluate-reverse-polish-notation",
          "remove-all-adjacent-duplicates-in-string",
          "implement-queue-using-stacks",
          "sliding-window-maximum",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Stack practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Stack cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/stack/", type: "article" },
          { label: "MDN — Array.prototype.push / pop", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push", type: "doc" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
