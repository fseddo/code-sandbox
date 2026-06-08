import type { LearnTopic } from "@/learn/data/topic";

export const intervals = {
  slug: "intervals",
  title: "Intervals",
  category: "algorithms",
  summary: "Ranges [start, end] — sort by an endpoint, then a single linear sweep handles overlaps.",
  tags: ["interval"],
  priority: "mid",
  estimatedMinutes: 60,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Interval problems operate over ranges `[start, end]` that may overlap, touch, or sit apart. The defining " +
          "move is to impose an order the inputs don't come with: **sort by start** (occasionally by end). Once the " +
          "intervals are sorted, merging, overlap detection, and counting all collapse into a **single linear sweep** " +
          "in which you only ever compare the current interval against a small running *frontier* — the last merged " +
          "range, or a count of how many ranges are currently open.\n\n" +
          "That makes the cost model nearly always **O(n log n)** — the sort dominates, and the sweep that follows is " +
          "O(n). Two intervals `[a, b]` and `[c, d]` (with `a ≤ c` after sorting) **overlap** exactly when `c ≤ b`; " +
          "their union is `[a, max(b, d)]` and their intersection is `[c, min(b, d)]`.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for the sort-then-sweep pattern whenever the input is a set of ranges and the question is about how " +
          "they relate: *merge all overlapping intervals*, *insert a new interval into a sorted set*, *find where two " +
          "interval lists intersect*, *can a person attend all meetings*, or *how many meetings happen at once*. The " +
          "tell is a list of `[start, end]` pairs with no inherent order and a question about overlap, coverage, or " +
          "simultaneity. If the prompt instead asks for the *peak* number of concurrent ranges, that's the **sweep-" +
          "line** variant — events rather than merges.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Sort by start, then merge** — the workhorse. Sort by start; walk left to right holding the last interval " +
          "in the output. If the current interval starts at or before that interval's end, they overlap, so extend " +
          "the end to the larger of the two; otherwise it's disjoint and becomes a new output interval.\n\n" +
          "**Two-pointer sweep over two sorted lists** — when you have *two* already-sorted interval lists and want " +
          "their pairwise intersections, advance a pointer into each. The overlap of the two current intervals is " +
          "`[max(starts), min(ends)]` (emit it when non-empty), then advance whichever interval **ends first**, since " +
          "it can't reach any later interval in the other list.\n\n" +
          "**Sweep line of endpoints** — when the question is *how many intervals are active at once*, forget merging: " +
          "turn each interval into a `+1` event at its start and a `-1` event just past its end, sort the events by " +
          "position, and sweep a running counter, tracking its peak. This generalizes to 'minimum meeting rooms' and " +
          "any maximum-concurrency count.\n\n" +
          "**Sort by end (greedy)** — for *non-overlapping* selection problems (keep the most intervals / remove the " +
          "fewest), sort by **end** and greedily take each interval whose start clears the last one taken.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Intervals, sorting, and heaps",
        body:
          "The whole pattern is built on a [[sorting|sort]] — that's where the O(n log n) comes from, and choosing " +
          "*which* endpoint to sort by is the design decision that makes the sweep work. The concurrency variants are " +
          "close cousins of [[heaps|heaps & priority queues]]: 'minimum meeting rooms' can be solved either by the " +
          "endpoint sweep here or by a min-heap of end times, popping rooms that have freed up. When intervals arrive " +
          "as a stream rather than a fixed list, the heap formulation is the one that adapts.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The sort-then-sweep template: sort by start, then extend-or-append against the last output interval.",
        source:
          "function sweepIntervals(intervals) {\n" +
          "  // 1. Impose order the input lacks: sort by start.\n" +
          "  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);\n" +
          "  const result = [];\n" +
          "  for (const [start, end] of sorted) {\n" +
          "    const last = result[result.length - 1];\n" +
          "    // 2. Overlap iff the current start is within the running frontier's end.\n" +
          "    if (last && start <= last[1]) {\n" +
          "      last[1] = Math.max(last[1], end);   // extend the frontier\n" +
          "    } else {\n" +
          "      result.push([start, end]);          // disjoint → start a new frontier\n" +
          "    }\n" +
          "  }\n" +
          "  return result;\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Merge overlapping intervals** — given `[[8, 10], [1, 4], [2, 5], [12, 16]]`, merge every overlapping pair. " +
          "The intervals arrive in no useful order, so the first move is to **sort by start**, giving " +
          "`[[1, 4], [2, 5], [8, 10], [12, 16]]`. Now a single left-to-right sweep suffices: keep the last interval in " +
          "the output as a *frontier*, and for each next interval either extend that frontier (if it overlaps) or push " +
          "a fresh one (if it's disjoint).",
      },
      {
        kind: "walkthrough",
        heading: "sorted by start: [[1, 4], [2, 5], [8, 10], [12, 16]]",
        lane: ["[1,4]", "[2,5]", "[8,10]", "[12,16]"],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "i", at: 0 }],
            marked: [0],
            action: "output = [[1, 4]]",
            caption: "The first interval seeds the frontier — nothing to compare against yet.",
          },
          {
            pointers: [{ name: "i", at: 1 }],
            action: "2 ≤ 4 → overlap → extend end to max(4, 5)",
            caption: "[2,5] starts at 2, within the frontier's end 4, so they overlap. Frontier becomes [1, 5].",
          },
          {
            pointers: [{ name: "i", at: 2 }],
            action: "8 > 5 → disjoint → push [8, 10]",
            caption: "[8,10] starts past the frontier's end 5, so it's separate. output = [[1, 5], [8, 10]].",
          },
          {
            pointers: [{ name: "i", at: 3 }],
            action: "12 > 10 → disjoint → push [12, 16]",
            caption: "[12,16] clears the frontier 10 too, so it's its own interval.",
          },
          {
            action: "done → [[1, 5], [8, 10], [12, 16]]",
            caption: "One pass over the sorted list produced three non-overlapping intervals.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Sort dominates at O(n log n); the sweep is O(n) — overall O(n log n) time, O(n) output space.",
        source:
          "function merge(intervals) {\n" +
          "  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);\n" +
          "  const result = [];\n" +
          "  for (const [start, end] of sorted) {\n" +
          "    const last = result[result.length - 1];\n" +
          "    if (last && start <= last[1]) {       // current starts within the frontier\n" +
          "      last[1] = Math.max(last[1], end);    // absorb it by widening the end\n" +
          "    } else {\n" +
          "      result.push([start, end]);           // gap → new frontier\n" +
          "    }\n" +
          "  }\n" +
          "  return result;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "The sort is **O(n log n)** and the single sweep is **O(n)**, so the whole thing is **O(n log n)** time with " +
          "**O(n)** space for the output. Every interval-merging variant — inserting one interval, intersecting two " +
          "lists, counting concurrency — is a rearrangement of this same sort-then-one-pass skeleton.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Forgetting to sort.** The single-pass sweep is only correct on intervals ordered by start; running it on the raw input silently merges the wrong pairs.",
          "**Off-by-one on touching endpoints.** Decide up front whether `[1, 4]` and `[4, 5]` overlap. With closed intervals they do (use `start <= last.end`); with half-open ones they don't (`start < last.end`). Mixing the two is a classic bug.",
          "**Extending the end to the new interval's end instead of the max.** A contained interval like `[2, 3]` inside `[1, 10]` must not shrink the frontier — always take `max(last.end, end)`.",
          "**Mutating the input array's order** when the caller still needs it. Sort a copy (`[...intervals]`) if the original order matters elsewhere.",
          "**Sorting by the wrong key.** Merging sorts by *start*; greedy non-overlapping selection sorts by *end*. Picking the wrong endpoint quietly produces a suboptimal or incorrect answer.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty input — return an empty list (or `0` for a count); guard before reading the first frontier.",
          "A single interval — it passes through unchanged.",
          "Fully nested intervals (`[1, 10]` containing `[2, 3]`) — the inner one is absorbed without changing the frontier.",
          "Identical or duplicate intervals — they merge into one (or stack the concurrency count).",
          "Already-disjoint input — nothing merges; every interval survives.",
          "Zero-width intervals like `[5, 5]` — valid points; make sure your overlap test counts them.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["merge-intervals"],
        recommended: ["interval-intersections", "max-overlapping-intervals"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Intervals practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Interval cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/interval/", type: "article" },
          { label: "LeetCode — Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", type: "doc" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
