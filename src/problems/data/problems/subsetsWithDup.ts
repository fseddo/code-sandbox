import { defineAlgoProblem } from "../problem";

// Subsets may come back in any order, so the checker normalizes both sides (sort each subset, then
// sort the list of subsets) and compares — also rejecting any duplicate subset. `expected` is one
// canonical full power set with duplicates removed.
export const subsetsWithDup = defineAlgoProblem<[number[]], number[][]>({
  id: "subsets-ii",
  number: 96,
  title: "Subsets II",
  difficulty: "medium",
  tags: ["array", "backtracking", "bit-manipulation"],
  functionName: "subsetsWithDup",
  prompt: `Given an integer array \`nums\` that may contain duplicates, return all possible subsets (the power set). The solution set must **not** contain duplicate subsets.

The subsets, and the elements within each subset, may be returned in any order — ordering is normalized before comparing, but repeated subsets are rejected.`,
  constraints: [
    "1 <= nums.length <= 10",
    "-10 <= nums[i] <= 10",
  ],
  checker: `(actual, args, expected) => {
    if (!Array.isArray(actual)) return false;
    const norm = (lists) => lists
      .map((sub) => [...sub].sort((a, b) => a - b))
      .map((sub) => sub.join(","))
      .sort();
    const a = norm(actual);
    const e = norm(expected);
    if (a.length !== e.length) return false;
    const seen = new Set();
    for (const key of a) {
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return a.every((key, i) => key === e[i]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function subsetsWithDup(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function subsetsWithDup(nums: number[]): number[][] {
  // your code here
}`,
  },
  examples: [
    { name: "with a duplicate", args: [[1, 2, 2]], expected: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]], explanation: "The two 2s yield no duplicate subsets like [2] twice." },
    { name: "all distinct", args: [[0]], expected: [[], [0]] },
    { name: "all same", args: [[3, 3]], expected: [[], [3], [3, 3]] },
  ],
  hiddenTests: [
    { args: [[1]], expected: [[], [1]] },
    { args: [[1, 1]], expected: [[], [1], [1, 1]] },
    { args: [[1, 1, 1]], expected: [[], [1], [1, 1], [1, 1, 1]] },
    { args: [[1, 2]], expected: [[], [1], [2], [1, 2]] },
    { args: [[4, 4, 4, 1, 4]], expected: [[], [1], [4], [1, 4], [4, 4], [1, 4, 4], [4, 4, 4], [1, 4, 4, 4], [4, 4, 4, 4], [1, 4, 4, 4, 4]] },
    { args: [[0, 0]], expected: [[], [0], [0, 0]] },
    { args: [[-1, 0, 1]], expected: [[], [-1], [0], [1], [-1, 0], [-1, 1], [0, 1], [-1, 0, 1]] },
    { args: [[2, 1, 2]], expected: [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]] },
    { args: [[5, 5, 5, 5]], expected: [[], [5], [5, 5], [5, 5, 5], [5, 5, 5, 5]] },
    { args: [[-2, -2, 3]], expected: [[], [-2], [3], [-2, -2], [-2, 3], [-2, -2, 3]] },
    { args: [[1, 2, 3]], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]] },
    { args: [[10, -10]], expected: [[], [10], [-10], [10, -10]] },
    // Scale: 10 elements with heavy duplication; distinct-subset count stays small.
    { args: [[1, 1, 1, 1, 1, 2, 2, 2, 2, 2]], expected: (() => {
      const out = [];
      for (let a = 0; a <= 5; a++) for (let b = 0; b <= 5; b++) {
        const sub = [...Array.from({ length: a }, () => 1), ...Array.from({ length: b }, () => 2)];
        out.push(sub);
      }
      return out;
    })() },
  ],
  source: { origin: "leetcode", frontendId: "90", acRate: 0.6129426725871505, confidence: 0.93 },
  solutions: [
    {
      name: "Sorted backtracking with sibling skip",
      explanation: `Sort \`nums\` so equal values are adjacent. Backtrack building subsets index by index; at each level, record the current subset, then try extending with each remaining element. To avoid duplicate subsets, **skip** a value at the current decision level if it equals the previous value and that previous value was not the one chosen on the immediately preceding step (i.e. \`i > start && nums[i] === nums[i-1]\`).

\`O(2^n)\` subsets in the worst case, \`O(n)\` per subset to copy.`,
      code: {
        javascript: `function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  const path = [];
  const backtrack = (start) => {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  };
  backtrack(0);
  return result;
}`,
        typescript: `function subsetsWithDup(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  const path: number[] = [];
  const backtrack = (start: number): void => {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  };
  backtrack(0);
  return result;
}`,
      },
    },
  ],
});
