import { defineAlgoProblem } from "../problem";

// The head is written/checked as a plain array; `io` hydrates it into a `ListNode` chain
// around the call and flattens the result back. `k` has no entry in `params`, so it passes
// through as a plain number. See problem-authoring.md.
export const reverseNodesInKGroup = defineAlgoProblem<[number[], number], number[]>({
  id: "reverse-nodes-in-k-group",
  number: 34,
  title: "Reverse Nodes in k-Group",
  difficulty: "hard",
  tags: ["linked-list", "recursion"],
  functionName: "reverseKGroup",
  prompt: `You are given the head of a linked list and an integer \`k\`. Reverse the nodes of the list **k at a time** and return the new head.

Walk the list in consecutive blocks of \`k\` nodes and reverse each block. If the number of nodes remaining at the end is **fewer than \`k\`**, leave that trailing group in its original order. Only the links between nodes may change — do not alter any node's value.

In this judge the list is written and checked as a plain array — with \`head = [1, 2, 3, 4, 5]\` and \`k = 2\` the answer is \`[2, 1, 4, 3, 5]\`: the first two and next two are reversed, and the lone trailing \`5\` stays put.`,
  constraints: [
    "The number of nodes in the list is in the range [1, 5000].",
    "0 <= Node.val <= 1000",
    "1 <= k <= the number of nodes in the list.",
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
function reverseKGroup(head, k) {
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
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  // your code here
}`,
  },
  examples: [
    {
      name: "k = 2",
      args: [[1, 2, 3, 4, 5], 2],
      expected: [2, 1, 4, 3, 5],
      explanation: "Reverse [1,2]→[2,1] and [3,4]→[4,3]; the trailing 5 has fewer than 2 nodes left, so it stays.",
    },
    {
      name: "k = 3",
      args: [[1, 2, 3, 4, 5], 3],
      expected: [3, 2, 1, 4, 5],
      explanation: "Reverse the first three; the remaining [4,5] is shorter than 3, so it is unchanged.",
    },
    {
      name: "k = 1 is identity",
      args: [[1, 2, 3, 4, 5], 1],
      expected: [1, 2, 3, 4, 5],
      explanation: "Reversing single nodes leaves the list as-is.",
    },
  ],
  hiddenTests: [
    // Boundary: single node, any k that fits (k <= length).
    { args: [[7], 1], expected: [7] },
    // k equals length → full reverse.
    { args: [[1, 2, 3, 4], 4], expected: [4, 3, 2, 1] },
    // k = 1 on a longer list → identity.
    { args: [[5, 4, 3, 2, 1], 1], expected: [5, 4, 3, 2, 1] },
    // Even length, k = 2, clean split (no remainder).
    { args: [[1, 2, 3, 4, 5, 6], 2], expected: [2, 1, 4, 3, 6, 5] },
    // Length not divisible by k → remainder group preserved.
    { args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [3, 2, 1, 6, 5, 4, 7] },
    // Remainder of exactly k-1.
    { args: [[1, 2, 3, 4, 5], 4], expected: [4, 3, 2, 1, 5] },
    // k = length - 1 → one full group then a single trailing node.
    { args: [[10, 20, 30, 40], 3], expected: [30, 20, 10, 40] },
    // Duplicates: reversal must move nodes, not just dedupe/sort.
    { args: [[2, 2, 1, 1], 2], expected: [2, 2, 1, 1] },
    // All-same values across an uneven split.
    { args: [[5, 5, 5, 5, 5], 2], expected: [5, 5, 5, 5, 5] },
    // Zeros and a large value mixed.
    { args: [[0, 1000, 0, 1000], 2], expected: [1000, 0, 1000, 0] },
    // Two nodes, k = 2 → swap.
    { args: [[42, 99], 2], expected: [99, 42] },
    // Anti-hardcode: distinct values, length 9, k = 3 (three full groups).
    { args: [[9, 1, 7, 3, 8, 2, 6, 4, 5], 3], expected: [7, 1, 9, 2, 8, 3, 5, 4, 6] },
    // Anti-hardcode: length 8, k = 5 → one group then 3-node remainder.
    { args: [[1, 2, 3, 4, 5, 6, 7, 8], 5], expected: [5, 4, 3, 2, 1, 6, 7, 8] },
    // k = length for an odd length.
    { args: [[3, 1, 4, 1, 5], 5], expected: [5, 1, 4, 1, 3] },
    // Scale: 5000 nodes, k = 2 — swaps every adjacent pair. Must finish well under budget.
    {
      args: [Array.from({ length: 5000 }, (_, i) => i % 1000), 2],
      expected: Array.from({ length: 5000 }, (_, i) => {
        const partnerFirst = i - (i % 2) + (1 - (i % 2));
        return partnerFirst % 1000;
      }),
    },
    // Scale: 4998 nodes, k = 3 — divisible, every triple reversed.
    {
      args: [Array.from({ length: 4998 }, (_, i) => i % 1000), 3],
      expected: Array.from({ length: 4998 }, (_, i) => {
        const block = Math.floor(i / 3) * 3;
        const reversedIndex = block + (2 - (i % 3));
        return reversedIndex % 1000;
      }),
    },
    // Scale: 5000 nodes, k = 7 — leaves a remainder of 5000 % 7 = 2 trailing nodes.
    {
      args: [Array.from({ length: 5000 }, (_, i) => i % 1000), 7],
      expected: Array.from({ length: 5000 }, (_, i) => {
        const fullGroups = Math.floor(5000 / 7);
        const lastFullEnd = fullGroups * 7;
        if (i >= lastFullEnd) return i % 1000;
        const block = Math.floor(i / 7) * 7;
        const reversedIndex = block + (6 - (i % 7));
        return reversedIndex % 1000;
      }),
    },
  ],
  source: { origin: "leetcode", frontendId: "25", acRate: 0.6608774930620703, confidence: 0.95 },
  solutions: [
    {
      name: "Iterative group reversal",
      explanation: `Use a dummy node before the head and a \`groupPrev\` pointer marking the node just before the current group. For each group, first walk \`k\` nodes ahead to confirm a full group exists — if fewer than \`k\` remain, stop and leave the tail untouched.

To reverse a group, repeatedly take the node after \`groupPrev\` (call it \`current\`) and splice it to the front of the group, in front of \`groupPrev.next\`'s original chain. After \`k\` such splices the group is reversed and correctly relinked to both the reversed prefix and the not-yet-processed suffix. Advance \`groupPrev\` to the (now last) node of the reversed group and repeat.

\`O(n)\` time — each node is moved a constant number of times — and \`O(1)\` extra space.`,
      code: {
        javascript: `function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;
  while (true) {
    let kth = groupPrev;
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break;
    const groupNext = kth.next;
    let prev = groupNext;
    let curr = groupPrev.next;
    while (curr !== groupNext) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    const newGroupPrev = groupPrev.next;
    groupPrev.next = kth;
    groupPrev = newGroupPrev;
  }
  return dummy.next;
}`,
        typescript: `function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let groupPrev: ListNode = dummy;
  while (true) {
    let kth: ListNode | null = groupPrev;
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break;
    const groupNext = kth.next;
    let prev: ListNode | null = groupNext;
    let curr: ListNode | null = groupPrev.next;
    while (curr !== groupNext) {
      const next: ListNode | null = curr!.next;
      curr!.next = prev;
      prev = curr;
      curr = next;
    }
    const newGroupPrev = groupPrev.next!;
    groupPrev.next = kth;
    groupPrev = newGroupPrev;
  }
  return dummy.next;
}`,
      },
    },
  ],
});
