import { defineAlgoProblem } from "../problem";

// Linked-list I/O on the first param only; the second (x) is a plain value passed through.
export const partitionList = defineAlgoProblem<[number[], number], number[]>({
  id: "partition-list",
  number: 92,
  title: "Partition List",
  difficulty: "medium",
  tags: ["linked-list", "two-pointers"],
  functionName: "partition",
  prompt: `Given the head of a linked list and a value \`x\`, partition the list so that all nodes with value **less than** \`x\` come before all nodes with value **greater than or equal to** \`x\`.

You must preserve the original relative order of the nodes within each of the two groups (a stable partition). In this judge the list is written and checked as a plain array.`,
  constraints: [
    "The number of nodes in the list is in the range [0, 200].",
    "-100 <= Node.val <= 100",
    "-200 <= x <= 200",
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
 * @param {number} x
 * @return {ListNode}
 */
function partition(head, x) {
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
 * @param {number} x
 * @return {ListNode}
 */
function partition(head: ListNode | null, x: number): ListNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "classic", args: [[1, 4, 3, 2, 5, 2], 3], expected: [1, 2, 2, 4, 3, 5], explanation: "Values < 3 (1, 2, 2) keep their order, then values >= 3 (4, 3, 5) keep theirs." },
    { name: "all moved", args: [[2, 1], 2], expected: [1, 2], explanation: "1 < 2 goes first, 2 stays after." },
    { name: "empty", args: [[], 0], expected: [] },
  ],
  hiddenTests: [
    { args: [[1], 2], expected: [1] },
    { args: [[1], 0], expected: [1] },
    { args: [[3, 1, 2], 3], expected: [1, 2, 3] },
    { args: [[1, 2, 3], 2], expected: [1, 2, 3] },
    { args: [[3, 2, 1], 2], expected: [1, 3, 2] },
    { args: [[5, 5, 5], 5], expected: [5, 5, 5] },
    { args: [[1, 1, 1], 5], expected: [1, 1, 1] },
    { args: [[0, 0, 0], -1], expected: [0, 0, 0] },
    { args: [[-3, -1, 2, -5, 4], 0], expected: [-3, -1, -5, 2, 4] },
    { args: [[4, 3, 2, 5, 2], 3], expected: [2, 2, 4, 3, 5] },
    { args: [[2, 2, 2, 1, 1], 2], expected: [1, 1, 2, 2, 2] },
    { args: [[-100, 100, -100, 100], 0], expected: [-100, -100, 100, 100] },
    { args: [[10, 4, 7, 2, 8, 1], 7], expected: [4, 2, 1, 10, 7, 8] },
    // Scale: 200 nodes, alternating high/low; stable partition preserves both orders.
    { args: [Array.from({ length: 200 }, (_, i) => (i % 2 === 0 ? 1 : 100)), 50], expected: [...Array.from({ length: 100 }, () => 1), ...Array.from({ length: 100 }, () => 100)] },
  ],
  source: { origin: "leetcode", frontendId: "86", acRate: 0.6117437960203659, confidence: 0.95 },
  solutions: [
    {
      name: "Two queues, then splice",
      explanation: `Build two separate chains with dummy heads: a "less" chain for nodes with value \`< x\` and a "greater-or-equal" chain for the rest. Walking the original list in order and appending to the right chain preserves each group's relative order for free. Finally link the less chain to the head of the ge chain (terminating the ge chain with \`null\`).

\`O(n)\` time, \`O(1)\` extra space.`,
      code: {
        javascript: `function partition(head, x) {
  const lessDummy = new ListNode(0);
  const geDummy = new ListNode(0);
  let less = lessDummy;
  let ge = geDummy;
  for (let curr = head; curr; curr = curr.next) {
    if (curr.val < x) {
      less.next = curr;
      less = curr;
    } else {
      ge.next = curr;
      ge = curr;
    }
  }
  ge.next = null;
  less.next = geDummy.next;
  return lessDummy.next;
}`,
        typescript: `function partition(head: ListNode | null, x: number): ListNode | null {
  const lessDummy = new ListNode(0);
  const geDummy = new ListNode(0);
  let less = lessDummy;
  let ge = geDummy;
  for (let curr = head; curr; curr = curr.next) {
    if (curr.val < x) {
      less.next = curr;
      less = curr;
    } else {
      ge.next = curr;
      ge = curr;
    }
  }
  ge.next = null;
  less.next = geDummy.next;
  return lessDummy.next;
}`,
      },
    },
  ],
});
