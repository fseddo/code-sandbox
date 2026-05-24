import type { Section } from "@/learn/data/topic";

type ComplexitySection = Extract<Section, { kind: "complexity" }>;

const Cost = ({ value }: { value: string }) => (
  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{value}</span>
);

export const ComplexityTable = ({ section }: { section: ComplexitySection }) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full text-left text-sm">
      <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
        <tr>
          <th className="px-3 py-2 font-medium">Operation</th>
          <th className="px-3 py-2 font-medium">Average</th>
          <th className="px-3 py-2 font-medium">Worst</th>
          <th className="px-3 py-2 font-medium">Note</th>
        </tr>
      </thead>
      <tbody>
        {section.rows.map((row) => (
          <tr key={row.operation} className="border-b border-border last:border-0">
            <td className="px-3 py-2 font-medium">{row.operation}</td>
            <td className="px-3 py-2">
              <Cost value={row.average} />
            </td>
            <td className="px-3 py-2">
              <Cost value={row.worst} />
            </td>
            <td className="px-3 py-2 text-xs text-muted-foreground">{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
