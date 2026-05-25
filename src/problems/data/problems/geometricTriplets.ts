import { defineAlgoProblem } from "../problem";

export const geometricTriplets = defineAlgoProblem<[number[], number], number>({
  id: "geometric-sequence-triplets",
  number: 108,
  title: "Geometric Sequence Triplets",
  difficulty: "medium",
  tags: ["array", "hash-table"],
  functionName: "geometricTriplets",
  prompt: `Given an array of integers \`nums\` and an integer \`r\`, count the **index triplets** \`(i, j, k)\` with \`i < j < k\` that form a geometric progression with common ratio \`r\` — that is, \`nums[j] === nums[i] * r\` **and** \`nums[k] === nums[j] * r\`.

Triplets are counted per index combination, so equal values at different positions produce distinct triplets. Return the total count.`,
  constraints: [
    "1 <= nums.length <= 10^5",
    "1 <= nums[i] <= 10^9",
    "1 <= r <= 10^9",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} r
 * @return {number}
 */
function geometricTriplets(nums, r) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} r
 * @return {number}
 */
function geometricTriplets(nums: number[], r: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "ratio 2 with repeats",
      args: [[2, 1, 2, 4, 8, 8], 2],
      expected: 5,
      explanation:
        "With middle value 4 (index 3): left has two 2s (indices 0, 2) and right has two 8s (indices 4, 5) → 2×2 = 4 triplets. With middle value 2 (index 2): left has one 1 (index 1) and right has one 4 (index 3) → 1 triplet. Total 5.",
    },
    {
      name: "all equal, ratio 1",
      args: [[1, 1, 1, 1], 1],
      expected: 4,
      explanation: "When r = 1 every i < j < k of equal values qualifies: C(4, 3) = 4.",
    },
    {
      name: "no valid triplet",
      args: [[1, 2, 4], 1],
      expected: 0,
      explanation: "With r = 1 the three values would all have to be equal; they aren't.",
    },
  ],
  hiddenTests: [
    { name: "too short", args: [[1, 2], 2], expected: 0 },
    { name: "single element", args: [[5], 3], expected: 0 },
    { name: "empty-ish min length", args: [[7], 1], expected: 0 },
    { name: "exactly three, ratio 1", args: [[5, 5, 5], 1], expected: 1 },
    { name: "exactly three, ratio match", args: [[2, 4, 8], 2], expected: 1 },
    { name: "ratio mismatch", args: [[2, 4, 8], 3], expected: 0 },
    { name: "pure powers chain", args: [[1, 3, 9, 27, 81], 3], expected: 3 },
    { name: "single chain ratio 2", args: [[1, 2, 4, 8, 16], 2], expected: 3 },
    { name: "overlapping repeats", args: [[3, 6, 12, 6, 12, 24], 2], expected: 6 },
    { name: "repeated middle, ratio 5", args: [[1, 5, 5, 5, 25], 5], expected: 3 },
    { name: "all same, ratio 1", args: [[7, 7, 7, 7, 7], 1], expected: 10 },
    { name: "non-divisible guard", args: [[1000000000, 1, 2], 1], expected: 0 },
    { name: "anti-hardcode large values", args: [[100, 300, 900, 300, 900, 2700], 3], expected: 6 },
    { name: "scale repeated pattern", args: [Array.from({ length: 900 }, (_, i) => [1, 2, 4][i % 3]), 2], expected: 4545100 },
    { name: "scale cycling powers", args: [Array.from({ length: 30000 }, (_, i) => 1 << (i % 4)), 2], expected: 140681255000 },
  ],
  source: { origin: "authored", confidence: 0.85 },
  solutions: [
    {
      name: "Two frequency maps (middle pivot)",
      explanation: `Fix \`nums[j]\` as the **middle** of the triplet. A valid triplet needs a left element equal to \`nums[j] / r\` somewhere before \`j\`, and a right element equal to \`nums[j] * r\` somewhere after \`j\`. The count of triplets centered on \`j\` is therefore \`(# of nums[j]/r on the left) × (# of nums[j]*r on the right)\`.

Maintain two frequency maps: \`left\` (values strictly before \`j\`) and \`right\` (values strictly after \`j\`). Initialize \`right\` with every value, then sweep \`j\` left to right — before counting, remove \`nums[j]\` from \`right\`; after counting, add it to \`left\`. Because values can exceed \`r\`'s multiples, only the integer-exact \`nums[j] / r\` matters, so guard with \`nums[j] % r === 0\`.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function geometricTriplets(nums, r) {
  // left counts values already passed; right counts values still ahead of the middle.
  const left = new Map();
  const right = new Map();
  // Seed right with the whole array, so before the sweep every value is "ahead".
  for (const value of nums) right.set(value, (right.get(value) || 0) + 1);

  let count = 0;
  // Treat each element as the middle of a triplet, sweeping left to right.
  for (const mid of nums) {
    // mid is the current middle element: drop it from the "after" side first.
    right.set(mid, right.get(mid) - 1);
    // The left partner must be the exact integer mid / r, else no partner can match.
    if (mid % r === 0) {
      // How many valid left partners (mid / r) and right partners (mid * r) exist.
      const leftCount = left.get(mid / r) || 0;
      const rightCount = right.get(mid * r) || 0;
      // Every left partner pairs with every right partner — that's the product.
      count += leftCount * rightCount;
    }
    // Done with mid as a middle: it now becomes a candidate left partner.
    left.set(mid, (left.get(mid) || 0) + 1);
  }
  return count;
}`,
        typescript: `function geometricTriplets(nums: number[], r: number): number {
  // left counts values already passed; right counts values still ahead of the middle.
  const left = new Map<number, number>();
  const right = new Map<number, number>();
  // Seed right with the whole array, so before the sweep every value is "ahead".
  for (const value of nums) right.set(value, (right.get(value) || 0) + 1);

  let count = 0;
  // Treat each element as the middle of a triplet, sweeping left to right.
  for (const mid of nums) {
    // mid is the current middle element: drop it from the "after" side first.
    right.set(mid, right.get(mid)! - 1);
    // The left partner must be the exact integer mid / r, else no partner can match.
    if (mid % r === 0) {
      // How many valid left partners (mid / r) and right partners (mid * r) exist.
      const leftCount = left.get(mid / r) || 0;
      const rightCount = right.get(mid * r) || 0;
      // Every left partner pairs with every right partner — that's the product.
      count += leftCount * rightCount;
    }
    // Done with mid as a middle: it now becomes a candidate left partner.
    left.set(mid, (left.get(mid) || 0) + 1);
  }
  return count;
}`,
      },
    },
  ],
});
