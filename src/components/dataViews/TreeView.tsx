import { cn } from "@/lib/utils";
import { TreeEdges, layoutTree, levelOrderToNodes } from "./treeLayout";

/**
 * A static, single-state binary-tree render: value circles joined by parent→child edges, laid out tidily
 * (in-order x, depth y). The non-interactive sibling of {@link TreeWalkthroughDiagram} (no frames/pointers/
 * badges) — used to draw `binary-tree` args and results inside worked Examples and the Test-case table,
 * beneath their raw level-order `[…]` form, the way {@link NodeChain} draws lists. Takes the same level-order
 * array (`null` = absent child) the judge uses. An empty array renders as a bare `null`. Server-rendered.
 */
export const TreeView = ({
  values,
  className,
}: {
  values: (number | string | null)[];
  className?: string;
}) => {
  const nodes = levelOrderToNodes(values);
  if (nodes.length === 0) {
    return <span className="font-mono text-xs text-muted-foreground/60">null</span>;
  }
  const { placed, height } = layoutTree(nodes);

  return (
    <span className={cn("relative block w-full max-w-xs", className)} style={{ height }}>
      <TreeEdges placed={placed} />
      {[...placed.values()].map(({ node, x, y }) => (
        <span
          key={node.id}
          className="absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card font-mono text-xs text-foreground"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          {node.val}
        </span>
      ))}
    </span>
  );
};
