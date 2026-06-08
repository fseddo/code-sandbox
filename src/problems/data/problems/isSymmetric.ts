import { defineAlgoProblem } from "../problem";

// `io` hydrates the level-order array into a `TreeNode`; the boolean result passes straight through.
// A `null` in the input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const isSymmetric = defineAlgoProblem<[(number | null)[]], boolean>({
  id: "symmetric-tree",
  number: 132,
  title: "Symmetric Tree",
  difficulty: "easy",
  tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
  functionName: "isSymmetric",
  prompt: `Given the \`root\` of a binary tree, return \`true\` if it is a **mirror of itself** — symmetric around its center.

A tree is symmetric when its left subtree is the mirror image of its right subtree: matched nodes hold equal values, and a left child on one side corresponds to a right child on the other.

The tree is given as a level-order array where \`null\` marks a missing child: \`[1, 2, 2, 3, 4, 4, 3]\` is symmetric.`,
  constraints: [
    "The number of nodes in the tree is in the range [1, 1000].",
    "-100 <= Node.val <= 100",
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
function isSymmetric(root) {
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
function isSymmetric(root: TreeNode | null): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "symmetric", args: [[1, 2, 2, 3, 4, 4, 3]], expected: true, explanation: "The left subtree mirrors the right: 2=2, 3↔3, 4↔4." },
    { name: "asymmetric", args: [[1, 2, 2, null, 3, null, 3]], expected: false, explanation: "Both 2s have a right child but no left child, so they don't mirror." },
    { name: "single node", args: [[1]], expected: true },
  ],
  hiddenTests: [
    // Root's two children differ in value: not a mirror.
    { args: [[1, 2, 3]], expected: false },
    // Genuine mirror at depth 2: left-2's right child mirrors right-2's left child.
    { args: [[1, 2, 2, null, 3, 3, null]], expected: true },
    { args: [[2, 3, 3, 4, 5, 5, 4]], expected: true },
    // Value mismatch on otherwise-mirrored shape.
    { args: [[1, 2, 2, 3, 4, 5, 3]], expected: false },
    { args: [[1, 2, 2]], expected: true },
    // One side present, the other absent.
    { args: [[1, 2, null]], expected: false },
    { args: [[1, null, 2]], expected: false },
    { args: [[5, 5, 5, 5, 5, 5, 5]], expected: true },
    // Deeper mirror with an asymmetry at the lowest level.
    { args: [[1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 8, 7, 6, 6]], expected: false },
    // Scale: a perfectly mirrored tree built level by level (1024+ nodes).
    {
      args: [(() => {
        const depth = 11;
        const size = (1 << depth) - 1;
        const a: (number | null)[] = Array(size).fill(0);
        // Value at each node = its depth, so left/right subtrees are exact mirrors.
        const fill = (i: number, d: number): void => {
          if (i >= size) return;
          a[i] = d;
          fill(2 * i + 1, d + 1);
          fill(2 * i + 2, d + 1);
        };
        fill(0, 0);
        return a;
      })()],
      expected: true,
    },
  ],
  source: { origin: "leetcode", frontendId: "101", acRate: 0.5876, confidence: 0.94 },
  solutions: [
    {
      name: "Mirror recursion on a pair",
      explanation: `Symmetry is a property of *two* subtrees, so recurse on pairs: compare the left subtree against the right subtree. Two nodes mirror when their values match and the left's left mirrors the right's right *and* the left's right mirrors the right's left — the outer and inner pairs cross.

\`O(n)\` time (each node compared once), \`O(h)\` recursion space.`,
      code: {
        javascript: `function isSymmetric(root) {
  // Do two subtrees mirror each other?
  const mirror = (a, b) => {
    if (!a && !b) return true;        // both empty: trivially mirrored
    if (!a || !b) return false;       // one empty, one not: shape differs
    if (a.val !== b.val) return false; // values must match
    // Outer pair (a.left vs b.right) and inner pair (a.right vs b.left) cross.
    return mirror(a.left, b.right) && mirror(a.right, b.left);
  };
  return mirror(root?.left ?? null, root?.right ?? null);
}`,
        typescript: `function isSymmetric(root: TreeNode | null): boolean {
  // Do two subtrees mirror each other?
  const mirror = (a: TreeNode | null, b: TreeNode | null): boolean => {
    if (!a && !b) return true;        // both empty: trivially mirrored
    if (!a || !b) return false;       // one empty, one not: shape differs
    if (a.val !== b.val) return false; // values must match
    // Outer pair (a.left vs b.right) and inner pair (a.right vs b.left) cross.
    return mirror(a.left, b.right) && mirror(a.right, b.left);
  };
  return mirror(root?.left ?? null, root?.right ?? null);
}`,
      },
    },
  ],
});
