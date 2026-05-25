import { defineAlgoProblem } from "../problem";

// Multiple valid answers: any index whose value is strictly greater than both neighbors is a peak.
// The `checker` accepts any returned index that is genuinely a peak (treating out-of-bounds
// neighbors as -Infinity), rather than deep-equal against one reference index.
export const findPeakElement = defineAlgoProblem<[number[]], number>({
  id: "find-peak-element",
  number: 114,
  title: "Find Peak Element",
  difficulty: "medium",
  tags: ["array", "binary-search"],
  functionName: "findPeakElement",
  prompt: `A *peak element* is one that is strictly greater than its neighbors.

Given a 0-indexed integer array \`nums\`, find a peak element and return its index. If the array contains multiple peaks, return the index of **any** of them.

You may imagine that \`nums[-1] = nums[n] = -∞\` — that is, an out-of-bounds neighbor is treated as smaller than everything, so the first or last element only needs to beat its single real neighbor. Adjacent elements are always different. Your algorithm must run in \`O(log n)\` time.`,
  constraints: [
    "1 <= nums.length <= 1000",
    "-2^31 <= nums[i] <= 2^31 - 1",
    "nums[i] != nums[i + 1] for all valid i.",
  ],
  checker: `(actual, args) => {
    const nums = args[0];
    const n = nums.length;
    if (typeof actual !== "number" || actual < 0 || actual >= n) return false;
    const left = actual === 0 ? -Infinity : nums[actual - 1];
    const right = actual === n - 1 ? -Infinity : nums[actual + 1];
    return nums[actual] > left && nums[actual] > right;
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function findPeakElement(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function findPeakElement(nums: number[]): number {
  // your code here
}`,
  },
  examples: [
    { name: "single peak", args: [[1, 2, 3, 1]], expected: 2, explanation: "nums[2] = 3 is greater than both neighbors." },
    { name: "multiple peaks", args: [[1, 2, 1, 3, 5, 6, 4]], expected: 5, explanation: "Indices 1 and 5 are both peaks; either is accepted." },
    { name: "single element", args: [[1]], expected: 0, explanation: "A lone element has no real neighbors, so it is trivially a peak." },
  ],
  hiddenTests: [
    { name: "two ascending", args: [[1, 2]], expected: 1 },
    { name: "two descending", args: [[2, 1]], expected: 0 },
    { name: "peak at start", args: [[5, 4, 3, 2, 1]], expected: 0 },
    { name: "peak at end", args: [[1, 2, 3, 4, 5]], expected: 4 },
    { name: "peak in middle", args: [[1, 3, 2]], expected: 1 },
    { name: "negatives", args: [[-3, -2, -1, -5]], expected: 2 },
    { name: "all negative descending", args: [[-1, -2, -3]], expected: 0 },
    { name: "valley then peak", args: [[3, 1, 2, 4, 1]], expected: 3 },
    { name: "three with right peak", args: [[1, 2, 3]], expected: 2 },
    { name: "three with left peak", args: [[3, 2, 1]], expected: 0 },
    { name: "extremes", args: [[-2147483648, 2147483647]], expected: 1 },
    { name: "alternating", args: [[1, 5, 2, 6, 3, 7, 4]], expected: 5 },
    {
      name: "scale: strictly increasing 1000",
      args: [Array.from({ length: 1000 }, (_, i) => i)],
      expected: 999,
    },
    {
      name: "scale: zigzag 1000",
      args: [Array.from({ length: 1000 }, (_, i) => (i % 2 === 0 ? i : i + 1000))],
      expected: 999,
    },
  ],
  source: { origin: "leetcode", frontendId: "162", acRate: 0.4682, confidence: 0.95 },
  solutions: [
    {
      name: "Binary search toward the rising side",
      explanation: `Compare \`nums[mid]\` to its right neighbor \`nums[mid + 1]\`. If \`nums[mid] < nums[mid + 1]\` the slope rises to the right, so a peak must exist somewhere on the right — move \`lo\` past \`mid\`. Otherwise the slope falls (or \`mid\` is itself a peak), so a peak exists at \`mid\` or to its left — pull \`hi\` down to \`mid\`. Because out-of-bounds neighbors count as \`-∞\`, the boundary always slopes inward, guaranteeing the search converges on a real peak.

\`O(log n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function findPeakElement(nums) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
        typescript: `function findPeakElement(nums: number[]): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
      },
    },
  ],
});
