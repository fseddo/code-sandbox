import { defineAlgoProblem } from "../problem";

// In-place: the solution rearranges `nums` and returns the same array. The checker asserts the
// returned value is the same instance as the input and equals the expected permutation.
export const nextPermutation = defineAlgoProblem<[number[]], number[]>({
  id: "next-permutation",
  number: 40,
  title: "Next Permutation",
  difficulty: "medium",
  tags: ["array", "two-pointers"],
  functionName: "nextPermutation",
  prompt: `A *permutation* of an array is one arrangement of its members. The *next permutation* is the next lexicographically greater arrangement of those same numbers. If no greater arrangement exists (the array is in descending order), the next permutation is the smallest one — the array sorted ascending.

Rearrange \`nums\` **in place** into its next permutation, using only constant extra memory. Mutate the input array directly and return that same array.`,
  constraints: [
    "1 <= nums.length <= 100",
    "0 <= nums[i] <= 100",
  ],
  checker: `(actual, args, expected) => {
    const result = args[0];
    if (actual !== result) return false;
    if (result.length !== expected.length) return false;
    return result.every((value, index) => value === expected[index]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[]} the same array, rearranged in place
 */
function nextPermutation(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[]} the same array, rearranged in place
 */
function nextPermutation(nums: number[]): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "basic", args: [[1, 2, 3]], expected: [1, 3, 2], explanation: "The next arrangement after 123 is 132." },
    { name: "wrap to smallest", args: [[3, 2, 1]], expected: [1, 2, 3], explanation: "321 is the largest arrangement, so it wraps to the smallest, 123." },
    { name: "trailing run", args: [[1, 1, 5]], expected: [1, 5, 1] },
  ],
  hiddenTests: [
    { name: "single element", args: [[1]], expected: [1] },
    { name: "two ascending", args: [[1, 2]], expected: [2, 1] },
    { name: "two descending", args: [[2, 1]], expected: [1, 2] },
    { name: "all same", args: [[2, 2, 2]], expected: [2, 2, 2] },
    { name: "pivot mid", args: [[1, 3, 2]], expected: [2, 1, 3] },
    { name: "longer descending tail", args: [[1, 5, 4, 3, 2]], expected: [2, 1, 3, 4, 5] },
    { name: "duplicates with swap", args: [[2, 3, 1, 3, 3]], expected: [2, 3, 3, 1, 3] },
    { name: "zeros", args: [[0, 0, 1]], expected: [0, 1, 0] },
    { name: "last is largest", args: [[5, 4, 7, 5, 3, 2]], expected: [5, 5, 2, 3, 4, 7] },
    { name: "two-element wrap", args: [[9, 8]], expected: [8, 9] },
    { name: "swap then reverse tail", args: [[1, 2, 3, 6, 5, 4]], expected: [1, 2, 4, 3, 5, 6] },
    {
      name: "scale: ascending wraps by last two",
      args: [Array.from({ length: 100 }, (_, i) => i)],
      expected: (() => {
        const a = Array.from({ length: 100 }, (_, i) => i);
        [a[98], a[99]] = [a[99], a[98]];
        return a;
      })(),
    },
    {
      name: "scale: descending wraps to ascending",
      args: [Array.from({ length: 100 }, (_, i) => 99 - i)],
      expected: Array.from({ length: 100 }, (_, i) => i),
    },
  ],
  source: { origin: "leetcode", frontendId: "31", acRate: 0.45247332282263797, confidence: 0.92 },
  solutions: [
    {
      name: "Pivot, successor swap, reverse tail",
      explanation: `Scan from the right for the first index \`i\` where \`nums[i] < nums[i+1]\` — the pivot, the rightmost place where the sequence can be increased. If there is no such pivot the whole array is descending (the largest permutation), so just reverse it to get the smallest. Otherwise scan from the right for the first value greater than \`nums[i]\`, swap them, then reverse the suffix after \`i\` (which is descending) to make it the smallest possible — giving the immediate next permutation.

\`O(n)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let left = i + 1;
  let right = n - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
  return nums;
}`,
        typescript: `function nextPermutation(nums: number[]): number[] {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let left = i + 1;
  let right = n - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
  return nums;
}`,
      },
    },
  ],
});
