# Tech-debt audit — 2026-05-22

A full-repo audit ahead of two structural moves: (1) reorganizing `src/judge/` and (2) standing up a
database for problems/progress. Scope covers file structure, the "judge" naming, `useEffect` usage,
duplicated code, and how today's data structures port to a DB. **This is a plan document — no source
was changed.** Findings are catalogued exhaustively per the brief; each carries a severity and a
concrete remediation. The phased plan at the end orders the work to de-risk the DB migration.

Severity legend: **🔴 high** (will bite the DB migration or is a correctness/scaling hazard) ·
**🟡 medium** (real debt, no fire) · **🟢 low** (polish / learning-value refactor).

> **Cross-checked.** A second auditor ran this brief independently (without reading this doc) and
> wrote [2026-05-tech-debt-second-opinion.md](2026-05-tech-debt-second-opinion.md). The two audits
> agreed on every structural call (folder split, the `judge→algo` / `runner→tester` rename, the single
> `useJudgeSettings` effect offender, the `localStorage`-boilerplate and autosave duplication). The
> second pass added findings now folded in here: the duplicated `useSyncExternalStore` snapshot pattern
> (§4.7), the divergent settings menus (§4.7), and — most importantly — the **synchronous-read → async
> DB** hazard (§5.7), which is arguably the highest-severity migration risk. This doc carries the two
> findings the second pass missed: the registry-order problem number (§5.1) and the source-of-truth
> decision table (§5.2). Read both; they're complementary.

---

## 0. Snapshot

- **Stack:** Next 16 (App Router), React 19, Tailwind 4, shadcn (Base UI), Sandpack, CodeMirror,
  sucrase + prettier. No backend, no DB, no auth — everything client-persisted in `localStorage`.
- **`src/judge/`** is a **flat 40-file directory** holding five unrelated concerns: the algo judge UI,
  the build-task UI, the home catalog/navigation UI, shared primitives, and the data layer
  (problems, companies, progress, persistence, the worker runner).
- **Data is code:** problems are TS modules in [src/judge/problems/](../../src/judge/problems/), the
  registry is a plain object, and the catalog `#NN` is *registry insertion order*. Progress,
  solutions, and settings are `localStorage` blobs with no user scoping.

The codebase is genuinely well-built — the type modelling (`defineProblem` generics, single-source
unions, the facet registry) is strong and the docs are unusually complete. The debt is almost all
**organizational and pre-DB**, not rot.

---

## 1. File structure 🟡

### What's there now

[src/judge/](../../src/judge/) is one flat folder with ~40 files spanning:

| Concern | Example files |
| --- | --- |
| Algo judge UI | `JudgeWorkspace`, `SolutionEditor`, `ResultsPanel`, `TestResult`, `TestcaseTab`, `CaseTabs`, `ValueBlock`, `ProblemPanel`, `SolutionsTab`, `SolutionSettingsMenu` |
| Build UI | `BuildWorkspace`, `BuildProblemPanel`, `BuildToolbar` |
| Catalog / navigation UI | `ProblemCatalog`, `CatalogSidebar`, `CatalogTable`, `CatalogToolbar`, `ProblemRow`, `ActiveFilters`, `catalogFilters`, `catalogSort` |
| Shared UI | `ProblemDetailHeader`, `ProblemTitleBar`, `DifficultyBadge`, `KindBadge`, `StatusDot`, `CompanyAvatar`, `Prose`, `format` |
| Data / domain | `problem.ts`, `problems/`, `companies.ts`, `progress.ts`, `solution.ts`, `settings.ts` |
| Engine | `runner/`, `useJudge`, `useJudgeSettings`, `useProgress` |

The CLAUDE.md convention is *"feature folders own everything for one area"* — but `judge/` has become
a catch-all for "anything LeetCode-ish," so build, catalog, and the data layer all leak into it. The
folder name also no longer matches its contents (see §2).

### Recommended target tree

Splitting along the user's lines — build vs algo vs shared, plus a data subdirectory — and folding the
naming change (§2) in:

```
src/
  problems/                      ← was src/judge/  (the whole problem domain)
    data/                        ← the bank + associations (the future DB seam)
      problems/                  ← authored modules (twoSum.ts, buildStarRating.ts, …)
        index.ts                 ← registry + getProblem/listProblems
        leetcodeProblemSet.json
      companies.ts
      problem.ts                 ← shared types: ProblemBase, AnyProblem, AlgoProblem, BuildProblem
    algo/                        ← was the "judge" — algo-only UI + state + runner
      AlgoWorkspace.tsx          ← was JudgeWorkspace
      SolutionEditor.tsx  ResultsPanel.tsx  TestResult.tsx  TestcaseTab.tsx
      CaseTabs.tsx  ValueBlock.tsx  ProblemPanel.tsx  SolutionsTab.tsx
      useAlgo.ts                 ← was useJudge
      tester/                    ← was runner/ (see §2): runTests.ts, problemTester.worker.mjs
    build/
      BuildWorkspace.tsx  BuildProblemPanel.tsx  BuildToolbar.tsx
    catalog/
      ProblemCatalog.tsx  CatalogSidebar.tsx  CatalogTable.tsx  CatalogToolbar.tsx
      ProblemRow.tsx  ActiveFilters.tsx  catalogFilters.ts  catalogSort.ts
    shared/                      ← cross-arm problem UI + domain utils
      ProblemDetailHeader.tsx  ProblemTitleBar.tsx
      DifficultyBadge.tsx  KindBadge.tsx  StatusDot.tsx  CompanyAvatar.tsx
      Prose.tsx  format.ts
    progress/                    ← progress.ts, useProgress.ts, settings.ts, useAlgoSettings.ts, solution.ts
```

Notes:
- `data/` is deliberately the **DB seam** (§5): everything app code reads about a problem flows
  through `data/`, so when the bank moves to Postgres only that folder's read API changes.
- `progress/`, `solution.ts`, `settings.ts` group as "per-user state" — they all become DB-backed,
  user-scoped tables together (§5).
- The `/api/judge` route and `runtime="nodejs"` stay; only the *import paths* move.

**Cost / honesty:** this is a big mechanical move (~40 files + every import + the 6 feature docs that
reference paths). Worth doing **before** the DB work so the data seam is already isolated, but it's a
churny diff — best done as one dedicated commit with no behavior change, ideally right after the
naming rename (§2) so files only move once.

---

## 2. The "judge" naming 🟡 — *propose & recommend*

You're right that "judge" is dated, but the deeper issue is **"judge" names two different things**
that have drifted apart:

1. **A feature area** — the algorithmic-problem experience (editor + examples + grading). This is the
   "algo arm" of the discriminated union, and it's what `JudgeWorkspace` / `useJudge` / `ProblemPanel`
   actually are.
2. **An engine** — the worker thread + `node:vm` that runs submissions against tests
   ([runner/](../../src/judge/runner/), `/api/judge`).

Today both are called "judge," and on top of that the `src/judge/` folder also holds the *catalog* and
*build* code, which aren't "judge" at all. So the rename should split by responsibility, not just
swap one word.

### Recommendation

| Today | Rename to | Why |
| --- | --- | --- |
| `src/judge/` (folder) | `src/problems/` | It's the whole problem domain (algo + build + catalog + data), not a grader. |
| `JudgeWorkspace`, `useJudge`, `useJudgeSettings`, `JUDGE_SETTINGS` | `AlgoWorkspace`, `useAlgo`, `useAlgoSettings`, `ALGO_SETTINGS` | These are the **algo arm** specifically — matches the existing `kind: "algo"` discriminant and `AlgoProblem`. |
| `runner/` + `judge.worker.mjs` + `runSubmission` | **`tester/`** + `problemTester.worker.mjs` + `runTests` | The thing that executes unit tests. Your instinct ("ProblemTester") is the right axis. |
| `/api/judge` route | **keep as-is** | Already deliberately kept (see [navigation.md](../features/navigation.md)); renaming pushes churn into worker-path resolution for no user-facing gain. Optionally `/api/run` later. |

On your two suggested names specifically:
- **"Algo"** — ✅ recommend adopting. It already exists as the `kind` value and `AlgoProblem` type, so
  the UI/state names just align with the model. Low ambiguity.
- **"ProblemTester"** — ✅ recommend for the *engine*, with a small tweak: name the **folder** `tester/`
  and the function `runTests`, reserve a `ProblemTester`-style noun only if you wrap it in a class. The
  worker file becomes `problemTester.worker.mjs`. "Tester" cleanly separates *running tests* from
  *grading/judging* (which is really `markComplete` + the pass/fail oracle in `useAlgo`).

### One naming trap to fix while you're in there 🟡

`problem.ts` exports the type **`Problem`** as the *algo arm* (`kind: "algo"`), while `AnyProblem` is
the union. So `Problem` ≠ "a problem" — it's "an algo problem." This reads backwards at call sites
(`getProblem` returns `AnyProblem`, not `Problem`). Recommend renaming the algo arm to **`AlgoProblem`**
(the company-sourcing doc already *calls* it that — see
[company-sourcing.md Phase 0](../features/company-sourcing.md)) and keeping `AnyProblem` as the union,
or renaming `AnyProblem → Problem` and the arm → `AlgoProblem`. Either removes the "Problem means algo"
landmine. `defineProblem` → `defineAlgoProblem` for symmetry with `defineBuildProblem`.

---

## 3. `useEffect` audit — every site catalogued

Eight effect sites total. Most are legitimate (subscriptions / external-store sync / the React-19 ref
rule). Two are genuine "reacting to state" smells, and the autosave pair is duplicated (§4).

| # | Location | What it does | Verdict |
| --- | --- | --- | --- |
| 1 | [useJudgeSettings.ts:15](../../src/judge/useJudgeSettings.ts#L15) | `saveSettings(settings)` on every `settings` change | 🔴 **Convert to event handler** |
| 2 | [useJudge.ts:149](../../src/judge/useJudge.ts#L149) (`useJudgeAutosave`) | debounce → `save()` when the active buffer changed | 🟡 borderline; dedupe (§4) |
| 3 | [usePadSave.ts:95](../../src/pad/usePadSave.ts#L95) (`useAutosave`) | same as #2 for the pad | 🟡 **duplicate of #2** |
| 4 | [usePadPersistence.ts:17](../../src/pad/usePadPersistence.ts#L17) | debounce → `savePad(files)` when Sandpack files change | 🟢 legit (external-store reaction) |
| 5 | [usePadSave.ts:41](../../src/pad/usePadSave.ts#L41) | run Sandpack once on mount, StrictMode-guarded | 🟢 legit mount effect (flagged below) |
| 6 | [useJudge.ts:46](../../src/judge/useJudge.ts#L46) / [usePadSave.ts:31](../../src/pad/usePadSave.ts#L31) | `useLayoutEffect` ref-sync (React 19 no-ref-writes-in-render) | 🟢 legit; both copies (§4) |
| 7 | [useSaveShortcut.ts:7](../../src/components/useSaveShortcut.ts#L7) | `keydown` listener for ⌘S | 🟢 legit (DOM subscription) |
| 8 | [CommandPaletteProvider.tsx:32](../../src/components/CommandPaletteProvider.tsx#L32) | `keydown` listener for ⌘K | 🟢 legit (DOM subscription) |

### 🔴 #1 — `useJudgeSettings` persists in an effect

```ts
const setSetting = useCallback((key, value) => setSettings(prev => ({ ...prev, [key]: value })), []);
useEffect(() => { saveSettings(settings); }, [settings]);   // ← reacting to state
```

This is the textbook "synchronize to an external system *because* state changed" that CLAUDE.md's
state rules call out (`useEffect` is for side effects, not "react to state by setting/doing other
things"). The write should ride the **event** that caused it:

```ts
const setSetting = useCallback((key, value) =>
  setSettings(prev => {
    const next = { ...prev, [key]: value };
    saveSettings(next);     // persist in the handler that owns the change
    return next;
  }), []);
```

No effect, no extra render-after-commit, and it can't fire on an unrelated re-render. (Identical edge:
the initial mount currently re-saves the loaded-from-storage value for no reason.)

### 🟡 #2/#3 — the autosave effects

These *are* effect-shaped work (a debounced timer keyed off the latest typed value), so they're not a
clean "move to a handler" — there's no single event, edits stream in from CodeMirror/Sandpack. They're
acceptable as effects. The real issue is that #2 and #3 are **the same hook written twice** → §4.4. One
nuance worth a comment: both reach for `lastSeen` refs to *suppress* firing on language/file switches,
which is the tell that they're straddling "event" and "effect" — a unified hook can encapsulate that.

### 🟢 #5 — the StrictMode-guarded run

[usePadSave.ts:40-45](../../src/pad/usePadSave.ts#L40) uses a `startedRef` boolean to dodge the
StrictMode double-invoke of `runSandpack()`. Legit and well-commented, but it's the kind of
module-level imperative that's easy to break; leave as-is, just keep the comment.

**Net:** exactly **one** effect (#1) should become an event handler. The autosave pair stays effects
but should be unified. Everything else is correctly an effect.

---

## 4. Duplication catalogue

Ordered by payoff. Items 1–2 are also the highest-leverage pre-DB refactors.

### 4.1 🔴 `localStorage` read/write boilerplate — 4 copies → one store factory

[pad.ts](../../src/pad/pad.ts), [solution.ts](../../src/judge/solution.ts),
[progress.ts](../../src/judge/progress.ts), and [settings.ts](../../src/judge/settings.ts) each
reimplement the same dance: `typeof window === "undefined"` guard, `try { JSON.parse(getItem) } catch`,
`try { setItem } catch {}`. Four near-identical `read`/`write` pairs.

This is the **single most important dedup before the DB**, because *this boilerplate is exactly the
seam that becomes the persistence adapter.* Extract a typed store:

```ts
// lib/localStore.ts
export const createLocalStore = <T>(keyFor: (id: string) => string) => ({
  read: (id: string): T | null => { /* the guarded try/catch parse, once */ },
  write: (id: string, value: T): void => { /* guarded setItem, once */ },
  remove: (id: string) => { /* … */ },
});
```

Each module becomes a thin domain wrapper over one store instance. When Postgres lands, you swap the
store implementation (or introduce a `Repository<T>` interface with `local` and `db` impls) and the
domain modules barely change. Note the matcher posture mirrors the facet/settings registries you
already like — a generic the callers' types flow through.

### 4.2 🟡 Underline-tab header — 3 copies → `<UnderlineTabs>`

The "row of buttons with an absolutely-positioned `h-0.5 bg-primary` underline on the active one"
appears in:
- [ProblemPanel.tsx:67-92](../../src/judge/ProblemPanel.tsx#L67) (Description / Solutions)
- [ResultsPanel.tsx:25-44](../../src/judge/ResultsPanel.tsx#L25) (Testcase / Test Result)
- [BuildProblemPanel.tsx:11-16](../../src/judge/BuildProblemPanel.tsx#L11) (a static single "Description" styled *to match* the active tab)

Three instances ⇒ past CLAUDE.md's "extract at 3" threshold. A small generic carries it:

```ts
<UnderlineTabs tabs={TABS} labelOf={TAB_LABEL} active={tab} onSelect={setTab} />
```

`BuildProblemPanel`'s static label is the same component with one non-interactive tab. This also fixes
a latent drift: `ProblemPanel` writes `active ? (...) : null` while `ResultsPanel` writes
`active && (...)` for the same underline — they're meant to be identical.

### 4.3 🟡 Tag / chip pill — 3 variants → one `<Tag size>` 

A `bg-muted` rounded pill recurs with slightly different padding/text-size:
- [ProblemTitleBar.tsx:16-20](../../src/judge/ProblemTitleBar.tsx#L16) — local `Tag` (`text-xs`, also wraps company chips)
- [ProblemRow.tsx:15-17](../../src/judge/ProblemRow.tsx#L15) — local `Tag` (`text-[0.7rem]`)
- the company chip in both files repeats `inline-flex items-center gap-1.5` + `CompanyAvatar` + label

Two literal `Tag` copies + the company-chip repetition. Extract one `shared/Tag.tsx` with a `size`
prop (`"sm" | "md"`), and a `CompanyChip` that composes it with `CompanyAvatar`. Used by the title bar,
the row, and the catalog.

### 4.4 🟡 Save model + autosave — duplicated across pad and algo

[useJudge.ts](../../src/judge/useJudge.ts) and [usePadSave.ts](../../src/pad/usePadSave.ts) independently
implement the *same* save architecture:
- a `sourcesRef`/`sandpackRef` synced in a `useLayoutEffect` (React-19 ref rule), so `save()` stays
  identity-stable;
- a `savedSnapshot` state = "what's on disk";
- `isDirty` derived by comparing live buffers to the snapshot;
- a debounced `useAutosave`/`useJudgeAutosave` with a `lastSeen` ref to skip context switches.

The two differ only in *what a buffer is* (a `Record<language, string>` vs Sandpack's file map). This
is a strong candidate for a generic `useDirtyTracker<Buffers>` / `useAutosave` pair parameterized over
the buffer shape and an equality fn — squarely in the "smart reusable TS" wheelhouse the project leans
into. **Honest cost:** the two snapshot shapes and "what counts as a context switch" (language vs file)
differ enough that the generic needs a clear variant surface; worth raising the extraction shape before
committing, but the duplication is real (2 full copies).

**Asymmetry the unification must respect — the autosave *trigger* differs by side:**

- **Algo can be event-driven.** The shared [CodeEditor](../../src/components/CodeEditor.tsx) exposes
  `onChange`, and edits already flow `onChange → setSource` ([useJudge.ts:50](../../src/judge/useJudge.ts#L50)).
  So the debounce belongs *inside that handler*, not in a `useEffect` watching `sources[language]`. That
  also deletes the `lastSeen` ref ([useJudge.ts:147](../../src/judge/useJudge.ts#L147)) whose only job is
  to distinguish a content edit from a language switch — `onChange` fires only on edits, and language
  changes go through `setLanguage`. One small unmount effect remains, just to clear the pending timer.
- **The pad stays effect-driven, by design.** The pad uses Sandpack's `SandpackCodeEditor`; content is
  Sandpack's internal state, observed as `sandpack.files` ([usePadSave.ts:87](../../src/pad/usePadSave.ts#L87)),
  with **no content-change event** to hook (keydown is the wrong trigger — it fires on non-edits and
  misses paste/cut/IME/drop). Reacting to the observed `files` value in a `useEffect` is the *correct*
  pattern for an external store you don't own — the §3 "🟢 legit" verdict. See the decision below for
  why we keep it that way.

So the shared `useDirtyTracker` (snapshot + `isDirty`) cleanly covers both sides; algo's autosave
*trigger* moves into its `onChange` handler, while the pad's stays an external-store effect.

#### Decision — keep `SandpackCodeEditor` for the pad (unification considered, rejected) 🟢

[algo.md](../features/algo.md) floats unifying the pad onto the shared
[CodeEditor](../../src/components/CodeEditor.tsx) (via Sandpack's `useActiveCode()`) as a future step,
which would make the pad's autosave event-driven too. **Considered and rejected** — it's net-negative
for the pad. The accounting:

- **What it would buy:** retire *one* small, legitimate effect (`useAutosave`,
  [usePadSave.ts:95](../../src/pad/usePadSave.ts#L95)) and have one editor component instead of two.
  Marginal — and note `usePadPersistence` ([usePadPersistence.ts:17](../../src/pad/usePadPersistence.ts#L17))
  stays an effect *regardless* (it's a deliberate single sink for an unconditional localStorage write
  across many mutators — edit, add, delete, rename — not a workaround for a missing event; see §3).
- **What it would cost — re-implementing what Sandpack gives free:** (1) **inline bundler errors**
  (`showInlineErrors`, [PadEditor.tsx:89](../../src/pad/PadEditor.tsx#L89)) — `CodeEditor` has none;
  (2) **multi-language highlighting** — `CodeEditor` loads only `javascript()`
  ([CodeEditor.tsx:36](../../src/components/CodeEditor.tsx#L36)) and types `language` as
  `SupportedLanguage`, but the pad edits `.css`/`.html`/`.json`; this needs a `languageForPath` resolver
  + 3 CodeMirror lang deps; (3) **per-file undo/cursor** — one reused editor bound to
  `useActiveCode().code` resets the doc on file switch.

**Why this isn't accidental debt — it's correct specialization.** `SandpackCodeEditor` is CodeMirror
*wired into Sandpack's bundler / active-file / HMR model*, and that integration is the pad's whole
value. `CodeEditor` is right for algo *because* there's no bundler there — one function, one buffer,
ship to the server. Two editors because there are genuinely two jobs; collapsing them forces the simple
one to grow a project-editor's entire surface. (Per CLAUDE.local.md's learning lens: the floor on
acceptable complexity is raised, but this design would be *worse*, so the lens doesn't apply.)
**Recommendation: drop the "unify onto `CodeEditor`" idea; remove it from algo.md's future-steps note
too.**

**What still survives from §4.4, independent of the editor choice:**
- **Algo autosave → event-driven.** Algo *already* uses `CodeEditor` with `onChange`, so its debounce
  can move into the handler (deleting the `lastSeen` ref) with **no editor swap**. Keep this.
- **Shared `useDirtyTracker`.** The `savedSnapshot` + derived `isDirty` + ref-sync save model is real
  duplication worth a generic, whichever editor renders each side.

### 4.5 🟡 Args → `ValueBlock` rendering — 2 copies → `<ArgsList>`

[TestcaseTab.tsx:18-23](../../src/judge/TestcaseTab.tsx#L18) and
[TestResult.tsx:42-46](../../src/judge/TestResult.tsx#L42) both do
`deriveParamNames(...)` → `args.map(arg => <ValueBlock label={`${name} =`}>{stringify(arg)}</ValueBlock>)`.
Identical. Extract `<ArgsList args paramNames>` (or `<ArgsList problem args>` that derives names
internally).

### 4.6 🟢 Badge components — `DifficultyBadge` & `KindBadge` near-identical

[DifficultyBadge.tsx](../../src/judge/DifficultyBadge.tsx) and [KindBadge.tsx](../../src/judge/KindBadge.tsx)
are the same shape: a `tint: Record<K, string>` map + a `cn("inline-flex h-5 … rounded-full px-2
text-xs font-medium", tint[x])` pill. Two instances — at the "raise it" threshold, not yet "must
extract." Option: a generic `<Badge tint={...} label={...} />` base both wrap. Low priority; flag and
let it ride until a third badge appears (likely a build-tag badge per the company-sourcing "still
open" note).

### 4.7 🟡 `useSyncExternalStore` snapshot pattern — 2 copies

[useProgress.ts](../../src/judge/useProgress.ts) and [useRecentPads.ts](../../src/pad/useRecentPads.ts)
both implement the *exact* same "subscribe + content-hashed `getSnapshot` cache + stable `EMPTY`
server snapshot" pattern, down to the identical comment. Extract a generic
`useCachedExternalStore<T>(subscribe, read, hashOf, empty)`. This is *also* the layer that becomes
server-cache invalidation under a DB (§5.4/§5.7), so unifying it now narrows the migration surface.

### 4.8 🟡 The two settings menus have diverged

[SolutionSettingsMenu](../../src/judge/SolutionSettingsMenu.tsx) is **registry-driven** (renders one
row per `JUDGE_SETTINGS` entry), but [PadSettingsMenu.tsx](../../src/pad/PadSettingsMenu.tsx)
**hand-rolls a single hardcoded Autosave row**. They're the same menu for two surfaces, but only one
picks up new settings automatically. Either point the pad at the registry-driven menu (it's already the
"single source" design CLAUDE.md praises) or share one `<SettingsMenu defs=… values=… onChange=… />`.
Note they even describe Autosave differently ("Persist your solution" vs "Apply edits to the preview"),
which is correct — so the shared component needs per-surface copy, not one string.

### 4.9 🟢 Smaller repeats

- **Reset-in-`ConfirmDialog`** action recurs (algo top bar [JudgeWorkspace.tsx:80](../../src/judge/JudgeWorkspace.tsx#L80), build [BuildToolbar](../../src/judge/BuildToolbar.tsx), pad) — a `<ResetAction onConfirm>` would carry the dialog copy once.
- **`LANGUAGE_LABELS`** (`typescript`→"TypeScript" …) declared in [SolutionsTab.tsx:4](../../src/judge/SolutionsTab.tsx#L4) and implied elsewhere — move next to `SupportedLanguage` in `problem.ts`.
- **Underline tab-bar** — beyond the trio in §4.2, [PadConsolePanel](../../src/pad/PadConsolePanel.tsx) has its own Server/Client tab row (visually distinct, but the same "tabs + label map + active state" shape); fold it in if the `UnderlineTabs` generic is built flexibly.
- **`Centered` empty-state** ([TestResult.tsx:9](../../src/judge/TestResult.tsx#L9)) vs ad-hoc empties in [CatalogTable.tsx:9](../../src/judge/CatalogTable.tsx#L9) and [SolutionsTab.tsx:50](../../src/judge/SolutionsTab.tsx#L50) — a shared `<EmptyState>` if a fourth appears.
- **`stringify` / `titleizeSlug`** ([format.ts](../../src/judge/format.ts)) already shared — good.
- **`DEBOUNCE_MS = 600`** redeclared in three files — fold into the unified autosave hook (§4.4).

---

## 5. Data structures & the DB migration 🔴

This is where the current design and a DB diverge most. Catalogued by what has to change.

### 5.1 🔴 Catalog `#NN` = registry insertion order — will break

[problems/index.ts:53](../../src/judge/problems/index.ts#L53):

```ts
export const problemNumber = (id) => Object.keys(problems).indexOf(id) + 1;
```

The user-visible problem number, the `#` column, and the "newest/oldest" sort axis are all *derived
from object key order*. In a DB there is **no insertion order** guarantee on a query, and reordering or
back-filling a problem renumbers everything after it. This number is referenced by
[ProblemTitleBar](../../src/judge/ProblemTitleBar.tsx), [ProblemRow](../../src/judge/ProblemRow.tsx),
[catalogSort](../../src/judge/catalogSort.ts), and the page. **Action:** promote `number` (or a stable
`createdAt`/`sortOrder`) to a real stored field *now*, even before the DB, so the migration is a
column copy rather than a semantics change. Bonus: it's also an O(n) `indexOf` called once per row in
`listProblemSummaries` → O(n²) over the catalog (negligible at 17 problems, real at 1000).

### 5.2 🔴 "Code as data" + compile-time test typing — the central tradeoff

The crown jewel of the current model is that `defineProblem<Args, Result>` **type-checks every test
case's `args`/`expected` against the solution signature at compile time**
([problem.ts:170](../../src/judge/problem.ts#L170), see
[algo.md → Problem model](../features/algo.md#problem-model--the-typed-core)). A problem also carries
*executable* payloads: `starterCode`, `solutions[].code`, the `checker` arrow-source string, and build
`files`.

When problems become DB **rows**, they're runtime data — the generic type-checking evaporates. This is
the single biggest thing to decide before migrating. Three options:

| Option | What it means | Trade |
| --- | --- | --- |
| **A. TS modules stay the source of truth; DB is a generated read-cache** | Keep authoring in `data/problems/*.ts` (keep `defineProblem` safety + `verifyProblems.mjs`); a seed script writes rows to Postgres; the app reads from the DB. | Keeps all compile-time safety and the verifier gate. DB is for *querying/filtering/scaling*, not authoring. Most faithful to the current design. **Recommended for v1.** |
| **B. DB is the source of truth; add runtime validation** | Author via an admin UI / JSON; validate `args`/`expected` against a stored signature at write-time (e.g. Zod) and re-run the reference solution server-side as the gate. | Enables user-authored problems and editing without a deploy, but you rebuild the safety net `defineProblem` gave you for free, in runtime code. |
| **C. Hybrid** | Static/seed problems via modules (A); user-or-agent-authored problems via DB (B), unified behind the `data/` read API. | Most flexible, most surface area. Likely the eventual state once the company-sourcer writes to a DB. |

The `data/` folder split (§1) exists precisely so this choice is swappable: the app depends on
`getProblem`/`listProblems`/`listProblemSummaries`, not on "an object literal." Keep those signatures
stable and the migration is contained.

### 5.3 🟡 `companyProblems` map = a join table with a compile-time FK

[companies.ts:18](../../src/judge/companies.ts#L18) keys associations by `ProblemId`, so naming a
problem the bank lacks is a **compile error** — that's a foreign-key constraint enforced by the type
system. In Postgres this is literally a `company_problems(company_id, problem_id)` join table with an
FK to `problems(id)`. Clean port; the only loss is compile-time integrity, regained as a DB constraint.
`problemsForCompany`/`companiesForProblem` are linear scans today (fine at this size), become indexed
queries.

### 5.4 🟡 Per-user state is user-less and split across 3 stores

[progress.ts](../../src/judge/progress.ts), [solution.ts](../../src/judge/solution.ts), and
[settings.ts](../../src/judge/settings.ts) all persist to `localStorage` with no user scope:

| Store | localStorage key | DB shape (post-auth) |
| --- | --- | --- |
| progress | `noodle:progress` (one blob) | `progress(user_id, problem_id, status, completed_at, solution_json)` |
| solution buffers | `noodle:solution:<id>` | `draft_solutions(user_id, problem_id, language, source)` |
| editor settings | `noodle:judge-settings` (global) | `user_settings(user_id, …)` |

Implications to plan for:
- **Auth is a prerequisite** for any of these moving server-side — they're inherently per-user. Until
  then they can stay local even if `problems` moves to the DB (a clean split: bank = server, my
  progress = client, then migrate progress when auth lands).
- The progress store's same-tab pub/sub (`subscribeProgress` + `useSyncExternalStore` in
  [useProgress.ts](../../src/judge/useProgress.ts)) is a client-cache pattern; against a DB it becomes
  query invalidation / optimistic updates. The `useSyncExternalStore` seam is a reasonable place to
  swap in a server cache later.
- `CompletedSolution` (the passing buffer) is captured into progress *and* the draft is in
  `solution.ts` — two places hold source. In the DB these are distinct (submission-of-record vs
  working draft); keep them distinct.

### 5.5 🟢 `hiddenTests` / `checker` server-only boundary — already DB-friendly

[toClientProblem](../../src/judge/problems/index.ts#L86) strips `hiddenTests` + `checker` before
anything reaches the client, enforced by a derived `Omit` (`ClientProblem`). In a DB world this is
natural: those columns simply aren't in the client-facing query/projection. The existing
`ProblemSummary` (`Pick`) and `ClientProblem` (`Omit`) projections map cleanly onto SQL column
selection — good groundwork already laid.

### 5.7 🔴 Synchronous reads → async DB — the deepest migration cost

This is the migration's highest-severity structural risk and deserves top billing. Today *every*
persisted read is **synchronous**, and several React patterns depend on that:

- **`useState` lazy initializers** read storage during render: `seed()` in
  [useJudge.ts:27](../../src/judge/useJudge.ts#L27) and `loadSettings` in
  [useJudgeSettings.ts:8](../../src/judge/useJudgeSettings.ts#L8). The docs specifically celebrate these
  as "a `useState` initializer, not a mount effect."
- **`useSyncExternalStore`** ([useProgress.ts](../../src/judge/useProgress.ts),
  [useRecentPads.ts](../../src/pad/useRecentPads.ts)) *requires* a synchronous `getSnapshot`.

A DB read is **async** — none of these can call it directly. The migration isn't a store swap; it's a
data-flow change:
- Move seed reads into the **server component** that already exists
  ([/problems/[id]/page.tsx](../../src/app/problems/[id]/page.tsx)) and pass results as props, or use a
  Suspense-aware data layer (React 19 `use()` / a query lib).
- Replace the `useSyncExternalStore` layer (§4.7) with Server Actions + revalidation (or optimistic
  client cache hydrated from the server).

Plan this before picking the ORM — it dictates whether per-user state is read on the server (props) or
the client (query lib). It's also why §5.4's "bank moves to DB, progress stays local until auth" split
is attractive: it defers this rewrite for the per-user stores.

### 5.8 🟡 Non-atomic read-modify-write + a hard reload

- [progress.ts](../../src/judge/progress.ts) `markInProgress`/`markComplete`/`toggleComplete` all do
  `read()` → mutate → `write()`. Harmless single-tab against `localStorage`, but a **lost-update race**
  against a DB — port these as atomic `UPSERT`s / `UPDATE … WHERE`, not read-then-write.
- [resetPad](../../src/pad/pad.ts#L85) calls `window.location.reload()` to rehydrate from the starter —
  acceptable for a local store, but a full reload is a poor fit once state is server-owned; replace
  with a state reset + revalidation.
- **No user identity exists anywhere.** Every per-user store (§5.4) is single-browser. Auth is a hard
  prerequisite for moving any of them server-side, and it's the natural owner of the row-level
  scoping — a point in favor of **Supabase** (RLS) in §5.9.

### 5.9 🟢 ORM recommendation

You're leaning Postgres — agreed, it's the right call (relational: problems ↔ companies ↔ tags ↔
per-user progress; JSON columns for `examples`/`hiddenTests`/`files` via `jsonb`).

On the ORM, given the project's stated love of *clever, type-safe TypeScript*: **recommend Drizzle over
Prisma.** Drizzle's schema *is* TypeScript, types are inferred (no codegen step / no generated client
to keep in sync), and query results flow types through the way the existing generics do — it matches
the codebase's posture (the facet registry, `typedEntries`, `defineProblem`). Prisma is more
batteries-included (migrations UI, broad docs) but adds a generate step and a less TS-native query
surface. If you'd rather not run your own Postgres at all, **Supabase** (managed Postgres + auth +
row-level security) is worth it specifically because §5.4 needs auth anyway — its RLS would enforce the
"my progress is mine" boundary at the database. Suggested default: **Drizzle + Postgres**, reach for
**Supabase** if you want auth + hosting bundled. Decide when Phase 4 starts.

---

## 6. Smaller findings 🟢

- **`useJudge` is a god-hook** ([useJudge.ts](../../src/judge/useJudge.ts), 14 returned values). Once
  the save model is extracted (§4.4), it shrinks naturally; consider splitting run/grade from
  edit/format/save.
- **`number` & `companies` resolved server-side and threaded as props** through 3 components
  ([page.tsx](../../src/app/problems/[id]/page.tsx) → workspaces → headers). Fine, but a
  `ProblemHeaderData` type would tidy the repeated `{ number, companies }` prop pair.
- **`runner` worker path** is resolved from `process.cwd()` and **`outputFileTracingIncludes` is still
  not configured** ([algo.md → security posture](../features/algo.md#security-posture-and-the-build-caveat));
  `next build`/`start` will not ship the worker. Pre-existing known gap — flag it stays open.
- **2s wall-clock budget is shared Run vs Submit** — the open follow-up in
  [problem-authoring.md](../features/problem-authoring.md) (split timeouts). Not new, noted for the DB
  era when hidden sets grow.
- **Doc-path debt:** the target moves in §1/§2 touch path references in all six `docs/features/*.md`
  files (they cite `src/judge/...` heavily). Budget the doc updates into the rename commit, per
  CLAUDE.md's "update the relevant feature doc" rule.

---

## 7. Suggested sequencing

Ordered to isolate the DB seam first and keep each step a reviewable, behavior-preserving diff:

1. **Stable problem number (§5.1)** — promote `number`/`sortOrder` to a stored field. Smallest change,
   removes the order-fragility before anything else moves. 🔴
2. **`createLocalStore` factory (§4.1)** — collapse the 4 storage modules onto one generic store. This
   *is* the persistence adapter the DB will replace. 🔴
3. **Naming rename (§2)** — `judge → algo` / `runner → tester`, `Problem → AlgoProblem`. Pure rename,
   no behavior change; do it before the folder move so files rename once. 🟡
4. **Folder reorg (§1)** — move into `src/problems/{data,algo,build,catalog,shared,progress}`. One
   mechanical commit + doc-path updates. 🟡
5. **UI dedup (§4.2, §4.3, §4.5)** — `UnderlineTabs`, `Tag`/`CompanyChip`, `ArgsList`. Independent,
   low-risk. 🟢
6. **State dedup (§4.4) + the §3 effect fix (#1)** — unified `useDirtyTracker`/`useAutosave`; fold the
   settings-persist effect into its handler. 🟡
7. **DB decision (§5.2) + sync→async rewrite (§5.7) + ORM pick (§5.9)** — decide source-of-truth (recommend Option A), pick
   Drizzle+Postgres, design the schema against the `data/` read API. Then auth → migrate per-user
   stores (§5.4). 🔴

Steps 1–2 pay off immediately and de-risk 7; 3–4 are the structural cleanup you asked for; 5–6 are the
"reusable solutions for duped code" pass; 7 is the DB itself.
