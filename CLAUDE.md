@AGENTS.md

# Repo orientation

noodle — a CoderPad + LeetCode hybrid. Single Next.js 16 (App Router) app, React 19, no separate backend yet. The CoderPad pane is built; a first cut of the algo problems feature (typed problem bank + server-side test runner via a worker thread) is in [src/problems/](src/problems/) — see [docs/features/algo.md](docs/features/algo.md).

## Stack notes

These have breaking changes vs. older versions an agent may have memorized. Read carefully before writing code that touches them.

- **Next.js 16 App Router** — see [AGENTS.md](AGENTS.md). Read the relevant guide in `node_modules/next/dist/docs/` before writing routes, layouts, server components, or `dynamic`/`use client` boundaries.
- **React 19**.
- **shadcn/ui — Base UI variant.** Triggers and slot-like surfaces use the `render` prop, NOT `asChild`. Example: `<AlertDialogTrigger render={<Button variant="outline" />}>…</AlertDialogTrigger>`. See [PadToolbar.tsx](src/pad/PadToolbar.tsx). Base UI primitives can differ from Radix (e.g. `AlertDialogAction` is a plain button — it does **not** auto-close). Need different behavior from a `ui/` primitive? **Wrap it in a component under `components/`; don't edit the generated `components/ui/` file — the CLI can overwrite it.** See [ConfirmDialog.tsx](src/components/ConfirmDialog.tsx).
- **react-resizable-panels v4** — `Group` / `Panel` / `Separator` (not the v1 `PanelGroup` / `PanelResizeHandle`). Sizes are percentage strings (`"40%"`, `"22%"`), not numbers. See [PadWorkspace.tsx](src/pad/PadWorkspace.tsx).
- **Sandpack** (`@codesandbox/sandpack-react`) — in-browser bundler. Touches the DOM on import, so wrap in `dynamic(..., { ssr: false })`. See [PadLoader.tsx](src/app/pad/[id]/PadLoader.tsx).

## Source layout

```
src/
  app/                  Next.js routes (App Router)
  pad/                  CoderPad pane — components, hooks, persistence
  components/           Cross-feature components (RecentPads, ThemeProvider)
    ui/                 shadcn primitives (CLI-managed)
  lib/                  Truly cross-cutting utilities (cn, etc.)
```

Feature folders own everything for one area: components, hooks, local utilities. Cross-feature code lives in `src/components/`; shadcn primitives stay in `src/components/ui/` because the shadcn CLI writes there.

When the LeetCode phase lands, it gets its own folder (e.g. `src/problems/`), not a split inside `pad/`.

## File + symbol naming

- **`.tsx` components** → PascalCase file matching the component: [PadWorkspace.tsx](src/pad/PadWorkspace.tsx) exports `PadWorkspace`.
- **Hooks** → camelCase file matching the hook: [usePadSave.ts](src/pad/usePadSave.ts) exports `usePadSave`.
- **Utility modules** → camelCase: [pad.ts](src/pad/pad.ts).
- **shadcn primitives in `components/ui/`** → kebab-case (`alert-dialog.tsx`). Exception; the shadcn CLI controls these.

Inside files: components are PascalCase, hooks `useThing`, functions/variables camelCase, types/interfaces PascalCase. Boolean props are named for the action, not the structure: `isDirty`, `showCount`, `withBackdrop` — not `pill`, `chip`, `slim`.

Name what the value _is_, not its position or its return type: `columnCount: number` over `columns: number` (reads as an array); `selectedPadId` over `selected` when the value is the id.

## State

`useState` is fine for genuinely local, ephemeral UI state — it is not the default. Before reaching for one, check:

- Server / bundler state owned by a library (Sandpack files, router state) → read from that library's hook (`useSandpack`, `useRouter`), don't mirror into local state.
- Persistent across reloads → localStorage helper module (`pad.ts`) or future server persistence.
- Derivable from props or other state → derive at render, don't sync via `useEffect`.

**Hoist modal/dialog/popover visibility to the parent.** The component takes `onClose` / `onOpenChange`; the parent owns the open state. `useEffect` is for side effects only (subscriptions, manual DOM, cleanup) — not for "react to state by setting other state."

## Reuse and derive types

The project leans into clever TypeScript as a learning exercise. When the same field/key list appears in two places, derive one from the other:

- **`Pick` / `Omit` / `Extract`** to narrow without redeclaring.
- **Single-source literal unions** — define once, import everywhere (e.g. a `PadTemplate` literal in `pad.ts`).
- **Generics** so callers' typed values flow through (e.g. `function loadPad<T>(...)` rather than widening to `unknown`).
- **Mapped / conditional types** when two shapes are mechanically related.

**Derive types, not values.** Name a constant if the position is semantic (`const DEFAULT_TEMPLATE = 'vite-react-ts'`); don't add indirection just to avoid repeating a literal.

## Function syntax

- **Arrow functions for all declarations, including React components.** `const Foo = (props: Props) => { ... }`, never `function Foo() {}`. Same for utilities, hooks, event handlers, and inner helpers — `const onKeyDown = (event: KeyboardEvent) => {}`.
- **Prefer `export const` over default exports.** Components, hooks, utilities, data — `export const Foo = …` everywhere. It's one construct, the symbol is explicit, and every caller imports the same name (so renames update at the source and Find Usages always works). No `const X = …; export default X` ceremony; no inline `export default () => …`.
- **Default exports only when the framework forces it.** Next's route files (`page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`, `route.ts`) require a default export — there, declare `const Foo = …` and `export default Foo` on a separate line (never inline). Everywhere else (including components loaded via `next/dynamic`, which accepts named exports via `.then(m => m.Foo)`), use `export const`.
- **One component per file** by default.
- **Drop `async`** from arrow functions whose body is a single returned promise: `() => fetch(...)` over `async () => await fetch(...)`.

## className concatenation

- Use **[`cn()`](src/lib/utils.ts)** (clsx + tailwind-merge) for any className combining multiple values or conditionals. Pass each fragment as a separate argument; never template-literal concat.
- Once a className gains responsive variants or arbitrary values, reach for `cn()` even with no conditionals, and group arguments by _purpose_ (visual identity / layout / responsive sizing), not by breakpoint.
- A single static string with no conditionals stays a plain string literal — `cn("flex items-center")` with one arg is just ceremony.

## Extract when repetition is real, or when the inline form isn't readable

Don't abstract on the first instance — you don't know the variation surface yet. After that:

- **At 2 near-identical bodies**, _raise it_. Surface the pair, propose an extraction shape (props, what's variant vs. invariant), and let the user decide whether the variation surface is clear enough to commit to. Don't silently extract on instance 2; don't silently leave it either.
- **At 3+ near-identical bodies**, extract. The variation surface is now observed, not guessed.
- **Readability override.** Even a _single_ instance is an extraction candidate if the inline form is hard to read — deeply nested primitive ceremony (e.g. 5+ levels of `<AlertDialog*>` children), long render blocks where the structure obscures intent, or repeated boilerplate inside one component. Code lives to be read; if a named component would orient a reader faster than the inline JSX does, lift it out. Trigger here is _readability_, not repetition.

Trigger for the first two rules is _observed_ repetition, not anticipated future use. Trigger for the third is _clarity_, judged at the call site.

## Comments

A single-line JSDoc above a file's main export, helper, or hook is fine and often useful as orientation — keep them. What to avoid:

- **No 3+ line comment blocks.** If a JSDoc spans more than one line, either it's saying too much (most of it is WHAT — drop it) or the WHY belongs in the relevant doc under `docs/`. The exception is a multi-bullet JSDoc on a public API where each line is a distinct invariant.
- **No clusters of in-body comments.** One short single-line WHY at a non-obvious spot is fine. Three or more comments littering one function body is a smell — the comments are usually narrating WHAT, or papering over a function that should be split.
- **Same content rules still apply.** Comments explain _why_, not _what_. Don't reference the current task, fix, or callers — those belong in commit messages / PR descriptions and rot fast.

## Where to read before starting work

Auto-loaded CLAUDE files are not enough for area-specific work — read the relevant feature doc first.

| Touching                                      | Read first                                       |
| --------------------------------------------- | ------------------------------------------------ |
| [src/pad/](src/pad/) — the CoderPad pane      | [docs/features/pad.md](docs/features/pad.md)     |
| [src/problems/algo/](src/problems/algo/) — the algo workspace, editor & tester | [docs/features/algo.md](docs/features/algo.md) |
| [src/problems/data/problems/](src/problems/data/problems/) — authoring/sourcing problems | [docs/features/problem-authoring.md](docs/features/problem-authoring.md) |
| [companies.ts](src/problems/data/companies.ts) / build problems / the `company-sourcer` agent | [docs/features/company-sourcing.md](docs/features/company-sourcing.md) |
| The home page / problem catalog / routing / progress tracking | [docs/features/navigation.md](docs/features/navigation.md) |

Touching an area not listed here? That's a doc gap — flag it before writing.

See [docs/README.md](docs/README.md) for how the docs are organized.
