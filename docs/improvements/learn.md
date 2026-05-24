# Learn — roadmap (benchmarked vs Tech Interview Handbook)

Gap list for the Learn feature, measured against the [Tech Interview Handbook](https://www.techinterviewhandbook.org/coding-interview-study-plan/) (study plan + 20 algorithm topic pages, read from its open-source repo). Feature state: [features/learn.md](../features/learn.md). Severity: **P1** core gap · **P2** valuable · **P3** nice-to-have.

## Reference model (what they do)

**Per-topic page** — canonical sections (from their `__template__.md`, confirmed across all 20 pages): Introduction · Learning resources (articles **+ YouTube videos**) · topic-specific reference (Common terms / Representations / Common routines / language-API Implementations table) · Time complexity table · **Things to look out for during interviews** · **Corner cases** · **Techniques** · **Essential questions** (must-do, linked) · **Recommended practice questions** (broader, linked) · Recommended courses (affiliate).

**Study plan** — topics graded by **Priority (High/Mid/Low)** and **Time required (hours)**, *not difficulty*. Sequenced by **week**: a 3-month plan = Weeks 1–4 topical study (one `Topic | Priority | Time` table per week, ordered by priority), then Weeks 5–12 in-depth practice (75 tracked questions). Time-horizon variants (1 week / 1 month / 3 month). Difficulty is a property of *questions*, never topics.

## Per-page content gaps

Our parts (`definition / operations / whenToUse / relatedStructures / implementation / example`) cover Introduction, Time complexity, and a single worked Example. Missing, in priority order:

- **P1 — Practice list, two tiers.** We link 1–2 `exampleProblem`s inline. Add an `essential` vs `recommended` split that lists N bank problems per topic (mirrors their split). New `practice` part + reuse `ExampleProblemLink` as a list; pull candidates by shared `tag`. Surface topics whose bank coverage is thin → feed the problem-importer.
- **P1 — Learning resources + videos.** We have none; their pages average several, some video-heavy (sorting, tree). Add a `resources` Section kind: `{ kind: "resources"; items: { label; url; type: "article" | "video" | "doc" }[] }`, icon per type, video → linked thumbnail (don't embed an iframe — keep it a server component).
- **P2 — "Things to look out for" + "Corner cases".** High-value interview content we lack. Add `pitfalls` and `cornerCases` ARTICLE_PARTS (or as labeled prose subsections). Corner cases especially pair with the practice list.
- **P2 — "Techniques".** Topic-specific patterns (two-pointers, sliding window…). Today we bury these in prose. Add a `techniques` part as a list where each technique can `[[link]]` to its own topic — this is the strongest argument for parent/child topics (a technique *is* a topic).
- **P3 — Glossary / reference blocks.** Their "Common terms", "Representations", "Common routines" → a `terms` Section kind (definition list) to standardize what we currently freeform in prose.
- **Skip — Recommended courses** (affiliate) and the language-API `Implementations` table (overlaps our `operations`).

## Navigation / list model (the open question)

Direction decision for "should /learn be a list like /problems, categorized by difficulty / stage / parent topic":

- **P1 — Make /learn a faceted catalog, reusing the problems facet engine.** `FACETS` / `buildFacetViews` / `searchCatalog` ([catalogFilters.ts](../../src/problems/catalog/catalogFilters.ts)) are generic over row shape. Facet topics by **category**, **priority**, **technique/tag**, and **read-status**. This is the literal "list like problems" ask with near-zero new infra.
- **P1 — Add `priority: "high" | "mid" | "low"` and `estimatedMinutes` to `LearnTopic`.** This is the handbook's actual topic-grading axis and the cheapest high-fidelity change — it powers the priority facet *and* the study-plan ordering below.
- **P2 — Parent/child topics.** Add optional `parent?: TopicSlug`. Resolves "sometimes part of a parent topic": granular pages (adjacency-matrix, BFS, DFS) nest under a parent (graph). The handbook keeps these as one big page; we keep granular pages **grouped under a parent** in the catalog — more reusable and matches our finer-grained authoring.
- **Decision — do NOT grade topics by difficulty.** The handbook doesn't, and it's the right call: difficulty is a property of the practice *problems* we link. Grade topics by **priority**; express progression via a **study-plan stage**, not a difficulty label.
- **P3 — Study-plan / stage view.** A `/learn/plan` that sequences topics into weeks/stages from `priority` + `estimatedMinutes` against a target time budget (their Grind-75-style generation), with progress tracking. Build *after* the catalog + priority metadata land.

## Cross-feature

- **P2 — Topic ↔ problem back-links.** Tags already wire them one way; let a problem page surface "Learn: <topic>" for its tags.
- **P3 — Topic read-progress.** Reuse the progress-store *pattern* (not the problem `complete` shape — its `completedAt`/`solution` are problem-specific) with a separate `noodle:learn-read` set. Powers the read-status facet.
