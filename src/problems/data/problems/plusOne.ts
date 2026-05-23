import { defineAlgoProblem } from "../problem";

export const plusOne = defineAlgoProblem<[number[]], number[]>({
  id: "plus-one",
  number: 73,
  title: "Plus One",
  difficulty: "easy",
  tags: ["array", "math"],
  functionName: "plusOne",
  prompt: `You are given a large non-negative integer as an array \`digits\`, where \`digits[0]\` is the most significant digit and each element is a single digit \`0–9\`. The number has no leading zeros, except the number \`0\` itself.

Add one to the integer and return the resulting digit array. A carry out of the most significant digit grows the array by one element — \`[9, 9]\` becomes \`[1, 0, 0]\`.`,
  constraints: [
    "1 <= digits.length <= 100",
    "0 <= digits[i] <= 9",
    "digits has no leading zeros except for the number 0 itself.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} digits
 * @return {number[]}
 */
function plusOne(digits) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} digits
 * @return {number[]}
 */
function plusOne(digits: number[]): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "no carry", args: [[1, 2, 3]], expected: [1, 2, 4], explanation: "123 + 1 = 124." },
    { name: "carry chain", args: [[9, 9]], expected: [1, 0, 0], explanation: "99 + 1 = 100 grows the array." },
    { name: "zero", args: [[0]], expected: [1] },
  ],
  hiddenTests: [
    { args: [[9]], expected: [1, 0] },
    { args: [[1]], expected: [2] },
    { args: [[8]], expected: [9] },
    { args: [[1, 9]], expected: [2, 0] },
    { args: [[4, 3, 2, 1]], expected: [4, 3, 2, 2] },
    { args: [[9, 9, 9]], expected: [1, 0, 0, 0] },
    { args: [[2, 9, 9]], expected: [3, 0, 0] },
    { args: [[1, 0, 0]], expected: [1, 0, 1] },
    { args: [[8, 9, 9, 9]], expected: [9, 0, 0, 0] },
    { args: [[5, 4, 9]], expected: [5, 5, 0] },
    // Scale: 100-digit all-nines, the maximal carry chain.
    { args: [new Array(100).fill(9)], expected: [1, ...new Array(100).fill(0)] },
    { args: [[1, ...new Array(99).fill(0)]], expected: [1, ...new Array(98).fill(0), 1] },
  ],
  source: { origin: "leetcode", frontendId: "66", acRate: 0.4995973371379547, confidence: 0.97 },
  solutions: [
    {
      name: "Right-to-left carry",
      explanation: `Walk from the least significant digit. If it's less than 9, increment it and return immediately — no carry propagates. Otherwise it becomes 0 and the carry moves left. If every digit was 9, the loop ends without returning, so prepend a \`1\` to the all-zeros array.

\`O(n)\` time, \`O(1)\` extra space (ignoring the output).`,
      code: {
        javascript: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  return [1, ...digits];
}`,
        typescript: `function plusOne(digits: number[]): number[] {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  return [1, ...digits];
}`,
      },
    },
  ],
});
