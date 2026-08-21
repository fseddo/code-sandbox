import { defineAlgoProblem } from "../problem";

// Any-order problem: the power set is fixed, but the order of subsets (and elements within each) is
// the solver's choice. The checker sorts within each subset and then sorts the list before comparing.
export const subsets = defineAlgoProblem<[number[]], number[][]>({
  id: "subsets",
  number: 84,
  title: "Subsets",
  difficulty: "medium",
  tags: ["array", "backtracking", "bit-manipulation"],
  functionName: "subsets",
  prompt: `Given an integer array \`nums\` of **unique** elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Subsets — and the elements within each subset — may be returned in **any order**.`,
  constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All numbers are unique."],
  checker: `(actual, args, expected) => {
    const norm = (lists) => lists
      .map((sub) => [...sub].sort((a, b) => a - b))
      .sort((a, b) => {
        if (a.length !== b.length) return a.length - b.length;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
        return 0;
      });
    if (!Array.isArray(actual)) return false;
    const a = norm(actual);
    const e = norm(expected);
    if (a.length !== e.length) return false;
    return a.every((sub, i) =>
      sub.length === e[i].length && sub.every((v, j) => v === e[i][j]));
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function subsets(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function subsets(nums: number[]): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "three elements",
      args: [[1, 2, 3]],
      expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]],
      explanation: "All 2^3 = 8 subsets, including the empty set.",
    },
    { name: "single", args: [[0]], expected: [[], [0]] },
    { name: "negatives", args: [[-1, 2]], expected: [[], [-1], [2], [-1, 2]] },
  ],
  hiddenTests: [
    { args: [[5]], expected: [[], [5]] },
    { args: [[1, 2]], expected: [[], [1], [2], [1, 2]] },
    { args: [[-3, -2, -1]], expected: [[], [-3], [-2], [-1], [-3, -2], [-3, -1], [-2, -1], [-3, -2, -1]] },
    { args: [[0, 1]], expected: [[], [0], [1], [0, 1]] },
    { args: [[10, -10]], expected: [[], [10], [-10], [10, -10]] },
    {
      args: [[1, 2, 3, 4]],
      expected: [
        [], [1], [2], [3], [4],
        [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4],
        [1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4],
        [1, 2, 3, 4],
      ],
    },
    {
      // 2^5 = 32 subsets.
      args: [[7, 8, 9, 1, 2]],
      expected: (() => {
        const arr = [7, 8, 9, 1, 2];
        const result = [];
        for (let mask = 0; mask < 1 << arr.length; mask++) {
          const sub = [];
          for (let i = 0; i < arr.length; i++) if (mask & (1 << i)) sub.push(arr[i]);
          result.push(sub);
        }
        return result;
      })(),
    },
    {
      // Scale: 2^10 = 1024 subsets.
      args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
      expected: (() => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = [];
        for (let mask = 0; mask < 1 << arr.length; mask++) {
          const sub = [];
          for (let i = 0; i < arr.length; i++) if (mask & (1 << i)) sub.push(arr[i]);
          result.push(sub);
        }
        return result;
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "78", acRate: 0.8233769927291796, confidence: 0.95 },
  solutions: [
    {
      name: "Iterative expansion",
      explanation: `Start from the single empty subset. For each number, append it to copies of every subset built so far, doubling the collection. After processing all numbers you have the full power set.

\`O(n · 2^n)\` time and output size, \`O(1)\` extra beyond the result.`,
      code: {
        javascript: `function subsets(nums) {
  // Start with just the empty subset.
  let result = [[]];
  for (const num of nums) {
    // Every existing subset either stays as-is (already in result) or gets num appended —
    // concatenate the two, doubling the collection each pass.
    result = result.concat(result.map((sub) => [...sub, num]));
  }
  return result;
}`,
        typescript: `function subsets(nums: number[]): number[][] {
  // Start with just the empty subset.
  let result: number[][] = [[]];
  for (const num of nums) {
    // Every existing subset either stays as-is (already in result) or gets num appended —
    // concatenate the two, doubling the collection each pass.
    result = result.concat(result.map((sub) => [...sub, num]));
  }
  return result;
}`,
      },
    },
  ],
});
