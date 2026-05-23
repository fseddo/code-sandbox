import { defineAlgoProblem } from "../problem";

export const maxSubArray = defineAlgoProblem<[number[]], number>({
  id: "maximum-subarray",
  number: 61,
  title: "Maximum Subarray",
  difficulty: "medium",
  tags: ["array", "divide-and-conquer", "dynamic-programming"],
  functionName: "maxSubArray",
  prompt: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) with the largest sum, and return that sum.

A subarray is a contiguous, non-empty slice of the array.`,
  constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums: number[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "mixed",
      args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
      expected: 6,
      explanation: "The subarray [4, -1, 2, 1] has the largest sum, 6.",
    },
    { name: "single", args: [[1]], expected: 1 },
    { name: "all positive", args: [[5, 4, -1, 7, 8]], expected: 23, explanation: "The whole array is the best subarray." },
  ],
  hiddenTests: [
    { args: [[-1]], expected: -1 },
    { args: [[-2, -1]], expected: -1 },
    { args: [[-3, -2, -5, -1, -4]], expected: -1 },
    { args: [[0]], expected: 0 },
    { args: [[1, 2, 3, 4, 5]], expected: 15 },
    { args: [[-1, -2, -3, 10]], expected: 10 },
    { args: [[10, -1, -2, -3]], expected: 10 },
    { args: [[2, -1, 2, -1, 2]], expected: 4 },
    { args: [[-2, -3, 4, -1, -2, 1, 5, -3]], expected: 7 },
    { args: [[8, -19, 5, -4, 20]], expected: 21 },
    { args: [[-10000, 10000, -10000, 10000]], expected: 10000 },
    { args: [[1, -1, 1, -1, 1, -1, 1]], expected: 1 },
    // Scale: 100k elements; Kadane is O(n) and finishes well under budget.
    {
      args: [Array.from({ length: 100000 }, (_, i) => ((i * 31 + 7) % 2001) - 1000)],
      expected: (() => {
        const a = Array.from({ length: 100000 }, (_, i) => ((i * 31 + 7) % 2001) - 1000);
        let best = a[0];
        let cur = a[0];
        for (let i = 1; i < a.length; i++) {
          cur = Math.max(a[i], cur + a[i]);
          best = Math.max(best, cur);
        }
        return best;
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "53", acRate: 0.5331606688682284, confidence: 0.97 },
  solutions: [
    {
      name: "Kadane's algorithm",
      explanation: `Scan left to right keeping the best subarray sum ending at the current index: either extend the previous running sum or start fresh at the current element, whichever is larger. The overall answer is the maximum running sum seen. Starting both trackers at \`nums[0]\` handles the all-negative case correctly.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function maxSubArray(nums) {
  let best = nums[0];
  let cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
        typescript: `function maxSubArray(nums: number[]): number {
  let best = nums[0];
  let cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
      },
    },
  ],
});
