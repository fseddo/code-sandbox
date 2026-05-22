# Problem authoring & sourcing

> **Status: implemented.** The data model below (`examples`, `constraints`, `tags`, `source`, plus
> the `io` / `checker` harness extensions) is live in [problem.ts](../../src/judge/problem.ts), and
> the first 10 catalog problems are authored. This doc is now the standing **authoring guide** — the
> data-model wiring lives in [judge.md → Problem model](judge.md#problem-model--the-typed-core); the
> rubric and test-case policy here are what you follow when adding a problem.
>
> Authoring is automatable: the [`problem-importer`](../../.claude/agents/problem-importer.md) agent
> takes one catalog row and produces a verified module, reporting a confidence score. Every problem
> is checked end-to-end by [`scripts/verifyProblems.mjs`](../../scripts/verifyProblems.mjs), which
> runs each reference solution through the real judge worker.

## What `leetcodeProblemSet.json` actually is

[`leetcodeProblemSet.json`](../../src/judge/problems/leetcodeProblemSet.json) is a **catalog**, not
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
in [judge.md → Problem model](judge.md#problem-model--the-typed-core); the rest of this section
records _why_ each was added and the design calls made.

## Data-structure additions — design notes

The additions stayed faithful to the file's existing posture: single-source the types, derive
rather than redeclare, let the solution signature flow through.

### `examples` — typed off the same signature

LeetCode examples (Input / Output / Explanation) used to dissolve into the `prompt` markdown.
Structuring them lets [`ProblemPanel`](../../src/judge/ProblemPanel.tsx) render them as distinct
blocks, and — the clever-TS payoff — lets an example **be** a test case plus a human explanation,
type-checked against `Args`/`Result` for free:

```ts
/** A worked example: a test case the user is allowed to see, plus prose explaining the output. */
export type Example<Args extends unknown[], Result> = TestCase<Args, Result> & {
  explanation?: string;
};
```

**The visible test set is derived from `examples`, not authored twice.** There is no separate
`tests` field: [`runSubmission`](../../src/judge/runner/runSubmission.ts) builds the visible cases
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
`PadTemplate` literal and the `JUDGE_SETTINGS` registry. It's **hand-maintained** today (seeded from
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

### `ClientProblem` projection

`examples`, `constraints`, `tags`, and `source` are all client-safe. The server-only fields are
`hiddenTests` **and** `checker` (the answer-validator source) — [`toClientProblem`](../../src/judge/problems/index.ts)
strips exactly those two via a derived `omit`, so adding a future server-only field to the
`ClientProblem` `Omit` becomes a compile error there until it's also dropped.

## Test-case policy — coverage, not a flat count

The instinct behind "~20+ hidden tests per problem" is right: **a thin hidden set lets brittle and
hardcoded solutions pass.** But a flat "20 for every problem" is the wrong knob, for two concrete
reasons:

1. **Padding, not coverage.** An easy problem like [fizzBuzz](../../src/judge/problems/fizzBuzz.ts)
   has maybe 6–8 _meaningfully distinct_ inputs. Forcing 20 means 12 near-duplicates that add
   runtime and reviewer fatigue without probing anything new. Count is an _output_ of coverage, not
   a target.
2. **The 2s budget.** [`runSubmission`](../../src/judge/runner/runSubmission.ts) races the **entire
   submission** against a single 2000 ms timeout — not per-test. Twenty large-input stress cases can
   blow that budget for a legitimately optimal `O(n)` solution, turning a correct answer into a
   `timeout`. So large cases are a scarce resource, not something to mint 20 of.

**Recommended policy — drive by category, floor by difficulty:**

Every hidden set should cover these _categories_ (the count falls out of covering them):

- **Boundary** — empty / single-element / min & max sizes, smallest & largest values.
- **Edge** — duplicates, negatives, all-same, already-sorted/reversed, ties.
- **Structural** — answer at the start vs. end, multiple valid spots, no-answer case.
- **Anti-hardcode** — inputs that differ from the visible examples enough that a lookup-table
  solution fails (this is the one the "more tests" instinct is really chasing).
- **Scale** — 1–3 large inputs sized to separate `O(n)` from `O(n²)` _without_ tripping the 2s
  budget. These are the ones to ration.

| Difficulty | Visible (`examples`) | Hidden floor      |
| ---------- | -------------------- | ----------------- |
| Easy       | 2–4                  | ≥ 8               |
| Medium     | 2–4                  | ≥ 12              |
| Hard       | 3–4                  | ≥ 16              |

So: **not 20 across the board, but ~8 / 12 / 16 floors with category coverage** — a hard problem
often _does_ land near 20, an easy one shouldn't. If a problem genuinely warrants 20+, add them;
just don't manufacture them.

**Open follow-up on the 2s budget:** if scale cases routinely brush the limit, Submit mode may need
a higher ceiling than Run (e.g. 5s for the hidden batch), since the user is no longer waiting on a
fast feedback loop. That's a `runSubmission` change, not a data-model one — flagged here, decided
when the first hard problem with real stress tests forces it.

## Conversion rubric — catalog row → authored problem

For each problem promoted from the catalog:

1. **Pick from the queue.** Choose a `paidOnly: false` row (all 100 currently qualify). Prefer
   building a difficulty/topic spread over going in id order.
2. **Seed metadata from the catalog** — `id` = `titleSlug`, `title`, `difficulty` (lowercased),
   `tags` (from `topicTags` slugs), `source` (`frontendId`, `acRate`). These are the only fields
   copied from the catalog.
3. **Author the prompt** in our own words. Do **not** paste LeetCode's description — restate it.
   Markdown, backtick inline code (what [ProblemPanel](../../src/judge/ProblemPanel.tsx) renders).
4. **Author `examples`** (2–4): each an `{ args, expected, explanation }`, type-checked against the
   signature. These double as the visible tests.
5. **Author `constraints`** — the input bounds. These also tell you how to _size the scale tests_.
6. **Write `starterCode`** for both JS and TS, function named `functionName`.
7. **Write the hidden set** to the [test-case policy](#test-case-policy--coverage-not-a-flat-count):
   hit every category, meet the difficulty floor.
8. **Author ≥1 `solution`** with explanation + per-language code. The reference solution is also the
   oracle.
9. **Register** in [`problems/index.ts`](../../src/judge/problems/index.ts) (one line).
10. **Verify** — run `node scripts/verifyProblems.mjs`; your problem must print `PASS N/N`. It runs
    the reference solution through the real worker against every example + hidden case, so a wrong
    `expected` (or a wrong solution) shows up here. `npx tsc --noEmit` and `eslint` must be clean too.

For reference-type I/O use `io` and array test data ([addTwoNumbers](../../src/judge/problems/addTwoNumbers.ts));
for multiple-valid-answer problems use a `checker` ([longestPalindrome](../../src/judge/problems/longestPalindrome.ts)).
The [`problem-importer`](../../.claude/agents/problem-importer.md) agent runs this whole rubric for one row.

**Quality gate (a problem isn't done until all hold):**

- [ ] `defineProblem<Args, Result>` compiles — no `any`, signature pinned.
- [ ] Every example's `expected` matches the reference solution's output.
- [ ] Hidden set covers all five categories and meets the difficulty floor.
- [ ] At least one scale case, sized against `constraints`, runs under the budget on the reference
      solution.
- [ ] Prompt is original prose, not copied.
- [ ] `tags` are all valid `TopicTag` members.

## Plan / phases

1. ~~**Model** — `examples`, `constraints`, `tags`, `source` on [`problem.ts`](../../src/judge/problem.ts);
   `examples` are the single source for visible tests (no separate `tests` field).~~ **Done.**
2. ~~**Harness** — `io` linked-list hydration + `checker` support in
   [judge.worker.mjs](../../src/judge/runner/judge.worker.mjs) / [runSubmission](../../src/judge/runner/runSubmission.ts).~~ **Done.**
3. ~~**Render** — [`ProblemPanel`](../../src/judge/ProblemPanel.tsx) shows `examples` (with
   explanations), a `constraints` list, and `tags` chips.~~ **Done.**
4. ~~**Backfill** — the three original problems migrated to the new shape.~~ **Done.**
5. ~~**Author** — first 10 catalog problems imported (ids 1–10) via the importer agent.~~ **Done.**
6. **Tags index (open)** — the `TopicTag` union is hand-maintained from the catalog today. A small
   script could regenerate it and emit a `catalogIndex` of unauthored rows for a "coming soon" list.
7. **Budget revisit (open)** — if scale tests start brushing the limit, split Run vs. Submit timeouts
   in [`runSubmission`](../../src/judge/runner/runSubmission.ts). Not needed yet.
8. **Filter UI (open)** — surface `tags` as a filter on the `/judge` problem list.

## Provenance & licensing

Problem _statements_ on LeetCode are theirs. We source **taxonomy and titles** from the catalog but
**author our own prompts, examples, tests, and solutions**. Don't paste descriptions or official
test data verbatim — the rubric's "original prose" gate exists for this reason, not just for style.
