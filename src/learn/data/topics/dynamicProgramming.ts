import type { LearnTopic } from "@/learn/data/topic";

export const dynamicProgramming = {
  slug: "dynamic-programming",
  title: "Dynamic programming",
  category: "algorithms",
  summary: "Cache overlapping subproblems — top-down memoization or a bottom-up table.",
  tags: ["dynamic-programming", "memoization", "recursion"],
  priority: "high",
  estimatedMinutes: 120,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Dynamic programming solves problems with *overlapping subproblems* and *optimal substructure* by " +
          "storing each subproblem's answer instead of recomputing it — either top-down (recursion + a memo) or " +
          "bottom-up (filling a table in dependency order). It trades memory for a large drop in time, often from " +
          "exponential to polynomial.\n\n" +
          "**Overlapping subproblems** means the naive recursion calls the same `(state)` more than once — climbing " +
          "stairs' `ways(n)` and `ways(n-1)` both call `ways(n-2)`. **Optimal substructure** means the best answer " +
          "for a state is built purely from the best answers to smaller states — no need to keep a losing choice " +
          "around \"just in case\" it helps later. Both must hold, or memoizing just adds bookkeeping to a recursion " +
          "that was never going to repeat work anyway.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for DP when a problem asks for an optimum or a count over a sequence of choices, and a brute-force " +
          "recursion would revisit the same states — climbing stairs, coin change, edit distance, knapsack, longest " +
          "common subsequence. Tell-tale phrasing: *\"minimum number of ways to…\"*, *\"maximum value/length such " +
          "that…\"*, *\"number of distinct ways to reach…\"*.\n\n" +
          "The hard part is defining the **state** (what varies between subproblems) and the **transition** (how a " +
          "state's answer is built from smaller states' answers) — not the caching mechanism itself. Start from the " +
          "brute-force recursion: if writing it naturally produces a function of a few small integers (an index, a " +
          "remaining capacity, a pair of indices) called repeatedly with the same arguments, that function *is* the " +
          "state, and memoizing it *is* the DP.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Top-down memoization** — write the brute-force recursion first, then wrap it: before computing, check " +
          "a cache keyed by the state; after computing, store the answer before returning. Only the states actually " +
          "reached get computed, which can beat bottom-up when much of the table is unreachable.\n\n" +
          "**Bottom-up tabulation** — invert the recursion into a loop: seed the base cases, then fill every state " +
          "in an order that guarantees its dependencies are already filled. No recursion overhead, and the fill " +
          "order often reveals a **space optimization** — if `dp[i]` only ever reads `dp[i-1]` and `dp[i-2]`, the " +
          "whole table collapses to two rolling variables.\n\n" +
          "**1-D state (linear DP)** — the state is one index into a sequence (*climbing stairs*, *house robber*, " +
          "*coin change*, *maximum subarray*). The transition looks a fixed number of steps back, so the table is " +
          "usually O(1)-space-optimizable.\n\n" +
          "**2-D state over one sequence (interval DP)** — the state is a range `[i, j]` inside a single sequence " +
          "(*longest palindromic substring*). Filled by increasing range length, since a range's answer depends on " +
          "strictly shorter ranges inside it.\n\n" +
          "**2-D state over two sequences (alignment DP)** — the state is a pair of indices `(i, j)`, one into each " +
          "of two sequences (*longest common subsequence*, *edit distance*). The table is `|s1| × |s2|`, filled so " +
          "that `dp[i][j]` only ever reads cells with a smaller `i` or `j`.\n\n" +
          "**2-D DP over a grid** — the state is a cell `(row, col)`; the transition pulls from neighbors already " +
          "computed, usually the cell(s) above and to the left (*unique paths*, *maximal square*).\n\n" +
          "**0/1 knapsack (subset-choice DP)** — the state is `(item index, remaining capacity)`; each item is " +
          "usable at most once. The fill *order* is load-bearing here: tabulating capacity forward while iterating " +
          "items lets an item be reused (that's the *unbounded* variant, e.g. coin change's unlimited coins); " +
          "0/1 knapsack needs each item's own row (or a capacity pass in *reverse*) so a choice can't be counted " +
          "twice.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Relation to backtracking and greedy",
        body:
          "DP and [[backtracking]] explore the *same* recursion tree — backtracking's choose/explore/unchoose is " +
          "the brute-force search; add a memo keyed by state and identical calls collapse into one, turning an " +
          "exponential tree into a polynomial DAG. The tell is whether sibling branches ever recompute the same " +
          "sub-question: if they do, that recursion is a DP problem wearing a backtracking costume.\n\n" +
          "[[greedy]] is DP's cheaper cousin: it also builds an answer from smaller choices, but *commits* to the " +
          "locally-best choice at each step instead of keeping every choice's subproblem answer around. That's " +
          "only correct when the greedy-choice property provably holds — otherwise an early locally-best pick can " +
          "block the true optimum, and only DP's \"consider every choice, keep the best\" is safe.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "Top-down memoization: the brute-force recursion, wrapped with a cache.",
        source:
          "function solve(state, memo = new Map()) {\n" +
          "  const key = stateKey(state);          // collapse the state to a cacheable key\n" +
          "  if (memo.has(key)) return memo.get(key);   // already solved this exact subproblem\n" +
          "  if (isBaseCase(state)) return baseValue(state);\n" +
          "\n" +
          "  let best = identityValue;               // -Infinity for max, +Infinity for min, 0 for count, …\n" +
          "  for (const choice of choicesFrom(state)) {\n" +
          "    const candidate = combine(choice, solve(nextState(state, choice), memo));\n" +
          "    best = better(best, candidate);\n" +
          "  }\n" +
          "  memo.set(key, best);                    // store before returning — this is the whole optimization\n" +
          "  return best;\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Climbing stairs** — the cleanest illustration of overlapping subproblems: you can climb 1 or 2 steps " +
          "at a time, and the question is how many distinct ways there are to reach the top of an `n`-step " +
          "staircase. The last move into stair `i` was either a 1-step from stair `i-1` or a 2-step from stair " +
          "`i-2`, so `ways(i) = ways(i-1) + ways(i-2)` — every way to reach `i-1` or `i-2` extends into a way to " +
          "reach `i`, and neither needs to be recomputed once known. Take `n = 6`.",
      },
      {
        kind: "walkthrough",
        heading: "dp[i] = ways to reach stair i, for i = 0..6 (n = 6)",
        lane: [1, 1, 2, 3, 5, 8, 13],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "i", at: 0 }],
            action: "dp[0] = 1",
            caption: "Base case: there's exactly one way to be at the ground — take zero steps.",
          },
          {
            pointers: [{ name: "i", at: 1 }],
            marked: [0],
            action: "dp[1] = 1",
            caption: "Base case: exactly one way to reach stair 1 — a single 1-step. `marked` here means \"already filled\", not \"discarded\" — dp[0] stays available to read.",
          },
          {
            pointers: [{ name: "i", at: 2 }],
            marked: [0, 1],
            action: "dp[2] = dp[1] + dp[0] = 1 + 1 = 2",
            caption: "The first real transition: reach stair 2 either via a last 1-step from stair 1, or a last 2-step from stair 0. Sum the ways already sitting in the table — no re-deriving them.",
          },
          {
            pointers: [{ name: "i", at: 3 }],
            marked: [0, 1, 2],
            action: "dp[3] = dp[2] + dp[1] = 2 + 1 = 3",
            caption: "Same recurrence, one step further — dp[2] and dp[1] are both already computed.",
          },
          {
            pointers: [{ name: "i", at: 4 }],
            marked: [0, 1, 2, 3],
            action: "dp[4] = dp[3] + dp[2] = 3 + 2 = 5",
            caption: "A naive recursion would call ways(4) again from inside both ways(5) and ways(6)'s call trees — the table computes it exactly once.",
          },
          {
            pointers: [{ name: "i", at: 6 }],
            marked: [0, 1, 2, 3, 4, 5],
            action: "dp[6] = dp[5] + dp[4] = 8 + 5 = 13",
            caption: "Skipping ahead to the answer: dp[5] = 8 was filled the same way, and dp[6] just reuses both of its already-solved neighbors. 13 distinct ways to climb 6 stairs.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Bottom-up, space-optimized to two rolling variables — O(n) time, O(1) space.",
        source:
          "function climbStairs(n) {\n" +
          "  if (n <= 1) return 1;             // base cases: 0 or 1 step needs exactly one \"way\"\n" +
          "  let prev2 = 1;                    // dp[i-2]\n" +
          "  let prev1 = 1;                    // dp[i-1]\n" +
          "  for (let i = 2; i <= n; i++) {\n" +
          "    const curr = prev1 + prev2;     // dp[i] = dp[i-1] + dp[i-2]\n" +
          "    prev2 = prev1;\n" +
          "    prev1 = curr;\n" +
          "  }\n" +
          "  return prev1;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Each of the `n` states is computed exactly once from O(1) prior states, so the whole fill is **O(n) " +
          "time**. Because `dp[i]` only ever needs `dp[i-1]` and `dp[i-2]`, the full table is never needed at once — " +
          "**O(1) space** once rolled into two variables.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Skipping the recursion.** Writing the DP table directly, without first writing (even mentally) the " +
          "brute-force recursion it replaces, produces a transition you can't justify — and can't debug when it's " +
          "wrong. Derive the recurrence first; the table is just that recurrence with caching.",
          "**Wrong fill order.** Bottom-up tabulation reads `dp[j]` before it's written whenever the loop visits " +
          "states out of dependency order — interval DP by increasing length, alignment DP by increasing index, " +
          "0/1 knapsack's capacity pass in reverse (so an item can't be counted twice). Getting this backward reads " +
          "a stale (usually zero) value instead of erroring, so the bug hides in a wrong answer, not a crash.",
          "**Memoizing on an incomplete state.** If the answer to a subproblem actually depends on something not in " +
          "the memo key (e.g. whether an item was already used on this path), the cache serves a stale answer from " +
          "a different context. The state must capture *everything* the transition reads.",
          "**Forgetting the reconstruction step.** A DP table gives the optimal *value* for free; if the prompt " +
          "also wants the actual sequence/subset that achieves it, that needs a second backward pass (or parent " +
          "pointers stored during the fill) — the value alone doesn't hand it to you.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty input / `n = 0` — usually *is* a base case; make sure it returns the identity answer (0 ways, or " +
          "an empty result) rather than falling through to an out-of-bounds table read.",
          "A target/capacity/amount of exactly 0 — decide up front whether the empty choice counts as a valid " +
          "answer (often yes for \"number of ways\", and it's the base case for \"minimum coins\").",
          "No combination reaches the target — return the problem's specified sentinel (`-1`, `false`, `0`) rather " +
          "than `undefined`/`NaN` leaking out of an unfilled table cell.",
          "All elements identical or all the same weight/value — a good self-check that the DP isn't silently " +
          "relying on distinctness to work.",
          "An input just past what naive recursion (no memo) can finish in time — the exact case the memo/table " +
          "exists to fix; if removing the cache still passes locally, the states probably weren't overlapping " +
          "enough to need DP in the first place.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["climbing-stairs", "coin-change"],
        recommended: [
          "house-robber",
          "maximum-subarray",
          "longest-palindromic-substring",
          "unique-paths",
          "longest-common-subsequence",
          "maximal-square",
          "knapsack",
          "edit-distance",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Dynamic Programming practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Algorithms cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", type: "article" },
          { label: "Wikipedia — Dynamic programming", url: "https://en.wikipedia.org/wiki/Dynamic_programming", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
