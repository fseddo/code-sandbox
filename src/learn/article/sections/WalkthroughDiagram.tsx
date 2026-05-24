import type { Section, WalkthroughFrame } from "@/learn/data/topic";
import { cn } from "@/lib/utils";

type WalkthroughSection = Extract<Section, { kind: "walkthrough" }>;

/**
 * Pointer colors, keyed by first-appearance order so a pointer (`left`, `right`, `slow`…) keeps one color
 * across every frame. Full class strings — written out so Tailwind's scanner keeps them.
 */
const POINTER_PALETTE = [
  { pill: "border-orange-500/60 bg-orange-500/15 text-orange-300", arrow: "text-orange-400" },
  { pill: "border-sky-500/60 bg-sky-500/15 text-sky-300", arrow: "text-sky-400" },
  { pill: "border-violet-500/60 bg-violet-500/15 text-violet-300", arrow: "text-violet-400" },
  { pill: "border-emerald-500/60 bg-emerald-500/15 text-emerald-300", arrow: "text-emerald-400" },
] as const;

/** Assign each distinct pointer name a stable palette slot by the order it first appears across frames. */
const buildColorMap = (frames: WalkthroughFrame[]) => {
  const map = new Map<string, (typeof POINTER_PALETTE)[number]>();
  for (const frame of frames) {
    for (const { name } of frame.pointers ?? []) {
      if (!map.has(name)) map.set(name, POINTER_PALETTE[map.size % POINTER_PALETTE.length]);
    }
  }
  return map;
};

const inRange = (index: number, range?: [number, number]) =>
  range !== undefined && index >= range[0] && index <= range[1];

export const WalkthroughDiagram = ({ section }: { section: WalkthroughSection }) => {
  const colorOf = buildColorMap(section.frames);

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card/40 p-4 sm:p-5">
      {section.frames.map((frame, frameIndex) => (
        <div
          key={frameIndex}
          className="space-y-2 border-t border-dashed border-border/70 pt-5 first:border-0 first:pt-0"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-end gap-1.5">
              {section.lane.map((value, cellIndex) => {
                const pointers = (frame.pointers ?? []).filter((pointer) => pointer.at === cellIndex);
                const marked = frame.marked?.includes(cellIndex);
                const windowed = inRange(cellIndex, frame.range);
                return (
                  <div key={cellIndex} className="flex flex-col items-center gap-1">
                    <div className="flex min-h-9 items-end justify-center gap-1">
                      {pointers.map((pointer) => {
                        const color = colorOf.get(pointer.name) ?? POINTER_PALETTE[0];
                        return (
                          <span key={pointer.name} className="flex flex-col items-center gap-0.5">
                            <span
                              className={cn(
                                "rounded border px-1 font-mono text-[10px] leading-tight",
                                color.pill,
                              )}
                            >
                              {pointer.name}
                            </span>
                            <span className={cn("text-[11px] leading-none", color.arrow)}>↓</span>
                          </span>
                        );
                      })}
                    </div>
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-md border font-mono text-sm",
                        windowed && "border-primary/50 bg-primary/15 font-semibold text-primary",
                        marked && "border-border bg-muted/20 text-muted-foreground/60 line-through",
                        !windowed && !marked && "border-border bg-muted/40 text-foreground",
                      )}
                    >
                      {value}
                    </span>
                    {section.showIndices && (
                      <span className="font-mono text-[10px] text-muted-foreground">{cellIndex}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {frame.action && (
              <span className="rounded-md border border-dashed border-border bg-muted/20 px-3 py-1.5 font-mono text-xs text-muted-foreground">
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
