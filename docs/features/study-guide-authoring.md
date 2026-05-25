# Authoring a Study Guide problem page — rubric

How to add a fully-taught **problem page** to a Study Guide chapter (e.g. 3Sum under "Two pointers" in the Algos track). This is the spec the problem-guide authoring agent follows. It complements [learn-authoring.md](learn-authoring.md) (which is for *topic* articles); this doc is for the *problem* pages rendered by [ProblemGuide](../../src/learn/guide/ProblemGuide.tsx). Feature overview: [learn.md](learn.md) → "Two views". The reference page is **3Sum** ([problemGuides.ts](../../src/learn/data/problemGuides.ts)) — read it before authoring a new one.

The bar is the ByteByteGo *Coding Interview Patterns* problem chapter (statement → brute force → "can we do better?" → optimal walkthrough → implementation → complexity → test cases), with the deliberate adjustments noted under **Conventions** below. Don't reproduce ByteByteGo verbatim — match the *shape*, apply our conventions.

**This is the authoring half of a two-agent pipeline.** This agent *writes* the page. A separate **auditor agent** then independently (a) audits the entry against this rubric, and (b) **verifies every authored test case** by running it through the real worker (`verify`). So: author carefully, but know the test-case outputs and the overall entry will be machine- and rubric-checked afterward — write them in a form the auditor can run (§11), and surface anything you're unsure about so the audit can focus there.

**Building a whole chapter at once?** The `study-guide-section-builder` agent orchestrates the entire flow for one chapter — sourcing the problem set from ByteByteGo, importing gaps, redoing the topic intro, running author → auditor for every problem, and batching all checks to the end. The per-problem author/auditor rules below are what it dispatches; read them as the contract that agent relies on.

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
   - **Bridge the model to the stored solution if they differ.** If the walkthrough teaches a different-but-equivalent variable model than the stored `solutions[]` actually uses (e.g. a `slow`/`fast` pair when the implementation tracks a `k`-as-count, or a walkthrough that never exercises an early-exit branch the code has), state the correspondence explicitly here — *"`slow` here is `k - 1` in the implementation"* — so a reader who scrolls from the walkthrough into the Optimization code never meets a variable that wasn't introduced. A faithful match is best; an explicit bridge is the fallback; an unexplained mismatch is a defect the auditor will flag.
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

**Pick the primitive from what the idea needs to show — don't default to a 1-D `lane`.** Before authoring a diagram, name the *thing a reader must see* to get the insight, then ask whether a single lane can actually show it. The lane draws **one** sequence with pointers/marks moving over it; if the mechanic lives somewhere a lane can't reach, the lane will render but quietly hide the very thing it's supposed to teach — and you can't catch that from the data alone (you won't see the rendered page). So reason about it up front. A lane **cannot** show:

- **a second array / a comparison that spans two structures** (a partition straddling two sorted arrays, a merge) — the cross-structure decision would be stuck in caption prose. Use `partitionWalkthrough` (§8c) for a cut across sorted arrays, `mergeWalkthrough` (§8e) for a k-way merge (the heap/two-pointer kind), or two stacked Sections.
- **a 2-D board** (§8a · `gridWalkthrough`), **linked-list `next` pointers / rewires** (§8b · `listWalkthrough`).

The available primitives are listed in §8a–§8d. If none fits, author honest prose + a static illustration and say so (§13) — a correct prose page beats a lane that animates the wrong thing. When you reach for the default lane, it should be because the idea genuinely *is* one sequence being scanned, not because it was the first kind you remembered.

`{ kind: "walkthrough", lane, showIndices?, frames }` ([WalkthroughDiagram](../../src/learn/article/sections/WalkthroughDiagram.tsx)) — for a single sequence being scanned. Rules:

- **`lane`** — the sequence being scanned (`(string | number)[]`). For sorted/array problems show the **sorted** array if that's what the optimal uses; put the sort in the `heading` (e.g. `heading: "sorted: [-4, -1, -1, 0, 1, 2]"`).
- **One lane per walkthrough Section.** `WalkthroughDiagram` renders the single `lane` for *every* frame; frames only move pointers/marks over it — they **cannot** swap in a second string/array. So every frame's `pointers.at` and `marked` indices must be in-bounds for that one lane, and no frame's `action`/`caption` may reference a value that isn't in the rendered lane. To show a **second** input (e.g. a passing case after a failing one, as Valid Palindrome does), add a **second** `walkthrough` Section with its own `lane` and `heading` — don't narrate a different input over the first lane.
- **`showIndices: true`** for any index-returning or index-reasoned problem.
- **`frames`** — **4–6** frames. Each: `pointers?: { name, at }[]`, `range?: [start, end]` (window highlight), `marked?: number[]` (evicted/skipped cells, struck through), `action?` (the decision callout beside the lane, e.g. `"sum < target → left++"`), `caption?` (the one-line why).
- **Pointer names drive color** (stable by first appearance: orange, sky, violet, emerald). Reuse conventional names: `left`/`right`, `L`/`R`, `i`, `slow`/`fast`.
- **Teach the whole mechanic, not just the happy path.** Include the cases learners trip on:
  - a **failing step** (a pointer move that finds nothing, motivating the next move),
  - the **edge/dedup step** (e.g. skipping a duplicate pivot, shrinking past a repeat),
  - the **success step(s)**.
  3Sum's walkthrough does all three — model it.
- Keep `action` terse and math-y; keep `caption` a plain-English why. Don't restate the code.

### 8a. Grid problems — use `gridWalkthrough`, not a 1-D lane

For 2-D board problems (Sudoku validation, matrix striping, grid scans) author a **`gridWalkthrough`** Section ([GridWalkthroughDiagram](../../src/learn/article/sections/GridWalkthroughDiagram.tsx)) — the 2-D analogue of `walkthrough`. It renders a stack of curated board snapshots, one per step. **Do not** flatten a grid onto a 1-D `lane` (a single row is misleading) and do not fall back to a prose-only description — the grid renderer exists now, so show the real board.

`{ kind: "gridWalkthrough", grid, showIndices?, frames }`:

- **`grid`** — the 2-D board `(string | number)[][]`. Rendered by the shared [BoardGrid](../../src/learn/article/sections/BoardGrid.tsx) primitive (same one the Example and Test-case inputs use, so a board reads identically everywhere). Empty cells (`"."` or `0`) render dimmed.
- **`showIndices: true`** for any coordinate-reasoned problem (Sudoku, matrix) — draws row/col index gutters.
- **`frames`** — **4–6** curated key steps (not every cell). Each: `cursor?: [row, col]` (the cell being scanned, orange highlight), `marked?: [row, col][]` (conflicts / cells about to be zeroed, rose), `active?: [row, col][]` (the region under inspection — current row/col/box, soft highlight), `action?`, `caption?`. Coordinates must be in-bounds for the board.
- **Per-frame `grid` override** — for an **in-place** problem where the board mutates (e.g. set-matrix-zeroes), give a frame its own `grid` to show the board's state at that step; otherwise frames reuse the section `grid` (e.g. Sudoku, where the board never changes and only the cursor moves).
- **Same "teach the whole mechanic" rule** as §8: include a scanning step, the conflict/decision step, and the outcome.

### 8b. Linked-list problems — use `listWalkthrough`, not a 1-D lane

For singly-linked-list problems (reversal, fast/slow midpoint, splice/remove, palindrome) author a **`listWalkthrough`** Section ([NodeChainDiagram](../../src/learn/article/sections/NodeChainDiagram.tsx)) — the linked-list analogue of `walkthrough`. A plain 1-D `lane` draws cells but no `next` arrows, no `null` terminator, and can't depict a *rewired* pointer — so a reversal or a splice reads as nonsense on a lane. The node-chain renderer exists now; use it instead of a lane or prose-only. It shares the `WalkthroughDiagram` palette/posture (server-rendered, pointer color stable by first appearance: orange, sky, violet, emerald).

`{ kind: "listWalkthrough", nodes, showIndices?, frames }`:

- **`nodes`** — the node values, head-first (`(string | number)[]`). The trailing `null` terminator is drawn automatically after the last node; you don't list it.
- **`showIndices: true`** for position-reasoned problems (remove the kth-from-end, reverse-between positions).
- **`frames`** — **4–6** curated steps. Each:
  - **`pointers?: { name, at }[]`** — labeled arrows above nodes. `at` is a node index, or **`at: null`** to park a pointer on the `null` terminator (e.g. `prev = null` at the start of a reversal). Reuse conventional names: `prev`/`curr`/`next`, `slow`/`fast`, `dummy`, `left`/`right`.
  - **`links?: Record<number, number | null>`** — per-node `next`-link overrides, by *source* node index → *target* node index (or `null` for the terminator). This is the linked-list equivalent of the grid's per-frame `grid` override: use it to depict an **in-place rewire** — a reversed link (`{ 1: 0 }` makes node 1 point back at node 0, drawn as a backward arrow) or a splice. Nodes not listed keep their default forward link (`i -> i + 1`, last → null).
  - **`marked?: number[]`** — node indices removed/skipped this step (dimmed, struck through).
  - **`active?: number[]`** — node indices softly highlighted as the region under inspection (e.g. the sublist being reversed).
  - **`action?`** / **`caption?`** — same as §8 (terse decision callout beside the chain; plain-English why under it).
- **Same "teach the whole mechanic" rule** as §8: show the setup, a representative mid-rewire step (the backward link / the pointer that didn't move yet), and the final state.

### 8c. Partition problems — use `partitionWalkthrough`, not a 1-D lane

For problems whose insight is a **cut across two (or more) sorted arrays** — the median of two sorted arrays, and partition/merge-flavored searches generally — author a **`partitionWalkthrough`** Section ([PartitionDiagram](../../src/learn/article/sections/PartitionDiagram.tsx)). A 1-D lane can only draw one array, so the cross-array comparison that *is* the algorithm (`maxLeft ≤ minRight`, where the two sides straddle different arrays) gets exiled to caption prose and the diagram teaches nothing. The partition renderer stacks the arrays as rows, draws each row's cut line, rings the boundary cells, and **derives** the verdict so it can't drift from the picture.

`{ kind: "partitionWalkthrough", rows, showIndices?, frames }`:

- **`rows`** — the sorted arrays as `{ label, values: number[] }[]` (two for median; the model generalizes to more). `label` is the row tag shown at left (`"nums1"`).
- **`frames`** — **4–6** curated candidate partitions. Each carries **`cuts: number[]`** (how many of each row's values fall on the *left* of the cut, `0 … values.length`, one entry per row) plus **`action?`** / **`caption?`** (§8 rules). The renderer computes each row's boundary values (last-left / first-right, with `−∞` / `+∞` sentinels at the edges), the global `maxLeft` = max of the left boundaries and `minRight` = min of the right boundaries, and the `maxLeft ≤ minRight` ✓/✗ verdict — so **don't restate those in the caption as if you computed them**; let the strip show them and use `action`/`caption` for the *decision* (which way to shift the cut, and why).
- **Show the search, not just the partition** — give each frame **`search: { lo, hi }`** (the candidate range for the cut in row 0; the probe `mid` is `cuts[0]`). The renderer then draws a **cut axis** above the rows with `lo`/`hi`/`mid` pointers and the discarded candidates struck through, so the *halving* is visible. Without it the diagram shows only the partition state and reads like two pointers — the exact trap §8's lead warns about. **Pick an example big enough that the cut visibly jumps** (e.g. `cut1: 2 → 4 → 3`), not one so small the binary search is indistinguishable from `+1` stepping.
- **Match the stored solution's variable names** in `action` (`cut1`, `left1`/`right1`/`left2`/`right2`, `maxLeft`/`minRight`, `lo = cut1 + 1`) so a reader moving from the diagram into the Optimization code meets the same names.
- **Same "teach the whole mechanic" rule** as §8: at least one **invalid** cut with the shift it forces (✗), then the **valid** cut (✓), then reading the median off `maxLeft` (and `minRight` for an even total).

### 8d. Adding a *new* data render — wire it into the Example & Test-case cells too

This is for whoever **builds a new visual primitive** for a data type (the next tree-node, interval, or graph render), not for per-problem authoring — once a primitive exists, example/test-case rendering is automatic and needs nothing from the author (see below).

A data type that gets a custom diagram should render **the same way wherever that value appears** — inside walkthroughs *and* in the Example / Test-case Input/Output cells — so the value reads identically across the page. The Example and Test-case cells are rendered by `ArgValues` / `ResultValue` in [ProblemGuide](../../src/learn/guide/ProblemGuide.tsx), which pick a renderer **from the problem's `io` shape** (`io.params[i]` / `io.result`), not from the value's JS shape — a list `head` and a plain `nums` array are both arrays, so only the io shape disambiguates. Precedent: `"linked-list"` → [NodeChain](../../src/learn/article/sections/NodeChain.tsx) (raw `[…]` + chain, stacked); 2-D grids → [BoardGrid](../../src/learn/article/sections/BoardGrid.tsx).

When you add a primitive: build a static, server-rendered render (the non-interactive sibling of the walkthrough diagram), then teach `ArgValues`/`ResultValue` to dispatch to it on the matching `IoShape`. **Don't** leave a new render usable only inside walkthroughs while examples fall back to a raw `JSON.stringify`.

**Per-problem authors do nothing here** — set the `io` shapes correctly (you already must, for the judge) and the right render appears in the Example and Test-case cells automatically.

### 8e. K-way merge problems — use `mergeWalkthrough`, not a 1-D lane

For problems whose insight is **merging `k` sorted sequences by repeatedly taking the smallest current head** (merge k sorted lists/arrays, and the heap "frontier" pattern generally) author a **`mergeWalkthrough`** Section ([MergeWalkthroughDiagram](../../src/learn/article/sections/MergeWalkthroughDiagram.tsx)). A 1-D lane can draw only one sequence, so the `k` lists get flattened into one row and disambiguated with `ᵃ/ᵇ/ᶜ` superscripts — which makes the reader reverse-engineer which list each value came from, hiding the very mechanic (one frontier per list, the min across them) the diagram should teach. The merge renderer stacks the lists as colored rows, each with a single **frontier** cell (consumed cells dimmed/struck), **derives the heap** from those frontier cells (so the heap strip can't drift from the rows), and grows a **result** lane. Server-rendered, no client JS; shares the `WalkthroughDiagram` palette (each list keeps one color across frames, shared by its row label, frontier cell, and heap pill).

`{ kind: "mergeWalkthrough", lists, frames }`:

- **`lists`** — the `k` sorted inputs as `{ label, values }[]`. `label` is the row tag at left (`"list a"`); the row's color is assigned by its order.
- **`frames`** — **4–6** curated steps. Each:
  - **`cursors: (number | null)[]`** — one entry per list: the index of its current frontier head, or **`null`** once that list is drained. The renderer dims/strikes every cell before the cursor and highlights the cursor cell as that list's heap candidate.
  - **`result: (string | number)[]`** — the merged output *so far*, drawn as a result lane under the lists (give the final "drain" frame the complete output).
  - **`popped?: number`** — the list index whose frontier was the min this step; its frontier cell and heap pill are drawn as the chosen minimum.
  - **`action?`** / **`caption?`** — same as §8 (terse decision callout beside the lists — e.g. `"advance a → 4; pop min 1 (list b)"` — plus the plain-English why under it).
- **Don't restate the heap contents as if you computed them** — the renderer derives the heap strip and the chosen min from `cursors` + `popped`; use `action`/`caption` for the *decision* (which list's head won, which list advances).
- **Same "teach the whole mechanic" rule** as §8: the seed step, a couple of pop-and-advance steps (including one where a *different* list wins), and a final drain frame showing the completed result.
- **Bridge if the stored solution differs.** Merge-k's canonical teaching model is the heap; if the stored `solutions[]` uses divide-and-conquer pairwise merging instead, keep the §4 model bridge prose — the diagram traces the heap, the bridge explains the equivalent route the code takes.

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
- **Don't run a render/dev-server check.** The maintainer reviews the rendered page themselves; agent-driven render checks usually just fail to boot and waste a turn. Confirm the section *data* is well-formed (tsc + the section types catch structural problems); leave the visual pass to the maintainer.
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
