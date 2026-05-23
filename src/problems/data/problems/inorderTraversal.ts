import { defineAlgoProblem } from "../problem";

// Args/expected are plain arrays; `io` hydrates the level-order array into a `TreeNode` around the call.
// A `null` in the input marks an absent child (LeetCode's serialization). See problem-authoring.md.
export const inorderTraversal = defineAlgoProblem<[(number | null)[]], number[]>({
  id: "binary-tree-inorder-traversal",
  number: 18,
  title: "Binary Tree Inorder Traversal",
  difficulty: "easy",
  tags: ["stack", "tree", "depth-first-search", "binary-tree"],
  functionName: "inorderTraversal",
  prompt: `Given the \`root\` of a binary tree, return the **inorder** traversal of its nodes' values — left subtree, then node, then right subtree.

The tree is given to the judge as a level-order array where \`null\` marks a missing child: \`[1, null, 2, 3]\` is a root \`1\` whose right child is \`2\`, and \`2\`'s left child is \`3\`.`,
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
function inorderTraversal(root) {
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
function inorderTraversal(root: TreeNode | null): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "right-leaning", args: [[1, null, 2, 3]], expected: [1, 3, 2], explanation: "Visit 1, then 2's left child 3, then 2." },
    { name: "empty", args: [[]], expected: [] },
    { name: "single node", args: [[1]], expected: [1] },
  ],
  hiddenTests: [
    { args: [[2, 1, 3]], expected: [1, 2, 3] },
    { args: [[1, 2, 3, 4, 5]], expected: [4, 2, 5, 1, 3] },
    { args: [[5, 3, 8, 1, 4, 7, 9]], expected: [1, 3, 4, 5, 7, 8, 9] },
    { args: [[1, null, 2]], expected: [1, 2] },
    { args: [[2, 1]], expected: [1, 2] },
    { args: [[10, 5, 15, null, 6, 13, null, null, 7]], expected: [5, 6, 7, 10, 13, 15] },
    { args: [[-50, -100, 100]], expected: [-100, -50, 100] },
    { args: [[1, 1, 1, 1, 1]], expected: [1, 1, 1, 1, 1] },
    // Left-only spine: a recursion that mishandles a missing right child breaks here.
    { args: [[5, 4, null, 3, null, 2, null, 1]], expected: [1, 2, 3, 4, 5] },
    // Scale: a balanced 1..127 tree, inorder is the sorted sequence.
    { args: [(() => { const a: (number | null)[] = Array(127).fill(null); const fill = (i: number, lo: number, hi: number) => { if (lo > hi) return; const mid = (lo + hi) >> 1; a[i] = mid; fill(2 * i + 1, lo, mid - 1); fill(2 * i + 2, mid + 1, hi); }; fill(0, 1, 127); return a; })()], expected: Array.from({ length: 127 }, (_, i) => i + 1) },
  ],
  source: { origin: "leetcode", frontendId: "94", acRate: 0.7714, confidence: 0.95 },
  solutions: [
    {
      name: "Iterative with an explicit stack",
      explanation: `Walk left as far as possible, pushing every node; when you can't go left, pop, record the value, and step right. The stack stands in for the recursion call stack, so it's iterative without extra recursion depth.

\`O(n)\` time, \`O(h)\` space for the stack (tree height \`h\`).`,
      code: {
        javascript: `function inorderTraversal(root) {
  const result = [];
  const stack = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    result.push(curr.val);
    curr = curr.right;
  }
  return result;
}`,
        typescript: `function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    result.push(curr.val);
    curr = curr.right;
  }
  return result;
}`,
      },
    },
  ],
});
