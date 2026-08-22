import { defineAlgoProblem } from "../problem";

export const canJump = defineAlgoProblem<[number[]], boolean>({
  id: "jump-game",
  number: 63,
  title: "Jump Game",
  difficulty: "medium",
  tags: ["array", "dynamic-programming", "greedy"],
  functionName: "canJump",
  prompt: `You are given an integer array \`nums\`. You start at the first index, and each element \`nums[i]\` is the **maximum** number of steps you can jump forward from that position.

Return \`true\` if you can reach the last index, and \`false\` otherwise.`,
  constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function canJump(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function canJump(nums: number[]): boolean {
  // your code here
}`,
  },
  examples: [
    {
      name: "reachable",
      args: [[2, 3, 1, 1, 4]],
      expected: true,
      explanation: "Jump 1 step to index 1, then 3 steps to the last index.",
    },
    {
      name: "stuck at zero",
      args: [[3, 2, 1, 0, 4]],
      expected: false,
      explanation: "You always land on index 3, whose value 0 lets you go no further.",
    },
    { name: "single", args: [[0]], expected: true, explanation: "Already at the last index." },
  ],
  hiddenTests: [
    { args: [[1]], expected: true },
    { args: [[0]], expected: true },
    { args: [[2, 0, 0]], expected: true },
    { args: [[1, 0, 1, 0]], expected: false },
    { args: [[0, 1]], expected: false },
    { args: [[1, 1, 1, 1]], expected: true },
    { args: [[5, 0, 0, 0, 0, 0]], expected: true },
    { args: [[2, 0, 0, 0]], expected: false },
    { args: [[4, 2, 0, 0, 1, 1, 4, 4, 4, 0, 1, 0, 0]], expected: true },
    { args: [[1, 2, 3, 0, 0, 0, 1]], expected: false },
    { args: [[3, 0, 8, 2, 0, 0, 1]], expected: true },
    { args: [[2, 5, 0, 0]], expected: true },
    // Scale: a long array reachable only by chaining single steps, and one with an early dead zero.
    { args: [Array.from({ length: 10000 }, () => 1)], expected: true },
    {
      args: (() => { const a = Array.from({ length: 10000 }, () => 1); a[5000] = 0; return [a]; })(),
      expected: false,
    },
  ],
  source: { origin: "leetcode", frontendId: "55", acRate: 0.4089307137427766, confidence: 0.96 },
  solutions: [
    {
      name: "Greedy farthest reach",
      explanation: `Track the farthest index reachable so far. Scan left to right; if the current index is beyond that reach, you're stuck and the answer is \`false\`. Otherwise extend the reach to \`max(reach, i + nums[i])\`. If you finish the scan, the last index was reachable.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function canJump(nums) {
  let reach = 0; // farthest index reachable so far
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false; // this index is unreachable — stuck for good
    reach = Math.max(reach, i + nums[i]); // extend the frontier as far as this jump allows
  }
  return true; // scanned every index without ever getting stuck
}`,
        typescript: `function canJump(nums: number[]): boolean {
  let reach = 0; // farthest index reachable so far
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false; // this index is unreachable — stuck for good
    reach = Math.max(reach, i + nums[i]); // extend the frontier as far as this jump allows
  }
  return true; // scanned every index without ever getting stuck
}`,
      },
    },
  ],
});
