import type { LearnTopic, TreeNodeSpec, TreeWalkthroughFrame } from "@/learn/data/topic";

/** fib(4)'s naive call tree — explicitly typed so each frame's partial `badges` checks independently. */
const FIB_CALL_TREE: TreeNodeSpec[] = [
  { id: "n4", val: "fib(4)", left: "n3", right: "n2top" },
  { id: "n3", val: "fib(3)", left: "n2sub", right: "n1a" },
  { id: "n2top", val: "fib(2)", left: "n1b", right: "n0a" },
  { id: "n2sub", val: "fib(2)", left: "n1c", right: "n0b" },
  { id: "n1a", val: "fib(1)" },
  { id: "n1b", val: "fib(1)" },
  { id: "n0a", val: "fib(0)" },
  { id: "n1c", val: "fib(1)" },
  { id: "n0b", val: "fib(0)" },
];

const FIB_CALL_FRAMES: TreeWalkthroughFrame[] = [
  {
    active: ["n4", "n3"],
    action: "call fib(4) → call fib(3)",
    caption: "fib(4) recurses into its left child, fib(3), first.",
  },
  {
    active: ["n3", "n2sub"],
    action: "call fib(3) → call fib(2)",
    caption: "fib(3) recurses into fib(2) — a fresh call, unrelated so far to anything fib(4) will call directly.",
  },
  {
    active: ["n2sub", "n1c", "n0b"],
    badges: { n1c: "1", n0b: "0" },
    action: "fib(1)=1, fib(0)=0",
    caption: "fib(2)'s two children are both base cases and resolve immediately.",
  },
  {
    active: ["n2sub"],
    marked: ["n1c", "n0b"],
    badges: { n1c: "1", n0b: "0", n2sub: "1" },
    action: "fib(2) = 1",
    caption: "fib(2) returns 1 + 0 = 1, and both its children are done.",
  },
  {
    active: ["n3"],
    marked: ["n1c", "n0b", "n2sub"],
    badges: { n1c: "1", n0b: "0", n2sub: "1", n1a: "1", n3: "2" },
    action: "fib(1)=1 (base) → fib(3) = 2",
    caption: "fib(3)'s other child, fib(1), is a base case. fib(3) = 1 + 1 = 2. Back up to fib(4)'s right branch.",
  },
  {
    active: ["n4", "n2top", "n1b", "n0a"],
    marked: ["n3", "n2sub", "n1c", "n0b"],
    badges: { n1c: "1", n0b: "0", n2sub: "1", n1a: "1", n3: "2", n1b: "1", n0a: "0" },
    action: "call fib(2) again → fib(1)=1, fib(0)=0",
    caption: "fib(4)'s right branch now calls fib(2) again — same shape as the fib(2) three steps ago, recomputed from scratch.",
  },
  {
    active: ["n2top"],
    marked: ["n3", "n2sub", "n1c", "n0b", "n1b", "n0a"],
    badges: { n1c: "1", n0b: "0", n2sub: "1", n1a: "1", n3: "2", n1b: "1", n0a: "0", n2top: "1" },
    action: "fib(2) = 1 (recomputed)",
    caption: "This fib(2) also returns 1 — identical result to the one computed a moment ago, entirely wasted.",
  },
  {
    active: ["n4"],
    marked: ["n3", "n2top", "n2sub", "n1c", "n0b", "n1b", "n0a"],
    badges: { n1c: "1", n0b: "0", n2sub: "1", n1a: "1", n3: "2", n1b: "1", n0a: "0", n2top: "1", n4: "3" },
    action: "fib(4) = 3",
    caption: "fib(4) = fib(3) + fib(2) = 2 + 1 = 3. Nine calls total — and the fib(2) subtree was fully recomputed once.",
  },
];

export const recursion = {
  slug: "recursion",
  title: "Recursion",
  category: "algorithms",
  summary: "Solve a problem via smaller instances of itself — a base case stops it, the stack pays for it.",
  tags: ["recursion"],
  priority: "high",
  estimatedMinutes: 60,
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
          "enough to overflow. Before writing the recursive case, name the base case and the exact way each call " +
          "shrinks toward it — most recursion bugs are a missing or wrong base case, not the recursive logic itself.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Base case + recursive case** — every recursive function needs an unconditional stopping point (the " +
          "base case) and a step that provably shrinks toward it (the recursive case). Skip either and you get " +
          "infinite recursion or a stack overflow.\n\n" +
          "**Tail vs. non-tail recursion** — in `return f(n - 1)`, nothing happens after the recursive call returns " +
          "(*tail* position); JavaScript doesn't optimize this away, but it's the shape that converts cleanly to a " +
          "loop. In `return n + f(n - 1)`, work happens *after* the call returns (*non-tail*) — the frame has to " +
          "stay alive to finish that work, which is why post-order tree logic and 'combine the results' problems " +
          "can't just become a while loop.\n\n" +
          "**Memoization** — cache a call's result by its arguments so an overlapping subproblem is computed once, " +
          "not once per call site. This is the bridge from plain recursion to dynamic programming: a memoized " +
          "recursive function *is* top-down DP.\n\n" +
          "**Recursion → iteration** — swap the call stack for an explicit array-based stack when depth could " +
          "exceed the runtime's limit (a skewed tree, a long chain). The control flow inverts — push/pop instead " +
          "of call/return — but the traversal order stays identical.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Where recursion shows up",
        body:
          "[[backtracking]] is recursion with undo — it explores a decision tree and reverses a choice on the way " +
          "back up. [[divide-and-conquer]] is recursion whose subproblems are *independent* and get combined; when " +
          "they instead *overlap*, memoizing the recursion is the on-ramp to [[dynamic-programming]]. And every " +
          "[[trees]] traversal is recursion on a self-similar structure by definition — a tree *is* a node plus " +
          "two smaller trees.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The shape every recursive function shares: a base case, a recursive case, and an optional memo.",
        source:
          "function solve(input, memo = new Map()) {\n" +
          "  if (isBaseCase(input)) return baseAnswer(input);      // unconditional stopping point\n" +
          "  const key = cacheKey(input);\n" +
          "  if (memo.has(key)) return memo.get(key);              // skip a subproblem already solved\n\n" +
          "  const result = combine(\n" +
          "    solve(shrink(input), memo),                         // provably closer to the base case\n" +
          "  );\n" +
          "  memo.set(key, result);\n" +
          "  return result;\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Fibonacci** is the textbook case for *why* recursion needs memoization: `fib(n) = fib(n-1) + fib(n-2)` " +
          "is a clean base-case-plus-recursive-case definition, but naively evaluated it recomputes the same " +
          "smaller calls over and over. Watch the call tree for `fib(4)` — the two `fib(2)` subtrees are " +
          "*identical*, computed from scratch twice:",
      },
      {
        kind: "treeWalkthrough",
        heading: "fib(4)'s call tree — naive recursion, no memoization",
        nodes: FIB_CALL_TREE,
        frames: FIB_CALL_FRAMES,
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Memoizing collapses the duplicate fib(2) subtree from the walkthrough into a single cached lookup.",
        source:
          "function fib(n, memo = new Map()) {\n" +
          "  if (n <= 1) return n;                     // base case\n" +
          "  if (memo.has(n)) return memo.get(n);      // already solved this exact call — skip it entirely\n" +
          "  const result = fib(n - 1, memo) + fib(n - 2, memo);\n" +
          "  memo.set(n, result);\n" +
          "  return result;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Naive recursion here is **O(2ⁿ)** time (every call branches in two) with **O(n)** space for the deepest " +
          "call stack. Memoizing collapses it to **O(n)** time and space — each of the n distinct subproblems is " +
          "computed exactly once. This *is* dynamic programming's core idea: recursion plus a memo, applied at scale.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "A missing or wrong base case is the most common bug — infinite recursion (stack overflow) or an off-by-one that returns one call too early or late.",
          "Recomputing overlapping subproblems (naive Fibonacci, naive subset-sum) is silently exponential — if the same arguments keep recurring, memoize before optimizing anything else.",
          "Mutating a shared object (an array or set passed by reference) across sibling calls without undoing the change leaks state between branches — see backtracking's 'undo the choice' discipline.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "n = 0 or the smallest valid input — confirm the base case actually fires and doesn't recurse one step further than it should.",
          "Invalid input that would never naturally reach the base case (negative n, a malformed structure) — guard for it explicitly rather than trusting the recursion to terminate.",
          "A recursion depth close to the runtime's call-stack limit (a deeply skewed tree, a long chain) — this is when to convert to an explicit stack.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["reverse-linked-list", "josephus-problem"],
        recommended: ["swap-nodes-in-pairs", "merge-two-sorted-lists", "powx-n"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Recursion & backtracking practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Algorithms cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
