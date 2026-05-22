"use client";

import Link from "next/link";
import { LuArrowLeft, LuRotateCcw } from "react-icons/lu";
import { resetPad } from "@/pad/pad";
import type { PadToolbarState } from "@/pad/PadWorkspace";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Separator } from "@/components/ui/separator";

/** Top bar for a build problem's pad: back to the problem list, title, save state, and reset-to-starter. */
export const BuildToolbar = ({ title, padId, isDirty, save }: PadToolbarState & { title: string }) => (
  <header className="flex h-12 shrink-0 items-center gap-3 border-b bg-card px-3">
    <Link
      href="/judge"
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
