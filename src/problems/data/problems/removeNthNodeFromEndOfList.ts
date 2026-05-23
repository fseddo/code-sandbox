import { defineAlgoProblem } from "../problem";

// Args/expected are plain arrays; `io` hydrates `head` into a `ListNode` chain and flattens the
// returned chain back to an array. `n` is a plain number passed through untouched.
export const removeNthNodeFromEndOfList = defineAlgoProblem<[number[], number], number[]>({
  id: "remove-nth-node-from-end-of-list",
  number: 29,
  title: "Remove Nth Node From End of List",
  difficulty: "medium",
  tags: ["linked-list", "two-pointers"],
  functionName: "removeNthFromEnd",
  prompt: `Given the \`head\` of a singly linked list and an integer \`n\`, remove the \`n\`-th node counting from the **end** of the list and return the head of the resulting list.

\`n\` is 1-indexed from the end: \`n = 1\` removes the last node, \`n = 2\` removes the second-to-last, and so on. \`n\` is always a valid position, so \`1 <= n <= length\`. If the list had a single node, removing it leaves the empty list.

In this judge the list is written and checked as a plain array — \`[1, 2, 3, 4, 5]\` is the chain \`1 -> 2 -> 3 -> 4 -> 5\`, and the empty list is \`[]\`.`,
  constraints: [
    "The number of nodes in the list is in the range [1, 30].",
    "0 <= Node.val <= 100",
    "1 <= n <= the number of nodes in the list.",
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
 * @param {number} n
 * @return {ListNode}
 */
function removeNthFromEnd(head, n) {
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
 * @param {number} n
 * @return {ListNode}
 */
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // your code here
}`,
  },
  examples: [
    {
      name: "remove 2nd from end",
      args: [[1, 2, 3, 4, 5], 2],
      expected: [1, 2, 3, 5],
      explanation: "Counting from the end, the 2nd node is `4`; removing it leaves `1 -> 2 -> 3 -> 5`.",
    },
    {
      name: "single node",
      args: [[1], 1],
      expected: [],
      explanation: "The only node is the 1st from the end; removing it leaves the empty list.",
    },
    {
      name: "remove the head",
      args: [[1, 2], 2],
      expected: [2],
      explanation: "With 2 nodes, the 2nd from the end is the head `1`.",
    },
  ],
  hiddenTests: [
    // Boundary: remove the last node (n = 1).
    { args: [[1, 2, 3], 1], expected: [1, 2] },
    { args: [[7], 1], expected: [] },
    // Structural: remove the head (n = length).
    { args: [[1, 2, 3, 4], 4], expected: [2, 3, 4] },
    { args: [[5, 9], 2], expected: [9] },
    // Middle removals.
    { args: [[1, 2, 3, 4, 5], 3], expected: [1, 2, 4, 5] },
    { args: [[10, 20, 30, 40, 50, 60], 4], expected: [10, 20, 40, 50, 60] },
    // Edge: duplicate values — must remove by position, not by value.
    { args: [[2, 2, 2, 2], 2], expected: [2, 2, 2] },
    { args: [[3, 3, 3], 1], expected: [3, 3] },
    { args: [[1, 1], 1], expected: [1] },
    // Edge: zero values present.
    { args: [[0, 0, 0, 0], 3], expected: [0, 0, 0] },
    // Anti-hardcode: values unlike any example, removing from the middle.
    { args: [[42, 7, 99, 13, 64, 88], 5], expected: [42, 99, 13, 64, 88] },
    { args: [[100, 0, 55, 23], 2], expected: [100, 0, 23] },
    { args: [[8, 6, 7, 5, 3, 0, 9], 7], expected: [6, 7, 5, 3, 0, 9] },
    // Scale: max-size list (30 nodes), remove from the far end.
    {
      args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], 29],
      expected: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    },
    {
      args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], 1],
      expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    },
  ],
  source: { origin: "leetcode", frontendId: "19", acRate: 0.515828242528122 },
  solutions: [
    {
      name: "Two pointers, one pass",
      explanation: `Use a dummy node before the head so removing the real head needs no special case. Advance a \`fast\` pointer \`n + 1\` steps from the dummy, then move \`fast\` and \`slow\` together until \`fast\` falls off the end. At that point \`slow\` sits on the node *just before* the one to remove, so \`slow.next = slow.next.next\` splices it out.

The gap of \`n + 1\` between the pointers guarantees \`slow\` stops one short of the target. Single traversal, no length pre-count.

\`O(L)\` time where \`L\` is the list length, \`O(1)\` space.`,
      code: {
        javascript: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
        typescript: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy;
  let slow: ListNode = dummy;
  for (let i = 0; i <= n; i++) {
    fast = fast!.next;
  }
  while (fast) {
    fast = fast.next;
    slow = slow.next!;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}`,
      },
    },
  ],
});
