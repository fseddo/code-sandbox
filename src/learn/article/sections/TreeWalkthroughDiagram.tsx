import type { Section, TreePointer, TreeWalkthroughFrame } from "@/learn/data/topic";
import { cn } from "@/lib/utils";
import { TreeEdges, layoutTree } from "@/components/dataViews/treeLayout";

type TreeWalkthroughSection = Extract<Section, { kind: "treeWalkthrough" }>;

/**
 * Pointer colors, keyed by first-appearance order so a pointer (`curr`, `L`, `R`…) keeps one color across
 * every frame — the same palette and posture as {@link WalkthroughDiagram}. Full class strings so Tailwind's
 * scanner keeps them.
 */
const POINTER_PALETTE = [
  { pill: "border-orange-500/60 bg-orange-500/15 text-orange-300", arrow: "text-orange-400" },
  { pill: "border-sky-500/60 bg-sky-500/15 text-sky-300", arrow: "text-sky-400" },
  { pill: "border-violet-500/60 bg-violet-500/15 text-violet-300", arrow: "text-violet-400" },
  { pill: "border-emerald-500/60 bg-emerald-500/15 text-emerald-300", arrow: "text-emerald-400" },
] as const;

const buildColorMap = (frames: TreeWalkthroughFrame[]) => {
  const map = new Map<string, (typeof POINTER_PALETTE)[number]>();
  for (const frame of frames) {
    for (const { name } of frame.pointers ?? []) {
      if (!map.has(name)) map.set(name, POINTER_PALETTE[map.size % POINTER_PALETTE.length]);
    }
  }
  return map;
};

const PointerStack = ({
  pointers,
  colorOf,
}: {
  pointers: TreePointer[];
  colorOf: (name: string) => (typeof POINTER_PALETTE)[number];
}) => (
  <div className="absolute bottom-full left-1/2 mb-1 flex -translate-x-1/2 items-end gap-1">
    {pointers.map((pointer) => {
      const color = colorOf(pointer.name);
      return (
        <span key={pointer.name} className="flex flex-col items-center gap-0.5">
          <span className={cn("rounded border px-1 font-mono text-[10px] leading-tight", color.pill)}>
            {pointer.name}
          </span>
          <span className={cn("text-[11px] leading-none", color.arrow)}>↓</span>
        </span>
      );
    })}
  </div>
);

const TreeFrame = ({
  section,
  frame,
  colorOf,
}: {
  section: TreeWalkthroughSection;
  frame: TreeWalkthroughFrame;
  colorOf: (name: string) => (typeof POINTER_PALETTE)[number];
}) => {
  const nodes = frame.nodes ?? section.nodes;
  const { placed, height } = layoutTree(nodes);
  const pointersAt = (id: string) => (frame.pointers ?? []).filter((pointer) => pointer.at === id);

  return (
    <div className="relative w-full" style={{ height }}>
      <TreeEdges placed={placed} />

      {[...placed.values()].map(({ node, x, y }) => {
        const active = frame.active?.includes(node.id);
        const marked = frame.marked?.includes(node.id);
        const badge = frame.badges?.[node.id];
        const pointers = pointersAt(node.id);
        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              className={cn(
                "relative flex size-10 items-center justify-center rounded-full border font-mono text-sm",
                active && "border-primary/60 bg-primary/15 font-semibold text-primary",
                marked && "border-border bg-muted/20 text-muted-foreground/50 line-through",
                !active && !marked && "border-border bg-card text-foreground",
              )}
            >
              {node.val}
              {pointers.length > 0 && <PointerStack pointers={pointers} colorOf={colorOf} />}
              {badge !== undefined && (
                <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded border border-dashed border-border bg-muted/30 px-1 font-mono text-[10px] leading-tight text-muted-foreground">
                  {badge}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * The tree/recursion analogue of {@link WalkthroughDiagram}: a stack of curated binary-tree snapshots, one
 * per step. Each frame lays the tree out tidily (in-order x, depth y), draws labeled pointer arrows above the
 * nodes they reference, softly highlights the subtree under inspection, dims resolved nodes, and shows the
 * value the recursion computes at a node as a badge below it. A frame may override the structure to depict an
 * in-place rewire (invert) or an incremental build. Server-rendered, no client JS.
 */
export const TreeWalkthroughDiagram = ({ section }: { section: TreeWalkthroughSection }) => {
  const color = buildColorMap(section.frames);
  const colorOf = (name: string) => color.get(name) ?? POINTER_PALETTE[0];

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card/40 p-4 sm:p-5">
      {section.frames.map((frame, frameIndex) => (
        <div
          key={frameIndex}
          className="space-y-3 border-t border-dashed border-border/70 pt-5 first:border-0 first:pt-0"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <TreeFrame section={section} frame={frame} colorOf={colorOf} />
            </div>
            {frame.action && (
              <span className="shrink-0 self-start rounded-md border border-dashed border-border bg-muted/20 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                {frame.action}
              </span>
            )}
          </div>
          {frame.caption && <p className="text-xs text-muted-foreground">{frame.caption}</p>}
        </div>
      ))}
    </div>
  );
};
