import { defineAlgoProblem } from "../problem";

export const longestCommonPrefix = defineAlgoProblem<[string[]], string>({
  id: "longest-common-prefix",
  number: 24,
  title: "Longest Common Prefix",
  difficulty: "easy",
  tags: ["array", "string", "trie"],
  functionName: "longestCommonPrefix",
  prompt: `Given an array of strings \`strs\`, return the longest string that is a prefix of **every** string in the array.

A prefix is a leading run of characters: \`"fl"\` is a prefix of \`"flower"\`, but \`"low"\` is not. If the strings share no leading characters, return the empty string \`""\`.`,
  constraints: [
    "1 <= strs.length <= 200",
    "0 <= strs[i].length <= 200",
    "strs[i] consists of lowercase English letters.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[]} strs
 * @return {string}
 */
function longestCommonPrefix(strs) {
  // your code here
}`,
    typescript: `/**
 * @param {string[]} strs
 * @return {string}
 */
function longestCommonPrefix(strs: string[]): string {
  // your code here
}`,
  },
  examples: [
    { name: "shared prefix", args: [["flower", "flow", "flight"]], expected: "fl", explanation: "All three start with `fl`; the next characters (`o`, `o`, `i`) disagree." },
    { name: "no common prefix", args: [["dog", "racecar", "car"]], expected: "", explanation: "The first characters already differ, so there is no shared prefix." },
    { name: "single string", args: [["alone"]], expected: "alone", explanation: "With one string, the whole string is its own longest common prefix." },
    { name: "full match", args: [["same", "same", "same"]], expected: "same" },
  ],
  hiddenTests: [
    { args: [[""]], expected: "" },
    { args: [["", "abc"]], expected: "" },
    { args: [["abc", ""]], expected: "" },
    { args: [["a"]], expected: "a" },
    { args: [["ab", "a"]], expected: "a" },
    { args: [["prefix", "pre", "prefixed"]], expected: "pre" },
    { args: [["abab", "aba", "abc"]], expected: "ab" },
    { args: [["throne", "throne"]], expected: "throne" },
    { args: [["throne", "dungeon"]], expected: "" },
    { args: [["cir", "car"]], expected: "c" },
    { args: [["interspecies", "interstellar", "interstate"]], expected: "inters" },
    { args: [["aaaaa", "aaab", "aa"]], expected: "aa" },
    { args: [Array.from({ length: 200 }, () => "abcdefghij".repeat(20))], expected: "abcdefghij".repeat(20) },
    { args: [Array.from({ length: 200 }, (_, i) => "z".repeat(200 - i))], expected: "z" },
    { args: [[...Array.from({ length: 199 }, () => "commonroot"), "commonrootbutdifferenttail"]], expected: "commonroot" },
  ],
  source: { origin: "leetcode", frontendId: "14", acRate: 0.475687493791107, confidence: 0.97 },
  solutions: [
    {
      name: "Vertical scan",
      explanation: `Compare the strings character-column by character-column. For column \`i\`, take the character from the first string and check it against every other string; the moment a string is too short or differs, the prefix ends at \`i\`.

\`O(S)\` time where \`S\` is the total number of characters scanned (at most the length of the shortest string times the count), \`O(1)\` extra space.`,
      code: {
        javascript: `function longestCommonPrefix(strs) {
  if (strs.length === 0) return "";
  for (let i = 0; i < strs[0].length; i++) {
    const ch = strs[0][i];
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== ch) {
        return strs[0].slice(0, i);
      }
    }
  }
  return strs[0];
}`,
        typescript: `function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  for (let i = 0; i < strs[0].length; i++) {
    const ch = strs[0][i];
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== ch) {
        return strs[0].slice(0, i);
      }
    }
  }
  return strs[0];
}`,
      },
    },
    {
      name: "Horizontal scan",
      explanation: `Start with the first string as the candidate prefix, then fold each remaining string in: shrink the prefix from the right until it is a prefix of the current string. If the prefix ever empties, no common prefix exists.

\`O(S)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function longestCommonPrefix(strs) {
  let prefix = strs[0] ?? "";
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}`,
        typescript: `function longestCommonPrefix(strs: string[]): string {
  let prefix = strs[0] ?? "";
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}`,
      },
    },
  ],
});
