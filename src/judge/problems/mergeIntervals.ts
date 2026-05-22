import { defineProblem } from "../problem";

export const mergeIntervals = defineProblem<[number[][]], number[][]>({
  id: "merge-intervals",
  title: "Merge Intervals",
  difficulty: "medium",
  tags: ["array", "sorting"],
  functionName: "merge",
  prompt: `Given a list of \`intervals\` where each \`intervals[i] = [start, end]\`, merge every pair of overlapping intervals and return the resulting non-overlapping intervals.

Two intervals overlap when one starts at or before the other ends (touching endpoints such as \`[1, 4]\` and \`[4, 5]\` count as overlapping). Return the merged intervals **sorted in ascending order of start**.`,
  constraints: [
    "1 <= intervals.length <= 10^4",
    "intervals[i].length == 2",
    "0 <= start <= end <= 10^4",
  ],
  starterCode: {
    javascript: `function merge(intervals) {
  // your code here
}`,
    typescript: `function merge(intervals: number[][]): number[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "overlapping pair",
      args: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
      expected: [[1, 6], [8, 10], [15, 18]],
      explanation: "[1,3] and [2,6] overlap, so they merge into [1,6]; the rest stay separate.",
    },
    {
      name: "touching endpoints",
      args: [[[1, 4], [4, 5]]],
      expected: [[1, 5]],
      explanation: "They share the endpoint 4, which counts as overlapping.",
    },
    {
      name: "already disjoint",
      args: [[[1, 2], [3, 4]]],
      expected: [[1, 2], [3, 4]],
    },
  ],
  hiddenTests: [
    { args: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
    { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
    { args: [[[5, 7]]], expected: [[5, 7]] },
    { args: [[[1, 4], [5, 6]]], expected: [[1, 4], [5, 6]] },
    { args: [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]], expected: [[1, 10]] },
    { args: [[[6, 8], [1, 9], [2, 4], [4, 7]]], expected: [[1, 9]] },
    { args: [[[0, 0], [1, 1], [2, 2]]], expected: [[0, 0], [1, 1], [2, 2]] },
    { args: [[[1, 4], [0, 2], [3, 5]]], expected: [[0, 5]] },
    { args: [[[4, 5], [1, 4], [0, 1]]], expected: [[0, 5]] },
    {
      name: "many alternating",
      args: [[[0, 1], [3, 5], [4, 8], [10, 12], [9, 10]]],
      expected: [[0, 1], [3, 8], [9, 12]],
    },
    {
      name: "scale - all overlap into one",
      args: [Array.from({ length: 2000 }, (_, i) => [i, i + 2])],
      expected: [[0, 2001]],
    },
    {
      name: "scale - all disjoint",
      args: [Array.from({ length: 2000 }, (_, i) => [i * 3, i * 3 + 1])],
      expected: Array.from({ length: 2000 }, (_, i) => [i * 3, i * 3 + 1]),
    },
  ],
  source: { origin: "leetcode", frontendId: "56", acRate: 0.5181858418197245, confidence: 0.95 },
  solutions: [
    {
      name: "Sort then sweep",
      explanation: `Sort the intervals by start. Walk left to right keeping the last interval in the output: if the current interval starts at or before that interval's end, extend the end to the larger of the two ends; otherwise it's disjoint, so push it as a new output interval.

\`O(n log n)\` time (the sort dominates), \`O(n)\` extra space for the output.`,
      code: {
        javascript: `function merge(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result = [];
  for (const [start, end] of sorted) {
    const last = result[result.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}`,
        typescript: `function merge(intervals: number[][]): number[][] {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result: number[][] = [];
  for (const [start, end] of sorted) {
    const last = result[result.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}`,
      },
    },
  ],
});
