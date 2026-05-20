import type { ReactElement, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ConfirmDialogBase = {
  title: ReactNode;
  description: ReactNode;
  confirmLabel: ReactNode;
  onConfirm: () => void;
  cancelLabel?: ReactNode;
};

/**
 * Either uncontrolled (caller supplies a `trigger` element) or controlled
 * (caller owns `open` + `onOpenChange`). The two modes are mutually exclusive.
 */
type ConfirmDialogProps =
  | (ConfirmDialogBase & {
      trigger: ReactElement;
      open?: never;
      onOpenChange?: never;
    })
  | (ConfirmDialogBase & {
      trigger?: never;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    });

/** A yes/no confirmation built on AlertDialog. */
export const ConfirmDialog = ({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  cancelLabel = "Cancel",
}: ConfirmDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    {trigger ? <AlertDialogTrigger render={trigger} /> : null}
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
