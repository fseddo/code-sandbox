import { defineAlgoProblem } from "../problem";

// In-place problem: the solution rotates `matrix` 90° clockwise and returns the same array. The
// `checker` reads the post-call `args` and asserts (a) `actual` is the *same instance* as the input
// and (b) it equals the expected rotated grid. See problem-authoring.md (in-place policy).
export const rotateImage = defineAlgoProblem<[number[][]], number[][]>({
  id: "rotate-image",
  number: 57,
  title: "Rotate Image",
  difficulty: "medium",
  tags: ["array", "math", "matrix"],
  functionName: "rotate",
  prompt: `You are given an \`n x n\` 2D \`matrix\` representing an image. Rotate the image by **90 degrees clockwise**.

You must rotate the matrix **in place** — mutate the input directly and return that same array. Do not allocate a separate \`n x n\` grid to hold the result.`,
  constraints: [
    "n == matrix.length == matrix[i].length",
    "1 <= n <= 20",
    "-1000 <= matrix[i][j] <= 1000",
  ],
  checker: `(actual, args, expected) => {
    const grid = args[0];
    if (actual !== grid) return false;
    if (grid.length !== expected.length) return false;
    return grid.every((row, i) =>
      row.length === expected[i].length && row.every((value, j) => value === expected[i][j])
    );
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[][]} matrix
 * @return {number[][]} the same matrix, rotated 90° clockwise in place
 */
function rotate(matrix) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} matrix
 * @return {number[][]} the same matrix, rotated 90° clockwise in place
 */
function rotate(matrix: number[][]): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "3x3",
      args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
      expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
      explanation: "The top row becomes the right column; the first column bottom-to-top becomes the top row.",
    },
    {
      name: "4x4",
      args: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]],
      expected: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]],
    },
    { name: "single", args: [[[1]]], expected: [[1]] },
  ],
  hiddenTests: [
    { args: [[[1]]], expected: [[1]] },
    { args: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]] },
    { args: [[[-1, -2], [-3, -4]]], expected: [[-3, -1], [-4, -2]] },
    { args: [[[0, 0], [0, 0]]], expected: [[0, 0], [0, 0]] },
    { args: [[[1, 1, 1], [1, 1, 1], [1, 1, 1]]], expected: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
    { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
    {
      args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]],
      expected: [[13, 9, 5, 1], [14, 10, 6, 2], [15, 11, 7, 3], [16, 12, 8, 4]],
    },
    {
      args: [[[2, 29, 20, 26, 16, 28], [12, 27, 9, 25, 13, 21], [32, 33, 32, 2, 28, 14], [13, 14, 32, 27, 22, 26], [33, 1, 20, 7, 21, 7], [4, 24, 1, 6, 32, 34]]],
      expected: [[4, 33, 13, 32, 12, 2], [24, 1, 14, 33, 27, 29], [1, 20, 32, 32, 9, 20], [6, 7, 27, 2, 25, 26], [32, 21, 22, 28, 13, 16], [34, 7, 26, 14, 21, 28]],
    },
    { args: [[[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]]], expected: [[21, 16, 11, 6, 1], [22, 17, 12, 7, 2], [23, 18, 13, 8, 3], [24, 19, 14, 9, 4], [25, 20, 15, 10, 5]] },
    // Scale: 20x20 (the max size); an in-place layer rotation is instant.
    (() => {
      const n = 20;
      const input = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i * n + j));
      const expected = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => input[n - 1 - j][i]));
      return { args: [input], expected } as { args: [number[][]]; expected: number[][] };
    })(),
  ],
  source: { origin: "leetcode", frontendId: "48", acRate: 0.8008750490378729, confidence: 0.95 },
  solutions: [
    {
      name: "Transpose then reverse rows",
      explanation: `A 90° clockwise rotation is the composition of two simpler in-place moves: transpose the matrix (swap \`matrix[i][j]\` with \`matrix[j][i]\` across the diagonal), then reverse each row. Both touch only the existing cells, so no extra grid is needed.

\`O(n²)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (let i = 0; i < n; i++) matrix[i].reverse();
  return matrix;
}`,
        typescript: `function rotate(matrix: number[][]): number[][] {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (let i = 0; i < n; i++) matrix[i].reverse();
  return matrix;
}`,
      },
    },
  ],
});
