import { defineAlgoProblem } from "../problem";

export const longestCommonSubsequence = defineAlgoProblem<[string, string], number>({
  id: "longest-common-subsequence",
  number: 155,
  title: "Longest Common Subsequence",
  difficulty: "medium",
  tags: ["string", "dynamic-programming"],
  functionName: "longestCommonSubsequence",
  prompt: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence.

A subsequence of a string is formed by deleting zero or more characters without disturbing the relative order of the remaining characters — the kept characters don't need to be contiguous. A common subsequence of two strings is a subsequence of both. If the two strings share no characters in common order, return \`0\`.`,
  constraints: [
    "1 <= text1.length, text2.length <= 1000",
    "text1 and text2 consist of lowercase English letters",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
function longestCommonSubsequence(text1, text2) {
  // your code here
}`,
    typescript: `/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
function longestCommonSubsequence(text1: string, text2: string): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "interleaved match",
      args: ["abcde", "ace"],
      expected: 3,
      explanation: "\"ace\" is a subsequence of both strings, and no longer common subsequence exists.",
    },
    {
      name: "identical strings",
      args: ["abc", "abc"],
      expected: 3,
      explanation: "The whole string is the common subsequence.",
    },
    {
      name: "no shared letters",
      args: ["abc", "def"],
      expected: 0,
    },
  ],
  hiddenTests: [
    // boundary
    { name: "first string empty", args: ["", "abc"], expected: 0 },
    { name: "second string empty", args: ["abc", ""], expected: 0 },
    { name: "both strings empty", args: ["", ""], expected: 0 },
    { name: "single matching characters", args: ["a", "a"], expected: 1 },
    { name: "single non-matching characters", args: ["a", "b"], expected: 0 },
    // edge / structural
    { name: "one string fully embedded in the other", args: ["abcabc", "abc"], expected: 3 },
    { name: "interleaved subsequence, not contiguous", args: ["axbycz", "abc"], expected: 3 },
    { name: "must skip characters in both strings (bde)", args: ["bxdye", "acbde"], expected: 3 },
    { name: "repeated characters, shorter run wins", args: ["aaaa", "aa"], expected: 2 },
    { name: "repeated characters, longer run wins (aba)", args: ["aabbaa", "aba"], expected: 3 },
    { name: "reversed order shares only one letter", args: ["abcdef", "fedcba"], expected: 1 },
    { name: "common subsequence at the tail (yz)", args: ["xxxyz", "zzzyz"], expected: 2 },
    // anti-hardcode
    { name: "unrelated longer pair", args: ["gxtxayb", "gtxayb"], expected: 6 },
    { name: "different lengths, partial overlap", args: ["abcdefgh", "aceg"], expected: 4 },
    // scale
    {
      name: "large repeating alphabet pair",
      args: [
        Array.from({ length: 150 }, (_, i) => "abcdefghij"[i % 10]).join(""),
        Array.from({ length: 130 }, (_, i) => "jihgfedcba"[i % 10]).join(""),
      ],
      expected: 27,
    },
    {
      name: "large mostly-disjoint strings with one embedded match",
      args: [
        "z".repeat(90) + "needle" + "z".repeat(90),
        "y".repeat(80) + "needle" + "y".repeat(80),
      ],
      expected: 6,
    },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "Bottom-up 2-D DP",
      explanation: `Let \`dp[i][j]\` be the LCS length of the suffixes \`text1[i:]\` and \`text2[j:]\`. Filling from the ends backward: if the characters at \`i\` and \`j\` match, they can both be part of the LCS, so \`dp[i][j] = 1 + dp[i+1][j+1]\`; otherwise the LCS skips one character from either string, so \`dp[i][j] = max(dp[i+1][j], dp[i][j+1])\`. The answer is \`dp[0][0]\`, and the base case \`dp[m][*] = dp[*][n] = 0\` handles either string running out.

\`O(m * n)\` time, \`O(m * n)\` space.`,
      code: {
        javascript: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  // dp[i][j] = LCS length of text1[i:] and text2[j:]; extra row/col of zeros for the empty-suffix base case
  // (dp[m][*] and dp[*][n] never get overwritten below, so they stay 0).
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Fill from the bottom-right corner backward, so dp[i+1][j+1], dp[i+1][j], and dp[i][j+1] are
  // always already computed by the time dp[i][j] needs them.
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (text1[i] === text2[j]) {
        // Characters match: take both and extend the LCS found for the suffixes past this pair.
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        // No match: skip a character from either string and keep whichever skip did better.
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // dp[0][0] is the LCS length of the two full strings.
  return dp[0][0];
}`,
        typescript: `function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  // dp[i][j] = LCS length of text1[i:] and text2[j:]; extra row/col of zeros for the empty-suffix base case
  // (dp[m][*] and dp[*][n] never get overwritten below, so they stay 0).
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Fill from the bottom-right corner backward, so dp[i+1][j+1], dp[i+1][j], and dp[i][j+1] are
  // always already computed by the time dp[i][j] needs them.
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (text1[i] === text2[j]) {
        // Characters match: take both and extend the LCS found for the suffixes past this pair.
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        // No match: skip a character from either string and keep whichever skip did better.
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // dp[0][0] is the LCS length of the two full strings.
  return dp[0][0];
}`,
      },
    },
  ],
});
