import type { LearnTopic } from "@/learn/data/topic";

export const trees = {
  slug: "trees",
  title: "Trees",
  category: "data-structures",
  summary: "Hierarchies with one root and no cycles — recursion on a node + its children solves most of it.",
  tags: ["tree", "binary-tree", "binary-search-tree", "depth-first-search", "breadth-first-search"],
  priority: "high",
  estimatedMinutes: 95,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A **tree** is a connected, acyclic hierarchy of nodes: one **root**, and every other node reached by " +
          "exactly one path from it. A **binary tree** gives each node at most two children — a **left** and a " +
          "**right**. A node with no children is a **leaf**; the **height** of a tree is the number of edges on its " +
          "longest root-to-leaf path.\n\n" +
          "The reason trees dominate interviews is structural: a tree is *defined recursively* — a node, plus a left " +
          "subtree and a right subtree, each themselves a tree. So the natural shape of almost every tree algorithm " +
          "is a function that does a little work at a node and calls itself on the children. Get that recursion clean " +
          "and the whole problem usually falls out.\n\n" +
          "A **binary search tree (BST)** adds an ordering invariant: every value in a node's left subtree is smaller, " +
          "every value in its right subtree is larger. That invariant makes lookup, insert, and delete **O(h)** — and " +
          "**O(log n)** when the tree is balanced — and means an *in-order* traversal emits the values already sorted.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "DFS / BFS traversal (visit every node)", average: "O(n)", worst: "O(n)", note: "Each node is visited once; space is O(h) for DFS recursion, O(w) for the BFS queue." },
          { operation: "Height / depth of a tree", average: "O(n)", worst: "O(n)", note: "One post-order pass; `1 + max(leftHeight, rightHeight)`." },
          { operation: "BST search / insert / delete", average: "O(log n)", worst: "O(n)", note: "O(h): O(log n) balanced, O(n) for a degenerate (linked-list-shaped) tree." },
          { operation: "Build a balanced tree from sorted input", average: "O(n)", worst: "O(n)", note: "Pick the middle as root, recurse on each half." },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for tree thinking whenever a problem hands you a `root` and a `left`/`right` (or a hierarchy: a file " +
          "system, an org chart, a DOM, an expression). The tell that a problem is *tree-recursion* shaped: the answer " +
          "for a node is some combination of the answers for its subtrees — *invert*, *is-balanced*, *max-path-sum* all " +
          "fit that mould.\n\n" +
          "Two cues narrow the traversal. If the question is about **levels** — the rightmost node per level, the widest " +
          "level, level-order output — that's **breadth-first** (a queue). If it's about **paths, depths, or " +
          "subtree-wide facts**, that's **depth-first** (recursion or an explicit stack). And the moment you read " +
          "*binary search tree*, remember in-order yields sorted values — many BST problems are just \"do something with " +
          "the sorted sequence without materializing it.\"",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Depth-first traversal (DFS)** — recurse into the children. The three orders differ only in *when* you " +
          "visit the node relative to its subtrees: **pre-order** (node, left, right) for copying/serializing, " +
          "**in-order** (left, node, right) which sorts a BST, and **post-order** (left, right, node) when a node's " +
          "result depends on its children's (heights, max-path-sum, bottom-up validation).\n\n" +
          "**Breadth-first traversal (BFS / level-order)** — a queue processes the tree one level at a time. Snapshot " +
          "the queue size at the start of each level to know where one level ends and the next begins; this is the tool " +
          "for right-side view, maximum width, and any \"per level\" question.\n\n" +
          "**Bounded recursion** — pass extra context down the call (a `(low, high)` interval to validate a BST, a " +
          "column index for vertical order, a heap index for width). The child's behaviour depends on where it sits, " +
          "not just on its value.\n\n" +
          "**Return-the-thing-plus-track-a-global** — a node's recursive return value (what it can contribute *upward*) " +
          "is often different from the quantity you actually want (a best seen *anywhere*). Max-path-sum is the archetype: " +
          "each call returns a one-sided gain but updates a separate global best for paths that turn at the node.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "A tree is a [graph](/study-guide/algos/topic/graphs) with no cycles and a designated root, so DFS and BFS " +
          "carry over directly — tree traversal is just graph traversal where you never need a `visited` set. BFS leans " +
          "on a [queue](/concepts/queues) and iterative DFS on a [stack](/concepts/stacks); a balanced BST is the pointer-based " +
          "cousin of the array-backed [heap](/study-guide/algos/topic/heaps) — both are complete-ish binary trees with an " +
          "ordering invariant, but a heap only orders parent-vs-child, not left-vs-right. For prefix-style work over a " +
          "tree of strings, see [tries](/study-guide/algos/topic/tries).",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "The two traversal skeletons every tree problem specializes — DFS recursion and a BFS queue.",
        source:
          "// Depth-first: do work at the node, recurse on each child.\n" +
          "function dfs(node) {\n" +
          "  if (!node) return;            // base case: empty subtree\n" +
          "  // pre-order work here (node, then children)\n" +
          "  dfs(node.left);\n" +
          "  // in-order work here (between the two subtrees) — sorted for a BST\n" +
          "  dfs(node.right);\n" +
          "  // post-order work here (children first, then node)\n" +
          "}\n\n" +
          "// Breadth-first: process one full level per outer iteration.\n" +
          "function bfs(root) {\n" +
          "  if (!root) return;\n" +
          "  let queue = [root];\n" +
          "  while (queue.length) {\n" +
          "    const next = [];\n" +
          "    for (const node of queue) {   // this whole loop is one level\n" +
          "      // level work here\n" +
          "      if (node.left) next.push(node.left);\n" +
          "      if (node.right) next.push(node.right);\n" +
          "    }\n" +
          "    queue = next;                 // descend to the next level\n" +
          "  }\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Level-order traversal** makes the BFS skeleton concrete. Take the tree `[3, 9, 20, null, null, 15, 7]` — " +
          "root `3`, children `9` and `20`, and `20`'s children `15` and `7`. We want the values grouped by level: " +
          "`[[3], [9, 20], [15, 7]]`.\n\n" +
          "The queue holds exactly the nodes of the *current* level. We record how many there are, drain that many " +
          "(emitting their values and enqueuing their children), and whatever remains in the queue is precisely the " +
          "next level. Watching the queue contents tells the whole story:",
      },
      {
        kind: "walkthrough",
        heading: "queue contents as BFS peels off one level at a time",
        lane: [3, 9, 20, 15, 7],
        frames: [
          { pointers: [{ name: "level", at: 0 }], range: [0, 0], action: "queue = [3]", caption: "Start: only the root is queued. This level has 1 node." },
          { pointers: [{ name: "level", at: 1 }], range: [1, 2], action: "emit [3]; enqueue 9, 20", caption: "Drain 3, push its children. The queue is now exactly level 1." },
          { pointers: [{ name: "level", at: 3 }], range: [3, 4], action: "emit [9, 20]; enqueue 15, 7", caption: "Drain both level-1 nodes; 9 is a leaf, 20 enqueues 15 and 7." },
          { range: [3, 4], action: "emit [15, 7]", caption: "Drain the last level; no children to enqueue, so the queue empties." },
          { action: "queue empty → done", caption: "Result, level by level: [[3], [9, 20], [15, 7]]." },
        ],
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "Level-order traversal — O(n) time, O(w) space for the widest level.",
        source:
          "function levelOrder(root) {\n" +
          "  if (!root) return [];\n" +
          "  const result = [];\n" +
          "  let queue = [root];\n" +
          "  while (queue.length) {\n" +
          "    const level = [];           // values for this level\n" +
          "    const next = [];            // nodes of the next level\n" +
          "    for (const node of queue) {\n" +
          "      level.push(node.val);\n" +
          "      if (node.left) next.push(node.left);\n" +
          "      if (node.right) next.push(node.right);\n" +
          "    }\n" +
          "    result.push(level);\n" +
          "    queue = next;\n" +
          "  }\n" +
          "  return result;\n" +
          "}",
      },
      {
        kind: "prose",
        body:
          "Every node is enqueued and dequeued exactly once, so the traversal is **O(n)** time; the queue never holds " +
          "more than one level at a time, so space is **O(w)** for the maximum level width `w` (up to ~n/2 at the bottom " +
          "of a full tree).",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Forgetting the `null` base case.** Every recursion must return on an empty node *first* — dereferencing `node.left` when `node` is null is the most common tree crash.",
          "**Validating a BST with only a parent check.** `node.left.val < node.val` is not enough: a value deep in a right subtree must respect *every* ancestor's bound. Pass a `(low, high)` interval down instead.",
          "**Returning the wrong quantity from recursion.** In max-path-sum the value a node hands *upward* (a single-sided gain) differs from the global best (a path that turns at the node). Conflating them is the classic bug — track the global separately.",
          "**Mutating shared state across siblings.** A counter or path array passed by reference must be un-done (or copied) before recursing into the sibling, or the right subtree sees the left subtree's leftovers.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty tree (`root === null`) — most functions should return the identity (0, `[]`, `true`).",
          "Single node — no children; height 1, every traversal is just `[root.val]`.",
          "A degenerate tree (every node has one child) — height equals `n`; deep recursion can approach the stack limit, and O(h) becomes O(n).",
          "Duplicate values — fine for structure, but they break the naive 'find this value' assumption in a BST unless the invariant's strictness is defined.",
          "Skewed left vs. skewed right — mirror cases that a left-biased recursion can silently mishandle.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["invert-binary-tree", "binary-tree-right-side-view"],
        recommended: [
          "balanced-binary-tree",
          "symmetric-tree",
          "same-tree",
          "binary-tree-inorder-traversal",
          "validate-binary-search-tree",
          "kth-smallest-element-in-a-bst",
          "binary-tree-vertical-order-traversal",
          "construct-binary-tree-from-preorder-and-inorder-traversal",
          "lowest-common-ancestor-of-a-binary-tree",
          "maximum-width-of-binary-tree",
          "binary-tree-maximum-path-sum",
          "serialize-and-deserialize-binary-tree",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Trees practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Tree cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/tree/", type: "article" },
          { label: "Tech Interview Handbook — Binary search tree cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/binary-search-tree/", type: "article" },
          { label: "VisuAlgo — Binary tree & BST visualization", url: "https://visualgo.net/en/bst", type: "doc" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
