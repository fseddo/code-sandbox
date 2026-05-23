"use client";

import { type ReactNode, useState } from "react";
import { SandpackPreview } from "@codesandbox/sandpack-react";
import { Group, Panel } from "react-resizable-panels";
import { ResizeBar } from "@/components/ResizeBar";
import { PadToolbar } from "@/pad/PadToolbar";
import { PadEditor } from "@/pad/PadEditor";
import { PadFilesPanel } from "@/pad/PadFilesPanel";
import { PadConsolePanel } from "@/pad/PadConsolePanel";
import { usePadPersistence } from "@/pad/usePadPersistence";
import { useAutosave, usePadSave } from "@/pad/usePadSave";
import { useSaveShortcut } from "@/components/useSaveShortcut";

const fill = { height: "100%" } as const;

/** State a custom toolbar needs; the hooks that produce it live inside PadWorkspace. */
export type PadToolbarState = {
  padId: string;
  isDirty: boolean;
  save: () => void;
  autosave: boolean;
  onAutosaveChange: (next: boolean) => void;
};

type PadWorkspaceProps = {
  padId: string;
  /** A fixed display name persisted with the pad (build problems pass their title); scratchpads omit it. */
  title?: string;
  /** Optional first column, rendered before the file tree (e.g. a build problem's prompt). */
  leadingPanel?: ReactNode;
  /** Optional full-width bar between the top bar and the panels (e.g. a build problem's title bar). */
  headerBar?: ReactNode;
  /** Override the top bar; defaults to the standard pad toolbar. A render prop so it can read `isDirty`/`save`. */
  renderToolbar?: (state: PadToolbarState) => ReactNode;
};

/** Three-pane layout: file tree, code editor, and live preview + console. */
export const PadWorkspace = ({ padId, title, leadingPanel, headerBar, renderToolbar }: PadWorkspaceProps) => {
  usePadPersistence(padId, title);
  const { isDirty, save, addFile, deleteFile } = usePadSave();
  const [autosave, setAutosave] = useState(false);
  useAutosave(autosave, save);
  useSaveShortcut(save);

  const toolbarState: PadToolbarState = { padId, isDirty, save, autosave, onAutosaveChange: setAutosave };
  const toolbar = renderToolbar ? renderToolbar(toolbarState) : <PadToolbar {...toolbarState} />;

  return (
    <div className="flex h-full flex-col bg-background">
      {toolbar}
      {headerBar}
      <Group orientation="horizontal" className="flex-1">
        {leadingPanel ? (
          // Context rail: the prompt over the file tree, each collapsing vertically to its header.
          <Panel id="context" className="min-w-0" defaultSize="26%" minSize="14%">
            <Group orientation="vertical" className="h-full">
              {leadingPanel}
              <ResizeBar axis="y" />
              <PadFilesPanel
                addFile={addFile}
                deleteFile={deleteFile}
                expandToward="up"
                defaultSize="34%"
                minSize="6%"
                collapsedSize="6%"
              />
            </Group>
          </Panel>
        ) : (
          // Standalone scratchpad: the file tree is its own column, collapsing horizontally.
          <PadFilesPanel
            addFile={addFile}
            deleteFile={deleteFile}
            expandToward="right"
            defaultSize="16%"
            minSize="12%"
            collapsedSize="3%"
          />
        )}
        <ResizeBar axis="x" />
        <Panel id="editor" className="min-w-0" defaultSize="44%" minSize="22%">
          <PadEditor save={save} autosave={autosave} isDirty={isDirty} />
        </Panel>
        <ResizeBar axis="x" />
        <Panel id="output" className="min-w-0" defaultSize="40%" minSize="22%">
          <Group orientation="vertical" className="h-full">
            <Panel
              id="preview"
              className="min-h-0"
              defaultSize="64%"
              minSize="20%"
            >
              <SandpackPreview
                showNavigator
                showRefreshButton
                showRestartButton={false}
                showOpenInCodeSandbox={false}
                style={fill}
              />
            </Panel>
            <ResizeBar axis="y" />
            <PadConsolePanel />
          </Group>
        </Panel>
      </Group>
    </div>
  );
};
