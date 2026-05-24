import type { LearnTopic } from "@/learn/data/topic";

export const topologicalSort = {
  slug: "topological-sort",
  title: "Topological sort",
  category: "algorithms",
  summary: "Linearly order a DAG so every edge points forward — the tool for dependency resolution.",
  tags: ["graph", "depth-first-search"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A topological sort orders the vertices of a *directed acyclic graph* so that every edge goes from " +
          "earlier to later. Two standard methods: Kahn's algorithm (repeatedly remove a zero-in-degree node) and " +
          "DFS post-order (reverse the finish order). If the graph has a cycle, no valid ordering exists.",
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
  },
} satisfies LearnTopic;
