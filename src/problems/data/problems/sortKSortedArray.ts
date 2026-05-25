import { defineAlgoProblem } from "../problem";

export const sortKSortedArray = defineAlgoProblem<[number[], number], number[]>({
  id: "sort-a-k-sorted-array",
  number: 121,
  title: "Sort a K-Sorted Array",
  difficulty: "medium",
  tags: ["heap-priority-queue", "sorting", "array"],
  functionName: "sortKSortedArray",
  prompt: `You are given an integer array \`nums\` that is **almost sorted**: every element is at most \`k\` positions away from its correct position in the fully sorted order. Return the array fully sorted in **non-decreasing** order.

For example, with \`nums = [3, 1, 2, 5, 4]\` and \`k = 2\`, each value is within two slots of where it belongs, and the sorted result is \`[1, 2, 3, 4, 5]\`.

The point is to do better than a general sort by exploiting \`k\`: because no element travels more than \`k\` slots, the next-smallest element is always within the first \`k + 1\` of the unplaced elements. A min-heap of size \`k + 1\` therefore yields the sorted order in \`O(n log k)\` time.`,
  constraints: [
    "1 <= nums.length <= 10^5",
    "0 <= k < nums.length",
    "-10^9 <= nums[i] <= 10^9",
    "Each element is at most k positions away from its sorted position.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function sortKSortedArray(nums, k) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function sortKSortedArray(nums: number[], k: number): number[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "k = 2",
      args: [[3, 1, 2, 5, 4], 2],
      expected: [1, 2, 3, 4, 5],
      explanation: "Each value is within two positions of its sorted slot; a size-3 min-heap pops them in order.",
    },
    {
      name: "k = 1",
      args: [[2, 1, 4, 3, 6, 5], 1],
      expected: [1, 2, 3, 4, 5, 6],
      explanation: "Adjacent swaps only — k = 1 means each element is off by at most one slot.",
    },
    { name: "already sorted", args: [[1, 2, 3], 1], expected: [1, 2, 3] },
  ],
  hiddenTests: [
    { args: [[1], 0], expected: [1] },
    { args: [[2, 1], 1], expected: [1, 2] },
    { args: [[5, 4, 3, 2, 1], 4], expected: [1, 2, 3, 4, 5] },
    { args: [[1, 1, 1, 1], 2], expected: [1, 1, 1, 1] },
    { args: [[2, 1, 2, 1, 3, 3], 2], expected: [1, 1, 2, 2, 3, 3] },
    { args: [[-1, -3, -2, 0], 2], expected: [-3, -2, -1, 0] },
    { args: [[10, 9, 8, 7, 6, 5], 5], expected: [5, 6, 7, 8, 9, 10] },
    { args: [[4, 1, 2, 3, 7, 5, 6], 3], expected: [1, 2, 3, 4, 5, 6, 7] },
    { args: [[100, -100, 50, -50, 0], 4], expected: [-100, -50, 0, 50, 100] },
    { args: [[2, 3, 1, 5, 4, 7, 6], 2], expected: [1, 2, 3, 4, 5, 6, 7] },
    // Anti-naive / scale: large k-sorted array; O(n log k) finishes fast, a quadratic insertion sort is felt.
    {
      args: [(() => { const a = Array.from({ length: 5000 }, (_, i) => i); for (let i = 0; i + 1 < a.length; i += 2) { const t = a[i]; a[i] = a[i + 1]; a[i + 1] = t; } return a; })(), 1],
      expected: Array.from({ length: 5000 }, (_, i) => i),
    },
    // Scale with larger k window.
    {
      args: [(() => { const a = Array.from({ length: 4000 }, (_, i) => i); for (let i = 0; i + 3 < a.length; i += 4) { const t = a[i]; a[i] = a[i + 3]; a[i + 3] = t; } return a; })(), 3],
      expected: Array.from({ length: 4000 }, (_, i) => i),
    },
  ],
  source: { origin: "authored", confidence: 0.85 },
  solutions: [
    {
      name: "Size-(k+1) min-heap",
      explanation: `Because every element is at most \`k\` positions from its sorted spot, the smallest unplaced element is always among the first \`k + 1\` elements still in play. Maintain a min-heap of size \`k + 1\`: push the first \`k + 1\` elements, then for each remaining element pop the heap minimum (the next value in sorted order) and push the new element. After the scan, drain the heap.

A binary min-heap with sift-up / sift-down gives \`O(log k)\` push and pop, and we do \`O(n)\` of each — \`O(n log k)\` time. The heap holds at most \`k + 1\` elements, so \`O(k)\` extra space.`,
      code: {
        javascript: `function sortKSortedArray(nums, k) {
  // Min-heap as a binary heap over an array; heap[0] is always the minimum.
  const heap = [];
  const swap = (i, j) => { const t = heap[i]; heap[i] = heap[j]; heap[j] = t; };
  const up = (i) => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent] <= heap[i]) break;
      swap(parent, i);
      i = parent;
    }
  };
  const down = (i) => {
    const n = heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && heap[l] < heap[smallest]) smallest = l;
      if (r < n && heap[r] < heap[smallest]) smallest = r;
      if (smallest === i) break;
      swap(i, smallest);
      i = smallest;
    }
  };
  const push = (x) => { heap.push(x); up(heap.length - 1); };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length > 0) { heap[0] = last; down(0); }
    return top;
  };

  const result = [];
  const limit = Math.min(k + 1, nums.length);
  // Seed the heap with the first k+1 elements: the global minimum must be among them.
  for (let i = 0; i < limit; i++) push(nums[i]);
  // For each remaining element, the heap min is the next sorted value; swap it out for the newcomer.
  for (let i = limit; i < nums.length; i++) {
    result.push(pop());
    push(nums[i]);
  }
  // Drain whatever is left in sorted order.
  while (heap.length > 0) result.push(pop());
  return result;
}`,
        typescript: `function sortKSortedArray(nums: number[], k: number): number[] {
  // Min-heap as a binary heap over an array; heap[0] is always the minimum.
  const heap: number[] = [];
  const swap = (i: number, j: number): void => { const t = heap[i]; heap[i] = heap[j]; heap[j] = t; };
  const up = (i: number): void => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent] <= heap[i]) break;
      swap(parent, i);
      i = parent;
    }
  };
  const down = (i: number): void => {
    const n = heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && heap[l] < heap[smallest]) smallest = l;
      if (r < n && heap[r] < heap[smallest]) smallest = r;
      if (smallest === i) break;
      swap(i, smallest);
      i = smallest;
    }
  };
  const push = (x: number): void => { heap.push(x); up(heap.length - 1); };
  const pop = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) { heap[0] = last; down(0); }
    return top;
  };

  const result: number[] = [];
  const limit = Math.min(k + 1, nums.length);
  // Seed the heap with the first k+1 elements: the global minimum must be among them.
  for (let i = 0; i < limit; i++) push(nums[i]);
  // For each remaining element, the heap min is the next sorted value; swap it out for the newcomer.
  for (let i = limit; i < nums.length; i++) {
    result.push(pop());
    push(nums[i]);
  }
  // Drain whatever is left in sorted order.
  while (heap.length > 0) result.push(pop());
  return result;
}`,
      },
    },
  ],
});
