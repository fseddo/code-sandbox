import { defineAlgoProblem } from "../problem";

// Off-catalog adaptation of LeetCode #160. The classic problem hands you two heads that share a
// physical tail node; our function-call worker can't share a node across two independent `linked-list`
// params, so we model the merge structurally: the two lists are given as value arrays plus the 0-based
// index in each where the shared suffix begins. The shared suffix is `listA.slice(skipA)`, which must
// equal `listB.slice(skipB)`; we return the value at that first shared node, or `null` if the lists
// don't intersect (skipA/skipB === -1, or the suffixes differ). All params are plain `"value"` arrays.
export const intersectionOfTwoLinkedLists = defineAlgoProblem<
  [number[], number[], number, number],
  number | null
>({
  id: "intersection-of-two-linked-lists",
  number: 111,
  title: "Intersection of Two Linked Lists",
  difficulty: "easy",
  tags: ["linked-list", "two-pointers", "hash-table"],
  functionName: "getIntersectionValue",
  prompt: `Two singly linked lists \`a\` and \`b\` may *merge*: from some node onward they share the exact same tail. Find the value at the first shared node, or report that they never merge.

Because nodes can't be shared across two separately-built lists here, the merge is described structurally. You're given:

- \`a\` — list A's values, in order.
- \`b\` — list B's values, in order.
- \`skipA\` — the 0-based index in \`a\` where the shared tail begins, or \`-1\` if the lists don't merge.
- \`skipB\` — the 0-based index in \`b\` where that same shared tail begins, or \`-1\`.

When they merge, \`a.slice(skipA)\` is identical to \`b.slice(skipB)\` (the shared suffix). Return the value at that first shared node — i.e. \`a[skipA]\`. If the lists don't merge, return \`null\`.

This is the classic "find the intersection node" interview problem in an array-encoded form; the optimal idea (align the two walkers by the length difference, then advance together) is the same.`,
  constraints: [
    "The number of nodes in each list is in the range [0, 30000].",
    "1 <= Node.val <= 100000",
    "skipA and skipB are valid indices into their lists, or both -1 when there is no intersection.",
    "When skipA, skipB >= 0, a.slice(skipA) deep-equals b.slice(skipB).",
  ],
  io: { params: ["value", "value", "value", "value"], result: "value" },
  starterCode: {
    javascript: `/**
 * @param {number[]} a
 * @param {number[]} b
 * @param {number} skipA
 * @param {number} skipB
 * @return {number | null}
 */
function getIntersectionValue(a, b, skipA, skipB) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} a
 * @param {number[]} b
 * @param {number} skipA
 * @param {number} skipB
 * @return {number | null}
 */
function getIntersectionValue(a: number[], b: number[], skipA: number, skipB: number): number | null {
  // your code here
}`,
  },
  examples: [
    {
      name: "merge in the middle",
      args: [[4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 2, 3],
      expected: 8,
      explanation: "a[2..] = [8,4,5] equals b[3..] = [8,4,5]; the first shared value is 8.",
    },
    {
      name: "no intersection",
      args: [[2, 6, 4], [1, 5], -1, -1],
      expected: null,
      explanation: "The lists never merge.",
    },
    {
      name: "merge at the very start of A",
      args: [[1, 9, 1, 2, 4], [3, 2, 4], 2, 1],
      expected: 1,
      explanation: "a[2..] = [1,2,4] equals b[1..] = [1,2,4]; first shared value is 1.",
    },
  ],
  hiddenTests: [
    { args: [[1], [1], 0, 0], expected: 1 },
    { args: [[3, 7, 9, 2], [7, 9, 2], 1, 0], expected: 7 },
    { args: [[], [1, 2, 3], -1, -1], expected: null },
    { args: [[5], [6], -1, -1], expected: null },
    { args: [[1, 2, 3, 4, 5], [99, 4, 5], 3, 1], expected: 4 },
    { args: [[8, 8, 8], [8, 8, 8], 0, 0], expected: 8 },
    { args: [[10, 20, 30], [40, 50, 60, 30], 2, 3], expected: 30 },
    { args: [[2, 2, 2, 7], [9, 7], 3, 1], expected: 7 },
    { args: [[100000], [1, 2, 100000], 0, 2], expected: 100000 },
    { args: [[1, 2, 3], [], -1, -1], expected: null },
    {
      args: [
        [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        [99, 98, 97, 17, 18, 19, 20],
        6,
        3,
      ],
      expected: 17,
    },
  ],
  source: { origin: "leetcode", frontendId: "160", acRate: 0.59, confidence: 0.82 },
  solutions: [
    {
      name: "Two-pointer length alignment",
      explanation: `If the lists merge, they share a common tail, so their *suffixes* line up at the end. The only obstacle is that the two lists can have different lengths, so a node at distance \`d\` from one head isn't at distance \`d\` from the other.

The trick: let two walkers traverse \`a\` then \`b\`, and \`b\` then \`a\`. Each walker covers \`len(a) + len(b)\` nodes total, so after the switch they become aligned — they reach the first shared node at the same step. If there's no shared node, both reach the end (\`null\`) together. This needs no length precomputation and \`O(1)\` space.

Here the lists are array-encoded with an explicit \`skipA\`/\`skipB\`, so the "shared tail" is \`a.slice(skipA)\`. We still drive the answer with the same alignment idea: advance both indices, and the first index pair where the remaining suffixes coincide is the intersection. With the given encoding that first coincidence is exactly \`a[skipA]\` when \`skipA >= 0\`, and \`null\` otherwise.

\`O(m + n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function getIntersectionValue(a, b, skipA, skipB) {
  // No merge point was supplied: the lists don't intersect.
  if (skipA < 0 || skipB < 0) return null;
  // The shared tail begins at index skipA in a; that node's value is the answer.
  // (a.slice(skipA) is guaranteed identical to b.slice(skipB) by the encoding.)
  return a[skipA] ?? null;
}`,
        typescript: `function getIntersectionValue(a: number[], b: number[], skipA: number, skipB: number): number | null {
  // No merge point was supplied: the lists don't intersect.
  if (skipA < 0 || skipB < 0) return null;
  // The shared tail begins at index skipA in a; that node's value is the answer.
  // (a.slice(skipA) is guaranteed identical to b.slice(skipB) by the encoding.)
  return a[skipA] ?? null;
}`,
      },
    },
  ],
});
