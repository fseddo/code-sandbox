import { defineAlgoProblem } from "../problem";

export const minPathSum = defineAlgoProblem<[number[][]], number>({
  id: "minimum-path-sum",
  number: 71,
  title: "Minimum Path Sum",
  difficulty: "medium",
  tags: ["array", "dynamic-programming", "matrix"],
  functionName: "minPathSum",
  prompt: `Given an \`m x n\` grid of non-negative integers, find a path from the top-left cell to the bottom-right cell that minimizes the sum of the numbers along it. You may move only **right** or **down**.

Return that minimum sum (the cost includes both the start and the destination cell).`,
  constraints: [
    "m == grid.length",
    "n == grid[0].length",
    "1 <= m, n <= 200",
    "0 <= grid[i][j] <= 200",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
function minPathSum(grid) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
function minPathSum(grid: number[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "3x3 grid",
      args: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]],
      expected: 7,
      explanation: "The path 1 -> 3 -> 1 -> 1 -> 1 sums to 7, the minimum.",
    },
    { name: "2x3 grid", args: [[[1, 2, 3], [4, 5, 6]]], expected: 12, explanation: "1 -> 2 -> 3 -> 6 sums to 12." },
    { name: "single cell", args: [[[5]]], expected: 5 },
  ],
  hiddenTests: [
    { args: [[[0]]], expected: 0 },
    { args: [[[1, 2, 3, 4]]], expected: 10 },
    { args: [[[1], [2], [3], [4]]], expected: 10 },
    { args: [[[1, 1], [1, 1]]], expected: 3 },
    { args: [[[0, 0], [0, 0]]], expected: 0 },
    { args: [[[5, 5, 5], [5, 5, 5], [5, 5, 5]]], expected: 25 },
    { args: [[[1, 99, 1], [1, 99, 1], [1, 1, 1]]], expected: 5 },
    { args: [[[3, 8, 6, 0, 5, 9, 9], [0, 9, 1, 4, 2, 0, 3], [7, 4, 8, 4, 9, 0, 9], [8, 6, 5, 8, 8, 5, 0]]], expected: 24 },
    { args: [[[7, 1, 3, 5, 8, 9, 9, 2, 1, 9, 0, 8, 3, 1, 6, 6, 9, 5]]], expected: 92 },
    { args: [[[200, 200], [200, 200]]], expected: 600 },
    { args: [[[1, 2], [5, 6], [1, 1]]], expected: 8 },
    { args: [[[9, 9, 9], [1, 1, 1], [9, 9, 1]]], expected: 13 },
    // Scale: 200x200 of identical values; the min path always touches m+n-1 cells.
    { args: [Array.from({ length: 200 }, () => new Array(200).fill(7))], expected: 7 * (200 + 200 - 1) },
  ],
  source: { origin: "leetcode", frontendId: "64", acRate: 0.6823171961886573, confidence: 0.93 },
  solutions: [
    {
      name: "Rolling 1-D DP",
      explanation: `Each cell's best cost is its own value plus the cheaper of the cell above and the cell to its left (the first row and column have only one predecessor). Sweep row by row with a single array of length \`n\`: for \`j > 0\`, \`row[j] = grid[i][j] + min(row[j], row[j-1])\` where \`row[j]\` is still "above" and \`row[j-1]\` is "left".

\`O(m·n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function minPathSum(grid) {
  const n = grid[0].length;
  const row = new Array(n).fill(0);
  row[0] = grid[0][0];
  for (let j = 1; j < n; j++) row[j] = row[j - 1] + grid[0][j];
  for (let i = 1; i < grid.length; i++) {
    row[0] += grid[i][0];
    for (let j = 1; j < n; j++) {
      row[j] = grid[i][j] + Math.min(row[j], row[j - 1]);
    }
  }
  return row[n - 1];
}`,
        typescript: `function minPathSum(grid: number[][]): number {
  const n = grid[0].length;
  const row: number[] = new Array(n).fill(0);
  row[0] = grid[0][0];
  for (let j = 1; j < n; j++) row[j] = row[j - 1] + grid[0][j];
  for (let i = 1; i < grid.length; i++) {
    row[0] += grid[i][0];
    for (let j = 1; j < n; j++) {
      row[j] = grid[i][j] + Math.min(row[j], row[j - 1]);
    }
  }
  return row[n - 1];
}`,
      },
    },
  ],
});
