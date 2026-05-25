import type { LearnTopic } from "@/learn/data/topic";

export const hashMaps = {
  slug: "hash-maps",
  title: "Hash maps",
  category: "data-structures",
  summary: "Key→value lookup in average O(1) — the go-to for 'have I seen X, and what was it paired with?'.",
  tags: ["hash-table"],
  priority: "high",
  estimatedMinutes: 45,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A hash map stores key→value pairs and finds, inserts, or removes an entry *by its key* in average " +
          "O(1). It hashes each key to a bucket, so it never scans the collection — the cost is extra memory " +
          "and that the O(1) is *average*, not guaranteed (a pathological set of keys can collide into one " +
          "bucket and degrade to O(n)).",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "get / has", average: "O(1)", worst: "O(n)", note: "worst = every key collides into one bucket" },
          { operation: "set", average: "amortized O(1)", worst: "O(n)", note: "amortized over occasional resize/rehash" },
          { operation: "delete", average: "O(1)", worst: "O(n)" },
          { operation: "iterate", average: "O(n)", worst: "O(n)", note: "Map preserves insertion order" },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a `Map` whenever you need to look something up *by a key* instead of scanning for it — " +
          "counting occurrences, remembering the index a value was last seen at, grouping items by a derived " +
          "key, or caching a computed result. It's what collapses many brute-force O(n²) solutions into a " +
          "single O(n) pass.\n\n" +
          "The tell in a prompt: *\"have I seen this before?\"*, *\"what was this paired with?\"*, or *\"how many " +
          "times does each X appear?\"* — anything that wants a lookup keyed by a value rather than a position.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Seen-set** — store the values (or indices) you've passed, then ask whether the *complement* you need " +
          "has already gone by. The archetype is pair-sum: for each `x`, look up `target - x` (*two sum*, " +
          "*duplicate detection*).\n\n" +
          "**Frequency map** — count how many times each key occurs in one pass (`map.get(k) ?? 0) + 1`), then " +
          "read the tallies (*anagrams*, *top-K*, *majority element*).\n\n" +
          "**Bucket by signature** — derive a canonical key for each item and group items that share it (*group " +
          "anagrams* by sorted letters, *seen rows/cols/boxes* in a Sudoku grid).\n\n" +
          "**Membership for O(1) presence** — a `Set` is a hash map without values; use it when you only need " +
          "*is this here?* (*longest consecutive run*: only start a walk from a value whose predecessor is absent).",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Map vs object-as-map",
        body:
          "Reach for `Map` when keys aren't strings or insertion order matters. A plain object coerces keys " +
          "to strings (`obj[1]` and `obj['1']` collide), carries prototype keys, and has no `.size` — so " +
          "`Map` is the safer default for a true lookup table. When you only need presence (no value), a " +
          "[[Set]] is the same machinery without the payload.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "typescript",
        caption: "The core methods are set / get / has / delete; get returns undefined for a missing key.",
        source:
          "// Map<key, value> — here we tally how many times each word appears.\n" +
          "const counts = new Map<string, number>();\n" +
          "for (const word of words) {\n" +
          "  // get returns undefined for an unseen key; ?? 0 seeds the first count.\n" +
          "  counts.set(word, (counts.get(word) ?? 0) + 1);\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Two Sum** — *given an array `nums` and a `target`, return the indices of the two numbers that add " +
          "to it.* The brute force checks every pair: O(n²). The hash-map insight: as we walk the array, for " +
          "each number we already know exactly what its partner would be (`target - num`) — so instead of " +
          "scanning ahead for it, we just ask a map whether we've *seen that partner already*.",
      },
      {
        kind: "walkthrough",
        heading: "nums = [5, 2, 8, 1, 7], target = 9",
        lane: [5, 2, 8, 1, 7],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "i", at: 0 }],
            action: "need 9−5 = 4 · absent → seen[5] = 0",
            caption: "seen is empty; remember 5 at index 0 for a future partner.",
          },
          {
            pointers: [{ name: "i", at: 1 }],
            action: "need 9−2 = 7 · absent → seen[2] = 1",
            caption: "seen = {5:0}. No 7 yet; remember 2 at index 1.",
          },
          {
            pointers: [{ name: "i", at: 2 }],
            action: "need 9−8 = 1 · absent → seen[8] = 2",
            caption: "seen = {5:0, 2:1}. No 1 yet; remember 8 at index 2.",
          },
          {
            pointers: [{ name: "i", at: 3 }],
            marked: [2],
            action: "need 9−1 = 8 · seen[8] = 2 → return [2, 3]",
            caption: "The partner 8 is already in the map at index 2 — answer [2, 3], in one pass.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "One pass: store value→index as we go, and check for the complement before inserting.",
        source:
          "function twoSum(nums, target) {\n" +
          "  const seen = new Map(); // value -> index of every number we've passed\n" +
          "  for (let i = 0; i < nums.length; i++) {\n" +
          "    const need = target - nums[i]; // the partner that would complete the pair\n" +
          "    if (seen.has(need)) return [seen.get(need), i]; // saw it earlier? done\n" +
          "    seen.set(nums[i], i); // otherwise remember this number for a future partner\n" +
          "  }\n" +
          "  return [];\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Each element is visited once and every map operation is average O(1), so the whole thing is O(n) " +
          "time and O(n) space — we trade memory (the `seen` map) for the quadratic scan we'd otherwise pay.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "`map.get(missing)` is `undefined`, not `0` — seed counts with `?? 0` before arithmetic, or `NaN` creeps in.",
          "A plain object stringifies keys (`obj[1]` and `obj['1']` collide) and inherits prototype keys (`'toString' in obj`). Use `Map` for a true lookup table.",
          "Average O(1) is *amortized and average* — a worst-case collision set, or counting the rehash, is O(n). Don't claim O(1) worst case in an interview.",
          "Check for the complement *before* inserting the current element, or a single value can wrongly pair with itself.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty input, or fewer elements than the pattern needs (no pair / no triplet).",
          "Duplicate values — decide whether they share a key (frequency) or each need their own index.",
          "Negative numbers and zero as keys (fine for `Map`, but watch `-0`/`0` and float keys).",
          "No answer exists — return the prompt's sentinel (`[]`, `-1`, `0`).",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["two-sum", "valid-sudoku"],
        recommended: ["set-matrix-zeroes", "longest-consecutive-sequence", "geometric-sequence-triplets"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Arrays & Hashing practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Hash table", url: "https://www.techinterviewhandbook.org/algorithms/hash-table/", type: "article" },
          { label: "MDN — Map", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map", type: "doc" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
