import { defineProblem } from "../problem";

export const twoSum = defineProblem<[number[], number], number[]>({
  id: "two-sum",
  title: "Two Sum",
  difficulty: "easy",
  functionName: "twoSum",
  prompt: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

Each input has exactly one solution, and you may not use the same element twice. Return the indices in ascending order.`,
  starterCode: {
    javascript: `function twoSum(nums, target) {
  // your code here
}`,
    typescript: `function twoSum(nums: number[], target: number): number[] {
  // your code here
}`,
  },
  tests: [
    { name: "basic", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { name: "middle pair", args: [[3, 2, 4], 6], expected: [1, 2] },
    { name: "duplicates", args: [[3, 3], 6], expected: [0, 1] },
    { name: "negatives", args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
  ],
});
