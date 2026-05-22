"use client";

import { useState } from "react";
import { LuSave, LuSparkles } from "react-icons/lu";
import { SandpackCodeEditor, useActiveCode, useSandpack } from "@codesandbox/sandpack-react";
import { toast } from "sonner";
import { formatCode, parserForPath } from "@/lib/prettier";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "@/components/EditorToolbar";
import { SaveStatus } from "@/components/SaveStatus";

const fill = { height: "100%" } as const;

/** Splits an absolute pad path into its segments, dropping the leading slash. */
const pathSegments = (path: string): string[] =>
  path.split("/").filter(Boolean);

/** Editor pane: one toolbar (file breadcrumb + Save/Format/state) over the Sandpack editor (tabs off — the file tree is the source of truth). */
export const PadEditor = ({
  save,
  autosave,
  isDirty,
}: {
  save: () => void;
  autosave: boolean;
  isDirty: boolean;
}) => {
  const { sandpack } = useSandpack();
  const { code, updateCode } = useActiveCode();
  const segments = pathSegments(sandpack.activeFile);

  const parser = parserForPath(sandpack.activeFile);
  const [isFormatting, setIsFormatting] = useState(false);
  const formatActiveFile = async () => {
    if (!parser) return;
    setIsFormatting(true);
    try {
      updateCode(await formatCode(code, parser));
    } catch {
      toast.error("Couldn't format — check for syntax errors.");
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <EditorToolbar
        leading={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {segments.map((seg, i) => {
              const isLast = i === segments.length - 1;
              return (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 ? <span className="text-muted-foreground/60">/</span> : null}
                  <span className={isLast ? "font-medium text-primary" : ""}>{seg}</span>
                </span>
              );
            })}
          </div>
        }
      >
        <SaveStatus isDirty={isDirty} autosave={autosave} />
        <Button
          variant="outline"
          size="sm"
          onClick={formatActiveFile}
          disabled={!parser || isFormatting}
          title={parser ? "Format this file with Prettier" : "No formatter for this file type"}
        >
          <LuSparkles className="size-3.5" />
          {isFormatting ? "Formatting…" : "Format"}
        </Button>
        <Button
          variant="success-outline"
          size="sm"
          onClick={save}
          disabled={autosave || !isDirty}
          title="Save (⌘S)"
        >
          <LuSave className="size-3.5" />
          Save
        </Button>
      </EditorToolbar>
      <div className="min-h-0 flex-1">
        <SandpackCodeEditor
          showTabs={false}
          showLineNumbers
          showInlineErrors
          showRunButton={false}
          style={fill}
        />
      </div>
    </div>
  );
};
