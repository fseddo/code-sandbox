import type { LearnTopic } from "@/learn/data/topic";

export const binarySearchTrees = {
  slug: "binary-search-trees",
  title: "Binary search trees",
  category: "data-structures",
  summary: "Ordered binary trees — O(log n) search when balanced, O(n) when they degenerate to a chain.",
  tags: ["binary-search-tree", "tree"],
  priority: "mid",
  estimatedMinutes: 45,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A binary search tree (BST) orders nodes so that every node in a left subtree is smaller and every " +
          "node in a right subtree is larger. That invariant gives O(log n) search, insert, and delete — *when " +
          "balanced*. A degenerate BST (e.g. from inserting sorted data) collapses into an O(n) linked chain.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a BST (or a balanced variant / your language's sorted map) when you need ordered data with " +
          "fast lookup *and* in-order iteration. In interviews the common asks are validating a BST and using " +
          "in-order traversal to exploit its sorted order.",
      },
    ],
  },
} satisfies LearnTopic;
