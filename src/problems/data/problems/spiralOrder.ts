import { defineAlgoProblem } from "../problem";

export const spiralOrder = defineAlgoProblem<[number[][]], number[]>({
  id: "spiral-matrix",
  number: 62,
  title: "Spiral Matrix",
  difficulty: "medium",
  tags: ["array", "matrix", "simulation"],
  functionName: "spiralOrder",
  prompt: `Given an \`m x n\` matrix, return all of its elements in **spiral order**: start at the top-left, move right across the top row, down the right column, left across the bottom row, up the left column, and continue spiralling inward until every element is visited.`,
  constraints: [
    "m == matrix.length",
    "n == matrix[i].length",
    "1 <= m, n <= 10",
    "-100 <= matrix[i][j] <= 100",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix: number[][]): number[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "3x3",
      args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
      expected: [1, 2, 3, 6, 9, 8, 7, 4, 5],
      explanation: "Right across the top, down the right edge, left along the bottom, up the left edge, then the center.",
    },
    {
      name: "3x4",
      args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]],
      expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7],
    },
    { name: "single row", args: [[[1, 2, 3]]], expected: [1, 2, 3] },
  ],
  hiddenTests: [
    { args: [[[1]]], expected: [1] },
    { args: [[[1, 2]]], expected: [1, 2] },
    { args: [[[1], [2], [3]]], expected: [1, 2, 3] },
    { args: [[[1, 2], [3, 4]]], expected: [1, 2, 4, 3] },
    { args: [[[1, 2], [3, 4], [5, 6]]], expected: [1, 2, 4, 6, 5, 3] },
    { args: [[[7, 8, 9], [4, 5, 6], [1, 2, 3]]], expected: [7, 8, 9, 6, 3, 2, 1, 4, 5] },
    { args: [[[-1, -2], [-3, -4]]], expected: [-1, -2, -4, -3] },
    {
      args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]],
      expected: [1, 2, 3, 4, 8, 12, 16, 15, 14, 13, 9, 5, 6, 7, 11, 10],
    },
    { args: [[[1, 2, 3, 4, 5]]], expected: [1, 2, 3, 4, 5] },
    { args: [[[1], [2], [3], [4], [5]]], expected: [1, 2, 3, 4, 5] },
    {
      args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]],
      expected: [1, 2, 3, 6, 9, 12, 11, 10, 7, 4, 5, 8],
    },
    // Scale: 10x10 (max size); the boundary walk is O(m*n).
    (() => {
      const m = 10;
      const n = 10;
      const matrix = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => i * n + j + 1));
      let top = 0;
      let bottom = m - 1;
      let left = 0;
      let right = n - 1;
      const out: number[] = [];
      while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) out.push(matrix[top][j]);
        top++;
        for (let i = top; i <= bottom; i++) out.push(matrix[i][right]);
        right--;
        if (top <= bottom) { for (let j = right; j >= left; j--) out.push(matrix[bottom][j]); bottom--; }
        if (left <= right) { for (let i = bottom; i >= top; i--) out.push(matrix[i][left]); left++; }
      }
      return { args: [matrix], expected: out } as { args: [number[][]]; expected: number[] };
    })(),
  ],
  source: { origin: "leetcode", frontendId: "54", acRate: 0.5677940350457178, confidence: 0.96 },
  solutions: [
    {
      name: "Shrinking boundaries",
      explanation: `Keep four boundary indices — \`top\`, \`bottom\`, \`left\`, \`right\` — and peel one edge at a time: the top row (left→right), the right column (top→bottom), the bottom row (right→left), the left column (bottom→top). After each edge, move that boundary inward. The two inner walks are guarded so a single remaining row or column isn't visited twice.

\`O(m·n)\` time, \`O(1)\` extra space beyond the output.`,
      code: {
        javascript: `function spiralOrder(matrix) {
  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) out.push(matrix[top][j]);
    top++;
    for (let i = top; i <= bottom; i++) out.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let j = right; j >= left; j--) out.push(matrix[bottom][j]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) out.push(matrix[i][left]);
      left++;
    }
  }
  return out;
}`,
        typescript: `function spiralOrder(matrix: number[][]): number[] {
  const out: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) out.push(matrix[top][j]);
    top++;
    for (let i = top; i <= bottom; i++) out.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let j = right; j >= left; j--) out.push(matrix[bottom][j]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) out.push(matrix[i][left]);
      left++;
    }
  }
  return out;
}`,
      },
    },
  ],
});
