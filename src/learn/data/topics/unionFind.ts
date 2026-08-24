import type { LearnTopic } from "@/learn/data/topic";

export const unionFind = {
  slug: "union-find",
  title: "Union-Find",
  category: "algorithms",
  summary: "Disjoint Set Union — near-O(1) 'are these connected?' and 'merge these groups'.",
  tags: ["union-find", "graph"],
  parent: "graphs",
  priority: "mid",
  estimatedMinutes: 60,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Union-Find (Disjoint Set Union) tracks a partition of elements into disjoint sets with two operations: " +
          "`find(x)` returns a representative for x's set, and `union(x, y)` merges two sets. With *path " +
          "compression* and *union by rank/size*, both run in near-constant amortized time (inverse Ackermann). " +
          "See [[graphs]] for how it compares to BFS/DFS as a connectivity tool — this page covers the structure " +
          "itself, its two optimizations, and a full worked example.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for it on dynamic connectivity — counting connected components, detecting a cycle in an " +
          "undirected graph, and Kruskal's minimum spanning tree. It shines when edges arrive incrementally and " +
          "you keep asking 'are these two already linked?'.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Path compression** — every time `find(x)` walks up to the root, re-point every node it passed " +
          "*directly* at that root. Future `find` calls on those nodes become O(1). Without it, a chain of unions " +
          "can degrade `find` to O(n).\n\n" +
          "**Union by rank / size** — when merging two sets, attach the *smaller* tree under the *larger* tree's " +
          "root (tracked by a size or rank array), instead of picking arbitrarily. This keeps trees shallow on its " +
          "own, even without path compression. The two optimizations together are what give the near-constant " +
          "*inverse Ackermann* bound — either alone is only logarithmic.\n\n" +
          "**Component counting** — keep a running counter, decremented once per *successful* union (a union that " +
          "actually merges two different roots). A union between elements already in the same set must be a no-op " +
          "that leaves the counter untouched.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "Union-Find answers the same 'are these connected?' question [[breadth-first-search|BFS]] and " +
          "[[depth-first-search|DFS]] do, but incrementally and near-O(1) per query instead of O(V+E) per full " +
          "traversal — the trade is that it can't recover *which path* connects two elements, only *whether* one " +
          "exists. See [[graphs]] for where it fits (Kruskal's MST, cycle detection) alongside the rest of the toolkit.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "Disjoint Set Union with both optimizations — find compresses paths, union attaches by size.",
        source:
          "class UnionFind {\n" +
          "  constructor(n) {\n" +
          "    this.parent = Array.from({ length: n }, (_, i) => i);  // everyone starts as their own root\n" +
          "    this.size = new Array(n).fill(1);\n" +
          "    this.count = n;                                       // number of disjoint sets\n" +
          "  }\n\n" +
          "  find(x) {\n" +
          "    if (this.parent[x] !== x) {\n" +
          "      this.parent[x] = this.find(this.parent[x]);          // path compression: point straight at the root\n" +
          "    }\n" +
          "    return this.parent[x];\n" +
          "  }\n\n" +
          "  union(a, b) {\n" +
          "    const rootA = this.find(a);\n" +
          "    const rootB = this.find(b);\n" +
          "    if (rootA === rootB) return false;                    // already connected — no-op\n" +
          "    const [small, big] = this.size[rootA] < this.size[rootB] ? [rootA, rootB] : [rootB, rootA];\n" +
          "    this.parent[small] = big;                             // attach the smaller tree under the larger\n" +
          "    this.size[big] += this.size[small];\n" +
          "    this.count--;\n" +
          "    return true;\n" +
          "  }\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Number of Provinces** — *given an `n × n` adjacency matrix of directly-connected cities, count the " +
          "number of provinces (groups of cities reachable from each other, directly or transitively).* Scan the " +
          "upper triangle of the matrix once, unioning every directly-connected pair; the final component count " +
          "is the answer.",
      },
      {
        kind: "matrix",
        heading: "isConnected — city 0 and 1 are directly linked; city 2 is on its own",
        rowLabels: ["0", "1", "2"],
        colLabels: ["0", "1", "2"],
        cells: [
          [1, 1, 0],
          [1, 1, 0],
          [0, 0, 1],
        ],
      },
      {
        kind: "walkthrough",
        heading: "scanning the matrix's upper triangle, unioning every directly-connected pair",
        lane: ["0", "1", "2"],
        showIndices: true,
        frames: [
          {
            action: "start: parent = [0,1,2], provinces = 3",
            caption: "Every city begins as its own root — three separate provinces.",
          },
          {
            pointers: [{ name: "i", at: 0 }, { name: "j", at: 1 }],
            action: "isConnected[0][1] = 1 → union(0,1)",
            caption: "Cities 0 and 1 are directly connected. Merge their sets: provinces drops to 2.",
          },
          {
            pointers: [{ name: "i", at: 0 }, { name: "j", at: 2 }],
            action: "isConnected[0][2] = 0 → skip",
            caption: "0 and 2 aren't directly connected — no union.",
          },
          {
            pointers: [{ name: "i", at: 1 }, { name: "j", at: 2 }],
            action: "isConnected[1][2] = 0 → skip, scan done",
            caption: "1 and 2 aren't connected either. Two roots remain — {0,1} and {2} — so the answer is 2.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Union every directly-connected pair; the component count left standing is the answer.",
        source:
          "function findCircleNum(isConnected) {\n" +
          "  const n = isConnected.length;\n" +
          "  const uf = new UnionFind(n);\n" +
          "  for (let i = 0; i < n; i++) {\n" +
          "    for (let j = i + 1; j < n; j++) {                     // upper triangle only — matrix is symmetric\n" +
          "      if (isConnected[i][j] === 1) uf.union(i, j);\n" +
          "    }\n" +
          "  }\n" +
          "  return uf.count;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "The double loop over the matrix is **O(n²)**, dominating the near-O(1)-per-call union/find work — " +
          "compare this to a BFS/DFS solution, which would also be O(n²) here (the matrix itself is the input " +
          "size) but re-derive each component from scratch rather than updating incrementally.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Skip either path compression or union-by-size and you lose the near-constant bound — a naive union-find degrades to O(n) per `find` on an adversarial sequence of unions (a long chain).",
          "`find` must walk all the way to the true root, not just check the immediate parent — a node's `parent` pointer isn't always the root until path compression has run.",
          "If the elements aren't already dense integers `0..n-1` (account names, arbitrary strings), build an index map first — the array-backed `parent`/`size` structure needs that normalization.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "n = 0 or n = 1 — 0 or 1 component, no unions possible.",
          "No edges at all — every element stays its own root; count equals n.",
          "A union between two elements already in the same set (a redundant edge) — must be a no-op that doesn't double-decrement the counter.",
          "All elements eventually merge into a single set — `find` should still resolve in near-O(1) after path compression, not degrade as the tree grows.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["number-of-provinces", "redundant-connection"],
        recommended: ["min-cost-to-connect-all-points", "is-graph-bipartite"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Graphs practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Graph cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/graph/", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
