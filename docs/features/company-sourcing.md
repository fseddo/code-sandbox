# Company-driven problem sourcing

> **Status: in progress — Phases 0–3 done, Phase 4 (filter UI) open.** The end-to-end loop works: a
> company name → sourced, tagged, and (where possible) authored problems via the
> [`company-sourcer`](../../.claude/agents/company-sourcer.md) agent. Current-state detail for the
> model lives in [judge.md → Problem model](judge.md#problem-model--the-typed-core) and the pad seams
> in [pad.md → Reusable seams](pad.md#reusable-seams-leadingpanel--rendertoolbar). This doc turns a
> prompt like _"I'm interviewing at NYTimes today, gather their problems"_ into tagged, solvable
> problems. When a phase lands, flip its marker to **Done** and move _current-state_ detail into the
> relevant feature doc so this file isn't a second source of truth (see [docs/README.md](../README.md)).

## The workflow

```
"I'm interviewing at X"
  → 1. SOURCE     web search → list of problem *names* (+ a reliability read)
  → 2. RESOLVE    name → existing problem? catalog row? off-catalog stub?
  → 3a. TAG       exists → associate it with the company
  → 3b. ADD       missing → author it, then associate
  → 4. CLASSIFY   algo problem  → problem-importer path (pure-function judge)
                  build problem → pad-backed sandbox-with-prompt
                  unsupportable → don't fake it: record + write an upgrade plan
```

The premise that makes this cheap: **a problem name is a strong identifier.** We don't need the
company list to carry descriptions or tests — we source the rest from the name, and we author
original content either way (the [provenance rule](problem-authoring.md#provenance--licensing)
stands). The web's job is to populate the queue and label it by company, not to supply problem
bodies.

## Why this isn't "just an agent"

The fuzzy parts — search, dedupe, reliability ranking, algo-vs-build classification, "is this
expressible in our sandbox" — are genuine agent work. But three things underneath are deterministic
schema/code that must exist _before_ the agent, or every run reinvents them inconsistently:

1. a **company dimension** (Phase 0),
2. a **name → metadata resolution** step the importer can consume (Phase 1),
3. a **build-problem kind** the classifier can route into (Phase 2).

The agent (Phase 3) is a thin orchestrator over those capabilities. It **delegates** algo authoring
to the existing [`problem-importer`](../../.claude/agents/problem-importer.md) rather than
re-implementing it, so there stays exactly one authoring path and one verification gate.

---

## Phase 0 — `Problem` becomes a discriminated union — **Done**

Today [problem.ts](../../src/judge/problem.ts) has a single `Problem<Args, Result>` shape bound to
pure-function judging (`functionName`, `examples`, `hiddenTests`). A build problem can't be
expressed in it. Split into a shared base + a `kind` discriminant — the same single-source-union
posture as `TopicTag` / `PadTemplate`:

```ts
type ProblemBase = {
  id: string;
  title: string;
  difficulty: Difficulty;
  prompt: string;
  tags: TopicTag[];
  source?: ProblemSource;
};

// shipped as `Problem<Args, Result>` (the existing name kept, now the algo arm)
type AlgoProblem<Args extends unknown[], Result> = ProblemBase & {
  kind: "algo";
  constraints: string[];        // input-bounds — stays on the algo arm, meaningless for a build task
  functionName: string;
  starterCode: Record<SupportedLanguage, string>;
  examples: Example<Args, Result>[];
  hiddenTests: TestCase<Args, Result>[];
  io?: ProblemIo;
  checker?: string;
  solutions?: ProblemSolution[];
};

type BuildProblem = ProblemBase & {
  kind: "build";
  template: SandpackPredefinedTemplate;  // Sandpack's own type — same vocabulary the pad uses
  files: SandpackFiles;                  // starter sandbox the pad is seeded with
  evaluationNotes?: string[];            // what a reviewer looks for (no auto-grading)
};

export type AnyProblem = Problem | BuildProblem;
```

- **`defineProblem` injects `kind: "algo"`** (takes `Omit<Problem, "kind">`) so the 12 existing
  modules didn't change. A new `defineBuildProblem` covers the build arm.
- **Company tags are _not_ on the problem** (see Phase 0b) — a problem doesn't own its associations.
- **No `PadTemplate` literal exists** — pads use a `PadProfile` over Sandpack's
  `SandpackPredefinedTemplate` / `SandpackFiles`, so `BuildProblem` reuses those same Sandpack types
  (type-only, erased imports). Whether build problems adopt the full `PadProfile` is Phase 2's call.
- **`ProblemSource.origin`** widened to `"leetcode" | "authored"` (and `frontendId` is now optional)
  so off-catalog and build problems have honest provenance.
- **`toClientProblem` is unchanged** (`Problem → ClientProblem`); `getProblem`/`listProblems` now
  return `AnyProblem`, and the two algo-only server boundaries
  ([`/judge/[id]` page](../../src/app/judge/[id]/page.tsx), [`/api/judge` route](../../src/app/api/judge/route.ts))
  narrow on `kind === "algo"` — build problems `notFound`/`400` until their route lands in Phase 2.

**Honest cost:** every consumer that reads a problem now narrows on `kind`. That's the real,
non-accidental price of a second problem type — accepted deliberately, because pure-function tests
and "build a carousel" are not the same thing and shouldn't share one shape.

## Phase 0b — Company associations as a separate map — **Done**

A problem doesn't own its companies — Merge Intervals is asked _everywhere_, and we don't want to
re-edit a problem module every time a new company surfaces it. The association lives out of the
problem files, in its own single-source module — [companies.ts](../../src/judge/companies.ts):

```ts
export type CompanyTag = "new-york-times"; // grown as companies are sourced

/** Company → problems known to be asked there. The only place this edge is written. */
export const companyProblems: Partial<Record<CompanyTag, readonly ProblemId[]>> = {
  // "new-york-times": ["merge-intervals", …]  ← filled in by the sourcer as problems are imported
};
```

`ProblemId` (= `keyof typeof problems`) as the value type means an association naming a problem the
bank doesn't have is a **compile error** — the map can't drift ahead of the registry. It's seeded
empty: nothing is associated until the sourcer (Phase 3) runs, and `Partial` lets a company be known
before any of its problems are imported. `problemsForCompany` / `companiesForProblem` both derive
from this one map — the edge is never stored twice. (An explicit annotation rather than `satisfies`,
because an empty literal under `satisfies` infers `{}` and breaks lookups by `CompanyTag`.)

## Phase 1 — Name → metadata resolution — **Done**

Given `"Merge Intervals"`, resolution yields the seed metadata (`ProblemStub` in
[problem.ts](../../src/judge/problem.ts) — `id`/`title`/`difficulty`/`tags`/`source`, derived from
`ProblemBase` so it can't drift):

- **catalog hit** ([resolveProblem.mjs](../../scripts/resolveProblem.mjs) searches
  [leetcodeProblemSet.json](../../src/judge/problems/leetcodeProblemSet.json) by title/slug) → emits
  the stub with `origin: "leetcode"`;
- **off-catalog** (e.g. _Convert BST to Sorted Doubly Linked List_, _Make String a Subsequence…_) →
  emits a skeleton stub (`origin: "authored"`, `difficulty`/`tags` `null`/empty) whose missing fields
  are sourced from the web. Partial/ambiguous names return candidates to disambiguate.

`resolveProblem.mjs` is authoring-time tooling like
[verifyProblems.mjs](../../scripts/verifyProblems.mjs) — the app never imports it, so the 85KB
catalog stays out of the bundle. The [`problem-importer`](../../.claude/agents/problem-importer.md)
now accepts **a catalog row, a name/slug (it runs the resolver), or an off-catalog stub**, and grows
the hand-maintained `TopicTag` union when a web-sourced tag isn't in it yet. The frozen 100-row dump
is never appended to.

## Phase 2 — Build problems reuse the pad — **Done**

A build problem is an authored `BuildProblem` solved in the existing pad bundler. How it's wired:

- **Route:** [`/judge/[id]`](../../src/app/judge/[id]/page.tsx) branches on `kind` — `build` renders
  [`BuildLoader`](../../src/app/judge/[id]/BuildLoader.tsx) (`dynamic`, `ssr: false`, since Sandpack
  can't SSR), which loads [`BuildWorkspace`](../../src/judge/BuildWorkspace.tsx); `algo` renders the
  judge as before. Build problems appear in the `/judge` list alongside algo ones.
- **Reuse, not a fork:** `BuildWorkspace` renders [`CoderPad`](../../src/pad/CoderPad.tsx) — the same
  bundler/save/persistence machinery — passing a `PadProfile` built from the problem and two new
  generic seams on the pad: `leadingPanel` (the prompt column) and a render-prop `renderToolbar`
  (a judge-style back/title/Save/Reset bar). The pad layer stays free of judge concepts. See
  [pad.md → Reusable seams](pad.md#reusable-seams-leadingpanel--rendertoolbar).
- **Persistence + reset:** the pad id **is** the problem id, so a solver's edits persist across
  visits via the normal [pad.ts](../../src/pad/pad.ts) localStorage path, and Reset
  (`resetPad`) rehydrates from the starter — answering the doc's "open the same problem twice"
  question.
- **No auto-grading.** Build tasks are open-ended / human-evaluated; the worker never scores them.
  `evaluationNotes` is the rubric a reviewer reads, surfaced in
  [`BuildProblemPanel`](../../src/judge/BuildProblemPanel.tsx). [verifyProblems.mjs](../../scripts/verifyProblems.mjs)
  `SKIP`s `kind: "build"`.

**v1 simplification:** `BuildWorkspace` layers the problem's `files` over the shared
`typescriptFrontend` base layout (so a problem only specifies what it overrides). This resolves the
"which template" open question below to "the one TS-frontend profile, for now" — revisit when a
build problem needs a different stack. First authored example:
[buildStarRating.ts](../../src/judge/problems/buildStarRating.ts).

## Phase 3 — The `company-sourcer` agent — **Done**

[`.claude/agents/company-sourcer.md`](../../.claude/agents/company-sourcer.md). Orchestrates; does not
re-author. Flow:

1. Take one company name.
2. WebSearch → candidate problem names, **deduped and ranked by source reliability** (first-party
   signals over recycled aggregator anecdotes), each classified **algo** vs **build**.
3. For each resolved problem:
   - **exists** (in [problems/index.ts](../../src/judge/problems/index.ts)) → add the edge in `companyProblems`;
   - **algo, missing** → resolve via [resolveProblem.mjs](../../scripts/resolveProblem.mjs), delegate
     to the `problem-importer` subagent (its self-verification +
     [`verifyProblems.mjs`](../../scripts/verifyProblems.mjs) gate apply unchanged), then add the edge;
   - **build, missing & pad-supportable** → author a `BuildProblem` (à la
     [buildStarRating.ts](../../src/judge/problems/buildStarRating.ts)), then add the edge;
   - **build, unsupportable** → record it in `docs/improvements/build-sandbox-gaps.md` + an upgrade
     plan in the report; **never fabricate** a problem.
4. Report a per-company table: action (tagged / imported / authored / unsupported) and **two**
   confidences — _association_ (does the company use it) and _authoring_ (is the problem faithful).

**Reliability caveat baked into the agent:** no one publishes a verified company problem set.
Glassdoor / Blind / aggregator lists are leads, not ground truth — so association confidence is
reported separately and aggregator-only evidence is capped low.

## Phase 4 — Company filter on `/judge`

Folds into the already-open _Filter UI_ follow-up in
[problem-authoring.md](problem-authoring.md#planphases). Surface `companyProblems` as a filter facet
on the `/judge` list alongside topic tags.

---

## Build vs. defer — decided

Both the algo path and the pad-backed build path are in scope for v1 (not algo-only with build
deferred). Build problems reuse the existing CoderPad sandbox rather than getting a new judge
problem kind, because they're open-ended and don't need automated grading.

## Open questions — resolved in Phase 2

- **Where build-problem definitions live** → **one bank.** `src/judge/problems/`, discriminated, since
  the registry is already `AnyProblem` ([buildStarRating.ts](../../src/judge/problems/buildStarRating.ts)).
- **Seeding without clobbering edits** → **pad id = problem id.** Edits persist via the normal
  localStorage path; `resetPad` is the "reset to starter" affordance.
- **Template reuse** → **the one TS-frontend profile, for now.** `BuildWorkspace` layers a problem's
  `files` over `typescriptFrontend`'s base layout. Still open: a build-problem-specific template set
  (or adopting the full `PadProfile` per problem) when a task needs a different stack. The
  `BuildProblem.template` field already exists for this; today it's always `"vite-react-ts"`.

## Still open

- **Build-problem tags.** `tags: TopicTag[]` is the algorithmic topic taxonomy and doesn't fit build
  tasks; the first build problem ships with `tags: []`. A build-tag vocabulary (or making the tag axis
  kind-aware) is unaddressed.
