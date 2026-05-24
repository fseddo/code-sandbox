# Learn — proposal: page shape & structure

**The consolidated proposal for what Learn should become.** It merges the two benchmark docs — [learn.md](learn.md) (vs. the [Tech Interview Handbook](https://www.techinterviewhandbook.org/), the *study-plan / practice-list* axis) and [learn-bytebytego-benchmark.md](learn-bytebytego-benchmark.md) (vs. [ByteByteGo](https://bytebytego.com/), the *visual-depth* axis) — into one picture: the type model, the new section kinds, and **rendered mockups of every page** (DS&A detail, System Design detail, the catalog, the study plan).

> Status: **proposal for review.** Once approved, this becomes the spec; the two benchmark docs above can be retired (their findings are folded in here) and [features/learn.md](../features/learn.md) gets updated as pieces land. Current state is described in [features/learn.md](../features/learn.md); current types in [topic.ts](../../src/learn/data/topic.ts).

---

## 1. What we take from each benchmark

| From the **Tech Interview Handbook** | From **ByteByteGo** |
| --- | --- |
| Topics graded by **priority + time**, not difficulty | **Frame-by-frame visual walkthroughs** (pointers/windows moving) |
| **Sequenced study plan** (weeks), not an orderless list | **Step/method skeletons** (the reusable 4-step frame) |
| **Two-tier practice lists** (essential / recommended) | **Pros/cons comparison tables** per option |
| **Learning resources + videos** per topic | **Self-contained depth** — the whole idea in one page |
| **"Things to look out for" + "Corner cases"** | **System-design walkthroughs** (a second article shape) |
| **Faceted catalog** (reuse the problems facet engine) | High **diagram density** generated from typed data, not PNGs |

The throughline: keep our clean **parts → sections** model and **author-supplies-content-renderer-owns-layout** posture; grow the `Section` union and topic metadata to cover the gaps; make the catalog **sequenced**, not orderless.

---

## 2. The content model (types)

### 2a. Topic metadata — grade and sequence

```ts
export type Priority = "high" | "mid" | "low";

export type LearnTopic = {
  slug: string;
  title: string;
  category: LearnCategory;
  summary: string;
  tags?: LearnTag[];
  // NEW — grading + sequencing (the handbook's axes)
  priority: Priority;            // facet + study-plan ordering. NOT difficulty.
  estimatedMinutes: number;      // study-plan time budgeting
  parent?: TopicSlug;            // granular page nests under a parent (bfs → graphs)
  skeleton?: "dsa" | "system-design";  // which ARTICLE_PARTS layout (default "dsa")
  // existing
  parts: Partial<Record<ArticlePartKey, Section[]>>;
  sources?: Source[];
};
```

Decision (carried from `learn.md`): **topics are never graded by difficulty** — difficulty is a property of the *problems* we link. Topics carry **priority**; progression is expressed by **sequence/stage**, below.

### 2b. ARTICLE_PARTS — two skeletons

Today's six parts stay for DS&A; we add the interview-prep parts and a second skeleton for system design. `skeleton` on the topic selects which registry the renderer walks.

```ts
// DS&A skeleton (extends today's six)
export const DSA_PARTS = {
  definition:        { label: "Definition" },
  operations:        { label: "Operations", parent: "definition" },
  whenToUse:         { label: "When to use" },
  techniques:        { label: "Techniques", parent: "whenToUse" },   // NEW
  relatedStructures: { label: "Related structures", parent: "whenToUse" },
  implementation:    { label: "Implementation" },
  example:           { label: "Worked examples" },                   // now plural — 2–3
  pitfalls:          { label: "Things to look out for" },            // NEW
  cornerCases:       { label: "Corner cases" },                      // NEW
  practice:          { label: "Practice" },                          // NEW (two-tier)
  resources:         { label: "Learning resources" },                // NEW (articles+videos)
} as const satisfies Record<string, ArticlePartDetail>;

// System Design skeleton (ByteByteGo's reusable 4-step frame)
export const SYSTEM_DESIGN_PARTS = {
  scope:     { label: "Understand the problem & scope" },
  estimate:  { label: "Back-of-the-envelope estimation" },
  highLevel: { label: "High-level design" },
  deepDive:  { label: "Design deep dive" },
  wrapUp:    { label: "Wrap up" },
  resources: { label: "Learning resources" },
} as const satisfies Record<string, ArticlePartDetail>;
```

### 2c. New `Section` kinds

Five additions to the discriminated union. All generate SVG/HTML from typed data (themeable, diff-reviewable, zero-client-JS) — no PNG pipeline.

```ts
// 1. Frame-by-frame state — the headline ByteByteGo primitive. ✅ SHIPPED (WalkthroughDiagram.tsx)
| { kind: "walkthrough";
    lane: (string | number)[];                  // sequence being scanned
    showIndices?: boolean;                      // faint 0-based index row under the lane
    frames: { pointers?: { name: string; at: number }[];  // labeled arrows above lane, auto-colored by name
              range?: [number, number];           // highlighted window
              marked?: number[];                  // evicted / dropped cells
              action?: string;                    // dashed decision callout, e.g. "sum = 1 < 7 → left++"
              caption?: string }[] }               // one-line narration

// 2. Ordered method / recipe (also the system-design 4-step body)
| { kind: "steps"; steps: { title: string; body: string; code?: { lang: SupportedLanguage; source: string } }[] }

// 3. Pros/cons comparison
| { kind: "comparison"; options: { name: string; pros: string[]; cons: string[] }[] }

// 4. Two-tier practice list (resolves problem ids → summaries like exampleProblem)
| { kind: "practice"; essential: string[]; recommended?: string[] }

// 5. Learning resources (article/video/doc). Video = linked thumbnail, never an iframe.
| { kind: "resources"; items: { label: string; url: string; type: "article" | "video" | "doc" }[] }
```

(Plus a narrow escape hatch — `{ kind: "image"; src: { light: string; dark: string }; alt: string; caption?: string }` — for the rare irreducible diagram. The exception, not the default.)

---

## 3. Mockup — DS&A detail page (Sliding Window, fully authored)

This is the current [slidingWindow.ts](../../src/learn/data/topics/slidingWindow.ts) grown to the new shape. Authoring TS first, then rendered.

### Authoring (the new parts)

```ts
export const slidingWindow = {
  slug: "sliding-window",
  title: "Sliding window",
  category: "algorithms",
  summary: "A moving sub-range over a sequence — grow the right edge, shrink the left, in one O(n) pass.",
  tags: ["sliding-window"],
  priority: "high",
  estimatedMinutes: 90,
  parts: {
    definition: [ /* …existing prose… */ ],
    whenToUse:  [ /* …existing prose… */ ],
    techniques: [
      { kind: "prose", body: "**Fixed window** when the size is given; **variable window** when you grow/shrink to keep an invariant. The helper that summarizes the window in O(1) — set, count-map, or running sum — *is* the problem." },
    ],
    example: [
      { kind: "prose", body: "**Longest Substring Without Repeating Characters** — a `Set` holds the window's characters…" },
      { kind: "walkthrough",
        lane: ["a","b","c","a","b","b"],
        frames: [
          { caption: "right=0: window 'a', all unique.",            range: [0,0], pointers: { L:0, R:0 } },
          { caption: "right=2: window 'abc', best=3.",              range: [0,2], pointers: { L:0, R:2 } },
          { caption: "right=3: 'a' repeats — evict from left.",     range: [1,3], pointers: { L:1, R:3 }, marked: [0] },
          { caption: "right=5: 'b' repeats — shrink past it.",      range: [3,5], pointers: { L:3, R:5 }, marked: [0,1,2] },
        ] },
      { kind: "code", lang: "javascript", caption: "The Set is the window's contents; O(1) has/delete keep the scan O(n).", source: "function lengthOfLongestSubstring(s) { /* … */ }" },
    ],
    pitfalls: [
      { kind: "prose", body: "Recomputing the window's summary from scratch each step — that reintroduces the O(n²) you came to avoid. Update incrementally as `left`/`right` move." },
    ],
    cornerCases: [
      { kind: "prose", body: "Empty input; window larger than the array; all-identical elements; target unreachable (return 0 / -1 per the prompt)." },
    ],
    practice: [
      { kind: "practice",
        essential:   ["longest-substring-without-repeating-characters", "minimum-window-substring"],
        recommended: ["max-consecutive-ones-iii", "fruit-into-baskets", "permutation-in-string"] },
    ],
    resources: [
      { kind: "resources", items: [
        { label: "Sliding Window, visualized", url: "https://…", type: "video" },
        { label: "TIH — sliding window notes",  url: "https://…", type: "article" },
      ] },
    ],
  },
} satisfies LearnTopic;
```

### Rendered

```
┌────────────────────────────────────────────────────────────────────────┐
│ Learn ›                                              [Algorithms]  ●High │
│                                                                          │
│ Sliding window                                          ~90 min · ◷ read │
│ A moving sub-range over a sequence — grow right, shrink left, one pass.  │
│ #sliding-window  #two-pointers                                           │
├────────────────────────────────────────────────────────────────────────┤
│ ## Definition                                                            │
│ A sliding window maintains a contiguous sub-range [left, right]…         │
│                                                                          │
│ ## When to use                                                           │
│ Reach for it on contiguous subarray/substring problems…                  │
│   ### Techniques                                                         │
│   Fixed window when size is given; variable when you grow/shrink…        │
│                                                                          │
│ ## Worked examples                                                       │
│ Longest Substring Without Repeating Characters — a Set holds…            │
│                                                                          │
│   ┌─ walkthrough ─────────────────────────────────────────────┐         │
│   │  a   b   c   a   b   b                                      │         │
│   │ [█] [ ] [ ] [ ] [ ] [ ]   right=0: window 'a', unique      │         │
│   │  L,R                                                        │         │
│   │ [███████████] [ ] [ ] [ ]  right=2: 'abc', best=3           │         │
│   │  L         R                                                │         │
│   │  ╳ [███████████] [ ] [ ]   right=3: 'a' repeats, evict L    │         │
│   │      L         R                                            │         │
│   │  ╳   ╳   ╳ [███████████]   right=5: 'b' repeats, shrink     │         │
│   │              L         R                                    │         │
│   └────────────────────────────────────────────────────────────┘        │
│                                                                          │
│   function lengthOfLongestSubstring(s) { … }   [syntax-highlighted]      │
│                                                                          │
│ ## Things to look out for                                                │
│ • Recomputing the window summary each step → O(n²) sneaks back in.       │
│                                                                          │
│ ## Corner cases                                                          │
│ • Empty input · window > array · all-identical · unreachable target.     │
│                                                                          │
│ ## Practice                                                              │
│   Essential                                                              │
│   ▸ Longest Substring Without Repeating Characters      [Medium] →       │
│   ▸ Minimum Window Substring                            [Hard]   →       │
│   Recommended                                                            │
│   ▸ Max Consecutive Ones III · Fruit Into Baskets · Permutation in Str.  │
│                                                                          │
│ ## Learning resources                                                    │
│   ▶ Sliding Window, visualized            (video)                        │
│   ▤ TIH — sliding window notes            (article)                      │
├────────────────────────────────────────────────────────────────────────┤
│ Sources · TIH · ByteByteGo                                               │
└──────────────────────────────────────────────────────────────────────────┘
```

The `walkthrough` is the headline change: the window band slides and evicted cells get `╳`'d, frame by frame — the thing prose can't do. (Real render: SVG, themed, animated step-on-scroll optional.)

---

## 4. Mockup — System Design detail page (Rate Limiter, the second skeleton)

Same `Section` kinds, but the topic sets `skeleton: "system-design"` so the renderer walks `SYSTEM_DESIGN_PARTS`.

### Authoring (excerpt)

```ts
export const rateLimiter = {
  slug: "design-a-rate-limiter",
  title: "Design a rate limiter",
  category: "systems",
  summary: "Cap request rate per client — where to put it, which algorithm, and how it survives going distributed.",
  tags: ["scalability", "backend"],
  priority: "mid",
  estimatedMinutes: 120,
  skeleton: "system-design",
  parts: {
    scope: [
      { kind: "prose", body: "Clarify before designing: client-side or server-side? per-user or per-IP? what response on limit (429 + Retry-After)? accuracy vs. throughput?" },
    ],
    estimate: [
      { kind: "prose", body: "5M users · 10 req/s peak → 50M req/s … memory for counters at 16 bytes/key ⇒ …" },
    ],
    highLevel: [
      { kind: "comparison", options: [
        { name: "Client-side",  pros: ["No server cost"],                cons: ["Trivially bypassed", "Not enforceable"] },
        { name: "Server-side",  pros: ["Authoritative"],                 cons: ["Adds latency to every call"] },
        { name: "Middleware",   pros: ["Reusable", "Centralized policy"],cons: ["Extra hop", "Sync across nodes"] },
      ] },
    ],
    deepDive: [
      { kind: "comparison", options: [
        { name: "Token bucket",   pros: ["Allows bursts", "Simple"],     cons: ["Two params to tune"] },
        { name: "Leaking bucket", pros: ["Smooth output"],               cons: ["No bursts"] },
        { name: "Fixed window",   pros: ["Cheap memory"],                cons: ["Edge-of-window spikes (2×)"] },
        { name: "Sliding log",    pros: ["Exact"],                       cons: ["Memory-heavy"] },
        { name: "Sliding window", pros: ["Accurate + cheap"],            cons: ["Approximation"] },
      ] },
      { kind: "steps", steps: [
        { title: "Counter in Redis", body: "INCR per key with TTL = window. One round-trip." },
        { title: "Race condition",   body: "Concurrent INCRs can overshoot — fix with a Lua script or sorted-set window.",
          code: { lang: "lua", source: "-- atomic check-and-incr …" } },
        { title: "Multi-node sync",  body: "Centralize counters in Redis; nodes are stateless." },
      ] },
    ],
    wrapUp: [
      { kind: "prose", body: "Tradeoffs recap; where you'd extend (per-endpoint policies, soft vs hard limits, monitoring 429 rate)." },
    ],
  },
} satisfies LearnTopic;
```

### Rendered

```
┌────────────────────────────────────────────────────────────────────────┐
│ Learn ›                                                  [Systems] ●Mid  │
│ Design a rate limiter                                  ~120 min · ◷ read │
├────────────────────────────────────────────────────────────────────────┤
│ ## Understand the problem & scope                                        │
│ Clarify before designing: client vs server? per-user vs per-IP?…         │
│                                                                          │
│ ## Back-of-the-envelope estimation                                       │
│ 5M users · 10 req/s peak → 50M req/s; counters at 16 B/key ⇒ …           │
│                                                                          │
│ ## High-level design                                                     │
│   ┌─ comparison ───────────┬──────────────────┬───────────────────┐     │
│   │ Option       │ Pros                 │ Cons                       │   │
│   ├──────────────┼──────────────────────┼────────────────────────────┤  │
│   │ Client-side  │ + No server cost     │ – Trivially bypassed       │   │
│   │ Server-side  │ + Authoritative      │ – Latency on every call    │   │
│   │ Middleware   │ + Reusable, central  │ – Extra hop, node sync     │   │
│   └──────────────┴──────────────────────┴────────────────────────────┘  │
│                                                                          │
│ ## Design deep dive                                                      │
│   [5-algorithm comparison table: token/leaking bucket, windows …]        │
│   1. Counter in Redis — INCR per key, TTL = window.                      │
│   2. Race condition — concurrent INCRs overshoot →  [lua snippet]        │
│   3. Multi-node sync — centralize in Redis, nodes stateless.             │
│                                                                          │
│ ## Wrap up                                                               │
│ Tradeoffs recap; where you'd extend…                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

This is the biggest content lever and a strategic go/no-go: a System Design category roughly doubles the feature's scope (~25 designs). The model already supports it via the second skeleton — it's a content commitment, not an architecture one.

---

## 5. Mockup — the catalog, sequenced (not an orderless list)

The core of the "section them in sequenceable order" ask. The catalog reuses the problems facet engine (`FACETS` / `buildFacetViews` / `searchCatalog`), but the **default view is grouped by category in study order**, with each topic showing its priority + time. Facets refine; they don't replace the sequence.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Learn                                            [ search… ]   ⚙ Plan view │
│ Filters:  Category ▾   Priority ▾   Tag ▾   ☐ Unread                       │
├──────────────────────────────────────────────────────────────────────────┤
│  1 · DATA STRUCTURES                                          11 topics    │
│     ① Arrays                 ●High  ~30m   ✓ read                          │
│     ② Strings                ●High  ~30m                                   │
│     ③ Hash maps & sets       ●High  ~45m   ✓ read                          │
│     ④ Linked lists           ●Mid   ~45m                                   │
│        └ ⑤ Stacks  ⑥ Queues   (nested under linked structures)             │
│     …                                                                      │
│                                                                            │
│  2 · ALGORITHMS & TECHNIQUES                                  14 topics    │
│     ⑫ Two pointers           ●High  ~60m                                   │
│     ⑬ Sliding window         ●High  ~90m                                   │
│        └ techniques link to → fast/slow pointers                          │
│     ⑭ Binary search          ●High  ~60m                                   │
│     …                                                                      │
│                                                                            │
│  3 · COMPLEXITY · 4 · DATABASES · 5 · WEB · 6 · SYSTEM DESIGN              │
│     …                                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│  ▸ Switch to Study Plan view to sequence these into weeks by time budget. │
└────────────────────────────────────────────────────────────────────────────┘
```

Sequence comes from the registry's **declared order within each category** (already study-plan-ordered in [topics/index.ts](../../src/learn/data/topics/index.ts)) — we just stop flattening it. `parent` nests granular pages (stacks under linked structures, BFS/DFS under graphs). Selecting a facet (e.g. Priority = High) filters within the same grouped, ordered layout.

---

## 6. Mockup — the study plan (the weeks ask)

The handbook's model: a target time budget generates a week-by-week sequence from each topic's `priority` (high first) and `estimatedMinutes` (fill the week's hours). Weeks 1–N are topical study; later weeks shift to tracked practice problems pulled from the `practice` parts.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Study plan        Target:  ( ) 1 week   (•) 1 month   ( ) 3 months         │
│                   Budget:  ~5 hrs / week                          ⚙        │
├──────────────────────────────────────────────────────────────────────────┤
│  WEEK 1 — Foundations                              4h 15m   ▓▓▓▓▓░ 60%     │
│    ✓ Arrays            ●High  30m                                          │
│    ✓ Strings           ●High  30m                                          │
│    ▢ Hash maps & sets  ●High  45m                                          │
│    ▢ Two pointers      ●High  60m                                          │
│    ▢ Binary search     ●High  60m                                          │
│                                                                            │
│  WEEK 2 — Linear & windows                         4h 30m   ░░░░░░  0%     │
│    ▢ Sliding window    ●High  90m                                          │
│    ▢ Linked lists      ●Mid   45m                                          │
│    ▢ Stacks · Queues   ●Mid   60m                                          │
│    ▢ Prefix sums       ●Mid   30m                                          │
│                                                                            │
│  WEEK 3 — Trees & graphs   ·   WEEK 4 — DP, greedy & practice              │
│    …                                                                       │
├──────────────────────────────────────────────────────────────────────────┤
│  Generated from priority + time. Progress persists (noodle:learn-read).    │
└────────────────────────────────────────────────────────────────────────────┘
```

**The sequencing ask, two tiers:**
- **Minimum (ship first):** the catalog is *grouped + ordered* (§5) instead of a flat list — no new view, just stop flattening the registry and render category headers with a sequence index. This alone satisfies "sectioned in a sequenceable order."
- **Full (ship after metadata lands):** the generated `/learn/plan` weeks view above, which needs `priority` + `estimatedMinutes` on every topic first.

---

## 7. Phasing

Ordered so each phase ships standalone value and unblocks the next.

1. **Metadata + sequenced catalog (P1).** Add `priority` + `estimatedMinutes` to every topic; group the catalog by category in declared order with a sequence index. Satisfies the sequencing ask cheaply. *(from both docs)* — **In progress:** the optional `priority`/`estimatedMinutes` fields + header pills have landed (set on two-pointers, sliding-window); catalog grouping + remaining topics pending.
2. **`walkthrough` Section kind (P1).** ✅ **Shipped** — [WalkthroughDiagram](../../src/learn/article/sections/WalkthroughDiagram.tsx), piloted on sliding-window + two-pointers. Color-coded pointer arrows, index row, per-step action callouts. Still to roll across the remaining pointer/window/DP topics. *(ByteByteGo)*
3. **`practice` + `resources` Section kinds (P1).** Two-tier practice lists + article/video links. Pull practice candidates by shared tag; flag thin-coverage topics to the problem-importer. *(handbook)*
4. **`pitfalls` / `cornerCases` / `techniques` parts (P2).** Authoring-led; high interview value. *(handbook)*
5. **`steps` + `comparison` Section kinds (P2).** Method recipes + pros/cons tables. *(ByteByteGo)*
6. **`/learn/plan` weeks view + read-progress (P2).** Generated from the §1 metadata. *(handbook)*
7. **System Design category + second skeleton (P3, go/no-go).** Biggest scope; decide deliberately. *(ByteByteGo)*

Non-goals (unchanged from both docs): grading topics by difficulty; affiliate course links; raster image dumps (generate figures from typed data instead).
