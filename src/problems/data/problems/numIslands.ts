import { defineAlgoProblem } from "../problem";

export const numIslands = defineAlgoProblem<[string[][]], number>({
  id: "number-of-islands",
  number: 145,
  title: "Number of Islands",
  difficulty: "medium",
  tags: ["array", "depth-first-search", "breadth-first-search", "union-find", "matrix"],
  functionName: "numIslands",
  prompt: `You are given an \`m x n\` grid where each cell is either \`"1"\` (land) or \`"0"\` (water), as a 2-D array of single-character **strings**.

An **island** is a maximal group of \`"1"\` cells joined **4-directionally** (up, down, left, right — *not* diagonally), bounded by water or the edge of the grid. Assume the grid is surrounded by water on all sides.

Return the number of distinct islands.`,
  constraints: [
    "m == grid.length",
    "n == grid[i].length",
    "1 <= m, n <= 300",
    'grid[i][j] is "0" or "1".',
  ],
  starterCode: {
    javascript: `/**
 * @param {string[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // your code here
}`,
    typescript: `/**
 * @param {string[][]} grid
 * @return {number}
 */
function numIslands(grid: string[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "one big island",
      args: [[
        ["1", "1", "1", "1", "0"],
        ["1", "1", "0", "1", "0"],
        ["1", "1", "0", "0", "0"],
        ["0", "0", "0", "0", "0"],
      ]],
      expected: 1,
      explanation: "All the land cells are connected horizontally or vertically into a single component.",
    },
    {
      name: "three islands",
      args: [[
        ["1", "1", "0", "0", "0"],
        ["1", "1", "0", "0", "0"],
        ["0", "0", "1", "0", "0"],
        ["0", "0", "0", "1", "1"],
      ]],
      expected: 3,
      explanation: "The top-left 2x2 block, the lone cell in the middle, and the bottom-right pair are three separate islands.",
    },
    { name: "single water cell", args: [[["0"]]], expected: 0 },
  ],
  hiddenTests: [
    // Smallest cases: one cell, water vs land.
    { args: [[["1"]]], expected: 1 },
    // All water — no islands.
    { args: [[["0", "0"], ["0", "0"]]], expected: 0 },
    // All land — one island.
    { args: [[["1", "1"], ["1", "1"]]], expected: 1 },
    // Diagonal-only adjacency must NOT merge: a checkerboard of land is many islands.
    {
      args: [[
        ["1", "0", "1"],
        ["0", "1", "0"],
        ["1", "0", "1"],
      ]],
      expected: 5,
    },
    // Single row with separated land runs.
    { args: [[["1", "0", "1", "0", "1"]]], expected: 3 },
    // Single column with separated land runs.
    { args: [[["1"], ["0"], ["1"], ["1"], ["0"]]], expected: 2 },
    // A spiral-ish shape that is one winding island.
    {
      args: [[
        ["1", "1", "1", "1", "1"],
        ["0", "0", "0", "0", "1"],
        ["1", "1", "1", "0", "1"],
        ["1", "0", "1", "0", "1"],
        ["1", "0", "1", "1", "1"],
      ]],
      expected: 1,
    },
    // Land touching all four borders, two components separated by a cross of water.
    {
      args: [[
        ["1", "1", "0", "1", "1"],
        ["1", "1", "0", "1", "1"],
        ["0", "0", "0", "0", "0"],
        ["1", "1", "0", "1", "1"],
        ["1", "1", "0", "1", "1"],
      ]],
      expected: 4,
    },
    // Scale: a 300x300 checkerboard of land — every land cell is its own island.
    {
      args: [Array.from({ length: 300 }, (_unused, i) =>
        Array.from({ length: 300 }, (_inner, j) => ((i + j) % 2 === 0 ? "1" : "0")),
      )],
      // Land cells are those with (i + j) even: ceil(300*300 / 2) = 45000.
      expected: 45000,
    },
    // Scale: a 300x300 grid entirely of land — a single island.
    {
      args: [Array.from({ length: 300 }, () => Array.from({ length: 300 }, () => "1"))],
      expected: 1,
    },
  ],
  source: { origin: "leetcode", frontendId: "200", acRate: 0.6105, confidence: 0.95 },
  solutions: [
    {
      name: "Flood fill (iterative DFS)",
      explanation: `Scan every cell. When you reach a piece of land (\`"1"\`) that hasn't been claimed yet, that's a brand-new island — increment the count, then flood-fill its entire connected component so it's never counted again.

The flood fill walks to the four orthogonal neighbours, sinking each visited land cell to \`"0"\` so it can't be revisited (this doubles as the "visited" marker, using the grid itself). An explicit stack is used instead of recursion so a single sprawling all-land grid can't overflow the call stack.

\`O(m·n)\` time — each cell is pushed and popped at most once — and \`O(m·n)\` space in the worst case for the stack (a grid that is entirely land).`,
      code: {
        javascript: `function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Sink the whole component reachable from (sr, sc) so it can't be recounted.
  const sink = (sr, sc) => {
    const stack = [[sr, sc]];
    grid[sr][sc] = "0";          // mark visited as we push, not as we pop
    while (stack.length > 0) {
      const [r, c] = stack.pop();
      // Visit the four orthogonal neighbours.
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== "1") continue;
        grid[nr][nc] = "0";      // sink before pushing — no cell enters twice
        stack.push([nr, nc]);
      }
    }
  };

  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // First land cell of an unseen component: a new island.
      if (grid[r][c] === "1") {
        islands++;
        sink(r, c);
      }
    }
  }
  return islands;
}`,
        typescript: `function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  // Sink the whole component reachable from (sr, sc) so it can't be recounted.
  const sink = (sr: number, sc: number): void => {
    const stack: [number, number][] = [[sr, sc]];
    grid[sr][sc] = "0";          // mark visited as we push, not as we pop
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      // Visit the four orthogonal neighbours.
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== "1") continue;
        grid[nr][nc] = "0";      // sink before pushing — no cell enters twice
        stack.push([nr, nc]);
      }
    }
  };

  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // First land cell of an unseen component: a new island.
      if (grid[r][c] === "1") {
        islands++;
        sink(r, c);
      }
    }
  }
  return islands;
}`,
      },
    },
  ],
});
