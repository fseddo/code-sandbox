import { defineAlgoProblem } from "../problem";

// `io` hydrates the level-order array into a `TreeNode`; the numeric result passes straight through.
// A `null` in the input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const widthOfBinaryTree = defineAlgoProblem<[(number | null)[]], number>({
  id: "maximum-width-of-binary-tree",
  number: 139,
  title: "Maximum Width of Binary Tree",
  difficulty: "medium",
  tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
  functionName: "widthOfBinaryTree",
  prompt: `Given the \`root\` of a binary tree, return its **maximum width**.

The width of one level is the distance between its leftmost and rightmost *non-null* nodes, counting the \`null\` slots that would sit between them as if the tree were a complete binary tree. Formally, if you index nodes as in a heap (a node at index \`i\` has children \`2i\` and \`2i + 1\`), a level's width is \`rightmostIndex - leftmostIndex + 1\`. The answer is the largest level width.

The tree is given as a level-order array where \`null\` marks a missing child: \`[1, 3, 2, 5, 3, null, 9]\`.`,
  constraints: [
    "The number of nodes in the tree is in the range [1, 3000].",
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
 * @return {number}
 */
function widthOfBinaryTree(root) {
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
function widthOfBinaryTree(root: TreeNode | null): number {
  // your code here
}`,
  },
  examples: [
    { name: "gap counts", args: [[1, 3, 2, 5, 3, null, 9]], expected: 4, explanation: "The bottom level holds 5,3 (under 3) and 9 (under 2's right) at positions 0,1,3 — width 4 including the null gap." },
    { name: "full level", args: [[1, 3, 2, 5, 3, 9, 7]], expected: 4, explanation: "The bottom level is full: 5,3,9,7 at positions 0..3 — width 4." },
    { name: "single", args: [[1]], expected: 1 },
  ],
  hiddenTests: [
    { args: [[1, 1]], expected: 1 },
    { args: [[1, 1, 1, 1, 1, 1, 1]], expected: 4 },
    // Left-only then a single child each level: every level has width 1.
    { args: [[1, 3, 2, 5]], expected: 2 },
    { args: [[1, null, 2, null, 3]], expected: 1 },
    { args: [[1, 2, null, 3, null, 4]], expected: 1 },
    // Bottom level: 6 under 5 (heap idx 0), 7 under 9 (heap idx 7) — span 0..7 → width 8.
    { args: [[1, 3, 2, 5, null, null, 9, 6, null, null, 7]], expected: 8 },
    // Two children under the outer leaves of a full level 2 maximise the gap.
    { args: [[1, 2, 3, 4, null, null, 7, 8, null, null, 15]], expected: 8 },
    { args: [[1, 1, 1, 1, null, null, 1, 1, null, null, 1]], expected: 8 },
    // Scale: a perfect tree of depth 11 — bottom level width equals its node count, 1024.
    {
      args: [(() => {
        const depth = 11;
        const size = (1 << depth) - 1;
        return Array.from({ length: size }, () => 1) as (number | null)[];
      })()],
      expected: 1 << (11 - 1),
    },
  ],
  source: { origin: "leetcode", frontendId: "662", acRate: 0.4312, confidence: 0.92 },
  solutions: [
    {
      name: "BFS carrying heap indices",
      explanation: `Give the root index \`0\`; a node at index \`i\` gives its children indices \`2i\` and \`2i + 1\` — the positions they'd occupy in a complete tree. Do a level-order traversal carrying each node's index. For each level, the width is \`lastIndex - firstIndex + 1\`.

To stop the indices from overflowing on deep trees, subtract the level's first index from every index on that level (re-basing each level to start at 0) — the *differences* are all that matter.

\`O(n)\` time, \`O(w)\` space for the queue.`,
      code: {
        javascript: `function widthOfBinaryTree(root) {
  if (!root) return 0;
  let best = 0;
  // Queue holds [node, indexWithinLevel]; root starts at 0.
  let queue = [[root, 0]];
  while (queue.length) {
    const first = queue[0][1];
    const last = queue[queue.length - 1][1];
    best = Math.max(best, last - first + 1);
    const next = [];
    for (const [node, index] of queue) {
      // Re-base by 'first' so indices stay small on deep trees.
      const rebased = index - first;
      if (node.left) next.push([node.left, 2 * rebased]);
      if (node.right) next.push([node.right, 2 * rebased + 1]);
    }
    queue = next;
  }
  return best;
}`,
        typescript: `function widthOfBinaryTree(root: TreeNode | null): number {
  if (!root) return 0;
  let best = 0;
  // Queue holds [node, indexWithinLevel]; root starts at 0.
  let queue: [TreeNode, number][] = [[root, 0]];
  while (queue.length) {
    const first = queue[0][1];
    const last = queue[queue.length - 1][1];
    best = Math.max(best, last - first + 1);
    const next: [TreeNode, number][] = [];
    for (const [node, index] of queue) {
      // Re-base by 'first' so indices stay small on deep trees.
      const rebased = index - first;
      if (node.left) next.push([node.left, 2 * rebased]);
      if (node.right) next.push([node.right, 2 * rebased + 1]);
    }
    queue = next;
  }
  return best;
}`,
      },
    },
  ],
});
