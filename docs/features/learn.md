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

Routes mirror problems: `/learn` (landing → `listTopicSummaries()`) and `/learn/[slug]` (one topic → `getTopic`, 404s on miss). Both render `AppHeader` with `crumb="Learn"`. The landing list ([LearnCatalog](../../src/learn/catalog/LearnCatalog.tsx)) follows the Problems list pattern — search now (reusing the generic `searchCatalog`), with filters/sidebar deferred and the shared generic `<Catalog>` extraction pending once Problems/Learn/Pads confirm the shape (see [improvements/learn.md](../improvements/learn.md)).

## Two-level content model

A `LearnTopic` is **parts → sections**:

- **`ARTICLE_PARTS`** ([topic.ts](../../src/learn/data/topic.ts)) is a single-source registry of the semantic regions every article is built from — `definition`, `operations` (nested under definition), `whenToUse`, `relatedStructures` (nested under whenToUse), `implementation`, `example`. Declaration **order + the `parent` flag drive layout**, so a topic supplies only *content* per part, never headings or ordering. `LearnArticle` walks `ARTICLE_PARTS` via `typedEntries`, rendering top-level parts as `h2` and nested parts as indented `h3`. The key union is hand-declared (so `parent` can reference a sibling) and pinned via `satisfies Record<ArticlePartKey, ArticlePartDetail>` for exhaustiveness. Same posture as the catalog's `FACETS`.
- **`Section`** is the content-block discriminated union (the `kind` field): `prose`, `code`, `complexity`, `graph`, `matrix`, `exampleProblem`, and the `row` layout primitive. `SectionRenderer`'s `switch` is exhaustive — a new kind won't compile until handled (the `never` default). `LearnTopic.parts` is `Partial<Record<ArticlePartKey, Section[]>>` — omit a part that doesn't apply (e.g. a reference topic with no `example`).

`TopicSummary` is the client-safe `Pick` (slug/title/category/summary/tags) used by the landing list + search, dropping the article body.

## Section kinds

| kind | renderer | notes |
| --- | --- | --- |
| `prose` | [ProseSection](../../src/learn/article/sections/ProseSection.tsx) | lightweight inline formatter — splits paragraphs, wraps `` `code` `` and `*emphasis*`. Not full markdown. |
| `code` | [CodeSection](../../src/learn/article/sections/CodeSection.tsx) | **async server component** — Shiki highlights server-side (`github-light` + `github-dark-default`), emitted as static HTML, zero client JS. Dark toggle via the `.dark` CSS rule in [globals.css](../../src/app/globals.css). |
| `complexity` | [ComplexityTable](../../src/learn/article/sections/ComplexityTable.tsx) | operation / average / worst / note. `ComplexityClass` is a closed Big-O union. |
| `graph` | [GraphDiagram](../../src/learn/article/sections/GraphDiagram.tsx) | hand-rolled SVG; nodes auto-laid on a circle (authors give ids + edges, no coordinates). `directed` adds arrowheads. |
| `matrix` | [MatrixGrid](../../src/learn/article/sections/MatrixGrid.tsx) | labeled grid; truthy cells highlighted. |
| `exampleProblem` | [ExampleProblemLink](../../src/learn/article/sections/ExampleProblemLink.tsx) | deep-links a bank problem by id; degrades to a note if the id isn't in the bank. |
| `row` | inline in [SectionRenderer](../../src/learn/article/SectionRenderer.tsx) | layout primitive — renders child sections in a 2-col grid (`sm:grid-cols-2`), stacked on narrow. Used for the graph+matrix pairing. |

**Figure alignment:** `graph` and `matrix` render their own heading (so heading + media + caption stay one centered stack), and `SectionRenderer` skips its outer `h4` for those kinds (`SELF_TITLED`). Both put their media in a shared-height band (`h-56`) so paired figures align across the `row`'s columns.

## Cross-link to problems

`LearnTopic.tags` reuse the problem taxonomy (`TopicTag` from [problem.ts](../../src/problems/data/problem.ts)) deliberately — one vocabulary wires the two features. `exampleProblem` sections resolve against the problem bank: the `/learn/[slug]` route builds a `Record<id, ProblemSummary>` from `listProblemSummaries()` server-side and threads it to the renderer, so the link shows a real title + difficulty. The bank stays server-side; the learn article never imports the registry directly.

See [improvements/learn.md](../improvements/learn.md) for the roadmap (resources/videos, practice lists, priority + study-plan model) benchmarked against the Tech Interview Handbook.
