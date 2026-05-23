import { defineAlgoProblem } from "../problem";

export const isInterleave = defineAlgoProblem<[string, string, string], boolean>({
  id: "interleaving-string",
  number: 102,
  title: "Interleaving String",
  difficulty: "medium",
  tags: ["string", "dynamic-programming"],
  functionName: "isInterleave",
  prompt: `Given strings \`s1\`, \`s2\`, and \`s3\`, return \`true\` if \`s3\` is formed by **interleaving** \`s1\` and \`s2\`.

An interleaving keeps the internal order of each source string but freely merges the two: pick characters one at a time, each from the front of either \`s1\` or \`s2\`, until both are exhausted. Every character of \`s1\` and \`s2\` must be used exactly once, so \`s3\` must have length \`s1.length + s2.length\`.`,
  constraints: [
    "0 <= s1.length, s2.length <= 100",
    "0 <= s3.length <= 200",
    "s1, s2, and s3 consist of lowercase English letters.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s1
 * @param {string} s2
 * @param {string} s3
 * @return {boolean}
 */
function isInterleave(s1, s2, s3) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s1
 * @param {string} s2
 * @param {string} s3
 * @return {boolean}
 */
function isInterleave(s1: string, s2: string, s3: string): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "valid interleaving", args: ["aabcc", "dbbca", "aadbbcbcac"], expected: true, explanation: `Take "aa" from s1, "dbb" from s2, "c" from s1, "ca" from s2, "c" from s1.` },
    { name: "invalid", args: ["aabcc", "dbbca", "aadbbbaccc"], expected: false, explanation: "No interleaving produces the third 'b' at that spot." },
    { name: "all empty", args: ["", "", ""], expected: true },
  ],
  hiddenTests: [
    { args: ["a", "", "a"], expected: true },
    { args: ["", "b", "b"], expected: true },
    { args: ["abc", "", "abc"], expected: true },
    { args: ["a", "b", "ba"], expected: true },
    { args: ["a", "b", "ab"], expected: true },
    { args: ["ab", "cd", "abc"], expected: false },
    { args: ["aa", "ab", "aaba"], expected: true },
    { args: ["ab", "bc", "babc"], expected: true },
    { args: ["abc", "def", "adbecf"], expected: true },
    { args: ["abc", "def", "abcdef"], expected: true },
    { args: ["aabc", "abad", "aaabcabd"], expected: false },
    { args: ["aaa", "aaa", "aaaaaa"], expected: true },
    // Anti-greedy: a leading 'a' can be matched from either source, so a greedy first-match fails.
    { args: ["aba", "ab", "abaab"], expected: true },
    // Scale: two 50-char strings interleaved into a 100-char target, a valid weave.
    {
      args: [
        "a".repeat(50) + "b".repeat(50),
        "a".repeat(50) + "c".repeat(50),
        (() => {
          const a = "a".repeat(50) + "b".repeat(50);
          const b = "a".repeat(50) + "c".repeat(50);
          let c = "";
          let i = 0;
          let j = 0;
          while (i < a.length || j < b.length) {
            if (i < a.length) c += a[i++];
            if (j < b.length) c += b[j++];
          }
          return c;
        })(),
      ],
      expected: true,
    },
  ],
  source: { origin: "leetcode", frontendId: "97", acRate: 0.4402776022989184, confidence: 0.93 },
  solutions: [
    {
      name: "2D DP over prefixes",
      explanation: `Let \`dp[i][j]\` mean "the first \`i\` chars of s1 and first \`j\` chars of s2 interleave to form the first \`i+j\` chars of s3." A length mismatch is an immediate \`false\`. The cell is reachable if either the previous s1 char matched (\`dp[i-1][j]\` and \`s1[i-1] === s3[i+j-1]\`) or the previous s2 char matched (\`dp[i][j-1]\` and \`s2[j-1] === s3[i+j-1]\`). Rolling one row keeps space linear.

\`O(m·n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function isInterleave(s1, s2, s3) {
  const m = s1.length;
  const n = s2.length;
  if (m + n !== s3.length) return false;
  let dp = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let j = 1; j <= n; j++) dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1];
  for (let i = 1; i <= m; i++) {
    dp[0] = dp[0] && s1[i - 1] === s3[i - 1];
    for (let j = 1; j <= n; j++) {
      dp[j] = (dp[j] && s1[i - 1] === s3[i + j - 1]) || (dp[j - 1] && s2[j - 1] === s3[i + j - 1]);
    }
  }
  return dp[n];
}`,
        typescript: `function isInterleave(s1: string, s2: string, s3: string): boolean {
  const m = s1.length;
  const n = s2.length;
  if (m + n !== s3.length) return false;
  let dp: boolean[] = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let j = 1; j <= n; j++) dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1];
  for (let i = 1; i <= m; i++) {
    dp[0] = dp[0] && s1[i - 1] === s3[i - 1];
    for (let j = 1; j <= n; j++) {
      dp[j] = (dp[j] && s1[i - 1] === s3[i + j - 1]) || (dp[j - 1] && s2[j - 1] === s3[i + j - 1]);
    }
  }
  return dp[n];
}`,
      },
    },
  ],
});
