import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GridCell = string | number;

/**
 * True for a rectangular 2-D array of scalars — the shape we draw as a board instead of dumping as JSON.
 * Guards the Example / Test-case renderers so a matrix arg (a Sudoku board, a 0-1 grid) becomes a grid.
 */
export const isScalarGrid = (value: unknown): value is GridCell[][] =>
  Array.isArray(value) &&
  value.length > 0 &&
  Array.isArray(value[0]) &&
  value.every(
    (row) =>
      Array.isArray(row) &&
      row.length === (value[0] as unknown[]).length &&
      row.every((cell) => typeof cell === "string" || typeof cell === "number"),
  );

/** Per-cell visual state a caller can layer on (the walkthrough cursor/marked cells); plain cells pass nothing. */
export type CellState = { cursor?: boolean; marked?: boolean; active?: boolean };

const cellClasses = (value: GridCell, state: CellState) => {
  const isEmpty = value === "." || value === 0;
  return cn(
    "flex size-7 items-center justify-center rounded border font-mono text-xs sm:size-8",
    !state.cursor && !state.marked && !state.active && "border-border bg-muted/40",
    isEmpty && !state.cursor && !state.marked && !state.active && "text-muted-foreground/40",
    state.active && "border-primary/50 bg-primary/15 font-semibold text-primary",
    state.marked && "border-rose-500/50 bg-rose-500/15 text-rose-300",
    state.cursor && "border-orange-500/70 bg-orange-500/20 font-semibold text-orange-200 ring-1 ring-orange-400/50",
  );
};

const indexLabel = "flex size-7 items-center justify-center font-mono text-[10px] text-muted-foreground sm:size-8";

/**
 * Renders a 2-D array as an aligned grid of cells. The reusable board primitive behind matrix Examples,
 * matrix Test-case inputs, and the stepwise grid walkthrough. `stateFor` lets a caller tint individual
 * cells (a walkthrough cursor, conflict/cleared cells) without this component knowing the algorithm.
 */
export const BoardGrid = ({
  grid,
  showIndices,
  stateFor,
}: {
  grid: GridCell[][];
  showIndices?: boolean;
  stateFor?: (row: number, col: number) => CellState;
}): ReactNode => {
  const cols = grid[0]?.length ?? 0;
  return (
    <div className="inline-flex flex-col gap-0.5">
      {showIndices && (
        <div className="flex gap-0.5">
          {/* corner spacer so the column header aligns with the row-labelled cells below */}
          <span className={indexLabel} aria-hidden />
          {Array.from({ length: cols }, (_, col) => (
            <span key={col} className={indexLabel}>
              {col}
            </span>
          ))}
        </div>
      )}
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-0.5">
          {showIndices && <span className={indexLabel}>{rowIndex}</span>}
          {row.map((value, colIndex) => (
            <span key={colIndex} className={cellClasses(value, stateFor?.(rowIndex, colIndex) ?? {})}>
              {value}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
