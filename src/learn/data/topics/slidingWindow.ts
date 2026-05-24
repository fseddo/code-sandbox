import type { LearnTopic } from "@/learn/data/topic";

export const slidingWindow = {
  slug: "sliding-window",
  title: "Sliding window",
  category: "algorithms",
  summary: "A moving sub-range over a sequence — grow the right edge, shrink the left, in one O(n) pass.",
  tags: ["sliding-window"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A sliding window maintains a contiguous sub-range `[left, right]` over an array or string. You extend " +
          "`right` to include more, and advance `left` to drop elements once the window breaks some invariant. " +
          "Because each index enters and leaves the window at most once, the whole scan is O(n) — even though it " +
          "*looks* like a nested loop.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a sliding window on **contiguous** subarray/substring problems asking for a longest, " +
          "shortest, or count satisfying a condition — *longest substring without repeats*, *smallest subarray " +
          "with sum ≥ target*, *fixed-size window maximum*. The window is **fixed** when its size is given, " +
          "**variable** when you grow and shrink to maintain the invariant.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Window contents",
        body:
          "A window is a directional two-pointer scan (see the two pointers topic), usually paired with a helper " +
          "that summarizes what's *inside* the window in O(1): a hash set for uniqueness, a hash map for counts, " +
          "or a running sum. Choosing that helper is most of the problem.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "Variable-window template: extend right, then shrink left until the invariant holds again.",
        source:
          "let left = 0;\n" +
          "for (let right = 0; right < arr.length; right++) {\n" +
          "  add(arr[right]);                 // extend the window rightward\n" +
          "  while (invariantBroken()) {\n" +
          "    remove(arr[left]);             // shrink from the left until valid\n" +
          "    left++;\n" +
          "  }\n" +
          "  best = Math.max(best, right - left + 1); // window is valid here\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Longest Substring Without Repeating Characters** — a `Set` holds the characters currently in the " +
          "window. Extend `right`; the moment its character is already present, shrink from `left` (evicting as " +
          "you go) until the duplicate is gone. The widest valid window seen is the answer.",
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "The Set is the window's contents; O(1) has/delete keep the scan O(n).",
        source:
          "function lengthOfLongestSubstring(s) {\n" +
          "  const seen = new Set();\n" +
          "  let left = 0;\n" +
          "  let best = 0;\n" +
          "  for (let right = 0; right < s.length; right++) {\n" +
          "    while (seen.has(s[right])) seen.delete(s[left++]); // shrink past the dup\n" +
          "    seen.add(s[right]);\n" +
          "    best = Math.max(best, right - left + 1);\n" +
          "  }\n" +
          "  return best;\n" +
          "}",
      },
      { kind: "exampleProblem", problemId: "longest-substring-without-repeating-characters", note: "The canonical variable-size window." },
      { kind: "exampleProblem", problemId: "minimum-window-substring", note: "A harder variable window — shrink to the smallest range covering all targets." },
    ],
  },
} satisfies LearnTopic;
