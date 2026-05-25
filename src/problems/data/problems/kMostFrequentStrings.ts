import { defineAlgoProblem } from "../problem";

export const kMostFrequentStrings = defineAlgoProblem<[string[], number], string[]>({
  id: "k-most-frequent-strings",
  number: 122,
  title: "K Most Frequent Strings",
  difficulty: "medium",
  tags: ["heap-priority-queue", "hash-table", "sorting", "string"],
  functionName: "kMostFrequent",
  prompt: `Given an array of strings \`strs\` and an integer \`k\`, return the \`k\` most frequent strings.

Return the answer **sorted by frequency from highest to lowest**. When two strings have the **same frequency**, order them **lexicographically** (alphabetical, ascending) — so the result is fully deterministic.

For example, with \`strs = ["go", "coding", "byte", "byte", "go", "interview", "go"]\` and \`k = 2\`, the counts are \`go: 3\`, \`byte: 2\`, and \`coding\`/\`interview\` once each. The two most frequent are \`["go", "byte"]\`.`,
  constraints: [
    "1 <= strs.length <= 10^4",
    "1 <= strs[i].length <= 20",
    "strs[i] consists of lowercase English letters.",
    "1 <= k <= the number of distinct strings in strs.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[]} strs
 * @param {number} k
 * @return {string[]}
 */
function kMostFrequent(strs, k) {
  // your code here
}`,
    typescript: `/**
 * @param {string[]} strs
 * @param {number} k
 * @return {string[]}
 */
function kMostFrequent(strs: string[], k: number): string[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "two most frequent",
      args: [["go", "coding", "byte", "byte", "go", "interview", "go"], 2],
      expected: ["go", "byte"],
      explanation: "go appears 3 times, byte twice; both beat the single-count strings.",
    },
    {
      name: "tie broken lexicographically",
      args: [["i", "love", "code", "i", "love", "you"], 2],
      expected: ["i", "love"],
      explanation: "i and love each appear twice; code/you once. Among the ties i < love alphabetically.",
    },
    {
      name: "all tied",
      args: [["b", "a", "c"], 2],
      expected: ["a", "b"],
      explanation: "All count 1, so the two lexicographically smallest win: a then b.",
    },
  ],
  hiddenTests: [
    { args: [["a"], 1], expected: ["a"] },
    { args: [["a", "a", "a"], 1], expected: ["a"] },
    { args: [["a", "b", "c", "d"], 4], expected: ["a", "b", "c", "d"] },
    { args: [["zoo", "ant", "ant", "zoo", "ant"], 1], expected: ["ant"] },
    { args: [["x", "x", "y", "y", "z"], 2], expected: ["x", "y"] },
    { args: [["apple", "app", "apple", "app", "apple"], 2], expected: ["apple", "app"] },
    { args: [["c", "c", "b", "b", "a", "a"], 3], expected: ["a", "b", "c"] },
    { args: [["one", "two", "two", "three", "three", "three"], 2], expected: ["three", "two"] },
    { args: [["dog", "cat", "dog", "bird", "cat", "dog"], 2], expected: ["dog", "cat"] },
    { args: [["m", "m", "n", "n", "n", "o", "o", "o", "o"], 3], expected: ["o", "n", "m"] },
    // Tie spanning the cutoff: bb and cc both count 1, cutoff at k=2 keeps the lexicographically smaller.
    { args: [["aa", "aa", "bb", "cc"], 2], expected: ["aa", "bb"] },
    // Anti-naive / scale: 9000 strings across 300 distinct keys; O(n + d log d) is fine.
    {
      args: [(() => { const a = []; for (let key = 0; key < 300; key++) { const s = "s" + String(key).padStart(4, "0"); for (let c = 0; c <= key % 30; c++) a.push(s); } return a; })(), 5],
      expected: ["s0029", "s0059", "s0089", "s0119", "s0149"],
    },
  ],
  source: { origin: "authored", confidence: 0.82 },
  solutions: [
    {
      name: "Count, then size-k min-heap",
      explanation: `Count every string in a hash map (\`O(n)\`). Then keep a min-heap of the best \`k\` candidates seen so far, ordered so the **weakest** candidate sits on top — weakest meaning lowest frequency, and among equal frequencies the lexicographically *larger* string (because on a tie we prefer the smaller string, so the larger one is the first to be evicted). Push each distinct string; whenever the heap exceeds \`k\`, pop the weakest. After all distinct strings are processed the heap holds exactly the \`k\` answers.

Draining a min-heap yields weakest-first, so reverse it to get highest-frequency first (with lexicographic ascending order within a tie).

Counting is \`O(n)\`; each of the \`d\` distinct strings does an \`O(log k)\` heap op, so \`O(n + d log k)\` time and \`O(d)\` space.`,
      code: {
        javascript: `function kMostFrequent(strs, k) {
  // Frequency of every string.
  const count = new Map();
  for (const s of strs) count.set(s, (count.get(s) || 0) + 1);

  // A candidate a is "weaker" than b if it should be evicted first: lower frequency,
  // or — on equal frequency — the lexicographically larger string (we keep the smaller).
  const weaker = (a, b) => {
    if (count.get(a) !== count.get(b)) return count.get(a) < count.get(b);
    return a > b;
  };

  // Min-heap keyed by "weaker": heap[0] is the weakest candidate, the eviction target.
  const heap = [];
  const swap = (i, j) => { const t = heap[i]; heap[i] = heap[j]; heap[j] = t; };
  const up = (i) => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!weaker(heap[i], heap[parent])) break;
      swap(parent, i);
      i = parent;
    }
  };
  const down = (i) => {
    const n = heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && weaker(heap[l], heap[smallest])) smallest = l;
      if (r < n && weaker(heap[r], heap[smallest])) smallest = r;
      if (smallest === i) break;
      swap(i, smallest);
      i = smallest;
    }
  };
  const push = (x) => { heap.push(x); up(heap.length - 1); };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length > 0) { heap[0] = last; down(0); }
    return top;
  };

  // Keep only the k strongest by evicting the weakest whenever the heap overflows.
  for (const s of count.keys()) {
    push(s);
    if (heap.length > k) pop();
  }

  // The heap drains weakest-first; reverse so the strongest (highest frequency) comes first.
  const result = [];
  while (heap.length > 0) result.push(pop());
  result.reverse();
  return result;
}`,
        typescript: `function kMostFrequent(strs: string[], k: number): string[] {
  // Frequency of every string.
  const count = new Map<string, number>();
  for (const s of strs) count.set(s, (count.get(s) || 0) + 1);

  // A candidate a is "weaker" than b if it should be evicted first: lower frequency,
  // or — on equal frequency — the lexicographically larger string (we keep the smaller).
  const weaker = (a: string, b: string): boolean => {
    if (count.get(a)! !== count.get(b)!) return count.get(a)! < count.get(b)!;
    return a > b;
  };

  // Min-heap keyed by "weaker": heap[0] is the weakest candidate, the eviction target.
  const heap: string[] = [];
  const swap = (i: number, j: number): void => { const t = heap[i]; heap[i] = heap[j]; heap[j] = t; };
  const up = (i: number): void => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!weaker(heap[i], heap[parent])) break;
      swap(parent, i);
      i = parent;
    }
  };
  const down = (i: number): void => {
    const n = heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && weaker(heap[l], heap[smallest])) smallest = l;
      if (r < n && weaker(heap[r], heap[smallest])) smallest = r;
      if (smallest === i) break;
      swap(i, smallest);
      i = smallest;
    }
  };
  const push = (x: string): void => { heap.push(x); up(heap.length - 1); };
  const pop = (): string => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) { heap[0] = last; down(0); }
    return top;
  };

  // Keep only the k strongest by evicting the weakest whenever the heap overflows.
  for (const s of count.keys()) {
    push(s);
    if (heap.length > k) pop();
  }

  // The heap drains weakest-first; reverse so the strongest (highest frequency) comes first.
  const result: string[] = [];
  while (heap.length > 0) result.push(pop());
  result.reverse();
  return result;
}`,
      },
    },
  ],
});
