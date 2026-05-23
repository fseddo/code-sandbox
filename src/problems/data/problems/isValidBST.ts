import { defineAlgoProblem } from "../problem";

// `io` hydrates the level-order array into a `TreeNode`; the boolean result passes straight through.
// A `null` in the input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const isValidBST = defineAlgoProblem<[(number | null)[]], boolean>({
  id: "validate-binary-search-tree",
  number: 103,
  title: "Validate Binary Search Tree",
  difficulty: "medium",
  tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
  functionName: "isValidBST",
  prompt: `Given the \`root\` of a binary tree, return \`true\` if it is a valid **binary search tree**.

A tree is a valid BST when, for *every* node, all values in its left subtree are strictly less than the node's value and all values in its right subtree are strictly greater. The constraint is global, not just parent-to-child: a node deep in a right subtree still must respect every ancestor's bound.

The tree is given as a level-order array where \`null\` marks a missing child: \`[2, 1, 3]\` is root \`2\` with children \`1\` and \`3\`.`,
  constraints: [
    "The number of nodes in the tree is in the range [1, 10^4].",
    "-2^31 <= Node.val <= 2^31 - 1",
  ],
  io: { params: ["binary-tree"], result: "value" },
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
 * @return {boolean}
 */
function isValidBST(root) {
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
 * @return {boolean}
 */
function isValidBST(root: TreeNode | null): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "valid", args: [[2, 1, 3]], expected: true, explanation: "1 < 2 < 3." },
    { name: "right child too small", args: [[5, 1, 4, null, null, 3, 6]], expected: false, explanation: "4 is in 5's right subtree but 4 < 5 violates the global bound; also 3 < 5." },
    { name: "single node", args: [[1]], expected: true },
  ],
  hiddenTests: [
    { args: [[2, 2, 2]], expected: false },
    { args: [[1, 1]], expected: false },
    { args: [[10, 5, 15, null, null, 6, 20]], expected: false },
    { args: [[3, 1, 5, 0, 2, 4, 6]], expected: true },
    { args: [[5, 4, 6, null, null, 3, 7]], expected: false },
    { args: [[2147483647]], expected: true },
    { args: [[-2147483648, null, 2147483647]], expected: true },
    { args: [[5, 3, 8, 1, 4, 7, 9]], expected: true },
    { args: [[5, 3, 8, 1, 6, 7, 9]], expected: false },
    { args: [[1, null, 2, null, 3, null, 4]], expected: true },
    { args: [[3, null, 2, null, 1]], expected: false },
    // Right-spine-then-violation: the only-parent check passes but a distant ancestor bound fails.
    { args: [[40, 20, 60, 10, 30, 50, 70, null, null, 25, 35, null, null, null, null, null, null, null, 45]], expected: false },
    // Scale: a balanced BST over 1..8191, inorder strictly increasing.
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
      })()],
      expected: true,
    },
  ],
  source: { origin: "leetcode", frontendId: "98", acRate: 0.35759229576189855, confidence: 0.94 },
  solutions: [
    {
      name: "Bounded recursion",
      explanation: `Recurse with an open interval \`(low, high)\` each node must lie strictly within. The root starts unbounded; descending left tightens the upper bound to the node's value, descending right tightens the lower bound. Using strict comparisons rejects duplicates. This catches the global-violation case a naive parent-only check misses.

\`O(n)\` time, \`O(h)\` recursion space.`,
      code: {
        javascript: `function isValidBST(root) {
  const valid = (node, low, high) => {
    if (!node) return true;
    if ((low !== null && node.val <= low) || (high !== null && node.val >= high)) return false;
    return valid(node.left, low, node.val) && valid(node.right, node.val, high);
  };
  return valid(root, null, null);
}`,
        typescript: `function isValidBST(root: TreeNode | null): boolean {
  const valid = (node: TreeNode | null, low: number | null, high: number | null): boolean => {
    if (!node) return true;
    if ((low !== null && node.val <= low) || (high !== null && node.val >= high)) return false;
    return valid(node.left, low, node.val) && valid(node.right, node.val, high);
  };
  return valid(root, null, null);
}`,
      },
    },
  ],
});
