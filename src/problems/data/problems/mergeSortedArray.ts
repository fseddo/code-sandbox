import { defineAlgoProblem } from "../problem";

// In-place: the solution merges nums2 into nums1 and returns that same array. The checker reads the
// post-call args, asserts the returned value is the same instance as nums1, and matches `expected`.
export const mergeSortedArray = defineAlgoProblem<[number[], number, number[], number], number[]>({
  id: "merge-sorted-array",
  number: 94,
  title: "Merge Sorted Array",
  difficulty: "easy",
  tags: ["array", "two-pointers", "sorting"],
  functionName: "merge",
  prompt: `You are given two integer arrays \`nums1\` and \`nums2\`, each sorted in non-decreasing order, plus two integers \`m\` and \`n\` giving the number of meaningful elements in each.

\`nums1\` has length \`m + n\`: its first \`m\` slots hold the elements to merge, and the final \`n\` slots are zero placeholders to be overwritten. Merge \`nums2\` into \`nums1\` so that \`nums1\` ends up sorted in non-decreasing order. Do it **in place** — mutate \`nums1\` directly and return that same array (do not allocate a new one).`,
  constraints: [
    "nums1.length == m + n",
    "nums2.length == n",
    "0 <= m, n <= 200",
    "1 <= m + n <= 200",
    "-10^9 <= nums1[i], nums2[i] <= 10^9",
  ],
  checker: `(actual, args, expected) => {
    const nums1 = args[0];
    if (actual !== nums1) return false;
    if (nums1.length !== expected.length) return false;
    return nums1.every((value, index) => value === expected[index]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {number[]} nums1, merged in place
 */
function merge(nums1, m, nums2, n) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {number[]} nums1, merged in place
 */
function merge(nums1: number[], m: number, nums2: number[], n: number): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "interleave", args: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6], explanation: "Merge [1,2,3] and [2,5,6] in place." },
    { name: "empty nums2", args: [[1], 1, [], 0], expected: [1] },
    { name: "empty nums1", args: [[0], 0, [1], 1], expected: [1], explanation: "nums1 has m=0 real elements; just copy nums2 in." },
  ],
  hiddenTests: [
    { args: [[0], 0, [1], 1], expected: [1] },
    { args: [[2, 0], 1, [1], 1], expected: [1, 2] },
    { args: [[1, 0], 1, [2], 1], expected: [1, 2] },
    { args: [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], expected: [1, 2, 3, 4, 5, 6] },
    { args: [[1, 2, 3, 0, 0, 0], 3, [4, 5, 6], 3], expected: [1, 2, 3, 4, 5, 6] },
    { args: [[2, 2, 2, 0, 0, 0], 3, [2, 2, 2], 3], expected: [2, 2, 2, 2, 2, 2] },
    { args: [[-3, -1, 0, 0, 0], 2, [-2, 4, 6], 3], expected: [-3, -2, -1, 4, 6] },
    { args: [[0, 0, 0], 0, [1, 2, 3], 3], expected: [1, 2, 3] },
    { args: [[5, 5, 5], 3, [], 0], expected: [5, 5, 5] },
    { args: [[1, 5, 9, 0, 0], 3, [2, 6], 2], expected: [1, 2, 5, 6, 9] },
    { args: [[-1000000000, 0, 0], 1, [-1, 1000000000], 2], expected: [-1000000000, -1, 1000000000] },
    { args: [[1, 1, 1, 0, 0, 0], 3, [1, 1, 1], 3], expected: [1, 1, 1, 1, 1, 1] },
    { args: [[3, 0], 1, [1], 1], expected: [1, 3] },
    // Scale: m + n == 200, two interleaved halves.
    {
      args: [
        [...Array.from({ length: 100 }, (_, i) => 2 * i), ...Array.from({ length: 100 }, () => 0)],
        100,
        Array.from({ length: 100 }, (_, i) => 2 * i + 1),
        100,
      ],
      expected: Array.from({ length: 200 }, (_, i) => i),
    },
  ],
  source: { origin: "leetcode", frontendId: "88", acRate: 0.5484516812426773, confidence: 0.95 },
  solutions: [
    {
      name: "Merge from the back",
      explanation: `Fill \`nums1\` from its last slot backward. Compare the largest unmerged element of each array (\`nums1[i]\` and \`nums2[j]\`, pointers starting at \`m-1\` and \`n-1\`) and place the larger at \`nums1[k]\`, decrementing \`k\`. Working back-to-front means we only ever overwrite slots we've already consumed, so no element is clobbered before it's placed. Any leftover \`nums2\` elements are copied in; leftover \`nums1\` elements are already in place.

\`O(m + n)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function merge(nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
  return nums1;
}`,
        typescript: `function merge(nums1: number[], m: number, nums2: number[], n: number): number[] {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
  return nums1;
}`,
      },
    },
  ],
});
