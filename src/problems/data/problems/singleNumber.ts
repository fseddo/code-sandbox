import { defineAlgoProblem } from "../problem";

export const singleNumber = defineAlgoProblem<[number[]], number>({
  id: "single-number",
  number: 164,
  title: "Single Number",
  difficulty: "easy",
  tags: ["bit-manipulation", "array"],
  functionName: "singleNumber",
  prompt: `You're given a non-empty integer array \`nums\` where every element appears exactly **twice**, except for one element that appears exactly **once**. Find and return that single element.

Your solution should run in linear time and use only constant extra space (no hash map or counting structure).`,
  constraints: [
    "1 <= nums.length <= 3 * 10^4",
    "-3 * 10^4 <= nums[i] <= 3 * 10^4",
    "Every element appears exactly twice, except for one element which appears exactly once.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums: number[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "single value in the middle",
      args: [[2, 2, 1]],
      expected: 1,
    },
    {
      name: "single value at the start",
      args: [[4, 1, 2, 1, 2]],
      expected: 4,
      explanation: "1 and 2 each appear twice; 4 appears once.",
    },
    {
      name: "one-element array",
      args: [[1]],
      expected: 1,
    },
  ],
  hiddenTests: [
    { name: "single value at the end", args: [[5, 3, 5, 3, 9]], expected: 9 },
    { name: "single zero among pairs", args: [[7, 0, 7]], expected: 0 },
    { name: "zero is one of the duplicated pairs", args: [[0, 0, 8]], expected: 8 },
    { name: "negative single value", args: [[-3, 5, 5]], expected: -3 },
    { name: "negative pairs, positive single", args: [[-1, -1, 6, 2, 2]], expected: 6 },
    {
      name: "several duplicate pairs, single at start",
      args: [[10, 1, 2, 3, 1, 2, 3, 4, 4]],
      expected: 10,
    },
    {
      name: "several duplicate pairs, single in middle",
      args: [[1, 2, 3, 3, 99, 2, 1]],
      expected: 99,
    },
    { name: "min boundary value", args: [[-30000, 12, 12]], expected: -30000 },
    { name: "max boundary value", args: [[30000, -30000, -30000]], expected: 30000 },
    {
      name: "anti-hardcode: unordered mid-size input",
      args: [[17, -4, 23, -4, 8, 17, 8, 8, 8]],
      expected: 23,
    },
    {
      name: "scale: near-max array length",
      args: (() => {
        const nums: number[] = [];
        for (let i = 1; i <= 15000; i++) {
          nums.push(i, i);
        }
        nums.splice(9999, 0, 12345);
        return [nums];
      })(),
      expected: 12345,
    },
    {
      name: "scale: max array length, single value at the very end",
      args: (() => {
        const nums: number[] = [];
        for (let i = -15000; i < 0; i++) {
          nums.push(i, i);
        }
        for (let i = 1; i <= 14999; i++) {
          nums.push(i, i);
        }
        nums.push(-7777);
        return [nums];
      })(),
      expected: -7777,
    },
  ],
  source: { origin: "authored", confidence: 0.95 },
  solutions: [
    {
      name: "XOR fold",
      explanation: `XOR is commutative, associative, self-cancelling (\`x ^ x = 0\`), and identity-preserving (\`x ^ 0 = x\`). Folding every element through XOR in one pass, order doesn't matter and every duplicated pair cancels itself out (\`x ^ x = 0\`), leaving only the value that appeared once. JavaScript's \`^\` operator coerces both operands to signed 32-bit integers, which the constraint range (\`|nums[i]| <= 3 * 10^4\`) comfortably fits inside, so negative values fold correctly too.

\`O(n)\` time, \`O(1)\` extra space — no hash map or counting structure needed.`,
      code: {
        javascript: `function singleNumber(nums) {
  // Fold every value through XOR; equal values cancel out (x ^ x = 0).
  let result = 0;
  for (const num of nums) {
    result ^= num; // order doesn't matter — a value's pair cancels it whenever it's seen
  }
  // Whatever's left never got cancelled — that's the value that appeared once.
  return result;
}`,
        typescript: `function singleNumber(nums: number[]): number {
  // Fold every value through XOR; equal values cancel out (x ^ x = 0).
  let result = 0;
  for (const num of nums) {
    result ^= num; // order doesn't matter — a value's pair cancels it whenever it's seen
  }
  // Whatever's left never got cancelled — that's the value that appeared once.
  return result;
}`,
      },
    },
  ],
});
