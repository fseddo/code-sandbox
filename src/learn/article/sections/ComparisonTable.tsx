import type { Section } from "@/learn/data/topic";
import { renderInline } from "./renderInline";

type ComparisonSection = Extract<Section, { kind: "comparison" }>;

/** A free-form X-vs-Y table — the non-Big-O counterpart to [ComplexityTable](./ComplexityTable.tsx). */
export const ComparisonTable = ({ section }: { section: ComparisonSection }) => (
  <figure className="space-y-2">
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {section.columns.map((column, index) => (
              <th key={index} className="px-3 py-2 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row) => (
            <tr key={row.label} className="border-b border-border align-top last:border-0">
              <th scope="row" className="bg-muted/20 px-3 py-2 text-left font-semibold text-foreground">
                {renderInline(row.label)}
              </th>
              {row.cells.map((cell, index) => (
                <td key={index} className="px-3 py-2 leading-relaxed text-muted-foreground">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {section.caption && <figcaption className="text-xs text-muted-foreground">{section.caption}</figcaption>}
  </figure>
);
