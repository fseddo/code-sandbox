import type { TreeNodeSpec } from "@/learn/data/topic";

export type PlacedNode = { node: TreeNodeSpec; x: number; y: number; depth: number };
export type TreeLayout = { placed: Map<string, PlacedNode>; height: number };

/** Pixels of vertical space per tree level — the rendered height scales with depth. */
const LEVEL_PX = 72;

/**
 * Lay a binary tree out tidily: x by in-order rank, y by depth — both as 0–100 fractions of the viewport, so
 * edges (SVG, same fractional space) and absolutely-positioned node boxes align. Shared by the interactive
 * {@link TreeWalkthroughDiagram} and the static {@link TreeView}.
 */
export const layoutTree = (nodes: TreeNodeSpec[]): TreeLayout => {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const placed = new Map<string, PlacedNode>();
  let order = 0;
  let maxDepth = 0;

  const visit = (id: string | undefined, depth: number) => {
    if (id === undefined) return;
    const node = byId.get(id);
    if (!node) return;
    maxDepth = Math.max(maxDepth, depth);
    visit(node.left, depth + 1);
    placed.set(id, { node, x: order++, y: 0, depth });
    visit(node.right, depth + 1);
  };
  visit(nodes[0]?.id, 0);

  const count = order || 1;
  const rows = maxDepth + 1;
  for (const entry of placed.values()) {
    entry.x = ((entry.x + 0.5) / count) * 100;
    entry.y = ((entry.depth + 0.5) / rows) * 100;
  }
  return { placed, height: rows * LEVEL_PX };
};

/**
 * Parse a LeetCode level-order array (`null` = absent child, children of `null` omitted) into the id'd node
 * shape the layout consumes. Generated ids are stable by position so callers can key off them.
 */
export const levelOrderToNodes = (values: (number | string | null)[]): TreeNodeSpec[] => {
  if (values.length === 0 || values[0] === null) return [];
  const nodes: TreeNodeSpec[] = [{ id: "n0", val: values[0]! }];
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const queue: string[] = ["n0"];
  let i = 1;
  while (queue.length > 0 && i < values.length) {
    const parent = byId.get(queue.shift()!)!;
    for (const side of ["left", "right"] as const) {
      if (i >= values.length) break;
      const value = values[i];
      if (value !== null) {
        const id = `n${i}`;
        const child: TreeNodeSpec = { id, val: value };
        parent[side] = id;
        nodes.push(child);
        byId.set(id, child);
        queue.push(id);
      }
      i++;
    }
  }
  return nodes;
};

/** Parent→child line layer, drawn under the node boxes. Shared fractional coordinate space with the boxes. */
export const TreeEdges = ({ placed }: { placed: Map<string, PlacedNode> }) => (
  <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
    {[...placed.values()].flatMap(({ node, x, y }) =>
      [node.left, node.right].flatMap((childId) => {
        const child = childId === undefined ? undefined : placed.get(childId);
        if (!child) return [];
        return [
          <line
            key={`${node.id}-${childId}`}
            x1={x}
            y1={y}
            x2={child.x}
            y2={child.y}
            className="stroke-border"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />,
        ];
      }),
    )}
  </svg>
);
