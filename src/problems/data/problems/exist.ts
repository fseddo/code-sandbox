import { defineAlgoProblem } from "../problem";

export const exist = defineAlgoProblem<[string[][], string], boolean>({
  id: "word-search",
  number: 85,
  title: "Word Search",
  difficulty: "medium",
  tags: ["array", "string", "backtracking", "depth-first-search", "matrix"],
  functionName: "exist",
  prompt: `Given an \`m x n\` grid of single-character strings \`board\` and a string \`word\`, return \`true\` if \`word\` can be spelled by a path through the grid.

A path moves between **horizontally or vertically adjacent** cells, and each cell may be used **at most once** within a single path.`,
  constraints: [
    "m == board.length",
    "n == board[i].length",
    "1 <= m, n <= 6",
    "1 <= word.length <= 15",
    "board and word consist of lowercase and uppercase English letters.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[][]} board
 * @param {string} word
 * @return {boolean}
 */
function exist(board, word) {
  // your code here
}`,
    typescript: `/**
 * @param {string[][]} board
 * @param {string} word
 * @return {boolean}
 */
function exist(board: string[][], word: string): boolean {
  // your code here
}`,
  },
  examples: [
    {
      name: "found",
      args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"],
      expected: true,
      explanation: "A→B→C→C→E→D traces a connected path.",
    },
    {
      name: "single letter",
      args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE"],
      expected: true,
    },
    {
      name: "reuses a cell",
      args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"],
      expected: false,
      explanation: "The second B would need the same cell as the first.",
    },
  ],
  hiddenTests: [
    { args: [[["a"]], "a"], expected: true },
    { args: [[["a"]], "b"], expected: false },
    { args: [[["a"]], "aa"], expected: false },
    { args: [[["a", "b"], ["c", "d"]], "abdc"], expected: true },
    { args: [[["a", "b"], ["c", "d"]], "acdb"], expected: true },
    { args: [[["a", "b"], ["c", "d"]], "abcd"], expected: false },
    { args: [[["A", "A", "A"], ["A", "A", "A"], ["A", "A", "A"]], "AAAAAAAAA"], expected: true },
    { args: [[["A", "A", "A"], ["A", "A", "A"], ["A", "A", "A"]], "AAAAAAAAAA"], expected: false },
    { args: [[["C", "A", "A"], ["A", "A", "A"], ["B", "C", "D"]], "AAB"], expected: true },
    { args: [[["a", "b", "c"], ["a", "e", "d"], ["a", "f", "g"]], "abcdefg"], expected: true },
    { args: [[["a", "b"], ["c", "d"]], "abcb"], expected: false },
    { args: [[["x", "y"], ["z", "x"]], "xyxy"], expected: false },
    {
      // Scale: 6x6 grid where row 0 is all A's then a B; a straight scan finds it fast, but the many
      // A's elsewhere give a naive DFS plenty of dead-end paths to prune.
      args: [
        (() => {
          const g = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => "A"));
          g[0][5] = "B";
          return g;
        })(),
        "AAAAAB",
      ],
      expected: true,
    },
    {
      args: [
        (() => {
          const g = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => "A"));
          g[0][5] = "B";
          return g;
        })(),
        "AAAAAAAAAAAAAAC",
      ],
      expected: false,
    },
  ],
  source: { origin: "leetcode", frontendId: "79", acRate: 0.47369300206944204, confidence: 0.93 },
  solutions: [
    {
      name: "DFS backtracking with in-place marking",
      explanation: `From every cell that matches the first letter, run a depth-first search that advances through \`word\`. Mark a visited cell (temporarily overwrite it) before recursing into its four neighbours, then restore it on the way back so other paths can reuse it. Succeed when the whole word is matched.

\`O(m·n·4^L)\` worst-case time for word length \`L\`, \`O(L)\` recursion depth.`,
      code: {
        javascript: `function exist(board, word) {
  const m = board.length;
  const n = board[0].length;
  const dfs = (r, c, i) => {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[i]) return false;
    const saved = board[r][c];
    board[r][c] = "#";
    const found =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);
    board[r][c] = saved;
    return found;
  };
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
        typescript: `function exist(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const dfs = (r: number, c: number, i: number): boolean => {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[i]) return false;
    const saved = board[r][c];
    board[r][c] = "#";
    const found =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);
    board[r][c] = saved;
    return found;
  };
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
      },
    },
  ],
});
