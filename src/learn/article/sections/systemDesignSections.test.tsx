import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Section } from "@/learn/data/topic";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { SequenceDiagram } from "./SequenceDiagram";
import { ComparisonTable } from "./ComparisonTable";
import { NumbersTable } from "./NumbersTable";

const arch = {
  kind: "architecture",
  heading: "Read path",
  nodes: [
    { id: "browser", label: "Browser", tier: "client" },
    { id: "cdn", label: "CDN edge", tier: "edge", note: "TTL 60s" },
    { id: "lb", label: "Load balancer", tier: "edge" },
    { id: "api", label: "API service", tier: "service" },
    { id: "cache", label: "Redis cache", tier: "data" },
    { id: "db", label: "Primary Postgres", tier: "data" },
  ],
  edges: [
    { from: "browser", to: "cdn", label: "GET" },
    { from: "cdn", to: "lb", label: "miss" },
    { from: "lb", to: "api" },
    { from: "api", to: "cache", label: "read" },
    { from: "cache", to: "db", label: "miss", dashed: true },
  ],
  caption: "A cache-aside read.",
} satisfies Section;

const seq = {
  kind: "sequence",
  actors: ["Client", "Coordinator", "Participant"],
  steps: [
    { from: "Client", to: "Coordinator", label: "commit()" },
    { from: "Coordinator", to: "Participant", label: "prepare", note: "phase 1" },
    { from: "Participant", to: "Participant", label: "write undo log" },
    { from: "Participant", to: "Coordinator", label: "vote yes", dashed: true },
    { from: "Coordinator", to: "Participant", label: "commit", note: "phase 2" },
  ],
} satisfies Section;

const cmp = {
  kind: "comparison",
  columns: ["", "TCP", "UDP"],
  rows: [
    { label: "Ordering", cells: ["Guaranteed", "None"] },
    { label: "Overhead", cells: ["`20`+ byte header", "`8` byte header"] },
  ],
} satisfies Section;

const nums = {
  kind: "numbers",
  rows: [
    { quantity: "Writes/sec", value: "1,150", derivation: "100M writes/day ÷ 86,400s" },
    { quantity: "Storage/year", value: "36 TB", derivation: "100M × 1 KB × 365" },
  ],
} satisfies Section;

describe("system design section renderers", () => {
  it("architecture lays out tiers left to right with finite geometry", () => {
    const html = renderToStaticMarkup(<ArchitectureDiagram section={arch} />);
    const viewBox = html.match(/viewBox="([^"]+)"/)?.[1] ?? "";
    expect(viewBox.split(" ").every((n) => Number.isFinite(Number(n)))).toBe(true);
    // 4 tier columns (136 wide, 76 apart) + padding; tallest column holds 2 nodes.
    expect(viewBox).toBe("0 0 792 158");
    for (const label of ["Browser", "CDN edge", "TTL 60s", "Load balancer", "Redis cache"]) {
      expect(html).toContain(label);
    }
    expect(html).toContain('stroke-dasharray="4 3"');
    expect(html).not.toContain("NaN");
  });

  it("sequence draws one lifeline per actor and a self-call", () => {
    const html = renderToStaticMarkup(<SequenceDiagram section={seq} />);
    expect(html.match(/stroke-dasharray="3 4"/g)).toHaveLength(3);
    expect(html).toContain("write undo log");
    expect(html).toContain("phase 2");
    expect(html).not.toContain("NaN");
  });

  it("comparison and numbers render their cells through the inline formatter", () => {
    const cmpHtml = renderToStaticMarkup(<ComparisonTable section={cmp} />);
    expect(cmpHtml).toContain("<code");
    expect(cmpHtml).toContain("Guaranteed");
    const numsHtml = renderToStaticMarkup(<NumbersTable section={nums} />);
    expect(numsHtml).toContain("36 TB");
    expect(numsHtml).toContain("100M writes/day ÷ 86,400s");
  });
});
