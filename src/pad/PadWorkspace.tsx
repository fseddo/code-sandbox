"use client";

import { useState } from "react";
import {
  SandpackConsole,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";
import { PadToolbar } from "@/pad/PadToolbar";
import { PadEditor } from "@/pad/PadEditor";
import { PadFilesPanel } from "@/pad/PadFilesPanel";
import { usePadPersistence } from "@/pad/usePadPersistence";
import { useAutosave, usePadSave } from "@/pad/usePadSave";
import { usePadShortcuts } from "@/pad/usePadShortcuts";

const fill = { height: "100%" } as const;

const ResizeBar = ({ axis }: { axis: "x" | "y" }) => (
  <Separator
    className={cn(
      "bg-border transition-colors hover:bg-primary",
      axis === "x" ? "w-px" : "h-px",
    )}
  />
);

/** Three-pane layout: file tree, code editor, and live preview + console. */
export const PadWorkspace = ({ padId }: { padId: string }) => {
  usePadPersistence(padId);
  const { isDirty, save, addFile, deleteFile } = usePadSave();
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
};
