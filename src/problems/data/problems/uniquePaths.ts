import { defineAlgoProblem } from "../problem";

export const uniquePaths = defineAlgoProblem<[number, number], number>({
  id: "unique-paths",
  number: 69,
  title: "Unique Paths",
  difficulty: "medium",
  tags: ["math", "dynamic-programming", "combinatorics"],
  functionName: "uniquePaths",
  prompt: `A robot sits in the top-left cell of an \`m x n\` grid. It can move only **right** or **down**, one cell at a time, and wants to reach the bottom-right cell.

Return the number of distinct paths the robot can take.`,
  constraints: ["1 <= m, n <= 100", "The answer fits in a 32-bit signed integer."],
  starterCode: {
    javascript: `/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
function uniquePaths(m, n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
function uniquePaths(m: number, n: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "3x7 grid", args: [3, 7], expected: 28 },
    { name: "3x2 grid", args: [3, 2], expected: 3, explanation: "Down-down-right, down-right-down, right-down-down." },
    { name: "1x1 grid", args: [1, 1], expected: 1, explanation: "Already at the destination." },
  ],
  hiddenTests: [
    { args: [1, 1], expected: 1 },
    { args: [1, 10], expected: 1 },
    { args: [10, 1], expected: 1 },
    { args: [2, 2], expected: 2 },
    { args: [3, 3], expected: 6 },
    { args: [4, 4], expected: 20 },
    { args: [7, 3], expected: 28 },
    { args: [10, 10], expected: 48620 },
    { args: [16, 16], expected: 155117520 },
    { args: [23, 12], expected: 193536720 },
    { args: [51, 9], expected: 1916797311 },
    { args: [2, 100], expected: 100 },
    { args: [100, 1], expected: 1 },
    // Scale: large grid; answer kept below 2^53 so float DP stays exact.
    { args: [30, 12], expected: 2311801440 },
    { args: [60, 6], expected: 7624512 },
  ],
  source: { origin: "leetcode", frontendId: "62", acRate: 0.6684225082647999, confidence: 0.9 },
  solutions: [
    {
      name: "Rolling 1-D DP",
      explanation: `Each cell's path count is the sum of the cell above and the cell to its left, with the whole top row and left column equal to 1. Sweeping row by row, a single array of length \`n\` suffices: \`row[j] += row[j-1]\` updates "above + left" in place.

\`O(m·n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function uniquePaths(m, n) {
  // row[j] = dp[i][j] for the row currently in progress; row 0 is all 1s (only one route: always right).
  const row = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    // Column 0 stays 1 (the only route down the left edge), so start at j = 1.
    for (let j = 1; j < n; j++) {
      // row[j] is still dp[i-1][j]; row[j-1] was already overwritten this pass, so it's already dp[i][j-1].
      row[j] += row[j - 1];
    }
  }
  return row[n - 1];
}`,
        typescript: `function uniquePaths(m: number, n: number): number {
  // row[j] = dp[i][j] for the row currently in progress; row 0 is all 1s (only one route: always right).
  const row: number[] = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    // Column 0 stays 1 (the only route down the left edge), so start at j = 1.
    for (let j = 1; j < n; j++) {
      // row[j] is still dp[i-1][j]; row[j-1] was already overwritten this pass, so it's already dp[i][j-1].
      row[j] += row[j - 1];
    }
  }
  return row[n - 1];
}`,
      },
    },
  ],
});
