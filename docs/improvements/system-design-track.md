# System design track — prerequisites & punch list

Blocking work for the System design track ([manifest](../system-design-lesson-manifest.md),
[rubric](../features/system-design-authoring.md)). The blocking prerequisites are **done** — see below.

## Before chapter 01 — **done** (2026-08-25)

All prerequisites landed; `system-design-chapter-builder` is unblocked. What shipped: the `architecture`,
`sequence`, `comparison` and `numbers` `Section` kinds (renderers + dispatcher + a geometry smoke test at
[systemDesignSections.test.tsx](../../src/learn/article/sections/systemDesignSections.test.tsx)); the
`ConceptChapter` form in [curriculum.ts](../../src/learn/data/curriculum.ts); `progressKey` on every
`GuideEntry` plus [TopicReadToggle](../../src/learn/guide/TopicReadToggle.tsx); the `tradeoffs` and
`interviewAngle` article parts; the `relatedStructures` → "Related concepts" relabel; and eight new `LearnTag`s.
See [features/learn.md](../features/learn.md) for the current model.

Also live: **`node scripts/lintTopics.mjs`** — the prose/structure gate behind rubric §6a, wired into the
lesson author (per-file, self-correcting), the auditor (as its floor), and the chapter builder's batched sweep
(with a cross-page repetition pass). Calibrated against chapter 01.

Two things to watch, now that they're live:

- **Algos progress denominators changed.** The sidebar counts every entry, so each algos chapter's intro page now counts toward `x/N`. Existing local progress isn't lost, but percentages dropped by one entry per chapter.
- **The four renderers have not been looked at.** Geometry is unit-tested, not eyeballed — the first chapter built is also their first visual review.

## After the first chapter ships (non-blocking)

- **`/concepts` will swamp.** 174 new `systems` topics land on a flat catalog built for ~40. Use `parent` (rubric §3) to nest each chapter's lessons under its anchor lesson, and re-check whether `LearnCategory` needs splitting beyond `systems`.
- **Category theme** — [categoryTheme.ts](../../src/learn/shared/categoryTheme.ts) accents were picked when `systems` held 2 topics; re-check contrast once it holds 174.
- **Glossary pressure** — `[[term]]` resolution ([glossary.ts](../../src/learn/data/glossary.ts)) falls back to a topic-slug match, so most cross-links resolve for free. Audit for terms used before their lesson exists (they render as plain text, which is the correct degradation but reads as a missing link).

## Phase 2 — case studies (not started)

- Second content model: requirements → capacity estimation → API design → high-level design → deep dives. Mockup drafted at [mockups/detail-system-design.html](mockups/detail-system-design.html).
- Needs its own rubric + author/auditor agents; the concept lessons are its prerequisite (a case study links out to them rather than re-teaching).
