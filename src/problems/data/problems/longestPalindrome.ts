import { defineAlgoProblem } from "../problem";

// Multiple substrings can tie for longest, so deep-equal on one fixed answer would wrongly fail a
// correct solution. `checker` validates the returned string instead: right length, real substring,
// actually a palindrome. `expected` is one known-longest answer, used only for its length.
export const longestPalindrome = defineAlgoProblem<[string], string>({
  id: "longest-palindromic-substring",
  title: "Longest Palindromic Substring",
  difficulty: "medium",
  tags: ["two-pointers", "string", "dynamic-programming"],
  functionName: "longestPalindrome",
  prompt: `Given a string \`s\`, return the longest palindromic substring in \`s\`.

A substring reads the same forwards and backwards. If several substrings tie for the longest, return any one of them — the judge accepts any valid longest palindrome, not one specific string.`,
  constraints: ["1 <= s.length <= 1000", "s consists of digits and English letters."],
  checker: `(actual, args, expected) => {
  const s = args[0];
  if (typeof actual !== "string" || actual.length !== expected.length) return false;
  if (!s.includes(actual)) return false;
  for (let i = 0, j = actual.length - 1; i < j; i++, j--) if (actual[i] !== actual[j]) return false;
  return true;
}`,
  starterCode: {
    javascript: `function longestPalindrome(s) {
  // your code here
}`,
    typescript: `function longestPalindrome(s: string): string {
  // your code here
}`,
  },
  examples: [
    { name: "two answers", args: ["babad"], expected: "bab", explanation: `"aba" is also accepted — both are length-3 palindromes.` },
    { name: "even length", args: ["cbbd"], expected: "bb" },
    { name: "single char", args: ["a"], expected: "a" },
  ],
  hiddenTests: [
    { args: ["ac"], expected: "a" },
    { args: ["bb"], expected: "bb" },
    { args: ["abb"], expected: "bb" },
    { args: ["aaaa"], expected: "aaaa" },
    { args: ["racecar"], expected: "racecar" },
    { args: ["noon"], expected: "noon" },
    { args: ["abcba"], expected: "abcba" },
    { args: ["ababa"], expected: "ababa" },
    { args: ["bananas"], expected: "anana" },
    { args: ["abacabad"], expected: "abacaba" },
    { args: ["forgeeksskeegfor"], expected: "geeksskeeg" },
    { args: ["aaaaaaaaaa"], expected: "aaaaaaaaaa" },
    { args: ["z"], expected: "z" },
  ],
  source: { origin: "leetcode", frontendId: "5", acRate: 0.37838154642320615 },
  solutions: [
    {
      name: "Expand around center",
      explanation: `Every palindrome has a center — a single character (odd length) or a gap between two characters (even length). There are \`2n - 1\` such centers. From each, expand outward while the characters match; the widest span seen is the answer.

\`O(n²)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function longestPalindrome(s) {
  if (s.length < 2) return s;
  let start = 0;
  let end = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    return r - l - 1;
  };
  for (let i = 0; i < s.length; i++) {
    const len = Math.max(expand(i, i), expand(i, i + 1));
    if (len > end - start + 1) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
    }
  }
  return s.slice(start, end + 1);
}`,
        typescript: `function longestPalindrome(s: string): string {
  if (s.length < 2) return s;
  let start = 0;
  let end = 0;
  const expand = (l: number, r: number): number => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    return r - l - 1;
  };
  for (let i = 0; i < s.length; i++) {
    const len = Math.max(expand(i, i), expand(i, i + 1));
    if (len > end - start + 1) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
    }
  }
  return s.slice(start, end + 1);
}`,
      },
    },
  ],
});
