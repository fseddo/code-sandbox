import type { Section } from "@/learn/data/topic";

type SequenceSection = Extract<Section, { kind: "sequence" }>;

const ACTOR_W = 118;
const ACTOR_GAP = 44;
const PITCH = ACTOR_W + ACTOR_GAP;
const HEADER_H = 30;
const STEP_H = 48;
const SELF_W = 34;
const PAD = 10;

/**
 * Lifelines and ordered messages — the kind for anything whose point is that step 3 precedes step 4
 * (handshakes, commit protocols, consensus rounds, auth flows). `from === to` draws a self-call.
 */
export const SequenceDiagram = ({ section }: { section: SequenceSection }) => {
  const centerOf = (actor: string) => {
    const index = section.actors.indexOf(actor);
    return index < 0 ? undefined : PAD + index * PITCH + ACTOR_W / 2;
  };

  const width = PAD * 2 + section.actors.length * ACTOR_W + (section.actors.length - 1) * ACTOR_GAP;
  const bodyTop = PAD + HEADER_H + 22;
  const height = bodyTop + section.steps.length * STEP_H + PAD;

  return (
    <figure className="flex flex-col items-center gap-2 text-center">
      {section.heading && <h4 className="text-sm font-medium text-foreground">{section.heading}</h4>}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-3xl" role="img" aria-label="Sequence diagram">
        <defs>
          <marker id="seq-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-border" />
          </marker>
        </defs>

        {section.actors.map((actor, index) => {
          const x = PAD + index * PITCH;
          const center = x + ACTOR_W / 2;
          return (
            <g key={actor}>
              <rect x={x} y={PAD} width={ACTOR_W} height={HEADER_H} rx={6} className="fill-muted/50 stroke-border" strokeWidth={1.5} />
              <text x={center} y={PAD + HEADER_H / 2} textAnchor="middle" dominantBaseline="central" className="fill-foreground text-[0.55rem] font-semibold">
                {actor}
              </text>
              <line x1={center} y1={PAD + HEADER_H} x2={center} y2={height - PAD} className="stroke-border" strokeWidth={1} strokeDasharray="3 4" />
            </g>
          );
        })}

        {section.steps.map((step, index) => {
          const from = centerOf(step.from);
          const to = centerOf(step.to);
          if (from === undefined || to === undefined) return null;
          const y = bodyTop + index * STEP_H;
          const stroke = step.dashed ? "4 3" : undefined;

          if (from === to) {
            return (
              <g key={index}>
                <path
                  d={`M ${from} ${y} H ${from + SELF_W} V ${y + 15} H ${from + 7}`}
                  fill="none"
                  className="stroke-border"
                  strokeWidth={1.5}
                  strokeDasharray={stroke}
                  markerEnd="url(#seq-arrow)"
                />
                <text x={from + SELF_W + 6} y={y + 4} className="fill-foreground text-[0.5rem]">
                  {step.label}
                </text>
                {step.note && (
                  <text x={from + SELF_W + 6} y={y + 16} className="fill-muted-foreground text-[0.45rem]">
                    {step.note}
                  </text>
                )}
              </g>
            );
          }

          const direction = to > from ? 1 : -1;
          return (
            <g key={index}>
              <line
                x1={from + direction * 3}
                y1={y}
                x2={to - direction * 4}
                y2={y}
                className="stroke-border"
                strokeWidth={1.5}
                strokeDasharray={stroke}
                markerEnd="url(#seq-arrow)"
              />
              <text x={(from + to) / 2} y={y - 5} textAnchor="middle" className="fill-foreground text-[0.5rem]">
                {step.label}
              </text>
              {step.note && (
                <text x={(from + to) / 2} y={y + 11} textAnchor="middle" className="fill-muted-foreground text-[0.45rem]">
                  {step.note}
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
