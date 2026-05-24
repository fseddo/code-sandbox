# Learn

A sibling to the problems feature: a bank of typed DS&A study topics rendered as structured articles, cross-linked to practice problems. Code lives under [`src/learn/`](../../src/learn/); routes under [`src/app/learn/`](../../src/app/learn/).

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
    LearnCatalog.tsx      the /learn landing — searchable topic list (rows → article)
```

## Two views: catalog + study guide

Learn has **two reads of the same content**:

- **Catalog** (`/learn`) — the flat, searchable/faceted "all topics" list ([LearnCatalog](../../src/learn/catalog/LearnCatalog.tsx)).
- **Study guide** (`/learn/guide`) — a curated, *sequenced* curriculum à la ByteByteGo: pick a **track** (Algos / System design), then step through **chapters → entries** in a two-pane layout (curriculum sidebar + content). A "Study guide" button on the catalog links in.

The curriculum is a layer *over* the topic bank, not a restructuring of it ([curriculum.ts](../../src/learn/data/curriculum.ts)): a `Track` is an ordered list of chapters; a **chapter** is a pattern topic whose article is the intro, followed by that topic's practice problems as workable steps (`resolveTrack` derives the problem entries from each topic's `practice` section — no duplication). This expresses grouping/order without moving topic files, so the "should sliding-window live under two-pointers" question stays deferred. Routes: `/learn/guide` (track picker) → `/learn/guide/[track]` (redirects to first entry) with a shared [layout](../../src/app/learn/guide/[track]/layout.tsx) rendering the persistent [GuideSidebar](../../src/learn/guide/GuideSidebar.tsx) (numbered collapsible chapters, active highlight, `x/N` progress from the problem progress store). Authoring a problem page is its own rubric — see [study-guide-authoring.md](study-guide-authoring.md) (the authoring half of a two-agent author→audit pipeline). Two entry kinds: `topic/[slug]` reuses `LearnArticle`; `problem/[id]` renders [ProblemGuide](../../src/learn/guide/ProblemGuide.tsx) — statement/examples/constraints **derived** from the bank, an optional **authored teaching overlay** (`Section[]` keyed by id in [problemGuides.ts](../../src/learn/data/problemGuides.ts): intuition + a brute-force baseline + a walkthrough, rendered through the shared `SectionRenderer`), an **Optimization** section built automatically from the problem's stored `solutions` (approach write-up + Shiki-highlighted implementation — so every problem shows its canonical best, authored overlay or not), and an "Open in editor" CTA into `/problems/[id]`. The editor's own Solutions tab now highlights with the same Shiki themes via the client [HighlightedCode](../../src/problems/shared/HighlightedCode.tsx).

## Catalog + detail routes

Routes mirror problems: `/learn` (landing → `listTopicSummaries()`) and `/learn/[slug]` (one topic → `getTopic`, 404s on miss). Both render `AppHeader` with `crumb="Learn"`. The landing list ([LearnCatalog](../../src/learn/catalog/LearnCatalog.tsx)) follows the Problems list pattern — search now (reusing the generic `searchCatalog`), with filters/sidebar deferred and the shared generic `<Catalog>` extraction pending once Problems/Learn/Pads confirm the shape (see [improvements/learn.md](../improvements/learn.md)).

## Two-level content model

A `LearnTopic` is **parts → sections**:

- **`ARTICLE_PARTS`** ([topic.ts](../../src/learn/data/topic.ts)) is a single-source registry of the semantic regions every article is built from — `definition`, `operations` (nested under definition), `whenToUse`, `techniques` + `relatedStructures` (nested under whenToUse), `implementation`, `example`, `pitfalls`, `cornerCases`, `practice`, `resources`. Declaration **order + the `parent` flag drive layout**, so a topic supplies only *content* per part, never headings or ordering. `LearnArticle` walks `ARTICLE_PARTS` via `typedEntries`, rendering top-level parts as `h2` and nested parts as indented `h3`. The key union is hand-declared (so `parent` can reference a sibling) and pinned via `satisfies Record<ArticlePartKey, ArticlePartDetail>` for exhaustiveness. Same posture as the catalog's `FACETS`.
- **`Section`** is the content-block discriminated union (the `kind` field): `prose`, `code`, `complexity`, `graph`, `matrix`, `walkthrough`, `callout`, `practice`, `resources`, `exampleProblem`, and the `row` layout primitive. `SectionRenderer`'s `switch` is exhaustive — a new kind won't compile until handled (the `never` default). `LearnTopic.parts` is `Partial<Record<ArticlePartKey, Section[]>>` — omit a part that doesn't apply (e.g. a reference topic with no `example`).

`TopicSummary` is the client-safe `Pick` (slug/title/category/summary/tags) used by the landing list + search, dropping the article body.

`LearnTopic` also carries optional study-plan metadata — `priority` (`high`/`mid`/`low`, the [`Priority`](../../src/learn/data/topic.ts) axis; *not* difficulty) and `estimatedMinutes`. Both are optional during rollout and render as header pills when set ([LearnArticle](../../src/learn/article/LearnArticle.tsx)); priority colors live beside the category accents in [categoryTheme.ts](../../src/learn/shared/categoryTheme.ts) (`PRIORITY_ACCENT`). See [improvements/learn-proposal.md](../improvements/learn-proposal.md) for the broader plan.

## Section kinds

| kind | renderer | notes |
| --- | --- | --- |
| `prose` | [ProseSection](../../src/learn/article/sections/ProseSection.tsx) | splits paragraphs and applies the shared [`renderInline`](../../src/learn/article/sections/renderInline.tsx) formatter (`` `code` ``, `*emphasis*`, `[[glossary]]`) — reused by `callout` too. Not full markdown. |
| `code` | [CodeSection](../../src/learn/article/sections/CodeSection.tsx) | **async server component** — Shiki highlights server-side (`github-light` + `github-dark-default`), emitted as static HTML, zero client JS. Dark toggle via the `.dark` CSS rule in [globals.css](../../src/app/globals.css). |
| `complexity` | [ComplexityTable](../../src/learn/article/sections/ComplexityTable.tsx) | operation / average / worst / note. `ComplexityClass` is a closed Big-O union. |
| `graph` | [GraphDiagram](../../src/learn/article/sections/GraphDiagram.tsx) | hand-rolled SVG; nodes auto-laid on a circle (authors give ids + edges, no coordinates). `directed` adds arrowheads. |
| `walkthrough` | [WalkthroughDiagram](../../src/learn/article/sections/WalkthroughDiagram.tsx) | frame-by-frame state-stepper for pointer/window algorithms. A `lane` of cells; each frame draws named `pointers` (labeled arrows above the lane, auto-colored by first-appearance order), an optional highlighted `range`, `marked` (evicted) cells, a per-step `action` callout, and a `caption`. `showIndices` adds a faint index row. Pure CSS, no client JS. |
| `matrix` | [MatrixGrid](../../src/learn/article/sections/MatrixGrid.tsx) | labeled grid; truthy cells highlighted. |
| `callout` | [CalloutSection](../../src/learn/article/sections/CalloutSection.tsx) | bulleted aside in one of three tones (`warn` = pitfalls, `info` = corner cases, `tip`); items use the shared inline formatter. |
| `practice` | [PracticeList](../../src/learn/article/sections/PracticeList.tsx) | two-tier bank-problem list — `essential` as rows with a difficulty pill, `recommended` as chips. Resolves ids against `problemsById`; unknown ids degrade. |
| `resources` | [ResourceList](../../src/learn/article/sections/ResourceList.tsx) | external links grouped by `type` (article / video / doc) with a colored icon tile. |
| `exampleProblem` | [ExampleProblemLink](../../src/learn/article/sections/ExampleProblemLink.tsx) | deep-links a bank problem by id; degrades to a note if the id isn't in the bank. |
| `row` | inline in [SectionRenderer](../../src/learn/article/SectionRenderer.tsx) | layout primitive — renders child sections in a 2-col grid (`sm:grid-cols-2`), stacked on narrow. Used for the graph+matrix pairing. |

**Figure alignment:** `graph` and `matrix` render their own heading (so heading + media + caption stay one centered stack), and `SectionRenderer` skips its outer `h4` for those kinds (`SELF_TITLED`). Both put their media in a shared-height band (`h-56`) so paired figures align across the `row`'s columns.

**Shared section chrome:** both [LearnArticle](../../src/learn/article/LearnArticle.tsx) and [ProblemGuide](../../src/learn/guide/ProblemGuide.tsx) render titled sections through one component — [ArticleSection](../../src/learn/article/ArticleSection.tsx) (top-level `h2` with a category-accent underline; nested `h3` with an accent left-border). Single-sourcing it keeps the two pages' heading hierarchy + spacing identical; the study-guide problem page borrows the `algorithms` accent.

**Article layout:** [LearnArticle](../../src/learn/article/LearnArticle.tsx) is a two-column flex — the article body plus a sticky "On this page" nav (`lg:` and up) that jump-links the present top-level parts (each top-level `section` carries `id={partKey}`). Nested subsections are omitted from the nav.

**Authoring a topic** — see [learn-authoring.md](learn-authoring.md) for the content rubric (which parts/section-kinds to use, depth tiers, the `walkthrough` and `practice` rules, and a skeleton). [two-pointers](../../src/learn/data/topics/twoPointers.ts) and [sliding-window](../../src/learn/data/topics/slidingWindow.ts) are the fully-authored reference pages.

## Cross-link to problems

`LearnTopic.tags` reuse the problem taxonomy (`TopicTag` from [problem.ts](../../src/problems/data/problem.ts)) deliberately — one vocabulary wires the two features. `exampleProblem` sections resolve against the problem bank: the `/learn/[slug]` route builds a `Record<id, ProblemSummary>` from `listProblemSummaries()` server-side and threads it to the renderer, so the link shows a real title + difficulty. The bank stays server-side; the learn article never imports the registry directly.

See [improvements/learn.md](../improvements/learn.md) for the roadmap (resources/videos, practice lists, priority + study-plan model) benchmarked against the Tech Interview Handbook.
