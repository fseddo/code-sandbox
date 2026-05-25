import { defineAlgoProblem } from "../problem";

export const cuttingWood = defineAlgoProblem<[number[], number], number>({
  id: "cutting-wood",
  number: 115,
  title: "Cutting Wood",
  difficulty: "medium",
  tags: ["array", "binary-search"],
  functionName: "cutWood",
  prompt: `You are given an array \`heights\` representing the heights of a row of trees, and an integer \`k\` — the total length of wood you need to collect.

A sawmill sets its blade at some integer height \`H\`. Every tree taller than \`H\` is cut down to height \`H\`, and the part above the blade is collected as wood: a tree of height \`h\` yields \`max(0, h - H)\` units, and trees at or below \`H\` are left untouched.

Return the **maximum** integer blade height \`H\` such that the total wood collected is **at least** \`k\`. It is guaranteed that collecting \`k\` units is always possible (i.e. cutting every tree to the ground yields at least \`k\`).`,
  constraints: [
    "1 <= heights.length <= 10^4",
    "0 <= heights[i] <= 10^9",
    "1 <= k <= sum of all heights",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} heights
 * @param {number} k
 * @return {number}
 */
function cutWood(heights, k) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} heights
 * @param {number} k
 * @return {number}
 */
function cutWood(heights: number[], k: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "basic",
      args: [[2, 6, 3, 8], 7],
      expected: 3,
      explanation: "At H = 3 the wood is 3 + 5 = 8 ≥ 7. At H = 4 it is 2 + 4 = 6 < 7, so 3 is the highest blade that works.",
    },
    {
      name: "taller trees",
      args: [[4, 42, 40, 26, 46], 20],
      expected: 36,
      explanation: "At H = 36 the wood is 6 + 4 + 10 = 20 ≥ 20; at H = 37 it is 5 + 3 + 9 = 17 < 20.",
    },
    {
      name: "single tree",
      args: [[10], 4],
      expected: 6,
      explanation: "One tree of height 10; cutting at H = 6 yields 4 units, exactly k.",
    },
  ],
  hiddenTests: [
    { name: "cut to ground", args: [[5], 5], expected: 0 },
    { name: "need everything", args: [[3, 3, 3], 9], expected: 0 },
    { name: "barely feasible at top", args: [[100], 1], expected: 99 },
    { name: "two equal trees", args: [[10, 10], 6], expected: 7 },
    { name: "uneven trees", args: [[1, 2, 3, 4, 5], 6], expected: 2 },
    { name: "one dominant tree", args: [[1, 1, 1, 100], 50], expected: 50 },
    { name: "zeros present", args: [[0, 0, 7], 3], expected: 4 },
    { name: "exact at H zero", args: [[2, 4, 6], 12], expected: 0 },
    { name: "large heights", args: [[1000000000, 1000000000], 1000000000], expected: 500000000 },
    { name: "all same big", args: [[20, 20, 20, 20], 40], expected: 10 },
    { name: "k of one", args: [[8, 1, 1], 1], expected: 7 },
    {
      name: "scale: 10000 trees",
      args: [Array.from({ length: 10000 }, (_, i) => i + 1), 5000],
      // Sorted [1..10000]; largest H with sum of (h - H) over h > H being >= 5000.
      // At H = 9899: trees 9900..10000 contribute (1+2+...+101) = 101*102/2 = 5151 >= 5000.
      // At H = 9900: trees 9901..10000 contribute (1+...+100) = 5050 >= 5000.
      // At H = 9901: trees 9902..10000 contribute (1+...+99) = 4950 < 5000. So answer is 9900.
      expected: 9900,
    },
  ],
  source: { origin: "authored", confidence: 0.85 },
  solutions: [
    {
      name: "Binary search on the blade height",
      explanation: `The wood collected is *monotonic* in the blade height \`H\`: raise the blade and you can only collect less (or equal) wood. So the heights split cleanly into a feasible low range (enough wood) and an infeasible high range, and we binary-search for the boundary — the largest \`H\` that still yields at least \`k\`.

Search \`H\` in \`[0, max(heights)]\`. For a candidate \`mid\`, sum \`max(0, h - mid)\` over every tree: if that total is \`>= k\` the blade can go at least this high, so record it and search higher; otherwise search lower.

\`O(n log M)\` time, where \`M\` is the tallest tree, and \`O(1)\` space.`,
      code: {
        javascript: `function cutWood(heights, k) {
  const woodAt = (h) => {
    let total = 0;
    for (const height of heights) total += Math.max(0, height - h);
    return total;
  };
  let lo = 0;
  let hi = Math.max(...heights);
  let best = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (woodAt(mid) >= k) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}`,
        typescript: `function cutWood(heights: number[], k: number): number {
  const woodAt = (h: number): number => {
    let total = 0;
    for (const height of heights) total += Math.max(0, height - h);
    return total;
  };
  let lo = 0;
  let hi = Math.max(...heights);
  let best = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (woodAt(mid) >= k) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}`,
      },
    },
  ],
});
