import type { Section } from "@/learn/data/topic";
import { cn } from "@/lib/utils";

type PartitionSection = Extract<Section, { kind: "partitionWalkthrough" }>;

const fmt = (value: number) => (value === Infinity ? "+∞" : value === -Infinity ? "−∞" : String(value));

/** Fixed colors for the cut-axis pointers — the search bounds (`lo`/`hi`) and the probe (`mid`). */
const AXIS_COLORS: Record<string, { pill: string; arrow: string }> = {
  lo: { pill: "border-orange-500/60 bg-orange-500/15 text-orange-300", arrow: "text-orange-400" },
  hi: { pill: "border-sky-500/60 bg-sky-500/15 text-sky-300", arrow: "text-sky-400" },
  mid: { pill: "border-violet-500/60 bg-violet-500/15 text-violet-300", arrow: "text-violet-400" },
};

/** The vertical cut line drawn at a row's partition boundary, tagged with which cut it is (`cut1` / `cut2`). */
const CutLine = ({ label }: { label: string }) => (
  <span className="mx-1 flex flex-col items-center self-stretch">
    <span className="w-px flex-1 bg-primary/70" aria-hidden />
    <span className="mt-1 font-mono text-[9px] leading-none text-primary/80">{label}</span>
  </span>
);

/**
 * Renders a binary search on a partition across two (or more) sorted rows — the visual a 1-D lane can't carry,
 * because the insight is a *cross-row* comparison (`maxLeft ≤ minRight`) driven by a search over the cut. When a
 * frame supplies `search`, a **cut axis** sits above the rows showing the `[lo, hi]` candidate range halving
 * (so the binary search is visible, not mistaken for two pointers); the rows below show the partition that the
 * probed cut induces, with boundary cells ringed and the derived verdict beneath. Used by median-of-two-sorted-arrays.
 */
export const PartitionDiagram = ({ section }: { section: PartitionSection }) => {
  const searchedRow = section.rows[0];
  const candidates = Array.from({ length: searchedRow.values.length + 1 }, (_, index) => index);

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card/40 p-4 sm:p-5">
      {section.frames.map((frame, frameIndex) => {
        const bounds = section.rows.map((row, rowIndex) => {
          const cut = frame.cuts[rowIndex] ?? 0;
          return {
            maxLeft: cut > 0 ? row.values[cut - 1] : -Infinity,
            minRight: cut < row.values.length ? row.values[cut] : Infinity,
          };
        });
        const maxLeft = Math.max(...bounds.map((bound) => bound.maxLeft));
        const minRight = Math.min(...bounds.map((bound) => bound.minRight));
        const valid = maxLeft <= minRight;

        const search = frame.search;
        const axisPointers = search
          ? ([["lo", search.lo], ["hi", search.hi], ["mid", frame.cuts[0]]] as const)
          : [];

        return (
          <div
            key={frameIndex}
            className="space-y-3 border-t border-dashed border-border/70 pt-5 first:border-0 first:pt-0"
          >
            {search && (
              <div className="flex items-end gap-2">
                <span className="w-16 shrink-0 pb-5 text-right font-mono text-[11px] leading-tight text-muted-foreground">
                  cut in {searchedRow.label}
                </span>
                <div className="flex items-end gap-1">
                  {candidates.map((candidate) => {
                    const here = axisPointers.filter(([, at]) => at === candidate);
                    const discarded = candidate < search.lo || candidate > search.hi;
                    const isMid = candidate === frame.cuts[0];
                    return (
                      <div key={candidate} className="flex flex-col items-center gap-1">
                        <div className="flex min-h-8 items-end justify-center gap-1">
                          {here.map(([name]) => (
                            <span key={name} className="flex flex-col items-center gap-0.5">
                              <span className={cn("rounded border px-1 font-mono text-[10px] leading-tight", AXIS_COLORS[name].pill)}>
                                {name}
                              </span>
                              <span className={cn("text-[11px] leading-none", AXIS_COLORS[name].arrow)}>↓</span>
                            </span>
                          ))}
                        </div>
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded-md border font-mono text-xs",
                            isMid && !discarded && "border-violet-500/50 bg-violet-500/15 font-semibold text-violet-200",
                            discarded && "border-border bg-muted/20 text-muted-foreground/50 line-through",
                            !isMid && !discarded && "border-border bg-muted/40 text-foreground",
                          )}
                        >
                          {candidate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="space-y-1.5">
                {section.rows.map((row, rowIndex) => {
                  const cut = frame.cuts[rowIndex] ?? 0;
                  return (
                    <div key={rowIndex} className="flex items-end gap-2">
                      <span className="w-16 shrink-0 pb-3 text-right font-mono text-[11px] text-muted-foreground">
                        {row.label}
                      </span>
                      <div className="flex items-stretch gap-1">
                        {row.values.map((value, cellIndex) => {
                          const isLeft = cellIndex < cut;
                          const isBoundary = cellIndex === cut - 1 || cellIndex === cut;
                          return (
                            <span key={cellIndex} className="flex items-stretch">
                              {cellIndex === cut && <CutLine label={`cut${rowIndex + 1}`} />}
                              <span className="flex flex-col items-center gap-1">
                                <span
                                  className={cn(
                                    "flex size-10 items-center justify-center rounded-md border font-mono text-sm",
                                    isLeft
                                      ? "border-primary/40 bg-primary/10 text-foreground"
                                      : "border-border bg-muted/40 text-muted-foreground",
                                    isBoundary && "ring-1 ring-primary/60",
                                  )}
                                >
                                  {value}
                                </span>
                                {section.showIndices && (
                                  <span className="font-mono text-[10px] text-muted-foreground">{cellIndex}</span>
                                )}
                              </span>
                            </span>
                          );
                        })}
                        {cut === row.values.length && <CutLine label={`cut${rowIndex + 1}`} />}
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

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              <span>maxLeft = {fmt(maxLeft)}</span>
              <span>minRight = {fmt(minRight)}</span>
              <span
                className={cn(
                  "rounded border px-1.5 py-0.5",
                  valid
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/50 bg-rose-500/10 text-rose-300",
                )}
              >
                {fmt(maxLeft)} {valid ? "≤" : ">"} {fmt(minRight)} {valid ? "✓ valid cut" : "✗"}
              </span>
            </div>

            {frame.caption && <p className="text-xs text-muted-foreground">{frame.caption}</p>}
          </div>
        );
      })}
    </div>
  );
};
