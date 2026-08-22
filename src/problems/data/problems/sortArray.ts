import { defineAlgoProblem } from "../problem";

// Deterministic pseudo-random generator (no Math.random) so the large scale case is reproducible —
// same trick as sortColors' `(i * 7) % 3` pattern, extended to cover the full value range.
const pseudoRandomInts = (length: number, seed: number): number[] => {
  let state = seed;
  return Array.from({ length }, () => {
    // Simple LCG; the modulus/shift constants just need to spread values across the range.
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return (state % 100001) - 50000;
  });
};

// Large enough that a naive recursive quicksort that always picks a fixed pivot (e.g. the last
// element) blows the call stack on this descending input (each partition peels off just one
// element, so recursion depth tracks array length) — confirmed empirically against a fixed-pivot
// implementation. A randomized pivot keeps recursion depth ~O(log n) and sorts this instantly.
const REVERSE_SORTED = Array.from({ length: 20000 }, (_, i) => 20000 - i);
const RANDOM_SCALE = pseudoRandomInts(6000, 42);

export const sortArray = defineAlgoProblem<[number[]], number[]>({
  id: "sort-an-array",
  number: 160,
  title: "Sort an Array",
  difficulty: "medium",
  tags: ["array", "sorting", "divide-and-conquer"],
  functionName: "sortArray",
  prompt: `Given an integer array \`nums\`, sort it in ascending (non-decreasing) order and return the sorted array.

You may not call a built-in sort — implement the sorting yourself. This problem exists to exercise a comparison-based sort (quicksort, mergesort, heapsort, …) from scratch rather than to test whether you know a library function.`,
  constraints: ["1 <= nums.length <= 5 * 10^4", "-5 * 10^4 <= nums[i] <= 5 * 10^4"],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function sortArray(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function sortArray(nums: number[]): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "unsorted", args: [[5, 2, 3, 1]], expected: [1, 2, 3, 5] },
    {
      name: "duplicates",
      args: [[5, 1, 1, 2, 0, 0]],
      expected: [0, 0, 1, 1, 2, 5],
      explanation: "Repeated values (1s and 0s) stay adjacent in the sorted output.",
    },
    {
      name: "negatives",
      args: [[-3, 0, -1, 2, -2]],
      expected: [-3, -2, -1, 0, 2],
      explanation: "Negative and non-negative values sort together on one number line.",
    },
  ],
  hiddenTests: [
    // Boundary
    { name: "single element", args: [[5]], expected: [5] },
    { name: "min and max values", args: [[-50000, 50000, 0]], expected: [-50000, 0, 50000] },
    // Edge
    { name: "already sorted", args: [[1, 2, 3, 4, 5, 6]], expected: [1, 2, 3, 4, 5, 6] },
    { name: "all equal", args: [[7, 7, 7, 7, 7, 7]], expected: [7, 7, 7, 7, 7, 7] },
    { name: "negatives mixed with positives", args: [[-5, 3, -1, 0, 2, -3, 10, -10]], expected: [-10, -5, -3, -1, 0, 2, 3, 10] },
    { name: "scattered duplicates", args: [[4, 1, 4, 2, 1, 4, 2, 0]], expected: [0, 1, 1, 2, 2, 4, 4, 4] },
    // Structural
    { name: "two elements, unsorted", args: [[2, 1]], expected: [1, 2] },
    { name: "one out-of-place value at the end", args: [[0, 2, 3, 4, 5, 6, 7, 8, 9, -5]], expected: [-5, 0, 2, 3, 4, 5, 6, 7, 8, 9] },
    { name: "one out-of-place value at the start", args: [[8, 1, 2, 3, 4, 5, 6, 7]], expected: [1, 2, 3, 4, 5, 6, 7, 8] },
    // Anti-hardcode
    { name: "unrelated random-looking input", args: [[37, -12, 84, 0, 5, -47, 23, 9, -1]], expected: [-47, -12, -1, 0, 5, 9, 23, 37, 84] },
    // Scale / adversarial — strictly descending is the classic input that drives a fixed-pivot
    // (e.g. always-last-element) quicksort to O(n^2) time and O(n) recursion depth; a randomized
    // pivot keeps this at expected O(n log n) time and O(log n) depth.
    { name: "reverse-sorted, adversarial for a fixed-pivot quicksort", args: [REVERSE_SORTED], expected: [...REVERSE_SORTED].sort((a, b) => a - b) },
    { name: "large random input", args: [RANDOM_SCALE], expected: [...RANDOM_SCALE].sort((a, b) => a - b) },
  ],
  source: { origin: "leetcode", frontendId: "912", acRate: 0.6, confidence: 0.9 },
  solutions: [
    {
      name: "Randomized quicksort",
      explanation: `Classic in-place quicksort, with one twist that matters: **the pivot is chosen at random** on every partition call, rather than always taking (say) the last element.

Why randomize: a fixed pivot choice has an input that defeats it — e.g. always picking the last element makes an already-sorted or reverse-sorted array degrade to \`O(n^2)\` time and \`O(n)\` recursion depth, because every partition splits off just one element. Randomizing the pivot means no single input can reliably trigger the bad case; the expected behavior is \`O(n log n)\` time and \`O(log n)\` recursion depth regardless of the input's initial order.

The partition step (Lomuto scheme here) picks a random index, swaps that value to the end so it can be treated uniformly as "the pivot", then walks the range once, swapping every element \`<= pivot\` into a growing prefix. The pivot is swapped into place right after the prefix, splitting the range into "everything \`<=\` pivot" and "everything \`>\` pivot" — recursing on both sides sorts the whole array.

\`O(n log n)\` expected time, \`O(log n)\` expected extra space (recursion stack); worst case \`O(n^2)\` time is possible but astronomically unlikely with a random pivot.`,
      code: {
        javascript: `function sortArray(nums) {
  quicksort(nums, 0, nums.length - 1);
  return nums;
}

// Sorts nums[low..high] in place (inclusive bounds).
function quicksort(nums, low, high) {
  if (low >= high) return; // 0 or 1 elements: already sorted

  const pivotIndex = partition(nums, low, high);
  quicksort(nums, low, pivotIndex - 1);
  quicksort(nums, pivotIndex + 1, high);
}

// Lomuto partition around a randomly chosen pivot. Returns the pivot's final index.
function partition(nums, low, high) {
  // Pick a random pivot in [low, high] and move it to the end so the rest of the
  // routine can partition against a known position — this is what defeats any
  // input crafted to break a fixed pivot choice.
  const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
  swap(nums, randomIndex, high);
  const pivotValue = nums[high];

  // boundary tracks the end of the "<= pivot" region built so far.
  let boundary = low;
  for (let i = low; i < high; i++) {
    if (nums[i] <= pivotValue) {
      swap(nums, i, boundary);
      boundary++;
    }
  }
  // Drop the pivot into place right after everything <= it.
  swap(nums, boundary, high);
  return boundary;
}

function swap(nums, i, j) {
  const temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}`,
        typescript: `function sortArray(nums: number[]): number[] {
  quicksort(nums, 0, nums.length - 1);
  return nums;
}

// Sorts nums[low..high] in place (inclusive bounds).
function quicksort(nums: number[], low: number, high: number): void {
  if (low >= high) return; // 0 or 1 elements: already sorted

  const pivotIndex = partition(nums, low, high);
  quicksort(nums, low, pivotIndex - 1);
  quicksort(nums, pivotIndex + 1, high);
}

// Lomuto partition around a randomly chosen pivot. Returns the pivot's final index.
function partition(nums: number[], low: number, high: number): number {
  // Pick a random pivot in [low, high] and move it to the end so the rest of the
  // routine can partition against a known position — this is what defeats any
  // input crafted to break a fixed pivot choice.
  const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
  swap(nums, randomIndex, high);
  const pivotValue = nums[high];

  // boundary tracks the end of the "<= pivot" region built so far.
  let boundary = low;
  for (let i = low; i < high; i++) {
    if (nums[i] <= pivotValue) {
      swap(nums, i, boundary);
      boundary++;
    }
  }
  // Drop the pivot into place right after everything <= it.
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
  ],
});
