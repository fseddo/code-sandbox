import { defineAlgoProblem } from "../problem";

export const isValidSudoku = defineAlgoProblem<[string[][]], boolean>({
  id: "valid-sudoku",
  number: 45,
  title: "Valid Sudoku",
  difficulty: "medium",
  tags: ["array", "hash-table", "matrix"],
  functionName: "isValidSudoku",
  prompt: `Given a partially filled \`9 x 9\` Sudoku \`board\`, determine whether the currently placed digits are valid. The board uses the strings \`"1"\`–\`"9"\` for digits and \`"."\` for empty cells.

The board is valid when:

- each row contains no repeated digit,
- each column contains no repeated digit,
- each of the nine \`3 x 3\` sub-boxes contains no repeated digit.

Only the filled cells are checked — the board does **not** need to be solvable. Return \`true\` if valid, \`false\` otherwise.`,
  constraints: [
    "board.length == 9",
    "board[i].length == 9",
    `board[i][j] is a digit "1"-"9" or ".".`,
  ],
  starterCode: {
    javascript: `/**
 * @param {string[][]} board
 * @return {boolean}
 */
function isValidSudoku(board) {
  // your code here
}`,
    typescript: `/**
 * @param {string[][]} board
 * @return {boolean}
 */
function isValidSudoku(board: string[][]): boolean {
  // your code here
}`,
  },
  examples: [
    {
      name: "valid board",
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
      expected: true,
      explanation: "No row, column, or 3x3 box repeats a digit.",
    },
    {
      name: "duplicate in column and box",
      args: [[
        ["8", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
      ]],
      expected: false,
      explanation: "Two 8s share the top-left column (and box) — the first column has 8 at rows 0 and 3.",
    },
  ],
  hiddenTests: [
    {
      name: "empty board",
      args: [Array.from({ length: 9 }, () => Array(9).fill("."))],
      expected: true,
    },
    {
      name: "duplicate in a row",
      args: [(() => {
        const b = Array.from({ length: 9 }, () => Array(9).fill("."));
        b[0][0] = "1"; b[0][5] = "1";
        return b;
      })()],
      expected: false,
    },
    {
      name: "duplicate in a column",
      args: [(() => {
        const b = Array.from({ length: 9 }, () => Array(9).fill("."));
        b[1][2] = "7"; b[6][2] = "7";
        return b;
      })()],
      expected: false,
    },
    {
      name: "duplicate in a box only",
      args: [(() => {
        const b = Array.from({ length: 9 }, () => Array(9).fill("."));
        b[0][0] = "9"; b[2][2] = "9";
        return b;
      })()],
      expected: false,
    },
    {
      name: "same digit in different boxes is fine",
      args: [(() => {
        const b = Array.from({ length: 9 }, () => Array(9).fill("."));
        b[0][0] = "5"; b[3][3] = "5"; b[6][6] = "5";
        return b;
      })()],
      expected: true,
    },
    {
      name: "full valid row 1-9",
      args: [(() => {
        const b = Array.from({ length: 9 }, () => Array(9).fill("."));
        for (let c = 0; c < 9; c++) b[4][c] = String(c + 1);
        return b;
      })()],
      expected: true,
    },
    {
      name: "single cell filled",
      args: [(() => {
        const b = Array.from({ length: 9 }, () => Array(9).fill("."));
        b[8][8] = "3";
        return b;
      })()],
      expected: true,
    },
    {
      name: "duplicate across box boundary but same row",
      args: [(() => {
        const b = Array.from({ length: 9 }, () => Array(9).fill("."));
        b[0][2] = "4"; b[0][3] = "4";
        return b;
      })()],
      expected: false,
    },
    {
      name: "valid corner cells distinct",
      args: [(() => {
        const b = Array.from({ length: 9 }, () => Array(9).fill("."));
        b[0][0] = "1"; b[0][8] = "2"; b[8][0] = "3"; b[8][8] = "4";
        return b;
      })()],
      expected: true,
    },
    {
      name: "duplicate only in last box",
      args: [(() => {
        const b = Array.from({ length: 9 }, () => Array(9).fill("."));
        b[7][7] = "6"; b[8][8] = "6";
        return b;
      })()],
      expected: false,
    },
    {
      name: "valid densely filled board",
      args: [[
        ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
        ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
        ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
        ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
        ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
        ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
        ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
        ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
        ["3", "4", "5", "2", "8", "6", "1", "7", "9"],
      ]],
      expected: true,
    },
    {
      name: "complete board with one error",
      args: [[
        ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
        ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
        ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
        ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
        ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
        ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
        ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
        ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
        ["3", "4", "5", "2", "8", "6", "1", "7", "5"],
      ]],
      expected: false,
    },
  ],
  source: { origin: "leetcode", frontendId: "36", acRate: 0.6452204177051573, confidence: 0.96 },
  solutions: [
    {
      name: "Three sets of seen keys",
      explanation: `Walk every cell once. For a filled cell, derive three keys: \`row r\`, \`col c\`, and \`box (floor(r/3), floor(c/3))\`. Keep a \`Set\` of \`"row-r-d"\`, \`"col-c-d"\`, \`"box-b-d"\` strings; if any key is already present the digit repeats and the board is invalid. If the full scan finds no collision the board is valid.

\`O(1)\` time and space (the board is a fixed 9x9 = 81 cells).`,
      code: {
        javascript: `function isValidSudoku(board) {
  // One set holds every constraint we've already committed to, tagged by kind.
  const seen = new Set();
  // Single pass over all 81 cells; the three rules are checked together.
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const d = board[r][c];
      if (d === ".") continue; // empty cells place no constraint
      // Which 3x3 box owns this cell: 0..8, row-major over the box grid.
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      // The same digit may legally repeat across the board — only within
      // the *same* row, *same* column, or *same* box is it a conflict.
      const keys = ["row-" + r + "-" + d, "col-" + c + "-" + d, "box-" + box + "-" + d];
      for (const key of keys) {
        if (seen.has(key)) return false; // this digit already claimed that line/box
        seen.add(key);
      }
    }
  }
  // Scanned every cell with no collision — the placement is valid.
  return true;
}`,
        typescript: `function isValidSudoku(board: string[][]): boolean {
  // One set holds every constraint we've already committed to, tagged by kind.
  const seen = new Set<string>();
  // Single pass over all 81 cells; the three rules are checked together.
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const d = board[r][c];
      if (d === ".") continue; // empty cells place no constraint
      // Which 3x3 box owns this cell: 0..8, row-major over the box grid.
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      // The same digit may legally repeat across the board — only within
      // the *same* row, *same* column, or *same* box is it a conflict.
      const keys = ["row-" + r + "-" + d, "col-" + c + "-" + d, "box-" + box + "-" + d];
      for (const key of keys) {
        if (seen.has(key)) return false; // this digit already claimed that line/box
        seen.add(key);
      }
    }
  }
  // Scanned every cell with no collision — the placement is valid.
  return true;
}`,
      },
    },
  ],
});
