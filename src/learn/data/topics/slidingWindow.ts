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
          "`right` to take in more, and advance `left` to drop elements once the window breaks some invariant. " +
          "Because each index enters the window once and leaves once, the whole scan is **O(n)** — even though it " +
          "*reads* like a nested loop, the two pointers only ever move forward.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a sliding window on a **contiguous** subarray or substring problem asking for the longest, " +
          "shortest, or a count satisfying some condition — *longest substring without repeats*, *smallest " +
          "subarray with sum ≥ target*, *all anagram start indices*. The window is **fixed** when its size is " +
          "given outright, and **variable** when you grow `right` and shrink `left` to keep an invariant true. " +
          "The cue: the answer is a *run of adjacent elements*, and a brute force would re-scan overlapping runs.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Fixed window** — the width `k` is fixed by the prompt. Slide one step at a time: add the entering " +
          "element, drop the leaving one, and read the answer off the window in O(1) (*maximum average subarray " +
          "of size k*, *anagram start indices*).\n\n" +
          "**Variable window** — grow `right` greedily, then shrink `left` *only while* an invariant is broken. " +
          "How far you shrink is data-dependent, but each index still enters and leaves once, so it stays O(n) " +
          "(*longest substring without repeats*, *longest repeating-character replacement*).\n\n" +
          "**Monotone / non-shrinking window** — a variant where `left` advances at most one step per `right`, so " +
          "the window width never decreases and its final width is the answer. Useful when you only care about the " +
          "*largest* valid window (*character replacement*).",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Window contents and its sibling pattern",
        body:
          "A window is a *directional* variant of the [[two-pointers]] scan — both indices move the same way and " +
          "the span between them is the answer, rather than converging from opposite ends. It is almost always " +
          "paired with a helper that summarizes what's *inside* the window in O(1): a set for uniqueness, a count " +
          "map (or a 26-slot letter array) for frequencies, or a running sum. Choosing that helper — and updating " +
          "it incrementally as the edges move — is most of the problem.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "Variable-window template: extend right, then shrink left until the invariant holds again.",
        source:
          "let left = 0;\n" +
          "let best = 0;\n" +
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
          "**Smallest subarray with sum ≥ target** — given positive numbers, find the length of the shortest " +
          "contiguous run whose sum is at least `target` (here `target = 7`). Grow `right`, adding to a running " +
          "`sum`. The moment `sum >= target`, the window is valid — so *contract* from `left`, recording the width " +
          "each time it stays valid, because a shorter qualifying window is always better.",
      },
      {
        kind: "walkthrough",
        heading: "nums = [2, 3, 1, 2, 4, 3], target = 7",
        lane: [2, 3, 1, 2, 4, 3],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "left", at: 0 }, { name: "right", at: 3 }],
            range: [0, 3],
            action: "sum = 8 ≥ 7 → record width 4, shrink",
            caption: "First time the window reaches the target: [2,3,1,2] sums to 8. best = 4.",
          },
          {
            pointers: [{ name: "left", at: 1 }, { name: "right", at: 3 }],
            range: [1, 3],
            marked: [0],
            action: "sum = 6 < 7 → grow right",
            caption: "Dropping the 2 breaks the invariant (6 < 7), so stop shrinking and extend again.",
          },
          {
            pointers: [{ name: "left", at: 1 }, { name: "right", at: 4 }],
            range: [1, 4],
            marked: [0],
            action: "sum = 10 ≥ 7 → shrink: width 4 then width 3 → best = 3",
            caption: "[3,1,2,4] = 10 is valid; contracting to [1,2,4] = 7 is still valid at width 3. best = 3.",
          },
          {
            pointers: [{ name: "left", at: 3 }, { name: "right", at: 4 }],
            range: [3, 4],
            marked: [0, 1, 2],
            action: "sum = 6 < 7 → grow right",
            caption: "One more shrink to [2,4] = 6 breaks the invariant, so stop and reach right again.",
          },
          {
            pointers: [{ name: "left", at: 4 }, { name: "right", at: 5 }],
            range: [4, 5],
            marked: [0, 1, 2, 3],
            action: "sum = 7 ≥ 7 → record width 2",
            caption: "[4,3] hits exactly 7 — width 2, the smallest valid window. Answer: 2.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Each index enters once (right) and leaves once (left), so the scan is O(n).",
        source:
          "function minSubArrayLen(target, nums) {\n" +
          "  let left = 0;\n" +
          "  let sum = 0;\n" +
          "  let best = Infinity;\n" +
          "  for (let right = 0; right < nums.length; right++) {\n" +
          "    sum += nums[right];                 // extend the window\n" +
          "    while (sum >= target) {             // valid — try to make it smaller\n" +
          "      best = Math.min(best, right - left + 1);\n" +
          "      sum -= nums[left++];              // shrink from the left\n" +
          "    }\n" +
          "  }\n" +
          "  return best === Infinity ? 0 : best;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Both pointers only move forward, so each element is added and removed at most once — **O(n)** time and " +
          "**O(1)** space. A naïve scan that re-summed every subarray would be O(n²).",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Recomputing the window's summary from scratch each step reintroduces the O(n²) you came to avoid — update it incrementally as `left`/`right` move.",
          "With a count map, shrink *fully*: advance `left` until the offending count actually drops, not just once.",
          "A window's width is `right - left + 1`, not `right - left` — an easy off-by-one.",
          "On a *fixed*-size window, evict the leaving element *every* step once the window is full — forgetting it lets the window grow without bound.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty input — return `0` / an empty result before entering the loop.",
          "A pattern or window longer than the input (fixed-size variants) — no valid window exists.",
          "All-identical or single-element inputs.",
          "No valid window exists — return the sentinel (`0`, `-1`, or `\"\"`) the prompt expects.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["longest-substring-without-repeating-characters", "longest-repeating-character-replacement"],
        recommended: ["find-all-anagrams-in-a-string"],
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
