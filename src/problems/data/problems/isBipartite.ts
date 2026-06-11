import { defineAlgoProblem } from "../problem";

export const isBipartite = defineAlgoProblem<[number[][]], boolean>({
  id: "is-graph-bipartite",
  number: 147,
  title: "Is Graph Bipartite?",
  difficulty: "medium",
  tags: ["depth-first-search", "breadth-first-search", "union-find", "graph"],
  functionName: "isBipartite",
  prompt: `You are given an undirected graph on \`n\` nodes labelled \`0\` to \`n - 1\`, as an adjacency list \`graph\`: \`graph[u]\` is the array of nodes directly connected to node \`u\`. The graph may be disconnected.

A graph is **bipartite** if its nodes can be split into two groups *A* and *B* such that **every edge joins a node in A to a node in B** — no edge lies within a single group. Equivalently, the graph can be 2-coloured with no two adjacent nodes sharing a colour.

Return \`true\` if the graph is bipartite, otherwise \`false\`.`,
  constraints: [
    "graph.length == n",
    "1 <= n <= 100",
    "0 <= graph[u].length < n",
    "0 <= graph[u][i] <= n - 1",
    "graph[u] does not contain u (no self-loops) and contains no duplicates.",
    "The graph is undirected: if v is in graph[u], then u is in graph[v].",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} graph
 * @return {boolean}
 */
function isBipartite(graph) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} graph
 * @return {boolean}
 */
function isBipartite(graph: number[][]): boolean {
  // your code here
}`,
  },
  examples: [
    {
      name: "odd cycle — not bipartite",
      args: [[[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]],
      expected: false,
      explanation: "Nodes 0,1,2 form a triangle (an odd cycle), which can never be 2-coloured.",
    },
    {
      name: "even cycle — bipartite",
      args: [[[1, 3], [0, 2], [1, 3], [0, 2]]],
      expected: true,
      explanation: "A 4-cycle splits into {0,2} and {1,3}; every edge crosses between the groups.",
    },
    {
      name: "no edges",
      args: [[[], [], []]],
      expected: true,
      explanation: "With no edges there is nothing to violate the split — trivially bipartite.",
    },
  ],
  hiddenTests: [
    // Single node, no edges.
    { args: [[[]]], expected: true },
    // Two nodes joined by one edge — always 2-colourable.
    { args: [[[1], [0]]], expected: true },
    // A triangle — the smallest odd cycle.
    { args: [[[1, 2], [0, 2], [0, 1]]], expected: false },
    // A 5-cycle — odd, not bipartite.
    { args: [[[1, 4], [0, 2], [1, 3], [2, 4], [3, 0]]], expected: false },
    // A 6-cycle — even, bipartite.
    { args: [[[1, 5], [0, 2], [1, 3], [2, 4], [3, 5], [4, 0]]], expected: true },
    // Disconnected: an even component and an odd component — the odd one fails it.
    { args: [[[1], [0], [3, 4], [2, 4], [2, 3]]], expected: false },
    // Disconnected: two bipartite components.
    { args: [[[1], [0], [3], [2]]], expected: true },
    // A complete bipartite graph K(2,3) — bipartite by construction.
    {
      args: [[
        [2, 3, 4],
        [2, 3, 4],
        [0, 1],
        [0, 1],
        [0, 1],
      ]],
      expected: true,
    },
    // A star with a chord making an odd cycle.
    { args: [[[1, 2, 3], [0, 2], [0, 1], [0]]], expected: false },
    // A long even path — bipartite.
    { args: [[[1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6]]], expected: true },
    // Scale: a 100-cycle (even) — bipartite.
    {
      args: [Array.from({ length: 100 }, (_unused, i) => {
        const prev = (i - 1 + 100) % 100;
        const next = (i + 1) % 100;
        return [prev, next].sort((a, b) => a - b);
      })],
      expected: true,
    },
    // Scale: a 99-cycle (odd) — not bipartite.
    {
      args: [Array.from({ length: 99 }, (_unused, i) => {
        const prev = (i - 1 + 99) % 99;
        const next = (i + 1) % 99;
        return [prev, next].sort((a, b) => a - b);
      })],
      expected: false,
    },
  ],
  source: { origin: "leetcode", frontendId: "785", acRate: 0.5614, confidence: 0.93 },
  solutions: [
    {
      name: "2-colouring via BFS",
      explanation: `Try to 2-colour the graph. Keep a \`color\` array (\`0\` = uncoloured, \`1\` and \`-1\` the two groups). Because the graph may be disconnected, start a fresh colouring from every still-uncoloured node.

From a start node, run a BFS: colour the start, then for each neighbour, if it is uncoloured give it the **opposite** colour and enqueue it; if it is already coloured the *same* as the current node, an edge lies inside a group — the graph is not bipartite, return \`false\`. If every component colours cleanly, return \`true\`.

\`O(V + E)\` time — each node and edge is examined once — and \`O(V)\` space for the colour array and queue.`,
      code: {
        javascript: `function isBipartite(graph) {
  const n = graph.length;
  const color = new Array(n).fill(0);   // 0 = uncoloured; 1 / -1 are the two groups

  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;   // already handled in an earlier component
    color[start] = 1;
    const queue = [start];
    while (queue.length > 0) {
      const u = queue.shift();
      for (const v of graph[u]) {
        if (color[v] === 0) {
          color[v] = -color[u];         // neighbours must take the opposite group
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;                 // an edge inside one group — not bipartite
        }
      }
    }
  }
  return true;
}`,
        typescript: `function isBipartite(graph: number[][]): boolean {
  const n = graph.length;
  const color = new Array<number>(n).fill(0);   // 0 = uncoloured; 1 / -1 are the two groups

  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;   // already handled in an earlier component
    color[start] = 1;
    const queue: number[] = [start];
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of graph[u]) {
        if (color[v] === 0) {
          color[v] = -color[u];         // neighbours must take the opposite group
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;                 // an edge inside one group — not bipartite
        }
      }
    }
  }
  return true;
}`,
      },
    },
  ],
});
