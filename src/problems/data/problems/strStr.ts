import { defineAlgoProblem } from "../problem";

export const strStr = defineAlgoProblem<[string, string], number>({
  id: "find-the-index-of-the-first-occurrence-in-a-string",
  number: 37,
  title: "Find the Index of the First Occurrence in a String",
  difficulty: "easy",
  tags: ["two-pointers", "string", "string-matching"],
  functionName: "strStr",
  prompt: `Given two strings \`haystack\` and \`needle\`, return the index of the first occurrence of \`needle\` in \`haystack\`, or \`-1\` if \`needle\` is not part of \`haystack\`.

The match must be contiguous and is case-sensitive. If \`needle\` is the empty string, return \`0\`.`,
  constraints: [
    "1 <= haystack.length, needle.length <= 10^4",
    "haystack and needle consist of only lowercase English letters.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
function strStr(haystack, needle) {
  // your code here
}`,
    typescript: `/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
function strStr(haystack: string, needle: string): number {
  // your code here
}`,
  },
  examples: [
    { name: "found", args: ["sadbutsad", "sad"], expected: 0, explanation: `"sad" occurs at index 0 and again at index 6; the first occurrence is 0.` },
    { name: "absent", args: ["leetcode", "leeto"], expected: -1, explanation: `"leeto" never appears in "leetcode".` },
    { name: "mid", args: ["hello", "ll"], expected: 2 },
  ],
  hiddenTests: [
    { name: "single char hit", args: ["a", "a"], expected: 0 },
    { name: "single char miss", args: ["a", "b"], expected: -1 },
    { name: "needle longer than haystack", args: ["abc", "abcd"], expected: -1 },
    { name: "at end", args: ["mississippi", "pi"], expected: 9 },
    { name: "overlap-ish", args: ["aaaaa", "aaa"], expected: 0 },
    { name: "near miss then hit", args: ["ababcababcd", "ababcd"], expected: 5 },
    { name: "full equality", args: ["abcdef", "abcdef"], expected: 0 },
    { name: "repeated prefix fail", args: ["aabaaabaaac", "aabaaac"], expected: 4 },
    { name: "no partial credit", args: ["abcabcabd", "abd"], expected: 6 },
    {
      name: "scale: needle near end of long haystack",
      args: ["a".repeat(9990) + "abcde", "abcde"],
      expected: 9990,
    },
    {
      name: "scale: many false starts",
      args: ["ab".repeat(4995) + "ac", "abac"],
      expected: 9988,
    },
  ],
  source: { origin: "leetcode", frontendId: "28", acRate: 0.4664992580885924, confidence: 0.95 },
  solutions: [
    {
      name: "Sliding window comparison",
      explanation: `Try every start position \`i\` in \`haystack\` where \`needle\` could still fit, and compare the window \`haystack[i..i+m)\` against \`needle\` character by character. Return the first \`i\` that matches fully; otherwise \`-1\`.

\`O(n·m)\` time worst case, \`O(1)\` extra space. The empty-needle case returns 0 since the empty loop matches immediately.`,
      code: {
        javascript: `function strStr(haystack, needle) {
  const n = haystack.length;
  const m = needle.length;
  for (let i = 0; i + m <= n; i++) {
    let j = 0;
    while (j < m && haystack[i + j] === needle[j]) j++;
    if (j === m) return i;
  }
  return -1;
}`,
        typescript: `function strStr(haystack: string, needle: string): number {
  const n = haystack.length;
  const m = needle.length;
  for (let i = 0; i + m <= n; i++) {
    let j = 0;
    while (j < m && haystack[i + j] === needle[j]) j++;
    if (j === m) return i;
  }
  return -1;
}`,
      },
    },
  ],
});
