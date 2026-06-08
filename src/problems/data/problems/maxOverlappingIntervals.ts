import { defineAlgoProblem } from "../problem";

export const maxOverlappingIntervals = defineAlgoProblem<[number[][]], number>({
  id: "max-overlapping-intervals",
  number: 125,
  title: "Largest Overlap of Intervals",
  difficulty: "medium",
  tags: ["array", "sorting"],
  functionName: "largestOverlap",
  prompt: `You are given a list of \`intervals\` where each \`intervals[i] = [start, end]\` is a closed range. Several intervals may cover the same point at once.

Return the **largest number of intervals that overlap at any single point** — the peak number of simultaneously active intervals. Touching endpoints count as overlapping: \`[1, 3]\` and \`[3, 5]\` both cover the point \`3\`, so at \`3\` two intervals are active.`,
  constraints: [
    "0 <= intervals.length <= 10^4",
    "intervals[i].length == 2",
    "0 <= start <= end <= 10^9",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} intervals
 * @return {number}
 */
function largestOverlap(intervals) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} intervals
 * @return {number}
 */
function largestOverlap(intervals: number[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "triple stack",
      args: [[[1, 5], [2, 6], [3, 7]]],
      expected: 3,
      explanation: "At point 3, all three intervals are active, so the peak overlap is 3.",
    },
    {
      name: "disjoint",
      args: [[[1, 2], [3, 4], [5, 6]]],
      expected: 1,
      explanation: "No two intervals share a point; the peak is 1.",
    },
    { name: "empty", args: [[]], expected: 0 },
  ],
  hiddenTests: [
    { args: [[[1, 1]]], expected: 1 },
    { args: [[[1, 3], [3, 5]]], expected: 2 },
    { args: [[[1, 2], [4, 5]]], expected: 1 },
    { args: [[[0, 10], [1, 2], [3, 4], [5, 6]]], expected: 2 },
    { args: [[[1, 4], [2, 5], [7, 9], [8, 10], [8, 12]]], expected: 3 },
    { args: [[[1, 10], [2, 9], [3, 8], [4, 7]]], expected: 4 },
    { args: [[[5, 5], [5, 5], [5, 5]]], expected: 3 },
    { args: [[[1, 100], [2, 3], [4, 5], [50, 60], [55, 56]]], expected: 3 },
    { args: [[[0, 0], [1, 1], [2, 2]]], expected: 1 },
    {
      // n nested intervals all containing the midpoint → overlap n.
      name: "scale - fully nested",
      args: [Array.from({ length: 5000 }, (_, i) => [i, 10000 - i])],
      expected: 5000,
    },
  ],
  source: { origin: "authored", confidence: 0.85 },
  solutions: [
    {
      name: "Sweep line of endpoints",
      explanation: `Split every interval into two events: a \`+1\` at its start (an interval becomes active) and a \`-1\` at \`end + 1\` (it has stopped being active from there on). Modeling the close at \`end + 1\` keeps the closed-interval semantics — an interval ending at \`x\` is still counted at \`x\` — without any floating-point fudging. Sort the events by position; when two events share a position, process the close (\`-1\`) before the open (\`+1\`), because an event at \`end + 1\` means the interval is *already gone* there. Sweep left to right keeping a running count of active intervals and track its maximum.

\`O(n log n)\` time (sorting the \`2n\` events dominates), \`O(n)\` space for the event list.`,
      code: {
        javascript: `function largestOverlap(intervals) {
  // Two events per interval: +1 when it opens, -1 right after it closes.
  const events = [];
  for (const [start, end] of intervals) {
    events.push([start, 1]);   // interval becomes active at start
    events.push([end + 1, -1]); // interval stops being active just past end
  }
  // Sort by position; at equal positions, closes (-1) come before opens (+1)
  // since an event at end + 1 means that interval is already gone here.
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let active = 0;
  let max = 0;
  for (const [, delta] of events) {
    active += delta;
    if (active > max) max = active;
  }
  return max;
}`,
        typescript: `function largestOverlap(intervals: number[][]): number {
  // Two events per interval: +1 when it opens, -1 right after it closes.
  const events: number[][] = [];
  for (const [start, end] of intervals) {
    events.push([start, 1]);   // interval becomes active at start
    events.push([end + 1, -1]); // interval stops being active just past end
  }
  // Sort by position; at equal positions, closes (-1) come before opens (+1)
  // since an event at end + 1 means that interval is already gone here.
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let active = 0;
  let max = 0;
  for (const [, delta] of events) {
    active += delta;
    if (active > max) max = active;
  }
  return max;
}`,
      },
    },
  ],
});
