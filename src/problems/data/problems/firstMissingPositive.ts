import { defineAlgoProblem } from "../problem";

export const firstMissingPositive = defineAlgoProblem<[number[]], number>({
  id: "first-missing-positive",
  number: 50,
  title: "First Missing Positive",
  difficulty: "hard",
  tags: ["array", "hash-table"],
  functionName: "firstMissingPositive",
  prompt: `Given an unsorted integer array \`nums\`, return the smallest positive integer (1, 2, 3, …) that does **not** appear in \`nums\`.

Negatives, zero, and duplicates may all be present and should simply be ignored when they don't help. The answer is always at least \`1\`.

Aim for \`O(n)\` time and \`O(1)\` auxiliary space (beyond the input array).`,
  constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function firstMissingPositive(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function firstMissingPositive(nums: number[]): number {
  // your code here
}`,
  },
  examples: [
    { name: "missing in middle", args: [[1, 2, 0]], expected: 3, explanation: "1 and 2 are present, so the smallest missing positive is 3." },
    { name: "with negatives", args: [[3, 4, -1, 1]], expected: 2, explanation: "1 is present but 2 is not." },
    { name: "all large", args: [[7, 8, 9, 11, 12]], expected: 1, explanation: "No 1 appears, so 1 is the answer." },
  ],
  hiddenTests: [
    { args: [[1]], expected: 2 },
    { args: [[2]], expected: 1 },
    { args: [[1, 1]], expected: 2 },
    { args: [[0]], expected: 1 },
    { args: [[-1, -2, -3]], expected: 1 },
    { args: [[1, 2, 3, 4, 5]], expected: 6 },
    { args: [[5, 4, 3, 2, 1]], expected: 6 },
    { args: [[2, 3, 4]], expected: 1 },
    { args: [[1, 2, 3, 10]], expected: 4 },
    { args: [[3, 3, 3]], expected: 1 },
    { args: [[1, 1, 2, 2]], expected: 3 },
    { args: [[100000]], expected: 1 },
    { args: [[-5, -4, -3, -2, -1]], expected: 1 },
    { args: [Array.from({ length: 100000 }, (_, i) => i + 1)], expected: 100001 },
    { args: [Array.from({ length: 100000 }, (_, i) => i + 2)], expected: 1 },
    { args: [Array.from({ length: 100000 }, (_, i) => (i === 50000 ? 999999 : i + 1))], expected: 50001 },
  ],
  source: { origin: "leetcode", frontendId: "41", acRate: 0.4291706401402714, confidence: 0.95 },
  solutions: [
    {
      name: "Index-as-hash (cyclic placement)",
      explanation: `The answer must lie in \`[1, n + 1]\`, where \`n = nums.length\` — with \`n\` slots you can hold at most \`n\` distinct positives, so something in that range is missing. Use the array itself as the hash: repeatedly swap \`nums[i]\` to the slot \`nums[i] - 1\` whenever it's a positive value \`≤ n\` not already in place. After this pass, the first index \`i\` where \`nums[i] !== i + 1\` gives the answer \`i + 1\`; if all match, the answer is \`n + 1\`.

Each value is moved to its home slot at most once, so the swap loop is \`O(n)\` overall. \`O(1)\` extra space.`,
      code: {
        javascript: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const target = nums[i] - 1;
      const tmp = nums[target];
      nums[target] = nums[i];
      nums[i] = tmp;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}`,
        typescript: `function firstMissingPositive(nums: number[]): number {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const target = nums[i] - 1;
      const tmp = nums[target];
      nums[target] = nums[i];
      nums[i] = tmp;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}`,
      },
    },
  ],
});
