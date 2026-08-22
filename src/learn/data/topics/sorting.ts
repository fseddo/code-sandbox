import type { LearnTopic } from "@/learn/data/topic";

export const sorting = {
  slug: "sorting",
  title: "Sorting",
  category: "algorithms",
  summary: "Ordering by a comparator — comparison sorts bottom out at O(n log n); often the cheap first step that unlocks everything else.",
  tags: ["sorting", "divide-and-conquer", "heap-priority-queue", "array"],
  priority: "high",
  estimatedMinutes: 75,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Sorting arranges elements by a comparator, and **comparison sorts can't beat O(n log n)** — that bound " +
          "comes from the decision tree of pairwise comparisons needed to distinguish all `n!` orderings, not from " +
          "any particular algorithm's cleverness. **Merge sort** (stable, divide-and-conquer, O(n log n) " +
          "worst-case, O(n) extra space) and **quicksort** (in-place, O(n log n) average but O(n²) worst-case on " +
          "an adversarial pivot) both live at that bound; **heap sort** does too, trading quicksort's average-case " +
          "speed for a guaranteed worst case.\n\n" +
          "When the *values* being sorted are bounded integers rather than arbitrary comparable keys, **counting " +
          "sort** breaks the O(n log n) floor entirely — O(n + k) for a value range of size `k` — because it " +
          "never compares two elements to each other, it just buckets by value. `Array.prototype.sort` is " +
          "O(n log n) but sorts *lexicographically* by default, so pass a numeric comparator `(a, b) => a - b`.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Sorting is often the cheap first move that unlocks another pattern entirely — [[two-pointers]] pair-sum " +
          "scans, greedy interval scheduling, deduplication, and closest-pair reasoning all assume sorted input " +
          "before they even start. Reach for a *full* sort when you need every element in order; reach for a " +
          "*partial* sort — [[heaps]] or **quickselect** — when the question only asks for the top/bottom `k` or " +
          "a single rank statistic (\"the kth largest\"), since fully sorting to answer a one-element question " +
          "does more work than the question needs.\n\n" +
          "Recognize the pattern from phrasing like *\"sort the array\"*, *\"the kth largest/smallest\"*, *\"group " +
          "equal values together\"*, or *\"the array only contains values 0, 1, 2\"* — that last one is the tell " +
          "for a bounded-range problem where counting sort or three-way partitioning beats a general comparison " +
          "sort.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Quicksort (partition & conquer)** — pick a pivot, partition the array so everything less than the " +
          "pivot ends up left of it and everything greater ends up right, then recurse into each side. In place, " +
          "average O(n log n); a **randomized pivot** is what keeps that average case honest against adversarial " +
          "or already-sorted input, which would make a fixed-pivot choice degrade to O(n²).\n\n" +
          "**Merge sort (divide & conquer, stable)** — split the array in half, recursively sort each half, then " +
          "merge the two sorted halves with a single linear two-pointer pass. Guaranteed O(n log n) even in the " +
          "worst case, at the cost of O(n) auxiliary space for the merge buffer (or O(log n) extra recursion depth " +
          "on a linked list, where splicing needs no extra array). Stability (equal elements keep their relative " +
          "order) falls out for free, which quicksort doesn't guarantee.\n\n" +
          "**Quickselect (partial sort for a single rank)** — reuse quicksort's partition step, but after each " +
          "partition only recurse into the *one* side that contains the target rank, throwing the other side's " +
          "ordering work away entirely. Answers \"the kth largest/smallest\" in average O(n) instead of the O(n " +
          "log n) a full sort would cost.\n\n" +
          "**Counting sort (bucket by value, small range)** — when values are bounded integers in a small known " +
          "range, tally how many times each value occurs, then rebuild the sorted output by walking the tally in " +
          "order. O(n + k) time and space for a range of size `k`; no comparisons at all.\n\n" +
          "**Three-way partitioning (Dutch national flag)** — a single-pass in-place partition into exactly three " +
          "buckets (`< pivot`, `== pivot`, `> pivot`) using three pointers instead of two, so an array of only a " +
          "few distinct values sorts in one O(n) pass with O(1) space — no full comparison sort needed.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Relation to heaps and binary search",
        body:
          "[[heaps]] answer the same \"top/bottom k\" questions quickselect does, but incrementally and " +
          "online — a heap can report the current kth-largest at any point in a stream, while quickselect needs " +
          "the whole array up front and reshuffles it in place. For a one-shot \"kth largest of a fixed array\" " +
          "question they're complexity-equivalent (O(n) average for quickselect, O(n log k) for a size-k heap); " +
          "heaps win when the data arrives over time or k changes.\n\n" +
          "[[binary-search]] is sorting's most common downstream customer: once an array is sorted, membership " +
          "and boundary questions collapse from an O(n) scan to an O(log n) search. A surprising number of " +
          "\"binary search\" interview problems are really \"sort, then binary search\" in disguise.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The Lomuto partition — the reusable core of quicksort, quickselect, and the Dutch-flag family.",
        source:
          "function partition(nums, left, right) {\n" +
          "  // Randomize the pivot so a fixed choice (e.g. always the last element) can't be\n" +
          "  // adversarially defeated by already-sorted or reverse-sorted input.\n" +
          "  const randomIndex = left + Math.floor(Math.random() * (right - left + 1));\n" +
          "  [nums[randomIndex], nums[right]] = [nums[right], nums[randomIndex]];\n" +
          "  const pivot = nums[right];\n" +
          "\n" +
          "  let i = left; // next slot for a value <= pivot\n" +
          "  for (let j = left; j < right; j++) {\n" +
          "    if (nums[j] <= pivot) {\n" +
          "      [nums[i], nums[j]] = [nums[j], nums[i]];\n" +
          "      i++;\n" +
          "    }\n" +
          "  }\n" +
          "  [nums[i], nums[right]] = [nums[right], nums[i]]; // drop the pivot into its final slot\n" +
          "  return i; // the pivot's sorted-order index\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Merge sort's merge step** — the half most worth seeing frame by frame, since it's the piece that " +
          "actually does the ordering work (the split itself is trivial). Take `nums = [8, 3, 9, 1, 6, 4]`: split " +
          "into `[8, 3, 9]` and `[1, 6, 4]`, recursively sort each half on its own (that recursion bottoms out at " +
          "single elements, which are already \"sorted\"), leaving two sorted halves — `[3, 8, 9]` and `[1, 4, " +
          "6]` — to merge back together.",
      },
      {
        kind: "mergeWalkthrough",
        heading: "merging the two sorted halves [3, 8, 9] and [1, 4, 6]",
        lists: [
          { label: "left", values: [3, 8, 9] },
          { label: "right", values: [1, 4, 6] },
        ],
        frames: [
          {
            cursors: [0, 0],
            result: [],
            popped: 1,
            action: "compare 3 (left) vs 1 (right) → pop 1",
            caption: "1 is smaller than 3, so it becomes the first element of the merged output.",
          },
          {
            cursors: [0, 1],
            result: [1],
            popped: 0,
            action: "compare 3 (left) vs 4 (right) → pop 3",
            caption: "The right list's new head is 4 — bigger than the left list's 3 — so 3 goes next.",
          },
          {
            cursors: [1, 1],
            result: [1, 3],
            popped: 1,
            action: "compare 8 (left) vs 4 (right) → pop 4",
            caption: "4 is still smaller than the left list's head (8), so it's next.",
          },
          {
            cursors: [1, 2],
            result: [1, 3, 4],
            popped: 1,
            action: "compare 8 (left) vs 6 (right) → pop 6",
            caption: "6 is still smaller than 8 — pop it. That empties the right list.",
          },
          {
            cursors: [1, null],
            result: [1, 3, 4, 6],
            action: "right exhausted → drain left: 8, 9",
            caption: "Once one side runs out, the rest of the other side is already sorted — append it directly. Final: 1, 3, 4, 6, 8, 9.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Top-down merge sort — split, recurse, merge. O(n log n) time, O(n) space.",
        source:
          "function mergeSort(nums) {\n" +
          "  if (nums.length <= 1) return nums; // base case: already sorted\n" +
          "\n" +
          "  const mid = Math.floor(nums.length / 2);\n" +
          "  const left = mergeSort(nums.slice(0, mid));\n" +
          "  const right = mergeSort(nums.slice(mid));\n" +
          "  return merge(left, right);\n" +
          "}\n" +
          "\n" +
          "function merge(left, right) {\n" +
          "  const result = [];\n" +
          "  let i = 0, j = 0;\n" +
          "  // Walk both sorted halves, always taking the smaller current head.\n" +
          "  while (i < left.length && j < right.length) {\n" +
          "    if (left[i] <= right[j]) result.push(left[i++]);\n" +
          "    else result.push(right[j++]);\n" +
          "  }\n" +
          "  // One side is exhausted — the rest of the other side is already sorted.\n" +
          "  return result.concat(left.slice(i)).concat(right.slice(j));\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Splitting halves `log n` deep and merging each level in O(n) total work gives **O(n log n) time**; the " +
          "merge buffers cost **O(n) extra space** on top of the O(log n) recursion stack — the price merge sort " +
          "pays for a worst-case guarantee and stability that in-place quicksort can't promise.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**A fixed quicksort pivot on adversarial input.** Always picking the first/last element as the pivot " +
          "degrades to O(n²) on already-sorted or reverse-sorted input — an interviewer's favorite gotcha. " +
          "Randomize the pivot (or median-of-three) to defend against it.",
          "**Forgetting the default comparator sorts lexicographically.** `[10, 2, 1].sort()` returns `[1, 10, " +
          "2]`, not `[1, 2, 10]` — always pass a numeric comparator `(a, b) => a - b` for numbers.",
          "**Reaching for a full sort when only a partial one is asked for.** \"Find the kth largest\" only needs " +
          "quickselect's O(n) average or a size-k heap's O(n log k) — sorting the whole array first is O(n log " +
          "n) of wasted work on values you'll never look at again.",
          "**Assuming quicksort is stable.** It isn't — equal elements can be reordered by the partition swaps. " +
          "If relative order among equal keys matters, reach for merge sort instead.",
          "**Counting sort on an unbounded or sparse range.** Its O(n + k) bound only pays off when `k` (the " +
          "value range) is close to `n`; a range of a billion with ten actual elements allocates a billion-slot " +
          "array for nothing.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty array or single element — already sorted; the recursion/partition must terminate immediately " +
          "rather than looping or indexing out of bounds.",
          "All elements equal — a good stress test that a partition scheme doesn't infinite-loop or degrade to " +
          "O(n²) when every comparison ties.",
          "Already sorted or reverse sorted — the classic adversarial case for a non-randomized quicksort pivot; " +
          "a correct implementation should stay close to O(n log n) regardless.",
          "Duplicates clustered around the target rank — for quickselect/kth-largest problems, ties near `k` are " +
          "where an off-by-one in the partition boundary shows up.",
          "Negative numbers and zero mixed with positives — the comparator (and any counting-sort index offset) " +
          "must handle the full signed range, not just non-negative values.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["sort-an-array", "sort-colors"],
        recommended: ["kth-largest-element-in-an-array", "sort-list"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "Tech Interview Handbook — Algorithms cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", type: "article" },
          { label: "Wikipedia — Sorting algorithm", url: "https://en.wikipedia.org/wiki/Sorting_algorithm", type: "article" },
          { label: "Wikipedia — Quickselect", url: "https://en.wikipedia.org/wiki/Quickselect", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
