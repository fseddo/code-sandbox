import type { ProgressStatus } from "@/problems/progress/progress";
import { cn } from "@/lib/utils";

const STYLE: Record<ProgressStatus, string> = {
  "not-started": "border border-muted-foreground/40",
  "in-progress": "bg-warn",
  complete: "bg-ok",
};

const TITLE: Record<ProgressStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  complete: "Complete",
};

/** A 2.5-size dot encoding progress: hollow ring (not started), amber (in progress), green (complete). */
export const StatusDot = ({ status }: { status: ProgressStatus }) => (
  <span
    aria-label={TITLE[status]}
    title={TITLE[status]}
    className={cn("size-2.5 shrink-0 rounded-full", STYLE[status])}
  />
);
