import { defineAlgoProblem } from "../problem";

const SCALE_INPUT = "abcdefghijklmnopqrstuvwxyz".repeat(8);
const SCALE_OUTPUT =
  "amykwiugseqcoamykwblnxzjlvxhjtvfhrtdfprbdnpzblnxzjlvxckowaimuygksweiqucgosaemqyckowaimuydjpvbhntzflrxdjpvbhntzflrxdjpvbhntzeiqucgosaemqyckowaimuygksweiqucgosfhrtdfprbdnpzblnxzjlvxhjtvfhrtdfprgseqcoamykwiugseq";

export const zigzagConversion = defineAlgoProblem<[string, number], string>({
  id: "zigzag-conversion",
  number: 6,
  title: "Zigzag Conversion",
  difficulty: "medium",
  tags: ["string"],
  functionName: "convert",
  prompt: `A string \`s\` is written in a zigzag pattern across \`numRows\` rows, then read back row by row.

Writing means filling characters top-to-bottom down the rows, then diagonally back up to the first row, repeating until \`s\` is exhausted. For example, \`"PAYPALISHIRING"\` with \`numRows = 3\` lays out as:

\`\`\`
P   A   H   N
A P L S I I G
Y   I   R
\`\`\`

Reading the rows left-to-right and top-to-bottom gives \`"PAHNAPLSIIGYIR"\`.

Return the string read off the zigzag. When \`numRows\` is \`1\` there is no zigzag, so the answer is just \`s\` unchanged.`,
  constraints: [
    "1 <= s.length <= 1000",
    "s consists of English letters (lower- and upper-case), ',' and '.'.",
    "1 <= numRows <= 1000",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
function convert(s, numRows) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
function convert(s: string, numRows: number): string {
  // your code here
}`,
  },
  examples: [
    {
      name: "three rows",
      args: ["PAYPALISHIRING", 3],
      expected: "PAHNAPLSIIGYIR",
      explanation: "Rows are P A H N / A P L S I I G / Y I R, read top-to-bottom.",
    },
    {
      name: "four rows",
      args: ["PAYPALISHIRING", 4],
      expected: "PINALSIGYAHRPI",
      explanation: "Four rows deepen the zigzag, so the diagonal carries more characters between the top and bottom rows.",
    },
    {
      name: "single row",
      args: ["A", 1],
      expected: "A",
      explanation: "With one row there is no zigzag, so the output equals the input.",
    },
  ],
  hiddenTests: [
    { args: ["a", 1], expected: "a" },
    { args: ["a", 2], expected: "a" },
    { args: ["ABCDE", 100], expected: "ABCDE" },
    { args: ["AB", 5], expected: "AB" },
    { args: ["xy", 1], expected: "xy" },
    { args: ["ABABABABAB", 2], expected: "AAAAABBBBB" },
    { args: ["ABC", 2], expected: "ACB" },
    { args: ["ABCD", 2], expected: "ACBD" },
    { args: ["ABCDE", 4], expected: "ABCED" },
    { args: ["ABCDEFGHIJKLMNOP", 5], expected: "AIBHJPCGKODFLNEM" },
    { args: ["abcdefg", 4], expected: "agbfced" },
    { args: ["zzzzzz", 6], expected: "zzzzzz" },
    { args: ["HELLOWORLD", 3], expected: "HOLELWRDLO" },
    { args: ["leetcodeisstring", 5], expected: "lieesgedsntoticr" },
    { args: ["12345678901234567890", 4], expected: "17392682480359157406" },
    { args: [SCALE_INPUT, 7], expected: SCALE_OUTPUT },
  ],
  source: {
    origin: "leetcode",
    frontendId: "6",
    acRate: 0.5414707786259542,
    confidence: 0.95,
  },
  solutions: [
    {
      name: "Row buckets with bouncing direction",
      explanation: `Keep one string buffer per row. Walk \`s\` once, appending each character to the current row, and flip the vertical direction whenever you hit the top or bottom row — that bounce is exactly the zigzag. Concatenating the row buffers reads the answer off.

The \`numRows === 1\` case never bounces (top and bottom are the same row), which would loop in place; short-circuit it by returning \`s\`. Returning \`s\` when \`numRows >= s.length\` is an optional fast path — no character ever leaves its starting row.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function convert(s, numRows) {
  if (numRows === 1 || numRows >= s.length) return s;
  const rows = Array.from({ length: numRows }, () => "");
  let row = 0;
  let dir = -1;
  for (const ch of s) {
    rows[row] += ch;
    if (row === 0 || row === numRows - 1) dir = -dir;
    row += dir;
  }
  return rows.join("");
}`,
        typescript: `function convert(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;
  const rows: string[] = Array.from({ length: numRows }, () => "");
  let row = 0;
  let dir = -1;
  for (const ch of s) {
    rows[row] += ch;
    if (row === 0 || row === numRows - 1) dir = -dir;
    row += dir;
  }
  return rows.join("");
}`,
      },
    },
  ],
});
