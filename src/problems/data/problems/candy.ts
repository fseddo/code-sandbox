import { defineAlgoProblem } from "../problem";

export const candy = defineAlgoProblem<[number[]], number>({
  id: "candy",
  number: 159,
  title: "Candy",
  difficulty: "hard",
  tags: ["array", "greedy"],
  functionName: "candy",
  prompt: `\`n\` children stand in a line. Each child has a rating given by \`ratings[i]\`. You must hand out candies to every child so that:

- Every child receives at least one candy.
- Any child whose rating is strictly greater than an immediate neighbor's rating must receive strictly more candies than that neighbor.

Return the minimum total number of candies you need to satisfy both rules.`,
  constraints: ["n == ratings.length", "1 <= n <= 2 * 10^4", "0 <= ratings[i] <= 2 * 10^4"],
  starterCode: {
    javascript: `/**
 * @param {number[]} ratings
 * @return {number}
 */
function candy(ratings) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} ratings
 * @return {number}
 */
function candy(ratings: number[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "single dip",
      args: [[1, 0, 2]],
      expected: 5,
      explanation:
        "Child 1 has the lowest rating and gets 1 candy. Both neighbors rate higher than child 1, so each needs at least 2. Total: 2 + 1 + 2 = 5.",
    },
    {
      name: "plateau after a rise",
      args: [[1, 2, 2]],
      expected: 4,
      explanation:
        "Child 1 rates higher than child 0, so child 1 gets 2 and child 0 gets 1. Child 2 ties child 1, so no ordering is required between them and child 2 gets 1. Total: 1 + 2 + 1 = 4.",
    },
    {
      name: "strictly increasing",
      args: [[1, 2, 3, 4]],
      expected: 10,
      explanation: "Each child rates higher than the last, so the candies climb 1, 2, 3, 4 for a total of 10.",
    },
    {
      name: "single child",
      args: [[5]],
      expected: 1,
      explanation: "One child always gets exactly 1 candy.",
    },
  ],
  hiddenTests: [
    // Boundary: smallest sizes.
    { args: [[5]], expected: 1 },
    { args: [[1, 2]], expected: 3 },
    { args: [[2, 1]], expected: 3 },
    // Edge: all-equal ratings, plateau in the middle.
    { args: [[2, 2, 2, 2]], expected: 4 },
    { args: [[1, 1, 1]], expected: 3 },
    { args: [[1, 2, 2, 2, 3]], expected: 7 },
    // Structural: strictly decreasing, a peak, a valley, multiple alternating peaks/valleys.
    { args: [[4, 3, 2, 1]], expected: 10 },
    { args: [[1, 3, 4, 5, 2]], expected: 11 },
    { args: [[3, 2, 1, 2, 3]], expected: 11 },
    { args: [[5, 4, 3, 2, 1, 2, 3, 4, 5]], expected: 29 },
    { args: [[1, 2, 1, 2, 1, 2, 1]], expected: 10 },
    // Anti-hardcode: patterns unlike the visible examples.
    { args: [[1, 2, 3, 3, 2, 1]], expected: 12 },
    { args: [[10, 9, 11, 10, 9, 8, 7, 20]], expected: 20 },
    // Scale: large strictly increasing, large flat, large zigzag.
    {
      args: [Array.from({ length: 20000 }, (_, i) => i + 1)],
      expected: 200010000,
    },
    {
      args: [Array.from({ length: 20000 }, () => 5)],
      expected: 20000,
    },
    {
      args: [Array.from({ length: 20000 }, (_, i) => (i % 2 === 0 ? 1 : 2))],
      expected: 30000,
    },
  ],
  source: { origin: "authored", confidence: 0.92 },
  solutions: [
    {
      name: "Two-pass greedy",
      explanation: `Start every child with 1 candy. Sweep left to right: whenever a child rates higher than the child to their left, give them one more candy than that neighbor. This satisfies every "higher than the left neighbor" constraint, but may still shortchange a child who rates higher than their *right* neighbor.

Sweep right to left to fix that: whenever a child rates higher than the child to their right, they need at least one more candy than that neighbor — but take the \`max\` with whatever the left-to-right pass already gave them, since the left pass may have already assigned something bigger.

Sum the per-child candy counts for the answer. \`O(n)\` time, \`O(n)\` space for the candies array.`,
      code: {
        javascript: `function candy(ratings) {
  const n = ratings.length;
  // Everyone starts at the floor of 1 candy.
  const candies = new Array(n).fill(1);

  // Left-to-right pass: satisfy "more than the left neighbor" in one sweep.
  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) {
      candies[i] = candies[i - 1] + 1;
    }
  }

  // Right-to-left pass: satisfy "more than the right neighbor" too, taking
  // the max so this pass never undoes what the left pass already secured.
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }
  }

  // Total candies handed out across every child.
  return candies.reduce((total, c) => total + c, 0);
}`,
        typescript: `function candy(ratings: number[]): number {
  const n = ratings.length;
  // Everyone starts at the floor of 1 candy.
  const candies = new Array(n).fill(1);

  // Left-to-right pass: satisfy "more than the left neighbor" in one sweep.
  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) {
      candies[i] = candies[i - 1] + 1;
    }
  }

  // Right-to-left pass: satisfy "more than the right neighbor" too, taking
  // the max so this pass never undoes what the left pass already secured.
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }
  }

  // Total candies handed out across every child.
  return candies.reduce((total, c) => total + c, 0);
}`,
      },
    },
  ],
});
