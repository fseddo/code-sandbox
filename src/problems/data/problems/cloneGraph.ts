import { defineAlgoProblem } from "../problem";

// `io: "graph"` hydrates the adjacency-list array into a cyclic `GraphNode` and serializes the returned
// graph back to one. Structure-only: the check can't see object identity, so it confirms the clone's
// *shape* but not that it's a fresh copy (a solution returning the original graph would also pass). The
// prompt states this. See problem-authoring.md → "I/O shapes".
export const cloneGraph = defineAlgoProblem<[number[][]], number[][]>({
  id: "clone-graph",
  number: 144,
  title: "Clone Graph",
  difficulty: "medium",
  tags: ["graph", "depth-first-search", "breadth-first-search", "hash-table"],
  functionName: "cloneGraph",
  prompt: `Given a reference to a node in a **connected undirected graph**, return a **deep copy** (clone) of the graph. Each node holds an integer \`val\` and a list of its \`neighbors\`.

The graph is given in adjacency-list form: \`adjList[i]\` lists the neighbors of the node with value \`i + 1\` (node values are the contiguous range \`1..N\`, so the array is 0-indexed but values are 1-indexed). For example \`[[2,4],[1,3],[2,4],[1,3]]\` is a 4-node square: node 1 borders 2 and 4, node 2 borders 1 and 3, and so on. Your function receives the node with value 1.

Return the clone as the equivalent adjacency list.

**Grading note.** The tests serialize your returned graph and compare its *structure* to the expected adjacency list — they verify you rebuilt the right shape, but they cannot detect a solution that returns the *original* graph instead of a fresh copy (serialization erases object identity). Still write a genuine deep copy: allocate new nodes and wire new neighbor links.`,
  constraints: [
    "The number of nodes is in the range [0, 100].",
    "1 <= Node.val <= 100, and Node.val is unique for each node.",
    "There are no repeated edges and no self-loops.",
    "The graph is connected, and all nodes can be reached from the given node.",
  ],
  io: { params: ["graph"], result: "graph" },
  starterCode: {
    javascript: `/**
 * Definition for a graph node.
 * function GraphNode(val, neighbors) {
 *   this.val = (val === undefined ? 0 : val)
 *   this.neighbors = (neighbors === undefined ? [] : neighbors)
 * }
 */
/**
 * @param {GraphNode} node
 * @return {GraphNode}
 */
function cloneGraph(node) {
  // your code here
}`,
    typescript: `/**
 * Definition for a graph node.
 * class GraphNode {
 *   val: number
 *   neighbors: GraphNode[]
 *   constructor(val?: number, neighbors?: GraphNode[]) {
 *     this.val = (val === undefined ? 0 : val)
 *     this.neighbors = (neighbors === undefined ? [] : neighbors)
 *   }
 * }
 */
/**
 * @param {GraphNode} node
 * @return {GraphNode}
 */
function cloneGraph(node: GraphNode | null): GraphNode | null {
  // your code here
}`,
  },
  examples: [
    {
      name: "square",
      args: [[[2, 4], [1, 3], [2, 4], [1, 3]]],
      expected: [[2, 4], [1, 3], [2, 4], [1, 3]],
      explanation: "A 4-cycle. The clone has the same four nodes and the same adjacency, rebuilt as new objects.",
    },
    {
      name: "single node",
      args: [[[]]],
      expected: [[]],
      explanation: "One node with no neighbors clones to one node with no neighbors.",
    },
    { name: "empty graph", args: [[]], expected: [] },
  ],
  hiddenTests: [
    // Two mutually-connected nodes — the smallest case with a cycle.
    { args: [[[2], [1]]], expected: [[2], [1]] },
    // Triangle: every node borders the other two.
    { args: [[[2, 3], [1, 3], [1, 2]]], expected: [[2, 3], [1, 3], [1, 2]] },
    // Path 1—2—3: the middle node has two neighbors, the ends one each.
    { args: [[[2], [1, 3], [2]]], expected: [[2], [1, 3], [2]] },
    // Star: node 1 is the hub of three leaves.
    { args: [[[2, 3, 4], [1], [1], [1]]], expected: [[2, 3, 4], [1], [1], [1]] },
    // A 5-cycle.
    { args: [[[2, 5], [1, 3], [2, 4], [3, 5], [1, 4]]], expected: [[2, 5], [1, 3], [2, 4], [3, 5], [1, 4]] },
    // Complete graph on 4 nodes (every pair adjacent).
    { args: [[[2, 3, 4], [1, 3, 4], [1, 2, 4], [1, 2, 3]]], expected: [[2, 3, 4], [1, 3, 4], [1, 2, 4], [1, 2, 3]] },
    // Scale: a 100-node cycle, each node bordering its two ring neighbors.
    {
      args: [(() => {
        const n = 100;
        return Array.from({ length: n }, (_, i) => {
          const prev = ((i - 1 + n) % n) + 1;
          const next = ((i + 1) % n) + 1;
          return [prev, next].sort((a, b) => a - b);
        });
      })()],
      expected: (() => {
        const n = 100;
        return Array.from({ length: n }, (_, i) => {
          const prev = ((i - 1 + n) % n) + 1;
          const next = ((i + 1) % n) + 1;
          return [prev, next].sort((a, b) => a - b);
        });
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "133", acRate: 0.5701, confidence: 0.9 },
  solutions: [
    {
      name: "DFS with a visited map",
      explanation: `Walk the graph from the given node, cloning as you go. A \`Map\` from each *original* node to its *clone* does double duty: it remembers the copies you've made (so a node shared by several neighbors is cloned once) and it breaks cycles (revisiting a node returns its existing clone instead of recursing forever).

For each original node, make its clone, record it in the map *before* recursing into neighbors (so a back-edge finds the in-progress clone), then attach a cloned neighbor for each original neighbor.

\`O(V + E)\` time — every node and edge is visited once — and \`O(V)\` space for the map plus recursion.`,
      code: {
        javascript: `function cloneGraph(node) {
  // Empty graph: nothing to clone.
  if (!node) return null;
  // Map each original node to its clone — dedupes shared nodes and breaks cycles.
  const clones = new Map();
  const dfs = (curr) => {
    // Already cloned (or mid-clone): return the existing copy, closing any cycle.
    if (clones.has(curr)) return clones.get(curr);
    // Clone this node and record it BEFORE recursing, so a back-edge sees it.
    const copy = new GraphNode(curr.val);
    clones.set(curr, copy);
    // Clone each neighbor and wire it into the copy.
    for (const neighbor of curr.neighbors) copy.neighbors.push(dfs(neighbor));
    return copy;
  };
  return dfs(node);
}`,
        typescript: `function cloneGraph(node: GraphNode | null): GraphNode | null {
  // Empty graph: nothing to clone.
  if (!node) return null;
  // Map each original node to its clone — dedupes shared nodes and breaks cycles.
  const clones = new Map<GraphNode, GraphNode>();
  const dfs = (curr: GraphNode): GraphNode => {
    // Already cloned (or mid-clone): return the existing copy, closing any cycle.
    const seen = clones.get(curr);
    if (seen) return seen;
    // Clone this node and record it BEFORE recursing, so a back-edge sees it.
    const copy = new GraphNode(curr.val);
    clones.set(curr, copy);
    // Clone each neighbor and wire it into the copy.
    for (const neighbor of curr.neighbors) copy.neighbors.push(dfs(neighbor));
    return copy;
  };
  return dfs(node);
}`,
      },
    },
  ],
});
