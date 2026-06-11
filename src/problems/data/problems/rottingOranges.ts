import { defineAlgoProblem } from "../problem";

export const rottingOranges = defineAlgoProblem<[number[][]], number>({
  id: "rotting-oranges",
  number: 146,
  title: "Rotting Oranges",
  difficulty: "medium",
  tags: ["array", "breadth-first-search", "matrix"],
  functionName: "orangesRotting",
  prompt: `You are given an \`m x n\` grid where each cell holds one of three values:

- \`0\` — an empty cell,
- \`1\` — a **fresh** orange,
- \`2\` — a **rotten** orange.

Every minute, any fresh orange that is **4-directionally adjacent** (up, down, left, right) to a rotten orange becomes rotten too. All such rottings happen simultaneously each minute.

Return the **minimum number of minutes** that must elapse until no cell has a fresh orange. If it is impossible for every fresh orange to rot (one is fenced off from all rotten oranges), return \`-1\`.`,
  constraints: [
    "m == grid.length",
    "n == grid[i].length",
    "1 <= m, n <= 10",
    "grid[i][j] is 0, 1, or 2.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
function orangesRotting(grid) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
function orangesRotting(grid: number[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "spreads in 4 minutes",
      args: [[
        [2, 1, 1],
        [1, 1, 0],
        [0, 1, 1],
      ]],
      expected: 4,
      explanation: "The rot fans out one ring per minute; the last fresh orange (bottom-right) rots at minute 4.",
    },
    {
      name: "one orange unreachable",
      args: [[
        [2, 1, 1],
        [0, 1, 1],
        [1, 0, 1],
      ]],
      expected: -1,
      explanation: "The fresh orange at (2,0) is cut off by empty cells, so it never rots — return -1.",
    },
    {
      name: "no fresh oranges",
      args: [[[0, 2]]],
      expected: 0,
      explanation: "Nothing is fresh at the start, so zero minutes elapse.",
    },
  ],
  hiddenTests: [
    // Single cell, each value.
    { args: [[[0]]], expected: 0 },
    { args: [[[2]]], expected: 0 },
    { args: [[[1]]], expected: -1 },
    // A single fresh orange next to a rotten one — one minute.
    { args: [[[2, 1]]], expected: 1 },
    // A row that rots left to right.
    { args: [[[2, 1, 1, 1, 1]]], expected: 4 },
    // Two rot sources meeting in the middle — fewer minutes than one source.
    { args: [[[2, 1, 1, 1, 2]]], expected: 2 },
    // A column that rots top to bottom.
    { args: [[[2], [1], [1], [1]]], expected: 3 },
    // All empty — no fresh oranges, zero minutes.
    { args: [[[0, 0], [0, 0]]], expected: 0 },
    // Fresh orange entirely isolated by empties — impossible.
    {
      args: [[
        [2, 0, 1],
        [0, 0, 0],
        [0, 0, 0],
      ]],
      expected: -1,
    },
    // A spiral where the rot must travel the long way around.
    {
      args: [[
        [2, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1],
      ]],
      expected: 16,
    },
    // Scale: a full 10x10 grid of fresh oranges with one rotten corner.
    {
      args: [(() => {
        const g = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 1));
        g[0][0] = 2;
        return g;
      })()],
      // Manhattan-distance frontier from (0,0): the farthest cell (9,9) rots at minute 18.
      expected: 18,
    },
  ],
  source: { origin: "leetcode", frontendId: "994", acRate: 0.5567, confidence: 0.95 },
  solutions: [
    {
      name: "Multi-source BFS",
      explanation: `Because *all* the rot spreads one ring per minute, the time a fresh orange takes to rot is its grid distance to the nearest rotten orange — exactly what a breadth-first search measures. Seed the BFS queue with **every** rotten orange at once (a multi-source BFS), and expand level by level: each level is one minute.

Track the number of fresh oranges up front. Each time the BFS rots a fresh orange, decrement that counter. The answer is the number of full levels processed; if any fresh orange remains when the queue drains, it was unreachable, so return \`-1\`.

\`O(m·n)\` time — every cell enters the queue at most once — and \`O(m·n)\` space for the queue.`,
      code: {
        javascript: `function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Seed the frontier with every rotten orange, and count the fresh ones.
  let queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }

  let minutes = 0;
  // Expand one ring (one minute) per outer iteration, until nothing fresh borders the rot.
  while (queue.length > 0 && fresh > 0) {
    const next = [];
    for (const [r, c] of queue) {
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== 1) continue;   // only fresh oranges rot
        grid[nr][nc] = 2;                   // rot it now so it isn't queued twice
        fresh--;
        next.push([nr, nc]);
      }
    }
    queue = next;
    minutes++;                              // a full ring spread = one minute
  }

  // Any fresh orange left was unreachable from all rot sources.
  return fresh === 0 ? minutes : -1;
}`,
        typescript: `function orangesRotting(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  // Seed the frontier with every rotten orange, and count the fresh ones.
  let queue: [number, number][] = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }

  let minutes = 0;
  // Expand one ring (one minute) per outer iteration, until nothing fresh borders the rot.
  while (queue.length > 0 && fresh > 0) {
    const next: [number, number][] = [];
    for (const [r, c] of queue) {
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== 1) continue;   // only fresh oranges rot
        grid[nr][nc] = 2;                   // rot it now so it isn't queued twice
        fresh--;
        next.push([nr, nc]);
      }
    }
    queue = next;
    minutes++;                              // a full ring spread = one minute
  }

  // Any fresh orange left was unreachable from all rot sources.
  return fresh === 0 ? minutes : -1;
}`,
      },
    },
  ],
});
