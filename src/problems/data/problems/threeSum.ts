import { defineAlgoProblem } from "../problem";

// Triplets may be returned in any order, and each triplet's internal order is free. Deep-equal on one
// fixed answer would wrongly fail a correct solution, so `checker` normalizes both sides (sort each
// triplet, then sort the list of triplets) before comparing — and re-validates the answer from `nums`.
export const threeSum = defineAlgoProblem<[number[]], number[][]>({
  id: "3sum",
  number: 25,
  title: "3Sum",
  difficulty: "medium",
  tags: ["array", "two-pointers", "sorting"],
  functionName: "threeSum",
  prompt: `Given an integer array \`nums\`, return all unique triplets \`[nums[i], nums[j], nums[k]]\` such that \`i\`, \`j\`, and \`k\` are distinct indices and \`nums[i] + nums[j] + nums[k] === 0\`.

The result must not contain duplicate triplets — two triplets are considered the same if they consist of the same three values (regardless of order). You may return the triplets, and the values within each triplet, in any order.`,
  constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
  checker: `(actual, args) => {
  const nums = args[0];
  if (!Array.isArray(actual)) return false;
  const normalize = (lists) => lists
    .map((t) => [...t].sort((a, b) => a - b))
    .map((t) => t.join(","))
    .sort();
  if (actual.some((t) => !Array.isArray(t) || t.length !== 3)) return false;
  // Recompute the canonical answer from nums, then compare normalized sets.
  const sorted = [...nums].sort((a, b) => a - b);
  const expected = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let lo = i + 1;
    let hi = sorted.length - 1;
    while (lo < hi) {
      const sum = sorted[i] + sorted[lo] + sorted[hi];
      if (sum < 0) lo++;
      else if (sum > 0) hi--;
      else {
        expected.push([sorted[i], sorted[lo], sorted[hi]]);
        while (lo < hi && sorted[lo] === sorted[lo + 1]) lo++;
        while (lo < hi && sorted[hi] === sorted[hi - 1]) hi--;
        lo++;
        hi--;
      }
    }
  }
  const a = normalize(actual);
  const e = normalize(expected);
  if (a.length !== e.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== e[i]) return false;
  // Each returned triplet must actually sum to zero (guards a solution that returns wrong values).
  return actual.every((t) => t[0] + t[1] + t[2] === 0);
}`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums: number[]): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "mixed signs",
      args: [[-1, 0, 1, 2, -1, -4]],
      expected: [
        [-1, -1, 2],
        [-1, 0, 1],
      ],
      explanation: "The distinct triplets summing to 0 are [-1, -1, 2] and [-1, 0, 1].",
    },
    {
      name: "no triplet",
      args: [[0, 1, 1]],
      expected: [],
      explanation: "No three values sum to 0.",
    },
    {
      name: "all zeros",
      args: [[0, 0, 0]],
      expected: [[0, 0, 0]],
      explanation: "The only triplet is [0, 0, 0].",
    },
  ],
  hiddenTests: [
    // Boundary: minimum length, with and without a hit.
    { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
    { args: [[1, 2, 3]], expected: [] },
    { args: [[-2, 1, 1]], expected: [[-2, 1, 1]] },
    // Edge: all same nonzero -> no triplet.
    { args: [[5, 5, 5, 5]], expected: [] },
    // Edge: duplicates producing one triplet, many copies.
    { args: [[-1, -1, -1, 2, 2]], expected: [[-1, -1, 2]] },
    // Edge: negatives only / positives only -> impossible.
    { args: [[-3, -2, -1]], expected: [] },
    { args: [[1, 2, 4, 8]], expected: [] },
    // Structural: multiple distinct triplets.
    {
      args: [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]],
      expected: [
        [-4, -2, 6],
        [-4, 0, 4],
        [-4, 1, 3],
        [-4, 2, 2],
        [-2, -2, 4],
        [-2, 0, 2],
      ],
    },
    // Anti-hardcode: input unlike the examples, several triplets.
    {
      args: [[3, 0, -2, -1, 1, 2]],
      expected: [
        [-2, -1, 3],
        [-2, 0, 2],
        [-1, 0, 1],
      ],
    },
    // Anti-hardcode: heavy duplication, single resulting triplet.
    { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
    // Edge: two zeros need an equal opposite pair.
    { args: [[-1, 0, 1, 0]], expected: [[-1, 0, 1]] },
    // Larger spread of values.
    {
      args: [[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]],
      expected: [
        [-5, 0, 5],
        [-5, 1, 4],
        [-5, 2, 3],
        [-4, -1, 5],
        [-4, 0, 4],
        [-4, 1, 3],
        [-3, -2, 5],
        [-3, -1, 4],
        [-3, 0, 3],
        [-3, 1, 2],
        [-2, -1, 3],
        [-2, 0, 2],
        [-1, 0, 1],
      ],
    },
    // Scale: 1500 distinct-ish values, correct O(n^2) finishes well under budget.
    {
      args: [Array.from({ length: 1500 }, (_, k) => k - 750)],
      expected: Array.from({ length: 750 }, (_, k) => [-(k + 1), 0, k + 1]),
    },
    // Scale: many duplicates (forces dedup logic to be efficient).
    {
      args: [Array.from({ length: 2000 }, (_, k) => (k % 3) - 1)],
      expected: [[-1, 0, 1]],
    },
  ],
  source: { origin: "leetcode", frontendId: "15", acRate: 0.3908269358593717, confidence: 0.9 },
  solutions: [
    {
      name: "Sort + two pointers",
      explanation: `Sort the array. Fix each value \`nums[i]\` as the smallest of the triplet, then find pairs that sum to \`-nums[i]\` in the suffix using two pointers converging from both ends: advance the low pointer when the sum is too small, retreat the high pointer when it's too large. Skip equal neighbours at every level (the fixed index, and after recording a hit on both pointers) to avoid duplicate triplets.

\`O(n²)\` time, \`O(1)\` extra space (ignoring the sort and output).`,
      code: {
        javascript: `function threeSum(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let lo = i + 1;
    let hi = sorted.length - 1;
    while (lo < hi) {
      const sum = sorted[i] + sorted[lo] + sorted[hi];
      if (sum < 0) {
        lo++;
      } else if (sum > 0) {
        hi--;
      } else {
        result.push([sorted[i], sorted[lo], sorted[hi]]);
        while (lo < hi && sorted[lo] === sorted[lo + 1]) lo++;
        while (lo < hi && sorted[hi] === sorted[hi - 1]) hi--;
        lo++;
        hi--;
      }
    }
  }
  return result;
}`,
        typescript: `function threeSum(nums: number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let lo = i + 1;
    let hi = sorted.length - 1;
    while (lo < hi) {
      const sum = sorted[i] + sorted[lo] + sorted[hi];
      if (sum < 0) {
        lo++;
      } else if (sum > 0) {
        hi--;
      } else {
        result.push([sorted[i], sorted[lo], sorted[hi]]);
        while (lo < hi && sorted[lo] === sorted[lo + 1]) lo++;
        while (lo < hi && sorted[hi] === sorted[hi - 1]) hi--;
        lo++;
        hi--;
      }
    }
  }
  return result;
}`,
      },
    },
  ],
});
