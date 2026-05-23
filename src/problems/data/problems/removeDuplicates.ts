import { defineAlgoProblem } from "../problem";

// In-place return-count problem: the solution mutates `nums` so its first k entries are the kept
// values, and returns k. The checker reads `actual` (k) and compares `args[0].slice(0, k)` to the
// expected kept prefix. See problem-authoring.md (in-place / return-a-count policy).
export const removeDuplicates = defineAlgoProblem<[number[]], number[]>({
  id: "remove-duplicates-from-sorted-array-ii",
  number: 86,
  title: "Remove Duplicates from Sorted Array II",
  difficulty: "medium",
  tags: ["array", "two-pointers"],
  functionName: "removeDuplicates",
  prompt: `Given a sorted integer array \`nums\`, remove duplicates **in place** so that each value appears **at most twice**, keeping the relative order.

Return the new length \`k\`. The first \`k\` elements of \`nums\` must hold the result; anything past index \`k\` does not matter. You must not allocate a separate array — modify \`nums\` directly with \`O(1)\` extra space.`,
  constraints: [
    "1 <= nums.length <= 3 * 10^4",
    "-10^4 <= nums[i] <= 10^4",
    "nums is sorted in non-decreasing order.",
  ],
  checker: `(actual, args, expected) => {
    if (typeof actual !== "number") return false;
    if (actual !== expected.length) return false;
    const kept = args[0].slice(0, actual);
    return kept.every((v, i) => v === expected[i]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number} the new length k; nums[0..k-1] holds the result
 */
function removeDuplicates(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number} the new length k; nums[0..k-1] holds the result
 */
function removeDuplicates(nums: number[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "trim triples",
      args: [[1, 1, 1, 2, 2, 3]],
      expected: [1, 1, 2, 2, 3],
      explanation: "The third 1 is dropped; everything else appears at most twice. k = 5.",
    },
    {
      name: "longer run",
      args: [[0, 0, 1, 1, 1, 1, 2, 3, 3]],
      expected: [0, 0, 1, 1, 2, 3, 3],
    },
    {
      name: "already valid",
      args: [[1, 2, 3]],
      expected: [1, 2, 3],
    },
  ],
  hiddenTests: [
    { args: [[1]], expected: [1] },
    { args: [[1, 1]], expected: [1, 1] },
    { args: [[1, 1, 1]], expected: [1, 1] },
    { args: [[2, 2, 2, 2, 2]], expected: [2, 2] },
    { args: [[-3, -3, -3, -1, -1, 0, 0, 0]], expected: [-3, -3, -1, -1, 0, 0] },
    { args: [[1, 2, 2, 3, 3, 3, 4]], expected: [1, 2, 2, 3, 3, 4] },
    { args: [[5, 5, 6, 6, 7, 7]], expected: [5, 5, 6, 6, 7, 7] },
    { args: [[0, 0, 0, 0]], expected: [0, 0] },
    { args: [[-1, 0, 1]], expected: [-1, 0, 1] },
    { args: [[1, 1, 2, 2, 2, 2, 2]], expected: [1, 1, 2, 2] },
    { args: [[10000, 10000, 10000]], expected: [10000, 10000] },
    {
      // Scale: 30000 elements, each value repeated 3x → result keeps 2 of each.
      args: [Array.from({ length: 30000 }, (_, i) => Math.floor(i / 3))],
      expected: (() => {
        const out = [];
        for (let v = 0; v < 10000; v++) out.push(v, v);
        return out;
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "80", acRate: 0.6469932430862613, confidence: 0.95 },
  solutions: [
    {
      name: "Write pointer with a look-back of two",
      explanation: `Maintain a write index \`k\`. Copy each value forward only if fewer than two copies have already been written — i.e. when \`k < 2\` or the value differs from the element two slots back (\`nums[k-2]\`). Because the array is sorted, that check enforces the at-most-twice rule in a single pass.

\`O(n)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function removeDuplicates(nums) {
  let k = 0;
  for (const num of nums) {
    if (k < 2 || num !== nums[k - 2]) {
      nums[k] = num;
      k++;
    }
  }
  return k;
}`,
        typescript: `function removeDuplicates(nums: number[]): number {
  let k = 0;
  for (const num of nums) {
    if (k < 2 || num !== nums[k - 2]) {
      nums[k] = num;
      k++;
    }
  }
  return k;
}`,
      },
    },
  ],
});
