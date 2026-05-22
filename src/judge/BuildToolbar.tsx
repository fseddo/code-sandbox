"use client";

import Link from "next/link";
import { LuArrowLeft, LuCheck, LuRotateCcw } from "react-icons/lu";
import { resetPad } from "@/pad/pad";
import type { PadToolbarState } from "@/pad/PadWorkspace";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Separator } from "@/components/ui/separator";
import { toggleComplete } from "./progress";
import { useProgress } from "./useProgress";

/**
 * Top bar for a build problem's pad: back to the catalog, title, save state, a manual completion
 * toggle (build problems have no graded oracle), and reset-to-starter. `padId` is the problem id.
 */
export const BuildToolbar = ({ title, padId, isDirty, save }: PadToolbarState & { title: string }) => {
  const isComplete = useProgress()(padId) === "complete";

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b bg-card px-3">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <LuArrowLeft className="size-4" />
        Problems
      </Link>
      <Separator orientation="vertical" className="h-5!" />
      <span className="font-medium">{title}</span>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className={cn("size-1.5 rounded-full", isDirty ? "bg-warn" : "bg-ok")} />
        {isDirty ? "Unsaved" : "Saved"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant={isComplete ? "success" : "outline"}
          size="sm"
          onClick={() => toggleComplete(padId)}
        >
          <LuCheck className="size-4" />
          {isComplete ? "Completed" : "Mark as done"}
        </Button>
        <Button variant="outline" size="sm" onClick={save} disabled={!isDirty}>
          Save
        </Button>
        <ConfirmDialog
          trigger={
            <Button variant="outline" size="sm">
              <LuRotateCcw className="size-4" />
              Reset
            </Button>
          }
          title="Reset to starter?"
          description="This restores the starter sandbox and permanently discards your changes to this problem."
          confirmLabel="Reset"
          onConfirm={() => resetPad(padId)}
        />
      </div>
    </header>
  );
};
