import type { LearnTopic } from "@/learn/data/topic";

export const topologicalSort = {
  slug: "topological-sort",
  title: "Topological sort",
  category: "algorithms",
  summary: "Linearly order a DAG so every edge points forward — the tool for dependency resolution.",
  tags: ["graph", "depth-first-search", "topological-sort"],
  parent: "graphs",
  priority: "mid",
  estimatedMinutes: 45,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A topological sort orders the vertices of a *directed acyclic graph* so that every edge goes from " +
          "earlier to later. Two standard methods: **Kahn's algorithm** (repeatedly remove a zero-in-degree node) " +
          "and **DFS post-order** (reverse the finish order). If the graph has a cycle, no valid ordering exists. " +
          "See [[graphs]] for how this fits alongside BFS/DFS/Union-Find; this page walks both methods end to end.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for it on dependency ordering — build systems, course prerequisites, task pipelines — and as a " +
          "cycle-detection test on directed graphs (Kahn's leaves nodes unprocessed exactly when there's a cycle).",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Kahn's algorithm (BFS-flavored)** — compute every node's in-degree, seed a queue with the nodes at " +
          "in-degree 0 (no unmet dependencies), then repeatedly dequeue a node, append it to the result, and " +
          "decrement its neighbours' in-degrees — enqueueing any that hit 0. If the result ends shorter than the " +
          "full vertex count, some nodes never reached in-degree 0: a cycle.\n\n" +
          "**DFS post-order** — run DFS from every unvisited node; the instant a node's *entire* subtree is " +
          "explored (its post-order moment), push it onto the *front* of the result (or push to the back and " +
          "reverse at the end). A node's dependencies always finish exploring — and so get placed — before it does.\n\n" +
          "Kahn's is usually the more natural pick in an interview: it's iterative (no recursion-depth risk) and " +
          "the cycle check falls out for free from comparing output length to vertex count, whereas DFS needs the " +
          "separate three-color check from [[depth-first-search]] layered on top.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "Kahn's algorithm is [[breadth-first-search|BFS]] with in-degree standing in for 'visited', and the " +
          "DFS method is a direct extension of [[depth-first-search]]'s three-color cycle check — a node only " +
          "goes black once its whole subtree is done, which is exactly the moment it belongs at the *front* of " +
          "the order. See [[graphs]] for the full picture.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "Kahn's algorithm — in-degree BFS. Returns the order, or a shorter array if a cycle blocks some nodes.",
        source:
          "function topologicalSort(numNodes, edges) {\n" +
          "  const adj = Array.from({ length: numNodes }, () => []);\n" +
          "  const inDegree = new Array(numNodes).fill(0);\n" +
          "  for (const [from, to] of edges) {\n" +
          "    adj[from].push(to);\n" +
          "    inDegree[to]++;\n" +
          "  }\n\n" +
          "  let queue = [];\n" +
          "  for (let node = 0; node < numNodes; node++) {\n" +
          "    if (inDegree[node] === 0) queue.push(node);          // no unmet dependencies — can go first\n" +
          "  }\n\n" +
          "  const order = [];\n" +
          "  while (queue.length > 0) {\n" +
          "    const next = [];\n" +
          "    for (const node of queue) {\n" +
          "      order.push(node);\n" +
          "      for (const neighbor of adj[node]) {\n" +
          "        if (--inDegree[neighbor] === 0) next.push(neighbor);  // just lost its last dependency\n" +
          "      }\n" +
          "    }\n" +
          "    queue = next;\n" +
          "  }\n" +
          "  return order;                                          // order.length < numNodes ⇒ a cycle exists\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Course Schedule II** — *return a valid order to complete all courses given prerequisite pairs, or " +
          "an empty array if it's impossible.* Take `numCourses = 4` with prerequisites `[[1,0],[2,0],[3,1],[3,2]]` " +
          "(course 0 has no prerequisites; 1 and 2 each need 0; 3 needs both 1 and 2):",
      },
      {
        kind: "graph",
        heading: "0 has no prerequisites; 3 needs both 1 and 2 finished first",
        nodes: ["0", "1", "2", "3"],
        edges: [["0", "1"], ["0", "2"], ["1", "3"], ["2", "3"]],
        directed: true,
      },
      {
        kind: "walkthrough",
        heading: "Kahn's algorithm — the queue holds every course whose prerequisites are all satisfied",
        lane: ["0", "1", "2", "3"],
        frames: [
          {
            action: "in-degree = [0,1,1,2]; queue = [0]",
            caption: "Only course 0 has no prerequisites, so it's the only node that starts in the queue.",
          },
          {
            pointers: [{ name: "take", at: 0 }],
            action: "dequeue 0 → order=[0]; 1 and 2 drop to in-degree 0",
            caption: "Finishing 0 frees up both 1 and 2 — each loses its only prerequisite and joins the queue.",
          },
          {
            pointers: [{ name: "take", at: 1 }],
            action: "dequeue 1 → order=[0,1]; 3 drops to in-degree 1",
            caption: "3 still needs 2 — its in-degree drops from 2 to 1, not yet enqueued.",
          },
          {
            pointers: [{ name: "take", at: 2 }],
            action: "dequeue 2 → order=[0,1,2]; 3 drops to in-degree 0",
            caption: "Now 3 has no remaining prerequisites — it joins the queue.",
          },
          {
            pointers: [{ name: "take", at: 3 }],
            action: "dequeue 3 → order=[0,1,2,3], queue empty",
            caption: "All 4 courses are ordered — a valid schedule. Had any course been left with in-degree > 0, that would mean a cycle, and the answer would be [].",
          },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Course Schedule II is exactly Kahn's algorithm, returning [] on a cycle.",
        source:
          "function findOrder(numCourses, prerequisites) {\n" +
          "  const order = topologicalSort(\n" +
          "    numCourses,\n" +
          "    prerequisites.map(([course, prereq]) => [prereq, course]),  // edge: prereq → course\n" +
          "  );\n" +
          "  return order.length === numCourses ? order : [];\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Building the adjacency list and in-degree array is **O(V + E)**, and Kahn's loop visits every node and " +
          "edge exactly once — also **O(V + E)** — for a total linear-time solution. Note that `[0,1,2,3]` isn't " +
          "the *only* valid order here (`[0,2,1,3]` works too) — a DAG's topological order is rarely unique.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Forgetting to decrement a neighbour's in-degree when its prerequisite is dequeued leaves it permanently stuck out of the queue, even once it should be ready.",
          "The DFS method must place a node at the *front* of the result on completion (or reverse the array at the end) — pushing to the back on the way up gives the exact reverse of a valid order.",
          "Course Schedule (boolean 'can finish?') and Course Schedule II ('what order?') are the same traversal — don't rebuild the cycle check separately when Kahn's already gives you `order.length < numCourses` for free.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "A single node with no edges — trivially sorted, order is just that one node.",
          "Several independent components — every component contributes its own nodes to the queue seed; don't assume one connected graph.",
          "A self-loop (a node depends on itself) — its in-degree never reaches 0, exactly like any other cycle.",
          "A DAG with independent branches has *multiple* valid topological orders — don't hardcode or assert one exact output; check the ordering constraints instead.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["course-schedule-ii"],
        recommended: ["course-schedule"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Graphs practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Wikipedia — Topological sorting", url: "https://en.wikipedia.org/wiki/Topological_sorting", type: "article" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
