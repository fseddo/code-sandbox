# Pad

The CoderPad pane: a Sandpack bundler scoped to one pad, with a file tree, code editor, live preview, and console laid out in three resizable columns. All code lives under [`src/pad/`](../../src/pad/); the route mounts at `/pad/[id]`.

## Render tree

```
/pad/[id]                  src/app/pad/[id]/page.tsx
  └─ <CoderPadLoader>      src/app/pad/[id]/PadLoader.tsx — client boundary,
                           dynamic(import('@/pad/CoderPad'), { ssr: false })
      └─ <CoderPad>        src/pad/CoderPad.tsx
          └─ <SandpackProvider …>
              └─ <PadWorkspace>      src/pad/PadWorkspace.tsx
                  ├─ <PadToolbar>    src/pad/PadToolbar.tsx
                  └─ <Group orientation="horizontal">
                      ├─ <PadFilesPanel>   src/pad/PadFilesPanel.tsx  (scratchpad: standalone column)
                      ├─ <PadEditor>       src/pad/PadEditor.tsx
                      └─ <Group orientation="vertical">
                          ├─ <SandpackPreview />
                          └─ <PadConsolePanel>     src/pad/PadConsolePanel.tsx
```

With a `leadingPanel` (build problems), the first column is instead a **context rail** — a vertical `Group` stacking the prompt over the file tree:

```
                  └─ <Group orientation="horizontal">
                      ├─ <Panel id="context">                      ← the rail
                      │   └─ <Group orientation="vertical">
                      │       ├─ {leadingPanel}    e.g. <BuildProblemPanel>  (prompt)
                      │       └─ <PadFilesPanel>                              (files)
                      ├─ <PadEditor> …
```

[react-resizable-panels v4](https://github.com/bvaughn/react-resizable-panels): `Group` / `Panel` / `Separator`, with percentage-string sizes (`defaultSize="44%"`, `minSize="22%"`). `PadFilesPanel`, `PadConsolePanel`, and `BuildProblemPanel` are each a [`CollapsiblePane`](#collapsible-panes), so they collapse to their header strip — see [Collapsible panes](#collapsible-panes) below.

## Collapsible panes

[`CollapsiblePane`](../../src/components/CollapsiblePane.tsx) is the shared primitive behind the files, prompt, and console panes. It is a `react-resizable-panels` `Panel` that collapses to its **header strip, not to `0%`**, so the chevron stays reachable to reopen it (full-zero collapse strands the pane). The header is a slot (`header` + an optional `actions` cluster) so each caller keeps its own label/tabs/buttons; the chevron is appended automatically.

- **Axis-aware.** `expandToward` (`"up" | "down" | "left" | "right"`) picks the chevron *and* implies the axis. The caller owns the surrounding `Group`'s orientation and forwards `expandToward` + the sizes via the derived [`CollapsiblePaneLayout`](../../src/components/CollapsiblePane.tsx) (`Pick` of the four size/axis props). So `PadFilesPanel` is `expandToward="right"` (horizontal) as a standalone scratchpad column but `expandToward="up"` (vertical) inside the build rail — same component, same content, different axis. **Horizontal collapse** clips a top header strip, so when collapsed horizontally the pane renders a thin vertical rail with only the chevron; vertical collapse keeps the full header strip.
- **Mechanics** live in [`useCollapsiblePanel`](../../src/components/useCollapsiblePanel.ts): the imperative `panelRef`, an `isCollapsed` flag derived from `onResize` (≤ 7%), and a `toggle`.
- **Slide animation.** v4 has no built-in collapse animation (`collapse()`/`expand()` snap). `toggle` adds a `.panels-animating` class to the panel's parent `Group` element for one toggle (240 ms, matching the CSS in [globals.css](../../src/app/globals.css)), which transitions every sibling `[data-panel]`'s `flex-grow` together. The class is removed after the toggle so **live dragging stays un-animated** (a transition there would lag the cursor). The transition rides the flex item the library controls — reached via `Panel`'s `elementRef` (the `[data-panel]` div carrying `flexGrow`); `className`/`style` only reach a nested inner div.

## Why client-side only

Sandpack touches the DOM on import, so [PadLoader.tsx](../../src/app/pad/[id]/PadLoader.tsx) wraps `CoderPad` in `next/dynamic` with `ssr: false` and a `<div>Loading workspace…</div>` fallback. The route page itself stays server-rendered so the `[id]` param resolves on the server; only the workspace shell is gated.

## Save model

Sandpack defaults to live-bundling every keystroke. This pad disables that — see [CoderPad.tsx](../../src/pad/CoderPad.tsx):

```ts
options={{
  autorun: false,
  autoReload: false,
}}
```

Saving is a manual, code-editor-like action. Two paths trigger it:

- **`⌘S` / `Ctrl+S`** — captured by the shared [useSaveShortcut.ts](../../src/components/useSaveShortcut.ts) (lifted out of the pad when the algo editor became a second caller). `capture: true` on the listener intercepts before the browser's native save dialog; modifier filter rejects `⇧⌘S`, `⌥⌘S`, etc.
- **Save button** in the editor toolbar — same `save()` callback.

[usePadSave.ts](../../src/pad/usePadSave.ts) is the source of truth, and it's deliberately **event-driven, not observation-driven**:

- The `savedSnapshot` (a `Record<path, code>` of "what's currently on the preview") lives in the shared [`useDirtyTracker`](../../src/components/useDirtyTracker.ts) (a `useState`, not a `useRef`) and is only ever mutated at the _events_ that actually change it: `save()`, `addFile()`, `deleteFile()`. There is no `useEffect` watching `sandpack.files`. This matters: the "react to state by setting other state" pattern is forbidden by [CLAUDE.md](../../CLAUDE.md) — the events themselves own the snapshot updates. (Algo shares the same hook over its per-language buffers.)
- On mount, a one-shot `useEffect` calls `sandpack.runSandpack()` (since `autorun` is off). The baseline itself is derived in `useState`'s lazy initializer from `sandpack.files` — a one-shot derivation at first render, not an observation step, so the bullet above reads true end-to-end.
- `save()` HMR-pushes the active file via `sp.updateFile(path, code, true)` and updates the snapshot for that path. **It does NOT call `runSandpack()`**, which would cold-restart the dev server (new port, multi-second white screen).
- `isDirty` is derived at render time via `useMemo` — iterate the snapshot, return `true` if any path's recorded code differs from `sandpack.files[path]?.code`. The toolbar's "Unsaved / Saved" dot reads it.
- Returns `{ isDirty, save, addFile, deleteFile }`. The file-op wrappers are the _only_ way `PadFilesPanel` mutates the bundler — see [Files panel](#files-panel) below.

### React 19: sandpack ref synced in `useLayoutEffect`

`useSandpack()` returns a new object every render. Holding a `sandpackRef` so the stable `save`/`addFile`/`deleteFile` callbacks can read the latest is the standard pattern, but React 19 forbids writing to refs _during render_ ("Cannot access refs during render"). The shared [`useLatestRef`](../../src/components/useLatestRef.ts) does the assign in a `useLayoutEffect` (runs sync after render, before paint, so listeners see the up-to-date ref immediately) — the same helper the algo editor uses to keep its `save()` identity stable.

### Autosave

[`useAutosave(enabled, save)`](../../src/pad/usePadSave.ts) layered on top — when the toggle in `PadEditor` is on, it debounces a save (`AUTOSAVE_DEBOUNCE_MS`, via the shared [`useDebouncedCallback`](../../src/components/useDebouncedCallback.ts)) on every content change of the active file. It stays **effect**-driven — it observes `sandpack.files` because Sandpack exposes no content-change event — tracking the last-seen `{ path, code }` so toggling the switch on doesn't immediately re-save unchanged content, and switching files doesn't push a no-op save. The autosave switch disables the manual Save button to make the model unambiguous. (Algo's autosave is *event*-driven instead, since its `CodeEditor` has an `onChange`; see [algo.md](algo.md).)

### Why file create/delete is not "dirty"

Mirrors local Vite: saving a new file is what makes Vite see it. Sandpack's `addFile` / `deleteFile` push immediately regardless of `autoReload`, so there's nothing for the user to "save" — the bundler already knows. The hook's `addFile` / `deleteFile` wrappers update the snapshot in the same step they update the bundler, so a new file lands with snapshot == current and never reads as drifted.

## Persistence

[`pad.ts`](../../src/pad/pad.ts) is the localStorage layer — pads are keyed `noodle:pad:<id>` and stored as `{ files, updatedAt, title? }`. Pure functions, no React; safe to call from the client only (no-ops when `window` is undefined). It's a thin wrapper over a shared [`createKeyedStore`](../../src/lib/localStore.ts) — the typed, SSR/parse-safe `read`/`write`/`remove`/`entries` seam every persisted module now sits on (the future DB-adapter point). A write **merges** over the stored record (`{ ...store.read(id), files, … }`) rather than clobbering, so the title survives a file save and a file save survives a rename.

- [`newPadId()`](../../src/pad/pad.ts) — 12-char hex via `crypto.getRandomValues`. Used by [src/app/pad/page.tsx](../../src/app/pad/page.tsx) (`export const dynamic = "force-dynamic"` so a fresh id mints on every visit, never cached).
- [`loadPad(id)`](../../src/pad/pad.ts) — read on mount in [CoderPad.tsx](../../src/pad/CoderPad.tsx), merged under the active profile's `baseFiles` so the Vite config override always wins. Returns `null` for an **empty** file set too (not just a missing pad), so a rename-before-first-save doesn't strand the workspace with no files — it falls back to the seed.
- [`savePad(id, files, title?)`](../../src/pad/pad.ts) — debounced (600ms) by [usePadPersistence.ts](../../src/pad/usePadPersistence.ts), fire-and-forget. Merges over the stored record; a `title` is written when given (build problems pass theirs) and otherwise preserved (a scratchpad's user-set name). Distinct from the manual save model above: this is "the pad survives a reload"; that is "the preview reflects my edits."
- **Titles** — `loadPadTitle(id)` / `renamePad(id, title)`. The pad id (12-char hex) is the stable key; the title is an optional user-given display name. `renamePad` writes the trimmed title (blank clears it back to `undefined`) without touching files. Surfaced by the breadcrumb's [`EditablePadTitle`](../../src/pad/EditablePadTitle.tsx) (click to rename; Enter/blur commits, Escape cancels) and shown — with the id as fallback — in [RecentPads](../../src/components/RecentPads.tsx) and the header's [`PadsMenu`](../../src/components/PadsMenu.tsx).
  - **Build problems** share pad storage (`padId` = problem id), so they appear in those lists too. [`BuildWorkspace`](../../src/problems/build/BuildWorkspace.tsx) passes `title={problem.title}` down through `CoderPad` → `PadWorkspace` → `usePadPersistence`, so the title rides the normal save (no mount effect) and the pad lists **by name, not slug**. That title is fixed: editability is **structural**, not a stored flag — build problems render the plain `BuildToolbar`, only scratchpads render `PadToolbar` → `EditablePadTitle`, and the [`/pad/[id]`](../../src/app/pad/[id]/page.tsx) route **redirects any problem id to `/problems/[id]`**, so a build pad can never reach the editable scratchpad UI. See [navigation.md](navigation.md).
- [`clearPad(id)`](../../src/pad/pad.ts) — removes a pad from this browser. Backs both the Reset action (clear + reload rehydrates from the template) and the **Delete** action in [PadToolbar.tsx](../../src/pad/PadToolbar.tsx) (clear + `router.push("/")` back to the catalog). Delete is scratchpad-only — `BuildToolbar` offers Reset, not Delete, since a build problem isn't a user-created pad.
- [`listPads()`](../../src/pad/pad.ts) — drives the home-page [RecentPads](../../src/components/RecentPads.tsx) list and the header `PadsMenu` dropdown (carries `title`). Subscribed via the shared [`useCachedExternalStore`](../../src/lib/useCachedExternalStore.ts) against the `storage` event ([`useRecentPads`](../../src/pad/useRecentPads.ts); the progress store uses the same hook), so a pad created in another tab shows up without a refresh. Same-tab writes don't fire `storage`; the list is good-enough-on-navigation.

The two save concepts run in parallel:

| Concept                | Trigger                           | Destination            | Hook                         |
| ---------------------- | --------------------------------- | ---------------------- | ---------------------------- |
| Apply edits to preview | ⌘S / Save button / autosave timer | Sandpack bundler (HMR) | `usePadSave` / `useAutosave` |
| Survive a reload       | 600ms debounce on any file change | localStorage           | `usePadPersistence`          |

Planned: move "survive a reload" to a server DB so pads are shareable across devices.

## Pad profiles

A *pad profile* is "one kind of pad" — which Sandpack template it boots from, the files seeded on first load, and the files force-applied on every load. Profiles live in [`src/pad/padProfiles/`](../../src/pad/padProfiles/); the per-file content snippets each profile assembles live in [`src/pad/padDefaults/`](../../src/pad/padDefaults/). [`CoderPad.tsx`](../../src/pad/CoderPad.tsx) holds a `const profile = typescriptFrontend` at the top — that's the only seam to swap when new profiles land (planned: `fullstack`, etc.).

The shape, exported from each profile module:

```ts
type PadProfile = {
  template: SandpackPredefinedTemplate;
  seedFiles: SandpackFiles;  // first-load seed
  baseFiles: SandpackFiles;  // force-applied every load
};
```

Today there's one profile, [`typescriptFrontend`](../../src/pad/padProfiles/typescriptFrontend.ts):

- `template: "vite-react-ts"` — Sandpack's flat Vite + React + TS template.
- `seedFiles` — reshapes the template into a conventional Vite layout under `/src/` (`main.tsx`, `App.tsx`, `App.css`, `index.css`, `global.d.ts`) plus a root `index.html` whose script tag points at `/src/main.tsx`. The template's orphan `/App.tsx` and `/index.tsx` are kept and marked `hidden: true` so they don't show in the file tree but stay in the bundler's view. Seeded files become part of the saved pad — renames and deletes stick.
- `baseFiles` — currently just `/vite.config.ts` with `clearScreen: false`, because Sandpack's in-browser Node (Nodebox) doesn't implement `readline.clearScreenDown()` and would otherwise log a "not yet implemented" warning into the console on every preview boot.

The file content snippets in `padDefaults/` are each a single `export const fooTsx = \`…\``. Named exports, no defaults — per [CLAUDE.md](../../CLAUDE.md#function-syntax). Multiple profiles can share a snippet (e.g. `globalDTs` is generic enough to live in any TS pad).

Merge in [CoderPad.tsx](../../src/pad/CoderPad.tsx): `{ ...(loadPad(padId) ?? profile.seedFiles), ...profile.baseFiles }`.

## Reusable seams: `leadingPanel` + `renderToolbar`

[`CoderPad`](../../src/pad/CoderPad.tsx) and [`PadWorkspace`](../../src/pad/PadWorkspace.tsx) are
reused beyond the `/pad/[id]` route — the build problems mount the same bundler shell (see
[company-sourcing.md → Phase 2](company-sourcing.md#phase-2--build-problems-reuse-the-pad--done)).
Two optional, **feature-agnostic** seams make that possible without forking the layout or leaking
problem concepts into the pad layer:

- **`CoderPad` takes an optional `profile`** (the existing `PadProfile`) and `activeFile`, defaulting
  to `typescriptFrontend` / `/src/App.tsx`. A build problem composes a profile from its `template` +
  `files`; the `/pad` route passes neither, so its behaviour is unchanged.
- **`PadWorkspace` takes `leadingPanel?: ReactNode`** (when present, the first column becomes a vertical
  [context rail](#render-tree) stacking the prompt over the file tree; the prompt is expected to be its
  own [`CollapsiblePane`](#collapsible-panes)) **and `renderToolbar?: (state: PadToolbarState) => ReactNode`** — a render
  prop so a custom top bar can read `isDirty`/`save`, which are produced by the hooks *inside*
  `PadWorkspace`. The default reproduces `<PadToolbar>` exactly.

`PadToolbar` and the problem headers share one breadcrumb shell, [`DetailHeader`](../../src/components/DetailHeader.tsx)
(brand → crumb / title + a controls slot). `PadToolbar` passes the `Pads` crumb and an
editable title; [`ProblemDetailHeader`](../../src/problems/shared/ProblemDetailHeader.tsx) passes the `Problems` crumb and a
plain title. The editor panes likewise share [`EditorToolbar`](../../src/components/EditorToolbar.tsx) (a `leading`
context slot + a trailing action cluster) and the [`SaveStatus`](../../src/components/SaveStatus.tsx) dot — see the
[unified design language](algo.md#unified-design-language-algo--build) in [algo.md](algo.md).

`resetPad(id)` in [pad.ts](../../src/pad/pad.ts) (clear + reload → rehydrate from seed) is shared by
`PadToolbar` and the build toolbar.

## Files panel

[PadFilesPanel.tsx](../../src/pad/PadFilesPanel.tsx) is a [`CollapsiblePane`](#collapsible-panes) (Files label as the `header`, the root-level `+ file` / `+ folder` buttons as its `actions`) over [PadFileTree.tsx](../../src/pad/PadFileTree.tsx). It takes the pane's [`CollapsiblePaneLayout`](../../src/components/CollapsiblePane.tsx) from `PadWorkspace`, which sets the axis per mode (horizontal column in the scratchpad, vertical in the build rail). It does **not** call `sandpack.addFile` / `sandpack.deleteFile` directly — it receives `addFile` and `deleteFile` from [`usePadSave`](../../src/pad/usePadSave.ts) (via `PadWorkspace`) so the snapshot stays in sync as a side effect of the action, not after-the-fact via a files watcher.

The props are typed off the hook's return so the prop shape tracks the source:

```ts
type PadSaveOps = Pick<ReturnType<typeof usePadSave>, "addFile" | "deleteFile">;
```

### Custom tree (not `SandpackFileExplorer`)

`SandpackFileExplorer` is a black box — no row-level hover affordances, no per-directory `+ file` / `+ folder`, no extension-aware icons, no styling of the selected row. [PadFileTree.tsx](../../src/pad/PadFileTree.tsx) replaces it:

- Builds a `FileNode` tree from `sandpack.files`, filtering entries where `hidden: true` (so the template orphans stay out of view).
- Renders rows recursively, each indented by `depth * 12 + 6` px. Folders sort before files; both alphabetical within a level.
- Extension → icon + color via a `Record<string, { Icon, color }>` lookup; folders use `Folder` / `FolderOpen` based on expanded state.
- Active file: `aria-selected`, `bg-accent` + accent foreground. Folders on the path to the active file get foreground (not muted) so the breadcrumb reads visually.
- Whole row is clickable (folders toggle expand, files set active). Per-row hover surfaces inline actions: `+ file` / `+ folder` on directories, `Trash2` on files. Action clicks `stopPropagation()` so they don't also activate the row.

### Create / delete dialogs

Both dialogs are **controlled by `PadFilesPanel`** — the tree only signals intent (`onCreateInDir(dirPath, kind)`, `onDelete(path)`). Per [CLAUDE.md](../../CLAUDE.md), dialog visibility lives in the parent.

- **New file**: opens with the clicked directory prefilled; user supplies just a name (no slashes allowed — nesting comes from which row you clicked). `.tsx` / `.jsx` get a component stub, others start blank.
- **New folder**: prompts for a folder name and creates `<dir>/<folder>/index.ts` empty — Sandpack has no concept of empty directories, so a placeholder file is what makes the folder real.
- **Delete**: row-targeted (not "delete active"). Confirmation runs through [`ConfirmDialog`](../../src/components/ConfirmDialog.tsx), which accepts either a `trigger` element (uncontrolled) or `open` + `onOpenChange` (controlled) via a discriminated-union prop type. The delete case uses the controlled mode since the dialog isn't tied to a single trigger.

## Editor

[PadEditor.tsx](../../src/pad/PadEditor.tsx) — `SandpackCodeEditor` with `showTabs={false}` (the file tree is the source of truth for what's open) under the shared [`EditorToolbar`](../../src/components/EditorToolbar.tsx): the active file's path breadcrumb in the `leading` slot, then the shared [`SaveStatus`](../../src/components/SaveStatus.tsx) dot, **Format**, and **Save** on the right. `pathSegments` splits on `/` and drops the leading empty segment so `/components/Button.tsx` reads as `components › Button.tsx`. Save uses the `success-outline` variant — see the [unified design language](algo.md#unified-design-language-algo--build) shared with the algo workspace.

**Format** runs Prettier on the **active file**: `parserForPath(activeFile)` picks the parser by extension and `formatCode` formats `useActiveCode().code`, written back via `updateCode` (which marks the pad dirty like any edit). The button is disabled when the extension has no parser. Both `parserForPath` and `formatCode` live in the shared [`src/lib/prettier.ts`](../../src/lib/prettier.ts) — the **one** Prettier front-end, also used by the algo editor's [`useAlgo`](../../src/problems/algo/useAlgo.ts) (by language). Prettier + its plugins are lazy-imported per call so nothing ships in the main bundle; a parse error surfaces as a `sonner` toast.

## Palette

[globals.css](../../src/app/globals.css) ships the **"D · Midnight"** dark theme — a deep navy base with an electric-blue primary. Token values come from the handoff; the shadcn token names stay because every shadcn primitive (Button, Dialog, Card, …) is wired to them. Five extra tokens carry semantics shadcn doesn't cover:

- `--ok` — green; used by `bg-ok` on the toolbar saved-state dot and by ANSI `32`/`92` in the console.
- `--warn` — amber; `bg-warn` on the unsaved dot, ANSI `33`/`93`.
- `--link` — purple; URL auto-links in the console rows, ANSI `34`/`35`/`94`/`95`, and as a row-tint for `console.info`.
- `--danger` — red; alias for `--destructive`, used as `bg-danger/8` row-tint for `console.error` and by ANSI `31`/`91`.
- `--accent-dim` — muted blue; for low-emphasis accent strokes (currently unused in chrome, available for future shell prompts / faded UI accents).

Surfaces flatten into three layers: the editor body uses `bg-background` (the canvas), all chrome (`PadToolbar`, `PadConsolePanel`) sits on `bg-card`, and the file sidebar uses `bg-sidebar` (a separate shadcn token wired to the same panel value, so it reads as visually peer to the toolbar). Selected/hover rows tint with the shadcn `--accent` (which Midnight maps to the slightly-lifted `--raise` value).

`SandpackProvider theme="dark"` styles the bundler's own internals (the CodeMirror editor inside `SandpackCodeEditor`, the preview's iframe chrome) independently — our palette only controls the chrome around it.

### Handoff → shadcn name map

The Midnight handoff names its tokens semantically (`--bg`, `--panel`, `--raise`, …); the codebase keeps shadcn's names so the component library keeps working. The mapping:

| Handoff       | shadcn slot(s)                                                      | Use site                                                |
| ------------- | ------------------------------------------------------------------- | ------------------------------------------------------- |
| `--bg`        | `--background`                                                      | app canvas, editor body                                 |
| `--panel`     | `--card` / `--popover` / `--sidebar`                                | top bar, file sidebar, console frame                    |
| `--raise`     | `--muted` / `--secondary` / `--accent` / `--sidebar-accent`         | hover row, selected file, button hover bg               |
| `--border`    | `--border` / `--input`                                              | outlines, input borders                                 |
| `--hairline`  | `--sidebar-border`                                                  | dividers between regions                                |
| `--text`      | `--foreground` and every `*-foreground` slot                        | primary text                                            |
| `--mute`      | `--muted-foreground`                                                | secondary labels, breadcrumb separators                 |
| `--accent`    | `--primary` / `--ring`                                              | Save button / primary CTA / active tab underline / focus ring |
| `--ok`        | `--success` and `--ok`                                              | saved-state dot, server stdout green                    |
| `--warn`      | `--warn`                                                            | unsaved dot, caution                                    |
| `--link`      | `--link`                                                            | URL highlights, `console.info` rows                     |
| `--danger`    | `--destructive` and `--danger`                                      | `console.error` rows, destructive buttons               |

## Preview / console

The right column splits into `SandpackPreview` on top and a custom `<PadConsolePanel>` (replaces the inline `<SandpackConsole>` from earlier revisions) on the bottom, wired through a `react-resizable-panels` Group with an imperative `panelRef`.

### Preview

`<SandpackPreview>` ships with a refresh button (reloads the iframe — fast) *and* a restart button (cold-restarts the bundler — slow). The console pane also has a restart. We pass `showRestartButton={false}` to the preview so the cold-restart lives only on the console (conceptually "the dev server lives in the console"), avoiding the duplicate-button confusion. The iframe refresh stays.

Sandpack hardcodes `background: white` on `.sp-preview-container`, which flashes white for a frame on load (most visible booting a build problem) before the iframe paints. [globals.css](../../src/app/globals.css) overrides it to `var(--background)` so the pane reads dark from the first frame.

### Console — [PadConsolePanel.tsx](../../src/pad/PadConsolePanel.tsx)

Two tabs (**Server** | **Client**) with a `bg-primary` underline on the active tab, a "Restart server" button (wired to `useSandpackShell().restart`), and a collapse chevron at the right.

**Both views stay mounted at all times.** Each owns its own subscription to the Sandpack message bus — `ServerView` via [`useSandpackShellStdout`](../../node_modules/@codesandbox/sandpack-react/dist/hooks/useSandpackShellStdout.d.ts), `ConsoleView` via [`useSandpackConsole`](../../node_modules/@codesandbox/sandpack-react/dist/hooks/useSandpackConsole.d.ts). Switching tabs toggles a CSS `hidden` class on the inactive view's wrapper; nothing remounts, so messages that fire while a tab is hidden are still captured when the user switches back. The previous "conditional render" shape lost the inactive tab's history on every switch — see the same warning if anyone tries to revert to it.

**Server view** renders Vite's stdout. The stdout often carries SGR escape sequences for color (`\x1b[32m` green for `VITE`, `\x1b[36m` cyan for hostnames, etc.); a tiny in-file parser splits the text into `{ text, color, bold, dim }` segments and renders them as `<span>`s with the matching Midnight palette utility class. URL detection runs on top of that via a `<RichText>` helper — anything matching `https?://\S+` becomes a `target="_blank"` `<a>` styled as `text-link`.

**Client view** renders JS-runtime console messages from the running app. Each entry gets a row with a divider (`border-b border-border/40`) and a severity-based tint (`bg-danger/8` for `error`, `bg-warn/8` for `warn`, `bg-link/8` for `info`, plain for `log`). Non-string args go through `JSON.stringify(arg, null, 2)`. Same URL highlighting as Server.

**Collapse.** `PadConsolePanel` is a [`CollapsiblePane`](#collapsible-panes) (`expandToward="up"`, `collapsedSize="6%"`) — the tabs are its `header`, **Restart server** is an `action`, and the two views are its children. Collapsing leaves the 6% tab strip reachable so the chevron stays clickable; the shared primitive owns the `panelRef`, the `onResize` threshold, and the slide animation, so `PadWorkspace` no longer threads any console state.
