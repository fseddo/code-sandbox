import type { Section } from "@/learn/data/topic";

type GraphSection = Extract<Section, { kind: "graph" }>;

const SIZE = 220;
const NODE_R = 16;
const CENTER = SIZE / 2;
const RING_R = SIZE / 2 - 34;

/** Lay nodes evenly on a circle (12 o'clock first, clockwise) so authors supply only ids + edges. */
const layout = (nodes: string[]) =>
  new Map(
    nodes.map((id, index) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * index) / nodes.length;
      return [id, { x: CENTER + RING_R * Math.cos(angle), y: CENTER + RING_R * Math.sin(angle) }];
    }),
  );

export const GraphDiagram = ({ section }: { section: GraphSection }) => {
  const positions = layout(section.nodes);

  return (
    <figure className="flex flex-col items-center gap-2 text-center">
      {section.heading && <h4 className="text-sm font-medium text-foreground">{section.heading}</h4>}
      <div className="flex h-56 items-center justify-center">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-55 max-w-full text-muted-foreground"
          role="img"
          aria-label="Graph diagram"
        >
        {section.directed && (
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" className="fill-current" />
            </marker>
          </defs>
        )}

        {section.edges.map(([from, to]) => {
          const a = positions.get(from);
          const b = positions.get(to);
          if (!a || !b) return null;
          // Trim each endpoint back to the node's edge so lines (and arrowheads) sit outside the circles.
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x + ux * NODE_R}
              y1={a.y + uy * NODE_R}
              x2={b.x - ux * NODE_R}
              y2={b.y - uy * NODE_R}
              className="stroke-border"
              strokeWidth={1.5}
              markerEnd={section.directed ? "url(#arrow)" : undefined}
            />
          );
        })}

        {section.nodes.map((id) => {
          const point = positions.get(id);
          if (!point) return null;
          return (
            <g key={id}>
              <circle cx={point.x} cy={point.y} r={NODE_R} className="fill-primary/15 stroke-primary" strokeWidth={1.5} />
              <text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-primary text-[0.7rem] font-semibold"
              >
                {id}
              </text>
            </g>
          );
        })}
        </svg>
      </div>
      {section.caption && (
        <figcaption className="max-w-60 text-xs text-muted-foreground">{section.caption}</figcaption>
      )}
    </figure>
  );
};
