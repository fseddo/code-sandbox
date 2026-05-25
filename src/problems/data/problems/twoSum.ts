import { defineAlgoProblem } from "../problem";

export const twoSum = defineAlgoProblem<[number[], number], number[]>({
  id: "two-sum",
  number: 1,
  title: "Two Sum",
  difficulty: "easy",
  tags: ["array", "hash-table"],
  functionName: "twoSum",
  prompt: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

Each input has exactly one solution, and you may not use the same element twice. Return the indices in ascending order.`,
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Exactly one valid answer exists.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums: number[], target: number): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "basic", args: [[2, 7, 11, 15], 9], expected: [0, 1], explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
    { name: "middle pair", args: [[3, 2, 4], 6], expected: [1, 2], explanation: "nums[1] + nums[2] = 2 + 4 = 6." },
    { name: "duplicates", args: [[3, 3], 6], expected: [0, 1] },
    { name: "negatives", args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
  ],
  hiddenTests: [
    { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
    { args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
    { args: [[5, 75, 25], 100], expected: [1, 2] },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8], 15], expected: [6, 7] },
  ],
  source: { origin: "leetcode", frontendId: "1", acRate: 0.5749902892875883 },
  solutions: [
    {
      name: "Brute force",
      explanation: `Check every pair \`(i, j)\` with \`i < j\` and return the first whose values sum to \`target\`. Iterating \`i < j\` keeps the indices ascending for free.

\`O(n²)\` time, \`O(1)\` space — simple, but quadratic on large inputs.`,
      code: {
        javascript: `function twoSum(nums, target) {
  // Try every distinct pair (i, j) with i < j.
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      // First pair that hits target wins; i < j keeps the indices ascending.
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return []; // guaranteed solution means this is unreachable
}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
  // Try every distinct pair (i, j) with i < j.
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      // First pair that hits target wins; i < j keeps the indices ascending.
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return []; // guaranteed solution means this is unreachable
}`,
      },
    },
    {
      name: "Hash map (one pass)",
      explanation: `Walk the array once, keeping a map of \`value → index\` seen so far. For each \`nums[i]\`, the partner you need is \`target - nums[i]\`; if it's already in the map you've found the pair. The stored index is earlier, so \`[seen, i]\` is ascending.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function twoSum(nums, target) {
  // Map each value we've passed to the index it lives at.
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    // The one number that completes this pair.
    const need = target - nums[i];
    // Check before inserting: never pairs an element with itself, and
    // the stored partner is at an earlier index, so [seen, i] is ascending.
    if (seen.has(need)) return [seen.get(need), i];
    // Partner not seen yet — record this value so a later element can find it.
    seen.set(nums[i], i);
  }
  return []; // guaranteed solution means this is unreachable
}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
  // Map each value we've passed to the index it lives at.
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    // The one number that completes this pair.
    const need = target - nums[i];
    // Check before inserting: never pairs an element with itself, and
    // the stored partner is at an earlier index, so [seen, i] is ascending.
    if (seen.has(need)) return [seen.get(need)!, i];
    // Partner not seen yet — record this value so a later element can find it.
    seen.set(nums[i], i);
  }
  return []; // guaranteed solution means this is unreachable
}`,
      },
    },
  ],
});
