import { defineAlgoProblem } from "../problem";

// Permutations may be returned in any order, but each permutation is itself an ordering and must be
// preserved exactly. The checker sorts only the outer list (by serialized inner array) on both sides.
export const permute = defineAlgoProblem<[number[]], number[][]>({
  id: "permutations",
  number: 55,
  title: "Permutations",
  difficulty: "medium",
  tags: ["array", "backtracking"],
  functionName: "permute",
  prompt: `Given an array \`nums\` of **distinct** integers, return all the possible permutations of its elements.

A permutation is an arrangement of every element exactly once; for \`n\` distinct numbers there are \`n!\` of them. You may return the list of permutations in any order, but each individual permutation must use every element exactly once in the order you place them.`,
  constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All integers of nums are distinct."],
  checker: `(actual, args, expected) => {
  const key = (list) => list.map((perm) => perm.join(",")).sort();
  if (!Array.isArray(actual)) return false;
  const a = key(actual);
  const e = key(expected);
  return a.length === e.length && a.every((row, i) => row === e[i]);
}`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function permute(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function permute(nums: number[]): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "three elements",
      args: [[1, 2, 3]],
      expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]],
      explanation: "All 3! = 6 orderings.",
    },
    { name: "two elements", args: [[0, 1]], expected: [[0, 1], [1, 0]] },
    { name: "single", args: [[1]], expected: [[1]] },
  ],
  hiddenTests: [
    { args: [[1, 2]], expected: [[1, 2], [2, 1]] },
    { args: [[-1, 0]], expected: [[-1, 0], [0, -1]] },
    { args: [[5]], expected: [[5]] },
    { args: [[0]], expected: [[0]] },
    { args: [[-10, 10]], expected: [[-10, 10], [10, -10]] },
    { args: [[3, 1, 2]], expected: [[3, 1, 2], [3, 2, 1], [1, 3, 2], [1, 2, 3], [2, 3, 1], [2, 1, 3]] },
    { args: [[7, 8, 9, 10]], expected: [[7, 8, 9, 10], [7, 8, 10, 9], [7, 9, 8, 10], [7, 9, 10, 8], [7, 10, 8, 9], [7, 10, 9, 8], [8, 7, 9, 10], [8, 7, 10, 9], [8, 9, 7, 10], [8, 9, 10, 7], [8, 10, 7, 9], [8, 10, 9, 7], [9, 7, 8, 10], [9, 7, 10, 8], [9, 8, 7, 10], [9, 8, 10, 7], [9, 10, 7, 8], [9, 10, 8, 7], [10, 7, 8, 9], [10, 7, 9, 8], [10, 8, 7, 9], [10, 8, 9, 7], [10, 9, 7, 8], [10, 9, 8, 7]] },
    {
      args: [[-2, -1, 0, 1]],
      expected: [[-2, -1, 0, 1], [-2, -1, 1, 0], [-2, 0, -1, 1], [-2, 0, 1, -1], [-2, 1, -1, 0], [-2, 1, 0, -1], [-1, -2, 0, 1], [-1, -2, 1, 0], [-1, 0, -2, 1], [-1, 0, 1, -2], [-1, 1, -2, 0], [-1, 1, 0, -2], [0, -2, -1, 1], [0, -2, 1, -1], [0, -1, -2, 1], [0, -1, 1, -2], [0, 1, -2, -1], [0, 1, -1, -2], [1, -2, -1, 0], [1, -2, 0, -1], [1, -1, -2, 0], [1, -1, 0, -2], [1, 0, -2, -1], [1, 0, -1, -2]],
    },
  ],
  source: { origin: "leetcode", frontendId: "46", acRate: 0.8192481436345759, confidence: 0.93 },
  solutions: [
    {
      name: "Backtracking with used flags",
      explanation: `Build each permutation position by position. Keep a \`used\` flag per index; at each depth, try every not-yet-used element, mark it, recurse, then unmark on the way back. When the path reaches full length, record a copy.

\`O(n · n!)\` time (each of the \`n!\` permutations costs \`O(n)\` to copy), \`O(n)\` recursion depth.`,
      code: {
        javascript: `function permute(nums) {
  const result = [];
  const path = [];
  const used = new Array(nums.length).fill(false);
  const dfs = () => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      dfs();
      path.pop();
      used[i] = false;
    }
  };
  dfs();
  return result;
}`,
        typescript: `function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const used = new Array<boolean>(nums.length).fill(false);
  const dfs = (): void => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      dfs();
      path.pop();
      used[i] = false;
    }
  };
  dfs();
  return result;
}`,
      },
    },
  ],
});
