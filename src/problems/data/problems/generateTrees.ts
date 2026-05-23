import { defineAlgoProblem } from "../problem";

// Authoring-time enumerator used to build the expected sets for the count-heavy hidden cases below —
// the same construction as the reference solution, dehydrated to level-order arrays.
type RefNode = { val: number; left: RefNode | null; right: RefNode | null };

const catalanTrees = (n: number): (number | null)[][] => {
  if (n === 0) return [];
  const build = (lo: number, hi: number): (RefNode | null)[] => {
    if (lo > hi) return [null];
    const trees: (RefNode | null)[] = [];
    for (let root = lo; root <= hi; root++) {
      for (const left of build(lo, root - 1)) {
        for (const right of build(root + 1, hi)) {
          trees.push({ val: root, left, right });
        }
      }
    }
    return trees;
  };
  const toArray = (root: RefNode | null): (number | null)[] => {
    if (!root) return [];
    const out: (number | null)[] = [];
    const queue: (RefNode | null)[] = [root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (node === null) {
        out.push(null);
        continue;
      }
      out.push(node.val);
      queue.push(node.left, node.right);
    }
    while (out.length > 0 && out[out.length - 1] === null) out.pop();
    return out;
  };
  return build(1, n).map(toArray);
};

// Result io `binary-tree[]` dehydrates each returned `TreeNode` to a level-order `(number|null)[]`,
// so `actual` and `expected` are both `(number|null)[][]`. The set of trees can come back in any
// order, so the checker serializes each tree to a JSON string and compares the two as sorted sets.
export const generateTrees = defineAlgoProblem<[number], (number | null)[][]>({
  id: "unique-binary-search-trees-ii",
  number: 100,
  title: "Unique Binary Search Trees II",
  difficulty: "medium",
  tags: ["dynamic-programming", "backtracking", "tree", "binary-search-tree", "binary-tree"],
  functionName: "generateTrees",
  prompt: `Given an integer \`n\`, return **all** the structurally unique binary search trees that store exactly the values \`1, 2, …, n\`. The trees may be returned in any order.

Each returned tree is checked in LeetCode's level-order array form (\`null\` marks an absent child). For \`n = 0\` there are no values to place, so return an empty list.`,
  constraints: ["0 <= n <= 8"],
  io: { result: "binary-tree[]" },
  checker: `(actual, args, expected) => {
  if (!Array.isArray(actual) || actual.length !== expected.length) return false;
  const key = (xs) => JSON.stringify(xs);
  const a = actual.map(key).sort();
  const b = expected.map(key).sort();
  return a.every((v, i) => v === b[i]);
}`,
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
 * @param {number} n
 * @return {TreeNode[]}
 */
function generateTrees(n) {
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
 * @param {number} n
 * @return {TreeNode[]}
 */
function generateTrees(n: number): Array<TreeNode | null> {
  // your code here
}`,
  },
  examples: [
    {
      name: "n = 3",
      args: [3],
      expected: [[1, null, 2, null, 3], [1, null, 3, 2], [2, 1, 3], [3, 1, null, null, 2], [3, 2, null, 1]],
      explanation: "The five structurally distinct BSTs over {1,2,3}.",
    },
    { name: "n = 1", args: [1], expected: [[1]] },
    { name: "n = 0", args: [0], expected: [], explanation: "No values to place — the empty list." },
  ],
  hiddenTests: [
    { args: [2], expected: [[1, null, 2], [2, 1]] },
    {
      args: [4],
      expected: [
        [1, null, 2, null, 3, null, 4],
        [1, null, 2, null, 4, 3],
        [1, null, 3, 2, 4],
        [1, null, 4, 2, null, null, 3],
        [1, null, 4, 3, null, 2],
        [2, 1, 3, null, null, null, 4],
        [2, 1, 4, null, null, 3],
        [3, 1, 4, null, 2],
        [3, 2, 4, 1],
        [4, 1, null, null, 2, null, 3],
        [4, 1, null, null, 3, 2],
        [4, 2, null, 1, 3],
        [4, 3, null, 1, null, null, 2],
        [4, 3, null, 2, null, 1],
      ],
    },
    // Count checks for larger n — the Catalan numbers C(5)=42, C(6)=132, C(7)=429, C(8)=1430.
    // The checker compares full structure, so a wrong shape (not just a wrong count) fails too.
    { args: [5], expected: catalanTrees(5) },
    { args: [6], expected: catalanTrees(6) },
    { args: [7], expected: catalanTrees(7) },
    // Scale: the largest allowed input produces 1430 distinct trees.
    { args: [8], expected: catalanTrees(8) },
  ],
  source: { origin: "leetcode", frontendId: "95", acRate: 0.6249017522276614, confidence: 0.9 },
  solutions: [
    {
      name: "Recursive construction by root choice",
      explanation: `Build every BST holding the contiguous range \`[lo, hi]\`. Pick each value as the root; the values below it form every possible left subtree (a recursive call on \`[lo, root-1]\`) and the values above it form every possible right subtree (\`[root+1, hi]\`). Take the Cartesian product of left and right results, attaching each pair under a fresh root node. The base case \`lo > hi\` yields a single \`null\` (an empty subtree). \`n = 0\` returns the empty list.

The number of trees is the Catalan number \`C(n)\`; time and space are \`O(n · C(n))\`.`,
      code: {
        javascript: `function generateTrees(n) {
  if (n === 0) return [];
  const build = (lo, hi) => {
    if (lo > hi) return [null];
    const trees = [];
    for (let root = lo; root <= hi; root++) {
      const lefts = build(lo, root - 1);
      const rights = build(root + 1, hi);
      for (const left of lefts) {
        for (const right of rights) {
          trees.push(new TreeNode(root, left, right));
        }
      }
    }
    return trees;
  };
  return build(1, n);
}`,
        typescript: `function generateTrees(n: number): Array<TreeNode | null> {
  if (n === 0) return [];
  const build = (lo: number, hi: number): Array<TreeNode | null> => {
    if (lo > hi) return [null];
    const trees: Array<TreeNode | null> = [];
    for (let root = lo; root <= hi; root++) {
      const lefts = build(lo, root - 1);
      const rights = build(root + 1, hi);
      for (const left of lefts) {
        for (const right of rights) {
          trees.push(new TreeNode(root, left, right));
        }
      }
    }
    return trees;
  };
  return build(1, n);
}`,
      },
    },
  ],
});
