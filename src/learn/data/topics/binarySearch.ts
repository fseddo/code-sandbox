import type { LearnTopic } from "@/learn/data/topic";

export const binarySearch = {
  slug: "binary-search",
  title: "Binary search",
  category: "algorithms",
  summary: "Halve a sorted (or monotonic) search space each step — O(log n), if you get the invariant right.",
  tags: ["binary-search"],
  priority: "high",
  estimatedMinutes: 90,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Binary search discards half the search space each step, finding a target — or a *boundary* — in " +
          "**O(log n)**. It works whenever the space is **monotonic**: the values are sorted, or some yes/no " +
          "predicate flips from false to true exactly once across the range. Each step inspects the midpoint, " +
          "decides which half can't contain the answer, and throws it away.\n\n" +
          "The whole subtlety lives in the loop invariant: which half is safe to drop, whether the loop is " +
          "`lo <= hi` or `lo < hi`, and whether `mid` becomes `mid - 1`, `mid + 1`, or stays put. Get the " +
          "invariant precise and the off-by-one bugs disappear.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for it on **sorted** data, and — less obviously — to *binary-search the answer* on any " +
          "**monotonic predicate**: the smallest capacity that works, the maximum cut height that still yields " +
          "enough, the rotation point. The recognition cue is a question you can phrase as *“what is the " +
          "boundary where feasible flips to infeasible?”* — or simply an `O(log n)` requirement on an " +
          "ordered input. If a linear scan would re-examine a range you've already ruled out, halving applies.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Exact-match search** — the textbook form. Use `lo <= hi`; on a hit, return `mid`; otherwise move " +
          "`lo = mid + 1` or `hi = mid - 1`. Returns the index or a not-found sentinel (*search a sorted array*).\n\n" +
          "**Boundary / lower-bound search** — instead of an exact value, find the *first* index where a " +
          "predicate becomes true (the first element `>= target`, the first `true` in a boolean run). Use " +
          "`lo < hi` with `hi = mid` (never `mid - 1`), so `lo` converges on the boundary. This is the most " +
          "reusable shape — *insertion index*, *first and last occurrence*.\n\n" +
          "**Binary search on the answer** — when the input isn't sorted but the *answer* lives in a numeric " +
          "range with a monotonic feasibility test, search that range directly: guess a value, check feasibility " +
          "in O(n), and halve (*cutting wood*, *minimum eating speed*).\n\n" +
          "**Search on a rotated / unsorted-but-structured array** — the array isn't globally sorted, but at " +
          "every midpoint one half still is. Detect the sorted half, decide whether the target lies inside its " +
          "range, and recurse into the right half (*rotated sorted array*, *find peak element*).",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Binary search and its neighbors",
        body:
          "Binary search is the search counterpart of [[sorting]] — sorting is what *makes* an array " +
          "binary-searchable, and many problems pay an `O(n log n)` sort up front precisely to unlock `O(log n)` " +
          "lookups afterward. It also rhymes with the [[two-pointers]] family: both collapse a range from its " +
          "ends, but two pointers move *linearly* on a fixed comparison, while binary search *jumps* to the " +
          "midpoint and discards half at once. When a problem says “monotonic” or “sorted” and " +
          "asks for `O(log n)`, binary search is the tool; when it asks for a *pair* or *partition* in `O(n)`, " +
          "reach for two pointers.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "Lower-bound template: the first index whose value is >= target (the reusable boundary form).",
        source:
          "function lowerBound(nums, target) {\n" +
          "  let lo = 0;\n" +
          "  let hi = nums.length;          // half-open: hi is one past the last index\n" +
          "  while (lo < hi) {\n" +
          "    const mid = (lo + hi) >> 1;  // floor((lo + hi) / 2), overflow-safe in JS\n" +
          "    if (nums[mid] < target) lo = mid + 1; // mid is too small — discard it and everything left\n" +
          "    else hi = mid;               // mid might be the boundary — keep it, drop the right\n" +
          "  }\n" +
          "  return lo;                     // first index with nums[index] >= target (== length if none)\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Lower bound of a target** — in the sorted array `[1, 3, 5, 7, 9]`, find the first index whose " +
          "value is at least `6`. There is no `6`, so the answer is the slot where `6` *would* go to keep the " +
          "array sorted: index `3` (between `5` and `7`).\n\n" +
          "Keep a half-open range `[lo, hi)`. At each step look at `mid`: if `nums[mid] < 6`, then `mid` and " +
          "everything left of it are too small — push `lo` past `mid`. Otherwise `mid` is a *candidate* " +
          "boundary, so keep it and drop the right half with `hi = mid`. When `lo === hi` the range is empty and " +
          "`lo` is the answer.",
      },
      {
        kind: "walkthrough",
        heading: "nums = [1, 3, 5, 7, 9], target = 6",
        lane: [1, 3, 5, 7, 9],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "lo", at: 0 }, { name: "hi", at: 5 }],
            range: [0, 4],
            action: "mid = 2, nums[2] = 5 < 6 → lo = 3",
            caption: "Range is all five indices ([0, 5)). nums[2] = 5 is below 6, so index 2 and everything left is too small.",
          },
          {
            pointers: [{ name: "lo", at: 3 }, { name: "hi", at: 5 }],
            range: [3, 4],
            marked: [0, 1, 2],
            action: "mid = 3, nums[3] = 7 >= 6 → hi = 3",
            caption: "Now searching [3, 5). nums[3] = 7 is a candidate boundary, so keep it and discard the right half.",
          },
          {
            pointers: [{ name: "lo", at: 3 }, { name: "hi", at: 3 }],
            range: [3, 3],
            marked: [0, 1, 2, 4],
            action: "lo === hi → stop",
            caption: "The range [3, 3) is empty. The loop ends with lo = 3.",
          },
          {
            pointers: [{ name: "lo", at: 3 }],
            range: [3, 3],
            marked: [0, 1, 2, 4],
            action: "return 3",
            caption: "Index 3 is the first position whose value (7) is >= 6 — exactly where 6 would be inserted.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Three iterations on a 5-element array — each step halves the range.",
        source:
          "function firstAtLeast(nums, target) {\n" +
          "  let lo = 0;\n" +
          "  let hi = nums.length;\n" +
          "  while (lo < hi) {\n" +
          "    const mid = (lo + hi) >> 1;\n" +
          "    if (nums[mid] < target) lo = mid + 1; // boundary is strictly right of mid\n" +
          "    else hi = mid;                        // boundary is at mid or to its left\n" +
          "  }\n" +
          "  return lo;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "The range shrinks from 5 to 2 to 0 in three steps — **O(log n)** time, **O(1)** space. The same " +
          "skeleton, with the comparison swapped, gives the *upper* bound (first index `> target`), and the two " +
          "together bracket a value's full run.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Mixing the two loop shapes: `lo <= hi` pairs with `hi = mid - 1` (exact search); `lo < hi` pairs with `hi = mid` (boundary search). Crossing them either skips the answer or loops forever.",
          "Computing `mid` as `(lo + hi) / 2` without flooring — use `(lo + hi) >> 1` or `Math.floor` so `mid` is an integer index.",
          "On a boundary search, writing `hi = mid - 1` discards the very index you were trying to land on — `hi = mid` keeps the candidate alive.",
          "Re-checking a half you've already excluded (a linear fallback creeping in) silently degrades `O(log n)` back to `O(n)`.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty input — return the not-found sentinel (`-1`) or insertion index `0` before the loop body matters.",
          "Single element — the loop must handle a range of size 1 without dividing by zero or skipping it.",
          "Target smaller than every element (answer `0`) or larger than every element (answer `length`).",
          "Duplicates — decide whether you want the *first* or *last* matching index; an exact-match search lands on an arbitrary one.",
          "All elements equal to the target — the lower bound is `0` and the upper bound is `length`.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["search-insert-position", "search-in-rotated-sorted-array"],
        recommended: [
          "find-first-and-last-position-of-element-in-sorted-array",
          "cutting-wood",
          "median-of-two-sorted-arrays",
          "search-a-2d-matrix",
          "find-peak-element",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Binary search playlist", url: "https://neetcode.io/courses/advanced-algorithms/0", type: "video" },
          { label: "Tech Interview Handbook — Binary search cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/binary/", type: "article" },
          { label: "MDN — Array", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", type: "doc" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
