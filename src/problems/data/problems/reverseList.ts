import { defineAlgoProblem } from "../problem";

// Args/expected are plain arrays; `io` hydrates them into a `ListNode` chain around the call
// (and flattens the result back), so the test data stays serializable. See problem-authoring.md.
export const reverseList = defineAlgoProblem<[number[]], number[]>({
  id: "reverse-linked-list",
  number: 109,
  title: "Reverse Linked List",
  difficulty: "easy",
  tags: ["linked-list", "recursion"],
  functionName: "reverseList",
  prompt: `Given the \`head\` of a singly linked list, reverse the list and return the head of the reversed list.

Your function receives and returns a \`ListNode\` chain; the examples below show each list in array notation for readability — \`[1, 2, 3, 4, 5]\` is the chain \`1 -> 2 -> 3 -> 4 -> 5\`, which reverses to \`5 -> 4 -> 3 -> 2 -> 1\`.`,
  constraints: [
    "The number of nodes in the list is in the range [0, 5000].",
    "-5000 <= Node.val <= 5000",
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
function reverseList(head) {
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
function reverseList(head: ListNode | null): ListNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "odd length", args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], explanation: "1->2->3->4->5 reverses to 5->4->3->2->1." },
    { name: "two nodes", args: [[1, 2]], expected: [2, 1] },
    { name: "empty list", args: [[]], expected: [] },
  ],
  hiddenTests: [
    { args: [[1]], expected: [1] },
    { args: [[7, 7, 7]], expected: [7, 7, 7] },
    { args: [[-5, -1, 0, 3]], expected: [3, 0, -1, -5] },
    { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1] },
    { args: [[10, 20, 30, 40, 50, 60]], expected: [60, 50, 40, 30, 20, 10] },
    { args: [[0, 0, 1, 0]], expected: [0, 1, 0, 0] },
    { args: [[-3, -2, -1]], expected: [-1, -2, -3] },
    { args: [[5000, -5000, 1, -1]], expected: [-1, 1, -5000, 5000] },
    {
      args: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]],
      expected: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    },
  ],
  source: { origin: "leetcode", frontendId: "206", acRate: 0.78, confidence: 0.98 },
  solutions: [
    {
      name: "Iterative three-pointer rewire",
      explanation: `Walk the list once, flipping each \`next\` pointer to face backwards. Keep three references: \`prev\` (the already-reversed prefix, starting at \`null\`), \`curr\` (the node being rewired), and a saved \`next\` so we don't lose the rest of the list when we overwrite \`curr.next\`.

At each step: stash \`curr.next\`, point \`curr.next\` back at \`prev\`, then slide \`prev\` and \`curr\` forward one node. When \`curr\` falls off the end, \`prev\` is the new head.

\`O(n)\` time (one pass), \`O(1)\` space (only the three pointers).`,
      code: {
        javascript: `function reverseList(head) {
  let prev = null;        // the reversed portion built so far (empty at first)
  let curr = head;        // the node we're about to rewire
  while (curr) {
    const next = curr.next; // save the rest of the list before we overwrite the link
    curr.next = prev;       // flip this node's pointer to face backwards
    prev = curr;            // the reversed portion now includes curr
    curr = next;            // advance into the still-forward portion
  }
  return prev;            // curr is null; prev is the last node visited = new head
}`,
        typescript: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null; // the reversed portion built so far (empty at first)
  let curr: ListNode | null = head; // the node we're about to rewire
  while (curr) {
    const next: ListNode | null = curr.next; // save the rest before we overwrite the link
    curr.next = prev;       // flip this node's pointer to face backwards
    prev = curr;            // the reversed portion now includes curr
    curr = next;            // advance into the still-forward portion
  }
  return prev;            // curr is null; prev is the last node visited = new head
}`,
      },
    },
  ],
});
