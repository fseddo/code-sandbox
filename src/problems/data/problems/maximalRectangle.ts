import { defineAlgoProblem } from "../problem";

export const maximalRectangle = defineAlgoProblem<[string[][]], number>({
  id: "maximal-rectangle",
  number: 91,
  title: "Maximal Rectangle",
  difficulty: "hard",
  tags: ["array", "dynamic-programming", "stack", "matrix", "monotonic-stack"],
  functionName: "maximalRectangle",
  prompt: `Given a 2D binary \`matrix\` filled with the characters \`'0'\` and \`'1'\`, find the largest rectangle containing only \`'1'\`s and return its area.

The rectangle must be axis-aligned and every cell inside it must be \`'1'\`. Return \`0\` if the matrix has no \`'1'\`s.`,
  constraints: [
    "rows == matrix.length",
    "cols == matrix[i].length",
    "1 <= rows, cols <= 200",
    "matrix[i][j] is '0' or '1'.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[][]} matrix
 * @return {number}
 */
function maximalRectangle(matrix) {
  // your code here
}`,
    typescript: `/**
 * @param {string[][]} matrix
 * @return {number}
 */
function maximalRectangle(matrix: string[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "classic",
      args: [[
        ["1", "0", "1", "0", "0"],
        ["1", "0", "1", "1", "1"],
        ["1", "1", "1", "1", "1"],
        ["1", "0", "0", "1", "0"],
      ]],
      expected: 6,
      explanation: "The 2x3 block of 1s spanning rows 1-2, columns 2-4 has area 6.",
    },
    { name: "single zero", args: [[["0"]]], expected: 0 },
    { name: "single one", args: [[["1"]]], expected: 1 },
  ],
  hiddenTests: [
    { args: [[["1", "1"], ["1", "1"]]], expected: 4 },
    { args: [[["0", "0"], ["0", "0"]]], expected: 0 },
    { args: [[["1", "0"], ["0", "1"]]], expected: 1 },
    { args: [[["1", "1", "1", "1"]]], expected: 4 },
    { args: [[["1"], ["1"], ["1"], ["1"]]], expected: 4 },
    { args: [[["0", "1"], ["1", "0"], ["1", "1"]]], expected: 2 },
    { args: [[["1", "1", "0", "1"], ["1", "1", "1", "1"]]], expected: 4 },
    { args: [[
      ["1", "1", "1"],
      ["1", "1", "1"],
      ["1", "1", "1"],
    ]], expected: 9 },
    { args: [[
      ["0", "1", "1", "0"],
      ["1", "1", "1", "1"],
      ["1", "1", "1", "1"],
      ["1", "1", "0", "0"],
    ]], expected: 8 },
    { args: [[
      ["1", "0", "1", "1", "1"],
      ["0", "1", "0", "1", "0"],
      ["1", "1", "0", "1", "1"],
      ["1", "1", "0", "1", "1"],
      ["0", "1", "1", "1", "1"],
    ]], expected: 6 },
    { args: [[["1", "1", "1", "1", "1", "1", "1", "1"]]], expected: 8 },
    { args: [[["0"]]], expected: 0 },
    // Scale: 200x200 all ones — answer 40000; only the per-row histogram approach is fast enough.
    {
      args: [Array.from({ length: 200 }, () => Array.from({ length: 200 }, () => "1"))],
      expected: 40000,
    },
    // Scale: 200x200 checkerboard — no rectangle larger than a single cell.
    {
      args: [Array.from({ length: 200 }, (_, r) => Array.from({ length: 200 }, (_, c) => ((r + c) % 2 === 0 ? "1" : "0")))],
      expected: 1,
    },
    // Scale: 200x200 with a solid 100-wide band in every row -> 200*100.
    {
      args: [Array.from({ length: 200 }, () => Array.from({ length: 200 }, (_, c) => (c < 100 ? "1" : "0")))],
      expected: 20000,
    },
  ],
  source: { origin: "leetcode", frontendId: "85", acRate: 0.5874792095948355, confidence: 0.9 },
  solutions: [
    {
      name: "Row histograms + largest-rectangle stack",
      explanation: `Treat each row as the base of a histogram: \`heights[c]\` is the number of consecutive \`'1'\`s ending at row \`r\` in column \`c\` (reset to 0 on a \`'0'\`). For each row, the maximal all-ones rectangle whose bottom edge is that row equals the largest-rectangle-in-histogram of that height array, computed with a monotonic increasing stack. Track the best across all rows.

\`O(rows * cols)\` time, \`O(cols)\` space.`,
      code: {
        javascript: `function maximalRectangle(matrix) {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;
  const cols = matrix[0].length;
  const heights = new Array(cols).fill(0);
  let best = 0;
  const histogram = (h) => {
    const stack = [];
    let area = 0;
    for (let i = 0; i <= h.length; i++) {
      const cur = i === h.length ? 0 : h[i];
      while (stack.length > 0 && h[stack[stack.length - 1]] >= cur) {
        const height = h[stack.pop()];
        const left = stack.length === 0 ? -1 : stack[stack.length - 1];
        const width = i - left - 1;
        if (height * width > area) area = height * width;
      }
      stack.push(i);
    }
    return area;
  };
  for (const row of matrix) {
    for (let c = 0; c < cols; c++) {
      heights[c] = row[c] === "1" ? heights[c] + 1 : 0;
    }
    const area = histogram(heights);
    if (area > best) best = area;
  }
  return best;
}`,
        typescript: `function maximalRectangle(matrix: string[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;
  const cols = matrix[0].length;
  const heights = new Array<number>(cols).fill(0);
  let best = 0;
  const histogram = (h: number[]): number => {
    const stack: number[] = [];
    let area = 0;
    for (let i = 0; i <= h.length; i++) {
      const cur = i === h.length ? 0 : h[i];
      while (stack.length > 0 && h[stack[stack.length - 1]] >= cur) {
        const height = h[stack.pop()!];
        const left = stack.length === 0 ? -1 : stack[stack.length - 1];
        const width = i - left - 1;
        if (height * width > area) area = height * width;
      }
      stack.push(i);
    }
    return area;
  };
  for (const row of matrix) {
    for (let c = 0; c < cols; c++) {
      heights[c] = row[c] === "1" ? heights[c] + 1 : 0;
    }
    const area = histogram(heights);
    if (area > best) best = area;
  }
  return best;
}`,
      },
    },
  ],
});
