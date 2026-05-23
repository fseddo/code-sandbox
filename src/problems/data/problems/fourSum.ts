import { defineAlgoProblem } from "../problem";

// Quadruplets may come back in any order, and the four values within each may be in any order, so
// deep-equal on one fixed nesting would wrongly fail a correct solution. The `checker` normalizes
// both sides — sort within each quadruplet, then sort the list of quadruplets — before comparing.
export const fourSum = defineAlgoProblem<[number[], number], number[][]>({
  id: "4sum",
  number: 28,
  title: "4Sum",
  difficulty: "medium",
  tags: ["array", "two-pointers", "sorting"],
  functionName: "fourSum",
  prompt: `Given an array of integers \`nums\` and an integer \`target\`, return all **unique** quadruplets \`[nums[a], nums[b], nums[c], nums[d]]\` such that:

- \`a\`, \`b\`, \`c\`, and \`d\` are four **distinct** indices, and
- \`nums[a] + nums[b] + nums[c] + nums[d] === target\`.

Two quadruplets are the same if they contain the same four values (counting multiplicity), regardless of order — return each distinct value-combination once. The quadruplets, and the values within each quadruplet, may be returned in any order.`,
  constraints: [
    "1 <= nums.length <= 200",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "The four-element sum may exceed 32-bit integer range; use regular JS numbers, which hold it exactly here.",
  ],
  checker: `(actual, args, expected) => {
  if (!Array.isArray(actual)) return false;
  const norm = (quads) => {
    if (!Array.isArray(quads)) return null;
    const rows = [];
    for (const q of quads) {
      if (!Array.isArray(q) || q.length !== 4) return null;
      rows.push([...q].sort((a, b) => a - b));
    }
    rows.sort((x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2] || x[3] - y[3]);
    return rows;
  };
  const a = norm(actual);
  const e = norm(expected);
  if (a === null || e === null) return false;
  if (a.length !== e.length) return false;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < 4; j++) if (a[i][j] !== e[i][j]) return false;
  }
  return true;
}`,
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
function fourSum(nums, target) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
function fourSum(nums: number[], target: number): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "basic",
      args: [[1, 0, -1, 0, -2, 2], 0],
      expected: [
        [-2, -1, 1, 2],
        [-2, 0, 0, 2],
        [-1, 0, 0, 1],
      ],
      explanation: "Three distinct value-combinations sum to 0.",
    },
    {
      name: "repeated values",
      args: [[2, 2, 2, 2, 2], 8],
      expected: [[2, 2, 2, 2]],
      explanation: "Only one unique quadruplet exists even though many index choices work.",
    },
    {
      name: "no answer",
      args: [[1, 2, 3, 4], 100],
      expected: [],
    },
  ],
  hiddenTests: [
    // boundary: fewer than 4 elements can't form a quadruplet
    { args: [[1], 1], expected: [] },
    { args: [[1, 2, 3], 6], expected: [] },
    // boundary: exactly four elements, hit and miss
    { args: [[0, 0, 0, 0], 0], expected: [[0, 0, 0, 0]] },
    { args: [[1, 2, 3, 4], 11], expected: [] },
    // edge: all same value, no valid sum
    { args: [[5, 5, 5, 5], 21], expected: [] },
    // edge: negatives and positives mixing to target
    { args: [[-3, -1, 0, 2, 4, 5], 2], expected: [[-3, -1, 2, 4]] },
    // edge: duplicates producing one combo from many index sets
    { args: [[0, 0, 0, 0, 0], 0], expected: [[0, 0, 0, 0]] },
    // structural: multiple distinct quadruplets
    {
      args: [[-2, -1, 0, 0, 1, 2], 0],
      expected: [
        [-2, -1, 1, 2],
        [-2, 0, 0, 2],
        [-1, 0, 0, 1],
      ],
    },
    // anti-hardcode: large-magnitude target near integer-overflow territory
    { args: [[1000000000, 1000000000, 1000000000, 1000000000], 4000000000], expected: [[1000000000, 1000000000, 1000000000, 1000000000]] },
    { args: [[-1000000000, -1000000000, 1000000000, 1000000000], 0], expected: [[-1000000000, -1000000000, 1000000000, 1000000000]] },
    // anti-hardcode: nonzero target, irregular input
    {
      args: [[1, -2, -5, -4, -3, 3, 3, 5], -11],
      expected: [
        [-5, -4, -3, 1],
      ],
    },
    // negative target with several combos over distinct values
    {
      args: [[-4, -3, -2, -1, 0, 1, 2, 3, 4], -1],
      expected: [
        [-4, -3, 2, 4],
        [-4, -2, 1, 4],
        [-4, -2, 2, 3],
        [-4, -1, 0, 4],
        [-4, -1, 1, 3],
        [-4, 0, 1, 2],
        [-3, -2, 0, 4],
        [-3, -2, 1, 3],
        [-3, -1, 0, 3],
        [-3, -1, 1, 2],
        [-2, -1, 0, 2],
      ],
    },
    // scale: 200-element max-size input (1..200), target hits only the top quadruplet — answer at
    // the far end, and exercises the O(n^3) path on the largest allowed array.
    {
      args: [Array.from({ length: 200 }, (_, k) => k + 1), 794],
      expected: [[197, 198, 199, 200]],
    },
    // edge: paired duplicates yielding several distinct quadruplets, deduped across index sets
    {
      args: [[1, 1, 2, 2, 3, 3, 4, 4], 10],
      expected: [
        [1, 1, 4, 4],
        [1, 2, 3, 4],
        [2, 2, 3, 3],
      ],
    },
  ],
  source: { origin: "leetcode", frontendId: "18", acRate: 0.40636095436983644, confidence: 0.9 },
  solutions: [
    {
      name: "Sort + two pointers",
      explanation: `Sort the array, then fix the outer two indices \`i < j\` with two nested loops and solve the remaining 2Sum with a two-pointer scan over the suffix. Skipping duplicate values at each of the four positions keeps quadruplets unique without a hash set.

\`O(n³)\` time, \`O(1)\` extra space (ignoring the sort and output).`,
      code: {
        javascript: `function fourSum(nums, target) {
  nums = [...nums].sort((a, b) => a - b);
  const n = nums.length;
  const res = [];
  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let lo = j + 1;
      let hi = n - 1;
      while (lo < hi) {
        const sum = nums[i] + nums[j] + nums[lo] + nums[hi];
        if (sum === target) {
          res.push([nums[i], nums[j], nums[lo], nums[hi]]);
          const lv = nums[lo];
          const hv = nums[hi];
          while (lo < hi && nums[lo] === lv) lo++;
          while (lo < hi && nums[hi] === hv) hi--;
        } else if (sum < target) {
          lo++;
        } else {
          hi--;
        }
      }
    }
  }
  return res;
}`,
        typescript: `function fourSum(nums: number[], target: number): number[][] {
  nums = [...nums].sort((a, b) => a - b);
  const n = nums.length;
  const res: number[][] = [];
  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let lo = j + 1;
      let hi = n - 1;
      while (lo < hi) {
        const sum = nums[i] + nums[j] + nums[lo] + nums[hi];
        if (sum === target) {
          res.push([nums[i], nums[j], nums[lo], nums[hi]]);
          const lv = nums[lo];
          const hv = nums[hi];
          while (lo < hi && nums[lo] === lv) lo++;
          while (lo < hi && nums[hi] === hv) hi--;
        } else if (sum < target) {
          lo++;
        } else {
          hi--;
        }
      }
    }
  }
  return res;
}`,
      },
    },
  ],
});
