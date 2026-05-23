# Tech-debt audit — second opinion (2026-05)

Independent deep-dive over `src/` (judge, pad, components, app). Organized by the five
owner-flagged areas. File:line refs throughout; severities are high / medium / low. This audit
does **not** modify source.

---

## 1. File structure — `src/judge/` is a flat directory mixing concerns

`src/judge/` currently holds **39 files** in one flat directory spanning at least five distinct
concerns: the algo judge UI, the build (Sandpack) UI, the catalog/navigation UI, the typed data
core + problem bank, and the cross-kind shared pieces. The only existing subdirectories are
`problems/` (data) and `runner/` (worker). This is the single biggest structural debt.

### The concerns currently tangled together

Sorting the 39 top-level files by what they actually belong to:

- **Data / domain core** (no React): `problem.ts`, `companies.ts`, `progress.ts`, `solution.ts`,
  `settings.ts`, `catalogFilters.ts`, `catalogSort.ts`, `format.ts`, plus `problems/` and
  `runner/`.
- **Algo problem UI**: `JudgeWorkspace.tsx`, `SolutionEditor.tsx`, `ProblemPanel.tsx`,
  `ResultsPanel.tsx`, `TestResult.tsx`, `TestcaseTab.tsx`, `CaseTabs.tsx`, `ValueBlock.tsx`,
  `SolutionsTab.tsx`, `SolutionSettingsMenu.tsx`, `useJudge.ts`, `useJudgeSettings.ts`.
- **Build problem UI**: `BuildWorkspace.tsx`, `BuildProblemPanel.tsx`, `BuildToolbar.tsx`.
- **Catalog / navigation UI**: `ProblemCatalog.tsx`, `CatalogSidebar.tsx`, `CatalogTable.tsx`,
  `CatalogToolbar.tsx`, `ProblemRow.tsx`, `ActiveFilters.tsx`.
- **Cross-kind shared UI**: `ProblemDetailHeader.tsx`, `ProblemTitleBar.tsx`, `DifficultyBadge.tsx`,
  `KindBadge.tsx`, `StatusDot.tsx`, `CompanyAvatar.tsx`, `Prose.tsx`, `useProgress.ts`.

This contradicts the project's own stated layout convention (CLAUDE.md: "Feature folders own
everything for one area"). The judge folder is doing the job of three feature folders plus a data
layer. **Severity: high** (it's the thing the owner is most concerned about, and it actively
misleads — `catalogFilters.ts` reads as "judge" code but powers the home page per navigation.md).

### Proposed target tree

The owner asked specifically for: build vs algo subdirs, a shared subdir, and a `data/` subdir for
problems and problem sets. A tree that satisfies that and follows the existing `pad/` precedent:

```
src/
  problems/                       (renamed from judge/ — see §2)
    data/                         the typed core + bank + sets (no React, server-importable)
      problem.ts                  types, defineProblem/defineBuildProblem, deriveParamNames
      companies.ts
      progress.ts                 store (localStorage today; the DB seam — see §5)
      solution.ts                 store
      settings.ts                 editor-settings registry + load/save
      bank/                       (was problems/) the authored modules
        index.ts                  registry, getProblem, summaries
        twoSum.ts, addTwoNumbers.ts, …
        leetcodeProblemSet.json   the catalog/work-queue JSON (a "problem set")
      sets/                       future: curated/company problem sets land here
    runner/                       unchanged: runSubmission.ts, problemTester.worker.mjs (see §2)
    algo/                         the worker-graded arm
      AlgoWorkspace.tsx           (was JudgeWorkspace)
      SolutionEditor.tsx, ProblemPanel.tsx, ResultsPanel.tsx, TestResult.tsx,
      TestcaseTab.tsx, CaseTabs.tsx, ValueBlock.tsx, SolutionsTab.tsx,
      SolutionSettingsMenu.tsx
      useAlgo.ts (was useJudge), useEditorSettings.ts (was useJudgeSettings)
    build/                        the Sandpack arm
      BuildWorkspace.tsx, BuildProblemPanel.tsx, BuildToolbar.tsx
    catalog/                      the home-page catalog (per navigation.md)
      ProblemCatalog.tsx, CatalogSidebar.tsx, CatalogTable.tsx, CatalogToolbar.tsx,
      ProblemRow.tsx, ActiveFilters.tsx, catalogFilters.ts, catalogSort.ts
    shared/                       cross-kind problem UI + tiny utils
      ProblemDetailHeader.tsx, ProblemTitleBar.tsx, DifficultyBadge.tsx, KindBadge.tsx,
      StatusDot.tsx, CompanyAvatar.tsx, Prose.tsx, format.ts, useProgress.ts
```

Notes / judgment calls:
- `catalog/` arguably belongs at `src/` top level (navigation.md treats it as its own feature, "the
  app's front door"). Either is defensible; nesting it under `problems/` keeps the import graph
  local since every catalog type derives from `ProblemSummary`. **Flag for owner decision.**
- `format.ts` is split-brained: `titleizeSlug` is generic UI, `stringify` is judge-value rendering.
  Both are tiny; keep together in `shared/` or fold `stringify` into a runner-adjacent module.
- `runner/` already exists and is clean — leave it as a sibling of `data/`.
- The data/ split is the highest-value move for §5 (DB migration): it isolates the four localStorage
  stores (`progress.ts`, `solution.ts`, `settings.ts`, and pad's `pad.ts`) so swapping their
  backends doesn't ripple through UI folders.

**Severity: high.** Pure-move refactor (plus import-path churn); no behavior change. Worth doing
before the DB migration so the migration touches one folder.

---

## 2. Naming — "judge" is overloaded; "ProblemTester" fits the runner

The docs already concede this is in motion: navigation.md records the route rename
`/judge/[id]` → `/problems/[id]` "so the URL stops leaking the judge implementation name," but the
folder, the central hook, the workspace, and the worker still say "judge." The result is that
"judge" means **four different things** depending on file:

1. the whole LeetCode feature (folder `src/judge/`),
2. the algo arm specifically (`JudgeWorkspace`, `useJudge` — these do *not* cover build),
3. the test-running engine (`/api/judge`, `runSubmission`, `judge.worker.mjs`),
4. editor settings (`JUDGE_SETTINGS`, `useJudgeSettings`) that aren't about judging at all.

### Recommendation

| Current | Rename to | Why |
| --- | --- | --- |
| `src/judge/` (folder) | `src/problems/` | The feature is "problems" (algo + build + catalog), not judging. Matches the `/problems/[id]` route + `getProblem`/`ProblemBase`/`ProblemId` naming already dominant in the code. **High** |
| `JudgeWorkspace.tsx` / `JudgeWorkspace` | `AlgoWorkspace` | It's strictly the algo arm (build has `BuildWorkspace`). "Judge" misleads — algo.md itself says "this doc's editor/runner/results detail is the **algo arm**." **High** |
| `useJudge.ts` / `useJudge` | `useAlgo` (or `useAlgoProblem`) | Same: algo-only (build uses the pad hooks). **High** |
| `runSubmission` + `judge.worker.mjs` | `ProblemTester` / `problemTester.worker.mjs` (or `runner`/`testRunner`) | The owner's instinct is right: this code *runs tests against a submission*, it doesn't adjudicate a catalog. `ProblemTester` reads well. The doc's claim that renaming `/api/judge` "would push the rename into worker code for no gain" is now a reason **to** rename the worker, since you're renaming the folder anyway. **Medium** |
| `/api/judge/route.ts` | `/api/run` or `/api/test` | Optional. Lower priority — it's a wire endpoint, not read often. Keep if churn-averse. **Low** |
| `settings.ts` `JUDGE_SETTINGS` / `JudgeSettings` / `useJudgeSettings` | `EDITOR_SETTINGS` / `EditorSettings` / `useEditorSettings` | These are editor preferences (autocomplete, autosave), shared in spirit with the pad. Nothing to do with judging. **Medium** |

Caveat (honesty per the learning-lens rule): a folder rename is a wide diff (every `@/judge/...`
import moves) and `useJudge`/`JudgeWorkspace` are referenced in three feature docs that would need
updating too. Bundle the rename with the §1 restructure into one commit so the churn is paid once.
Do **not** rename `ProblemKind = "algo" | "build"` — that discriminant is already correct and is the
basis for the new folder split.

---

## 3. useEffect / useLayoutEffect catalog

Eight effect sites total. The codebase is genuinely disciplined here (CLAUDE.md's "no useEffect to
sync state" rule is largely honored) — most are legitimate. Findings:

| # | Location | Purpose | Verdict |
| --- | --- | --- | --- |
| 1 | `useJudge.ts:46` `useLayoutEffect` | sync `sourcesRef.current = sources` | **Keep.** Documented React 19 no-ref-writes-during-render workaround; can't be an event handler (must track every render's `sources`). Low-risk. |
| 2 | `useJudge.ts:149` `useEffect` (in `useJudgeAutosave`) | debounced autosave on content change | **Keep, but see note.** A debounce timer keyed to changing `code` is a legitimate effect — there's no single event to hang it on (CodeMirror change already flows through `setSource`). Honest caveat below. |
| 3 | `usePadSave.ts:31` `useLayoutEffect` | sync `sandpackRef.current = sandpack` | **Keep.** Same ref-sync rationale as #1. |
| 4 | `usePadSave.ts:41` `useEffect` | one-shot `runSandpack()` on mount (StrictMode-guarded) | **Keep.** A genuine mount side effect (boot the bundler); no user event triggers it. The `startedRef` guard is the right tool. |
| 5 | `usePadSave.ts:95` `useEffect` (in `useAutosave`) | debounced autosave on content change | **Keep.** Pad twin of #2 — same reasoning, same caveat. |
| 6 | `usePadPersistence.ts:17` `useEffect` | debounced localStorage writeback on `files` change | **Keep.** Reacting to Sandpack-owned bundler state (`files`) that the app doesn't drive via an event — an effect is the only seam. |
| 7 | `useSaveShortcut.ts:7` `useEffect` | global ⌘S keydown listener | **Keep.** Canonical subscription effect (add/remove window listener). Correct. |
| 8 | `CommandPaletteProvider.tsx:32` `useEffect` | global ⌘K keydown listener | **Keep.** Same as #7. Correct. |
| 9 | `useJudgeSettings.ts:15` `useEffect` | `saveSettings(settings)` whenever `settings` changes | **Replace — the one real offender.** This is "persist on every state change," which is exactly what should be a direct write in `setSetting`. See below. |

### The one finding worth acting on — `useJudgeSettings.ts:15` (medium)

```ts
const setSetting = useCallback(
  (key, value) => setSettings((prev) => ({ ...prev, [key]: value })),
  [],
);
useEffect(() => { saveSettings(settings); }, [settings]);
```

`setSetting` is the *only* way `settings` changes, so the persistence belongs in the handler, not a
reactive effect. The effect form also writes back on the **initial mount** (persisting the
loaded-or-default value pointlessly) and couples persistence to render rather than to the user
action. Direct form:

```ts
const setSetting = useCallback((key, value) =>
  setSettings((prev) => {
    const next = { ...prev, [key]: value };
    saveSettings(next);
    return next;
  }), []);
```

This is the same pattern `progress.ts`/`solution.ts` already use (write inside the mutator). Note
the pad's autosave setting (`PadWorkspace.tsx:45` `useState(false)`) isn't persisted at all — an
asymmetry worth noting but separate from this fix.

### Honest caveat on the two autosave effects (#2, #5)

Both are *correct* as effects, but they're **near-identical** (see §4) and both re-create their
timer on `save` identity changes. `save` is memoized (`useCallback`), so this is fine today; flagged
only so a future change to `save`'s deps doesn't silently turn autosave into fire-on-every-keystroke.

**Net:** 8 of 9 effects are justified. Only `useJudgeSettings.ts:15` should become a direct write.

---

## 4. Duplicated / near-duplicated code

Catalogued by severity. Several of these are at the "2 instances → raise it" threshold the project's
own extraction rule calls out; a couple are at 3-4 instances (clear extract).

### 4.1 The autosave hook — `useJudgeAutosave` vs `useAutosave` (HIGH)

- `useJudge.ts:140-157` (`useJudgeAutosave`)
- `usePadSave.ts:85-104` (`useAutosave`)

These are the **same hook** with the dimension renamed (`{ language, code }` vs `{ path, code }`):
same `AUTOSAVE_DEBOUNCE_MS = 600` constant (declared twice — `useJudge.ts:14`, `usePadSave.ts:83`),
same `lastSeen` ref, same "changed same key" guard, same 600ms `setTimeout`/`clearTimeout`. This is
3+ structural repetition by the project's own rule. Extract a generic:

```ts
// e.g. src/components/useDebouncedAutosave.ts
const useDebouncedAutosave = <K>(enabled: boolean, save: () => void, key: K, code: string) => { … }
```

where `key` is the "switching this resets the debounce" axis (language or file path). Both callers
pass their axis. **High** — exact logic dup across the two main features, and the doc already frames
them as twins ("the analog of the pad's `{ path, code }`").

### 4.2 The `sourcesRef`/`sandpackRef` layout-effect ref-sync (MEDIUM)

- `useJudge.ts:45-48`
- `usePadSave.ts:30-33`

Identical "stable-identity ref synced in `useLayoutEffect`, React 19 no-write-during-render"
pattern. A `useLatestRef(value)` helper would single-source the comment too (the same 2-line WHY is
copy-pasted). **Medium** — small, but it's the exact same workaround in two places.

### 4.3 The underline tab-bar (MEDIUM)

The "row of buttons with an active underline (`absolute … h-0.5 bg-primary`)" markup appears **4
times** with the same classes:

- `ProblemPanel.tsx:69-91` (Description/Solutions)
- `ResultsPanel.tsx:25-43` (Testcase/Test Result)
- `PadConsolePanel.tsx:~239-253` (console tabs)
- `BuildProblemPanel.tsx:11-16` (single static "Description" tab, deliberately styled to match)

The shared classes (`"relative px-3 pb-2 text-sm font-medium transition-colors"`,
`"absolute right-0 bottom-0 left-0 h-0.5 bg-primary"`, the active/inactive `text-foreground` vs
`text-muted-foreground hover:text-foreground`) are copy-pasted. algo.md even documents that
`BuildProblemPanel` "mirrors it with a static Description label styled like the algo active tab" —
i.e. the duplication is intentional-but-manual, which is exactly the drift risk. Extract a
`<TabBar tabs labels active onSelect>` (generic over the tab id union) used by all three real tab
bars; `BuildProblemPanel` can render a one-tab instance. **Medium** — 4 instances, observed
repetition, and a documented "keep these in sync by hand" hazard.

### 4.4 `LANGUAGE_LABELS` declared twice (LOW)

- `SolutionEditor.tsx:27-30`
- `SolutionsTab.tsx:4-7`

Identical `Record<SupportedLanguage, string>` of `{ typescript: "TypeScript", javascript:
"JavaScript" }`. Promote to one export next to `SupportedLanguage` in `problem.ts` (the
single-source-literal rule the project applies to `TopicTag`/`JUDGE_SETTINGS` says this map should
live with the union). **Low** but trivially fixable.

### 4.5 The Reset-via-ConfirmDialog top-bar action (MEDIUM)

- `JudgeWorkspace.tsx:80-91` (algo Reset)
- `BuildToolbar.tsx:33-44` (build Reset)
- `PadToolbar.tsx:33-44` (pad Reset)

Three near-identical `<ConfirmDialog trigger={<Button variant="outline"><LuRotateCcw/>Reset</Button>}
title="Reset…" confirmLabel="Reset" onConfirm={…}/>` blocks differing only in copy and the
`onConfirm` target. At 3 instances this clears the project's extract threshold — a
`<ResetAction onConfirm description label/>` component would carry the icon + dialog. **Medium.**

### 4.6 The two settings menus — `PadSettingsMenu` vs `SolutionSettingsMenu` (MEDIUM)

- `PadSettingsMenu.tsx` (hardcodes a single "Autosave" checkbox)
- `SolutionSettingsMenu.tsx` (maps over `JUDGE_SETTINGS`)

Same gear-button + `DropdownMenu` + `DropdownMenuLabel "Editor settings"` + `CheckboxItem` shell;
`PadSettingsMenu`'s body is a hand-rolled subset of what `SolutionSettingsMenu` already does
generically. The pad's autosave should *be* an entry in the (renamed) settings registry, and both
menus should be one registry-driven `EditorSettingsMenu`. PadSettingsMenu.tsx:20 even says "Mirrors
the judge's settings menu." **Medium** — also unblocks persisting the pad's autosave (§3).

### 4.7 The `<Tag>` chip (LOW)

- `ProblemRow.tsx:15-17` (`bg-muted px-1.5 py-0.5 text-[0.7rem]`)
- `ProblemTitleBar.tsx:16-20` (`bg-muted px-1.5 py-0.5 text-xs`, + gap for the company avatar)

Two local `Tag` components, both "muted rounded chip," diverging only by text size. Borderline (the
project says don't extract on instance 2 silently) — **raise, don't auto-extract.** A shared
`<Chip>` would also centralize the company-bubble-equals-topic-tag styling algo.md describes.
**Low.**

### 4.8 `deriveParamNames` call site (LOW)

- `TestcaseTab.tsx:12`
- `TestResult.tsx:38`

Both call `deriveParamNames(problem.starterCode.javascript, problem.functionName, args.length)` then
map args to `<ValueBlock label={`${paramNames[i]} =`}>`. The arg-list rendering is duplicated. Minor;
a `<ArgList args paramNames>` would dedupe. **Low.**

### 4.9 The localStorage store boilerplate (LOW–MEDIUM — see also §5)

`progress.ts`, `solution.ts`, `pad.ts`, `settings.ts` each re-implement the same try/catch
`window === undefined` guard, `getItem`/`JSON.parse`, `setItem`/`JSON.stringify` shell. Four copies
of the same "safe localStorage read/write" pattern. A `createLocalStore<T>(key)` helper would
single-source it — **and is the natural seam to swap for the DB (§5).** **Medium** in the context of
the migration, **low** standalone.

### 4.10 The two `useSyncExternalStore` content-hash snapshots (LOW)

- `useProgress.ts:9-22`
- `useRecentPads.ts:23-34`

Same "cache snapshot by a joined content key so the ref is stable" pattern, including the identical
comment. A `useHashedSnapshot(load, hashOf)` helper would dedupe. **Low.**

---

## 5. DB migration readiness (localStorage → Postgres)

Four localStorage-backed stores hold all per-user and (partially) problem state. The good news:
they're already isolated behind pure module functions, so the *call sites* mostly survive. The bad
news: every one is **synchronous**, and a DB is not. That sync→async shift is the dominant breaking
change.

### What's stored where

| Store | Key | Shape | Migrates to |
| --- | --- | --- | --- |
| `progress.ts` | `noodle:progress` (one blob) | `Record<problemId, {status, completedAt?, solution?}>` | `progress` table (user_id, problem_id, status, completed_at, solution_language, solution_source) |
| `solution.ts` | `noodle:solution:<id>` (per problem) | `{ sources: Partial<Record<lang,string>>, updatedAt }` | `solution_draft` table (user_id, problem_id, language, source, updated_at) |
| `pad.ts` | `noodle:pad:<id>` (per pad) | `{ files: SandpackFiles, updatedAt, title? }` | `pad` table (id, user_id, files JSONB, title, updated_at) |
| `settings.ts` | `noodle:judge-settings` (one blob) | `Record<settingKey, boolean>` | `user_settings` (user_id, settings JSONB) — or keep client-side |

**Problems themselves** (`problems/bank/*.ts` + `index.ts`) are authored TypeScript modules, not
user data. They can stay code-as-data (seed the DB from them, or keep them in code and only move
*user* state). The owner said "move problems and per-user state" — moving problems to a DB is a
bigger call; see "Problems: code vs DB" below.

### What breaks

1. **Sync API → async (HIGH).** Every store function is sync and several are called in
   render-critical, sync-only spots:
   - `useJudge.ts:27` seeds editor buffers in a **`useState` lazy initializer** by calling
     `loadSolution(id)` synchronously (algo.md devotes a whole section to why this is
     hydration-safe). A DB read can't run in a `useState` initializer. This becomes a server-side
     load (fetch in the server component / RSC and pass as props) or a loading state. **This is the
     single highest-impact change** — the "no mount effect" design that the docs are proud of is
     built directly on synchronous reads.
   - `useJudgeSettings.ts:8` and `loadSettings()` (`settings.ts:34`) — same lazy-init pattern.
   - `progress.ts` `markInProgress`/`markComplete` are called *inside* `run()`
     (`useJudge.ts:98,110`) as fire-and-forget sync calls. As async DB writes they need
     await/optimistic-update + error handling.
   - `getEntry(problem.id)?.solution` (`useJudge.ts:36`) seeds `submittedSolution` synchronously.

2. **`read()` re-reads on every call (HIGH for correctness under DB).** `progress.ts` calls `read()`
   (a full `getItem`+parse) in `getEntry`, `getStatus`, `markInProgress`, and twice inside
   `markComplete`/`toggleComplete` (read-modify-write). Against localStorage that's free; against a
   DB it's N round-trips per action and a **read-modify-write race** (`markInProgress` does
   `read()` → check → `write()` without a transaction). Needs server-side atomic upserts
   (`INSERT … ON CONFLICT … DO UPDATE`).

3. **The `useSyncExternalStore` reactivity model (HIGH).** `useProgress.ts` /
   `useRecentPads.ts` assume a synchronous `getSnapshot()` and a same-tab in-process listener set
   (`progress.ts:50-52` `subscribeProgress`). `useSyncExternalStore` **requires** a sync snapshot —
   you cannot return a promise. With a DB, progress becomes server state; this layer should move to
   a server-state library (TanStack Query / SWR / RSC + Server Actions + `revalidate`) rather than
   `useSyncExternalStore`. The same-tab listener trick disappears.

4. **`window.location.reload()` in `resetPad` (MEDIUM).** `pad.ts:85-88` resets by clearing
   localStorage and hard-reloading so the seed re-hydrates. With a DB this must be a delete +
   client state refresh (router refresh / query invalidation), not a full reload.

5. **No user identity anywhere (HIGH).** Every key is global-per-browser; there is no `user_id`
   concept. A multi-user DB needs auth + a user column on every table. Today the app is explicitly
   single-trusted-user (algo.md security section), so this is net-new surface, not a port.

6. **`SandpackFiles` as a column (LOW).** `pad.ts` stores the raw Sandpack `files` object — fine as
   JSONB, but it's an external library's shape; pin a stored schema rather than persisting whatever
   Sandpack hands back, so a Sandpack upgrade can't change your column shape.

7. **IDs (LOW).** Problem ids are `titleSlug` strings (`ProblemId` derived from the registry), pad
   ids are random hex (`pad.ts:14`). Both are fine as text PKs; just note `ProblemId` is a
   *compile-time* union — the DB can't enforce it, so the `companies.ts` "association can't name a
   missing problem is a compile error" guarantee weakens to a runtime FK once problems are rows.

### What changes cleanly (the parts that ported well)

- All four stores are **pure functions behind a module** — call sites import `loadSolution`,
  `markComplete`, etc., not raw `localStorage`. Re-implementing those signatures as async DB calls
  is a contained change *if* you accept they become `Promise`-returning.
- `companies.ts` is a clean join table already (`companyProblems` = company→problem edge), maps
  directly to a `company_problem` M:N table.
- `ClientProblem`/`ProblemSummary` projections (`problems/index.ts`) already separate server-only
  fields (`hiddenTests`, `checker`) from client-safe ones — that boundary is exactly what you want
  when problems become DB rows fetched server-side.
- Progress's tri-state with "`not-started` = absence of a row" maps perfectly to a sparse table.

### Recommended migration shape

1. **Introduce a `createStore<T>` async seam first** (ties to §4.9). Convert the four stores to one
   small async interface (`get`/`set`/`subscribe`) with a localStorage implementation today. This
   forces the call sites to go async *before* the DB exists, de-risking the cutover.
2. **Move read seeds to the server.** `/problems/[id]/page.tsx` is already a server component that
   calls `getProblem` — extend it to load the user's saved solution + progress server-side and pass
   them as props to `JudgeWorkspace`, replacing the `useState` lazy-init reads. This is the
   load-bearing change.
3. **Replace `useSyncExternalStore` progress with server state + Server Actions.** `markComplete`
   etc. become Server Actions doing atomic upserts; the catalog reads progress server-side or via a
   query cache.

### ORM recommendation

For this stack (Next.js 16 App Router, RSC + Server Actions, Postgres, a TS-clever learning posture):

- **Drizzle ORM** — recommended primary. It's SQL-first with fully-inferred TS types (schema → row
  types with no codegen step), tiny runtime, first-class in serverless/edge-ish Next deployments,
  and the type inference is exactly the "types flow through" payoff the project's CLAUDE.local.md
  prizes. You can derive your row types and re-use the existing `Difficulty`/`ProgressStatus` unions
  via Drizzle's `enum`/`$type<…>()`.
- **Prisma** — the safe alternative if you want a managed migration workflow + Studio GUI and don't
  mind a codegen step and a heavier client. Slightly more friction in RSC/edge contexts than
  Drizzle but very ergonomic.
- **Kysely** — if you'd rather have a typed query builder with no ORM layer at all (most control,
  least magic). Reasonable here but less batteries-included than Drizzle.

Pick **Drizzle**: best fit for the App-Router-server-action data flow above and the type-inference
the codebase already leans on. Keep the authored problem modules as the **seed source** (a
`drizzle seed` script that imports the registry) rather than hand-writing problem rows — that
preserves `defineProblem`'s compile-time signature checking as the authoring gate while the DB holds
the runtime copy.

**Severity: high overall** — not because the data is messy (it's clean), but because the entire
"no-mount-effect, synchronous lazy-init" design the docs celebrate is built on sync reads, and that
assumption is what the DB breaks.

---

## Top findings, ranked

1. **(§1, high)** Flatten-to-folders: split `src/judge/` into `data/` + `algo/` + `build/` +
   `catalog/` + `shared/` (+ existing `runner/`). Biggest structural win, and a prerequisite that
   makes the DB migration touch one folder.
2. **(§5, high)** Sync→async is the real migration cost: the celebrated `useState`-lazy-init reads
   (`useJudge.ts:27`, `useJudgeSettings.ts:8`) and the `useSyncExternalStore` progress layer all
   assume synchronous reads. Move seeds server-side; replace the store layer with an async seam +
   Server Actions; ORM = Drizzle.
3. **(§2, high)** Rename `judge/`→`problems/`, `JudgeWorkspace`→`AlgoWorkspace`,
   `useJudge`→`useAlgo`; rename the runner to `ProblemTester`; rename `JUDGE_SETTINGS`→editor
   settings. Bundle with §1.
4. **(§4.1, high)** Extract the duplicated 600ms autosave hook (`useJudgeAutosave` ≈ `useAutosave`).
5. **(§3 / §4.6, medium)** `useJudgeSettings.ts:15` should write in the handler, not a reactive
   effect — and fold both settings menus + the pad's unpersisted autosave into one registry.
6. **(§4.3, §4.5, medium)** Extract the 4× underline tab-bar and the 3× Reset-ConfirmDialog action.

Lower-severity dups (§4.2, 4.4, 4.7–4.10) are listed inline with file:line refs.
</content>
</invoke>
