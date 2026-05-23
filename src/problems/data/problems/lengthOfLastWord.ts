import { defineAlgoProblem } from "../problem";

export const lengthOfLastWord = defineAlgoProblem<[string], number>({
  id: "length-of-last-word",
  number: 65,
  title: "Length of Last Word",
  difficulty: "easy",
  tags: ["string"],
  functionName: "lengthOfLastWord",
  prompt: `Given a string \`s\` consisting of words separated by spaces, return the length of the **last** word.

A word is a maximal run of non-space characters. There may be leading or trailing spaces; the input is guaranteed to contain at least one word.`,
  constraints: [
    "1 <= s.length <= 10^4",
    "s consists of English letters and spaces ' '.",
    "There is at least one word in s.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLastWord(s) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLastWord(s: string): number {
  // your code here
}`,
  },
  examples: [
    { name: "trailing space", args: ["Hello World"], expected: 5, explanation: `The last word is "World", length 5.` },
    { name: "padded", args: ["   fly me   to   the moon  "], expected: 4, explanation: `The last word is "moon", length 4.` },
    { name: "double word", args: ["luffy is still joyboy"], expected: 6, explanation: `The last word is "joyboy", length 6.` },
  ],
  hiddenTests: [
    { args: ["a"], expected: 1 },
    { args: ["a "], expected: 1 },
    { args: [" a"], expected: 1 },
    { args: ["   word   "], expected: 4 },
    { args: ["one two three"], expected: 5 },
    { args: ["abcde"], expected: 5 },
    { args: ["x y z verylongword"], expected: 12 },
    { args: ["padding   short"], expected: 5 },
    { args: ["    lead"], expected: 4 },
    { args: ["trail    "], expected: 5 },
    // Anti-hardcode: many spaces between, single trailing letter.
    { args: ["aaa bbbb        c"], expected: 1 },
    // Scale: ~10k characters, last word at the very end after a long run.
    {
      args: [`${"word ".repeat(1999)}finalword`],
      expected: 9,
    },
  ],
  source: { origin: "leetcode", frontendId: "58", acRate: 0.5882331581972655, confidence: 0.97 },
  solutions: [
    {
      name: "Scan from the end",
      explanation: `Walk backwards from the end of the string, skipping any trailing spaces, then count consecutive non-space characters until you hit a space or the start. This avoids splitting or trimming the whole string.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function lengthOfLastWord(s) {
  let i = s.length - 1;
  while (i >= 0 && s[i] === " ") i--;
  let length = 0;
  while (i >= 0 && s[i] !== " ") { length++; i--; }
  return length;
}`,
        typescript: `function lengthOfLastWord(s: string): number {
  let i = s.length - 1;
  while (i >= 0 && s[i] === " ") i--;
  let length = 0;
  while (i >= 0 && s[i] !== " ") { length++; i--; }
  return length;
}`,
      },
    },
  ],
});
