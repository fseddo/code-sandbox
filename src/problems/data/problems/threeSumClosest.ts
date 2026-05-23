import { defineAlgoProblem } from "../problem";

export const threeSumClosest = defineAlgoProblem<[number[], number], number>({
  id: "3sum-closest",
  number: 26,
  title: "3Sum Closest",
  difficulty: "medium",
  tags: ["array", "two-pointers", "sorting"],
  functionName: "threeSumClosest",
  prompt: `Given an integer array \`nums\` of length at least 3 and an integer \`target\`, pick exactly three distinct elements whose sum is as close to \`target\` as possible.

Return that closest sum. The input is guaranteed to have exactly one such closest sum.`,
  constraints: [
    "3 <= nums.length <= 500",
    "-1000 <= nums[i] <= 1000",
    "-10^4 <= target <= 10^4",
    "Exactly one closest sum exists.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function threeSumClosest(nums, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function threeSumClosest(nums: number[], target: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "basic",
      args: [[-1, 2, 1, -4], 1],
      expected: 2,
      explanation: "The closest sum is (-1) + 2 + 1 = 2, which is 1 away from the target.",
    },
    {
      name: "all same",
      args: [[0, 0, 0], 1],
      expected: 0,
      explanation: "The only triple sums to 0.",
    },
    {
      name: "exact hit",
      args: [[1, 1, 1, 0], -100],
      expected: 2,
      explanation: "The smallest possible triple sum, 1 + 1 + 0 = 2, is the closest you can get to -100.",
    },
  ],
  hiddenTests: [
    // Boundary: minimal length
    { args: [[1, 2, 3], 4], expected: 6 },
    { args: [[-5, -4, -3], -10], expected: -12 },
    // Exact target reachable
    { args: [[0, 1, 2, 3, 4], 6], expected: 6 },
    { args: [[-3, -2, -1, 0, 1, 2], 0], expected: 0 },
    // Negatives and target below all-min
    { args: [[-1, -1, -1, -1], -3], expected: -3 },
    { args: [[-100, -50, -25, 10], -1000], expected: -175 },
    // Target above all-max (answer is the three largest)
    { args: [[1, 2, 3, 4, 5], 1000], expected: 12 },
    // Duplicates with a tie-free closest
    { args: [[2, 2, 2, 2, 2], 7], expected: 6 },
    // Mixed sign, closest is negative side
    { args: [[-4, -1, 1, 2], -3], expected: -3 },
    // Closest sits just below vs just above target — picks nearer
    { args: [[1, 1, 1, 1], 0], expected: 3 },
    { args: [[10, 20, 30, 40, 50], 93], expected: 90 },
    // Larger spread, single best
    { args: [[-8, -5, -3, 1, 4, 7, 12], 6], expected: 6 },
    // Anti-hardcode: unlike any example, off-by-one closest
    { args: [[5, -2, 9, -7, 3, 1, -4], 8], expected: 8 },
    { args: [[13, -19, 7, 22, -5, 0, 11], 3], expected: 3 },
    // Scale: 500 elements, distinct closest. Sorted ascending values -250..249.
    {
      args: [Array.from({ length: 500 }, (_, i) => i - 250), 7],
      expected: 7,
    },
    {
      args: [Array.from({ length: 500 }, (_, i) => (i - 250) * 4), 5],
      expected: 4,
    },
  ],
  source: { origin: "leetcode", frontendId: "16", acRate: 0.48564456075771284, confidence: 0.95 },
  solutions: [
    {
      name: "Sort + two pointers",
      explanation: `Sort the array. Fix the first element \`nums[i]\`, then sweep the remaining range with two pointers \`lo\`/\`hi\`: each \`nums[i] + nums[lo] + nums[hi]\` is a candidate sum. If the sum is below \`target\` advance \`lo\` (need bigger), if above retreat \`hi\` (need smaller), and track the candidate with the smallest absolute distance to \`target\` throughout. An exact hit returns immediately.

\`O(n²)\` time (one pointer sweep per fixed \`i\`), \`O(1)\` extra space beyond the sort.`,
      code: {
        javascript: `function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let best = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let lo = i + 1;
    let hi = nums.length - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
      if (sum === target) return sum;
      if (sum < target) lo++;
      else hi--;
    }
  }
  return best;
}`,
        typescript: `function threeSumClosest(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  let best = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let lo = i + 1;
    let hi = nums.length - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
      if (sum === target) return sum;
      if (sum < target) lo++;
      else hi--;
    }
  }
  return best;
}`,
      },
    },
  ],
});
