import { defineAlgoProblem } from "../problem";

export const maxArea = defineAlgoProblem<[number[]], number>({
  id: "container-with-most-water",
  number: 21,
  title: "Container With Most Water",
  difficulty: "medium",
  tags: ["array", "two-pointers", "greedy"],
  functionName: "maxArea",
  prompt: `You are given an integer array \`height\` of length \`n\`. Each value \`height[i]\` is a vertical line drawn from \`(i, 0)\` to \`(i, height[i])\`.

Pick two of these lines so that, together with the x-axis, they form a container holding the most water. Return that maximum amount of water.

The container's area is \`min(height[i], height[j]) * (j - i)\` for the chosen pair \`i < j\` — the shorter line caps the water level, and the horizontal distance sets the width. The container cannot be tilted.`,
  constraints: [
    "n == height.length",
    "2 <= n <= 10^5",
    "0 <= height[i] <= 10^4",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height: number[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "classic",
      args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
      expected: 49,
      explanation: "Lines at index 1 (height 8) and index 8 (height 7) give min(8, 7) * (8 - 1) = 7 * 7 = 49.",
    },
    {
      name: "two lines",
      args: [[1, 1]],
      expected: 1,
      explanation: "Only one pair: min(1, 1) * (1 - 0) = 1.",
    },
    {
      name: "tall ends win",
      args: [[2, 3, 4, 5, 18, 17, 6]],
      expected: 17,
      explanation: "Indices 4 and 5: min(18, 17) * (5 - 4) = 17.",
    },
  ],
  hiddenTests: [
    { args: [[0, 0]], expected: 0 },
    { args: [[4, 4]], expected: 4 },
    { args: [[0, 5]], expected: 0 },
    { args: [[100, 0, 0, 0, 100]], expected: 400 },
    { args: [[1, 2, 3, 4, 5, 6, 7]], expected: 12 },
    { args: [[7, 6, 5, 4, 3, 2, 1]], expected: 12 },
    { args: [[5, 5, 5, 5, 5]], expected: 20 },
    { args: [[1, 2, 1]], expected: 2 },
    { args: [[2, 1, 2]], expected: 4 },
    { args: [[1, 3, 2, 5, 25, 24, 5]], expected: 24 },
    { args: [[0, 0, 0, 0, 1]], expected: 0 },
    { args: [[10000, 1, 10000]], expected: 20000 },
    { args: [[6, 4, 8, 1, 8, 2, 3, 5, 9, 1]], expected: 48 },
    {
      args: [Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 10000 : 0))],
      expected: 999980000,
    },
    {
      args: [Array.from({ length: 100000 }, (_, i) => i + 1)],
      expected: 2500000000,
    },
  ],
  source: { origin: "leetcode", frontendId: "11", acRate: 0.600335829385651, confidence: 0.97 },
  solutions: [
    {
      name: "Two pointers",
      explanation: `Start with the widest possible container — pointers at both ends. Its area is \`min(height[left], height[right]) * (right - left)\`.

Any move inward shrinks the width, so it's only worth moving if the new line can be taller. The shorter of the two lines is the binding constraint, so advance whichever pointer is shorter (ties: either works) and recompute, tracking the maximum.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    if (area > best) best = area;
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`,
        typescript: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    if (area > best) best = area;
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`,
      },
    },
  ],
});
