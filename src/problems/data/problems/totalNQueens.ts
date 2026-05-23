import { defineAlgoProblem } from "../problem";

export const totalNQueens = defineAlgoProblem<[number], number>({
  id: "n-queens-ii",
  number: 60,
  title: "N-Queens II",
  difficulty: "hard",
  tags: ["backtracking"],
  functionName: "totalNQueens",
  prompt: `The **n-queens** puzzle places \`n\` queens on an \`n x n\` chessboard so that no two queens attack each other — no two share a row, column, or diagonal.

Given an integer \`n\`, return the **number** of distinct solutions to the puzzle.`,
  constraints: ["1 <= n <= 9"],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {number}
 */
function totalNQueens(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {number}
 */
function totalNQueens(n: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "n = 4", args: [4], expected: 2, explanation: "Two distinct non-attacking placements exist on a 4×4 board." },
    { name: "n = 1", args: [1], expected: 1, explanation: "A single queen on a 1×1 board." },
    { name: "n = 2 (none)", args: [2], expected: 0 },
  ],
  hiddenTests: [
    { args: [1], expected: 1 },
    { args: [2], expected: 0 },
    { args: [3], expected: 0 },
    { args: [4], expected: 2 },
    { args: [5], expected: 10 },
    { args: [6], expected: 4 },
    { args: [7], expected: 40 },
    // Scale: n = 8 (92) and n = 9 (352) — pruned backtracking is instant.
    { args: [8], expected: 92 },
    { args: [9], expected: 352 },
  ],
  source: { origin: "leetcode", frontendId: "52", acRate: 0.7866550526712838, confidence: 0.95 },
  solutions: [
    {
      name: "Backtracking with diagonal sets",
      explanation: `Same placement search as N-Queens, but instead of recording boards we just count completed rows. Place one queen per row, tracking occupied columns and both diagonals (\`r - c\` and \`r + c\`) in sets for \`O(1)\` safety checks; increment the count each time all \`n\` rows are filled.

Time is \`O(n!)\` in the worst case (heavily pruned), \`O(n)\` extra space.`,
      code: {
        javascript: `function totalNQueens(n) {
  let count = 0;
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();
  const place = (row) => {
    if (row === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag1.has(row - c) || diag2.has(row + c)) continue;
      cols.add(c); diag1.add(row - c); diag2.add(row + c);
      place(row + 1);
      cols.delete(c); diag1.delete(row - c); diag2.delete(row + c);
    }
  };
  place(0);
  return count;
}`,
        typescript: `function totalNQueens(n: number): number {
  let count = 0;
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();
  const place = (row: number): void => {
    if (row === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag1.has(row - c) || diag2.has(row + c)) continue;
      cols.add(c); diag1.add(row - c); diag2.add(row + c);
      place(row + 1);
      cols.delete(c); diag1.delete(row - c); diag2.delete(row + c);
    }
  };
  place(0);
  return count;
}`,
      },
    },
  ],
});
