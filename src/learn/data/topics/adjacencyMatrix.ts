import type { LearnTopic } from "@/learn/data/topic";

export const adjacencyMatrix = {
  slug: "adjacency-matrix",
  title: "Adjacency matrices",
  category: "data-structures",
  summary: "Representing a graph as a grid — what the cells mean, and the O(V²) space tradeoff vs a list.",
  tags: ["matrix", "breadth-first-search"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "An adjacency matrix represents a graph of V vertices as a V×V grid where `cell[i][j]` records the " +
          "edge from vertex `i` to vertex `j` (1 = edge, 0 = none). Below is the same small graph drawn both " +
          "ways:",
      },
      {
        kind: "row",
        blocks: [
          {
            kind: "graph",
            heading: "The graph",
            caption: "Four vertices, three undirected edges. B is the hub with degree 3.",
            nodes: ["A", "B", "C", "D"],
            edges: [
              ["A", "B"],
              ["B", "C"],
              ["B", "D"],
            ],
          },
          {
            kind: "matrix",
            heading: "…as a matrix",
            caption: "Symmetric across the diagonal because edges are undirected; the diagonal is 0 (no self-loops).",
            rowLabels: ["A", "B", "C", "D"],
            colLabels: ["A", "B", "C", "D"],
            cells: [
              [0, 1, 0, 0],
              [1, 0, 1, 1],
              [0, 1, 0, 0],
              [0, 1, 0, 0],
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "Reading row B: it has 1s in columns A, C, and D — B's three neighbours. The symmetry (`cell[i][j] === " +
          "cell[j][i]`) is the visual tell of an undirected graph; a directed graph's matrix need not be symmetric.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "has edge (i, j)", average: "O(1)", worst: "O(1)" },
          { operation: "iterate a vertex's neighbours", average: "O(V²)", worst: "O(V²)", note: "scans a full row; a list is O(degree)" },
          { operation: "space", average: "O(V²)", worst: "O(V²)", note: "a list is O(V + E)" },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Use a matrix when edge *lookups* dominate and the graph is dense (E approaches V²) — constant-time " +
          "`hasEdge(i, j)` and trivial code. Its weakness is space: the grid costs O(V²) whether the graph is " +
          "dense or sparse, so a sparse graph wastes most of the cells on 0s.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Matrix vs adjacency list",
        body:
          "An adjacency *list* stores, per vertex, only its actual neighbours — O(V + E) space and O(degree) to " +
          "walk them, which wins for sparse graphs (most real ones). The tradeoff flips for `hasEdge`: O(1) in a " +
          "matrix, O(degree) in a list. Pick the matrix for dense graphs and hot edge queries, the list otherwise.",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Number of Provinces** — *given an n×n matrix `isConnected` where `isConnected[i][j] === 1` means " +
          "cities i and j are directly connected, return how many provinces there are* (a province is a group of " +
          "directly or indirectly connected cities). The input *is* the adjacency matrix from above — so the job " +
          "is just to count connected components by walking it as a graph.",
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "DFS where row `city` is read as that vertex's adjacency list — scan it for connected neighbours.",
        source:
          "function findCircleNum(isConnected) {\n" +
          "  const n = isConnected.length;\n" +
          "  const seen = new Set();\n" +
          "\n" +
          "  const visit = (city) => {\n" +
          "    seen.add(city);\n" +
          "    // Row `city` is its adjacency list: scan every column for a connected,\n" +
          "    // not-yet-visited neighbour and recurse into it.\n" +
          "    for (let next = 0; next < n; next++) {\n" +
          "      if (isConnected[city][next] === 1 && !seen.has(next)) visit(next);\n" +
          "    }\n" +
          "  };\n" +
          "\n" +
          "  let provinces = 0;\n" +
          "  for (let city = 0; city < n; city++) {\n" +
          "    if (!seen.has(city)) {\n" +
          "      provinces++; // an unvisited city begins a new province\n" +
          "      visit(city); // DFS flood-fills everything reachable from it\n" +
          "    }\n" +
          "  }\n" +
          "  return provinces;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Each `visit` scans a full row — O(n) — and we visit every city once, so the traversal is O(n²). That's " +
          "exactly the neighbour-iteration cost from the Operations table: the matrix makes us check every " +
          "*possible* neighbour, edge or not, where an adjacency list would touch only the real ones.",
      },
      {
        kind: "exampleProblem",
        problemId: "number-of-provinces",
        note: "Now try it yourself.",
      },
    ],
  },
} satisfies LearnTopic;
