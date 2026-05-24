import type { LearnTopic } from "@/learn/data/topic";

export const depthFirstSearch = {
  slug: "depth-first-search",
  title: "Depth-first search",
  category: "algorithms",
  summary: "Go as deep as possible, then backtrack — the natural fit for connectivity and ordering.",
  tags: ["depth-first-search", "graph"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "DFS explores as far as possible along each branch before backtracking, expressed with recursion or an " +
          "explicit stack. It uses O(depth) stack space and naturally captures connectivity, cycle detection, and " +
          "ordering — but it does *not* find shortest paths.",
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
  },
} satisfies LearnTopic;
