# Learn

A sibling to the problems feature: a bank of typed DS&A study topics rendered as structured articles, cross-linked to practice problems. Code lives under [`src/learn/`](../../src/learn/) (the shared engine); routes under [`src/app/concepts/`](../../src/app/concepts/) and [`src/app/study-guide/`](../../src/app/study-guide/) — see "Two areas" below.

The bank covers the standard interview curriculum (~30 topics — data structures, algorithm techniques, and Big-O), registered in study-plan order in [topics/index.ts](../../src/learn/data/topics/index.ts). Depth varies on purpose: some topics are fully authored (complexity tables, worked examples, diagrams), others are definition + when-to-use stubs to deepen over time. The `parts` model makes that gradient natural — a stub just omits the parts it doesn't have yet.

## Source layout

```
src/learn/
  data/
    topic.ts              the type model — Section union, ARTICLE_PARTS, LearnTopic
    topics/
      index.ts            the registry (keyed by slug) + getTopic / listTopicSummaries
      hashMaps.ts         one authored topic each (satisfies LearnTopic)
      sets.ts
      adjacencyMatrix.ts
  article/
    LearnArticle.tsx      renders one topic — walks ARTICLE_PARTS for layout
    SectionRenderer.tsx   dispatches a Section to its renderer (exhaustive switch)
    sections/             one component per Section kind
  catalog/
    LearnCatalog.tsx      the /concepts landing — searchable topic list (rows → article)
```

## Two areas: Concepts + Interview Study Guide

`src/learn/` is the shared engine behind **two separate top-level areas** — two reads of the same content, each with its own home-page card and `BrandMenu` entry:

- **Concepts** (`/concepts`) — the flat, searchable/faceted "all topics" list ([LearnCatalog](../../src/learn/catalog/LearnCatalog.tsx)).
- **Interview Study Guide** (`/study-guide`) — a curated, *sequenced* curriculum à la ByteByteGo: pick a **track** (Algos / System design), then step through **chapters → entries** in a two-pane layout (curriculum sidebar + content).

The split is **navigational, not a code fork**: both areas share the whole content engine (`SectionRenderer`, `LearnArticle`, `article/sections/`, glossary, category themes), and the guide is *derived from* the topic bank — so the internal module + `Learn*` components keep their names. Old `/learn*` URLs 308-redirect to the new routes ([next.config.ts](../../next.config.ts)).

The curriculum is a layer *over* the topic bank, not a restructuring of it ([curriculum.ts](../../src/learn/data/curriculum.ts)): a `Track` is an ordered list of chapters in one of two shapes. A **`PatternChapter`** (the algos track) is a pattern topic whose article is the intro, followed by that topic's practice problems as workable steps (`resolveTrack` derives the problem entries from each topic's `practice` section — no duplication). A **`ConceptChapter`** (the system design track) is a title plus an ordered run of lesson articles and nothing to solve — see [system-design-authoring.md](system-design-authoring.md). The union narrows on the presence of `topics`, so a chapter's shape declares its kind. Every `GuideEntry` carries a `progressKey` — a problem's own id, or a topic's slug namespaced as `topic:<slug>` (both share one localStorage map, and a slug can collide with a problem id). The sidebar counts **every** entry, article or problem: a concept chapter has no oracle, so a lesson is done when the reader says so via [TopicReadToggle](../../src/learn/guide/TopicReadToggle.tsx), mirroring how a build problem is marked done. This expresses grouping/order without moving topic files, so the "should sliding-window live under two-pointers" question stays deferred. Routes: `/study-guide` (track picker) → `/study-guide/[track]` (redirects to first entry) with a shared [layout](../../src/app/study-guide/[track]/layout.tsx) rendering the persistent [GuideSidebar](../../src/learn/guide/GuideSidebar.tsx) (numbered collapsible chapters, active highlight, `x/N` progress from the problem progress store). Authoring a problem page is its own rubric — see [study-guide-authoring.md](study-guide-authoring.md) (the authoring half of a two-agent author→audit pipeline). Two entry kinds: `topic/[slug]` reuses `LearnArticle`; `problem/[id]` renders [ProblemGuide](../../src/learn/guide/ProblemGuide.tsx) — statement/examples/constraints **derived** from the bank, an optional **authored teaching overlay** (`Section[]` keyed by id in [problemGuides.ts](../../src/learn/data/problemGuides.ts): intuition + a brute-force baseline + a walkthrough, rendered through the shared `SectionRenderer`), an **Optimization** section built automatically from the problem's stored `solutions` (approach write-up + Shiki-highlighted implementation — so every problem shows its canonical best, authored overlay or not), and an "Open in editor" CTA into `/problems/[id]`. The editor's own Solutions tab now highlights with the same Shiki themes via the client [HighlightedCode](../../src/problems/shared/HighlightedCode.tsx).

## Catalog + detail routes

The Concepts area mirrors problems: `/concepts` (landing → `listTopicSummaries()`) and `/concepts/[slug]` (one topic → `getTopic`, 404s on miss). Both render `AppHeader` with `crumb="Concepts"`. The landing list ([LearnCatalog](../../src/learn/catalog/LearnCatalog.tsx)) follows the Problems list pattern — search now (reusing the generic `searchCatalog`), with filters/sidebar deferred and the shared generic `<Catalog>` extraction pending once Problems/Learn/Pads confirm the shape (see [improvements/learn.md](../improvements/learn.md)).

**Parent/child grouping.** A topic can carry `parent?: string` (a sibling's slug) to mark itself a *facet* of a broader topic rather than a peer — e.g. `breadth-first-search`/`depth-first-search`/`union-find`/`topological-sort` all set `parent: "graphs"`, since [graphs.ts](../../src/learn/data/topics/graphs.ts) already carries the representations + comparison-of-tools content those pages would otherwise duplicate. Purely a display grouping (content/routing are untouched): `groupTopicRows` in `LearnCatalog` nests a visible child directly under its parent row (indented, compact) — unless the parent itself got filtered/searched out, in which case the child stays at top level so it's never hidden. `LearnArticle` also resolves and shows a "Part of {parent}" link above the title on a child's own page. `parent` is typed as a plain `string`, not `TopicSlug`, to avoid a circular import between `topic.ts` and the topic registry — an id that doesn't resolve is just not grouped, same graceful-degradation posture as an unknown `practice` id.

## Two-level content model

A `LearnTopic` is **parts → sections**:

- **`ARTICLE_PARTS`** ([topic.ts](../../src/learn/data/topic.ts)) is a single-source registry of the semantic regions every article is built from — `definition`, `operations` (nested under definition), `whenToUse`, `techniques` + `relatedStructures` (nested under whenToUse), `implementation`, `example`, `tradeoffs`, `pitfalls`, `interviewAngle`, `cornerCases`, `practice`, `resources`. Declaration **order + the `parent` flag drive layout**, so a topic supplies only *content* per part, never headings or ordering. `LearnArticle` walks `ARTICLE_PARTS` via `typedEntries`, rendering top-level parts as `h2` and nested parts as indented `h3`. The key union is hand-declared (so `parent` can reference a sibling) and pinned via `satisfies Record<ArticlePartKey, ArticlePartDetail>` for exhaustiveness. Same posture as the catalog's `FACETS`.
- **`Section`** is the content-block discriminated union (the `kind` field): `prose`, `code`, `complexity`, `graph`, `matrix`, `walkthrough`, `callout`, `practice`, `resources`, `exampleProblem`, and the `row` layout primitive. `SectionRenderer`'s `switch` is exhaustive — a new kind won't compile until handled (the `never` default). `LearnTopic.parts` is `Partial<Record<ArticlePartKey, Section[]>>` — omit a part that doesn't apply (e.g. a reference topic with no `example`).

`TopicSummary` is the client-safe `Pick` (slug/title/category/summary/tags/parent) used by the landing list + search, dropping the article body.

**Nesting is conditional on the parent part being present.** `ARTICLE_PARTS` declares `techniques` and `relatedStructures` as children of `whenToUse`, but a lesson archetype that legitimately omits `whenToUse` (see [system-design-authoring.md](system-design-authoring.md) §2 — an Orientation page offers no adoption choice) would otherwise render `techniques` as a subsection of nothing and drop it from the "On this page" jump list. `LearnArticle`'s `isNested` resolves the flag against the topic's actual parts, so an orphaned child promotes to top level.

`LearnTopic` also carries optional study-plan metadata — `priority` (`high`/`mid`/`low`, the [`Priority`](../../src/learn/data/topic.ts) axis; *not* difficulty) and `estimatedMinutes`. Both are optional during rollout and render as header pills when set ([LearnArticle](../../src/learn/article/LearnArticle.tsx)); priority colors live beside the category accents in [categoryTheme.ts](../../src/learn/shared/categoryTheme.ts) (`PRIORITY_ACCENT`). See [improvements/learn-proposal.md](../improvements/learn-proposal.md) for the broader plan.

`archetype` (`orientation` / `mechanism` / `distinction` / `procedure`) is **authoring metadata only** — nothing renders it. It declares which lesson shape the page is, which is what decides its required part set; [system-design-authoring.md](system-design-authoring.md) §2 defines the four, and `scripts/lintTopics.mjs` grades the page against the declared one instead of against a single uniform part list. Unset defaults to `mechanism`.

## Section kinds

| kind | renderer | notes |
| --- | --- | --- |
| `prose` | [ProseSection](../../src/learn/article/sections/ProseSection.tsx) | splits paragraphs and applies the shared [`renderInline`](../../src/learn/article/sections/renderInline.tsx) formatter (`` `code` ``, `*emphasis*`, `[[glossary]]`) — reused by `callout` too. Not full markdown. `[[term]]` resolves through [`resolveTerm`](../../src/learn/data/glossary.ts): the curated `GLOSSARY` dict first (a definition-only blurb, or a `topicSlug`), then falls back to a direct topic-slug match — so `[[hash-maps]]` cross-links a sibling topic without needing a `GLOSSARY` entry. `[[slug\|display label]]` overrides the shown text while resolving on `slug`. An unresolved term renders as plain text. |
| `code` | [CodeSection](../../src/learn/article/sections/CodeSection.tsx) | **async server component** — Shiki highlights server-side (`github-light` + `github-dark-default`), emitted as static HTML, zero client JS. Dark toggle via the `.dark` CSS rule in [globals.css](../../src/app/globals.css). |
| `complexity` | [ComplexityTable](../../src/learn/article/sections/ComplexityTable.tsx) | operation / average / worst / note. `ComplexityClass` is a closed Big-O union. |
| `graph` | [GraphDiagram](../../src/learn/article/sections/GraphDiagram.tsx) | hand-rolled SVG; nodes auto-laid on a circle (authors give ids + edges, no coordinates). `directed` adds arrowheads. |
| `walkthrough` | [WalkthroughDiagram](../../src/learn/article/sections/WalkthroughDiagram.tsx) | frame-by-frame state-stepper for pointer/window algorithms. A `lane` of cells; each frame draws named `pointers` (labeled arrows above the lane, auto-colored by first-appearance order), an optional highlighted `range`, `marked` (evicted) cells, a per-step `action` callout, and a `caption`. `showIndices` adds a faint index row. Pure CSS, no client JS. |
| `matrix` | [MatrixGrid](../../src/learn/article/sections/MatrixGrid.tsx) | labeled grid; truthy cells highlighted. |
| `callout` | [CalloutSection](../../src/learn/article/sections/CalloutSection.tsx) | bulleted aside in one of three tones (`warn` = pitfalls, `info` = corner cases, `tip`); items use the shared inline formatter. |
| `architecture` | [ArchitectureDiagram](../../src/learn/article/sections/ArchitectureDiagram.tsx) | layered box-and-arrow topology; nodes carry a `tier` (`client`/`edge`/`service`/`data`) and the renderer columns them left→right, so authors give no coordinates. Edges are directed and optionally labeled/`dashed`. The system-design counterpart to `graph`, whose circle layout is for graph *algorithms*. |
| `sequence` | [SequenceDiagram](../../src/learn/article/sections/SequenceDiagram.tsx) | lifelines + ordered messages — handshakes, commit protocols, consensus rounds, auth flows. `from === to` draws a self-call; `dashed` marks a response/async hop. Pure SVG, no client JS. |
| `comparison` | [ComparisonTable](../../src/learn/article/sections/ComparisonTable.tsx) | free-form X-vs-Y table (`columns` + `rows`), cells through `renderInline`. The non-Big-O counterpart to `complexity`. |
| `numbers` | [NumbersTable](../../src/learn/article/sections/NumbersTable.tsx) | back-of-envelope estimates: quantity / value / **derivation**. The derivation column is the point — a figure a reader can't reproduce is one they can't defend. |
| `practice` | [PracticeList](../../src/learn/article/sections/PracticeList.tsx) | two-tier bank-problem list — `essential` as rows with a difficulty pill, `recommended` as chips. Resolves ids against `problemsById`; unknown ids degrade. |
| `resources` | [ResourceList](../../src/learn/article/sections/ResourceList.tsx) | external links grouped by `type` (article / video / doc) with a colored icon tile. |
| `exampleProblem` | [ExampleProblemLink](../../src/learn/article/sections/ExampleProblemLink.tsx) | deep-links a bank problem by id; degrades to a note if the id isn't in the bank. |
| `row` | inline in [SectionRenderer](../../src/learn/article/SectionRenderer.tsx) | layout primitive — renders child sections in a 2-col grid (`sm:grid-cols-2`), stacked on narrow. Used for the graph+matrix pairing. |

**Figure alignment:** `graph`, `matrix`, `architecture` and `sequence` render their own heading (so heading + media + caption stay one centered stack), and `SectionRenderer` skips its outer `h4` for those kinds (`SELF_TITLED`). Both put their media in a shared-height band (`h-56`) so paired figures align across the `row`'s columns.

**Shared section chrome:** both [LearnArticle](../../src/learn/article/LearnArticle.tsx) and [ProblemGuide](../../src/learn/guide/ProblemGuide.tsx) render titled sections through one component — [ArticleSection](../../src/learn/article/ArticleSection.tsx) (top-level `h2` with a category-accent underline; nested `h3` with an accent left-border). Single-sourcing it keeps the two pages' heading hierarchy + spacing identical; the study-guide problem page borrows the `algorithms` accent.

**Article layout:** [LearnArticle](../../src/learn/article/LearnArticle.tsx) is a two-column flex — the article body plus a sticky "On this page" nav (`lg:` and up) that jump-links the present top-level parts (each top-level `section` carries `id={partKey}`). Nested subsections are omitted from the nav.

**Authoring a topic** — see [learn-authoring.md](learn-authoring.md) for the content rubric (which parts/section-kinds to use, depth tiers, the `walkthrough` and `practice` rules, and a skeleton). [two-pointers](../../src/learn/data/topics/twoPointers.ts) and [sliding-window](../../src/learn/data/topics/slidingWindow.ts) are the fully-authored reference pages.

## Cross-link to problems

`LearnTopic.tags` reuse the problem taxonomy (`TopicTag` from [problem.ts](../../src/problems/data/problem.ts)) deliberately — one vocabulary wires the two features. `exampleProblem` sections resolve against the problem bank: the `/concepts/[slug]` route builds a `Record<id, ProblemSummary>` from `listProblemSummaries()` server-side and threads it to the renderer, so the link shows a real title + difficulty. The bank stays server-side; the learn article never imports the registry directly.

See [improvements/learn.md](../improvements/learn.md) for the roadmap (resources/videos, practice lists, priority + study-plan model) benchmarked against the Tech Interview Handbook.
