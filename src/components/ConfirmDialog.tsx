import { useState, type ReactElement, type ReactNode } from "react";
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
}: ConfirmDialogProps) => {
  // Owned here (even in uncontrolled mode) because Base UI's AlertDialogAction is a plain button — it
  // doesn't auto-close like Radix's, so confirming has to dismiss the dialog explicitly. Cancel/Escape/
  // backdrop still close via onOpenChange. Don't "simplify" back to an uncontrolled Root, or confirm
  // leaves the modal open.
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = open ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      {trigger ? <AlertDialogTrigger render={trigger} /> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
