import { defineAlgoProblem } from "../problem";

export const productExceptSelf = defineAlgoProblem<[number[]], number[]>({
  id: "product-of-array-except-self",
  number: 128,
  title: "Product of Array Except Self",
  difficulty: "medium",
  tags: ["array", "prefix-sum"],
  functionName: "productExceptSelf",
  prompt: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is the product of every element of \`nums\` **except** \`nums[i]\`.

You must solve it **without using division** and in \`O(n)\` time. The product of any prefix or suffix of \`nums\` fits in a 32-bit integer.`,
  constraints: [
    "2 <= nums.length <= 10^5",
    "-30 <= nums[i] <= 30",
    "The product of any prefix or suffix fits in a 32-bit integer.",
    "Division is not allowed.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums: number[]): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "basic", args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], explanation: "answer[0] = 2·3·4 = 24, answer[1] = 1·3·4 = 12, and so on." },
    { name: "with a zero", args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], explanation: "Only the slot at the single zero gets a non-zero product." },
    { name: "two elements", args: [[2, 3]], expected: [3, 2] },
    { name: "negatives", args: [[-2, -3, 4]], expected: [-12, -8, 6] },
  ],
  hiddenTests: [
    { args: [[1, 1]], expected: [1, 1] },
    { args: [[0, 0]], expected: [0, 0] },
    { args: [[5, 0, 0]], expected: [0, 0, 0] },
    { args: [[2, 4, 6, 8]], expected: [192, 96, 64, 48] },
    { args: [[-1, -1, -1, -1]], expected: [-1, -1, -1, -1] },
    { args: [[1, 2, 0, 4]], expected: [0, 0, 8, 0] },
    { args: [[3, -2, 5, -1]], expected: [10, -15, 6, -30] },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8]], expected: [40320, 20160, 13440, 10080, 8064, 6720, 5760, 5040] },
    { args: [Array.from({ length: 300 }, () => 1)], expected: Array.from({ length: 300 }, () => 1) },
    { args: [Array.from({ length: 300 }, (_, k) => (k === 150 ? 0 : 1))], expected: Array.from({ length: 300 }, (_, k) => (k === 150 ? 1 : 0)) },
  ],
  source: { origin: "leetcode", frontendId: "238", acRate: 0.6699, confidence: 0.97 },
  solutions: [
    {
      name: "Prefix and suffix products",
      explanation: `The product of everything except \`nums[i]\` is (the product of everything to its **left**) × (the product of everything to its **right**). Those are a prefix product and a suffix product — both classic running accumulations.

Do two sweeps over a single output array. First sweep left to right, writing into \`answer[i]\` the product of all elements *before* \`i\` (a running prefix product). Then sweep right to left, multiplying each \`answer[i]\` by a running suffix product of all elements *after* \`i\`. No division, \`O(n)\` time, and only the output array as extra space.`,
      code: {
        javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n);
  // Left-to-right: answer[i] = product of everything strictly before i.
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i];
  }
  // Right-to-left: fold in the product of everything strictly after i.
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }
  return answer;
}`,
        typescript: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n);
  // Left-to-right: answer[i] = product of everything strictly before i.
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i];
  }
  // Right-to-left: fold in the product of everything strictly after i.
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }
  return answer;
}`,
      },
    },
  ],
});
