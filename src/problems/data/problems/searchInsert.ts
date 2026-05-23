import { defineAlgoProblem } from "../problem";

export const searchInsert = defineAlgoProblem<[number[], number], number>({
  id: "search-insert-position",
  number: 44,
  title: "Search Insert Position",
  difficulty: "easy",
  tags: ["array", "binary-search"],
  functionName: "searchInsert",
  prompt: `Given a sorted array of **distinct** integers \`nums\` and a \`target\`, return the index of \`target\` if it is present. If it is not, return the index where it would be inserted to keep the array sorted.

Your algorithm must run in \`O(log n)\` time.`,
  constraints: [
    "1 <= nums.length <= 10^4",
    "-10^4 <= nums[i] <= 10^4",
    "nums contains distinct values sorted in ascending order.",
    "-10^4 <= target <= 10^4",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function searchInsert(nums, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function searchInsert(nums: number[], target: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "present", args: [[1, 3, 5, 6], 5], expected: 2, explanation: "5 is at index 2." },
    { name: "insert middle", args: [[1, 3, 5, 6], 2], expected: 1, explanation: "2 belongs between 1 and 3, at index 1." },
    { name: "insert end", args: [[1, 3, 5, 6], 7], expected: 4, explanation: "7 is larger than every element, so it goes at the end." },
  ],
  hiddenTests: [
    { name: "insert front", args: [[1, 3, 5, 6], 0], expected: 0 },
    { name: "single hit", args: [[1], 1], expected: 0 },
    { name: "single before", args: [[5], 1], expected: 0 },
    { name: "single after", args: [[5], 9], expected: 1 },
    { name: "first element", args: [[2, 4, 6, 8], 2], expected: 0 },
    { name: "last element", args: [[2, 4, 6, 8], 8], expected: 3 },
    { name: "negatives present", args: [[-5, -3, -1, 2], -3], expected: 1 },
    { name: "negatives insert", args: [[-5, -3, -1, 2], -4], expected: 1 },
    { name: "insert into gap", args: [[1, 4, 7, 10], 5], expected: 2 },
    {
      name: "scale: insert near end of large array",
      args: [Array.from({ length: 10000 }, (_, i) => i * 2), 19997],
      expected: 9999,
    },
    {
      name: "scale: present at far index",
      args: [Array.from({ length: 10000 }, (_, i) => i * 2), 13000],
      expected: 6500,
    },
  ],
  source: { origin: "leetcode", frontendId: "35", acRate: 0.5126336535504786, confidence: 0.97 },
  solutions: [
    {
      name: "Lower-bound binary search",
      explanation: `Find the leftmost index whose value is \`>= target\` by binary search. If \`target\` is present that index holds it; if not, it is exactly the slot where \`target\` would be inserted to stay sorted. Both cases collapse to the same answer.

\`O(log n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function searchInsert(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
        typescript: `function searchInsert(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
      },
    },
  ],
});
