"use client";

import { ChevronRight, Save } from "lucide-react";
import { SandpackCodeEditor, useSandpack } from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const fill = { height: "100%" } as const;

/** Splits an absolute pad path into its segments, dropping the leading slash. */
const pathSegments = (path: string): string[] =>
  path.split("/").filter(Boolean);

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
          size="sm"
          onClick={save}
          disabled={autosave}
          title="Save (⌘S)"
        >
          <Save className="size-4" />
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
      <div className="flex h-7 shrink-0 items-center gap-1 border-b px-3 text-xs text-muted-foreground">
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
            <span key={i} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight className="size-3" /> : null}
              <span className={isLast ? "font-medium text-foreground" : ""}>
                {seg}
              </span>
            </span>
          );
        })}
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
