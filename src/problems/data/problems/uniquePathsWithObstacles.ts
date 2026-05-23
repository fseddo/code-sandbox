import { defineAlgoProblem } from "../problem";

export const uniquePathsWithObstacles = defineAlgoProblem<[number[][]], number>({
  id: "unique-paths-ii",
  number: 70,
  title: "Unique Paths II",
  difficulty: "medium",
  tags: ["array", "dynamic-programming", "matrix"],
  functionName: "uniquePathsWithObstacles",
  prompt: `A robot sits in the top-left cell of a grid given as \`obstacleGrid\`, where \`1\` marks an obstacle and \`0\` an open cell. It can move only **right** or **down** and wants to reach the bottom-right cell.

Return the number of distinct obstacle-free paths. If the start or destination cell is itself an obstacle, no path exists, so the answer is \`0\`.`,
  constraints: [
    "m == obstacleGrid.length",
    "n == obstacleGrid[0].length",
    "1 <= m, n <= 100",
    "obstacleGrid[i][j] is 0 or 1.",
    "The answer fits in a 32-bit signed integer.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
function uniquePathsWithObstacles(obstacleGrid) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "obstacle in middle",
      args: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]],
      expected: 2,
      explanation: "The single obstacle splits the paths into a top route and a bottom route.",
    },
    { name: "one obstacle, small", args: [[[0, 1], [0, 0]]], expected: 1 },
    { name: "blocked start", args: [[[1, 0], [0, 0]]], expected: 0, explanation: "The start cell is an obstacle." },
  ],
  hiddenTests: [
    { args: [[[0]]], expected: 1 },
    { args: [[[1]]], expected: 0 },
    { args: [[[0, 0]]], expected: 1 },
    { args: [[[0, 1, 0]]], expected: 0 },
    { args: [[[0], [0], [0]]], expected: 1 },
    { args: [[[0], [1], [0]]], expected: 0 },
    { args: [[[0, 0, 0], [0, 0, 0], [0, 0, 0]]], expected: 6 },
    { args: [[[0, 0], [0, 1]]], expected: 0 },
    { args: [[[0, 0, 0], [1, 1, 0], [0, 0, 0]]], expected: 1 },
    { args: [[[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 1, 0, 0]]], expected: 2 },
    { args: [[[0, 0, 0], [0, 0, 0], [0, 0, 1]]], expected: 0 },
    { args: [[[0, 1], [0, 0], [1, 0], [0, 0]]], expected: 1 },
    // Scale: obstacle-free 25x25; answer below 2^53.
    { args: [Array.from({ length: 25 }, () => new Array(25).fill(0))], expected: 32247603683100 },
  ],
  source: { origin: "leetcode", frontendId: "63", acRate: 0.4448846487961165, confidence: 0.9 },
  solutions: [
    {
      name: "Rolling 1-D DP",
      explanation: `Same recurrence as the obstacle-free version — each cell is "above + left" — but an obstacle cell contributes 0 paths. Sweeping row by row with a single array, set \`row[j] = 0\` whenever the grid cell is an obstacle; otherwise \`row[j] += row[j-1]\`. Seed \`row[0]\` from whether the first column stays open.

\`O(m·n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function uniquePathsWithObstacles(obstacleGrid) {
  const n = obstacleGrid[0].length;
  const row = new Array(n).fill(0);
  row[0] = obstacleGrid[0][0] === 1 ? 0 : 1;
  for (let i = 0; i < obstacleGrid.length; i++) {
    for (let j = 0; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        row[j] = 0;
      } else if (j > 0) {
        row[j] += row[j - 1];
      }
    }
  }
  return row[n - 1];
}`,
        typescript: `function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
  const n = obstacleGrid[0].length;
  const row: number[] = new Array(n).fill(0);
  row[0] = obstacleGrid[0][0] === 1 ? 0 : 1;
  for (let i = 0; i < obstacleGrid.length; i++) {
    for (let j = 0; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        row[j] = 0;
      } else if (j > 0) {
        row[j] += row[j - 1];
      }
    }
  }
  return row[n - 1];
}`,
      },
    },
  ],
});
