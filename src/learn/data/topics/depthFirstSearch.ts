import type { LearnTopic } from "@/learn/data/topic";

export const depthFirstSearch = {
  slug: "depth-first-search",
  title: "Depth-first search",
  category: "algorithms",
  summary: "Go as deep as possible, then backtrack — the natural fit for connectivity and ordering.",
  tags: ["depth-first-search", "graph"],
  parent: "graphs",
  priority: "high",
  estimatedMinutes: 60,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "DFS explores as far as possible along each branch before backtracking, expressed with recursion or an " +
          "explicit stack. It uses O(depth) stack space and naturally captures connectivity, cycle detection, and " +
          "ordering — but it does *not* find shortest paths. See [[graphs]] for representations and how DFS fits " +
          "alongside BFS and the rest of the toolkit; this page is about the traversal itself and its variants.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for DFS for connected components, path existence, flood-fill, topological ordering, and tree " +
          "traversals. On cyclic graphs you must mark visited nodes; on very deep graphs, prefer an explicit " +
          "stack to avoid blowing the call stack.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Recursive DFS** — the natural, readable form: the call stack *is* the traversal stack. Simple, but " +
          "risks a stack overflow on a deep or skewed graph (a long chain, a linked-list-shaped dependency graph).\n\n" +
          "**Iterative DFS (explicit stack)** — push a node, pop it, push its unvisited neighbours, repeat. Same " +
          "traversal order as the recursive form, but the stack lives on the heap instead of the call stack, so " +
          "depth is bounded only by memory. Reach for this the moment depth is a concern.\n\n" +
          "**Two-color vs. three-color visited tracking** — a plain visited *set* (two states: seen / unseen) is " +
          "enough to avoid infinite loops, but it **cannot** detect a cycle in a *directed* graph — it can't tell " +
          "'currently being explored' apart from 'fully explored elsewhere'. Cycle detection needs a third state: " +
          "**white** (unvisited), **gray** (on the current recursion path), **black** (fully explored). A gray-to-gray " +
          "edge is a back-edge — a cycle.\n\n" +
          "**Connected components** — a single DFS call only reaches one component. To cover a graph with several, " +
          "loop over every node and start a fresh DFS from each one still unvisited.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "Iterative DFS trades the call stack for an explicit [[stacks|stack]] — literally the same LIFO structure, " +
          "just heap-allocated instead of implicit. [[topological-sort]]'s DFS-based method is DFS with a " +
          "post-order twist (push to the result on the way *back up*), and [[union-find]] answers the same " +
          "'are these connected?' questions DFS does, in near-O(1) instead of O(V+E) per query. See [[graphs]] for " +
          "the full comparison against BFS and Dijkstra.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "Iterative DFS with an explicit stack — same traversal order as recursion, no call-stack risk.",
        source:
          "function dfsIterative(adj, start) {\n" +
          "  const visited = new Set([start]);\n" +
          "  const stack = [start];\n" +
          "  const order = [];\n" +
          "  while (stack.length > 0) {\n" +
          "    const node = stack.pop();\n" +
          "    order.push(node);\n" +
          "    for (const neighbor of adj.get(node) ?? []) {\n" +
          "      if (visited.has(neighbor)) continue;   // never revisit — this breaks cycles\n" +
          "      visited.add(neighbor);\n" +
          "      stack.push(neighbor);\n" +
          "    }\n" +
          "  }\n" +
          "  return order;\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Course Schedule** — *given course prerequisites as directed edges, can all courses be finished, or " +
          "do they form a cycle?* This is cycle detection on a directed graph, which is exactly where the plain " +
          "visited-set trick fails and three-color DFS earns its keep. Take `numCourses = 3` with prerequisites " +
          "`[[1,0],[2,1],[0,2]]` (edges `0→1→2→0`) — a cycle by construction:",
      },
      {
        kind: "graph",
        heading: "0 → 1 → 2 → 0 — each edge u→v means 'u must be completed before v'",
        nodes: ["0", "1", "2"],
        edges: [["0", "1"], ["1", "2"], ["2", "0"]],
        directed: true,
      },
      {
        kind: "walkthrough",
        heading: "the DFS recursion stack over time — a node's color, not its position, is what matters here",
        lane: ["0", "1", "2"],
        frames: [
          {
            pointers: [{ name: "dfs", at: 0 }],
            action: "visit(0) → gray",
            caption: "Start DFS at course 0 and mark it gray: it's now on the current recursion path.",
          },
          {
            pointers: [{ name: "dfs", at: 1 }],
            action: "visit(1) → gray",
            caption: "0's only edge leads to 1. Recurse into 1 and mark it gray too — 0 stays gray, still on the stack.",
          },
          {
            pointers: [{ name: "dfs", at: 2 }],
            action: "visit(2) → gray",
            caption: "1's only edge leads to 2. Recurse into 2 and mark it gray. Three nodes are now all gray, all on the stack.",
          },
          {
            pointers: [{ name: "dfs", at: 0 }],
            action: "neighbor 0 is gray → cycle!",
            caption: "2's only edge points back to 0 — and 0 is still gray (never finished, never popped). A gray-to-gray edge is exactly a back-edge: a cycle.",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Three-color DFS cycle detection — a plain visited set can't tell 'on this path' from 'done elsewhere'.",
        source:
          "function canFinish(numCourses, prerequisites) {\n" +
          "  const adj = Array.from({ length: numCourses }, () => []);\n" +
          "  for (const [course, prereq] of prerequisites) adj[prereq].push(course);\n\n" +
          "  const WHITE = 0, GRAY = 1, BLACK = 2;\n" +
          "  const color = new Array(numCourses).fill(WHITE);\n\n" +
          "  function hasCycle(node) {\n" +
          "    color[node] = GRAY;                      // on the current recursion path\n" +
          "    for (const next of adj[node]) {\n" +
          "      if (color[next] === GRAY) return true;  // back-edge to an in-progress node → cycle\n" +
          "      if (color[next] === WHITE && hasCycle(next)) return true;\n" +
          "    }\n" +
          "    color[node] = BLACK;                      // fully explored — safe to revisit from elsewhere\n" +
          "    return false;\n" +
          "  }\n\n" +
          "  for (let course = 0; course < numCourses; course++) {\n" +
          "    if (color[course] === WHITE && hasCycle(course)) return false;\n" +
          "  }\n" +
          "  return true;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Every node and edge is visited once, so this is **O(V + E)** time and **O(V)** space for the color " +
          "array plus the recursion stack. [[topological-sort]] reuses this exact traversal, adding one twist: push " +
          "a node to the *front* of a result list when it turns black, instead of just detecting the cycle.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "A two-state visited set (seen/unseen) can't detect a directed cycle — it can't distinguish 'on the current path' from 'already fully explored via another branch'. Use three colors when the graph is directed and cycles matter.",
          "Forgetting to demote gray back to black on the way back up breaks cycle detection for every later branch — a node must leave the recursion path when its call returns, not stay gray forever.",
          "Recursive DFS on a graph with a long chain or a skewed tree can overflow the call stack — switch to the iterative, explicit-stack form once depth is a real risk, not after it crashes.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "A self-loop (a node with an edge to itself) — a length-1 cycle that three-color detection must still catch.",
          "A node with no outgoing edges — DFS visits it, marks it black immediately, and returns.",
          "Several disconnected components — a single DFS call only reaches one; loop over every node and restart from each unvisited one.",
          "An already-black node reached again from a different branch — that's fine and expected, not a cycle; only a *gray* revisit is one.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["course-schedule"],
        recommended: ["number-of-islands", "clone-graph"],
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
