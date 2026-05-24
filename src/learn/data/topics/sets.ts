import type { LearnTopic } from "@/learn/data/topic";

export const sets = {
  slug: "sets",
  title: "Sets",
  category: "data-structures",
  summary: "A collection of unique values with average O(1) membership — for 'have I seen this?' and dedup.",
  tags: ["hash-table", "sliding-window"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A `Set` is a collection of *unique* values with average O(1) membership testing. It's a hash map " +
          "without the values — it answers one question, *is this element present?*, and silently ignores a " +
          "value that's already in it.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "has", average: "O(1)", worst: "O(n)", note: "vs Array.includes, which is O(n)" },
          { operation: "add", average: "amortized O(1)", worst: "O(n)" },
          { operation: "delete", average: "O(1)", worst: "O(n)" },
          { operation: "dedup an array", average: "O(n)", worst: "O(n)", note: "[...new Set(arr)]" },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a `Set` when you only care about membership or uniqueness: detecting duplicates, deduping " +
          "a list, or tracking a 'visited' frontier in graph and sliding-window problems. If you also need data " +
          "*attached* to each key, you want a `Map` instead.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Set vs array membership",
        body:
          "The whole point is the membership check. `array.includes(x)` rescans from the start every call — " +
          "O(n) each, O(n²) inside a loop. `set.has(x)` is average O(1), so building a `Set` once and querying " +
          "it in a loop is the standard fix for an accidental quadratic.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "typescript",
        caption: "Dedup in one expression; membership without rescanning.",
        source:
          "// A Set keeps only the first occurrence of each value; spreading it back\n" +
          "// to an array gives a deduped list in first-seen order.\n" +
          "const unique = [...new Set(nums)];\n\n" +
          "// Build the lookup set once up front...\n" +
          "const blocked = new Set(blocklist);\n" +
          "// ...then every membership test is O(1) — blocklist.includes(id) would be O(n).\n" +
          "const allowed = ids.filter((id) => !blocked.has(id));",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Longest Substring Without Repeating Characters** — *find the length of the longest substring of " +
          "`s` with no repeated character.* A `Set` holds the characters currently in the window. We grow the " +
          "window to the right; the moment we hit a character already in the set, we shrink from the left — " +
          "deleting as we go — until the duplicate is gone.",
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Sliding window: the Set is the live contents of the window, membership-checked in O(1).",
        source:
          "function lengthOfLongestSubstring(s) {\n" +
          "  const seen = new Set(); // the characters currently inside the window\n" +
          "  let left = 0;\n" +
          "  let best = 0;\n" +
          "  for (let right = 0; right < s.length; right++) {\n" +
          "    // s[right] is a repeat? shrink from the left, evicting characters\n" +
          "    // from the set until the duplicate is gone.\n" +
          "    while (seen.has(s[right])) seen.delete(s[left++]);\n" +
          "    seen.add(s[right]); // window is now duplicate-free again\n" +
          "    best = Math.max(best, right - left + 1);\n" +
          "  }\n" +
          "  return best;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Each character is added and removed at most once, so despite the inner `while` the whole scan is " +
          "O(n) — the Set's O(1) `has`/`delete` are what keep the window cheap to maintain.",
      },
      {
        kind: "exampleProblem",
        problemId: "longest-substring-without-repeating-characters",
        note: "Now try it yourself.",
      },
    ],
  },
} satisfies LearnTopic;
