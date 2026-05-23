import { defineAlgoProblem } from "../problem";

export const trap = defineAlgoProblem<[number[]], number>({
  id: "trapping-rain-water",
  number: 51,
  title: "Trapping Rain Water",
  difficulty: "hard",
  tags: ["array", "two-pointers", "dynamic-programming", "stack", "monotonic-stack"],
  functionName: "trap",
  prompt: `You are given an array \`height\` where \`height[i]\` is the height of a vertical bar of unit width at position \`i\`. Together the bars form an elevation map.

After it rains, water collects in the dips between taller bars. Return the **total units of water** that can be trapped.

Water sits above position \`i\` only up to the lower of the tallest bar to its left and the tallest bar to its right; the amount at \`i\` is \`min(maxLeft, maxRight) - height[i]\` when positive, else \`0\`.`,
  constraints: ["1 <= height.length <= 2 * 10^4", "0 <= height[i] <= 10^5"],
  starterCode: {
    javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height: number[]): number {
  // your code here
}`,
  },
  examples: [
    { name: "classic", args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, explanation: "The dips between the bars hold 6 units of water in total." },
    { name: "wider basin", args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
    { name: "no water", args: [[1, 2, 3, 4, 5]], expected: 0, explanation: "A strictly increasing profile traps nothing." },
  ],
  hiddenTests: [
    { args: [[5]], expected: 0 },
    { args: [[1, 2]], expected: 0 },
    { args: [[3, 0, 3]], expected: 3 },
    { args: [[2, 0, 2]], expected: 2 },
    { args: [[0, 0, 0]], expected: 0 },
    { args: [[5, 5, 5, 5]], expected: 0 },
    { args: [[5, 4, 3, 2, 1]], expected: 0 },
    { args: [[5, 4, 1, 2]], expected: 1 },
    { args: [[4, 2, 3]], expected: 1 },
    { args: [[0, 7, 1, 4, 6]], expected: 7 },
    { args: [[1, 0, 1, 0, 1]], expected: 2 },
    { args: [[100000, 0, 100000]], expected: 100000 },
    { args: [Array.from({ length: 20000 }, (_, i) => (i === 0 || i === 19999 ? 100000 : i % 2 === 0 ? 0 : 1))], expected: 1999790001 },
    { args: [Array.from({ length: 20000 }, (_, i) => (i < 10000 ? 100000 - i : 100000 - (19999 - i)))], expected: 99990000 },
    { args: [Array.from({ length: 20000 }, () => 50000)], expected: 0 },
    { args: [Array.from({ length: 20000 }, (_, i) => i + 1)], expected: 0 },
  ],
  source: { origin: "leetcode", frontendId: "42", acRate: 0.6735584393054864, confidence: 0.96 },
  solutions: [
    {
      name: "Two pointers",
      explanation: `Walk inward from both ends, tracking the tallest bar seen so far on the left (\`leftMax\`) and right (\`rightMax\`). Advance whichever side currently has the shorter bar: for that position the smaller of the two running maxima is the controlling wall, so the water above it is \`runningMax - height\`. Because you only move the shorter side, the chosen running max is provably the true bounding wall.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let total = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      total += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`,
        typescript: `function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let total = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      total += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`,
      },
    },
  ],
});
