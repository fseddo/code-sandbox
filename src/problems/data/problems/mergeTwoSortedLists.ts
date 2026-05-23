import { defineAlgoProblem } from "../problem";

// Args/expected are plain arrays; `io` hydrates them into `ListNode` chains around the call
// (and flattens the result back), so the test data stays serializable. See problem-authoring.md.
export const mergeTwoSortedLists = defineAlgoProblem<[number[], number[]], number[]>({
  id: "merge-two-sorted-lists",
  number: 31,
  title: "Merge Two Sorted Lists",
  difficulty: "easy",
  tags: ["linked-list", "recursion"],
  functionName: "mergeTwoLists",
  prompt: `You are given the heads of two sorted linked lists, \`list1\` and \`list2\`. Each list is sorted in **non-decreasing** order.

Splice the two lists together into a single sorted linked list and return its head. The merged list should be assembled from the nodes of the two input lists, preserving non-decreasing order.

Either list may be empty. In this judge the lists are written and checked as plain arrays — \`[1, 2, 4]\` is the list \`1 -> 2 -> 4\`, and \`[]\` is an empty list.`,
  constraints: [
    "The number of nodes in each list is in the range [0, 50].",
    "-100 <= Node.val <= 100",
    "Both list1 and list2 are sorted in non-decreasing order.",
  ],
  io: { params: ["linked-list", "linked-list"], result: "linked-list" },
  starterCode: {
    javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *   this.val = (val === undefined ? 0 : val)
 *   this.next = (next === undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
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
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // your code here
}`,
  },
  examples: [
    {
      name: "interleaved",
      args: [[1, 2, 4], [1, 3, 4]],
      expected: [1, 1, 2, 3, 4, 4],
      explanation: "Merging 1->2->4 with 1->3->4 yields 1->1->2->3->4->4.",
    },
    { name: "both empty", args: [[], []], expected: [] },
    {
      name: "one empty",
      args: [[], [0]],
      expected: [0],
      explanation: "An empty list merged with 0 is just 0.",
    },
  ],
  hiddenTests: [
    { args: [[1], [2]], expected: [1, 2] },
    { args: [[2], [1]], expected: [1, 2] },
    { args: [[5], []], expected: [5] },
    { args: [[], [5]], expected: [5] },
    // All of list1 precedes all of list2 (no interleaving).
    { args: [[1, 2, 3], [4, 5, 6]], expected: [1, 2, 3, 4, 5, 6] },
    // All of list2 precedes all of list1.
    { args: [[7, 8, 9], [1, 2, 3]], expected: [1, 2, 3, 7, 8, 9] },
    // Duplicates across and within both lists.
    { args: [[2, 2, 2], [2, 2]], expected: [2, 2, 2, 2, 2] },
    // Negatives and the value bounds.
    { args: [[-100, 0, 100], [-50, 50]], expected: [-100, -50, 0, 50, 100] },
    { args: [[-3, -1], [-2, 0]], expected: [-3, -2, -1, 0] },
    // Uneven lengths, tail comes from list1.
    { args: [[1, 5, 10, 20], [2]], expected: [1, 2, 5, 10, 20] },
    // Uneven lengths, tail comes from list2.
    { args: [[3], [1, 2, 4, 8, 16]], expected: [1, 2, 3, 4, 8, 16] },
    // Anti-hardcode / scale: two interleaved runs of length 50.
    {
      args: [
        Array.from({ length: 50 }, (_, i) => i * 2 - 50),
        Array.from({ length: 50 }, (_, i) => i * 2 - 49),
      ],
      expected: Array.from({ length: 100 }, (_, i) => i - 50),
    },
  ],
  source: { origin: "leetcode", frontendId: "21", acRate: 0.6828894256858239, confidence: 0.97 },
  solutions: [
    {
      name: "Iterative splice with dummy head",
      explanation: `Keep a dummy head and a \`tail\` pointer. While both lists have nodes, append whichever current node is smaller (ties go to either; appending from \`list1\` keeps it stable) and advance that list. When one list runs out, attach the remaining nodes of the other directly — they are already sorted and all at least as large as everything appended so far. Return \`dummy.next\`.

Both inputs may be empty, in which case the loop never runs and we attach the (possibly null) leftover, returning an empty list correctly.

\`O(m + n)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`,
        typescript: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`,
      },
    },
  ],
});
