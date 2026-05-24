import type { LearnTopic } from "@/learn/data/topic";

export const graphs = {
  slug: "graphs",
  title: "Graphs",
  category: "data-structures",
  summary: "Vertices joined by edges — model relationships, then traverse with BFS or DFS.",
  tags: ["graph"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A graph is a set of *vertices* connected by *edges*, which may be directed or undirected, weighted or " +
          "not. The two representations are an **adjacency list** (O(V + E) space, best for sparse graphs) and an " +
          "**adjacency matrix** (O(V²) space, O(1) edge lookup) — see the adjacency matrices topic.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for graph modeling whenever entities have pairwise relationships — networks, dependencies, maps, " +
          "state machines. The workhorse traversals are BFS (shortest path in an unweighted graph) and DFS " +
          "(connectivity, cycle detection, topological order); always track a visited set.",
      },
    ],
  },
} satisfies LearnTopic;
