import type { Section } from "@/learn/data/topic";
import { renderInline } from "./renderInline";

type NumbersSection = Extract<Section, { kind: "numbers" }>;

/**
 * A back-of-envelope estimate table. The `derivation` column is the point of the kind: a figure a reader
 * can't reproduce is a figure they can't defend, so the arithmetic (or the source) travels with the value.
 */
export const NumbersTable = ({ section }: { section: NumbersSection }) => (
  <figure className="space-y-2">
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Quantity</th>
            <th className="px-3 py-2 font-medium">Value</th>
            <th className="px-3 py-2 font-medium">Derivation</th>
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row) => (
            <tr key={row.quantity} className="border-b border-border align-top last:border-0">
              <th scope="row" className="bg-muted/20 px-3 py-2 text-left font-semibold text-foreground">
                {renderInline(row.quantity)}
              </th>
              <td className="whitespace-nowrap px-3 py-2">
                {/* The value is what the row exists to deliver — tinted so it reads before the arithmetic. */}
                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-foreground">
                  {row.value}
                </span>
              </td>
              <td className="px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                {row.derivation && renderInline(row.derivation)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {section.caption && <figcaption className="text-xs text-muted-foreground">{section.caption}</figcaption>}
  </figure>
);
