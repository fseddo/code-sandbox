# Authoring a Study Guide problem page — rubric

How to add a fully-taught **problem page** to a Study Guide chapter (e.g. 3Sum under "Two pointers" in the Algos track). This is the spec the problem-guide authoring agent follows. It complements [learn-authoring.md](learn-authoring.md) (which is for *topic* articles); this doc is for the *problem* pages rendered by [ProblemGuide](../../src/learn/guide/ProblemGuide.tsx). Feature overview: [learn.md](learn.md) → "Two views". The reference page is **3Sum** ([problemGuides.ts](../../src/learn/data/problemGuides.ts)) — read it before authoring a new one.

The bar is the ByteByteGo *Coding Interview Patterns* problem chapter (statement → brute force → "can we do better?" → optimal walkthrough → implementation → complexity → test cases), with the deliberate adjustments noted under **Conventions** below. Don't reproduce ByteByteGo verbatim — match the *shape*, apply our conventions.

**This is the authoring half of a two-agent pipeline.** This agent *writes* the page. A separate **auditor agent** then independently (a) audits the entry against this rubric, and (b) **verifies every authored test case** by running it through the real worker (`verify`). So: author carefully, but know the test-case outputs and the overall entry will be machine- and rubric-checked afterward — write them in a form the auditor can run (§11), and surface anything you're unsure about so the audit can focus there.

## 1. Page anatomy — derived vs authored

A problem page is assembled from three sources. **The agent only writes the "authored" rows.** Everything else is pulled from the problem bank automatically.

| Section (in order) | Source | Who writes it |
| --- | --- | --- |
| Header (`#number`, title, difficulty, tags, "Asked at" companies, Open-in-editor) | derived from the bank + `companies.ts` | — |
| Statement (lede paragraph) | derived from `problem.prompt` | — |
| **Example** (one) | derived from `problem.examples[0]` | — |
| **Constraints** | derived from `problem.constraints` | — |
| **Intuition** (lead → brute-force code → retrospective → walkthrough) | **authored** → `PROBLEM_GUIDES[id]` | **agent** |
| **Optimization** (approach write-up + implementation) | derived from `problem.solutions` | agent *comments the code* (§9) |
| **Complexity analysis** | **authored** → `PROBLEM_EXTRAS[id].complexity` | **agent** |
| **Test cases** | **authored** → `PROBLEM_EXTRAS[id].testCases` | **agent** |
| "Try it yourself" CTA + prev/next nav | automatic | — |

So the agent produces: `PROBLEM_GUIDES[id]` (a `Section[]`), `PROBLEM_EXTRAS[id]` (`{ complexity, testCases }`), and **inline comments on the stored solution** in the problem's bank file.

## 2. Where everything lives

- **Intuition + complexity + test cases:** [src/learn/data/problemGuides.ts](../../src/learn/data/problemGuides.ts) — `PROBLEM_GUIDES` (intuition `Section[]`) and `PROBLEM_EXTRAS` (`{ complexity?: Section[]; testCases?: GuideTestCase[] }`).
- **Optimization code:** the problem's own module under [src/problems/data/problems/](../../src/problems/data/problems/), in its `solutions[]` field (also shown in the editor's Solutions tab — single source).
- **Whether the page exists at all:** a problem only appears as a chapter entry if its id is in the chapter's problem list — i.e. in the **topic's `practice` section** (essential/recommended) or an explicit `chapter.problems` override in [curriculum.ts](../../src/learn/data/curriculum.ts). Confirm/add that first, or the page won't be reachable.

## 3. Procedure

1. **Confirm the problem is in the bank.** It must have an id under `src/problems/data/problems/`. If not, it's out of scope — import it first (problem-importer), then return.
2. **Confirm it's wired to a chapter.** Check the target topic's `practice` list (or the chapter's `problems` override) includes the id. If missing, add it there so the entry renders.
3. **Read the problem module** — `prompt`, `examples`, `constraints`, `functionName`, and the `solutions[]` (the canonical optimal). The walkthrough and complexity must match the *stored* optimal approach, not an invented one.
4. **Author `PROBLEM_GUIDES[id]`** — the Intuition section (§5–§8).
5. **Comment the stored solution** if it lacks comments (§9).
6. **Author `PROBLEM_EXTRAS[id]`** — complexity (§10) + test cases (§11).
7. **Verify** (§12).
8. **Report confidence** per the accuracy rules (§13).

## 4. The narrative arc (the spine)

The Intuition section must move brute-force → optimal the way ByteByteGo does:

1. **Lead** — one short paragraph: what the naïve approach does, plainly.
2. **Brute-force code** — the simplest correct solution, commented (§9), with a caption stating its complexity (e.g. *"Brute force — every triple, deduped by sorted key: O(n³)."*).
3. **Retrospective** — the bridge. This is the part most worth getting right:
   - Name the flaw and ask the question: *"This is O(n³) — far more work than necessary. Can we do better?"*
   - State the **key observation** that unlocks the optimization (*"if we fix one number, the rest is just finding a pair…"*).
   - Connect to a known pattern when one applies, as a **cross-link** (§7): *"…which is exactly the [Two pointers](/learn/guide/algos/topic/two-pointers) pair-sum problem."*
   - Transition into the diagram, ending on a colon: *"Walking it through:"*
4. **Walkthrough** — visualize the optimal idea frame by frame (§8).

(Optimization, Complexity, and Test cases follow automatically/▸authored after this.)

## 5. Section kinds available in the overlay

`PROBLEM_GUIDES[id]` is a `Section[]` rendered by the shared `SectionRenderer`. Use:

- **`prose`** — `{ kind: "prose", body, heading? }`. Supports the inline mini-markdown in §7. Omit `heading` inside Intuition (the section already has its "Intuition" h2). Split paragraphs with `\n\n`.
- **`code`** — `{ kind: "code", lang: "javascript" | "typescript", source, caption? }`. Shiki-highlighted, with a copy button. Use for the brute force.
- **`walkthrough`** — the diagram (§8).
- **`callout`** — `{ kind: "callout", tone: "warn" | "info" | "tip", items: string[] }` for a boxed aside (e.g. a gotcha). Use sparingly.

## 6. Our adjustments from ByteByteGo — read this

These are the deliberate deltas. **Follow them; do not copy ByteByteGo's choices where they conflict.**

- **Diagrams are generated from typed data, not images.** ByteByteGo uses hand-drawn raster pointer diagrams. We render the typed `walkthrough` Section instead — it themes with the app, stays diffable, needs no asset pipeline, and is authored as data. **Never reference or embed an image for a pointer/array walkthrough.** (§8 is our equivalent of their figures.)
- **Show one Example at the top, not several.** The page derives a single representative example; broader inputs live in the **Test cases** table at the bottom. Don't try to add more examples up top.
- **Test cases are authored edge cases, *never* the real hidden judge tests.** Surfacing hidden tests would let a solver hardcode them in the editor. Hand-write illustrative edges (empty, single, all-same, no-solution, duplicates) and compute their outputs yourself (§11).
- **Teaching code is generously commented** (§9) — the opposite of the app's source-comment rule. ByteByteGo comments most lines; match that for the snippets shown on the page.
- **Bold for sub-labels, not italics.** Lead-ins like `**Time complexity:**` use bold. Reserve `*italic*` for genuine emphasis on a term.
- **Break dense prose into short paragraphs** (`\n\n`) — a few sentences each, like ByteByteGo, not one block.
- **Don't personify the grader.** Never call it "the judge" or say it "judges"; say "run", "submit", "the tests", "the reference solution". (See the project memory on prompt wording.)

## 7. Prose / inline markdown ([renderInline](../../src/learn/article/sections/renderInline.tsx))

Supported in any `prose` body, `callout` item, or constraint:

- `` `code` `` → inline code · `**bold**` → strong · `*italic*` → emphasis
- `[label](/href)` → link (use for cross-linking related patterns/topics; internal hrefs like `/learn/guide/algos/topic/<slug>` or `/problems/<id>`)
- `[[glossary term]]` → glossary tooltip (falls back to plain text if unknown)
- A blank-line-separated block whose **every** line starts with `- ` renders as a **bullet list** (used for complexity, §10)

Keep paragraphs short; lead a labeled paragraph with `**Label:**`.

## 8. Walkthrough authoring (our diagram)

`{ kind: "walkthrough", lane, showIndices?, frames }` ([WalkthroughDiagram](../../src/learn/article/sections/WalkthroughDiagram.tsx)). Rules:

- **`lane`** — the sequence being scanned (`(string | number)[]`). For sorted/array problems show the **sorted** array if that's what the optimal uses; put the sort in the `heading` (e.g. `heading: "sorted: [-4, -1, -1, 0, 1, 2]"`).
- **`showIndices: true`** for any index-returning or index-reasoned problem.
- **`frames`** — **4–6** frames. Each: `pointers?: { name, at }[]`, `range?: [start, end]` (window highlight), `marked?: number[]` (evicted/skipped cells, struck through), `action?` (the decision callout beside the lane, e.g. `"sum < target → left++"`), `caption?` (the one-line why).
- **Pointer names drive color** (stable by first appearance: orange, sky, violet, emerald). Reuse conventional names: `left`/`right`, `L`/`R`, `i`, `slow`/`fast`.
- **Teach the whole mechanic, not just the happy path.** Include the cases learners trip on:
  - a **failing step** (a pointer move that finds nothing, motivating the next move),
  - the **edge/dedup step** (e.g. skipping a duplicate pivot, shrinking past a repeat),
  - the **success step(s)**.
  3Sum's walkthrough does all three — model it.
- Keep `action` terse and math-y; keep `caption` a plain-English why. Don't restate the code.

## 9. Code & comments

- **Brute-force snippet** (authored, in the overlay): the simplest correct approach. Comment each meaningful step with intent (*why*, ByteByteGo density): a comment above the loop, above the key line, and an inline trailing note where it clarifies. Caption states the complexity.
- **Optimization code** (the stored `solutions[]` in the problem module): if it lacks comments, **add them** in the same style — to *every* language variant present (`javascript` **and** `typescript`), since both the guide and the editor's Solutions tab render from it. Comments must describe intent, not narrate syntax.
- Match the real `functionName` so the snippet lines up with the editor.

## 10. Complexity analysis (`PROBLEM_EXTRAS[id].complexity`)

A `Section[]` of `prose`. Format each of Time and Space as **lead → bullets → summary** (this is the ByteByteGo "Here's why:" shape):

```
**Time complexity:** O(n²). Here's why:

- Sorting the array takes O(n log n).
- Then, for each of the `n` values, a two-pointer scan over the suffix runs in O(n).

So the scans cost n × O(n) = O(n²), which dominates the sort — the overall time is **O(n²)**.
```

Do the same for Space. State what *isn't* counted (e.g. the output array) and the worst case if it were.

## 11. Test cases (`PROBLEM_EXTRAS[id].testCases`)

A `GuideTestCase[]` — `{ args, expected, note }`, the same `args`/`expected` shape the judge uses, rendered as an Input / Expected output / Description table (the columns are *derived* from `args`/`expected`, formatted like the Example section). Rules:

- **Runnable, not display strings.** `args` is the argument tuple **in call order** (for `threeSum(nums)`, one array param → `args: [[0, 0, 0]]`); `expected` is the literal the reference solution returns (`expected: [[0, 0, 0]]`). The auditor executes each case through the worker, so faithful structured values are mandatory — no prose.
- **Authored edge cases, not hidden tests.** Cover: empty, single element, the smallest no-solution case, all-equal, and a **duplicates** case that exercises dedup. 4–6 rows.
- **Match what the reference actually returns.** If the problem allows multiple valid answers (any order, etc.), set `expected` to the exact deterministic output of the stored solution; if you can't be sure of ordering, note it so the auditor compares with the problem's `checker` rather than deep-equal.
- **Still compute every `expected` yourself.** The audit is the gate, not your excuse to guess — a case the auditor finds wrong bounces back to you, and a wrong value teaches the wrong thing if it slips through.

## 12. Verification

Run and confirm all pass:

- `npx tsc --noEmit` — clean.
- `npx eslint src/learn src/problems/data/problems/<file>.ts` — clean.
- `node scripts/verifyProblems.mjs <slug>` — still PASS (confirms commenting the stored solution didn't break the problem).
- **Render check**: hit `/learn/guide/<track>/problem/<id>` and confirm: one Example, Intuition reads lead→brute→retrospective→walkthrough, the walkthrough frames are correct, Optimization shows the commented solution, Complexity bullets render, Test cases table renders, prev/next nav points at the right neighbours.
- **Self-derive** every walkthrough frame, brute-force output, and test-case output before handing off. The auditor verifies the test cases mechanically, but the walkthrough, brute-force code, and complexity are reasoning the auditor reviews — not runs — so they must be right going in.

## 13. Hand-off to the auditor

The auditor agent runs after you. It will:

- re-check the entry against this rubric (structure, conventions, language),
- **run every `testCases` entry through the worker** (`verify`) and flag any output that doesn't match the reference solution,
- spot-check the brute-force snippet and walkthrough for correctness.

Your job is to make that audit boring. So:

- Make `testCases` **runnable and faithful** (§11) — that's what the auditor executes.
- If you can't build a faithful walkthrough (e.g. the optimal doesn't show well on a 1-D lane), author intuition + brute + retrospective + a prose description of the optimal **instead of a misleading diagram**, and say so. A correct, honest page beats a pretty wrong one.
- **Report a confidence level and list anything you couldn't verify yourself** (ambiguous outputs, a walkthrough you simplified, an approximation) so the audit targets it.

## 14. Skeleton

```ts
// in src/learn/data/problemGuides.ts

// PROBLEM_GUIDES[id] — the Intuition section
"<problem-id>": [
  { kind: "prose", body: "<lead: what the brute force does, plainly>" },
  { kind: "code", lang: "javascript", caption: "Brute force — … O(…).", source:
    "function <fn>(…) {\n" +
    "  // intent comment\n" +
    "  …\n" +
    "}" },
  { kind: "prose", body:
    "This is O(…) — far more work than necessary. Can we do better?\n\n" +
    "<key observation>, which is exactly the [related pattern](/learn/guide/<track>/topic/<slug>).\n\n" +
    "<one-line transition>. Walking it through:" },
  { kind: "walkthrough", heading: "<sorted/labeled input>", showIndices: true, lane: [/* … */], frames: [
    /* 4–6 frames: a failing step, the dedup/edge step, the success step(s) */
  ] },
],

// PROBLEM_EXTRAS[id] — after the Optimization section
"<problem-id>": {
  complexity: [
    { kind: "prose", body: "**Time complexity:** O(…). Here's why:\n\n- …\n- …\n\nSo … **O(…)**." },
    { kind: "prose", body: "**Space complexity:** O(…). Here's why:\n\n- …\n- …\n\n<what isn't counted>." },
  ],
  testCases: [
    { args: [/* call args, in order */], expected: /* reference return */, note: "<what it probes>" },
    // empty · single · smallest no-solution · all-equal · duplicates …
  ],
},
```

Plus: comment the stored `solutions[]` code in the problem's bank module (every language variant).
