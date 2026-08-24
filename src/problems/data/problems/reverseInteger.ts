import { defineAlgoProblem } from "../problem";

export const reverseInteger = defineAlgoProblem<[number], number>({
  id: "reverse-integer",
  number: 7,
  title: "Reverse Integer",
  difficulty: "medium",
  tags: ["math"],
  functionName: "reverse",
  prompt: `Given a signed 32-bit integer \`x\`, return \`x\` with its digits reversed. The sign is preserved, so reversing a negative number stays negative.

If reversing \`x\` produces a value that falls outside the signed 32-bit range \`[-2^31, 2^31 - 1]\`, return \`0\` instead. Solve it without relying on 64-bit integer support.`,
  constraints: ["-2^31 <= x <= 2^31 - 1"],
  starterCode: {
    javascript: `/**
 * @param {number} x
 * @return {number}
 */
function reverse(x) {
  // your code here
}`,
    typescript: `/**
 * @param {number} x
 * @return {number}
 */
function reverse(x: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "positive", args: [123], expected: 321, explanation: "Reversing the digits of 123 gives 321." },
    { name: "negative", args: [-123], expected: -321, explanation: "The sign is kept, so -123 reverses to -321." },
    { name: "trailing zero", args: [120], expected: 21, explanation: "Reversing 120 gives 021, and leading zeros are dropped to 21." },
    { name: "overflow", args: [1534236469], expected: 0, explanation: "Reversed this is 9646324351, which exceeds 2^31 - 1, so the result is 0." },
  ],
  hiddenTests: [
    { args: [0], expected: 0 },
    { args: [7], expected: 7 },
    { args: [-8], expected: -8 },
    { args: [10], expected: 1 },
    { args: [-100], expected: -1 },
    { args: [1000000003], expected: 0 },
    { args: [2147483647], expected: 0 },
    { args: [-2147483648], expected: 0 },
    { args: [1463847412], expected: 2147483641 },
    { args: [-1563847412], expected: 0 },
    { args: [-2143847412], expected: -2147483412 },
    { args: [900000], expected: 9 },
    { args: [-90], expected: -9 },
    { args: [1010], expected: 101 },
  ],
  source: { origin: "leetcode", frontendId: "7", acRate: 0.318957776534943, confidence: 0.92 },
  solutions: [
    {
      name: "Digit-by-digit with overflow guard",
      explanation: `Pop the last digit off \`x\` with \`% 10\` and push it onto the accumulator with \`result * 10 + digit\`, repeating until \`x\` is exhausted. JavaScript's \`%\` keeps the sign of the dividend, so a negative input reverses straight into a negative result without special-casing the sign.

After each push, check whether \`result\` has left the signed 32-bit range; if so the true reversed value can't fit, so return \`0\`. The guard runs before any further digits are appended, so it catches the overflow at the step it happens.

\`O(d)\` time where \`d\` is the digit count (at most 10), \`O(1)\` space.`,
      code: {
        javascript: `function reverse(x) {
  // Signed 32-bit bounds the rebuilt number must never cross.
  const MIN = -(2 ** 31);
  const MAX = 2 ** 31 - 1;
  let result = 0;
  while (x !== 0) {
    // Peel off the last digit; JS's % keeps the sign of x, so negatives reverse correctly for free.
    const digit = x % 10;
    // Drop that digit from x (exact division since digit was the remainder).
    x = (x - digit) / 10;
    // Push the digit onto the front of the rebuilt (reversed) number.
    result = result * 10 + digit;
    // Bail out the instant the running result leaves the 32-bit range.
    if (result < MIN || result > MAX) return 0;
  }
  return result;
}`,
        typescript: `function reverse(x: number): number {
  // Signed 32-bit bounds the rebuilt number must never cross.
  const MIN = -(2 ** 31);
  const MAX = 2 ** 31 - 1;
  let result = 0;
  while (x !== 0) {
    // Peel off the last digit; JS's % keeps the sign of x, so negatives reverse correctly for free.
    const digit = x % 10;
    // Drop that digit from x (exact division since digit was the remainder).
    x = (x - digit) / 10;
    // Push the digit onto the front of the rebuilt (reversed) number.
    result = result * 10 + digit;
    // Bail out the instant the running result leaves the 32-bit range.
    if (result < MIN || result > MAX) return 0;
  }
  return result;
}`,
      },
    },
  ],
});
