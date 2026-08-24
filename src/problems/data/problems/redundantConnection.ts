import { defineAlgoProblem } from "../problem";

export const redundantConnection = defineAlgoProblem<[number[][]], number[]>({
  id: "redundant-connection",
  number: 170,
  title: "Redundant Connection",
  difficulty: "medium",
  tags: ["union-find", "graph"],
  functionName: "findRedundantConnection",
  prompt: `A tree is an undirected, connected graph with \`n\` nodes and exactly \`n - 1\` edges and no cycles. You are given a graph on \`n\` nodes, labelled \`1\` to \`n\`, that started as a tree and had **one extra edge added**, given as \`edges\`, a list of \`n\` \`[u, v]\` pairs (so the graph has \`n\` edges and exactly one cycle).

Return the edge that can be removed so that the remaining \`n - 1\` edges form a tree again. If more than one edge could be removed, return the one that occurs **last** in \`edges\`.`,
  constraints: [
    "n == edges.length",
    "3 <= n <= 1000",
    "edges[i].length == 2",
    "1 <= u, v <= n",
    "u != v",
    "There are no repeated edges.",
    "The given graph is connected and contains exactly one cycle.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} edges
 * @return {number[]}
 */
function findRedundantConnection(edges) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} edges
 * @return {number[]}
 */
function findRedundantConnection(edges: number[][]): number[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "triangle",
      args: [[[1, 2], [1, 3], [2, 3]]],
      expected: [2, 3],
      explanation: "1-2 and 1-3 form a tree; 2-3 closes the cycle and is the last edge that does so.",
    },
    {
      name: "cycle plus a branch",
      args: [[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]],
      expected: [1, 4],
      explanation: "1-2-3-4 plus 1-4 closes a cycle; 1-5 is a harmless branch off the tree.",
    },
    {
      name: "cycle formed early",
      args: [[[1, 2], [2, 3], [1, 3], [3, 4], [4, 5]]],
      expected: [1, 3],
      explanation: "1-2 and 2-3 form a tree; 1-3 closes the cycle. The remaining edges just extend the branch.",
    },
  ],
  hiddenTests: [
    // Boundary: the smallest possible input, n = 3.
    { args: [[[1, 2], [2, 3], [1, 3]]], expected: [1, 3] },
    // Edge: redundant edge connects the two "ends" of a long chain.
    { args: [[[1, 2], [2, 3], [3, 4], [4, 5], [1, 5]]], expected: [1, 5] },
    // Edge: redundant edge appears in the middle of the input, not at either end.
    { args: [[[1, 2], [2, 3], [1, 3], [3, 4], [4, 5], [5, 6]]], expected: [1, 3] },
    // Structural: a star graph with the redundant edge connecting two leaves.
    { args: [[[1, 2], [1, 3], [1, 4], [1, 5], [2, 3]]], expected: [2, 3] },
    // Structural: two edges could each close a different-looking cycle path, but only one is a duplicate connection in input order.
    { args: [[[1, 2], [2, 3], [3, 1], [1, 4], [4, 5]]], expected: [3, 1] },
    // Structural: redundant edge is the very first edge to repeat a connection already reachable.
    { args: [[[1, 2], [2, 3], [3, 4], [4, 1]]], expected: [4, 1] },
    // Anti-hardcode: a wider tree (multiple branches) with the cycle far from the root.
    {
      args: [[[1, 2], [1, 3], [3, 4], [3, 5], [5, 6], [6, 4], [1, 7]]],
      expected: [6, 4],
    },
    // Anti-hardcode: labels not in ascending pair order and a deeper tree.
    {
      args: [[[1, 2], [2, 3], [2, 4], [4, 5], [5, 6], [6, 3]]],
      expected: [6, 3],
    },
    // Anti-hardcode: a bushy tree where the redundant edge connects two distant subtrees.
    {
      args: [[[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7], [4, 8], [7, 8]]],
      expected: [7, 8],
    },
    // Scale: a long chain of 1000 nodes with the redundant edge closing the whole thing into a cycle.
    {
      args: [[
        ...Array.from({ length: 999 }, (_unused, i) => [i + 1, i + 2]),
        [1, 1000],
      ]],
      expected: [1, 1000],
    },
    // Scale: a star of 999 leaves around node 1, with the redundant edge connecting two leaves.
    {
      args: [[
        ...Array.from({ length: 998 }, (_unused, i) => [1, i + 2]),
        [999, 1000],
        [2, 1000],
      ]],
      expected: [2, 1000],
    },
    // Scale: a binary-tree-shaped graph of 999 nodes with the redundant edge joining two siblings.
    {
      args: [[
        ...Array.from({ length: 998 }, (_unused, i) => [Math.floor(i / 2) + 1, i + 2]),
        [2, 3],
      ]],
      expected: [2, 3],
    },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "Union-Find (disjoint set)",
      explanation: `Start with each of the \`n\` nodes in its own singleton set and process \`edges\` in order. For each \`[u, v]\`, if \`u\` and \`v\` are already in the same set, this edge connects two nodes already reachable from each other — it's the one closing the cycle, so return it immediately. Otherwise union their sets and continue.

Because the graph has exactly one cycle, exactly one edge triggers this, and scanning in input order guarantees it's the last such edge (there's only one). Path compression plus union by rank makes each operation near-constant, so this runs in effectively \`O(n)\` time and \`O(n)\` space.`,
      code: {
        javascript: `function findRedundantConnection(edges) {
  const n = edges.length;
  const parent = Array.from({ length: n + 1 }, (_, i) => i);
  const rank = new Array(n + 1).fill(0);

  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };

  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  };

  for (const [u, v] of edges) {
    if (!union(u, v)) return [u, v];
  }
  return [];
}`,
        typescript: `function findRedundantConnection(edges: number[][]): number[] {
  const n = edges.length;
  const parent = Array.from({ length: n + 1 }, (_unused, i) => i);
  const rank = new Array<number>(n + 1).fill(0);

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };

  const union = (a: number, b: number): boolean => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  };

  for (const [u, v] of edges) {
    if (!union(u, v)) return [u, v];
  }
  return [];
}`,
      },
    },
  ],
});
