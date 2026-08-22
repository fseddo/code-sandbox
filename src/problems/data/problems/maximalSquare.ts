import { defineAlgoProblem } from "../problem";

export const maximalSquare = defineAlgoProblem<[number[][]], number>({
  id: "maximal-square",
  number: 156,
  title: "Maximal Square",
  difficulty: "medium",
  tags: ["array", "dynamic-programming", "matrix"],
  functionName: "maximalSquare",
  prompt: `You are given an \`m x n\` binary \`matrix\` where every cell is \`0\` or \`1\`.

Find the largest square submatrix that contains only \`1\`s — the square's sides must run along the grid's rows and columns (no rotation) — and return its **area** (side length squared).

If the grid has no \`1\` at all, return \`0\`.`,
  constraints: [
    "m == matrix.length",
    "n == matrix[i].length",
    "1 <= m, n <= 300",
    "matrix[i][j] is 0 or 1.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} matrix
 * @return {number}
 */
function maximalSquare(matrix) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} matrix
 * @return {number}
 */
function maximalSquare(matrix: number[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "mixed grid",
      args: [[
        [1, 0, 1, 0, 0],
        [1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0],
      ]],
      expected: 4,
      explanation: "The 2x2 block of 1s at rows 1-2, columns 2-3 is the largest all-1s square; area = 2*2 = 4.",
    },
    {
      name: "no 2x2 square",
      args: [[[0, 1], [1, 0]]],
      expected: 1,
      explanation: "The 1s are diagonal, so no square bigger than a single cell is all 1s.",
    },
    { name: "single zero cell", args: [[[0]]], expected: 0 },
  ],
  hiddenTests: [
    // Boundary: smallest possible grids.
    { args: [[[0]]], expected: 0 },
    { args: [[[1]]], expected: 1 },
    // Edge: all-zero grid — no square of 1s exists anywhere.
    { args: [[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]], expected: 0 },
    // Edge: rectangular all-ones grid — capped by the shorter dimension.
    { args: [[[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]]], expected: 9 },
    // Structural: a row vector — no 2-row square is possible regardless of length.
    { args: [[[1, 1, 1, 1, 1, 1]]], expected: 1 },
    // Structural: a column vector — mirror of the row-vector case.
    { args: [[[1], [1], [1], [1], [1], [1]]], expected: 1 },
    // Structural: the largest square sits in a corner, surrounded by zeros.
    {
      args: [[
        [1, 1, 1, 0],
        [1, 1, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
      ]],
      expected: 9,
    },
    // Structural: the largest square sits in the center, surrounded by zeros.
    {
      args: [[
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]],
      expected: 9,
    },
    // Structural: one 0 planted in the exact center of an all-1s grid forces a
    // smaller square — every 3x3 or 4x4 window in a 5x5 grid covers the center cell.
    {
      args: [[
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ]],
      expected: 4,
    },
    // Anti-hardcode: two separate all-1s regions of different sizes — the answer
    // must come from the larger (bottom-right) region, not the first one scanned.
    {
      args: [[
        [1, 1, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 1],
      ]],
      expected: 16,
    },
    // Scale: 100x100 all-ones grid — the entire grid is the answer.
    { args: [Array.from({ length: 100 }, () => Array.from({ length: 100 }, () => 1))], expected: 10000 },
    // Scale: 100x100 checkerboard — adjacent cells always differ, so no 2x2 all-1s
    // square exists anywhere; this also separates a correct DP from an off-by-one bug.
    {
      args: [Array.from({ length: 100 }, (_unused, i) =>
        Array.from({ length: 100 }, (_inner, j) => (i + j) % 2),
      )],
      expected: 1,
    },
    // Scale: a very wide grid (300 rows, 2 columns), all ones — capped at 2x2 despite
    // 300 rows, and exercises the row-major DP over a non-square, near-max-bound grid.
    { args: [Array.from({ length: 300 }, () => [1, 1])], expected: 4 },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "2-D DP — largest square ending at each cell",
      explanation: `Let \`dp[i][j]\` be the side length of the largest all-1s square whose **bottom-right corner** is \`(i, j)\`. A square can only extend to \`(i, j)\` if \`matrix[i][j]\` is \`1\`, and then it's bottlenecked by its three neighbours — the square can be no bigger than the smallest of the square ending just above, just to the left, and diagonally up-left:

\`dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\`

(treating any out-of-bounds neighbour as \`0\`). If \`matrix[i][j]\` is \`0\`, \`dp[i][j] = 0\` — no square can end there. The answer is the largest \`dp\` value squared (its area).

\`O(rows * cols)\` time and \`O(rows * cols)\` space for the DP table (row-optimizable to \`O(cols)\` by keeping only the previous row, not needed at these bounds).`,
      code: {
        javascript: `function maximalSquare(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

  let maxSide = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] !== 1) continue; // dp[i][j] stays 0 — no square ends here
      // The square ending at (i, j) is bottlenecked by the smallest of the three
      // neighbours (out-of-bounds counts as 0), plus itself.
      const up = i > 0 ? dp[i - 1][j] : 0;
      const left = j > 0 ? dp[i][j - 1] : 0;
      const upLeft = i > 0 && j > 0 ? dp[i - 1][j - 1] : 0;
      dp[i][j] = 1 + Math.min(up, left, upLeft);
      if (dp[i][j] > maxSide) maxSide = dp[i][j];
    }
  }
  return maxSide * maxSide;
}`,
        typescript: `function maximalSquare(matrix: number[][]): number {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

  let maxSide = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] !== 1) continue; // dp[i][j] stays 0 — no square ends here
      // The square ending at (i, j) is bottlenecked by the smallest of the three
      // neighbours (out-of-bounds counts as 0), plus itself.
      const up = i > 0 ? dp[i - 1][j] : 0;
      const left = j > 0 ? dp[i][j - 1] : 0;
      const upLeft = i > 0 && j > 0 ? dp[i - 1][j - 1] : 0;
      dp[i][j] = 1 + Math.min(up, left, upLeft);
      if (dp[i][j] > maxSide) maxSide = dp[i][j];
    }
  }
  return maxSide * maxSide;
}`,
      },
    },
  ],
});
