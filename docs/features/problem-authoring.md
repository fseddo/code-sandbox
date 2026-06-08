# Problem authoring & sourcing

> **Status: implemented.** The data model below (`examples`, `constraints`, `tags`, `source`, plus
> the `io` / `checker` harness extensions) is live in [problem.ts](../../src/problems/data/problem.ts).
> **All 100 catalog rows are imported** (numbered #1–#105, including a few off-catalog/build problems),
> each verified against the real worker. This doc is now the standing **authoring guide** — the
> data-model wiring lives in [algo.md → Problem model](algo.md#problem-model--the-typed-core); the
> rubric and test-case policy here are what you follow when adding a *new* problem.
>
> Authoring is automatable: the [`problem-importer`](../../.claude/agents/problem-importer.md) agent
> takes one catalog row and produces a verified module, reporting a confidence score. Every problem
> is checked end-to-end by [`scripts/verifyProblems.mjs`](../../scripts/verifyProblems.mjs) and by the
> `npm test` (vitest) integration suite, both of which run each reference solution through the real
> tester worker. The io converters have their own unit tests
> ([io.test.mjs](../../src/problems/algo/tester/io.test.mjs)).

## What `leetcodeProblemSet.json` actually is

[`leetcodeProblemSet.json`](../../src/problems/data/problems/leetcodeProblemSet.json) is a **catalog**, not
problem content. It's a paginated GraphQL response (`problemsetQuestionListV2`, note the
`hasMore` / `totalLength` / `finishedLength` envelope) holding 100 rows. Each row is metadata only:

```jsonc
{
  "id": 1,
  "questionFrontendId": "1",
  "title": "Two Sum",
  "titleSlug": "two-sum",
  "difficulty": "EASY",           // EASY | MEDIUM | HARD
  "paidOnly": false,
  "acRate": 0.5749…,              // acceptance rate, 0–1
  "topicTags": [{ "name": "Array", "slug": "array" }, …],
  "status": "TO_DO",
  "frequency": null, "contestPoint": null, "isInMyFavorites": false
}
```

Current contents: **100 problems — 19 easy, 62 medium, 19 hard, 0 paid-only.**

What it gives us: _which_ problems exist, their canonical title/slug, difficulty, and topic
taxonomy. What it does **not** give us: the prompt, examples, constraints, test cases, or
solutions — none of the content a solvable problem needs. So this file is the **work queue and
taxonomy source**, and authoring is the step that turns a row into a real problem. Treat the
catalog as the source of truth for `title`, `slug`, `difficulty`, and `tags`; everything else is
authored (and must not be scraped verbatim — see [Provenance & licensing](#provenance--licensing)).

## What the catalog gives vs. what we authored

| Field         | From catalog      | Shipped as                                         |
| ------------- | ----------------- | -------------------------------------------------- |
| title / id    | ✅ title / slug   | `title`, `id` = `titleSlug`                        |
| difficulty    | ✅ (UPPERCASE)    | `difficulty`, lowercased on import                 |
| description   | authored          | `prompt` (markdown)                                |
| examples      | authored          | `examples: Example<Args, Result>[]` (visible set)  |
| constraints   | authored          | `constraints: string[]`                            |
| tags          | ✅ topicTags      | `tags: TopicTag[]`                                 |
| hidden tests  | authored          | `hiddenTests` (server-only; policy below)          |
| solutions     | authored          | `solutions`                                        |
| provenance    | ✅ partial        | `source` (frontendId, acRate, authoring confidence)|

The model was already generic over `(...Args) => Result` with cases type-checked against the
signature; this work added **examples, constraints, tags, and provenance**. The field wiring lives
in [algo.md → Problem model](algo.md#problem-model--the-typed-core); the rest of this section
records _why_ each was added and the design calls made.

## Data-structure additions — design notes

The additions stayed faithful to the file's existing posture: single-source the types, derive
rather than redeclare, let the solution signature flow through.

### `examples` — typed off the same signature

LeetCode examples (Input / Output / Explanation) used to dissolve into the `prompt` markdown.
Structuring them lets [`ProblemPanel`](../../src/problems/algo/ProblemPanel.tsx) render them as distinct
blocks, and — the clever-TS payoff — lets an example **be** a test case plus a human explanation,
type-checked against `Args`/`Result` for free:

```ts
/** A worked example: a test case the user is allowed to see, plus prose explaining the output. */
export type Example<Args extends unknown[], Result> = TestCase<Args, Result> & {
  explanation?: string;
};
```

**The visible test set is derived from `examples`, not authored twice.** There is no separate
`tests` field: [`runTests`](../../src/problems/algo/tester/runTests.ts) builds the visible cases
from `examples` (Run uses them; Submit adds `hiddenTests`). This removed the drift where a prompt's
example could claim an output the visible test didn't check.

Trade-off recorded (learning lens applies, but so does honesty): deriving means "every example is a
visible test and vice-versa," which is _usually_ what we want but occasionally not (an illustrative
example with a huge input you'd rather not run on every Run click). The two options were (a) derive
and accept the coupling; (b) keep them separate plus an authoring-time assertion that every
example's `expected` matches the reference solution. **We shipped (a)** — simplest, and the
verifier ([`scripts/verifyProblems.mjs`](../../scripts/verifyProblems.mjs)) already catches the
"prompt lies" class by running every example through the reference solution. Revisit (b) only if a
problem needs the huge-illustrative-input escape hatch.

### `tags` — a single-source literal union from the catalog

Rather than `string`, `TopicTag` is a literal union of the catalog's distinct topic slugs, so an
authored problem can't invent a tag the filter UI won't know about — the same move as the
`PadTemplate` literal and the `ALGO_SETTINGS` registry. It's **hand-maintained** today (seeded from
the 30 slugs in the catalog); regenerating it from the catalog on demand is the open follow-up in
the plan below.

### `source` — provenance

A thin record of where a problem came from, so taxonomy can be re-synced and difficulty reasoned
about without re-scraping. It also carries the import agent's authoring `confidence` (0–1), omitted
for hand-authored problems:

```ts
export type ProblemSource = {
  origin: "leetcode";
  frontendId: string;   // questionFrontendId, e.g. "1"
  acRate?: number;       // acceptance rate at import time — a difficulty sanity check
  confidence?: number;   // import-agent authoring confidence; omitted when hand-authored
};
```

### `ClientProblem` — now the full problem

`ClientProblem` is a plain alias for `AlgoProblem`: client-side grading needs the whole problem in the
browser, so `hiddenTests` **and** `checker` (the answer-validator source) ship to the client along with
`examples`/`constraints`/`tags`/`source`. The historical server-only projection (`toClientProblem`, which
stripped those two via a derived `omit`) is gone — when grading ran on the server the client got an
`Omit` without the answers; with no server there's nothing to hold them back. That trades answer secrecy
for deleting the server-side code-execution surface; restoring secrecy is a documented future step (see
[algo.md](algo.md)).

## Test-case policy — coverage, not a flat count

The instinct behind "~20+ hidden tests per problem" is right: **a thin hidden set lets brittle and
hardcoded solutions pass.** But a flat "20 for every problem" is the wrong knob, for two concrete
reasons:

1. **Padding, not coverage.** An easy problem like [fizzBuzz](../../src/problems/data/problems/fizzBuzz.ts)
   has maybe 6–8 _meaningfully distinct_ inputs. Forcing 20 means 12 near-duplicates that add
   runtime and reviewer fatigue without probing anything new. Count is an _output_ of coverage, not
   a target.
2. **The wall-clock budget.** [`runTests`](../../src/problems/algo/tester/runTests.ts) races the
   **entire submission** against one timeout — not per-test — and it's **per-mode**: Run (examples only)
   = 2000 ms for snappy feedback; Submit (examples + hidden) = 8000 ms, since the hidden batch carries
   the scale cases and the solver isn't waiting on a tight loop. Even at 8 s, twenty large-input stress
   cases can blow the budget for a legitimately optimal solution, turning a correct answer into a
   `timeout`. So large cases are a scarce resource, not something to mint 20 of.

**Recommended policy — drive by category, floor by difficulty:**

Every hidden set should cover these _categories_ (the count falls out of covering them):

- **Boundary** — empty / single-element / min & max sizes, smallest & largest values.
- **Edge** — duplicates, negatives, all-same, already-sorted/reversed, ties.
- **Structural** — answer at the start vs. end, multiple valid spots, no-answer case.
- **Anti-hardcode** — inputs that differ from the visible examples enough that a lookup-table
  solution fails (this is the one the "more tests" instinct is really chasing).
- **Scale** — 1–3 large inputs sized to separate `O(n)` from `O(n²)` _without_ tripping the Submit
  budget (8 s for the whole hidden batch). These are the ones to ration.

| Difficulty | Visible (`examples`) | Hidden floor      |
| ---------- | -------------------- | ----------------- |
| Easy       | 2–4                  | ≥ 8               |
| Medium     | 2–4                  | ≥ 12              |
| Hard       | 3–4                  | ≥ 16              |

So: **not 20 across the board, but ~8 / 12 / 16 floors with category coverage** — a hard problem
often _does_ land near 20, an easy one shouldn't. If a problem genuinely warrants 20+, add them;
just don't manufacture them.

**Resolved (2026-05-22):** Run and Submit now have **separate budgets** (Run 2 s, Submit 8 s) — see
`WALL_CLOCK_LIMIT_MS` in [`runTests`](../../src/problems/algo/tester/runTests.ts). Bumping Submit
further is a one-line change there; the trade is a longer per-request worker-hold (a DoS-surface knob),
not a data-model change.

## Conversion rubric — catalog row → authored problem

For each problem promoted from the catalog:

1. **Pick from the queue.** Choose a `paidOnly: false` row (all 100 currently qualify). Prefer
   building a difficulty/topic spread over going in id order.
2. **Seed metadata from the catalog** — `id` = `titleSlug`, `title`, `difficulty` (lowercased),
   `tags` (from `topicTags` slugs), `source` (`frontendId`, `acRate`). These are the only fields
   copied from the catalog. (Off-catalog problems resolve the same seed via
   [`resolveProblem.mjs`](../../scripts/resolveProblem.mjs) → an `origin: "authored"` stub whose
   `difficulty`/`tags` come from the web — see [company-sourcing.md](company-sourcing.md#phase-1--name--metadata-resolution--done).)
   Also assign **`number`** — the permanent `#NN` catalog number. It is **not** from the catalog: take
   `max(existing numbers) + 1` (the verifier prints "next available"). Never reuse or renumber.
3. **Author the prompt** in our own words. Do **not** paste LeetCode's description — restate it.
   Markdown, backtick inline code (what [ProblemPanel](../../src/problems/algo/ProblemPanel.tsx) renders).
4. **Author `examples`** (2–4): each an `{ args, expected, explanation }`, type-checked against the
   signature. These double as the visible tests.
5. **Author `constraints`** — the input bounds. These also tell you how to _size the scale tests_.
6. **Write `starterCode`** for both JS and TS, function named `functionName`, in the **LeetCode
   editor style** (this is content the solver reads, so the repo's "no multi-line comment" rule does
   not apply here):
   - **Both languages** open with a JSDoc block annotating each param and the return —
     `@param {number[]} nums` … `@return {number}` — directly above the function. JS:
     `function name(params) { }`; TS keeps the inline types as well
     (`function name(nums: number[]): number {}`). The JSDoc `{type}` is JS/Closure notation
     (`{number[]}`, `{ListNode}`) in both languages.
   - For **reference-type I/O**, precede the `@param` block (in both languages) with the readable multi-line type
     definition — `/** Definition for singly-linked list. … */` or `/** Definition for a binary tree
     node. … */` — matching [addTwoNumbers](../../src/problems/data/problems/addTwoNumbers.ts) /
     [inorderTraversal](../../src/problems/data/problems/inorderTraversal.ts). The `@param` type is the
     node type (`{ListNode}`, `{TreeNode}`, `{ListNode[]}`).
7. **Write the hidden set** to the [test-case policy](#test-case-policy--coverage-not-a-flat-count):
   hit every category, meet the difficulty floor.
8. **Author ≥1 `solution`** with explanation + per-language code. The reference solution is also the
   oracle.
9. **Register** in [`problems/index.ts`](../../src/problems/data/problems/index.ts) (one line).
10. **Verify** — run `node scripts/verifyProblems.mjs`; your problem must print `PASS N/N`. It runs
    the reference solution through the real worker against every example + hidden case, so a wrong
    `expected` (or a wrong solution) shows up here. `npx tsc --noEmit` and `eslint` must be clean too.

For reference-type I/O use `io` and array test data — linked lists ([addTwoNumbers](../../src/problems/data/problems/addTwoNumbers.ts)),
binary trees ([inorderTraversal](../../src/problems/data/problems/inorderTraversal.ts)), or an array *of* either
via the `"linked-list[]"` / `"binary-tree[]"` shapes ([mergeKLists](../../src/problems/data/problems/mergeKLists.ts));
for multiple-valid-answer or in-place problems use a `checker` (see [I/O shapes](#io-shapes--reference-types-as-array-data) and [in-place](#in-place-problems--judge-the-mutated-arg) below).
The [`problem-importer`](../../.claude/agents/problem-importer.md) agent runs this whole rubric for one row.

## I/O shapes — reference types as array data

Test data is always plain JSON arrays; `io` tells the worker how to materialize the real reference
type around the call (and flatten it back), so authored cases stay serializable. The generics on
`defineAlgoProblem<Args, Result>` describe the **array** form, not the runtime node form.

| Shape            | Test data           | Solution sees / returns           | Example                         |
| ---------------- | ------------------- | --------------------------------- | ------------------------------- |
| `"value"`        | anything            | passed straight through           | most problems                   |
| `"linked-list"`  | `number[]`          | a `ListNode` chain                | [addTwoNumbers](../../src/problems/data/problems/addTwoNumbers.ts) |
| `"binary-tree"`  | level-order `(number\|null)[]` | a `TreeNode`             | [inorderTraversal](../../src/problems/data/problems/inorderTraversal.ts) |
| `"linked-list[]"`| `number[][]`        | a `ListNode[]`                    | [mergeKLists](../../src/problems/data/problems/mergeKLists.ts) |
| `"binary-tree[]"`| `(number\|null)[][]`| a `TreeNode[]`                    | "generate all unique BSTs"      |

`ListNode` and `TreeNode` are injected as worker globals (the solver references them; the starter's
JSDoc block documents them). **Binary-tree serialization** is LeetCode's level-order array where `null`
marks an absent child and a null node contributes no slots: `[1, null, 2, 3]` is root `1`, right child
`2`, and `2`'s left child `3`. Trailing `null`s are trimmed on the way out.

## In-place problems — judge the mutated arg

LeetCode's in-place problems (`sort-colors`, `rotate-image`, `set-matrix-zeroes`, `next-permutation`,
the `remove-*` family) are scored on the **input array after the call**, not the return value. The
worker hands the `checker` the args **as the function received them, post-call**, so:

- **Have the solution mutate in place and `return` that same array** (`Result` carries the expected
  final array). Set `Result` accordingly — don't type it `void`, or there's nowhere to put `expected`.
- **In the `checker`, assert `actual === args[0]`** (the returned value *is* the mutated input — proves
  in-place, fails a solution that sorts a copy) **and** that `args[0]` equals `expected`. See
  [sortColors.ts](../../src/problems/data/problems/sortColors.ts).

For the `remove-*` problems that return a count `k` and judge only the first `k` elements, the checker
reads `actual` (the `k`) and compares `args[0].slice(0, k)` to `expected`.

**Quality gate (a problem isn't done until all hold):**

- [ ] `defineAlgoProblem<Args, Result>` compiles — no `any`, signature pinned.
- [ ] `number` is unique (`max + 1`); the verifier's `NUMBERS ok` line confirms it.
- [ ] Every example's `expected` matches the reference solution's output.
- [ ] Hidden set covers all five categories and meets the difficulty floor.
- [ ] At least one scale case, sized against `constraints`, runs under the budget on the reference
      solution.
- [ ] Prompt is original prose, not copied.
- [ ] `tags` are all valid `TopicTag` members.

## Plan / phases

1. ~~**Model** — `examples`, `constraints`, `tags`, `source` on [`problem.ts`](../../src/problems/data/problem.ts);
   `examples` are the single source for visible tests (no separate `tests` field).~~ **Done.**
2. ~~**Harness** — `io` linked-list hydration + `checker` support in
   [problemTester.worker.mjs](../../src/problems/algo/tester/problemTester.worker.mjs) / [runTests](../../src/problems/algo/tester/runTests.ts).~~ **Done.**
3. ~~**Render** — [`ProblemPanel`](../../src/problems/algo/ProblemPanel.tsx) shows `examples` (with
   explanations), a `constraints` list, and `tags` chips.~~ **Done.**
4. ~~**Backfill** — the three original problems migrated to the new shape.~~ **Done.**
5. ~~**Author** — all 100 catalog problems imported via the importer agent (numbered #1–#105 incl. a
   few off-catalog/build problems); reference-type & in-place problems use the `io`/`checker` paths.~~ **Done.**
6. **Tags index (open)** — the `TopicTag` union is hand-maintained from the catalog today. A small
   script could regenerate it and emit a `catalogIndex` of unauthored rows for a "coming soon" list.
7. **Budget revisit (open)** — if scale tests start brushing the limit, split Run vs. Submit timeouts
   in [`runTests`](../../src/problems/algo/tester/runTests.ts). Not needed yet.
8. **Filter UI (done)** — `tags` (and kind, difficulty, company, progress status) are filter facets on
   the home-page catalog. See [navigation.md](navigation.md).

## Provenance & licensing

Problem _statements_ on LeetCode are theirs. We source **taxonomy and titles** from the catalog but
**author our own prompts, examples, tests, and solutions**. Don't paste descriptions or official
test data verbatim — the rubric's "original prose" gate exists for this reason, not just for style.
