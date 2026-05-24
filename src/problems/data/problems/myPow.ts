import { defineAlgoProblem } from "../problem";

// Floating-point result: deep-equal would fail on rounding noise, so the `checker` accepts any
// answer within 1e-6 of the expected value.
export const myPow = defineAlgoProblem<[number, number], number>({
  id: "powx-n",
  number: 58,
  title: "Pow(x, n)",
  difficulty: "medium",
  tags: ["math", "recursion"],
  functionName: "myPow",
  prompt: `Implement \`pow(x, n)\`, which raises \`x\` (a floating-point number) to the integer power \`n\` — that is, compute \`x^n\`.

\`n\` may be negative, in which case \`x^n = 1 / x^(-n)\`. Any answer within \`1e-6\` of the true value is accepted, so small floating-point error is fine.`,
  constraints: [
    "-100.0 < x < 100.0",
    "-2^31 <= n <= 2^31 - 1",
    "Either x is not zero, or n > 0.",
    "-10^4 <= x^n <= 10^4",
  ],
  checker: `(actual, args, expected) => {
    if (typeof actual !== "number" || Number.isNaN(actual)) return false;
    return Math.abs(actual - expected) < 1e-6;
  }`,
  starterCode: {
    javascript: `/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
function myPow(x, n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
function myPow(x: number, n: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "positive power", args: [2, 10], expected: 1024, explanation: "2^10 = 1024." },
    { name: "fractional base", args: [2.1, 3], expected: 9.261, explanation: "2.1^3 = 9.261." },
    { name: "negative power", args: [2, -2], expected: 0.25, explanation: "2^-2 = 1 / 2^2 = 0.25." },
  ],
  hiddenTests: [
    { args: [1, 2147483647], expected: 1 },
    { args: [-1, 2147483647], expected: -1 },
    { args: [-1, -2147483648], expected: 1 },
    { args: [2, 0], expected: 1 },
    { args: [0, 5], expected: 0 },
    { args: [5, 1], expected: 5 },
    { args: [2, -3], expected: 0.125 },
    { args: [3, 4], expected: 81 },
    { args: [0.5, 4], expected: 0.0625 },
    { args: [-2, 3], expected: -8 },
    { args: [-2, 4], expected: 16 },
    { args: [1.5, -2], expected: 0.4444444444444444 },
    { args: [2, 30], expected: 1073741824 },
    { args: [10, -4], expected: 0.0001 },
    // Scale: huge exponents — fast exponentiation is O(log n); naive looping would time out.
    { args: [1.00000001, 100000000], expected: 2.7182817863957975 },
    { args: [0.99999999, 100000000], expected: 0.36787943798355055 },
  ],
  source: { origin: "leetcode", frontendId: "50", acRate: 0.38659775897734844, confidence: 0.9 },
  solutions: [
    {
      name: "Fast exponentiation (iterative)",
      explanation: `Exponentiation by squaring: write \`n\` in binary and accumulate \`x^(2^k)\` for each set bit. Square the base each step and multiply it into the result whenever the current bit of \`n\` is 1. Handle a negative exponent by inverting the base and using \`-n\` (carefully, since \`-(-2^31)\` overflows 32-bit but is fine as a JS double).

\`O(log n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function myPow(x, n) {
  let exp = n;
  if (exp < 0) {
    x = 1 / x;
    exp = -exp;
  }
  let result = 1;
  let base = x;
  while (exp > 0) {
    if (exp % 2 === 1) result *= base;
    base *= base;
    exp = Math.floor(exp / 2);
  }
  return result;
}`,
        typescript: `function myPow(x: number, n: number): number {
  let exp = n;
  if (exp < 0) {
    x = 1 / x;
    exp = -exp;
  }
  let result = 1;
  let base = x;
  while (exp > 0) {
    if (exp % 2 === 1) result *= base;
    base *= base;
    exp = Math.floor(exp / 2);
  }
  return result;
}`,
      },
    },
  ],
});
