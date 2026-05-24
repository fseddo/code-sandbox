import { defineAlgoProblem } from "../problem";

// Combinations may come back in any order, and the numbers within each combination in any order, so
// deep-equal on one fixed nesting would wrongly fail a correct solution. The checker canonicalizes
// both sides — sort each inner combination, then sort the list of combinations — and compares.
export const combinationSum = defineAlgoProblem<[number[], number], number[][]>({
  id: "combination-sum",
  number: 48,
  title: "Combination Sum",
  difficulty: "medium",
  tags: ["array", "backtracking"],
  functionName: "combinationSum",
  prompt: `Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return every unique combination of candidates that sums to \`target\`.

The **same** candidate may be chosen an unlimited number of times. Two combinations are the same if one is a reordering of the other, so each distinct multiset of numbers must appear at most once.

You may return the combinations in any order, and the numbers within each combination in any order — any valid arrangement is accepted.`,
  constraints: [
    "1 <= candidates.length <= 30",
    "2 <= candidates[i] <= 40",
    "All elements of candidates are distinct.",
    "1 <= target <= 40",
  ],
  checker: `(actual, args, expected) => {
  const norm = (lists) => lists.map((c) => [...c].sort((a, b) => a - b))
    .sort((a, b) => a.length - b.length || a.join(",").localeCompare(b.join(",")));
  if (!Array.isArray(actual)) return false;
  const a = norm(actual);
  const e = norm(expected);
  if (a.length !== e.length) return false;
  return a.every((c, i) => c.length === e[i].length && c.every((x, j) => x === e[i][j]));
}`,
  starterCode: {
    javascript: `/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
function combinationSum(candidates, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
function combinationSum(candidates: number[], target: number): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "reuse allowed",
      args: [[2, 3, 6, 7], 7],
      expected: [[2, 2, 3], [7]],
      explanation: "2 + 2 + 3 = 7 and 7 = 7. 2 may be reused.",
    },
    {
      name: "multiple combos",
      args: [[2, 3, 5], 8],
      expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]],
    },
    {
      name: "no solution",
      args: [[2], 1],
      expected: [],
      explanation: "No multiple of 2 reaches the odd target 1.",
    },
  ],
  hiddenTests: [
    { args: [[1], 1], expected: [[1]] },
    { args: [[1], 2], expected: [[1, 1]] },
    { args: [[3], 8], expected: [] },
    { args: [[2, 4], 6], expected: [[2, 2, 2], [2, 4]] },
    { args: [[7, 3, 2], 18], expected: [[2, 2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 3, 3], [2, 2, 2, 2, 3, 7], [2, 2, 2, 3, 3, 3, 3], [2, 2, 7, 7], [2, 3, 3, 3, 7], [3, 3, 3, 3, 3, 3]] },
    { args: [[2, 3, 5], 1], expected: [] },
    { args: [[5, 10, 20], 5], expected: [[5]] },
    { args: [[8, 7, 4, 3], 11], expected: [[3, 4, 4], [3, 8], [4, 7]] },
    { args: [[2], 40], expected: [[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]] },
    { args: [[40], 40], expected: [[40]] },
    { args: [[6, 7, 8], 5], expected: [] },
    { args: [[2, 3, 4, 5, 6, 7], 7], expected: [[2, 2, 3], [2, 5], [3, 4], [7]] },
    { args: [[11, 13, 17, 19], 40], expected: [] },
    { args: [[3, 5, 8], 30], expected: [[3, 3, 3, 3, 3, 3, 3, 3, 3, 3], [3, 3, 3, 3, 3, 5, 5, 5], [3, 3, 3, 3, 5, 5, 8], [3, 3, 3, 5, 8, 8], [3, 3, 8, 8, 8], [5, 5, 5, 5, 5, 5]] },
  ],
  source: { origin: "leetcode", frontendId: "39", acRate: 0.765290742271582, confidence: 0.9 },
  solutions: [
    {
      name: "Backtracking",
      explanation: `Sort the candidates, then explore combinations with DFS. At each step you either take the current candidate again (allowing reuse, so you stay on the same index) or advance to the next candidate. Prune as soon as the running sum exceeds the target.

With \`n\` candidates and target \`T\`, the search tree is bounded by the number of valid combinations; worst case \`O(n^(T/min))\` nodes, \`O(T/min)\` recursion depth.`,
      code: {
        javascript: `function combinationSum(candidates, target) {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result = [];
  const path = [];
  const dfs = (start, remaining) => {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i] > remaining) break;
      path.push(sorted[i]);
      dfs(i, remaining - sorted[i]);
      path.pop();
    }
  };
  dfs(0, target);
  return result;
}`,
        typescript: `function combinationSum(candidates: number[], target: number): number[][] {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result: number[][] = [];
  const path: number[] = [];
  const dfs = (start: number, remaining: number): void => {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i] > remaining) break;
      path.push(sorted[i]);
      dfs(i, remaining - sorted[i]);
      path.pop();
    }
  };
  dfs(0, target);
  return result;
}`,
      },
    },
  ],
});
