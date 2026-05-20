"use client";

import { LuSave } from "react-icons/lu";
import { SandpackCodeEditor, useSandpack } from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const fill = { height: "100%" } as const;

/** Splits an absolute pad path into its segments, dropping the leading slash. */
const pathSegments = (path: string): string[] =>
  path.split("/").filter(Boolean);

const LANG_LABEL: Record<string, string> = {
  tsx: "TSX",
  ts: "TS",
  jsx: "JSX",
  js: "JS",
  css: "CSS",
  html: "HTML",
  json: "JSON",
  md: "MD",
  svg: "SVG",
};

const langLabel = (path: string): string => {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return LANG_LABEL[ext] ?? (ext ? ext.toUpperCase() : "TXT");
};

/** Editor pane: Save + autosave toggle, breadcrumb, Sandpack editor (tabs off — file tree is the source of truth). */
export const PadEditor = ({
  save,
  autosave,
  onAutosaveChange,
}: {
  save: () => void;
  autosave: boolean;
  onAutosaveChange: (next: boolean) => void;
}) => {
  const { sandpack } = useSandpack();
  const segments = pathSegments(sandpack.activeFile);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-9 shrink-0 items-center gap-3 border-b px-3">
        <Button
          variant="success"
          size="sm"
          onClick={save}
          disabled={autosave}
          title="Save (⌘S)"
        >
          <LuSave className="size-4" />
          Save
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Label htmlFor="autosave-switch" className="text-xs font-normal">
            Autosave
          </Label>
          <Switch
            id="autosave-switch"
            checked={autosave}
            onCheckedChange={onAutosaveChange}
          />
        </div>
      </div>
      <div className="flex h-7 shrink-0 items-center justify-between border-b px-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          {segments.map((seg, i) => {
            const isLast = i === segments.length - 1;
            return (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 ? <span className="text-muted-foreground/60">/</span> : null}
                <span className={isLast ? "font-medium text-primary" : ""}>
                  {seg}
                </span>
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground/80">
          <span>UTF-8</span>
          <span className="text-muted-foreground/40">·</span>
          <span>LF</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{langLabel(sandpack.activeFile)}</span>
        </div>
      </div>
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
