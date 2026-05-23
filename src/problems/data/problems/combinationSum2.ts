import { defineAlgoProblem } from "../problem";

// Combinations may come back in any order, numbers within each in any order, so the checker
// canonicalizes both sides (sort each inner combo, then sort the list) before comparing.
export const combinationSum2 = defineAlgoProblem<[number[], number], number[][]>({
  id: "combination-sum-ii",
  number: 49,
  title: "Combination Sum II",
  difficulty: "medium",
  tags: ["array", "backtracking"],
  functionName: "combinationSum2",
  prompt: `Given a collection of integers \`candidates\` (which **may contain duplicates**) and a target integer \`target\`, return every unique combination of candidates that sums to \`target\`.

Each candidate may be used **at most once** within a combination — its position in the array, not just its value, is what gets consumed. Two combinations are the same if one is a reordering of the other, so the returned list must not contain duplicate multisets.

You may return the combinations in any order, and the numbers within each combination in any order. The judge accepts any valid arrangement.`,
  constraints: [
    "1 <= candidates.length <= 100",
    "1 <= candidates[i] <= 50",
    "1 <= target <= 30",
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
function combinationSum2(candidates, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
function combinationSum2(candidates: number[], target: number): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "with duplicates",
      args: [[10, 1, 2, 7, 6, 1, 5], 8],
      expected: [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]],
      explanation: "The two 1s are distinct positions, so [1, 1, 6] is valid; but [1, 7] appears once even though either 1 could form it.",
    },
    {
      name: "repeated value",
      args: [[2, 5, 2, 1, 2], 5],
      expected: [[1, 2, 2], [5]],
    },
    {
      name: "no solution",
      args: [[10, 20, 30], 5],
      expected: [],
    },
  ],
  hiddenTests: [
    { args: [[1, 1], 2], expected: [[1, 1]] },
    { args: [[1, 1, 1], 2], expected: [[1, 1]] },
    { args: [[2, 2, 2], 4], expected: [[2, 2]] },
    { args: [[3], 3], expected: [[3]] },
    { args: [[3], 5], expected: [] },
    { args: [[1], 1], expected: [[1]] },
    { args: [[4, 4, 2, 1, 4, 2, 2, 1, 3], 6], expected: [[1, 1, 2, 2], [1, 1, 4], [1, 2, 3], [2, 2, 2], [2, 4]] },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10], expected: [[1, 2, 3, 4], [1, 2, 7], [1, 3, 6], [1, 4, 5], [1, 9], [2, 3, 5], [2, 8], [3, 7], [4, 6], [10]] },
    { args: [[6, 6, 6, 6], 12], expected: [[6, 6]] },
    { args: [[5, 5, 5, 5, 5, 5], 15], expected: [[5, 5, 5]] },
    { args: [[2, 3, 6, 7], 7], expected: [[7]] },
    { args: [[8, 7, 4, 3], 11], expected: [[3, 8], [4, 7]] },
    { args: [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 5], expected: [[1, 1, 1, 1, 1]] },
  ],
  source: { origin: "leetcode", frontendId: "40", acRate: 0.5946180071676348, confidence: 0.9 },
  solutions: [
    {
      name: "Backtracking with duplicate skip",
      explanation: `Sort the candidates so equal values sit together. DFS over indices; after using \`candidates[i]\` advance to \`i + 1\` (each position used at most once). To avoid emitting the same multiset twice, skip a value at depth \`i\` when it equals the previous value **and** \`i > start\` — that means a sibling branch already started with this value at this level. Prune when the value exceeds the remaining target.

\`O(2^n)\` combinations in the worst case, \`O(n)\` recursion depth.`,
      code: {
        javascript: `function combinationSum2(candidates, target) {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result = [];
  const path = [];
  const dfs = (start, remaining) => {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      if (sorted[i] > remaining) break;
      path.push(sorted[i]);
      dfs(i + 1, remaining - sorted[i]);
      path.pop();
    }
  };
  dfs(0, target);
  return result;
}`,
        typescript: `function combinationSum2(candidates: number[], target: number): number[][] {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result: number[][] = [];
  const path: number[] = [];
  const dfs = (start: number, remaining: number): void => {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      if (sorted[i] > remaining) break;
      path.push(sorted[i]);
      dfs(i + 1, remaining - sorted[i]);
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
