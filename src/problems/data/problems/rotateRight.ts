import { defineAlgoProblem } from "../problem";

// Args/expected are plain arrays; `io` hydrates `head` into a `ListNode` chain and flattens the
// returned chain back. `k` is a plain number passed through untouched.
export const rotateRight = defineAlgoProblem<[number[], number], number[]>({
  id: "rotate-list",
  number: 68,
  title: "Rotate List",
  difficulty: "medium",
  tags: ["linked-list", "two-pointers"],
  functionName: "rotateRight",
  prompt: `Given the \`head\` of a singly linked list and an integer \`k\`, rotate the list to the right by \`k\` places and return the head of the rotated list.

Each rotation moves the last node to the front. Because rotating by the list's length restores the original order, only \`k mod length\` rotations have any effect — \`k\` may be much larger than the list.

Lists are shown in array notation for readability — \`[1, 2, 3, 4, 5]\` is the chain \`1 -> 2 -> 3 -> 4 -> 5\`, and the empty list is \`[]\`.`,
  constraints: [
    "The number of nodes in the list is in the range [0, 500].",
    "-100 <= Node.val <= 100",
    "0 <= k <= 2 * 10^9",
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
 * @param {number} k
 * @return {ListNode}
 */
function rotateRight(head, k) {
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
 * @param {number} k
 * @return {ListNode}
 */
function rotateRight(head: ListNode | null, k: number): ListNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "rotate by 2", args: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3], explanation: "Two right rotations move 5 then 4 to the front." },
    { name: "wraps around", args: [[0, 1, 2], 4], expected: [2, 0, 1], explanation: "4 mod 3 = 1, so this is a single right rotation." },
    { name: "empty list", args: [[], 3], expected: [] },
  ],
  hiddenTests: [
    { args: [[1], 0], expected: [1] },
    { args: [[1], 99], expected: [1] },
    { args: [[1, 2], 1], expected: [2, 1] },
    { args: [[1, 2], 2], expected: [1, 2] },
    { args: [[1, 2], 3], expected: [2, 1] },
    { args: [[1, 2, 3, 4, 5], 0], expected: [1, 2, 3, 4, 5] },
    { args: [[1, 2, 3, 4, 5], 5], expected: [1, 2, 3, 4, 5] },
    { args: [[1, 2, 3, 4, 5], 7], expected: [4, 5, 1, 2, 3] },
    { args: [[-1, -2, -3], 1], expected: [-3, -1, -2] },
    { args: [[10, 20, 30, 40], 6], expected: [30, 40, 10, 20] },
    { args: [[], 0], expected: [] },
    { args: [[5, 5, 5], 2], expected: [5, 5, 5] },
    // Scale: large list, large k that must be reduced mod length.
    { args: [Array.from({ length: 500 }, (_, i) => i), 2000000000], expected: (() => { const a = Array.from({ length: 500 }, (_, i) => i); const k = 2000000000 % 500; return [...a.slice(a.length - k), ...a.slice(0, a.length - k)]; })() },
  ],
  source: { origin: "leetcode", frontendId: "61", acRate: 0.42576443562236543, confidence: 0.95 },
  solutions: [
    {
      name: "Close the ring, cut at the new tail",
      explanation: `Walk to the end to get the length and the tail, then connect the tail back to the head to form a ring. The effective rotation is \`k mod length\`; the new tail sits \`length - (k mod length)\` steps from the original head, and the node after it becomes the new head. Break the ring there.

Empty or single-element lists, and \`k\` that's a multiple of the length, return unchanged.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function rotateRight(head, k) {
  if (!head || !head.next) return head;
  let len = 1;
  let tail = head;
  while (tail.next) { tail = tail.next; len++; }
  const shift = k % len;
  if (shift === 0) return head;
  tail.next = head;
  let stepsToNewTail = len - shift;
  let newTail = head;
  while (--stepsToNewTail > 0) newTail = newTail.next;
  const newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`,
        typescript: `function rotateRight(head: ListNode | null, k: number): ListNode | null {
  if (!head || !head.next) return head;
  let len = 1;
  let tail: ListNode = head;
  while (tail.next) { tail = tail.next; len++; }
  const shift = k % len;
  if (shift === 0) return head;
  tail.next = head;
  let stepsToNewTail = len - shift;
  let newTail: ListNode = head;
  while (--stepsToNewTail > 0) newTail = newTail.next!;
  const newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`,
      },
    },
  ],
});
