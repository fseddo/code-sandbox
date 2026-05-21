"use client";

import { useRef, useState } from "react";
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

/** Three-pane layout: file tree, code editor, and live preview + console. */
export const PadWorkspace = ({ padId }: { padId: string }) => {
  usePadPersistence(padId);
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

  return (
    <div className="flex h-full flex-col bg-background">
      <PadToolbar padId={padId} isDirty={isDirty} />
      <Group orientation="horizontal" className="flex-1">
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
          <PadEditor
            save={save}
            autosave={autosave}
            onAutosaveChange={setAutosave}
          />
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
