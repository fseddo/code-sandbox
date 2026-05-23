import { defineAlgoProblem } from "../problem";

export const generateMatrix = defineAlgoProblem<[number], number[][]>({
  id: "spiral-matrix-ii",
  number: 66,
  title: "Spiral Matrix II",
  difficulty: "medium",
  tags: ["array", "matrix", "simulation"],
  functionName: "generateMatrix",
  prompt: `Given a positive integer \`n\`, generate an \`n x n\` matrix filled with the numbers from \`1\` to \`n²\` placed in **spiral order** — starting at the top-left, moving right, then down, then left, then up, spiralling inward.`,
  constraints: ["1 <= n <= 20"],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {number[][]}
 */
function generateMatrix(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {number[][]}
 */
function generateMatrix(n: number): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "3x3",
      args: [3],
      expected: [[1, 2, 3], [8, 9, 4], [7, 6, 5]],
      explanation: "1–3 fill the top row, 4–5 the right column, 6–7 the bottom row, 8 the left column, 9 the center.",
    },
    { name: "single", args: [1], expected: [[1]] },
    { name: "2x2", args: [2], expected: [[1, 2], [4, 3]] },
  ],
  hiddenTests: [
    { args: [1], expected: [[1]] },
    { args: [2], expected: [[1, 2], [4, 3]] },
    { args: [3], expected: [[1, 2, 3], [8, 9, 4], [7, 6, 5]] },
    { args: [4], expected: [[1, 2, 3, 4], [12, 13, 14, 5], [11, 16, 15, 6], [10, 9, 8, 7]] },
    {
      args: [5],
      expected: [
        [1, 2, 3, 4, 5],
        [16, 17, 18, 19, 6],
        [15, 24, 25, 20, 7],
        [14, 23, 22, 21, 8],
        [13, 12, 11, 10, 9],
      ],
    },
    // Scale: n up to 20 (max); a boundary walk is O(n²) and instant. Computed with the reference walk.
    ...[6, 10, 15, 20].map((n) => {
      const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
      let top = 0;
      let bottom = n - 1;
      let left = 0;
      let right = n - 1;
      let value = 1;
      while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) matrix[top][j] = value++;
        top++;
        for (let i = top; i <= bottom; i++) matrix[i][right] = value++;
        right--;
        if (top <= bottom) { for (let j = right; j >= left; j--) matrix[bottom][j] = value++; bottom--; }
        if (left <= right) { for (let i = bottom; i >= top; i--) matrix[i][left] = value++; left++; }
      }
      return { name: `n=${n}`, args: [n], expected: matrix } as { name: string; args: [number]; expected: number[][] };
    }),
  ],
  source: { origin: "leetcode", frontendId: "59", acRate: 0.7505467804105785, confidence: 0.95 },
  solutions: [
    {
      name: "Shrinking boundaries",
      explanation: `Allocate the \`n x n\` grid, then fill it with an incrementing counter while peeling boundaries. Walk the top row left→right, the right column top→bottom, the bottom row right→left, and the left column bottom→top, moving each boundary inward after its pass. The guards on the inner two walks handle odd \`n\` cleanly.

\`O(n²)\` time, \`O(n²)\` output space.`,
      code: {
        javascript: `function generateMatrix(n) {
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  let top = 0;
  let bottom = n - 1;
  let left = 0;
  let right = n - 1;
  let value = 1;
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) matrix[top][j] = value++;
    top++;
    for (let i = top; i <= bottom; i++) matrix[i][right] = value++;
    right--;
    if (top <= bottom) {
      for (let j = right; j >= left; j--) matrix[bottom][j] = value++;
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) matrix[i][left] = value++;
      left++;
    }
  }
  return matrix;
}`,
        typescript: `function generateMatrix(n: number): number[][] {
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  let top = 0;
  let bottom = n - 1;
  let left = 0;
  let right = n - 1;
  let value = 1;
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) matrix[top][j] = value++;
    top++;
    for (let i = top; i <= bottom; i++) matrix[i][right] = value++;
    right--;
    if (top <= bottom) {
      for (let j = right; j >= left; j--) matrix[bottom][j] = value++;
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) matrix[i][left] = value++;
      left++;
    }
  }
  return matrix;
}`,
      },
    },
  ],
});
