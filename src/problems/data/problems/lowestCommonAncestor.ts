import { defineAlgoProblem } from "../problem";

// The tree param hydrates from a level-order array; `p` and `q` are node values, the result is a value.
// Reframe note: LeetCode returns the LCA *node*; since all values are unique we return its value, which
// the harness can serialize. A `null` in the input marks an absent child. See problem-authoring.md.
export const lowestCommonAncestor = defineAlgoProblem<[(number | null)[], number, number], number>({
  id: "lowest-common-ancestor-of-a-binary-tree",
  number: 136,
  title: "Lowest Common Ancestor of a Binary Tree",
  difficulty: "medium",
  tags: ["tree", "depth-first-search", "binary-tree"],
  functionName: "lowestCommonAncestor",
  prompt: `Given the \`root\` of a binary tree and two values \`p\` and \`q\` present in it, return the value of their **lowest common ancestor** — the deepest node that has both \`p\` and \`q\` somewhere in its subtree.

A node is allowed to be a descendant of itself, so if \`p\` is an ancestor of \`q\`, then \`p\` is the answer. All node values are unique.

The tree is given as a level-order array where \`null\` marks a missing child. (LeetCode returns the ancestor *node*; here we return its value, since values are unique.)`,
  constraints: [
    "The number of nodes in the tree is in the range [2, 10^5].",
    "-10^9 <= Node.val <= 10^9",
    "All Node.val are unique. p != q, and both p and q exist in the tree.",
  ],
  io: { params: ["binary-tree", "value", "value"], result: "value" },
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
 * @param {number} p
 * @param {number} q
 * @return {number}
 */
function lowestCommonAncestor(root, p, q) {
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
 * @param {number} p
 * @param {number} q
 * @return {number}
 */
function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): number {
  // your code here
}`,
  },
  examples: [
    { name: "split", args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], expected: 3, explanation: "5 and 1 are in different subtrees of the root, so the root 3 is their LCA." },
    { name: "ancestor of itself", args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], expected: 5, explanation: "4 lies in 5's subtree, so 5 is its own answer." },
    { name: "two nodes", args: [[1, 2], 1, 2], expected: 1 },
  ],
  hiddenTests: [
    { args: [[1, 2], 2, 1], expected: 1 },
    // Both deep in the same subtree.
    { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 7, 4], expected: 2 },
    { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 6, 4], expected: 5 },
    // Right-spine: deeper of the two is the LCA when one is the other's ancestor.
    { args: [[1, null, 2, null, 3, null, 4], 2, 4], expected: 2 },
    // Left-spine.
    { args: [[5, 4, null, 3, null, 2], 4, 2], expected: 4 },
    { args: [[1, 2, 3, 4, 5, 6, 7], 4, 7], expected: 1 },
    { args: [[1, 2, 3, 4, 5, 6, 7], 4, 5], expected: 2 },
    { args: [[1, 2, 3, 4, 5, 6, 7], 6, 7], expected: 3 },
    // Negative and large values.
    { args: [[-1000000000, 1000000000, 0], 1000000000, 0], expected: -1000000000 },
  ],
  source: { origin: "leetcode", frontendId: "236", acRate: 0.6356, confidence: 0.93 },
  solutions: [
    {
      name: "Single post-order recursion",
      explanation: `Recurse so each node reports back whether it found \`p\` or \`q\` (or their LCA) in its subtree. A node is the LCA when its two children's reports are *both* non-null — meaning one target lies on each side — or when the node itself is one target and the other is found below it.

Because the recursion bubbles up the first node that "sees" both targets, the first such node encountered on the way up is the *lowest* common ancestor.

\`O(n)\` time (one pass), \`O(h)\` recursion space.`,
      code: {
        javascript: `function lowestCommonAncestor(root, p, q) {
  // Returns the node where p and q's paths join, or whichever target this subtree contains.
  const find = (node) => {
    if (!node) return null;
    if (node.val === p || node.val === q) return node; // found a target here
    const left = find(node.left);
    const right = find(node.right);
    // Targets split across both children: this node is the LCA.
    if (left && right) return node;
    // Otherwise bubble up whichever side found something.
    return left || right;
  };
  return find(root).val;
}`,
        typescript: `function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): number {
  // Returns the node where p and q's paths join, or whichever target this subtree contains.
  const find = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    if (node.val === p || node.val === q) return node; // found a target here
    const left = find(node.left);
    const right = find(node.right);
    // Targets split across both children: this node is the LCA.
    if (left && right) return node;
    // Otherwise bubble up whichever side found something.
    return left || right;
  };
  return find(root)!.val;
}`,
      },
    },
  ],
});
