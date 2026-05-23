import { defineAlgoProblem } from "../problem";

// In-place: the solution fills the board (which has a unique solution) and returns the same matrix.
// The checker asserts the returned value is the same instance as the input and matches the solution.

// A fully-solved grid reused by several hidden cases whose puzzles are masked copies of it.
const SOLVED_GRID: string[][] = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ["4", "5", "6", "7", "8", "9", "1", "2", "3"],
  ["7", "8", "9", "1", "2", "3", "4", "5", "6"],
  ["2", "3", "4", "5", "6", "7", "8", "9", "1"],
  ["5", "6", "7", "8", "9", "1", "2", "3", "4"],
  ["8", "9", "1", "2", "3", "4", "5", "6", "7"],
  ["3", "4", "5", "6", "7", "8", "9", "1", "2"],
  ["6", "7", "8", "9", "1", "2", "3", "4", "5"],
  ["9", "1", "2", "3", "4", "5", "6", "7", "8"],
];

export const solveSudoku = defineAlgoProblem<[string[][]], string[][]>({
  id: "sudoku-solver",
  number: 46,
  title: "Sudoku Solver",
  difficulty: "hard",
  tags: ["array", "hash-table", "backtracking", "matrix"],
  functionName: "solveSudoku",
  prompt: `Fill a partially completed \`9 x 9\` Sudoku \`board\` so that it is fully solved. The board uses the strings \`"1"\`–\`"9"\` for digits and \`"."\` for empty cells.

A solved board satisfies the Sudoku rules: every row, every column, and each of the nine \`3 x 3\` sub-boxes contains the digits \`1\`–\`9\` exactly once. Each puzzle is guaranteed to have a **single** unique solution.

Solve it **in place** — mutate the input \`board\` directly, replacing every \`"."\` with the correct digit — and return that same board.`,
  constraints: [
    "board.length == 9",
    "board[i].length == 9",
    `board[i][j] is a digit "1"-"9" or ".".`,
    "It is guaranteed that the input board has exactly one solution.",
  ],
  checker: `(actual, args, expected) => {
    const board = args[0];
    if (actual !== board) return false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== expected[r][c]) return false;
      }
    }
    return true;
  }`,
  starterCode: {
    javascript: `/**
 * @param {string[][]} board
 * @return {string[][]} the same board, solved in place
 */
function solveSudoku(board) {
  // your code here
}`,
    typescript: `/**
 * @param {string[][]} board
 * @return {string[][]} the same board, solved in place
 */
function solveSudoku(board: string[][]): string[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "classic puzzle",
      args: [[
        ["5", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
      ]],
      expected: [
        ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
        ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
        ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
        ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
        ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
        ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
        ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
        ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
        ["3", "4", "5", "2", "8", "6", "1", "7", "9"],
      ],
      explanation: "Every blank is filled so each row, column, and 3x3 box holds 1-9 once.",
    },
  ],
  hiddenTests: [
    {
      name: "nearly full, one blank",
      args: [[
        ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
        ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
        ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
        ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
        ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
        ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
        ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
        ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
        ["3", "4", "5", "2", "8", "6", "1", "7", "."],
      ]],
      expected: [
        ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
        ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
        ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
        ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
        ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
        ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
        ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
        ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
        ["3", "4", "5", "2", "8", "6", "1", "7", "9"],
      ],
    },
    {
      name: "one full row blank",
      args: [[
        ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
        ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
        ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
        ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
        ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
        ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
        ["3", "4", "5", "2", "8", "6", "1", "7", "9"],
      ]],
      expected: [
        ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
        ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
        ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
        ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
        ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
        ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
        ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
        ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
        ["3", "4", "5", "2", "8", "6", "1", "7", "9"],
      ],
    },
    {
      name: "second classic puzzle",
      args: [[
        [".", ".", "9", "7", "4", "8", ".", ".", "."],
        ["7", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", "2", ".", "1", ".", "9", ".", ".", "."],
        [".", ".", "7", ".", ".", ".", "2", "4", "."],
        [".", "6", "4", ".", "1", ".", "5", "9", "."],
        [".", "9", "8", ".", ".", ".", "3", ".", "."],
        [".", ".", ".", "8", ".", "3", ".", "2", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "6"],
        [".", ".", ".", "2", "7", "5", "9", ".", "."],
      ]],
      expected: [
        ["5", "1", "9", "7", "4", "8", "6", "3", "2"],
        ["7", "8", "3", "6", "5", "2", "4", "1", "9"],
        ["4", "2", "6", "1", "3", "9", "8", "7", "5"],
        ["3", "5", "7", "9", "8", "6", "2", "4", "1"],
        ["2", "6", "4", "3", "1", "7", "5", "9", "8"],
        ["1", "9", "8", "5", "2", "4", "3", "6", "7"],
        ["9", "7", "5", "8", "6", "3", "1", "2", "4"],
        ["8", "3", "2", "4", "9", "1", "7", "5", "6"],
        ["6", "4", "1", "2", "7", "5", "9", "8", "3"],
      ],
    },
    {
      name: "sparse hard puzzle",
      args: [[
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", "3", ".", "8", "5"],
        [".", ".", "1", ".", "2", ".", ".", ".", "."],
        [".", ".", ".", "5", ".", "7", ".", ".", "."],
        [".", ".", "4", ".", ".", ".", "1", ".", "."],
        [".", "9", ".", ".", ".", ".", ".", ".", "."],
        ["5", ".", ".", ".", ".", ".", ".", "7", "3"],
        [".", ".", "2", ".", "1", ".", ".", ".", "."],
        [".", ".", ".", ".", "4", ".", ".", ".", "9"],
      ]],
      expected: [
        ["9", "8", "7", "6", "5", "4", "3", "2", "1"],
        ["2", "4", "6", "1", "7", "3", "9", "8", "5"],
        ["3", "5", "1", "9", "2", "8", "7", "4", "6"],
        ["1", "2", "8", "5", "3", "7", "6", "9", "4"],
        ["6", "3", "4", "8", "9", "2", "1", "5", "7"],
        ["7", "9", "5", "4", "6", "1", "8", "3", "2"],
        ["5", "1", "9", "2", "8", "6", "4", "7", "3"],
        ["4", "7", "2", "3", "1", "9", "5", "6", "8"],
        ["8", "6", "3", "7", "4", "5", "2", "1", "9"],
      ],
    },
    { name: "one full box blank", args: [[[".", ".", ".", "4", "5", "6", "7", "8", "9"], [".", ".", ".", "7", "8", "9", "1", "2", "3"], [".", ".", ".", "1", "2", "3", "4", "5", "6"], ["2", "3", "4", "5", "6", "7", "8", "9", "1"], ["5", "6", "7", "8", "9", "1", "2", "3", "4"], ["8", "9", "1", "2", "3", "4", "5", "6", "7"], ["3", "4", "5", "6", "7", "8", "9", "1", "2"], ["6", "7", "8", "9", "1", "2", "3", "4", "5"], ["9", "1", "2", "3", "4", "5", "6", "7", "8"]]], expected: SOLVED_GRID },
    { name: "main diagonal blank", args: [[[".", "2", "3", "4", "5", "6", "7", "8", "9"], ["4", ".", "6", "7", "8", "9", "1", "2", "3"], ["7", "8", ".", "1", "2", "3", "4", "5", "6"], ["2", "3", "4", ".", "6", "7", "8", "9", "1"], ["5", "6", "7", "8", ".", "1", "2", "3", "4"], ["8", "9", "1", "2", "3", ".", "5", "6", "7"], ["3", "4", "5", "6", "7", "8", ".", "1", "2"], ["6", "7", "8", "9", "1", "2", "3", ".", "5"], ["9", "1", "2", "3", "4", "5", "6", "7", "."]]], expected: SOLVED_GRID },
    { name: "middle column blank", args: [[["1", "2", "3", "4", ".", "6", "7", "8", "9"], ["4", "5", "6", "7", ".", "9", "1", "2", "3"], ["7", "8", "9", "1", ".", "3", "4", "5", "6"], ["2", "3", "4", "5", ".", "7", "8", "9", "1"], ["5", "6", "7", "8", ".", "1", "2", "3", "4"], ["8", "9", "1", "2", ".", "4", "5", "6", "7"], ["3", "4", "5", "6", ".", "8", "9", "1", "2"], ["6", "7", "8", "9", ".", "2", "3", "4", "5"], ["9", "1", "2", "3", ".", "5", "6", "7", "8"]]], expected: SOLVED_GRID },
    { name: "corner cells blank", args: [[["1", "2", "3", "4", "5", "6", "7", ".", "."], ["4", "5", "6", "7", "8", "9", "1", "2", "."], ["7", "8", "9", "1", "2", "3", "4", "5", "."], ["2", "3", "4", "5", "6", "7", "8", "9", "1"], ["5", "6", "7", "8", "9", "1", "2", "3", "4"], ["8", "9", "1", "2", "3", "4", "5", "6", "7"], [".", "4", "5", "6", "7", "8", "9", "1", "2"], [".", "7", "8", "9", "1", "2", "3", "4", "5"], [".", ".", "2", "3", "4", "5", "6", "7", "8"]]], expected: SOLVED_GRID },
    { name: "scattered blanks", args: [[["1", "2", "3", "4", "5", ".", "7", "8", "9"], ["4", "5", "6", ".", "8", "9", "1", "2", "3"], ["7", "8", "9", "1", "2", "3", ".", "5", "6"], [".", "3", "4", "5", "6", "7", "8", "9", "1"], ["5", "6", "7", "8", "9", ".", "2", "3", "4"], ["8", "9", "1", "2", "3", "4", "5", "6", "."], ["3", "4", ".", "6", "7", "8", "9", "1", "2"], ["6", "7", "8", "9", ".", "2", "3", "4", "5"], ["9", "1", "2", "3", "4", "5", "6", ".", "8"]]], expected: SOLVED_GRID },
    { name: "middle rows blanks", args: [[["1", "2", "3", "4", "5", "6", "7", "8", "9"], ["4", "5", "6", "7", "8", "9", "1", "2", "3"], ["7", "8", "9", "1", "2", "3", "4", "5", "6"], [".", "3", "4", "5", ".", "7", "8", "9", "."], ["5", "6", ".", "8", "9", "1", ".", "3", "4"], [".", "9", "1", "2", ".", "4", "5", "6", "."], ["3", "4", "5", "6", "7", "8", "9", "1", "2"], ["6", "7", "8", "9", "1", "2", "3", "4", "5"], ["9", "1", "2", "3", "4", "5", "6", "7", "8"]]], expected: SOLVED_GRID },
    { name: "last box blank", args: [[["1", "2", "3", "4", "5", "6", "7", "8", "9"], ["4", "5", "6", "7", "8", "9", "1", "2", "3"], ["7", "8", "9", "1", "2", "3", "4", "5", "6"], ["2", "3", "4", "5", "6", "7", "8", "9", "1"], ["5", "6", "7", "8", "9", "1", "2", "3", "4"], ["8", "9", "1", "2", "3", "4", "5", "6", "7"], ["3", "4", "5", "6", "7", "8", ".", ".", "."], ["6", "7", "8", "9", "1", "2", ".", ".", "."], ["9", "1", "2", "3", "4", "5", ".", ".", "."]]], expected: SOLVED_GRID },
    { name: "cross of blanks", args: [[["1", "2", "3", "4", ".", "6", "7", "8", "9"], ["4", "5", "6", "7", ".", "9", "1", "2", "3"], ["7", "8", "9", "1", ".", "3", "4", "5", "6"], ["2", "3", "4", "5", ".", "7", "8", "9", "1"], [".", ".", ".", ".", "9", ".", ".", ".", "."], ["8", "9", "1", "2", ".", "4", "5", "6", "7"], ["3", "4", "5", "6", ".", "8", "9", "1", "2"], ["6", "7", "8", "9", ".", "2", "3", "4", "5"], ["9", "1", "2", "3", ".", "5", "6", "7", "8"]]], expected: SOLVED_GRID },
    { name: "grid-aligned holes", args: [[[".", "2", "3", ".", "5", "6", ".", "8", "9"], ["4", "5", "6", "7", "8", "9", "1", "2", "3"], ["7", "8", "9", "1", "2", "3", "4", "5", "6"], [".", "3", "4", ".", "6", "7", ".", "9", "1"], ["5", "6", "7", "8", "9", "1", "2", "3", "4"], ["8", "9", "1", "2", "3", "4", "5", "6", "7"], [".", "4", "5", ".", "7", "8", ".", "1", "2"], ["6", "7", "8", "9", "1", "2", "3", "4", "5"], ["9", "1", "2", "3", "4", "5", "6", "7", "8"]]], expected: SOLVED_GRID },
    { name: "paired holes", args: [[["1", "2", "3", "4", ".", "6", "7", "8", "9"], [".", ".", "6", "7", "8", "9", "1", "2", "3"], ["7", "8", "9", "1", "2", "3", "4", "5", "6"], ["2", "3", "4", "5", "6", ".", ".", "9", "1"], ["5", "6", "7", "8", "9", "1", "2", "3", "4"], ["8", "9", ".", ".", "3", "4", "5", "6", "7"], ["3", "4", "5", "6", "7", "8", "9", "1", "2"], ["6", "7", "8", "9", "1", "2", "3", ".", "."], ["9", "1", "2", "3", "4", "5", "6", "7", "8"]]], expected: SOLVED_GRID },
    { name: "anti-diagonal-ish holes", args: [[[".", "2", "3", "4", "5", "6", "7", "8", "9"], ["4", "5", "6", "7", "8", "9", "1", "2", "3"], ["7", "8", ".", "1", "2", ".", "4", "5", "."], ["2", "3", "4", "5", "6", "7", "8", "9", "1"], ["5", ".", "7", "8", ".", "1", "2", ".", "4"], ["8", "9", "1", "2", "3", "4", "5", "6", "7"], ["3", "4", "5", "6", "7", "8", "9", "1", "2"], ["6", "7", "8", "9", "1", "2", "3", "4", "5"], [".", "1", "2", ".", "4", "5", ".", "7", "8"]]], expected: SOLVED_GRID },
    { name: "spread single holes", args: [[["1", ".", "3", "4", "5", "6", "7", "8", "9"], ["4", "5", ".", "7", "8", "9", "1", "2", "3"], [".", "8", "9", "1", "2", "3", "4", "5", "6"], ["2", "3", "4", "5", ".", "7", "8", "9", "1"], ["5", "6", "7", "8", "9", ".", "2", "3", "4"], ["8", "9", "1", ".", "3", "4", "5", "6", "7"], ["3", "4", "5", "6", "7", "8", "9", ".", "2"], ["6", "7", "8", "9", "1", "2", "3", "4", "."], ["9", "1", "2", "3", "4", "5", ".", "7", "8"]]], expected: SOLVED_GRID },
  ],
  source: { origin: "leetcode", frontendId: "37", acRate: 0.6547486447422781, confidence: 0.88 },
  solutions: [
    {
      name: "Backtracking with MRV heuristic and bitmask constraints",
      explanation: `Track which digits are used in each row, column, and 3x3 box with three arrays of 9-bit masks, seeded from the givens. At each step pick the empty cell with the *fewest* legal candidates (minimum remaining values) — this drastically prunes the search vs. plain row-major order, since a cell forced to one option is resolved immediately and a cell with zero options fails fast. Try each candidate, set the masks, recurse, and undo on failure. With a guaranteed-unique solution the first complete fill is the answer. The board is mutated in place.

Worst-case exponential, but constant-bounded on a fixed 9x9 grid; MRV makes even sparse puzzles resolve in milliseconds.`,
      code: {
        javascript: `function solveSudoku(board) {
  const rows = new Array(9).fill(0);
  const cols = new Array(9).fill(0);
  const boxes = new Array(9).fill(0);
  const boxId = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== ".") {
        const bit = 1 << (board[r][c].charCodeAt(0) - 49);
        rows[r] |= bit;
        cols[c] |= bit;
        boxes[boxId(r, c)] |= bit;
      }
    }
  }

  const solve = () => {
    let bestR = -1;
    let bestC = -1;
    let bestUsed = 0;
    let bestCount = 10;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== ".") continue;
        const used = rows[r] | cols[c] | boxes[boxId(r, c)];
        let count = 0;
        for (let d = 0; d < 9; d++) if (!(used & (1 << d))) count++;
        if (count < bestCount) {
          bestCount = count;
          bestR = r;
          bestC = c;
          bestUsed = used;
          if (count === 0) return false;
        }
      }
    }
    if (bestR === -1) return true;
    const b = boxId(bestR, bestC);
    for (let d = 0; d < 9; d++) {
      const bit = 1 << d;
      if (bestUsed & bit) continue;
      board[bestR][bestC] = String.fromCharCode(49 + d);
      rows[bestR] |= bit;
      cols[bestC] |= bit;
      boxes[b] |= bit;
      if (solve()) return true;
      board[bestR][bestC] = ".";
      rows[bestR] &= ~bit;
      cols[bestC] &= ~bit;
      boxes[b] &= ~bit;
    }
    return false;
  };

  solve();
  return board;
}`,
        typescript: `function solveSudoku(board: string[][]): string[][] {
  const rows = new Array(9).fill(0);
  const cols = new Array(9).fill(0);
  const boxes = new Array(9).fill(0);
  const boxId = (r: number, c: number): number => Math.floor(r / 3) * 3 + Math.floor(c / 3);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== ".") {
        const bit = 1 << (board[r][c].charCodeAt(0) - 49);
        rows[r] |= bit;
        cols[c] |= bit;
        boxes[boxId(r, c)] |= bit;
      }
    }
  }

  const solve = (): boolean => {
    let bestR = -1;
    let bestC = -1;
    let bestUsed = 0;
    let bestCount = 10;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== ".") continue;
        const used = rows[r] | cols[c] | boxes[boxId(r, c)];
        let count = 0;
        for (let d = 0; d < 9; d++) if (!(used & (1 << d))) count++;
        if (count < bestCount) {
          bestCount = count;
          bestR = r;
          bestC = c;
          bestUsed = used;
          if (count === 0) return false;
        }
      }
    }
    if (bestR === -1) return true;
    const b = boxId(bestR, bestC);
    for (let d = 0; d < 9; d++) {
      const bit = 1 << d;
      if (bestUsed & bit) continue;
      board[bestR][bestC] = String.fromCharCode(49 + d);
      rows[bestR] |= bit;
      cols[bestC] |= bit;
      boxes[b] |= bit;
      if (solve()) return true;
      board[bestR][bestC] = ".";
      rows[bestR] &= ~bit;
      cols[bestC] &= ~bit;
      boxes[b] &= ~bit;
    }
    return false;
  };

  solve();
  return board;
}`,
      },
    },
  ],
});
