import { defineAlgoProblem } from "../problem";

export const maxSlidingWindow = defineAlgoProblem<[number[], number], number[]>({
  id: "sliding-window-maximum",
  number: 119,
  title: "Sliding Window Maximum",
  difficulty: "hard",
  tags: ["array", "queue", "sliding-window", "monotonic-stack", "heap-priority-queue"],
  functionName: "maxSlidingWindow",
  prompt: `Given an integer array \`nums\` and a window size \`k\`, a window of \`k\` consecutive elements slides from the left end of the array to the right, one position at a time.

Return an array of the **maximum** value in each window position, in order from left to right.`,
  constraints: [
    "1 <= nums.length <= 10^5",
    "1 <= k <= nums.length",
    "-10^4 <= nums[i] <= 10^4",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums: number[], k: number): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "classic", args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7], explanation: "The max of each of the six windows of width 3, slid left to right." },
    { name: "single window size", args: [[9, 11], 2], expected: [11] },
    { name: "k = 1", args: [[4, 2, 12, 11], 1], expected: [4, 2, 12, 11], explanation: "Each element is its own window." },
  ],
  hiddenTests: [
    { args: [[1], 1], expected: [1] },
    { args: [[5, 5, 5, 5], 2], expected: [5, 5, 5] },
    { args: [[1, 2, 3, 4, 5], 2], expected: [2, 3, 4, 5] },
    { args: [[5, 4, 3, 2, 1], 2], expected: [5, 4, 3, 2] },
    { args: [[5, 4, 3, 2, 1], 3], expected: [5, 4, 3] },
    { args: [[1, 2, 3, 4, 5], 5], expected: [5] },
    { args: [[-7, -8, 7, 5, 7, 1, 6, 0], 4], expected: [7, 7, 7, 7, 7] },
    { args: [[9, 10, 9, -7, -4, -8, 2, -6], 5], expected: [10, 10, 9, 2] },
    { args: [[-4, -3, -2, -1], 2], expected: [-3, -2, -1] },
    { args: [[7, 2, 4], 2], expected: [7, 4] },
    { args: [[1, 3, 1, 2, 0, 5], 3], expected: [3, 3, 2, 5] },
    { args: [[4, -2], 2], expected: [4] },
    // Scale: 10^5 increasing — each window max is its right edge; only O(n) deque survives.
    {
      args: [Array.from({ length: 100000 }, (_, i) => i), 1000],
      expected: Array.from({ length: 99001 }, (_, i) => i + 999),
    },
    // Scale: 10^5 decreasing — each window max is its left edge.
    {
      args: [Array.from({ length: 100000 }, (_, i) => 100000 - i), 1000],
      expected: Array.from({ length: 99001 }, (_, i) => 100000 - i),
    },
  ],
  source: { origin: "leetcode", frontendId: "239", acRate: 0.4711, confidence: 0.92 },
  solutions: [
    {
      name: "Monotonic decreasing deque",
      explanation: `A heap of window values would be \`O(n log k)\`; a monotonic deque does it in \`O(n)\`. Keep a deque of *indices* whose values are strictly decreasing from front to back, so the front index always holds the current window's maximum.

For each new index \`i\`: pop indices off the *back* while their value is \`<= nums[i]\` (they can never be the max while \`nums[i]\` is in the window, so they're dead weight), then push \`i\`. Pop the *front* index if it has slid out of the window (\`<= i - k\`). Once the first full window is formed (\`i >= k - 1\`), the value at the front index is that window's maximum.

Each index is pushed and popped at most once, so \`O(n)\` time, \`O(k)\` space for the deque.`,
      code: {
        javascript: `function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = []; // indices, values strictly decreasing front -> back
  for (let i = 0; i < nums.length; i++) {
    // Drop smaller-or-equal values from the back: they can't be a future max.
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    // Drop the front if it has slid out of the window.
    if (deque[0] <= i - k) deque.shift();
    // Once the first window is full, record the front (the window max).
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}`,
        typescript: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const deque: number[] = []; // indices, values strictly decreasing front -> back
  for (let i = 0; i < nums.length; i++) {
    // Drop smaller-or-equal values from the back: they can't be a future max.
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    // Drop the front if it has slid out of the window.
    if (deque[0] <= i - k) deque.shift();
    // Once the first window is full, record the front (the window max).
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}`,
      },
    },
  ],
});
