import type { IoShape } from "@/problems/data/problem";
import { BoardGrid, isScalarGrid } from "@/components/dataViews/BoardGrid";
import { NodeChain } from "@/components/dataViews/NodeChain";
import { TreeView } from "@/components/dataViews/TreeView";

const format = (value: unknown) => JSON.stringify(value);

/** An arg/result we draw as a node chain: a `linked-list`-typed value that actually arrived as an array. */
const isListValue = (value: unknown, shape: IoShape | undefined): value is (string | number)[] =>
  shape === "linked-list" && Array.isArray(value);

/** An arg/result we draw as a tree: a `binary-tree`-typed value, which arrives as a level-order array. */
const isTreeValue = (value: unknown, shape: IoShape | undefined): value is (number | string | null)[] =>
  shape === "binary-tree" && Array.isArray(value);

/**
 * Render a call's argument tuple. When any argument is a matrix (a Sudoku board, a 0-1 grid) or a
 * `linked-list` the whole tuple lays out as labelled blocks — grids drawn as a board, lists shown raw
 * with a node-chain render beneath; otherwise it stays the compact inline `name = value, …` line. The
 * list/grid shape comes from `paramShapes` (the problem's io), since a list `head` and a plain `nums`
 * array share the same value shape. Shared by the guide's Example/Test-case cells and the problem page.
 */
export const ArgValues = ({
  args,
  paramNames,
  paramShapes,
}: {
  args: unknown[];
  paramNames: string[];
  paramShapes?: IoShape[];
}) => {
  const label = (index: number) => paramNames[index] ?? `arg${index + 1}`;
  const needsBlocks = args.some(
    (arg, i) => isScalarGrid(arg) || isListValue(arg, paramShapes?.[i]) || isTreeValue(arg, paramShapes?.[i]),
  );
  if (!needsBlocks) {
    return <>{args.map((arg, i) => `${label(i)} = ${format(arg)}`).join(", ")}</>;
  }
  return (
    <span className="flex flex-col gap-2">
      {args.map((arg, i) => {
        if (isScalarGrid(arg)) {
          return (
            <span key={i} className="flex flex-col gap-1">
              <span className="text-muted-foreground">{label(i)} =</span>
              <BoardGrid grid={arg} />
            </span>
          );
        }
        if (isListValue(arg, paramShapes?.[i])) {
          return (
            <span key={i} className="flex flex-col gap-1">
              <span>
                <span className="text-muted-foreground">{label(i)} = </span>
                {format(arg)}
              </span>
              <NodeChain values={arg} />
            </span>
          );
        }
        if (isTreeValue(arg, paramShapes?.[i])) {
          return (
            <span key={i} className="flex flex-col gap-1">
              <span>
                <span className="text-muted-foreground">{label(i)} = </span>
                {format(arg)}
              </span>
              <TreeView values={arg} />
            </span>
          );
        }
        return (
          <span key={i}>
            <span className="text-muted-foreground">{label(i)} = </span>
            {format(arg)}
          </span>
        );
      })}
    </span>
  );
};

/**
 * Render a call's result. A `linked-list` result shows raw with a node-chain beneath, a `binary-tree` result
 * with a tree beneath (serialize round-trips a tree); everything else is raw.
 */
export const ResultValue = ({ value, shape }: { value: unknown; shape?: IoShape }) => {
  if (isListValue(value, shape)) {
    return (
      <span className="flex flex-col gap-1">
        <span>{format(value)}</span>
        <NodeChain values={value} />
      </span>
    );
  }
  if (isTreeValue(value, shape)) {
    return (
      <span className="flex flex-col gap-1">
        <span>{format(value)}</span>
        <TreeView values={value} />
      </span>
    );
  }
  return <>{format(value)}</>;
};
