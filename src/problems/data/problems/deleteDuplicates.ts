import { defineAlgoProblem } from "../problem";

// Linked-list I/O: array test data hydrates into a ListNode chain around the call.
export const deleteDuplicates = defineAlgoProblem<[number[]], number[]>({
  id: "remove-duplicates-from-sorted-list",
  number: 89,
  title: "Remove Duplicates from Sorted List",
  difficulty: "easy",
  tags: ["linked-list"],
  functionName: "deleteDuplicates",
  prompt: `Given the head of a sorted linked list, remove all duplicate values so that each value appears **once**. Return the head of the still-sorted list.

Unlike the harder variant, here a repeated value is collapsed to a single node rather than removed entirely. In this judge the list is written and checked as a plain array — \`[1, 1, 2, 3, 3]\` becomes \`[1, 2, 3]\`.`,
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
    { name: "collapse runs", args: [[1, 1, 2]], expected: [1, 2], explanation: "The two 1s collapse to one." },
    { name: "two runs", args: [[1, 1, 2, 3, 3]], expected: [1, 2, 3] },
    { name: "empty", args: [[]], expected: [] },
  ],
  hiddenTests: [
    { args: [[1]], expected: [1] },
    { args: [[1, 1]], expected: [1] },
    { args: [[1, 1, 1, 1]], expected: [1] },
    { args: [[1, 2, 3]], expected: [1, 2, 3] },
    { args: [[0, 0, 0, 1, 1]], expected: [0, 1] },
    { args: [[-2, -2, -1, 0, 0]], expected: [-2, -1, 0] },
    { args: [[-100, -100, 100, 100]], expected: [-100, 100] },
    { args: [[5, 5, 5, 6, 7, 7]], expected: [5, 6, 7] },
    { args: [[1, 2, 2, 3, 4, 4, 4, 5]], expected: [1, 2, 3, 4, 5] },
    { args: [[3]], expected: [3] },
    { args: [[2, 2, 2, 2, 2, 2]], expected: [2] },
    // Scale: 300 nodes alternating values, then 300 identical.
    { args: [Array.from({ length: 300 }, (_, i) => Math.floor(i / 3))], expected: Array.from({ length: 100 }, (_, i) => i) },
    { args: [Array.from({ length: 300 }, () => 9)], expected: [9] },
  ],
  source: { origin: "leetcode", frontendId: "83", acRate: 0.5673594616463352, confidence: 0.95 },
  solutions: [
    {
      name: "Single pass, skip equal neighbours",
      explanation: `Walk the list with one pointer \`curr\`. Whenever \`curr.next\` holds the same value as \`curr\`, splice it out (\`curr.next = curr.next.next\`) without advancing; otherwise advance \`curr\`. Because the list is sorted, equal values are adjacent, so one pass suffices.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function deleteDuplicates(head) {
  let curr = head;
  while (curr && curr.next) {
    if (curr.next.val === curr.val) {
      curr.next = curr.next.next;
    } else {
      curr = curr.next;
    }
  }
  return head;
}`,
        typescript: `function deleteDuplicates(head: ListNode | null): ListNode | null {
  let curr = head;
  while (curr && curr.next) {
    if (curr.next.val === curr.val) {
      curr.next = curr.next.next;
    } else {
      curr = curr.next;
    }
  }
  return head;
}`,
      },
    },
  ],
});
