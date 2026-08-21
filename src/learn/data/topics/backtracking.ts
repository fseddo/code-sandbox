import type { LearnTopic } from "@/learn/data/topic";

export const backtracking = {
  slug: "backtracking",
  title: "Backtracking",
  category: "algorithms",
  summary: "DFS over the decision tree — build a candidate one choice at a time, and undo the moment it can't work.",
  tags: ["backtracking", "recursion", "depth-first-search"],
  priority: "high",
  estimatedMinutes: 90,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Backtracking builds a solution incrementally, one choice at a time, and *backtracks* — undoes the last " +
          "choice — the moment a partial candidate can't possibly lead to a valid one. It's a **depth-first search " +
          "over an implicit tree of decisions**: each node is a partial candidate, each edge is one choice, and each " +
          "leaf is either a complete answer or a dead end.\n\n" +
          "The shape is always the same three moves: **choose** (extend the candidate with one option), **explore** " +
          "(recurse on the extended candidate), **unchoose** (undo the choice before trying the next option, so " +
          "sibling branches start from clean state). Because every option at every depth is tried, the raw search " +
          "tree is exponential — the whole game is *pruning* branches early, the moment a partial candidate provably " +
          "can't be completed, so the search never wastes time finishing a doomed path.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for backtracking when a prompt asks for **all** ways to do something — all permutations, all " +
          "subsets, all combinations reaching a target, all valid boards — under some constraint, and there's no " +
          "greedy or DP shortcut because you genuinely need to enumerate. Tell-tales: *\"return all…\"*, *\"generate " +
          "every…\"*, *\"find all valid arrangements\"*, or a constraint-satisfaction puzzle (N-Queens, Sudoku, word " +
          "search) where a placement can be checked incrementally.\n\n" +
          "It's the wrong tool when the prompt wants a *single* optimal count or value and the subproblems overlap — " +
          "that's [dynamic programming](/study-guide/algos/topic/dynamic-programming) territory (backtracking " +
          "*without* memoization re-explores the same partial state many times; add memoization and you've turned it " +
          "into top-down DP).",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Choose–explore–unchoose** — the base template every variant below specializes: push a choice onto the " +
          "path, recurse, pop it back off. Getting the *unchoose* step right (restoring shared state exactly) is the " +
          "one line that separates a working backtracker from a silently corrupted one.\n\n" +
          "**Include/exclude (subset generation)** — at each element, branch two ways: take it or skip it. `n` " +
          "binary decisions build all `2ⁿ` subsets (*subsets*).\n\n" +
          "**Used-flag or swap-based permutation generation** — at each position, try every element not yet placed " +
          "(a `used` array), or swap candidates into place and swap back. `n` positions with shrinking choices build " +
          "all `n!` orderings (*permutations*).\n\n" +
          "**Combination with reuse and pruning** — walk candidates from a fixed start index so combinations never " +
          "repeat as a reordering; sort first so a running sum that exceeds the target lets you `break` out of the " +
          "whole remaining loop instead of trying every larger candidate (*combination sum*).\n\n" +
          "**Constraint-satisfaction placement** — place one piece per row/position and track *why a cell is unsafe* " +
          "in O(1)-lookup sets (columns, diagonals) so each placement is checked without rescanning the board " +
          "(*N-Queens*, Sudoku).\n\n" +
          "**Character-by-character construction** — build a string one position at a time from a small alphabet " +
          "per position, the same include/exclude shape specialized to strings (*letter combinations of a phone " +
          "number*). Steering the same recursion with a [trie](/study-guide/algos/topic/tries) prunes whole prefixes " +
          "at once when the candidates are drawn from a fixed dictionary (*word search II*).",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "Backtracking *is* [depth-first search](/study-guide/algos/topic/graphs) — the decision tree is an " +
          "implicit graph, and \"unchoose\" is just the graph DFS's implicit unwind made explicit because the " +
          "\"visited\" state here is a *mutable path*, not a fixed set of nodes. Add a memo table keyed by the " +
          "partial state and the exact same recursion becomes top-down " +
          "[dynamic programming](/study-guide/algos/topic/dynamic-programming) — backtracking explores a tree, DP " +
          "collapses it into a DAG by reusing identical subproblems. A [trie](/study-guide/algos/topic/tries) often " +
          "steers a backtracking search over strings, pruning every branch that shares a dead prefix at once instead " +
          "of one candidate at a time.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The choose–explore–unchoose template every variant specializes.",
        source:
          "function backtrack(path, state) {\n" +
          "  if (isComplete(path, state)) {\n" +
          "    record(path);          // save a copy — never the live, still-mutating array\n" +
          "    return;                // (or `return true` if only one answer is needed)\n" +
          "  }\n" +
          "  for (const choice of choicesFrom(state)) {\n" +
          "    if (!isSafe(choice, path, state)) continue;  // prune — skip doomed branches early\n" +
          "    apply(choice, path, state);                  // choose\n" +
          "    backtrack(path, state);                      // explore\n" +
          "    undo(choice, path, state);                   // unchoose — restore state for the next option\n" +
          "  }\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Generate every subset** — the cleanest illustration of choose–explore–unchoose: at each element there " +
          "are exactly two choices, *include it* or *skip it*, so the search is a perfect binary decision tree of " +
          "depth `n`. Take `[10, 20, 30]`. Depth-first, the search tries *include* at every level first, records the " +
          "full subset at the bottom, then unwinds one level at a time to try *skip* at each level in turn.",
      },
      {
        kind: "walkthrough",
        heading: "nums = [10, 20, 30] — decision tree of include/skip choices",
        lane: [10, 20, 30],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "i", at: 0 }],
            action: "path=[]; include 10",
            caption: "Start at index 0 with an empty path. Try the *include* branch first: choose 10.",
          },
          {
            pointers: [{ name: "i", at: 1 }],
            marked: [0],
            action: "path=[10]; include 20",
            caption: "One level deeper. `marked` here means \"already chosen\", not \"discarded\" — 10 is locked into the path.",
          },
          {
            pointers: [{ name: "i", at: 2 }],
            marked: [0, 1],
            action: "path=[10,20]; include 30 → record [10,20,30]",
            caption: "All three included — a leaf. Record a *copy* of the path: [10, 20, 30].",
          },
          {
            pointers: [{ name: "i", at: 2 }],
            marked: [0, 1],
            action: "unchoose 30; skip 30 → record [10,20]",
            caption: "Backtrack: pop 30 back off, then take the *skip* branch at the same depth. That's also a complete subset — record [10, 20].",
          },
          {
            pointers: [{ name: "i", at: 1 }],
            marked: [0],
            action: "unchoose 20; skip 20 → explore",
            caption: "Unwind one more level, pop 20, and take *skip* at index 1. The subtree under \"20 excluded\" still needs exploring for 30.",
          },
          {
            pointers: [{ name: "i", at: 0 }],
            marked: [],
            action: "unchoose 10; skip 10 → explore mirrored right subtree",
            caption: "Finally pop 10 and take *skip* at the root. The mirrored right subtree (10 excluded) produces the remaining subsets the same way — after the full traversal, all 2³ = 8 subsets have been recorded.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Include/exclude at every index — O(2ⁿ) leaves, each an O(n) copy.",
        source:
          "function subsets(nums) {\n" +
          "  const result = [];\n" +
          "  const path = [];\n" +
          "  const backtrack = (i) => {\n" +
          "    if (i === nums.length) {\n" +
          "      result.push([...path]);   // copy — path keeps mutating after this\n" +
          "      return;\n" +
          "    }\n" +
          "    path.push(nums[i]);         // choose: include nums[i]\n" +
          "    backtrack(i + 1);\n" +
          "    path.pop();                 // unchoose\n" +
          "    backtrack(i + 1);           // choose: skip nums[i] (no push at all)\n" +
          "  };\n" +
          "  backtrack(0);\n" +
          "  return result;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Every one of the `2ⁿ` root-to-leaf paths is visited once, and each leaf costs `O(n)` to copy into the " +
          "result, so the whole search is **O(n · 2ⁿ)** time and **O(n)** extra recursion depth beyond the output.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Forgetting to unchoose.** Skip the `pop()` / flag-reset after the recursive call and state leaks into sibling branches — later paths get built on stale data from a branch that already finished.",
          "**Recording a reference instead of a copy.** `result.push(path)` stores the *live* array; once backtracking mutates it further, every recorded answer silently points at the same final (usually empty) array. Always `result.push([...path])`.",
          "**No pruning at all.** A correct-but-unpruned search still visits every node of the full tree — check `isSafe` (running sum vs. target, column/diagonal conflicts) *before* recursing, not after, or the search does the doomed work anyway.",
          "**Missing the duplicate-skip rule.** When input has repeats but the output must not (`combination sum II`-style), sort first and skip a candidate equal to the previous one *at the same recursion depth* — skipping unconditionally also throws away valid reuses at a deeper level.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty input (`n = 0`) — subsets should still return `[[]]` (one empty subset); permutations of `[]` return `[[]]` too, not `[]`.",
          "A single element — the smallest real branch: exactly one leaf for permutations, two for subsets (include/skip).",
          "No valid combination reaches the target — return `[]`, not `null` or a thrown error.",
          "A target of exactly 0 in a sum-based problem — decide up front whether the *empty* combination counts as a valid answer.",
          "A puzzle with zero solutions (N-Queens at `n = 2` or `n = 3`) — the search must terminate having *tried* every branch and pruned all of them, returning an empty result rather than hanging.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["subsets", "permutations"],
        recommended: ["combination-sum", "letter-combinations-of-a-phone-number", "n-queens"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Backtracking practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Algorithms cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", type: "article" },
          { label: "Wikipedia — Backtracking", url: "https://en.wikipedia.org/wiki/Backtracking", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
