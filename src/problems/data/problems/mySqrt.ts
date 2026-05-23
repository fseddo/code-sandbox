import { defineAlgoProblem } from "../problem";

export const mySqrt = defineAlgoProblem<[number], number>({
  id: "sqrtx",
  number: 76,
  title: "Sqrt(x)",
  difficulty: "easy",
  tags: ["math", "binary-search"],
  functionName: "mySqrt",
  prompt: `Given a non-negative integer \`x\`, return the integer square root of \`x\` — that is, \`floor(sqrt(x))\`, the largest integer whose square does not exceed \`x\`.

You must compute it without using any built-in square-root function. For example, \`mySqrt(8)\` is \`2\` because \`2² = 4 ≤ 8\` but \`3² = 9 > 8\`.`,
  constraints: ["0 <= x <= 2^31 - 1"],
  starterCode: {
    javascript: `/**
 * @param {number} x
 * @return {number}
 */
function mySqrt(x) {
  // your code here
}`,
    typescript: `/**
 * @param {number} x
 * @return {number}
 */
function mySqrt(x: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "perfect square", args: [4], expected: 2 },
    { name: "non-perfect", args: [8], expected: 2, explanation: "sqrt(8) ≈ 2.83, floored to 2." },
    { name: "zero", args: [0], expected: 0 },
  ],
  hiddenTests: [
    { args: [1], expected: 1 },
    { args: [2], expected: 1 },
    { args: [3], expected: 1 },
    { args: [9], expected: 3 },
    { args: [15], expected: 3 },
    { args: [16], expected: 4 },
    { args: [99], expected: 9 },
    { args: [100], expected: 10 },
    { args: [101], expected: 10 },
    { args: [2147395600], expected: 46340 },
    { args: [2147395599], expected: 46339 },
    { args: [2147483647], expected: 46340 },
    { args: [1000000], expected: 1000 },
    { args: [999999], expected: 999 },
  ],
  source: { origin: "leetcode", frontendId: "69", acRate: 0.41811267106512245, confidence: 0.97 },
  solutions: [
    {
      name: "Binary search",
      explanation: `Search the range \`[1, x]\` for the largest \`mid\` with \`mid * mid <= x\`. When \`mid * mid <= x\`, that \`mid\` is a candidate answer and we move the lower bound up; otherwise we move the upper bound down. The last candidate that passed is the floor of the square root.

Using \`mid * mid <= x\` with numbers up to \`2^31 - 1\` is safe: the largest product checked stays well under \`2^53\`, so no precision is lost.

\`O(log x)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function mySqrt(x) {
  if (x < 2) return x;
  let lo = 1;
  let hi = x;
  let ans = 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (mid * mid <= x) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}`,
        typescript: `function mySqrt(x: number): number {
  if (x < 2) return x;
  let lo = 1;
  let hi = x;
  let ans = 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (mid * mid <= x) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}`,
      },
    },
  ],
});
