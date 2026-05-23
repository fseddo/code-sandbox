import { defineAlgoProblem } from "../problem";

export const climbingStairs = defineAlgoProblem<[number], number>({
  id: "climbing-stairs",
  number: 77,
  title: "Climbing Stairs",
  difficulty: "easy",
  tags: ["math", "dynamic-programming", "memoization"],
  functionName: "climbStairs",
  prompt: `You are climbing a staircase with \`n\` steps. Each move you may climb either \`1\` or \`2\` steps.

Return the number of **distinct** ordered ways you can reach the top.`,
  constraints: ["1 <= n <= 45"],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "two steps", args: [2], expected: 2, explanation: "Either 1+1 or a single 2-step." },
    { name: "three steps", args: [3], expected: 3, explanation: "1+1+1, 1+2, or 2+1." },
    { name: "one step", args: [1], expected: 1 },
  ],
  hiddenTests: [
    { args: [4], expected: 5 },
    { args: [5], expected: 8 },
    { args: [6], expected: 13 },
    { args: [10], expected: 89 },
    { args: [20], expected: 10946 },
    { args: [30], expected: 1346269 },
    { args: [44], expected: 1134903170 },
    { args: [45], expected: 1836311903 },
    { args: [7], expected: 21 },
    { args: [8], expected: 34 },
  ],
  source: { origin: "leetcode", frontendId: "70", acRate: 0.540897455324285, confidence: 0.97 },
  solutions: [
    {
      name: "Bottom-up Fibonacci",
      explanation: `The ways to reach step \`i\` equal the ways to reach \`i-1\` (then a single step) plus the ways to reach \`i-2\` (then a double step), which is the Fibonacci recurrence. Track only the last two values.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function climbStairs(n) {
  let prev = 1;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
        typescript: `function climbStairs(n: number): number {
  let prev = 1;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
      },
    },
  ],
});
