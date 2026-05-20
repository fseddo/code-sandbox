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
                      ├─ <PadFilesPanel>   src/pad/PadFilesPanel.tsx
                      ├─ <PadEditor>       src/pad/PadEditor.tsx
                      └─ <Group orientation="vertical">
                          ├─ <SandpackPreview />
                          └─ <SandpackConsole />
```

[react-resizable-panels v4](https://github.com/bvaughn/react-resizable-panels): `Group` / `Panel` / `Separator`, with percentage-string sizes (`defaultSize="44%"`, `minSize="22%"`). The files and console panels are `collapsible` with `collapsedSize="0%"`.

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

- **`⌘S` / `Ctrl+S`** — captured by [usePadShortcuts.ts](../../src/pad/usePadShortcuts.ts). `capture: true` on the listener intercepts before the browser's native save dialog; modifier filter rejects `⇧⌘S`, `⌥⌘S`, etc.
- **Save button** in the editor toolbar — same `save()` callback.

[usePadSave.ts](../../src/pad/usePadSave.ts) is the source of truth, and it's deliberately **event-driven, not observation-driven**:

- The `savedSnapshot` (a `Record<path, code>` of "what's currently on the preview") is `useState`, not `useRef`, and it's only ever mutated at the *events* that actually change it: `save()`, `addFile()`, `deleteFile()`. There is no `useEffect` watching `sandpack.files`. This matters: the "react to state by setting other state" pattern is forbidden by [CLAUDE.md](../../CLAUDE.md) — the events themselves own the snapshot updates.
- On mount, a one-shot `useEffect` calls `sandpack.runSandpack()` (since `autorun` is off). The baseline itself is derived in `useState`'s lazy initializer from `sandpack.files` — a one-shot derivation at first render, not an observation step, so the bullet above reads true end-to-end.
- `save()` HMR-pushes the active file via `sp.updateFile(path, code, true)` and updates the snapshot for that path. **It does NOT call `runSandpack()`**, which would cold-restart the dev server (new port, multi-second white screen).
- `isDirty` is derived at render time via `useMemo` — iterate the snapshot, return `true` if any path's recorded code differs from `sandpack.files[path]?.code`. The toolbar's "Unsaved / Saved" dot reads it.
- Returns `{ isDirty, save, addFile, deleteFile }`. The file-op wrappers are the *only* way `PadFilesPanel` mutates the bundler — see [Files panel](#files-panel) below.

### React 19: sandpack ref synced in `useLayoutEffect`

`useSandpack()` returns a new object every render. Holding a `sandpackRef` so the stable `save`/`addFile`/`deleteFile` callbacks can read the latest is the standard pattern, but React 19 forbids writing to refs *during render* ("Cannot access refs during render"). The fix: assign in a `useLayoutEffect`, which runs sync after render, before paint — listeners attached in effects see the up-to-date ref immediately.

### Autosave

[`useAutosave(enabled, save)`](../../src/pad/usePadSave.ts) layered on top — when the toggle in `PadEditor` is on, debounces (600ms) a save on every content change of the active file. It tracks the last-seen `{ path, code }` so toggling the switch on doesn't immediately re-save unchanged content, and switching files doesn't push a no-op save of the new file. The autosave switch disables the manual Save button to make the model unambiguous.

### Why file create/delete is not "dirty"

Mirrors local Vite: saving a new file is what makes Vite see it. Sandpack's `addFile` / `deleteFile` push immediately regardless of `autoReload`, so there's nothing for the user to "save" — the bundler already knows. The hook's `addFile` / `deleteFile` wrappers update the snapshot in the same step they update the bundler, so a new file lands with snapshot == current and never reads as drifted.

## Persistence

[`pad.ts`](../../src/pad/pad.ts) is the localStorage layer — pads are keyed `codepad:pad:<id>` and stored as `{ files, updatedAt }`. Pure functions, no React; safe to call from the client only (no-ops when `window` is undefined).

- [`newPadId()`](../../src/pad/pad.ts) — 12-char hex via `crypto.getRandomValues`. Used by [src/app/pad/page.tsx](../../src/app/pad/page.tsx) (`export const dynamic = "force-dynamic"` so a fresh id mints on every visit, never cached).
- [`loadPad(id)`](../../src/pad/pad.ts) — read on mount in [CoderPad.tsx](../../src/pad/CoderPad.tsx), merged under `PAD_BASE_FILES` so the Vite config override always wins.
- [`savePad(id, files)`](../../src/pad/pad.ts) — debounced (600ms) by [usePadPersistence.ts](../../src/pad/usePadPersistence.ts), fire-and-forget. The hook returns `void`; the persistence layer has no UI surface. Distinct from the manual save model above: this is "the pad survives a reload"; that is "the preview reflects my edits."
- [`clearPad(id)`](../../src/pad/pad.ts) — called by the Reset action in [PadToolbar.tsx](../../src/pad/PadToolbar.tsx); a hard reload rehydrates from the template.
- [`listPads()`](../../src/pad/pad.ts) — drives the home-page [RecentPads](../../src/components/RecentPads.tsx) list. Subscribed via `useSyncExternalStore` against the `storage` event, so a pad created in another tab shows up on the home page without a refresh. Same-tab writes don't fire `storage`; the list there is good-enough-on-navigation.

The two save concepts run in parallel:

| Concept | Trigger | Destination | Hook |
| --- | --- | --- | --- |
| Apply edits to preview | ⌘S / Save button / autosave timer | Sandpack bundler (HMR) | `usePadSave` / `useAutosave` |
| Survive a reload | 600ms debounce on any file change | localStorage | `usePadPersistence` |

Planned: move "survive a reload" to a server DB so pads are shareable across devices.

## Sandpack template + base files

```ts
PAD_TEMPLATE = "vite-react-ts"
```

`PAD_BASE_FILES` (in [pad.ts](../../src/pad/pad.ts)) is force-applied on top of every pad load. Today it holds only `/vite.config.ts`, which sets `clearScreen: false` — Sandpack's in-browser Node (Nodebox) doesn't implement `readline.clearScreenDown()`, and without the override, every preview boot logs a "not yet implemented" warning into the console.

## Files panel

[PadFilesPanel.tsx](../../src/pad/PadFilesPanel.tsx) wraps `SandpackFileExplorer` with a slim toolbar for create + delete. It does **not** call `sandpack.addFile` / `sandpack.deleteFile` directly — it receives `addFile` and `deleteFile` from [`usePadSave`](../../src/pad/usePadSave.ts) (via `PadWorkspace`) so the snapshot stays in sync as a side effect of the action, not after-the-fact via a files watcher.

The props are typed off the hook's return so the prop shape tracks the source:

```ts
type PadSaveOps = Pick<ReturnType<typeof usePadSave>, "addFile" | "deleteFile">;
```

- **New file** opens a Dialog with a path input. `normalizePath` adds a leading `/` if missing; duplicates report inline. `.tsx` / `.jsx` files get a component stub (capitalized from the filename), other extensions start blank.
- **Delete** targets `sandpack.activeFile`, guarded by an AlertDialog with the path inlined.

Both use the shadcn Base UI variant — note `<AlertDialogTrigger render={<Button … />}>` rather than `asChild`.

## Editor

[PadEditor.tsx](../../src/pad/PadEditor.tsx) — `SandpackCodeEditor` with `showTabs={false}` (the file tree is the source of truth for what's open) plus a slim toolbar (Save button + autosave Switch) and a breadcrumb of the active file's path. `pathSegments` splits on `/` and drops the leading empty segment so `/components/Button.tsx` reads as `components › Button.tsx`.
