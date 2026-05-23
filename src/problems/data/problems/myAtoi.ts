import { defineAlgoProblem } from "../problem";

const INT_MIN = -(2 ** 31);
const INT_MAX = 2 ** 31 - 1;

export const myAtoi = defineAlgoProblem<[string], number>({
  id: "string-to-integer-atoi",
  title: "String to Integer (atoi)",
  difficulty: "medium",
  tags: ["string"],
  functionName: "myAtoi",
  prompt: `Implement \`myAtoi(s)\`, which converts a string to a 32-bit signed integer.

Process the string in this order:

1. **Skip leading whitespace.** Ignore any spaces at the start.
2. **Read an optional sign.** A single \`'+'\` or \`'-'\` may follow the whitespace; it sets the result's sign. If absent, the result is positive.
3. **Read digits.** Take consecutive digits (\`0\`–\`9\`) until a non-digit is reached or the string ends. The remainder of the string is ignored.
4. **Clamp.** If no digits were read, the answer is \`0\`. Otherwise interpret the digits as a base-10 integer and clamp it to the signed 32-bit range \`[-2^31, 2^31 - 1]\` = \`[-2147483648, 2147483647]\`.

Return the resulting integer.`,
  constraints: [
    "0 <= s.length <= 200",
    "s consists of English letters (lower-case and upper-case), digits (0-9), ' ', '+', '-', and '.'.",
  ],
  starterCode: {
    javascript: `function myAtoi(s) {
  // your code here
}`,
    typescript: `function myAtoi(s: string): number {
  // your code here
}`,
  },
  examples: [
    { name: "plain number", args: ["42"], expected: 42 },
    {
      name: "leading spaces and sign",
      args: ["   -42"],
      expected: -42,
      explanation: "Leading spaces are skipped, then '-' sets a negative sign, then 42 is read.",
    },
    {
      name: "trailing words ignored",
      args: ["4193 with words"],
      expected: 4193,
      explanation: "Digits are read until the space; everything from ' with words' is ignored.",
    },
    {
      name: "non-digit start",
      args: ["words and 987"],
      expected: 0,
      explanation: "The first non-space character is a letter, so no digits are read and the result is 0.",
    },
  ],
  hiddenTests: [
    { args: [""], expected: 0 },
    { args: ["   "], expected: 0 },
    { args: ["7"], expected: 7 },
    { args: ["+"], expected: 0 },
    { args: ["-"], expected: 0 },
    { args: ["+1"], expected: 1 },
    { args: ["000123"], expected: 123 },
    { args: ["  +0 123"], expected: 0 },
    { args: ["-000000000000001"], expected: -1 },
    { args: ["3.14159"], expected: 3 },
    { args: ["12a34"], expected: 12 },
    { args: ["+-12"], expected: 0 },
    { args: ["  -0012a42"], expected: -12 },
    { args: ["  0000000000012345678"], expected: 12345678 },
    { args: ["-91283472332"], expected: INT_MIN },
    { args: ["2147483647"], expected: INT_MAX },
    { args: ["2147483648"], expected: INT_MAX },
    { args: ["-2147483648"], expected: INT_MIN },
    { args: ["-2147483649"], expected: INT_MIN },
    { args: ["9999999999999999999999"], expected: INT_MAX },
    { args: ["  " + "9".repeat(190)], expected: INT_MAX },
  ],
  source: { origin: "leetcode", frontendId: "8", acRate: 0.21004492567217853, confidence: 0.92 },
  solutions: [
    {
      name: "Linear scan with overflow clamp",
      explanation: `Walk the string once with an index pointer:

1. Skip leading spaces.
2. Read an optional \`+\`/\`-\` to fix the sign.
3. Accumulate digits into a running total, applying the sign as you go so the value can be compared against \`INT_MIN\`/\`INT_MAX\` directly. Clamp and short-circuit the moment the running value crosses a 32-bit boundary, which also avoids relying on \`Number\` precision for very long digit runs.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function myAtoi(s) {
  const INT_MIN = -(2 ** 31);
  const INT_MAX = 2 ** 31 - 1;
  let i = 0;
  while (i < s.length && s[i] === " ") i++;
  let sign = 1;
  if (s[i] === "+" || s[i] === "-") {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let result = 0;
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    result = result * 10 + (s.charCodeAt(i) - 48);
    if (sign === 1 && result > INT_MAX) return INT_MAX;
    if (sign === -1 && -result < INT_MIN) return INT_MIN;
    i++;
  }
  return sign * result;
}`,
        typescript: `function myAtoi(s: string): number {
  const INT_MIN = -(2 ** 31);
  const INT_MAX = 2 ** 31 - 1;
  let i = 0;
  while (i < s.length && s[i] === " ") i++;
  let sign = 1;
  if (s[i] === "+" || s[i] === "-") {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let result = 0;
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    result = result * 10 + (s.charCodeAt(i) - 48);
    if (sign === 1 && result > INT_MAX) return INT_MAX;
    if (sign === -1 && -result < INT_MIN) return INT_MIN;
    i++;
  }
  return sign * result;
}`,
      },
    },
  ],
});
