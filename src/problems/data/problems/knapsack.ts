import { defineAlgoProblem } from "../problem";

export const knapsack = defineAlgoProblem<[number, number[], number[]], number>({
  id: "knapsack",
  number: 157,
  title: "0/1 Knapsack",
  difficulty: "medium",
  tags: ["array", "dynamic-programming"],
  functionName: "knapsack",
  prompt: `You're packing a knapsack that can carry a total weight of \`cap\`. There are \`n\` candidate items, where item \`i\` weighs \`weights[i]\` and is worth \`values[i]\`.

Choose a subset of the items so the combined weight is at most \`cap\` and the combined value is as large as possible. Each item may be used **at most once** — you either pack it whole or leave it behind, there's no taking a fraction of an item and no taking the same item twice.

Return the maximum total value achievable.`,
  constraints: [
    "0 <= cap <= 10^4",
    "0 <= weights.length == values.length <= 200",
    "1 <= weights[i] <= 10^4",
    "1 <= values[i] <= 10^4",
  ],
  starterCode: {
    javascript: `/**
 * @param {number} cap
 * @param {number[]} weights
 * @param {number[]} values
 * @return {number}
 */
function knapsack(cap, weights, values) {
  // your code here
}`,
    typescript: `/**
 * @param {number} cap
 * @param {number[]} weights
 * @param {number[]} values
 * @return {number}
 */
function knapsack(cap: number, weights: number[], values: number[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "three items pack the knapsack exactly",
      args: [10, [1, 3, 4, 5], [1, 4, 5, 7]],
      expected: 13,
      explanation: "Take the items weighing 1, 4, and 5 (total weight 10, right at capacity) for value 1 + 5 + 7 = 13 — no other subset beats it.",
    },
    {
      name: "zero capacity",
      args: [0, [1, 2, 3], [10, 20, 30]],
      expected: 0,
      explanation: "A capacity of 0 rules out every item, so nothing can be packed.",
    },
    {
      name: "single item exactly fits",
      args: [5, [5], [100]],
      expected: 100,
    },
    {
      name: "every item fits at once",
      args: [6, [1, 2, 3], [6, 10, 12]],
      expected: 28,
      explanation: "The items' weights sum to exactly 6, so all three fit: 6 + 10 + 12 = 28.",
    },
  ],
  hiddenTests: [
    { name: "zero capacity with several items", args: [0, [3, 4, 5], [10, 20, 30]], expected: 0 },
    { name: "no items available", args: [100, [], []], expected: 0 },
    { name: "single item exactly fills capacity", args: [8, [8], [42]], expected: 42 },
    { name: "single item exceeds capacity", args: [9, [10], [999]], expected: 0 },
    { name: "all items identical", args: [10, [3, 3, 3, 3, 3], [5, 5, 5, 5, 5]], expected: 15 },
    { name: "each item usable at most once, not unbounded", args: [9, [3], [5]], expected: 5 },
    { name: "duplicate weight-value pairs are still separate items", args: [6, [3, 3], [5, 5]], expected: 10 },
    { name: "same weight, pick the pricier item", args: [4, [4, 4], [10, 9]], expected: 10 },
    { name: "capacity for only one of two equal-weight items", args: [5, [5, 5], [60, 40]], expected: 60 },
    { name: "greedy best-ratio-first picks the wrong subset", args: [50, [10, 20, 30], [60, 100, 120]], expected: 220 },
    { name: "mixed weights with several viable subsets", args: [15, [1, 2, 3, 8, 7, 4], [1, 6, 10, 22, 28, 12]], expected: 51 },
    { name: "anti-hardcode: unrelated denominations", args: [37, [2, 5, 9, 13, 17, 23], [3, 8, 14, 19, 25, 31]], expected: 55 },
    {
      name: "value proportional to weight throughout",
      args: [100, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40]],
      expected: 200,
    },
    {
      name: "scale: twenty items, capacity 300",
      args: [
        300,
        [28, 81, 77, 57, 69, 73, 85, 73, 69, 49, 73, 9, 65, 49, 57, 77, 85, 1, 97, 93],
        [97, 57, 89, 85, 89, 25, 17, 89, 29, 49, 93, 57, 89, 13, 33, 85, 81, 14, 77, 81],
      ],
      expected: 488,
    },
    {
      name: "scale: sixty items near the capacity bound",
      args: [
        10000,
        [69, 437, 173, 469, 485, 301, 177, 173, 409, 57, 281, 481, 5, 385, 481, 9, 281, 441, 329, 69, 465, 397, 473, 353, 325, 77, 249, 469, 33, 409, 441, 89, 385, 465, 337, 477, 385, 305, 113, 37, 401, 221, 81, 345, 481, 85, 121, 117, 85, 349, 241, 97, 13, 273, 393, 17, 149, 133, 297, 73],
        [889, 273, 593, 841, 465, 897, 353, 961, 841, 233, 833, 601, 369, 385, 865, 369, 777, 921, 825, 457, 873, 249, 113, 97, 401, 553, 281, 49, 145, 329, 897, 113, 265, 17, 905, 673, 865, 985, 465, 721, 417, 113, 65, 153, 817, 769, 73, 441, 321, 73, 489, 297, 713, 393, 225, 705, 609, 457, 905, 369],
      ],
      expected: 27204,
    },
  ],
  source: { origin: "authored", confidence: 0.8 },
  solutions: [
    {
      name: "Bottom-up 2-D DP",
      explanation: `Let \`dp[i][c]\` be the best value achievable using only items \`i..n-1\` with remaining capacity \`c\`. Fill the table from the last item back to the first: for each item, either skip it (\`dp[i+1][c]\`) or, if it fits, take it and add its value to the best remaining subproblem (\`values[i] + dp[i+1][c - weights[i]]\`) — \`dp[i][c]\` is the max of those two choices. \`dp[0][cap]\` is the answer over all \`n\` items and the full capacity.

Working items back-to-front (rather than front-to-back) is just a style choice — either direction of item ordering solves the same recurrence, as long as the earlier dimension has both "skip" and "take" available. \`O(n * cap)\` time, \`O(n * cap)\` space (row-reducible to \`O(cap)\` by keeping just the "next row" of the table).`,
      code: {
        javascript: `function knapsack(cap, weights, values) {
  const n = values.length;
  // dp[i][c] = best value achievable from items i..n-1 with capacity c.
  // One extra row (index n) represents "no items left", implicitly all zeros.
  const dp = Array.from({ length: n + 1 }, () => new Array(cap + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let c = 1; c <= cap; c++) {
      if (weights[i] <= c) {
        // Best of leaving item i out, or taking it and recursing on the leftover capacity.
        dp[i][c] = Math.max(values[i] + dp[i + 1][c - weights[i]], dp[i + 1][c]);
      } else {
        // Too heavy to take at this capacity — only option is to skip it.
        dp[i][c] = dp[i + 1][c];
      }
    }
  }

  return dp[0][cap];
}`,
        typescript: `function knapsack(cap: number, weights: number[], values: number[]): number {
  const n = values.length;
  // dp[i][c] = best value achievable from items i..n-1 with capacity c.
  // One extra row (index n) represents "no items left", implicitly all zeros.
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(cap + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let c = 1; c <= cap; c++) {
      if (weights[i] <= c) {
        // Best of leaving item i out, or taking it and recursing on the leftover capacity.
        dp[i][c] = Math.max(values[i] + dp[i + 1][c - weights[i]], dp[i + 1][c]);
      } else {
        // Too heavy to take at this capacity — only option is to skip it.
        dp[i][c] = dp[i + 1][c];
      }
    }
  }

  return dp[0][cap];
}`,
      },
    },
  ],
});
