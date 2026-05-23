import { defineAlgoProblem } from "../problem";

export const searchMatrix = defineAlgoProblem<[number[][], number], boolean>({
  id: "search-a-2d-matrix",
  number: 81,
  title: "Search a 2D Matrix",
  difficulty: "medium",
  tags: ["array", "binary-search", "matrix"],
  functionName: "searchMatrix",
  prompt: `You are given an \`m x n\` integer matrix with two properties:
- Each row is sorted in non-decreasing order from left to right.
- The first integer of each row is greater than the last integer of the previous row.

Given an integer \`target\`, return \`true\` if it appears in the matrix, and \`false\` otherwise. Aim for \`O(log(m·n))\` time.`,
  constraints: [
    "m == matrix.length",
    "n == matrix[i].length",
    "1 <= m, n <= 100",
    "-10^4 <= matrix[i][j], target <= 10^4",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
function searchMatrix(matrix, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
function searchMatrix(matrix: number[][], target: number): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "present", args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true, explanation: "3 is in the first row." },
    { name: "absent", args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false, explanation: "13 falls in the gap between rows." },
    { name: "single cell hit", args: [[[5]], 5], expected: true },
  ],
  hiddenTests: [
    { args: [[[1]], 2], expected: false },
    { args: [[[1, 3]], 3], expected: true },
    { args: [[[1, 3]], 2], expected: false },
    { args: [[[1], [3], [5]], 5], expected: true },
    { args: [[[1], [3], [5]], 4], expected: false },
    { args: [[[1, 2, 3, 4, 5]], 1], expected: true },
    { args: [[[1, 2, 3, 4, 5]], 5], expected: true },
    { args: [[[-10, -5], [0, 7]], -5], expected: true },
    { args: [[[-10, -5], [0, 7]], -7], expected: false },
    { args: [[[1, 3, 5], [7, 9, 11], [13, 15, 17]], 13], expected: true },
    { args: [[[1, 3, 5], [7, 9, 11], [13, 15, 17]], 17], expected: true },
    { args: [[[1, 3, 5], [7, 9, 11], [13, 15, 17]], 0], expected: false },
    {
      args: [
        Array.from({ length: 100 }, (_, i) => Array.from({ length: 100 }, (_, j) => i * 100 + j)),
        9999,
      ],
      expected: true,
    },
    {
      args: [
        Array.from({ length: 100 }, (_, i) => Array.from({ length: 100 }, (_, j) => i * 100 + j)),
        10000,
      ],
      expected: false,
    },
  ],
  source: { origin: "leetcode", frontendId: "74", acRate: 0.5393329486353909, confidence: 0.97 },
  solutions: [
    {
      name: "Binary search on the flattened index",
      explanation: `Because the rows concatenate into one fully sorted sequence, treat the matrix as a virtual array of length \`m·n\` and binary-search it. Map a flat index \`k\` back to \`matrix[Math.floor(k/n)][k%n]\`.

\`O(log(m·n))\` time, \`O(1)\` space.`,
      code: {
        javascript: `function searchMatrix(matrix, target) {
  const m = matrix.length;
  const n = matrix[0].length;
  let lo = 0;
  let hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const value = matrix[Math.floor(mid / n)][mid % n];
    if (value === target) return true;
    if (value < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
        typescript: `function searchMatrix(matrix: number[][], target: number): boolean {
  const m = matrix.length;
  const n = matrix[0].length;
  let lo = 0;
  let hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const value = matrix[Math.floor(mid / n)][mid % n];
    if (value === target) return true;
    if (value < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
      },
    },
  ],
});
