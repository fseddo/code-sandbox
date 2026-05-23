import { defineAlgoProblem } from "../problem";

export const findMedianSortedArrays = defineAlgoProblem<[number[], number[]], number>({
  id: "median-of-two-sorted-arrays",
  number: 4,
  title: "Median of Two Sorted Arrays",
  difficulty: "hard",
  tags: ["array", "binary-search", "divide-and-conquer"],
  functionName: "findMedianSortedArrays",
  prompt: `Given two arrays \`nums1\` and \`nums2\`, each sorted in non-decreasing order, return the median of the combined collection of all their elements.

The median is the middle value once every element from both arrays is merged into one sorted sequence. When the total number of elements is odd, it is the single middle value; when it is even, it is the average of the two middle values. The result is a floating-point number.`,
  constraints: [
    "0 <= nums1.length, nums2.length <= 1000",
    "1 <= nums1.length + nums2.length",
    "-10^6 <= nums1[i], nums2[i] <= 10^6",
    "Both nums1 and nums2 are sorted in non-decreasing order.",
  ],
  starterCode: {
    javascript: `function findMedianSortedArrays(nums1, nums2) {
  // your code here
}`,
    typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "odd total",
      args: [[1, 3], [2]],
      expected: 2,
      explanation: "Merged: [1, 2, 3]. The middle value is 2.",
    },
    {
      name: "even total",
      args: [[1, 2], [3, 4]],
      expected: 2.5,
      explanation: "Merged: [1, 2, 3, 4]. The two middle values are 2 and 3, averaged to 2.5.",
    },
    {
      name: "one array empty",
      args: [[], [1, 2, 3, 4]],
      expected: 2.5,
      explanation: "Merged: [1, 2, 3, 4]. The average of 2 and 3 is 2.5.",
    },
    {
      name: "single element",
      args: [[5], []],
      expected: 5,
      explanation: "Only one element, so it is the median.",
    },
  ],
  hiddenTests: [
    { args: [[1], [2]], expected: 1.5 },
    { args: [[2], [1]], expected: 1.5 },
    { args: [[], [3]], expected: 3 },
    { args: [[7], []], expected: 7 },
    { args: [[-5, -3, -1], [-4, -2, 0]], expected: -2.5 },
    { args: [[2, 2, 2], [2, 2, 2]], expected: 2 },
    { args: [[1, 1], [1, 1]], expected: 1 },
    { args: [[-10, 10], [-10, 10]], expected: 0 },
    { args: [[1, 2, 3], [1, 2, 3]], expected: 2 },
    { args: [[1, 2, 3], [100, 200, 300]], expected: 51.5 },
    { args: [[100, 200, 300], [1, 2, 3]], expected: 51.5 },
    { args: [[1, 5, 9], [2, 6, 10]], expected: 5.5 },
    { args: [[1, 2, 3, 4, 5, 6], [7]], expected: 4 },
    { args: [[7], [1, 2, 3, 4, 5, 6]], expected: 4 },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8], [4, 4]], expected: 4 },
    { args: [[-1000000, 0, 1000000], [-500, 500]], expected: 0 },
    { args: [[3, 8, 12, 15], [1, 4, 9, 20]], expected: 8.5 },
    { args: [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1]], expected: 0.5 },
    { args: [Array.from({ length: 1000 }, (_, i) => 2 * i), Array.from({ length: 1000 }, (_, i) => 2 * i + 1)], expected: 999.5 },
    { args: [Array.from({ length: 999 }, (_, i) => i), Array.from({ length: 1000 }, (_, i) => 1000 + i)], expected: 1000 },
  ],
  source: {
    origin: "leetcode",
    frontendId: "4",
    acRate: 0.46556857242184946,
    confidence: 0.88,
  },
  solutions: [
    {
      name: "Merge and pick the middle",
      explanation: `Merge the two sorted arrays with a two-pointer walk, advancing whichever side has the smaller front element. Stop once you have collected just past the middle index, then read the middle one (odd total) or average the two middle ones (even total).

\`O(m + n)\` time, \`O(m + n)\` space — straightforward and correct, though it doesn't hit the \`O(log(m + n))\` target the problem is known for.`,
      code: {
        javascript: `function findMedianSortedArrays(nums1, nums2) {
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) merged.push(nums1[i++]);
    else merged.push(nums2[j++]);
  }
  while (i < nums1.length) merged.push(nums1[i++]);
  while (j < nums2.length) merged.push(nums2[j++]);

  const n = merged.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? merged[mid] : (merged[mid - 1] + merged[mid]) / 2;
}`,
        typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  const merged: number[] = [];
  let i = 0;
  let j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) merged.push(nums1[i++]);
    else merged.push(nums2[j++]);
  }
  while (i < nums1.length) merged.push(nums1[i++]);
  while (j < nums2.length) merged.push(nums2[j++]);

  const n = merged.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? merged[mid] : (merged[mid - 1] + merged[mid]) / 2;
}`,
      },
    },
    {
      name: "Binary search on the partition",
      explanation: `Binary-search the smaller array for a partition that splits both arrays so every element on the left is <= every element on the right and the two halves have equal size (or the left is one larger). At the correct cut, the median comes from the boundary values \`maxLeft\` and \`minRight\`. Sentinels (\`-Infinity\` / \`+Infinity\`) handle empty halves.

\`O(log(min(m, n)))\` time, \`O(1)\` space — the optimal solution the problem targets.`,
      code: {
        javascript: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length;
  const n = nums2.length;
  const half = Math.floor((m + n + 1) / 2);
  let lo = 0;
  let hi = m;
  while (lo <= hi) {
    const cut1 = Math.floor((lo + hi) / 2);
    const cut2 = half - cut1;
    const left1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
    const right1 = cut1 === m ? Infinity : nums1[cut1];
    const left2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
    const right2 = cut2 === n ? Infinity : nums2[cut2];
    if (left1 <= right2 && left2 <= right1) {
      const maxLeft = Math.max(left1, left2);
      if ((m + n) % 2 === 1) return maxLeft;
      const minRight = Math.min(right1, right2);
      return (maxLeft + minRight) / 2;
    }
    if (left1 > right2) hi = cut1 - 1;
    else lo = cut1 + 1;
  }
  return 0;
}`,
        typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length;
  const n = nums2.length;
  const half = Math.floor((m + n + 1) / 2);
  let lo = 0;
  let hi = m;
  while (lo <= hi) {
    const cut1 = Math.floor((lo + hi) / 2);
    const cut2 = half - cut1;
    const left1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
    const right1 = cut1 === m ? Infinity : nums1[cut1];
    const left2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
    const right2 = cut2 === n ? Infinity : nums2[cut2];
    if (left1 <= right2 && left2 <= right1) {
      const maxLeft = Math.max(left1, left2);
      if ((m + n) % 2 === 1) return maxLeft;
      const minRight = Math.min(right1, right2);
      return (maxLeft + minRight) / 2;
    }
    if (left1 > right2) hi = cut1 - 1;
    else lo = cut1 + 1;
  }
  return 0;
}`,
      },
    },
  ],
});
