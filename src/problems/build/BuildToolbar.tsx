"use client";

import { LuSend } from "react-icons/lu";
import { resetPad } from "@/pad/pad";
import { PadSettingsMenu } from "@/pad/PadSettingsMenu";
import type { PadToolbarState } from "@/pad/PadWorkspace";
import { Button } from "@/components/ui/button";
import { ResetAction } from "@/components/ResetAction";
import { ProblemDetailHeader } from "@/problems/shared/ProblemDetailHeader";
import { toggleComplete } from "@/problems/progress/progress";
import { useProgress } from "@/problems/progress/useProgress";

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
      <ResetAction
        title="Reset to starter?"
        description="This restores the starter sandbox and permanently discards your changes to this problem."
        onConfirm={() => resetPad(padId)}
      />
      <PadSettingsMenu autosave={autosave} onAutosaveChange={onAutosaveChange} />
    </ProblemDetailHeader>
  );
};
