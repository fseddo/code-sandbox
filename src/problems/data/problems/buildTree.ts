import { defineAlgoProblem } from "../problem";

// Plain `number[]` inputs (the traversals); the result is a tree, serialized back to a level-order array.
// See problem-authoring.md for the binary-tree io convention.
export const buildTree = defineAlgoProblem<[number[], number[]], (number | null)[]>({
  id: "construct-binary-tree-from-preorder-and-inorder-traversal",
  number: 134,
  title: "Construct Binary Tree from Preorder and Inorder Traversal",
  difficulty: "medium",
  tags: ["array", "hash-table", "divide-and-conquer", "tree", "binary-tree"],
  functionName: "buildTree",
  prompt: `Given two integer arrays \`preorder\` and \`inorder\` — the preorder and inorder traversals of the *same* binary tree, with all values **distinct** — reconstruct and return the tree.

In preorder, the first element is always the **root**. In inorder, everything left of the root belongs to the left subtree and everything right of it to the right subtree. Recurse on each side.

The reconstructed tree is returned as a level-order array where \`null\` marks a missing child.`,
  constraints: [
    "1 <= preorder.length <= 3000",
    "inorder.length == preorder.length",
    "-3000 <= preorder[i], inorder[i] <= 3000",
    "preorder and inorder consist of unique values; inorder is a permutation of preorder.",
  ],
  io: { params: ["value", "value"], result: "binary-tree" },
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
function buildTree(preorder, inorder) {
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "classic", args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7], explanation: "3 is the root; 9 is left of it inorder (left subtree), 15/20/7 are right." },
    { name: "two nodes", args: [[1, 2], [2, 1]], expected: [1, 2] },
    { name: "single", args: [[-1], [-1]], expected: [-1] },
  ],
  hiddenTests: [
    // Right-leaning chain.
    { args: [[1, 2], [1, 2]], expected: [1, null, 2] },
    // Left-leaning chain.
    { args: [[3, 2, 1], [1, 2, 3]], expected: [3, 2, null, 1] },
    // Right spine.
    { args: [[1, 2, 3], [1, 2, 3]], expected: [1, null, 2, null, 3] },
    { args: [[1, 2, 4, 5, 3, 6, 7], [4, 2, 5, 1, 6, 3, 7]], expected: [1, 2, 3, 4, 5, 6, 7] },
    // Zig-zag shape.
    { args: [[5, 3, 6, 2, 7], [6, 3, 5, 2, 7]], expected: [5, 3, 2, 6, null, null, 7] },
    { args: [[10, -5, 8], [-5, 10, 8]], expected: [10, -5, 8] },
    { args: [[4, 1, 2, 3], [1, 2, 3, 4]], expected: [4, 1, null, null, 2, null, 3] },
    // Scale: a perfect tree of 1023 nodes whose value at heap index i is i+1. Its level-order is
    // densely 1..1023, and pre/inorder are deterministic recursive walks of that heap layout.
    {
      args: ((): [number[], number[]] => {
        const size = 1023;
        const pre: number[] = [];
        const ino: number[] = [];
        const pv = (i: number): void => { if (i >= size) return; pre.push(i + 1); pv(2 * i + 1); pv(2 * i + 2); };
        const iv = (i: number): void => { if (i >= size) return; iv(2 * i + 1); ino.push(i + 1); iv(2 * i + 2); };
        pv(0); iv(0);
        return [pre, ino];
      })(),
      expected: Array.from({ length: 1023 }, (_, i) => i + 1) as (number | null)[],
    },
  ],
  source: { origin: "leetcode", frontendId: "105", acRate: 0.6512, confidence: 0.93 },
  solutions: [
    {
      name: "Recursive split with an inorder index map",
      explanation: `Take the next preorder value as the current root. Find that value in the inorder array: everything to its left is the left subtree, everything to its right is the right subtree. Recurse, consuming preorder values left subtree first (preorder is root, then *all* of left, then *all* of right).

A naive linear search for the root inside inorder makes it O(n²); precompute a value→index map of inorder so the split is O(1).

\`O(n)\` time, \`O(n)\` space for the map and recursion.`,
      code: {
        javascript: `function buildTree(preorder, inorder) {
  // value -> its index in inorder, so the left/right split is O(1).
  const indexOf = new Map();
  inorder.forEach((v, i) => indexOf.set(v, i));
  let pre = 0; // next root to consume from preorder
  // Build the subtree whose inorder slice is [lo, hi].
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const rootVal = preorder[pre++];
    const node = new TreeNode(rootVal);
    const mid = indexOf.get(rootVal); // split point in inorder
    node.left = build(lo, mid - 1);   // left subtree first (matches preorder order)
    node.right = build(mid + 1, hi);
    return node;
  };
  return build(0, inorder.length - 1);
}`,
        typescript: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // value -> its index in inorder, so the left/right split is O(1).
  const indexOf = new Map<number, number>();
  inorder.forEach((v, i) => indexOf.set(v, i));
  let pre = 0; // next root to consume from preorder
  // Build the subtree whose inorder slice is [lo, hi].
  const build = (lo: number, hi: number): TreeNode | null => {
    if (lo > hi) return null;
    const rootVal = preorder[pre++];
    const node = new TreeNode(rootVal);
    const mid = indexOf.get(rootVal)!; // split point in inorder
    node.left = build(lo, mid - 1);    // left subtree first (matches preorder order)
    node.right = build(mid + 1, hi);
    return node;
  };
  return build(0, inorder.length - 1);
}`,
      },
    },
  ],
});
