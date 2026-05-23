import { defineAlgoProblem } from "../problem";

// In-place problem returning a count `k`. The solution mutates `nums` and returns how many elements
// remain; only the first `k` elements matter and their order is unspecified, so the `checker` compares
// `args[0].slice(0, k)` to `expected` as a multiset (sort both). See problem-authoring.md (in-place).
export const removeElement = defineAlgoProblem<[number[], number], number[]>({
  id: "remove-element",
  number: 36,
  title: "Remove Element",
  difficulty: "easy",
  tags: ["array", "two-pointers"],
  functionName: "removeElement",
  prompt: `Given an integer array \`nums\` and an integer \`val\`, remove **every** occurrence of \`val\` from \`nums\` **in place**. Return the count \`k\` of elements that are not equal to \`val\`.

After your function runs, the first \`k\` elements of \`nums\` must hold the kept values (those not equal to \`val\`) — in **any order**. Whatever is left beyond the first \`k\` positions is ignored, so you don't need to clear or shrink the array.

Use \`O(1)\` extra space: mutate the array directly rather than allocating a new one.`,
  constraints: [
    "0 <= nums.length <= 100",
    "0 <= nums[i] <= 50",
    "0 <= val <= 100",
  ],
  checker: `(actual, args, expected) => {
    const got = args[0].slice(0, actual);
    if (got.length !== expected.length) return false;
    const a = [...got].sort((x, y) => x - y);
    const b = [...expected].sort((x, y) => x - y);
    return a.every((v, i) => v === b[i]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
function removeElement(nums, val) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
function removeElement(nums: number[], val: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "removes two",
      args: [[3, 2, 2, 3], 3],
      expected: [2, 2],
      explanation: "Both 3s are removed; the first 2 elements hold the two surviving 2s (order is irrelevant).",
    },
    {
      name: "scattered occurrences",
      args: [[0, 1, 2, 2, 3, 0, 4, 2], 2],
      expected: [0, 1, 3, 0, 4],
      explanation: "The three 2s are dropped, leaving 5 elements: 0, 1, 3, 0, 4 in some order.",
    },
    {
      name: "value absent",
      args: [[1, 2, 3], 9],
      expected: [1, 2, 3],
      explanation: "Nothing equals 9, so all three elements remain.",
    },
  ],
  hiddenTests: [
    { args: [[], 0], expected: [] },
    { args: [[5], 5], expected: [] },
    { args: [[5], 1], expected: [5] },
    { args: [[7, 7, 7], 7], expected: [] },
    { args: [[7, 7, 7], 3], expected: [7, 7, 7] },
    { args: [[1, 1, 2, 2, 1, 1], 1], expected: [2, 2] },
    { args: [[4, 5, 4, 5, 4], 4], expected: [5, 5] },
    { args: [[0, 0, 0, 1], 0], expected: [1] },
    { args: [[1, 0, 0, 0], 0], expected: [1] },
    { args: [[2, 3, 3, 2], 2], expected: [3, 3] },
    { args: [[8, 1, 8, 2, 8, 3], 8], expected: [1, 2, 3] },
    // Scale: 100 values (max length), every other one equals val; a linear scan is instant.
    {
      args: [Array.from({ length: 100 }, (_, i) => (i % 2 === 0 ? 9 : i % 50)), 9],
      expected: Array.from({ length: 100 }, (_, i) => (i % 2 === 0 ? 9 : i % 50)).filter((v) => v !== 9),
    },
  ],
  source: { origin: "leetcode", frontendId: "27", acRate: 0.6179385600106796, confidence: 0.9 },
  solutions: [
    {
      name: "Overwrite pointer",
      explanation: `Keep a write pointer \`k\` starting at 0. Scan every element; whenever it is **not** equal to \`val\`, copy it to \`nums[k]\` and advance \`k\`. Elements equal to \`val\` are skipped, so they get overwritten by later survivors. At the end \`k\` is the count of kept elements, and \`nums[0..k)\` holds them.

\`O(n)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function removeElement(nums, val) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}`,
        typescript: `function removeElement(nums: number[], val: number): number {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}`,
      },
    },
  ],
});
