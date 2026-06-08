import { defineAlgoProblem } from "../problem";

export const intervalIntersection = defineAlgoProblem<[number[][], number[][]], number[][]>({
  id: "interval-intersections",
  number: 124,
  title: "Interval List Intersections",
  difficulty: "medium",
  tags: ["array", "two-pointers"],
  functionName: "intervalIntersection",
  prompt: `You are given two lists of closed intervals, \`firstList\` and \`secondList\`, where each \`list[i] = [start_i, end_i]\`. Each list is pairwise disjoint and **sorted in ascending order by start**.

Return the intersection of the two interval lists: the list of closed intervals covered by *both* inputs, sorted by start. The intersection of two closed intervals \`[a, b]\` and \`[c, d]\` is \`[max(a, c), min(b, d)]\` — and it exists only when \`max(a, c) <= min(b, d)\` (touching endpoints count, so an intersection can be a single point like \`[5, 5]\`).`,
  constraints: [
    "0 <= firstList.length, secondList.length <= 1000",
    "firstList.length + secondList.length >= 1",
    "0 <= start_i <= end_i <= 10^9",
    "Each list is pairwise disjoint and sorted by start.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} firstList
 * @param {number[][]} secondList
 * @return {number[][]}
 */
function intervalIntersection(firstList, secondList) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} firstList
 * @param {number[][]} secondList
 * @return {number[][]}
 */
function intervalIntersection(firstList: number[][], secondList: number[][]): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "interleaved",
      args: [[[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]]],
      expected: [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]],
      explanation: "Each output interval is covered by one interval from each list; e.g. [5,10] ∩ [1,5] = [5,5].",
    },
    {
      name: "empty second list",
      args: [[[1, 3], [5, 9]], []],
      expected: [],
      explanation: "With nothing to intersect against, the result is empty.",
    },
    { name: "contained", args: [[[1, 7]], [[3, 10]]], expected: [[3, 7]] },
  ],
  hiddenTests: [
    { args: [[], []], expected: [] },
    { args: [[], [[4, 8], [10, 12]]], expected: [] },
    { args: [[[2, 4]], [[5, 7]]], expected: [] },
    { args: [[[1, 10]], [[2, 3], [4, 5], [6, 7]]], expected: [[2, 3], [4, 5], [6, 7]] },
    { args: [[[1, 5]], [[5, 9]]], expected: [[5, 5]] },
    { args: [[[3, 3]], [[3, 3]]], expected: [[3, 3]] },
    { args: [[[0, 0], [2, 2]], [[1, 1], [2, 2]]], expected: [[2, 2]] },
    { args: [[[1, 4], [6, 9]], [[2, 3], [5, 7]]], expected: [[2, 3], [6, 7]] },
    { args: [[[1, 2], [3, 4], [5, 6]], [[2, 5]]], expected: [[2, 2], [3, 4], [5, 5]] },
    { args: [[[5, 10]], [[0, 3]]], expected: [] },
    {
      // One giant interval in A; B is many small disjoint intervals fully inside it → each survives as-is.
      name: "scale - one spans many",
      args: [
        [[0, 4000]],
        Array.from({ length: 1000 }, (_, i) => [i * 4, i * 4 + 1]),
      ],
      expected: Array.from({ length: 1000 }, (_, i) => [i * 4, i * 4 + 1]),
    },
  ],
  source: { origin: "leetcode", frontendId: "986", acRate: 0.7142, confidence: 0.95 },
  solutions: [
    {
      name: "Two-pointer sweep",
      explanation: `Both lists are already sorted by start, so sweep them together with one pointer each. For the current pair of intervals, the candidate intersection is \`[max(starts), min(ends)]\`; emit it when \`max(starts) <= min(ends)\`. Then advance the pointer of whichever interval ends first — it can't intersect anything later in the other list, while the one that ends later might still meet the other list's next interval.

\`O(m + n)\` time (each pointer advances at most its list's length), \`O(1)\` extra space beyond the output.`,
      code: {
        javascript: `function intervalIntersection(firstList, secondList) {
  const result = [];
  let i = 0;
  let j = 0;
  // Sweep both sorted lists with one pointer each.
  while (i < firstList.length && j < secondList.length) {
    const [aStart, aEnd] = firstList[i];
    const [bStart, bEnd] = secondList[j];
    // Overlap of two closed intervals: [max start, min end].
    const lo = Math.max(aStart, bStart);
    const hi = Math.min(aEnd, bEnd);
    if (lo <= hi) result.push([lo, hi]);
    // Drop whichever interval ends first; it can't reach further right.
    if (aEnd < bEnd) i++;
    else j++;
  }
  return result;
}`,
        typescript: `function intervalIntersection(firstList: number[][], secondList: number[][]): number[][] {
  const result: number[][] = [];
  let i = 0;
  let j = 0;
  // Sweep both sorted lists with one pointer each.
  while (i < firstList.length && j < secondList.length) {
    const [aStart, aEnd] = firstList[i];
    const [bStart, bEnd] = secondList[j];
    // Overlap of two closed intervals: [max start, min end].
    const lo = Math.max(aStart, bStart);
    const hi = Math.min(aEnd, bEnd);
    if (lo <= hi) result.push([lo, hi]);
    // Drop whichever interval ends first; it can't reach further right.
    if (aEnd < bEnd) i++;
    else j++;
  }
  return result;
}`,
      },
    },
  ],
});
