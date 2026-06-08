import type { GridCoord, GridWalkthroughFrame, Section } from "@/learn/data/topic";
import { BoardGrid, type CellState } from "@/components/dataViews/BoardGrid";

type GridWalkthroughSection = Extract<Section, { kind: "gridWalkthrough" }>;

const at = (coords: GridCoord[] | undefined, row: number, col: number) =>
  coords?.some(([r, c]) => r === row && c === col) ?? false;

/** Per-cell state for one frame: cursor wins, then marked, then active — matches BoardGrid's tint priority. */
const cellStateFor = (frame: GridWalkthroughFrame, row: number, col: number): CellState => ({
  cursor: frame.cursor?.[0] === row && frame.cursor?.[1] === col,
  marked: at(frame.marked, row, col),
  active: at(frame.active, row, col),
});

/**
 * The 2-D analogue of {@link WalkthroughDiagram}: a stack of curated board snapshots, one per step, each
 * tinting the cursor / flagged / active cells and carrying a decision + caption. Server-rendered, no client
 * JS — the same posture as the 1-D walkthrough. Use for grid problems (Sudoku validation, matrix striping).
 */
export const GridWalkthroughDiagram = ({ section }: { section: GridWalkthroughSection }) => (
  <div className="space-y-5 rounded-lg border border-border bg-card/40 p-4 sm:p-5">
    {section.frames.map((frame, frameIndex) => (
      <div
        key={frameIndex}
        className="space-y-3 border-t border-dashed border-border/70 pt-5 first:border-0 first:pt-0"
      >
        <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
          <BoardGrid
            grid={frame.grid ?? section.grid}
            showIndices={section.showIndices}
            stateFor={(row, col) => cellStateFor(frame, row, col)}
          />
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
