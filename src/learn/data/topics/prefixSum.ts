import type { LearnTopic } from "@/learn/data/topic";

export const prefixSum = {
  slug: "prefix-sum",
  title: "Prefix sums",
  category: "algorithms",
  summary: "Precompute running totals so any range sum is O(1) — and pair with a hash map for 'sum equals k'.",
  tags: ["prefix-sum"],
  priority: "mid",
  estimatedMinutes: 55,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A **prefix-sum array** stores the running total of a sequence: `prefix[k]` is the sum of the first `k` " +
          "elements, with `prefix[0] = 0`. Once it's built, the sum of any contiguous range `[i, j]` (inclusive) is " +
          "just `prefix[j + 1] - prefix[i]` — the total up to and including `j`, minus everything strictly before `i`. " +
          "A single O(n) precompute turns *every* later range-sum query into an O(1) subtraction.\n\n" +
          "The cost model is the whole point: you pay O(n) once to build the table, then answer `q` queries in " +
          "O(q) instead of O(n·q). The same trick generalizes — running **products** (with a left/right pass), 2D " +
          "**rectangle sums** (a 2D table read by inclusion–exclusion), and, paired with a hash map, **counting " +
          "subarrays** with a given sum.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "Build the 1D prefix array", average: "O(n)", worst: "O(n)", note: "One pass; `prefix[k+1] = prefix[k] + nums[k]`." },
          { operation: "Range sum [i, j]", average: "O(1)", worst: "O(1)", note: "`prefix[j+1] - prefix[i]` after the build — beats O(n·q) re-summing across q queries." },
          { operation: "Build a 2D prefix table (m×n)", average: "O(n²)", worst: "O(n²)", note: "O(m·n) cells; each folds in the rect above + left − overlap." },
          { operation: "2D rectangle sum", average: "O(1)", worst: "O(1)", note: "Four-corner inclusion–exclusion off the table." },
          { operation: "Count subarrays summing to k", average: "O(n)", worst: "O(n)", note: "Prefix + hash map of seen prefixes, one pass." },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for prefix sums when the prompt makes **many range-sum queries** over an array (or a matrix) that " +
          "doesn't change between queries — the immutable framing is the tell that a one-time precompute pays off. " +
          "The second, less obvious cue: *count or find contiguous subarrays whose sum equals k*. Folding a running " +
          "prefix into a **hash map of prefixes seen so far** turns that quadratic scan into a single linear pass — " +
          "the trick that separates this pattern from a [[sliding-window|sliding window]], which only works when the " +
          "values are all non-negative. If the array has negatives, prefix-plus-hash-map is the move.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**1D prefix sum (range queries)** — the workhorse. Build `prefix` of length `n + 1` with `prefix[0] = 0`; " +
          "answer any inclusive range `[i, j]` as `prefix[j + 1] - prefix[i]`. The `+1` offset and the leading zero " +
          "are what make the subtraction boundary-safe.\n\n" +
          "**Prefix + hash map (subarray sum equals k)** — keep a running prefix and a map of `prefix value → how " +
          "many times it has occurred`, seeded with `{0: 1}`. A subarray ending here sums to `k` exactly when an " +
          "earlier prefix equals `current − k`; add that count, then record the current prefix. This is where prefix " +
          "sums meet [[hash-maps|hash maps]].\n\n" +
          "**Prefix and suffix products** — for 'product of all elements except self' without division, run a " +
          "left-to-right pass writing the product of everything *before* each index, then a right-to-left pass " +
          "multiplying in the product of everything *after*. Two running accumulations, one output array.\n\n" +
          "**2D prefix sum (rectangle queries)** — build a table where `pre[r+1][c+1]` is the sum of the rectangle " +
          "from the origin to `(r, c)`: `cell + above + left − overlap`. Read any sub-rectangle by " +
          "inclusion–exclusion off its four corners. The same `+1`-padding idea, one dimension up.\n\n" +
          "**Difference array (range updates)** — the inverse direction: to add a value across many ranges, stamp " +
          "`+v` at each range start and `−v` just past its end, then take a prefix sum *once* to materialize the " +
          "final array. Range *updates* become O(1) each, paid back with a single linear sweep.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Prefix sums, sliding windows, and hash maps",
        body:
          "A [[sliding-window|sliding window]] answers the same 'best/longest subarray' questions when the values " +
          "are non-negative and the window can grow and shrink monotonically; prefix sums are the more general tool " +
          "that survives **negative numbers**, at the cost of an extra array. The 'subarray sum equals k' variant is " +
          "really a [[hash-maps|hash map]] problem wearing a prefix-sum hat — the prefix turns a range condition into " +
          "an equality the map can answer in O(1). And the build step itself is a tiny instance of the broader " +
          "**running-accumulation** idea that also underlies cumulative products and difference arrays.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The 1D template: build the padded prefix array once, then every range sum is one subtraction.",
        source:
          "function buildPrefix(nums) {\n" +
          "  // prefix[k] = sum of nums[0..k-1]; the leading 0 makes range math boundary-safe.\n" +
          "  const prefix = new Array(nums.length + 1).fill(0);\n" +
          "  for (let k = 0; k < nums.length; k++) {\n" +
          "    prefix[k + 1] = prefix[k] + nums[k];\n" +
          "  }\n" +
          "  return prefix;\n" +
          "}\n" +
          "\n" +
          "// Inclusive range [i, j]: total through j minus everything before i.\n" +
          "function rangeSum(prefix, i, j) {\n" +
          "  return prefix[j + 1] - prefix[i];\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Count subarrays summing to k** — given `nums = [3, 4, 7, -3, 1]` and `k = 7`, how many contiguous " +
          "subarrays sum to 7? Re-summing every `[i, j]` range is O(n²). The prefix-sum insight: a subarray ending " +
          "at the current index sums to `k` exactly when some *earlier* prefix equals `current prefix − k`, because " +
          "subtracting that earlier prefix leaves a block summing to `k`.\n\n" +
          "So sweep once, carrying a running `prefix` and a map of how many times each prefix value has appeared " +
          "(seeded with `{0: 1}` so a subarray that starts at index 0 counts itself). At each step add " +
          "`count[prefix − k]` to the answer, then record `prefix`.",
      },
      {
        kind: "walkthrough",
        heading: "nums = [3, 4, 7, -3, 1], k = 7  ·  running prefix + counts",
        lane: [3, 4, 7, -3, 1],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "i", at: 0 }],
            action: "prefix = 3 · need 3−7 = −4 (absent) → +0",
            caption: "Seed counts = {0: 1}. No earlier prefix is −4, so no subarray ends here at sum 7. Record 3.",
          },
          {
            pointers: [{ name: "i", at: 1 }],
            action: "prefix = 7 · need 7−7 = 0 (seen ×1) → +1",
            caption: "prefix 0 was seeded, so the whole block [3,4] sums to 7. total = 1. Record 7.",
          },
          {
            pointers: [{ name: "i", at: 2 }],
            action: "prefix = 14 · need 14−7 = 7 (seen ×1) → +1",
            caption: "Earlier prefix 7 means the subarray after it — [7] alone — sums to 7. total = 2. Record 14.",
          },
          {
            pointers: [{ name: "i", at: 3 }],
            action: "prefix = 11 · need 11−7 = 4 (absent) → +0",
            caption: "A failing step: no earlier prefix equals 4, so nothing ends here at 7. Record 11.",
          },
          {
            pointers: [{ name: "i", at: 4 }],
            action: "prefix = 12 · need 12−7 = 5 (absent) → +0",
            caption: "Again nothing. The sweep ends with total = 2 — the subarrays [3,4] and [7].",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "One pass, O(n) time and O(n) space for the counts map — versus O(n²) for re-summing every range.",
        source:
          "function subarraySum(nums, k) {\n" +
          "  // prefix value -> how many times it has occurred; {0:1} counts subarrays from index 0.\n" +
          "  const counts = new Map([[0, 1]]);\n" +
          "  let prefix = 0;\n" +
          "  let total = 0;\n" +
          "  for (const num of nums) {\n" +
          "    prefix += num;\n" +
          "    // An earlier prefix equal to (prefix - k) closes a subarray summing to k.\n" +
          "    total += counts.get(prefix - k) ?? 0;\n" +
          "    counts.set(prefix, (counts.get(prefix) ?? 0) + 1);\n" +
          "  }\n" +
          "  return total;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Building intuition for the subtraction is the whole game: **a range sum is a difference of two prefixes**, " +
          "so a target range sum becomes a target *difference*, which a hash map can match in O(1). The pass is " +
          "**O(n)** time and **O(n)** space — and unlike a sliding window, it stays correct when `nums` contains " +
          "negatives, because it never assumes a longer subarray has a larger sum.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Off-by-one on the offset.** With `prefix[0] = 0`, the inclusive range `[i, j]` is `prefix[j + 1] - prefix[i]` — not `prefix[j] - prefix[i]`. Dropping the `+1` silently omits `nums[j]`.",
          "**Forgetting to seed the counts map with `{0: 1}`.** Without it, any subarray that starts at index 0 (whose prefix equals `k` exactly) is missed.",
          "**Reaching for a sliding window when values can be negative.** A window assumes growing the range can't *decrease* the sum; with negatives that's false. Use prefix + hash map instead.",
          "**Recording the current prefix before counting.** Add `count[prefix − k]` to the answer *first*, then insert the current prefix — otherwise a zero-sum element can count itself spuriously.",
          "**Integer overflow on products.** Prefix *products* (product-except-self) can grow fast; the problem usually guarantees the result fits, but don't assume it for arbitrary inputs.",
          "**Mutating instead of allocating.** The 1D prefix array is `n + 1` long, not `n` — sizing it `n` and writing `prefix[j + 1]` overruns the last slot.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty array — the prefix is just `[0]`; any query list should return an empty result.",
          "A single element — `prefix = [0, nums[0]]`; range `[0, 0]` is `prefix[1] - prefix[0]`.",
          "All zeros with `k = 0` — every subarray qualifies; the count is `n(n + 1) / 2`, a good overflow/perf check.",
          "Negative numbers and a target of 0 — prefixes can repeat and revisit values; the hash-map count must handle multiplicities.",
          "Queries where `i === j` — a single-element range; make sure the offset still returns just that element.",
          "A zero inside a product-except-self input — every slot except the zero's becomes 0; two zeros make every slot 0.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["subarray-sum-equals-k", "range-sum-query-immutable"],
        recommended: ["product-of-array-except-self", "range-sum-query-2d-immutable"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Prefix Sums practice", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Array cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/array/", type: "article" },
          { label: "LeetCode — Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/", type: "doc" },
          { label: "CP-Algorithms — Prefix sums & difference arrays", url: "https://cp-algorithms.com/data_structures/fenwick.html", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
