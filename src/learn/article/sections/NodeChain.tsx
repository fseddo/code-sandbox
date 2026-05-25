import { cn } from "@/lib/utils";

/**
 * A static, single-state linked-list render: value circles joined by `→`, ending in a `null` terminator.
 * The non-interactive sibling of {@link NodeChainDiagram} (no frames/pointers) — used to draw `linked-list`
 * args and results inside worked Examples and the Test-case table, beneath their raw `[…]` form. An empty
 * array renders as a bare `null` (the head is null). Server-rendered, no client JS.
 */
export const NodeChain = ({ values, className }: { values: (string | number)[]; className?: string }) => {
  if (values.length === 0) {
    return <span className="font-mono text-xs text-muted-foreground/60">null</span>;
  }
  return (
    <span className={cn("flex flex-wrap items-center gap-1", className)}>
      {values.map((value, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="flex size-9 items-center justify-center rounded-full border border-border bg-muted/40 font-mono text-xs text-foreground">
            {value}
          </span>
          <span className="font-mono text-sm text-muted-foreground" aria-hidden>
            →
          </span>
        </span>
      ))}
      <span className="font-mono text-xs text-muted-foreground/60">null</span>
    </span>
  );
};
