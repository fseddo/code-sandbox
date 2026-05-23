# Algo problems

The LeetCode side: pick a problem, write a solution in JS or TS, and run it server-side against the problem's test cases. All code lives under [`src/problems/`](../../src/problems/) (UI + data + tester) and [`src/app/problems/`](../../src/app/problems/) (the problem route); the API route is [`src/app/api/judge/route.ts`](../../src/app/api/judge/route.ts). The problem *list* lives in the catalog on the home page — see [navigation.md](navigation.md). The submission editor is the shared [`CodeEditor`](../../src/components/CodeEditor.tsx).

## Render tree

```
/problems/[id]             src/app/problems/[id]/page.tsx — server; getProblem + notFound, resolves number + companies
  └─ <AlgoWorkspace>      src/problems/algo/AlgoWorkspace.tsx — "use client"
      ├─ <ProblemDetailHeader>     src/problems/shared/ProblemDetailHeader.tsx — brand→Problems breadcrumb (quiet title), controls slot
      ├─ <ProblemTitleBar>         src/problems/shared/ProblemTitleBar.tsx — full-width identity banner (#NN, title, badges, tags, companies)
      └─ <Group horizontal>
          ├─ <ProblemPanel>            src/problems/algo/ProblemPanel.tsx → Description/Solutions tabs (no identity header); a CollapsiblePane (collapses left)
          └─ <Group vertical>
              ├─ <SolutionEditor>      src/problems/algo/SolutionEditor.tsx → <CodeEditor>
              └─ <ResultsPanel>        src/problems/algo/ResultsPanel.tsx
```

Both detail kinds share two header components: [`ProblemDetailHeader`](../../src/problems/shared/ProblemDetailHeader.tsx) (the slim top breadcrumb bar — brand → Problems → a deliberately low-emphasis title — plus a right-side controls slot) and [`ProblemTitleBar`](../../src/problems/shared/ProblemTitleBar.tsx) (the full-width identity banner between the top bar and the panels — `#NN`, prominent title, kind/difficulty badges, topic tags, right-aligned company bubbles). The prominent title lives in the banner; the breadcrumb's title is a quiet echo so they don't compete. The catalog `number` and `companies` are resolved server-side in the page and passed into each workspace; `number` comes from [`problemNumber(id)`](../../src/problems/data/problems/index.ts) (registry order), matching the catalog's `#` column.

Same [react-resizable-panels v4](../../src/components/ResizeBar.tsx) layout primitives as the pad (percentage-string sizes). `ResizeBar` is shared in [`src/components/ResizeBar.tsx`](../../src/components/ResizeBar.tsx) — extracted when the algo workspace became the second caller; [PadWorkspace](../../src/pad/PadWorkspace.tsx) consumes the same shared component.

## Why no PadLoader-style `ssr:false`

Unlike Sandpack, CodeMirror (`@uiw/react-codemirror`) is SSR-safe — it renders a placeholder on the server and mounts on the client in an effect. So `/problems/[id]` renders `<AlgoWorkspace>` (a client component) directly from the server page; no `next/dynamic` wrapper is needed. The page itself stays a server component so the `[id]` param resolves and `getProblem` runs server-side.

## Problem model — the typed core

[`problem.ts`](../../src/problems/data/problem.ts) is the single-source-of-types centerpiece. A problem is **generic over its solution signature** `(...args: Args) => Result`, and the test cases are typed off that signature:

```ts
type TestCase<Args extends unknown[], Result> = { name?: string; args: Args; expected: Result };
type Example<Args extends unknown[], Result> = TestCase<Args, Result> & { explanation?: string };
type AlgoProblem<Args extends unknown[] = unknown[], Result = unknown> = {
  …; tags: TopicTag[]; constraints: string[];
  examples: Example<Args, Result>[];   // visible: Run uses them, Description tab renders them
  hiddenTests: TestCase<Args, Result>[]; // server-only: Submit adds them, never reaches the client
  io?: ProblemIo; checker?: string;       // see below
};
```

[`defineAlgoProblem<Args, Result>(…)`](../../src/problems/data/problem.ts) pins the signature so authoring a problem type-checks each case's `args` tuple and `expected` against it — see [twoSum.ts](../../src/problems/data/problems/twoSum.ts) (`defineAlgoProblem<[number[], number], number[]>`). Get the signature wrong in a case and it's a compile error, not a runtime surprise. There is no separate `tests` field: the visible run set is built from `examples` in [runTests](../../src/problems/algo/tester/runTests.ts). `TopicTag` is a single-source literal union of the catalog's topic slugs; `source` carries provenance (`origin`, `frontendId`, `acRate`, authoring `confidence`).

**`AlgoProblem` is the `"algo"` arm of a discriminated union.** A `ProblemBase` (`id`, `title`, `difficulty`, `tags`, `prompt`, `source`) is shared; `AlgoProblem` adds `kind: "algo"` plus the algo-specific fields above, and `BuildProblem` adds `kind: "build"` with a pad-backed Sandpack sandbox (`template`, `files`, `evaluationNotes`) — open-ended, **not** worker-graded. `AnyProblem = AlgoProblem | BuildProblem`. `defineAlgoProblem` injects `kind: "algo"` (so the authored modules never spell it out); `defineBuildProblem` is the build-arm counterpart. The build kind powers the company-sourcing feature ([company-sourcing.md](company-sourcing.md)): a build problem renders at `/problems/[id]` as a pad-backed sandbox ([`BuildWorkspace`](../../src/problems/build/BuildWorkspace.tsx)), not the algo tester — this doc's editor/runner/results detail is the **algo arm**. Consumers narrow on `kind` (`getProblem` returns `AnyProblem`). Company↔problem associations live in [companies.ts](../../src/problems/data/companies.ts), deliberately *not* on the problem.

Two harness extensions widen what's expressible (full rationale in [problem-authoring.md](problem-authoring.md)):
- **`io: { params?, result? }`** marks params/results as a reference shape so the worker hydrates array test data before the call and flattens the return back — tests stay plain arrays. Shapes: `"linked-list"` (array → `ListNode` chain), `"binary-tree"` (LeetCode level-order array with `null` gaps → `TreeNode`), and the element-wise array variants `"linked-list[]"` / `"binary-tree[]"` (an array *of* arrays — merge-k-sorted-lists, "generate all BSTs"). `ListNode` and `TreeNode` are injected as globals. See [addTwoNumbers.ts](../../src/problems/data/problems/addTwoNumbers.ts) (list), [inorderTraversal.ts](../../src/problems/data/problems/inorderTraversal.ts) (tree), [mergeKLists.ts](../../src/problems/data/problems/mergeKLists.ts) (`linked-list[]`).
- **`checker`** (JS arrow-source `(actual, args, expected) => boolean`, server-only) replaces deep-equal for problems with multiple valid answers. `args` is passed **post-call** (after the function returns), so a checker can score an **in-place** mutation of the input or assert the result is the same instance (`actual === args[0]`). See [longestPalindrome.ts](../../src/problems/data/problems/longestPalindrome.ts) (multi-answer) and [sortColors.ts](../../src/problems/data/problems/sortColors.ts) (in-place).

[`problems/index.ts`](../../src/problems/data/problems/index.ts) is the registry: a `Record<id, AnyProblem>` built from **literal-string keys** with `satisfies`, so `ProblemId = keyof typeof problems` is a real union of the ids (not `string`) and the authored modules keep their precise generics while the registry erases them to `AnyProblem` (it holds heterogeneous signatures and both kinds). A drift-guard test asserts each key equals its module's `.id`. `getProblem(id)` / `listProblems()` are the read API (returning `AnyProblem`) — problem *info* needs no HTTP route; server components import the registry directly. The two algo-only boundaries — the [`/problems/[id]` page](../../src/app/problems/[id]/page.tsx) and the [`/api/judge` route](../../src/app/api/judge/route.ts) — narrow on `kind === "algo"` before touching algo-specific fields. Adding a problem = a new module under `problems/` + one line in `index.ts`; the full authoring rubric (and the `problem-importer` agent that runs it) live in [problem-authoring.md](problem-authoring.md). Two gates run every reference solution through the real worker: [`scripts/verifyProblems.mjs`](../../scripts/verifyProblems.mjs) (standalone, optional `[slug]` filter) and the `npm test` vitest suite ([problems.test.ts](../../src/problems/data/problems/problems.test.ts)); the io converters ([io.mjs](../../src/problems/algo/tester/io.mjs)) also have unit tests.

`SubmissionOutcome` (also in `problem.ts`) is the discriminated union the tester and UI share: `ok` | `compile-error` | `timeout` | `crashed`. It's the wire contract between [route.ts](../../src/app/api/judge/route.ts) and [ResultsPanel](../../src/problems/algo/ResultsPanel.tsx).

## Execution — worker thread + `node:vm`

Grading must run server-side (the user can't be trusted to grade their own code, and the bank shouldn't ship answers to the client). The chosen model is a **terminable worker thread running a `node:vm` context** — see [runTests.ts](../../src/problems/algo/tester/runTests.ts) and [problemTester.worker.mjs](../../src/problems/algo/tester/problemTester.worker.mjs).

Flow:

1. [`route.ts`](../../src/app/api/judge/route.ts) (`runtime = "nodejs"` — worker_threads can't run on Edge) validates `{ problemId, language, source }`, looks up the problem, and calls `runTests`.
2. [`runTests`](../../src/problems/algo/tester/runTests.ts) spawns the worker with `{ source, language, functionName, tests, io, checker }` as `workerData`, then **races the worker's message against a 2s `setTimeout`**. On overrun it calls `worker.terminate()` and resolves `{ status: "timeout" }`.
3. [`problemTester.worker.mjs`](../../src/problems/algo/tester/problemTester.worker.mjs) transpiles TS→JS with **sucrase** (type-strip only, no type-checking — what a test runner wants), builds a `vm` context whose injected globals are a `console` capturer plus `ListNode` and `TreeNode` classes, runs each test (hydrating `io` params, flattening an `io` result), compares via the `checker` when present (handed the post-call `args` so it can judge in-place mutations) else **deep-equals** `actual` vs `expected`, and posts back `{ status: "ok", results }`.

### Why a worker, and why terminate is the point

`vm`'s own `timeout` option only interrupts **synchronous code at the definition site**. The user's `while(true){}` lives *inside the called function*, invoked after the vm script returns — so the vm timeout never fires on it, and an `await new Promise(() => {})` hang wouldn't fire either. `worker.terminate()` forcibly destroys the thread regardless, catching sync and async hangs alike. The worker also has its own V8 isolate and event loop, so a heavy submission doesn't block the Next server's event loop, and a crash takes down the worker, not the server. This is verified end-to-end (correct/wrong/syntax-error/infinite-loop) — the loop case returns `timeout` at the mode's wall-clock limit (Run 2000 ms, Submit 8000 ms; `WALL_CLOCK_LIMIT_MS` in [`runTests`](../../src/problems/algo/tester/runTests.ts)).

### Function extraction handles both declaration forms

The worker wraps the user source in a function scope and returns the named export:

```js
vm.runInContext(`(function(){ ${code}\n; return typeof ${fn} === "function" ? ${fn} : undefined; })`, ctx)
```

Wrapping in one script means both `function twoSum(){}` (hoisted) and `const twoSum = () => {}` (lexical) resolve — a two-script approach would lose the `const` form, since lexical bindings don't persist across separate `runInContext` calls. Each test `structuredClone`s its args so one case's mutation can't leak into the next.

### Security posture and the build caveat

- **`vm` is not a hard security boundary** — `this.constructor.constructor("return process")()` can escape the context. For this **local, single-trusted-user** sandbox that's acceptable; the only submitter is the developer. Before any public/multi-tenant deploy, the boxed run step should move to `isolated-vm` (true isolation) and ultimately a container/microVM (the only real answer for untrusted multi-tenant code). The worker/`runTests` seam doesn't change when that happens.
- **The `checker` is a second eval surface.** When a problem defines a `checker`, the worker compiles it via `vm.runInContext(..., { timeout: 1000 })` in the same context as the submission. Unlike the submission it's **authored, trusted source** (it ships in the problem module, not from the user), so it doesn't widen the untrusted-input surface — but it is a second place code is eval'd, and it shares the submission's wall-clock budget (Run 2 s / Submit 8 s).
- **Worker path resolution:** [`runTests`](../../src/problems/algo/tester/runTests.ts) resolves the worker by absolute path from `process.cwd()`. This works under `next dev` (source files on disk). `next build` / `next start` will need `outputFileTracingIncludes` in `next.config` to copy `problemTester.worker.mjs` into the server output — **not yet configured**, since the dev workflow is the current target.

## Editor — shared `CodeEditor`

[`CodeEditor.tsx`](../../src/components/CodeEditor.tsx) is a standalone CodeMirror 6 wrapper (`@uiw/react-codemirror` + `@codemirror/lang-javascript`) with `value` / `onChange` / `language` / `isReadOnly` props. It's deliberately **not** tied to Sandpack — the algo editor has no bundler, just one function to edit and ship to the server. It uses `@uiw`'s built-in `dark` theme for token colors plus a thin `EditorView.theme` extension for sizing/font (Geist Mono). A `Prec.highest` `keymap` binds **Tab → `acceptCompletion`** (CodeMirror's default only accepts on Enter); `acceptCompletion` returns `false` when no completion popup is open, so Tab falls through to its normal behavior.

The pad keeps `SandpackCodeEditor` — CodeMirror pre-wired into Sandpack's bundler / active-file / HMR model, which is the pad's whole value. Unifying the pad onto this `CodeEditor` (via Sandpack's `useActiveCode()`) was **considered and rejected**: it would buy one fewer editor component but force `CodeEditor` to re-implement what Sandpack gives free — inline bundler errors, multi-language (`.css`/`.html`/`.json`) highlighting, and per-file undo/cursor. Two editors because there are genuinely two jobs — a bundler-wired project editor (pad) and a single-buffer function editor (algo). That's correct specialization, not accidental debt.

## State

[`useAlgo(problem)`](../../src/problems/algo/useAlgo.ts) is a thin **composition root** over three concern hooks, returning one flat shape to [`AlgoWorkspace`](../../src/problems/algo/AlgoWorkspace.tsx):

- [`useAlgoEditor`](../../src/problems/algo/useAlgoEditor.ts) — the editing surface: `language`, **one source buffer per language** (`Record<SupportedLanguage, string>` seeded from `starterCode`, so switching language swaps buffers without losing work and without a `useEffect`), the save model (below), and `format()`. The visible `source` is derived (`sources[language]`) at render — no synced state. `format()` Prettier-formats the current buffer in place; Prettier (`prettier/standalone` + babel/typescript/estree plugins) is **lazy-imported inside `format()`** so it stays out of the main bundle, and a parse error surfaces as a `sonner` toast. `isFormatting` disables the button mid-run.
- [`useAlgoSubmission`](../../src/problems/algo/useAlgoSubmission.ts) — the grading lifecycle: `run()` POSTs to `/api/judge` and stores the `SubmissionOutcome`; `runningMode` is which mode is in flight; `submittedSolution` is the answer-of-record, seeded from the progress store (`getEntry(id)?.solution`) and refreshed whenever a Submit passes (it also enables the "Last submission" button — build problems store no solution, so this is algo-only).
- [`useAlgoSettings`](../../src/problems/progress/useAlgoSettings.ts) — the editor `settings`.

The root owns only the **cross-concern** actions: `run()` reads the current buffer off the editor and hands it to submission; `resetSolution()` restores the current language's buffer to `starterCode[language]` *and* clears the outcome; `restoreSubmission()` reads `submittedSolution` and writes it back into the editor buffer. Keeping these in the root — rather than inside a leaf — is what lets the editor and submission hooks stay independent; putting `reset` in the editor or `restore` in submission would couple the two leaves bidirectionally.

## Persistence — the save model

[`solution.ts`](../../src/problems/progress/solution.ts) is the localStorage layer, parallel to the pad's [`pad.ts`](../../src/pad/pad.ts): solutions are keyed `noodle:solution:<problemId>` and stored as `{ sources, updatedAt }`. Pure functions, client-only (no-op when `window` is undefined). `loadSolution(id)` returns the saved per-language buffers (a `Partial<Record<SupportedLanguage, string>>`); `saveSolution(id, sources)` writes them.

Saving is **manual**, mirroring the pad's [`usePadSave`](../../src/pad/usePadSave.ts) — but where the pad's save applies edits to the live Sandpack preview, the algo side's save persists to localStorage. There's no "apply to preview" concept here because **Run** is the apply step. The mechanics:

- **`save()`** writes the whole `sources` record via `saveSolution` and updates the saved snapshot. It reads the live buffers off a ref kept current by [`useLatestRef`](../../src/components/useLatestRef.ts) (a `useLayoutEffect` ref-sync, per React 19's no-ref-writes-during-render rule) so its identity stays stable across keystrokes.
- **Dirty tracking** is the shared [`useDirtyTracker`](../../src/components/useDirtyTracker.ts): it holds the `savedSnapshot` ("what's on disk") and derives **`isDirty`** by shallow-comparing the live buffers against it. The toolbar's Saved/Unsaved dot reads it — the pad uses the same hook over its file map.
- **`⌘S` / `Ctrl+S`** → the shared [`useSaveShortcut`](../../src/components/useSaveShortcut.ts) (same hook the pad uses; lifted out of `pad/` when the algo editor became the second caller).
- **Autosave is event-driven**, not a `useEffect` watching the buffer: every buffer write funnels through the editor's `setBuffer`, which — when the `autosave` setting is on — schedules a debounced `save` via the shared [`useDebouncedCallback`](../../src/components/useDebouncedCallback.ts) (`AUTOSAVE_DEBOUNCE_MS`). Because edits flow through one handler, there's nothing to distinguish from a language switch (the job the old `lastSeen` ref did before it was deleted). The Save button is `disabled` while autosave is on, so the model stays unambiguous. The pad's autosave stays *effect*-driven by contrast — it observes Sandpack's `files` with no change event to hook; see [pad.md](pad.md).

## Editor settings

[`settings.ts`](../../src/problems/progress/settings.ts) is a **single-source registry**: `ALGO_SETTINGS` maps each toggle key to its `{ label, description, default }`. Everything else is derived from it — the `AlgoSettingKey` union (`keyof typeof ALGO_SETTINGS`), the `AlgoSettings` value type (`Record<AlgoSettingKey, boolean>`), the defaults, and the menu rows. Adding a setting = one entry here; the state, persistence, and dropdown all pick it up with no other edits.

- [`useAlgoSettings`](../../src/problems/progress/useAlgoSettings.ts) holds the settings state (lazy-init from localStorage via `loadSettings`, merged over defaults so a newly-added key gets its default) and writes back on change. Persisted **globally** under `noodle:judge-settings`, not per-problem — these are editor preferences. Lazy-init is hydration-safe for the same reason the buffers are: no setting reaches the SSR DOM (the menu is portalled and closed by default; autocomplete only affects the client-mounted CodeMirror).
- [`SolutionSettingsMenu`](../../src/problems/algo/SolutionSettingsMenu.tsx) renders a gear-icon [dropdown](../../src/components/ui/dropdown-menu.tsx) (shadcn Base UI `Menu`) with one `CheckboxItem` per registry entry. Base UI checkbox items default `closeOnClick: false`, so toggling one doesn't dismiss the menu. It's mounted in the **detail header** (`AlgoWorkspace` passes it as `ProblemDetailHeader`'s controls slot), not the editor toolbar — `AlgoWorkspace` still owns `settings`/`setSetting` and threads `settings.autocomplete` to the editor as `isAutocompleteEnabled`.
- **`autocomplete`** flows to the shared [`CodeEditor`](../../src/components/CodeEditor.tsx) via its `isAutocompleteEnabled` prop (default `true`), which sets CodeMirror's `basicSetup.autocompletion`. **`autosave`** gates the event-driven debounce in `useAlgoEditor` as above.

### Restore: a `useState` initializer, not a mount effect

Buffers seed from `{ ...starterCode, ...(loadSolution(id) ?? {}) }` in a `useState` lazy initializer (both `sources` and `savedSnapshot`). The merge means a never-edited language keeps its starter and a problem that later adds a language doesn't break. Reading localStorage in the initializer is safe even though `/problems/[id]` **server-renders** (`AlgoWorkspace` is a client component but not `ssr:false`, see [Why no PadLoader-style `ssr:false`](#why-no-padloader-style-ssrfalse)): CodeMirror renders a placeholder on the server with no buffer text in the SSR HTML, so a client initializer reading saved code can't produce a hydration mismatch. This sidesteps the "set state in a mount effect" cascade the lint rule flags.

**The placeholder argument covers the editor *text* only — not localStorage-derived *attributes* that reach the SSR'd DOM.** `submittedSolution` (seeded from `getEntry(id)?.solution`) gates the **Last submission** button's `disabled`, and `settings.autosave` gates the `SaveStatus` label — both differ between SSR (defaults) and the client's first render, which *does* mismatch. `AlgoWorkspace` resolves these through [`useIsHydrated`](../../src/components/useIsHydrated.ts) (`false` until after hydration, via `useSyncExternalStore`'s server snapshot — same posture as [`useProgress`](../../src/problems/progress/useProgress.ts)), so the first client render matches the server and the values flip in only after mount. Rule of thumb: a localStorage-seeded value is initializer-safe **only** if it never reaches the server-rendered markup; if it drives an attribute or text node, gate it.

## UI notes

- [`DifficultyBadge`](../../src/problems/shared/DifficultyBadge.tsx) maps `easy`/`medium`/`hard` to the Midnight `--ok` / `--warn` / `--danger` tints (see [pad.md palette](pad.md#palette)).
- [`ProblemPanel`](../../src/problems/algo/ProblemPanel.tsx) renders the prompt with a minimal inline-code pass (splits on backticks → `<code>`) and splits paragraphs on blank lines. Full markdown (`react-markdown`) is a deliberate non-dependency for now. It's a [`CollapsiblePane`](pad.md#collapsible-panes) (`expandToward="right"`, the shared primitive from the pad) so the description column collapses horizontally to a thin strip — `AlgoWorkspace` owns its layout props, the way `PadWorkspace` drives the file tree. Its header is just the Description/Solutions tab pair (identity moved up to `ProblemTitleBar`); [`BuildProblemPanel`](../../src/problems/build/BuildProblemPanel.tsx) mirrors it with a static "Description" label styled like the algo active tab, so both left panes read the same. The results pane is deliberately **not** collapsible.
- [`SolutionEditor`](../../src/problems/algo/SolutionEditor.tsx) renders the shared [`EditorToolbar`](../../src/components/EditorToolbar.tsx): a JS/TS segmented toggle in the `leading` (context) slot; on the right, the shared [`SaveStatus`](../../src/components/SaveStatus.tsx) dot, then **Last submission** (`disabled` until there's a passing submission — wrapped in a [`ConfirmDialog`](../../src/components/ConfirmDialog.tsx) since it overwrites the buffer), **Format** (Prettier), and **Save** (`disabled` while autosave is on or the buffer is clean). Run/Submit/Reset live in the top bar — see the design-language note below.
- [`ProblemDetailHeader`](../../src/problems/shared/ProblemDetailHeader.tsx) and [`ProblemTitleBar`](../../src/problems/shared/ProblemTitleBar.tsx) are shared with the build workspace; [`AlgoWorkspace`](../../src/problems/algo/AlgoWorkspace.tsx) fills `ProblemDetailHeader`'s controls slot with Run / Submit / Reset / settings gear, and [`BuildToolbar`](../../src/problems/build/BuildToolbar.tsx) fills it with Mark-as-done / Reset / settings gear (build's Save + autosave toggle stay in the editor pane, shared with the standalone scratchpad). The build side threads `ProblemTitleBar` through `CoderPad` → `PadWorkspace`'s `headerBar` seam so it lands in the same place as algo's (between the top bar and the panels).
- **Inherited-CSS leak on the build side.** Build's top bar + title bar render *inside* `SandpackProvider`, which sets its own base `font-family` / `font-size` / `line-height` / `letter-spacing` on its subtree. Any text without those pinned inherits Sandpack's values on build but the app's on algo — visible as a differently-sized brand/slash, or a company chip whose label renders a couple px wider/narrower (different font ⇒ different glyph widths) so the bubble doesn't match its algo twin. [`DetailHeader`](../../src/components/DetailHeader.tsx) pins `font-sans text-sm leading-none` and [`ProblemTitleBar`](../../src/problems/shared/ProblemTitleBar.tsx) pins `font-sans tracking-normal` so the two render identically. **Pin `font-sans` + the size/leading/tracking explicitly on anything shared into the Sandpack subtree.** The company chip ([`CompanyAvatar`](../../src/problems/shared/CompanyAvatar.tsx) + label) is the same `bg-muted` bubble as a topic tag, with the avatar shrunk via its `className` override to match the chip height.

### Unified design language (algo + build)

Both problem types share one button-emphasis hierarchy so the same kind of action looks the same on either screen:

- **Solid green (`success`)** — the single primary "commit your answer" action per screen, with the `LuSend` icon: algo **Submit**, build **Mark as done**.
- **Outline (`outline` / `success-outline`)** — every other real action: Run, Format, Reset, Last submission, Restart server, and the scratchpad's Copy link / New pad. **Save** uses the green-tinted `success-outline` so it reads as save-family without competing with the solid primary.
- **Ghost (`ghost`)** — reserved for icon-only menu/affordance triggers only: the settings gear and the console collapse chevron.

The editor pane (algo and build) is one [`EditorToolbar`](../../src/components/EditorToolbar.tsx) row: a `leading` context slot (the JS/TS toggle for algo, the file-path breadcrumb for build) and a trailing action cluster (`SaveStatus` → editor-specific actions → Format → Save). Icons are `size-3.5` and dividers use `border-sidebar-border` throughout.
- [`ResultsPanel`](../../src/problems/algo/ResultsPanel.tsx) switches on the `SubmissionOutcome` union: a pass/fail count + per-case rows (expected/got/error/logs/ms) for `ok`, or a tinted banner for `compile-error` / `timeout` / `crashed`.
