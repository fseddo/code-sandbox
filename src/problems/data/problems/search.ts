import { defineAlgoProblem } from "../problem";

export const search = defineAlgoProblem<[number[], number], number>({
  id: "search-in-rotated-sorted-array",
  number: 42,
  title: "Search in Rotated Sorted Array",
  difficulty: "medium",
  tags: ["array", "binary-search"],
  functionName: "search",
  prompt: `An ascending array of **distinct** integers \`nums\` was rotated at some unknown pivot, so that \`[0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\`.

Given the rotated array and an integer \`target\`, return the index of \`target\`, or \`-1\` if it is not present. Your algorithm must run in \`O(log n)\` time.`,
  constraints: [
    "1 <= nums.length <= 5000",
    "-10^4 <= nums[i] <= 10^4",
    "All values of nums are unique.",
    "nums is an ascending array rotated at some pivot.",
    "-10^4 <= target <= 10^4",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums: number[], target: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "found in tail", args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, explanation: "0 sits at index 4 in the rotated array." },
    { name: "absent", args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
    { name: "single element", args: [[1], 0], expected: -1 },
  ],
  hiddenTests: [
    { name: "single hit", args: [[1], 1], expected: 0 },
    { name: "not rotated, first", args: [[1, 2, 3, 4, 5], 1], expected: 0 },
    { name: "not rotated, last", args: [[1, 2, 3, 4, 5], 5], expected: 4 },
    { name: "target at pivot", args: [[5, 1, 2, 3, 4], 5], expected: 0 },
    { name: "target just after pivot", args: [[5, 1, 2, 3, 4], 1], expected: 1 },
    { name: "negatives", args: [[-4, -3, -2, 5, -6, -5], -6], expected: 4 },
    { name: "two elements rotated", args: [[2, 1], 1], expected: 1 },
    { name: "two elements rotated other", args: [[2, 1], 2], expected: 0 },
    { name: "below range", args: [[3, 4, 5, 1, 2], -1], expected: -1 },
    { name: "above range", args: [[3, 4, 5, 1, 2], 100], expected: -1 },
    { name: "found in head", args: [[6, 7, 8, 1, 2, 3, 4, 5], 7], expected: 1 },
    {
      name: "scale: large rotated, near end",
      args: [(() => {
        const a = Array.from({ length: 5000 }, (_, i) => i);
        return [...a.slice(2500), ...a.slice(0, 2500)];
      })(), 2499],
      expected: 4999,
    },
    {
      name: "scale: large rotated, absent",
      args: [(() => {
        const a = Array.from({ length: 5000 }, (_, i) => i * 2);
        return [...a.slice(1234), ...a.slice(0, 1234)];
      })(), 9999],
      expected: -1,
    },
  ],
  source: { origin: "leetcode", frontendId: "33", acRate: 0.4455034469756831, confidence: 0.95 },
  solutions: [
    {
      name: "One-pass binary search on the sorted half",
      explanation: `At each step the midpoint splits the array into two halves, and at least one of them is fully sorted (no pivot inside it). Compare \`nums[mid]\` to \`nums[lo]\` to learn which half is sorted, then check whether \`target\` falls inside that sorted half's value range: if so, search there; otherwise search the other half. This halves the search each iteration.

\`O(log n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
        typescript: `function search(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
      },
    },
  ],
});
