import { defineAlgoProblem } from "../problem";

export const insert = defineAlgoProblem<[number[][], number[]], number[][]>({
  id: "insert-interval",
  number: 64,
  title: "Insert Interval",
  difficulty: "medium",
  tags: ["array"],
  functionName: "insert",
  prompt: `You are given an array of non-overlapping intervals \`intervals\`, where \`intervals[i] = [start_i, end_i]\` and the intervals are sorted in ascending order by \`start_i\`. You are also given a single interval \`newInterval\`.

Insert \`newInterval\` into \`intervals\` so that the result is still sorted by start and has no overlaps, merging any intervals that overlap the new one. Return the resulting list of intervals.`,
  constraints: [
    "0 <= intervals.length <= 10^4",
    "intervals[i].length == 2",
    "0 <= start_i <= end_i <= 10^5",
    "intervals is sorted by start_i in ascending order.",
    "newInterval.length == 2",
    "0 <= newInterval[0] <= newInterval[1] <= 10^5",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
function insert(intervals, newInterval) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
function insert(intervals: number[][], newInterval: number[]): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "single overlap",
      args: [[[1, 3], [6, 9]], [2, 5]],
      expected: [[1, 5], [6, 9]],
      explanation: "[2, 5] overlaps [1, 3], merging into [1, 5]; [6, 9] is untouched.",
    },
    {
      name: "spanning merge",
      args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]],
      expected: [[1, 2], [3, 10], [12, 16]],
      explanation: "[4, 8] overlaps [3, 5], [6, 7], and [8, 10], merging the three into [3, 10].",
    },
    { name: "empty", args: [[], [5, 7]], expected: [[5, 7]] },
  ],
  hiddenTests: [
    { args: [[], [0, 0]], expected: [[0, 0]] },
    { args: [[[1, 5]], [2, 3]], expected: [[1, 5]] },
    { args: [[[1, 5]], [6, 8]], expected: [[1, 5], [6, 8]] },
    { args: [[[1, 5]], [0, 0]], expected: [[0, 0], [1, 5]] },
    { args: [[[3, 5], [7, 9]], [0, 1]], expected: [[0, 1], [3, 5], [7, 9]] },
    { args: [[[1, 2], [3, 4]], [5, 6]], expected: [[1, 2], [3, 4], [5, 6]] },
    { args: [[[1, 5]], [2, 7]], expected: [[1, 7]] },
    { args: [[[1, 5]], [-1, 6]], expected: [[-1, 6]] },
    { args: [[[2, 4], [6, 8], [10, 12]], [5, 9]], expected: [[2, 4], [5, 9], [10, 12]] },
    { args: [[[1, 3], [5, 7], [9, 11]], [4, 10]], expected: [[1, 3], [4, 11]] },
    { args: [[[0, 5], [10, 15]], [5, 10]], expected: [[0, 15]] },
    { args: [[[1, 2], [3, 4], [5, 6]], [0, 7]], expected: [[0, 7]] },
    { args: [[[1, 5], [10, 15]], [6, 6]], expected: [[1, 5], [6, 6], [10, 15]] },
    // Scale: 10k intervals; new interval merges a window in the middle.
    (() => {
      const intervals = Array.from({ length: 10000 }, (_, i) => [i * 4, i * 4 + 1]);
      const newInterval = [10000, 30005];
      const expected: number[][] = [];
      let placed = false;
      let cur = newInterval.slice();
      for (const iv of intervals) {
        if (iv[1] < cur[0]) {
          expected.push(iv);
        } else if (iv[0] > cur[1]) {
          if (!placed) { expected.push(cur); placed = true; }
          expected.push(iv);
        } else {
          cur = [Math.min(cur[0], iv[0]), Math.max(cur[1], iv[1])];
        }
      }
      if (!placed) expected.push(cur);
      return { args: [intervals, newInterval], expected } as { args: [number[][], number[]]; expected: number[][] };
    })(),
  ],
  source: { origin: "leetcode", frontendId: "57", acRate: 0.4521982999581045, confidence: 0.94 },
  solutions: [
    {
      name: "Three-phase scan",
      explanation: `Walk the sorted intervals once in three phases. First, copy every interval that ends before \`newInterval\` starts. Second, while an interval overlaps the new one (its start is at or before the new end), absorb it by widening \`newInterval\` to the min start / max end; push the merged interval afterwards. Third, copy the remaining intervals that start after the merged block.

\`O(n)\` time, \`O(n)\` output space.`,
      code: {
        javascript: `function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  const n = intervals.length;
  while (i < n && intervals[i][1] < newInterval[0]) result.push(intervals[i++]);
  let start = newInterval[0];
  let end = newInterval[1];
  while (i < n && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  result.push([start, end]);
  while (i < n) result.push(intervals[i++]);
  return result;
}`,
        typescript: `function insert(intervals: number[][], newInterval: number[]): number[][] {
  const result: number[][] = [];
  let i = 0;
  const n = intervals.length;
  while (i < n && intervals[i][1] < newInterval[0]) result.push(intervals[i++]);
  let start = newInterval[0];
  let end = newInterval[1];
  while (i < n && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  result.push([start, end]);
  while (i < n) result.push(intervals[i++]);
  return result;
}`,
      },
    },
  ],
});
