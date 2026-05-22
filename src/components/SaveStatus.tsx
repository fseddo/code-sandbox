import { cn } from "@/lib/utils";

type SaveStatusProps = {
  isDirty: boolean;
  autosave: boolean;
};

/** Buffer save-state indicator shared by the judge and pad editor toolbars: a tinted dot + label. */
export const SaveStatus = ({ isDirty, autosave }: SaveStatusProps) => (
  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <span className={cn("size-1.5 rounded-full", isDirty ? "bg-warn" : "bg-ok")} />
    {autosave ? "Autosaved" : isDirty ? "Unsaved" : "Saved"}
  </span>
);
