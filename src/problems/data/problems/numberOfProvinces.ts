import { defineAlgoProblem } from "../problem";

export const numberOfProvinces = defineAlgoProblem<[number[][]], number>({
  id: "number-of-provinces",
  number: 106,
  title: "Number of Provinces",
  difficulty: "medium",
  tags: ["graph", "union-find", "depth-first-search", "breadth-first-search", "matrix"],
  functionName: "findCircleNum",
  prompt: `You are given an \`n x n\` **adjacency matrix** \`isConnected\` describing direct connections between \`n\` cities. \`isConnected[i][j] === 1\` means city \`i\` and city \`j\` are directly connected, and \`isConnected[i][j] === 0\` means they are not.

A **province** is a group of cities that are connected either directly or indirectly (through other cities), where no city outside the group is connected to any city inside it — in graph terms, a connected component.

Return the total number of provinces.

The matrix is symmetric (\`isConnected[i][j] === isConnected[j][i]\`) and every city is connected to itself (\`isConnected[i][i] === 1\`).`,
  constraints: [
    "1 <= n <= 200",
    "n === isConnected.length === isConnected[i].length",
    "isConnected[i][j] is 0 or 1",
    "isConnected[i][i] === 1",
    "isConnected[i][j] === isConnected[j][i]",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} isConnected
 * @return {number}
 */
function findCircleNum(isConnected) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} isConnected
 * @return {number}
 */
function findCircleNum(isConnected: number[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "two provinces",
      args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]],
      expected: 2,
      explanation: "Cities 0 and 1 are directly connected, forming one province. City 2 is isolated, forming a second.",
    },
    {
      name: "all isolated",
      args: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]],
      expected: 3,
      explanation: "No city is connected to any other, so each of the 3 cities is its own province.",
    },
    {
      name: "indirect connection",
      args: [[[1, 1, 0], [1, 1, 1], [0, 1, 1]]],
      expected: 1,
      explanation: "0–1 and 1–2 are directly connected, so 0 and 2 are connected indirectly through 1 — one province.",
    },
  ],
  hiddenTests: [
    // Boundary: single city.
    { args: [[[1]]], expected: 1 },
    // Boundary: two cities connected.
    { args: [[[1, 1], [1, 1]]], expected: 1 },
    // Boundary: two cities not connected.
    { args: [[[1, 0], [0, 1]]], expected: 2 },
    // All cities fully connected — one province.
    { args: [[[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]], expected: 1 },
    // All cities isolated — n provinces.
    { args: [[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]], expected: 4 },
    // Two separate clusters of size 2.
    { args: [[[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]]], expected: 2 },
    // Chain 0-1-2-3-4 — connected through intermediaries.
    { args: [[[1, 1, 0, 0, 0], [1, 1, 1, 0, 0], [0, 1, 1, 1, 0], [0, 0, 1, 1, 1], [0, 0, 0, 1, 1]]], expected: 1 },
    // Two clusters plus a lone city: {0,1,2}, {3,4}, {5}.
    {
      args: [[
        [1, 1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 1],
      ]],
      expected: 3,
    },
    // Connection only between the first and last city (non-adjacent indices).
    {
      args: [[
        [1, 0, 0, 0, 1],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
      ]],
      expected: 4,
    },
    // Star: city 0 connected to all others, who are otherwise isolated — one province.
    {
      args: [[
        [1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
      ]],
      expected: 1,
    },
    // Anti-hardcode: irregular 6-city graph forming components {0,2,4} and {1,3,5}.
    {
      args: [[
        [1, 0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1],
        [0, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 1],
      ]],
      expected: 2,
    },
    // Scale: 200 fully-connected cities — one province.
    {
      args: [Array.from({ length: 200 }, () => Array.from({ length: 200 }, () => 1))],
      expected: 1,
    },
    // Scale: 200 fully-isolated cities — 200 provinces.
    {
      args: [
        Array.from({ length: 200 }, (_unused, i) =>
          Array.from({ length: 200 }, (_inner, j) => (i === j ? 1 : 0)),
        ),
      ],
      expected: 200,
    },
    // Scale: 200 cities in 50 clusters of 4 contiguous indices — 50 provinces.
    {
      args: [
        Array.from({ length: 200 }, (_unused, i) =>
          Array.from({ length: 200 }, (_inner, j) =>
            Math.floor(i / 4) === Math.floor(j / 4) ? 1 : 0,
          ),
        ),
      ],
      expected: 50,
    },
  ],
  source: { origin: "authored", confidence: 0.95 },
  solutions: [
    {
      name: "DFS over the adjacency matrix",
      explanation: `Treat the matrix as a graph and count connected components. Keep a \`visited\` set; for each unvisited city, start a depth-first search that follows every \`isConnected[city][next] === 1\` edge, marking each reached city visited. Each DFS launch is one new province.

\`O(n²)\` time (every matrix cell is inspected once) and \`O(n)\` space for the visited array and recursion stack.`,
      code: {
        javascript: `function findCircleNum(isConnected) {
  const n = isConnected.length;
  const visited = new Array(n).fill(false);

  const dfs = (city) => {
    visited[city] = true;
    for (let next = 0; next < n; next++) {
      if (isConnected[city][next] === 1 && !visited[next]) dfs(next);
    }
  };

  let provinces = 0;
  for (let city = 0; city < n; city++) {
    if (!visited[city]) {
      provinces++;
      dfs(city);
    }
  }
  return provinces;
}`,
        typescript: `function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length;
  const visited = new Array<boolean>(n).fill(false);

  const dfs = (city: number): void => {
    visited[city] = true;
    for (let next = 0; next < n; next++) {
      if (isConnected[city][next] === 1 && !visited[next]) dfs(next);
    }
  };

  let provinces = 0;
  for (let city = 0; city < n; city++) {
    if (!visited[city]) {
      provinces++;
      dfs(city);
    }
  }
  return provinces;
}`,
      },
    },
    {
      name: "Union-Find (disjoint set)",
      explanation: `Start with \`n\` singleton sets and union the endpoints of every edge \`isConnected[i][j] === 1\` (\`j > i\` suffices by symmetry). The number of provinces is the number of roots left — count the indices that are their own parent.

Path compression plus union by rank makes each operation near-constant (inverse Ackermann), so it's effectively \`O(n²)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function findCircleNum(isConnected) {
  const n = isConnected.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

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
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
  };

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) union(i, j);
    }
  }

  let provinces = 0;
  for (let i = 0; i < n; i++) {
    if (find(i) === i) provinces++;
  }
  return provinces;
}`,
        typescript: `function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length;
  const parent = Array.from({ length: n }, (_unused, i) => i);
  const rank = new Array<number>(n).fill(0);

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };

  const union = (a: number, b: number): void => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
  };

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) union(i, j);
    }
  }

  let provinces = 0;
  for (let i = 0; i < n; i++) {
    if (find(i) === i) provinces++;
  }
  return provinces;
}`,
      },
    },
  ],
});
