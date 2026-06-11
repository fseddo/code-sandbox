import { defineAlgoProblem } from "../problem";

export const wordSearchII = defineAlgoProblem<[string[][], string[]], string[]>({
  id: "word-search-ii",
  number: 143,
  title: "Word Search II",
  difficulty: "hard",
  tags: ["trie", "matrix", "backtracking", "depth-first-search", "string"],
  functionName: "findWords",
  prompt: `Given an \`m x n\` \`board\` of lowercase letters and a list of \`words\`, return every word from the list that can be **formed by a path on the board**.

A word is formed by starting on any cell and stepping to **horizontally or vertically adjacent** cells, spelling the word in order. The same cell may **not** be used more than once within a single word. Each word in the answer must appear in the input list, and the answer must contain **no duplicates**. The words may be returned in **any order**.

For example, on the board

\`\`\`
o a a n
e t a e
i h k r
i f l v
\`\`\`

with \`words = ["oath", "pea", "eat", "rain"]\`, the answer is \`["oath", "eat"]\`: \`"oath"\` traces \`o(0,0) → a(0,1) → t(1,1) → h(2,1)\`, and \`"eat"\` traces \`e(1,3) → a(1,2) → t(1,1)\`. \`"pea"\` and \`"rain"\` cannot be traced on the board.`,
  constraints: [
    "m == board.length",
    "n == board[i].length",
    "1 <= m, n <= 12",
    "board[i][j] is a lowercase English letter.",
    "1 <= words.length <= 3 * 10^4",
    "1 <= words[i].length <= 10",
    "words[i] consists of lowercase English letters.",
    "All strings in words are distinct.",
  ],
  checker: `(actual, args, expected) => {
  if (!Array.isArray(actual) || actual.length !== expected.length) return false;
  const a = [...actual].sort();
  const e = [...expected].sort();
  for (let i = 0; i < e.length; i++) if (a[i] !== e[i]) return false;
  return true;
}`,
  starterCode: {
    javascript: `/**
 * @param {string[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
function findWords(board, words) {
  // your code here
}`,
    typescript: `/**
 * @param {string[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
function findWords(board: string[][], words: string[]): string[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "two of four words found",
      args: [
        [
          ["o", "a", "a", "n"],
          ["e", "t", "a", "e"],
          ["i", "h", "k", "r"],
          ["i", "f", "l", "v"],
        ],
        ["oath", "pea", "eat", "rain"],
      ],
      expected: ["oath", "eat"],
      explanation: "\"oath\" and \"eat\" trace valid adjacent paths; \"pea\" and \"rain\" cannot.",
    },
    {
      name: "no word fits",
      args: [
        [
          ["a", "b"],
          ["c", "d"],
        ],
        ["abcb"],
      ],
      expected: [],
      explanation: "\"abcb\" would reuse the cell 'b', which isn't allowed, so nothing is found.",
    },
  ],
  hiddenTests: [
    // Single cell board, single matching letter.
    { args: [[["a"]], ["a"]], expected: ["a"] },
    // Single cell, no match.
    { args: [[["a"]], ["b"]], expected: [] },
    // Empty word list.
    { args: [[["a", "b"], ["c", "d"]], []], expected: [] },
    // A word straddling a turn.
    {
      args: [
        [
          ["a", "b"],
          ["c", "d"],
        ],
        ["abdc"],
      ],
      expected: ["abdc"],
    },
    // Cell reuse forbidden — "aa" needs two distinct 'a' cells.
    { args: [[["a", "a"]], ["aa", "aaa"]], expected: ["aa"] },
    // Two found, one a prefix of another's path.
    {
      args: [
        [
          ["a", "b", "c"],
          ["a", "e", "d"],
          ["a", "f", "g"],
        ],
        ["abc", "abf", "aaa", "xyz"],
      ],
      expected: ["abc", "aaa"],
    },
    // Word longer than any path can be.
    { args: [[["a", "b"]], ["abab"]], expected: [] },
    // All cells same letter; words of different lengths.
    {
      args: [
        [
          ["a", "a"],
          ["a", "a"],
        ],
        ["a", "aa", "aaaa", "aaaaa"],
      ],
      expected: ["a", "aa", "aaaa"],
    },
    // Diagonal is NOT adjacency — "ad" diagonal must fail, "ab" horizontal succeeds.
    {
      args: [
        [
          ["a", "b"],
          ["c", "d"],
        ],
        ["ad", "ab"],
      ],
      expected: ["ab"],
    },
    // A vertical word.
    {
      args: [
        [
          ["t"],
          ["o"],
          ["p"],
        ],
        ["top", "pot"],
      ],
      expected: ["top", "pot"],
    },
    // Larger board, a couple of found words and decoys.
    {
      args: [
        [
          ["s", "e", "e", "n"],
          ["t", "h", "k", "r"],
          ["o", "b", "a", "t"],
          ["d", "x", "z", "e"],
        ],
        ["see", "she", "seen", "ate", "rate", "none"],
      ],
      expected: ["see", "seen", "ate"],
    },
  ],
  source: { origin: "leetcode", frontendId: "212", confidence: 0.85 },
  solutions: [
    {
      name: "Trie of words + DFS backtracking from each cell",
      explanation: `Searching every word independently re-walks the board once per word. Instead, build a **trie** of all the words, then do a single DFS from every cell that walks the board and the trie *in lockstep*: at cell \`(r, c)\` you can only continue down trie child \`board[r][c]\`. The moment the path can't extend in the trie, that whole branch is dead — every word sharing that prefix is pruned at once.

When the DFS reaches a trie node whose \`word\` field is set, that word is fully spelled on the board, so record it. To avoid reusing a cell within one path, temporarily overwrite the visited cell (here with \`"#"\`) and restore it on the way back out — standard backtracking.

A neat trick keeps the result duplicate-free without a separate set: clear the trie node's \`word\` field once collected, so it can't be reported twice. Pruning empty branches keeps the search close to the board size times the trie depth rather than blowing up per word.`,
      code: {
        javascript: `function findWords(board, words) {
  // Build a trie of all target words; each end node stores the whole word.
  const root = {};
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      node[ch] = node[ch] || {};
      node = node[ch];
    }
    node.word = word; // mark the end of a complete word
  }

  const rows = board.length;
  const cols = board[0].length;
  const found = [];

  const dfs = (r, c, node) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    const ch = board[r][c];
    const next = node[ch];
    if (!next) return; // no trie branch for this letter → dead path, prune

    if (next.word) {
      found.push(next.word);
      next.word = null; // collected once; clearing it avoids duplicate reports
    }

    board[r][c] = "#"; // mark visited so this path can't reuse the cell
    dfs(r + 1, c, next);
    dfs(r - 1, c, next);
    dfs(r, c + 1, next);
    dfs(r, c - 1, next);
    board[r][c] = ch;  // restore for other paths (backtrack)
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, root); // try starting a word at every cell
    }
  }
  return found;
}`,
        typescript: `type TrieNode = { [key: string]: TrieNode | string | null | undefined; word?: string | null };

function findWords(board: string[][], words: string[]): string[] {
  // Build a trie of all target words; each end node stores the whole word.
  const root: TrieNode = {};
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      node[ch] = (node[ch] as TrieNode) || {};
      node = node[ch] as TrieNode;
    }
    node.word = word; // mark the end of a complete word
  }

  const rows = board.length;
  const cols = board[0].length;
  const found: string[] = [];

  const dfs = (r: number, c: number, node: TrieNode): void => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    const ch = board[r][c];
    const next = node[ch] as TrieNode | undefined;
    if (!next) return; // no trie branch for this letter → dead path, prune

    if (next.word) {
      found.push(next.word);
      next.word = null; // collected once; clearing it avoids duplicate reports
    }

    board[r][c] = "#"; // mark visited so this path can't reuse the cell
    dfs(r + 1, c, next);
    dfs(r - 1, c, next);
    dfs(r, c + 1, next);
    dfs(r, c - 1, next);
    board[r][c] = ch;  // restore for other paths (backtrack)
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, root); // try starting a word at every cell
    }
  }
  return found;
}`,
      },
    },
  ],
});
