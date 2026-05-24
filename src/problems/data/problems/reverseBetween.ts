import { defineAlgoProblem } from "../problem";

// `io` hydrates the input array into a `ListNode` chain and flattens the returned chain back to an
// array; `left`/`right` are plain numbers. Test data stays serializable. See problem-authoring.md.
export const reverseBetween = defineAlgoProblem<[number[], number, number], number[]>({
  id: "reverse-linked-list-ii",
  number: 98,
  title: "Reverse Linked List II",
  difficulty: "medium",
  tags: ["linked-list"],
  functionName: "reverseBetween",
  prompt: `Given the head of a singly linked list and two 1-based positions \`left <= right\`, reverse the nodes from position \`left\` to position \`right\` inclusive, and return the head of the modified list. Nodes outside that range keep their order.

Lists are shown in array notation for readability — \`reverseBetween([1,2,3,4,5], 2, 4)\` reverses the middle three to give \`[1,4,3,2,5]\`.`,
  constraints: [
    "The number of nodes in the list is in the range [1, 500].",
    "-500 <= Node.val <= 500",
    "1 <= left <= right <= n",
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
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
function reverseBetween(head, left, right) {
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
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "middle reversed", args: [[1, 2, 3, 4, 5], 2, 4], expected: [1, 4, 3, 2, 5], explanation: "Positions 2..4 (2,3,4) reverse to 4,3,2." },
    { name: "single node", args: [[5], 1, 1], expected: [5], explanation: "A one-node range is unchanged." },
    { name: "whole list", args: [[1, 2, 3, 4, 5], 1, 5], expected: [5, 4, 3, 2, 1] },
  ],
  hiddenTests: [
    { args: [[1, 2], 1, 2], expected: [2, 1] },
    { args: [[1, 2, 3, 4, 5], 1, 1], expected: [1, 2, 3, 4, 5] },
    { args: [[3, 5], 1, 1], expected: [3, 5] },
    { args: [[1, 2, 3], 2, 3], expected: [1, 3, 2] },
    { args: [[1, 2, 3, 4, 5, 6, 7], 3, 6], expected: [1, 2, 6, 5, 4, 3, 7] },
    { args: [[1, 2, 3, 4], 2, 2], expected: [1, 2, 3, 4] },
    { args: [[1, 2, 3, 4], 2, 4], expected: [1, 4, 3, 2] },
    { args: [[-5, -4, -3, -2, -1], 2, 4], expected: [-5, -2, -3, -4, -1] },
    { args: [[7, 7, 7, 7], 1, 3], expected: [7, 7, 7, 7] },
    { args: [[10, 20, 30, 40, 50], 4, 5], expected: [10, 20, 30, 50, 40] },
    // Reverse starting at the head but not to the end — exercises the "left === 1" head-relink branch.
    { args: [[1, 2, 3, 4, 5], 1, 3], expected: [3, 2, 1, 4, 5] },
    // Scale: reverse a middle window inside a 500-node list.
    {
      args: [Array.from({ length: 500 }, (_, i) => i + 1), 100, 400],
      expected: (() => {
        const a = Array.from({ length: 500 }, (_, i) => i + 1);
        const sub = a.slice(99, 400).reverse();
        return [...a.slice(0, 99), ...sub, ...a.slice(400)];
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "92", acRate: 0.5152777264280363, confidence: 0.93 },
  solutions: [
    {
      name: "Head-insertion in one pass",
      explanation: `Use a dummy node before the head so reversing from position 1 needs no special case. Walk \`prev\` to the node just before \`left\`. Then repeatedly take the node after the current sub-list head and splice it to the front of the reversed region — a head-insertion that reverses the window in place over \`right - left\` moves.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function reverseBetween(head, left, right) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 1; i < left; i++) prev = prev.next;
  const curr = prev.next;
  for (let i = 0; i < right - left; i++) {
    const moved = curr.next;
    curr.next = moved.next;
    moved.next = prev.next;
    prev.next = moved;
  }
  return dummy.next;
}`,
        typescript: `function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 1; i < left; i++) prev = prev.next!;
  const curr = prev.next!;
  for (let i = 0; i < right - left; i++) {
    const moved = curr.next!;
    curr.next = moved.next;
    moved.next = prev.next;
    prev.next = moved;
  }
  return dummy.next;
}`,
      },
    },
  ],
});
