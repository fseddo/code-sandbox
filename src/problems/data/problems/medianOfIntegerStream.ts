import { defineAlgoProblem } from "../problem";

export const medianOfIntegerStream = defineAlgoProblem<[string[], number[][]], (number | null)[]>({
  id: "median-of-an-integer-stream",
  number: 123,
  title: "Median of an Integer Stream",
  difficulty: "hard",
  tags: ["heap-priority-queue", "design", "sorting"],
  functionName: "runMedianOps",
  prompt: `Design a structure that ingests integers from a stream and can report the **median** of everything seen so far at any time. The median is the middle value of the sorted sequence; for an even count it is the **average of the two middle values**.

The structure supports two operations:

- \`"addNum"\` — add an integer \`num\` to the stream. Returns \`null\`.
- \`"findMedian"\` — return the median of all integers added so far.

You are given the operations as two parallel arrays: \`operations[i]\` is the operation name and \`values[i]\` is its argument list (\`[num]\` for \`"addNum"\`, \`[]\` for \`"findMedian"\`). Apply them in order and return an array holding each operation's return value (\`null\` for every \`"addNum"\`).

For example \`["addNum","addNum","findMedian","addNum","findMedian"]\` with \`[[1],[3],[],[2],[]]\` returns \`[null, null, 2, null, 2]\`: after adding 1 and 3 the median is \`(1 + 3) / 2 = 2\`; after also adding 2 the sorted stream is \`[1, 2, 3]\` with median \`2\`.

\`"findMedian"\` is only called after at least one \`"addNum"\`.`,
  constraints: [
    "1 <= operations.length <= 10^4",
    "operations[i] is one of \"addNum\", \"findMedian\".",
    "-10^5 <= num <= 10^5 for every \"addNum\".",
    "findMedian is only called on a non-empty stream.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[]} operations
 * @param {number[][]} values
 * @return {(number | null)[]}
 */
function runMedianOps(operations, values) {
  // your code here
}`,
    typescript: `/**
 * @param {string[]} operations
 * @param {number[][]} values
 * @return {(number | null)[]}
 */
function runMedianOps(operations: string[], values: number[][]): (number | null)[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "even then odd",
      args: [["addNum", "addNum", "findMedian", "addNum", "findMedian"], [[1], [3], [], [2], []]],
      expected: [null, null, 2, null, 2],
      explanation: "Median of {1,3} is (1+3)/2 = 2; adding 2 gives {1,2,3} with median 2.",
    },
    {
      name: "fractional median",
      args: [["addNum", "addNum", "addNum", "addNum", "findMedian"], [[1], [2], [3], [4], []]],
      expected: [null, null, null, null, 2.5],
      explanation: "Sorted {1,2,3,4}; the two middle values 2 and 3 average to 2.5.",
    },
  ],
  hiddenTests: [
    { args: [["addNum", "findMedian"], [[5], []]], expected: [null, 5] },
    { args: [["addNum", "addNum", "findMedian"], [[2], [4], []]], expected: [null, null, 3] },
    { args: [["addNum", "addNum", "addNum", "findMedian"], [[5], [1], [3], []]], expected: [null, null, null, 3] },
    { args: [["addNum", "findMedian", "addNum", "findMedian"], [[-1], [], [-3], []]], expected: [null, -1, null, -2] },
    { args: [["addNum", "addNum", "addNum", "addNum", "addNum", "findMedian"], [[6], [10], [2], [6], [5], []]], expected: [null, null, null, null, null, 6] },
    { args: [["addNum", "addNum", "findMedian", "addNum", "addNum", "findMedian"], [[1], [2], [], [3], [4], []]], expected: [null, null, 1.5, null, null, 2.5] },
    { args: [["addNum", "addNum", "addNum", "findMedian"], [[0], [0], [0], []]], expected: [null, null, null, 0] },
    { args: [["addNum", "addNum", "findMedian"], [[100000], [-100000], []]], expected: [null, null, 0] },
    { args: [["addNum", "addNum", "addNum", "addNum", "addNum", "addNum", "findMedian"], [[7], [7], [7], [3], [3], [3], []]], expected: [null, null, null, null, null, null, 5] },
    { args: [["addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian"], [[4], [], [4], [], [4], []]], expected: [null, 4, null, 4, null, 4] },
    { args: [["addNum", "addNum", "addNum", "addNum", "findMedian"], [[-5], [-10], [10], [5], []]], expected: [null, null, null, null, 0] },
    { args: [["addNum", "addNum", "addNum", "addNum", "addNum", "addNum", "findMedian"], [[1], [2], [3], [4], [5], [6], []]], expected: [null, null, null, null, null, null, 3.5] },
    { args: [["addNum", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian"], [[2], [1], [], [5], [], [3], []]], expected: [null, null, 1.5, null, 2, null, 2.5] },
    { args: [["addNum", "findMedian", "addNum", "findMedian"], [[100000], [], [-100000], []]], expected: [null, 100000, null, 0] },
    // Anti-naive: descending insertion would break a structure that assumes sorted-on-arrival.
    { args: [["addNum", "addNum", "addNum", "addNum", "addNum", "findMedian"], [[5], [4], [3], [2], [1], []]], expected: [null, null, null, null, null, 3] },
    // Scale: 6000 adds with periodic queries; two-heap O(log n) per op stays well under budget.
    {
      args: (() => {
        const ops: string[] = [];
        const vals: number[][] = [];
        for (let i = 0; i < 6000; i++) { ops.push("addNum"); vals.push([i % 1000]); if (i % 500 === 499) { ops.push("findMedian"); vals.push([]); } }
        return [ops, vals] as [string[], number[][]];
      })(),
      expected: (() => {
        // Mirror the reference: a multiset of inserted values, median computed at each query.
        const counts = new Map();
        let total = 0;
        const out = [];
        const median = () => {
          const keys = [...counts.keys()].sort((a, b) => a - b);
          const lowerIdx = Math.floor((total - 1) / 2);
          const upperIdx = Math.floor(total / 2);
          let seen = 0;
          let lower = 0;
          let upper = 0;
          for (const key of keys) {
            const next = seen + counts.get(key);
            if (seen <= lowerIdx && lowerIdx < next) lower = key;
            if (seen <= upperIdx && upperIdx < next) upper = key;
            seen = next;
          }
          return (lower + upper) / 2;
        };
        for (let i = 0; i < 6000; i++) {
          const v = i % 1000;
          counts.set(v, (counts.get(v) || 0) + 1);
          total++;
          out.push(null);
          if (i % 500 === 499) out.push(median());
        }
        return out;
      })(),
    },
  ],
  source: { origin: "authored", confidence: 0.8 },
  solutions: [
    {
      name: "Two heaps (max-heap low half, min-heap high half)",
      explanation: `Split the stream into two halves around the median: a **max-heap** \`low\` holding the smaller half (its top is the largest of the small values) and a **min-heap** \`high\` holding the larger half (its top is the smallest of the large values). Keep them balanced so \`low\` has the same count as \`high\` or exactly one more.

To add a number, push to \`low\`, then move \`low\`'s top to \`high\` (so the partition stays correct), then if \`high\` is now larger than \`low\` move \`high\`'s top back. The median is \`low\`'s top when the total count is odd, otherwise the average of both tops.

Each add does a constant number of \`O(log n)\` heap operations; \`findMedian\` reads the tops in \`O(1)\`. So \`O(log n)\` per add and \`O(n)\` space.`,
      code: {
        javascript: `function runMedianOps(operations, values) {
  // Generic binary heap; \`less\` defines the ordering so one class serves both halves.
  const makeHeap = (less) => {
    const data = [];
    const swap = (i, j) => { const t = data[i]; data[i] = data[j]; data[j] = t; };
    const up = (i) => {
      while (i > 0) {
        const parent = (i - 1) >> 1;
        if (!less(data[i], data[parent])) break;
        swap(parent, i);
        i = parent;
      }
    };
    const down = (i) => {
      const n = data.length;
      while (true) {
        let best = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && less(data[l], data[best])) best = l;
        if (r < n && less(data[r], data[best])) best = r;
        if (best === i) break;
        swap(i, best);
        i = best;
      }
    };
    return {
      size: () => data.length,
      peek: () => data[0],
      push: (x) => { data.push(x); up(data.length - 1); },
      pop: () => {
        const top = data[0];
        const last = data.pop();
        if (data.length > 0) { data[0] = last; down(0); }
        return top;
      },
    };
  };

  const low = makeHeap((a, b) => a > b);  // max-heap: small half, top = largest small value
  const high = makeHeap((a, b) => a < b); // min-heap: large half, top = smallest large value

  const addNum = (num) => {
    low.push(num);              // always enters the small half first
    high.push(low.pop());       // hand its top to the large half to keep the partition sorted
    if (high.size() > low.size()) low.push(high.pop()); // rebalance so low >= high in count
  };
  const findMedian = () =>
    low.size() > high.size() ? low.peek() : (low.peek() + high.peek()) / 2;

  const result = [];
  for (let i = 0; i < operations.length; i++) {
    if (operations[i] === "addNum") {
      addNum(values[i][0]);
      result.push(null);
    } else {
      result.push(findMedian());
    }
  }
  return result;
}`,
        typescript: `function runMedianOps(operations: string[], values: number[][]): (number | null)[] {
  // Generic binary heap; \`less\` defines the ordering so one class serves both halves.
  const makeHeap = (less: (a: number, b: number) => boolean) => {
    const data: number[] = [];
    const swap = (i: number, j: number): void => { const t = data[i]; data[i] = data[j]; data[j] = t; };
    const up = (i: number): void => {
      while (i > 0) {
        const parent = (i - 1) >> 1;
        if (!less(data[i], data[parent])) break;
        swap(parent, i);
        i = parent;
      }
    };
    const down = (i: number): void => {
      const n = data.length;
      while (true) {
        let best = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && less(data[l], data[best])) best = l;
        if (r < n && less(data[r], data[best])) best = r;
        if (best === i) break;
        swap(i, best);
        i = best;
      }
    };
    return {
      size: (): number => data.length,
      peek: (): number => data[0],
      push: (x: number): void => { data.push(x); up(data.length - 1); },
      pop: (): number => {
        const top = data[0];
        const last = data.pop()!;
        if (data.length > 0) { data[0] = last; down(0); }
        return top;
      },
    };
  };

  const low = makeHeap((a, b) => a > b);  // max-heap: small half, top = largest small value
  const high = makeHeap((a, b) => a < b); // min-heap: large half, top = smallest large value

  const addNum = (num: number): void => {
    low.push(num);              // always enters the small half first
    high.push(low.pop());       // hand its top to the large half to keep the partition sorted
    if (high.size() > low.size()) low.push(high.pop()); // rebalance so low >= high in count
  };
  const findMedian = (): number =>
    low.size() > high.size() ? low.peek() : (low.peek() + high.peek()) / 2;

  const result: (number | null)[] = [];
  for (let i = 0; i < operations.length; i++) {
    if (operations[i] === "addNum") {
      addNum(values[i][0]);
      result.push(null);
    } else {
      result.push(findMedian());
    }
  }
  return result;
}`,
      },
    },
  ],
});
