import { defineAlgoProblem } from "../problem";

// Args is a plain array; `io` hydrates it into a `ListNode` chain around the call. The result is a
// plain boolean (`"value"`), passed straight through. See problem-authoring.md.
export const palindromeLinkedList = defineAlgoProblem<[number[]], boolean>({
  id: "palindrome-linked-list",
  number: 110,
  title: "Palindrome Linked List",
  difficulty: "easy",
  tags: ["linked-list", "two-pointers", "stack", "recursion"],
  functionName: "isPalindrome",
  prompt: `Given the \`head\` of a singly linked list, return \`true\` if the list reads the same forwards and backwards, and \`false\` otherwise.

Your function receives a \`ListNode\` chain; the examples show each list in array notation for readability — \`[1, 2, 2, 1]\` is the chain \`1 -> 2 -> 2 -> 1\`, which is a palindrome.

Aim for \`O(n)\` time and \`O(1)\` extra space.`,
  constraints: [
    "The number of nodes in the list is in the range [1, 100000].",
    "0 <= Node.val <= 9",
  ],
  io: { params: ["linked-list"], result: "value" },
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
 * @return {boolean}
 */
function isPalindrome(head) {
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
 * @return {boolean}
 */
function isPalindrome(head: ListNode | null): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "even palindrome", args: [[1, 2, 2, 1]], expected: true, explanation: "Reads the same both ways." },
    { name: "not a palindrome", args: [[1, 2]], expected: false, explanation: "1->2 reversed is 2->1, which differs." },
    { name: "odd palindrome", args: [[1, 2, 3, 2, 1]], expected: true },
  ],
  hiddenTests: [
    { args: [[1]], expected: true },
    { args: [[1, 1]], expected: true },
    { args: [[1, 2, 1]], expected: true },
    { args: [[1, 0, 1, 1, 0, 1]], expected: true },
    { args: [[1, 0, 0]], expected: false },
    { args: [[9, 8, 7, 6, 5]], expected: false },
    { args: [[2, 2, 2, 2]], expected: true },
    { args: [[1, 2, 3, 4, 3, 2, 1]], expected: true },
    { args: [[1, 2, 3, 4, 2, 1]], expected: false },
    { args: [[0, 0, 0, 0, 0, 0, 1]], expected: false },
    {
      args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1]],
      expected: true,
    },
  ],
  source: { origin: "leetcode", frontendId: "234", acRate: 0.54, confidence: 0.96 },
  solutions: [
    {
      name: "Find middle, reverse second half, compare",
      explanation: `A palindrome reads the same from both ends, so compare the front half against the back half. To do that in \`O(1)\` extra space, work in place.

First find the middle with the slow/fast (tortoise/hare) trick: \`fast\` moves two nodes for every one of \`slow\`, so when \`fast\` runs off the end, \`slow\` sits at the midpoint. Reverse the second half starting from \`slow\` using the standard three-pointer rewire. Then walk the original front and the reversed back in lockstep — if any pair of values differs, it isn't a palindrome.

For an odd-length list the exact middle node is shared by both halves and never needs to match, so the lockstep comparison (which stops when the shorter, reversed half ends) handles it for free.

\`O(n)\` time (find + reverse + compare are each one pass), \`O(1)\` space.`,
      code: {
        javascript: `function isPalindrome(head) {
  // Step 1: find the midpoint. fast moves twice as fast as slow,
  // so slow lands on the start of the second half.
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // Step 2: reverse the second half (everything from slow onward).
  let prev = null;
  while (slow) {
    const next = slow.next;
    slow.next = prev;
    prev = slow;
    slow = next;
  }
  // Step 3: walk the front half and the reversed back half together.
  // prev heads the reversed back half; it's the shorter side on odd lengths.
  let left = head;
  let right = prev;
  while (right) {
    if (left.val !== right.val) return false;
    left = left.next;
    right = right.next;
  }
  return true;
}`,
        typescript: `function isPalindrome(head: ListNode | null): boolean {
  // Step 1: find the midpoint. fast moves twice as fast as slow,
  // so slow lands on the start of the second half.
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  // Step 2: reverse the second half (everything from slow onward).
  let prev: ListNode | null = null;
  while (slow) {
    const next: ListNode | null = slow.next;
    slow.next = prev;
    prev = slow;
    slow = next;
  }
  // Step 3: walk the front half and the reversed back half together.
  // prev heads the reversed back half; it's the shorter side on odd lengths.
  let left: ListNode | null = head;
  let right: ListNode | null = prev;
  while (right) {
    if (left!.val !== right.val) return false;
    left = left!.next;
    right = right.next;
  }
  return true;
}`,
      },
    },
  ],
});
