# Navigation & catalog

The app's front door. The home page (`/`) **is** the problem catalog — a single filterable list over both
problem kinds — and the CoderPad scratchpad is demoted to a secondary action rather than a coequal
destination. Code lives under [`src/problems/`](../../src/problems/) (catalog UI + filter/progress logic) and
[`src/app/page.tsx`](../../src/app/page.tsx) (the home route).

## Routes

```
/                 src/app/page.tsx — home = AppHeader + the catalog (server; lists summaries, renders <ProblemCatalog>)
/problems/[id]    src/app/problems/[id]/page.tsx — one problem (algo → AlgoWorkspace, build → BuildLoader)
/pad              src/app/pad/page.tsx — force-dynamic; mints a fresh pad id and redirects to /pad/[id]
/pad/[id]         src/app/pad/[id]/page.tsx — a blank scratchpad (redirects to /problems/[id] if the id is a problem)
/api/judge        src/app/api/judge/route.ts — the judge engine (unchanged; named for the engine, not the catalog)
```

## App shell — [AppHeader](../../src/components/AppHeader.tsx)

Browse pages render a persistent top bar: the **noodle** brand, a `Problems` link, the [`PadsMenu`](../../src/components/PadsMenu.tsx)
control, and the ⌘K search trigger. It's a reusable component (not a root layout), so the full-height workspaces
(`AlgoWorkspace` / `BuildWorkspace`) keep their own chrome and opt out.

- **`PadsMenu`** is the `Pads` nav, a **two-segment control** `[ Pads ▾ | + ]`: the left segment opens a dropdown of
  recent pads (most-recent first) to revisit; the `+` segment mints a fresh pad (`/pad` redirects to a new id). One
  control means there's no separate `New pad` button to duplicate it. Pads live in localStorage; the recency list
  comes from [`useRecentPads`](../../src/pad/useRecentPads.ts) (the `useSyncExternalStore` snapshot shared with
  [`RecentPads`](../../src/components/RecentPads.tsx)).
- **⌘K command palette** ([CommandPalette](../../src/components/CommandPalette.tsx)) is mounted **once** in the root
  layout by [`CommandPaletteProvider`](../../src/components/CommandPaletteProvider.tsx), which owns the open state and
  the global ⌘K/Ctrl-K shortcut and exposes `useCommandPalette().open()` to the header. Problem **summaries** are
  passed in from the server layout so the client never imports the problem registry (answers + hidden tests). It
  fuzzy-matches title/topic/company via the shared `searchCatalog`, with arrow-key navigation and Enter to open.

The detail route was renamed `/judge/[id]` → `/problems/[id]` so the URL stops leaking the "judge"
implementation name. The **API** route stays `/api/judge` deliberately: it's the worker-backed grader, not
the catalog, so renaming it would push the rename into worker code for no gain. Back-links from both
workspaces ([AlgoWorkspace](../../src/problems/algo/AlgoWorkspace.tsx), [BuildToolbar](../../src/problems/build/BuildToolbar.tsx))
point at `/`.

## The catalog

A problem is one of two kinds (`algo` | `build`, see [algo.md](algo.md)); the catalog shows both and filters
across them. The render path:

```
<ProblemCatalog problems={listProblemSummaries()} />   src/problems/catalog/ProblemCatalog.tsx — "use client"
  ├─ <CatalogSidebar>   src/problems/catalog/CatalogSidebar.tsx — left rail: facet sections (counts, show-more) by dimension
  ├─ <CatalogToolbar>   src/problems/catalog/CatalogToolbar.tsx — search box, sort menu (catalogSort.ts), Random jump
  ├─ <ActiveFilters>    src/problems/catalog/ActiveFilters.tsx — removable selection pills + "N of M match" tally
  └─ <CatalogTable>     src/problems/catalog/CatalogTable.tsx — column header + <ProblemRow> per item (shared ROW_GRID)
```

`ProblemCatalog` owns three pieces of local state — facet `selection`, free-text `query`, and `sort` — and derives
the visible rows as `sortItems(searchCatalog(filterCatalog(items, selection), query), sort)`. Each `CatalogItem`
carries a stable 1-based `number` (authored order, shown in the `#` column and used as the newest/oldest sort axis).
Sorts are a single-source registry in [catalogSort.ts](../../src/problems/catalog/catalogSort.ts) (`SortKey` derived from its
keys, same posture as `FACETS`). `searchCatalog` is generic over the row shape so the catalog (`CatalogItem`) and the
command palette (`ProblemSummary`) share one matcher. `Random` jumps to a random *currently-visible* problem.

- **`listProblemSummaries()`** ([problems/index.ts](../../src/problems/data/problems/index.ts)) is the client-safe
  projection: `id`, `title`, `difficulty`, `tags`, `kind`, plus the `companies` resolved from
  [companies.ts](../../src/problems/data/companies.ts). Derived from `ProblemBase` via `Pick`, and free of any algo
  server-only field (`hiddenTests`, `checker`), so it's safe to serialize from the server page into the
  client catalog. The lone `id as ProblemId` cast there is the irreducible string↔`ProblemId` seam (the
  registry erases ids to `string`; `companyProblems` keys them as `ProblemId`).
- **`ProblemCatalog`** (client) derives `CatalogItem`s by joining each summary with its progress status, builds
  the facet views from the *full* set (so a facet never hides its own siblings), filters by the current
  selection, and renders the bar + rows. Selection is local `useState`; status comes from the progress store.

## Generic facet filter — [catalogFilters.ts](../../src/problems/catalog/catalogFilters.ts)

The filter dimensions are a single-source registry, mirroring [`ALGO_SETTINGS`](../../src/problems/progress/settings.ts):

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
`buildFacetViews(items)` lists only the option values that actually occur in the bank (so the UI never offers a
filter that matches nothing) and tags each option with its `count` for the sidebar. `activeSelections(selection)`
flattens the selection into labeled `{ key, value, label }` pairs for the removable pill row.

Iteration uses **`typedEntries<K, V>`** ([lib/utils.ts](../../src/lib/utils.ts)) — `Object.entries` typed to keep
keys as `keyof`, with the lone unavoidable cast (`Object.entries` widens keys to `string` by language design)
living once inside the helper. Passing `FacetDetail` as `V` widens entries past their precise `as const` literals
so the optional `order` reads uniformly. [settings.ts](../../src/problems/progress/settings.ts) is the helper's second caller.

## Progress — [progress.ts](../../src/problems/progress/progress.ts)

Tri-state per problem: `not-started` | `in-progress` | `complete`. `not-started` is the *absence* of a record, so
the localStorage map (`noodle:progress`) only stores the two touched states. A complete entry also stamps
`completedAt` and — for algo — the `solution` (`{ language, source }`) that passed.

The two kinds reach `complete` differently, and the asymmetry is deliberate:

- **Algo is auto-graded.** [`useAlgo`](../../src/problems/algo/useAlgo.ts) calls `markInProgress` on any run and
  `markComplete(id, { language, source })` when a **Submit** passes every case (visible + hidden) — the
  completion oracle. The winning buffer is captured at that moment.
- **Build has no oracle.** A build problem is human-evaluated, so `complete` there is the solver's own call:
  [`BuildToolbar`](../../src/problems/build/BuildToolbar.tsx) has a "Mark as done" toggle (`toggleComplete`), and opening
  one marks it `in-progress`. Build completions carry no `solution` — there's no graded answer to keep.

The store is **subscribable** (`subscribeProgress`): same-tab writes notify in-process listeners (the `storage`
event only fires cross-tab). [`useProgress`](../../src/problems/progress/useProgress.ts) wraps it in `useSyncExternalStore`
with a cached snapshot (re-renders only on a real content change) and an empty server snapshot so SSR markup
("all not-started") matches the client's first paint before hydration. [`StatusDot`](../../src/problems/shared/StatusDot.tsx)
renders the state: hollow ring (not started), amber (in progress), green (complete).
