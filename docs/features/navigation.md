# Navigation & catalog

The app's front door. The home page (`/`) **is** the problem catalog — a single filterable list over both
problem kinds — and the CoderPad scratchpad is demoted to a secondary action rather than a coequal
destination. Code lives under [`src/judge/`](../../src/judge/) (catalog UI + filter/progress logic) and
[`src/app/page.tsx`](../../src/app/page.tsx) (the home route).

## Routes

```
/                 src/app/page.tsx — home = the catalog (server; lists summaries, renders <ProblemCatalog>)
/problems/[id]    src/app/problems/[id]/page.tsx — one problem (algo → JudgeWorkspace, build → BuildLoader)
/pad/[id]         src/app/pad/[id]/page.tsx — a blank scratchpad (the "New blank pad" button mints one)
/api/judge        src/app/api/judge/route.ts — the judge engine (unchanged; named for the engine, not the catalog)
```

The detail route was renamed `/judge/[id]` → `/problems/[id]` so the URL stops leaking the "judge"
implementation name. The **API** route stays `/api/judge` deliberately: it's the worker-backed grader, not
the catalog, so renaming it would push the rename into worker code for no gain. Back-links from both
workspaces ([JudgeWorkspace](../../src/judge/JudgeWorkspace.tsx), [BuildToolbar](../../src/judge/BuildToolbar.tsx))
point at `/`.

## The catalog

A problem is one of two kinds (`algo` | `build`, see [judge.md](judge.md)); the catalog shows both and filters
across them. The render path:

```
<ProblemCatalog problems={listProblemSummaries()} />   src/judge/ProblemCatalog.tsx — "use client"
  ├─ <FacetFilterBar>   src/judge/FacetFilterBar.tsx — toggle-chip groups, one row per facet
  └─ <ProblemRow>       src/judge/ProblemRow.tsx — status dot, title, KindBadge, DifficultyBadge, topic/company chips
```

- **`listProblemSummaries()`** ([problems/index.ts](../../src/judge/problems/index.ts)) is the client-safe
  projection: `id`, `title`, `difficulty`, `tags`, `kind`, plus the `companies` resolved from
  [companies.ts](../../src/judge/companies.ts). Derived from `ProblemBase` via `Pick`, and free of any algo
  server-only field (`hiddenTests`, `checker`), so it's safe to serialize from the server page into the
  client catalog. The lone `id as ProblemId` cast there is the irreducible string↔`ProblemId` seam (the
  registry erases ids to `string`; `companyProblems` keys them as `ProblemId`).
- **`ProblemCatalog`** (client) derives `CatalogItem`s by joining each summary with its progress status, builds
  the facet views from the *full* set (so a facet never hides its own siblings), filters by the current
  selection, and renders the bar + rows. Selection is local `useState`; status comes from the progress store.

## Generic facet filter — [catalogFilters.ts](../../src/judge/catalogFilters.ts)

The filter dimensions are a single-source registry, mirroring [`JUDGE_SETTINGS`](../../src/judge/settings.ts):

```ts
const FACETS = {
  kind:       { label: "Type",       valuesOf: (item) => [item.kind], labelFor: …, order: ["algo","build"] },
  difficulty: { … }, status: { … }, tags: { … }, companies: { … },
} as const satisfies Record<string, FacetDetail>;
export type FacetKey = keyof typeof FACETS;   // derived, not hand-maintained
```

Keying by facet makes it **exhaustive by construction** (a key can't exist without its detail) and lets
`FacetKey` be derived. `valuesOf` returns the value(s) an item has for a facet — one for `kind`/`difficulty`/
`status`, many for `tags`/`companies` — so one matcher handles one-of and many-of facets uniformly: an item
passes when, for every facet *with* a selection, at least one of its values is chosen (OR within a facet, AND
across facets). `order` fixes display order for closed sets; open sets (topics, companies) sort alphabetically.
`buildFacetViews(items)` lists only the option values that actually occur in the bank, so the UI never offers a
filter that matches nothing.

Iteration uses **`typedEntries<K, V>`** ([lib/utils.ts](../../src/lib/utils.ts)) — `Object.entries` typed to keep
keys as `keyof`, with the lone unavoidable cast (`Object.entries` widens keys to `string` by language design)
living once inside the helper. Passing `FacetDetail` as `V` widens entries past their precise `as const` literals
so the optional `order` reads uniformly. [settings.ts](../../src/judge/settings.ts) is the helper's second caller.

## Progress — [progress.ts](../../src/judge/progress.ts)

Tri-state per problem: `not-started` | `in-progress` | `complete`. `not-started` is the *absence* of a record, so
the localStorage map (`noodle:progress`) only stores the two touched states. A complete entry also stamps
`completedAt` and — for algo — the `solution` (`{ language, source }`) that passed.

The two kinds reach `complete` differently, and the asymmetry is deliberate:

- **Algo is auto-graded.** [`useJudge`](../../src/judge/useJudge.ts) calls `markInProgress` on any run and
  `markComplete(id, { language, source })` when a **Submit** passes every case (visible + hidden) — the
  completion oracle. The winning buffer is captured at that moment.
- **Build has no oracle.** A build problem is human-evaluated, so `complete` there is the solver's own call:
  [`BuildToolbar`](../../src/judge/BuildToolbar.tsx) has a "Mark as done" toggle (`toggleComplete`), and opening
  one marks it `in-progress`. Build completions carry no `solution` — there's no graded answer to keep.

The store is **subscribable** (`subscribeProgress`): same-tab writes notify in-process listeners (the `storage`
event only fires cross-tab). [`useProgress`](../../src/judge/useProgress.ts) wraps it in `useSyncExternalStore`
with a cached snapshot (re-renders only on a real content change) and an empty server snapshot so SSR markup
("all not-started") matches the client's first paint before hydration. [`StatusDot`](../../src/judge/StatusDot.tsx)
renders the state: hollow ring (not started), amber (in progress), green (complete).
