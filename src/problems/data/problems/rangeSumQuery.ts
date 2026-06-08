import { defineAlgoProblem } from "../problem";

export const rangeSumQuery = defineAlgoProblem<[number[], number[][]], number[]>({
  id: "range-sum-query-immutable",
  number: 126,
  title: "Range Sum Query - Immutable",
  difficulty: "easy",
  tags: ["array", "prefix-sum", "design"],
  functionName: "rangeSum",
  prompt: `Given an integer array \`nums\` that is never modified, answer a batch of range-sum queries. Each query is a pair \`[i, j]\` (0-based, with \`i <= j\`) asking for the sum of the elements from index \`i\` to index \`j\` **inclusive** of both ends.

Return an array whose \`k\`-th entry is the answer to the \`k\`-th query. Because the array is immutable, the expectation is that you precompute once and then answer every query in constant time.`,
  constraints: [
    "0 <= nums.length <= 10^4",
    "-10^5 <= nums[i] <= 10^5",
    "0 <= queries.length <= 10^4",
    "0 <= i <= j < nums.length for every query [i, j]",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number[][]} queries
 * @return {number[]}
 */
function rangeSum(nums, queries) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number[][]} queries
 * @return {number[]}
 */
function rangeSum(nums: number[], queries: number[][]): number[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "overlapping ranges",
      args: [[-2, 0, 3, -5, 2, -1], [[0, 2], [2, 5], [0, 5]]],
      expected: [1, -1, -3],
      explanation: "nums[0..2] = -2+0+3 = 1; nums[2..5] = 3-5+2-1 = -1; nums[0..5] = -3.",
    },
    {
      name: "interior range",
      args: [[1, 2, 3, 4], [[1, 3]]],
      expected: [9],
      explanation: "nums[1..3] = 2+3+4 = 9.",
    },
    { name: "single element", args: [[5], [[0, 0]]], expected: [5] },
    { name: "no queries", args: [[7, 8, 9], []], expected: [] },
  ],
  hiddenTests: [
    { args: [[0], [[0, 0]]], expected: [0] },
    { args: [[-1, -2, -3, -4], [[0, 3], [1, 2], [3, 3]]], expected: [-10, -5, -4] },
    { args: [[10, 20, 30, 40, 50], [[0, 0], [4, 4], [0, 4], [1, 3]]], expected: [10, 50, 150, 90] },
    { args: [[5, 5, 5, 5, 5], [[0, 4], [2, 2], [0, 0]]], expected: [25, 5, 5] },
    { args: [[100000, -100000, 100000], [[0, 2], [0, 1], [1, 2]]], expected: [100000, 0, 0] },
    {
      args: [
        Array.from({ length: 500 }, (_, k) => k + 1),
        Array.from({ length: 500 }, (_, k) => [0, k]),
      ],
      expected: Array.from({ length: 500 }, (_, k) => ((k + 1) * (k + 2)) / 2),
    },
  ],
  source: { origin: "leetcode", frontendId: "303", acRate: 0.65, confidence: 0.95 },
  solutions: [
    {
      name: "Prefix sums (precompute once)",
      explanation: `Build a prefix-sum array \`prefix\` of length \`n + 1\` where \`prefix[k]\` holds the sum of the first \`k\` elements (so \`prefix[0] = 0\`). The sum of any inclusive range \`[i, j]\` is then \`prefix[j + 1] - prefix[i]\`: the running total up to and including \`j\`, minus everything strictly before \`i\`.

Building the prefix array is one O(n) pass; after that each query is O(1), so a batch of \`q\` queries costs \`O(n + q)\` — far better than re-summing each range, which would be \`O(n·q)\`.`,
      code: {
        javascript: `function rangeSum(nums, queries) {
  // prefix[k] = sum of nums[0..k-1], so prefix[0] = 0 and the array has n + 1 slots.
  const prefix = new Array(nums.length + 1).fill(0);
  for (let k = 0; k < nums.length; k++) {
    prefix[k + 1] = prefix[k] + nums[k];
  }
  // Each inclusive range [i, j] is the running total through j minus everything before i.
  return queries.map(([i, j]) => prefix[j + 1] - prefix[i]);
}`,
        typescript: `function rangeSum(nums: number[], queries: number[][]): number[] {
  // prefix[k] = sum of nums[0..k-1], so prefix[0] = 0 and the array has n + 1 slots.
  const prefix = new Array<number>(nums.length + 1).fill(0);
  for (let k = 0; k < nums.length; k++) {
    prefix[k + 1] = prefix[k] + nums[k];
  }
  // Each inclusive range [i, j] is the running total through j minus everything before i.
  return queries.map(([i, j]) => prefix[j + 1] - prefix[i]);
}`,
      },
    },
  ],
});
