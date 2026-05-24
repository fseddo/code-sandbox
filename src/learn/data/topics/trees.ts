import type { LearnTopic } from "@/learn/data/topic";

export const trees = {
  slug: "trees",
  title: "Trees",
  category: "data-structures",
  summary: "Hierarchies of nodes with one root and no cycles — most tree work is naturally recursive.",
  tags: ["tree", "binary-tree"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A tree is a hierarchy of nodes with a single root and no cycles; a *binary* tree gives each node at " +
          "most two children. Most tree work is recursive — a function on a node that calls itself on the " +
          "children and combines the results.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for trees for hierarchical data and ordered lookups. Know the traversals cold: depth-first " +
          "(pre-, in-, and post-order) and breadth-first (level-order, via a queue). On a binary search tree, " +
          "in-order traversal yields sorted output.",
      },
    ],
  },
} satisfies LearnTopic;
