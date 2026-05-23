import { defineAlgoProblem } from "../problem";

// `io` hydrates the level-order array into a `TreeNode`; the solution mutates two node values in
// place and returns the same root, which serializes back to a level-order array. Exactly two nodes
// were swapped and the corrected BST is unique, so plain deep-equal works. See problem-authoring.md.
export const recoverTree = defineAlgoProblem<[(number | null)[]], (number | null)[]>({
  id: "recover-binary-search-tree",
  number: 104,
  title: "Recover Binary Search Tree",
  difficulty: "medium",
  tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
  functionName: "recoverTree",
  prompt: `You are given the \`root\` of a binary search tree in which the values of **exactly two** nodes were swapped by mistake. Recover the tree by swapping those two values back, *without changing the tree's structure*, and return the root.

The corrected tree is unique: a BST over a fixed multiset of values has exactly one valid arrangement, so there is a single right answer.

The tree is given as a level-order array where \`null\` marks a missing child, and the recovered tree is checked in the same form.`,
  constraints: [
    "The number of nodes in the tree is in the range [2, 1000].",
    "-2^31 <= Node.val <= 2^31 - 1",
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
function recoverTree(root) {
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
function recoverTree(root: TreeNode | null): TreeNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "root and child swapped", args: [[1, 2, 3]], expected: [2, 1, 3], explanation: "Inorder is 2,1,3 — out of order at the first pair; swap 1 and 2 to get a valid BST." },
    { name: "deep swap", args: [[3, 1, 4, null, null, 2]], expected: [2, 1, 4, null, null, 3], explanation: "Inorder 1,3,4,2 dips twice; swap the 3 (a root) and the 2 (a leaf) to restore 1,2,3,4." },
    { name: "non-adjacent swap", args: [[6, 3, 8, 9, 5, 7, 1]], expected: [6, 3, 8, 1, 5, 7, 9], explanation: "Inorder 9,3,5,6,7,8,1 has two dips; swap the 9 and 1 to restore order." },
  ],
  hiddenTests: [
    { args: [[2, 3, 1]], expected: [2, 1, 3] },
    { args: [[3, 4, 1, null, 2]], expected: [3, 1, 4, null, 2] },
    { args: [[5, 2, 6, 1, 3, 4, 7]], expected: [4, 2, 6, 1, 3, 5, 7] },
    { args: [[5, 3, 2, 7, 4, 6, 8]], expected: [5, 3, 7, 2, 4, 6, 8] },
    { args: [[20, 30, 10]], expected: [20, 10, 30] },
    { args: [[2, null, 1]], expected: [1, null, 2] },
    { args: [[8, 4, 12, 2, 10, 6, 14]], expected: [8, 4, 12, 2, 6, 10, 14] },
    { args: [[1, 3, null, null, 2]], expected: [3, 1, null, null, 2] },
    { args: [[4, 1, 5, null, null, 3, 6]], expected: [3, 1, 5, null, null, 4, 6] },
    { args: [[10, 5, 8]], expected: [8, 5, 10] },
    // Adjacent inorder swap — the two violating nodes are neighbors, so `first` and `second` coincide on one dip.
    { args: [[1, 2]], expected: [2, 1] },
    // Scale: a balanced BST of 1..1023 with two deep nodes swapped; recovery restores the original.
    {
      args: [(() => {
        const a: (number | null)[] = Array(1023).fill(null);
        const fill = (i: number, lo: number, hi: number): void => {
          if (lo > hi) return;
          const mid = (lo + hi) >> 1;
          a[i] = mid;
          fill(2 * i + 1, lo, mid - 1);
          fill(2 * i + 2, mid + 1, hi);
        };
        fill(0, 1, 1023);
        const idxs = a.map((v, i) => (v !== null ? i : -1)).filter((i) => i >= 0);
        const i1 = idxs[10];
        const i2 = idxs[500];
        const t = a[i1];
        a[i1] = a[i2];
        a[i2] = t;
        return a;
      })()],
      expected: (() => {
        const a: (number | null)[] = Array(1023).fill(null);
        const fill = (i: number, lo: number, hi: number): void => {
          if (lo > hi) return;
          const mid = (lo + hi) >> 1;
          a[i] = mid;
          fill(2 * i + 1, lo, mid - 1);
          fill(2 * i + 2, mid + 1, hi);
        };
        fill(0, 1, 1023);
        return a;
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "99", acRate: 0.5965472505079007, confidence: 0.92 },
  solutions: [
    {
      name: "Inorder scan for the two misplaced nodes",
      explanation: `An inorder traversal of a valid BST is strictly increasing. With two nodes swapped there are one or two descents (\`prev.val > curr.val\`). The first such descent's \`prev\` is the first offender; the *last* descent's \`curr\` is the second. When the swapped nodes are adjacent in the inorder sequence there is a single descent, so \`first\` and \`second\` come from the same pair. Swapping their values fixes the tree in place.

\`O(n)\` time, \`O(h)\` recursion space.`,
      code: {
        javascript: `function recoverTree(root) {
  let first = null;
  let second = null;
  let prev = null;
  const inorder = (node) => {
    if (!node) return;
    inorder(node.left);
    if (prev && prev.val > node.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    inorder(node.right);
  };
  inorder(root);
  if (first && second) {
    const tmp = first.val;
    first.val = second.val;
    second.val = tmp;
  }
  return root;
}`,
        typescript: `function recoverTree(root: TreeNode | null): TreeNode | null {
  let first: TreeNode | null = null;
  let second: TreeNode | null = null;
  let prev: TreeNode | null = null;
  const inorder = (node: TreeNode | null): void => {
    if (!node) return;
    inorder(node.left);
    if (prev && prev.val > node.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    inorder(node.right);
  };
  inorder(root);
  if (first && second) {
    const tmp = (first as TreeNode).val;
    (first as TreeNode).val = (second as TreeNode).val;
    (second as TreeNode).val = tmp;
  }
  return root;
}`,
      },
    },
  ],
});
