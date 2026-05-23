"use client";

import { LuRotateCcw } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type ResetActionProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
};

/** The shared "Reset" outline button + confirm dialog; pass per-surface copy (the consequences differ). */
export const ResetAction = ({ title, description, confirmLabel = "Reset", onConfirm }: ResetActionProps) => (
  <ConfirmDialog
    trigger={
      <Button variant="outline" size="sm">
        <LuRotateCcw className="size-3.5" />
        Reset
      </Button>
    }
    title={title}
    description={description}
    confirmLabel={confirmLabel}
    onConfirm={onConfirm}
  />
);
