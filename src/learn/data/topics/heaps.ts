import type { LearnTopic } from "@/learn/data/topic";

export const heaps = {
  slug: "heaps",
  title: "Heaps & priority queues",
  category: "data-structures",
  summary: "O(1) peek at the min/max, O(log n) insert/extract — the structure for 'top-k' and scheduling.",
  tags: ["heap-priority-queue"],
  priority: "high",
  estimatedMinutes: 90,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A *binary heap* is a **complete** binary tree — every level full except possibly the last, which fills " +
          "left to right — kept in an array, where each parent sits at index `i` and its children at `2i + 1` and " +
          "`2i + 2`. It maintains the **heap invariant**: each parent is ≤ both children (a **min-heap**) or ≥ both " +
          "(a **max-heap**). That single ordering rule is *weaker* than a full sort, which is exactly the point — it " +
          "costs only **O(log n)** to restore after a change, yet always leaves the extreme element sitting at the root.\n\n" +
          "So a heap gives **O(1)** access to the smallest (or largest) element and **O(log n)** insert and extract. " +
          "It is the standard implementation of a *priority queue*: a queue whose `pop` returns the highest-priority " +
          "item rather than the oldest.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "peek (min / max)", average: "O(1)", worst: "O(1)", note: "The extreme element is always the root, at index 0." },
          { operation: "push (insert)", average: "O(log n)", worst: "O(log n)", note: "Append at the end, then sift up to restore the invariant." },
          { operation: "pop (extract extreme)", average: "O(log n)", worst: "O(log n)", note: "Swap root with the last leaf, drop it, then sift down." },
          { operation: "heapify (build from array)", average: "O(n)", worst: "O(n)", note: "Sift down from the last internal node up — tighter than n inserts." },
          { operation: "search (arbitrary value)", average: "O(n)", worst: "O(n)", note: "A heap orders only parent vs. child — no order between siblings." },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a heap when you repeatedly need the smallest or largest of a *changing* set — the cue is a prompt " +
          "asking for the **top-k**, the **kth largest/smallest**, a **running median**, or a **merge of k sorted " +
          "sequences**, especially when elements arrive over time so you can't sort once up front. If you only need " +
          "the order *once* over a fixed input, a single sort is simpler and usually faster in practice. The heap " +
          "earns its keep when extractions and insertions interleave.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Top-k with a bounded heap** — to keep the `k` largest elements, hold a **min**-heap of size `k`: push " +
          "each element and, whenever the heap exceeds `k`, pop the smallest. The root is then the weakest of your " +
          "current best, so anything smaller is rejected in O(log k). (Symmetrically, a max-heap of size `k` keeps " +
          "the `k` smallest.) This is O(n log k) — cheaper than sorting when `k ≪ n`.\n\n" +
          "**k-way merge** — to merge `k` sorted lists, seed a min-heap with the head of each list, then repeatedly " +
          "pop the global minimum and push the next element from the list it came from. Each pop is O(log k).\n\n" +
          "**Two heaps (balanced halves)** — to track a *running median*, keep a max-heap of the smaller half and a " +
          "min-heap of the larger half, rebalanced so their sizes differ by at most one. The median is read off the " +
          "tops in O(1), with O(log n) inserts.\n\n" +
          "**Lazy deletion** — heaps don't support removing an arbitrary element cheaply, so mark entries stale and " +
          "skip them when they surface at the top, rather than searching the heap to delete in place.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Heaps vs. sorting and other ordered structures",
        body:
          "A heap is the lightweight middle ground between an unordered array and a fully [[sorting|sorted]] one: it " +
          "pays O(log n) per change to keep *only* the extreme element findable, where a sorted array pays O(n) to " +
          "keep *everything* in order. When you need ordered iteration or range queries — not just the extreme — a " +
          "balanced BST or a sorted structure is the better fit. A heap also underpins **Dijkstra's** shortest paths " +
          "(a priority queue of frontier nodes) and **heapsort** (build a heap, then pop n times for O(n log n)).",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "A min-heap over an array: push sifts up, pop swaps the root with the last leaf and sifts down.",
        source:
          "class MinHeap {\n" +
          "  constructor() { this.data = []; }\n" +
          "  peek() { return this.data[0]; }\n" +
          "  size() { return this.data.length; }\n" +
          "  push(x) {\n" +
          "    this.data.push(x);                 // append at the next open leaf\n" +
          "    let i = this.data.length - 1;\n" +
          "    while (i > 0) {                     // sift up while smaller than its parent\n" +
          "      const parent = (i - 1) >> 1;\n" +
          "      if (this.data[parent] <= this.data[i]) break;\n" +
          "      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];\n" +
          "      i = parent;\n" +
          "    }\n" +
          "  }\n" +
          "  pop() {\n" +
          "    const top = this.data[0];\n" +
          "    const last = this.data.pop();\n" +
          "    if (this.data.length > 0) {\n" +
          "      this.data[0] = last;              // move the last leaf to the root\n" +
          "      let i = 0;\n" +
          "      const n = this.data.length;\n" +
          "      while (true) {                    // sift down toward the smaller child\n" +
          "        let smallest = i, l = 2 * i + 1, r = 2 * i + 2;\n" +
          "        if (l < n && this.data[l] < this.data[smallest]) smallest = l;\n" +
          "        if (r < n && this.data[r] < this.data[smallest]) smallest = r;\n" +
          "        if (smallest === i) break;\n" +
          "        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];\n" +
          "        i = smallest;\n" +
          "      }\n" +
          "    }\n" +
          "    return top;\n" +
          "  }\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Kth largest element** — given an unsorted array, find the *k*th largest value (here `k = 3`). Sorting " +
          "the whole array is O(n log n) and discards most of the work. Instead keep a **min-heap of size k**: scan " +
          "the array, push each value, and whenever the heap holds more than `k` elements pop the smallest. The heap " +
          "always retains the `k` largest seen so far, and its *root* is the smallest of those — which, once the scan " +
          "ends, is exactly the *k*th largest.",
      },
      {
        kind: "walkthrough",
        heading: "nums = [3, 2, 1, 5, 6, 4], k = 3 — min-heap of size 3, root is the kth largest",
        lane: [3, 2, 1, 5, 6, 4],
        showIndices: true,
        frames: [
          {
            pointers: [{ name: "scan", at: 2 }],
            range: [0, 2],
            action: "push 3, 2, 1 → heap {1, 2, 3}",
            caption: "First three elements fill the heap. Its root (the min) is 1.",
          },
          {
            pointers: [{ name: "scan", at: 3 }],
            action: "push 5 → {1,2,3,5}, size 4 > 3 → pop 1 → {2,3,5}",
            caption: "5 enters; the heap overflows, so evict the smallest (1). Root is now 2.",
          },
          {
            pointers: [{ name: "scan", at: 4 }],
            action: "push 6 → {2,3,5,6}, pop 2 → {3,5,6}",
            caption: "6 is bigger than the root, so it belongs in the top 3; evict 2. Root is now 3.",
          },
          {
            pointers: [{ name: "scan", at: 5 }],
            action: "push 4 → {3,4,5,6}, pop 3 → {4,5,6}",
            caption: "4 beats the root 3, so it joins and 3 is evicted. Root is now 4.",
          },
          {
            action: "scan done → root = 4",
            caption: "The heap holds the three largest {4, 5, 6}; its root, 4, is the 3rd largest. Answer: 4.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Each of n elements does at most one O(log k) push/pop — O(n log k) time, O(k) space.",
        source:
          "function findKthLargest(nums, k) {\n" +
          "  const heap = new MinHeap();          // keeps the k largest seen so far\n" +
          "  for (const x of nums) {\n" +
          "    heap.push(x);\n" +
          "    if (heap.size() > k) heap.pop();   // drop the smallest — it's not in the top k\n" +
          "  }\n" +
          "  return heap.peek();                  // root = smallest of the k largest = kth largest\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "The heap never holds more than `k` elements, so each push/pop is **O(log k)** and the whole scan is " +
          "**O(n log k)** time with **O(k)** space — strictly better than the O(n log n) full sort when `k ≪ n`, and " +
          "it works even if the numbers arrive as a stream you can't re-read.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Using the **wrong polarity**: keeping the `k` *largest* needs a **min**-heap (so you can cheaply drop the smallest), not a max-heap. Getting this backwards is the classic top-k bug.",
          "Forgetting to pop after pushing on a bounded heap — the heap grows past `k` and you lose the O(log k) bound (and may return the wrong element).",
          "Assuming a heap is sorted. It orders only parent-vs-child; iterating the backing array does **not** yield sorted order, and siblings have no defined order.",
          "Reaching for a heap when a single sort suffices. If the input is fixed and you need the full order once, sorting is simpler and often faster.",
          "Trying to delete or update an arbitrary element in place — that's O(n) to find. Use lazy deletion (mark stale, skip at the top) instead.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty input — `peek`/`pop` on an empty heap; guard before reading the root.",
          "`k` larger than (or equal to) the number of elements — the whole set qualifies; no eviction happens.",
          "Duplicate values — heaps handle them fine, but a top-k count may need a tie-break rule (e.g. lexicographic) for a deterministic result.",
          "A single element, or all elements equal.",
          "Even vs. odd counts for a running median — the even case averages the two middle values.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["merge-k-sorted-lists", "k-most-frequent-strings"],
        recommended: ["median-of-an-integer-stream", "sort-a-k-sorted-array"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Heap / Priority Queue practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Heap cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/heap/", type: "article" },
          { label: "MDN — Working with binary heaps (Array)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", type: "doc" },
          { label: "VisuAlgo — Binary heap visualization", url: "https://visualgo.net/en/heap", type: "doc" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
