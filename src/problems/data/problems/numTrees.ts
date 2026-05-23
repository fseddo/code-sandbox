import { defineAlgoProblem } from "../problem";

export const numTrees = defineAlgoProblem<[number], number>({
  id: "unique-binary-search-trees",
  number: 101,
  title: "Unique Binary Search Trees",
  difficulty: "medium",
  tags: ["math", "dynamic-programming", "tree", "binary-search-tree", "binary-tree"],
  functionName: "numTrees",
  prompt: `Given an integer \`n\`, return the number of **structurally unique** binary search trees that store exactly the values \`1, 2, …, n\`.

Two trees are the same only if they have the same shape *and* the same value at each position. Because the keys are fixed and a BST orders them, the count depends only on \`n\`.`,
  constraints: ["1 <= n <= 19"],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {number}
 */
function numTrees(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {number}
 */
function numTrees(n: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "n = 3", args: [3], expected: 5, explanation: "The five shapes are the Catalan number C(3)." },
    { name: "n = 1", args: [1], expected: 1 },
    { name: "n = 2", args: [2], expected: 2, explanation: "Either 1 is the root with 2 to its right, or 2 is the root with 1 to its left." },
  ],
  hiddenTests: [
    { args: [4], expected: 14 },
    { args: [5], expected: 42 },
    { args: [6], expected: 132 },
    { args: [7], expected: 429 },
    { args: [8], expected: 1430 },
    { args: [9], expected: 4862 },
    { args: [10], expected: 16796 },
    { args: [12], expected: 208012 },
    { args: [15], expected: 9694845 },
    { args: [17], expected: 129644790 },
    { args: [18], expected: 477638700 },
    // Scale: the largest allowed input.
    { args: [19], expected: 1767263190 },
  ],
  source: { origin: "leetcode", frontendId: "96", acRate: 0.6371316498926894, confidence: 0.97 },
  solutions: [
    {
      name: "Catalan via DP",
      explanation: `Let \`dp[k]\` be the number of unique BSTs holding \`k\` keys. Choosing each value as the root splits the remaining keys into a left subtree of \`root - 1\` keys and a right subtree of \`k - root\` keys, and the counts multiply: \`dp[k] = Σ dp[root-1] * dp[k-root]\` for \`root\` in \`1..k\`, with \`dp[0] = 1\`. These are the Catalan numbers.

\`O(n²)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function numTrees(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let nodes = 1; nodes <= n; nodes++) {
    for (let root = 1; root <= nodes; root++) {
      dp[nodes] += dp[root - 1] * dp[nodes - root];
    }
  }
  return dp[n];
}`,
        typescript: `function numTrees(n: number): number {
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let nodes = 1; nodes <= n; nodes++) {
    for (let root = 1; root <= nodes; root++) {
      dp[nodes] += dp[root - 1] * dp[nodes - root];
    }
  }
  return dp[n];
}`,
      },
    },
  ],
});
