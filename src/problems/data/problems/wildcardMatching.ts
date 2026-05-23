import { defineAlgoProblem } from "../problem";

export const wildcardMatching = defineAlgoProblem<[string, string], boolean>({
  id: "wildcard-matching",
  number: 53,
  title: "Wildcard Matching",
  difficulty: "hard",
  tags: ["string", "dynamic-programming", "greedy", "recursion"],
  functionName: "isMatch",
  prompt: `Given an input string \`s\` and a pattern \`p\`, return whether \`p\` matches the **entire** string \`s\` (not a partial match).

The pattern may contain two special characters:

- \`'?'\` matches any single character.
- \`'*'\` matches any sequence of characters, including the empty sequence.

Every other character in \`p\` matches only itself. The match must cover all of \`s\`.`,
  constraints: [
    "0 <= s.length, p.length <= 2000",
    "s contains only lowercase English letters.",
    "p contains only lowercase English letters, '?', and '*'.",
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
    { name: "no star", args: ["aa", "a"], expected: false, explanation: `"a" does not cover all of "aa".` },
    { name: "single star", args: ["aa", "*"], expected: true, explanation: `"*" matches the whole string.` },
    { name: "star expands", args: ["adceb", "*a*b"], expected: true, explanation: `First "*" → "", then "a", "*" → "dce", then "b".` },
    { name: "mismatch", args: ["acdcb", "a*c?b"], expected: false },
  ],
  hiddenTests: [
    { args: ["cb", "?a"], expected: false },
    { args: ["", ""], expected: true },
    { args: ["", "*"], expected: true },
    { args: ["", "?"], expected: false },
    { args: ["a", ""], expected: false },
    { args: ["abc", "abc"], expected: true },
    { args: ["abc", "a?c"], expected: true },
    { args: ["abc", "a*"], expected: true },
    { args: ["abc", "*c"], expected: true },
    { args: ["abc", "*b*"], expected: true },
    { args: ["aaa", "a*a"], expected: true },
    { args: ["mississippi", "m??*ss*?i*pi"], expected: false },
    { args: ["abcabczzzde", "*abc???de*"], expected: true },
    { args: ["aaaa", "***a"], expected: true },
    { args: ["xaylmz", "x?y*z"], expected: true },
    { args: ["a".repeat(2000), "*".repeat(100) + "a".repeat(2000)], expected: true },
    { args: ["a".repeat(2000) + "b", "*a*a*a*a*a*a*a*b"], expected: true },
    { args: ["a".repeat(2000), "a".repeat(1999) + "b"], expected: false },
  ],
  source: { origin: "leetcode", frontendId: "44", acRate: 0.3197563925519744, confidence: 0.93 },
  solutions: [
    {
      name: "Greedy with star backtracking",
      explanation: `Scan \`s\` and \`p\` with two pointers. On a literal or \`'?'\` match, advance both. On a \`'*'\`, record its position and the current \`s\` index, then move past the star (tentatively matching nothing). If a later mismatch occurs and a \`'*'\` is on record, backtrack: let that star swallow one more character of \`s\` and retry. If there's no star to fall back on, fail. At the end, any trailing \`'*'\`s in \`p\` can match empty.

\`O(s · p)\` worst case but near-linear in practice, \`O(1)\` extra space — no DP table.`,
      code: {
        javascript: `function isMatch(s, p) {
  let i = 0;
  let j = 0;
  let starIndex = -1;
  let matchIndex = 0;
  while (i < s.length) {
    if (j < p.length && (p[j] === s[i] || p[j] === "?")) {
      i++;
      j++;
    } else if (j < p.length && p[j] === "*") {
      starIndex = j;
      matchIndex = i;
      j++;
    } else if (starIndex !== -1) {
      j = starIndex + 1;
      matchIndex++;
      i = matchIndex;
    } else {
      return false;
    }
  }
  while (j < p.length && p[j] === "*") j++;
  return j === p.length;
}`,
        typescript: `function isMatch(s: string, p: string): boolean {
  let i = 0;
  let j = 0;
  let starIndex = -1;
  let matchIndex = 0;
  while (i < s.length) {
    if (j < p.length && (p[j] === s[i] || p[j] === "?")) {
      i++;
      j++;
    } else if (j < p.length && p[j] === "*") {
      starIndex = j;
      matchIndex = i;
      j++;
    } else if (starIndex !== -1) {
      j = starIndex + 1;
      matchIndex++;
      i = matchIndex;
    } else {
      return false;
    }
  }
  while (j < p.length && p[j] === "*") j++;
  return j === p.length;
}`,
      },
    },
  ],
});
