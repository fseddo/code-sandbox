import type { ListPointer, ListWalkthroughFrame, Section } from "@/learn/data/topic";
import { cn } from "@/lib/utils";

type ListWalkthroughSection = Extract<Section, { kind: "listWalkthrough" }>;

/**
 * Pointer colors, keyed by first-appearance order so a pointer (`prev`, `curr`, `slow`…) keeps one color
 * across every frame — the same palette and posture as {@link WalkthroughDiagram}. Full class strings so
 * Tailwind's scanner keeps them.
 */
const POINTER_PALETTE = [
  { pill: "border-orange-500/60 bg-orange-500/15 text-orange-300", arrow: "text-orange-400" },
  { pill: "border-sky-500/60 bg-sky-500/15 text-sky-300", arrow: "text-sky-400" },
  { pill: "border-violet-500/60 bg-violet-500/15 text-violet-300", arrow: "text-violet-400" },
  { pill: "border-emerald-500/60 bg-emerald-500/15 text-emerald-300", arrow: "text-emerald-400" },
] as const;

const buildColorMap = (frames: ListWalkthroughFrame[]) => {
  const map = new Map<string, (typeof POINTER_PALETTE)[number]>();
  for (const frame of frames) {
    for (const { name } of frame.pointers ?? []) {
      if (!map.has(name)) map.set(name, POINTER_PALETTE[map.size % POINTER_PALETTE.length]);
    }
  }
  return map;
};

/** The default forward target for node `i` in an `n`-node chain: the next node, or `null` at the tail. */
const defaultTarget = (i: number, n: number): number | null => (i + 1 < n ? i + 1 : null);

/** Resolve node `i`'s `next` target this frame (a `links` override wins over the default forward link). */
const targetOf = (frame: ListWalkthroughFrame, i: number, n: number): number | null =>
  frame.links && i in frame.links ? frame.links[i] : defaultTarget(i, n);

type ColorOf = (name: string) => (typeof POINTER_PALETTE)[number];

/** The labeled pointer arrow stack drawn above a node (or the null terminator). */
const PointerStack = ({ pointers, colorOf }: { pointers: ListPointer[]; colorOf: ColorOf }) => (
  <div className="flex min-h-9 items-end justify-center gap-1">
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

/**
 * One inter-node connector: `→` for a forward link to the immediate next node, `↩` (backward) for a
 * reversed link, and a dim `⤬`-style break drawn when a node's `next` was cut to something non-adjacent.
 */
const LinkArrow = ({ from, to }: { from: number; to: number | null }) => {
  const isForwardAdjacent = to === from + 1;
  const isBackward = to !== null && to < from;
  return (
    <span
      className={cn(
        "px-0.5 font-mono text-base",
        isBackward ? "text-amber-400" : "text-muted-foreground",
      )}
      aria-hidden
    >
      {isBackward ? "←" : isForwardAdjacent ? "→" : "⇢"}
    </span>
  );
};

/**
 * The linked-list analogue of {@link WalkthroughDiagram}: a stack of curated chain snapshots, one per step.
 * Each frame draws node boxes joined by `next` arrows ending in a `null` terminator, with labeled pointer
 * arrows above the nodes they reference, reversed links drawn backward (for in-place rewires), and removed
 * nodes dimmed/struck. Server-rendered, no client JS — same posture as the 1-D walkthrough. Use for
 * singly-linked-list problems (reversal, fast/slow midpoint, splice/remove).
 */
export const NodeChainDiagram = ({ section }: { section: ListWalkthroughSection }) => {
  const color = buildColorMap(section.frames);
  const colorOf: ColorOf = (name) => color.get(name) ?? POINTER_PALETTE[0];
  const n = section.nodes.length;

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card/40 p-4 sm:p-5">
      {section.frames.map((frame, frameIndex) => {
        const pointersAt = (at: number | null) =>
          (frame.pointers ?? []).filter((pointer) => pointer.at === at);
        return (
          <div
            key={frameIndex}
            className="space-y-2 border-t border-dashed border-border/70 pt-5 first:border-0 first:pt-0"
          >
            <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
              <div className="flex items-end gap-1">
                {section.nodes.map((value, i) => {
                  const marked = frame.marked?.includes(i);
                  const active = frame.active?.includes(i);
                  const target = targetOf(frame, i, n);
                  return (
                    <div key={i} className="flex items-end">
                      <div className="flex flex-col items-center gap-1">
                        <PointerStack pointers={pointersAt(i)} colorOf={colorOf} />
                        <span
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full border font-mono text-sm",
                            active && "border-primary/50 bg-primary/15 font-semibold text-primary",
                            marked && "border-border bg-muted/20 text-muted-foreground/60 line-through",
                            !active && !marked && "border-border bg-muted/40 text-foreground",
                          )}
                        >
                          {value}
                        </span>
                        {section.showIndices && (
                          <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="min-h-9" aria-hidden />
                        <span className="flex h-10 items-center">
                          <LinkArrow from={i} to={target} />
                        </span>
                        {section.showIndices && <span className="text-[10px]">&nbsp;</span>}
                      </div>
                    </div>
                  );
                })}
                {/* The null terminator — a pointer (e.g. prev) can park here via `at: null`. */}
                <div className="flex flex-col items-center gap-1">
                  <PointerStack pointers={pointersAt(null)} colorOf={colorOf} />
                  <span className="flex h-10 items-center justify-center px-1 font-mono text-xs text-muted-foreground/60">
                    null
                  </span>
                  {section.showIndices && <span className="text-[10px]">&nbsp;</span>}
                </div>
              </div>

              {frame.action && (
                <span className="rounded-md border border-dashed border-border bg-muted/20 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                  {frame.action}
                </span>
              )}
            </div>

            {frame.caption && <p className="text-xs text-muted-foreground">{frame.caption}</p>}
          </div>
        );
      })}
    </div>
  );
};
