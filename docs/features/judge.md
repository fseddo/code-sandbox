# Judge

The LeetCode side: pick a problem, write a solution in JS or TS, and run it server-side against the problem's test cases. All code lives under [`src/judge/`](../../src/judge/) (UI + data + runner) and [`src/app/judge/`](../../src/app/judge/) (routes); the API route is [`src/app/api/judge/route.ts`](../../src/app/api/judge/route.ts). The submission editor is the shared [`CodeEditor`](../../src/components/CodeEditor.tsx).

## Render tree

```
/judge                     src/app/judge/page.tsx — problem list (server)
/judge/[id]                src/app/judge/[id]/page.tsx — server, getProblem + notFound
  └─ <JudgeWorkspace>      src/judge/JudgeWorkspace.tsx — "use client"
      └─ <Group horizontal>
          ├─ <ProblemPanel>            src/judge/ProblemPanel.tsx
          └─ <Group vertical>
              ├─ <SolutionEditor>      src/judge/SolutionEditor.tsx → <CodeEditor>
              └─ <ResultsPanel>        src/judge/ResultsPanel.tsx
```

Same [react-resizable-panels v4](../../src/components/ResizeBar.tsx) layout primitives as the pad (percentage-string sizes). `ResizeBar` is shared in [`src/components/ResizeBar.tsx`](../../src/components/ResizeBar.tsx) — extracted when the judge became the second caller; [PadWorkspace](../../src/pad/PadWorkspace.tsx) consumes the same shared component.

## Why no PadLoader-style `ssr:false`

Unlike Sandpack, CodeMirror (`@uiw/react-codemirror`) is SSR-safe — it renders a placeholder on the server and mounts on the client in an effect. So `/judge/[id]` renders `<JudgeWorkspace>` (a client component) directly from the server page; no `next/dynamic` wrapper is needed. The page itself stays a server component so the `[id]` param resolves and `getProblem` runs server-side.

## Problem model — the typed core

[`problem.ts`](../../src/judge/problem.ts) is the single-source-of-types centerpiece. A problem is **generic over its solution signature** `(...args: Args) => Result`, and the test cases are typed off that signature:

```ts
type TestCase<Args extends unknown[], Result> = { name?: string; args: Args; expected: Result };
type Problem<Args extends unknown[] = unknown[], Result = unknown> = { …; tests: TestCase<Args, Result>[] };
```

[`defineProblem<Args, Result>(…)`](../../src/judge/problem.ts) is an identity helper that pins the signature so authoring a problem type-checks each case's `args` tuple and `expected` against it — see [twoSum.ts](../../src/judge/problems/twoSum.ts) (`defineProblem<[number[], number], number[]>`). Get the signature wrong in a test case and it's a compile error, not a runtime surprise.

[`problems/index.ts`](../../src/judge/problems/index.ts) is the registry: a `Record<id, Problem>` built with `satisfies` so the authored modules keep their precise generics while the registry erases them to the base `Problem` (it holds heterogeneous signatures). `getProblem(id)` / `listProblems()` are the read API — problem *info* needs no HTTP route; server components import the registry directly. Adding a problem = a new module under `problems/` + one line in `index.ts`.

`SubmissionOutcome` (also in `problem.ts`) is the discriminated union the runner and UI share: `ok` | `compile-error` | `timeout` | `crashed`. It's the wire contract between [route.ts](../../src/app/api/judge/route.ts) and [ResultsPanel](../../src/judge/ResultsPanel.tsx).

## Execution — worker thread + `node:vm`

The judge must run server-side (the user can't be trusted to grade their own code, and the bank shouldn't ship answers to the client). The chosen model is a **terminable worker thread running a `node:vm` context** — see [runSubmission.ts](../../src/judge/runner/runSubmission.ts) and [judge.worker.mjs](../../src/judge/runner/judge.worker.mjs).

Flow:

1. [`route.ts`](../../src/app/api/judge/route.ts) (`runtime = "nodejs"` — worker_threads can't run on Edge) validates `{ problemId, language, source }`, looks up the problem, and calls `runSubmission`.
2. [`runSubmission`](../../src/judge/runner/runSubmission.ts) spawns the worker with `{ source, language, functionName, tests }` as `workerData`, then **races the worker's message against a 2s `setTimeout`**. On overrun it calls `worker.terminate()` and resolves `{ status: "timeout" }`.
3. [`judge.worker.mjs`](../../src/judge/runner/judge.worker.mjs) transpiles TS→JS with **sucrase** (type-strip only, no type-checking — what a judge wants), builds a `vm` context whose only injected global is a `console` capturer, runs each test, deep-equals `actual` vs `expected`, and posts back `{ status: "ok", results }`.

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
- **Worker path resolution:** [`runSubmission`](../../src/judge/runner/runSubmission.ts) resolves the worker by absolute path from `process.cwd()`. This works under `next dev` (source files on disk). `next build` / `next start` will need `outputFileTracingIncludes` in `next.config` to copy `judge.worker.mjs` into the server output — **not yet configured**, since the dev workflow is the current target.

## Editor — shared `CodeEditor`

[`CodeEditor.tsx`](../../src/components/CodeEditor.tsx) is a standalone CodeMirror 6 wrapper (`@uiw/react-codemirror` + `@codemirror/lang-javascript`) with `value` / `onChange` / `language` / `isReadOnly` props. It's deliberately **not** tied to Sandpack — the judge has no bundler, just one function to edit and ship to the server. It uses `@uiw`'s built-in `dark` theme for token colors plus a thin `EditorView.theme` extension for sizing/font (Geist Mono).

The pad keeps `SandpackCodeEditor` (which is CodeMirror pre-wired into Sandpack's active-file/HMR model — that integration is its value). Unifying the pad onto this `CodeEditor` via Sandpack's `useActiveCode()` hook is a deliberate future step, not done here.

## State

[`useJudge(problem)`](../../src/judge/useJudge.ts) owns everything: `language`, **one source buffer per language** (`Record<SupportedLanguage, string>` seeded from `starterCode`, so switching language swaps buffers without losing work and without a `useEffect`), the latest `outcome`, and `isRunning`. `run()` POSTs to `/api/judge` and stores the `SubmissionOutcome`. The visible `source` is derived (`sources[language]`) at render — no synced state.

## UI notes

- [`DifficultyBadge`](../../src/judge/DifficultyBadge.tsx) maps `easy`/`medium`/`hard` to the Midnight `--ok` / `--warn` / `--danger` tints (see [pad.md palette](pad.md#palette)).
- [`ProblemPanel`](../../src/judge/ProblemPanel.tsx) renders the prompt with a minimal inline-code pass (splits on backticks → `<code>`) and splits paragraphs on blank lines. Full markdown (`react-markdown`) is a deliberate non-dependency for now.
- [`SolutionEditor`](../../src/judge/SolutionEditor.tsx) has a JS/TS segmented toggle and a green `success` Run button (same "go" affordance as the pad's Save).
- [`ResultsPanel`](../../src/judge/ResultsPanel.tsx) switches on the `SubmissionOutcome` union: a pass/fail count + per-case rows (expected/got/error/logs/ms) for `ok`, or a tinted banner for `compile-error` / `timeout` / `crashed`.
