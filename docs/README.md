# Docs

Organized so an agent (or contributor) can pull in only the docs relevant to the area they're touching, rather than scanning everything. Think of this directory like a RESTful API — you reference the resource you need, not the whole catalog.

## Layout

```
docs/
  architecture/   # cross-cutting principles (rarely change)
                  # — read once when starting work in a new area
  features/       # per-area state of the app — one doc per feature
                  # — read the relevant one when working in that area
  improvements/   # remaining work, organized by area
                  # — punch lists, not explanations
```

`features/` is the most-populated section (see [features/pad.md](features/pad.md)); `improvements/` has its first punch-list ([improvements/judge-harness-gaps.md](improvements/judge-harness-gaps.md)). `architecture/` fills in as cross-cutting patterns emerge; resist writing aspirational docs for code that doesn't exist yet.

## Reading order, by task

- **Touching the CoderPad pane** (`src/pad/`) → [features/pad.md](features/pad.md).
- **Touching the LeetCode judge** (`src/judge/`) → [features/judge.md](features/judge.md).
- **Authoring or sourcing problems** (the problem bank, the catalog) → [features/problem-authoring.md](features/problem-authoring.md).
- **Adding a new feature area** → write a new `features/<area>.md` as a side effect; link it from the table in [`CLAUDE.md`](../CLAUDE.md).

## Principles for keeping docs useful

These docs persist design decisions across sessions — they're as much for the agent as for the human. Two failure modes to avoid:

1. **Doc grows past its usefulness threshold.** A 300-line doc costs almost as much to read as the source files it describes. Split aggressively into per-feature docs; keep architecture docs short and example-driven, not exhaustive.
2. **Same fact lives in three docs.** Drift is inevitable; the reader has no way to know which version is current. Each fact should live in exactly one doc — improvements references features, features reference architecture, but no doc duplicates content from another.

### What goes where

- **`features/<area>.md`** — _current_ state of one feature: components, data flow, state shape, the why behind non-obvious choices. Updated when the feature changes. Self-contained — a contributor reading just this doc should be able to work in the area.
- **`architecture/<topic>.md`** — _cross-cutting_ principles that aren't owned by one feature (e.g. how custom components extend shadcn primitives, how server-side judging is wired). Stable; rarely needs editing. Examples reference features but don't duplicate their detail.
- **`improvements/<topic>.md`** — _punch lists_ of what's left to do. 1–3 lines per item: location, fix, severity. **No prose explaining how things work** (that's features/architecture). When an item lands, delete the entry — git has the history; the new state lives in features/.

### CLAUDE.md vs docs

[`CLAUDE.md`](../CLAUDE.md) holds the **rule** (≤ 5 lines per topic). The architecture doc holds the **rationale + worked examples**. CLAUDE.md links out; architecture docs don't restate the rule. Don't duplicate the body of a convention across both.

### Triage rule for audit / improvement docs

Three categories of content typically live in audit docs. They get split:

- **Resolved** → delete. Git captures it.
- **Pattern observation** ("this is the canonical shape, let's preserve it") → promote into the relevant `architecture/` or `features/` doc.
- **Pending fix** or **future CLAUDE rule candidate** → stay in `improvements/`, as a thin one-liner.

If an audit doc accumulates resolved items + pattern docs + pending items in one file, it's failing this rule and should be split.
