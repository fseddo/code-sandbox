import { defineAlgoProblem } from "../problem";

// In-place matrix problem: zero out the row and column of every cell that is 0, mutating the input
// `matrix` and returning that same reference. The checker asserts `actual === args[0]` (same instance)
// and that it deep-equals `expected`. See problem-authoring.md (in-place policy).
export const setZeroes = defineAlgoProblem<[number[][]], number[][]>({
  id: "set-matrix-zeroes",
  number: 80,
  title: "Set Matrix Zeroes",
  difficulty: "medium",
  tags: ["array", "hash-table", "matrix"],
  functionName: "setZeroes",
  prompt: `Given an \`m x n\` integer matrix, if any cell holds \`0\`, set its **entire row and column** to \`0\`.

Do this **in place**: mutate the input matrix directly and return that same matrix (do not allocate a new one).`,
  constraints: [
    "m == matrix.length",
    "n == matrix[0].length",
    "1 <= m, n <= 200",
    "-2^31 <= matrix[i][j] <= 2^31 - 1",
  ],
  checker: `(actual, args, expected) => {
    const grid = args[0];
    if (actual !== grid) return false;
    if (grid.length !== expected.length) return false;
    return grid.every((row, i) =>
      row.length === expected[i].length && row.every((value, j) => value === expected[i][j]));
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[][]} matrix
 * @return {number[][]} the same matrix, zeroed in place
 */
function setZeroes(matrix) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} matrix
 * @return {number[][]} the same matrix, zeroed in place
 */
function setZeroes(matrix: number[][]): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "single zero",
      args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]],
      expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
      explanation: "The zero at (1,1) clears row 1 and column 1.",
    },
    {
      name: "two zeroes",
      args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]],
      expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]],
    },
    {
      name: "no zero",
      args: [[[1, 2], [3, 4]]],
      expected: [[1, 2], [3, 4]],
    },
  ],
  hiddenTests: [
    { args: [[[0]]], expected: [[0]] },
    { args: [[[5]]], expected: [[5]] },
    { args: [[[1, 0, 3]]], expected: [[0, 0, 0]] },
    { args: [[[1], [0], [3]]], expected: [[0], [0], [0]] },
    { args: [[[0, 0], [0, 0]]], expected: [[0, 0], [0, 0]] },
    { args: [[[1, 2], [3, 4]]], expected: [[1, 2], [3, 4]] },
    { args: [[[1, 2, 3], [4, 0, 6], [7, 8, 9]]], expected: [[1, 0, 3], [0, 0, 0], [7, 0, 9]] },
    { args: [[[1, 0], [0, 1]]], expected: [[0, 0], [0, 0]] },
    { args: [[[-1, 2, 0], [3, -4, 5]]], expected: [[0, 0, 0], [3, -4, 0]] },
    { args: [[[1, 1, 1], [1, 1, 1]]], expected: [[1, 1, 1], [1, 1, 1]] },
    { args: [[[7, 0, 7], [7, 7, 7], [0, 7, 7]]], expected: [[0, 0, 0], [0, 0, 7], [0, 0, 0]] },
    {
      args: [(() => {
        const g = Array.from({ length: 200 }, () => Array.from({ length: 200 }, () => 1));
        g[100][100] = 0;
        return g;
      })()],
      expected: (() => {
        const g = Array.from({ length: 200 }, (_, i) =>
          Array.from({ length: 200 }, (_, j) => (i === 100 || j === 100 ? 0 : 1)));
        return g;
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "73", acRate: 0.6289922924841782, confidence: 0.95 },
  solutions: [
    {
      name: "First row and column as markers",
      explanation: `Use the matrix's own first row and column as flags for which columns/rows must be zeroed, plus two booleans for whether the first row and first column themselves contain a zero. Scan the interior to set flags, apply zeroing from the flags, then handle the first row/column last.

\`O(m·n)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  // The first row and column will double as marker storage, so capture their own
  // fate up front — these flags decide whether to zero them at the very end.
  let firstRowZero = false;
  let firstColZero = false;
  for (let j = 0; j < n; j++) if (matrix[0][j] === 0) firstRowZero = true;
  for (let i = 0; i < m; i++) if (matrix[i][0] === 0) firstColZero = true;
  // Pass 1: scan the interior and stamp each zero's row/column into the headers.
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0; // mark this row in the first column
        matrix[0][j] = 0; // mark this column in the first row
      }
    }
  }
  // Pass 2: apply the marks — clear any interior cell whose header was flagged.
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
    }
  }
  // Finally resolve the border itself from the saved flags (it can't mark itself).
  if (firstRowZero) for (let j = 0; j < n; j++) matrix[0][j] = 0;
  if (firstColZero) for (let i = 0; i < m; i++) matrix[i][0] = 0;
  return matrix; // same instance, mutated in place
}`,
        typescript: `function setZeroes(matrix: number[][]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;
  // The first row and column will double as marker storage, so capture their own
  // fate up front — these flags decide whether to zero them at the very end.
  let firstRowZero = false;
  let firstColZero = false;
  for (let j = 0; j < n; j++) if (matrix[0][j] === 0) firstRowZero = true;
  for (let i = 0; i < m; i++) if (matrix[i][0] === 0) firstColZero = true;
  // Pass 1: scan the interior and stamp each zero's row/column into the headers.
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0; // mark this row in the first column
        matrix[0][j] = 0; // mark this column in the first row
      }
    }
  }
  // Pass 2: apply the marks — clear any interior cell whose header was flagged.
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
    }
  }
  // Finally resolve the border itself from the saved flags (it can't mark itself).
  if (firstRowZero) for (let j = 0; j < n; j++) matrix[0][j] = 0;
  if (firstColZero) for (let i = 0; i < m; i++) matrix[i][0] = 0;
  return matrix; // same instance, mutated in place
}`,
      },
    },
  ],
});
