import { defineAlgoProblem } from "../problem";

export const romanToInteger = defineAlgoProblem<[string], number>({
  id: "roman-to-integer",
  number: 23,
  title: "Roman to Integer",
  difficulty: "easy",
  tags: ["hash-table", "math", "string"],
  functionName: "romanToInt",
  prompt: `Roman numerals are written with seven symbols: \`I\` (1), \`V\` (5), \`X\` (10), \`L\` (50), \`C\` (100), \`D\` (500), and \`M\` (1000).

Numbers are normally written largest-to-smallest, left to right, and the values are added together. But to avoid four identical symbols in a row, six subtractive pairs are used instead, where a smaller symbol placed *before* a larger one is subtracted:

- \`IV\` = 4 and \`IX\` = 9
- \`XL\` = 40 and \`XC\` = 90
- \`CD\` = 400 and \`CM\` = 900

Given a string \`s\` containing a valid Roman numeral, return its integer value.`,
  constraints: [
    "1 <= s.length <= 15",
    "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').",
    "s is guaranteed to be a valid Roman numeral in the range [1, 3999].",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @return {number}
 */
function romanToInt(s) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @return {number}
 */
function romanToInt(s: string): number {
  // your code here
}`,
  },
  examples: [
    { name: "simple additive", args: ["III"], expected: 3, explanation: "I + I + I = 1 + 1 + 1 = 3." },
    { name: "subtractive pair", args: ["LVIII"], expected: 58, explanation: "L = 50, V = 5, III = 3, so 50 + 5 + 3 = 58." },
    { name: "multiple subtractives", args: ["MCMXCIV"], expected: 1994, explanation: "M = 1000, CM = 900, XC = 90, IV = 4, so 1000 + 900 + 90 + 4 = 1994." },
    { name: "single symbol", args: ["IX"], expected: 9, explanation: "IX is the subtractive form of 9." },
  ],
  hiddenTests: [
    { args: ["I"], expected: 1 },
    { args: ["MMMCMXCIX"], expected: 3999 },
    { args: ["IV"], expected: 4 },
    { args: ["XL"], expected: 40 },
    { args: ["XC"], expected: 90 },
    { args: ["CD"], expected: 400 },
    { args: ["CM"], expected: 900 },
    { args: ["MMM"], expected: 3000 },
    { args: ["DCCCXC"], expected: 890 },
    { args: ["CDXLIV"], expected: 444 },
    { args: ["XXXIX"], expected: 39 },
    { args: ["MMXXIV"], expected: 2024 },
    { args: ["DCXXI"], expected: 621 },
    { args: ["CMXCIX"], expected: 999 },
  ],
  source: { origin: "leetcode", frontendId: "13", acRate: 0.6663254238513702, confidence: 0.97 },
  solutions: [
    {
      name: "Single pass with lookahead",
      explanation: `Map each symbol to its value. Scan left to right: if the current symbol's value is smaller than the next symbol's value, it's part of a subtractive pair, so subtract it; otherwise add it.

\`O(n)\` time, \`O(1)\` space (the value table is fixed size).`,
      code: {
        javascript: `function romanToInt(s) {
  const value = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = value[s[i]];
    const next = value[s[i + 1]];
    if (next !== undefined && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }
  return total;
}`,
        typescript: `function romanToInt(s: string): number {
  const value: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = value[s[i]];
    const next = value[s[i + 1]];
    if (next !== undefined && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }
  return total;
}`,
      },
    },
  ],
});
