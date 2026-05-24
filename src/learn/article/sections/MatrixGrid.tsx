import { cn } from "@/lib/utils";
import type { Section } from "@/learn/data/topic";

type MatrixSection = Extract<Section, { kind: "matrix" }>;

const CornerCell = "size-9 border border-border text-xs font-medium";

export const MatrixGrid = ({ section }: { section: MatrixSection }) => (
  <figure className="flex flex-col items-center gap-2 text-center">
    {section.heading && <h4 className="text-sm font-medium text-foreground">{section.heading}</h4>}
    <div className="flex h-56 items-center justify-center">
      <table className="border-collapse text-center">
        <thead>
          <tr>
            <th className={cn(CornerCell, "bg-muted/40")} />
            {section.colLabels.map((label) => (
              <th key={label} className={cn(CornerCell, "bg-muted/40 text-muted-foreground")}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.cells.map((row, rowIndex) => (
            <tr key={section.rowLabels[rowIndex]}>
              <th className={cn(CornerCell, "bg-muted/40 text-muted-foreground")}>
                {section.rowLabels[rowIndex]}
              </th>
              {row.map((cell, colIndex) => {
                const on = cell === true || cell === 1;
                return (
                  <td
                    key={colIndex}
                    className={cn(
                      "size-9 border border-border font-mono text-sm",
                      on ? "bg-primary/15 font-semibold text-primary" : "text-muted-foreground",
                    )}
                  >
                    {typeof cell === "boolean" ? (cell ? "1" : "0") : cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {section.caption && (
      <figcaption className="max-w-60 text-xs text-muted-foreground">{section.caption}</figcaption>
    )}
  </figure>
);
