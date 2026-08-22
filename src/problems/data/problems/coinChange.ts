import { defineAlgoProblem } from "../problem";

export const coinChange = defineAlgoProblem<[number[], number], number>({
  id: "coin-change",
  number: 154,
  title: "Coin Change",
  difficulty: "medium",
  tags: ["array", "dynamic-programming", "breadth-first-search"],
  functionName: "coinChange",
  prompt: `You have an unlimited supply of each denomination in \`coins\` (an array of distinct positive integers), and you want to make up exactly \`amount\` using as few coins as possible.

Given \`coins\` and \`amount\`, return the fewest coins needed to total exactly \`amount\`. If no combination of the given coins sums to \`amount\` exactly, return \`-1\`.`,
  constraints: [
    "1 <= coins.length <= 12",
    "1 <= coins[i] <= 2^31 - 1",
    "0 <= amount <= 10^4",
    "coins contains no duplicate values",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins: number[], amount: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "three coins",
      args: [[1, 2, 5], 11],
      expected: 3,
      explanation: "11 = 5 + 5 + 1, three coins — no combination of these coins does better.",
    },
    {
      name: "impossible with an even-only coin",
      args: [[2], 3],
      expected: -1,
      explanation: "Every combination of 2s is even, so an odd amount like 3 can never be reached.",
    },
    {
      name: "zero amount needs zero coins",
      args: [[1], 0],
      expected: 0,
    },
  ],
  hiddenTests: [
    { name: "zero amount regardless of coins", args: [[186, 419, 83, 408], 0], expected: 0 },
    { name: "single coin exactly matches amount", args: [[7], 7], expected: 1 },
    { name: "amount smaller than every coin", args: [[5, 10], 3], expected: -1 },
    { name: "one coin evenly divides amount", args: [[5], 100], expected: 20 },
    { name: "no coin of value 1, amount unreachable", args: [[3, 7], 5], expected: -1 },
    { name: "no coin of value 1, amount reachable", args: [[3, 7], 24], expected: 4 },
    { name: "single coin that does not divide amount", args: [[9], 6], expected: -1 },
    { name: "greedy largest-first is suboptimal", args: [[1, 3, 4], 6], expected: 2 },
    { name: "smallest positive amount", args: [[1], 1], expected: 1 },
    { name: "mixed denominations, moderate amount", args: [[2, 5, 10, 1], 27], expected: 4 },
    { name: "same coins as example, larger amount", args: [[1, 2, 5], 100], expected: 20 },
    { name: "same coins as example, smaller amount", args: [[1, 2, 5], 3], expected: 2 },
    { name: "scale: large amount, single coin", args: [[1], 2000], expected: 2000 },
    { name: "scale: few coins, thousands-range amount", args: [[13, 7, 2], 1000], expected: 80 },
    { name: "scale: coin-like denominations, upper-bound amount", args: [[1, 5, 10, 25], 6249], expected: 255 },
    {
      name: "scale: many denominations, max amount",
      args: [[1, 18, 35, 52, 69, 86, 103, 120, 137, 154], 10000],
      expected: 72,
    },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "Bottom-up 1-D DP",
      explanation: `Let \`dp[t]\` be the fewest coins that make total \`t\`, with \`dp[0] = 0\`. For every \`t\` from \`1\` to \`amount\`, try each coin \`c <= t\` and take the best of \`1 + dp[t - c]\` — one of the current coin plus the best way to make the remainder. Totals that stay unreachable keep a sentinel of \`Infinity\`; if \`dp[amount]\` never got filled in, no combination works.

\`O(amount * coins.length)\` time, \`O(amount)\` space.`,
      code: {
        javascript: `function coinChange(coins, amount) {
  // dp[total] = fewest coins to make that total; Infinity means unreached so far.
  const dp = new Array(amount + 1).fill(Infinity);
  // Base case: zero coins are needed to make a total of 0.
  dp[0] = 0;
  // Fill every total from 1 up to amount, smallest first, so each dp[total - coin] is already final.
  for (let total = 1; total <= amount; total++) {
    // Try every coin as the last coin placed to reach this total.
    for (const coin of coins) {
      // Only usable if it fits, and only worth taking if it beats the current best for this total.
      if (coin <= total && dp[total - coin] + 1 < dp[total]) {
        dp[total] = dp[total - coin] + 1;
      }
    }
  }
  // If dp[amount] never improved past Infinity, no combination of coins sums to it exactly.
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
        typescript: `function coinChange(coins: number[], amount: number): number {
  // dp[total] = fewest coins to make that total; Infinity means unreached so far.
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  // Base case: zero coins are needed to make a total of 0.
  dp[0] = 0;
  // Fill every total from 1 up to amount, smallest first, so each dp[total - coin] is already final.
  for (let total = 1; total <= amount; total++) {
    // Try every coin as the last coin placed to reach this total.
    for (const coin of coins) {
      // Only usable if it fits, and only worth taking if it beats the current best for this total.
      if (coin <= total && dp[total - coin] + 1 < dp[total]) {
        dp[total] = dp[total - coin] + 1;
      }
    }
  }
  // If dp[amount] never improved past Infinity, no combination of coins sums to it exactly.
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      },
    },
  ],
});
