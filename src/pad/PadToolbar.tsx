"use client";

import { useRouter } from "next/navigation";
import { LuLink2, LuPlus, LuRotateCcw } from "react-icons/lu";
import { toast } from "sonner";
import { resetPad } from "@/pad/pad";
import { EditablePadTitle } from "@/pad/EditablePadTitle";
import { PadSettingsMenu } from "@/pad/PadSettingsMenu";
import type { PadToolbarState } from "@/pad/PadWorkspace";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DetailHeader } from "@/components/DetailHeader";

/** Top bar of a scratchpad: the shared breadcrumb with an editable title, workspace actions, and the gear. */
export const PadToolbar = ({ padId, autosave, onAutosaveChange }: PadToolbarState) => {
  const router = useRouter();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Pad link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <DetailHeader crumb={{ label: "Pads" }} title={<EditablePadTitle padId={padId} />}>
      <Button variant="outline" size="sm" onClick={copyLink}>
        <LuLink2 className="size-3.5" />
        Copy link
      </Button>
      <ConfirmDialog
        trigger={
          <Button variant="outline" size="sm">
            <LuRotateCcw className="size-3.5" />
            Reset
          </Button>
        }
        title="Reset this pad?"
        description="This restores the starter template and permanently discards the code saved in this pad."
        confirmLabel="Reset pad"
        onConfirm={() => resetPad(padId)}
      />
      <Button variant="outline" size="sm" onClick={() => router.push("/pad")}>
        <LuPlus className="size-3.5" />
        New pad
      </Button>
      <PadSettingsMenu autosave={autosave} onAutosaveChange={onAutosaveChange} />
    </DetailHeader>
  );
};
