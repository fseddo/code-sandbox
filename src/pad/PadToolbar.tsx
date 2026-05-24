"use client";

import { useRouter } from "next/navigation";
import { LuLink2, LuTrash2 } from "react-icons/lu";
import { toast } from "sonner";
import { clearPad, resetPad } from "@/pad/pad";
import { EditablePadTitle } from "@/pad/EditablePadTitle";
import { PadSettingsMenu } from "@/pad/PadSettingsMenu";
import type { PadToolbarState } from "@/pad/PadWorkspace";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ResetAction } from "@/components/ResetAction";
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

  const deletePad = () => {
    clearPad(padId);
    router.push("/pads");
  };

  return (
    <DetailHeader crumb={{ label: "Pads", href: "/pads" }} title={<EditablePadTitle padId={padId} />}>
      <Button variant="outline" size="sm" onClick={copyLink}>
        <LuLink2 className="size-3.5" />
        Copy link
      </Button>
      <ResetAction
        title="Reset this pad?"
        description="This restores the starter template and permanently discards the code saved in this pad."
        confirmLabel="Reset pad"
        onConfirm={() => resetPad(padId)}
      />
      <ConfirmDialog
        trigger={
          <Button variant="destructive" size="sm">
            <LuTrash2 className="size-3.5" />
            Delete
          </Button>
        }
        title="Delete this pad?"
        description="This permanently removes the pad and its code from this browser. This can't be undone."
        confirmLabel="Delete pad"
        onConfirm={deletePad}
      />
      <PadSettingsMenu autosave={autosave} onAutosaveChange={onAutosaveChange} />
    </DetailHeader>
  );
};
