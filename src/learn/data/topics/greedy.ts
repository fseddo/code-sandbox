import type { LearnTopic } from "@/learn/data/topic";

export const greedy = {
  slug: "greedy",
  title: "Greedy",
  category: "algorithms",
  summary: "Take the locally-best choice each step and never look back — fast and simple, but only correct when you can prove it.",
  tags: ["greedy"],
  priority: "high",
  estimatedMinutes: 75,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A greedy algorithm makes the *locally*-optimal choice at each step and commits to it permanently — no " +
          "backtracking, no reconsidering, no keeping a runner-up around \"just in case\". That's what makes it " +
          "fast: a single pass, O(1) extra state per step, none of dynamic programming's table of every " +
          "subproblem's answer.\n\n" +
          "It's also what makes it *risky*: a greedy algorithm is only correct when the problem actually has the " +
          "**greedy-choice property** (a locally-best choice is always part of *some* globally-optimal solution) " +
          "and **optimal substructure** (the best answer to the whole problem is built from the best answers to " +
          "what's left after that choice). Neither is something you get to assume — both need an argument, " +
          "usually an **exchange argument**: assume an optimal solution that *didn't* make the greedy choice, show " +
          "swapping it in doesn't make the solution any worse, and conclude the greedy choice was safe all along.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for greedy when a problem asks for a minimum/maximum/feasibility answer built from a *sequence* " +
          "of independent choices, and committing to the best-looking option at each step never has to be undone " +
          "later — interval scheduling, jump/reachability games, resource distribution under pairwise local " +
          "constraints, and single-pass feasibility over a circuit. Tell-tale phrasing: *\"minimum number of…\"*, " +
          "*\"can you reach…\"*, *\"the smallest number of X such that every Y is satisfied\"*.\n\n" +
          "It's the wrong tool the moment a locally-best choice can block a better global answer down the line — " +
          "that's exactly when the problem needs [[dynamic-programming]]'s \"consider every choice, keep the " +
          "best\" instead of greedy's \"commit and move on\". If you can't state the exchange argument in a " +
          "sentence, that's a sign the greedy-choice property might not actually hold.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Sort-then-sweep** — order the input by whatever key makes the greedy choice obvious (finish time, " +
          "start time, ratio), then make one linear pass committing to each element in that order. The " +
          "*[[intervals]]* chapter's merge/scheduling problems are this technique specialized to interval inputs.\n\n" +
          "**Greedy reachability (farthest-reach scan)** — track the farthest position reachable so far; scan " +
          "forward, and the moment the current index is beyond that frontier, the answer is \"stuck\" — otherwise " +
          "extend the frontier and keep going (*jump game*). No sorting needed; the \"choice\" at each index is " +
          "just whether it can still be reached.\n\n" +
          "**Circuit-reset greedy** — walk a circular sequence accumulating a running total; the moment the total " +
          "goes negative, none of the positions tried so far can be a valid start, so reset the candidate start " +
          "to the very next position and zero the running total (*gas station*). A global feasibility check " +
          "(total resources ≥ total cost) usually has to run alongside it, since the reset logic alone only finds " +
          "*where* a solution would start, not *whether* one exists.\n\n" +
          "**Two-pass local-constraint reconciliation** — when a constraint has to hold in *both* directions " +
          "(higher than the left neighbor *and* the right neighbor), one greedy pass can't see both sides at " +
          "once. Run it left-to-right to satisfy the left-hand constraint, then right-to-left to satisfy the " +
          "right-hand one, merging with a `max` so the second pass never undoes what the first already secured " +
          "(*candy*).",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Relation to dynamic programming and intervals",
        body:
          "[[dynamic-programming]] is greedy's more careful cousin: both build an answer out of a sequence of " +
          "choices, but DP keeps *every* choice's subproblem answer around and picks the best one at the end, " +
          "while greedy commits the instant a choice looks best. When the greedy-choice property genuinely holds, " +
          "DP's whole table collapses to the single running value greedy keeps — but when it doesn't, only DP's " +
          "\"keep everything, decide last\" is safe, and a greedy shortcut quietly returns a wrong answer instead " +
          "of erroring.\n\n" +
          "[[intervals]] is greedy's most common host: *merge overlapping intervals* and interval-scheduling " +
          "problems are the sort-then-sweep technique above, specialized to `[start, end]` pairs instead of plain " +
          "numbers.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The sort-then-sweep template most greedy problems specialize.",
        source:
          "function greedySweep(items) {\n" +
          "  // Sort by whatever key makes the locally-best choice obvious — finish time, ratio, value.\n" +
          "  items.sort((a, b) => key(a) - key(b));\n" +
          "\n" +
          "  let state = initialState();\n" +
          "  for (const item of items) {\n" +
          "    if (isFeasible(item, state)) {\n" +
          "      state = commit(item, state);   // lock it in — never reconsidered, never undone\n" +
          "    }\n" +
          "  }\n" +
          "  return state;\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Jump game reachability** — the cleanest illustration of a greedy choice needing no sorting at all: " +
          "each index just tracks the farthest position reachable *so far*, and the greedy choice — \"extend the " +
          "frontier as far as this index allows\" — is provably never wrong, because a farther frontier can only " +
          "help later indices, never hurt them. Take `nums = [2, 0, 2, 1, 4]`: from index 0 you can jump up to 2 " +
          "steps, and so on for each index.",
      },
      {
        kind: "walkthrough",
        heading: "nums = [2, 0, 2, 1, 4] — reach = farthest index reachable so far",
        lane: [2, 0, 2, 1, 4],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "i", at: 0 }],
            action: "reach = max(0, 0 + 2) = 2",
            caption: "From index 0's value of 2, the frontier extends to index 2.",
          },
          {
            pointers: [{ name: "i", at: 1 }],
            marked: [0],
            action: "reach = max(2, 1 + 0) = 2",
            caption: "Index 1's value is 0 — a dead end on its own — but the frontier already reached past it, so it costs nothing.",
          },
          {
            pointers: [{ name: "i", at: 2 }],
            marked: [0, 1],
            action: "reach = max(2, 2 + 2) = 4",
            caption: "Index 2 is still within the frontier (2 ≤ 2), and its value of 2 pushes the frontier all the way to the last index.",
          },
          {
            pointers: [{ name: "i", at: 3 }],
            marked: [0, 1, 2],
            action: "reach = max(4, 3 + 1) = 4",
            caption: "Index 3 doesn't extend the frontier further, but it was already reachable, so the scan just continues.",
          },
          {
            pointers: [{ name: "i", at: 4 }],
            marked: [0, 1, 2, 3],
            action: "reach = max(4, 4 + 4) = 8; scan ends",
            caption: "Index 4 — the last index — is within the frontier (4 ≤ 4), so it's reachable. The scan finishes without ever getting stuck: `true`.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Greedy farthest-reach scan — O(n) time, O(1) space.",
        source:
          "function canReachEnd(nums) {\n" +
          "  let reach = 0;                 // farthest index reachable so far\n" +
          "  for (let i = 0; i < nums.length; i++) {\n" +
          "    if (i > reach) return false; // this index is unreachable — stuck for good\n" +
          "    reach = Math.max(reach, i + nums[i]); // extend the frontier\n" +
          "  }\n" +
          "  return true;                   // scanned every index without getting stuck\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Each of the `n` indices is visited exactly once, and updating `reach` is O(1) work, so the whole scan " +
          "is **O(n) time, O(1) space** — no table, no recursion, just one running frontier that only ever grows.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Assuming greedy works without proving it.** A locally-best choice that *feels* right isn't the same " +
          "as one that's provably safe — sketch the exchange argument first. If you can't argue that swapping the " +
          "greedy choice into any optimal solution can't make it worse, the problem may need " +
          "[[dynamic-programming]] instead.",
          "**Sorting by the wrong key.** Interval-scheduling greedy needs *finish* time, not *start* time — " +
          "sorting by the wrong field produces a locally-plausible order that silently gives the wrong answer, " +
          "with no error to flag it.",
          "**Off-by-one on the frontier check.** In a reachability scan, checking `i > reach` *after* updating " +
          "`reach` for index `i` — instead of before — lets an unreachable index slip through as if it were fine.",
          "**Moving the running total without its paired pointer.** In a circuit-reset greedy, the running total " +
          "and the candidate start index must reset together; updating one without the other leaves the start " +
          "pointing at a position the (already-reset) total no longer represents.",
          "**Running only one direction on a two-sided constraint.** A constraint that must hold on both " +
          "neighbors needs both a left-to-right *and* a right-to-left pass, merged with `max`/`min` — stopping " +
          "after the first pass silently drops every right-hand-side constraint.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Single-element input — often already satisfies the invariant trivially (e.g. reachability on a " +
          "one-element array is already \"at the end\").",
          "All-equal weights/costs/ratings — a good self-check that the greedy isn't secretly relying on strict " +
          "distinctness to always find a clear \"best\" choice at each step.",
          "The exact break-even case (total resource == total cost) — feasibility hinges on a `>=`/`<` boundary, " +
          "not a strict inequality; an off-by-one there flips the feasibility verdict.",
          "A choice that has to be revisited more than once — a circuit-reset greedy's start candidate can reset " +
          "several times before landing on the true answer; tracing only one reset understates the mechanic.",
          "No valid answer exists — the greedy scan must still terminate and report the problem's failure " +
          "sentinel (`-1`, `false`) rather than looping indefinitely or returning a partial, misleading result.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["jump-game", "gas-station"],
        recommended: ["candy"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Greedy practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Algorithms cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", type: "article" },
          { label: "Wikipedia — Greedy algorithm", url: "https://en.wikipedia.org/wiki/Greedy_algorithm", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
