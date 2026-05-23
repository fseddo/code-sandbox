import { defineAlgoProblem } from "../problem";

// Args is an array *of* lists; `io: "linked-list[]"` hydrates each inner array into a `ListNode` chain,
// and the result flattens back to a single array. Test data stays plain arrays. See problem-authoring.md.
export const mergeKLists = defineAlgoProblem<[number[][]], number[]>({
  id: "merge-k-sorted-lists",
  number: 19,
  title: "Merge k Sorted Lists",
  difficulty: "hard",
  tags: ["linked-list", "divide-and-conquer", "heap-priority-queue", "merge-sort"],
  functionName: "mergeKLists",
  prompt: `You are given an array of \`k\` linked lists, each sorted in **non-decreasing** order. Merge them into one sorted linked list and return its head.

In this judge each list is written and checked as a plain array — \`[[1, 4, 5], [1, 3, 4], [2, 6]]\` is three sorted lists, and the answer is the single merged list \`[1, 1, 2, 3, 4, 4, 5, 6]\`. The outer array may be empty, and individual lists may be empty.`,
  constraints: [
    "k == lists.length",
    "0 <= k <= 10^4",
    "0 <= lists[i].length, and the total number of nodes across all lists is in the range [0, 10^4].",
    "-10^4 <= lists[i][j] <= 10^4",
    "Each lists[i] is sorted in non-decreasing order.",
  ],
  io: { params: ["linked-list[]"], result: "linked-list" },
  starterCode: {
    javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *   this.val = (val === undefined ? 0 : val)
 *   this.next = (next === undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
  // your code here
}`,
    typescript: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 *   constructor(val?: number, next?: ListNode | null) {
 *     this.val = (val === undefined ? 0 : val)
 *     this.next = (next === undefined ? null : next)
 *   }
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  // your code here
}`,
  },
  examples: [
    {
      name: "three lists",
      args: [[[1, 4, 5], [1, 3, 4], [2, 6]]],
      expected: [1, 1, 2, 3, 4, 4, 5, 6],
      explanation: "Merging the three sorted lists interleaves their values into one sorted run.",
    },
    { name: "no lists", args: [[]], expected: [] },
    { name: "one empty list", args: [[[]]], expected: [] },
  ],
  hiddenTests: [
    { args: [[[1]]], expected: [1] },
    { args: [[[], []]], expected: [] },
    { args: [[[5], [], [1, 2, 3]]], expected: [1, 2, 3, 5] },
    { args: [[[-3, -1, 2], [-2, 0, 4]]], expected: [-3, -2, -1, 0, 2, 4] },
    { args: [[[1, 1, 1], [1, 1], [1]]], expected: [1, 1, 1, 1, 1, 1] },
    { args: [[[10000], [-10000]]], expected: [-10000, 10000] },
    { args: [[[2, 2], [1, 1], [3, 3], [0, 0]]], expected: [0, 0, 1, 1, 2, 2, 3, 3] },
    { args: [[[1, 2, 3, 4, 5]]], expected: [1, 2, 3, 4, 5] },
    { args: [[[], [7], []]], expected: [7] },
    { args: [[[1, 3, 5, 7], [2, 4, 6, 8], [0, 9]]], expected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    // Anti-naive: many tiny lists — an O(k) linear scan per pop is fine, but a quadratic re-merge is felt.
    { args: [Array.from({ length: 500 }, (_, i) => [i])], expected: Array.from({ length: 500 }, (_, i) => i) },
    // Scale: total ~5000 nodes split across 50 sorted lists; O(N log k) finishes well under budget.
    {
      args: [Array.from({ length: 50 }, (_, k) => Array.from({ length: 100 }, (_, i) => k + i * 50))],
      expected: Array.from({ length: 5000 }, (_, i) => i),
    },
  ],
  source: { origin: "leetcode", frontendId: "23", acRate: 0.5589, confidence: 0.92 },
  solutions: [
    {
      name: "Divide and conquer (pairwise merge)",
      explanation: `Merging two sorted lists is the classic two-pointer splice. Naively folding all \`k\` lists into an accumulator is \`O(kN)\`; instead pair them up and merge in rounds, halving the list count each round. After \`log k\` rounds one list remains.

\`O(N log k)\` time for \`N\` total nodes, \`O(1)\` extra space beyond the output nodes (reusing input nodes).`,
      code: {
        javascript: `function mergeKLists(lists) {
  const mergeTwo = (a, b) => {
    const dummy = new ListNode(0);
    let tail = dummy;
    while (a && b) {
      if (a.val <= b.val) { tail.next = a; a = a.next; }
      else { tail.next = b; b = b.next; }
      tail = tail.next;
    }
    tail.next = a || b;
    return dummy.next;
  };
  if (lists.length === 0) return null;
  let merged = [...lists];
  while (merged.length > 1) {
    const next = [];
    for (let i = 0; i < merged.length; i += 2) {
      next.push(mergeTwo(merged[i], i + 1 < merged.length ? merged[i + 1] : null));
    }
    merged = next;
  }
  return merged[0];
}`,
        typescript: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const mergeTwo = (a: ListNode | null, b: ListNode | null): ListNode | null => {
    const dummy = new ListNode(0);
    let tail = dummy;
    while (a && b) {
      if (a.val <= b.val) { tail.next = a; a = a.next; }
      else { tail.next = b; b = b.next; }
      tail = tail.next;
    }
    tail.next = a || b;
    return dummy.next;
  };
  if (lists.length === 0) return null;
  let merged = [...lists];
  while (merged.length > 1) {
    const next: Array<ListNode | null> = [];
    for (let i = 0; i < merged.length; i += 2) {
      next.push(mergeTwo(merged[i], i + 1 < merged.length ? merged[i + 1] : null));
    }
    merged = next;
  }
  return merged[0];
}`,
      },
    },
  ],
});
