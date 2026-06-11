import { defineAlgoProblem } from "../problem";

export const longestIncreasingPath = defineAlgoProblem<[number[][]], number>({
  id: "longest-increasing-path-in-a-matrix",
  number: 148,
  title: "Longest Increasing Path in a Matrix",
  difficulty: "hard",
  tags: ["array", "dynamic-programming", "depth-first-search", "breadth-first-search", "graph", "memoization", "matrix"],
  functionName: "longestIncreasingPath",
  prompt: `Given an \`m x n\` integer \`matrix\`, return the length of the **longest strictly increasing path**.

From a cell you may move in four directions — up, down, left, or right — to a neighbouring cell whose value is **strictly greater** than the current cell's. You may not move diagonally or step outside the grid, and the path length is counted as the number of cells visited.

The path may start and end at any cell.`,
  constraints: [
    "m == matrix.length",
    "n == matrix[i].length",
    "1 <= m, n <= 200",
    "0 <= matrix[i][j] <= 2^31 - 1",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} matrix
 * @return {number}
 */
function longestIncreasingPath(matrix) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} matrix
 * @return {number}
 */
function longestIncreasingPath(matrix: number[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "snaking path of length 4",
      args: [[
        [9, 9, 4],
        [6, 6, 8],
        [2, 1, 1],
      ]],
      expected: 4,
      explanation: "The path 1 -> 2 -> 6 -> 9 increases by one step at a time for a length of 4.",
    },
    {
      name: "diagonal moves not allowed",
      args: [[
        [3, 4, 5],
        [3, 2, 6],
        [2, 2, 1],
      ]],
      expected: 4,
      explanation: "3 -> 4 -> 5 -> 6 is the longest; you cannot cut across diagonally.",
    },
    { name: "single cell", args: [[[1]]], expected: 1 },
  ],
  hiddenTests: [
    // Single cell — path length 1.
    { args: [[[7]]], expected: 1 },
    // A 1xN strictly increasing row.
    { args: [[[1, 2, 3, 4, 5]]], expected: 5 },
    // A 1xN strictly decreasing row — still length 5 (read right to left).
    { args: [[[5, 4, 3, 2, 1]]], expected: 5 },
    // All equal — no strictly-increasing move, so every path is length 1.
    { args: [[[3, 3], [3, 3]]], expected: 1 },
    // A column that increases downward.
    { args: [[[1], [2], [3], [4]]], expected: 4 },
    // A plateau with one increasing escape.
    {
      args: [[
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 2],
      ]],
      expected: 2,
    },
    // A spiral of increasing values winding inward.
    {
      args: [[
        [1, 2, 3, 4],
        [12, 13, 14, 5],
        [11, 16, 15, 6],
        [10, 9, 8, 7],
      ]],
      expected: 16,
    },
    // Two separate increasing ridges; the longer one wins.
    {
      args: [[
        [7, 8, 9],
        [6, 1, 2],
        [5, 4, 3],
      ]],
      expected: 9,
    },
    // Large values near the 2^31 - 1 bound: 0 -> 1 -> 2147483646 -> 2147483647.
    { args: [[[0, 2147483647], [1, 2147483646]]], expected: 4 },
    // Scale (wide, shallow): a 200x200 plateau of equal values — every path is length 1.
    {
      args: [Array.from({ length: 200 }, () => new Array(200).fill(5))],
      expected: 1,
    },
    // Scale (long path): a 50x50 boustrophedon (snake) of 0..2499 — one increasing path of length 2500.
    {
      args: [(() => {
        const n = 50;
        const m = Array.from({ length: n }, () => new Array(n).fill(0));
        let v = 0;
        for (let r = 0; r < n; r++) {
          if (r % 2 === 0) for (let c = 0; c < n; c++) m[r][c] = v++;
          else for (let c = n - 1; c >= 0; c--) m[r][c] = v++;
        }
        return m;
      })()],
      expected: 50 * 50,
    },
  ],
  source: { origin: "leetcode", frontendId: "329", acRate: 0.5402, confidence: 0.92 },
  solutions: [
    {
      name: "DFS with memoization",
      explanation: `From any cell, the longest increasing path *starting there* depends only on its strictly-greater neighbours — and never on how you arrived (strictly increasing means a path can never revisit a cell, so there are no cycles to worry about). That makes the answer for each cell a fixed value we can cache.

Define \`longest(r, c)\` = the length of the longest increasing path that *starts* at \`(r, c)\`: it is \`1\` plus the maximum \`longest\` over the four neighbours whose value is strictly larger (or just \`1\` if none qualify). Memoise each cell's result the first time it is computed. The overall answer is the maximum \`longest(r, c)\` across all cells.

\`O(m·n)\` time — with memoisation each cell's value is computed once and reused — and \`O(m·n)\` space for the memo table (plus recursion depth bounded by the longest path).`,
      code: {
        javascript: `function longestIncreasingPath(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  // memo[r][c] = longest increasing path starting at (r, c); 0 means "not computed yet".
  const memo = Array.from({ length: rows }, () => new Array(cols).fill(0));

  const longest = (r, c) => {
    if (memo[r][c] !== 0) return memo[r][c];   // reuse a solved cell
    let best = 1;                              // the cell itself is a path of length 1
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      // Only step to a strictly larger neighbour.
      if (matrix[nr][nc] > matrix[r][c]) {
        best = Math.max(best, 1 + longest(nr, nc));
      }
    }
    memo[r][c] = best;
    return best;
  };

  let answer = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      answer = Math.max(answer, longest(r, c));
    }
  }
  return answer;
}`,
        typescript: `function longestIncreasingPath(matrix: number[][]): number {
  const rows = matrix.length;
  const cols = matrix[0].length;
  // memo[r][c] = longest increasing path starting at (r, c); 0 means "not computed yet".
  const memo = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  const longest = (r: number, c: number): number => {
    if (memo[r][c] !== 0) return memo[r][c];   // reuse a solved cell
    let best = 1;                              // the cell itself is a path of length 1
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      // Only step to a strictly larger neighbour.
      if (matrix[nr][nc] > matrix[r][c]) {
        best = Math.max(best, 1 + longest(nr, nc));
      }
    }
    memo[r][c] = best;
    return best;
  };

  let answer = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      answer = Math.max(answer, longest(r, c));
    }
  }
  return answer;
}`,
      },
    },
  ],
});
