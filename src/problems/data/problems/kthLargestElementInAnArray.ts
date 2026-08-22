import { defineAlgoProblem } from "../problem";

// Deterministic pseudo-random generator (no Math.random) so the large scale case is reproducible —
// same trick as sortArray's LCG.
const pseudoRandomInts = (length: number, seed: number): number[] => {
  let state = seed;
  return Array.from({ length }, () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return (state % 20001) - 10000;
  });
};

const RANDOM_SCALE = pseudoRandomInts(8000, 7);
const RANDOM_SCALE_SORTED = [...RANDOM_SCALE].sort((a, b) => a - b);

// Large enough that a fixed-pivot (e.g. always-last-element) quickselect degrades to O(n^2) on this
// strictly descending input — every partition peels off just one element — while a randomized pivot
// resolves it comfortably within the budget. Same adversarial shape as sortArray's REVERSE_SORTED case.
const REVERSE_SORTED = Array.from({ length: 20000 }, (_, i) => 20000 - i);
const SORTED_ASCENDING = Array.from({ length: 20000 }, (_, i) => i + 1);

export const kthLargestElementInAnArray = defineAlgoProblem<[number[], number], number>({
  id: "kth-largest-element-in-an-array",
  number: 161,
  title: "Kth Largest Element in an Array",
  difficulty: "medium",
  tags: ["array", "sorting", "heap-priority-queue", "divide-and-conquer"],
  functionName: "findKthLargest",
  prompt: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\`th largest element in the array.

Rank by **sorted order, not distinct value** — if \`nums\` sorted in descending order is \`[6, 5, 5, 4, ...]\`, the 1st largest is \`6\`, the 2nd largest is \`5\`, and the 3rd largest is also \`5\` (the second copy), not \`4\`. Equivalently, it's the element that lands at index \`k - 1\` after sorting \`nums\` in descending order.

You must solve it without sorting the whole array whenever possible — a full \`O(n log n)\` sort works, but the intended solution runs faster on average.`,
  constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findKthLargest(nums, k) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findKthLargest(nums: number[], k: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "kth largest, no ties",
      args: [[3, 2, 1, 5, 6, 4], 2],
      expected: 5,
      explanation: "Sorted descending: [6, 5, 4, 3, 2, 1]. The 2nd largest is 5.",
    },
    {
      name: "kth largest, duplicates by position",
      args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4],
      expected: 4,
      explanation: "Sorted descending: [6, 5, 5, 4, 3, 3, 2, 2, 1]. The 4th position (index 3) holds 4, even though 5 appears twice.",
    },
  ],
  hiddenTests: [
    // Boundary
    { name: "single element, k=1", args: [[7], 1], expected: 7 },
    { name: "k=1 returns the max", args: [[9, 3, 7, 1, 8, 2], 1], expected: 9 },
    { name: "k=length returns the min", args: [[9, 3, 7, 1, 8, 2], 6], expected: 1 },
    // Edge — duplicates clustered around the target rank. Descending: [8, 8, 4, 4, 4, 4, 2, 2] —
    // the 3rd position is the first of the run of four 4s, the 6th is the last of that run.
    { name: "duplicates clustered around target rank", args: [[4, 4, 4, 4, 2, 2, 8, 8], 3], expected: 4 },
    { name: "duplicates clustered, later position", args: [[4, 4, 4, 4, 2, 2, 8, 8], 6], expected: 4 },
    { name: "all elements equal", args: [[5, 5, 5, 5, 5], 3], expected: 5 },
    { name: "negatives only", args: [[-3, -1, -7, -4, -2], 2], expected: -2 },
    { name: "mixed positive and negative", args: [[-10, 4, -1, 0, 7, -3, 2], 5], expected: -1 },
    // Adversarial for a non-randomized (fixed-pivot) partition
    { name: "already sorted ascending, mid k", args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: 5 },
    { name: "already sorted descending, small k", args: [[9, 8, 7, 6, 5, 4, 3, 2, 1], 4], expected: 6 },
    // Structural
    { name: "two elements", args: [[10, 20], 1], expected: 20 },
    { name: "unrelated random-looking input", args: [[15, -2, 47, 3, 0, 9, -21, 33, 8], 3], expected: 15 },
    // Scale / adversarial
    {
      name: "large strictly descending input, adversarial for a fixed-pivot partition",
      args: [REVERSE_SORTED, 5],
      expected: 19996,
    },
    {
      name: "large strictly ascending input, mid k",
      args: [SORTED_ASCENDING, 10000],
      expected: SORTED_ASCENDING.length - 10000 + 1,
    },
    {
      name: "large pseudo-random input",
      args: [RANDOM_SCALE, 1234],
      expected: RANDOM_SCALE_SORTED[RANDOM_SCALE_SORTED.length - 1234],
    },
  ],
  source: { origin: "leetcode", frontendId: "215", acRate: 0.68, confidence: 0.92 },
  solutions: [
    {
      name: "Quickselect (randomized partition)",
      explanation: `Sorting the whole array to answer "what's the kth largest" is \`O(n log n)\` but wasteful — we don't actually need the other elements in order, just the one at the target rank. **Quickselect** adapts quicksort's partition step to find a single rank in expected \`O(n)\` time: partition around a pivot, then — unlike quicksort — recurse into **only the side that contains the target index**, discarding the other side entirely.

The kth largest is the element at index \`nums.length - k\` once the array is sorted **ascending**, so the algorithm is really "find the element at that index" (a selection problem), phrased with a target rank rather than a target value.

Partitioning: pick a **random** pivot index (swapped to the end), then do a Lomuto-style single pass, moving every element \`<= pivot\` into a growing prefix. The pivot lands at \`boundary\`, its final sorted position. If \`boundary\` equals the target index, that's the answer; otherwise recurse into the half — left or right — that contains the target index, and only that half.

Randomizing the pivot matters for the same reason it does in \`sort-an-array\`: a fixed pivot choice (e.g. always the last element) has an input that defeats it — an already-sorted or reverse-sorted array makes every partition peel off just one element, degrading to \`O(n^2)\`. A random pivot makes that adversarial case vanishingly unlikely regardless of the input's initial order.

Expected \`O(n)\` time (the classic argument: each partition pass is \`O(range size)\` and the range shrinks by a constant factor on average, geometric series sums to \`O(n)\`), \`O(1)\` extra space (in-place, iterative — no recursion stack growth since only one side is ever explored).`,
      code: {
        javascript: `function findKthLargest(nums, k) {
  // The kth largest is the element that ends up at this index once nums is sorted ascending.
  const targetIndex = nums.length - k;
  return quickselect(nums, 0, nums.length - 1, targetIndex);
}

// Finds the value that belongs at nums[targetIndex] if nums[low..high] were fully sorted,
// without sorting the whole range — only ever recurses into the side containing targetIndex.
function quickselect(nums, low, high, targetIndex) {
  while (true) {
    if (low === high) return nums[low];

    const pivotIndex = partition(nums, low, high);
    if (pivotIndex === targetIndex) return nums[pivotIndex];
    if (targetIndex < pivotIndex) {
      high = pivotIndex - 1;
    } else {
      low = pivotIndex + 1;
    }
  }
}

// Lomuto partition around a randomly chosen pivot. Returns the pivot's final (sorted) index.
function partition(nums, low, high) {
  const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
  swap(nums, randomIndex, high);
  const pivotValue = nums[high];

  let boundary = low;
  for (let i = low; i < high; i++) {
    if (nums[i] <= pivotValue) {
      swap(nums, i, boundary);
      boundary++;
    }
  }
  swap(nums, boundary, high);
  return boundary;
}

function swap(nums, i, j) {
  const temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}`,
        typescript: `function findKthLargest(nums: number[], k: number): number {
  // The kth largest is the element that ends up at this index once nums is sorted ascending.
  const targetIndex = nums.length - k;
  return quickselect(nums, 0, nums.length - 1, targetIndex);
}

// Finds the value that belongs at nums[targetIndex] if nums[low..high] were fully sorted,
// without sorting the whole range — only ever recurses into the side containing targetIndex.
function quickselect(nums: number[], low: number, high: number, targetIndex: number): number {
  while (true) {
    if (low === high) return nums[low];

    const pivotIndex = partition(nums, low, high);
    if (pivotIndex === targetIndex) return nums[pivotIndex];
    if (targetIndex < pivotIndex) {
      high = pivotIndex - 1;
    } else {
      low = pivotIndex + 1;
    }
  }
}

// Lomuto partition around a randomly chosen pivot. Returns the pivot's final (sorted) index.
function partition(nums: number[], low: number, high: number): number {
  const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
  swap(nums, randomIndex, high);
  const pivotValue = nums[high];

  let boundary = low;
  for (let i = low; i < high; i++) {
    if (nums[i] <= pivotValue) {
      swap(nums, i, boundary);
      boundary++;
    }
  }
  swap(nums, boundary, high);
  return boundary;
}

function swap(nums: number[], i: number, j: number): void {
  const temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}`,
      },
    },
    {
      name: "Min-heap of size k",
      explanation: `Walk the array maintaining a **min-heap capped at size \`k\`**: push each value, and whenever the heap exceeds \`k\` elements, pop the smallest. After processing every element, the heap holds exactly the \`k\` largest values seen, and its root (the smallest of that set) is the kth largest overall.

This avoids mutating the input (unlike quickselect's in-place partitioning) and is a natural fit when \`nums\` arrives as a stream rather than a fixed array. \`O(n log k)\` time, \`O(k)\` extra space — better than quickselect's \`O(n)\` average when \`k\` is small relative to \`n\`, worse when \`k\` is close to \`n\`.`,
      code: {
        javascript: `function findKthLargest(nums, k) {
  const heap = []; // binary min-heap, stored as an array; heap[0] is always the smallest element in it

  // Restore the heap property upward from index: swap a too-small value up past its larger parents.
  const siftUp = (index) => {
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (heap[parent] <= heap[index]) break; // parent already smaller — heap property holds
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  };

  // Restore the heap property downward from index: swap a too-large value down past its smaller children.
  const siftDown = (index) => {
    const size = heap.length;
    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let smallest = index;
      if (left < size && heap[left] < heap[smallest]) smallest = left;
      if (right < size && heap[right] < heap[smallest]) smallest = right;
      if (smallest === index) break; // already smaller than both children — done
      [heap[smallest], heap[index]] = [heap[index], heap[smallest]];
      index = smallest;
    }
  };

  for (const value of nums) {
    // Add the value, then evict the current minimum the instant the heap grows past k —
    // this keeps only the k largest values seen so far, never more.
    heap.push(value);
    siftUp(heap.length - 1);
    if (heap.length > k) {
      heap[0] = heap[heap.length - 1]; // move the last leaf to the root...
      heap.pop();
      siftDown(0); // ...then sift it down to restore the heap property
    }
  }

  // The heap holds exactly the k largest values; its root is the smallest of that set — the kth largest overall.
  return heap[0];
}`,
        typescript: `function findKthLargest(nums: number[], k: number): number {
  const heap: number[] = []; // binary min-heap, stored as an array; heap[0] is always the smallest element in it

  // Restore the heap property upward from index: swap a too-small value up past its larger parents.
  const siftUp = (index: number): void => {
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (heap[parent] <= heap[index]) break; // parent already smaller — heap property holds
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  };

  // Restore the heap property downward from index: swap a too-large value down past its smaller children.
  const siftDown = (index: number): void => {
    const size = heap.length;
    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let smallest = index;
      if (left < size && heap[left] < heap[smallest]) smallest = left;
      if (right < size && heap[right] < heap[smallest]) smallest = right;
      if (smallest === index) break; // already smaller than both children — done
      [heap[smallest], heap[index]] = [heap[index], heap[smallest]];
      index = smallest;
    }
  };

  for (const value of nums) {
    // Add the value, then evict the current minimum the instant the heap grows past k —
    // this keeps only the k largest values seen so far, never more.
    heap.push(value);
    siftUp(heap.length - 1);
    if (heap.length > k) {
      heap[0] = heap[heap.length - 1]; // move the last leaf to the root...
      heap.pop();
      siftDown(0); // ...then sift it down to restore the heap property
    }
  }

  // The heap holds exactly the k largest values; its root is the smallest of that set — the kth largest overall.
  return heap[0];
}`,
      },
    },
  ],
});
