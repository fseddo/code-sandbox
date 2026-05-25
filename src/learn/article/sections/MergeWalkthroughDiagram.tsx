import type { MergeWalkthroughFrame, Section } from "@/learn/data/topic";
import { cn } from "@/lib/utils";

type MergeWalkthroughSection = Extract<Section, { kind: "mergeWalkthrough" }>;

/**
 * Per-list colors, keyed by row order so each list keeps one color across every frame and its frontier
 * cell, row label, and heap pill all read as the same lane. Same palette/posture as {@link WalkthroughDiagram}.
 * Full class strings so Tailwind's scanner keeps them.
 */
const LIST_PALETTE = [
  { cell: "border-orange-500/60 bg-orange-500/15 text-orange-200", label: "text-orange-300", pill: "border-orange-500/60 bg-orange-500/15 text-orange-200" },
  { cell: "border-sky-500/60 bg-sky-500/15 text-sky-200", label: "text-sky-300", pill: "border-sky-500/60 bg-sky-500/15 text-sky-200" },
  { cell: "border-violet-500/60 bg-violet-500/15 text-violet-200", label: "text-violet-300", pill: "border-violet-500/60 bg-violet-500/15 text-violet-200" },
  { cell: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200", label: "text-emerald-300", pill: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200" },
] as const;

const colorOf = (row: number) => LIST_PALETTE[row % LIST_PALETTE.length];

/** The heap candidates this frame — each non-drained list's frontier value, tagged with its row for coloring. */
const heapCandidates = (section: MergeWalkthroughSection, frame: MergeWalkthroughFrame) =>
  frame.cursors
    .map((cursor, row) => (cursor === null ? null : { row, value: section.lists[row].values[cursor] }))
    .filter((candidate): candidate is { row: number; value: string | number } => candidate !== null);

/**
 * The k-way merge analogue of {@link WalkthroughDiagram}: the `k` input lists stacked as rows, each with a
 * single frontier cell (consumed cells dimmed/struck), the derived **heap** of those frontier values, and a
 * growing **result** lane. The set of frontier cells *is* the heap, so the heap strip and chosen minimum are
 * derived from `cursors` — they can't drift from the picture. Server-rendered, no client JS.
 */
export const MergeWalkthroughDiagram = ({ section }: { section: MergeWalkthroughSection }) => (
  <div className="space-y-5 rounded-lg border border-border bg-card/40 p-4 sm:p-5">
    {section.frames.map((frame, frameIndex) => {
      const candidates = heapCandidates(section, frame);
      return (
        <div
          key={frameIndex}
          className="space-y-3 border-t border-dashed border-border/70 pt-5 first:border-0 first:pt-0"
        >
          <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
            <div className="space-y-1.5">
              {section.lists.map((list, row) => {
                const cursor = frame.cursors[row];
                const color = colorOf(row);
                return (
                  <div key={row} className="flex items-center gap-2">
                    <span className={cn("w-14 shrink-0 font-mono text-xs", color.label)}>{list.label}</span>
                    <div className="flex items-center gap-1">
                      {list.values.map((value, cellIndex) => {
                        const consumed = cursor === null || cellIndex < cursor;
                        const isFrontier = cursor !== null && cellIndex === cursor;
                        const isPopped = isFrontier && frame.popped === row;
                        return (
                          <span
                            key={cellIndex}
                            className={cn(
                              "flex size-9 items-center justify-center rounded-md border font-mono text-sm",
                              consumed && "border-border bg-muted/20 text-muted-foreground/50 line-through",
                              isFrontier && !isPopped && color.cell,
                              isPopped && "border-primary/70 bg-primary/20 font-semibold text-primary ring-1 ring-primary/40",
                              !consumed && !isFrontier && "border-border bg-muted/40 text-foreground",
                            )}
                          >
                            {value}
                          </span>
                        );
                      })}
                    </div>
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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">heap</span>
              <div className="flex items-center gap-1">
                {candidates.length === 0 ? (
                  <span className="font-mono text-xs text-muted-foreground/60">empty</span>
                ) : (
                  candidates.map(({ row, value }) => (
                    <span
                      key={row}
                      className={cn(
                        "rounded border px-1.5 py-0.5 font-mono text-xs",
                        colorOf(row).pill,
                        frame.popped === row && "ring-1 ring-primary/50",
                      )}
                    >
                      {value}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">result</span>
              <div className="flex items-center gap-1">
                {frame.result.length === 0 ? (
                  <span className="font-mono text-xs text-muted-foreground/60">empty</span>
                ) : (
                  frame.result.map((value, resultIndex) => (
                    <span
                      key={resultIndex}
                      className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/40 font-mono text-xs text-foreground"
                    >
                      {value}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {frame.caption && <p className="text-xs text-muted-foreground">{frame.caption}</p>}
        </div>
      );
    })}
  </div>
);
