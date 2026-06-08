import { defineAlgoProblem } from "../problem";

// `io` hydrates the level-order array into a `TreeNode`; the numeric result passes straight through.
// A `null` in the input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const maxPathSum = defineAlgoProblem<[(number | null)[]], number>({
  id: "binary-tree-maximum-path-sum",
  number: 137,
  title: "Binary Tree Maximum Path Sum",
  difficulty: "hard",
  tags: ["dynamic-programming", "tree", "depth-first-search", "binary-tree"],
  functionName: "maxPathSum",
  prompt: `Given the \`root\` of a binary tree, return the maximum **path sum** of any non-empty path.

A path is any sequence of nodes connected by parent–child edges; it need **not** pass through the root, and each node appears at most once. A path can turn at one node (going down its left side and up into its right side) but cannot branch at two nodes. The sum is the total of the values on the path.

The tree is given as a level-order array where \`null\` marks a missing child: \`[-10, 9, 20, null, null, 15, 7]\`.`,
  constraints: [
    "The number of nodes in the tree is in the range [1, 3 * 10^4].",
    "-1000 <= Node.val <= 1000",
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
 * @return {number}
 */
function maxPathSum(root) {
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
 * @return {number}
 */
function maxPathSum(root: TreeNode | null): number {
  // your code here
}`,
  },
  examples: [
    { name: "turn at root", args: [[1, 2, 3]], expected: 6, explanation: "2 → 1 → 3 sums to 6." },
    { name: "skip the root", args: [[-10, 9, 20, null, null, 15, 7]], expected: 42, explanation: "15 → 20 → 7 sums to 42; the negative root is excluded." },
    { name: "single node", args: [[-3]], expected: -3, explanation: "A path must be non-empty, so the best is the lone node." },
  ],
  hiddenTests: [
    { args: [[5]], expected: 5 },
    // All negative: must pick the single largest (least negative) node.
    { args: [[-2, -1]], expected: -1 },
    { args: [[-3, -2, -1]], expected: -1 },
    // A straight downward path beats turning.
    { args: [[2, -1, -2]], expected: 2 },
    { args: [[1, -2, 3]], expected: 4 },
    // Best path turns deep in the tree, not at the root.
    { args: [[-10, 9, 20, null, null, 15, 7]], expected: 42 },
    { args: [[10, 2, 10, 20, 1, null, -25, null, null, null, null, 3, 4]], expected: 42 },
    { args: [[2, -1]], expected: 2 },
    { args: [[1, 2, 3, 4, 5, 6, 7]], expected: 18 },
    // Scale: a left-heavy positive chain — the whole spine is the best path.
    {
      args: [(() => {
        const n = 2000;
        const a: (number | null)[] = [];
        for (let i = 0; i < n; i++) { a.push(1); if (i < n - 1) a.push(null); }
        return a;
      })()],
      expected: 2000,
    },
  ],
  source: { origin: "leetcode", frontendId: "124", acRate: 0.4023, confidence: 0.92 },
  solutions: [
    {
      name: "Post-order with a running best",
      explanation: `For each node, compute the best *downward* gain — the most you can collect starting at this node and going straight down one side: \`node.val + max(0, leftGain, rightGain)\` (a negative side is dropped by clamping at 0). That value is what the node can contribute *upward* to its parent, since a parent's path can only descend through one of its children.

But a path may *turn* at this node — descending its left side and rising into its right. So separately track the global best as \`node.val + max(0, leftGain) + max(0, rightGain)\`, which is the best path whose highest point is this node. The answer is the maximum of that quantity over all nodes.

\`O(n)\` time (one post-order pass), \`O(h)\` recursion space.`,
      code: {
        javascript: `function maxPathSum(root) {
  let best = -Infinity;
  // Returns the max downward gain starting at node (the value usable by its parent).
  const gain = (node) => {
    if (!node) return 0;
    // Drop a negative subtree: contributing it would only shrink the path.
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));
    // A path that turns at this node uses both sides; update the global best.
    best = Math.max(best, node.val + left + right);
    // Upward, a parent can only take one side.
    return node.val + Math.max(left, right);
  };
  gain(root);
  return best;
}`,
        typescript: `function maxPathSum(root: TreeNode | null): number {
  let best = -Infinity;
  // Returns the max downward gain starting at node (the value usable by its parent).
  const gain = (node: TreeNode | null): number => {
    if (!node) return 0;
    // Drop a negative subtree: contributing it would only shrink the path.
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));
    // A path that turns at this node uses both sides; update the global best.
    best = Math.max(best, node.val + left + right);
    // Upward, a parent can only take one side.
    return node.val + Math.max(left, right);
  };
  gain(root);
  return best;
}`,
      },
    },
  ],
});
