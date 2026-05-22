"use client";

import { type ReactNode, useRef, useState } from "react";
import { SandpackPreview } from "@codesandbox/sandpack-react";
import { Group, Panel, type PanelImperativeHandle } from "react-resizable-panels";
import { ResizeBar } from "@/components/ResizeBar";
import { PadToolbar } from "@/pad/PadToolbar";
import { PadEditor } from "@/pad/PadEditor";
import { PadFilesPanel } from "@/pad/PadFilesPanel";
import { PadConsolePanel } from "@/pad/PadConsolePanel";
import { usePadPersistence } from "@/pad/usePadPersistence";
import { useAutosave, usePadSave } from "@/pad/usePadSave";
import { useSaveShortcut } from "@/components/useSaveShortcut";

const fill = { height: "100%" } as const;

const CONSOLE_DEFAULT_SIZE = "36%";
const CONSOLE_COLLAPSED_SIZE = "6%";

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

  const consolePanelRef = useRef<PanelImperativeHandle>(null);
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const toggleConsole = () => {
    const panel = consolePanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  };

  const toolbarState: PadToolbarState = { padId, isDirty, save, autosave, onAutosaveChange: setAutosave };
  const toolbar = renderToolbar ? renderToolbar(toolbarState) : <PadToolbar {...toolbarState} />;

  return (
    <div className="flex h-full flex-col bg-background">
      {toolbar}
      {headerBar}
      <Group orientation="horizontal" className="flex-1">
        {leadingPanel ? (
          <>
            <Panel id="prompt" className="min-w-0" defaultSize="26%" minSize="0%" collapsible collapsedSize="0%">
              {leadingPanel}
            </Panel>
            <ResizeBar axis="x" />
          </>
        ) : null}
        <Panel
          id="files"
          className="min-w-0"
          defaultSize="16%"
          minSize="12%"
          collapsible
          collapsedSize="0%"
        >
          <PadFilesPanel addFile={addFile} deleteFile={deleteFile} />
        </Panel>
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
            <Panel
              id="console"
              className="min-h-0"
              panelRef={consolePanelRef}
              defaultSize={CONSOLE_DEFAULT_SIZE}
              minSize={CONSOLE_COLLAPSED_SIZE}
              collapsible
              collapsedSize={CONSOLE_COLLAPSED_SIZE}
              onResize={(size) =>
                setConsoleCollapsed(size.asPercentage <= 7)
              }
            >
              <PadConsolePanel
                isCollapsed={consoleCollapsed}
                onToggleCollapse={toggleConsole}
              />
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  );
};
