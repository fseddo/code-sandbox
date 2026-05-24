import type { LearnTopic } from "@/learn/data/topic";

export const slidingWindow = {
  slug: "sliding-window",
  title: "Sliding window",
  category: "algorithms",
  summary: "A moving sub-range over a sequence — grow the right edge, shrink the left, in one O(n) pass.",
  tags: ["sliding-window"],
  priority: "high",
  estimatedMinutes: 90,
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
        kind: "walkthrough",
        heading: 's = "abcabb"',
        lane: ["a", "b", "c", "a", "b", "b"],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "L", at: 0 }, { name: "R", at: 0 }],
            range: [0, 0],
            action: "best = 1",
            caption: 'right = 0 — window "a", all unique.',
          },
          {
            pointers: [{ name: "L", at: 0 }, { name: "R", at: 2 }],
            range: [0, 2],
            action: "best = 3",
            caption: 'right = 2 — window "abc", the widest so far.',
          },
          {
            pointers: [{ name: "L", at: 1 }, { name: "R", at: 3 }],
            range: [1, 3],
            marked: [0],
            action: '"a" seen → evict, left++',
            caption: 'right = 3 — the new "a" duplicates index 0, so drop from the left until it is gone.',
          },
          {
            pointers: [{ name: "L", at: 3 }, { name: "R", at: 5 }],
            range: [3, 5],
            marked: [0, 1, 2],
            action: '"b" seen → shrink past it',
            caption: 'right = 5 — "b" repeats; shrink past the earlier one. Final answer: best = 3.',
          },
        ],
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
      {
        kind: "prose",
        body:
          "Each character enters the window once (when `right` passes it) and leaves once (when `left` passes it), " +
          "so the scan is O(n) time and O(k) space for the `k` distinct characters held in the set.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Fixed window** — the size `k` is given. Slide one step at a time: add the entering element, drop the " +
          "leaving one, read the answer in O(1) per step (*maximum average subarray of size k*).\n\n" +
          "**Variable window** — grow `right` greedily, then shrink `left` *only while* an invariant is broken. " +
          "How far you shrink is data-dependent, but each index still enters and leaves once, so it stays O(n).",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Recomputing the window's summary from scratch each step reintroduces the O(n²) you came to avoid — update it incrementally as `left`/`right` move.",
          "With a count-map, shrink *fully*: advance `left` until the offending count actually drops, not just once.",
          "A window's width is `right - left + 1`, not `right - left` — an easy off-by-one.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty input — return `0` / an empty result before entering the loop.",
          "A window larger than the input (fixed-size variants).",
          "All-identical or single-element inputs.",
          "No valid window exists — return the sentinel (`0`, `-1`, or `\"\"`) the prompt expects.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["longest-substring-without-repeating-characters", "minimum-window-substring"],
        recommended: ["substring-with-concatenation-of-all-words", "maximum-subarray"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Sliding window practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Algorithms cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", type: "article" },
          { label: "MDN — Set", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set", type: "doc" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
