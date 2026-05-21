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
  hiddenTests: [
    { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
    { args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
    { args: [[5, 75, 25], 100], expected: [1, 2] },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8], 15], expected: [6, 7] },
  ],
  solutions: [
    {
      name: "Brute force",
      explanation: `Check every pair \`(i, j)\` with \`i < j\` and return the first whose values sum to \`target\`. Iterating \`i < j\` keeps the indices ascending for free.

\`O(n²)\` time, \`O(1)\` space — simple, but quadratic on large inputs.`,
      code: {
        javascript: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
      },
    },
    {
      name: "Hash map (one pass)",
      explanation: `Walk the array once, keeping a map of \`value → index\` seen so far. For each \`nums[i]\`, the partner you need is \`target - nums[i]\`; if it's already in the map you've found the pair. The stored index is earlier, so \`[seen, i]\` is ascending.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [];
}`,
      },
    },
  ],
});
