import { defineAlgoProblem } from "../problem";

export const searchInRotatedSortedArrayII = defineAlgoProblem<[number[], number], boolean>({
  id: "search-in-rotated-sorted-array-ii",
  number: 87,
  title: "Search in Rotated Sorted Array II",
  difficulty: "medium",
  tags: ["array", "binary-search"],
  functionName: "search",
  prompt: `You are given an integer array \`nums\` that was originally sorted in non-decreasing order and may contain **duplicates**. Before being handed to you it was rotated at some unknown pivot \`k\`, so \`nums\` becomes \`[nums[k], nums[k+1], …, nums[n-1], nums[0], nums[1], …, nums[k-1]]\` for some \`0 <= k < n\`.

Given the rotated array \`nums\` and a target value \`target\`, return \`true\` if \`target\` is present in \`nums\`, and \`false\` otherwise.

Aim to keep the runtime close to \`O(log n)\`, although the presence of duplicates can force \`O(n)\` in the worst case.`,
  constraints: [
    "1 <= nums.length <= 5000",
    "-10^4 <= nums[i] <= 10^4",
    "nums is guaranteed to be a rotation of a non-decreasingly sorted array.",
    "-10^4 <= target <= 10^4",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {boolean}
 */
function search(nums, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {boolean}
 */
function search(nums: number[], target: number): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "present", args: [[2, 5, 6, 0, 0, 1, 2], 0], expected: true, explanation: "0 appears at indices 3 and 4." },
    { name: "absent", args: [[2, 5, 6, 0, 0, 1, 2], 3], expected: false, explanation: "3 is never present." },
    { name: "duplicates around pivot", args: [[1, 0, 1, 1, 1], 0], expected: true },
  ],
  hiddenTests: [
    { args: [[1], 1], expected: true },
    { args: [[1], 0], expected: false },
    { args: [[1, 1], 1], expected: true },
    { args: [[1, 1, 1, 1, 1], 2], expected: false },
    { args: [[3, 1], 1], expected: true },
    { args: [[5, 1, 3], 5], expected: true },
    { args: [[2, 2, 2, 0, 2, 2], 0], expected: true },
    { args: [[1, 0, 1, 1, 1], 2], expected: false },
    { args: [[4, 5, 6, 7, 0, 1, 2], 6], expected: true },
    { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: false },
    { args: [[-1, -1, -1, -1, 0, -1], 0], expected: true },
    { args: [[10, 10, 10, 1, 10], 1], expected: true },
    { args: [[10, 10, 10, 1, 10], 5], expected: false },
    // Scale: worst-case all-equal with a single odd value, length 5000.
    { args: [[...Array.from({ length: 4999 }, () => 7), 9], 9], expected: true },
    { args: [Array.from({ length: 5000 }, () => 7), 8], expected: false },
  ],
  source: { origin: "leetcode", frontendId: "81", acRate: 0.4004752048559395, confidence: 0.9 },
  solutions: [
    {
      name: "Modified binary search with duplicate skip",
      explanation: `Standard rotated binary search, except duplicates break the "which half is sorted" test: when \`nums[lo] === nums[mid] === nums[hi]\` we can't tell which side is ordered, so we shrink both ends by one (\`lo++\`, \`hi--\`) and retry. Otherwise, if the left half \`[lo, mid]\` is sorted, check whether \`target\` lies inside it; else the right half is sorted and we check there.

\`O(log n)\` average time, \`O(n)\` worst case when many duplicates force the linear shrink. \`O(1)\` space.`,
      code: {
        javascript: `function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return true;
    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
      lo++;
      hi--;
    } else if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}`,
        typescript: `function search(nums: number[], target: number): boolean {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return true;
    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
      lo++;
      hi--;
    } else if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}`,
      },
    },
  ],
});
