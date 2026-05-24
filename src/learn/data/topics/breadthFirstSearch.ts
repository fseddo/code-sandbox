import type { LearnTopic } from "@/learn/data/topic";

export const breadthFirstSearch = {
  slug: "breadth-first-search",
  title: "Breadth-first search",
  category: "algorithms",
  summary: "Explore level by level with a queue — finds the shortest path in an unweighted graph.",
  tags: ["breadth-first-search", "graph"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "BFS explores a graph level by level using a **queue**, visiting all of a node's neighbours before going " +
          "deeper. Because it reaches nodes in order of distance from the source, on an *unweighted* graph the " +
          "first time it sees a node is via a shortest (fewest-edge) path.",
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
  },
} satisfies LearnTopic;
