import { defineAlgoProblem } from "../problem";

export const houseRobber = defineAlgoProblem<[number[]], number>({
  id: "house-robber",
  number: 153,
  title: "House Robber",
  difficulty: "medium",
  tags: ["array", "dynamic-programming"],
  functionName: "rob",
  prompt: `You are planning to rob houses arranged in a single line. \`nums[i]\` is the amount of money stashed in house \`i\`.

Every house is wired to a shared security system: robbing two houses that are directly adjacent (indices \`i\` and \`i + 1\`) on the same night trips the alarm. Given \`nums\`, return the maximum total amount you can rob without robbing two adjacent houses.`,
  constraints: ["0 <= nums.length <= 100", "0 <= nums[i] <= 1000"],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums: number[]): number {
  // your code here
}`,
  },
  examples: [
    { name: "skip the middle house", args: [[1, 2, 3, 1]], expected: 4, explanation: "Rob houses 0 and 2: 1 + 3 = 4." },
    { name: "rob every other house", args: [[2, 7, 9, 3, 1]], expected: 12, explanation: "Rob houses 0, 2, and 4: 2 + 9 + 1 = 12." },
    { name: "endpoints beat the middle pair", args: [[2, 1, 1, 2]], expected: 4, explanation: "Rob houses 0 and 3: 2 + 2 = 4." },
  ],
  hiddenTests: [
    { name: "empty street", args: [[]], expected: 0 },
    { name: "single house", args: [[5]], expected: 5 },
    { name: "two houses, second larger", args: [[3, 10]], expected: 10 },
    { name: "two houses, first larger", args: [[10, 3]], expected: 10 },
    { name: "all houses equal, even length", args: [[4, 4, 4, 4, 4, 4]], expected: 12 },
    { name: "all houses equal, odd length", args: [[4, 4, 4, 4, 4]], expected: 12 },
    { name: "all houses empty of cash", args: [[0, 0, 0, 0]], expected: 0 },
    { name: "starting parity wins", args: [[10, 1, 1, 1, 10]], expected: 21 },
    { name: "shifted parity wins", args: [[1, 10, 1, 10, 1]], expected: 20 },
    { name: "irregular values, ten houses", args: [[23, 2, 5, 77, 15, 44, 8, 19, 6, 33]], expected: 196 },
    { name: "irregular values, eleven houses", args: [[15, 1, 2, 7, 9, 3, 1, 10, 2, 5, 4]], expected: 41 },
    {
      name: "large increasing street",
      args: [Array.from({ length: 10000 }, (_, i) => i + 1)],
      expected: 25005000,
    },
    {
      name: "large decreasing street",
      args: [Array.from({ length: 10000 }, (_, i) => 10000 - i)],
      expected: 25005000,
    },
    {
      name: "large uniform street",
      args: [Array.from({ length: 10000 }, () => 5)],
      expected: 25000,
    },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "Rolling 1-D DP",
      explanation: `Let \`dp[i]\` be the best haul using only houses \`0..i\`. At each house you either skip it (\`dp[i-1]\`) or rob it and add to the best haul from two houses back (\`dp[i-2] + nums[i]\`): \`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\`. Only the last two values are ever needed, so two rolling variables replace the array.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function rob(nums) {
  // prev = best haul two houses back, curr = best haul one house back.
  let prev = 0;
  let curr = 0;
  for (const money of nums) {
    // Either skip this house (curr) or rob it plus the best from two back (prev + money).
    const next = Math.max(curr, prev + money);
    prev = curr;
    curr = next;
  }
  return curr;
}`,
        typescript: `function rob(nums: number[]): number {
  // prev = best haul two houses back, curr = best haul one house back.
  let prev = 0;
  let curr = 0;
  for (const money of nums) {
    // Either skip this house (curr) or rob it plus the best from two back (prev + money).
    const next = Math.max(curr, prev + money);
    prev = curr;
    curr = next;
  }
  return curr;
}`,
      },
    },
  ],
});
