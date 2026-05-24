import type { LearnTopic } from "@/learn/data/topic";

export const twoPointers = {
  slug: "two-pointers",
  title: "Two pointers",
  category: "algorithms",
  summary: "Two indices scanning a sequence to collapse an O(n²) nested loop into a single O(n) pass.",
  tags: ["two-pointers"],
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
      { kind: "exampleProblem", problemId: "container-with-most-water", note: "Now try it yourself." },
      { kind: "exampleProblem", problemId: "valid-palindrome", note: "Opposite-ends pointers comparing characters as they converge." },
    ],
  },
} satisfies LearnTopic;
