import { defineAlgoProblem } from "../problem";

export const editDistance = defineAlgoProblem<[string, string], number>({
  id: "edit-distance",
  number: 79,
  title: "Edit Distance",
  difficulty: "medium",
  tags: ["string", "dynamic-programming"],
  functionName: "minDistance",
  prompt: `Given two strings \`word1\` and \`word2\`, return the minimum number of single-character operations needed to transform \`word1\` into \`word2\`.

The permitted operations are: **insert** a character, **delete** a character, and **replace** a character.`,
  constraints: [
    "0 <= word1.length, word2.length <= 500",
    "word1 and word2 consist of lowercase English letters.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
function minDistance(word1, word2) {
  // your code here
}`,
    typescript: `/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
function minDistance(word1: string, word2: string): number {
  // your code here
}`,
  },
  examples: [
    { name: "horse to ros", args: ["horse", "ros"], expected: 3, explanation: "horse → rorse (replace h), → rose (delete r), → ros (delete e)." },
    { name: "intention to execution", args: ["intention", "execution"], expected: 5 },
    { name: "equal", args: ["abc", "abc"], expected: 0 },
  ],
  hiddenTests: [
    { args: ["", ""], expected: 0 },
    { args: ["", "abc"], expected: 3 },
    { args: ["abc", ""], expected: 3 },
    { args: ["a", "b"], expected: 1 },
    { args: ["abcdef", "azced"], expected: 3 },
    { args: ["sunday", "saturday"], expected: 3 },
    { args: ["kitten", "sitting"], expected: 3 },
    { args: ["aaaa", "aa"], expected: 2 },
    { args: ["zoologicoarchaeologist", "zoogeologist"], expected: 10 },
    { args: ["abcde", "fghij"], expected: 5 },
    { args: ["pneumonoultramicroscopic", "pneumonia"], expected: 16 },
    {
      args: ["a".repeat(500), "b".repeat(500)],
      expected: 500,
    },
  ],
  source: { origin: "leetcode", frontendId: "72", acRate: 0.606000814216131, confidence: 0.96 },
  solutions: [
    {
      name: "Dynamic programming (rolling rows)",
      explanation: `Let \`dp[i][j]\` be the edit distance between the first \`i\` characters of \`word1\` and the first \`j\` of \`word2\`. If the current characters match, carry \`dp[i-1][j-1]\`; otherwise take \`1 +\` the minimum of replace (\`dp[i-1][j-1]\`), delete (\`dp[i-1][j]\`), and insert (\`dp[i][j-1]\`). Only the previous row is needed, so keep two rows.

\`O(m·n)\` time, \`O(min(m, n))\` space (here \`O(n)\`).`,
      code: {
        javascript: `function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const curr = new Array(n + 1);
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
      }
    }
    prev = curr;
  }
  return prev[n];
}`,
        typescript: `function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;
  let prev: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const curr: number[] = new Array(n + 1);
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
      }
    }
    prev = curr;
  }
  return prev[n];
}`,
      },
    },
  ],
});
