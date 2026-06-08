import { defineAlgoProblem } from "../problem";

export const subarraySum = defineAlgoProblem<[number[], number], number>({
  id: "subarray-sum-equals-k",
  number: 127,
  title: "Subarray Sum Equals K",
  difficulty: "medium",
  tags: ["array", "hash-table", "prefix-sum"],
  functionName: "subarraySum",
  prompt: `Given an integer array \`nums\` and an integer \`k\`, return the **total number of contiguous subarrays** whose elements sum to exactly \`k\`.

The array may contain negative numbers and zeros, so you can't rely on a sliding window — a longer subarray isn't guaranteed to have a larger sum.`,
  constraints: [
    "1 <= nums.length <= 2 * 10^4",
    "-1000 <= nums[i] <= 1000",
    "-10^7 <= k <= 10^7",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function subarraySum(nums, k) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function subarraySum(nums: number[], k: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "two subarrays", args: [[1, 1, 1], 2], expected: 2, explanation: "[1,1] at indices 0..1 and 1..2." },
    { name: "single hit", args: [[1, 2, 3], 3], expected: 2, explanation: "[3] and [1,2] both sum to 3." },
    { name: "with negatives", args: [[1, -1, 0], 0], expected: 3, explanation: "[1,-1], [0], and [1,-1,0] all sum to 0." },
    { name: "no subarray", args: [[1, 2, 3], 7], expected: 0 },
  ],
  hiddenTests: [
    { args: [[1], 0], expected: 0 },
    { args: [[0], 0], expected: 1 },
    { args: [[0, 0, 0], 0], expected: 6 },
    { args: [[-1, -1, 1], 0], expected: 1 },
    { args: [[3, 4, 7, 2, -3, 1, 4, 2], 7], expected: 4 },
    { args: [[1, 2, 1, 2, 1], 3], expected: 4 },
    { args: [[100, 200, 300], 1000], expected: 0 },
    { args: [[-1, -1, -1, -1], -2], expected: 3 },
    { args: [[5, -5, 5, -5, 5], 0], expected: 6 },
    { args: [Array.from({ length: 300 }, () => 1), 5], expected: 296 },
    { args: [Array.from({ length: 200 }, () => 0), 0], expected: (200 * 201) / 2 },
  ],
  source: { origin: "leetcode", frontendId: "560", acRate: 0.4399, confidence: 0.97 },
  solutions: [
    {
      name: "Prefix sums + hash map",
      explanation: `Let \`prefix\` be the running sum of \`nums\` up to the current index. A subarray ending at the current index sums to \`k\` exactly when some earlier prefix equals \`prefix - k\` — because subtracting that earlier prefix leaves a contiguous block summing to \`k\`.

Keep a map of \`prefix value → how many times it has occurred\` (seeded with \`{0: 1}\` so a subarray that starts at index 0 is counted). At each step, add \`count[prefix - k]\` to the answer, then record the current prefix. One pass, \`O(n)\` time.`,
      code: {
        javascript: `function subarraySum(nums, k) {
  // How many times each running-sum value has been seen; {0:1} lets a
  // subarray starting at index 0 count itself.
  const counts = new Map([[0, 1]]);
  let prefix = 0;
  let total = 0;
  for (const num of nums) {
    prefix += num;
    // Any earlier prefix equal to (prefix - k) closes a subarray summing to k.
    total += counts.get(prefix - k) ?? 0;
    // Record this prefix for subarrays that end later.
    counts.set(prefix, (counts.get(prefix) ?? 0) + 1);
  }
  return total;
}`,
        typescript: `function subarraySum(nums: number[], k: number): number {
  // How many times each running-sum value has been seen; {0:1} lets a
  // subarray starting at index 0 count itself.
  const counts = new Map<number, number>([[0, 1]]);
  let prefix = 0;
  let total = 0;
  for (const num of nums) {
    prefix += num;
    // Any earlier prefix equal to (prefix - k) closes a subarray summing to k.
    total += counts.get(prefix - k) ?? 0;
    // Record this prefix for subarrays that end later.
    counts.set(prefix, (counts.get(prefix) ?? 0) + 1);
  }
  return total;
}`,
      },
    },
  ],
});
