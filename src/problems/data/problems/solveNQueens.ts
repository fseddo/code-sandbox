import { defineAlgoProblem } from "../problem";

// Generates the full solution set for a given board size — used only to build the larger expected
// sets (n = 6..9) without pasting hundreds of boards by hand. Mirrors the reference solution.
const allBoards = (n: number): string[][] => {
  const result: string[][] = [];
  const queens: number[] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();
  const place = (row: number): void => {
    if (row === n) {
      result.push(queens.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - 1 - c)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag1.has(row - c) || diag2.has(row + c)) continue;
      cols.add(c);
      diag1.add(row - c);
      diag2.add(row + c);
      queens.push(c);
      place(row + 1);
      cols.delete(c);
      diag1.delete(row - c);
      diag2.delete(row + c);
      queens.pop();
    }
  };
  place(0);
  return result;
};

// Boards may come back in any order, so deep-equal on a fixed list would wrongly fail a correct
// solution. The `checker` canonicalizes each board (join its rows) and sorts the list of boards on
// both sides before comparing.
export const solveNQueens = defineAlgoProblem<[number], string[][]>({
  id: "n-queens",
  number: 59,
  title: "N-Queens",
  difficulty: "hard",
  tags: ["array", "backtracking"],
  functionName: "solveNQueens",
  prompt: `The **n-queens** puzzle places \`n\` queens on an \`n x n\` chessboard so that no two queens attack each other — no two share a row, column, or diagonal.

Given an integer \`n\`, return **all distinct** solutions. Each solution is a board drawn as an array of \`n\` strings, where \`'Q'\` marks a queen and \`'.'\` marks an empty square. Solutions may be returned in any order, and the rows within each board run top to bottom.`,
  constraints: ["1 <= n <= 9"],
  checker: `(actual, args, expected) => {
    if (!Array.isArray(actual)) return false;
    const canon = (boards) => {
      if (!Array.isArray(boards)) return null;
      const list = boards.map((board) => {
        if (!Array.isArray(board)) return null;
        return board.join("|");
      });
      if (list.some((b) => b === null)) return null;
      return list.slice().sort();
    };
    const a = canon(actual);
    const e = canon(expected);
    if (a === null || e === null) return false;
    if (a.length !== e.length) return false;
    return a.every((board, i) => board === e[i]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {string[][]}
 */
function solveNQueens(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {string[][]}
 */
function solveNQueens(n: number): string[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "n = 4",
      args: [4],
      expected: [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]],
      explanation: "There are exactly two distinct ways to place four non-attacking queens on a 4×4 board.",
    },
    { name: "n = 1", args: [1], expected: [["Q"]], explanation: "A single queen on a 1×1 board." },
    { name: "n = 2 (none)", args: [2], expected: [], explanation: "No placement avoids mutual attack on a 2×2 board." },
  ],
  hiddenTests: [
    { args: [1], expected: [["Q"]] },
    { args: [2], expected: [] },
    { args: [3], expected: [] },
    {
      args: [4],
      expected: [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]],
    },
    {
      args: [5],
      expected: [
        ["Q....", "..Q..", "....Q", ".Q...", "...Q."],
        ["Q....", "...Q.", ".Q...", "....Q", "..Q.."],
        [".Q...", "...Q.", "Q....", "..Q..", "....Q"],
        [".Q...", "....Q", "..Q..", "Q....", "...Q."],
        ["..Q..", "Q....", "...Q.", ".Q...", "....Q"],
        ["..Q..", "....Q", ".Q...", "...Q.", "Q...."],
        ["...Q.", "Q....", "..Q..", "....Q", ".Q..."],
        ["...Q.", ".Q...", "....Q", "..Q..", "Q...."],
        ["....Q", ".Q...", "...Q.", "Q....", "..Q.."],
        ["....Q", "..Q..", "Q....", "...Q.", ".Q..."],
      ],
    },
    { name: "count 6", args: [6], expected: allBoards(6) },
    { name: "count 7", args: [7], expected: allBoards(7) },
    // Scale: n = 8 (92 solutions) and n = 9 (352 solutions) — backtracking with diagonal pruning
    // handles these instantly; a brute-force placement would not.
    { name: "count 8", args: [8], expected: allBoards(8) },
    { name: "count 9", args: [9], expected: allBoards(9) },
  ],
  source: { origin: "leetcode", frontendId: "51", acRate: 0.7554038292809263, confidence: 0.9 },
  solutions: [
    {
      name: "Backtracking with diagonal sets",
      explanation: `Place one queen per row. Track occupied columns and both diagonal directions in sets: a queen at \`(r, c)\` owns column \`c\`, the "↘" diagonal \`r - c\`, and the "↙" diagonal \`r + c\`. For each row try every safe column, recurse to the next row, and record a board when all \`n\` rows are filled. The set lookups make each safety check \`O(1)\`.

Time is \`O(n!)\` in the worst case (bounded hard by the pruning), \`O(n)\` extra space for the recursion and sets.`,
      code: {
        javascript: `function solveNQueens(n) {
  const result = [];
  const queens = []; // queens[r] = column of the queen placed in row r
  const cols = new Set(); // columns already occupied
  const diag1 = new Set(); // "↘" diagonals occupied, keyed by r - c (constant along that diagonal)
  const diag2 = new Set(); // "↙" diagonals occupied, keyed by r + c (constant along that diagonal)
  const place = (row) => {
    if (row === n) {
      // Every row holds a queen — turn the column list into the board's string form.
      result.push(queens.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - 1 - c)));
      return;
    }
    for (let c = 0; c < n; c++) {
      // O(1) safety check: same column, or either diagonal through (row, c).
      if (cols.has(c) || diag1.has(row - c) || diag2.has(row + c)) continue;
      cols.add(c); diag1.add(row - c); diag2.add(row + c); queens.push(c); // choose
      place(row + 1); // explore with a queen locked in at (row, c)
      cols.delete(c); diag1.delete(row - c); diag2.delete(row + c); queens.pop(); // un-choose before the next column
    }
  };
  place(0);
  return result;
}`,
        typescript: `function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const queens: number[] = []; // queens[r] = column of the queen placed in row r
  const cols = new Set<number>(); // columns already occupied
  const diag1 = new Set<number>(); // "↘" diagonals occupied, keyed by r - c (constant along that diagonal)
  const diag2 = new Set<number>(); // "↙" diagonals occupied, keyed by r + c (constant along that diagonal)
  const place = (row: number): void => {
    if (row === n) {
      // Every row holds a queen — turn the column list into the board's string form.
      result.push(queens.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - 1 - c)));
      return;
    }
    for (let c = 0; c < n; c++) {
      // O(1) safety check: same column, or either diagonal through (row, c).
      if (cols.has(c) || diag1.has(row - c) || diag2.has(row + c)) continue;
      cols.add(c); diag1.add(row - c); diag2.add(row + c); queens.push(c); // choose
      place(row + 1); // explore with a queen locked in at (row, c)
      cols.delete(c); diag1.delete(row - c); diag2.delete(row + c); queens.pop(); // un-choose before the next column
    }
  };
  place(0);
  return result;
}`,
      },
    },
  ],
});
