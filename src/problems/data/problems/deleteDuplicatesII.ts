import { defineAlgoProblem } from "../problem";

// Linked-list I/O: test data is plain arrays; `io` hydrates them into a ListNode chain around the
// call and flattens the returned chain back to an array.
export const deleteDuplicatesII = defineAlgoProblem<[number[]], number[]>({
  id: "remove-duplicates-from-sorted-list-ii",
  number: 88,
  title: "Remove Duplicates from Sorted List II",
  difficulty: "medium",
  tags: ["linked-list", "two-pointers"],
  functionName: "deleteDuplicates",
  prompt: `Given the head of a sorted linked list, delete **all** nodes that have a duplicate value, leaving only the values that appear exactly once in the original list. Return the head of the resulting still-sorted list.

This differs from the "keep one of each" variant: here a value that appears more than once is removed entirely, not collapsed to a single node. In this judge the list is written and checked as a plain array — \`[1, 2, 3, 3, 4, 4, 5]\` becomes \`[1, 2, 5]\`.`,
  constraints: [
    "The number of nodes in the list is in the range [0, 300].",
    "-100 <= Node.val <= 100",
    "The list is sorted in non-decreasing order.",
  ],
  io: { params: ["linked-list"], result: "linked-list" },
  starterCode: {
    javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *   this.val = (val === undefined ? 0 : val)
 *   this.next = (next === undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function deleteDuplicates(head) {
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
 * @param {ListNode} head
 * @return {ListNode}
 */
function deleteDuplicates(head: ListNode | null): ListNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "remove dupes", args: [[1, 2, 3, 3, 4, 4, 5]], expected: [1, 2, 5], explanation: "3 and 4 each repeat, so both are removed entirely." },
    { name: "leading run", args: [[1, 1, 1, 2, 3]], expected: [2, 3], explanation: "Three 1s vanish, leaving 2 and 3." },
    { name: "empty", args: [[]], expected: [] },
  ],
  hiddenTests: [
    { args: [[1]], expected: [1] },
    { args: [[1, 1]], expected: [] },
    { args: [[1, 1, 1]], expected: [] },
    { args: [[1, 2]], expected: [1, 2] },
    { args: [[1, 1, 2, 2]], expected: [] },
    { args: [[0, 0, 0, 0, 0]], expected: [] },
    { args: [[-3, -3, -2, -1, -1, 0]], expected: [-2, 0] },
    { args: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5] },
    { args: [[1, 1, 2, 3, 3]], expected: [2] },
    { args: [[2, 3, 3, 3, 4]], expected: [2, 4] },
    { args: [[5, 5, 6, 7, 7, 8]], expected: [6, 8] },
    { args: [[-100, -100, 100, 100]], expected: [] },
    { args: [[1, 2, 2, 3, 4, 4, 5, 6, 6]], expected: [1, 3, 5] },
    // Scale: 300 nodes; pairs cancel out leaving the odd-indexed singletons.
    { args: [Array.from({ length: 300 }, (_, i) => Math.floor(i / 2))], expected: [] },
    { args: [Array.from({ length: 299 }, (_, i) => i)], expected: Array.from({ length: 299 }, (_, i) => i) },
  ],
  source: { origin: "leetcode", frontendId: "82", acRate: 0.5179248817989298, confidence: 0.95 },
  solutions: [
    {
      name: "Dummy head with run detection",
      explanation: `Use a dummy node before the head so the first run can be dropped uniformly. Keep a \`prev\` pointer to the last confirmed-unique node. Scan \`curr\`: if \`curr\` starts a run of equal values, advance \`curr\` past the entire run and splice it out by setting \`prev.next = curr.next\`; otherwise \`curr\` is unique, so move \`prev\` forward. The list is sorted, so duplicates are always contiguous.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function deleteDuplicates(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  let curr = head;
  while (curr) {
    if (curr.next && curr.next.val === curr.val) {
      const val = curr.val;
      while (curr && curr.val === val) curr = curr.next;
      prev.next = curr;
    } else {
      prev = curr;
      curr = curr.next;
    }
  }
  return dummy.next;
}`,
        typescript: `function deleteDuplicates(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev: ListNode = dummy;
  let curr = head;
  while (curr) {
    if (curr.next && curr.next.val === curr.val) {
      const val = curr.val;
      while (curr && curr.val === val) curr = curr.next;
      prev.next = curr;
    } else {
      prev = curr;
      curr = curr.next;
    }
  }
  return dummy.next;
}`,
      },
    },
  ],
});
