"use client";

import { LuRotateCcw, LuSend } from "react-icons/lu";
import { resetPad } from "@/pad/pad";
import { PadSettingsMenu } from "@/pad/PadSettingsMenu";
import type { PadToolbarState } from "@/pad/PadWorkspace";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ProblemDetailHeader } from "./ProblemDetailHeader";
import { toggleComplete } from "./progress";
import { useProgress } from "./useProgress";

/**
 * Top bar for a build problem: the shared breadcrumb plus the problem-level actions — reset-to-starter
 * (wipes all files), a manual completion toggle (build has no graded oracle), and the settings gear
 * (furthest right). `padId` is the problem id. Save + save state + Format live in the editor pane, and
 * "Restart server" lives in the console (the dev server's home), both shared with the scratchpad.
 */
export const BuildToolbar = ({
  title,
  padId,
  autosave,
  onAutosaveChange,
}: PadToolbarState & { title: string }) => {
  const isComplete = useProgress()(padId) === "complete";

  return (
    <ProblemDetailHeader title={title}>
      <Button variant="success" size="sm" onClick={() => toggleComplete(padId)}>
        <LuSend className="size-3.5" />
        {isComplete ? "Completed" : "Mark as done"}
      </Button>
      <ConfirmDialog
        trigger={
          <Button variant="outline" size="sm">
            <LuRotateCcw className="size-3.5" />
            Reset
          </Button>
        }
        title="Reset to starter?"
        description="This restores the starter sandbox and permanently discards your changes to this problem."
        confirmLabel="Reset"
        onConfirm={() => resetPad(padId)}
      />
      <PadSettingsMenu autosave={autosave} onAutosaveChange={onAutosaveChange} />
    </ProblemDetailHeader>
  );
};
