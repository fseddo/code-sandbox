# Judge

The LeetCode side: pick a problem, write a solution in JS or TS, and run it server-side against the problem's test cases. All code lives under [`src/judge/`](../../src/judge/) (UI + data + runner) and [`src/app/problems/`](../../src/app/problems/) (the problem route); the API route is [`src/app/api/judge/route.ts`](../../src/app/api/judge/route.ts). The problem *list* lives in the catalog on the home page — see [navigation.md](navigation.md). The submission editor is the shared [`CodeEditor`](../../src/components/CodeEditor.tsx).

## Render tree

```
/problems/[id]             src/app/problems/[id]/page.tsx — server; getProblem + notFound, resolves number + companies
  └─ <JudgeWorkspace>      src/judge/JudgeWorkspace.tsx — "use client"
      ├─ <ProblemDetailHeader>     src/judge/ProblemDetailHeader.tsx — brand→Problems breadcrumb (quiet title), controls slot
      ├─ <ProblemTitleBar>         src/judge/ProblemTitleBar.tsx — full-width identity banner (#NN, title, badges, tags, companies)
      └─ <Group horizontal>
          ├─ <ProblemPanel>            src/judge/ProblemPanel.tsx → Description/Solutions tabs (no identity header)
          └─ <Group vertical>
              ├─ <SolutionEditor>      src/judge/SolutionEditor.tsx → <CodeEditor>
              └─ <ResultsPanel>        src/judge/ResultsPanel.tsx
```

Both detail kinds share two header components: [`ProblemDetailHeader`](../../src/judge/ProblemDetailHeader.tsx) (the slim top breadcrumb bar — brand → Problems → a deliberately low-emphasis title — plus a right-side controls slot) and [`ProblemTitleBar`](../../src/judge/ProblemTitleBar.tsx) (the full-width identity banner between the top bar and the panels — `#NN`, prominent title, kind/difficulty badges, topic tags, right-aligned company bubbles). The prominent title lives in the banner; the breadcrumb's title is a quiet echo so they don't compete. The catalog `number` and `companies` are resolved server-side in the page and passed into each workspace; `number` comes from [`problemNumber(id)`](../../src/judge/problems/index.ts) (registry order), matching the catalog's `#` column.

Same [react-resizable-panels v4](../../src/components/ResizeBar.tsx) layout primitives as the pad (percentage-string sizes). `ResizeBar` is shared in [`src/components/ResizeBar.tsx`](../../src/components/ResizeBar.tsx) — extracted when the judge became the second caller; [PadWorkspace](../../src/pad/PadWorkspace.tsx) consumes the same shared component.

## Why no PadLoader-style `ssr:false`

Unlike Sandpack, CodeMirror (`@uiw/react-codemirror`) is SSR-safe — it renders a placeholder on the server and mounts on the client in an effect. So `/problems/[id]` renders `<JudgeWorkspace>` (a client component) directly from the server page; no `next/dynamic` wrapper is needed. The page itself stays a server component so the `[id]` param resolves and `getProblem` runs server-side.

## Problem model — the typed core

[`problem.ts`](../../src/judge/problem.ts) is the single-source-of-types centerpiece. A problem is **generic over its solution signature** `(...args: Args) => Result`, and the test cases are typed off that signature:

```ts
type TestCase<Args extends unknown[], Result> = { name?: string; args: Args; expected: Result };
type Example<Args extends unknown[], Result> = TestCase<Args, Result> & { explanation?: string };
type Problem<Args extends unknown[] = unknown[], Result = unknown> = {
  …; tags: TopicTag[]; constraints: string[];
  examples: Example<Args, Result>[];   // visible: Run uses them, Description tab renders them
  hiddenTests: TestCase<Args, Result>[]; // server-only: Submit adds them, never reaches the client
  io?: ProblemIo; checker?: string;       // see below
};
```

[`defineProblem<Args, Result>(…)`](../../src/judge/problem.ts) pins the signature so authoring a problem type-checks each case's `args` tuple and `expected` against it — see [twoSum.ts](../../src/judge/problems/twoSum.ts) (`defineProblem<[number[], number], number[]>`). Get the signature wrong in a case and it's a compile error, not a runtime surprise. There is no separate `tests` field: the visible run set is built from `examples` in [runSubmission](../../src/judge/runner/runSubmission.ts). `TopicTag` is a single-source literal union of the catalog's topic slugs; `source` carries provenance (`origin`, `frontendId`, `acRate`, authoring `confidence`).

**`Problem` is the `"algo"` arm of a discriminated union.** A `ProblemBase` (`id`, `title`, `difficulty`, `tags`, `prompt`, `source`) is shared; `Problem` adds `kind: "algo"` plus the judge-specific fields above, and `BuildProblem` adds `kind: "build"` with a pad-backed Sandpack sandbox (`template`, `files`, `evaluationNotes`) — open-ended, **not** worker-graded. `AnyProblem = Problem | BuildProblem`. `defineProblem` injects `kind: "algo"` (so the authored modules never spell it out); `defineBuildProblem` is the build-arm counterpart. The build kind powers the company-sourcing feature ([company-sourcing.md](company-sourcing.md)): a build problem renders at `/problems/[id]` as a pad-backed sandbox ([`BuildWorkspace`](../../src/judge/BuildWorkspace.tsx)), not the judge — this doc's editor/runner/results detail is the **algo arm**. Consumers narrow on `kind` (`getProblem` returns `AnyProblem`). Company↔problem associations live in [companies.ts](../../src/judge/companies.ts), deliberately *not* on the problem.

Two harness extensions widen what's expressible (full rationale in [problem-authoring.md](problem-authoring.md)):
- **`io: { params?, result? }`** marks params/results as `"linked-list"` so the worker hydrates array test data into a `ListNode` chain before the call and flattens the return back — tests stay plain arrays. See [addTwoNumbers.ts](../../src/judge/problems/addTwoNumbers.ts).
- **`checker`** (JS arrow-source `(actual, args, expected) => boolean`, server-only) replaces deep-equal for problems with multiple valid answers. See [longestPalindrome.ts](../../src/judge/problems/longestPalindrome.ts).

[`problems/index.ts`](../../src/judge/problems/index.ts) is the registry: a `Record<id, AnyProblem>` built with `satisfies` so the authored modules keep their precise generics while the registry erases them to `AnyProblem` (it holds heterogeneous signatures and both kinds). `getProblem(id)` / `listProblems()` are the read API (returning `AnyProblem`) — problem *info* needs no HTTP route; server components import the registry directly. The two algo-only boundaries — the [`/problems/[id]` page](../../src/app/problems/[id]/page.tsx) and the [`/api/judge` route](../../src/app/api/judge/route.ts) — narrow on `kind === "algo"` before touching judge-specific fields. Adding a problem = a new module under `problems/` + one line in `index.ts`; the full authoring rubric (and the `problem-importer` agent that runs it) live in [problem-authoring.md](problem-authoring.md). [`scripts/verifyProblems.mjs`](../../scripts/verifyProblems.mjs) runs every reference solution through the real worker as a correctness gate.

`SubmissionOutcome` (also in `problem.ts`) is the discriminated union the runner and UI share: `ok` | `compile-error` | `timeout` | `crashed`. It's the wire contract between [route.ts](../../src/app/api/judge/route.ts) and [ResultsPanel](../../src/judge/ResultsPanel.tsx).

## Execution — worker thread + `node:vm`

The judge must run server-side (the user can't be trusted to grade their own code, and the bank shouldn't ship answers to the client). The chosen model is a **terminable worker thread running a `node:vm` context** — see [runSubmission.ts](../../src/judge/runner/runSubmission.ts) and [judge.worker.mjs](../../src/judge/runner/judge.worker.mjs).

Flow:

1. [`route.ts`](../../src/app/api/judge/route.ts) (`runtime = "nodejs"` — worker_threads can't run on Edge) validates `{ problemId, language, source }`, looks up the problem, and calls `runSubmission`.
2. [`runSubmission`](../../src/judge/runner/runSubmission.ts) spawns the worker with `{ source, language, functionName, tests, io, checker }` as `workerData`, then **races the worker's message against a 2s `setTimeout`**. On overrun it calls `worker.terminate()` and resolves `{ status: "timeout" }`.
3. [`judge.worker.mjs`](../../src/judge/runner/judge.worker.mjs) transpiles TS→JS with **sucrase** (type-strip only, no type-checking — what a judge wants), builds a `vm` context whose injected globals are a `console` capturer and a `ListNode` class, runs each test (hydrating `io` params, flattening an `io` result), compares via the `checker` when present else **deep-equals** `actual` vs `expected`, and posts back `{ status: "ok", results }`.

### Why a worker, and why terminate is the point

`vm`'s own `timeout` option only interrupts **synchronous code at the definition site**. The user's `while(true){}` lives *inside the called function*, invoked after the vm script returns — so the vm timeout never fires on it, and an `await new Promise(() => {})` hang wouldn't fire either. `worker.terminate()` forcibly destroys the thread regardless, catching sync and async hangs alike. The worker also has its own V8 isolate and event loop, so a heavy submission doesn't block the Next server's event loop, and a crash takes down the worker, not the server. This is verified end-to-end (correct/wrong/syntax-error/infinite-loop) — the loop case returns `timeout` at 2000ms.

### Function extraction handles both declaration forms

The worker wraps the user source in a function scope and returns the named export:

```js
vm.runInContext(`(function(){ ${code}\n; return typeof ${fn} === "function" ? ${fn} : undefined; })`, ctx)
```

Wrapping in one script means both `function twoSum(){}` (hoisted) and `const twoSum = () => {}` (lexical) resolve — a two-script approach would lose the `const` form, since lexical bindings don't persist across separate `runInContext` calls. Each test `structuredClone`s its args so one case's mutation can't leak into the next.

### Security posture and the build caveat

- **`vm` is not a hard security boundary** — `this.constructor.constructor("return process")()` can escape the context. For this **local, single-trusted-user** sandbox that's acceptable; the only submitter is the developer. Before any public/multi-tenant deploy, the boxed run step should move to `isolated-vm` (true isolation) and ultimately a container/microVM (the only real answer for untrusted multi-tenant code). The worker/`runSubmission` seam doesn't change when that happens.
- **The `checker` is a second eval surface.** When a problem defines a `checker`, the worker compiles it via `vm.runInContext(..., { timeout: 1000 })` in the same context as the submission. Unlike the submission it's **authored, trusted source** (it ships in the problem module, not from the user), so it doesn't widen the untrusted-input surface — but it is a second place code is eval'd, and it shares the run's 2s wall-clock budget.
- **Worker path resolution:** [`runSubmission`](../../src/judge/runner/runSubmission.ts) resolves the worker by absolute path from `process.cwd()`. This works under `next dev` (source files on disk). `next build` / `next start` will need `outputFileTracingIncludes` in `next.config` to copy `judge.worker.mjs` into the server output — **not yet configured**, since the dev workflow is the current target.

## Editor — shared `CodeEditor`

[`CodeEditor.tsx`](../../src/components/CodeEditor.tsx) is a standalone CodeMirror 6 wrapper (`@uiw/react-codemirror` + `@codemirror/lang-javascript`) with `value` / `onChange` / `language` / `isReadOnly` props. It's deliberately **not** tied to Sandpack — the judge has no bundler, just one function to edit and ship to the server. It uses `@uiw`'s built-in `dark` theme for token colors plus a thin `EditorView.theme` extension for sizing/font (Geist Mono). A `Prec.highest` `keymap` binds **Tab → `acceptCompletion`** (CodeMirror's default only accepts on Enter); `acceptCompletion` returns `false` when no completion popup is open, so Tab falls through to its normal behavior.

The pad keeps `SandpackCodeEditor` (which is CodeMirror pre-wired into Sandpack's active-file/HMR model — that integration is its value). Unifying the pad onto this `CodeEditor` via Sandpack's `useActiveCode()` hook is a deliberate future step, not done here.

## State

[`useJudge(problem)`](../../src/judge/useJudge.ts) owns everything: `language`, **one source buffer per language** (`Record<SupportedLanguage, string>` seeded from `starterCode`, so switching language swaps buffers without losing work and without a `useEffect`), the editor `settings` (via [`useJudgeSettings`](../../src/judge/useJudgeSettings.ts)), the latest `outcome`, and `runningMode`. `run()` POSTs to `/api/judge` and stores the `SubmissionOutcome`. The visible `source` is derived (`sources[language]`) at render — no synced state. `resetSolution()` restores the current language's buffer to `starterCode[language]`.

Three editor actions live here too:
- **`restoreSubmission()`** loads the last passing submission back into its language's buffer. `submittedSolution` is seeded from the progress store (`getEntry(id)?.solution`) and refreshed whenever a Submit passes — it doubles as the enable flag for the "Last submission" button. (Build problems store no solution, so this is algo-only.)
- **`format()`** Prettier-formats the current buffer in place. Prettier (`prettier/standalone` + the babel/typescript/estree plugins) is **lazy-imported inside `format()`** so it stays out of the main bundle; a parse error surfaces as a `sonner` toast rather than throwing. `isFormatting` disables the button mid-run.

## Persistence — the save model

[`solution.ts`](../../src/judge/solution.ts) is the localStorage layer, parallel to the pad's [`pad.ts`](../../src/pad/pad.ts): solutions are keyed `noodle:solution:<problemId>` and stored as `{ sources, updatedAt }`. Pure functions, client-only (no-op when `window` is undefined). `loadSolution(id)` returns the saved per-language buffers (a `Partial<Record<SupportedLanguage, string>>`); `saveSolution(id, sources)` writes them.

Saving is **manual**, mirroring the pad's [`usePadSave`](../../src/pad/usePadSave.ts) — but where the pad's save applies edits to the live Sandpack preview, the judge's save persists to localStorage. There's no "apply to preview" concept here because **Run** is the apply step. The mechanics:

- **`save()`** writes the whole `sources` record via `saveSolution` and sets `savedSnapshot = sources`. It reads the live buffers off a `sourcesRef` (synced in a `useLayoutEffect`, per React 19's no-ref-writes-during-render rule) so its identity stays stable across keystrokes.
- **`savedSnapshot`** (a second `Sources` state) is "what's on disk." **`isDirty`** is derived at render via `useMemo` — any language whose buffer differs from the snapshot. The toolbar's Saved/Unsaved dot reads it.
- **`⌘S` / `Ctrl+S`** → the shared [`useSaveShortcut`](../../src/components/useSaveShortcut.ts) (same hook the pad uses; lifted out of `pad/` when the judge became the second caller).
- **Autosave** → [`useJudgeAutosave`](../../src/judge/useJudge.ts), a 600ms-debounced save on content change that skips language switches and the unchanged-toggle case (tracks last-seen `{ language, code }`, the analog of the pad's `{ path, code }`). Driven by the `autosave` editor setting (see [Editor settings](#editor-settings)); the Save button is `disabled` while it's on, so the model stays unambiguous.

## Editor settings

[`settings.ts`](../../src/judge/settings.ts) is a **single-source registry**: `JUDGE_SETTINGS` maps each toggle key to its `{ label, description, default }`. Everything else is derived from it — the `JudgeSettingKey` union (`keyof typeof JUDGE_SETTINGS`), the `JudgeSettings` value type (`Record<JudgeSettingKey, boolean>`), the defaults, and the menu rows. Adding a setting = one entry here; the state, persistence, and dropdown all pick it up with no other edits.

- [`useJudgeSettings`](../../src/judge/useJudgeSettings.ts) holds the settings state (lazy-init from localStorage via `loadSettings`, merged over defaults so a newly-added key gets its default) and writes back on change. Persisted **globally** under `noodle:judge-settings`, not per-problem — these are editor preferences. Lazy-init is hydration-safe for the same reason the buffers are: no setting reaches the SSR DOM (the menu is portalled and closed by default; autocomplete only affects the client-mounted CodeMirror).
- [`SolutionSettingsMenu`](../../src/judge/SolutionSettingsMenu.tsx) renders a gear-icon [dropdown](../../src/components/ui/dropdown-menu.tsx) (shadcn Base UI `Menu`) with one `CheckboxItem` per registry entry. Base UI checkbox items default `closeOnClick: false`, so toggling one doesn't dismiss the menu. It's mounted in the **detail header** (`JudgeWorkspace` passes it as `ProblemDetailHeader`'s controls slot), not the editor toolbar — `JudgeWorkspace` still owns `settings`/`setSetting` and threads `settings.autocomplete` to the editor as `isAutocompleteEnabled`.
- **`autocomplete`** flows to the shared [`CodeEditor`](../../src/components/CodeEditor.tsx) via its `isAutocompleteEnabled` prop (default `true`), which sets CodeMirror's `basicSetup.autocompletion`. **`autosave`** drives `useJudgeAutosave` as above.

### Restore: a `useState` initializer, not a mount effect

Buffers seed from `{ ...starterCode, ...(loadSolution(id) ?? {}) }` in a `useState` lazy initializer (both `sources` and `savedSnapshot`). The merge means a never-edited language keeps its starter and a problem that later adds a language doesn't break. Reading localStorage in the initializer is safe even though `/problems/[id]` **server-renders** (`JudgeWorkspace` is a client component but not `ssr:false`, see [Why no PadLoader-style `ssr:false`](#why-no-padloader-style-ssrfalse)): CodeMirror renders a placeholder on the server with no buffer text in the SSR HTML, so a client initializer reading saved code can't produce a hydration mismatch. This sidesteps the "set state in a mount effect" cascade the lint rule flags.

## UI notes

- [`DifficultyBadge`](../../src/judge/DifficultyBadge.tsx) maps `easy`/`medium`/`hard` to the Midnight `--ok` / `--warn` / `--danger` tints (see [pad.md palette](pad.md#palette)).
- [`ProblemPanel`](../../src/judge/ProblemPanel.tsx) renders the prompt with a minimal inline-code pass (splits on backticks → `<code>`) and splits paragraphs on blank lines. Full markdown (`react-markdown`) is a deliberate non-dependency for now. Its header is just the Description/Solutions tab pair (identity moved up to `ProblemTitleBar`); [`BuildProblemPanel`](../../src/judge/BuildProblemPanel.tsx) mirrors it with a static "Description" label styled like the algo active tab, so both left panes read the same.
- [`SolutionEditor`](../../src/judge/SolutionEditor.tsx) renders the shared [`EditorToolbar`](../../src/components/EditorToolbar.tsx): a JS/TS segmented toggle in the `leading` (context) slot; on the right, the shared [`SaveStatus`](../../src/components/SaveStatus.tsx) dot, then **Last submission** (`disabled` until there's a passing submission — wrapped in a [`ConfirmDialog`](../../src/components/ConfirmDialog.tsx) since it overwrites the buffer), **Format** (Prettier), and **Save** (`disabled` while autosave is on or the buffer is clean). Run/Submit/Reset live in the top bar — see the design-language note below.
- [`ProblemDetailHeader`](../../src/judge/ProblemDetailHeader.tsx) and [`ProblemTitleBar`](../../src/judge/ProblemTitleBar.tsx) are shared with the build workspace; [`JudgeWorkspace`](../../src/judge/JudgeWorkspace.tsx) fills `ProblemDetailHeader`'s controls slot with Run / Submit / Reset / settings gear, and [`BuildToolbar`](../../src/judge/BuildToolbar.tsx) fills it with Mark-as-done / Reset / settings gear (build's Save + autosave toggle stay in the editor pane, shared with the standalone scratchpad). The build side threads `ProblemTitleBar` through `CoderPad` → `PadWorkspace`'s `headerBar` seam so it lands in the same place as algo's (between the top bar and the panels).
- **Inherited-CSS leak on the build side.** Build's top bar + title bar render *inside* `SandpackProvider`, which sets its own base `font-family` / `font-size` / `line-height` / `letter-spacing` on its subtree. Any text without those pinned inherits Sandpack's values on build but the app's on algo — visible as a differently-sized brand/slash, or a company chip whose label renders a couple px wider/narrower (different font ⇒ different glyph widths) so the bubble doesn't match its algo twin. [`DetailHeader`](../../src/components/DetailHeader.tsx) pins `font-sans text-sm leading-none` and [`ProblemTitleBar`](../../src/judge/ProblemTitleBar.tsx) pins `font-sans tracking-normal` so the two render identically. **Pin `font-sans` + the size/leading/tracking explicitly on anything shared into the Sandpack subtree.** The company chip ([`CompanyAvatar`](../../src/judge/CompanyAvatar.tsx) + label) is the same `bg-muted` bubble as a topic tag, with the avatar shrunk via its `className` override to match the chip height.

### Unified design language (algo + build)

Both problem types share one button-emphasis hierarchy so the same kind of action looks the same on either screen:

- **Solid green (`success`)** — the single primary "commit your answer" action per screen, with the `LuSend` icon: algo **Submit**, build **Mark as done**.
- **Outline (`outline` / `success-outline`)** — every other real action: Run, Format, Reset, Last submission, Restart server, and the scratchpad's Copy link / New pad. **Save** uses the green-tinted `success-outline` so it reads as save-family without competing with the solid primary.
- **Ghost (`ghost`)** — reserved for icon-only menu/affordance triggers only: the settings gear and the console collapse chevron.

The editor pane (algo and build) is one [`EditorToolbar`](../../src/components/EditorToolbar.tsx) row: a `leading` context slot (the JS/TS toggle for algo, the file-path breadcrumb for build) and a trailing action cluster (`SaveStatus` → editor-specific actions → Format → Save). Icons are `size-3.5` and dividers use `border-sidebar-border` throughout.
- [`ResultsPanel`](../../src/judge/ResultsPanel.tsx) switches on the `SubmissionOutcome` union: a pass/fail count + per-case rows (expected/got/error/logs/ms) for `ok`, or a tinted banner for `compile-error` / `timeout` / `crashed`.
