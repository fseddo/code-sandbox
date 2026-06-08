import { defineAlgoProblem } from "../problem";

// `io` hydrates the level-order array into a `TreeNode`; the array result passes straight through.
// A `null` in the input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const rightSideView = defineAlgoProblem<[(number | null)[]], number[]>({
  id: "binary-tree-right-side-view",
  number: 138,
  title: "Binary Tree Right Side View",
  difficulty: "medium",
  tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
  functionName: "rightSideView",
  prompt: `Given the \`root\` of a binary tree, imagine standing on its right side. Return the values of the nodes you can see, ordered top to bottom.

The visible node at each depth is the **last** node on that level (its rightmost node). Note a level's rightmost visible node may be a *left* child if the level has no node further right.

The tree is given as a level-order array where \`null\` marks a missing child: \`[1, 2, 3, null, 5, null, 4]\`.`,
  constraints: [
    "The number of nodes in the tree is in the range [0, 100].",
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
 * @return {number[]}
 */
function rightSideView(root) {
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
 * @return {number[]}
 */
function rightSideView(root: TreeNode | null): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "classic", args: [[1, 2, 3, null, 5, null, 4]], expected: [1, 3, 4], explanation: "Level 0: 1; level 1: rightmost is 3; level 2: 4." },
    { name: "left visible", args: [[1, 2, 3, 4]], expected: [1, 3, 4], explanation: "Level 2 has only the left child 4, so it's the visible one." },
    { name: "empty", args: [[]], expected: [] },
  ],
  hiddenTests: [
    { args: [[1]], expected: [1] },
    // Left-only spine: every node is the rightmost on its level.
    { args: [[1, 2, null, 3]], expected: [1, 2, 3] },
    // Right-only spine.
    { args: [[1, null, 2, null, 3]], expected: [1, 2, 3] },
    { args: [[1, 2, 3]], expected: [1, 3] },
    // A left child becomes visible because its level has nothing to the right.
    { args: [[1, 2, 3, 4, null, null, null, 5]], expected: [1, 3, 4, 5] },
    { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [1, 3, 7] },
    { args: [[-1, -2, -3]], expected: [-1, -3] },
    { args: [[1, 2]], expected: [1, 2] },
    // Scale: a balanced tree of depth 11; the rightmost per level is its last index.
    {
      args: [(() => {
        const depth = 11;
        const size = (1 << depth) - 1;
        return Array.from({ length: size }, (_, i) => i) as (number | null)[];
      })()],
      // Rightmost node at depth d is index 2^(d+1) - 2.
      expected: Array.from({ length: 11 }, (_, d) => (1 << (d + 1)) - 2),
    },
  ],
  source: { origin: "leetcode", frontendId: "199", acRate: 0.6489, confidence: 0.94 },
  solutions: [
    {
      name: "BFS, take the last of each level",
      explanation: `Do a level-order (breadth-first) traversal. Process one full level at a time by snapshotting the queue size before draining it; the last node dequeued on a level is its rightmost, so push that value.

\`O(n)\` time, \`O(w)\` space for the queue (\`w\` = max level width).`,
      code: {
        javascript: `function rightSideView(root) {
  if (!root) return [];
  const result = [];
  let queue = [root];
  while (queue.length) {
    const next = [];
    // The last node processed this level is the one visible from the right.
    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];
      if (i === queue.length - 1) result.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  return result;
}`,
        typescript: `function rightSideView(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  let queue: TreeNode[] = [root];
  while (queue.length) {
    const next: TreeNode[] = [];
    // The last node processed this level is the one visible from the right.
    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];
      if (i === queue.length - 1) result.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  return result;
}`,
      },
    },
  ],
});
