import { defineAlgoProblem } from "../problem";

export const integerToRoman = defineAlgoProblem<[number], string>({
  id: "integer-to-roman",
  number: 22,
  title: "Integer to Roman",
  difficulty: "medium",
  tags: ["hash-table", "math", "string"],
  functionName: "intToRoman",
  prompt: `Roman numerals are written with the symbols \`I\` (1), \`V\` (5), \`X\` (10), \`L\` (50), \`C\` (100), \`D\` (500), and \`M\` (1000).

Numbers are usually formed by writing the largest symbols first and adding their values. But six values use *subtraction* instead of writing four of the same symbol in a row:

- \`IV\` = 4 and \`IX\` = 9
- \`XL\` = 40 and \`XC\` = 90
- \`CD\` = 400 and \`CM\` = 900

Given an integer \`num\`, return its representation as a Roman numeral string.`,
  constraints: ["1 <= num <= 3999"],
  starterCode: {
    javascript: `/**
 * @param {number} num
 * @return {string}
 */
function intToRoman(num) {
  // your code here
}`,
    typescript: `/**
 * @param {number} num
 * @return {string}
 */
function intToRoman(num: number): string {
  // your code here
}`,
  },
  examples: [
    { name: "additive", args: [3], expected: "III", explanation: "Three ones: I + I + I." },
    { name: "subtractive", args: [4], expected: "IV", explanation: "Four is 5 - 1, written as IV rather than IIII." },
    {
      name: "mixed",
      args: [58],
      expected: "LVIII",
      explanation: "50 (L) + 5 (V) + 3 (III).",
    },
    {
      name: "many groups",
      args: [1994],
      expected: "MCMXCIV",
      explanation: "1000 (M) + 900 (CM) + 90 (XC) + 4 (IV).",
    },
  ],
  hiddenTests: [
    { args: [1], expected: "I" },
    { args: [3999], expected: "MMMCMXCIX" },
    { args: [9], expected: "IX" },
    { args: [40], expected: "XL" },
    { args: [90], expected: "XC" },
    { args: [400], expected: "CD" },
    { args: [900], expected: "CM" },
    { args: [49], expected: "XLIX" },
    { args: [444], expected: "CDXLIV" },
    { args: [3888], expected: "MMMDCCCLXXXVIII" },
    { args: [2421], expected: "MMCDXXI" },
    { args: [1000], expected: "M" },
    { args: [621], expected: "DCXXI" },
    { args: [3749], expected: "MMMDCCXLIX" },
  ],
  source: { origin: "leetcode", frontendId: "12", acRate: 0.7097156159652552, confidence: 0.97 },
  solutions: [
    {
      name: "Greedy with value table",
      explanation: `List every Roman token — including the six subtractive pairs (\`CM\`, \`CD\`, \`XC\`, \`XL\`, \`IX\`, \`IV\`) — paired with its value, sorted descending. Walk the table once; for each token, append its symbol while it still fits in the remaining number, subtracting as you go.

Because the table already encodes the subtractive cases as single entries, no special handling is needed. The loop runs a fixed number of steps over a 13-entry table, so it is \`O(1)\` time and space for the bounded input range \`1..3999\`.`,
      code: {
        javascript: `function intToRoman(num) {
  const table = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  for (const [value, symbol] of table) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}`,
        typescript: `function intToRoman(num: number): string {
  const table: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  for (const [value, symbol] of table) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}`,
      },
    },
    {
      name: "Per-digit lookup",
      explanation: `Precompute the Roman string for each digit position. Index a separate array for thousands, hundreds, tens, and units by the corresponding decimal digit, then concatenate.

\`O(1)\` time and space — four array lookups regardless of input.`,
      code: {
        javascript: `function intToRoman(num) {
  const thousands = ["", "M", "MM", "MMM"];
  const hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
  const tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
  const units = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  return (
    thousands[Math.floor(num / 1000)] +
    hundreds[Math.floor(num / 100) % 10] +
    tens[Math.floor(num / 10) % 10] +
    units[num % 10]
  );
}`,
        typescript: `function intToRoman(num: number): string {
  const thousands = ["", "M", "MM", "MMM"];
  const hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
  const tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
  const units = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  return (
    thousands[Math.floor(num / 1000)] +
    hundreds[Math.floor(num / 100) % 10] +
    tens[Math.floor(num / 10) % 10] +
    units[num % 10]
  );
}`,
      },
    },
  ],
});
