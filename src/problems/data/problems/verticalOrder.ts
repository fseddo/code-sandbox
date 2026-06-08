import { defineAlgoProblem } from "../problem";

// `io` hydrates the level-order array into a `TreeNode`; the nested-array result passes straight through.
// A `null` in the input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const verticalOrder = defineAlgoProblem<[(number | null)[]], number[][]>({
  id: "binary-tree-vertical-order-traversal",
  number: 133,
  title: "Binary Tree Vertical Order Traversal",
  difficulty: "medium",
  tags: ["hash-table", "tree", "depth-first-search", "breadth-first-search", "binary-tree"],
  functionName: "verticalOrder",
  prompt: `Given the \`root\` of a binary tree, return its **vertical order traversal** — the node values grouped by column, from the leftmost column to the rightmost.

Assign the root column \`0\`; a left child is one column to the left (\`col - 1\`) and a right child one column to the right (\`col + 1\`). Within a column, list nodes **top to bottom**; when two nodes share a column *and* a row, list them **left to right** (i.e. in the order a level-order scan reaches them).

The tree is given as a level-order array where \`null\` marks a missing child: \`[3, 9, 20, null, null, 15, 7]\`.`,
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
 * @return {number[][]}
 */
function verticalOrder(root) {
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
 * @return {number[][]}
 */
function verticalOrder(root: TreeNode | null): number[][] {
  // your code here
}`,
  },
  examples: [
    { name: "classic", args: [[3, 9, 20, null, null, 15, 7]], expected: [[9], [3, 15], [20], [7]], explanation: "Columns -1..2: [9], then root 3 with 15 (both at col 0), then 20, then 7." },
    { name: "with collision", args: [[3, 9, 8, 4, 0, 1, 7]], expected: [[4], [9], [3, 0, 1], [8], [7]], explanation: "Column 0 holds 3, then 0 and 1 sharing a row, left-to-right." },
    { name: "empty", args: [[]], expected: [] },
  ],
  hiddenTests: [
    { args: [[1]], expected: [[1]] },
    // Left spine: each node one column further left.
    { args: [[1, 2, null, 3]], expected: [[3], [2], [1]] },
    // Right spine: each node one column further right.
    { args: [[1, null, 2, null, 3]], expected: [[1], [2], [3]] },
    { args: [[1, 2, 3]], expected: [[2], [1], [3]] },
    // Same-cell collision resolved left-to-right by BFS order.
    { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [[4], [2], [1, 5, 6], [3], [7]] },
    { args: [[5, 5, 5]], expected: [[5], [5], [5]] },
    { args: [[1, 2, 3, 4, null, null, 5]], expected: [[4], [2], [1], [3], [5]] },
    // Negative values still group by column, not by value.
    { args: [[0, -1, 1]], expected: [[-1], [0], [1]] },
  ],
  source: { origin: "leetcode", frontendId: "314", acRate: 0.5421, confidence: 0.9 },
  solutions: [
    {
      name: "BFS with a column index",
      explanation: `The within-column ordering is *top to bottom, then left to right* — exactly the order a breadth-first scan visits nodes. So do a BFS, carrying each node's column index alongside it, and append values into per-column buckets. BFS guarantees a node enqueued earlier (higher up, or further left on the same row) lands in its bucket first, so no per-bucket sorting is needed.

After the scan, read the buckets out from the minimum column to the maximum.

\`O(n)\` time, \`O(n)\` space for the queue and buckets.`,
      code: {
        javascript: `function verticalOrder(root) {
  if (!root) return [];
  const columns = new Map();          // col index -> values, in BFS order
  let minCol = 0;
  let maxCol = 0;
  // Queue holds [node, column]; BFS preserves the top-to-bottom, left-to-right order.
  const queue = [[root, 0]];
  while (queue.length) {
    const [node, col] = queue.shift();
    if (!columns.has(col)) columns.set(col, []);
    columns.get(col).push(node.val);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (node.left) queue.push([node.left, col - 1]);
    if (node.right) queue.push([node.right, col + 1]);
  }
  // Read buckets left to right.
  const result = [];
  for (let col = minCol; col <= maxCol; col++) result.push(columns.get(col));
  return result;
}`,
        typescript: `function verticalOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const columns = new Map<number, number[]>(); // col index -> values, in BFS order
  let minCol = 0;
  let maxCol = 0;
  // Queue holds [node, column]; BFS preserves the top-to-bottom, left-to-right order.
  const queue: [TreeNode, number][] = [[root, 0]];
  while (queue.length) {
    const [node, col] = queue.shift()!;
    if (!columns.has(col)) columns.set(col, []);
    columns.get(col)!.push(node.val);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (node.left) queue.push([node.left, col - 1]);
    if (node.right) queue.push([node.right, col + 1]);
  }
  // Read buckets left to right.
  const result: number[][] = [];
  for (let col = minCol; col <= maxCol; col++) result.push(columns.get(col)!);
  return result;
}`,
      },
    },
  ],
});
