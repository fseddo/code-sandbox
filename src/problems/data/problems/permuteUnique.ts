import { defineAlgoProblem } from "../problem";

// Permutations may be returned in any order; each is itself an ordering that must be preserved, and
// the result must contain no duplicates. The checker sorts the outer list (by serialized inner array)
// on both sides and compares element-wise — a count mismatch or any duplicate fails it.
export const permuteUnique = defineAlgoProblem<[number[]], number[][]>({
  id: "permutations-ii",
  number: 56,
  title: "Permutations II",
  difficulty: "medium",
  tags: ["array", "backtracking", "sorting"],
  functionName: "permuteUnique",
  prompt: `Given a collection of numbers \`nums\` that **may contain duplicates**, return all of its **unique** permutations.

Because the input can repeat values, distinct index orderings can produce the same sequence; the returned list must contain each distinct sequence exactly once. You may return the permutations in any order, but each individual permutation must place every element exactly once.`,
  constraints: ["1 <= nums.length <= 8", "-10 <= nums[i] <= 10"],
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
function permuteUnique(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function permuteUnique(nums: number[]): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "one duplicate",
      args: [[1, 1, 2]],
      expected: [[1, 1, 2], [1, 2, 1], [2, 1, 1]],
      explanation: "Only 3 distinct sequences despite 3! = 6 index orderings.",
    },
    { name: "all distinct", args: [[1, 2]], expected: [[1, 2], [2, 1]] },
    { name: "all same", args: [[1, 1, 1]], expected: [[1, 1, 1]] },
  ],
  hiddenTests: [
    { args: [[1]], expected: [[1]] },
    { args: [[0]], expected: [[0]] },
    { args: [[1, 2, 1]], expected: [[1, 1, 2], [1, 2, 1], [2, 1, 1]] },
    { args: [[-1, -1]], expected: [[-1, -1]] },
    { args: [[2, 2, 1, 1]], expected: [[1, 1, 2, 2], [1, 2, 1, 2], [1, 2, 2, 1], [2, 1, 1, 2], [2, 1, 2, 1], [2, 2, 1, 1]] },
    { args: [[3, 3, 0, 3]], expected: [[0, 3, 3, 3], [3, 0, 3, 3], [3, 3, 0, 3], [3, 3, 3, 0]] },
    {
      args: [[1, 2, 3]],
      expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]],
    },
    {
      args: [[-1, 0, 1]],
      expected: [[-1, 0, 1], [-1, 1, 0], [0, -1, 1], [0, 1, -1], [1, -1, 0], [1, 0, -1]],
    },
    {
      args: [[2, 2, 2, 1]],
      expected: [[1, 2, 2, 2], [2, 1, 2, 2], [2, 2, 1, 2], [2, 2, 2, 1]],
    },
    {
      args: [[1, 1, 2, 2, 3]],
      expected: [
        [1, 1, 2, 2, 3], [1, 1, 2, 3, 2], [1, 1, 3, 2, 2], [1, 2, 1, 2, 3], [1, 2, 1, 3, 2], [1, 2, 2, 1, 3],
        [1, 2, 2, 3, 1], [1, 2, 3, 1, 2], [1, 2, 3, 2, 1], [1, 3, 1, 2, 2], [1, 3, 2, 1, 2], [1, 3, 2, 2, 1],
        [2, 1, 1, 2, 3], [2, 1, 1, 3, 2], [2, 1, 2, 1, 3], [2, 1, 2, 3, 1], [2, 1, 3, 1, 2], [2, 1, 3, 2, 1],
        [2, 2, 1, 1, 3], [2, 2, 1, 3, 1], [2, 2, 3, 1, 1], [2, 3, 1, 1, 2], [2, 3, 1, 2, 1], [2, 3, 2, 1, 1],
        [3, 1, 1, 2, 2], [3, 1, 2, 1, 2], [3, 1, 2, 2, 1], [3, 2, 1, 1, 2], [3, 2, 1, 2, 1], [3, 2, 2, 1, 1],
      ],
    },
  ],
  source: { origin: "leetcode", frontendId: "47", acRate: 0.6344623560187912, confidence: 0.92 },
  solutions: [
    {
      name: "Backtracking with sorted duplicate skip",
      explanation: `Sort first so equal values are adjacent. Build permutations with a \`used\` array. The key to avoiding duplicate sequences: when the current value equals the previous value, only use it if the previous equal value has **already been used** at this depth path (\`used[i - 1]\` is true) — this forces equal values to be consumed in a fixed left-to-right order, so no two branches generate the same sequence.

\`O(n · n!)\` worst case (fewer when duplicates collapse branches), \`O(n)\` recursion depth.`,
      code: {
        javascript: `function permuteUnique(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  const path = [];
  const used = new Array(sorted.length).fill(false);
  const dfs = () => {
    if (path.length === sorted.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < sorted.length; i++) {
      if (used[i]) continue;
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(sorted[i]);
      dfs();
      path.pop();
      used[i] = false;
    }
  };
  dfs();
  return result;
}`,
        typescript: `function permuteUnique(nums: number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];
  const path: number[] = [];
  const used = new Array<boolean>(sorted.length).fill(false);
  const dfs = (): void => {
    if (path.length === sorted.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < sorted.length; i++) {
      if (used[i]) continue;
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(sorted[i]);
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
