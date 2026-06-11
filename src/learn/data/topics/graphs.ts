import type { LearnTopic } from "@/learn/data/topic";

export const graphs = {
  slug: "graphs",
  title: "Graphs",
  category: "data-structures",
  summary: "Vertices joined by edges — model relationships, then traverse with BFS, DFS, or a shortest-path engine.",
  tags: ["graph", "breadth-first-search", "depth-first-search", "union-find"],
  priority: "high",
  estimatedMinutes: 90,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A **graph** is a set of *vertices* (nodes) joined by *edges*. Edges may be **directed** (a one-way " +
          "`a → b`) or **undirected** (a two-way `a — b`), and **weighted** (each edge carries a cost) or " +
          "unweighted. Almost every relationship problem is a graph in disguise: a road map, a dependency list, " +
          "a social network, a state machine, even a 2-D grid (each cell a vertex, each orthogonal step an edge).\n\n" +
          "Two representations dominate. An **adjacency list** stores, per vertex, the list of its neighbours — " +
          "**O(V + E)** space, the right choice for the *sparse* graphs interviews almost always use. An **adjacency " +
          "matrix** is a `V × V` grid where `m[i][j]` marks an edge — **O(V²)** space but **O(1)** edge lookup, " +
          "worth it only for dense graphs. The grid problems in this chapter are *implicit* graphs: you never build " +
          "an adjacency list at all, you just compute a cell's four neighbours on the fly.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "build adjacency list", average: "O(V + E)", worst: "O(V + E)", note: "One pass over the edges; space is O(V + E) too." },
          { operation: "BFS / DFS traversal", average: "O(V + E)", worst: "O(V + E)", note: "Every vertex and every edge is visited once, given a visited set." },
          { operation: "shortest path (unweighted)", average: "O(V + E)", worst: "O(V + E)", note: "BFS: the first time a vertex is dequeued is along a shortest path." },
          { operation: "shortest path (non-negative weights)", average: "O(n log n)", worst: "O(n log n)", note: "Dijkstra with a binary heap is O(E log V); relax each edge, settle each vertex once." },
          { operation: "topological sort / cycle check", average: "O(V + E)", worst: "O(V + E)", note: "Kahn's in-degree BFS or DFS with a recursion-stack colour." },
          { operation: "connected components / union", average: "O(1)", worst: "O(1)", note: "Union-Find with path compression + union by rank is ≈ O(α(V)) per op — inverse Ackermann, effectively constant." },
          { operation: "minimum spanning tree", average: "O(n log n)", worst: "O(n log n)", note: "Prim's (heap) or Kruskal's (sort + union-find) over the edges is O(E log V)." },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a graph the moment a problem is about **entities and the connections between them**, even when " +
          "the word \"graph\" never appears. Tell-tales: *\"connected\"*, *\"reachable\"*, *\"shortest path / fewest " +
          "steps\"*, *\"depends on / must come before\"*, *\"groups / regions / provinces / islands\"*, *\"cycle\"*, " +
          "*\"network\"*. A 2-D grid where you move between adjacent cells is the most common disguise.\n\n" +
          "Once you've spotted the graph, the *question* picks the tool. **Fewest steps in an unweighted graph** → " +
          "BFS. **Just need to visit / fill a region, or detect a cycle** → DFS. **Shortest path with edge costs** → " +
          "Dijkstra. **\"Can this ordering be done / is there a cycle\" over dependencies** → topological sort. " +
          "**How many separate groups, or are two things in the same group** → Union-Find. **Cheapest way to connect " +
          "everything** → a minimum spanning tree.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**BFS (breadth-first search)** — a queue explores the graph in rings of equal distance from the source. " +
          "Because it reaches every vertex by a *shortest* number of edges first, BFS is the go-to for **shortest " +
          "path in an unweighted graph** (*word ladder*, *fewest moves*) and for **multi-source spread**, where you " +
          "seed the queue with *all* sources at once and each ring is one time step (*rotting oranges*).\n\n" +
          "**DFS (depth-first search)** — recursion (or an explicit stack) plunges down one path before backtracking. " +
          "It's the natural fit for **flood-fill / region** problems (*number of islands*), **connectivity**, and " +
          "**cycle detection** in a directed graph (a back-edge to a node still on the recursion stack). Pair it with " +
          "**memoisation** when subpaths are reused — a [DP](/study-guide/algos/topic/dynamic-programming) over a DAG " +
          "(*longest increasing path*).\n\n" +
          "**Topological sort** — orders a directed acyclic graph so every edge points forward. **Kahn's algorithm** " +
          "repeatedly removes a node with in-degree 0; if fewer than `V` nodes come out, a cycle blocked it — which " +
          "is exactly how *course schedule* answers \"can all the courses be finished?\".\n\n" +
          "**Dijkstra** — a min-priority-queue Greedy that settles the nearest unsettled vertex and relaxes its edges. " +
          "It finds **shortest paths with non-negative weights** (*network delay time*). With negative edges you'd " +
          "need Bellman–Ford instead.\n\n" +
          "**Union-Find (disjoint set)** — tracks which vertices share a component under a stream of `union` " +
          "operations, with near-constant `find`. It answers **\"how many groups?\"** (*number of provinces*) and " +
          "powers **Kruskal's MST**. **Prim's** is the heap-based MST alternative that grows one tree outward " +
          "(*min cost to connect all points*).",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "A [tree](/study-guide/algos/topic/trees) is just a connected, acyclic graph with `V − 1` edges, so every " +
          "tree traversal is a graph traversal that needs no visited set (there are no cycles to revisit). A " +
          "[trie](/study-guide/algos/topic/tries) is a tree whose edges are labelled by characters. The grid " +
          "problems here lean on the same [matrix](/study-guide/algos/topic/matrix) scanning habits, and the " +
          "shortest-path and MST variants are really [greedy](/study-guide/algos/topic/greedy) algorithms — Dijkstra, " +
          "Prim, and Kruskal all repeatedly commit to the locally cheapest safe choice. The BFS queue is a plain " +
          "[stack](/study-guide/algos/topic/stacks)'s FIFO cousin, and Dijkstra's frontier is a " +
          "[heap](/study-guide/algos/topic/heaps).",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The two workhorse traversals over an adjacency list — note the visited set that a tree wouldn't need.",
        source:
          "// adj: Map<node, node[]>  (or an array of arrays for integer-labelled nodes)\n\n" +
          "// BFS — explores in rings; the level counter is the shortest-path distance.\n" +
          "function bfs(adj, start) {\n" +
          "  const visited = new Set([start]);\n" +
          "  let queue = [start];\n" +
          "  let depth = 0;\n" +
          "  while (queue.length > 0) {\n" +
          "    const next = [];\n" +
          "    for (const node of queue) {\n" +
          "      for (const neighbor of adj.get(node) ?? []) {\n" +
          "        if (visited.has(neighbor)) continue;   // never revisit — this breaks cycles\n" +
          "        visited.add(neighbor);\n" +
          "        next.push(neighbor);\n" +
          "      }\n" +
          "    }\n" +
          "    queue = next;\n" +
          "    depth++;                                   // one full ring = one step farther out\n" +
          "  }\n" +
          "}\n\n" +
          "// DFS — plunges deep first; great for regions, connectivity, and cycle checks.\n" +
          "function dfs(adj, start, visited = new Set()) {\n" +
          "  visited.add(start);\n" +
          "  for (const neighbor of adj.get(start) ?? []) {\n" +
          "    if (!visited.has(neighbor)) dfs(adj, neighbor, visited);\n" +
          "  }\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Shortest path through a maze** — *the most common interview graph is a grid you never explicitly build.* " +
          "Each open cell is a vertex; stepping to an orthogonally adjacent open cell is an edge of weight 1. Because " +
          "every edge costs the same, **BFS** finds the fewest-step path: it expands outward ring by ring, so the " +
          "first time it touches the exit, it arrives by a shortest route.\n\n" +
          "Take the 4×4 grid below — `.` is open, `#` is a wall — starting at the top-left `(0,0)` and aiming for the " +
          "bottom-right `(3,3)`. Watch BFS flood outward; the number in each visited cell is the ring it was reached " +
          "on, i.e. its distance from the start:",
      },
      {
        kind: "gridWalkthrough",
        heading: "BFS over a maze grid — '#' is a wall; each frame floods one more ring outward from (0,0)",
        showIndices: true,
        grid: [
          [".", ".", "#", "."],
          ["#", ".", "#", "."],
          [".", ".", ".", "."],
          ["#", "#", ".", "."],
        ],
        frames: [
          {
            cursor: [0, 0],
            active: [[0, 0]],
            action: "enqueue start (0,0), dist 0",
            caption: "BFS begins with only the start cell in the queue, at distance 0.",
          },
          {
            cursor: [1, 1],
            active: [[0, 0], [0, 1], [1, 1]],
            action: "ring 1: (0,1) then (1,1)",
            caption: "From (0,0) the open neighbours are (0,1) and — through it next ring — the cells one step away. (1,0) is a wall, so it's skipped.",
          },
          {
            cursor: [2, 1],
            active: [[0, 0], [0, 1], [1, 1], [2, 1]],
            marked: [[1, 0]],
            action: "ring 2: (2,1); wall (1,0) skipped",
            caption: "Ring 2 reaches (2,1) below (1,1). Walls and already-visited cells are never enqueued, which is what stops a cycle.",
          },
          {
            cursor: [2, 3],
            active: [[2, 0], [2, 1], [2, 2], [2, 3]],
            action: "ring 3–4: sweep row 2 to (2,2),(2,3)",
            caption: "The frontier fans across the open row 2, reaching (2,2) and (2,3). Each cell keeps the distance of the ring that first found it.",
          },
          {
            cursor: [3, 3],
            active: [[2, 3], [3, 3]],
            action: "reach exit (3,3) → distance 6",
            caption: "Stepping down from (2,3) lands on the exit (3,3). Because BFS arrives in increasing ring order, this first arrival is along a shortest path — 6 steps from the start.",
          },
          {
            cursor: [3, 0],
            marked: [[3, 0], [3, 1]],
            action: "(3,0),(3,1) walls → unreachable",
            caption: "The bottom-left walls are never reached; if the exit had been fenced like this, BFS would drain the queue without arriving and report it unreachable.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Grid BFS — the implicit-graph shape: neighbours are computed, not stored. O(m·n) time and space.",
        source:
          "function shortestPath(grid) {\n" +
          "  const rows = grid.length, cols = grid[0].length;\n" +
          "  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));\n" +
          "  let queue = [[0, 0]];\n" +
          "  seen[0][0] = true;\n" +
          "  let dist = 0;\n" +
          "  while (queue.length > 0) {\n" +
          "    const next = [];\n" +
          "    for (const [r, c] of queue) {\n" +
          "      if (r === rows - 1 && c === cols - 1) return dist;   // reached the exit\n" +
          "      // The four orthogonal neighbours — the implicit edges of a grid graph.\n" +
          "      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {\n" +
          "        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;\n" +
          "        if (grid[nr][nc] === '#' || seen[nr][nc]) continue; // wall or already visited\n" +
          "        seen[nr][nc] = true;\n" +
          "        next.push([nr, nc]);\n" +
          "      }\n" +
          "    }\n" +
          "    queue = next;\n" +
          "    dist++;                                                // advanced one ring\n" +
          "  }\n" +
          "  return -1;                                              // exit never reached\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Each cell enters the queue at most once, so the scan is **O(m·n)** time and **O(m·n)** space — the same " +
          "**O(V + E)** bound every BFS carries, since a grid has `V = m·n` cells and `E` ≈ `4V` edges. Swap the " +
          "FIFO queue for a recursion stack and the same skeleton becomes the flood-fill DFS behind *number of " +
          "islands*; the only structural change is queue-vs-stack.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Forgetting the visited set.** A graph has cycles a tree doesn't — without marking nodes visited, a traversal loops forever. Mark a node visited *when you enqueue / first reach it*, not when you dequeue it, or the same node gets queued many times.",
          "**Using DFS for a shortest *unweighted* path.** DFS finds *a* path, not the shortest one — that's BFS's job. Reaching for DFS here is the classic wrong tool.",
          "**Using BFS/DFS for a shortest *weighted* path.** Once edges carry different costs, the fewest-edges path isn't the cheapest. You need Dijkstra (non-negative weights) or Bellman–Ford (negative allowed).",
          "**Counting diagonals on a grid by accident.** \"4-directionally adjacent\" means up/down/left/right only. Adding the diagonal neighbours silently merges regions that should be separate.",
          "**Directed vs. undirected confusion.** In an undirected graph add *both* `a→b` and `b→a` to the adjacency list. In course-schedule, the edge direction *is* the prerequisite order — reverse it and the answer flips.",
          "**Settling a Dijkstra node twice.** A node can sit in the heap under several stale distances; skip it if it's already been settled (its popped distance exceeds its recorded best), or you redo work and can corrupt counts.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "An empty graph (no nodes) or a single isolated node — traversals must return a sensible base answer, not crash.",
          "A **disconnected** graph — to cover every node you must restart the traversal from each unvisited node (counting components, 2-colouring across components).",
          "A self-loop (`a → a`) or a multi-edge — a self-loop is a length-1 cycle that cycle-detection must catch.",
          "The target is unreachable — shortest-path and spread problems need an explicit \"never arrived\" sentinel (`-1`, `0`, or `Infinity`).",
          "Zero-weight edges in a weighted graph — Dijkstra still works (weights are non-negative), but a plain visited-on-dequeue BFS would mis-order them.",
          "A grid that is entirely passable (one giant region) — a recursive flood fill can overflow the call stack; prefer an explicit stack or a queue at scale.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["number-of-islands", "course-schedule"],
        recommended: [
          "clone-graph",
          "rotting-oranges",
          "is-graph-bipartite",
          "longest-increasing-path-in-a-matrix",
          "word-ladder",
          "number-of-provinces",
          "network-delay-time",
          "min-cost-to-connect-all-points",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Graphs practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Graph cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/graph/", type: "article" },
          { label: "Wikipedia — Dijkstra's algorithm", url: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm", type: "article" },
          { label: "Wikipedia — Topological sorting", url: "https://en.wikipedia.org/wiki/Topological_sorting", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
