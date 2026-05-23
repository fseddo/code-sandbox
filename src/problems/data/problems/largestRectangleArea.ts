import { defineAlgoProblem } from "../problem";

export const largestRectangleArea = defineAlgoProblem<[number[]], number>({
  id: "largest-rectangle-in-histogram",
  number: 90,
  title: "Largest Rectangle in Histogram",
  difficulty: "hard",
  tags: ["array", "stack", "monotonic-stack"],
  functionName: "largestRectangleArea",
  prompt: `Given an array \`heights\` representing the bar heights of a histogram where each bar has width \`1\`, return the area of the largest rectangle that can be formed within the histogram.

The rectangle must be axis-aligned and bounded above by the bars: a rectangle of height \`h\` spanning a contiguous range of bars is valid only if every bar in that range is at least \`h\` tall.`,
  constraints: [
    "1 <= heights.length <= 10^5",
    "0 <= heights[i] <= 10^4",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} heights
 * @return {number}
 */
function largestRectangleArea(heights) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} heights
 * @return {number}
 */
function largestRectangleArea(heights: number[]): number {
  // your code here
}`,
  },
  examples: [
    { name: "classic", args: [[2, 1, 5, 6, 2, 3]], expected: 10, explanation: "Bars of height 5 and 6 over width 2 give area 10." },
    { name: "two bars", args: [[2, 4]], expected: 4, explanation: "The single bar of height 4 (width 1) beats the width-2 rectangle of height 2." },
    { name: "single", args: [[5]], expected: 5 },
  ],
  hiddenTests: [
    { args: [[0]], expected: 0 },
    { args: [[1, 1, 1, 1]], expected: 4 },
    { args: [[4, 3, 2, 1]], expected: 6 },
    { args: [[1, 2, 3, 4]], expected: 6 },
    { args: [[2, 1, 2]], expected: 3 },
    { args: [[6, 2, 5, 4, 5, 1, 6]], expected: 12 },
    { args: [[0, 0, 0]], expected: 0 },
    { args: [[3, 3, 3, 3, 3]], expected: 15 },
    { args: [[1, 0, 1, 0, 1]], expected: 1 },
    { args: [[5, 4, 3, 2, 1, 0]], expected: 9 },
    { args: [[2, 1, 5, 6, 2, 3, 1, 4, 5, 2]], expected: 10 },
    { args: [[10000]], expected: 10000 },
    { args: [[1, 2, 3, 4, 5, 4, 3, 2, 1]], expected: 15 },
    { args: [[4, 2, 0, 3, 2, 5]], expected: 6 },
    // Scale: 10^5 bars, all equal — area is n * height; only an O(n) stack survives.
    { args: [Array.from({ length: 100000 }, () => 1)], expected: 100000 },
    // Scale: increasing ramp of 10^5 bars — largest rectangle anchors at the back.
    { args: [Array.from({ length: 100000 }, (_, i) => i + 1)], expected: 2500050000 },
  ],
  source: { origin: "leetcode", frontendId: "84", acRate: 0.49896235040789494, confidence: 0.92 },
  solutions: [
    {
      name: "Monotonic increasing stack",
      explanation: `Maintain a stack of bar indices whose heights are non-decreasing. Walk left to right; when the current bar is shorter than the bar on top of the stack, that top bar can't extend further right, so pop it and compute the rectangle it bounds: its height times the width between the new stack top (exclusive) and the current index (exclusive). A sentinel height of \`0\` appended at the end flushes the stack.

Each bar is pushed and popped once, so \`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function largestRectangleArea(heights) {
  const stack = [];
  let best = 0;
  const n = heights.length;
  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i];
    while (stack.length > 0 && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      const left = stack.length === 0 ? -1 : stack[stack.length - 1];
      const width = i - left - 1;
      if (height * width > best) best = height * width;
    }
    stack.push(i);
  }
  return best;
}`,
        typescript: `function largestRectangleArea(heights: number[]): number {
  const stack: number[] = [];
  let best = 0;
  const n = heights.length;
  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i];
    while (stack.length > 0 && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()!];
      const left = stack.length === 0 ? -1 : stack[stack.length - 1];
      const width = i - left - 1;
      if (height * width > best) best = height * width;
    }
    stack.push(i);
  }
  return best;
}`,
      },
    },
  ],
});
