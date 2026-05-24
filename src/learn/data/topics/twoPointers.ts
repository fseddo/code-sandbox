import type { LearnTopic } from "@/learn/data/topic";

export const twoPointers = {
  slug: "two-pointers",
  title: "Two pointers",
  category: "algorithms",
  summary: "Two indices scanning a sequence to collapse an O(n²) nested loop into a single O(n) pass.",
  tags: ["two-pointers"],
  priority: "high",
  estimatedMinutes: 60,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "The two-pointer pattern walks a sequence with *two* indices instead of nesting two loops. The common " +
          "shape is **opposite ends** — `left` at the start, `right` at the end, moving toward each other — but " +
          "**fast/slow** (same direction, different speeds) is the same idea. Each pointer advances at most n " +
          "times, so the whole scan is O(n) with O(1) extra space.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for two pointers on a **sorted** array or string when you'd otherwise compare all pairs: finding " +
          "a pair that sums to a target, checking a palindrome, partitioning in place, or removing duplicates. " +
          "The key is that moving a pointer must let you *discard* possibilities monotonically — otherwise you'd " +
          "still need the nested loop.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Relation to sliding window",
        body:
          "A sliding window is a *directional* two-pointer variant: both pointers move the same way and the span " +
          "between them is the answer. If the two pointers instead converge from opposite ends, it's the classic " +
          "two-pointer scan. See the sliding window topic.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "Opposite-ends template: move the pointer that can't improve the answer where it is.",
        source:
          "let left = 0;\n" +
          "let right = arr.length - 1;\n" +
          "while (left < right) {\n" +
          "  // inspect arr[left] and arr[right]...\n" +
          "  // ...then advance the side that can only get better by moving:\n" +
          "  if (shouldMoveLeft) left++;\n" +
          "  else right--;\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Container With Most Water** — *pick two lines that, with the x-axis, hold the most water.* Start at " +
          "the widest pair (both ends). The area is capped by the **shorter** wall, so moving the taller one in " +
          "can only shrink the width without lifting the cap — move the shorter wall instead, hoping for a taller one.",
      },
      {
        kind: "walkthrough",
        heading: "height = [1, 8, 6, 2, 5, 7]",
        lane: [1, 8, 6, 2, 5, 7],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "left", at: 0 }, { name: "right", at: 5 }],
            action: "min(1,7)·5 = 5 → left++",
            caption: "Widest pair, but the left wall (1) caps the area — move it in.",
          },
          {
            pointers: [{ name: "left", at: 1 }, { name: "right", at: 5 }],
            action: "min(8,7)·4 = 28 → right--",
            caption: "best = 28. Now the right wall (7) is the shorter one, so move right.",
          },
          {
            pointers: [{ name: "left", at: 1 }, { name: "right", at: 4 }],
            action: "min(8,5)·3 = 15 → right--",
            caption: "Narrower and a lower cap — 15 can't beat 28.",
          },
          {
            pointers: [{ name: "left", at: 1 }, { name: "right", at: 3 }],
            action: "min(8,2)·2 = 4 → right--",
            caption: "Still shrinking; the right wall keeps capping us.",
          },
          {
            pointers: [{ name: "left", at: 1 }, { name: "right", at: 2 }],
            action: "min(8,6)·1 = 6 → pointers meet",
            caption: "No remaining pair can beat 28. Answer: 28.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Each step discards the shorter wall — O(n), versus O(n²) checking every pair.",
        source:
          "function maxArea(height) {\n" +
          "  let left = 0;\n" +
          "  let right = height.length - 1;\n" +
          "  let best = 0;\n" +
          "  while (left < right) {\n" +
          "    const area = Math.min(height[left], height[right]) * (right - left);\n" +
          "    best = Math.max(best, area);\n" +
          "    // the shorter wall caps the area, so move it inward\n" +
          "    if (height[left] < height[right]) left++;\n" +
          "    else right--;\n" +
          "  }\n" +
          "  return best;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "`left` and `right` each move inward at most n times before they meet, so the whole scan is O(n) time " +
          "and O(1) space — versus the O(n²) of checking every pair.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Inward (opposite ends)** — `left` at the start, `right` at the end, converging; move whichever side " +
          "can't improve the answer where it is (*pair sum on a sorted array*, *palindrome check*, *container with most water*).\n\n" +
          "**Unidirectional (fast/slow)** — both start at the same end and move the same way at different speeds or " +
          "roles; one scans ahead while the other marks a boundary (*in-place dedupe*, *cycle detection*).\n\n" +
          "**Staged** — one pointer searches for a trigger element, then a second sweeps from there to gather what follows.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Two pointers needs a *monotonic* reason to move — on an unsorted array, advancing a pointer doesn't safely discard candidates. Sort first, or reach for a different tool.",
          "Decide up front whether the loop is `while (left < right)` or `<=` — the crossing condition is the usual off-by-one.",
          "When mutating in place, keep a clear *write* pointer separate from the *read* pointer.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty or single-element input.",
          "All-duplicate values (in-place dedupe collapses to length 1).",
          "Already-sorted vs. reverse-sorted inputs.",
          "No valid pair — return the prompt's sentinel (e.g. `[]` or `-1`).",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["container-with-most-water", "valid-palindrome"],
        recommended: ["3sum", "3sum-closest", "trapping-rain-water", "remove-duplicates-from-sorted-array"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Two pointers practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Algorithms cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", type: "article" },
          { label: "MDN — Array", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", type: "doc" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
