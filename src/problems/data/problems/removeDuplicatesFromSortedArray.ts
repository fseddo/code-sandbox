import { defineAlgoProblem } from "../problem";

// In-place problem: the solution mutates `nums` so its first `k` elements are the unique values in
// order, and returns `k`. The `checker` reads the post-call `args[0]`, slices off the first `actual`
// (= k) elements, and compares to the expected unique prefix. See problem-authoring.md (in-place policy).
export const removeDuplicatesFromSortedArray = defineAlgoProblem<[number[]], number[]>({
  id: "remove-duplicates-from-sorted-array",
  number: 35,
  title: "Remove Duplicates from Sorted Array",
  difficulty: "easy",
  tags: ["array", "two-pointers"],
  functionName: "removeDuplicates",
  prompt: `Given an integer array \`nums\` sorted in **non-decreasing** order, remove the duplicates **in place** so that each distinct value appears only once. The relative order of the kept elements must stay the same.

Because the array can't be resized in place, you don't delete anything — instead you compact the unique values into the **front** of \`nums\`. Let \`k\` be the number of distinct values. Your job:

- Place the first \`k\` distinct values, in order, in \`nums[0]\` through \`nums[k - 1]\`.
- **Return \`k\`.** Whatever ends up beyond index \`k - 1\` doesn't matter.

The judge checks the value you return and the first \`k\` elements of the mutated array; the tail is ignored. Aim for \`O(n)\` time and \`O(1)\` extra space.`,
  constraints: [
    "0 <= nums.length <= 3 * 10^4",
    "-100 <= nums[i] <= 100",
    "nums is sorted in non-decreasing order.",
  ],
  checker: `(actual, args, expected) => {
    const got = args[0].slice(0, actual);
    return got.length === expected.length && got.every((value, index) => value === expected[index]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number} the count k of distinct values, compacted into nums[0..k-1]
 */
function removeDuplicates(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number} the count k of distinct values, compacted into nums[0..k-1]
 */
function removeDuplicates(nums: number[]): number {
  // your code here
}`,
  },
  examples: [
    { name: "one duplicate", args: [[1, 1, 2]], expected: [1, 2], explanation: "Distinct values are 1 and 2, so k = 2 and nums starts with [1, 2]." },
    { name: "many duplicates", args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: [0, 1, 2, 3, 4], explanation: "Five distinct values, so k = 5." },
    { name: "no duplicates", args: [[-3, -1, 0, 5]], expected: [-3, -1, 0, 5] },
  ],
  hiddenTests: [
    { args: [[]], expected: [] },
    { args: [[7]], expected: [7] },
    { args: [[2, 2]], expected: [2] },
    { args: [[5, 5, 5, 5, 5]], expected: [5] },
    { args: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5] },
    { args: [[-100, -100, 100, 100]], expected: [-100, 100] },
    { args: [[-2, -1, -1, 0, 0, 0, 1]], expected: [-2, -1, 0, 1] },
    { args: [[0, 0, 0, 0, 1]], expected: [0, 1] },
    { args: [[0, 1, 1, 1, 1]], expected: [0, 1] },
    { args: [[-50, -50, -50, 3, 3, 77]], expected: [-50, 3, 77] },
    // Scale: 30000 elements where each value repeats 3 times; a correct O(n) two-pointer is instant.
    {
      args: [Array.from({ length: 30000 }, (_, i) => Math.floor(i / 3) - 100)],
      expected: Array.from({ length: 10000 }, (_, i) => i - 100),
    },
  ],
  source: { origin: "leetcode", frontendId: "26", acRate: 0.6281669407427868, confidence: 0.95 },
  solutions: [
    {
      name: "Two pointers",
      explanation: `Keep a write pointer \`k\` at the position for the next distinct value (it also equals the count so far). Scan with a read pointer \`i\`: whenever \`nums[i]\` differs from the last value written (\`nums[k - 1]\`), write it at \`nums[k]\` and advance \`k\`. The first element is always distinct, so seed \`k = 1\` when the array is non-empty. Return \`k\`.

\`O(n)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let k = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k - 1]) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}`,
        typescript: `function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let k = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k - 1]) {
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
