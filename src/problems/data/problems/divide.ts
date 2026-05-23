import { defineAlgoProblem } from "../problem";

export const divide = defineAlgoProblem<[number, number], number>({
  id: "divide-two-integers",
  number: 38,
  title: "Divide Two Integers",
  difficulty: "medium",
  tags: ["math", "bit-manipulation"],
  functionName: "divide",
  prompt: `Given two integers \`dividend\` and \`divisor\`, divide them **without** using multiplication, division, or the modulo operator, and return the quotient.

The division truncates toward zero — discard any fractional part (e.g. \`8 / 3 = 2\` and \`-8 / 3 = -2\`). Assume the result must fit in a signed 32-bit integer range \`[-2^31, 2^31 - 1]\`; if the true quotient exceeds \`2^31 - 1\`, return \`2^31 - 1\`, and if it is below \`-2^31\`, return \`-2^31\`.`,
  constraints: [
    "-2^31 <= dividend, divisor <= 2^31 - 1",
    "divisor != 0",
  ],
  starterCode: {
    javascript: `/**
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */
function divide(dividend, divisor) {
  // your code here
}`,
    typescript: `/**
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */
function divide(dividend: number, divisor: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "truncate down", args: [10, 3], expected: 3, explanation: "10 / 3 = 3.333…, truncated toward zero gives 3." },
    { name: "negative truncation", args: [7, -3], expected: -2, explanation: "7 / -3 = -2.333…, truncated toward zero gives -2." },
    { name: "overflow clamp", args: [-2147483648, -1], expected: 2147483647, explanation: "The true quotient 2^31 overflows, so it is clamped to 2^31 - 1." },
  ],
  hiddenTests: [
    { name: "exact", args: [12, 4], expected: 3 },
    { name: "divisor one", args: [123, 1], expected: 123 },
    { name: "divisor neg one", args: [123, -1], expected: -123 },
    { name: "both negative", args: [-15, -4], expected: 3 },
    { name: "dividend smaller", args: [3, 5], expected: 0 },
    { name: "negative dividend smaller", args: [-3, 5], expected: 0 },
    { name: "zero dividend", args: [0, 9], expected: 0 },
    { name: "equal", args: [-7, -7], expected: 1 },
    { name: "min by min", args: [-2147483648, -2147483648], expected: 1 },
    { name: "min by two", args: [-2147483648, 2], expected: -1073741824 },
    { name: "max by neg one", args: [2147483647, -1], expected: -2147483647 },
    { name: "large quotient", args: [2000000000, 3], expected: 666666666 },
    { name: "min by one", args: [-2147483648, 1], expected: -2147483648 },
  ],
  source: { origin: "leetcode", frontendId: "29", acRate: 0.1978164119029401, confidence: 0.9 },
  solutions: [
    {
      name: "Exponential subtraction (bit doubling)",
      explanation: `Work in the negative domain to dodge the asymmetric 32-bit range (only \`-2^31\` has no positive twin). Track the sign from the operands, convert both to negatives, then repeatedly subtract the largest doubling of the divisor that still fits, accumulating the matching power of two into the quotient. Doubling and the running powers replace multiplication; comparison replaces modulo. Finally apply the sign and clamp to the 32-bit range.

\`O(log² n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function divide(dividend, divisor) {
  const INT_MAX = 2147483647;
  const INT_MIN = -2147483648;
  if (dividend === INT_MIN && divisor === -1) return INT_MAX;

  const negative = (dividend < 0) !== (divisor < 0);
  let a = dividend > 0 ? -dividend : dividend;
  let b = divisor > 0 ? -divisor : divisor;

  let quotient = 0;
  while (a <= b) {
    let value = b;
    let powers = 1;
    while (value >= INT_MIN - value && a <= value + value) {
      value += value;
      powers += powers;
    }
    a -= value;
    quotient += powers;
  }

  const result = negative ? -quotient : quotient;
  if (result > INT_MAX) return INT_MAX;
  if (result < INT_MIN) return INT_MIN;
  return result;
}`,
        typescript: `function divide(dividend: number, divisor: number): number {
  const INT_MAX = 2147483647;
  const INT_MIN = -2147483648;
  if (dividend === INT_MIN && divisor === -1) return INT_MAX;

  const negative = (dividend < 0) !== (divisor < 0);
  let a = dividend > 0 ? -dividend : dividend;
  let b = divisor > 0 ? -divisor : divisor;

  let quotient = 0;
  while (a <= b) {
    let value = b;
    let powers = 1;
    while (value >= INT_MIN - value && a <= value + value) {
      value += value;
      powers += powers;
    }
    a -= value;
    quotient += powers;
  }

  const result = negative ? -quotient : quotient;
  if (result > INT_MAX) return INT_MAX;
  if (result < INT_MIN) return INT_MIN;
  return result;
}`,
      },
    },
  ],
});
