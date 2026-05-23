import { defineAlgoProblem } from "../problem";

export const isMatch = defineAlgoProblem<[string, string], boolean>({
  id: "regular-expression-matching",
  number: 10,
  title: "Regular Expression Matching",
  difficulty: "hard",
  tags: ["string", "dynamic-programming", "recursion"],
  functionName: "isMatch",
  prompt: `Given an input string \`s\` and a pattern \`p\`, return \`true\` if \`p\` matches the **entire** string \`s\`, and \`false\` otherwise.

The pattern supports two special characters:

- \`.\` matches any single character.
- \`*\` matches zero or more of the **preceding element** (the single character immediately before it).

A \`*\` always follows a valid preceding character or \`.\`; it never appears first. The match must cover the whole string — a pattern that matches only a prefix of \`s\` does not count.`,
  constraints: [
    "1 <= s.length <= 20",
    "1 <= p.length <= 20",
    "s contains only lowercase English letters.",
    "p contains only lowercase English letters, '.', and '*'.",
    "Each '*' is preceded by a valid character or '.', so the pattern is always well-formed.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
function isMatch(s, p) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
function isMatch(s: string, p: string): boolean {
  // your code here
}`,
  },
  examples: [
    {
      name: "no match",
      args: ["aa", "a"],
      expected: false,
      explanation: `"a" matches only one character, but "aa" has two, so the whole string isn't covered.`,
    },
    {
      name: "star collapses repeats",
      args: ["aa", "a*"],
      expected: true,
      explanation: `"a*" means zero or more 'a', which matches both characters of "aa".`,
    },
    {
      name: "dot-star wildcard",
      args: ["ab", ".*"],
      expected: true,
      explanation: `".*" means zero or more of any character, so it matches any string including "ab".`,
    },
    {
      name: "interleaved stars",
      args: ["aab", "c*a*b"],
      expected: true,
      explanation: `"c*" matches zero 'c', "a*" matches "aa", and "b" matches "b".`,
    },
  ],
  hiddenTests: [
    { args: ["a", "a"], expected: true },
    { args: ["a", "."], expected: true },
    { args: ["a", "b"], expected: false },
    { args: ["a", "a*"], expected: true },
    { args: ["a", "ab*"], expected: true },
    { args: ["", "a*"], expected: true },
    { args: ["", ".*"], expected: true },
    { args: ["", "a*b*c*"], expected: true },
    { args: ["abc", "a*bc"], expected: true },
    { args: ["aaa", "a*a"], expected: true },
    { args: ["aaa", "ab*a*c*a"], expected: true },
    { args: ["aaa", "aa"], expected: false },
    { args: ["aaa", "a*aaa"], expected: true },
    { args: ["ab", ".*c"], expected: false },
    { args: ["abcd", "d*"], expected: false },
    { args: ["bbbba", ".*a*a"], expected: true },
    { args: ["mississippi", "mis*is*p*."], expected: false },
    { args: ["mississippi", "mis*is*ip*."], expected: true },
    { args: ["aasdfasdfasdfasdfas", "aasdf.*asdf.*asdf.*asdf.*s"], expected: true },
    { args: ["ab", ".*.."], expected: true },
    { args: ["aaba", "ab*a*c*a"], expected: false },
    { args: ["aaaaaaaaaaaaaaaaaaaa", "a*a*a*a*a*a*a*a*a*a*"], expected: true },
    { args: ["aaaaaaaaaaaaaaaaaaab", "a*a*a*a*a*a*a*a*a*a*"], expected: false },
  ],
  source: { origin: "leetcode", frontendId: "10", acRate: 0.30955668508952455, confidence: 0.9 },
  solutions: [
    {
      name: "Bottom-up dynamic programming",
      explanation: `Let \`dp[i][j]\` be true when the first \`i\` characters of \`s\` match the first \`j\` characters of \`p\`. \`dp[0][0]\` is true (empty matches empty). An empty string can still match a pattern made of \`x*\` groups, so seed \`dp[0][j]\` from \`dp[0][j-2]\` whenever \`p[j-1]\` is \`*\`.

For each cell, if \`p[j-1]\` is a normal char or \`.\`, the cell inherits \`dp[i-1][j-1]\` when the current characters line up. If \`p[j-1]\` is \`*\`, it can collapse to zero (look back two, \`dp[i][j-2]\`) or consume one more \`s\` char when the preceding pattern element matches \`s[i-1]\` (\`dp[i-1][j]\`).

\`O(n·m)\` time and space, where \`n = s.length\` and \`m = p.length\`.`,
      code: {
        javascript: `function isMatch(s, p) {
  const n = s.length;
  const m = p.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= m; j++) {
    if (p[j - 1] === "*" && j >= 2) dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const pc = p[j - 1];
      if (pc === "*") {
        const prev = p[j - 2];
        const matchesOne = prev === "." || prev === s[i - 1];
        dp[i][j] = dp[i][j - 2] || (matchesOne && dp[i - 1][j]);
      } else if (pc === "." || pc === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[n][m];
}`,
        typescript: `function isMatch(s: string, p: string): boolean {
  const n = s.length;
  const m = p.length;
  const dp: boolean[][] = Array.from({ length: n + 1 }, () => new Array<boolean>(m + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= m; j++) {
    if (p[j - 1] === "*" && j >= 2) dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const pc = p[j - 1];
      if (pc === "*") {
        const prev = p[j - 2];
        const matchesOne = prev === "." || prev === s[i - 1];
        dp[i][j] = dp[i][j - 2] || (matchesOne && dp[i - 1][j]);
      } else if (pc === "." || pc === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[n][m];
}`,
      },
    },
    {
      name: "Top-down recursion with memoization",
      explanation: `Match position by position. At index \`(i, j)\`, the current characters match when \`p[j]\` is \`.\` or equals \`s[i]\`. If the next pattern char is \`*\`, branch two ways: skip the \`x*\` group entirely (advance \`j\` by 2) or, when the current char matches, consume one \`s\` char (advance \`i\`). Otherwise both indices advance by one on a match. Memoize on \`(i, j)\` to avoid re-exploring the same suffix pair.

\`O(n·m)\` time and space.`,
      code: {
        javascript: `function isMatch(s, p) {
  const memo = new Map();
  const dp = (i, j) => {
    if (j === p.length) return i === s.length;
    const key = i * (p.length + 1) + j;
    if (memo.has(key)) return memo.get(key);
    const firstMatch = i < s.length && (p[j] === "." || p[j] === s[i]);
    let result;
    if (j + 1 < p.length && p[j + 1] === "*") {
      result = dp(i, j + 2) || (firstMatch && dp(i + 1, j));
    } else {
      result = firstMatch && dp(i + 1, j + 1);
    }
    memo.set(key, result);
    return result;
  };
  return dp(0, 0);
}`,
        typescript: `function isMatch(s: string, p: string): boolean {
  const memo = new Map<number, boolean>();
  const dp = (i: number, j: number): boolean => {
    if (j === p.length) return i === s.length;
    const key = i * (p.length + 1) + j;
    if (memo.has(key)) return memo.get(key)!;
    const firstMatch = i < s.length && (p[j] === "." || p[j] === s[i]);
    let result: boolean;
    if (j + 1 < p.length && p[j + 1] === "*") {
      result = dp(i, j + 2) || (firstMatch && dp(i + 1, j));
    } else {
      result = firstMatch && dp(i + 1, j + 1);
    }
    memo.set(key, result);
    return result;
  };
  return dp(0, 0);
}`,
      },
    },
  ],
});
