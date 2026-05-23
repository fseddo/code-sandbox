import { defineAlgoProblem } from "../problem";

export const decodeWays = defineAlgoProblem<[string], number>({
  id: "decode-ways",
  number: 97,
  title: "Decode Ways",
  difficulty: "medium",
  tags: ["string", "dynamic-programming"],
  functionName: "numDecodings",
  prompt: `A message of digits is encoded with the mapping \`'A' -> "1"\`, \`'B' -> "2"\`, …, \`'Z' -> "26"\`. To decode it you reverse the mapping: every contiguous group of digits that names a letter (\`"1"\` through \`"26"\`) is one possible letter.

Given a non-empty string \`s\` of digits, return the **number of ways** it can be decoded. For example, \`"12"\` can be read as \`"AB"\` (1 then 2) or \`"L"\` (12), so it decodes 2 ways.

A leading zero is never valid (no letter maps to \`"0"\` or to a two-digit group like \`"06"\`), so a string that contains an undecodable position decodes 0 ways.`,
  constraints: [
    "1 <= s.length <= 100",
    "s contains only digits and may contain leading zeros.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @return {number}
 */
function numDecodings(s) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @return {number}
 */
function numDecodings(s: string): number {
  // your code here
}`,
  },
  examples: [
    { name: "two ways", args: ["12"], expected: 2, explanation: `"AB" (1, 2) or "L" (12).` },
    { name: "three ways", args: ["226"], expected: 3, explanation: `"BZ" (2 26), "VF" (22 6), "BBF" (2 2 6).` },
    { name: "leading zero", args: ["06"], expected: 0, explanation: `"06" can't be grouped: 0 alone is invalid and "06" isn't in 1..26.` },
  ],
  hiddenTests: [
    { args: ["1"], expected: 1 },
    { args: ["0"], expected: 0 },
    { args: ["10"], expected: 1 },
    { args: ["27"], expected: 1 },
    { args: ["100"], expected: 0 },
    { args: ["101"], expected: 1 },
    { args: ["230"], expected: 0 },
    { args: ["2101"], expected: 1 },
    { args: ["11106"], expected: 2 },
    { args: ["111111"], expected: 13 },
    { args: ["1212"], expected: 5 },
    { args: ["301"], expected: 0 },
    { args: ["123123"], expected: 9 },
    // Scale: 45 ones — the count is Fibonacci-like and grows large (still an exact JS integer).
    { args: ["1".repeat(45)], expected: 1836311903 },
  ],
  source: { origin: "leetcode", frontendId: "91", acRate: 0.37987800219180956, confidence: 0.92 },
  solutions: [
    {
      name: "Bottom-up DP over positions",
      explanation: `Let \`dp[i]\` be the number of ways to decode the prefix of length \`i\`. \`dp[0] = 1\` (empty string, one way). For each position, a single digit \`s[i-1]\` adds \`dp[i-1]\` ways when it is \`'1'..'9'\`, and a two-digit group \`s[i-2..i-1]\` adds \`dp[i-2]\` ways when it falls in \`10..26\`. Track only the last two values for \`O(1)\` space.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function numDecodings(s) {
  if (s[0] === "0") return 0;
  let prev2 = 1;
  let prev1 = 1;
  for (let i = 1; i < s.length; i++) {
    let curr = 0;
    if (s[i] !== "0") curr += prev1;
    const two = Number(s[i - 1] + s[i]);
    if (two >= 10 && two <= 26) curr += prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
        typescript: `function numDecodings(s: string): number {
  if (s[0] === "0") return 0;
  let prev2 = 1;
  let prev1 = 1;
  for (let i = 1; i < s.length; i++) {
    let curr = 0;
    if (s[i] !== "0") curr += prev1;
    const two = Number(s[i - 1] + s[i]);
    if (two >= 10 && two <= 26) curr += prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
      },
    },
  ],
});
