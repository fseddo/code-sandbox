import type { LearnTopic } from "@/learn/data/topic";

export const unionFind = {
  slug: "union-find",
  title: "Union-Find",
  category: "algorithms",
  summary: "Disjoint Set Union — near-O(1) 'are these connected?' and 'merge these groups'.",
  tags: ["union-find", "graph"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Union-Find (Disjoint Set Union) tracks a partition of elements into disjoint sets with two operations: " +
          "`find(x)` returns a representative for x's set, and `union(x, y)` merges two sets. With *path " +
          "compression* and *union by rank/size*, both run in near-constant amortized time (inverse Ackermann).",
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
  },
} satisfies LearnTopic;
