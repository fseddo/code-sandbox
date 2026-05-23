# Algo tester — gaps

Problem shapes the algo tester can't yet express. Eligibility rules live in
[problem-authoring.md](../features/problem-authoring.md#eligibility--stop-early-if-the-harness-cant-express-it);
the I/O hydration model lives in [algo.md](../features/algo.md#problem-model--the-typed-core).

- **Tree / linked-structure I/O.** Worker hydrates only `"value"` / `"linked-list"`; problems that
  take a binary tree or return a circular doubly-linked list are unsupportable (surfaced by the
  `company-sourcer` run: _Convert BST to Sorted Doubly Linked List_). Fix: add `"binary-tree"` and
  `"doubly-linked-list"` `IoShape`s — `TreeNode` hydration + a circularity-aware checker — in
  [problemTester.worker.mjs](../../src/problems/algo/tester/problemTester.worker.mjs) / [runTests.ts](../../src/problems/algo/tester/runTests.ts)
  and the `ProblemIo`/`IoShape` types. Severity: medium (blocks a recurring tree-problem class).
