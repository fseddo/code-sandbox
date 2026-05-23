import { defineAlgoProblem } from "../problem";

// Args/expected are plain arrays; `io` hydrates them into `ListNode` chains around the call
// (and flattens the result back), so the test data stays serializable. See problem-authoring.md.
export const swapNodesInPairs = defineAlgoProblem<[number[]], number[]>({
  id: "swap-nodes-in-pairs",
  number: 33,
  title: "Swap Nodes in Pairs",
  difficulty: "medium",
  tags: ["linked-list", "recursion"],
  functionName: "swapPairs",
  prompt: `Given the head of a linked list, swap every two adjacent nodes and return the head of the modified list.

You must solve the problem by rearranging the nodes themselves — you may not simply change the values stored inside them. If the list has an odd number of nodes, the final lone node keeps its position.

In this judge the list is written and checked as a plain array, so \`[1, 2, 3, 4]\` becomes \`[2, 1, 4, 3]\`.`,
  constraints: [
    "The number of nodes in the list is in the range [0, 100].",
    "0 <= Node.val <= 100",
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
function swapPairs(head) {
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
function swapPairs(head: ListNode | null): ListNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "two pairs", args: [[1, 2, 3, 4]], expected: [2, 1, 4, 3] },
    { name: "empty list", args: [[]], expected: [] },
    { name: "single node", args: [[1]], expected: [1] },
    { name: "odd length", args: [[1, 2, 3]], expected: [2, 1, 3], explanation: "The first pair swaps to 2, 1; the lone node 3 stays put." },
  ],
  hiddenTests: [
    { args: [[]], expected: [] },
    { args: [[7]], expected: [7] },
    { args: [[5, 9]], expected: [9, 5] },
    { args: [[1, 2, 3]], expected: [2, 1, 3] },
    { args: [[1, 2, 3, 4, 5]], expected: [2, 1, 4, 3, 5] },
    { args: [[4, 4, 4, 4]], expected: [4, 4, 4, 4] },
    { args: [[0, 0, 0]], expected: [0, 0, 0] },
    { args: [[10, 20, 30, 40, 50, 60]], expected: [20, 10, 40, 30, 60, 50] },
    { args: [[100, 0, 100, 0]], expected: [0, 100, 0, 100] },
    { args: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: [1, 3, 1, 4, 9, 5, 6, 2] },
    { args: [[8, 7, 6, 5, 4, 3, 2]], expected: [7, 8, 5, 6, 3, 4, 2] },
    { args: [[42, 17, 99, 3, 58]], expected: [17, 42, 3, 99, 58] },
    {
      args: [Array.from({ length: 100 }, (_, i) => i)],
      expected: Array.from({ length: 100 }, (_, i) => (i % 2 === 0 ? i + 1 : i - 1)),
    },
    {
      args: [Array.from({ length: 99 }, (_, i) => i)],
      expected: Array.from({ length: 99 }, (_, i) =>
        i === 98 ? 98 : i % 2 === 0 ? i + 1 : i - 1,
      ),
    },
  ],
  source: { origin: "leetcode", frontendId: "24", acRate: 0.6951532276998891, confidence: 0.97 },
  solutions: [
    {
      name: "Iterative pointer rewiring",
      explanation: `Use a dummy node pointing at the head so the first pair has a stable predecessor. Keep a \`prev\` pointer; while there are at least two nodes ahead of it (\`first\` and \`second\`), rewire links so \`second\` precedes \`first\`: \`prev.next = second\`, \`first.next = second.next\`, \`second.next = first\`. Then advance \`prev\` to \`first\` (now the tail of the swapped pair) and continue.

This swaps the nodes themselves rather than their values. An odd trailing node has no partner, so the loop stops and it stays in place.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function swapPairs(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next && prev.next.next) {
    const first = prev.next;
    const second = first.next;
    first.next = second.next;
    second.next = first;
    prev.next = second;
    prev = first;
  }
  return dummy.next;
}`,
        typescript: `function swapPairs(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev: ListNode = dummy;
  while (prev.next && prev.next.next) {
    const first = prev.next;
    const second = first.next;
    first.next = second.next;
    second.next = first;
    prev.next = second;
    prev = first;
  }
  return dummy.next;
}`,
      },
    },
  ],
});
