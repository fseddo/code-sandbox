import { defineAlgoProblem } from "../problem";

export const searchRange = defineAlgoProblem<[number[], number], number[]>({
  id: "find-first-and-last-position-of-element-in-sorted-array",
  number: 43,
  title: "Find First and Last Position of Element in Sorted Array",
  difficulty: "medium",
  tags: ["array", "binary-search"],
  functionName: "searchRange",
  prompt: `Given an array \`nums\` sorted in non-decreasing order and a \`target\`, return the starting and ending index of \`target\` as a two-element array \`[first, last]\`.

If \`target\` is not in the array, return \`[-1, -1]\`. Your algorithm must run in \`O(log n)\` time.`,
  constraints: [
    "0 <= nums.length <= 10^5",
    "-10^9 <= nums[i] <= 10^9",
    "nums is sorted in non-decreasing order.",
    "-10^9 <= target <= 10^9",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function searchRange(nums, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function searchRange(nums: number[], target: number): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "range", args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4], explanation: "8 spans indices 3 through 4." },
    { name: "absent", args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
    { name: "empty", args: [[], 0], expected: [-1, -1] },
  ],
  hiddenTests: [
    { name: "single hit", args: [[1], 1], expected: [0, 0] },
    { name: "single miss", args: [[1], 2], expected: [-1, -1] },
    { name: "all same", args: [[2, 2, 2, 2], 2], expected: [0, 3] },
    { name: "at start", args: [[3, 3, 5, 9], 3], expected: [0, 1] },
    { name: "at end", args: [[1, 4, 9, 9], 9], expected: [2, 3] },
    { name: "below all", args: [[1, 2, 3], 0], expected: [-1, -1] },
    { name: "above all", args: [[1, 2, 3], 4], expected: [-1, -1] },
    { name: "gap miss", args: [[1, 2, 4, 5], 3], expected: [-1, -1] },
    { name: "negatives", args: [[-5, -5, -3, 0, 0, 0, 2], 0], expected: [3, 5] },
    { name: "single occurrence middle", args: [[1, 2, 3, 4, 5], 3], expected: [2, 2] },
    { name: "two element both target", args: [[7, 7], 7], expected: [0, 1] },
    {
      name: "scale: long block of target",
      args: [(() => {
        const a = [];
        for (let i = 0; i < 40000; i++) a.push(1);
        for (let i = 0; i < 20000; i++) a.push(2);
        for (let i = 0; i < 40000; i++) a.push(3);
        return a;
      })(), 2],
      expected: [40000, 59999],
    },
    {
      name: "scale: target absent in long array",
      args: [Array.from({ length: 100000 }, (_, i) => i * 2), 99999],
      expected: [-1, -1],
    },
  ],
  source: { origin: "leetcode", frontendId: "34", acRate: 0.48887931432440335, confidence: 0.96 },
  solutions: [
    {
      name: "Two binary searches (lower and upper bound)",
      explanation: `Run a lower-bound binary search for the first index whose value is \`>= target\`. If that index is out of range or doesn't hold \`target\`, the value is absent — return \`[-1, -1]\`. Otherwise run an upper-bound search for the first index whose value is \`> target\`; the last occurrence is one before it.

\`O(log n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function searchRange(nums, target) {
  const lowerBound = (t) => {
    let lo = 0;
    let hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] < t) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const first = lowerBound(target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  const last = lowerBound(target + 1) - 1;
  return [first, last];
}`,
        typescript: `function searchRange(nums: number[], target: number): number[] {
  const lowerBound = (t: number): number => {
    let lo = 0;
    let hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] < t) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const first = lowerBound(target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  const last = lowerBound(target + 1) - 1;
  return [first, last];
}`,
      },
    },
  ],
});
