import { defineAlgoProblem } from "../problem";

export const rangeSum2D = defineAlgoProblem<[number[][], number[][]], number[]>({
  id: "range-sum-query-2d-immutable",
  number: 129,
  title: "Range Sum Query 2D - Immutable",
  difficulty: "medium",
  tags: ["array", "matrix", "prefix-sum", "design"],
  functionName: "rangeSum2D",
  prompt: `Given an integer \`matrix\` that is never modified, answer a batch of 2D range-sum queries. Each query is \`[r1, c1, r2, c2]\` (0-based) and asks for the sum of every element inside the rectangle whose top-left corner is \`(r1, c1)\` and bottom-right corner is \`(r2, c2)\`, **inclusive** of all four edges.

Return an array whose \`k\`-th entry is the answer to the \`k\`-th query. Because the matrix is immutable, precompute a 2D prefix-sum table once and answer every query in constant time.`,
  constraints: [
    "0 <= matrix.length, matrix[0].length <= 200",
    "-10^5 <= matrix[r][c] <= 10^5",
    "0 <= queries.length <= 10^4",
    "0 <= r1 <= r2 < matrix.length and 0 <= c1 <= c2 < matrix[0].length",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} matrix
 * @param {number[][]} queries
 * @return {number[]}
 */
function rangeSum2D(matrix, queries) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} matrix
 * @param {number[][]} queries
 * @return {number[]}
 */
function rangeSum2D(matrix: number[][], queries: number[][]): number[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "two rectangles",
      args: [
        [
          [3, 0, 1, 4, 2],
          [5, 6, 3, 2, 1],
          [1, 2, 0, 1, 5],
          [4, 1, 0, 1, 7],
          [1, 0, 3, 0, 5],
        ],
        [[2, 1, 4, 3], [1, 1, 2, 2]],
      ],
      expected: [8, 11],
      explanation: "Rectangle (2,1)-(4,3) sums to 8; rectangle (1,1)-(2,2) sums to 6+3+2+0 = 11.",
    },
    {
      name: "single cell",
      args: [[[1, 2], [3, 4]], [[0, 0, 0, 0], [1, 1, 1, 1]]],
      expected: [1, 4],
    },
    {
      name: "whole matrix",
      args: [[[1, 2], [3, 4]], [[0, 0, 1, 1]]],
      expected: [10],
    },
    { name: "no queries", args: [[[5]], []], expected: [] },
  ],
  hiddenTests: [
    { args: [[[5]], [[0, 0, 0, 0]]], expected: [5] },
    { args: [[[-1, -2], [-3, -4]], [[0, 0, 1, 1], [0, 0, 0, 1]]], expected: [-10, -3] },
    { args: [[[1, 1, 1], [1, 1, 1], [1, 1, 1]], [[0, 0, 2, 2], [1, 1, 1, 1], [0, 0, 0, 2]]], expected: [9, 1, 3] },
    {
      args: [
        [[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]],
        [[0, 0, 4, 4], [1, 2, 3, 4]],
      ],
      expected: [58, 20],
    },
    { args: [[[2, 4, 6, 8]], [[0, 0, 0, 3], [0, 1, 0, 2]]], expected: [20, 10] },
    { args: [[[1], [2], [3], [4]], [[0, 0, 3, 0], [1, 0, 2, 0]]], expected: [10, 5] },
    {
      args: [
        Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 1)),
        [[0, 0, 29, 29], [10, 10, 19, 19]],
      ],
      expected: [900, 100],
    },
  ],
  source: { origin: "leetcode", frontendId: "304", acRate: 0.59, confidence: 0.9 },
  solutions: [
    {
      name: "2D prefix-sum table",
      explanation: `Build a prefix-sum table \`pre\` with an extra zero row and column, where \`pre[r + 1][c + 1]\` is the sum of every cell in the rectangle from \`(0, 0)\` to \`(r, c)\`. Each entry is the cell plus the rectangle above plus the rectangle to the left, minus the rectangle counted twice in their overlap:

\`pre[r+1][c+1] = matrix[r][c] + pre[r][c+1] + pre[r+1][c] - pre[r][c]\`.

A query \`(r1, c1, r2, c2)\` then reads off four corners by inclusion–exclusion: the big rectangle, minus the strip above, minus the strip to the left, plus the top-left corner added back once:

\`pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]\`.

Building the table is \`O(m·n)\`; every query is \`O(1)\`, so the batch is \`O(m·n + q)\`.`,
      code: {
        javascript: `function rangeSum2D(matrix, queries) {
  const rows = matrix.length;
  const cols = rows ? matrix[0].length : 0;
  // pre[r+1][c+1] = sum of the rectangle from (0,0) to (r,c); the extra
  // zero row/column removes the boundary checks when subtracting strips.
  const pre = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // cell + rectangle above + rectangle left - the overlap counted twice.
      pre[r + 1][c + 1] = matrix[r][c] + pre[r][c + 1] + pre[r + 1][c] - pre[r][c];
    }
  }
  // Inclusion-exclusion off the four corners of each query rectangle.
  return queries.map(([r1, c1, r2, c2]) =>
    pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1]);
}`,
        typescript: `function rangeSum2D(matrix: number[][], queries: number[][]): number[] {
  const rows = matrix.length;
  const cols = rows ? matrix[0].length : 0;
  // pre[r+1][c+1] = sum of the rectangle from (0,0) to (r,c); the extra
  // zero row/column removes the boundary checks when subtracting strips.
  const pre = Array.from({ length: rows + 1 }, () => new Array<number>(cols + 1).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // cell + rectangle above + rectangle left - the overlap counted twice.
      pre[r + 1][c + 1] = matrix[r][c] + pre[r][c + 1] + pre[r + 1][c] - pre[r][c];
    }
  }
  // Inclusion-exclusion off the four corners of each query rectangle.
  return queries.map(([r1, c1, r2, c2]) =>
    pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1]);
}`,
      },
    },
  ],
});
