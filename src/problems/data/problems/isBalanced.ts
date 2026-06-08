import { defineAlgoProblem } from "../problem";

// `io` hydrates the level-order array into a `TreeNode`; the boolean result passes straight through.
// A `null` in the input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const isBalanced = defineAlgoProblem<[(number | null)[]], boolean>({
  id: "balanced-binary-tree",
  number: 131,
  title: "Balanced Binary Tree",
  difficulty: "easy",
  tags: ["tree", "depth-first-search", "binary-tree"],
  functionName: "isBalanced",
  prompt: `Given the \`root\` of a binary tree, return \`true\` if it is **height-balanced**.

A binary tree is height-balanced when, for *every* node, the heights of its left and right subtrees differ by at most one. The check is local at every node, not just at the root.

The tree is given as a level-order array where \`null\` marks a missing child: \`[3, 9, 20, null, null, 15, 7]\` is root \`3\` with children \`9\` and \`20\`, and \`20\` has children \`15\` and \`7\`.`,
  constraints: [
    "The number of nodes in the tree is in the range [0, 5000].",
    "-10^4 <= Node.val <= 10^4",
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
function isBalanced(root) {
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
function isBalanced(root: TreeNode | null): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "balanced", args: [[3, 9, 20, null, null, 15, 7]], expected: true, explanation: "Every node's subtree heights differ by at most 1." },
    { name: "skewed", args: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false, explanation: "The left subtree is depth 3 while the right is depth 1 — the root is unbalanced." },
    { name: "empty", args: [[]], expected: true },
  ],
  hiddenTests: [
    { args: [[1]], expected: true },
    { args: [[1, 2]], expected: true },
    // A left-only spine of depth 3 is unbalanced at the root.
    { args: [[1, 2, null, 3, null, 4]], expected: false },
    { args: [[1, 2, 3]], expected: true },
    { args: [[1, 2, 2, 3, null, null, 3, 4, null, null, 4]], expected: false },
    // Balanced perfect tree.
    { args: [[1, 2, 3, 4, 5, 6, 7]], expected: true },
    // Imbalance buried deep: a node far down has one tall and one empty subtree.
    { args: [[1, 2, 2, 3, 3, 3, 3, 4, 4, null, null, null, null, null, null, 5]], expected: false },
    { args: [[1, null, 2]], expected: true },
    { args: [[1, null, 2, null, 3]], expected: false },
    // Scale: a balanced 1..8191 tree.
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
  source: { origin: "leetcode", frontendId: "110", acRate: 0.5234, confidence: 0.94 },
  solutions: [
    {
      name: "Bottom-up height with early exit",
      explanation: `A top-down check recomputes heights repeatedly (O(n²)). Instead, compute each subtree's height *once*, bottom-up, and let a sentinel of \`-1\` mean "this subtree is already unbalanced". A node returns its own height when both children are balanced and within one of each other, otherwise it propagates \`-1\` so the whole tree fails.

\`O(n)\` time (each node visited once), \`O(h)\` recursion space.`,
      code: {
        javascript: `function isBalanced(root) {
  // Returns the subtree height, or -1 the moment an imbalance is found.
  const height = (node) => {
    if (!node) return 0;
    const left = height(node.left);
    if (left === -1) return -1;            // left subtree already unbalanced
    const right = height(node.right);
    if (right === -1) return -1;           // right subtree already unbalanced
    if (Math.abs(left - right) > 1) return -1; // imbalance at this node
    return Math.max(left, right) + 1;      // this node's height
  };
  return height(root) !== -1;
}`,
        typescript: `function isBalanced(root: TreeNode | null): boolean {
  // Returns the subtree height, or -1 the moment an imbalance is found.
  const height = (node: TreeNode | null): number => {
    if (!node) return 0;
    const left = height(node.left);
    if (left === -1) return -1;            // left subtree already unbalanced
    const right = height(node.right);
    if (right === -1) return -1;           // right subtree already unbalanced
    if (Math.abs(left - right) > 1) return -1; // imbalance at this node
    return Math.max(left, right) + 1;      // this node's height
  };
  return height(root) !== -1;
}`,
      },
    },
  ],
});
