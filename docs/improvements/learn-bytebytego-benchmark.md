# Learn — findings vs ByteByteGo (for review)

A second benchmark for the Learn feature, complementary to [learn.md](learn.md) (which measures us against the Tech Interview Handbook). That doc covers the *catalog / study-plan / practice-list* axis. **This doc covers the axis the user flagged: pedagogical depth — diagram density, multi-step visual walkthroughs, and self-contained "the whole idea lives in one section" articles.** Where the two overlap, this doc defers to `learn.md`.

Sources: [bytebytego.com](https://bytebytego.com/), the [System Design Interview](https://bytebytego.com/courses/system-design-interview) and [Coding Interview Patterns](https://bytebytego.com/exercises/coding-patterns) courses (TOCs confirmed; chapter internals sampled from the free Rate Limiter chapter and the published *Coding Interview Patterns* book structure). The deep chapter bodies are paywalled — internal structure below is from the one fully-visible chapter plus the book's known format, not every chapter.

> Status: **findings for review.** Nothing here is committed. Once we agree on direction, the actionable items fold into [learn.md](learn.md)'s punch list and the new Section kinds get specced in [features/learn.md](../features/learn.md).

---

## What ByteByteGo does (and the two courses)

**Coding Interview Patterns** — 19 chapters, one per *pattern*, 101 worked problems total:

> Two Pointers · Hash Maps and Sets · Linked Lists · Fast and Slow Pointers · Sliding Windows · Binary Search · Stacks · Heaps · Intervals · Prefix Sums · Trees · Tries · Graphs · Backtracking · Dynamic Programming · Greedy · Sort and Search · Bit Manipulation · Math and Geometry

This list is **almost exactly our algorithms/data-structures topic set** — we already cover all of these (plus union-find, topological-sort, BFS/DFS split out). So the *coverage* is at parity; the gap is *depth and presentation per topic*.

**System Design Interview** — 31 chapters: a framework chapter (4-step method, back-of-envelope estimation) then ~25 end-to-end designs (rate limiter, URL shortener, news feed, chat, YouTube, Google Drive, payment system, …). **We have essentially none of this** — our `systems` category is a single `caching-and-cdns` topic, and `web`/`databases` are component-level, not "design a whole system" walkthroughs.

### How a chapter is built (Rate Limiter, the visible one)

- **Fixed 4-step skeleton:** *Understand the problem & scope → Propose high-level design & get buy-in → Design deep dive → Wrap up.* Every design chapter reuses it, so the reader learns a transferable *method*, not just one answer.
- **~17 diagrams in a single chapter.** Architecture diagrams, algorithm mechanics (token-bucket refill, queue draining), race-condition sequences, multi-server + Redis topologies. Figures carry the explanation; prose annotates them.
- **Simple → refined progression.** Starts with the naïve placement (client vs server vs middleware), introduces five algorithms with a **pros/cons comparison per algorithm**, then layers in distributed concerns (race conditions, sync), then monitoring/perf.
- **Self-contained.** All context (why you'd need this, real-world uses, trade-offs) lives *before* the solution, in the same chapter. You don't leave to understand it.

The coding-pattern chapters follow the same spirit at smaller scale: a pattern intro + "when does this apply," then each worked problem gets an **intuition section with diagrams showing intermediate states** (e.g. pointers walking an array frame by frame), then code, then complexity.

---

## How we compare

Our model ([topic.ts](../../src/learn/data/topic.ts)) is genuinely good *structurally* — the parts→sections two-level model, the exhaustive `Section` union, Shiki server-side code, and the problem cross-links are clean and more type-disciplined than a flat markdown book. The gaps are about **richness, not architecture**:

| Axis | ByteByteGo | Us | Verdict |
| --- | --- | --- | --- |
| Topic coverage (algo/DS) | 19 patterns | ~30 topics | **We win** |
| System design walkthroughs | ~25 end-to-end designs | ~1 (caching/CDN) | **Big gap** |
| Diagrams per topic | many (≈17 in one chapter) | 0–1 (`graph`/`matrix` only, on a few topics) | **Big gap** |
| Multi-step visual walkthrough | core (frame-by-frame states) | none — we describe steps in prose | **Big gap** |
| Worked examples per topic | several, each fully diagrammed | 1, code + prose | **Gap** |
| Self-contained depth | high | medium — our articles are tight/terse by design | **Gap (partly intentional)** |
| Transferable method (4-step) | yes, for system design | n/a (no SD content) | **Gap** |

Concretely: our [slidingWindow.ts](../../src/learn/data/topics/slidingWindow.ts) explains the window *in prose* — "extend `right`, advance `left`." ByteByteGo would show that as a sequence of array frames with the `[left, right]` band highlighted as it slides and a dup gets evicted. Same idea, far higher retention. We have the SVG muscle (`GraphDiagram` proves we hand-roll SVG fine) — we just lack a primitive for *sequence-of-states*.

---

## Proposed direction (the interesting part)

Two new `Section` kinds carry most of the visual gap, and both fit our existing "author supplies content, renderer owns layout" posture. These are the type-clever, reusable shapes worth building:

- **P1 — `walkthrough` Section kind (frame-by-frame state).** A generic stepper: an array/string/list of cells plus an ordered list of *frames*, each frame highlighting indices/pointers and carrying a one-line caption. Renderer shows frames stacked (or stepped) with the active window/pointers styled. This is the single highest-leverage addition — it's what makes sliding-window, two-pointers, binary-search, fast/slow pointers, and DP-table fills *click*.
  - Shape sketch — keep it generic over what a "cell" is so it serves arrays, strings, and DP grids:
    ```ts
    | { kind: "walkthrough";
        lane: (string | number)[];                 // the sequence being scanned
        frames: { caption: string;
                  pointers?: Record<string, number>;  // named cursors → index (left/right/slow/fast)
                  range?: [number, number];           // highlighted window
                  marked?: number[] }[] }              // visited / chosen cells
    ```
    The `topic.ts` header comment already predicts this ("a `diagram` kind … is the obvious next one") — this is that kind, generalized.
- **P2 — `steps` Section kind (ordered method/recipe).** A numbered list with optional per-step code/figure children — directly models ByteByteGo's "4-step framework" and any "algorithm in N steps" explanation. Cheap, high clarity, reusable across every topic.
- **P2 — Richer per-topic example budget.** Lift our "1 worked example" norm toward 2–3, each as prose-intuition → `walkthrough` → `code` → complexity. This is an *authoring* change more than a code change (the model already allows N example sections), but worth stating as a target so topics get deepened consistently.
- **P2 — `comparison` Section kind (pros/cons table).** ByteByteGo's per-option trade-off tables ("5 rate-limiting algorithms, pros/cons each"). A small `{ kind: "comparison"; options: { name; pros: string[]; cons: string[] }[] }`. Also serves DS&A ("Map vs object-as-map", which we currently freeform in prose).
- **P3 — A System Design category with a fixed 4-part skeleton.** This is a whole content initiative, not a quick win. If we want it, the clean move is a *second article skeleton* (a `ARTICLE_PARTS` variant: scope / high-level / deep-dive / wrap-up) selected per category, rather than forcing system-design content into the DS&A parts. Flag as a strategic decision, not a backlog item — it roughly doubles the feature's scope.

### Image handling — the honest tradeoff

ByteByteGo leans on hand-drawn raster figures. We should **not** import a pile of PNGs:

- They rot, don't theme (light/dark), aren't diffable, and break our "zero-client-JS, server-rendered" article posture.
- Our edge is **code-as-figure**: the `walkthrough`/`steps`/`comparison` kinds above generate SVG/HTML from typed data, so they theme automatically, stay diff-reviewable, and need no asset pipeline. That's *more* work per primitive than dropping an image, but it's the reusable, type-safe path this codebase is built around — and it's a better learning artifact than a screenshot.
- If a genuinely irreducible diagram comes up (a specific architecture topology), add a narrow `image` kind with required `alt` + a light/dark source pair — but treat it as the exception, after the generated primitives exist.

### Non-goals / deferred

- Practice-list tiers, learning-resource/video links, priority + study-plan ordering — **already owned by [learn.md](learn.md)**; not re-proposed here.
- Affiliate course links — skip (same call as `learn.md`).

---

## Suggested next step

Pick the depth primitives to build first. My recommendation: ship **`walkthrough`** (P1) end-to-end on one topic (sliding-window is the ideal pilot — we can compare before/after directly), prove the authoring ergonomics, then roll it across the pointer/window/DP topics before adding `steps`/`comparison`. Hold the System Design category as a separate go/no-go — it's the biggest lever for "more robust like ByteByteGo," but it's a content project of its own.
