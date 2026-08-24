# Authoring a Learn topic — rubric

How to write a `LearnTopic` so it matches the depth of the two reference pages ([two-pointers](../../src/learn/data/topics/twoPointers.ts), [sliding-window](../../src/learn/data/topics/slidingWindow.ts)). The type model + renderers are described in [features/learn.md](learn.md); this doc is the *content* standard. Read it before deepening or adding a topic.

A topic is `parts → sections`. Render order and headings come from `ARTICLE_PARTS` — you supply only content per part, and omit any part that doesn't apply. The goal (from the ByteByteGo / Tech Interview Handbook benchmark, [improvements/learn-proposal.md](../improvements/learn-proposal.md)): **the whole idea lives on one page** — concept, a worked example you can *see*, the traps, and where to practice.

## Depth tiers

Not every topic needs every part on day one. Three acceptable states:

- **Stub** — `definition` + `whenToUse` only. Fine for a placeholder; shows in the catalog, reads as a definition card.
- **Core** — adds `implementation` + one worked `example` (with a `walkthrough` if it's a pointer/scan/table algorithm) + `practice`. This is the minimum bar for a "real" topic.
- **Full** — the reference standard: every applicable part below. Aim here for high-priority topics.

The `parts` model makes the gradient natural — a stub just omits parts. Don't fake depth; a short honest page beats padded prose.

## The parts, in render order

| Part | Use it for | Section kinds | Length |
| --- | --- | --- | --- |
| `definition` | What it is and the one-sentence cost model. Lead with the payoff. | `prose`, `complexity` | 1 short para |
| `operations` *(nested)* | Per-operation Big-O. Data structures, not techniques. | `complexity` | 1 table |
| `whenToUse` | The recognition cue — what in a prompt signals this tool. | `prose` | 1 para |
| `techniques` *(nested)* | The named variants (fixed/variable window; inward/fast-slow/staged). | `prose` | 1 para, **bold** each variant |
| `relatedStructures` *(nested)* | How it relates to a sibling topic; link with `[[slug]]`. | `prose` | 2–3 sentences |
| `implementation` | The reusable template, lightly commented. | `code` (+ `caption`) | 1 snippet |
| `example` | 1–3 *worked* problems: prose intuition → `walkthrough` → `code` → a closing complexity sentence. | `prose`, `walkthrough`, `code` | the centerpiece |
| `pitfalls` | The mistakes that cost interviews. | `callout` tone `warn` | 2–4 bullets |
| `cornerCases` | Inputs that break a naïve solution. | `callout` tone `info` | 3–5 bullets |
| `practice` | Bank problems to attempt. | `practice` | 2 essential + 2–4 recommended |
| `resources` | Curated external links — **must be real URLs**, not invented. | `resources` | 2–4 items |

## Section-kind rules

- **`walkthrough`** — the highest-value addition; include it whenever a value moves through a structure step by step (pointers, windows, DP-table fills, partitions). Keep it to **4–6 frames** — show the interesting transitions, not every iteration. Give each frame an `action` (the decision: `"sum < target → left++"`) *and* a `caption` (the why). Use `showIndices` for index-returning problems. Pointer `name`s stay consistent across frames so their colors stay stable; reuse `left`/`right`/`slow`/`fast`.
- **`callout`** — `warn` = pitfalls, `info` = corner cases, `tip` = an interview aside. Items are prose-lite (`` `code` ``, `*emphasis*`, `[[glossary]]` work). Don't restate the definition here — only what bites.
- **`practice`** — `essential` are the 1–2 must-dos (full rows with difficulty); `recommended` are broader follow-ups (chips). **Use ids that exist in the bank** (`src/problems/data/problems/`); an unknown id degrades to a dim chip, which reads as unfinished. If coverage is thin, that's a signal to import problems, not to invent ids.
- **`resources`** — `video` / `article` / `doc`. Only link pages you're confident resolve (MDN, NeetCode, Tech Interview Handbook). A 404 is worse than no link.
- **`prose`** — paragraphs split on blank lines; lead techniques/variants with a **bold** term. Cross-link sibling topics with `[[slug]]`.

## Metadata

- `priority`: `"high" | "mid" | "low"` — interview weight, **not** difficulty (difficulty belongs to the practice problems). Set it on every non-stub topic; it powers the catalog facet + study-plan ordering.
- `estimatedMinutes`: rough study time; feeds the study-plan budget. ~30 for a simple structure, 60–120 for a meaty technique.
- `tags`: reuse the problem taxonomy so the topic shares a vocabulary with the problems it links.
- `parent`: set this instead of writing a full standalone page when a topic is really a *facet* of one already covered elsewhere — e.g. BFS/DFS/Union-Find/Topological-Sort set `parent: "graphs"` because [graphs.ts](../../src/learn/data/topics/graphs.ts) already carries the shared 101 (representations, how the tools compare). A child page should skip re-deriving that ground and instead cover what the parent didn't have room for — its own variants/techniques, its own worked walkthrough, its own pitfalls — then link back with `[[parent-slug]]` for the basics. See [features/learn.md](learn.md) for how this renders (catalog nesting + a "Part of {parent}" link on the child's page).

## Skeleton

```ts
import type { LearnTopic } from "@/learn/data/topic";

export const myTopic = {
  slug: "my-topic",
  title: "My topic",
  category: "algorithms",
  summary: "One line — the payoff, for the catalog card + search.",
  tags: ["..."],
  priority: "high",
  estimatedMinutes: 60,
  parts: {
    definition: [{ kind: "prose", body: "What it is + the cost model." }],
    whenToUse: [{ kind: "prose", body: "The recognition cue." }],
    techniques: [{ kind: "prose", body: "**Variant A** — … **Variant B** — …" }],
    implementation: [{ kind: "code", lang: "javascript", caption: "Template.", source: "…" }],
    example: [
      { kind: "prose", body: "**Problem** — the intuition." },
      { kind: "walkthrough", showIndices: true, lane: [/* … */], frames: [/* 4–6 */] },
      { kind: "code", lang: "javascript", caption: "…", source: "…" },
      { kind: "prose", body: "Closing complexity sentence." },
    ],
    pitfalls: [{ kind: "callout", tone: "warn", items: ["…", "…"] }],
    cornerCases: [{ kind: "callout", tone: "info", items: ["…", "…", "…"] }],
    practice: [{ kind: "practice", essential: ["…"], recommended: ["…", "…"] }],
    resources: [{ kind: "resources", items: [{ label: "…", url: "https://…", type: "video" }] }],
  },
} satisfies LearnTopic;
```

## Before you commit

- `npx tsc --noEmit` and `npx eslint src/learn` are clean.
- Every `practice` / `exampleProblem` id resolves in the bank (or you accept the dim-chip fallback).
- Every `resources` URL actually loads.
- The `walkthrough` reads top-to-bottom without the surrounding prose — captions + actions carry it.
- Don't run a render/dev-server check — the maintainer reviews the rendered page themselves. Confirm the section *data* is well-formed (tsc + the section types) and leave the visual pass to them.
