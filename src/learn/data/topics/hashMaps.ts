import type { LearnTopic } from "@/learn/data/topic";

export const hashMaps = {
  slug: "hash-maps",
  title: "Hash maps",
  category: "data-structures",
  summary: "Key→value lookup in average O(1) — the go-to for 'have I seen X, and what was it paired with?'.",
  tags: ["hash-table"],
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
          "single O(n) pass.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Map vs object-as-map",
        body:
          "Reach for `Map` when keys aren't strings or insertion order matters. A plain object coerces keys " +
          "to strings (`obj[1]` and `obj['1']` collide), carries prototype keys, and has no `.size` — so " +
          "`Map` is the safer default for a true lookup table.",
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
          "each number we already know exactly what its partner would be (`target - num`) — so we just ask the " +
          "map whether we've *seen that partner already*.",
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
      {
        kind: "exampleProblem",
        problemId: "two-sum",
        note: "Now try it yourself.",
      },
      {
        kind: "exampleProblem",
        problemId: "group-anagrams",
        note: "Same idea, richer key: a Map keyed by a canonical signature buckets related items in one pass.",
      },
    ],
  },
} satisfies LearnTopic;
