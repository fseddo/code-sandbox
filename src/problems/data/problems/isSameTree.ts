import { defineAlgoProblem } from "../problem";

// Both params hydrate from level-order arrays into `TreeNode`s; the boolean result passes through.
// A `null` in an input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const isSameTree = defineAlgoProblem<[(number | null)[], (number | null)[]], boolean>({
  id: "same-tree",
  number: 105,
  title: "Same Tree",
  difficulty: "easy",
  tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
  functionName: "isSameTree",
  prompt: `Given the roots of two binary trees \`p\` and \`q\`, return \`true\` if they are **structurally identical** and every corresponding pair of nodes holds the same value.

Two empty trees are the same. Two trees differ if either their shape differs (a node present in one and absent in the other) or any matched pair of nodes disagrees in value.

Each tree is given as a level-order array where \`null\` marks a missing child: \`[1, 2, 3]\` is root \`1\` with children \`2\` and \`3\`.`,
  constraints: [
    "The number of nodes in each tree is in the range [0, 100].",
    "-10^4 <= Node.val <= 10^4",
  ],
  io: { params: ["binary-tree", "binary-tree"], result: "value" },
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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
function isSameTree(p, q) {
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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "identical", args: [[1, 2, 3], [1, 2, 3]], expected: true },
    { name: "shape differs", args: [[1, 2], [1, null, 2]], expected: false, explanation: "Same values but 2 is a left child in one and a right child in the other." },
    { name: "value differs", args: [[1, 2, 1], [1, 1, 2]], expected: false },
  ],
  hiddenTests: [
    { args: [[], []], expected: true },
    { args: [[1], []], expected: false },
    { args: [[], [1]], expected: false },
    { args: [[1], [1]], expected: true },
    { args: [[1], [2]], expected: false },
    { args: [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]], expected: true },
    { args: [[1, 2, 3, 4, 5], [1, 2, 3, 4, 6]], expected: false },
    { args: [[1, null, 2], [1, null, 2]], expected: true },
    { args: [[1, null, 2], [1, 2]], expected: false },
    { args: [[5, 4, 8, 11, null, 13, 4], [5, 4, 8, 11, null, 13, 4]], expected: true },
    { args: [[0, -1], [0, -1]], expected: true },
    // One tree is a prefix of the other — extra node at a deep position.
    { args: [[1, 2, 3, 4], [1, 2, 3]], expected: false },
    // Scale: two identical balanced trees of 1..1023.
    {
      args: (() => {
        const build = (): (number | null)[] => {
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
        };
        return [build(), build()];
      })(),
      expected: true,
    },
  ],
  source: { origin: "leetcode", frontendId: "100", acRate: 0.6713566235902939, confidence: 0.96 },
  solutions: [
    {
      name: "Parallel recursion",
      explanation: `Walk both trees in lockstep. If both nodes are \`null\` the (sub)trees match; if exactly one is \`null\`, or the values differ, they don't. Otherwise recurse on the left pair and the right pair and require both to match.

\`O(n)\` time, \`O(h)\` recursion space.`,
      code: {
        javascript: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
        typescript: `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
      },
    },
  ],
});
