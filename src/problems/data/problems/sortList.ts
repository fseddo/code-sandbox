import { defineAlgoProblem } from "../problem";

// Deterministic pseudo-random generator (no Math.random) so the large scale case is reproducible.
const pseudoRandomInts = (length: number, seed: number): number[] => {
  let state = seed;
  return Array.from({ length }, () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return (state % 200001) - 100000;
  });
};

// A few thousand nodes — enough that an O(n^2) approach (e.g. repeated insertion into a sorted
// output list) is felt, while a correct O(n log n) merge sort finishes well under the Submit budget.
const SCALE_SIZE = 4000;
const REVERSE_SORTED_SCALE = Array.from({ length: SCALE_SIZE }, (_, i) => SCALE_SIZE - i);
const RANDOM_SCALE = pseudoRandomInts(SCALE_SIZE, 7);

// Args/expected are plain arrays; `io` hydrates them into a `ListNode` chain around the call
// (and flattens the result back), so the test data stays serializable. See problem-authoring.md.
export const sortList = defineAlgoProblem<[number[]], number[]>({
  id: "sort-list",
  number: 162,
  title: "Sort List",
  difficulty: "medium",
  tags: ["linked-list", "sorting", "divide-and-conquer", "recursion", "merge-sort"],
  functionName: "sortList",
  prompt: `Given the \`head\` of a singly linked list, sort the list in ascending order and return the head of the sorted list.

Your function receives and returns a \`ListNode\` chain; the examples below show each list in array notation for readability — \`[4, 2, 1, 3]\` is the chain \`4 -> 2 -> 1 -> 3\`, which sorts to \`1 -> 2 -> 3 -> 4\`. An empty input (\`[]\`, i.e. \`head\` is \`null\`) is valid and should return an empty list.`,
  constraints: [
    "The number of nodes in the list is in the range [0, 5 * 10^4].",
    "-10^5 <= Node.val <= 10^5",
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
function sortList(head) {
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
function sortList(head: ListNode | null): ListNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "unsorted", args: [[4, 2, 1, 3]], expected: [1, 2, 3, 4] },
    {
      name: "negatives and duplicates-free mix",
      args: [[-1, 5, 3, 4, 0]],
      expected: [-1, 0, 3, 4, 5],
      explanation: "Negative and non-negative values sort together on one number line.",
    },
    { name: "empty list", args: [[]], expected: [] },
  ],
  hiddenTests: [
    // Boundary
    { name: "single node", args: [[42]], expected: [42] },
    { name: "two nodes, already sorted", args: [[1, 2]], expected: [1, 2] },
    { name: "two nodes, reversed", args: [[2, 1]], expected: [1, 2] },
    { name: "min and max values", args: [[100000, -100000, 0]], expected: [-100000, 0, 100000] },
    // Edge
    { name: "already sorted", args: [[1, 2, 3, 4, 5, 6]], expected: [1, 2, 3, 4, 5, 6] },
    { name: "reverse sorted", args: [[9, 7, 5, 3, 1]], expected: [1, 3, 5, 7, 9] },
    { name: "all equal values", args: [[3, 3, 3, 3, 3]], expected: [3, 3, 3, 3, 3] },
    { name: "duplicates scattered", args: [[5, 1, 5, 2, 1, 5]], expected: [1, 1, 2, 5, 5, 5] },
    { name: "negatives mixed with positives", args: [[-5, 3, -1, 0, 2, -3, 10, -10]], expected: [-10, -5, -3, -1, 0, 2, 3, 10] },
    // Structural
    { name: "one out-of-place value at the end", args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, -5]], expected: [-5, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    { name: "one out-of-place value at the start", args: [[8, 1, 2, 3, 4, 5, 6, 7]], expected: [1, 2, 3, 4, 5, 6, 7, 8] },
    // Anti-hardcode
    { name: "unrelated random-looking input", args: [[37, -12, 84, 0, 5, -47, 23, 9, -1]], expected: [-47, -12, -1, 0, 5, 9, 23, 37, 84] },
    // Scale — a few thousand nodes; O(n log n) merge sort finishes well under the Submit budget,
    // while an O(n^2) approach (e.g. repeated insertion) would not.
    {
      name: "large reverse-sorted input",
      args: [REVERSE_SORTED_SCALE],
      expected: [...REVERSE_SORTED_SCALE].sort((a, b) => a - b),
    },
    {
      name: "large random input",
      args: [RANDOM_SCALE],
      expected: [...RANDOM_SCALE].sort((a, b) => a - b),
    },
  ],
  source: { origin: "leetcode", frontendId: "148", acRate: 0.6, confidence: 0.92 },
  solutions: [
    {
      name: "Top-down merge sort (fast/slow split + linked-list merge)",
      explanation: `Merge sort adapts naturally to a linked list because the "merge" step doesn't need random access — it's the same two-pointer splice used to merge two sorted lists, and unlike an array merge it needs **no auxiliary buffer**.

The recursive shape:
1. **Base case** — a list of 0 or 1 nodes is already sorted; return it as-is.
2. **Split** — find the midpoint with the classic fast/slow pointer technique: \`slow\` advances one node per step, \`fast\` advances two, so when \`fast\` runs off the end \`slow\` sits at the midpoint. Crucially, **sever the link** right after \`slow\` (\`slow.next = null\`) so the first half becomes its own standalone list instead of still trailing into the second half.
3. **Recurse** — sort each half independently.
4. **Merge** — splice the two sorted halves back together one node at a time, always taking the smaller current head, using a dummy head to avoid special-casing the first node.

\`O(n log n)\` time (\`log n\` levels of splitting, each doing \`O(n)\` work to merge). \`O(log n)\` extra space for the recursion stack — the merge itself reuses the existing nodes rather than allocating new ones. (The classic follow-up for true \`O(1)\` space is an *iterative bottom-up* merge sort that merges runs of size 1, 2, 4, … without recursion; the top-down recursive version here is simpler to read and is the one implemented.)`,
      code: {
        javascript: `function sortList(head) {
  // Base case: empty list or a single node is already sorted.
  if (!head || !head.next) return head;

  // Split into two halves using fast/slow pointers: fast moves two nodes per
  // step, slow moves one, so slow lands on the midpoint when fast runs out.
  let slow = head;
  let fast = head.next; // start fast one ahead so slow ends at the *first* of two middles
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const secondHalf = slow.next;
  slow.next = null; // sever the first half so it's a standalone list

  const left = sortList(head);
  const right = sortList(secondHalf);
  return mergeTwoSorted(left, right);
}

// Classic sorted-linked-list merge, reusing nodes (no new allocation besides the dummy).
function mergeTwoSorted(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b; // splice on whichever half has leftovers
  return dummy.next;
}`,
        typescript: `function sortList(head: ListNode | null): ListNode | null {
  // Base case: empty list or a single node is already sorted.
  if (!head || !head.next) return head;

  // Split into two halves using fast/slow pointers: fast moves two nodes per
  // step, slow moves one, so slow lands on the midpoint when fast runs out.
  let slow: ListNode = head;
  let fast: ListNode | null = head.next; // start fast one ahead so slow ends at the *first* of two middles
  while (fast && fast.next) {
    slow = slow.next as ListNode;
    fast = fast.next.next;
  }
  const secondHalf = slow.next;
  slow.next = null; // sever the first half so it's a standalone list

  const left = sortList(head);
  const right = sortList(secondHalf);
  return mergeTwoSorted(left, right);
}

// Classic sorted-linked-list merge, reusing nodes (no new allocation besides the dummy).
function mergeTwoSorted(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b; // splice on whichever half has leftovers
  return dummy.next;
}`,
      },
    },
  ],
});
