import { defineAlgoProblem } from "../problem";

// The tree param hydrates from a level-order array; `k` and the numeric result pass straight through.
// A `null` in the input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const kthSmallest = defineAlgoProblem<[(number | null)[], number], number>({
  id: "kth-smallest-element-in-a-bst",
  number: 135,
  title: "Kth Smallest Element in a BST",
  difficulty: "medium",
  tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
  functionName: "kthSmallest",
  prompt: `Given the \`root\` of a **binary search tree** and an integer \`k\`, return the \`k\`-th smallest value in the tree (1-indexed).

In a BST, an in-order traversal visits values in ascending order, so the \`k\`-th value produced by an in-order walk is the answer.

The tree is given as a level-order array where \`null\` marks a missing child: \`[3, 1, 4, null, 2]\`.`,
  constraints: [
    "The number of nodes in the tree is n.",
    "1 <= k <= n <= 10^4",
    "0 <= Node.val <= 10^4",
  ],
  io: { params: ["binary-tree", "value"], result: "value" },
  starterCode: {
    javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *   this.val = (val === undefined ? 0 : val)
 *   this.left = (left === undefined ? null : left)
 *   this.right = (right === undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
function kthSmallest(root, k) {
  // your code here
}`,
    typescript: `/**
 * Definition for a binary tree node.
 * class TreeNode {
 *   val: number
 *   left: TreeNode | null
 *   right: TreeNode | null
 *   constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *     this.val = (val === undefined ? 0 : val)
 *     this.left = (left === undefined ? null : left)
 *     this.right = (right === undefined ? null : right)
 *   }
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
function kthSmallest(root: TreeNode | null, k: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "small", args: [[3, 1, 4, null, 2], 1], expected: 1, explanation: "In-order is [1,2,3,4]; the 1st smallest is 1." },
    { name: "third", args: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3, explanation: "In-order is [1,2,3,4,5,6]; the 3rd smallest is 3." },
    { name: "single", args: [[1], 1], expected: 1 },
  ],
  hiddenTests: [
    { args: [[2, 1, 3], 2], expected: 2 },
    // k at the maximum (the largest value).
    { args: [[2, 1, 3], 3], expected: 3 },
    { args: [[5, 3, 8, 1, 4, 7, 9], 4], expected: 5 },
    { args: [[5, 3, 8, 1, 4, 7, 9], 1], expected: 1 },
    { args: [[5, 3, 8, 1, 4, 7, 9], 7], expected: 9 },
    // Right-only spine.
    { args: [[1, null, 2, null, 3], 2], expected: 2 },
    // Left-only spine.
    { args: [[3, 2, null, 1], 1], expected: 1 },
    { args: [[10, 5, 15, 2, 7, 12, 20], 5], expected: 12 },
    // Scale: balanced BST over 1..8191, the k-th smallest is simply k.
    {
      args: [(() => {
        const a: (number | null)[] = Array(8191).fill(null);
        const fill = (i: number, lo: number, hi: number): void => {
          if (lo > hi) return;
          const mid = (lo + hi) >> 1;
          a[i] = mid;
          fill(2 * i + 1, lo, mid - 1);
          fill(2 * i + 2, mid + 1, hi);
        };
        fill(0, 1, 8191);
        return a;
      })(), 5000],
      expected: 5000,
    },
  ],
  source: { origin: "leetcode", frontendId: "230", acRate: 0.7344, confidence: 0.95 },
  solutions: [
    {
      name: "In-order traversal with early stop",
      explanation: `An in-order walk of a BST yields values in ascending order, so the \`k\`-th value it emits is the answer. Use an explicit stack: go left as far as possible, then pop and count; the moment the count reaches \`k\`, that node's value is the result — no need to finish the traversal.

\`O(h + k)\` time (descend to the leftmost, then pop \`k\` nodes), \`O(h)\` space for the stack.`,
      code: {
        javascript: `function kthSmallest(root, k) {
  const stack = [];
  let curr = root;
  let count = 0;
  while (curr || stack.length) {
    // Dive to the leftmost unvisited node.
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    // This pop is the next-smallest value in order.
    if (++count === k) return curr.val;
    curr = curr.right;
  }
  return -1; // unreachable given 1 <= k <= n
}`,
        typescript: `function kthSmallest(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let curr = root;
  let count = 0;
  while (curr || stack.length) {
    // Dive to the leftmost unvisited node.
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    // This pop is the next-smallest value in order.
    if (++count === k) return curr.val;
    curr = curr.right;
  }
  return -1; // unreachable given 1 <= k <= n
}`,
      },
    },
  ],
});
