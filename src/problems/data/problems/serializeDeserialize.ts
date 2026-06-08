import { defineAlgoProblem } from "../problem";

// Reframe note: LeetCode's "Serialize and Deserialize" is a two-method Codec class (serialize → string,
// deserialize → tree). This sandbox runs a single function, so the round trip is expressed as one call:
// `serializeDeserialize(root)` serializes to a string and deserializes that string back to a tree, returning
// it. A faithful codec reproduces the original, so the returned tree's level-order must equal the input's.
// The `io` result `"binary-tree"` serializes the returned tree for comparison. See problem-authoring.md.
export const serializeDeserialize = defineAlgoProblem<[(number | null)[]], (number | null)[]>({
  id: "serialize-and-deserialize-binary-tree",
  number: 140,
  title: "Serialize and Deserialize Binary Tree",
  difficulty: "hard",
  tags: ["string", "tree", "depth-first-search", "breadth-first-search", "binary-tree"],
  functionName: "serializeDeserialize",
  prompt: `Design a codec for a binary tree: a **serialize** step that turns the tree into a single string, and a **deserialize** step that rebuilds the *exact* same tree from that string. A correct codec is a perfect round trip — deserialize(serialize(t)) must equal \`t\`.

This sandbox runs one function, so implement the whole round trip in \`serializeDeserialize(root)\`: serialize \`root\` to a string of your own format, then parse that string back into a tree and return it. You may choose any string format (preorder with null markers is a common one) as long as the rebuilt tree matches the original.

The tree is given (and the result is checked) as a level-order array where \`null\` marks a missing child.`,
  constraints: [
    "The number of nodes in the tree is in the range [0, 10^4].",
    "-1000 <= Node.val <= 1000",
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
 * Round-trips the tree: serialize to a string, then deserialize back.
 * @param {TreeNode} root
 * @return {TreeNode}
 */
function serializeDeserialize(root) {
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
 * Round-trips the tree: serialize to a string, then deserialize back.
 * @param {TreeNode} root
 * @return {TreeNode}
 */
function serializeDeserialize(root: TreeNode | null): TreeNode | null {
  // your code here
}`,
  },
  examples: [
    { name: "classic", args: [[1, 2, 3, null, null, 4, 5]], expected: [1, 2, 3, null, null, 4, 5], explanation: "Serialize to a string, parse it back — the rebuilt tree is identical." },
    { name: "empty", args: [[]], expected: [] },
    { name: "single", args: [[1]], expected: [1] },
  ],
  hiddenTests: [
    { args: [[1, 2]], expected: [1, 2] },
    { args: [[1, null, 2]], expected: [1, null, 2] },
    // Negative values must survive the string round trip.
    { args: [[-1, -2, -3]], expected: [-1, -2, -3] },
    { args: [[5, 3, 8, 1, 4, 7, 9]], expected: [5, 3, 8, 1, 4, 7, 9] },
    // Left-only spine.
    { args: [[1, 2, null, 3, null, 4]], expected: [1, 2, null, 3, null, 4] },
    // Right-only spine.
    { args: [[1, null, 2, null, 3]], expected: [1, null, 2, null, 3] },
    // Mixed gaps that must be preserved exactly.
    { args: [[10, 5, 15, null, null, 6, 20]], expected: [10, 5, 15, null, null, 6, 20] },
    { args: [[0, -1000, 1000]], expected: [0, -1000, 1000] },
    // Scale: a balanced 1..1023 tree round-trips unchanged.
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
  source: { origin: "leetcode", frontendId: "297", acRate: 0.5712, confidence: 0.9 },
  solutions: [
    {
      name: "Preorder with null markers",
      explanation: `Serialize with a preorder walk: append each node's value, and a sentinel (\`#\`) for every null child. That sentinel is what makes the string unambiguous — it records the *shape*, so no second traversal is needed to rebuild.

Deserialize by consuming the tokens in the same preorder order: the next token is the current node (or a null if it's the sentinel), then recursively build its left subtree, then its right.

\`O(n)\` time and \`O(n)\` space for both directions (the string and the recursion).`,
      code: {
        javascript: `function serializeDeserialize(root) {
  // --- serialize: preorder, '#' marks a null child ---
  const parts = [];
  const write = (node) => {
    if (!node) { parts.push('#'); return; }
    parts.push(String(node.val));
    write(node.left);
    write(node.right);
  };
  write(root);
  const data = parts.join(',');

  // --- deserialize: consume tokens in the same preorder ---
  const tokens = data.split(',');
  let i = 0;
  const read = () => {
    const token = tokens[i++];
    if (token === '#') return null;        // a null child
    const node = new TreeNode(Number(token));
    node.left = read();                    // left subtree comes next in preorder
    node.right = read();
    return node;
  };
  return read();
}`,
        typescript: `function serializeDeserialize(root: TreeNode | null): TreeNode | null {
  // --- serialize: preorder, '#' marks a null child ---
  const parts: string[] = [];
  const write = (node: TreeNode | null): void => {
    if (!node) { parts.push('#'); return; }
    parts.push(String(node.val));
    write(node.left);
    write(node.right);
  };
  write(root);
  const data = parts.join(',');

  // --- deserialize: consume tokens in the same preorder ---
  const tokens = data.split(',');
  let i = 0;
  const read = (): TreeNode | null => {
    const token = tokens[i++];
    if (token === '#') return null;        // a null child
    const node = new TreeNode(Number(token));
    node.left = read();                    // left subtree comes next in preorder
    node.right = read();
    return node;
  };
  return read();
}`,
      },
    },
  ],
});
