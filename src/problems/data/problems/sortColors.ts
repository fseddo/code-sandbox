import { defineAlgoProblem } from "../problem";

// In-place problem: the solution mutates `nums` and returns the same array. The `checker` reads the
// post-call `args` and asserts (a) the array is sorted and (b) `actual` is the *same instance* as the
// input — so sorting a copy and returning that fails. See problem-authoring.md (in-place policy).
export const sortColors = defineAlgoProblem<[number[]], number[]>({
  id: "sort-colors",
  number: 20,
  title: "Sort Colors",
  difficulty: "medium",
  tags: ["array", "two-pointers", "sorting"],
  functionName: "sortColors",
  prompt: `Given an array \`nums\` of \`n\` integers that are \`0\`, \`1\`, or \`2\` — representing the colors red, white, and blue — sort it **in place** so that equal colors are adjacent and ordered \`0\`, \`1\`, \`2\`.

You must mutate the input array directly and return that same array (do not allocate and return a new one). The classic constraint is to do it in one pass with constant extra space, without a library sort.`,
  constraints: [
    "n == nums.length",
    "1 <= n <= 300",
    "nums[i] is either 0, 1, or 2.",
  ],
  checker: `(actual, args, expected) => {
    const sorted = args[0];
    if (actual !== sorted) return false;
    if (sorted.length !== expected.length) return false;
    return sorted.every((value, index) => value === expected[index]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[]} the same array, sorted in place
 */
function sortColors(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[]} the same array, sorted in place
 */
function sortColors(nums: number[]): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "mixed", args: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2], explanation: "Two of each color, grouped in order." },
    { name: "small", args: [[2, 0, 1]], expected: [0, 1, 2] },
    { name: "single", args: [[0]], expected: [0] },
  ],
  hiddenTests: [
    { args: [[1]], expected: [1] },
    { args: [[2]], expected: [2] },
    { args: [[0, 0, 0]], expected: [0, 0, 0] },
    { args: [[2, 2, 2]], expected: [2, 2, 2] },
    { args: [[2, 1, 0]], expected: [0, 1, 2] },
    { args: [[0, 1, 2]], expected: [0, 1, 2] },
    { args: [[1, 1, 0, 0, 2, 2]], expected: [0, 0, 1, 1, 2, 2] },
    { args: [[2, 0, 1, 1, 0, 2, 1, 0]], expected: [0, 0, 0, 1, 1, 1, 2, 2] },
    { args: [[0, 2]], expected: [0, 2] },
    { args: [[1, 2, 0, 1]], expected: [0, 1, 1, 2] },
    // Scale: 300 values, the max size; a correct one-pass partition is instant.
    {
      args: [Array.from({ length: 300 }, (_, i) => (i * 7) % 3)],
      expected: (() => { const a = Array.from({ length: 300 }, (_, i) => (i * 7) % 3); return a.sort((x, y) => x - y); })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "75", acRate: 0.6661, confidence: 0.9 },
  solutions: [
    {
      name: "Dutch national flag (three pointers)",
      explanation: `Keep three pointers: \`low\` (next slot for a 0), \`high\` (next slot for a 2), and a scanning \`mid\`. When \`nums[mid]\` is 0, swap it down to \`low\` and advance both; when it's 2, swap it up to \`high\` and shrink \`high\` (don't advance \`mid\` — the swapped-in value is unexamined); when it's 1, just advance \`mid\`. One pass, in place.

\`O(n)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 2) {
      [nums[high], nums[mid]] = [nums[mid], nums[high]];
      high--;
    } else {
      mid++;
    }
  }
  return nums;
}`,
        typescript: `function sortColors(nums: number[]): number[] {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 2) {
      [nums[high], nums[mid]] = [nums[mid], nums[high]];
      high--;
    } else {
      mid++;
    }
  }
  return nums;
}`,
      },
    },
  ],
});
