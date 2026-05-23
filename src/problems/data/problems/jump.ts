import { defineAlgoProblem } from "../problem";

export const jump = defineAlgoProblem<[number[]], number>({
  id: "jump-game-ii",
  number: 54,
  title: "Jump Game II",
  difficulty: "medium",
  tags: ["array", "dynamic-programming", "greedy"],
  functionName: "jump",
  prompt: `You are given a 0-indexed array \`nums\` of non-negative integers. You start at index \`0\`. From index \`i\` you may jump forward to any index in the range \`[i + 1, i + nums[i]]\`.

Return the **minimum number of jumps** needed to reach the last index. The test cases are generated so that the last index is always reachable.`,
  constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000", "The last index is always reachable."],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function jump(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function jump(nums: number[]): number {
  // your code here
}`,
  },
  examples: [
    { name: "two jumps", args: [[2, 3, 1, 1, 4]], expected: 2, explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index." },
    { name: "still two", args: [[2, 3, 0, 1, 4]], expected: 2 },
    { name: "already there", args: [[1]], expected: 0, explanation: "A single element needs no jumps." },
  ],
  hiddenTests: [
    { args: [[0]], expected: 0 },
    { args: [[1, 1, 1, 1]], expected: 3 },
    { args: [[5, 1, 1, 1, 1]], expected: 1 },
    { args: [[1, 2, 3]], expected: 2 },
    { args: [[2, 1]], expected: 1 },
    { args: [[1, 2, 1, 1, 1]], expected: 3 },
    { args: [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1]], expected: 2 },
    { args: [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]], expected: 9 },
    { args: [[4, 1, 1, 3, 1, 1, 1]], expected: 2 },
    { args: [[3, 4, 3, 2, 5, 4, 3]], expected: 3 },
    { args: [[2, 3, 1, 1, 2, 4, 2, 0, 1, 1]], expected: 4 },
    { args: [Array.from({ length: 10000 }, (_, i) => (i % 2 === 0 ? 2 : 1))], expected: 5000 },
    { args: [Array.from({ length: 10000 }, () => 1)], expected: 9999 },
    { args: [Array.from({ length: 10000 }, () => 1000)], expected: 10 },
  ],
  source: { origin: "leetcode", frontendId: "45", acRate: 0.42873572378372077, confidence: 0.95 },
  solutions: [
    {
      name: "Greedy BFS by layers",
      explanation: `Think of it as breadth-first over jump "levels": the set of indices reachable in \`k\` jumps forms a contiguous window. Track \`currentEnd\` (the far edge of the current level) and \`farthest\` (the best index reachable from anything seen so far in this level). When the scan index reaches \`currentEnd\`, you must spend a jump and the next level extends to \`farthest\`. Stop before the last index so you don't over-count a final jump.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function jump(nums) {
  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
    }
  }
  return jumps;
}`,
        typescript: `function jump(nums: number[]): number {
  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
    }
  }
  return jumps;
}`,
      },
    },
  ],
});
