# Judge harness — gaps

Problem shapes the judge worker can't yet express. Eligibility rules live in
[problem-authoring.md](../features/problem-authoring.md#eligibility--stop-early-if-the-harness-cant-express-it);
the I/O hydration model lives in [judge.md](../features/judge.md#problem-model--the-typed-core).

- **Tree / linked-structure I/O.** Worker hydrates only `"value"` / `"linked-list"`; problems that
  take a binary tree or return a circular doubly-linked list are unsupportable (surfaced by the
  `company-sourcer` run: _Convert BST to Sorted Doubly Linked List_). Fix: add `"binary-tree"` and
  `"doubly-linked-list"` `IoShape`s — `TreeNode` hydration + a circularity-aware checker — in
  [judge.worker.mjs](../../src/judge/runner/judge.worker.mjs) / [runSubmission.ts](../../src/judge/runner/runSubmission.ts)
  and the `ProblemIo`/`IoShape` types. Severity: medium (blocks a recurring tree-problem class).
