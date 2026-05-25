import { defineAlgoProblem } from "../problem";

export const longestConsecutive = defineAlgoProblem<[number[]], number>({
  id: "longest-consecutive-sequence",
  number: 107,
  title: "Longest Consecutive Sequence",
  difficulty: "medium",
  tags: ["array", "hash-table"],
  functionName: "longestConsecutive",
  prompt: `Given an unsorted array of integers \`nums\`, return the length of the longest run of consecutive integers — values that differ by exactly 1 from their neighbour in the run.

The numbers do **not** have to be adjacent (or in order) inside \`nums\`; only their *values* must be consecutive. Duplicate values count once.

Aim for an \`O(n)\` algorithm — fast enough that you never need to sort the input.`,
  constraints: [
    "0 <= nums.length <= 10^5",
    "-10^9 <= nums[i] <= 10^9",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function longestConsecutive(nums) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function longestConsecutive(nums: number[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "basic",
      args: [[100, 4, 200, 1, 3, 2]],
      expected: 4,
      explanation: "The run [1, 2, 3, 4] has length 4. 100 and 200 are isolated.",
    },
    {
      name: "longer run with a duplicate",
      args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]],
      expected: 9,
      explanation: "0 through 8 are all present (0 appears twice but counts once), so the run [0..8] has length 9.",
    },
    {
      name: "empty",
      args: [[]],
      expected: 0,
      explanation: "No numbers means no run.",
    },
  ],
  hiddenTests: [
    { name: "single element", args: [[42]], expected: 1 },
    { name: "all duplicates", args: [[7, 7, 7, 7]], expected: 1 },
    { name: "already consecutive ascending", args: [[1, 2, 3, 4, 5]], expected: 5 },
    { name: "reverse order", args: [[5, 4, 3, 2, 1]], expected: 5 },
    { name: "duplicates inside a run", args: [[1, 2, 2, 3, 3, 3, 4]], expected: 4 },
    { name: "two separate runs", args: [[1, 2, 3, 10, 11, 12, 13]], expected: 4 },
    { name: "two runs, longer first", args: [[1, 2, 3, 4, 5, 9, 10]], expected: 5 },
    { name: "all negatives", args: [[-3, -2, -1, -5, -4]], expected: 5 },
    { name: "spanning zero", args: [[-2, -1, 0, 1, 2]], expected: 5 },
    { name: "no consecutive at all", args: [[10, 30, 20, 40, 50]], expected: 1 },
    { name: "extreme values isolated", args: [[1000000000, -1000000000, 0]], expected: 1 },
    { name: "run at the end", args: [[100, 200, 7, 8, 9, 10]], expected: 4 },
    { name: "duplicates plus separate run", args: [[8, 8, 8, 1, 2, 3]], expected: 3 },
    {
      name: "scale — one long run shuffled",
      args: [(() => {
        const out: number[] = [];
        for (let i = 0; i < 100000; i++) out.push(i);
        for (let i = out.length - 1; i > 0; i--) {
          const j = (i * 1103515245 + 12345) % (i + 1);
          [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
      })()],
      expected: 100000,
    },
    {
      name: "scale — many short runs, no long chain",
      args: [Array.from({ length: 100000 }, (_, i) => i * 3)],
      expected: 1,
    },
  ],
  source: { origin: "authored", confidence: 0.93 },
  solutions: [
    {
      name: "Hash set, walk from run starts",
      explanation: `Sorting would give an \`O(n log n)\` answer, but a set lets us do it in \`O(n)\`.

Put every value into a \`Set\` (this also drops duplicates). Then for each value \`n\`, only start counting if \`n - 1\` is **not** in the set — that means \`n\` is the smallest number of its run, so we count each run exactly once. From a start, walk \`n, n+1, n+2, …\` forward while each is present and track the longest length.

Although there's a nested while loop, each value is visited by the inner walk at most once across the whole run, so the total work is \`O(n)\`. The "only start from run beginnings" guard is what keeps it linear — without it, every element could re-walk its entire run.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function longestConsecutive(nums) {
  // O(1) membership tests; also collapses duplicate values to one.
  const set = new Set(nums);
  let longest = 0;
  for (const n of set) {
    // Only walk from a run's smallest value — if n-1 exists, n is mid-run,
    // so skip it and let its run be counted from its own start (keeps it O(n)).
    if (set.has(n - 1)) continue;
    let length = 1;
    let current = n;
    // Extend forward through the run while the next value is present.
    while (set.has(current + 1)) {
      current++;
      length++;
    }
    longest = Math.max(longest, length); // remember the longest run seen
  }
  return longest;
}`,
        typescript: `function longestConsecutive(nums: number[]): number {
  // O(1) membership tests; also collapses duplicate values to one.
  const set = new Set(nums);
  let longest = 0;
  for (const n of set) {
    // Only walk from a run's smallest value — if n-1 exists, n is mid-run,
    // so skip it and let its run be counted from its own start (keeps it O(n)).
    if (set.has(n - 1)) continue;
    let length = 1;
    let current = n;
    // Extend forward through the run while the next value is present.
    while (set.has(current + 1)) {
      current++;
      length++;
    }
    longest = Math.max(longest, length); // remember the longest run seen
  }
  return longest;
}`,
      },
    },
  ],
});
