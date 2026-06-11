import type { Section } from "./topic";

/**
 * Optional authored *teaching* content for a problem's Study Guide page — the intuition, the brute-force
 * baseline, and a walkthrough that motivate the optimization. It sits between the (derived) problem statement
 * and the **Optimization** section, which the page builds automatically from the problem's stored `solutions`
 * (the canonical best approach + implementation). Keyed by problem id; rendered through the shared
 * `SectionRenderer`, so any Section kind works. A problem with no entry here still gets a useful page
 * (statement + examples + constraints + Optimization + CTA) — this is the enrichment layer.
 */
export const PROBLEM_GUIDES: Record<string, Section[]> = {
  "invert-binary-tree": [
    {
      kind: "prose",
      body:
        "Inverting a tree means swapping every node's two children, so the result is the mirror image of the input. " +
        "The most direct way to picture it is level by level: at each node, exchange its left and right subtrees, " +
        "then do the same inside each subtree.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — BFS, swapping each node's children as it's dequeued: O(n) time, O(n) space.",
      source:
        "function invertTree(root) {\n" +
        "  if (!root) return null;\n" +
        "  const queue = [root];\n" +
        "  while (queue.length) {\n" +
        "    const node = queue.shift();\n" +
        "    // Swap this node's two children.\n" +
        "    const tmp = node.left;\n" +
        "    node.left = node.right;\n" +
        "    node.right = tmp;\n" +
        "    // Visit the children to swap their children too.\n" +
        "    if (node.left) queue.push(node.left);\n" +
        "    if (node.right) queue.push(node.right);\n" +
        "  }\n" +
        "  return root;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "That works and is already O(n), but the explicit queue and the temp-swap obscure how simple the idea is. " +
        "The key observation: *inverting a tree is inverting its left subtree, inverting its right subtree, and then " +
        "swapping the two results*. That's a textbook recursion — the structure of the solution mirrors the recursive " +
        "structure of the tree itself.\n\n" +
        "The stored solution drops the queue for that recursion: it inverts each subtree first, then assigns them " +
        "back crossed over. (`left` and `right` in the code are the already-inverted subtrees, so the assignment " +
        "`root.left = right` is the swap.)\n\n" +
        "Walking the recursion through `[4, 2, 7, 1, 3, 6, 9]`:",
    },
    {
      kind: "treeWalkthrough",
      heading: "invert each subtree first, then swap the two results (post-order)",
      nodes: [
        { id: "r", val: 4, left: "a", right: "b" },
        { id: "a", val: 2, left: "a1", right: "a2" },
        { id: "b", val: 7, left: "b1", right: "b2" },
        { id: "a1", val: 1 },
        { id: "a2", val: 3 },
        { id: "b1", val: 6 },
        { id: "b2", val: 9 },
      ],
      frames: [
        {
          pointers: [{ name: "invert", at: "a" }],
          active: ["a", "a1", "a2"],
          action: "invert(2) → swap 1 ↔ 3",
          caption: "Recurse left first. Node 2's children are leaves; swap them so 3 lands on the left, 1 on the right.",
        },
        {
          nodes: [
            { id: "r", val: 4, left: "a", right: "b" },
            { id: "a", val: 2, left: "a2", right: "a1" },
            { id: "b", val: 7, left: "b1", right: "b2" },
            { id: "a1", val: 1 },
            { id: "a2", val: 3 },
            { id: "b1", val: 6 },
            { id: "b2", val: 9 },
          ],
          pointers: [{ name: "invert", at: "b" }],
          active: ["b", "b1", "b2"],
          action: "invert(7) → swap 6 ↔ 9",
          caption: "The left subtree is inverted. Same on the right: at node 7, swap 6 and 9.",
        },
        {
          nodes: [
            { id: "r", val: 4, left: "a", right: "b" },
            { id: "a", val: 2, left: "a2", right: "a1" },
            { id: "b", val: 7, left: "b2", right: "b1" },
            { id: "a1", val: 1 },
            { id: "a2", val: 3 },
            { id: "b1", val: 6 },
            { id: "b2", val: 9 },
          ],
          pointers: [{ name: "invert", at: "r" }],
          active: ["r"],
          action: "invert(4) → swap subtrees",
          caption: "Both subtrees are inverted. Now swap them at the root: the 7-subtree moves left, the 2-subtree moves right.",
        },
        {
          nodes: [
            { id: "r", val: 4, left: "b", right: "a" },
            { id: "b", val: 7, left: "b2", right: "b1" },
            { id: "a", val: 2, left: "a2", right: "a1" },
            { id: "b2", val: 9 },
            { id: "b1", val: 6 },
            { id: "a2", val: 3 },
            { id: "a1", val: 1 },
          ],
          caption: "Done. Read in level order: [4, 7, 2, 9, 6, 3, 1] — every level reversed, the mirror of the input.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "The empty-tree base case (`if (!root) return null`) is what makes the recursion terminate; every leaf's two `null` children hit it.",
      ],
    },
  ],

  "balanced-binary-tree": [
    {
      kind: "prose",
      body:
        "A tree is height-balanced when *every* node's two subtrees differ in height by at most one. The literal " +
        "reading of that definition is a two-function solution: a `height` helper, and an `isBalanced` that, at every " +
        "node, computes both subtree heights and checks the difference.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — recompute every subtree's height from scratch at each node: O(n²).",
      source:
        "function isBalanced(root) {\n" +
        "  if (!root) return true;\n" +
        "  // Height of a subtree: longest path down, in edges + 1.\n" +
        "  const height = (node) => node ? 1 + Math.max(height(node.left), height(node.right)) : 0;\n" +
        "  // This node balanced?\n" +
        "  const diff = Math.abs(height(root.left) - height(root.right));\n" +
        "  // ...and both subtrees balanced, recursively.\n" +
        "  return diff <= 1 && isBalanced(root.left) && isBalanced(root.right);\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n²) — far more work than necessary. Can we do better?\n\n" +
        "The waste is that `height` is called over and over: checking the root computes the whole tree's heights, " +
        "then checking each child recomputes its subtree's heights, and so on — every node's height is recomputed " +
        "once per ancestor. But a node only needs its children's heights, and those are available the moment the " +
        "children return.\n\n" +
        "The key observation: **compute height bottom-up, and let it double as the balance check**. Have the height " +
        "function return a sentinel — `-1` — the instant it discovers an imbalance, and propagate that sentinel up so " +
        "the whole tree fails fast. One post-order pass, each node visited once.\n\n" +
        "Walking it through a tree whose left side runs deep while its right child is a lone leaf:",
    },
    {
      kind: "treeWalkthrough",
      heading: "height returned bottom-up; the moment |left − right| > 1, return the −1 sentinel",
      nodes: [
        { id: "r", val: 1, left: "a", right: "b" },
        { id: "a", val: 2, left: "c" },
        { id: "b", val: 2 },
        { id: "c", val: 3, left: "d", right: "e" },
        { id: "d", val: 4, left: "f" },
        { id: "e", val: 4 },
        { id: "f", val: 5 },
      ],
      frames: [
        {
          pointers: [{ name: "height", at: "f" }],
          active: ["f"],
          badges: { f: "h=1" },
          action: "leaf 5 → height 1",
          caption: "Post-order dives to the deepest node first. Leaf 5 has no children, so it returns height 1.",
        },
        {
          pointers: [{ name: "height", at: "c" }],
          active: ["c", "d", "e", "f"],
          badges: { f: "h=1", d: "h=2", e: "h=1", c: "h=3" },
          action: "node 3: |2 − 1| ≤ 1 ✓ → height 3",
          caption: "Node 4 (left) returns 2, node 4 (right) returns 1 — balanced. Node 3 takes 1 + max(2,1) = height 3.",
        },
        {
          pointers: [{ name: "height", at: "a" }],
          active: ["a"],
          badges: { c: "h=3", a: "−1" },
          action: "node 2: |3 − 0| = 3 > 1 ✗ → return −1",
          caption: "The left 2 has a height-3 child and an empty (height-0) side: difference 3. Imbalance found — return the −1 sentinel.",
        },
        {
          pointers: [{ name: "height", at: "r" }],
          marked: ["b"],
          badges: { a: "−1", r: "−1" },
          action: "−1 seen → short-circuit, return −1",
          caption: "−1 bubbles straight to the root; the answer is false and the right subtree's height is never computed.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "In the stored solution the value `-1` is *not* a height — it's the \"already unbalanced\" flag. Any real height is `>= 0`, so `-1` is unambiguous.",
        "Because the check rides on the height computation, the answer is found in a single traversal rather than the brute force's repeated re-descents.",
      ],
    },
  ],

  "symmetric-tree": [
    {
      kind: "prose",
      body:
        "A tree is symmetric when it's a mirror of itself. The tempting first move is to *build* the mirror — invert " +
        "the tree into a copy — and check whether the copy equals the original. It's correct, but it allocates a whole " +
        "second tree to answer a yes/no question.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — invert a copy of the tree, then compare it to the original: O(n) time, O(n) space.",
      source:
        "function isSymmetric(root) {\n" +
        "  // Deep-copy the tree with its children swapped (the mirror).\n" +
        "  const mirror = (node) =>\n" +
        "    node ? { val: node.val, left: mirror(node.right), right: mirror(node.left) } : null;\n" +
        "  // Compare two trees node for node.\n" +
        "  const equal = (a, b) =>\n" +
        "    (!a && !b) || (!!a && !!b && a.val === b.val && equal(a.left, b.left) && equal(a.right, b.right));\n" +
        "  return equal(root, mirror(root));\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n) time but allocates a full mirror copy. Can we do better on space?\n\n" +
        "The key observation: symmetry is a property of a *pair* of subtrees, not of one tree, so we never need to " +
        "build anything — just compare the left subtree against the right subtree directly. Two subtrees mirror when " +
        "their roots match **and** the left's *left* mirrors the right's *right* (the outer pair) **and** the left's " +
        "*right* mirrors the right's *left* (the inner pair). The two recursive calls cross over — that crossing is the " +
        "whole trick.\n\n" +
        "This is the same paired-recursion idea as [Same Tree](/study-guide/algos/problem/same-tree), but with the " +
        "child comparisons flipped.\n\n" +
        "Tracing `[1, 2, 2, 3, 4, 4, 3]` — root `1` with two `2`-subtrees:\n\n" +
        "- **Roots of the pair:** left `2` and right `2` — equal, continue.\n" +
        "- **Outer pair:** left-2's left (`3`) vs right-2's right (`3`) — equal leaves, mirror ✓.\n" +
        "- **Inner pair:** left-2's right (`4`) vs right-2's left (`4`) — equal leaves, mirror ✓.\n\n" +
        "All pairs match, so the tree is symmetric. A value mismatch or a shape mismatch (one child present, the " +
        "other null) at any pair returns `false` immediately.",
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "The mechanic is a structural cross-comparison of two subtrees, which a single scanned lane can't depict — the trace narrates the outer/inner pairing instead.",
        "The base cases carry the shape check: both-null is a match; exactly-one-null is a mismatch (the two sides have different shapes there).",
      ],
    },
  ],

  "binary-tree-vertical-order-traversal": [
    {
      kind: "prose",
      body:
        "Assign the root column `0`; a left child sits one column left (`col - 1`), a right child one column right " +
        "(`col + 1`). The output groups node values by column, left to right, and within a column lists them top to " +
        "bottom. A direct approach does a DFS recording each node's `(column, row)`, then sorts everything into " +
        "buckets at the end.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — DFS collecting (col, row, val), then sort each column by row: O(n log n).",
      source:
        "function verticalOrder(root) {\n" +
        "  const seen = [];\n" +
        "  // Record every node with its column and depth (row).\n" +
        "  const dfs = (node, col, row) => {\n" +
        "    if (!node) return;\n" +
        "    seen.push({ col, row, val: node.val });\n" +
        "    dfs(node.left, col - 1, row + 1);\n" +
        "    dfs(node.right, col + 1, row + 1);\n" +
        "  };\n" +
        "  dfs(root, 0, 0);\n" +
        "  // Group by column; within a column sort by row, then by insertion order.\n" +
        "  const byCol = new Map();\n" +
        "  for (const { col, row, val } of seen) {\n" +
        "    if (!byCol.has(col)) byCol.set(col, []);\n" +
        "    byCol.get(col).push({ row, val });\n" +
        "  }\n" +
        "  return [...byCol.keys()].sort((a, b) => a - b).map((col) =>\n" +
        "    byCol.get(col).sort((a, b) => a.row - b.row).map((e) => e.val));\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This works but the per-column sort makes it O(n log n), and a DFS visits a same-column node out of top-to-" +
        "bottom order, which is why the sort was needed at all. Can we do better?\n\n" +
        "The key observation: the required within-column order — *top to bottom, then left to right on a tie* — is " +
        "**exactly the order a breadth-first traversal visits nodes**. So if we BFS and carry each node's column index, " +
        "appending into per-column buckets, every bucket comes out already correct. No sorting, just a final read from " +
        "the smallest column to the largest. This is the level-order / [queue](/concepts/queues) pattern with an extra " +
        "piece of state riding along.\n\n" +
        "Tracing `[3, 9, 20, null, null, 15, 7]`. BFS visits `3 (col 0)`, `9 (col -1)`, `20 (col 1)`, `15 (col 0)`, " +
        "`7 (col 2)`. The lane below is the BFS *visit order*; each `action` shows which column bucket the value drops " +
        "into:",
    },
    {
      kind: "walkthrough",
      heading: "BFS visit order — each node dropped into its column bucket",
      lane: [3, 9, 20, 15, 7],
      frames: [
        { pointers: [{ name: "bfs", at: 0 }], action: "3 → col 0", caption: "Root enters column 0. Queue its children with cols -1 and +1." },
        { pointers: [{ name: "bfs", at: 1 }], action: "9 → col -1", caption: "Left child of 3: column -1, the leftmost so far." },
        { pointers: [{ name: "bfs", at: 2 }], action: "20 → col 1", caption: "Right child of 3: column +1. Its children will be cols 0 and 2." },
        { pointers: [{ name: "bfs", at: 3 }], action: "15 → col 0", caption: "15 shares column 0 with the root — and BFS reaches it after 3, so it lands below 3 in the bucket." },
        { pointers: [{ name: "bfs", at: 4 }], action: "7 → col 2", caption: "Buckets: col -1=[9], col 0=[3,15], col 1=[20], col 2=[7] → [[9],[3,15],[20],[7]]." },
      ],
    },
  ],

  "construct-binary-tree-from-preorder-and-inorder-traversal": [
    {
      kind: "prose",
      body:
        "Two facts drive the reconstruction. In **preorder** (node, left, right) the very first value is the root. In " +
        "**inorder** (left, node, right) the root splits the array: everything to its left is the left subtree, " +
        "everything to its right is the right subtree. Recurse on each side. A direct version searches inorder for the " +
        "root each time and slices fresh arrays for the recursion.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — linear search for the root + array slicing at every node: O(n²) time and space.",
      source:
        "function buildTree(preorder, inorder) {\n" +
        "  if (preorder.length === 0) return null;\n" +
        "  const rootVal = preorder[0];          // preorder's first value is the root\n" +
        "  const mid = inorder.indexOf(rootVal); // O(n) search splits inorder\n" +
        "  const node = new TreeNode(rootVal);\n" +
        "  // Left subtree: the first `mid` preorder values after the root, and inorder[0..mid).\n" +
        "  node.left = buildTree(preorder.slice(1, mid + 1), inorder.slice(0, mid));\n" +
        "  // Right subtree: the rest.\n" +
        "  node.right = buildTree(preorder.slice(mid + 1), inorder.slice(mid + 1));\n" +
        "  return node;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Correct, but two things make it O(n²): the `indexOf` search at every node, and the `slice` calls that copy " +
        "subarrays. Can we do better?\n\n" +
        "Two optimizations: (1) precompute a **value → inorder-index map** so the split is O(1) instead of a linear " +
        "search; (2) stop slicing — instead, pass the inorder *range* `[lo, hi]` and consume preorder left-to-right " +
        "with a single shared cursor. Because preorder is root, then *all* of the left subtree, then *all* of the " +
        "right, advancing the cursor as we recurse left-first hands each subtree its own root automatically.\n\n" +
        "Tracing `preorder = [3, 9, 20, 15, 7]`, `inorder = [9, 3, 15, 20, 7]`:\n\n" +
        "- **Cursor at `3`** (root). In inorder, `3` is at index 1 → left subtree is inorder `[9]`, right is `[15, 20, 7]`.\n" +
        "- **Recurse left, cursor advances to `9`.** Inorder range is just `[9]` → a leaf. Left and right ranges are empty.\n" +
        "- **Recurse right, cursor advances to `20`.** In inorder, `20` sits between `15` (left) and `7` (right).\n" +
        "- **Cursor `15`** then **`7`** fill `20`'s two leaves. The cursor has walked preorder exactly once.\n\n" +
        "The rebuilt tree is `[3, 9, 20, null, null, 15, 7]`.",
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "The stored solution's `mid` is the root's index *in inorder* (from the precomputed map); `pre` is the shared preorder cursor — there's no lane because the reconstruction is a recursive split, not a scan.",
        "Left-first recursion is essential: it consumes the preorder cursor in the same order the values appear, so each recursive call's first preorder value is its subtree's root.",
      ],
    },
  ],

  "kth-smallest-element-in-a-bst": [
    {
      kind: "prose",
      body:
        "In a binary search tree an **in-order** traversal (left, node, right) visits values in ascending order. So " +
        "the most direct solution does a full in-order walk into an array and returns the element at index `k - 1`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — materialize the full sorted in-order array, then index it: O(n) time and space.",
      source:
        "function kthSmallest(root, k) {\n" +
        "  const sorted = [];\n" +
        "  // In-order traversal of a BST yields values in ascending order.\n" +
        "  const inorder = (node) => {\n" +
        "    if (!node) return;\n" +
        "    inorder(node.left);\n" +
        "    sorted.push(node.val);\n" +
        "    inorder(node.right);\n" +
        "  };\n" +
        "  inorder(root);\n" +
        "  return sorted[k - 1]; // 1-indexed\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n) time, but it always walks the *entire* tree and builds a full array even when `k` is tiny. Can " +
        "we do better?\n\n" +
        "The key observation: we don't need the whole sorted sequence — only its `k`-th element. Walk in-order but " +
        "**count as we go and stop the moment the count hits `k`**. Using an explicit [stack](/concepts/stacks) makes the " +
        "early exit clean: dive left pushing nodes, then pop-and-count; the `k`-th pop is the answer.\n\n" +
        "The lane below is the in-order *output sequence* of the BST `[5, 3, 6, 2, 4, null, null, 1]` — i.e. " +
        "`[1, 2, 3, 4, 5, 6]` — with the counter walking it; we stop at `k = 3`:",
    },
    {
      kind: "walkthrough",
      heading: "in-order output of the BST: [1, 2, 3, 4, 5, 6], counting up to k = 3",
      lane: [1, 2, 3, 4, 5, 6],
      showIndices: true,
      frames: [
        { pointers: [{ name: "count", at: 0 }], action: "pop 1 → count = 1", caption: "Dive to the leftmost node (1). First pop: count 1, not yet k." },
        { pointers: [{ name: "count", at: 1 }], action: "pop 2 → count = 2", caption: "Next in-order value. count 2 < 3, keep going." },
        { pointers: [{ name: "count", at: 2 }], action: "pop 3 → count = 3 = k", caption: "Third pop: count reaches k. Return 3 — the rest of the tree is never visited." },
        { marked: [3, 4, 5], action: "stop early", caption: "Values 4, 5, 6 are never popped: the O(h + k) early exit beats walking all n nodes." },
      ],
    },
  ],

  "lowest-common-ancestor-of-a-binary-tree": [
    {
      kind: "prose",
      body:
        "The lowest common ancestor of `p` and `q` is the deepest node having both somewhere in its subtree (a node " +
        "may be its own ancestor). A direct approach finds the root-to-`p` path and the root-to-`q` path as lists, " +
        "then walks both from the top and returns the last node they share.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — find both root-to-node paths, then compare them for the last common node: O(n) time, O(n) space.",
      source:
        "function lowestCommonAncestor(root, p, q) {\n" +
        "  // Build the list of values from root down to a target.\n" +
        "  const pathTo = (node, target, trail) => {\n" +
        "    if (!node) return null;\n" +
        "    trail.push(node.val);\n" +
        "    if (node.val === target) return [...trail];\n" +
        "    const found = pathTo(node.left, target, trail) || pathTo(node.right, target, trail);\n" +
        "    trail.pop(); // backtrack before trying the sibling\n" +
        "    return found;\n" +
        "  };\n" +
        "  const pathP = pathTo(root, p, []);\n" +
        "  const pathQ = pathTo(root, q, []);\n" +
        "  // The last position where the two paths agree is the LCA.\n" +
        "  let lca = root.val;\n" +
        "  for (let i = 0; i < Math.min(pathP.length, pathQ.length); i++) {\n" +
        "    if (pathP[i] === pathQ[i]) lca = pathP[i];\n" +
        "    else break;\n" +
        "  }\n" +
        "  return lca;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "That's two full traversals plus two stored paths. Can we do it in one pass with no path lists?\n\n" +
        "The key observation: a single post-order recursion can report, for each node, whether `p` or `q` (or their " +
        "join point) lies in its subtree. A node is the LCA exactly when **one target is found in its left subtree and " +
        "the other in its right** — or when the node itself is a target and the other lies below it. Because the " +
        "recursion bubbles up the *first* node that sees both, that node is the lowest such ancestor.\n\n" +
        "Tracing `[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]` with `p = 5`, `q = 1`:\n\n" +
        "- **Left subtree (rooted at 5):** the search finds `5` here → the left call returns non-null (`5`).\n" +
        "- **Right subtree (rooted at 1):** the search finds `1` here → the right call returns non-null (`1`).\n" +
        "- **At the root 3:** both children returned non-null → the targets split across the two sides, so `3` is the LCA.\n\n" +
        "For `p = 5`, `q = 4` instead: `4` lies inside `5`'s subtree, so the recursion finds `5` first (at the top of " +
        "that subtree) and never needs to look deeper — `5` is its own answer.",
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "The mechanic is \"which side did each target come back on\" — a branching decision over subtrees, not a scan, so the trace narrates the bubble-up rather than using a lane.",
        "This reframe returns the LCA node's *value* (values are unique by constraint); LeetCode returns the node itself, but the recursion is identical.",
      ],
    },
  ],

  "binary-tree-maximum-path-sum": [
    {
      kind: "prose",
      body:
        "A path is any chain of nodes connected by parent–child edges; it can start and end anywhere and may *turn* " +
        "at a single node (rise up one child, peak, descend the other). We want the maximum sum over all such paths. " +
        "A brute force fixes each node as the path's peak and explores the best downward run on each side.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — for every node, recompute the best downward arm on each side: O(n²).",
      source:
        "function maxPathSum(root) {\n" +
        "  let best = -Infinity;\n" +
        "  // Best sum of a straight downward path starting at node.\n" +
        "  const downward = (node) => {\n" +
        "    if (!node) return 0;\n" +
        "    const left = Math.max(0, downward(node.left));\n" +
        "    const right = Math.max(0, downward(node.right));\n" +
        "    return node.val + Math.max(left, right);\n" +
        "  };\n" +
        "  // Try every node as the path's turning point (peak).\n" +
        "  const visit = (node) => {\n" +
        "    if (!node) return;\n" +
        "    const left = Math.max(0, downward(node.left));\n" +
        "    const right = Math.max(0, downward(node.right));\n" +
        "    best = Math.max(best, node.val + left + right);\n" +
        "    visit(node.left);\n" +
        "    visit(node.right);\n" +
        "  };\n" +
        "  visit(root);\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This recomputes `downward` from scratch at every node — O(n²). Can we fuse the two passes?\n\n" +
        "The key observation: the downward gain a node needs is computable bottom-up in the *same* traversal that " +
        "updates the global best. So do one post-order pass where each call returns `node.val + max(0, leftGain, " +
        "rightGain)` — the most it can contribute to a parent, which can only descend through *one* child. Separately, " +
        "before returning, update a global best with `node.val + leftGain + rightGain` — the best path that *turns* at " +
        "this node and uses *both* children. Clamping each side at `0` drops a negative arm.\n\n" +
        "Tracing `[-10, 9, 20, null, null, 15, 7]`:\n\n" +
        "- **Leaves 9, 15, 7** return their own values as downward gains (`9`, `15`, `7`).\n" +
        "- **At node 20:** turn-here candidate is `20 + 15 + 7 = 42` → updates the global best to `42`. It returns " +
        "`20 + max(15, 7) = 35` upward.\n" +
        "- **At the root -10:** turn-here candidate is `-10 + max(0, 9) + max(0, 35) = 34` — less than `42`. The negative " +
        "root can't improve on the `15 → 20 → 7` path, so the answer stays **42**.",
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "The model bridge: the recursion returns a *one-sided* downward gain (what a parent can use), while the answer tracks a *two-sided* turn-here sum in the global `best` — two distinct quantities computed at the same node.",
        "Clamping negatives at 0 (`Math.max(0, gain)`) is how a subtree that would only hurt the sum is dropped — equivalent to not extending the path into it.",
        "There's no lane: the value flows *up* the recursion and a global is updated as a side effect, which a single scanned row can't represent.",
      ],
    },
  ],

  "binary-tree-right-side-view": [
    {
      kind: "prose",
      body:
        "Standing to the right of the tree, you see the **last** node on each level. A direct solution does a " +
        "breadth-first traversal collecting every level into its own array, then takes the last value of each.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — full level-order into arrays, then take each level's last element: O(n) time and space.",
      source:
        "function rightSideView(root) {\n" +
        "  if (!root) return [];\n" +
        "  const levels = [];\n" +
        "  let queue = [root];\n" +
        "  while (queue.length) {\n" +
        "    const level = [];\n" +
        "    const next = [];\n" +
        "    for (const node of queue) {\n" +
        "      level.push(node.val);\n" +
        "      if (node.left) next.push(node.left);\n" +
        "      if (node.right) next.push(node.right);\n" +
        "    }\n" +
        "    levels.push(level);\n" +
        "    queue = next;\n" +
        "  }\n" +
        "  return levels.map((level) => level[level.length - 1]); // last of each level\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n) but stores every level in full just to keep one value from each. Can we trim the memory?\n\n" +
        "The key observation: we only need the *last* node of each level, so during the level scan we just push the " +
        "node we happen to be on when it's the final one in the queue — no per-level array needed. This is the " +
        "level-order / [queue](/concepts/queues) pattern, taking one value per level.\n\n" +
        "Note the visible node may be a *left* child if its level has nothing further right. Tracing " +
        "`[1, 2, 3, null, 5, null, 4]` — root `1`; level 1 is `2, 3`; level 2 is `5` (2's right) and `4` (3's right). " +
        "The lane is the BFS visit order; each `action` marks whether the node is its level's last (visible) node:",
    },
    {
      kind: "walkthrough",
      heading: "BFS visit order — the last node of each level is the visible one",
      lane: [1, 2, 3, 5, 4],
      frames: [
        { pointers: [{ name: "scan", at: 0 }], action: "level 0 ends → see 1", caption: "Root is alone on its level, so it's the last — visible." },
        { pointers: [{ name: "scan", at: 1 }], action: "level 1: 2 not last", caption: "2 is the first of level 1; another node (3) follows, so 2 is hidden." },
        { pointers: [{ name: "scan", at: 2 }], action: "level 1 ends → see 3", caption: "3 is the last of level 1 — visible." },
        { pointers: [{ name: "scan", at: 3 }], action: "level 2: 5 not last", caption: "5 is the first of level 2; 4 still follows." },
        { pointers: [{ name: "scan", at: 4 }], action: "level 2 ends → see 4", caption: "4 is the last of level 2 — visible. Right-side view: [1, 3, 4]." },
      ],
    },
  ],

  "maximum-width-of-binary-tree": [
    {
      kind: "prose",
      body:
        "The width of a level is the distance between its leftmost and rightmost *non-null* nodes, counting the empty " +
        "slots that would sit between them in a complete tree. The trick is to give nodes the **heap index** they'd " +
        "have in a complete tree: the root is `i`, its children are `2i` and `2i + 1`. Then a level's width is just " +
        "`rightmostIndex - leftmostIndex + 1`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — BFS pushing null placeholders for missing children, then measure each padded level.",
      source:
        "function widthOfBinaryTree(root) {\n" +
        "  if (!root) return 0;\n" +
        "  let best = 0;\n" +
        "  let queue = [root];\n" +
        "  while (queue.some((node) => node)) {  // stop when a level is all nulls\n" +
        "    // Trim leading/trailing nulls; the span between real ends is the width.\n" +
        "    let lo = 0;\n" +
        "    let hi = queue.length - 1;\n" +
        "    while (queue[lo] === null) lo++;\n" +
        "    while (queue[hi] === null) hi--;\n" +
        "    best = Math.max(best, hi - lo + 1);\n" +
        "    const next = [];\n" +
        "    for (const node of queue) {        // pad both children, even nulls\n" +
        "      next.push(node ? node.left : null, node ? node.right : null);\n" +
        "    }\n" +
        "    queue = next;\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Padding every null doubles the queue each level — on a sparse, deep tree that's exponential blow-up. Can we " +
        "avoid materializing the gaps?\n\n" +
        "The key observation: we never need the empty slots themselves, only the *index arithmetic*. Carry each real " +
        "node's heap index alongside it in the [queue](/concepts/queues); a level's width is the last index minus the " +
        "first plus one. To stop indices from overflowing on deep trees, re-base each level so its first node starts " +
        "at `0` — only the differences matter.\n\n" +
        "Tracing `[1, 3, 2, 5, 3, null, 9]`. Indices (re-based per level): root `1@0`; level 1 is `3@0, 2@1`; level 2 " +
        "is `5@0, 3@1` (under 3) and `9@3` (under 2's right). The lane shows the bottom level's occupied indices — the " +
        "gap at index 2 is the empty slot that widens the span:",
    },
    {
      kind: "walkthrough",
      heading: "bottom level heap indices: 5@0, 3@1, (gap), 9@3 — span 0..3",
      lane: ["5", "3", "·", "9"],
      showIndices: true,
      frames: [
        { pointers: [{ name: "first", at: 0 }], action: "leftmost = index 0", caption: "5 is the level's first real node, at re-based index 0." },
        { pointers: [{ name: "first", at: 0 }, { name: "i", at: 1 }], action: "3 at index 1", caption: "3 (the other child of node 3) sits at index 1." },
        { marked: [2], action: "index 2 empty", caption: "Node 2's left child is null — index 2 is a gap, but it still counts toward the span." },
        { pointers: [{ name: "first", at: 0 }, { name: "last", at: 3 }], action: "width = 3 - 0 + 1 = 4", caption: "9 (node 2's right child) lands at index 3. Leftmost 0, rightmost 3 → width 4." },
      ],
    },
  ],

  "serialize-and-deserialize-binary-tree": [
    {
      kind: "prose",
      body:
        "A codec needs two halves that are perfect inverses: **serialize** turns a tree into a string, **deserialize** " +
        "rebuilds the identical tree from that string. The naive instinct — serialize just the node values in order — " +
        "fails, because values alone don't pin down the *shape*: `[1, 2]` could be `2` as a left child or a right child.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force attempt — values only, no null markers: ambiguous, can't reconstruct the shape.",
      source:
        "// Serializing values without recording the gaps loses the structure.\n" +
        "function serialize(root) {\n" +
        "  const out = [];\n" +
        "  const walk = (node) => { if (!node) return; out.push(node.val); walk(node.left); walk(node.right); };\n" +
        "  walk(root);\n" +
        "  return out.join(',');\n" +
        "}\n" +
        "// '1,2' — was 2 a left child or a right child? Deserialize can't know. Broken.",
    },
    {
      kind: "prose",
      body:
        "The fix is to **record the nulls**. The key observation: a preorder walk that emits a sentinel (say `#`) for " +
        "every absent child captures the shape unambiguously — the sentinels mark exactly where each subtree ends, so " +
        "deserialize can rebuild by consuming the tokens in the same order.\n\n" +
        "Because the sandbox runs one function, the stored solution does the whole round trip in " +
        "`serializeDeserialize(root)`: serialize to the preorder-with-sentinels string, then parse it straight back " +
        "into a tree and return it. A correct codec reproduces the original exactly.\n\n" +
        "Tracing `[1, 2, 3, null, null, 4, 5]` — root `1`, left leaf `2`, right node `3` with children `4, 5`:\n\n" +
        "- **Serialize (preorder):** `1`, then into `2`: `2, #, #` (two null children); then into `3`: `3`, then " +
        "`4, #, #`, then `5, #, #`. String: `1,2,#,#,3,4,#,#,5,#,#`.\n" +
        "- **Deserialize:** read `1` (root), recurse left → read `2`, its two `#`s make it a leaf; recurse right → " +
        "read `3`, then `4` (leaf), then `5` (leaf). The token order *is* the preorder, so the shape comes back exactly.",
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "The sentinel `#` is what carries the structure — without a marker for each null child, the value stream is ambiguous and no deserializer can recover the original shape.",
        "There's no lane: the mechanic is a recursive write/read of a token stream, not a scan over a fixed sequence.",
        "This is the design→single-function reframe: LeetCode ships a two-method `Codec` class, but a round-trip function exercises both halves and is what the harness can run.",
      ],
    },
  ],

  "same-tree": [
    {
      kind: "prose",
      body:
        "Two trees are the same when they have identical shape and every corresponding pair of nodes holds the same " +
        "value. The structure of the check mirrors the structure of a tree: compare the two roots, then recursively " +
        "compare their left subtrees and their right subtrees.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — serialize both trees (with null markers) and compare the strings: O(n) time and space.",
      source:
        "function isSameTree(p, q) {\n" +
        "  // Preorder serialization with '#' for nulls captures both value and shape.\n" +
        "  const encode = (node) =>\n" +
        "    node ? `${node.val},${encode(node.left)},${encode(node.right)}` : '#';\n" +
        "  return encode(p) === encode(q);\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "That's correct, but it builds two full strings before comparing a single character — and it can't stop early " +
        "when the trees differ at the very first node. Can we do better?\n\n" +
        "The key observation: compare the two trees *in lockstep* and short-circuit. At each step, both nodes null " +
        "means this branch matches; exactly one null means the shapes differ; otherwise the values must match and both " +
        "child-pairs must match recursively. The first disagreement returns `false` immediately.\n\n" +
        "Tracing `p = [1, 2, 3]` against `q = [1, 2, 3]`:\n\n" +
        "- **Roots:** both `1` — equal, recurse on both child-pairs.\n" +
        "- **Left pair:** both `2`, and both their children are null-pairs → match.\n" +
        "- **Right pair:** both `3`, likewise → match. Every pair agrees, so the trees are the same.\n\n" +
        "Against `q = [1, 2, null]` the right pair would be `3` vs `null` — one present, one absent — returning " +
        "`false` at that step without touching the rest.",
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "The base cases do the shape check: both-null matches, exactly-one-null is an immediate mismatch.",
        "This is the structural cousin of [Symmetric Tree](/study-guide/algos/problem/symmetric-tree), which compares one tree against its own mirror by crossing the child comparisons; here the comparisons are straight (left-with-left, right-with-right).",
        "No lane — the comparison descends two trees together, which a single scanned row can't show.",
      ],
    },
  ],

  "binary-tree-inorder-traversal": [
    {
      kind: "prose",
      body:
        "In-order traversal visits the left subtree, then the node, then the right subtree. The most direct " +
        "implementation is the literal recursion: recurse left, record the value, recurse right.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — straightforward recursion, appending into a shared array: O(n) time, O(h) stack.",
      source:
        "function inorderTraversal(root) {\n" +
        "  const result = [];\n" +
        "  const visit = (node) => {\n" +
        "    if (!node) return;\n" +
        "    visit(node.left);     // left subtree first\n" +
        "    result.push(node.val); // then the node\n" +
        "    visit(node.right);    // then the right subtree\n" +
        "  };\n" +
        "  visit(root);\n" +
        "  return result;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "The recursion is clean and O(n), but it leans on the call stack — interviewers often ask for it *iteratively*, " +
        "and a very deep tree can overflow that stack. Can we do it without recursion?\n\n" +
        "The key observation: an explicit [stack](/concepts/stacks) can stand in for the call stack. Walk left as far as " +
        "possible, pushing every node; when you can't go left, pop a node, record it (that's the in-order moment), and " +
        "step into its right child. Repeat until both the stack and the current pointer are exhausted.\n\n" +
        "The lane is the in-order *output* of `[1, null, 2, 3]` — root `1`, right child `2`, and `2`'s left child `3` — " +
        "which is `[1, 3, 2]`:",
    },
    {
      kind: "walkthrough",
      heading: "in-order output of [1, null, 2, 3] → [1, 3, 2]",
      lane: [1, 3, 2],
      frames: [
        { pointers: [{ name: "out", at: 0 }], action: "push 1; left is null → pop, record 1", caption: "Start at root 1. No left child, so 1 is recorded first." },
        { pointers: [{ name: "out", at: 0 }], action: "step right to 2, then left to 3", caption: "Move into 1's right (2), then dive left to 3, pushing as we go." },
        { pointers: [{ name: "out", at: 1 }], action: "pop, record 3", caption: "3 has no left child → it's the next in-order value." },
        { pointers: [{ name: "out", at: 2 }], action: "pop, record 2", caption: "Back up to 2 and record it. Result: [1, 3, 2]." },
      ],
    },
  ],

  "validate-binary-search-tree": [
    {
      kind: "prose",
      body:
        "A BST requires that for *every* node, all left-subtree values are smaller and all right-subtree values are " +
        "larger — a global rule, not just parent-to-child. The cleanest brute force leans on that: an in-order " +
        "traversal of a valid BST is strictly increasing, so collect the in-order values and check they're sorted.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — in-order into an array, then verify it's strictly increasing: O(n) time, O(n) space.",
      source:
        "function isValidBST(root) {\n" +
        "  const vals = [];\n" +
        "  const inorder = (node) => {\n" +
        "    if (!node) return;\n" +
        "    inorder(node.left);\n" +
        "    vals.push(node.val);\n" +
        "    inorder(node.right);\n" +
        "  };\n" +
        "  inorder(root);\n" +
        "  // A valid BST's in-order sequence is strictly increasing.\n" +
        "  for (let i = 1; i < vals.length; i++) {\n" +
        "    if (vals[i] <= vals[i - 1]) return false;\n" +
        "  }\n" +
        "  return true;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Correct and O(n), but it materializes the whole value array and can't bail out the instant it sees a " +
        "violation high in the tree. Can we validate in place?\n\n" +
        "The key observation: each node lives inside an open interval `(low, high)` set by its ancestors. Descending " +
        "*left* tightens the upper bound to the parent's value; descending *right* tightens the lower bound. A node is " +
        "valid iff it lies strictly inside its interval — strict comparisons reject duplicates. This catches the " +
        "global-violation case (a node that respects its parent but breaks a distant ancestor's bound) that a naive " +
        "parent-only check misses.\n\n" +
        "Tracing `[5, 1, 4, null, null, 3, 6]` — root `5`, left `1`, right `4` with children `3, 6`:\n\n" +
        "- **Root 5:** interval `(-∞, +∞)` — fine.\n" +
        "- **Left child 1:** interval `(-∞, 5)` — `1 < 5`, fine.\n" +
        "- **Right child 4:** interval `(5, +∞)` — but `4` is **not** `> 5`. Violation: `4` sits in `5`'s right subtree " +
        "yet is smaller than `5`. Return `false` immediately, without inspecting `3` or `6`.",
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "The bound is *inherited*, not local: a node deep in a right subtree must still exceed every ancestor it descended right from — that's why a parent-only check is wrong.",
        "Strict `<`/`>` (not `<=`/`>=`) is what rejects duplicate values, which a BST disallows.",
        "No lane — the validity test threads a shrinking `(low, high)` interval down the recursion, a per-node bound a single scanned row can't carry.",
      ],
    },
  ],

  "container-with-most-water": [
    {
      kind: "prose",
      body:
        "A first pass just measures every pair of lines as the container's two walls and keeps the largest. " +
        "The water a pair holds is `min(height[i], height[j]) × (j − i)` — the **shorter** wall caps the level, " +
        "the gap between them sets the width.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — measure every pair of lines: O(n²).",
      source:
        "function maxArea(height) {\n" +
        "  let best = 0;\n" +
        "  // Try every pair of lines as the container's two walls.\n" +
        "  for (let i = 0; i < height.length; i++) {\n" +
        "    for (let j = i + 1; j < height.length; j++) {\n" +
        "      // Water is capped by the shorter wall, spread over the width between them.\n" +
        "      const area = Math.min(height[i], height[j]) * (j - i);\n" +
        "      best = Math.max(best, area); // keep the largest seen\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n²) — far more work than necessary. Can we do better?\n\n" +
        "Start at the **widest** pair, one line at each end. Width is at its maximum here, so any inward move can " +
        "only *shrink* it. Notice the area is capped by the shorter wall: moving the **taller** wall in keeps that " +
        "same cap while losing width, so it can never improve. The only move that might help is advancing the " +
        "**shorter** wall, hoping to trade a little width for a taller cap.\n\n" +
        "That converging-from-both-ends sweep is the [Two pointers](/study-guide/algos/topic/two-pointers) " +
        "pattern: one O(n) pass that safely discards a wall at every step instead of re-measuring every pair.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "height = [1, 8, 6, 2, 5, 7] — converging two pointers",
      lane: [1, 8, 6, 2, 5, 7],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 5 }],
          action: "min(1,7)·5 = 5 → left shorter, left++",
          caption: "Widest pair: best = 5. The left wall (1) caps it, so move the shorter wall in.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 5 }],
          action: "min(8,7)·4 = 28 → right shorter, right--",
          caption: "best = 28. Now the right wall (7) is the shorter one.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 4 }],
          action: "min(8,5)·3 = 15 → right shorter, right--",
          caption: "A failing move: 15 < 28. Narrower and no taller — keep moving the shorter (right) wall.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 3 }],
          action: "min(8,2)·2 = 4 → right shorter, right--",
          caption: "Still short of 28; the right wall stays the binding constraint.",
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 2 }],
          action: "min(8,6)·1 = 6 → right--, pointers meet",
          caption: "Last pair before they cross. Nothing beat 28. Answer: 28.",
        },
      ],
    },
  ],

  "valid-palindrome": [
    {
      kind: "prose",
      body:
        "The most direct approach normalizes the string — lowercase it and drop every non-alphanumeric character — " +
        "then reverses that cleaned copy and checks whether the two strings are identical. A palindrome reads the " +
        "same forwards and backwards, so it equals its own reverse.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — clean the string, then compare it to its reverse: O(n) time, O(n) space.",
      source:
        "function isPalindrome(s) {\n" +
        "  // Normalize: lowercase, then keep only letters and digits.\n" +
        '  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n' +
        "  // Build the reversed copy and compare the whole strings.\n" +
        '  const reversed = [...cleaned].reverse().join("");\n' +
        "  return cleaned === reversed; // equal iff it's a palindrome\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n) time, but the reversed copy is a second O(n) string we never really need. Can we do better " +
        "on space?\n\n" +
        "Notice that comparing a string to its reverse just pairs up the **first character with the last, the " +
        "second with the second-to-last**, and so on. We can check those pairs directly on the cleaned string with " +
        "two pointers — one at each end, walking inward — which is exactly the " +
        "[Two pointers](/study-guide/algos/topic/two-pointers) converging-ends pattern. The moment a pair " +
        "disagrees we can stop early and return `false`.\n\n" +
        "Cleaning still costs O(n) space here (we keep the cleaned string), but the comparison itself drops to " +
        "O(1) extra and short-circuits on the first mismatch instead of always building a full reversed copy.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: 'cleaned: "abca" — a mismatch (returns false)',
      lane: ["a", "b", "c", "a"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }, { name: "j", at: 3 }],
          action: "'a' == 'a' → i++, j--",
          caption: "The outer pair matches, so move both pointers inward.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "j", at: 2 }],
          action: "'b' != 'c' → return false",
          caption: "The next pair disagrees — stop early, this is not a palindrome.",
        },
      ],
    },
    {
      kind: "walkthrough",
      heading: 'cleaned: "abba" — a palindrome (returns true)',
      lane: ["a", "b", "b", "a"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }, { name: "j", at: 3 }],
          action: "'a' == 'a' → i++, j--",
          caption: "The outer pair matches, so move both pointers inward.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "j", at: 2 }],
          action: "'b' == 'b' → i++, j--",
          caption: "The inner pair matches too; the pointers now cross.",
        },
        {
          pointers: [{ name: "i", at: 2 }, { name: "j", at: 1 }],
          action: "i ≥ j → return true",
          caption: "Every pair matched before the pointers met → it's a palindrome.",
        },
      ],
    },
  ],

  "valid-sudoku": [
    {
      kind: "prose",
      body:
        "The rules are three independent checks, so the plainest approach runs three sweeps. For each of the nine " +
        "rows collect its filled digits and look for a repeat; do the same for each column; then for each of the " +
        "nine `3 x 3` boxes. If any group repeats a digit the board is invalid.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — nine rows + nine columns + nine boxes, each re-scanned: O(1) for 9x9, but three full passes.",
      source:
        "function isValidSudoku(board) {\n" +
        "  // True if a group of cells repeats any digit (ignoring '.').\n" +
        "  const hasDup = (cells) => {\n" +
        "    const seen = new Set();\n" +
        "    for (const d of cells) {\n" +
        "      if (d === '.') continue;       // empty cells never conflict\n" +
        "      if (seen.has(d)) return true;  // digit already in this group\n" +
        "      seen.add(d);\n" +
        "    }\n" +
        "    return false;\n" +
        "  };\n" +
        "  // Pass 1: every row.\n" +
        "  for (let r = 0; r < 9; r++) {\n" +
        "    if (hasDup(board[r])) return false;\n" +
        "  }\n" +
        "  // Pass 2: every column (gather the 9 cells down each column).\n" +
        "  for (let c = 0; c < 9; c++) {\n" +
        "    const col = [];\n" +
        "    for (let r = 0; r < 9; r++) col.push(board[r][c]);\n" +
        "    if (hasDup(col)) return false;\n" +
        "  }\n" +
        "  // Pass 3: every 3x3 box (top-left corners at multiples of 3).\n" +
        "  for (let br = 0; br < 9; br += 3) {\n" +
        "    for (let bc = 0; bc < 9; bc += 3) {\n" +
        "      const box = [];\n" +
        "      for (let r = br; r < br + 3; r++)\n" +
        "        for (let c = bc; c < bc + 3; c++) box.push(board[r][c]);\n" +
        "      if (hasDup(box)) return false;\n" +
        "    }\n" +
        "  }\n" +
        "  return true;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "That works, but it walks the board three separate times and re-derives a fresh `Set` for every group. " +
        "Can we do it in one pass and keep it cleaner?\n\n" +
        "Notice the only thing each group cares about is: *has this digit already appeared in my row, my column, " +
        "or my box?* A repeat is a [duplicate-detection](/study-guide/algos/topic/hash-maps) problem, and a hash " +
        "**set** answers \"have I seen this before?\" in O(1). So we don't need to gather groups at all — we can " +
        "scan the 81 cells once and, at each filled cell, test three memberships at once.\n\n" +
        "Keep three kinds of seen-marker, tagged so they can't collide: `row-r-d`, `col-c-d`, and `box-b-d`, where " +
        "the box index `b = floor(r/3) * 3 + floor(c/3)` (0–8). For a digit `d` at `(r, c)`, if any of its three " +
        "keys is already in the set, that digit repeats in that row, column, or box — return `false` immediately. " +
        "Otherwise add all three keys and move on. The same digit `5` is free to appear all over the board; only a " +
        "*matching* key (same line or same box) is a conflict.\n\n" +
        "The set check is the same one-line `seen.has(...)` for all three rules — no special-casing per group. " +
        "Here's the left-to-right, top-to-bottom scan over a board whose column 0 hides a repeated 5:",
    },
    {
      kind: "gridWalkthrough",
      heading: "scan order: row by row, testing three keys at each filled cell",
      showIndices: true,
      grid: [
        ["5", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["5", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
      ],
      frames: [
        {
          cursor: [0, 0],
          action: "5 @ (0,0) · keys new → add",
          caption: "First filled cell: stamp `row-0-5`, `col-0-5`, and `box-0-5`. All three are new.",
        },
        {
          cursor: [1, 0],
          action: "6 @ (1,0) · keys new → add",
          caption: "Routine: every filled cell stamps its three keys. Column 0 now holds a 5 and a 6.",
        },
        {
          cursor: [1, 5],
          action: "5 @ (1,5) · keys new → add",
          caption: "A second 5 — but row 1, column 5, box 1 are all different from the first 5's groups, so no key collides. The same digit is free to repeat elsewhere.",
        },
        {
          cursor: [3, 0],
          marked: [[0, 0]],
          active: [[1, 0], [2, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]],
          action: "5 @ (3,0) · col-0-5 already seen → false",
          caption: "Down column 0, this 5 matches the 5 at (0,0): `col-0-5` is already in the set. The board is invalid — stop immediately.",
        },
      ],
    },
  ],

  "3sum": [
    {
      kind: "prose",
      body:
        "A first pass just checks every possible triple of numbers and keeps the ones that sum to zero, using a " +
        "set to throw out duplicate triplets.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — every triple, deduped by sorted key: O(n³).",
      source:
        "function threeSum(nums) {\n" +
        "  // A set of triplet keys, so the same triple is never added twice.\n" +
        "  const seen = new Set();\n" +
        "  const res = [];\n" +
        "  // Check every distinct triple of indexes.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      for (let k = j + 1; k < nums.length; k++) {\n" +
        "        if (nums[i] + nums[j] + nums[k] === 0) {\n" +
        "          // Sort the values so [-1,0,1] and [1,-1,0] map to the same key.\n" +
        "          const key = [nums[i], nums[j], nums[k]].sort((a, b) => a - b).join(',');\n" +
        "          if (!seen.has(key)) {\n" +
        "            seen.add(key);\n" +
        "            res.push(key.split(',').map(Number)); // key string -> numbers\n" +
        "          }\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return res;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n³) — far more work than necessary. Can we do better?\n\n" +
        "Notice that if we **fix one number** `nums[i]`, the rest of the job is just finding a *pair* that sums " +
        "to `-nums[i]` — which is exactly the [Two pointers](/study-guide/algos/topic/two-pointers) pair-sum problem.\n\n" +
        "Pair Sum's two-pointer trick only works on a **sorted** array, so sort the input first. Then, for each " +
        "fixed `i`, converge two pointers over the suffix: move `left` up when the pair sum is too small, `right` " +
        "down when it's too large, skipping equal neighbours so duplicates don't slip in.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "sorted: [-4, -1, -1, 0, 1, 2]",
      lane: [-4, -1, -1, 0, 1, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 1 }, { name: "R", at: 5 }],
          action: "-1 + 2 = 1 < 4 → L++",
          caption: "Fix i = -4: we need a pair summing to 4.",
        },
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 4 }, { name: "R", at: 5 }],
          action: "1 + 2 = 3 < 4 → no pair, advance i",
          caption: "Even the two largest values fall short — nothing pairs with -4 to reach 0.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "L", at: 2 }, { name: "R", at: 5 }],
          action: "-1 + 2 = 1 = -nums[i] ✓",
          caption: "Fix i = -1: record the triplet [-1, -1, 2], then move both pointers in.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "L", at: 3 }, { name: "R", at: 4 }],
          action: "0 + 1 = 1 ✓",
          caption: "Another hit: [-1, 0, 1]. Record, move both in. (L and R then cross — this pivot is done.)",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          marked: [2],
          action: "nums[2] == nums[1] → skip",
          caption: "Index 2 is another -1; skip it as a pivot, or we'd emit [-1, -1, 2] and [-1, 0, 1] a second time.",
        },
      ],
    },
  ],

  "geometric-sequence-triplets": [
    {
      kind: "prose",
      body:
        "A first pass checks every index triple `(i, j, k)` with `i < j < k` and counts the ones that step up by the " +
        "ratio `r` — `nums[j] === nums[i] * r` and `nums[k] === nums[j] * r`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — every ordered triple, count the geometric ones: O(n³).",
      source:
        "function geometricTriplets(nums, r) {\n" +
        "  let count = 0;\n" +
        "  // Check every distinct triple of indexes in order.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      for (let k = j + 1; k < nums.length; k++) {\n" +
        "        // A geometric step needs the middle to be i × r and the last to be the middle × r.\n" +
        "        if (nums[j] === nums[i] * r && nums[k] === nums[j] * r) {\n" +
        "          count++; // each qualifying index combination is its own triplet\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return count;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n³) — far more work than necessary. Can we do better?\n\n" +
        "Notice that a triplet is pinned down by its **middle** element. If we fix `nums[j]` as the middle, a valid " +
        "triplet just needs a left partner equal to `nums[j] / r` somewhere *before* `j`, and a right partner equal " +
        "to `nums[j] * r` somewhere *after* `j`. The number of triplets centred on `j` is then simply " +
        "`(# of nums[j]/r on the left) × (# of nums[j]*r on the right)` — every left partner can pair with every " +
        "right partner.\n\n" +
        "Counting *how many* of a given value sit on each side is what a frequency map does in O(1), so this is a " +
        "[Hash map](/study-guide/algos/topic/hash-maps) problem. Keep two maps: `left` (values strictly before `j`) " +
        "and `right` (values strictly after `j`). Seed `right` with the whole array, then sweep `j` left to right — " +
        "before counting, move `nums[j]` out of `right`; after counting, add it into `left`. Because the left partner " +
        "must be the *exact* integer `nums[j] / r`, guard the division with `nums[j] % r === 0`. (The stored " +
        "solution iterates the middle directly and names it `mid` rather than indexing `nums[j]`.)\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [1, 2, 2, 4], r = 2",
      lane: [1, 2, 2, 4],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "j", at: 0 }],
          action: "1 % 2 ≠ 0 → skip",
          caption:
            "right = {2:2, 4:1}, left = {}. Middle 1 would need a left partner of 1/2 — not an integer, so the guard rejects it. Contributes 0.",
        },
        {
          pointers: [{ name: "j", at: 1 }],
          action: "left[1] × right[4] = 1 × 1 = 1",
          caption:
            "left = {1:1}, right = {2:1, 4:1}. Middle 2 needs 2/2 = 1 on the left (one) and 2×2 = 4 on the right (one). count = 1.",
        },
        {
          pointers: [{ name: "j", at: 2 }],
          action: "left[1] × right[4] = 1 × 1 = 1",
          caption:
            "left = {1:1, 2:1}, right = {4:1}. The second 2 is its own middle — same partners (the 1 and the 4), counted again by index. count = 2.",
        },
        {
          pointers: [{ name: "j", at: 3 }],
          action: "left[2] × right[8] = 2 × 0 = 0",
          caption:
            "left = {1:1, 2:2}, right = {}. Middle 4 has two left partners (the 2s) but needs a 4×2 = 8 after it — none exist. Contributes 0.",
        },
        {
          action: "total = 2",
          caption: "Sweep done: triplets (0,1,3) and (0,2,3), one per choice of middle 2. Answer: 2.",
        },
      ],
    },
  ],

  "3sum-closest": [
    {
      kind: "prose",
      body:
        "A first pass just adds up every possible triple of numbers and remembers whichever sum lands nearest the " +
        "target, comparing distances with `Math.abs`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — every triple, track the closest: O(n³).",
      source:
        "function threeSumClosest(nums, target) {\n" +
        "  // Seed the answer with any triple's sum so the first comparison has something to beat.\n" +
        "  let best = nums[0] + nums[1] + nums[2];\n" +
        "  // Check every distinct triple of indexes.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      for (let k = j + 1; k < nums.length; k++) {\n" +
        "        const sum = nums[i] + nums[j] + nums[k];\n" +
        "        // Keep whichever sum sits closer to the target on the number line.\n" +
        "        if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n³) — far more work than necessary. Can we do better?\n\n" +
        "It's the same shape as 3Sum: if we **fix one number** `nums[i]`, the rest of the job is finding the *pair* " +
        "in the suffix whose sum brings `nums[i] + pair` closest to `target` — which is exactly the " +
        "[Two pointers](/study-guide/algos/topic/two-pointers) pair-sum problem.\n\n" +
        "That two-pointer trick only works on a **sorted** array, so sort the input first. For each fixed `i`, " +
        "converge two pointers over the suffix: when the triple sum is below `target` move `left` up to grow it, " +
        "when it's above move `right` down to shrink it. The difference from 3Sum is the goal — instead of waiting " +
        "for an exact zero, we track the smallest `|sum − target|` seen, and return early only if we hit `target` " +
        "exactly.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "sorted: [-4, -1, 1, 2] · target = 1",
      lane: [-4, -1, 1, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 1 }, { name: "R", at: 3 }],
          action: "sum −3 · |−3−1| = 4 → best = −3, −3 < 1 so L++",
          caption: "Fix i = −4. First candidate −3 seeds the best distance.",
        },
        {
          pointers: [{ name: "i", at: 0 }, { name: "L", at: 2 }, { name: "R", at: 3 }],
          action: "sum −1 · |−1−1| = 2 → closer, best = −1, −1 < 1 so L++",
          caption: "Still short of target, so left keeps climbing — but −1 is nearer than −3.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "L", at: 2 }, { name: "R", at: 3 }],
          action: "sum 2 · |2−1| = 1 → closer, best = 2, 2 > 1 so R−−",
          caption: "Fix i = −1: [−1, 1, 2] sums to 2, distance 1 — overshoots, so right would retreat.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "L", at: 2 }, { name: "R", at: 2 }],
          marked: [3],
          action: "L = R → suffix exhausted, no exact hit",
          caption: "Pointers meet; no triple ever equals target. Final answer: the closest sum, 2.",
        },
      ],
    },
  ],

  "trapping-rain-water": [
    {
      kind: "prose",
      body:
        "Water sitting above a bar is capped by `min(tallestLeft, tallestRight) − height`. A first pass just " +
        "computes that directly: for every bar, scan all the way left for the tallest wall and all the way right " +
        "for the tallest wall, then add whatever sits on top.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — for each bar, rescan both sides for the tallest walls: O(n²).",
      source:
        "function trap(height) {\n" +
        "  let water = 0;\n" +
        "  // For each bar, find the walls that bound the water above it.\n" +
        "  for (let i = 0; i < height.length; i++) {\n" +
        "    let left = 0, right = 0;\n" +
        "    // Tallest wall to the left of (and including) bar i.\n" +
        "    for (let j = 0; j <= i; j++) left = Math.max(left, height[j]);\n" +
        "    // Tallest wall to the right of (and including) bar i.\n" +
        "    for (let j = i; j < height.length; j++) right = Math.max(right, height[j]);\n" +
        "    // The shorter wall sets the water level; subtract the bar's own height.\n" +
        "    water += Math.min(left, right) - height[i];\n" +
        "  }\n" +
        "  return water;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n²) — every bar triggers two full rescans for maxima we keep recomputing. Can we do better?\n\n" +
        "The key observation: a bar's water level is set by the **shorter** of its two bounding walls. So if we " +
        "watch from both ends with two pointers and compare the two current bars, the side with the *shorter* bar " +
        "is the one whose answer we can already commit. Whatever taller wall waits beyond the far pointer can only " +
        "*raise* the other side's max, never the shorter side's binding wall — so the shorter side's running max " +
        "is already its true left-or-right wall.\n\n" +
        "That converge-from-both-ends move is the [Two pointers](/study-guide/algos/topic/two-pointers) pattern: " +
        "advance whichever side is shorter, fold its bar into that side's running max, and bank `runningMax − " +
        "height` as trapped water. One linear pass, no rescans, O(1) space.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "height = [3, 0, 1, 0, 5, 2] — move the shorter side",
      lane: [3, 0, 1, 0, 5, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "L", at: 0 }, { name: "R", at: 5 }],
          action: "h[L] 3 ≥ h[R] 2 → Rmax 2, +0, R−−",
          caption:
            "Right bar is the shorter side, so we settle it first. Its running max is just itself (2), so no water — move right inward.",
        },
        {
          pointers: [{ name: "L", at: 0 }, { name: "R", at: 4 }],
          action: "h[L] 3 < h[R] 5 → Lmax 3, +0, L++",
          caption:
            "Now the left bar (3) is the shorter side, so the move flips to the left. Lmax becomes 3; the bar fills its own wall, so +0.",
        },
        {
          pointers: [{ name: "L", at: 1 }, { name: "R", at: 4 }],
          action: "h[L] 0 < h[R] 5 → Lmax 3, +3",
          caption: "A dip below Lmax 3. Add 3 − 0 = 3. Total 3.",
        },
        {
          pointers: [{ name: "L", at: 2 }, { name: "R", at: 4 }],
          action: "h[L] 1 < h[R] 5 → Lmax 3, +2",
          caption: "Add 3 − 1 = 2. Total 5. Lmax is the safe wall — the 5 still parked at R guarantees the right wall is at least as tall.",
        },
        {
          pointers: [{ name: "L", at: 3 }, { name: "R", at: 4 }],
          action: "h[L] 0 < h[R] 5 → Lmax 3, +3",
          caption: "Another dip. Add 3 − 0 = 3. Total 8 — the pointers now meet, so that's the answer.",
        },
      ],
    },
  ],

  "remove-duplicates-from-sorted-array": [
    {
      kind: "prose",
      body:
        "The most direct approach leans on a `Set`: feed every value through it to drop repeats, then copy the " +
        "distinct values back into the front of `nums` and return how many there were. A `Set` preserves " +
        "first-seen order, so the sorted ordering survives.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — collect uniques in a Set, copy back: O(n) time, O(n) extra space.",
      source:
        "function removeDuplicates(nums) {\n" +
        "  // A Set drops duplicates while keeping first-seen (sorted) order.\n" +
        "  const unique = [...new Set(nums)];\n" +
        "  // Write the distinct values back into the front of nums.\n" +
        "  for (let i = 0; i < unique.length; i++) nums[i] = unique[i];\n" +
        "  return unique.length; // the new logical length, k\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n) time, but the `Set` is a whole second copy of the data — O(n) extra space on a problem that " +
        "asks for O(1). Can we do better?\n\n" +
        "The key observation: the array is already **sorted**, so equal values are always *adjacent*. We never " +
        "need a `Set` to spot a duplicate — a value is new exactly when it differs from the one right before it. " +
        "That means we can compact in place with two same-direction pointers walking the array: a slow *write* " +
        "pointer marking the end of the unique prefix, and a fast *read* pointer scanning ahead for the next new " +
        "value. This same-direction slow/fast pairing is the [Two pointers](/study-guide/algos/topic/two-pointers) " +
        "pattern.\n\n" +
        "Seed `slow` at index 0 (the first element is always kept). Each time `fast` lands on a value different " +
        "from `nums[slow]`, advance `slow` and write that value there. The unique count is `slow + 1`.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [0, 0, 1, 1, 2] · highlighted = unique prefix",
      lane: [0, 0, 1, 1, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "slow", at: 0 }, { name: "fast", at: 1 }],
          range: [0, 0],
          action: "nums[fast] 0 == nums[slow] 0 → fast++",
          caption: "A duplicate of the kept value — skip it, slow stays put.",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 2 }],
          range: [0, 1],
          action: "nums[fast] 1 ≠ last kept 0 → ++slow, write nums[slow] = 1",
          caption: "A new value: advance slow and write it, extending the unique prefix to [0, 1].",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 3 }],
          range: [0, 1],
          action: "nums[fast] 1 == nums[slow] 1 → fast++",
          caption: "Another duplicate, this time of the 1 we just kept — skip again.",
        },
        {
          pointers: [{ name: "slow", at: 2 }, { name: "fast", at: 4 }],
          range: [0, 2],
          action: "nums[fast] 2 ≠ last kept 1 → ++slow, write nums[slow] = 2",
          caption: "Last new value written. fast falls off the end next.",
        },
        {
          pointers: [{ name: "slow", at: 2 }],
          range: [0, 2],
          action: "fast past end → return slow + 1 = 3",
          caption: "Prefix [0, 1, 2] holds the distinct values; k = 3.",
        },
      ],
    },
  ],

  "longest-substring-without-repeating-characters": [
    {
      kind: "prose",
      body:
        "The most direct approach takes every substring and checks whether it has a repeated character, keeping " +
        "the length of the longest one that doesn't. Comparing a substring against itself for uniqueness is what " +
        "makes it slow.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test every substring for uniqueness: O(n³).",
      source:
        "function lengthOfLongestSubstring(s) {\n" +
        "  // A substring has no repeat when its set of chars is as big as the substring.\n" +
        "  const allUnique = (str) => new Set(str).size === str.length;\n" +
        "  let best = 0;\n" +
        "  // Try every substring s[i..j] and keep the longest distinct one.\n" +
        "  for (let i = 0; i < s.length; i++) {\n" +
        "    for (let j = i; j < s.length; j++) {\n" +
        "      if (allUnique(s.slice(i, j + 1))) best = Math.max(best, j - i + 1);\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n³) — there are O(n²) substrings and each uniqueness check is O(n). Can we do better?\n\n" +
        "The key observation: as we extend a substring to the right, it stays valid until the *first* repeated " +
        "character. Once a duplicate appears, every substring that keeps the earlier copy is also invalid — so " +
        "instead of restarting, we can just move the left edge *past* that earlier copy. That's a " +
        "[sliding window](/study-guide/algos/topic/sliding-window): a window `[start, i]` that always holds " +
        "distinct characters.\n\n" +
        "To know *where* the earlier copy was, store each character's most recent index in a map. When `s[i]` was " +
        "last seen at some index `>= start`, that copy is inside the window, so jump `start` to one past it. The " +
        "answer is the widest `i - start + 1` seen.\n\n" +
        "*(The walkthrough below frames the window as `left`/`right`; in the stored solution `right` is the loop " +
        "index `i` and `left` is `start` — same window, different names.)*\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: 's = "abcabcbb" — window [start, i], start jumps past the last duplicate',
      lane: ["a", "b", "c", "a", "b", "c", "b", "b"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 2 }],
          range: [0, 2],
          action: 'best = 3',
          caption: 'Window "abc" — all distinct. lastSeen = {a:0, b:1, c:2}.',
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 3 }],
          range: [1, 3],
          marked: [0],
          action: '"a" last seen at 0 ≥ start → start = 1',
          caption: 'right = 3 is "a", whose last index 0 sits in the window — jump start past it to 1.',
        },
        {
          pointers: [{ name: "left", at: 2 }, { name: "right", at: 4 }],
          range: [2, 4],
          marked: [0, 1],
          action: '"b" last seen at 1 ≥ start → start = 2',
          caption: 'right = 4 is "b" (last at 1, in-window) → start jumps to 2. Window "cab", still width 3.',
        },
        {
          pointers: [{ name: "left", at: 6 }, { name: "right", at: 6 }],
          range: [6, 6],
          marked: [0, 1, 2, 3, 4, 5],
          action: '"b" last seen at 4 ≥ start → start = 6',
          caption: 'right = 6 is "b" again (last at 4) → start leaps to 6. The window collapses to one char.',
        },
        {
          pointers: [{ name: "left", at: 7 }, { name: "right", at: 7 }],
          range: [7, 7],
          marked: [0, 1, 2, 3, 4, 5, 6],
          action: '"b" last seen at 6 ≥ start → start = 7',
          caption: "The trailing run of b's keeps width at 1. Nothing beat the early \"abc\". Final best = 3.",
        },
      ],
    },
  ],

  "find-all-anagrams-in-a-string": [
    {
      kind: "prose",
      body:
        "An anagram of `p` is just a window of `s` with the same letter counts as `p`. The most direct approach " +
        "slides a length-`p.length` window across `s` and, at each position, recomputes the window's counts from " +
        "scratch and compares them to `p`'s.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — recount each window from scratch: O(n · k) with a fresh count per window.",
      source:
        "function findAnagrams(s, p) {\n" +
        "  const result = [];\n" +
        "  // Letter counts that p requires.\n" +
        "  const need = {};\n" +
        "  for (const c of p) need[c] = (need[c] ?? 0) + 1;\n" +
        "  // Try every window of width p.length.\n" +
        "  for (let i = 0; i + p.length <= s.length; i++) {\n" +
        "    // Recount this whole window, then compare to need.\n" +
        "    const have = {};\n" +
        "    for (let j = i; j < i + p.length; j++) have[s[j]] = (have[s[j]] ?? 0) + 1;\n" +
        "    const isAnagram = Object.keys(need).length === Object.keys(have).length &&\n" +
        "      Object.keys(need).every((c) => need[c] === have[c]);\n" +
        "    if (isAnagram) result.push(i);\n" +
        "  }\n" +
        "  return result;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Rebuilding the window's counts every step throws away work — consecutive windows differ by only **one " +
        "letter in and one letter out**. Can we do better?\n\n" +
        "Keep a single `have` count and update it incrementally: as the window advances, increment the entering " +
        "letter and decrement the leaving one. That's a fixed-size " +
        "[sliding window](/study-guide/algos/topic/sliding-window) of width `p.length`.\n\n" +
        "Comparing all 26 counts each step would still cost O(26) per window. So track one number, `matches` — how " +
        "many of the 26 letter-counts currently *agree* with `p`. Each letter that enters or leaves changes only " +
        "its own slot, so `matches` is nudged up or down in O(1). The window is an anagram exactly when " +
        "`matches === 26`.\n\n" +
        "*(In the walkthrough `right` is the entering index and `left = right - p.length` is the leaving index — " +
        "the same two edges the stored solution uses.)*\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: 's = "cbaebabacd", p = "abc" — width-3 window, need {a:1, b:1, c:1}',
      lane: ["c", "b", "a", "e", "b", "a", "b", "a", "c", "d"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 2 }],
          range: [0, 2],
          action: "have {c:1,b:1,a:1} → matches = 26 ✓ push 0",
          caption: 'First full window "cba" — every count agrees with "abc". Record start index 0.',
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 3 }],
          range: [1, 3],
          marked: [0],
          action: '"e" enters, "c" leaves → matches < 26',
          caption: 'Window "bae" — the stray "e" (and missing "c") break the match. Not an anagram.',
        },
        {
          pointers: [{ name: "left", at: 4 }, { name: "right", at: 6 }],
          range: [4, 6],
          marked: [0, 1, 2, 3],
          action: 'have {b:2,a:1} → matches < 26',
          caption: 'Window "bab" has two b\'s and no c — counts disagree, skip.',
        },
        {
          pointers: [{ name: "left", at: 6 }, { name: "right", at: 8 }],
          range: [6, 8],
          marked: [0, 1, 2, 3, 4, 5],
          action: "have {b:1,a:1,c:1} → matches = 26 ✓ push 6",
          caption: 'Window "bac" matches again — record start index 6.',
        },
        {
          pointers: [{ name: "left", at: 7 }, { name: "right", at: 9 }],
          range: [7, 9],
          marked: [0, 1, 2, 3, 4, 5, 6],
          action: '"d" enters → matches < 26',
          caption: 'Last window "acd" — "d" isn\'t in "abc". Result: [0, 6].',
        },
      ],
    },
  ],

  "longest-repeating-character-replacement": [
    {
      kind: "prose",
      body:
        "We may rewrite up to `k` characters; we want the longest run we can turn into a single repeated letter. " +
        "The most direct approach tries every substring and asks whether it can be made uniform: keep the most " +
        "common letter in it and replace the rest, which is feasible when the count of *other* letters is `<= k`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test every substring's replaceability: O(n³).",
      source:
        "function characterReplacement(s, k) {\n" +
        "  let best = 0;\n" +
        "  // Try every substring s[i..j].\n" +
        "  for (let i = 0; i < s.length; i++) {\n" +
        "    for (let j = i; j < s.length; j++) {\n" +
        "      // Count letters in this substring to find the most frequent one.\n" +
        "      const count = {};\n" +
        "      let maxFreq = 0;\n" +
        "      for (let m = i; m <= j; m++) {\n" +
        "        count[s[m]] = (count[s[m]] ?? 0) + 1;\n" +
        "        maxFreq = Math.max(maxFreq, count[s[m]]);\n" +
        "      }\n" +
        "      const len = j - i + 1;\n" +
        "      // Replaceable when the non-dominant letters fit within the k budget.\n" +
        "      if (len - maxFreq <= k) best = Math.max(best, len);\n" +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Re-counting every substring is O(n³). Can we do better?\n\n" +
        "The replaceability test for a window is `windowLength - maxFreq <= k`, where `maxFreq` is the count of " +
        "its most frequent letter. That's a property of a contiguous run — so use a " +
        "[sliding window](/study-guide/algos/topic/sliding-window) and maintain the letter counts incrementally " +
        "as the edges move, instead of rebuilding them.\n\n" +
        "Grow `right` each step. When `windowLength - maxFreq > k` the window is too costly to make uniform, so " +
        "advance `left` by **one** — and that's the elegant part: we never need to shrink more than one step, " +
        "because we only care about the *largest* window ever seen. The width is monotonically non-decreasing, so " +
        "the final `right - left + 1` is the answer. (We let `maxFreq` go stale when `left` moves; a bigger answer " +
        "would require an even bigger `maxFreq`, so this never overcounts.)\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: 's = "AABABBA", k = 1 — grow right; left nudges forward when cost > k',
      lane: ["A", "A", "B", "A", "B", "B", "A"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 2 }],
          range: [0, 2],
          action: "len 3, maxFreq 2 (A) → 3−2 = 1 ≤ 1 ✓ best = 3",
          caption: '"AAB": replace the single B → all A. Cost 1 fits the budget.',
        },
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 3 }],
          range: [0, 3],
          action: "len 4, maxFreq 3 (A) → 4−3 = 1 ≤ 1 ✓ best = 4",
          caption: '"AABA": three A\'s, one B to replace. Still within k = 1. best grows to 4.',
        },
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 4 }],
          range: [0, 4],
          action: "len 5, maxFreq 3 → 5−3 = 2 > 1 ✗ left++",
          caption: '"AABAB": now two B\'s must change — over budget. Slide left one step.',
        },
        {
          pointers: [{ name: "left", at: 1 }, { name: "right", at: 4 }],
          range: [1, 4],
          marked: [0],
          action: "len 4 ≤ best, keep scanning",
          caption: "Window width holds at 4 (left moved once, right once). best stays 4.",
        },
        {
          pointers: [{ name: "left", at: 3 }, { name: "right", at: 6 }],
          range: [3, 6],
          marked: [0, 1, 2],
          action: "len 4, maxFreq stays 3 → 4−3 = 1 ≤ 1 ✓",
          caption: 'left kept pace with right, holding width 4 (maxFreq is the stale 3, which never overcounts). Final best = 4.',
        },
      ],
    },
  ],

  "minimum-window-substring": [
    {
      kind: "prose",
      body:
        "The brute force tests every substring for coverage of `t` — O(n²·m). The optimization is a variable " +
        "window with a *need* count: expand `right` to cover required characters, then once the window covers " +
        "all of `t`, **contract** `left` as far as it stays valid, recording the smallest valid window seen.",
    },
    {
      kind: "prose",
      body:
        "The trick is one `missing` counter: decrement it only when a still-needed character gets covered, and " +
        "the window is valid exactly when `missing === 0` — no re-scanning the counts each step. O(n).",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test every substring for coverage: O(n²·m).",
      source:
        "function minWindow(s, t) {\n" +
        "  // Does this window contain every character t needs, counting repeats?\n" +
        "  const covers = (win) => {\n" +
        "    const need = new Map();\n" +
        "    for (const c of t) need.set(c, (need.get(c) ?? 0) + 1); // what t requires\n" +
        "    for (const c of win) if (need.has(c)) need.set(c, need.get(c) - 1); // what win supplies\n" +
        "    return [...need.values()].every((v) => v <= 0); // every requirement met\n" +
        "  };\n" +
        '  let best = "";\n' +
        "  // Try every substring; keep the shortest one that still covers t.\n" +
        "  for (let i = 0; i < s.length; i++) {\n" +
        "    for (let j = i + 1; j <= s.length; j++) {\n" +
        "      const win = s.slice(i, j);\n" +
        '      if (covers(win) && (best === "" || win.length < best.length)) best = win;\n' +
        "    }\n" +
        "  }\n" +
        "  return best;\n" +
        "}",
    },
  ],

  "two-sum": [
    {
      kind: "prose",
      body:
        "The most direct approach checks every pair of numbers: for each index `i`, walk every later index " +
        "`j` and test whether `nums[i] + nums[j]` equals `target`. The first matching pair is the answer, " +
        "and because `j` always starts after `i` the two indices come out in ascending order for free.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test every pair: O(n²).",
      source:
        "function twoSum(nums, target) {\n" +
        "  // Try every distinct pair (i, j) with i < j.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      // First pair that hits target wins; i < j keeps indices ascending.\n" +
        "      if (nums[i] + nums[j] === target) return [i, j];\n" +
        "    }\n" +
        "  }\n" +
        "  return []; // problem guarantees a solution, so this is unreachable\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n²) — for each element we rescan the whole rest of the array. Can we do better?\n\n" +
        "The inner loop is really asking one narrow question: *have I already seen the number that completes " +
        "this pair?* For a value `x`, that partner is exactly `target − x` — there is only **one** number that " +
        "works. So instead of scanning for it, we can remember every value we've passed in a hash map keyed by " +
        "value, and look the partner up in O(1).\n\n" +
        "Storing `value → index` lets that lookup also hand back *where* the partner was, which is what we need " +
        "to return. This is the core [hash maps](/study-guide/algos/topic/hash-maps) trick: trade O(n) space for " +
        "O(1) membership-and-recall, collapsing the nested scan into a single pass.\n\n" +
        "One pass suffices if we check **before** we insert: at index `i` we ask whether `target − nums[i]` is " +
        "already stored, and only then add `nums[i]` ourselves. Checking first means we never pair an element " +
        "with itself, and the stored partner is always at an earlier index — so `[seen, i]` is already ascending.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [3, 8, 2, 7, 5], target = 9 — one-pass seen-map",
      lane: [3, 8, 2, 7, 5],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }],
          action: "need 9 − 3 = 6 → not seen, store 3 → seen = {3:0}",
          caption: "Partner of 3 is 6; nothing stored yet, so record value 3 at index 0.",
        },
        {
          pointers: [{ name: "i", at: 1 }],
          marked: [0],
          action: "need 9 − 8 = 1 → not seen, store 8 → seen = {3:0, 8:1}",
          caption: "A miss: 1 was never seen. Add value 8 at index 1 and move on.",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          marked: [0, 1],
          action: "need 9 − 2 = 7 → not seen, store 2 → seen = {3:0, 8:1, 2:2}",
          caption: "Still no partner — 7 hasn't appeared. Record value 2 at index 2.",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          marked: [0, 1, 2],
          action: "need 9 − 7 = 2 → seen at index 2 → return [2, 3]",
          caption: "Hit: the partner 2 was stored back at index 2. The pair is [2, 3], already ascending.",
        },
      ],
    },
  ],

  "set-matrix-zeroes": [
    {
      kind: "prose",
      body:
        "We can't zero a cell's row and column the instant we see a `0` — those freshly written zeros would " +
        "look like original zeros to the rest of the scan and cascade outward, eventually wiping the whole " +
        "matrix. The fix is to **decide first, write second**: one pass records *which* rows and *which* " +
        "columns contain a zero into two sets, and a second pass zeroes a cell only if its row or column was " +
        "marked. No write can corrupt a decision, because every decision is already made.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — two sets remember the marked rows and columns: O(m·n) time, O(m + n) space.",
      source:
        "function setZeroes(matrix) {\n" +
        "  const zeroRows = new Set();\n" +
        "  const zeroCols = new Set();\n" +
        "  // Pass 1: only *record* which rows and columns had a zero — write nothing yet.\n" +
        "  for (let i = 0; i < matrix.length; i++) {\n" +
        "    for (let j = 0; j < matrix[0].length; j++) {\n" +
        "      if (matrix[i][j] === 0) {\n" +
        "        zeroRows.add(i);\n" +
        "        zeroCols.add(j);\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  // Pass 2: zero a cell iff its row or column was marked — decisions are frozen.\n" +
        "  for (let i = 0; i < matrix.length; i++) {\n" +
        "    for (let j = 0; j < matrix[0].length; j++) {\n" +
        "      if (zeroRows.has(i) || zeroCols.has(j)) matrix[i][j] = 0;\n" +
        "    }\n" +
        "  }\n" +
        "  return matrix;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This runs in O(m·n) time, which is optimal — we have to look at every cell at least once. But the two " +
        "sets cost O(m + n) extra space. Can we do better on space?\n\n" +
        "The key observation: the matrix already contains `m + n` cells we could repurpose as marker storage — " +
        "its **first row and first column**. Let `matrix[0][j]` stand in for `zeroCols.has(j)` and `matrix[i][0]` " +
        "for `zeroRows.has(i)`. Scanning the *interior* (rows and columns from index 1), whenever a cell is `0` " +
        "we stamp a `0` into its column's header `matrix[0][j]` and its row's header `matrix[i][0]`. That is the " +
        "[hash maps](/study-guide/algos/topic/hash-maps) marker idea — membership flags — pushed down to O(1) " +
        "extra space by storing the flags inside the data itself.\n\n" +
        "The catch is the first row and first column overlap at `matrix[0][0]` and double as both data and " +
        "markers, so we can't let them encode their own fate. We track *those two* with a pair of booleans " +
        "(`firstRowZero`, `firstColZero`) scanned up front, mark and apply the interior from the headers, then " +
        "zero the first row and first column **last** from the two booleans. So the stored solution keeps the " +
        "two-pass *decide-then-write* spine of the brute force; it just swaps the two `Set`s for the matrix's " +
        "own border plus two flags.\n\n" +
        "Here's that marker scan on a 3x4 grid — the highlighted **border** holds the flags; watch interior zeros " +
        "stamp their row and column headers, then the apply pass clear every flagged cell:",
    },
    {
      kind: "gridWalkthrough",
      heading: "matrix = [[1,2,3,4],[5,0,7,8],[9,1,2,0]] — border row/column store the flags",
      showIndices: true,
      grid: [
        [1, 2, 3, 4],
        [5, 0, 7, 8],
        [9, 1, 2, 0],
      ],
      frames: [
        {
          active: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [2, 0]],
          action: "firstRowZero = false · firstColZero = false",
          caption: "Neither the first row nor the first column holds an original zero, so the border (highlighted) is free to repurpose as marker storage.",
        },
        {
          grid: [
            [1, 0, 3, 4],
            [0, 0, 7, 8],
            [9, 1, 2, 0],
          ],
          cursor: [1, 1],
          marked: [[0, 1], [1, 0]],
          action: "0 @ (1,1) → stamp headers (0,1) and (1,0)",
          caption: "Interior zero at (1,1): write 0 into its column header (0,1) and its row header (1,0). The data zero stays put.",
        },
        {
          grid: [
            [1, 0, 3, 0],
            [0, 0, 7, 8],
            [0, 1, 2, 0],
          ],
          cursor: [2, 3],
          marked: [[0, 3], [2, 0]],
          action: "0 @ (2,3) → stamp headers (0,3) and (2,0)",
          caption: "Second interior zero at (2,3) stamps header (0,3) and (2,0). The border now flags rows 1, 2 and columns 1, 3.",
        },
        {
          grid: [
            [1, 0, 3, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ],
          marked: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3]],
          action: "apply: zero each interior cell with a flagged header",
          caption: "Second pass clears every interior cell whose row or column header is 0. Both border flags were false, so the first row and column keep their non-marker values — the matrix is done.",
        },
      ],
    },
  ],

  "longest-consecutive-sequence": [
    {
      kind: "prose",
      body:
        "The most direct way to find the longest run of consecutive values is to **sort** the array, then walk it " +
        "once: every time the next value is exactly one more than the previous, the current run grows; otherwise " +
        "the run resets. Track the longest run seen. Sorting lines the values up so consecutive numbers sit next " +
        "to each other, and a single pass measures every run.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — sort, then scan for the longest consecutive run: O(n log n).",
      source:
        "function longestConsecutive(nums) {\n" +
        "  if (nums.length === 0) return 0;\n" +
        "  // Sort so consecutive values become adjacent.\n" +
        "  const sorted = [...nums].sort((a, b) => a - b);\n" +
        "  let longest = 1;\n" +
        "  let run = 1;\n" +
        "  for (let i = 1; i < sorted.length; i++) {\n" +
        "    if (sorted[i] === sorted[i - 1]) continue; // duplicate counts once\n" +
        "    if (sorted[i] === sorted[i - 1] + 1) {\n" +
        "      run++; // extends the current run\n" +
        "    } else {\n" +
        "      run = 1; // gap — start a fresh run\n" +
        "    }\n" +
        "    longest = Math.max(longest, run);\n" +
        "  }\n" +
        "  return longest;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n log n) — the sort dominates, and the prompt asks for O(n). Can we do better than sorting?\n\n" +
        "The only reason we sorted was to ask *\"is the next number present?\"* — but a hash set answers exactly " +
        "that in O(1), no ordering required. Dump every value into a `Set` (which also drops duplicates for free), " +
        "and consecutiveness becomes a membership test: a run containing `n` simply means `n`, `n+1`, `n+2`, … are " +
        "all in the set.\n\n" +
        "The key observation that keeps this linear: **only start counting a run from its smallest value** — a value " +
        "`n` whose predecessor `n - 1` is *absent* from the set. Any value in the middle of a run has its predecessor " +
        "present, so we skip it rather than re-walking the same run from the inside. That guard means each run is " +
        "walked exactly once, and across all runs every value is visited at most twice — so despite the nested-looking " +
        "while loop, the total work is O(n). This trading of O(n) space for O(1) lookups is the core " +
        "[hash maps](/study-guide/algos/topic/hash-maps) move.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "set of nums = [100, 4, 200, 1, 3, 2] — walk forward only from run starts",
      lane: [100, 4, 200, 1, 3, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "n", at: 0 }],
          action: "has(99)? no → run start; has(101)? no",
          caption: "100 is a run start (99 absent), but 101 is missing too — a lone run of length 1.",
        },
        {
          pointers: [{ name: "n", at: 1 }],
          marked: [1],
          action: "has(3)? yes → skip",
          caption: "A skip step: 4 has predecessor 3 in the set, so it sits inside a run — don't start here.",
        },
        {
          pointers: [{ name: "n", at: 3 }],
          action: "has(0)? no → run start",
          caption: "1 is a run start (0 absent). Begin walking forward: length = 1, look for 2.",
        },
        {
          pointers: [{ name: "n", at: 3 }, { name: "current", at: 1 }],
          marked: [3, 5, 4, 1],
          action: "has(2),has(3),has(4) ✓ → length 4; has(5)? no",
          caption: "Walk 1 → 2 → 3 → 4 (all present, scattered across the lane), stop at the missing 5. Run length 4. longest = 4.",
        },
        {
          pointers: [{ name: "n", at: 4 }],
          marked: [4],
          action: "has(2)? yes → skip",
          caption: "3 has predecessor 2 present — skip. Same for 2 (1 present). They were already counted by the walk.",
        },
      ],
    },
  ],

  "reverse-linked-list": [
    {
      kind: "prose",
      body:
        "The most direct approach sidesteps pointer surgery entirely: walk the list collecting the values into " +
        "an array, then build a brand-new list from that array read back-to-front.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — collect values, rebuild reversed: O(n) time, O(n) extra space.",
      source:
        "function reverseList(head) {\n" +
        "  // Walk once, copying every value into an array.\n" +
        "  const values = [];\n" +
        "  for (let node = head; node; node = node.next) {\n" +
        "    values.push(node.val);\n" +
        "  }\n" +
        "  // Build a fresh list from the values, last value first.\n" +
        "  let newHead = null;\n" +
        "  for (const val of values) {\n" +
        "    newHead = new ListNode(val, newHead); // prepend → reverses order\n" +
        "  }\n" +
        "  return newHead;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This works, but it allocates a whole second list plus the values array — O(n) extra space for a problem " +
        "that's really just *relinking* nodes we already have. Can we do better?\n\n" +
        "The key observation: reversing a list means flipping the direction of every `next` pointer. Node by " +
        "node, `1 -> 2 -> 3` becomes `1 <- 2 <- 3`. We don't need new nodes at all — we can rewire the existing " +
        "ones in a single pass.\n\n" +
        "The catch is that the moment we set `curr.next = prev`, we've destroyed the link to the *rest* of the " +
        "list. So before flipping, stash `curr.next` in a temporary `next`. Carry three pointers — `prev` (the " +
        "reversed part so far, starting at `null`), `curr` (the node being flipped), and the saved `next` — and " +
        "slide them forward together.\n\n" +
        "Walking it through on `1 -> 2 -> 3`:",
    },
    {
      kind: "listWalkthrough",
      heading: "reversing 1 -> 2 -> 3 in place",
      nodes: [1, 2, 3],
      frames: [
        {
          pointers: [{ name: "prev", at: null }, { name: "curr", at: 0 }],
          action: "save next = 2; curr.next = prev",
          caption: "Start: prev = null, curr = node 1. Stash node 1's next (node 2), then flip node 1's link to null.",
        },
        {
          pointers: [{ name: "prev", at: 0 }, { name: "curr", at: 1 }],
          links: { 0: null },
          action: "save next = 3; curr.next = prev",
          caption: "Slide forward: prev = node 1, curr = node 2. Node 1 now points at null. Flip node 2's link back to node 1.",
        },
        {
          pointers: [{ name: "prev", at: 1 }, { name: "curr", at: 2 }],
          links: { 0: null, 1: 0 },
          action: "save next = null; curr.next = prev",
          caption: "prev = node 2, curr = node 3. Node 2 points back at node 1. Flip node 3's link back to node 2.",
        },
        {
          pointers: [{ name: "prev", at: 2 }, { name: "curr", at: null }],
          links: { 0: null, 1: 0, 2: 1 },
          action: "curr = null → stop",
          caption: "curr fell off the end. Every link now faces backward: 3 -> 2 -> 1 -> null. prev (node 3) is the new head.",
        },
      ],
    },
  ],

  "remove-nth-node-from-end-of-list": [
    {
      kind: "prose",
      body:
        "Counting from the *end* is awkward in a singly linked list — you can only walk forward. The obvious fix " +
        "is two passes: walk once to measure the length `L`, then walk again to the `(L - n)`-th node (the one " +
        "just before the target) and splice the target out.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — measure length, then walk to the predecessor: two passes, O(L).",
      source:
        "function removeNthFromEnd(head, n) {\n" +
        "  // First pass: count the nodes.\n" +
        "  let length = 0;\n" +
        "  for (let node = head; node; node = node.next) length++;\n" +
        "  // A dummy before the head lets us delete the head uniformly.\n" +
        "  const dummy = new ListNode(0, head);\n" +
        "  // Second pass: stop on the node just before the target.\n" +
        "  let prev = dummy;\n" +
        "  for (let i = 0; i < length - n; i++) prev = prev.next;\n" +
        "  prev.next = prev.next.next; // skip the target\n" +
        "  return dummy.next;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Two passes is fine — O(L) — but interviewers usually want the *one-pass* version, which also reveals a " +
        "reusable trick. Can we find the predecessor without first knowing `L`?\n\n" +
        "The key observation: fix a **gap** between two pointers. If `fast` is exactly `n + 1` nodes ahead of " +
        "`slow`, then when `fast` walks off the end, `slow` is sitting `n + 1` from the end — i.e. on the node " +
        "*just before* the one to remove. This is the [Two pointers](/study-guide/algos/topic/two-pointers) " +
        "gap technique applied to nodes.\n\n" +
        "Start both at a `dummy` before the head, advance `fast` by `n + 1`, then move both together until `fast` " +
        "is null. One splice and we're done.\n\n" +
        "**Note on the model:** the stored solution opens the gap with the loop `for (i = 0; i <= n; i++) fast = " +
        "fast.next` — that's `n + 1` iterations, the same `n + 1` gap described here. Walking it through on " +
        "`1 -> 2 -> 3 -> 4 -> 5` with `n = 2` (remove the `4`):",
    },
    {
      kind: "listWalkthrough",
      heading: "remove 2nd-from-end of 1 -> 2 -> 3 -> 4 -> 5",
      nodes: ["d", 1, 2, 3, 4, 5],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "slow", at: 0 }, { name: "fast", at: 0 }],
          caption: "Both start on the dummy `d` (index 0). We'll open a gap of n + 1 = 3 between them.",
        },
        {
          pointers: [{ name: "slow", at: 0 }, { name: "fast", at: 3 }],
          action: "advance fast n + 1 = 3 steps",
          caption: "fast jumps to node 3 (value 3). The gap from slow to fast is now 3 nodes.",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 4 }],
          action: "move both together",
          caption: "Lockstep step 1: slow → value 1, fast → value 4. The gap is preserved.",
        },
        {
          pointers: [{ name: "slow", at: 2 }, { name: "fast", at: 5 }],
          action: "move both together",
          caption: "Lockstep step 2: slow → value 2, fast → value 5 (the last node).",
        },
        {
          pointers: [{ name: "slow", at: 3 }, { name: "fast", at: null }],
          action: "fast = null → splice",
          caption: "fast fell off the end. slow sits on value 3 — exactly the node before the target.",
        },
        {
          pointers: [{ name: "slow", at: 3 }],
          links: { 3: 5 },
          marked: [4],
          action: "slow.next = slow.next.next",
          caption: "Skip node 4 by relinking value 3 straight to value 5. Result: 1 -> 2 -> 3 -> 5.",
        },
      ],
    },
  ],

  "palindrome-linked-list": [
    {
      kind: "prose",
      body:
        "A palindrome reads the same both ways, so the simplest check copies every value into an array and " +
        "compares it against its reverse with two indices closing in from the ends.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — dump to an array, compare ends inward: O(n) time, O(n) extra space.",
      source:
        "function isPalindrome(head) {\n" +
        "  // Copy the values out so we can index from both ends.\n" +
        "  const values = [];\n" +
        "  for (let node = head; node; node = node.next) values.push(node.val);\n" +
        "  // Two pointers converging — the classic palindrome check.\n" +
        "  let left = 0;\n" +
        "  let right = values.length - 1;\n" +
        "  while (left < right) {\n" +
        "    if (values[left] !== values[right]) return false;\n" +
        "    left++;\n" +
        "    right--;\n" +
        "  }\n" +
        "  return true;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "That's a clean O(n) check, but it spends O(n) extra space on the array. Can we do better and use O(1) " +
        "space, working on the list itself?\n\n" +
        "The key observation: to compare the front half against the back half we need to read the back half " +
        "*forward*. A list only goes one way — so **reverse the back half in place**, then walk the two halves " +
        "toward the middle.\n\n" +
        "Two sub-techniques combine here, both from the [Two pointers](/study-guide/algos/topic/two-pointers) " +
        "toolkit: **fast/slow** finds the midpoint (`fast` moves two nodes per one of `slow`, so when `fast` " +
        "hits the end, `slow` is at the middle), and the three-pointer **reversal** flips the second half. Then " +
        "compare the original front with the reversed back in lockstep.\n\n" +
        "**Note on the model:** in the stored solution `slow` does double duty — first as the midpoint finder, " +
        "then it's consumed by the reversal loop, leaving `prev` as the head of the reversed back half (the " +
        "`right` walker below). Walking it through on `1 -> 2 -> 2 -> 1`:",
    },
    {
      kind: "listWalkthrough",
      heading: "is 1 -> 2 -> 2 -> 1 a palindrome?",
      nodes: [1, 2, 2, 1],
      frames: [
        {
          pointers: [{ name: "slow", at: 0 }, { name: "fast", at: 0 }],
          caption: "Both start at the head. fast will move twice as fast as slow to locate the midpoint.",
        },
        {
          pointers: [{ name: "slow", at: 1 }, { name: "fast", at: 2 }],
          action: "slow += 1, fast += 2",
          caption: "One step: slow → index 1, fast → index 2. fast.next is the last node, so the loop stops next.",
        },
        {
          pointers: [{ name: "slow", at: 2 }, { name: "fast", at: null }],
          active: [2, 3],
          action: "fast off end → slow at 2nd half",
          caption: "slow lands at index 2, the start of the back half (indices 2..3). Now reverse from here.",
        },
        {
          pointers: [{ name: "right", at: 3 }, { name: "left", at: 0 }],
          links: { 3: 2 },
          active: [2, 3],
          action: "reverse back half",
          caption: "The back half is reversed: index 3 now points to index 2. `right` heads it; `left` is the original head.",
        },
        {
          pointers: [{ name: "left", at: 0 }, { name: "right", at: 3 }],
          links: { 3: 2 },
          action: "1 == 1 ✓, then 2 == 2 ✓",
          caption: "Compare in lockstep: left value 1 == right value 1, then 2 == 2. The reversed half ends — all matched → palindrome.",
        },
      ],
    },
  ],

  "intersection-of-two-linked-lists": [
    {
      kind: "prose",
      body:
        "Two lists *intersect* when, from some node on, they share the exact same tail. The brute-force check is " +
        "the nested one: for every node in list A, walk all of list B looking for the same node (here, the same " +
        "position in the shared suffix).",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — for each A-node, scan all of B: O(m × n).",
      source:
        "function getIntersectionValue(a, b, skipA, skipB) {\n" +
        "  if (skipA < 0 || skipB < 0) return null; // no merge\n" +
        "  // For each node in A, look for a matching shared-suffix node in B.\n" +
        "  for (let i = 0; i < a.length; i++) {\n" +
        "    for (let j = 0; j < b.length; j++) {\n" +
        "      // Same node iff both sit in the shared suffix at the same offset.\n" +
        "      if (i >= skipA && j >= skipB && i - skipA === j - skipB) {\n" +
        "        return a[i]; // first such match is the intersection\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return null;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "The nested scan is O(m × n). Can we do better?\n\n" +
        "The key observation: if the lists merge, they share a common *tail*, so they have the same number of " +
        "nodes *after* the intersection. The only thing in the way is that the two lists can have different " +
        "lengths before the merge, so a node at distance `d` from head A isn't at distance `d` from head B.\n\n" +
        "The elegant fix is the **length-alignment** [two-pointer](/study-guide/algos/topic/two-pointers) walk: " +
        "send pointer `pa` through A *then* B, and `pb` through B *then* A. Each covers `m + n` nodes total, so " +
        "after the switch they're aligned and arrive at the first shared node on the same step (or both hit " +
        "`null` together if there's no merge). No length pre-count, O(1) space.\n\n" +
        "**Note on the model:** this page is the array-encoded form of the classic node-identity problem (a node " +
        "is `(list, index)`, the same node when both lie in the shared suffix at the same offset). The encoding " +
        "makes the first shared node's value simply `a[skipA]`, so the stored solution returns that directly — " +
        "but the alignment walk below is the idea you'd run on real shared nodes.\n\n" +
        "*(Two lists sharing a tail aren't a single chain, so a node-chain diagram would misrepresent them — the " +
        "alignment is shown as a trace instead.)* Take A = `4 -> 1 -> 8 -> 4 -> 5` (length 5) and " +
        "B = `5 -> 6 -> 1 -> 8 -> 4 -> 5` (length 6), sharing the tail `8 -> 4 -> 5`:",
    },
    {
      kind: "prose",
      body:
        "- **Step 0** — `pa` at A's head (`4`), `pb` at B's head (`5`). pa is 2 nodes before the shared `8`; pb is 3 before it. Misaligned by the length gap (6 − 5 = 1).\n" +
        "- **pa reaches A's end** after 5 steps and **switches to B's head**. pb reaches B's end after 6 steps and **switches to A's head**. Each has now walked 5 + 6 = 11 nodes.\n" +
        "- From the switch, `pa` is 3 nodes into the combined walk's second leg and `pb` is 2 — and because each will walk the *other* list's prefix, the leftover distance to the shared `8` is now identical for both.\n" +
        "- **They meet** on the same physical node — the first shared `8`. That's the intersection. (Had the lists not merged, both would reach `null` on the same step and we'd report no intersection.)",
    },
  ],

  "search-insert-position": [
    {
      kind: "prose",
      body:
        "The plain approach scans left to right and stops at the first element that is `>= target` — that index " +
        "either holds the target or is the slot it belongs in. If nothing is large enough, it belongs at the end.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — linear scan for the first index >= target: O(n).",
      source:
        "function searchInsert(nums, target) {\n" +
        "  // Walk left to right; the first slot not smaller than target is the answer.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    if (nums[i] >= target) return i; // found it, or the gap it slots into\n" +
        "  }\n" +
        "  return nums.length; // larger than everything — goes at the end\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n) — but the array is *sorted*, and the prompt demands O(log n), so the scan wastes the " +
        "ordering. Can we do better?\n\n" +
        "The values `< target` form a prefix and the values `>= target` form a suffix; we want the **boundary** " +
        "between them. That's a textbook **lower-bound** binary search: keep a half-open range `[lo, hi)`, and at " +
        "each step look at `mid`. If `nums[mid] < target`, the boundary is strictly to the right, so `lo = mid + 1`; " +
        "otherwise `mid` is a *candidate* boundary, so `hi = mid` to keep it. When `lo === hi`, `lo` is the first " +
        "index whose value is `>= target` — the insertion point.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [1, 3, 5, 6], target = 2",
      lane: [1, 3, 5, 6],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "lo", at: 0 }, { name: "hi", at: 4 }],
          range: [0, 3],
          action: "mid = 2, nums[2] = 5 >= 2 → hi = 2",
          caption: "Range is [0, 4). nums[2] = 5 is not below 2, so the boundary is at index 2 or to its left — keep mid.",
        },
        {
          pointers: [{ name: "lo", at: 0 }, { name: "hi", at: 2 }],
          range: [0, 1],
          marked: [2, 3],
          action: "mid = 1, nums[1] = 3 >= 2 → hi = 1",
          caption: "Now [0, 2). nums[1] = 3 is still not below 2 — discard the right half again.",
        },
        {
          pointers: [{ name: "lo", at: 0 }, { name: "hi", at: 1 }],
          range: [0, 0],
          marked: [1, 2, 3],
          action: "mid = 0, nums[0] = 1 < 2 → lo = 1",
          caption: "nums[0] = 1 is below 2, so index 0 is too small — push lo past it.",
        },
        {
          pointers: [{ name: "lo", at: 1 }, { name: "hi", at: 1 }],
          range: [1, 1],
          marked: [0, 2, 3],
          action: "lo === hi → return 1",
          caption: "The range is empty. 2 belongs at index 1, between 1 and 3.",
        },
      ],
    },
  ],

  "find-first-and-last-position-of-element-in-sorted-array": [
    {
      kind: "prose",
      body:
        "The direct approach scans the whole array, remembering the first and last index where the value equals " +
        "the target. If it never appears, the answer is `[-1, -1]`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — one linear pass tracking first and last match: O(n).",
      source:
        "function searchRange(nums, target) {\n" +
        "  let first = -1;\n" +
        "  let last = -1;\n" +
        "  // Scan every index; record the first hit, and keep overwriting the last hit.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    if (nums[i] === target) {\n" +
        "      if (first === -1) first = i; // first time we see the target\n" +
        "      last = i;                    // every later hit pushes last forward\n" +
        "    }\n" +
        "  }\n" +
        "  return [first, last];\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n), but the prompt requires O(log n) and the array is sorted — equal values sit in one " +
        "contiguous block. Can we do better?\n\n" +
        "We want the two *ends* of that block, and each end is a **boundary**. The first occurrence is the " +
        "lower bound: the first index whose value is `>= target`. The last occurrence is one step before the " +
        "*upper* bound: the first index whose value is `> target`, minus one. So run the same " +
        "[boundary search](/study-guide/algos/topic/binary-search) twice — once for `target`, once for " +
        "`target + 1` — and bracket the run.\n\n" +
        "If the lower bound lands past the array or on a value that isn't the target, the target is absent and the " +
        "answer is `[-1, -1]`.\n\n" +
        "Walking through the lower-bound search for the first occurrence:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [5, 7, 7, 8, 8, 10], target = 8",
      lane: [5, 7, 7, 8, 8, 10],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "lo", at: 0 }, { name: "hi", at: 6 }],
          range: [0, 5],
          action: "mid = 3, nums[3] = 8 >= 8 → hi = 3",
          caption: "Lower bound of 8 in [0, 6). nums[3] = 8 is a candidate first occurrence — keep it.",
        },
        {
          pointers: [{ name: "lo", at: 0 }, { name: "hi", at: 3 }],
          range: [0, 2],
          marked: [3, 4, 5],
          action: "mid = 1, nums[1] = 7 < 8 → lo = 2",
          caption: "Now [0, 3). nums[1] = 7 is below 8, so the first 8 is to the right — push lo past it.",
        },
        {
          pointers: [{ name: "lo", at: 2 }, { name: "hi", at: 3 }],
          range: [2, 2],
          marked: [0, 1, 4, 5],
          action: "mid = 2, nums[2] = 7 < 8 → lo = 3",
          caption: "nums[2] = 7 is still below 8 — the first 8 must be at index 3.",
        },
        {
          pointers: [{ name: "lo", at: 3 }, { name: "hi", at: 3 }],
          range: [3, 3],
          marked: [0, 1, 2, 4, 5],
          action: "lo === hi → first = 3",
          caption: "First occurrence is index 3. A second search for 9's lower bound returns 5, so last = 5 − 1 = 4.",
        },
      ],
    },
  ],

  "search-in-rotated-sorted-array": [
    {
      kind: "prose",
      body:
        "The obvious approach ignores the rotation entirely and scans every element until it finds the target, " +
        "returning its index or `-1`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — linear scan, rotation ignored: O(n).",
      source:
        "function search(nums, target) {\n" +
        "  // Check each position in turn; the rotation doesn't matter to a linear scan.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    if (nums[i] === target) return i;\n" +
        "  }\n" +
        "  return -1; // not present\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n) and throws away all the structure — the prompt wants O(log n). Can we do better?\n\n" +
        "The array isn't globally sorted, but a rotation has a key property: at *any* midpoint, **at least one " +
        "half is fully sorted** (the pivot can only sit in one of them). Compare `nums[lo]` to `nums[mid]` to " +
        "learn which half is the clean, sorted one. Then check whether `target` falls inside that sorted half's " +
        "value range: if so, search there; if not, the target must be in the other half. Either way we discard " +
        "half each step — ordinary [binary search](/study-guide/algos/topic/binary-search), just with a " +
        "which-half-is-sorted test layered on top.\n\n" +
        "This uses the inclusive `lo <= hi` exact-match shape (returning `mid` on a hit), not the half-open " +
        "boundary form — we want a specific value, not a boundary.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
      lane: [4, 5, 6, 7, 0, 1, 2],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "lo", at: 0 }, { name: "mid", at: 3 }, { name: "hi", at: 6 }],
          action: "nums[lo]=4 <= nums[mid]=7 → left half sorted; 0 not in [4,7) → lo = 4",
          caption: "mid = 3 (value 7). The left half [4,5,6,7] is sorted, but 0 isn't inside its range — so search the right.",
        },
        {
          pointers: [{ name: "lo", at: 4 }, { name: "mid", at: 5 }, { name: "hi", at: 6 }],
          marked: [0, 1, 2, 3],
          action: "nums[lo]=0 <= nums[mid]=1 → left half sorted; 0 in [0,1) → hi = 4",
          caption: "Now [4, 6], mid = 5 (value 1). The left half [0,1] is sorted and 0 falls in [0,1) — discard the right.",
        },
        {
          pointers: [{ name: "lo", at: 4 }, { name: "mid", at: 4 }, { name: "hi", at: 4 }],
          marked: [0, 1, 2, 3, 5, 6],
          action: "nums[mid] = 0 === target ✓ → return 4",
          caption: "Range collapses to index 4, whose value is exactly 0. Found at index 4.",
        },
        {
          pointers: [{ name: "lo", at: 0 }, { name: "mid", at: 3 }, { name: "hi", at: 6 }],
          action: "(absent target 3) right half [0,1,2] sorted; 3 not in (7,2] → hi = 2 … eventually lo > hi → -1",
          caption: "Had the target been 3, every half-check would exclude it and the pointers would cross, returning -1.",
        },
      ],
    },
  ],

  "median-of-two-sorted-arrays": [
    {
      kind: "prose",
      body:
        "The straightforward approach merges the two sorted arrays into one — a two-pointer walk taking the " +
        "smaller front each time — then reads the middle value (odd total) or averages the two middle values " +
        "(even total).",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — merge fully, then pick the middle: O(m + n) time and space.",
      source:
        "function findMedianSortedArrays(nums1, nums2) {\n" +
        "  const merged = [];\n" +
        "  let i = 0;\n" +
        "  let j = 0;\n" +
        "  // Standard merge: repeatedly take the smaller of the two fronts.\n" +
        "  while (i < nums1.length && j < nums2.length) {\n" +
        "    if (nums1[i] <= nums2[j]) merged.push(nums1[i++]);\n" +
        "    else merged.push(nums2[j++]);\n" +
        "  }\n" +
        "  while (i < nums1.length) merged.push(nums1[i++]); // drain the leftovers\n" +
        "  while (j < nums2.length) merged.push(nums2[j++]);\n" +
        "  const n = merged.length;\n" +
        "  const mid = Math.floor(n / 2);\n" +
        "  // Odd total -> the single middle; even total -> average the two middles.\n" +
        "  return n % 2 === 1 ? merged[mid] : (merged[mid - 1] + merged[mid]) / 2;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(m + n) — and the merge is the slow part. The classic target is **O(log(m + n))**. Can we do " +
        "better?\n\n" +
        "The median only depends on a *partition*: a cut through each array so that everything on the left is `<=` " +
        "everything on the right, with the left side holding exactly `half` of the combined elements. We never " +
        "merge — we only need the values straddling that cut. And a cut in one array *forces* the cut in the other " +
        "(their left sizes must sum to `half`), so there is only **one** free choice: **binary-search the cut in " +
        "the smaller array**.\n\n" +
        "At each candidate cut, look at the four boundary values. Matching the stored solution's names: `cut1` is " +
        "the count taken from `nums1`, so `left1 = nums1[cut1 - 1]` and `right1 = nums1[cut1]` (and likewise " +
        "`left2` / `right2` in `nums2`), with sentinels `−∞` / `+∞` for an empty side. The cut is correct when " +
        "`maxLeft = max(left1, left2)` is `<=` `minRight = min(right1, right2)`; otherwise the offending side tells " +
        "you which way to shift — and you discard *half* the remaining cut positions, the same as a binary search " +
        "over a sorted array.\n\n" +
        "In the diagram below, the **top axis** is that binary search itself: the candidate range `[lo, hi]` for " +
        "`cut1`, halved each step as the probe `mid` lands (note `cut1` jumps `2 → 4 → 3`, not `+1` at a time). The " +
        "**two rows** show the partition that `cut1` — and the forced `cut2 = half − cut1` — induce, with `│` " +
        "marking each cut; the **strip** under each step is the derived `maxLeft ≤ minRight` check that decides " +
        "which half to keep:",
    },
    {
      kind: "partitionWalkthrough",
      heading: "nums1 = [1, 5, 8, 12, 18], nums2 = [2, 4, 9, 11, 15, 20] — binary-search cut1 in the smaller array",
      showIndices: true,
      rows: [
        { label: "nums1", values: [1, 5, 8, 12, 18] },
        { label: "nums2", values: [2, 4, 9, 11, 15, 20] },
      ],
      frames: [
        {
          cuts: [2, 4],
          search: { lo: 0, hi: 5 },
          action: "left2 = 11 > right1 = 8 → lo = cut1 + 1",
          caption: "half = 6, so the combined left side needs 6 values. cut1 ranges over [0, 5]; probe the midpoint cut1 = 2 → {1, 5} from nums1 and {2, 4, 9, 11} from nums2. But 11 sits left of 8 — nums2 gives up too much, so discard the lower half: lo = 3.",
        },
        {
          cuts: [4, 2],
          search: { lo: 3, hi: 5 },
          action: "left1 = 12 > right2 = 9 → hi = cut1 − 1",
          caption: "Now cut1 ∈ [3, 5]; probe cut1 = 4 → {1, 5, 8, 12} and {2, 4}. This time 12 is left of 9 — nums1 over-contributes, so discard the upper half: hi = 3.",
        },
        {
          cuts: [3, 3],
          search: { lo: 3, hi: 3 },
          action: "left1 ≤ right2 and left2 ≤ right1 → valid",
          caption: "The range collapses to cut1 = 3 → {1, 5, 8} and {2, 4, 9} on the left. Now every left value is ≤ every right value — the cut is correct.",
        },
        {
          cuts: [3, 3],
          search: { lo: 3, hi: 3 },
          action: "odd total → median = maxLeft = max(8, 9) = 9",
          caption: "11 elements in total (odd), so the median is the largest left-side value, maxLeft = max(8, 9) = 9. Merged, the arrays are [1, 2, 4, 5, 8, 9, 11, 12, 15, 18, 20].",
        },
      ],
    },
  ],

  "search-a-2d-matrix": [
    {
      kind: "prose",
      body:
        "The simplest approach scans every cell of the matrix, row by row, and returns `true` the moment it sees " +
        "the target — `false` if it finishes without finding it.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — scan all m×n cells: O(m·n).",
      source:
        "function searchMatrix(matrix, target) {\n" +
        "  // Look at every cell; the matrix's structure is ignored here.\n" +
        "  for (const row of matrix) {\n" +
        "    for (const value of row) {\n" +
        "      if (value === target) return true;\n" +
        "    }\n" +
        "  }\n" +
        "  return false;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(m·n) and ignores the strong ordering: each row is sorted, and every row starts above where " +
        "the previous row ended. Can we do better?\n\n" +
        "That ordering means the rows, read end to end, form **one fully sorted sequence** of length `m·n`. So " +
        "treat the matrix as a *virtual* sorted array and run plain " +
        "[binary search](/study-guide/algos/topic/binary-search) over the flat indices `0 … m·n − 1`. Map a flat " +
        "index `k` back to a cell with `matrix[Math.floor(k / n)][k % n]` (row = `k ÷ n`, column = `k mod n`), and " +
        "compare as usual. Each step halves the m·n cells, giving **O(log(m·n))**.\n\n" +
        "Walking it through over the flattened view:",
    },
    {
      kind: "walkthrough",
      heading: "flattened [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60], target = 16 (3×4 matrix)",
      lane: [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "lo", at: 0 }, { name: "mid", at: 5 }, { name: "hi", at: 11 }],
          action: "mid = 5 → matrix[1][1] = 11 < 16 → lo = 6",
          caption: "Flat index 5 maps to row 1, col 1 (value 11). 11 < 16, so discard the left half.",
        },
        {
          pointers: [{ name: "lo", at: 6 }, { name: "mid", at: 8 }, { name: "hi", at: 11 }],
          marked: [0, 1, 2, 3, 4, 5],
          action: "mid = 8 → matrix[2][0] = 23 > 16 → hi = 7",
          caption: "Now [6, 11], mid = 8 maps to row 2, col 0 (value 23). 23 > 16, so discard the right half.",
        },
        {
          pointers: [{ name: "lo", at: 6 }, { name: "mid", at: 6 }, { name: "hi", at: 7 }],
          marked: [0, 1, 2, 3, 4, 5, 8, 9, 10, 11],
          action: "mid = 6 → matrix[1][2] = 16 === target ✓ → return true",
          caption: "Flat index 6 maps to row 1, col 2 (value 16) — exactly the target. Found in three steps.",
        },
        {
          pointers: [{ name: "lo", at: 0 }, { name: "mid", at: 5 }, { name: "hi", at: 11 }],
          action: "(absent target 13) every comparison excludes it; lo passes hi → return false",
          caption: "Had we searched 13, no flat index would match and the range would empty out, returning false.",
        },
      ],
    },
  ],

  "find-peak-element": [
    {
      kind: "prose",
      body:
        "The direct approach scans for any element strictly greater than both of its neighbors, treating the " +
        "out-of-bounds neighbors as `-∞`, and returns its index.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — scan for an element bigger than both neighbors: O(n).",
      source:
        "function findPeakElement(nums) {\n" +
        "  const n = nums.length;\n" +
        "  for (let i = 0; i < n; i++) {\n" +
        "    // Out-of-bounds neighbors count as -Infinity, so the ends only beat their one real neighbor.\n" +
        "    const left = i === 0 ? -Infinity : nums[i - 1];\n" +
        "    const right = i === n - 1 ? -Infinity : nums[i + 1];\n" +
        "    if (nums[i] > left && nums[i] > right) return i; // a peak\n" +
        "  }\n" +
        "  return -1; // unreachable: a peak always exists\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n), but the prompt demands O(log n) — and the array isn't sorted, so what is there to halve? " +
        "Can we do better?\n\n" +
        "The key observation: **follow the rising slope and you can't miss a peak.** Look at `mid` and its right " +
        "neighbor. If `nums[mid] < nums[mid + 1]`, the values are climbing rightward — since the far-right edge " +
        "drops off to `-∞`, *some* peak must lie to the right, so move `lo = mid + 1`. Otherwise the slope falls " +
        "(or `mid` is itself a peak), and a peak lies at `mid` or to its left, so `hi = mid`. This is the half-open " +
        "[boundary search](/study-guide/algos/topic/binary-search) shape, applied to a *monotonic predicate* " +
        "(\"is the slope still rising?\") rather than to sorted values.\n\n" +
        "When `lo === hi` the range is a single index, and the inward-sloping boundaries guarantee it's a peak.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [1, 2, 1, 3, 5, 6, 4]",
      lane: [1, 2, 1, 3, 5, 6, 4],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "lo", at: 0 }, { name: "mid", at: 3 }, { name: "hi", at: 6 }],
          action: "nums[3]=3 < nums[4]=5 → slope rising → lo = 4",
          caption: "mid = 3. The value to the right is larger, so we're on a rising slope — a peak lies to the right.",
        },
        {
          pointers: [{ name: "lo", at: 4 }, { name: "mid", at: 5 }, { name: "hi", at: 6 }],
          range: [4, 6],
          marked: [0, 1, 2, 3],
          action: "nums[5]=6 > nums[6]=4 → slope falling → hi = 5",
          caption: "Now [4, 6], mid = 5. The value to the right is smaller — the slope falls, so a peak is at 5 or left of it.",
        },
        {
          pointers: [{ name: "lo", at: 4 }, { name: "mid", at: 4 }, { name: "hi", at: 5 }],
          range: [4, 5],
          marked: [0, 1, 2, 3, 6],
          action: "nums[4]=5 < nums[5]=6 → slope rising → lo = 5",
          caption: "mid = 4 (value 5) is below its right neighbor — still rising, so move past it.",
        },
        {
          pointers: [{ name: "lo", at: 5 }, { name: "hi", at: 5 }],
          range: [5, 5],
          marked: [0, 1, 2, 3, 4, 6],
          action: "lo === hi → return 5",
          caption: "The range collapses to index 5 (value 6), which beats both neighbors — a peak. (Index 1 is also a peak; either is accepted.)",
        },
      ],
    },
  ],

  "cutting-wood": [
    {
      kind: "prose",
      body:
        "The direct approach tries every possible blade height from the tallest tree downward, summing the wood " +
        "each height yields, and returns the first (highest) height that reaches `k`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — try every height from the tallest down: O(M·n), M = tallest tree.",
      source:
        "function cutWood(heights, k) {\n" +
        "  const max = Math.max(...heights);\n" +
        "  // Try blade heights from tallest down; the first that yields >= k is the answer.\n" +
        "  for (let h = max; h >= 0; h--) {\n" +
        "    let wood = 0;\n" +
        "    for (const height of heights) wood += Math.max(0, height - h); // wood above the blade\n" +
        "    if (wood >= k) return h;\n" +
        "  }\n" +
        "  return 0;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(M·n) — and when trees are billions tall, `M` is huge. The trees aren't sorted, so what is " +
        "there to binary-search? Can we do better?\n\n" +
        "The trick is to **binary-search the answer, not the input.** The wood collected is *monotonic* in the " +
        "blade height: raise the blade and you collect strictly less (never more). So the candidate heights split " +
        "cleanly into a feasible low range (`wood >= k`) and an infeasible high range, with one boundary between " +
        "them — exactly the [monotonic-predicate](/study-guide/algos/topic/binary-search) setup. Search heights " +
        "in `[0, max]`: for a candidate `mid`, sum `max(0, h − mid)` over all trees in O(n); if that's `>= k`, the " +
        "blade can go at least this high, so record it and search higher; otherwise search lower.\n\n" +
        "That replaces the M outer steps with `log M`, giving **O(n log M)**.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "heights = [2, 6, 3, 8], k = 7 (searching blade height in [0, 8])",
      lane: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "lo", at: 0 }, { name: "mid", at: 4 }, { name: "hi", at: 8 }],
          action: "H = 4 → wood = 2 + 0 + 4 = 6 < 7 → hi = 3",
          caption: "The lane is the candidate heights 0..8. At H = 4 the wood is (6−4)+(8−4) = 6 < 7 — infeasible, so go lower.",
        },
        {
          pointers: [{ name: "lo", at: 0 }, { name: "mid", at: 1 }, { name: "hi", at: 3 }],
          marked: [4, 5, 6, 7, 8],
          action: "H = 1 → wood = 1 + 5 + 2 + 7 = 15 >= 7 → best = 1, lo = 2",
          caption: "Now [0, 3], H = 1 yields 15 ≥ 7 — feasible. Record 1 as the best so far and search higher.",
        },
        {
          pointers: [{ name: "lo", at: 2 }, { name: "mid", at: 2 }, { name: "hi", at: 3 }],
          marked: [0, 1, 4, 5, 6, 7, 8],
          action: "H = 2 → wood = 0 + 4 + 1 + 6 = 11 >= 7 → best = 2, lo = 3",
          caption: "H = 2 yields 11 ≥ 7 — still feasible. Update best to 2 and keep climbing.",
        },
        {
          pointers: [{ name: "lo", at: 3 }, { name: "mid", at: 3 }, { name: "hi", at: 3 }],
          marked: [0, 1, 2, 4, 5, 6, 7, 8],
          action: "H = 3 → wood = 0 + 3 + 0 + 5 = 8 >= 7 → best = 3, lo = 4 > hi → stop",
          caption: "H = 3 yields 8 ≥ 7 — feasible, best = 3. lo passes hi, so 3 is the highest blade that still collects 7.",
        },
      ],
    },
  ],

  "valid-parentheses": [
    {
      kind: "prose",
      body:
        "The brittle first idea is to *strip matched pairs* repeatedly: scan for an adjacent `()`, `[]`, or `{}`, " +
        "delete it, and start over, until the string stops shrinking. If you end at the empty string it was " +
        "balanced. It works, but each deletion rescans the whole string.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — repeatedly delete adjacent matched pairs until stable: O(n²).",
      source:
        "function isValid(s) {\n" +
        "  let prev;\n" +
        "  // Keep deleting innermost pairs until the string stops changing.\n" +
        "  do {\n" +
        "    prev = s;\n" +
        "    s = s.replace('()', '').replace('[]', '').replace('{}', '');\n" +
        "  } while (s !== prev);\n" +
        "  // Balanced iff everything cancelled away.\n" +
        "  return s.length === 0;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Each `replace` rescans the string and we may loop O(n) times, so this is O(n²) — and the string copying " +
        "makes it worse. Can we do better?\n\n" +
        "The key observation: a closer must always match the **most recently opened** still-unclosed bracket. " +
        "“Most recent, handled first” is the definition of a **stack**. Push every opener; on a closer, the top " +
        "of the stack *must* be its matching opener — pop it. A mismatch, or a closer with an empty stack, is an " +
        "immediate `false`. After one pass the stack must be empty (no dangling openers).\n\n" +
        "One left-to-right scan, O(1) work per character. Walking it through on a string that nests then breaks:",
    },
    {
      kind: "walkthrough",
      heading: "s = \"([)]\" — a wrong-order mismatch",
      lane: ["(", "[", ")", "]"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }],
          action: "'(' opener → push",
          caption: "An opener: remember it. Stack (bottom→top): [ ( ].",
        },
        {
          pointers: [{ name: "i", at: 1 }],
          action: "'[' opener → push",
          caption: "Another opener nests inside. Stack: [ (, [ ].",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          action: "')' closer, top is '[' → mismatch, return false",
          caption: "The closer ')' wants '(' on top, but the most-recent opener is '[' — the nesting order is broken.",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          marked: [0, 1, 3],
          action: "short-circuit → false",
          caption: "We never reach index 3. The single mismatch is enough to reject the whole string.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "A *contrasting* valid string like `\"{[]}\"` would push `{`, push `[`, then meet `]` (top `[` ✓, pop), then `}` (top `{` ✓, pop), ending with an empty stack — balanced.",
      ],
    },
  ],

  "next-larger-element": [
    {
      kind: "prose",
      body:
        "The obvious approach: for each index, walk *forward* until you hit a strictly larger value, and record " +
        "it (or `-1` if you fall off the end).",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — scan the suffix for each element: O(n²).",
      source:
        "function nextLargerToRight(nums) {\n" +
        "  const answer = new Array(nums.length).fill(-1);\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    // Look rightward for the first value that beats nums[i].\n" +
        "    for (let j = i + 1; j < nums.length; j++) {\n" +
        "      if (nums[j] > nums[i]) { answer[i] = nums[j]; break; }\n" +
        "    }\n" +
        "  }\n" +
        "  return answer;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "On a sorted-descending input every suffix scan runs to the end, so this is O(n²). Can we do better?\n\n" +
        "The key observation: when we reach a value, it can *immediately answer every earlier value it exceeds* — " +
        "and those earlier values are exactly the ones still waiting, in decreasing order. Holding “elements " +
        "still waiting for a larger neighbour, most-recent on top” is a **[monotonic stack](/study-guide/algos/topic/stacks)**.\n\n" +
        "Keep a stack of *indices* whose values decrease down the stack. For each new value, pop every waiting " +
        "index whose value it beats — the current value is their next-larger — then push the current index. " +
        "Anything still on the stack at the end never met anything larger and keeps `-1`.\n\n" +
        "Walking it through (the stack below holds the *waiting* indices):",
    },
    {
      kind: "walkthrough",
      heading: "nums = [2, 1, 2, 4, 3]",
      lane: [2, 1, 2, 4, 3],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 1 }],
          action: "1 < 2 → push 1",
          caption: "Index 0 (value 2) is already waiting. Value 1 doesn't beat it, so it waits too. Stack: [0, 1].",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          marked: [1],
          action: "2 > 1 → pop 1, answer[1]=2; 2 == 2 → stop",
          caption: "Value 2 beats the waiting 1 (answer[1]=2) but not the equal 2 at index 0 (strictly greater only). Push 2. Stack: [0, 2].",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          marked: [0, 1, 2],
          action: "4 > 2 and 4 > 2 → pop 2 and 0, answer[2]=4, answer[0]=4",
          caption: "Value 4 clears both waiting 2's at once. Push 3. Stack: [3].",
        },
        {
          pointers: [{ name: "i", at: 4 }],
          action: "3 < 4 → push 4",
          caption: "Value 3 can't beat the waiting 4, so it joins the queue. Stack: [3, 4].",
        },
        {
          marked: [0, 1, 2],
          action: "scan ends → indices 3, 4 keep -1",
          caption: "Values 4 and 3 never met anything larger to their right. answer = [4, 2, 4, -1, -1].",
        },
      ],
    },
  ],

  "evaluate-reverse-polish-notation": [
    {
      kind: "prose",
      body:
        "Postfix notation puts each operator *after* its two operands, so there are no parentheses to balance. A " +
        "first instinct is to rewrite it into a normal infix expression and evaluate that — but reconstructing " +
        "and re-parsing the grouping is fiddly and slow.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — collapse the leftmost operator and its two operands, repeat: O(n²).",
      source:
        "function evalRPN(tokens) {\n" +
        "  const t = [...tokens];\n" +
        "  const ops = { '+': (a, b) => a + b, '-': (a, b) => a - b,\n" +
        "                '*': (a, b) => a * b, '/': (a, b) => Math.trunc(a / b) };\n" +
        "  // Find the first operator; its operands are the two tokens just before it.\n" +
        "  while (t.length > 1) {\n" +
        "    const i = t.findIndex((tok) => tok in ops);\n" +
        "    const val = ops[t[i]](Number(t[i - 2]), Number(t[i - 1]));\n" +
        "    t.splice(i - 2, 3, String(val)); // replace the triple with its result\n" +
        "  }\n" +
        "  return Number(t[0]);\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Each `findIndex` + `splice` is O(n) and we do it O(n) times — O(n²), with array shuffling on top. Can we " +
        "do better?\n\n" +
        "The key observation: when you read an operator, its operands are *the two values produced most recently* " +
        "— last produced is the first one you need. “Most recent, handled first” is a **[stack](/study-guide/algos/topic/stacks)**. " +
        "Push every number. On an operator, pop the top two (the **second** pop is the left operand), apply it, " +
        "and push the result back. One left-to-right pass; the final lone value is the answer.\n\n" +
        "The lane below is the token stream being scanned; the caption tracks the **operand stack** after each " +
        "token (its top is the rightmost value listed). Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "tokens = [\"4\", \"13\", \"5\", \"/\", \"+\"]",
      lane: ["4", "13", "5", "/", "+"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 1 }],
          action: "push 4, push 13",
          caption: "Numbers go straight onto the operand stack. Stack: [4, 13].",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          action: "push 5",
          caption: "Another number. Stack: [4, 13, 5].",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          action: "'/' → pop 5 (b), pop 13 (a), push trunc(13/5)=2",
          caption: "Operator: the two most-recent values are its operands, a=13 (left) over b=5. Stack: [4, 2].",
        },
        {
          pointers: [{ name: "i", at: 4 }],
          action: "'+' → pop 2 (b), pop 4 (a), push 4+2=6",
          caption: "Add the remaining two. Stack: [6].",
        },
        {
          pointers: [{ name: "i", at: 4 }],
          action: "scan ends → return stack top",
          caption: "One value left on the stack — that's the result: 6.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      items: [
        "Operand order matters for `-` and `/`: the **first** pop is the right operand `b`, the **second** is the left operand `a` — compute `a - b`, not `b - a`.",
        "Integer division truncates *toward zero* (`Math.trunc`), so `6 / -4` is `-1`, not the `-2` that `Math.floor` would give.",
      ],
    },
  ],

  "remove-all-adjacent-duplicates-in-string": [
    {
      kind: "prose",
      body:
        "The literal reading of the problem: scan for any two adjacent equal characters, delete them, and start " +
        "over — because a deletion can create a *new* adjacent pair underneath. Repeat until a full scan finds " +
        "nothing to remove.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — find and delete an adjacent pair, restart, until stable: O(n²).",
      source:
        "function removeDuplicates(s) {\n" +
        "  let changed = true;\n" +
        "  while (changed) {\n" +
        "    changed = false;\n" +
        "    for (let i = 0; i + 1 < s.length; i++) {\n" +
        "      if (s[i] === s[i + 1]) {\n" +
        "        s = s.slice(0, i) + s.slice(i + 2); // cut the matching pair\n" +
        "        changed = true;\n" +
        "        break; // restart the scan from the top\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return s;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Every deletion restarts an O(n) scan and rebuilds the string, so a long collapsing run is O(n²). Can we " +
        "do better?\n\n" +
        "The key observation: a character only ever cancels against the character *immediately before it in the " +
        "result so far* — the most recently kept one. “Compare against the most recent kept item, and remove it " +
        "on a match” is a **[stack](/study-guide/algos/topic/stacks)**. Push each character; but if it equals the " +
        "current top, the two are an adjacent pair — `pop` the top instead, cancelling both. A pop can expose a " +
        "new top, so the cascade is handled for free: the *next* character compares against whatever surfaced.\n\n" +
        "The characters left on the stack, in order, are the answer. The lane is the input being scanned; " +
        "`marked` cells are characters that have cancelled away. Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "s = \"azxxzy\"",
      lane: ["a", "z", "x", "x", "z", "y"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 1 }],
          action: "push 'a', push 'z'",
          caption: "Top differs each time, so both are kept. Stack: [a, z].",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          action: "'x' != top 'z' → push",
          caption: "A new character, no match. Stack: [a, z, x].",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          marked: [2, 3],
          action: "'x' == top 'x' → pop",
          caption: "The second 'x' matches the top — they cancel. Stack: [a, z].",
        },
        {
          pointers: [{ name: "i", at: 4 }],
          marked: [1, 2, 3, 4],
          action: "'z' == top 'z' → pop",
          caption: "Removing the x's exposed 'z' on top; the incoming 'z' cancels it too — the cascade. Stack: [a].",
        },
        {
          pointers: [{ name: "i", at: 5 }],
          marked: [1, 2, 3, 4],
          action: "'y' != top 'a' → push",
          caption: "'y' doesn't match 'a', so it's kept. Stack: [a, y] → result \"ay\".",
        },
      ],
    },
  ],

  "sliding-window-maximum": [
    {
      kind: "prose",
      body:
        "The direct approach slides a window of width `k` across the array and, at each position, takes the max " +
        "of the `k` values inside it.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — re-scan all k values for every window: O(n·k).",
      source:
        "function maxSlidingWindow(nums, k) {\n" +
        "  const result = [];\n" +
        "  // Each window starts at i and spans k elements.\n" +
        "  for (let i = 0; i + k <= nums.length; i++) {\n" +
        "    let m = nums[i];\n" +
        "    for (let j = i + 1; j < i + k; j++) m = Math.max(m, nums[j]); // rescan the window\n" +
        "    result.push(m);\n" +
        "  }\n" +
        "  return result;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Re-maxing all `k` values for each of the ~n windows is O(n·k) — quadratic when `k` grows with `n`. A heap " +
        "drops it to O(n log k); a **monotonic deque** reaches O(n). Can we do better than the heap?\n\n" +
        "The key observation: if an earlier value is `≤` a later value that's still in the window, the earlier one " +
        "can *never* be a future maximum — it's dominated and dead. So keep a double-ended queue of *indices* " +
        "whose values strictly **decrease** front→back; the front is always the current window's max. This is the " +
        "deque cousin of the **[monotonic stack](/study-guide/algos/topic/stacks)**, with one extra move: evict " +
        "the front when it slides out of the window.\n\n" +
        "For each `i`: pop dominated values off the **back** (`nums[back] ≤ nums[i]`), push `i`, drop the **front** " +
        "if it's `≤ i - k`, and once the first window is full read the front. The lane below shows the array; " +
        "`range` is the current window and the caption tracks the deque (front listed first). Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [1, 3, -1, -3, 5, 3], k = 3",
      lane: [1, 3, -1, -3, 5, 3],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 2 }],
          range: [0, 2],
          marked: [0],
          action: "3 evicted 1; deque [1,2] → window max = nums[1] = 3",
          caption: "Building the first window: 3 dominated the earlier 1 (popped). Deque indices: [1, 2]. First max = 3.",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          range: [1, 3],
          marked: [0],
          action: "-3 < -1 → push 3; front 1 still in window → max = 3",
          caption: "-3 doesn't dominate anyone, just appended. Deque: [1, 2, 3]. Front index 1 (value 3) is the max.",
        },
        {
          pointers: [{ name: "i", at: 4 }],
          range: [2, 4],
          marked: [0, 1, 2, 3],
          action: "5 evicts 3,-1,-3 (all ≤ 5); front 1 slid out → max = 5",
          caption: "Value 5 dominates everything waiting and clears the deque; index 1 also slid past the window. Deque: [4]. Max = 5.",
        },
        {
          pointers: [{ name: "i", at: 5 }],
          range: [3, 5],
          marked: [0, 1, 2, 3],
          action: "3 < 5 → push 5; front 4 in window → max = 5",
          caption: "3 can't dominate the 5 ahead of it, so it just appends. Deque: [4, 5]. Front index 4 (value 5) is the max.",
        },
        {
          range: [3, 5],
          marked: [0, 1, 2, 3],
          action: "scan ends → result = [3, 3, 5, 5]",
          caption: "Four windows, four maxima. Each index entered and left the deque once, so the whole pass is O(n).",
        },
      ],
    },
  ],

  "implement-queue-using-stacks": [
    {
      kind: "prose",
      body:
        "A queue is **FIFO** — first in, first out — but a stack is **LIFO**, so they pull in opposite directions. " +
        "The naïve fix with a single stack: to dequeue, pop *everything* into a temporary holder so the oldest " +
        "element surfaces, take it, then pour everything back.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — one stack, reverse on every dequeue: O(n) per pop/peek.",
      source:
        "// Using a single stack, every front operation reverses the whole thing twice.\n" +
        "function dequeue(stack) {\n" +
        "  const tmp = [];\n" +
        "  // Pour everything out so the oldest element ends up on top of tmp.\n" +
        "  while (stack.length) tmp.push(stack.pop());\n" +
        "  const front = tmp.pop();          // the oldest element\n" +
        "  while (tmp.length) stack.push(tmp.pop()); // pour it all back\n" +
        "  return front;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Every single dequeue does two full O(n) reversals — O(n) per operation. Can we do better?\n\n" +
        "The key observation: that costly reversal doesn't have to happen *every* time. Use **two** stacks — an " +
        "`inStack` for pushes and an `outStack` for fronts. Reverse `inStack` into `outStack` **only when " +
        "`outStack` is empty**; that single pour flips the order so the oldest element sits on top of `outStack`. " +
        "After that, `pop` and `peek` read straight off `outStack`'s top with no reversal, until it drains and " +
        "you transfer again.\n\n" +
        "This is the **two-stacks** technique (see the [Stacks](/study-guide/algos/topic/stacks) intro). The " +
        "magic is *amortized* cost: each element is moved between the stacks at most once over its lifetime, so " +
        "although one transfer is O(n), the cost spread across all operations is **O(1) amortized** each.\n\n" +
        "**Why it works, step by step** — say we push `1, 2, 3`. `inStack` holds `[1, 2, 3]` (top is 3). The first " +
        "`peek`/`pop` finds `outStack` empty and transfers: popping 3, then 2, then 1 onto `outStack` yields " +
        "`[3, 2, 1]` (top is 1 — the oldest!). Now `pop` returns 1, `pop` returns 2 straight off the top. Push a " +
        "`4`: it lands on `inStack`, *not* `outStack`, so the front order is preserved. When `outStack` finally " +
        "empties, the next front op transfers `[4]` over and continues. `empty` is just both stacks empty.\n\n" +
        "**Note on the diagram:** this problem is about two vertical stacks pouring into each other, which our " +
        "1-D lane diagram can't honestly depict — so this page teaches it in prose rather than forcing a " +
        "misleading single-row animation. The stored solution below traces the same `inStack`/`outStack` model.",
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "Transfer **only when `outStack` is empty** — transferring while it still holds elements would interleave new pushes ahead of older ones and break FIFO order.",
        "`empty` must check *both* stacks: an element can be sitting in either the in- or the out-stack.",
      ],
    },
  ],

  // ── Heaps & priority queues chapter ──

  "merge-k-sorted-lists": [
    {
      kind: "prose",
      body:
        "The simplest correct approach ignores that the lists are sorted at all: pour every node into one array, " +
        "sort it, and rebuild a single list from the sorted values.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — collect all N nodes, sort, rebuild: O(N log N).",
      source:
        "function mergeKLists(lists) {\n" +
        "  const values = [];\n" +
        "  // Walk every list and dump all values into one array.\n" +
        "  for (const head of lists) {\n" +
        "    let node = head;\n" +
        "    while (node) { values.push(node.val); node = node.next; }\n" +
        "  }\n" +
        "  values.sort((a, b) => a - b);          // a full sort over all N values\n" +
        "  // Rebuild a single sorted list.\n" +
        "  const dummy = new ListNode(0);\n" +
        "  let tail = dummy;\n" +
        "  for (const v of values) { tail.next = new ListNode(v); tail = tail.next; }\n" +
        "  return dummy.next;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(N log N) over all `N` nodes, and it throws away the fact that each list is *already sorted* — " +
        "we re-sort values that arrived in order. Can we do better?\n\n" +
        "The key observation: at every step the next node of the answer is the **smallest among the current heads** " +
        "of the `k` lists. Finding the minimum of `k` things, repeatedly, while one of them gets replaced each " +
        "time, is exactly what a **min-heap** does in O(log k). Seed a heap with the head of each list; pop the " +
        "global minimum, append it to the answer, and push that node's successor. Each of the `N` nodes is pushed " +
        "and popped once, at O(log k) each.\n\n" +
        "**Bridge to the stored solution:** the Optimization code below reaches the same O(N log k) bound by a " +
        "*divide-and-conquer* route instead — it pairs the lists up and merges them in `log k` rounds (the " +
        "classic two-pointer [merge of two lists](/study-guide/algos/topic/linked-lists)), which avoids " +
        "implementing a heap. The heap is the canonical Heaps-chapter framing; the pairwise merge is an " +
        "equivalent, heap-free way to get the same complexity. The walkthrough below traces the **heap** model.\n\n" +
        "Walking the heap through `[[1,4,5], [1,3,4], [2,6]]`:",
    },
    {
      kind: "mergeWalkthrough",
      heading: "each list keeps one frontier head; the heap holds those heads — pop the min, advance that list",
      lists: [
        { label: "list a", values: [1, 4, 5] },
        { label: "list b", values: [1, 3, 4] },
        { label: "list c", values: [2, 6] },
      ],
      frames: [
        {
          cursors: [0, 0, 0],
          result: [],
          popped: 0,
          action: "pop min 1 (list a)",
          caption: "Seed the heap with each list's head: 1 (a), 1 (b), 2 (c). The min is the 1 from list a — pop it.",
        },
        {
          cursors: [1, 0, 0],
          result: [1],
          popped: 1,
          action: "advance a → 4; pop min 1 (list b)",
          caption: "List a advances to 4, which joins the heap. The new min is the 1 from list b — pop it. Result: 1, 1.",
        },
        {
          cursors: [1, 1, 0],
          result: [1, 1],
          popped: 2,
          action: "advance b → 3; pop min 2 (list c)",
          caption: "List b advances to 3. The heap is now {4, 3, 2}; the min is 2 from list c — pop it. Result: 1, 1, 2.",
        },
        {
          cursors: [1, 1, 1],
          result: [1, 1, 2],
          popped: 1,
          action: "advance c → 6; pop min 3 (list b)",
          caption: "List c advances to 6. The heap {4, 3, 6} has min 3 from list b — pop it. Result: 1, 1, 2, 3.",
        },
        {
          cursors: [null, null, null],
          result: [1, 1, 2, 3, 4, 4, 5, 6],
          action: "drain remaining → 4, 4, 5, 6",
          caption: "Keep popping the min and advancing its list: 4 (b), 4 (a), 5 (a), 6 (c). All lists drained — final: 1, 1, 2, 3, 4, 4, 5, 6.",
        },
      ],
    },
  ],

  "k-most-frequent-strings": [
    {
      kind: "prose",
      body:
        "The direct approach counts every string, turns the counts into a list, fully sorts that list by the " +
        "required order (frequency descending, then lexicographic ascending), and takes the first `k`.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — count, then sort all d distinct strings: O(n + d log d).",
      source:
        "function kMostFrequent(strs, k) {\n" +
        "  // Tally each string's frequency.\n" +
        "  const count = new Map();\n" +
        "  for (const s of strs) count.set(s, (count.get(s) || 0) + 1);\n" +
        "  // Sort every distinct string by frequency desc, breaking ties lexicographically asc.\n" +
        "  const distinct = [...count.keys()];\n" +
        "  distinct.sort((a, b) =>\n" +
        "    count.get(b) - count.get(a) || (a < b ? -1 : 1)\n" +
        "  );\n" +
        "  return distinct.slice(0, k);            // the top k after a full sort\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Counting is O(n), but the full sort costs O(d log d) over all `d` distinct strings — and we only want the " +
        "top `k`. When `k ≪ d`, sorting everything is wasted work. Can we do better?\n\n" +
        "The key observation: to keep the `k` *most* frequent, hold a **min-heap of size `k`** ordered by *how " +
        "weak* a candidate is — lowest frequency at the top, and on a frequency tie the lexicographically *larger* " +
        "string on top (because we want to keep the smaller one). Push each distinct string; whenever the heap " +
        "exceeds `k`, pop the weakest. Anything weaker than the current root never displaces it, so each push is " +
        "O(log k). This is the bounded top-k heap from the [Heaps intro](/study-guide/algos/topic/heaps).\n\n" +
        "The heap drains *weakest-first*, so reverse the drained order to present strongest-first.\n\n" +
        "Walking it through `strs = [go, coding, byte, byte, go, interview, go]`, `k = 2` (counts: `go`=3, " +
        "`byte`=2, `coding`=1, `interview`=1):",
    },
    {
      kind: "walkthrough",
      heading: "size-2 min-heap keyed by weakness (top = weakest: lowest freq, then larger string)",
      lane: ["go·3", "coding·1", "byte·2", "interview·1"],
      frames: [
        {
          pointers: [{ name: "push", at: 0 }],
          range: [0, 0],
          action: "push go·3 → heap {go·3}",
          caption: "First distinct string enters. Heap under size k = 2, no eviction.",
        },
        {
          pointers: [{ name: "push", at: 1 }],
          range: [0, 1],
          action: "push coding·1 → {coding·1, go·3}, size 2 — ok",
          caption: "coding (count 1) joins. Heap is exactly size 2; weakest (coding·1) is at the top.",
        },
        {
          pointers: [{ name: "push", at: 2 }],
          marked: [1],
          action: "push byte·2 → size 3 > 2 → pop coding·1",
          caption: "byte (count 2) enters and overflows the heap; evict the weakest, coding·1. Heap {byte·2, go·3}.",
        },
        {
          pointers: [{ name: "push", at: 3 }],
          marked: [1, 3],
          action: "push interview·1 → size 3 > 2 → pop interview·1",
          caption: "interview (count 1) is weaker than the root byte·2, so it's pushed and immediately evicted.",
        },
        {
          marked: [1, 3],
          action: "drain {byte·2, go·3} weakest-first → [byte, go], reverse → [go, byte]",
          caption: "Two strings remain. Draining gives byte then go; reverse for strongest-first. Answer: [go, byte].",
        },
      ],
    },
  ],

  "median-of-an-integer-stream": [
    {
      kind: "prose",
      body:
        "The naïve design keeps every number in a list. `addNum` appends in O(1), but `findMedian` then has to " +
        "sort the whole history and read the middle — O(n log n) on every query.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — store all, sort on each query: O(n log n) per findMedian.",
      source:
        "function runMedianOps(operations, values) {\n" +
        "  const nums = [];\n" +
        "  const result = [];\n" +
        "  for (let i = 0; i < operations.length; i++) {\n" +
        "    if (operations[i] === 'addNum') {\n" +
        "      nums.push(values[i][0]);            // O(1) add\n" +
        "      result.push(null);\n" +
        "    } else {                              // findMedian: sort, read the middle\n" +
        "      const sorted = [...nums].sort((a, b) => a - b);\n" +
        "      const n = sorted.length;\n" +
        "      const mid = n >> 1;\n" +
        "      result.push(n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2);\n" +
        "    }\n" +
        "  }\n" +
        "  return result;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Re-sorting the entire history on every `findMedian` is the waste — most of the data hasn't changed. Can " +
        "we do better?\n\n" +
        "The key observation: the median only depends on the *boundary* between the smaller half and the larger " +
        "half. Keep two heaps — a **max-heap `low`** for the smaller half (its top is the largest small value) and " +
        "a **min-heap `high`** for the larger half (its top is the smallest large value) — balanced so `low` has " +
        "the same size as `high` or exactly one more. This is the two-heaps technique from the " +
        "[Heaps intro](/study-guide/algos/topic/heaps).\n\n" +
        "Each `addNum` pushes into `low`, hands `low`'s top to `high` (keeping every small value ≤ every large " +
        "value), then rebalances if `high` outgrew `low` — a constant number of O(log n) heap ops. `findMedian` " +
        "reads the tops in O(1): `low`'s top when the count is odd, else the average of both tops.\n\n" +
        "Walking through the adds `5, 2, 8, 1` with a `findMedian` after each:",
    },
    {
      kind: "walkthrough",
      heading: "two heaps — low (max-heap, small half) | high (min-heap, large half)",
      lane: ["+5", "+2", "+8", "+1"],
      frames: [
        {
          pointers: [{ name: "add", at: 0 }],
          range: [0, 0],
          action: "add 5 → low{5} | high{} → median = 5",
          caption: "First value lands in low. Count is odd (1), so the median is low's top: 5.",
        },
        {
          pointers: [{ name: "add", at: 1 }],
          range: [0, 1],
          action: "add 2 → low{2} | high{5} → median = (2+5)/2 = 3.5",
          caption: "2 enters low, then low's top (5) moves to high. Even count: average the tops, 3.5.",
        },
        {
          pointers: [{ name: "add", at: 2 }],
          range: [0, 2],
          action: "add 8 → low{2,5} | high{8} → median = 5",
          caption: "8 enters low then high (8); high outgrew low, so high's top moves back. Odd count → low top 5.",
        },
        {
          pointers: [{ name: "add", at: 3 }],
          range: [0, 3],
          action: "add 1 → low{1,2} | high{5,8} → median = (2+5)/2 = 3.5",
          caption: "1 settles into the small half; the halves end balanced at 2 each. Even count → (2+5)/2 = 3.5.",
        },
        {
          range: [0, 3],
          action: "sorted view {1,2 | 5,8} → boundary tops 2 and 5",
          caption: "The heaps partition the stream around the median; only the two boundary tops ever matter.",
        },
      ],
    },
  ],

  "sort-a-k-sorted-array": [
    {
      kind: "prose",
      body:
        "The obvious approach ignores the `k` guarantee entirely and just runs a general comparison sort over the " +
        "whole array.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — a full sort, ignoring the k bound: O(n log n).",
      source:
        "function sortKSortedArray(nums, k) {\n" +
        "  // A general sort works, but does O(n log n) regardless of how small k is.\n" +
        "  return [...nums].sort((a, b) => a - b);\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "A full sort is O(n log n) and never uses the promise that no element is more than `k` slots from home. " +
        "Can we do better?\n\n" +
        "The key observation: because every element is within `k` positions of its sorted spot, the **smallest " +
        "unplaced element is always among the next `k + 1` elements**. So keep a **min-heap of size `k + 1`**: " +
        "seed it with the first `k + 1` elements, then for each remaining element pop the heap minimum (the next " +
        "sorted value) and push the newcomer. Drain the heap at the end. This is the bounded-heap idea from the " +
        "[Heaps intro](/study-guide/algos/topic/heaps), sized to the window the guarantee gives us.\n\n" +
        "Each of the `n` elements does one O(log k) push and one O(log k) pop — O(n log k), beating the full sort " +
        "when `k ≪ n`.\n\n" +
        "Walking through `nums = [4, 2, 1, 3, 6, 5]`, `k = 2` (heap of size `k + 1 = 3`):",
    },
    {
      kind: "walkthrough",
      heading: "nums = [4, 2, 1, 3, 6, 5], k = 2 — min-heap of size k+1 = 3",
      lane: [4, 2, 1, 3, 6, 5],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "in", at: 2 }],
          range: [0, 2],
          action: "seed heap {4, 2, 1} → root 1",
          caption: "Push the first k+1 = 3 elements. The global minimum (1) must be among them — root is 1.",
        },
        {
          pointers: [{ name: "in", at: 3 }],
          marked: [0, 1, 2],
          action: "pop 1, push 3 → {4, 2, 3} → output [1]",
          caption: "Pop the min (1) as the first sorted value, then push the next element, 3. Output: 1.",
        },
        {
          pointers: [{ name: "in", at: 4 }],
          marked: [0, 1, 2, 3],
          action: "pop 2, push 6 → {4, 6, 3} → output [1,2]",
          caption: "Min is now 2 — pop and output it, push 6. Output: 1, 2.",
        },
        {
          pointers: [{ name: "in", at: 5 }],
          marked: [0, 1, 2, 3, 4],
          action: "pop 3, push 5 → {4, 6, 5} → output [1,2,3]",
          caption: "Pop 3, push the last element 5. Output: 1, 2, 3. No elements remain to scan.",
        },
        {
          marked: [0, 1, 2, 3, 4, 5],
          action: "drain {4, 5, 6} → output [1,2,3,4,5,6]",
          caption: "Drain the heap in order: 4, 5, 6. Final sorted array: [1, 2, 3, 4, 5, 6].",
        },
      ],
    },
  ],

  // (next-larger-element et al. above are the Stacks chapter)

  "merge-intervals": [
    {
      kind: "prose",
      body:
        "A first pass treats merging as a repeated scan: keep sweeping the whole list, and whenever two intervals " +
        "overlap, fuse them into one and start over — repeating until a full pass makes no change.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — re-scan and fuse any overlapping pair until stable: O(n²) (or worse).",
      source:
        "function merge(intervals) {\n" +
        "  const result = intervals.map((iv) => [...iv]); // work on a copy\n" +
        "  let merged = true;\n" +
        "  // Keep looping until a whole pass finds nothing left to fuse.\n" +
        "  while (merged) {\n" +
        "    merged = false;\n" +
        "    outer:\n" +
        "    for (let i = 0; i < result.length; i++) {\n" +
        "      for (let j = i + 1; j < result.length; j++) {\n" +
        "        // Two intervals overlap if neither ends before the other starts.\n" +
        "        if (result[i][0] <= result[j][1] && result[j][0] <= result[i][1]) {\n" +
        "          // Fuse j into i, drop j, and restart the scan.\n" +
        "          result[i] = [Math.min(result[i][0], result[j][0]), Math.max(result[i][1], result[j][1])];\n" +
        "          result.splice(j, 1);\n" +
        "          merged = true;\n" +
        "          break outer;\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return result.sort((a, b) => a[0] - b[0]); // present in start order\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Re-scanning the whole list after every fuse is O(n²) work — far more than necessary. Can we do better?\n\n" +
        "The key observation: if the intervals are **sorted by start**, then any interval that overlaps a given one " +
        "must come *right after* it — so a single left-to-right pass is enough. We never have to look backward, " +
        "because everything earlier already starts no later.\n\n" +
        "So sort by start, then sweep while holding only the **last interval in the output** as a running *frontier*. " +
        "For each next interval: if its start is at or before the frontier's end they overlap, so widen the frontier's " +
        "end to the larger of the two; otherwise there's a gap, so push it as a new frontier.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "sorted by start: [[1, 3], [2, 6], [8, 10], [15, 18]]",
      lane: ["[1,3]", "[2,6]", "[8,10]", "[15,18]"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }],
          marked: [0],
          action: "output = [[1, 3]]",
          caption: "The first interval seeds the frontier — there's nothing before it to overlap.",
        },
        {
          pointers: [{ name: "i", at: 1 }],
          action: "2 ≤ 3 → overlap → end = max(3, 6) = 6",
          caption: "[2,6] starts at 2, within the frontier's end 3, so they overlap. Frontier widens to [1, 6].",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          action: "8 > 6 → gap → push [8, 10]",
          caption: "[8,10] starts past the frontier's end 6, so it's disjoint. output = [[1, 6], [8, 10]].",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          action: "15 > 10 → gap → push [15, 18]",
          caption: "[15,18] clears the frontier 10 as well, so it becomes its own interval.",
        },
        {
          action: "done → [[1, 6], [8, 10], [15, 18]]",
          caption: "One pass over the sorted list collapsed four intervals into three non-overlapping ranges.",
        },
      ],
    },
  ],

  "interval-intersections": [
    {
      kind: "prose",
      body:
        "The intersections are the ranges covered by *both* lists, so a first pass simply tests every interval from " +
        "the first list against every interval from the second, recording any overlap it finds.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — every pair across the two lists: O(m × n).",
      source:
        "function intervalIntersection(firstList, secondList) {\n" +
        "  const result = [];\n" +
        "  // Compare each interval in A against each interval in B.\n" +
        "  for (const [aStart, aEnd] of firstList) {\n" +
        "    for (const [bStart, bEnd] of secondList) {\n" +
        "      // The overlap of two closed intervals is [max start, min end].\n" +
        "      const lo = Math.max(aStart, bStart);\n" +
        "      const hi = Math.min(aEnd, bEnd);\n" +
        "      if (lo <= hi) result.push([lo, hi]); // non-empty → it's a real intersection\n" +
        "    }\n" +
        "  }\n" +
        "  return result.sort((a, b) => a[0] - b[0]); // present in start order\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Checking every pair is O(m × n), and it ignores a gift the input already hands us: **both lists are sorted " +
        "by start**. Can we do better?\n\n" +
        "Because the lists are sorted, we can sweep them together with one pointer each — the same " +
        "[two-pointer](/study-guide/algos/topic/two-pointers) merge posture as combining two sorted arrays. At each " +
        "step the only candidate intersection is between the *current* interval of each list: `[max(starts), " +
        "min(ends)]`, emitted when that range is non-empty.\n\n" +
        "Then comes the one insight that makes it linear: advance the pointer of whichever interval **ends first**. " +
        "That interval can't possibly intersect anything later in the other list (everything there starts even " +
        "further right), while the one that ends later might still meet the other list's *next* interval — so it " +
        "stays put.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "list A (pointer i) — A = [[0,2], [5,10], [13,23]]",
      lane: ["[0,2]", "[5,10]", "[13,23]"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }],
          action: "A[0]=[0,2] vs B[0]=[1,5] → [1,2] ✓ → A ends first → i++",
          caption: "Step 1: overlap of [0,2] and [1,5] is [max(0,1), min(2,5)] = [1,2]. A ends sooner, so advance i.",
        },
        {
          pointers: [{ name: "i", at: 1 }],
          action: "A[1]=[5,10] vs B[0]=[1,5] → [5,5] ✓ → B ends first → j++",
          caption: "Step 2: [5,10] meets [1,5] at the single point 5. B ends sooner now, so j advances (i stays).",
        },
        {
          pointers: [{ name: "i", at: 1 }],
          action: "A[1]=[5,10] vs B[1]=[8,12] → [8,10] ✓ → A ends first → i++",
          caption: "Step 3: [5,10] and [8,12] overlap on [8,10]. A ends sooner, so advance i.",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          marked: [2],
          action: "i out of work vs remaining B → no more overlaps",
          caption: "Step 4: [13,23] sits past B's frontier; nothing left intersects. Collected: [[1,2], [5,5], [8,10]].",
        },
      ],
    },
    {
      kind: "walkthrough",
      heading: "list B (pointer j) — B = [[1,5], [8,12], [15,24]] — same four steps, B's side",
      lane: ["[1,5]", "[8,12]", "[15,24]"],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "j", at: 0 }],
          action: "step 1: B[0]=[1,5] still has room → stays",
          caption: "B's [1,5] ends at 5, later than A's [0,2] (ends 2), so j holds while i advances.",
        },
        {
          pointers: [{ name: "j", at: 0 }],
          action: "step 2: B[0]=[1,5] ends first → j++",
          caption: "After A moves to [5,10], B's [1,5] is the one that ends first (5 < 10), so j finally advances.",
        },
        {
          pointers: [{ name: "j", at: 1 }],
          action: "step 3: B[1]=[8,12] outlives A's [5,10] → stays",
          caption: "[8,12] ends at 12, past A's [5,10] (ends 10), so j holds while i advances again.",
        },
        {
          pointers: [{ name: "j", at: 1 }],
          marked: [],
          action: "step 4: A exhausted → sweep ends",
          caption: "With A's pointer off the end, the loop stops — B's remaining intervals can't intersect anything.",
        },
      ],
    },
    {
      kind: "prose",
      body:
        "*Reading the two lanes:* they show the **same four steps** from each list's side — pointer `i` over A on top, " +
        "`j` over B below. A single lane can't draw the cross-list comparison, so the decision lives in each step's " +
        "`action`: the candidate overlap `[max(starts), min(ends)]` and the rule that whichever interval **ends " +
        "first** advances. Each pointer only ever moves forward, so the whole sweep is linear in the two lengths.",
    },
  ],

  "max-overlapping-intervals": [
    {
      kind: "prose",
      body:
        "The answer is the busiest single point, so a first pass picks a set of candidate points — every interval's " +
        "start is enough — and, for each one, counts how many intervals cover it.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — for each start point, count covering intervals: O(n²).",
      source:
        "function largestOverlap(intervals) {\n" +
        "  let max = 0;\n" +
        "  // A peak overlap always occurs at some interval's start point.\n" +
        "  for (const [point] of intervals) {\n" +
        "    let active = 0;\n" +
        "    // Count how many intervals cover this candidate point.\n" +
        "    for (const [start, end] of intervals) {\n" +
        "      if (start <= point && point <= end) active++;\n" +
        "    }\n" +
        "    if (active > max) max = active;\n" +
        "  }\n" +
        "  return max;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Re-counting every interval at every candidate point is O(n²). Can we do better?\n\n" +
        "The key observation: the active count only ever changes at an **endpoint** — it ticks **up** by one when an " +
        "interval starts and **down** by one just after one ends. So instead of probing points, turn each interval " +
        "into two events: a `+1` at its start and a `-1` at `end + 1` (just past the close, so a closed interval is " +
        "still counted at its own end). Sort all `2n` events by position and sweep a running counter; its peak is " +
        "the answer.\n\n" +
        "At a tie in position, process the **close (`-1`) before the open (`+1`)** — an event sitting at `end + 1` " +
        "means that interval is already gone, so it shouldn't be counted alongside one opening there.\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "events sorted by position: +1@1, +1@2, -1@6(=5+1), +1@8, -1@9(=8+1), -1@10(=9+1)",
      lane: ["+1@1", "+1@2", "-1@6", "+1@8", "-1@9", "-1@10"],
      frames: [
        {
          pointers: [{ name: "sweep", at: 0 }],
          action: "+1 → active = 1, max = 1",
          caption: "Process the events for [1,5] and [2,6]. The first start opens an interval; count rises to 1.",
        },
        {
          pointers: [{ name: "sweep", at: 1 }],
          action: "+1 → active = 2, max = 2",
          caption: "The second start (from [2,6]) opens while the first is still active — two intervals overlap.",
        },
        {
          pointers: [{ name: "sweep", at: 2 }],
          action: "-1 → active = 1",
          caption: "At position 6 the close of [1,5] fires (its end 5, +1). The count drops back to 1; max stays 2.",
        },
        {
          pointers: [{ name: "sweep", at: 3 }],
          action: "+1 → active = 2, max still 2",
          caption: "The disjoint interval [8,9] opens. Count returns to 2, but never exceeds the earlier peak.",
        },
        {
          pointers: [{ name: "sweep", at: 5 }],
          action: "closes → active = 0",
          caption: "The remaining closes drain the count to 0. The peak seen anywhere was 2 — the answer.",
        },
      ],
    },
    {
      kind: "prose",
      body:
        "The lane above shows the sorted **event stream** for `[[1, 5], [2, 6], [8, 9]]`, not the intervals " +
        "themselves — each cell is a `+1`/`-1` delta at a position, and the `sweep` pointer accumulates them. The " +
        "running `active` count is the number of intervals open at that moment; its maximum over the whole sweep is " +
        "the largest overlap.",
    },
  ],

  "range-sum-query-immutable": [
    {
      kind: "prose",
      body:
        "The most direct approach answers each query on its own: walk from index `i` to index `j`, adding up the " +
        "elements, and report the total. Correct, but every query re-walks its whole range.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — sum each query's range from scratch: O(n) per query, O(n·q) overall.",
      source:
        "function rangeSum(nums, queries) {\n" +
        "  // For every query, re-add the elements between its two endpoints.\n" +
        "  return queries.map(([i, j]) => {\n" +
        "    let total = 0;\n" +
        "    for (let k = i; k <= j; k++) {\n" +
        "      total += nums[k]; // inclusive of both i and j\n" +
        "    }\n" +
        "    return total;\n" +
        "  });\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "With `q` queries this is O(n·q) — and since the array never changes, we keep re-summing the same overlapping " +
        "stretches. Can we do better?\n\n" +
        "The key observation: **a range sum is a difference of two running totals**. If `prefix[k]` holds the sum of " +
        "the first `k` elements (with `prefix[0] = 0`), then the inclusive range `[i, j]` is `prefix[j + 1] - " +
        "prefix[i]` — the total through `j`, minus everything strictly before `i`. That's the core [Prefix sums]" +
        "(/study-guide/algos/topic/prefix-sum) idea.\n\n" +
        "So pay O(n) **once** to build the prefix array, then answer each query in O(1). The leading zero and the " +
        "`+1` offset are what keep the subtraction boundary-safe — `prefix[j + 1]` includes `nums[j]`, and " +
        "`prefix[i]` excludes `nums[i]`.\n\n" +
        "Walking the build then a query through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [2, 4, 6, 8] → prefix = [0, 2, 6, 12, 20]; query [1, 2]",
      lane: [2, 4, 6, 8],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "k", at: 0 }],
          action: "prefix[1] = prefix[0] + 2 = 2",
          caption: "Start the build. prefix[0] = 0 is the empty prefix; fold in nums[0] = 2.",
        },
        {
          pointers: [{ name: "k", at: 1 }],
          action: "prefix[2] = 2 + 4 = 6",
          caption: "Each step carries the running total forward by one element.",
        },
        {
          pointers: [{ name: "k", at: 3 }],
          action: "prefix[4] = 12 + 8 = 20",
          caption: "Build finished: prefix = [0, 2, 6, 12, 20]. One O(n) pass, done once.",
        },
        {
          pointers: [{ name: "i", at: 1 }, { name: "j", at: 2 }],
          range: [1, 2],
          action: "prefix[3] − prefix[1] = 12 − 2 = 10",
          caption: "Query [1, 2]: total through index 2 (12) minus everything before index 1 (2). Answer 10 = 4 + 6.",
        },
        {
          pointers: [{ name: "i", at: 0 }, { name: "j", at: 3 }],
          range: [0, 3],
          action: "prefix[4] − prefix[0] = 20 − 0 = 20",
          caption: "Any later query is the same O(1) subtraction — here the full range sums to 20.",
        },
      ],
    },
  ],

  "subarray-sum-equals-k": [
    {
      kind: "prose",
      body:
        "The most direct approach fixes a start index, then extends an end index, tracking the running sum of that " +
        "window and counting every time it equals `k`. Two nested loops cover all `O(n²)` contiguous subarrays.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — every start/end pair, count the windows summing to k: O(n²).",
      source:
        "function subarraySum(nums, k) {\n" +
        "  let count = 0;\n" +
        "  // Fix each start index...\n" +
        "  for (let start = 0; start < nums.length; start++) {\n" +
        "    let sum = 0;\n" +
        "    // ...and extend the end, accumulating as we go.\n" +
        "    for (let end = start; end < nums.length; end++) {\n" +
        "      sum += nums[end];\n" +
        "      if (sum === k) count++; // this contiguous block hits k\n" +
        "    }\n" +
        "  }\n" +
        "  return count;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n²), and a [[sliding-window|sliding window]] can't rescue it: `nums` may contain negatives, so " +
        "extending the window can *lower* the sum — there's no monotonic shrink rule. Can we still do better?\n\n" +
        "The key observation reuses prefix sums: let `prefix` be the running sum up to the current index. A subarray " +
        "ending here sums to `k` exactly when some **earlier** prefix equals `prefix − k`, because subtracting that " +
        "earlier prefix leaves a contiguous block summing to `k`. So instead of searching for the start, we ask: " +
        "*how many earlier prefixes had the value `prefix − k`?*\n\n" +
        "Counting occurrences of a value in O(1) is what a [Hash map](/study-guide/algos/topic/hash-maps) does. Keep " +
        "a map of `prefix value → times seen`, seeded with `{0: 1}` so a subarray starting at index 0 counts itself. " +
        "At each element add `count[prefix − k]` to the answer, then record the current prefix. One pass, O(n).\n\n" +
        "*(The stored solution carries the running total in a variable named `prefix` and the map in `counts`.)*\n\n" +
        "Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [1, 2, 1, 2, 1], k = 3  ·  running prefix + counts {0:1}",
      lane: [1, 2, 1, 2, 1],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }],
          action: "prefix = 1 · need 1−3 = −2 (absent) → +0",
          caption: "No earlier prefix is −2, so nothing ends here at sum 3. Record prefix 1. counts = {0:1, 1:1}.",
        },
        {
          pointers: [{ name: "i", at: 1 }],
          action: "prefix = 3 · need 3−3 = 0 (seen ×1) → +1",
          caption: "Seeded prefix 0 means the block [1,2] sums to 3. total = 1. Record 3.",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          action: "prefix = 4 · need 4−3 = 1 (seen ×1) → +1",
          caption: "Earlier prefix 1 (after index 0) means [2,1] sums to 3. total = 2. Record 4.",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          action: "prefix = 6 · need 6−3 = 3 (seen ×1) → +1",
          caption: "Earlier prefix 3 means [1,2] (indices 2–3) sums to 3. total = 3. Record 6.",
        },
        {
          pointers: [{ name: "i", at: 4 }],
          action: "prefix = 7 · need 7−3 = 4 (seen ×1) → +1",
          caption: "Earlier prefix 4 means [2,1] (indices 3–4) sums to 3. total = 4. Sweep done.",
        },
      ],
    },
  ],

  "product-of-array-except-self": [
    {
      kind: "prose",
      body:
        "The obvious approach computes the product of the whole array, then divides out each element to get its " +
        "except-self value. But the problem forbids division (and division breaks on a zero anyway), so the honest " +
        "baseline is: for each index, multiply every *other* element — two nested loops.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — for each index, multiply all the others: O(n²).",
      source:
        "function productExceptSelf(nums) {\n" +
        "  const answer = new Array(nums.length);\n" +
        "  // For each slot, walk the array and multiply in every element except itself.\n" +
        "  for (let i = 0; i < nums.length; i++) {\n" +
        "    let product = 1;\n" +
        "    for (let j = 0; j < nums.length; j++) {\n" +
        "      if (j !== i) product *= nums[j]; // skip the slot we're filling\n" +
        "    }\n" +
        "    answer[i] = product;\n" +
        "  }\n" +
        "  return answer;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "This is O(n²), and division is off the table. Can we do better?\n\n" +
        "The key observation: the product of everything except `nums[i]` is **(everything to its left) × (everything " +
        "to its right)**. Those are a prefix product and a suffix product — the same running-accumulation idea behind " +
        "[Prefix sums](/study-guide/algos/topic/prefix-sum), with multiplication instead of addition.\n\n" +
        "So do two sweeps over one output array. First left to right, writing into `answer[i]` the product of " +
        "everything *before* `i` (a running `prefix`, starting at 1). Then right to left, multiplying each " +
        "`answer[i]` by a running `suffix` product of everything *after* `i`. No division, O(n) time, and the only " +
        "extra space is the output itself.\n\n" +
        "Walking the two passes through:",
    },
    {
      kind: "walkthrough",
      heading: "nums = [1, 2, 3, 4]  ·  pass 1 fills prefix, pass 2 folds in suffix",
      lane: [1, 2, 3, 4],
      showIndices: true,
      frames: [
        {
          pointers: [{ name: "i", at: 0 }],
          action: "answer = [1, _, _, _] · prefix → 1",
          caption: "Pass 1 (left→right). answer[0] = 1 (nothing to its left). Then prefix becomes 1·1 = 1.",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          action: "answer[2] = prefix 2 · prefix → 6",
          caption: "Mid pass 1: answer = [1, 1, 2, 6-to-be]. answer[2] = 1·2 (the product of nums[0..1]).",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          action: "answer = [1, 1, 2, 6] · prefix done",
          caption: "Pass 1 complete: each slot holds the product of everything strictly to its left.",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          action: "answer[3] ×= suffix 1 = 6 · suffix → 4",
          caption: "Pass 2 (right→left), suffix starts at 1. answer[3] stays 6 (nothing to its right). suffix → 4.",
        },
        {
          pointers: [{ name: "i", at: 0 }],
          action: "answer[0] ×= suffix 24 = 24",
          caption: "By the last step suffix = 2·3·4 = 24, so answer[0] = 1·24 = 24. Final: [24, 12, 8, 6].",
        },
      ],
    },
  ],

  "range-sum-query-2d-immutable": [
    {
      kind: "prose",
      body:
        "The most direct approach answers each rectangle query by scanning it: loop over every row from `r1` to `r2` " +
        "and every column from `c1` to `c2`, summing the cells inside. Correct, but a large rectangle is re-summed " +
        "in full for every query.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — sum each query's rectangle cell by cell: O(m·n) per query.",
      source:
        "function rangeSum2D(matrix, queries) {\n" +
        "  // For each query, add up every cell inside its rectangle.\n" +
        "  return queries.map(([r1, c1, r2, c2]) => {\n" +
        "    let total = 0;\n" +
        "    for (let r = r1; r <= r2; r++) {\n" +
        "      for (let c = c1; c <= c2; c++) {\n" +
        "        total += matrix[r][c]; // inclusive of all four edges\n" +
        "      }\n" +
        "    }\n" +
        "    return total;\n" +
        "  });\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Each query is O(m·n); with many queries this re-sums the same overlapping regions. Can we do better?\n\n" +
        "Lift the 1D [Prefix sums](/study-guide/algos/topic/prefix-sum) idea one dimension. Build a table `pre` where " +
        "`pre[r+1][c+1]` is the sum of the whole rectangle from the origin `(0, 0)` to `(r, c)`. Each entry folds in " +
        "the cell, the rectangle **above**, and the rectangle to the **left**, then subtracts their doubly-counted " +
        "**overlap**: `pre[r+1][c+1] = matrix[r][c] + pre[r][c+1] + pre[r+1][c] − pre[r][c]`.\n\n" +
        "Once that O(m·n) table exists, any sub-rectangle is read off its **four corners** by inclusion–exclusion: " +
        "the big rectangle to the bottom-right corner, minus the strip above it, minus the strip to its left, plus " +
        "the top-left corner added back (it was subtracted twice). The padding row and column of zeros remove every " +
        "boundary check.\n\n" +
        "Walking the table build, then a query, over the board:",
    },
    {
      kind: "gridWalkthrough",
      showIndices: true,
      grid: [
        [3, 0, 1],
        [5, 6, 3],
        [1, 2, 0],
      ],
      frames: [
        {
          cursor: [0, 0],
          action: "pre[1][1] = 3 + 0 + 0 − 0 = 3",
          caption: "Build starts top-left. With the zero padding row/column, the first cell just copies its value.",
        },
        {
          cursor: [1, 1],
          active: [[0, 0], [0, 1], [1, 0]],
          action: "pre[2][2] = 6 + (above 3) + (left 8) − (overlap 3) = 14",
          caption: "Each cell = its value + rectangle above (sum 3) + rectangle left (sum 8) − the overlap counted twice (3).",
        },
        {
          cursor: [2, 2],
          action: "pre[3][3] = 0 + 18 + 18 − 15 = 21",
          caption: "Bottom-right of the table holds the whole grid's sum, 21. The full O(m·n) table is now built.",
        },
        {
          active: [[1, 1], [1, 2], [2, 1], [2, 2]],
          action: "query (1,1)-(2,2): 21 − 4 − 9 + 3 = 11",
          caption: "Read the 2×2 bottom-right rectangle by four corners: whole(21) − above strip(4) − left strip(9) + top-left(3) = 11 = 6+3+2+0.",
        },
      ],
    },
  ],

  "implement-trie-prefix-tree": [
    {
      kind: "prose",
      body:
        "The crude way to back a trie's three operations is to skip the tree entirely: keep a plain set of every " +
        "inserted word. `search` is then a set membership check, and `startsWith` scans *every* stored word asking " +
        "whether it begins with the prefix.\n\n" +
        "This is reframed as an **op-replay** function — `runTrieOps(operations, values)` applies each operation in " +
        "order and returns one result per op (`null` for `insert`, a boolean for `search` / `startsWith`) — but the " +
        "data structure inside is the real question.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — a flat set; startsWith scans every word: O(1) search, but O(W·L) per startsWith.",
      source:
        "function runTrieOps(operations, values) {\n" +
        "  const words = new Set();        // every inserted word, verbatim\n" +
        "  const result = [];\n" +
        "  for (let i = 0; i < operations.length; i++) {\n" +
        "    const arg = values[i][0];\n" +
        "    if (operations[i] === \"insert\") {\n" +
        "      words.add(arg);             // O(L) to hash the word\n" +
        "      result.push(null);\n" +
        "    } else if (operations[i] === \"search\") {\n" +
        "      result.push(words.has(arg)); // exact membership, O(L)\n" +
        "    } else {\n" +
        "      // startsWith: no shared structure, so test every stored word.\n" +
        "      let any = false;\n" +
        "      for (const w of words) {\n" +
        "        if (w.startsWith(arg)) { any = true; break; }\n" +
        "      }\n" +
        "      result.push(any);\n" +
        "    }\n" +
        "  }\n" +
        "  return result;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "`search` is fine, but `startsWith` is the weak spot: with `W` stored words it does `O(W · L)` work *per " +
        "query*, because the set throws away the very thing the prefix question needs — the shared structure between " +
        "words. Can we do better?\n\n" +
        "The key observation: words that share a prefix should *share a path*. Store the words as a tree where each " +
        "edge is one character, so `\"app\"` and `\"apple\"` walk the same `a → p → p` nodes and only diverge after. " +
        "Then a prefix query is a single walk down that shared path — `O(L)`, no matter how many words are stored — " +
        "and an end-of-word flag on a node distinguishes a *stored word* from a mere *prefix*. That tree is the " +
        "[trie](/study-guide/algos/topic/tries) itself.\n\n" +
        "There is no single-lane picture of a branching tree, so the walkthrough below traces **one path** through " +
        "the trie — the `a → p → p → l → e` spine after inserting `\"apple\"` then `\"app\"` — to show how `search` " +
        "and `startsWith` read the *same* path but disagree on the end flag. (`isEnd`, drawn as `•`, is the " +
        "implementation's flag; a node with no `•` is a prefix only.) Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "one path after insert(\"apple\"), insert(\"app\") — • = end-of-word flag (isEnd)",
      lane: ["root", "a", "p", "p•", "l", "e•"],
      frames: [
        {
          pointers: [{ name: "node", at: 5 }],
          range: [0, 5],
          action: "insert \"apple\": flag e",
          caption: "Inserting \"apple\" lays down the whole a-p-p-l-e path; only the final e node is flagged as a word end.",
        },
        {
          pointers: [{ name: "node", at: 3 }],
          range: [0, 3],
          action: "insert \"app\": reuse a-p-p, flag the 2nd p",
          caption: "\"app\" reuses the existing a-p-p prefix — no new nodes — and flags the second p as also being a word end.",
        },
        {
          pointers: [{ name: "node", at: 5 }],
          range: [0, 5],
          action: "search \"apple\": walk to e, isEnd? ✓",
          caption: "Exact search follows a-p-p-l-e and finds the end flag on e — \"apple\" is stored.",
        },
        {
          pointers: [{ name: "node", at: 3 }],
          range: [0, 3],
          action: "startsWith \"app\": walk to 2nd p, node exists ✓",
          caption: "Prefix search stops at the second p; the node exists, so some word starts with \"app\" — the flag is irrelevant here.",
        },
        {
          pointers: [{ name: "node", at: 2 }],
          range: [0, 2],
          action: "search \"ap\": walk to 1st p, isEnd? ✗",
          caption: "Same path, shorter: \"ap\" lands on the first p, which carries no flag — so \"ap\" is a prefix but not a stored word.",
        },
        {
          pointers: [{ name: "node", at: 1 }],
          range: [0, 1],
          action: "startsWith \"b\": no child at root ✗",
          caption: "A prefix the trie never saw falls off the root immediately (no \"b\" edge) and returns false.",
        },
      ],
    },
  ],

  "design-add-and-search-words-data-structure": [
    {
      kind: "prose",
      body:
        "Without the wildcard, this is an exact-match dictionary — a set of words would do. The twist is that a " +
        "`search` pattern may contain `.`, which matches *any single letter*, and the pattern matches only a word of " +
        "the **same length** where every other position agrees.\n\n" +
        "The brute force leans on that: store the words in a set bucketed by length, and for each `search` compare the " +
        "pattern against every stored word of that length, character by character, treating `.` as a free match. " +
        "(As with the trie, this is an **op-replay** function — `runWordOps` returns `null` for each `addWord` and a " +
        "boolean for each `search`.)",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — compare the pattern to every stored word of the same length: O(W·L) per search.",
      source:
        "function runWordOps(operations, values) {\n" +
        "  const words = [];               // every added word\n" +
        "  const result = [];\n" +
        "  const matches = (pattern, word) => {\n" +
        "    if (pattern.length !== word.length) return false;\n" +
        "    for (let k = 0; k < word.length; k++) {\n" +
        "      // A '.' matches anything; a literal must match exactly.\n" +
        "      if (pattern[k] !== \".\" && pattern[k] !== word[k]) return false;\n" +
        "    }\n" +
        "    return true;\n" +
        "  };\n" +
        "  for (let i = 0; i < operations.length; i++) {\n" +
        "    const arg = values[i][0];\n" +
        "    if (operations[i] === \"addWord\") {\n" +
        "      words.push(arg);\n" +
        "      result.push(null);\n" +
        "    } else {\n" +
        "      // Test the pattern against every stored word.\n" +
        "      result.push(words.some((w) => matches(arg, w)));\n" +
        "    }\n" +
        "  }\n" +
        "  return result;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Every `search` rescans the whole dictionary — `O(W · L)` per query — and a pattern like `\".at\"` re-derives " +
        "from scratch what a shared structure could remember. Can we do better?\n\n" +
        "The key observation: store the words in a [trie](/study-guide/algos/topic/tries) so words sharing a prefix " +
        "share a path. A literal character then follows its one matching child, pruning every other branch at once. " +
        "The `.` is the only complication — since it could be any letter, it can't pick one child, so it **branches " +
        "into all of them** and succeeds if any branch matches the rest of the pattern. That turns `search` into a " +
        "[depth-first recursion](/study-guide/algos/topic/graphs) over the trie that backtracks across a node's " +
        "children at each wildcard.\n\n" +
        "A branching trie has no single-lane picture, so the walkthrough traces the wildcard search `\".ad\"` against a " +
        "trie holding `\"bad\"`, `\"dad\"`, `\"mad\"` as a **decision sequence**: the dot at position 0 tries each root " +
        "child in turn, and within each it must still match `a` then `d` and land on an end node (`•`). The lane is " +
        "the *recursion's path*, one branch attempt per frame. (`dfs(word, i, node)` in the code is this recursion — " +
        "`i` is the lane position, `node` the trie node it currently sits on.) Walking it through:",
    },
    {
      kind: "walkthrough",
      heading: "search \".ad\" over { bad, dad, mad } — each frame is one branch the wildcard tries",
      showIndices: true,
      lane: [".", "a", "d", "•"],
      frames: [
        {
          pointers: [{ name: "i", at: 0 }],
          range: [0, 0],
          action: "i=0 is '.' → try every root child: b, d, m",
          caption: "The pattern starts with a wildcard, so the recursion must try the b-, d-, and m-branches in turn.",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          range: [0, 2],
          action: "branch b: b-a-d, isEnd? ✓ → return true",
          caption: "First branch tried, b: match 'a' then 'd', land on an end node. \"bad\" matches — the search can stop and return true.",
        },
        {
          pointers: [{ name: "i", at: 2 }],
          range: [0, 2],
          action: "(branch d would also work: d-a-d ✓)",
          caption: "Had b failed, the d-branch spells \"dad\" and also reaches an end node — any one match suffices.",
        },
        {
          pointers: [{ name: "i", at: 1 }],
          marked: [0],
          action: "search \"a.\": 'a' has no root child → false",
          caption: "A contrasting query: the literal 'a' at position 0 finds no a-edge at the root, so the whole search fails immediately — no branching needed.",
        },
        {
          pointers: [{ name: "i", at: 3 }],
          range: [0, 3],
          action: "search \"...\": match any 3 letters, isEnd? ✓",
          caption: "An all-wildcard \"...\" walks any length-3 path; every stored word is length 3 and flagged, so it matches.",
        },
        {
          pointers: [{ name: "i", at: 0 }],
          action: "search \"....\": no length-4 word → false",
          caption: "But \"....\" needs a length-4 word; every branch runs off the end before consuming the pattern, so it returns false.",
        },
      ],
    },
  ],

  "word-search-ii": [
    {
      kind: "prose",
      body:
        "The obvious approach searches each word independently: for every word in the list, scan the board for a " +
        "starting cell and run a depth-first search that tries to spell it out, stepping only to adjacent cells and " +
        "never reusing a cell within one path.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — an independent board DFS per word: O(W · m·n · 4^L).",
      source:
        "function findWords(board, words) {\n" +
        "  const rows = board.length, cols = board[0].length;\n" +
        "  const found = [];\n" +
        "  // Try to spell word[k..] starting at cell (r, c).\n" +
        "  const dfs = (r, c, word, k) => {\n" +
        "    if (k === word.length) return true;            // whole word spelled\n" +
        "    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;\n" +
        "    if (board[r][c] !== word[k]) return false;     // letter mismatch\n" +
        "    const ch = board[r][c];\n" +
        "    board[r][c] = \"#\";                             // mark visited\n" +
        "    const ok = dfs(r + 1, c, word, k + 1) || dfs(r - 1, c, word, k + 1)\n" +
        "            || dfs(r, c + 1, word, k + 1) || dfs(r, c - 1, word, k + 1);\n" +
        "    board[r][c] = ch;                              // restore (backtrack)\n" +
        "    return ok;\n" +
        "  };\n" +
        "  for (const word of words) {\n" +
        "    let here = false;\n" +
        "    for (let r = 0; r < rows && !here; r++)\n" +
        "      for (let c = 0; c < cols && !here; c++)\n" +
        "        if (dfs(r, c, word, 0)) here = true;\n" +
        "    if (here) found.push(word);\n" +
        "  }\n" +
        "  return found;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "That re-walks the entire board once per word, and two words sharing a prefix (`\"oath\"`, `\"oats\"`) re-trace " +
        "that prefix's paths from scratch. With `W` words it's `O(W · m·n · 4^L)`. Can we do better?\n\n" +
        "The key observation: flip the loop. Instead of asking *\"where is each word?\"*, build a " +
        "[trie](/study-guide/algos/topic/tries) of all the words, then DFS the board **once**, walking the board and " +
        "the trie in lockstep — at cell `(r, c)` you may only descend trie child `board[r][c]`. The moment the trie " +
        "has no such child, that branch is dead and *every word sharing that prefix is pruned together*. When the walk " +
        "reaches a trie node that ends a word, record it. This is " +
        "[backtracking](/study-guide/algos/topic/backtracking) steered by the trie.\n\n" +
        "The walk happens on the 2-D board, so the diagram below is a `gridWalkthrough`: it traces one productive path " +
        "spelling `\"oath\"`, then a dead branch the trie prunes. Visited cells are marked; the cell under the cursor is " +
        "the current trie/board step. Walking it through:",
    },
    {
      kind: "gridWalkthrough",
      heading: "board scan steered by a trie of [\"oath\", \"eat\"] — one path spells \"oath\", a dead branch prunes",
      showIndices: true,
      grid: [
        ["o", "a", "a", "n"],
        ["e", "t", "a", "e"],
        ["i", "h", "k", "r"],
        ["i", "f", "l", "v"],
      ],
      frames: [
        {
          cursor: [0, 0],
          active: [[0, 0]],
          action: "start (0,0)='o'; trie has child 'o' ✓",
          caption: "Begin a DFS at every cell. At (0,0)='o' the trie has an 'o' edge (the start of \"oath\"), so descend.",
        },
        {
          cursor: [0, 1],
          active: [[0, 0], [0, 1]],
          action: "(0,1)='a'; trie 'o'→'a' ✓",
          caption: "Step right to (0,1)='a'. The trie node for 'o' has an 'a' child, so the prefix \"oa\" is still alive.",
        },
        {
          cursor: [1, 1],
          active: [[0, 0], [0, 1], [1, 1]],
          action: "(1,1)='t'; trie 'oa'→'t' ✓",
          caption: "Down to (1,1)='t'. \"oat\" is a valid trie path — keep going toward a possible word end.",
        },
        {
          cursor: [2, 1],
          active: [[0, 0], [0, 1], [1, 1], [2, 1]],
          action: "(2,1)='h'; trie node ends \"oath\" → record",
          caption: "Down to (2,1)='h'. The trie node for \"oath\" is flagged as a word end — collect \"oath\" and clear its flag so it can't be reported twice.",
        },
        {
          cursor: [0, 2],
          marked: [[0, 2]],
          action: "from \"oa\", try (0,2)='a'; trie has no 'a'→'a' child ✗",
          caption: "A different branch from \"oa\": cell (0,2)='a' would extend to \"oaa\", but the trie has no such path — prune the whole branch at once.",
        },
        {
          cursor: [1, 3],
          active: [[1, 3], [1, 2], [1, 1]],
          action: "start (1,3)='e'; spell \"eat\" → record",
          caption: "A fresh start at (1,3)='e': the trie's other word \"eat\" traces e(1,3)→a(1,2)→t(1,1), ending on a flagged node — collect \"eat\".",
        },
      ],
    },
  ],

  "number-of-islands": [
    {
      kind: "prose",
      body:
        "We need to count *connected groups* of land. The most literal approach: every time we want to know which " +
        "cells belong together, re-scan from each land cell and gather everything reachable from it — but that " +
        "re-walks the same component over and over, once per cell it contains.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — re-derive each cell's component label by repeated scanning: wasteful, super-linear.",
      source:
        "function numIslands(grid) {\n" +
        "  const rows = grid.length, cols = grid[0].length;\n" +
        "  const label = Array.from({ length: rows }, () => new Array(cols).fill(0));\n" +
        "  let next = 0;\n" +
        "  for (let r = 0; r < rows; r++) {\n" +
        "    for (let c = 0; c < cols; c++) {\n" +
        "      if (grid[r][c] !== '1' || label[r][c] !== 0) continue;\n" +
        "      next++;\n" +
        "      // Re-flood from here to paint the whole component with this label...\n" +
        "      const stack = [[r, c]];\n" +
        "      label[r][c] = next;\n" +
        "      while (stack.length) {\n" +
        "        const [cr, cc] = stack.pop();\n" +
        "        for (const [nr, nc] of [[cr+1,cc],[cr-1,cc],[cr,cc+1],[cr,cc-1]]) {\n" +
        "          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;\n" +
        "          if (grid[nr][nc] !== '1' || label[nr][nc] !== 0) continue;\n" +
        "          label[nr][nc] = next;\n" +
        "          stack.push([nr, nc]);\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  return next;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Maintaining the `label` grid is busywork — we never actually need the labels, only the *count*. Can we do " +
        "better?\n\n" +
        "The key observation: the grid is a [graph](/study-guide/algos/topic/graphs) in disguise — each land cell is " +
        "a vertex, each pair of orthogonally adjacent land cells an edge — and counting islands is just counting " +
        "**connected components**. So scan once; the first time we touch an un-sunk land cell, that's a *new* island, " +
        "and a single flood fill ([DFS](/study-guide/algos/topic/depth-first-search)) sinks its entire component to " +
        "`\"0\"` so it's never recounted. The grid itself doubles as the visited marker.\n\n" +
        "The walk happens on the 2-D board, so the diagram is a `gridWalkthrough`. Sunk cells are marked; the cursor " +
        "is the cell the flood is currently sinking. Walking it through:",
    },
    {
      kind: "gridWalkthrough",
      heading: "scan + flood-fill — sinking each island so the next scan can't recount it",
      showIndices: true,
      grid: [
        ["1", "1", "0", "0", "1"],
        ["1", "0", "0", "0", "1"],
        ["0", "0", "1", "0", "0"],
        ["0", "0", "1", "1", "0"],
      ],
      frames: [
        {
          cursor: [0, 0],
          active: [[0, 0]],
          action: "scan hits (0,0)='1' → island #1, flood",
          caption: "The first land cell is the start of island #1. Launch a flood fill from it.",
        },
        {
          cursor: [1, 0],
          marked: [[0, 0], [0, 1], [1, 0]],
          grid: [
            ["0", "0", "0", "0", "1"],
            ["0", "0", "0", "0", "1"],
            ["0", "0", "1", "0", "0"],
            ["0", "0", "1", "1", "0"],
          ],
          action: "sink (0,0),(0,1),(1,0)",
          caption: "The flood reaches every cell connected to (0,0) — the L-shaped trio — sinking each to '0'. Island #1 is now erased from the grid.",
        },
        {
          cursor: [0, 4],
          marked: [[0, 4], [1, 4]],
          grid: [
            ["0", "0", "0", "0", "0"],
            ["0", "0", "0", "0", "0"],
            ["0", "0", "1", "0", "0"],
            ["0", "0", "1", "1", "0"],
          ],
          action: "scan resumes → (0,4)='1' → island #2, flood",
          caption: "The scan continues from where it left off and finds (0,4), still land: island #2. Flood sinks it and (1,4) below it.",
        },
        {
          cursor: [2, 2],
          marked: [[2, 2], [3, 2], [3, 3]],
          grid: [
            ["0", "0", "0", "0", "0"],
            ["0", "0", "0", "0", "0"],
            ["0", "0", "0", "0", "0"],
            ["0", "0", "0", "0", "0"],
          ],
          action: "scan → (2,2)='1' → island #3, flood",
          caption: "Lower down, (2,2) is the seed of island #3; the flood sinks the connected (3,2) and (3,3).",
        },
        {
          action: "scan finishes — no land left",
          caption: "The rest of the scan finds only water. Three flood-fills launched, so three islands. The diagonal gap between island #2 and the rest never merged them — adjacency is orthogonal only.",
        },
      ],
    },
  ],

  "rotting-oranges": [
    {
      kind: "prose",
      body:
        "Each minute, every fresh orange touching rot turns rotten. The literal simulation: sweep the whole grid " +
        "once per minute, marking which fresh oranges have a rotten neighbour, then flip them all — and repeat until " +
        "a full sweep changes nothing.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — re-scan the entire grid every minute: O((m·n)²) in the worst case.",
      source:
        "function orangesRotting(grid) {\n" +
        "  const rows = grid.length, cols = grid[0].length;\n" +
        "  let minutes = 0;\n" +
        "  while (true) {\n" +
        "    const toRot = [];\n" +
        "    // Full sweep: find every fresh orange adjacent to a rotten one.\n" +
        "    for (let r = 0; r < rows; r++)\n" +
        "      for (let c = 0; c < cols; c++)\n" +
        "        if (grid[r][c] === 1)\n" +
        "          for (const [nr, nc] of [[r+1,c],[r-1,c],[r,c+1],[r,c-1]])\n" +
        "            if (nr>=0&&nc>=0&&nr<rows&&nc<cols && grid[nr][nc] === 2)\n" +
        "              { toRot.push([r, c]); break; }\n" +
        "    if (toRot.length === 0) break;          // a minute with no change → stop\n" +
        "    for (const [r, c] of toRot) grid[r][c] = 2;\n" +
        "    minutes++;\n" +
        "  }\n" +
        "  for (const row of grid) if (row.includes(1)) return -1;  // some fresh orange stranded\n" +
        "  return minutes;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Re-scanning the entire grid every single minute is the waste — most cells aren't near the action. Can we do " +
        "better?\n\n" +
        "The key observation: the rot spreads outward one ring per minute from *all* current rotten oranges at once. " +
        "That is exactly a **multi-source [BFS](/study-guide/algos/topic/breadth-first-search)** — seed the queue with " +
        "every rotten orange, then expand level by level, where **each BFS level is one minute**. A fresh orange's " +
        "rotting time is simply its grid distance to the nearest rot source, which BFS measures for free. Track the " +
        "count of fresh oranges; if any remain after the queue drains, they were unreachable, so return `-1`.\n\n" +
        "The diagram is a `gridWalkthrough` over the real board (`2`=rotten, `1`=fresh, `0`=empty). Newly-rotted cells " +
        "are marked each frame; the section grid is overridden per frame to show the spread. Walking it through:",
    },
    {
      kind: "gridWalkthrough",
      heading: "multi-source BFS — the rotten frontier (marked) grows one ring per minute",
      showIndices: true,
      grid: [
        [2, 1, 1],
        [1, 1, 0],
        [0, 1, 1],
      ],
      frames: [
        {
          active: [[0, 0]],
          action: "minute 0: seed queue with all rotten = {(0,0)}",
          caption: "Only (0,0) is rotten at the start, and there are 6 fresh oranges. BFS begins with the single source.",
        },
        {
          marked: [[0, 1], [1, 0]],
          grid: [
            [2, 2, 1],
            [2, 1, 0],
            [0, 1, 1],
          ],
          action: "minute 1: rot (0,1) and (1,0)",
          caption: "The first ring: the two fresh neighbours of (0,0) rot. Fresh count drops 6 → 4.",
        },
        {
          marked: [[0, 2], [1, 1]],
          grid: [
            [2, 2, 2],
            [2, 2, 0],
            [0, 1, 1],
          ],
          action: "minute 2: rot (0,2) and (1,1)",
          caption: "Second ring out from the cells that rotted last minute. Fresh count 4 → 2, leaving (2,1) and (2,2).",
        },
        {
          marked: [[2, 1]],
          grid: [
            [2, 2, 2],
            [2, 2, 0],
            [0, 2, 1],
          ],
          action: "minute 3: rot (2,1) from (1,1); fresh = 1",
          caption: "(2,1) sits below (1,1) and rots this minute, leaving only (2,2) fresh. The (1,2)=0 empty cell is a gap the rot has to route around.",
        },
        {
          marked: [[2, 2]],
          grid: [
            [2, 2, 2],
            [2, 2, 0],
            [0, 2, 2],
          ],
          action: "minute 4: rot (2,2) from (2,1) → fresh = 0",
          caption: "The last fresh orange (2,2) rots from its neighbour (2,1). No fresh oranges remain, so the answer is the 4 minutes elapsed.",
        },
      ],
    },
  ],

  "longest-increasing-path-in-a-matrix": [
    {
      kind: "prose",
      body:
        "From each cell we want the longest strictly-increasing walk that starts there. The brute force does exactly " +
        "that, literally: a plain DFS from every cell, exploring each strictly-larger neighbour and tracking the " +
        "deepest chain — with no memory between starts.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — an independent DFS from every cell, recomputing shared subpaths: exponential.",
      source:
        "function longestIncreasingPath(matrix) {\n" +
        "  const rows = matrix.length, cols = matrix[0].length;\n" +
        "  // Longest increasing path starting at (r, c), recomputed from scratch each call.\n" +
        "  const dfs = (r, c) => {\n" +
        "    let best = 1;                          // the cell alone is a path of length 1\n" +
        "    for (const [nr, nc] of [[r+1,c],[r-1,c],[r,c+1],[r,c-1]]) {\n" +
        "      if (nr<0||nc<0||nr>=rows||nc>=cols) continue;\n" +
        "      if (matrix[nr][nc] > matrix[r][c])   // only step strictly upward\n" +
        "        best = Math.max(best, 1 + dfs(nr, nc));\n" +
        "    }\n" +
        "    return best;\n" +
        "  };\n" +
        "  let answer = 0;\n" +
        "  for (let r = 0; r < rows; r++)\n" +
        "    for (let c = 0; c < cols; c++)\n" +
        "      answer = Math.max(answer, dfs(r, c));\n" +
        "  return answer;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "The waste: many cells funnel into the same upward chains, and each DFS re-derives those chains from scratch. " +
        "Can we do better?\n\n" +
        "The key observation: because every step is *strictly* increasing, a path can never revisit a cell — the " +
        "grid-with-upward-edges is a **DAG**, so `longest(r, c)` depends only on `(r, c)`, never on how you arrived. " +
        "That makes it a perfect [memoisation](/study-guide/algos/topic/dynamic-programming) target: cache each " +
        "cell's answer the first time it's computed, and every later visit is an O(1) lookup. It's DFS plus a memo " +
        "table — a [DP](/study-guide/algos/topic/dynamic-programming) over the implicit graph.\n\n" +
        "The walk is on the board, so the diagram is a `gridWalkthrough`. The cursor is the cell being solved; cells " +
        "already memoised are marked. A badge-free board, so the captions carry the computed `longest` value. Walking " +
        "it through:",
    },
    {
      kind: "gridWalkthrough",
      heading: "DFS + memo — each cell's longest-path value is computed once, then reused",
      showIndices: true,
      grid: [
        [9, 9, 4],
        [6, 6, 8],
        [2, 1, 1],
      ],
      frames: [
        {
          cursor: [2, 1],
          active: [[2, 1]],
          action: "solve (2,1)=1: neighbours 2,6 are larger",
          caption: "Start at the global minimum (2,1)=1. Its larger neighbours are (2,0)=2 and (1,1)=6 — recurse into them first.",
        },
        {
          cursor: [2, 0],
          active: [[2, 0], [1, 0]],
          action: "(2,0)=2 → (1,0)=6 → (0,0)=9; chain 2→6→9",
          caption: "From (2,0)=2 the only larger step is up to (1,0)=6, then (0,0)=9. longest(0,0)=1, longest(1,0)=2, longest(2,0)=3 — all memoised on the way back.",
        },
        {
          cursor: [1, 1],
          marked: [[2, 0], [1, 0], [0, 0]],
          action: "(1,1)=6 → (0,1)=9; longest(1,1)=2",
          caption: "Back at (2,1)'s other branch: (1,1)=6 steps to (0,1)=9, giving longest(1,1)=2. Cells solved earlier (struck) are reused, not re-walked.",
        },
        {
          cursor: [2, 1],
          marked: [[2, 0], [1, 0], [0, 0], [1, 1], [0, 1]],
          action: "longest(2,1) = 1 + max(3, 2) = 4",
          caption: "(2,1)=1 takes the better branch: 1 + longest(2,0)=3 gives a path 1→2→6→9 of length 4 — the answer.",
        },
        {
          cursor: [1, 2],
          marked: [[2, 0], [1, 0], [0, 0], [1, 1], [0, 1], [2, 1]],
          action: "remaining cells: all ≤ length 4",
          caption: "The outer scan visits the rest, but each is an O(1) memo hit and none beats 4. Longest increasing path: 1 → 2 → 6 → 9.",
        },
      ],
    },
  ],

  "clone-graph": [
    {
      kind: "prose",
      body:
        "We must return a *deep copy* of a connected undirected graph — every node and every edge rebuilt as fresh " +
        "objects. The trap a naïve attempt falls into: walk the graph and, for each node, immediately recurse into " +
        "its neighbours. With cycles (and an undirected graph is full of them — every edge is a 2-cycle), that " +
        "recursion never terminates and clones the same node endlessly.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Naïve recursion — no memory of what's been cloned: loops forever on the first cycle.",
      source:
        "function cloneGraph(node) {\n" +
        "  if (!node) return null;\n" +
        "  const copy = new GraphNode(node.val);\n" +
        "  // BUG: a neighbour points back at `node`, so this recurses into `node`\n" +
        "  // again, clones it again, and never stops.\n" +
        "  for (const neighbor of node.neighbors) {\n" +
        "    copy.neighbors.push(cloneGraph(neighbor));\n" +
        "  }\n" +
        "  return copy;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "The fix is one piece of state: remember the clone we've already made for each original node. Can we do " +
        "better than looping forever? Yes — with a `Map` from *original node → its clone*.\n\n" +
        "The key observation: that map does double duty. It **dedupes** — a node reached from several neighbours is " +
        "cloned once — and it **breaks cycles** — when a back-edge revisits a node, the map already holds its " +
        "(possibly in-progress) clone, so we return that instead of recursing. The discipline is *record the clone in " +
        "the map before recursing into its neighbours*, so a back-edge finds it. This is a standard " +
        "[DFS](/study-guide/algos/topic/depth-first-search) with a visited map.\n\n" +
        "A graph isn't a sequence or a grid, so there's no faithful lane or board animation here — laying the four " +
        "nodes of the example on a circle, the clone proceeds like this. Take the square `1—2—3—4—1` (node 1 borders " +
        "2 and 4, and so on around the ring):",
    },
    {
      kind: "graph",
      caption:
        "The example graph: a 4-cycle. DFS from node 1 clones 1, records it, recurses to 2 (clone, record), to 3, " +
        "to 4 — and 4's neighbour 1 is already in the map, so its back-edge wires to the existing clone of 1 instead " +
        "of recursing. Four nodes cloned, eight directed neighbour links rebuilt, no infinite loop.",
      nodes: ["1", "2", "3", "4"],
      edges: [
        ["1", "2"],
        ["2", "3"],
        ["3", "4"],
        ["4", "1"],
      ],
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "**Grading is structure-only.** The tests serialize the returned graph back to an adjacency list and compare *shape* — they confirm you rebuilt the right nodes and edges, but serialization erases object identity, so they cannot catch a solution that returns the *original* graph unmodified. Still write a genuine deep copy (allocate new `GraphNode`s, wire new links); the structural check is necessary, not sufficient.",
        "**Record before you recurse.** Inserting the clone into the map *after* recursing into neighbours reopens the infinite loop — the back-edge runs before the map entry exists.",
      ],
    },
  ],

  "is-graph-bipartite": [
    {
      kind: "prose",
      body:
        "A graph is bipartite when its nodes split into two groups with every edge crossing between them — " +
        "equivalently, it can be 2-coloured with no two neighbours sharing a colour. A first instinct is to try every " +
        "possible 2-colouring and check each, but with `n` nodes that's 2ⁿ assignments — hopeless.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — test all 2^n colour assignments for a valid one: exponential.",
      source:
        "function isBipartite(graph) {\n" +
        "  const n = graph.length;\n" +
        "  // Try every way to paint the n nodes with 2 colours.\n" +
        "  for (let mask = 0; mask < (1 << n); mask++) {\n" +
        "    let ok = true;\n" +
        "    for (let u = 0; u < n && ok; u++) {\n" +
        "      for (const v of graph[u]) {\n" +
        "        // Same colour on both ends of an edge → this assignment fails.\n" +
        "        if (((mask >> u) & 1) === ((mask >> v) & 1)) { ok = false; break; }\n" +
        "      }\n" +
        "    }\n" +
        "    if (ok) return true;\n" +
        "  }\n" +
        "  return false;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Enumerating colourings throws away all structure. Can we do better?\n\n" +
        "The key observation: a colouring isn't free — *the moment you colour one node, every neighbour's colour is " +
        "forced* (the opposite). So we never guess: pick any node, colour it, " +
        "[BFS](/study-guide/algos/topic/breadth-first-search) outward giving each newly-seen node the colour opposite " +
        "its parent, and the instant an edge connects two same-coloured nodes, the graph isn't bipartite. Because the " +
        "graph may be disconnected, restart from every still-uncoloured node. This is a single O(V + E) traversal — " +
        "the conflict it's hunting for is an **odd-length cycle**, the one thing that can't be 2-coloured.\n\n" +
        "A general graph has no faithful lane or grid animation, so a static picture serves better than a misleading " +
        "one. The example below is the odd cycle that *fails*: nodes 0,1,2 form a triangle.",
    },
    {
      kind: "graph",
      caption:
        "Colour 0 = A. Its neighbours 1, 2, 3 must be B. But edge 1—2 joins two B nodes (1 and 2 are also " +
        "neighbours) — a same-colour edge, so the BFS reports false. The culprit is the odd cycle 0–1–2–0; an even " +
        "cycle like 0–1–2–3–0 would alternate A,B,A,B cleanly and pass.",
      nodes: ["0", "1", "2", "3"],
      edges: [
        ["0", "1"],
        ["0", "2"],
        ["0", "3"],
        ["1", "2"],
      ],
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "**Colour 0 means \"uncoloured\", not group A.** The stored solution uses `1` and `-1` for the two groups and `0` for unseen, so a single array tracks both the visited state and the colour. A neighbour gets `-color[u]` — the negation flips the group.",
        "**Restart per component.** A bipartite even cycle plus a separate odd triangle is *not* bipartite; the outer loop over every node is what catches a violation hiding in a second component.",
      ],
    },
  ],

  "number-of-provinces": [
    {
      kind: "prose",
      body:
        "A province is a maximal group of mutually-connected cities — a connected component of the friendship graph, " +
        "given here as an adjacency matrix. The straightforward read is to count components by traversal: but it's " +
        "worth seeing the problem through the lens of *merging*, which is what the stored Union-Find solution does.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "A clean DFS baseline — count the launches of a component flood. O(n²), the matrix size.",
      source:
        "function findCircleNum(isConnected) {\n" +
        "  const n = isConnected.length;\n" +
        "  const visited = new Array(n).fill(false);\n" +
        "  const dfs = (city) => {\n" +
        "    visited[city] = true;\n" +
        "    // Follow every direct connection out of this city.\n" +
        "    for (let next = 0; next < n; next++)\n" +
        "      if (isConnected[city][next] === 1 && !visited[next]) dfs(next);\n" +
        "  };\n" +
        "  let provinces = 0;\n" +
        "  for (let city = 0; city < n; city++) {\n" +
        "    // Each unvisited city begins a brand-new province.\n" +
        "    if (!visited[city]) { provinces++; dfs(city); }\n" +
        "  }\n" +
        "  return provinces;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "The DFS is already O(n²) and perfectly good. But the canonical tool for *\"how many groups, given a stream " +
        "of pairwise connections\"* is [Union-Find](/study-guide/algos/topic/union-find), and it's the model the " +
        "stored solution teaches.\n\n" +
        "The key observation: start with every city in its own singleton set, then for each edge `isConnected[i][j]`, " +
        "**union** the two endpoints. Two cities end up in the same set exactly when they're connected directly or " +
        "transitively — so the number of provinces is the number of distinct **roots** left at the end. Path " +
        "compression plus union-by-rank makes each operation effectively constant.\n\n" +
        "Union-Find tracks an evolving forest, not a sequence or a grid, so there's no lane to animate; the static " +
        "graph below shows the three components the unions discover. (The matrix `[[1,1,0],[1,1,1],[0,1,1]]` from the " +
        "example is one province; here is a clearer three-province instance for the picture.)",
    },
    {
      kind: "graph",
      caption:
        "Cities {0,1,2} are pairwise reachable, {3,4} form a second group, and 5 stands alone. Union 0–1 and 1–2 " +
        "collapse the first trio to a single root; union 3–4 collapses the pair; 5 is never unioned. Three roots " +
        "remain → three provinces.",
      nodes: ["0", "1", "2", "3", "4", "5"],
      edges: [
        ["0", "1"],
        ["1", "2"],
        ["0", "2"],
        ["3", "4"],
      ],
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "**Only scan `j > i`.** The matrix is symmetric and every city connects to itself (`isConnected[i][i] = 1`); unioning the upper triangle covers every real edge without redundant work or spurious self-unions.",
        "**Count roots, not unions.** The province count is the number of indices that are their own parent after all unions — equivalently `n` minus the number of *successful* (non-redundant) unions.",
      ],
    },
  ],

  "course-schedule": [
    {
      kind: "prose",
      body:
        "We can finish all the courses exactly when their prerequisite graph has no cycle — a cycle means a course " +
        "is, transitively, its own prerequisite. The brute-force way to detect a cycle is to launch a DFS from every " +
        "node and, on each path, check whether we ever revisit a node already on the current path.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — DFS for a back-edge from every start, no cross-call memory: redundant work.",
      source:
        "function canFinish(numCourses, prerequisites) {\n" +
        "  const adj = Array.from({ length: numCourses }, () => []);\n" +
        "  for (const [a, b] of prerequisites) adj[b].push(a);  // edge b → a (b unlocks a)\n" +
        "  // Does any path out of `node` loop back onto the current stack?\n" +
        "  const hasCycle = (node, onStack) => {\n" +
        "    if (onStack.has(node)) return true;                // revisited a node on this path → cycle\n" +
        "    onStack.add(node);\n" +
        "    for (const next of adj[node])\n" +
        "      if (hasCycle(next, onStack)) return true;\n" +
        "    onStack.delete(node);                              // leave the path on the way back up\n" +
        "    return false;\n" +
        "  };\n" +
        "  for (let c = 0; c < numCourses; c++)\n" +
        "    if (hasCycle(c, new Set())) return false;\n" +
        "  return true;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Restarting a fresh DFS from every course re-explores shared subgraphs over and over. Can we do better?\n\n" +
        "The key observation: cycle detection over a directed graph is exactly what a **topological sort** does as a " +
        "by-product. Build the graph with an edge `b → a` for each prerequisite `[a, b]`, and use " +
        "[Kahn's algorithm](/study-guide/algos/topic/topological-sort): compute each course's **in-degree** (number " +
        "of unmet prerequisites), start a queue with every in-degree-0 course, and repeatedly take a ready course, " +
        "decrementing the in-degree of everything it unlocks. Courses caught in a cycle never reach in-degree 0, so " +
        "if fewer than `numCourses` come out of the queue, a cycle blocked them — return false. One O(V + E) pass, no " +
        "restarts.\n\n" +
        "A dependency graph has no faithful lane animation. The static graph below is the acyclic case; the dashed " +
        "intuition: peel off in-degree-0 nodes layer by layer until either the graph empties (no cycle) or stalls " +
        "(cycle).",
    },
    {
      kind: "graph",
      caption:
        "Edges point from prerequisite to dependent (0→1, 0→2, 1→3, 2→3). In-degrees: 0:0, 1:1, 2:1, 3:2. Kahn's " +
        "takes 0 first (drops 1 and 2 to in-degree 0), then 1 and 2 (dropping 3 to 0), then 3. All four come out → " +
        "no cycle → all courses finishable. Add an edge 3→0 and nothing ever reaches in-degree 0: a cycle.",
      directed: true,
      nodes: ["0", "1", "2", "3"],
      edges: [
        ["0", "1"],
        ["0", "2"],
        ["1", "3"],
        ["2", "3"],
      ],
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "**Edge direction is the whole problem.** `[a, b]` means *b before a*, so the unlock edge is `b → a`. Reverse it and a finishable curriculum reports a cycle and vice-versa.",
        "**Count, don't inspect.** You never need the actual ordering — just whether the number of courses dequeued equals `numCourses`. A shortfall is precisely the set of cycle-trapped courses.",
      ],
    },
  ],

  "network-delay-time": [
    {
      kind: "prose",
      body:
        "A signal leaves node `k` and travels along weighted directed edges; we want the moment *all* nodes have " +
        "received it — the largest shortest-arrival-time over every node, or `-1` if one is unreachable. Since edges " +
        "carry different costs, a plain BFS (which counts edges, not cost) gives the wrong answer; the textbook " +
        "starting point is Bellman–Ford, relaxing every edge `V − 1` times.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Bellman–Ford — relax all edges V−1 times: correct but O(V·E).",
      source:
        "function networkDelayTime(times, n, k) {\n" +
        "  const dist = new Array(n + 1).fill(Infinity);\n" +
        "  dist[k] = 0;\n" +
        "  // V-1 rounds; each round tries to shorten every edge.\n" +
        "  for (let round = 0; round < n - 1; round++) {\n" +
        "    for (const [u, v, w] of times) {\n" +
        "      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {\n" +
        "        dist[v] = dist[u] + w;            // found a cheaper route to v\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "  let slowest = 0;\n" +
        "  for (let node = 1; node <= n; node++) {\n" +
        "    if (dist[node] === Infinity) return -1;\n" +
        "    slowest = Math.max(slowest, dist[node]);\n" +
        "  }\n" +
        "  return slowest;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Bellman–Ford re-relaxes every edge in every round, even edges whose endpoints didn't change. Can we do " +
        "better?\n\n" +
        "The key observation: with **non-negative** weights, once we settle the *closest* unsettled node its distance " +
        "is final — no later, longer detour can improve it. That's [Dijkstra](/study-guide/algos/topic/greedy): keep " +
        "a frontier of `(distance, node)`, always expand the smallest-distance node next, and relax its outgoing " +
        "edges. Each node settles once; with a [heap](/study-guide/algos/topic/heaps) the cost is O(E log V). The " +
        "answer is the max settled distance, or `-1` if any node stays at `Infinity`.\n\n" +
        "A weighted graph has no faithful lane animation, so the static picture and a distance trace serve better " +
        "than a misleading one. Example: `times = [[2,1,1],[2,3,1],[3,4,1]]`, `k = 2`.",
    },
    {
      kind: "graph",
      caption:
        "From source 2 (all weights 1): settle 2 at distance 0, then its neighbours 1 and 3 at distance 1, then 4 " +
        "at distance 2 (via 3). Every node reached; the slowest arrival is node 4 at 2 — so the answer is 2. Had any " +
        "node had no incoming route from 2, it would stay at Infinity and the answer would be -1.",
      directed: true,
      nodes: ["2", "1", "3", "4"],
      edges: [
        ["2", "1"],
        ["2", "3"],
        ["3", "4"],
      ],
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "**Settle once, skip stale entries.** A node can sit in the frontier under several distances; when you pop one whose distance already exceeds the recorded best, skip it — it's a superseded entry.",
        "**Dijkstra needs non-negative weights.** The settle-and-never-revisit guarantee breaks with a negative edge; that case wants Bellman–Ford instead. Here weights are `0..100`, so Dijkstra is safe.",
        "**The stored solution uses a sort-based frontier** rather than a binary heap — same algorithm, an extra log factor, plenty fast for `n ≤ 100`. The `(d > dist[u])` guard is the stale-entry skip.",
      ],
    },
  ],

  "min-cost-to-connect-all-points": [
    {
      kind: "prose",
      body:
        "We must connect every point into one network at minimum total Manhattan-distance cost — the weight of a " +
        "**minimum spanning tree** over the complete graph of points. A naïve greedy that just repeatedly adds the " +
        "globally cheapest edge (ignoring structure) risks forming cycles or leaving the tree disconnected; the " +
        "honest brute force is to build all `O(n²)` edges, sort them, and add edges that don't create a cycle.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption: "Brute force — Kruskal over the full edge list: build all n² edges, sort, union. O(n² log n).",
      source:
        "function minCostConnectPoints(points) {\n" +
        "  const n = points.length;\n" +
        "  const edges = [];\n" +
        "  // Every pair is a candidate edge, weighted by Manhattan distance.\n" +
        "  for (let i = 0; i < n; i++)\n" +
        "    for (let j = i + 1; j < n; j++)\n" +
        "      edges.push([Math.abs(points[i][0]-points[j][0]) + Math.abs(points[i][1]-points[j][1]), i, j]);\n" +
        "  edges.sort((a, b) => a[0] - b[0]);          // cheapest first\n" +
        "  const parent = Array.from({ length: n }, (_, i) => i);\n" +
        "  const find = (x) => parent[x] === x ? x : (parent[x] = find(parent[x]));\n" +
        "  let total = 0, used = 0;\n" +
        "  for (const [w, i, j] of edges) {\n" +
        "    const ri = find(i), rj = find(j);\n" +
        "    if (ri === rj) continue;                  // would form a cycle — skip\n" +
        "    parent[ri] = rj; total += w; used++;      // safe edge: add it\n" +
        "    if (used === n - 1) break;                // tree complete\n" +
        "  }\n" +
        "  return total;\n" +
        "}",
    },
    {
      kind: "prose",
      body:
        "Materialising and sorting all `n²` edges is the cost. Can we do better?\n\n" +
        "The key observation: the graph is *complete* — every pair is connectable — so we never need the edge list at " +
        "all. **Prim's** algorithm grows one tree outward: keep `minDist[i]` = the cheapest edge from point `i` to the " +
        "tree so far, repeatedly pull in the nearest outside point, add its cost, and relax every remaining point " +
        "against its distance to the newly-added one. For a dense graph this O(n²) scan-and-relax beats sorting " +
        "O(n²) edges. Both Prim and Kruskal are [greedy](/study-guide/algos/topic/greedy) MST builders.\n\n" +
        "A point cloud and its spanning tree don't animate on a lane. The static graph shows the MST edges chosen for " +
        "the example points `[[0,0],[2,2],[3,10],[5,2],[7,0]]` (labelled by index).",
    },
    {
      kind: "graph",
      caption:
        "MST over the five points (Manhattan costs): 0–1 = 4, 1–3 = 3, 3–4 = 4, 3–2 = 9. Total 4 + 3 + 4 + 9 = 20. " +
        "Prim seeds at point 0, then each step adds the cheapest edge reaching a point not yet in the tree, never " +
        "forming a cycle — four edges connect all five points.",
      nodes: ["0", "1", "2", "3", "4"],
      edges: [
        ["0", "1"],
        ["1", "3"],
        ["3", "4"],
        ["3", "2"],
      ],
    },
    {
      kind: "callout",
      tone: "info",
      items: [
        "**An MST always has exactly `n − 1` edges** and no cycles. Prim adds exactly one point (and one edge) per step after the seed, so it can't over- or under-connect.",
        "**The dense O(n²) Prim is deliberate.** With a complete graph, the heap-based O(E log V) Prim degrades to O(n² log n); the plain array scan is simpler *and* asymptotically better here.",
      ],
    },
  ],
};

/**
 * A row in a problem's "Test cases" table — an edge case worth thinking through, *not* a hidden judge test.
 * Stored as runnable `args`/`expected` (same shape the judge uses) so the auditor agent can execute each case
 * through the worker; the table's Input / Expected columns are *derived* from these, matching the Example
 * section's formatting. `args` is the argument tuple in call order; `expected` is the reference return.
 */
export type GuideTestCase = { args: unknown[]; expected: unknown; note: string };

/** Fresh 9x9 board of empty cells, for building small single-conflict test boards. */
const emptyBoard = () => Array.from({ length: 9 }, () => Array<string>(9).fill("."));

/**
 * Post-optimization teaching content, shown *after* the Optimization section: a complexity write-up and a
 * table of edge cases worth considering. Authored (the test cases are deliberately not the real hidden tests,
 * so the page can't be used to game the judge). Keyed by problem id, same enrichment posture as PROBLEM_GUIDES.
 */
export const PROBLEM_EXTRAS: Record<string, { complexity?: Section[]; testCases?: GuideTestCase[] }> = {
  "invert-binary-tree": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The recursion visits each of the `n` nodes exactly once.\n" +
          "- At each node it does O(1) work — swap two child references.\n\n" +
          "So the total is `n × O(1)` = **O(n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(h). Here's why:\n\n" +
          "- The only extra space is the recursion call stack, which is as deep as the tree's height `h`.\n\n" +
          "That's O(log n) for a balanced tree and **O(n)** for a degenerate (single-chain) tree. The output reuses " +
          "the input nodes, so it isn't counted separately.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty tree — nothing to invert." },
      { args: [[8]], expected: [8], note: "Single node — its (absent) children swap to no effect." },
      { args: [[6, 4, 9]], expected: [6, 9, 4], note: "Root's two children swap left for right." },
      { args: [[2, 1, null, 0]], expected: [2, null, 1, null, 0], note: "A left-only spine inverts into a right-only spine." },
      { args: [[3, 3, 3, 3]], expected: [3, 3, 3, null, null, null, 3], note: "Duplicate values: only the positions swap, the structure mirrors." },
    ],
  },
  "balanced-binary-tree": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The bottom-up height function visits each node once and does O(1) work per node.\n" +
          "- The `-1` sentinel makes it short-circuit, so it never does *more* than one pass.\n\n" +
          "That's **O(n)**, down from the brute force's O(n²) of recomputing heights at every ancestor.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(h). Here's why:\n\n" +
          "- Only the recursion stack, as deep as the tree height `h`.\n\n" +
          "O(log n) balanced, **O(n)** for a degenerate tree. No auxiliary structure is built.",
      },
    ],
    testCases: [
      { args: [[]], expected: true, note: "Empty tree is vacuously balanced." },
      { args: [[7]], expected: true, note: "Single node — both subtrees are height 0." },
      { args: [[8, 4, 12, 2, 6, 10, 14]], expected: true, note: "A perfect tree is balanced everywhere." },
      { args: [[9, 5, 13, 3]], expected: true, note: "Left subtree height 2, right height 1: differ by exactly 1, still balanced." },
      { args: [[5, 6, null, 7, null, 8]], expected: false, note: "A left-leaning chain of depth 3 is unbalanced at the root (2 vs 0)." },
    ],
  },
  "symmetric-tree": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The paired recursion compares each node against its mirror partner exactly once.\n" +
          "- Each comparison is O(1).\n\n" +
          "So **O(n)** overall, and it short-circuits to less on the first mismatch.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(h). Here's why:\n\n" +
          "- The recursion descends both sides in lockstep, so the stack depth is the tree height `h`.\n\n" +
          "O(log n) balanced, **O(n)** worst case. Unlike the brute force, no mirror copy is allocated.",
      },
    ],
    testCases: [
      { args: [[7]], expected: true, note: "Single node — trivially symmetric." },
      { args: [[9, 4, 4]], expected: true, note: "Two equal leaves mirror each other." },
      { args: [[6, 2, 2, 8, null, null, 8]], expected: true, note: "Outer children cross-match (left-2's left mirrors right-2's right)." },
      { args: [[6, 2, 2, 8, null, 8, null]], expected: false, note: "Left-2 has a left child, right-2 a left child too — they don't mirror." },
      { args: [[5, 7, 9]], expected: false, note: "Root's two children differ in value." },
    ],
  },
  "binary-tree-vertical-order-traversal": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The BFS visits each of the `n` nodes once, doing O(1) work (a map lookup and an append).\n" +
          "- Reading the buckets out spans `c` columns where `c ≤ n`.\n\n" +
          "So **O(n)** — no per-column sort is needed, because BFS already delivers each column in the required order.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The queue and the column buckets together hold every node — O(n).\n\n" +
          "The output array also holds `n` values, but it's the unavoidable result; the extra working space is **O(n)**.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty tree — no columns." },
      { args: [[9]], expected: [[9]], note: "Single node sits alone in column 0." },
      { args: [[5, 6, null, 7]], expected: [[7], [6], [5]], note: "A left spine spreads one column further left at each step." },
      { args: [[2, 4, 6, 8, 10, 12, 14]], expected: [[8], [4], [2, 10, 12], [6], [14]], note: "Column 0 collects the root then both inner grandchildren, in BFS order." },
      { args: [[0, -5, 5]], expected: [[-5], [0], [5]], note: "Negative values are grouped by column, not by magnitude." },
    ],
  },
  "construct-binary-tree-from-preorder-and-inorder-traversal": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Building the value→inorder-index map is one pass — O(n).\n" +
          "- The recursion creates each of the `n` nodes once, finding its split point via the map in O(1).\n\n" +
          "So **O(n)**, versus the brute force's O(n²) from repeated `indexOf` searches and array slicing.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The index map holds `n` entries.\n" +
          "- The recursion stack is O(h), at most O(n) for a skewed tree.\n\n" +
          "So **O(n)**. The output tree reuses freshly built nodes — the unavoidable result.",
      },
    ],
    testCases: [
      { args: [[9], [9]], expected: [9], note: "Single node." },
      { args: [[7, 8, 9], [7, 8, 9]], expected: [7, null, 8, null, 9], note: "Preorder == inorder → a pure right spine." },
      { args: [[9, 8, 7], [7, 8, 9]], expected: [9, 8, null, 7], note: "Preorder reversed of inorder → a pure left spine." },
      { args: [[10, 20, 40, 50, 30, 60, 70], [40, 20, 50, 10, 60, 30, 70]], expected: [10, 20, 30, 40, 50, 60, 70], note: "A perfect tree reconstructed from its two traversals." },
      { args: [[8, 4, 2, 6], [2, 4, 6, 8]], expected: [8, 4, null, 2, 6], note: "A left-leaning shape: 4 has two children, 8 only a left subtree." },
    ],
  },
  "kth-smallest-element-in-a-bst": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(h + k). Here's why:\n\n" +
          "- The walk descends to the leftmost node — O(h) pushes.\n" +
          "- Then it pops in-order until the count reaches `k` — O(k) more pops.\n\n" +
          "So **O(h + k)**, which beats the brute force's full O(n) traversal when `k` is small.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(h). Here's why:\n\n" +
          "- The explicit stack holds at most one root-to-leaf path at a time — O(h).\n\n" +
          "O(log n) balanced, **O(n)** for a degenerate tree. No full array of values is built.",
      },
    ],
    testCases: [
      { args: [[8], 1], expected: 8, note: "Single node, k = 1." },
      { args: [[4, 2, 6], 1], expected: 2, note: "k = 1 returns the leftmost (smallest) value." },
      { args: [[4, 2, 6], 3], expected: 6, note: "k at the maximum returns the largest value." },
      { args: [[6, 4, 8, 2, 5, 7, 9], 4], expected: 6, note: "In-order [2,4,5,6,7,8,9]; the 4th is the root, 6." },
      { args: [[20, 10, 30, 5, 15, 25, 35], 5], expected: 25, note: "In-order [5,10,15,20,25,30,35]; the 5th is 25." },
    ],
  },
  "lowest-common-ancestor-of-a-binary-tree": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- One post-order pass visits each node at most once, doing O(1) work.\n\n" +
          "So **O(n)** — a single traversal, versus the brute force's two path-finding passes.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(h). Here's why:\n\n" +
          "- Only the recursion stack, depth equal to the tree height `h`.\n\n" +
          "O(log n) balanced, **O(n)** worst case. No path lists are stored.",
      },
    ],
    testCases: [
      { args: [[9, 5], 9, 5], expected: 9, note: "The root is an ancestor of its child, so it's the LCA." },
      { args: [[10, 20, 30, 40, 50, 60, 70], 40, 50], expected: 20, note: "40 and 50 are the two children of 20 — their LCA." },
      { args: [[10, 20, 30, 40, 50, 60, 70], 40, 70], expected: 10, note: "Targets in opposite subtrees → the root." },
      { args: [[8, null, 6, null, 4, null, 2], 6, 2], expected: 6, note: "On a right spine, the shallower target 6 is the ancestor of 2." },
      { args: [[10, 20, 30, 40, 50, 60, 70], 60, 70], expected: 30, note: "60 and 70 are 30's two children, so 30 is their LCA." },
    ],
  },
  "binary-tree-maximum-path-sum": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- One post-order pass; each node returns its downward gain and updates the global best in O(1).\n\n" +
          "So **O(n)**, fusing the brute force's two O(n) passes (which made it O(n²)) into one.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(h). Here's why:\n\n" +
          "- Only the recursion stack — depth `h`.\n\n" +
          "O(log n) balanced, **O(n)** for a chain. The single `best` accumulator is O(1).",
      },
    ],
    testCases: [
      { args: [[7]], expected: 7, note: "A single node — the path is just itself." },
      { args: [[-5]], expected: -5, note: "All-negative: a non-empty path must take the one node." },
      { args: [[-8, -3]], expected: -3, note: "Best is the lone less-negative node, not the sum." },
      { args: [[4, 5, 6]], expected: 15, note: "The path turns at the root: 5 → 4 → 6." },
      { args: [[3, -4, -5]], expected: 3, note: "Both children are negative and dropped; the root alone wins." },
    ],
  },
  "binary-tree-right-side-view": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The level-order traversal visits each node once, doing O(1) work.\n\n" +
          "So **O(n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(w). Here's why:\n\n" +
          "- The queue holds at most one level at a time — its width `w`, up to ~n/2 at the bottom of a full tree.\n\n" +
          "So **O(n)** in the worst case. Unlike the brute force, no per-level array is retained.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty tree — nothing visible." },
      { args: [[9]], expected: [9], note: "Single node is visible." },
      { args: [[5, 6, 7]], expected: [5, 7], note: "Level 1's rightmost is 7." },
      { args: [[5, 6, null, 7]], expected: [5, 6, 7], note: "A left-only spine: each node is its level's rightmost." },
      { args: [[5, 6, 7, 8]], expected: [5, 7, 8], note: "Level 2's only node (left child 8) becomes visible." },
    ],
  },
  "maximum-width-of-binary-tree": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The BFS carries an index with each node and visits each node once.\n\n" +
          "So **O(n)** — the per-level re-basing keeps the index arithmetic O(1) and avoids the brute force's " +
          "exponential null-padding.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(w). Here's why:\n\n" +
          "- The queue holds one level of real nodes (with indices) at a time — its width `w`.\n\n" +
          "So **O(n)** worst case, without ever materializing the empty slots between nodes.",
      },
    ],
    testCases: [
      { args: [[9]], expected: 1, note: "Single node — width 1." },
      { args: [[2, 4, 6, 8, 10, 12, 14]], expected: 4, note: "A perfect tree: the bottom level has 4 nodes, no gaps." },
      { args: [[5, 6, 7, 8, null, null, 9]], expected: 4, note: "Bottom level: 8 at index 0, 9 at index 3 → width 4 across the gap." },
      { args: [[5, 6, 7, 8]], expected: 2, note: "Level 1 (two nodes) reaches width 2; the bottom node is alone." },
      { args: [[5, null, 6, null, 7]], expected: 1, note: "A right-only spine never exceeds width 1." },
    ],
  },
  "serialize-and-deserialize-binary-tree": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Serialize walks every node once, emitting its value or a `#` sentinel.\n" +
          "- Deserialize consumes every token once.\n\n" +
          "So the round trip is **O(n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The serialized string has one token per node plus its null markers — O(n).\n" +
          "- The recursion stack is O(h) on each side.\n\n" +
          "So **O(n)** overall, dominated by the string.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty tree round-trips to empty." },
      { args: [[9]], expected: [9], note: "Single node." },
      { args: [[8, 4, 9, null, null, 6, 10]], expected: [8, 4, 9, null, null, 6, 10], note: "Interior gaps must survive the round trip exactly." },
      { args: [[-7, -8, -9]], expected: [-7, -8, -9], note: "Negative values must serialize and parse back correctly." },
      { args: [[5, 6, null, 7, null, 8]], expected: [5, 6, null, 7, null, 8], note: "A left spine: the sentinels pin down the missing right children." },
    ],
  },
  "same-tree": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The lockstep recursion compares each pair of corresponding nodes once.\n\n" +
          "So **O(n)** (n = the size of the smaller tree at most), short-circuiting on the first mismatch.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(h). Here's why:\n\n" +
          "- Only the recursion stack — depth equal to the tree height `h`.\n\n" +
          "O(log n) balanced, **O(n)** worst case. No serialization strings are built.",
      },
    ],
    testCases: [
      { args: [[], []], expected: true, note: "Two empty trees are the same." },
      { args: [[9], []], expected: false, note: "One node vs none — shapes differ." },
      { args: [[7, 8, 9], [7, 8, 9]], expected: true, note: "Identical shape and values." },
      { args: [[5, 6], [5, null, 6]], expected: false, note: "Same values, different shape (left vs right child)." },
      { args: [[4, 5, 4], [4, 4, 5]], expected: false, note: "Same shape, mismatched values." },
    ],
  },
  "binary-tree-inorder-traversal": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Each node is pushed and popped exactly once.\n\n" +
          "So **O(n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(h). Here's why:\n\n" +
          "- The explicit stack holds at most one root-to-leaf path — O(h).\n\n" +
          "O(log n) balanced, **O(n)** for a skewed tree. The output array is the unavoidable result.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty tree." },
      { args: [[9]], expected: [9], note: "Single node." },
      { args: [[5, 3, 8]], expected: [3, 5, 8], note: "A balanced BST: in-order is sorted." },
      { args: [[5, null, 6, null, 7]], expected: [5, 6, 7], note: "A right spine: still left-node-right order." },
      { args: [[7, 6, null, 5]], expected: [5, 6, 7], note: "A left spine yields ascending order too." },
    ],
  },
  "validate-binary-search-tree": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The bounded recursion visits each node once, doing an O(1) interval check.\n\n" +
          "So **O(n)**, short-circuiting on the first violation.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(h). Here's why:\n\n" +
          "- Only the recursion stack — depth `h`.\n\n" +
          "O(log n) balanced, **O(n)** worst case. No in-order array is materialized.",
      },
    ],
    testCases: [
      { args: [[9]], expected: true, note: "Single node is a valid BST." },
      { args: [[8, 4, 12]], expected: true, note: "4 < 8 < 12 — valid." },
      { args: [[8, 2, 7, null, null, 6, 9]], expected: false, note: "7 is in 8's right subtree but 7 < 8 — global violation." },
      { args: [[3, 3, 3]], expected: false, note: "Duplicates break the strict ordering." },
      { args: [[20, 10, 30, null, null, 15, 40]], expected: false, note: "15 sits in 20's right subtree but is less than 20." },
    ],
  },
  "range-sum-query-immutable": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n + q). Here's why:\n\n" +
          "- Building the prefix array is one pass over `nums` — O(n).\n" +
          "- After that, each of the `q` queries is a single subtraction `prefix[j+1] - prefix[i]` — O(1) apiece, " +
          "O(q) in total.\n\n" +
          "So the whole batch is O(n) + O(q) = **O(n + q)**, versus the brute force's O(n·q) of re-summing each " +
          "range. The precompute pays for itself as soon as there's more than one query.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The prefix array holds `n + 1` running totals — O(n).\n" +
          "- The answer array holds one number per query — O(q), the unavoidable output.\n\n" +
          "Not counting the output, the extra space is the prefix array, **O(n)**.",
      },
    ],
    testCases: [
      { args: [[], []], expected: [], note: "Empty array and no queries — nothing to build, nothing to answer." },
      { args: [[42], [[0, 0]]], expected: [42], note: "Single element; the only valid range returns it." },
      { args: [[3, 1, 4, 1, 5], [[2, 2]]], expected: [4], note: "Single-element range i === j returns just nums[i]." },
      { args: [[-5, -5, -5], [[0, 2]]], expected: [-15], note: "All-negative array — prefix subtraction handles signs." },
      { args: [[2, -1, 3, -2], [[0, 3], [1, 2]]], expected: [2, 2], note: "Mixed signs; overlapping ranges off one prefix array." },
    ],
  },
  "subarray-sum-equals-k": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The algorithm makes a single pass over `nums`.\n" +
          "- Each step does O(1) work: one map lookup for `prefix - k` and one map insert.\n\n" +
          "So the whole scan is `n × O(1)` = **O(n)** — a clean linear pass, down from the brute force's O(n²) of " +
          "trying every start/end pair.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The counts map can hold up to one entry per distinct prefix value, and there are at most `n + 1` " +
          "prefixes — O(n).\n\n" +
          "The worst case (all distinct prefixes) keeps every prefix in the map, so the extra space is **O(n)**. " +
          "There's no output array — the answer is a single count.",
      },
    ],
    testCases: [
      { args: [[1], 1], expected: 1, note: "Single element equal to k — one subarray." },
      { args: [[1], 2], expected: 0, note: "Single element, no subarray sums to k." },
      { args: [[0, 0, 0, 0], 0], expected: 10, note: "All zeros, k = 0 — every subarray qualifies: 4·5/2 = 10." },
      { args: [[-2, 1, 1, -2], 0], expected: 2, note: "Negatives and a zero-sum target: [-2,1,1] and [1,1,-2]." },
      { args: [[3, 3, 3], 3], expected: 3, note: "Repeated value — each single 3 counts once." },
      { args: [[2, -2, 2, -2], 0], expected: 4, note: "Alternating signs; multiple revisited prefixes." },
    ],
  },
  "product-of-array-except-self": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The left-to-right pass writes each prefix product into the output — O(n).\n" +
          "- The right-to-left pass folds in each suffix product — another O(n).\n\n" +
          "Two sequential linear passes give `2 × O(n)` = **O(n)**, replacing the brute force's O(n²) of multiplying " +
          "all the others for each slot.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Both prefix and suffix are tracked in single scalar accumulators, not arrays.\n" +
          "- The output array is required by the problem, so it isn't counted as extra space.\n\n" +
          "Beyond the output, only two running products are kept, so the extra space is **O(1)**.",
      },
    ],
    testCases: [
      { args: [[3, 4]], expected: [4, 3], note: "Two elements — each slot is just the other." },
      { args: [[0, 1, 2]], expected: [2, 0, 0], note: "One zero — only the zero's slot is non-zero." },
      { args: [[0, 0, 5]], expected: [0, 0, 0], note: "Two zeros — every slot becomes 0." },
      { args: [[-1, 2, -3]], expected: [-6, 3, -2], note: "Negatives — sign tracks through both passes." },
      { args: [[2, 2, 2, 2]], expected: [8, 8, 8, 8], note: "All equal — each slot is the product of the other three." },
    ],
  },
  "range-sum-query-2d-immutable": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(m·n + q). Here's why:\n\n" +
          "- Building the 2D prefix table touches every cell once — O(m·n).\n" +
          "- Each of the `q` queries reads four table entries and combines them — O(1) apiece, O(q) total.\n\n" +
          "So the batch is O(m·n) + O(q) = **O(m·n + q)**, versus the brute force's O(m·n) *per query*. The table " +
          "build is amortized across every query.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(m·n). Here's why:\n\n" +
          "- The prefix table is `(m + 1) × (n + 1)` — one extra padding row and column — so O(m·n).\n\n" +
          "Not counting the per-query output array, the dominant extra space is the table itself, **O(m·n)**.",
      },
    ],
    testCases: [
      { args: [[[7]], [[0, 0, 0, 0]]], expected: [7], note: "Single cell — the only rectangle is that cell." },
      { args: [[[2, 3], [4, 5]], [[0, 0, 1, 1]]], expected: [14], note: "Whole 2×2 matrix — the full sum (2+3+4+5)." },
      { args: [[[1, 2, 3], [4, 5, 6]], [[0, 1, 1, 2]]], expected: [16], note: "A 2×2 sub-rectangle: 2+3+5+6." },
      { args: [[[-1, -2], [-3, -4]], [[0, 0, 1, 1], [1, 1, 1, 1]]], expected: [-10, -4], note: "All-negative; whole matrix then a single cell." },
      { args: [[[2, 0], [0, 2]], [[0, 0, 0, 1], [0, 1, 1, 1]]], expected: [2, 2], note: "Row strip then column strip off the same table." },
    ],
  },
  "set-matrix-zeroes": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(m·n). Here's why:\n\n" +
          "- A first sweep over every cell records which rows and columns must be zeroed — `m × n` cells.\n" +
          "- A second sweep over every cell applies the marks — another `m × n` cells.\n\n" +
          "Both passes are linear in the cell count and run one after the other, so the total is " +
          "2 × O(m·n) = **O(m·n)**, where `m` and `n` are the matrix's dimensions. We can't do better — any " +
          "correct solution must inspect every cell at least once.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The brute-force baseline keeps two sets, `zeroRows` and `zeroCols`, holding up to `m` and `n` " +
          "entries — that's O(m + n) extra space.\n" +
          "- The stored solution drops both sets: it reuses the matrix's own first row and first column as the " +
          "marker storage and adds only two booleans (`firstRowZero`, `firstColZero`) — O(1) extra space.\n\n" +
          "So the optimization trades the O(m + n) sets for **O(1)** extra space. Nothing new is allocated — the " +
          "result is the same matrix mutated in place, so there is no output array to count.",
      },
    ],
    testCases: [
      {
        args: [[[1, 2, 3], [4, 5, 6]]],
        expected: [[1, 2, 3], [4, 5, 6]],
        note: "No zero anywhere — the matrix is returned unchanged.",
      },
      {
        args: [[[2, 3, 4], [5, 0, 7], [8, 9, 1]]],
        expected: [[2, 0, 4], [0, 0, 0], [8, 0, 1]],
        note: "A single interior zero at (1,1) clears row 1 and column 1, leaving the corners intact.",
      },
      {
        args: [[[0, 3, 3], [4, 5, 6]]],
        expected: [[0, 0, 0], [0, 5, 6]],
        note: "Zero in the top-left corner — the tricky case for the marker trick, since (0,0) is both a header and data. firstRowZero and firstColZero handle it: row 0 and column 0 both clear.",
      },
      {
        args: [[[1, 2], [0, 0]]],
        expected: [[0, 0], [0, 0]],
        note: "An all-zero row marks both columns, so its zeros cascade upward and the whole matrix clears.",
      },
      {
        args: [[[2, 0, 4, 5]]],
        expected: [[0, 0, 0, 0]],
        note: "Single-row 1xN matrix — the only row contains a zero, so the entire row clears.",
      },
      {
        args: [[[2], [0], [5]]],
        expected: [[0], [0], [0]],
        note: "Single-column Nx1 matrix — the zero at (1,0) clears the lone column top to bottom.",
      },
    ],
  },

  "valid-sudoku": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(1) for this problem. Here's why:\n\n" +
          "- The board is a fixed `9 x 9`, so the scan always visits exactly 81 cells.\n" +
          "- Each cell does a constant amount of work: derive three keys and do three O(1) set probes.\n\n" +
          "There is no loop whose length grows with an input size, so the work is bounded by a constant — **O(1)**. " +
          "Phrased for a general `n x n` board it would be **O(n²)**: one visit per cell over the n² cells, with " +
          "O(1) per cell.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1) for this problem. Here's why:\n\n" +
          "- The `seen` set holds at most three keys per filled cell, so at most 3 × 81 = 243 keys — a fixed bound.\n" +
          "- No other storage grows with the board.\n\n" +
          "So the extra space is constant, **O(1)**. For a general `n x n` board the set holds up to O(n²) keys, " +
          "so it would be **O(n²)**. Nothing is returned but a boolean, so there is no output array to count.",
      },
    ],
    testCases: [
      {
        args: [emptyBoard()],
        expected: true,
        note: "Empty board — no filled cells means no constraints, so it is trivially valid.",
      },
      {
        args: [(() => { const b = emptyBoard(); b[4][4] = "9"; return b; })()],
        expected: true,
        note: "A single filled cell can never conflict with itself.",
      },
      {
        args: [(() => { const b = emptyBoard(); b[2][0] = "6"; b[2][7] = "6"; return b; })()],
        expected: false,
        note: "Row conflict — two 6s in row 2 (different boxes), caught by the shared `row-2-6` key.",
      },
      {
        args: [(() => { const b = emptyBoard(); b[0][3] = "2"; b[5][3] = "2"; return b; })()],
        expected: false,
        note: "Column conflict — two 2s down column 3 (different rows and boxes).",
      },
      {
        args: [(() => { const b = emptyBoard(); b[3][3] = "4"; b[5][5] = "4"; return b; })()],
        expected: false,
        note: "Box-only conflict — two 4s in the centre box at different rows and columns.",
      },
      {
        args: [(() => { const b = emptyBoard(); b[0][0] = "7"; b[4][4] = "7"; b[8][8] = "7"; return b; })()],
        expected: true,
        note: "Same digit, distinct row/column/box each time — repeats across the board are allowed.",
      },
    ],
  },

  "valid-palindrome": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Cleaning the string scans every character once to lowercase it and drop non-alphanumerics — O(n).\n" +
          "- The two pointers then start at opposite ends and only move toward each other, touching each cleaned " +
          "character at most once — O(n).\n\n" +
          "Both passes are linear and run one after the other, so the overall time is **O(n)**, where `n` is the " +
          "length of `s`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The cleaned, lowercased copy of the string can be as long as the input — O(n).\n" +
          "- The two-pointer scan over it adds only a couple of index variables — O(1).\n\n" +
          "The cleaned copy dominates, so the extra space is **O(n)**. (Skipping non-alphanumerics in place on the " +
          "original string instead of copying would bring this down to O(1).)",
      },
    ],
    testCases: [
      { args: ["?!#"], expected: true, note: "All non-alphanumeric — cleans to the empty string, which counts as a palindrome." },
      { args: ["Z"], expected: true, note: "Single character — trivially reads the same both ways." },
      { args: ["ab"], expected: false, note: "Smallest non-palindrome: two distinct letters, 'a' != 'b'." },
      { args: ["AaA"], expected: true, note: "Mixed case that lowercases to 'aaa' — all-equal, so a palindrome." },
      { args: ["Madam, I'm Adam"], expected: true, note: "Mixed case and punctuation cleaned away leaves 'madamimadam'." },
      { args: ["1a2"], expected: false, note: "Alphanumeric mix where the ends '1' and '2' differ." },
    ],
  },

  "container-with-most-water": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The two pointers start at opposite ends and only ever move toward each other.\n" +
          "- Each step measures one pair in O(1) and then advances exactly one pointer.\n\n" +
          "The pointers together cover the array once before they meet, so the whole scan is **O(n)** — no sort, " +
          "no nesting.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- It keeps only the two pointers and a running `best`.\n" +
          "- The input is read in place — nothing is copied or accumulated.\n\n" +
          "There is no auxiliary structure that grows with the input, so the extra space is constant — **O(1)**.",
      },
    ],
    testCases: [
      { args: [[2, 0]], expected: 0, note: "Smallest input, zero-area: a flat end caps the shorter wall — min(2,0)·1." },
      { args: [[3, 3, 3]], expected: 6, note: "All equal: width wins, so the outermost pair is best — min(3,3)·2." },
      { args: [[1, 9, 1]], expected: 2, note: "A tall middle wall is wasted — the short ends cap the level — min(1,1)·2." },
      { args: [[4, 1, 4]], expected: 8, note: "Duplicate end walls beat the deep valley between them — min(4,4)·2." },
      { args: [[6, 0, 6]], expected: 12, note: "Tall ends over a flat middle — min(6,6)·2." },
    ],
  },

  "geometric-sequence-triplets": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- One pass seeds the `right` frequency map with every value — O(n).\n" +
          "- The main sweep visits each index once; per index it does a constant number of map operations (one " +
          "removal from `right`, two lookups, one insertion into `left`), each O(1) on average.\n\n" +
          "There is no nested loop — the brute force's inner two loops are replaced by two constant-time map probes — " +
          "so the whole thing is **O(n)**, where `n` is the length of `nums`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The `right` map starts with one entry per distinct value, up to O(n) of them.\n" +
          "- As the sweep proceeds, values shift into the `left` map, which together with `right` holds at most O(n) " +
          "entries.\n\n" +
          "Both maps together are bounded by the number of distinct values, so the auxiliary space is **O(n)**. The " +
          "running `count` is a single integer and isn't counted.",
      },
    ],
    testCases: [
      { args: [[9, 3], 3], expected: 0, note: "Only two elements — a triplet needs three indices." },
      { args: [[2, 6, 10], 3], expected: 0, note: "No-solution case: 2×3 = 6, but 6×3 = 18 ≠ 10." },
      { args: [[1, 10, 100], 10], expected: 1, note: "Smallest exact chain with r > 1 — one triplet." },
      {
        args: [[4, 4, 4, 4, 4, 4], 1],
        expected: 20,
        note: "All equal with r = 1 — every i < j < k qualifies: C(6, 3) = 20.",
      },
      {
        args: [[2, 4, 4, 8, 8], 2],
        expected: 4,
        note: "Overlapping repeats: each of the two 4s pairs with one 2 on the left and two 8s on the right → 2 + 2.",
      },
    ],
  },

  "longest-substring-without-repeating-characters": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The loop visits each index `i` once, left to right.\n" +
          "- Per step the work is O(1): one map lookup, one map write, and a constant comparison — `start` only " +
          "ever moves forward, so it isn't a nested scan.\n\n" +
          "The whole pass is **O(n)**, where `n` is the length of `s` — versus the O(n³) of the brute force.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(min(n, σ)). Here's why:\n\n" +
          "- The `lastSeen` map holds at most one entry per *distinct* character.\n" +
          "- That can't exceed the alphabet size σ, nor the string length n.\n\n" +
          "So the extra space is **O(min(n, σ))** — bounded by the alphabet for a fixed character set.",
      },
    ],
    testCases: [
      { args: [""], expected: 0, note: "Empty string — the loop never runs." },
      { args: ["z"], expected: 1, note: "Single character — window of width 1." },
      { args: ["bbbb"], expected: 1, note: "All identical — start keeps jumping, width stays 1." },
      { args: ["abcde"], expected: 5, note: "All distinct — the whole string is the window." },
      { args: ["abccba"], expected: 3, note: "start must not rewind: after the \"cc\" repeat the leading \"ab\" sits outside the window." },
      { args: ["tmmzuxt"], expected: 5, note: "Answer \"mzuxt\" is in the middle; the early \"t\" is correctly skipped." },
    ],
  },

  "find-all-anagrams-in-a-string": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Building `p`'s counts is O(p.length), and the one-time comparison of the 26 slots is O(1).\n" +
          "- The window then slides across `s` once; each step adds one letter and removes one, updating `matches` " +
          "in O(1) rather than re-scanning all 26 counts.\n\n" +
          "So the scan is **O(n)** where `n = s.length` (the `p` pre-pass is dominated by it).",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- `need` and `have` are fixed 26-slot arrays regardless of input size.\n" +
          "- The `matches` counter is a single integer.\n\n" +
          "The extra space is **O(1)** for a fixed alphabet. The output array isn't counted; it can hold up to " +
          "O(n) indices in the worst case.",
      },
    ],
    testCases: [
      { args: ["xy", "xyz"], expected: [], note: "Pattern longer than the text — early return, no windows." },
      { args: ["az", "za"], expected: [0], note: "Single window, reordered letters — an anagram at index 0." },
      { args: ["abcabc", "abc"], expected: [0, 1, 2, 3], note: "A periodic string — every length-3 window is an anagram." },
      { args: ["hello", "ll"], expected: [2], note: "Repeated letters in the pattern — only the \"ll\" window matches counts." },
      { args: ["pqrs", "tu"], expected: [], note: "Pattern letters never appear — no match anywhere." },
      { args: ["abcba", "abc"], expected: [0, 2], note: "Two anagrams (\"abc\" and \"cba\") around a non-matching middle window." },
    ],
  },

  "longest-repeating-character-replacement": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- `right` advances across the string once; `left` only ever moves forward and at most as far as `right`.\n" +
          "- Each step does O(1) work — one count update, a `maxFreq` comparison, and at most one left eviction " +
          "(the alphabet is a fixed 26 letters, so `maxFreq` is read directly, never re-scanned).\n\n" +
          "Both pointers traverse the string at most once, so the whole pass is **O(n)** where `n = s.length`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The `count` array has a fixed 26 slots, one per uppercase letter.\n" +
          "- A handful of integers (`left`, `maxFreq`, `best`) round it out.\n\n" +
          "Independent of input size, the extra space is **O(1)**.",
      },
    ],
    testCases: [
      { args: ["B", 0], expected: 1, note: "Single character — already uniform." },
      { args: ["CCCC", 0], expected: 4, note: "All same with no budget — the whole string." },
      { args: ["XYZW", 0], expected: 1, note: "All distinct, no replacements — best run is a single letter." },
      { args: ["XYXY", 2], expected: 4, note: "Budget covers the two minority letters — whole string becomes uniform." },
      { args: ["AABBA", 1], expected: 3, note: "k = 1 can't unify all five; the best window is width 3." },
      { args: ["AAABBB", 2], expected: 5, note: "k = 2 stretches across the boundary for a width-5 window." },
    ],
  },

  "3sum": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n²). Here's why:\n\n" +
          "- Sorting the array takes O(n log n).\n" +
          "- Then, for each of the `n` values, a two-pointer scan over the suffix runs in O(n).\n\n" +
          "So the scans cost n × O(n) = O(n²), which dominates the sort — the overall time is **O(n²)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The sorted copy of the input takes O(n) (plus the sort's own bookkeeping).\n" +
          "- The two-pointer scan itself uses only a handful of variables — O(1).\n\n" +
          "The output array isn't counted as auxiliary space; if it were, it could hold up to O(n²) triplets in the worst case.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty array — nothing to pair." },
      { args: [[0]], expected: [], note: "Single element; a triplet needs three." },
      { args: [[0, 0]], expected: [], note: "Two elements — still no triplet." },
      { args: [[0, 0, 0]], expected: [[0, 0, 0]], note: "All zeros — exactly one valid triplet." },
      { args: [[1, 2, 3]], expected: [], note: "All positive; nothing can sum to 0." },
      {
        args: [[-2, 0, 1, 1, 2]],
        expected: [[-2, 0, 2], [-2, 1, 1]],
        note: "Duplicates that must not yield repeated triplets.",
      },
    ],
  },

  "two-sum": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The array is scanned once, left to right, visiting each element a single time.\n" +
          "- Per element the work is O(1): one hash-map lookup for the partner and at most one insertion.\n\n" +
          "There is no nested loop — the inner scan of the brute force is replaced by a constant-time map probe " +
          "— so the whole pass is **O(n)**, where `n` is the length of `nums`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The `seen` map can hold up to one entry per element if the answer is the final pair.\n" +
          "- Each entry is a `value → index` mapping taking O(1), so the map grows linearly with the input.\n\n" +
          "That extra map is the cost of the speed-up — we spend **O(n)** space to drop the time from O(n²) to " +
          "O(n). The returned two-index array isn't counted as auxiliary space.",
      },
    ],
    testCases: [
      { args: [[1, 4], 5], expected: [0, 1], note: "Smallest valid input — two elements that sum to target." },
      { args: [[1, 2, 4], 8], expected: [], note: "No pair sums to target — the unreachable fallback returns []." },
      { args: [[-4, -1, -3, -8], -7], expected: [0, 2], note: "Negatives — −4 + −3 = −7, found by a later index." },
      { args: [[5, 5, 3], 10], expected: [0, 1], note: "Duplicate values — two equal 5s pair up; second is the partner." },
      { args: [[6, 2, 8, 1, 5], 6], expected: [3, 4], note: "Target reached only by a later pair: 1 + 5 at the end." },
    ],
  },

  "3sum-closest": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n²). Here's why:\n\n" +
          "- Sorting the array takes O(n log n).\n" +
          "- Then, for each of the `n` choices of the fixed element `i`, a two-pointer scan sweeps the suffix in O(n).\n\n" +
          "So the scans cost n × O(n) = O(n²), which dominates the sort — the overall time is **O(n²)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1) auxiliary. Here's why:\n\n" +
          "- The scan keeps only a handful of variables — `best`, `lo`, `hi`, and the running `sum`.\n" +
          "- No extra arrays or maps are built; the answer is a single number, not a collection.\n\n" +
          "Sorting in place adds at most O(log n) for the sort's own stack, and the input array itself isn't counted as auxiliary space.",
      },
    ],
    testCases: [
      { args: [[3, 7, 1], 12], expected: 11, note: "Smallest input — the only triple, so its sum 3+7+1 is the answer." },
      { args: [[4, 4, 4, 4], 5], expected: 12, note: "All equal — every triple sums to 12; closest is forced." },
      { args: [[-6, -3, 0, 2], -7], expected: -7, note: "Negative target hit exactly — −6+−3+2 = −7 returns early." },
      { args: [[0, 1, 3, 5], 5], expected: 4, note: "Tie: sums 4 and 6 are equidistant; strict `<` keeps the first-seen 4." },
      { args: [[-1, -1, 3, 3], 2], expected: 1, note: "Duplicate values — closest sum −1+−1+3 = 1 sits one below target." },
    ],
  },

  "trapping-rain-water": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The two pointers start at opposite ends and only ever move toward each other.\n" +
          "- Each step compares the two current bars, updates one running max, and banks any water in O(1) before " +
          "advancing exactly one pointer.\n\n" +
          "Together the pointers cover every bar once before they meet, so the whole pass is **O(n)** — no rescans, " +
          "no nesting, where `n` is the number of bars.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- It keeps only the two pointers, the two running maxima, and a running `total`.\n" +
          "- The input is read in place; nothing is copied or accumulated into an auxiliary structure.\n\n" +
          "No storage grows with the input, so the extra space is constant — **O(1)**. (The classic " +
          "prefix-max / suffix-max solution computes the same answer but stores two O(n) arrays.)",
      },
    ],
    testCases: [
      { args: [[]], expected: 0, note: "Empty elevation map — no bars, so nothing to trap." },
      { args: [[7]], expected: 0, note: "Single bar — water needs a wall on both sides." },
      { args: [[1, 2, 3]], expected: 0, note: "Strictly increasing — every bar's left wall is shorter than itself, so nothing collects." },
      { args: [[4, 4, 4]], expected: 0, note: "Flat profile — equal walls leave no dip to fill." },
      { args: [[3, 0, 2, 0, 4]], expected: 7, note: "A valley between rising walls — the two dips fill to the shorter bounding wall." },
      { args: [[6, 1, 1, 1, 6]], expected: 15, note: "Tall equal ends over a flat trench — each of the three inner bars holds 6 − 1 = 5." },
    ],
  },

  "remove-duplicates-from-sorted-array": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The fast *read* pointer makes a single left-to-right pass over the array, visiting each element once.\n" +
          "- Each step is O(1): one comparison against the last kept value, and at most one write plus a pointer " +
          "bump.\n\n" +
          "There is no nesting and no second pass, so the overall time is **O(n)**, where `n` is the length of " +
          "`nums`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The compaction happens *in place* — distinct values are written back into the front of the same array.\n" +
          "- The only extra storage is the two index variables, the slow *write* pointer and the fast *read* " +
          "pointer.\n\n" +
          "Nothing grows with the input — no `Set`, no copy — so the extra space is constant, **O(1)**. (The " +
          "Set-based brute force builds a whole second array of the uniques, which is O(n).)",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty array — no values, so k = 0 and the prefix is empty." },
      { args: [[9]], expected: [9], note: "Single element — already unique, kept as the only distinct value." },
      { args: [[1, 2, 3, 4]], expected: [1, 2, 3, 4], note: "No duplicates — every element is new, so the prefix is unchanged." },
      { args: [[4, 4, 4, 4]], expected: [4], note: "All equal — every later value is a duplicate of the first, leaving one." },
      { args: [[-3, -3, -1, -1, -1, 6]], expected: [-3, -1, 6], note: "Repeated runs of varying length collapse to one each." },
      { args: [[2, 2, 5, 8, 8]], expected: [2, 5, 8], note: "Duplicates at both ends with a unique value between them." },
    ],
  },

  "longest-consecutive-sequence": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Building the `Set` from the input is one O(n) pass.\n" +
          "- The outer loop visits each distinct value once, doing an O(1) `has(n - 1)` check.\n" +
          "- The inner `while` only runs for *run starts*, and it walks each value of a run at most once across " +
          "the whole algorithm.\n\n" +
          "The nested `while` looks like it could make this O(n²), but the run-start guard means a value is " +
          "touched by an inner walk only when its run is counted, once — so every value is visited at most twice " +
          "total, and the overall time is **O(n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The `Set` holds up to one entry per distinct value, so it grows linearly with the input.\n" +
          "- The loop itself uses only a few counters (`longest`, `length`, `current`) — O(1).\n\n" +
          "That set is the price of dropping the time from the sort's O(n log n) to **O(n)**: we spend **O(n)** " +
          "extra space to buy O(1) membership tests.",
      },
    ],
    testCases: [
      { args: [[]], expected: 0, note: "Empty array — no numbers, so the longest run is 0." },
      { args: [[99]], expected: 1, note: "Single element — a run of length 1 with no neighbours." },
      { args: [[5, 5, 5]], expected: 1, note: "All duplicates collapse to one value in the set — run of 1." },
      { args: [[20, 21, 22, 50, 51]], expected: 3, note: "Two separate runs; the longer is {20,21,22}, length 3." },
      { args: [[9, 1, 4, 7, 3, 2, 6, 8, 5]], expected: 9, note: "Shuffled 1..9 — order doesn't matter, the whole set is one run." },
      { args: [[-10, -8, -9, -7, 5]], expected: 4, note: "Negatives — {-10,-9,-8,-7} form a run of 4; 5 is isolated." },
    ],
  },

  "reverse-linked-list": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The loop visits each of the `n` nodes exactly once.\n" +
          "- Per node the work is O(1): save `next`, flip one pointer, advance two variables.\n\n" +
          "There's no nested traversal, so the whole reversal is a single pass — **O(n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Only three pointers (`prev`, `curr`, `next`) are kept, regardless of list length.\n" +
          "- The nodes are rewired in place — no new list is allocated.\n\n" +
          "This is the win over the brute force, which built a second list and a values array for **O(n)** space.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty list — nothing to reverse, returns empty." },
      { args: [[1]], expected: [1], note: "Single node is its own reverse." },
      { args: [[1, 2]], expected: [2, 1], note: "Smallest case where pointers actually move." },
      { args: [[7, 7, 7]], expected: [7, 7, 7], note: "All-equal values — reversed list looks identical, but every link was still flipped." },
      { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1], note: "Even length." },
      { args: [[-1, 0, 2]], expected: [2, 0, -1], note: "Negative and zero values reverse like any other." },
    ],
  },

  "remove-nth-node-from-end-of-list": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(L). Here's why:\n\n" +
          "- Advancing `fast` by `n + 1` is at most `L` steps.\n" +
          "- The lockstep walk then covers the remaining nodes — at most `L` more.\n\n" +
          "Both phases are linear and there's no nested loop, so the single pass is **O(L)**, where `L` is the list length. (The two-pass brute force is also O(L), just with two traversals.)",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Only the `dummy` node and the `fast`/`slow` pointers are allocated, independent of `L`.\n" +
          "- The list is edited in place by one pointer reassignment.\n\n" +
          "No array or copy of the list is made — **O(1)** auxiliary space.",
      },
    ],
    testCases: [
      { args: [[1], 1], expected: [], note: "Single node, n = 1 — removing it leaves the empty list (the dummy makes this uniform)." },
      { args: [[1, 2], 2], expected: [2], note: "n = length removes the head; returning `dummy.next` handles it." },
      { args: [[1, 2], 1], expected: [1], note: "Remove the last node of a two-node list." },
      { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5], note: "The worked example — remove the 2nd-from-end (4)." },
      { args: [[2, 2, 2, 2], 2], expected: [2, 2, 2], note: "Duplicate values — removal is by position, not value." },
      { args: [[1, 2, 3], 3], expected: [2, 3], note: "n = length again on an odd list — removes the head." },
    ],
  },

  "palindrome-linked-list": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Finding the midpoint with fast/slow is one pass over `n` nodes.\n" +
          "- Reversing the second half touches each of those nodes once.\n" +
          "- The final lockstep comparison walks the two halves once.\n\n" +
          "Three sequential linear passes is still **O(n)** — no nesting.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The midpoint, reversal, and comparison each use only a handful of pointers.\n" +
          "- The second half is reversed *in place* rather than copied.\n\n" +
          "This is the improvement over the array-dump brute force, which spends **O(n)** on the values array.",
      },
    ],
    testCases: [
      { args: [[1]], expected: true, note: "Single node — trivially a palindrome." },
      { args: [[1, 2]], expected: false, note: "Two distinct values — reversing gives 2 -> 1, which differs." },
      { args: [[1, 1]], expected: true, note: "Two equal values — the smallest even palindrome." },
      { args: [[1, 2, 1]], expected: true, note: "Odd length — the lone middle node never needs to match." },
      { args: [[1, 2, 2, 1]], expected: true, note: "Even-length palindrome — both halves mirror exactly." },
      { args: [[1, 2, 3, 4, 2, 1]], expected: false, note: "Looks symmetric at the ends but breaks in the middle (3 vs 4)." },
    ],
  },

  "intersection-of-two-linked-lists": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(m + n). Here's why:\n\n" +
          "- The alignment walk sends each pointer through both lists once — at most `m + n` steps before they meet or both reach the end.\n" +
          "- The array-encoded form resolves the answer in O(1) from `skipA`, but the underlying node-identity algorithm is the linear walk.\n\n" +
          "Either way there's no nested scan, so it's **O(m + n)** — versus the brute force's O(m × n).",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The alignment walk keeps only two pointers; nothing scales with the list sizes.\n" +
          "- A hash-set alternative (store all of A's nodes, scan B) would cost O(m) — the two-pointer walk avoids it.\n\n" +
          "So the optimal approach is **O(1)** auxiliary space.",
      },
    ],
    testCases: [
      { args: [[2, 6, 4], [1, 5], -1, -1], expected: null, note: "No merge point supplied — the lists never intersect." },
      { args: [[1], [1], 0, 0], expected: 1, note: "Smallest intersection — both single-node lists share that node." },
      { args: [[4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 2, 3], expected: 8, note: "Different lengths before the shared tail [8,4,5] — answer is the first shared value, 8." },
      { args: [[], [1, 2, 3], -1, -1], expected: null, note: "Empty list A can't intersect anything." },
      { args: [[1, 2, 3, 4, 5], [99, 4, 5], 3, 1], expected: 4, note: "Shared tail [4,5] begins at index 3 in A and 1 in B." },
      { args: [[8, 8, 8], [8, 8, 8], 0, 0], expected: 8, note: "Identical lists that merge at the head — duplicate values don't fool the position-based identity." },
    ],
  },

  "search-insert-position": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(log n). Here's why:\n\n" +
          "- Each iteration discards half the remaining range by moving `lo` or `hi` to `mid`.\n" +
          "- Starting from `n` candidate positions, the range halves until it is empty.\n\n" +
          "So the loop runs about log₂ n times — overall **O(log n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Only the two integer bounds `lo` and `hi` are kept; nothing scales with the input.\n\n" +
          "The returned index is a single number, not counted as extra space — overall **O(1)**.",
      },
    ],
    testCases: [
      { args: [[], 5], expected: 0, note: "Empty array — the target slots at index 0." },
      { args: [[3], 3], expected: 0, note: "Single element equal to the target — found at index 0." },
      { args: [[10, 20, 30], 5], expected: 0, note: "Smaller than everything — inserts at the front." },
      { args: [[2, 2, 2], 2], expected: 0, note: "All equal to the target — the lower bound is index 0." },
      { args: [[1, 1, 3, 3, 5], 3], expected: 2, note: "Duplicates — returns the first index whose value is >= target." },
      { args: [[1, 2], 9], expected: 2, note: "Larger than everything — inserts at the end (index length)." },
    ],
  },

  "find-first-and-last-position-of-element-in-sorted-array": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(log n). Here's why:\n\n" +
          "- Finding the first occurrence is one boundary binary search over `n` elements — O(log n).\n" +
          "- Finding the last occurrence is a second boundary search (the lower bound of `target + 1`) — also O(log n).\n\n" +
          "Two O(log n) searches add to **O(log n)** overall.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Each search keeps only its `lo`/`hi` bounds; the two are run one after another, not nested.\n\n" +
          "The two-element result array is the output, not auxiliary space — overall **O(1)**.",
      },
    ],
    testCases: [
      { args: [[], 1], expected: [-1, -1], note: "Empty array — the target is absent." },
      { args: [[4], 4], expected: [0, 0], note: "Single matching element — first and last are the same index." },
      { args: [[3, 3, 3, 3, 3], 3], expected: [0, 4], note: "All equal to the target — the run spans the whole array." },
      { args: [[1, 5, 9], 4], expected: [-1, -1], note: "Target falls in a gap between values — absent." },
      { args: [[1, 1, 2, 2, 2, 9], 2], expected: [2, 4], note: "Duplicates — brackets the block of 2s from index 2 to 4." },
      { args: [[10, 20], 5], expected: [-1, -1], note: "Smaller than every element — absent." },
    ],
  },

  "search-in-rotated-sorted-array": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(log n). Here's why:\n\n" +
          "- Each step computes one midpoint, decides which half is sorted, and discards the half that can't hold the target.\n" +
          "- The which-half-is-sorted test is O(1), so the range still halves every iteration.\n\n" +
          "So the search runs about log₂ n times — overall **O(log n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Only the `lo`/`hi`/`mid` integers are tracked; the input isn't copied or re-sorted.\n\n" +
          "No structure grows with `n` — overall **O(1)**.",
      },
    ],
    testCases: [
      { args: [[], 5], expected: -1, note: "Empty array — nothing to find." },
      { args: [[3], 3], expected: 0, note: "Single element equal to the target." },
      { args: [[1, 2, 3, 4, 5], 4], expected: 3, note: "Not actually rotated — degrades to ordinary binary search." },
      { args: [[6, 7, 1, 2, 3], 1], expected: 2, note: "Target sits just past the pivot, in the rotated suffix." },
      { args: [[4, 5, 6, 7, 0, 1, 2], 8], expected: -1, note: "Target larger than every element — absent." },
      { args: [[7, 8, 1, 2, 3], 7], expected: 0, note: "Target is the rotation's largest value, at the front." },
    ],
  },

  "median-of-two-sorted-arrays": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(log(min(m, n))). Here's why:\n\n" +
          "- The binary search runs over cut positions in the *smaller* array only (the longer one's cut is derived).\n" +
          "- Each step checks four boundary values in O(1) and halves the candidate cut range.\n\n" +
          "So the work is logarithmic in the shorter length — overall **O(log(min(m, n)))**. (The merge baseline is O(m + n).)",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The partition search keeps only the cut bounds and the four boundary values; no merged array is built.\n\n" +
          "Nothing scales with the inputs — overall **O(1)**. (The O(m + n) merge baseline would also cost O(m + n) space.)",
      },
    ],
    testCases: [
      { args: [[5], [5]], expected: 5, note: "Two single-element arrays — both elements equal, so the median is that value." },
      { args: [[], [2, 4, 6]], expected: 4, note: "One array empty — median of [2,4,6] is the middle, 4." },
      { args: [[1, 4], [2, 3]], expected: 2.5, note: "Even total — merged [1,2,3,4], average the two middles (2 and 3)." },
      { args: [[10, 20, 30], [15]], expected: 17.5, note: "Even total — merged [10,15,20,30], average 15 and 20." },
      { args: [[8], []], expected: 8, note: "Single element, other array empty — that element is the median." },
      { args: [[1, 2, 3], [10, 20, 30]], expected: 6.5, note: "Disjoint ranges — merged [1,2,3,10,20,30], average 3 and 10." },
    ],
  },

  "search-a-2d-matrix": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(log(m·n)). Here's why:\n\n" +
          "- The matrix is treated as one sorted sequence of `m·n` cells.\n" +
          "- Each step maps a flat midpoint back to a cell in O(1) and halves the range.\n\n" +
          "So the search runs about log₂(m·n) times — overall **O(log(m·n))**, the same as binary-searching a length-`m·n` array.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Only the flat `lo`/`hi` indices are kept; the matrix isn't flattened into a real array.\n\n" +
          "The row/column are computed on the fly from the flat index — overall **O(1)**.",
      },
    ],
    testCases: [
      { args: [[[2, 4, 6, 8]], 6], expected: true, note: "Single row, target present." },
      { args: [[[2, 4, 6, 8]], 5], expected: false, note: "Single row, target falls in a gap — absent." },
      { args: [[[1], [5], [9]], 9], expected: true, note: "Single column, target in the last row." },
      { args: [[[1, 2], [3, 4]], 1], expected: true, note: "Target at the very first cell." },
      { args: [[[1, 2], [3, 4]], 4], expected: true, note: "Target at the very last cell." },
      { args: [[[10, 20], [30, 40]], 5], expected: false, note: "Target smaller than every cell — absent." },
    ],
  },

  "find-peak-element": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(log n). Here's why:\n\n" +
          "- Each step compares `nums[mid]` to its right neighbor and discards the half that can't slope up to a peak.\n" +
          "- The comparison is O(1), so the range halves every iteration.\n\n" +
          "So the search runs about log₂ n times — overall **O(log n)**, versus O(n) for a linear peak scan.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- Only the `lo`/`hi` bounds are kept; nothing scales with the input.\n\n" +
          "The returned index is a single number — overall **O(1)**.",
      },
    ],
    testCases: [
      { args: [[42]], expected: 0, note: "Single element — trivially a peak (no real neighbors)." },
      { args: [[10, 9, 8, 7]], expected: 0, note: "Strictly decreasing — the first element is the only peak." },
      { args: [[1, 2, 3, 4]], expected: 3, note: "Strictly increasing — the last element is the peak the search lands on." },
      { args: [[2, 4, 1]], expected: 1, note: "Single interior peak at index 1." },
      { args: [[2, 1, 3]], expected: 2, note: "Two peaks (indices 0 and 2); the search returns 2. Any valid peak is accepted by the checker." },
      { args: [[4, 5, 2, 1]], expected: 1, note: "Peak at index 1, then a downhill run." },
    ],
  },

  "cutting-wood": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n log M). Here's why:\n\n" +
          "- The blade height is binary-searched over `[0, M]` where `M` is the tallest tree — about log₂ M steps.\n" +
          "- Each step sums the wood over all `n` trees in O(n) to test feasibility.\n\n" +
          "So the total is n × log M = **O(n log M)**, versus O(n·M) for trying every height.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The search keeps only the height bounds and a running wood sum; no extra structure is allocated.\n\n" +
          "Nothing scales with `n` or `M` beyond the input itself — overall **O(1)**.",
      },
    ],
    testCases: [
      { args: [[7], 3], expected: 4, note: "Single tree — cutting at height 4 yields exactly 3 units." },
      { args: [[4, 4, 4], 12], expected: 0, note: "Need all the wood — only cutting to the ground reaches k." },
      { args: [[10, 10, 10], 15], expected: 5, note: "Three equal trees — height 5 gives 5+5+5 = 15." },
      { args: [[1, 2, 3, 4, 5], 9], expected: 1, note: "Uneven trees — at height 1 the wood is 0+1+2+3+4 = 10 ≥ 9; at 2 it drops to 6." },
      { args: [[2, 6, 3, 8], 15], expected: 1, note: "Same trees as the example, larger k — forces a lower blade (height 1)." },
      { args: [[50], 10], expected: 40, note: "One tall tree — height 40 yields exactly 10 units." },
    ],
  },

  "valid-parentheses": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Each character is visited exactly once in a single left-to-right scan.\n" +
          "- A push, a pop, and a map lookup are all O(1).\n\n" +
          "So the work is `n` × O(1) = **O(n)**, where `n` is the string length — a clean linear pass, versus the " +
          "brute force's repeated O(n²) deletions.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The stack holds the unclosed openers seen so far.\n" +
          "- A fully nested string like `\"(((((\"` puts every character on the stack at once.\n\n" +
          "So the stack can grow to `n` entries in the worst case — overall **O(n)** auxiliary space.",
      },
    ],
    testCases: [
      { args: ["()"], expected: true, note: "A single matched pair." },
      { args: [""], expected: true, note: "The empty string is vacuously balanced." },
      { args: [")"], expected: false, note: "A lone closer — the stack is empty, nothing to match." },
      { args: ["(()"], expected: false, note: "An opener left unclosed — the stack isn't empty at the end." },
      { args: ["[](){}"], expected: true, note: "Three independent matched pairs in a row." },
      { args: ["([)]"], expected: false, note: "Interleaved, not nested — wrong close order." },
    ],
  },

  "next-larger-element": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The outer loop visits each index once.\n" +
          "- The inner `while` pops indices, but each index is pushed once and popped at most once across the " +
          "whole run.\n\n" +
          "So the total push/pop work is bounded by `n`, making the scan **O(n)** — even though the nested " +
          "`while` reads like it could be quadratic. The brute force's per-element suffix scan is the O(n²) it replaces.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The stack holds indices still waiting for a larger value.\n" +
          "- A strictly decreasing input (e.g. `[5, 4, 3, 2, 1]`) never pops until the end, so every index is on " +
          "the stack at once.\n\n" +
          "So the stack reaches `n` entries in the worst case — **O(n)**. The output array is the required result, " +
          "not counted as auxiliary space.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty input — empty result, returned before the loop runs." },
      { args: [[9]], expected: [-1], note: "Single element — nothing to its right, so -1." },
      { args: [[3, 3, 3]], expected: [-1, -1, -1], note: "All equal — strictly greater is never satisfied, so all -1." },
      { args: [[1, 2, 3]], expected: [2, 3, -1], note: "Strictly increasing — each value's answer is its right neighbor." },
      { args: [[5, 4, 3, 2, 1]], expected: [-1, -1, -1, -1, -1], note: "Strictly decreasing — the stack never pops; everything stays -1." },
      { args: [[2, 1, 2, 4, 3]], expected: [4, 2, 4, -1, -1], note: "Mixed — one large value resolves several waiting smaller ones at once." },
    ],
  },

  "evaluate-reverse-polish-notation": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Each token is read once.\n" +
          "- A number is one push; an operator is two pops, one arithmetic op, and one push — all O(1).\n\n" +
          "So the work is `n` × O(1) = **O(n)**, where `n` is the token count. The brute force's repeated " +
          "`findIndex` + `splice` is the O(n²) this replaces.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The operand stack holds values not yet consumed by an operator.\n" +
          "- An expression that pushes many numbers before the first operator (e.g. a long run of operands) holds " +
          "all of them at once.\n\n" +
          "So the stack can hold up to about `n / 2` operands — **O(n)** auxiliary space.",
      },
    ],
    testCases: [
      { args: [["5"]], expected: 5, note: "A single number — no operators, the value itself." },
      { args: [["4", "5", "*"]], expected: 20, note: "One operation: 4 * 5." },
      { args: [["2", "1", "+", "3", "*"]], expected: 9, note: "(2 + 1) * 3 — the result feeds the next operator." },
      { args: [["9", "3", "/"]], expected: 3, note: "Division truncates toward zero: 9 / 3 = 3 exactly." },
      { args: [["10", "2", "-"]], expected: 8, note: "Operand order: a − b = 10 − 2, the second pop is the left operand." },
      { args: [["-50", "4", "+"]], expected: -46, note: "Negative operand: -50 + 4." },
    ],
  },

  "remove-all-adjacent-duplicates-in-string": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- Each character is pushed at most once and popped at most once.\n" +
          "- The final `join` over the surviving characters is O(n).\n\n" +
          "So the whole process is **O(n)**, where `n` is the string length — the brute force's restart-on-every-" +
          "deletion is the O(n²) this replaces.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The stack holds the characters kept so far.\n" +
          "- A string with no adjacent duplicates (e.g. `\"abcd\"`) never pops, so every character is on the stack.\n\n" +
          "So the stack reaches `n` entries in the worst case — **O(n)** (also the size of the output string).",
      },
    ],
    testCases: [
      { args: ["b"], expected: "b", note: "Single character — nothing to cancel." },
      { args: ["cc"], expected: "", note: "One pair cancels to the empty string." },
      { args: ["xyx"], expected: "xyx", note: "Equal characters but not adjacent — nothing cancels." },
      { args: ["deed"], expected: "", note: "Cascade: the inner 'ee' cancels, then the exposed 'dd' cancels too." },
      { args: ["abbaca"], expected: "ca", note: "The example: 'bb' then 'aa' cancel, leaving 'ca'." },
      { args: ["pqrs"], expected: "pqrs", note: "No adjacent duplicates — the string is unchanged." },
    ],
  },

  "sliding-window-maximum": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n). Here's why:\n\n" +
          "- The loop visits each index once.\n" +
          "- Each index is pushed onto the deque once and removed once (from either end), so the back-eviction " +
          "`while` is amortized O(1) per step.\n\n" +
          "So the total is **O(n)**, where `n` is the array length — beating both the O(n·k) brute force and the " +
          "O(n log k) heap approach.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(k). Here's why:\n\n" +
          "- The deque only holds indices currently inside the window.\n" +
          "- At most `k` indices fit in a window, so the deque never exceeds `k` entries.\n\n" +
          "So the auxiliary space is **O(k)**. The output array of window maxima is the required result, not counted.",
      },
    ],
    testCases: [
      { args: [[3], 1], expected: [3], note: "Single element, window of 1 — the element itself." },
      { args: [[7, 2, 4], 2], expected: [7, 4], note: "Two windows: max(7,2)=7, max(2,4)=4." },
      { args: [[9, 11], 2], expected: [11], note: "Window equals the array — one max." },
      { args: [[6, 5, 4, 3, 2], 3], expected: [6, 5, 4], note: "Decreasing — each window's max is its left edge." },
      { args: [[2, 4, 6, 8], 2], expected: [4, 6, 8], note: "Increasing — each window's max is its right edge." },
      { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7], note: "The example — a value can dominate several earlier ones at once." },
    ],
  },

  "implement-queue-using-stacks": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(1) amortized per operation. Here's why:\n\n" +
          "- `push` is a single O(1) stack push.\n" +
          "- `pop`/`peek` are O(1) when `outStack` is non-empty; a transfer is O(n), but it moves each element " +
          "exactly once over that element's lifetime.\n\n" +
          "So although a *single* front operation can be O(n), the cost amortizes to **O(1) per operation** across " +
          "a sequence of `m` calls — the whole sequence is O(m).",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- Every queued element lives in exactly one of the two stacks at any moment.\n\n" +
          "So the two stacks together hold at most `n` elements — **O(n)**, where `n` is the number of elements " +
          "currently in the queue.",
      },
    ],
    testCases: [
      { args: [["push", "peek", "empty"], [[4], [], []]], expected: [null, 4, false], note: "Peek returns the front (4) without removing it; the queue stays non-empty." },
      { args: [["push", "push", "peek", "pop", "empty"], [[1], [2], [], [], []]], expected: [null, null, 1, 1, false], note: "FIFO: peek and pop both return the oldest (1); 2 remains." },
      { args: [["push", "pop", "empty"], [[5], [], []]], expected: [null, 5, true], note: "Push then drain — back to empty." },
      { args: [["push", "push", "pop", "push", "peek", "pop", "pop", "empty"], [[1], [2], [], [3], [], [], [], []]], expected: [null, null, 1, null, 2, 2, 3, true], note: "A push (3) after a transfer lands on inStack, preserving FIFO order." },
      { args: [["push", "push", "push", "pop", "pop", "pop", "empty"], [[1], [2], [3], [], [], [], []]], expected: [null, null, null, 1, 2, 3, true], note: "One transfer serves three pops in order 1, 2, 3." },
      { args: [["push", "push", "pop", "pop"], [[8], [9], [], []]], expected: [null, null, 8, 9], note: "Two pushes then two pops drain oldest-first: 8 before 9." },
    ],
  },

  "merge-k-sorted-lists": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(N log k) for `N` total nodes across `k` lists. Here's why:\n\n" +
          "- The heap holds at most `k` nodes (one per list), so each push and pop is O(log k).\n" +
          "- Every one of the `N` nodes is pushed once and popped once.\n\n" +
          "So the merge does N × O(log k) work — overall **O(N log k)**, versus O(N log N) for collecting and " +
          "re-sorting everything. (The stored divide-and-conquer solution reaches the same bound: `log k` rounds, " +
          "each touching every node once.)",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(k). Here's why:\n\n" +
          "- The heap never holds more than `k` nodes at a time — one frontier node per list.\n\n" +
          "The output list reuses the input nodes rather than allocating new ones, so beyond the heap the extra " +
          "space is **O(k)** (not counting the output).",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "No lists at all — the heap is never seeded, result is empty." },
      { args: [[[]]], expected: [], note: "A single empty list — nothing to merge, return empty." },
      { args: [[[7, 8, 9]]], expected: [7, 8, 9], note: "One non-empty list passes straight through, already sorted." },
      { args: [[[2], [], [1, 3]]], expected: [1, 2, 3], note: "An empty list mixed in is skipped; the rest interleave." },
      { args: [[[4, 4], [4, 4]]], expected: [4, 4, 4, 4], note: "All-equal values across lists — duplicates are kept, order stable." },
      { args: [[[-2, 1], [-1, 3]]], expected: [-2, -1, 1, 3], note: "Negatives interleave correctly: -2, -1, 1, 3." },
    ],
  },

  "k-most-frequent-strings": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n + d log k) for `n` strings and `d` distinct values. Here's why:\n\n" +
          "- Counting every string into the map is O(n).\n" +
          "- Each of the `d` distinct strings does one O(log k) push (and possibly one O(log k) pop) on a heap " +
          "bounded at size `k`.\n\n" +
          "So the heap phase is O(d log k), giving **O(n + d log k)** overall — cheaper than the O(n + d log d) " +
          "full sort when `k ≪ d`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(d). Here's why:\n\n" +
          "- The frequency map holds one entry per distinct string — O(d).\n" +
          "- The heap holds at most `k` strings — O(k), and `k ≤ d`.\n\n" +
          "So the map dominates at **O(d)** (not counting the output array of `k` strings).",
      },
    ],
    testCases: [
      { args: [["a"], 1], expected: ["a"], note: "Single string, k = 1 — the only answer." },
      { args: [["a", "b"], 2], expected: ["a", "b"], note: "k equals the distinct count: every string qualifies, ordered lexicographically on the all-1 tie." },
      { args: [["c", "a", "b"], 2], expected: ["a", "b"], note: "All count 1 — the tie-break keeps the two lexicographically smallest." },
      { args: [["p", "p", "q", "q", "r"], 2], expected: ["p", "q"], note: "p and q tie at count 2; both beat r (count 1), ordered p < q." },
      { args: [["go", "go", "go", "byte", "byte", "run"], 2], expected: ["go", "byte"], note: "Distinct frequencies (3, 2, 1) — top two by frequency, no tie." },
    ],
  },

  "median-of-an-integer-stream": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(log n) per `addNum`, O(1) per `findMedian`. Here's why:\n\n" +
          "- `addNum` does a constant number of heap pushes/pops, each O(log n) on a heap of up to `n` elements.\n" +
          "- `findMedian` only reads the one or two heap tops — O(1).\n\n" +
          "So a sequence of `m` operations over a stream of `n` numbers runs in **O(m log n)** — versus O(n log n) " +
          "*per query* for the sort-every-time brute force.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- Every number added lives in exactly one of the two heaps.\n\n" +
          "So the two heaps together hold all `n` stream values — **O(n)**.",
      },
    ],
    testCases: [
      { args: [["addNum", "findMedian"], [[5], []]], expected: [null, 5], note: "Single value — the median of one element is itself." },
      { args: [["addNum", "addNum", "findMedian"], [[1], [3], []]], expected: [null, null, 2], note: "Even count: median is the average of the two middles, (1+3)/2 = 2." },
      { args: [["addNum", "addNum", "addNum", "addNum", "findMedian"], [[10], [20], [30], [40], []]], expected: [null, null, null, null, 25], note: "Fractional/averaged median of an even count: (20+30)/2 = 25." },
      { args: [["addNum", "addNum", "findMedian"], [[-5], [5], []]], expected: [null, null, 0], note: "Negatives and positives — median straddles zero: (-5+5)/2 = 0." },
      { args: [["addNum", "findMedian", "addNum", "findMedian"], [[4], [], [2], []]], expected: [null, 4, null, 3], note: "Interleaved queries: median 4 (one element), then (2+4)/2 = 3." },
    ],
  },

  "sort-a-k-sorted-array": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n log k). Here's why:\n\n" +
          "- The heap is bounded at `k + 1` elements, so every push and pop is O(log k).\n" +
          "- Each of the `n` elements is pushed once and popped once.\n\n" +
          "So the work is n × O(log k) — overall **O(n log k)**, beating the O(n log n) full sort when `k ≪ n`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(k). Here's why:\n\n" +
          "- The heap holds at most `k + 1` elements at any moment.\n\n" +
          "So the extra space is **O(k)** (not counting the output array).",
      },
    ],
    testCases: [
      { args: [[1], 0], expected: [1], note: "Single element, k = 0 — already in place." },
      { args: [[9, 8], 1], expected: [8, 9], note: "One adjacent swap away from sorted; a size-2 heap fixes it." },
      { args: [[3, 3, 3], 1], expected: [3, 3, 3], note: "All equal — order is stable and unchanged." },
      { args: [[0, -1, -2], 2], expected: [-2, -1, 0], note: "Negatives, fully reversed within the k = 2 window." },
      { args: [[2, 4, 1, 3, 5], 2], expected: [1, 2, 3, 4, 5], note: "Each value within two slots of home; a size-3 heap pops them in order." },
    ],
  },

  "merge-intervals": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n log n). Here's why:\n\n" +
          "- Sorting the `n` intervals by start takes O(n log n).\n" +
          "- The sweep that follows visits each interval once, doing O(1) work per step — O(n).\n\n" +
          "The sort dominates the linear sweep, so the overall time is **O(n log n)**, where `n` is the number of " +
          "intervals.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- We sort a copy of the input rather than mutating the caller's array — O(n).\n" +
          "- The sweep keeps only a reference to the last output interval — O(1) beyond the output.\n\n" +
          "The merged output isn't counted as auxiliary space; in the worst case (nothing overlaps) it holds all " +
          "`n` intervals.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty input — nothing to merge." },
      { args: [[[1, 4]]], expected: [[1, 4]], note: "A single interval passes through unchanged." },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]], note: "Touching endpoints count as overlapping (closed intervals)." },
      { args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]], note: "Fully nested intervals are absorbed without widening the frontier." },
      { args: [[[1, 3], [1, 3], [2, 4]]], expected: [[1, 4]], note: "Duplicate intervals collapse, then [2,4] extends the end." },
      { args: [[[8, 10], [1, 3], [5, 6]]], expected: [[1, 3], [5, 6], [8, 10]], note: "Unsorted, already-disjoint input — sort decides the output order." },
    ],
  },

  "interval-intersections": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(m + n). Here's why:\n\n" +
          "- Each step of the sweep advances exactly one of the two pointers.\n" +
          "- A pointer only ever moves forward and stops at the end of its list, so the total number of steps is at " +
          "most `m + n`.\n\n" +
          "No sorting is needed — the inputs arrive sorted — so the whole sweep is **O(m + n)**, where `m` and `n` " +
          "are the two list lengths.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(1). Here's why:\n\n" +
          "- The sweep keeps only the two pointers and a handful of scalars.\n\n" +
          "That's **O(1)** auxiliary space. The result list isn't counted; it can hold up to O(m + n) intersection " +
          "intervals in the worst case.",
      },
    ],
    testCases: [
      { args: [[], []], expected: [], note: "Both lists empty — no intersections." },
      { args: [[[1, 3]], []], expected: [], note: "One list empty — nothing to intersect against." },
      { args: [[[1, 2]], [[3, 4]]], expected: [], note: "Disjoint single intervals — no overlap." },
      { args: [[[2, 6]], [[6, 10]]], expected: [[6, 6]], note: "Touching at one point yields the single-point intersection [6,6]." },
      { args: [[[1, 10]], [[2, 3], [4, 5]]], expected: [[2, 3], [4, 5]], note: "One interval fully contains two from the other list." },
      { args: [[[0, 4], [7, 11]], [[3, 8]]], expected: [[3, 4], [7, 8]], note: "One B interval spans the gap, overlapping both A intervals." },
    ],
  },

  "max-overlapping-intervals": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n log n). Here's why:\n\n" +
          "- We build `2n` events (a start and an end per interval) — O(n).\n" +
          "- Sorting those events by position takes O(n log n).\n" +
          "- The final sweep over the sorted events is O(n).\n\n" +
          "The sort dominates, so the overall time is **O(n log n)**, where `n` is the number of intervals.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The event list holds `2n` entries — O(n).\n" +
          "- The sweep itself keeps only the running count and its max — O(1).\n\n" +
          "So the extra space is **O(n)** for the event list; the result is a single integer.",
      },
    ],
    testCases: [
      { args: [[]], expected: 0, note: "No intervals — peak overlap is 0." },
      { args: [[[1, 5]]], expected: 1, note: "A single interval is active over its whole range." },
      { args: [[[1, 2], [3, 4]]], expected: 1, note: "Disjoint intervals never stack — peak is 1." },
      { args: [[[2, 4], [4, 7]]], expected: 2, note: "Closed intervals touching at 4 are both active there." },
      { args: [[[1, 10], [2, 9], [3, 8]]], expected: 3, note: "Fully nested — all three cover the middle at once." },
      { args: [[[1, 5], [2, 6], [8, 9]]], expected: 2, note: "Two overlap early; the disjoint [8,9] doesn't raise the peak." },
    ],
  },

  "implement-trie-prefix-tree": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(L) per operation. Here's why:\n\n" +
          "- `insert` walks one node per character of the word, creating missing children as it goes — `O(L)` for a word of length `L`.\n" +
          "- `search` and `startsWith` each follow one path of length `L`, doing O(1) work per character.\n\n" +
          "Crucially the cost is independent of how many words are stored, so over `m` operations whose keys total `N` characters the whole replay is **O(N)** — versus the brute force's `O(W · L)` per `startsWith`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(N). Here's why:\n\n" +
          "- The trie holds at most one node per character across all inserted words; shared prefixes collapse onto shared nodes, divergent suffixes do not.\n\n" +
          "So the structure is **O(N)** in the total length of the inserted words. The result array is O(m) for `m` operations and isn't counted against the structure.",
      },
    ],
    testCases: [
      { args: [["search", "startsWith"], [["a"], ["a"]]], expected: [false, false], note: "Queries on an empty trie — both miss." },
      { args: [["insert", "search"], [["a"], ["a"]]], expected: [null, true], note: "Single insert then exact search hits." },
      { args: [["insert", "search", "startsWith"], [["hello"], ["hell"], ["hell"]]], expected: [null, false, true], note: "\"hell\" is a prefix of \"hello\" but not a stored word — search false, startsWith true." },
      { args: [["insert", "insert", "insert", "search", "search", "startsWith"], [["a"], ["ab"], ["abc"], ["ab"], ["abx"], ["ab"]]], expected: [null, null, null, true, false, true], note: "Words that are prefixes of each other are independently searchable." },
      { args: [["insert", "search", "startsWith"], [["ab"], ["abc"], ["abc"]]], expected: [null, false, false], note: "A query longer than any stored word falls off the trie — both false." },
      { args: [["insert", "insert", "search"], [["cat"], ["cat"], ["cat"]]], expected: [null, null, true], note: "Re-inserting the same word is idempotent." },
    ],
  },

  "design-add-and-search-words-data-structure": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(L) for `addWord`; `search` is O(L) with no wildcards and up to O(26^d · L) with `d` wildcards. Here's why:\n\n" +
          "- `addWord` walks/creates one node per character — `O(L)`.\n" +
          "- A literal search follows a single path — `O(L)`.\n" +
          "- Each `.` forces the recursion to branch into every child (up to 26), so `d` wildcards can fan out to `O(26^d · L)`.\n\n" +
          "With the wildcard count capped small (the constraints bound the dots), search stays cheap in practice — **O(L)** dominated by the path length.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(N). Here's why:\n\n" +
          "- The trie holds at most one node per character of the stored words, sharing prefixes — **O(N)** in their total length.\n" +
          "- The wildcard search adds O(L) recursion-stack depth.\n\n" +
          "So the structure is **O(N)**; the result array is O(m) over `m` operations.",
      },
    ],
    testCases: [
      { args: [["search"], [["a"]]], expected: [false], note: "Search before any add — empty structure misses." },
      { args: [["addWord", "search", "search"], [["cat"], ["cat"], ["dog"]]], expected: [null, true, false], note: "Exact match hits; a different word misses." },
      { args: [["addWord", "search", "search"], [["bad"], [".ad"], ["ba."]]], expected: [null, true, true], note: "Leading and trailing wildcards both match the one stored word." },
      { args: [["addWord", "search", "search"], [["dog"], ["..."], [".."]]], expected: [null, true, false], note: "All-wildcard matches a same-length word but fails on a length mismatch." },
      { args: [["addWord", "addWord", "addWord", "search", "search"], [["abc"], ["abd"], ["xyz"], ["ab."], [".b."]]], expected: [null, null, null, true, true], note: "A wildcard must try several children; both patterns find a completing path." },
      { args: [["addWord", "search"], [["abcd"], ["a.c"]]], expected: [null, false], note: "A wildcard path that explores children but dead-ends on length before the end." },
    ],
  },

  "word-search-ii": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(W·L + m·n·4^Lmax). Here's why:\n\n" +
          "- Building the trie costs the total length of all words, `O(W · L)`.\n" +
          "- The single board DFS starts from each of `m·n` cells and can branch in 4 directions up to the longest word's length `Lmax` — but the trie *prunes* any branch with no matching child, so in practice it explores far less than the bound.\n\n" +
          "The win over the brute force is the shared prefix pruning: words sharing a prefix are walked **together**, not re-traced per word, so the `W` factor leaves the exponential term.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(W·L). Here's why:\n\n" +
          "- The trie holds at most one node per character across all words — `O(W · L)`.\n" +
          "- The DFS recursion stack is at most `O(Lmax)` deep, and the board is mutated in place (cells restored on backtrack), so no copy is made.\n\n" +
          "So the dominant extra space is the **O(W·L)** trie; the result list holds only the found words.",
      },
    ],
    testCases: [
      { args: [[["a"]], ["a"]], expected: ["a"], note: "Single cell matches a single-letter word." },
      { args: [[["a", "b"], ["c", "d"]], []], expected: [], note: "No words to find — empty result." },
      { args: [[["a", "b"], ["c", "d"]], ["abdc"]], expected: ["abdc"], note: "A word that turns a corner: a→b→d→c." },
      { args: [[["a", "a"]], ["aa", "aaa"]], expected: ["aa"], note: "Cell reuse is forbidden, so \"aaa\" can't be formed from two cells." },
      { args: [[["a", "b"], ["c", "d"]], ["ad", "ab"]], expected: ["ab"], note: "Diagonal is not adjacency — \"ad\" fails, the horizontal \"ab\" succeeds." },
      { args: [[["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], ["oath", "pea", "eat", "rain"]], expected: ["oath", "eat"], note: "The canonical board: two of four words trace valid paths." },
    ],
  },

  "number-of-islands": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(m·n). Here's why:\n\n" +
          "- The outer scan visits each of the `m·n` cells once.\n" +
          "- The flood fills, summed over all islands, touch each land cell exactly once (a cell is sunk the first time it's reached and never re-entered).\n\n" +
          "Every cell is handled a constant number of times, so the total is **O(m·n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(m·n). Here's why:\n\n" +
          "- The explicit flood-fill stack can hold up to `O(m·n)` cells when the grid is one giant island.\n" +
          "- No separate visited grid is allocated — sinking land to `\"0\"` reuses the input.\n\n" +
          "So the extra space is **O(m·n)** in the worst case (a fully-land grid); the input grid is mutated rather than copied.",
      },
    ],
    testCases: [
      { args: [[["0"]]], expected: 0, note: "A single water cell — no islands." },
      { args: [[["1", "1", "1"]]], expected: 1, note: "A single row of connected land is one island." },
      { args: [[["1"], ["1"], ["1"]]], expected: 1, note: "A single column of connected land is one island." },
      {
        args: [[
          ["1", "0", "1", "0", "1"],
          ["0", "1", "0", "1", "0"],
          ["1", "0", "1", "0", "1"],
        ]],
        expected: 8,
        note: "Diagonal-only adjacency must NOT merge cells — every land cell stands alone.",
      },
      {
        args: [[
          ["1", "1", "0", "1"],
          ["1", "0", "0", "1"],
          ["0", "0", "0", "0"],
          ["1", "1", "1", "1"],
        ]],
        expected: 3,
        note: "Three components: the top-left L, the lone top-right pair, and the bottom strip.",
      },
    ],
  },

  "rotting-oranges": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(m·n). Here's why:\n\n" +
          "- The initial sweep that seeds the queue and counts fresh oranges is one pass over `m·n` cells.\n" +
          "- During the BFS, each cell is enqueued at most once and its four neighbours inspected a constant number of times.\n\n" +
          "Both phases are linear in the grid size, so the total is **O(m·n)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(m·n). Here's why:\n\n" +
          "- The BFS frontier holds at most `O(m·n)` cells (a grid that is entirely rotten at the start seeds every cell).\n" +
          "- The grid is rotted in place, so no copy is made.\n\n" +
          "The dominant extra space is the **O(m·n)** queue.",
      },
    ],
    testCases: [
      { args: [[[0]]], expected: 0, note: "An empty cell — nothing fresh, zero minutes." },
      { args: [[[2, 2, 2]]], expected: 0, note: "All already rotten — zero minutes elapse." },
      { args: [[[1, 1, 1]]], expected: -1, note: "All fresh, no source — they never rot, return -1." },
      {
        args: [[
          [2, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ]],
        expected: 4,
        note: "A solid block of fresh oranges with one rotten corner — the far corner rots at minute 4.",
      },
      {
        args: [[
          [2, 1, 0, 0, 1],
          [0, 0, 0, 0, 0],
        ]],
        expected: -1,
        note: "(0,1) rots from the source, but (0,4) is fenced off by empties and never rots — impossible.",
      },
    ],
  },

  "longest-increasing-path-in-a-matrix": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(m·n). Here's why:\n\n" +
          "- With memoisation, each cell's longest-path value is computed exactly once and cached.\n" +
          "- Computing one cell inspects its four neighbours — constant work — so the total is `4 · m·n`.\n\n" +
          "Each of the `m·n` cells is solved once, giving **O(m·n)**. Without the memo this would blow up exponentially as paths re-explore shared suffixes.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(m·n). Here's why:\n\n" +
          "- The memo table is one entry per cell, `O(m·n)`.\n" +
          "- The recursion stack is bounded by the longest increasing path, at most `O(m·n)` deep (a snaking grid).\n\n" +
          "So the extra space is **O(m·n)**.",
      },
    ],
    testCases: [
      { args: [[[42]]], expected: 1, note: "A single cell is a path of length 1." },
      { args: [[[1, 2, 3, 4]]], expected: 4, note: "A strictly increasing row — the whole row is one path." },
      { args: [[[4, 3, 2, 1]]], expected: 4, note: "Strictly decreasing reads as increasing right-to-left — still 4." },
      { args: [[[7, 7], [7, 7]]], expected: 1, note: "All equal — no strictly-increasing step exists, so every path is length 1." },
      {
        args: [[
          [1, 2, 3],
          [6, 5, 4],
          [7, 8, 9],
        ]],
        expected: 9,
        note: "A boustrophedon snake 1→2→…→9 winds through every cell — one path of length 9.",
      },
    ],
  },

  "clone-graph": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(V + E). Here's why:\n\n" +
          "- The DFS visits each node once (the map guard returns immediately on a repeat).\n" +
          "- For each node it walks its neighbour list, and across all nodes that's every edge counted twice (once from each endpoint).\n\n" +
          "So the work is proportional to nodes plus edges — **O(V + E)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(V). Here's why:\n\n" +
          "- The `Map` from original node to clone holds one entry per node, `O(V)`.\n" +
          "- The recursion stack is at most `O(V)` deep on a path-shaped graph.\n\n" +
          "The clone itself is the required output (not counted as extra), so the auxiliary space is **O(V)**.",
      },
    ],
    testCases: [
      { args: [[]], expected: [], note: "Empty graph — the function returns null, serialized as []." },
      { args: [[[]]], expected: [[]], note: "A single node with no neighbours clones to the same shape." },
      { args: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]], note: "A 4-cycle (the example square) — structure preserved across the clone." },
      { args: [[[2], [1, 3, 4], [2], [2]]], expected: [[2], [1, 3, 4], [2], [2]], note: "A star centred on node 2 — one hub, three leaves; the hub is cloned once and shared." },
      { args: [[[2, 6], [1, 3], [2, 4], [3, 5], [4, 6], [1, 5]]], expected: [[2, 6], [1, 3], [2, 4], [3, 5], [4, 6], [1, 5]], note: "A 6-cycle — a longer ring whose closing back-edge must reuse the existing clone." },
    ],
  },

  "is-graph-bipartite": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(V + E). Here's why:\n\n" +
          "- The outer loop starts a BFS in each component, and across all of them every node is enqueued once.\n" +
          "- Each node's adjacency list is scanned once, totalling every edge (twice, undirected).\n\n" +
          "One pass over nodes and edges — **O(V + E)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(V). Here's why:\n\n" +
          "- The `color` array is one entry per node, `O(V)`.\n" +
          "- The BFS queue holds at most `O(V)` nodes.\n\n" +
          "So the extra space is **O(V)**.",
      },
    ],
    testCases: [
      { args: [[[]]], expected: true, note: "A single node with no edges — trivially bipartite." },
      { args: [[[1, 2], [0], [0]]], expected: true, note: "A path 1–0–2 (a tree) is always 2-colourable." },
      { args: [[[1, 2, 3], [0, 2], [0, 1], [0]]], expected: false, note: "A triangle on {0,1,2} with an extra leaf — the odd cycle still fails it." },
      { args: [[[2, 3], [2, 3], [0, 1], [0, 1]]], expected: true, note: "Complete bipartite K(2,2): groups {0,1} and {2,3}, every edge crosses." },
      { args: [[[1], [0, 2], [1, 3], [2, 4], [3], [6], [5]]], expected: true, note: "A long even path plus a separate edge — both components colour, so bipartite." },
    ],
  },

  "number-of-provinces": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n²). Here's why:\n\n" +
          "- Scanning the upper triangle of the `n × n` matrix to find edges is `O(n²)`.\n" +
          "- Each `union`/`find` is effectively constant (inverse-Ackermann) with path compression and union by rank.\n\n" +
          "The matrix scan dominates, so the overall time is **O(n²)** — unavoidable given the adjacency-matrix input.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The `parent` and `rank` arrays are one entry per city, `O(n)`.\n\n" +
          "No copy of the matrix is made, so the auxiliary space is **O(n)** (the DFS alternative uses an `O(n)` visited array plus recursion stack instead).",
      },
    ],
    testCases: [
      { args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], expected: 2, note: "Cities 0–1 form a province; city 2 is isolated — two in all." },
      { args: [[[1, 1, 0], [1, 1, 1], [0, 1, 1]]], expected: 1, note: "0–1 and 1–2 are connected, so 0 and 2 join indirectly through 1 — one province." },
      {
        args: [[
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ]],
        expected: 1,
        note: "Every city connected to every other — a single province.",
      },
      {
        args: [[
          [1, 0, 0, 1],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [1, 0, 0, 1],
        ]],
        expected: 2,
        note: "Non-adjacent indices connected: {0,3} and {1,2} — two provinces.",
      },
      {
        args: [[
          [1, 0, 1, 0, 0],
          [0, 1, 0, 0, 0],
          [1, 0, 1, 1, 0],
          [0, 0, 1, 1, 0],
          [0, 0, 0, 0, 1],
        ]],
        expected: 3,
        note: "Components {0,2,3}, {1}, {4} — a chain of connections plus two loners.",
      },
    ],
  },

  "course-schedule": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(V + E). Here's why:\n\n" +
          "- Building the adjacency lists and in-degrees is one pass over the `E` prerequisite edges plus `V` courses.\n" +
          "- Kahn's algorithm dequeues each course once and decrements once per outgoing edge.\n\n" +
          "Every course and edge is handled a constant number of times — **O(V + E)**, where `V = numCourses` and `E = prerequisites.length`.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(V + E). Here's why:\n\n" +
          "- The adjacency lists hold all `E` edges; the in-degree array and queue are `O(V)`.\n\n" +
          "So the extra space is **O(V + E)**.",
      },
    ],
    testCases: [
      { args: [1, []], expected: true, note: "One course, no prerequisites — finishable." },
      { args: [3, [[1, 0], [2, 1]]], expected: true, note: "A clean chain 0 → 1 → 2 — finishable." },
      { args: [3, [[0, 1], [1, 2], [2, 0]]], expected: false, note: "A 3-cycle — every course is transitively its own prerequisite." },
      { args: [5, [[1, 0], [2, 0], [3, 0], [4, 0]]], expected: true, note: "Fan-out from course 0 — many dependents, no cycle." },
      { args: [4, [[1, 0], [2, 1], [0, 2]]], expected: false, note: "A cycle 0 → 1 → 2 → 0 traps three courses; course 3 alone can't rescue it." },
    ],
  },

  "network-delay-time": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(E log V) with a binary heap (the stored sort-based frontier is a slower-by-a-log variant). Here's why:\n\n" +
          "- Each of the `E` edges is relaxed at most once, and each relaxation pushes onto the frontier.\n" +
          "- A heap pop/push is `O(log V)`; the final max-distance scan is `O(V)`.\n\n" +
          "So the dominant cost is the edge relaxations through the frontier — **O(E log V)**.",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(V + E). Here's why:\n\n" +
          "- The adjacency lists hold all `E` edges; the `dist` array is `O(V)`.\n" +
          "- The frontier holds at most `O(E)` entries before stale ones are skipped.\n\n" +
          "So the extra space is **O(V + E)**.",
      },
    ],
    testCases: [
      { args: [[], 1, 1], expected: 0, note: "The source is the only node — zero time." },
      { args: [[[1, 2, 7]], 2, 1], expected: 7, note: "A single edge from the source — arrival time 7." },
      { args: [[[1, 2, 7]], 2, 2], expected: -1, note: "The only edge points away from the source — node 1 unreachable." },
      { args: [[[1, 2, 9], [1, 3, 1], [3, 2, 1]], 3, 1], expected: 2, note: "A two-hop route (1→3→2 = 2) beats the slow direct edge (1→2 = 9)." },
      { args: [[[1, 2, 3], [1, 3, 2], [1, 4, 5]], 4, 1], expected: 5, note: "A star from the source — the slowest direct arrival (5) sets the answer." },
    ],
  },

  "min-cost-to-connect-all-points": {
    complexity: [
      {
        kind: "prose",
        body:
          "**Time complexity:** O(n²). Here's why:\n\n" +
          "- Prim runs `n` rounds; each round scans all points to find the nearest outside one (`O(n)`) and relaxes all points against it (`O(n)`).\n\n" +
          "That's `n × O(n) = ` **O(n²)** — and for a *complete* graph this beats materialising and sorting the `O(n²)` edges that Kruskal needs (`O(n² log n)`).",
      },
      {
        kind: "prose",
        body:
          "**Space complexity:** O(n). Here's why:\n\n" +
          "- The `minDist` and `inTree` arrays are one entry per point, `O(n)`.\n" +
          "- No explicit edge list is built — distances are computed on the fly.\n\n" +
          "So the auxiliary space is **O(n)**.",
      },
    ],
    testCases: [
      { args: [[[0, 0]]], expected: 0, note: "A single point needs no connections." },
      { args: [[[0, 0], [3, 4]]], expected: 7, note: "Two points — the one Manhattan edge, |3|+|4| = 7." },
      { args: [[[1, 1], [1, 4], [5, 1]]], expected: 7, note: "An L of three points — the two legs (3 and 4) span them, skipping the long hypotenuse." },
      { args: [[[0, 0], [2, 0], [5, 0], [9, 0]]], expected: 9, note: "Collinear points — the MST chains the adjacent gaps 2+3+4." },
      { args: [[[0, 0], [0, 3], [4, 0], [4, 3]]], expected: 10, note: "A 4×3 rectangle — the MST uses three sides (3 + 4 + 3)." },
    ],
  },
};
