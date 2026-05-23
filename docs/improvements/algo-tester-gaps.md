# Algo tester — gaps

Problem shapes the algo tester can't yet express. Eligibility rules live in
[problem-authoring.md](../features/problem-authoring.md#eligibility--stop-early-if-the-harness-cant-express-it);
the I/O hydration model lives in [algo.md](../features/algo.md#problem-model--the-typed-core).

- ~~**Binary-tree & array-of-structure I/O.**~~ **Resolved.** The worker now hydrates `"binary-tree"`
  (LeetCode level-order arrays with `null` gaps → `TreeNode`) and the element-wise array variants
  `"linked-list[]"` / `"binary-tree[]"`, alongside `"value"` / `"linked-list"`. Converters live in
  [io.mjs](../../src/problems/algo/tester/io.mjs) (unit-tested). The whole binary-tree problem class
  (#94–#105: traversal, validate/recover BST, same-tree, generate-all-BSTs) is imported.
- ~~**In-place problems scored on the mutated arg.**~~ **Resolved.** The `checker` now receives `args`
  **post-call**, so it can score an in-place mutation and assert reference equality (`actual === args[0]`).
  See [problem-authoring.md → In-place](../features/problem-authoring.md#in-place-problems--judge-the-mutated-arg)
  and [sortColors.ts](../../src/problems/data/problems/sortColors.ts).
- **Circular doubly-linked-list I/O** *(still open)*. A `"doubly-linked-list"` `IoShape` with a
  circularity-aware checker is not yet implemented — blocks problems like _Convert BST to Sorted Doubly
  Linked List_ (surfaced by the `company-sourcer` run). Severity: low (off-catalog; no current problem needs it).
