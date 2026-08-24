import type { LearnTopic } from "@/learn/data/topic";

export const breadthFirstSearch = {
  slug: "breadth-first-search",
  title: "Breadth-first search",
  category: "algorithms",
  summary: "Explore level by level with a queue — finds the shortest path in an unweighted graph.",
  tags: ["breadth-first-search", "graph"],
  parent: "graphs",
  priority: "high",
  estimatedMinutes: 60,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "BFS explores a graph level by level using a **queue**, visiting all of a node's neighbours before going " +
          "deeper. Because it reaches nodes in order of distance from the source, on an *unweighted* graph the " +
          "first time it sees a node is via a shortest (fewest-edge) path. See [[graphs]] for the representations " +
          "and the full traversal picture — this page is about the traversal itself and its variants.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for BFS for shortest-path-in-unweighted, level-order tree traversal, and 'minimum number of " +
          "steps' problems (including grids). Mark nodes visited *when you enqueue* them, not when you dequeue, " +
          "to avoid adding the same node twice.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Single-source BFS** — the standard form: seed the queue with one start node, expand ring by ring. " +
          "Answers 'shortest path from A to B'.\n\n" +
          "**Multi-source BFS** — seed the queue with *every* source at once before the first expansion. Each ring " +
          "is then one time-step for *all* sources simultaneously, which is exactly 'how long until every fresh " +
          "orange rots' or 'distance to the nearest of several targets' — running BFS from every source separately " +
          "and taking the min would be far slower.\n\n" +
          "**0-1 BFS** — when edges cost either 0 or 1 (not the uniform 1 plain BFS assumes), a plain queue breaks " +
          "the ring invariant. Use a **deque**: push 0-cost edges to the *front* (they don't advance the ring) and " +
          "1-cost edges to the *back*. This keeps the deque sorted by distance without needing a full priority queue.\n\n" +
          "**Bidirectional BFS** — expand outward from *both* the source and the target, alternating, and stop when " +
          "the two frontiers meet. For a branching factor `b` and answer depth `d`, this is `O(b^(d/2))` instead of " +
          "`O(b^d)` — a large win on wide graphs like *word ladder*.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "BFS's queue is the reason it finds shortest paths — FIFO order *is* increasing-distance order. See " +
          "[[queues]] for why an array's `shift` won't do (use a head index or two stacks for O(1) dequeue), and " +
          "[[graphs]] for how BFS compares to DFS, Dijkstra, and the rest of the graph-algorithm toolkit.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "Multi-source BFS: seed every source before the first ring, then expand together.",
        source:
          "// sources: an array of starting nodes, all at distance 0.\n" +
          "function multiSourceBFS(adj, sources) {\n" +
          "  const dist = new Map(sources.map((s) => [s, 0]));\n" +
          "  let queue = [...sources];             // every source starts the search together\n" +
          "  while (queue.length > 0) {\n" +
          "    const next = [];\n" +
          "    for (const node of queue) {\n" +
          "      for (const neighbor of adj.get(node) ?? []) {\n" +
          "        if (dist.has(neighbor)) continue;  // already reached — this ring or an earlier one\n" +
          "        dist.set(neighbor, dist.get(node) + 1);\n" +
          "        next.push(neighbor);\n" +
          "      }\n" +
          "    }\n" +
          "    queue = next;\n" +
          "  }\n" +
          "  return dist;\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Rotting Oranges** — *every minute, a rotten orange rots every fresh orange orthogonally adjacent to " +
          "it; find the minimum minutes until no fresh orange remains (or -1 if that's impossible).* This is " +
          "multi-source BFS in disguise: every already-rotten orange is a source at time 0, and 'one BFS ring' " +
          "*is* 'one minute'.",
      },
      {
        kind: "gridWalkthrough",
        heading: "grid: 2 = rotten, 1 = fresh, 0 = empty — both rotten oranges seed the queue at once",
        showIndices: true,
        grid: [
          [2, 1, 1],
          [1, 1, 0],
          [0, 1, 2],
        ],
        frames: [
          {
            cursor: [0, 0],
            active: [[0, 0], [2, 2]],
            action: "queue = [(0,0), (2,2)], minute 0",
            caption: "Both rotten oranges start the queue together — this is the multi-source seed, not two separate BFS runs.",
          },
          {
            cursor: [1, 1],
            active: [[0, 1], [1, 0], [1, 2], [1, 1], [2, 1]],
            marked: [[1, 2]],
            action: "minute 1: rot (0,1),(1,0),(2,1); (1,2) is empty — skipped",
            caption: "Every fresh orange adjacent to a minute-0 rotten orange turns rotten this ring. (1,2) is empty (0), not fresh, so it's never enqueued.",
          },
          {
            cursor: [1, 1],
            active: [[1, 1]],
            action: "minute 2: rot (1,1)",
            caption: "Only (1,1) was still fresh and adjacent to a newly-rotten orange — the last fresh orange rots this ring.",
          },
          {
            cursor: [1, 1],
            action: "queue empties, no fresh oranges remain → answer 2",
            caption: "The ring counter at the moment the queue drains with zero fresh oranges left is the answer: 2 minutes.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Multi-source BFS over the grid — O(rows·cols) time and space.",
        source:
          "function orangesRotting(grid) {\n" +
          "  const rows = grid.length, cols = grid[0].length;\n" +
          "  let queue = [];\n" +
          "  let fresh = 0;\n" +
          "  for (let r = 0; r < rows; r++) {\n" +
          "    for (let c = 0; c < cols; c++) {\n" +
          "      if (grid[r][c] === 2) queue.push([r, c]);  // every rotten orange seeds the queue\n" +
          "      if (grid[r][c] === 1) fresh++;\n" +
          "    }\n" +
          "  }\n" +
          "  let minutes = 0;\n" +
          "  while (queue.length > 0 && fresh > 0) {\n" +
          "    const next = [];\n" +
          "    for (const [r, c] of queue) {\n" +
          "      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {\n" +
          "        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] !== 1) continue;\n" +
          "        grid[nr][nc] = 2;\n" +
          "        fresh--;\n" +
          "        next.push([nr, nc]);\n" +
          "      }\n" +
          "    }\n" +
          "    queue = next;\n" +
          "    minutes++;                                   // one BFS ring = one minute, for every source at once\n" +
          "  }\n" +
          "  return fresh === 0 ? minutes : -1;              // fresh > 0 here means some orange was unreachable\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Each cell enters the queue at most once, so this is **O(rows·cols)** time and space — the multi-source " +
          "seed is the only difference from single-source BFS; the ring-by-ring expansion is identical.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Mark a node visited (or, on a grid, mutate it) *the moment it's enqueued*, not when it's dequeued — otherwise the same node can be pushed onto the queue multiple times by different neighbours in the same ring.",
          "Multi-source BFS is not 'run BFS from each source and take the min' — that's asymptotically much slower. Seed *all* sources into the queue before the first expansion so one ring serves every source at once.",
          "0-1 BFS with a plain FIFO queue silently gives wrong distances — a 0-weight edge must jump the queue (push to the front of a deque), or a later, cheaper path can be processed after a more expensive one already settled that node.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "No sources at all (an empty starting set) — the traversal should terminate immediately with a sensible base answer, not hang.",
          "A source with no valid neighbours (isolated node, or a grid source fully walled in).",
          "A target that's unreachable — return the prompt's sentinel (`-1`, `Infinity`) rather than looping forever.",
          "All targets already reached before BFS starts (Rotting Oranges with zero fresh oranges) — the answer is 0, not 1.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["rotting-oranges"],
        recommended: ["word-ladder", "number-of-islands"],
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
