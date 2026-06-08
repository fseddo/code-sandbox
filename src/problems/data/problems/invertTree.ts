import { defineAlgoProblem } from "../problem";

// `io` hydrates the level-order array into a `TreeNode` and serializes the returned tree back to one.
// A `null` in an input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const invertTree = defineAlgoProblem<[(number | null)[]], (number | null)[]>({
  id: "invert-binary-tree",
  number: 130,
  title: "Invert Binary Tree",
  difficulty: "easy",
  tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
  functionName: "invertTree",
  prompt: `Given the \`root\` of a binary tree, invert it — swap the left and right child of *every* node — and return the new root.

Inverting is a mirror operation: the resulting tree is the reflection of the original across a vertical line through the root.

The tree is given as a level-order array where \`null\` marks a missing child: \`[2, 1, 3]\` is root \`2\` with children \`1\` and \`3\`.`,
  constraints: [
    "The number of nodes in the tree is in the range [0, 100].",
    "-100 <= Node.val <= 100",
  ],
  io: { params: ["binary-tree"], result: "binary-tree" },
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
 * @return {TreeNode}
 */
function invertTree(root) {
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
 * @return {TreeNode}
 */
function invertTree(root: TreeNode | null): TreeNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "balanced", args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1], explanation: "Each node's children swap: 2↔7, 1↔3, 6↔9." },
    { name: "small", args: [[2, 1, 3]], expected: [2, 3, 1] },
    { name: "empty", args: [[]], expected: [] },
  ],
  hiddenTests: [
    { args: [[1]], expected: [1] },
    // Left-only spine becomes a right-only spine.
    { args: [[1, 2, null, 3]], expected: [1, null, 2, null, 3] },
    // Right-only spine becomes a left-only spine.
    { args: [[1, null, 2, null, 3]], expected: [1, 2, null, 3] },
    // Already a mirror of itself in shape; values still swap by position.
    { args: [[1, 2, 2, 3, 4, 4, 3]], expected: [1, 2, 2, 3, 4, 4, 3] },
    { args: [[5, 3, 8, 1, 4, 7, 9]], expected: [5, 8, 3, 9, 7, 4, 1] },
    { args: [[-100, -50, 100]], expected: [-100, 100, -50] },
    // Duplicate values do not affect the structural swap.
    { args: [[7, 7, 7, 7, 7]], expected: [7, 7, 7, null, null, 7, 7] },
    { args: [[1, 2, 3, null, null, 4, 5]], expected: [1, 3, 2, 5, 4] },
    // Scale: a balanced 1..127 tree inverted.
    {
      args: [(() => {
        const a: (number | null)[] = Array(127).fill(null);
        const fill = (i: number, lo: number, hi: number): void => {
          if (lo > hi) return;
          const mid = (lo + hi) >> 1;
          a[i] = mid;
          fill(2 * i + 1, lo, mid - 1);
          fill(2 * i + 2, mid + 1, hi);
        };
        fill(0, 1, 127);
        // Invert level-order: at each level, mirror the slot order within the complete-tree layout.
        const inverted: (number | null)[] = Array(127).fill(null);
        const recur = (src: number, dst: number): void => {
          if (src >= 127 || a[src] === null) return;
          inverted[dst] = a[src];
          recur(2 * src + 1, 2 * dst + 2);
          recur(2 * src + 2, 2 * dst + 1);
        };
        recur(0, 0);
        return inverted;
      })()],
      expected: (() => {
        const a: (number | null)[] = Array(127).fill(null);
        const fill = (i: number, lo: number, hi: number): void => {
          if (lo > hi) return;
          const mid = (lo + hi) >> 1;
          a[i] = mid;
          fill(2 * i + 1, lo, mid - 1);
          fill(2 * i + 2, mid + 1, hi);
        };
        fill(0, 1, 127);
        return a;
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "226", acRate: 0.7822, confidence: 0.95 },
  solutions: [
    {
      name: "Recursive swap",
      explanation: `At every node, swap its two children, then recurse into both. The order of the swap-versus-recurse steps doesn't matter — every node is visited once and its children exchanged.

\`O(n)\` time (each node visited once), \`O(h)\` recursion space for tree height \`h\`.`,
      code: {
        javascript: `function invertTree(root) {
  // Empty subtree: nothing to invert, return as-is.
  if (!root) return null;
  // Swap this node's two children.
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;
  root.right = left;
  return root;
}`,
        typescript: `function invertTree(root: TreeNode | null): TreeNode | null {
  // Empty subtree: nothing to invert, return as-is.
  if (!root) return null;
  // Swap this node's two children.
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;
  root.right = left;
  return root;
}`,
      },
    },
  ],
});
