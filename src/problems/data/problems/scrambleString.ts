import { defineAlgoProblem } from "../problem";

export const scrambleString = defineAlgoProblem<[string, string], boolean>({
  id: "scramble-string",
  number: 93,
  title: "Scramble String",
  difficulty: "hard",
  tags: ["string", "dynamic-programming"],
  functionName: "isScramble",
  prompt: `A string can be **scrambled** by the following recursive procedure: if its length is greater than 1, split it into two non-empty contiguous substrings at some index, then optionally swap the two halves, and recursively scramble each half. A single character is left unchanged.

Given two strings \`s1\` and \`s2\` of equal length, return \`true\` if \`s2\` is a scramble of \`s1\` (i.e. \`s1\` can be transformed into \`s2\` by the procedure above), and \`false\` otherwise.`,
  constraints: [
    "s1.length == s2.length",
    "1 <= s1.length <= 30",
    "s1 and s2 consist of lowercase English letters.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
function isScramble(s1, s2) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
function isScramble(s1: string, s2: string): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "scrambled", args: ["great", "rgeat"], expected: true, explanation: "Split 'great' as 'gr' + 'eat'; scramble 'gr' into 'rg' (swap the two halves) and leave 'eat' as is, giving 'rg' + 'eat' = 'rgeat'." },
    { name: "not scrambled", args: ["abcde", "caebd"], expected: false },
    { name: "single", args: ["a", "a"], expected: true },
  ],
  hiddenTests: [
    { args: ["a", "b"], expected: false },
    { args: ["ab", "ab"], expected: true },
    { args: ["ab", "ba"], expected: true },
    { args: ["abc", "bca"], expected: true },
    { args: ["abc", "acb"], expected: true },
    { args: ["abcd", "bdac"], expected: false },
    { args: ["aa", "ab"], expected: false },
    { args: ["abb", "bba"], expected: true },
    { args: ["abcdd", "dcdab"], expected: true },
    { args: ["abcdef", "cadbef"], expected: false },
    { args: ["great", "great"], expected: true },
    { args: ["eebaacbcbcadaaedceaaacadccd", "eadcaacabaddaceacbceaabeccd"], expected: false },
    { args: ["abcdefghijklmn", "efghijklmncadb"], expected: false },
    { args: ["xyz", "zyx"], expected: true },
    // Scale: a length-30 reverse-style scramble that the recursion confirms is reachable.
    { args: ["abcdefghijklmnopqrstuvwxyzabcd", "dcbazyxwvutsrqponmlkjihgfedcba"], expected: true },
    { args: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"], expected: true },
  ],
  source: { origin: "leetcode", frontendId: "87", acRate: 0.44597730734958174, confidence: 0.88 },
  solutions: [
    {
      name: "Top-down recursion with memoization",
      explanation: `\`isScramble(a, b)\` is true if \`a === b\`, or if there exists a split point \`k\` (\`1 <= k < n\`) such that **either** the prefixes match without swapping (\`isScramble(a[:k], b[:k]) && isScramble(a[k:], b[k:])\`) **or** they match with a swap (\`isScramble(a[:k], b[n-k:]) && isScramble(a[k:], b[:n-k])\`). Prune early when the two strings don't share the same multiset of characters. Memoize on \`(a, b)\` to collapse the exponential blowup.

\`O(n^4)\` time in the worst case, \`O(n^3)\` distinct subproblems.`,
      code: {
        javascript: `function isScramble(s1, s2) {
  if (s1.length !== s2.length) return false;
  const memo = new Map();
  const sameChars = (a, b) => {
    if (a.length !== b.length) return false;
    const count = {};
    for (const c of a) count[c] = (count[c] || 0) + 1;
    for (const c of b) {
      if (!count[c]) return false;
      count[c]--;
    }
    return true;
  };
  const solve = (a, b) => {
    if (a === b) return true;
    const key = a + "#" + b;
    if (memo.has(key)) return memo.get(key);
    if (!sameChars(a, b)) {
      memo.set(key, false);
      return false;
    }
    const n = a.length;
    for (let k = 1; k < n; k++) {
      const noSwap = solve(a.slice(0, k), b.slice(0, k)) && solve(a.slice(k), b.slice(k));
      const swap = solve(a.slice(0, k), b.slice(n - k)) && solve(a.slice(k), b.slice(0, n - k));
      if (noSwap || swap) {
        memo.set(key, true);
        return true;
      }
    }
    memo.set(key, false);
    return false;
  };
  return solve(s1, s2);
}`,
        typescript: `function isScramble(s1: string, s2: string): boolean {
  if (s1.length !== s2.length) return false;
  const memo = new Map<string, boolean>();
  const sameChars = (a: string, b: string): boolean => {
    if (a.length !== b.length) return false;
    const count: Record<string, number> = {};
    for (const c of a) count[c] = (count[c] || 0) + 1;
    for (const c of b) {
      if (!count[c]) return false;
      count[c]--;
    }
    return true;
  };
  const solve = (a: string, b: string): boolean => {
    if (a === b) return true;
    const key = a + "#" + b;
    if (memo.has(key)) return memo.get(key)!;
    if (!sameChars(a, b)) {
      memo.set(key, false);
      return false;
    }
    const n = a.length;
    for (let k = 1; k < n; k++) {
      const noSwap = solve(a.slice(0, k), b.slice(0, k)) && solve(a.slice(k), b.slice(k));
      const swap = solve(a.slice(0, k), b.slice(n - k)) && solve(a.slice(k), b.slice(0, n - k));
      if (noSwap || swap) {
        memo.set(key, true);
        return true;
      }
    }
    memo.set(key, false);
    return false;
  };
  return solve(s1, s2);
}`,
      },
    },
  ],
});
