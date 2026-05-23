import { defineAlgoProblem } from "../problem";

// Any-order problem: the set of k-combinations is fixed, but their order (and the order within each
// combination) is the solver's choice. The checker sorts within each combination and then sorts the
// list of combinations before deep-comparing to `expected`.
export const combine = defineAlgoProblem<[number, number], number[][]>({
  id: "combinations",
  number: 83,
  title: "Combinations",
  difficulty: "medium",
  tags: ["backtracking"],
  functionName: "combine",
  prompt: `Given two integers \`n\` and \`k\`, return **all** combinations of \`k\` distinct numbers chosen from the range \`1..n\`.

The combinations may be returned in **any order**, and the numbers within each combination may be in any order.`,
  constraints: ["1 <= n <= 20", "1 <= k <= n"],
  checker: `(actual, args, expected) => {
    const norm = (lists) => lists
      .map((combo) => [...combo].sort((a, b) => a - b))
      .sort((a, b) => {
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
          if (a[i] !== b[i]) return a[i] - b[i];
        }
        return a.length - b.length;
      });
    if (!Array.isArray(actual)) return false;
    const a = norm(actual);
    const e = norm(expected);
    if (a.length !== e.length) return false;
    return a.every((combo, i) =>
      combo.length === e[i].length && combo.every((v, j) => v === e[i][j]));
  }`,
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
function combine(n, k) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
function combine(n: number, k: number): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "choose 2 of 4",
      args: [4, 2],
      expected: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]],
      explanation: "All 6 unordered pairs from {1,2,3,4}.",
    },
    { name: "choose 1 of 1", args: [1, 1], expected: [[1]] },
    { name: "choose 3 of 3", args: [3, 3], expected: [[1, 2, 3]] },
  ],
  hiddenTests: [
    { args: [2, 1], expected: [[1], [2]] },
    { args: [2, 2], expected: [[1, 2]] },
    { args: [3, 1], expected: [[1], [2], [3]] },
    { args: [3, 2], expected: [[1, 2], [1, 3], [2, 3]] },
    { args: [4, 1], expected: [[1], [2], [3], [4]] },
    { args: [4, 4], expected: [[1, 2, 3, 4]] },
    { args: [5, 2], expected: [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]] },
    {
      args: [5, 3],
      expected: [
        [1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5],
        [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5],
      ],
    },
    {
      args: [6, 5],
      expected: [
        [1, 2, 3, 4, 5], [1, 2, 3, 4, 6], [1, 2, 3, 5, 6],
        [1, 2, 4, 5, 6], [1, 3, 4, 5, 6], [2, 3, 4, 5, 6],
      ],
    },
    {
      // Scale: C(20, 18) = 190 combinations of length 18.
      args: [20, 18],
      expected: (() => {
        const result: number[][] = [];
        const combo: number[] = [];
        const backtrack = (start: number) => {
          if (combo.length === 18) {
            result.push([...combo]);
            return;
          }
          for (let i = start; i <= 20; i++) {
            combo.push(i);
            backtrack(i + 1);
            combo.pop();
          }
        };
        backtrack(1);
        return result;
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "77", acRate: 0.7457941300690911, confidence: 0.95 },
  solutions: [
    {
      name: "Backtracking",
      explanation: `Build combinations incrementally. At each step pick the next number starting from \`start\` to keep them increasing (so each combination is generated once), recurse, then backtrack. When the current combination reaches length \`k\`, record a copy.

\`O(C(n, k) · k)\` time to emit all combinations, \`O(k)\` recursion depth.`,
      code: {
        javascript: `function combine(n, k) {
  const result = [];
  const combo = [];
  const backtrack = (start) => {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i <= n; i++) {
      combo.push(i);
      backtrack(i + 1);
      combo.pop();
    }
  };
  backtrack(1);
  return result;
}`,
        typescript: `function combine(n: number, k: number): number[][] {
  const result: number[][] = [];
  const combo: number[] = [];
  const backtrack = (start: number): void => {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i <= n; i++) {
      combo.push(i);
      backtrack(i + 1);
      combo.pop();
    }
  };
  backtrack(1);
  return result;
}`,
      },
    },
  ],
});
