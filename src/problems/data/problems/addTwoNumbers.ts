import { defineAlgoProblem } from "../problem";

// Args/expected are plain arrays; `io` hydrates them into `ListNode` chains around the call
// (and flattens the result back), so the test data stays serializable. See problem-authoring.md.
export const addTwoNumbers = defineAlgoProblem<[number[], number[]], number[]>({
  id: "add-two-numbers",
  number: 2,
  title: "Add Two Numbers",
  difficulty: "medium",
  tags: ["linked-list", "math", "recursion"],
  functionName: "addTwoNumbers",
  prompt: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each node holds a single digit. Add the two numbers and return the sum as a linked list, in the same reverse-order form.

Assume the two numbers do not contain leading zeros, except the number 0 itself. In this judge the lists are written and checked as plain arrays — \`[2, 4, 3]\` is the number 342.`,
  constraints: [
    "The number of nodes in each list is in the range [1, 100].",
    "0 <= Node.val <= 9",
    "Each list represents a number with no leading zeros, except 0 itself.",
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
function addTwoNumbers(l1, l2) {
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
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "342 + 465", args: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8], explanation: "342 + 465 = 807." },
    { name: "0 + 0", args: [[0], [0]], expected: [0] },
    {
      name: "carry across lengths",
      args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]],
      expected: [8, 9, 9, 9, 0, 0, 0, 1],
      explanation: "9999999 + 9999 = 10009998.",
    },
  ],
  hiddenTests: [
    { args: [[5], [5]], expected: [0, 1] },
    { args: [[1, 8], [0]], expected: [1, 8] },
    { args: [[0], [7, 3]], expected: [7, 3] },
    { args: [[9], [1]], expected: [0, 1] },
    { args: [[2, 4, 9], [5, 6, 4, 9]], expected: [7, 0, 4, 0, 1] },
    { args: [[1], [9, 9, 9, 9]], expected: [0, 0, 0, 0, 1] },
    { args: [[9, 9, 9], [1]], expected: [0, 0, 0, 1] },
    { args: [[1, 0, 0, 0, 0, 0, 0, 1], [5, 6, 4]], expected: [6, 6, 4, 0, 0, 0, 0, 1] },
    { args: [[7, 1, 6], [5, 9, 2]], expected: [2, 1, 9] },
    // Anti-cheese: 9007199254740993 = 2^53 + 1 isn't representable as a JS number, so a
    // parse-to-Number solution corrupts a digit; digit-by-digit addition stays exact.
    { args: [[3, 9, 9, 0, 4, 7, 4, 5, 2, 9, 9, 1, 7, 0, 0, 9], [0]], expected: [3, 9, 9, 0, 4, 7, 4, 5, 2, 9, 9, 1, 7, 0, 0, 9] },
    { args: [[6, 3, 4, 2, 8], [3, 9, 9, 1]], expected: [9, 2, 4, 4, 8] },
    { args: [[0], [0, 0, 1]], expected: [0, 0, 1] },
  ],
  source: { origin: "leetcode", frontendId: "2", acRate: 0.48473368051673477 },
  solutions: [
    {
      name: "Elementary addition with carry",
      explanation: `Walk both lists in lockstep. At each step add the two digits (0 when a list is exhausted) plus the carry; the new node's value is \`sum % 10\` and the carry becomes \`Math.floor(sum / 10)\`. Keep going while either list has nodes **or** a carry remains — that trailing carry is what turns 999 + 1 into a new most-significant digit.

Because we add digit-by-digit there's no integer-overflow concern, which is the whole point of the linked-list form.

\`O(max(m, n))\` time, \`O(max(m, n))\` space.`,
      code: {
        javascript: `function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}`,
        typescript: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}`,
      },
    },
  ],
});
