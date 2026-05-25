import { defineAlgoProblem } from "../problem";

export const nextLargerToRight = defineAlgoProblem<[number[]], number[]>({
  id: "next-larger-element",
  number: 116,
  title: "Next Larger Element",
  difficulty: "medium",
  tags: ["array", "stack", "monotonic-stack"],
  functionName: "nextLargerToRight",
  prompt: `Given an integer array \`nums\`, return an array \`answer\` of the same length where \`answer[i]\` is the **next larger element** to the right of \`nums[i]\`.

The next larger element of \`nums[i]\` is the first value that appears *after* index \`i\` and is strictly greater than \`nums[i]\`. If no such value exists, \`answer[i]\` is \`-1\`.`,
  constraints: [
    "0 <= nums.length <= 10^5",
    "-10^9 <= nums[i] <= 10^9",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function nextLargerToRight(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function nextLargerToRight(nums: number[]): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "mixed", args: [[2, 1, 2, 4, 3]], expected: [4, 2, 4, -1, -1], explanation: "2 is answered by the later 4; 1 by the 2 to its right; 4 and the trailing 3 have nothing larger ahead." },
    { name: "decreasing", args: [[5, 4, 3, 2, 1]], expected: [-1, -1, -1, -1, -1], explanation: "Every element is larger than everything to its right, so none has a next-larger." },
    { name: "increasing", args: [[1, 3, 2, 4]], expected: [3, 4, 4, -1] },
  ],
  hiddenTests: [
    { args: [[]], expected: [] },
    { args: [[7]], expected: [-1] },
    { args: [[7, 7, 7]], expected: [-1, -1, -1] },
    { args: [[1, 2, 3, 4]], expected: [2, 3, 4, -1] },
    { args: [[4, 3, 2, 1]], expected: [-1, -1, -1, -1] },
    { args: [[2, 7, 3, 5, 4, 6, 8]], expected: [7, 8, 5, 6, 6, 8, -1] },
    { args: [[-5, -2, -8, -1]], expected: [-2, -1, -1, -1] },
    { args: [[1, 1, 2, 1, 1, 3]], expected: [2, 2, 3, 3, 3, -1] },
    { args: [[10, 9, 11, 8, 12]], expected: [11, 11, 12, 12, -1] },
    { args: [[3, 3, 3, 4]], expected: [4, 4, 4, -1] },
    { args: [[1000000000, -1000000000, 0]], expected: [-1, 0, -1] },
    { args: [[5, 1, 4, 2, 3]], expected: [-1, 4, -1, 3, -1] },
    // Scale: strictly decreasing ramp of 10^5 — every answer is -1; only an O(n) stack survives.
    { args: [Array.from({ length: 100000 }, (_, i) => 100000 - i)], expected: Array.from({ length: 100000 }, () => -1) },
    // Scale: strictly increasing ramp of 10^5 — each answer is the next value, last is -1.
    {
      args: [Array.from({ length: 100000 }, (_, i) => i + 1)],
      expected: Array.from({ length: 100000 }, (_, i) => (i === 99999 ? -1 : i + 2)),
    },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "Monotonic decreasing stack",
      explanation: `Keep a stack of *indices* whose values are still waiting for a larger element to their right, ordered so their values strictly decrease down the stack. Walk left to right: while the current value is greater than the value at the index on top of the stack, that index has just found its next-larger element — pop it and record the current value. Then push the current index.

Each index is pushed and popped at most once, so the scan is \`O(n)\`. Any indices left on the stack at the end never found a larger element and keep their \`-1\`.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function nextLargerToRight(nums) {
  const answer = new Array(nums.length).fill(-1);
  const stack = []; // indices whose next-larger is still unknown
  for (let i = 0; i < nums.length; i++) {
    // Current value resolves every smaller value waiting on the stack.
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      answer[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return answer;
}`,
        typescript: `function nextLargerToRight(nums: number[]): number[] {
  const answer: number[] = new Array(nums.length).fill(-1);
  const stack: number[] = []; // indices whose next-larger is still unknown
  for (let i = 0; i < nums.length; i++) {
    // Current value resolves every smaller value waiting on the stack.
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      answer[stack.pop()!] = nums[i];
    }
    stack.push(i);
  }
  return answer;
}`,
      },
    },
  ],
});
