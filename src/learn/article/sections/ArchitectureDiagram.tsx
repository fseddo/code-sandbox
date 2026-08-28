import type { ArchitectureTier, Section } from "@/learn/data/topic";

type ArchitectureSection = Extract<Section, { kind: "architecture" }>;

const TIER_ORDER: readonly ArchitectureTier[] = ["client", "edge", "service", "data"];
const TIER_LABEL: Record<ArchitectureTier, string> = {
  client: "Client",
  edge: "Edge",
  service: "Service",
  data: "Data",
};

const BOX_W = 136;
const BOX_H = 50;
const COL_GAP = 76;
const ROW_GAP = 18;
const HEADER_H = 20;
const PAD = 10;

/** Greedy word wrap to at most two lines, so a long node label doesn't overflow its box (SVG text can't wrap). */
const wrap = (text: string, maxChars: number) => {
  const lines: string[] = [""];
  for (const word of text.split(" ")) {
    const line = lines[lines.length - 1];
    if (!line) lines[lines.length - 1] = word;
    else if (line.length + 1 + word.length <= maxChars) lines[lines.length - 1] = `${line} ${word}`;
    else lines.push(word);
  }
  return lines.slice(0, 2);
};

/**
 * A layered box-and-arrow topology: authors give nodes a `tier` and the renderer columns them left→right,
 * so no coordinates are ever authored. Distinct from the `graph` kind, which lays nodes on a circle for
 * graph *algorithms* and reads as noise for a system diagram.
 */
export const ArchitectureDiagram = ({ section }: { section: ArchitectureSection }) => {
  const columns = TIER_ORDER.map((tier) => ({
    tier,
    nodes: section.nodes.filter((node) => node.tier === tier),
  })).filter((column) => column.nodes.length > 0);

  const rowCount = Math.max(...columns.map((column) => column.nodes.length));
  const bodyH = rowCount * BOX_H + (rowCount - 1) * ROW_GAP;
  const width = columns.length * BOX_W + (columns.length - 1) * COL_GAP + PAD * 2;
  const height = HEADER_H + bodyH + PAD * 2;

  const placed = new Map(
    columns.flatMap((column, columnIndex) => {
      const columnH = column.nodes.length * BOX_H + (column.nodes.length - 1) * ROW_GAP;
      const top = HEADER_H + PAD + (bodyH - columnH) / 2;
      return column.nodes.map((node, rowIndex) => [
        node.id,
        { node, x: PAD + columnIndex * (BOX_W + COL_GAP), y: top + rowIndex * (BOX_H + ROW_GAP) },
      ] as const);
    }),
  );

  return (
    <figure className="flex flex-col items-center gap-2 text-center">
      {section.heading && <h4 className="text-sm font-medium text-foreground">{section.heading}</h4>}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-3xl" role="img" aria-label="Architecture diagram">
        <defs>
          <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-border" />
          </marker>
        </defs>

        {columns.map((column, index) => (
          <text
            key={column.tier}
            x={PAD + index * (BOX_W + COL_GAP) + BOX_W / 2}
            y={PAD + 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[0.5rem] font-semibold uppercase tracking-widest"
          >
            {TIER_LABEL[column.tier]}
          </text>
        ))}

        {section.edges.map((edge) => {
          const a = placed.get(edge.from);
          const b = placed.get(edge.to);
          if (!a || !b) return null;

          // Same column → route vertically between the boxes; otherwise horizontally, side to facing side.
          const vertical = a.x === b.x;
          const start = vertical
            ? { x: a.x + BOX_W / 2, y: a.y < b.y ? a.y + BOX_H : a.y }
            : { x: a.x < b.x ? a.x + BOX_W : a.x, y: a.y + BOX_H / 2 };
          const end = vertical
            ? { x: b.x + BOX_W / 2, y: a.y < b.y ? b.y : b.y + BOX_H }
            : { x: a.x < b.x ? b.x : b.x + BOX_W, y: b.y + BOX_H / 2 };
          const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };

          return (
            <g key={`${edge.from}-${edge.to}-${edge.label ?? ""}`}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                className="stroke-border"
                strokeWidth={1.5}
                strokeDasharray={edge.dashed ? "4 3" : undefined}
                markerEnd="url(#arch-arrow)"
              />
              {edge.label && (
                <>
                  <rect
                    x={mid.x - (edge.label.length * 2.6 + 4)}
                    y={mid.y - 12}
                    width={edge.label.length * 5.2 + 8}
                    height={11}
                    rx={2}
                    className="fill-background"
                  />
                  <text x={mid.x} y={mid.y - 4} textAnchor="middle" className="fill-muted-foreground text-[0.45rem]">
                    {edge.label}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {[...placed.values()].map(({ node, x, y }) => {
          const lines = wrap(node.label, 20);
          const rows = lines.length + (node.note ? 1 : 0);
          const first = y + BOX_H / 2 - (rows - 1) * 5.5;
          return (
            <g key={node.id}>
              <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={6} className="fill-muted/50 stroke-border" strokeWidth={1.5} />
              {lines.map((line, index) => (
                <text
                  key={index}
                  x={x + BOX_W / 2}
                  y={first + index * 11}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-foreground text-[0.55rem] font-semibold"
                >
                  {line}
                </text>
              ))}
              {node.note && (
                <text
                  x={x + BOX_W / 2}
                  y={first + lines.length * 11}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-muted-foreground text-[0.5rem]"
                >
                  {node.note}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {section.caption && <figcaption className="max-w-lg text-xs text-muted-foreground">{section.caption}</figcaption>}
    </figure>
  );
};
