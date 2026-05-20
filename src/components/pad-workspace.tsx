"use client";

import { useState } from "react";
import {
  SandpackConsole,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { PadToolbar } from "@/components/pad-toolbar";
import { PadEditor } from "@/components/pad-editor";
import { PadFilesPanel } from "@/components/pad-files-panel";
import { usePadPersistence } from "@/components/use-pad-persistence";
import { useAutosave, usePadSave } from "@/components/use-pad-save";
import { usePadShortcuts } from "@/components/use-pad-shortcuts";

const fill = { height: "100%" } as const;

function ResizeBar({ axis }: { axis: "x" | "y" }) {
  const base = "bg-border transition-colors hover:bg-primary";
  return (
    <Separator className={axis === "x" ? `w-px ${base}` : `h-px ${base}`} />
  );
}

/** Three-pane layout: file tree, code editor, and live preview + console. */
export function PadWorkspace({ padId }: { padId: string }) {
  // localStorage autosave is fire-and-forget — no UI consumer of its state.
  usePadPersistence(padId);
  const { isDirty, save } = usePadSave();
  const [autosave, setAutosave] = useState(false);
  useAutosave(autosave, save);
  usePadShortcuts(save);

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
          <PadFilesPanel />
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
                showOpenInCodeSandbox={false}
                style={fill}
              />
            </Panel>
            <ResizeBar axis="y" />
            <Panel
              id="console"
              className="min-h-0"
              defaultSize="36%"
              minSize="15%"
              collapsible
              collapsedSize="0%"
            >
              <SandpackConsole style={fill} />
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  );
}
