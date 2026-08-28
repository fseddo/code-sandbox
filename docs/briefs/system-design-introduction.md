# 01. Introduction to System Design — research brief

Produced by `system-design-chapter-sourcer` on 2026-08-25 for the two lessons in
[manifest §01](../system-design-lesson-manifest.md#01-introduction-to-system-design-2). Rubric:
[system-design-authoring.md](../features/system-design-authoring.md).

Every URL in this brief was fetched during research. Where a fetch failed, the failure is recorded under
**Sources that failed** at the bottom — do not silently re-cite those.

## Chapter shape

- **Anchor lesson: `what-is-system-design`.** No `parent`. It is the most general page in the chapter and the
  on-ramp for the whole track.
- `system-design-interview-framework` sets `parent: "what-is-system-design"`.
- **Seeds: none.** No existing topic file maps to either lesson. Nothing to harvest, nothing to delete.
- **Already-built siblings: none in this track.** The 42 existing topic files are all `data-structures` /
  `algorithms` / `complexity` / `databases` / `web`. The only de-duplication surface in this run is these two
  pages against each other — which is exactly why the ownership map below is the load-bearing part of this brief.
- **Chapter wiring** (rubric §8.2): `TRACKS["system-design"].chapters` is currently `[]`. This chapter adds
  `{ title: "Introduction to System Design", topics: ["what-is-system-design", "system-design-interview-framework"] }`
  as a `ConceptChapter`. Chapter 01 is built **last** in the manifest's build order, so by the time this runs the
  array is likely non-empty — insert at index 0, not by append.

### Ownership map

The failure mode for this chapter is **both pages teaching requirements-gathering**. The split is: lesson 1 owns
the **noun**, lesson 2 owns the **verb**.

| Concept | Owned by | Linked from | Handoff |
| --- | --- | --- | --- |
| What "system design" means as an activity | `what-is-system-design` | `system-design-interview-framework` | framework page opens by assuming it |
| Why the interview differs from a coding interview (open-ended, no oracle, 45 min, graded on reasoning) | `what-is-system-design` | `system-design-interview-framework` | framework page states the format in one clause and links back |
| **Functional vs non-functional requirements — the definition, the form each takes, how each is tested** | `what-is-system-design` | `system-design-interview-framework` | **the single highest-risk overlap. Lesson 2 must not define these terms.** |
| The quality-attribute vocabulary (availability, latency, throughput, durability, consistency, cost, maintainability) as *names* | `what-is-system-design` | everything downstream | one line each, each forward-linked to its own ch02 lesson; **no depth here** |
| SLI / SLO / SLA as the shape a non-functional requirement takes | `what-is-system-design` | `system-design-interview-framework` | one paragraph; the nines table and error budgets belong to `[[availability]]` (ch02) |
| "Every design decision costs something" — the chapter's thesis | `what-is-system-design` | whole track | — |
| **The 45-minute procedure: the four steps, their order, their time budgets** | `system-design-interview-framework` | `what-is-system-design` | lesson 1's `relatedStructures` points here: "what to produce is here, how to produce it in 45 minutes is there" |
| **How to elicit requirements under time pressure** (the clarifying-question checklist, the 5-minute timebox) | `system-design-interview-framework` | — | lesson 2 teaches *the eliciting move*, never *what a requirement is* |
| **Back-of-the-envelope / capacity estimation — the method, the arithmetic, the worked table** | `system-design-interview-framework` | `what-is-system-design` (name-drop only) | lesson 1 must not do arithmetic |
| Time management + the failure modes of the interview itself | `system-design-interview-framework` | — | — |
| The competing framings (ByteByteGo / Hello Interview / system-design-primer) | `system-design-interview-framework` | — | — |
| The nines table, error budgets, availability math | **neither — `[[availability]]`, ch02** | both | lesson 1 may quote **at most one** figure inline (99.9% ≈ 43.2 min/month) and must link out |
| Vertical vs horizontal scaling, CAP, sharding, caching | **neither — ch02/09/11** | both | link only |

**Concrete handoff text to put in `relatedStructures`:**

- `what-is-system-design` → "Read `[[system-design-interview-framework]]` next: this page is the vocabulary and
  the standard a design is judged against; that one is the 45-minute procedure that produces one."
- `system-design-interview-framework` → "`[[what-is-system-design]]` defines functional vs non-functional
  requirements and the quality vocabulary this page uses; here we only cover how to get them out of an
  interviewer in five minutes."

### Forward references — exact manifest slugs

Both pages will name concepts whose lessons don't exist yet. Rubric §6: write the `[[slug]]` anyway; it degrades
to plain text and lights up when the chapter lands. **Neither page may depend on any of these for comprehension**
— every one must be intelligible from the one clause around it.

| Slug | Chapter | Note |
| --- | --- | --- |
| `[[scalability]]` `[[availability]]` `[[reliability]]` `[[latency-vs-throughput]]` `[[cap-theorem]]` `[[consistency-models]]` `[[consistent-hashing]]` `[[single-point-of-failure-spof]]` | 02 | the quality vocabulary lesson 1 name-drops |
| `[[load-balancers]]` | 04 | |
| `[[rate-limiting]]` `[[api-gateways]]` `[[idempotency]]` | 05 | |
| `[[rest-apis]]` | 05 | **not `rest-api-design`.** The manifest's seed note keeps the existing slug `rest-apis` and retitles it. The page exists today as a stub, so this link resolves *now*. |
| `[[message-queues]]` `[[sync-vs-async-communication]]` | 06 | |
| `[[what-is-caching]]` `[[content-delivery-network-cdn]]` | 07 | |
| `[[database-types]]` `[[sql-vs-nosql]]` | 08 | |
| `[[sharding]]` `[[read-replicas]]` | 09 | |
| `[[database-indexing]]` | 09 | **not `indexing`.** Manifest keeps the existing slug. Resolves now (stub). |
| `[[vertical-vs-horizontal-scaling]]` `[[strong-vs-eventual-consistency]]` | 11 | |
| `[[client-server-architecture]]` `[[microservices-architecture]]` | 12 | |
| `[[object-storage]]` | 10 | |
| `[[three-pillars-observability]]` | 19 | |

**Do not link `[[caching-and-cdns]]` or `[[nosql-databases]]`.** Those stubs exist today but the manifest slates
both for deletion when chapters 07/08 land. Use `[[what-is-caching]]` / `[[sql-vs-nosql]]` instead — they degrade
to plain text now and resolve later, which is the correct trade.

`[[redis]]`, `[[mongodb]]`, `[[relational-databases]]` resolve today and are safe.

---

## Reference delta (§1a) — added 2026-08-26, after the fact

This chapter was built before rubric §1a existed, so its delta was run retrospectively against
[`what-is-system-design`](https://algomaster.io/learn/system-design/what-is-system-design) (~8.5 min: definition
· the core idea · what system design covers · basic building blocks · how to approach a design problem ·
interviews vs real life · conclusion). Recorded here as the chapter's record and as the worked example of the
format every later chapter's brief uses up front.

**Archetypes.** `what-is-system-design` → **orientation** (a framing and vocabulary page: it teaches the map and
the words, and offers no adoption choice to cost out). `system-design-interview-framework` → **procedure**.

### `what-is-system-design`

| Column | Finding | Resolution |
| --- | --- | --- |
| **Missing** | The component vocabulary — client, load balancer, app servers, cache, database, queue, observability. The reference gives it a section; we had none. | Added as a `techniques` block plus the page's load-bearing `architecture` diagram. This was also the page's missing figure (§7.4). |
| **Missing** | "What system design covers" — the recurring questions, and *same verbs, different targets, different system*. | Folded into `example` as the contrast beat on the SRE Workbook service. |
| **Extraneous** | An `SLI` / `SLO` / `SLA` subsection with the SRE Book's tiered-objective examples. | **Cut.** Owned by [[availability]] (ch. 02). One clause + link replaces it. |
| **Extraneous** | Four `tradeoffs` paragraphs on the economics of a nine — the 100× cost curve, the $1M/$900 case, Chubby's planned downtime, mean-vs-tail. | **Cut, part and all.** Availability/reliability material (ch. 02), on a page with no adoption decision to cost out. This was the drift §1a exists to catch. |
| **Extraneous** | `cornerCases` on measurement windows and unsatisfiable requirement sets. | **Cut**; the one that bites survives as an `interviewAngle` bullet linking [[cap-theorem]]. |
| **Extraneous** | `whenToUse` — "you are in system design territory when…". | **Cut.** Orientation archetype: there is no choice being made. |
| **Extraneous** | The ISO 25010 / AWS-pillars "three vocabularies" aside. | **Cut** from prose; both survive as `resources` links. |
| **Shared** | Functional vs non-functional requirements. | **Ours is better** — we source it and carry the falsification axis the reference doesn't name. Kept, minus the table row that restated the paragraph. |
| **Shared** | How to approach a design problem (the reference's 5 steps). | **Theirs is tighter, but it's the sibling's subject** — deferred whole to `system-design-interview-framework`. |
| **Altitude** | Was 2,019 words / 20 min against a ~8.5 min reference — well past 2×. | Now 1,106 words / 15 min. |

### `system-design-interview-framework`

Ours, not the reference's (§1a case 3); it borders the reference's *How to Approach a Design Problem* section,
which is ~2 minutes of the page above. The extra depth is the justification, and it holds — but two passages
were litigating the same disagreement.

| Column | Finding | Resolution |
| --- | --- | --- |
| **Extraneous** | A `techniques` block ("Other framings, named honestly") and the whole `tradeoffs` part both argued whether estimation deserves its own step, citing the same three sources. | **Merged into one** `tradeoffs` block. §7.13 — the same point twice. |
| **Extraneous** | `relatedStructures` restating the handoff that `what-is-system-design` already owns from its side. | **Cut** — reciprocal "read this next" on both pages is cross-page restatement. |
| **Extraneous** | `cornerCases` — discouraged for a procedure page, and three of four bullets paraphrased `pitfalls`. | **Cut**; the scale-changes-mid-interview one folded into `pitfalls`. |
| **Extraneous** | A `pitfalls` bullet on precision theatre restating `implementation`'s "carry one significant figure". | **Cut** the bullet; `implementation` owns it. |
| **Shared** | The step order itself. | **Ours is better** — the reference lists five steps in a paragraph; ours budgets them, works one prompt end to end, and argues against its own estimation step. Kept whole. |
| **Altitude** | 2,527 → 1,940 prose words. The worked URL-shortener run and its nine derived rows were **not** touched — §6a: cut the second explanation, never the demonstration. |

## What is system design? — `what-is-system-design`

- **tier**: **Core, plus `relatedStructures` and `cornerCases`.** Not Full — the honest reason is that
  `implementation` ("the mechanism in ~20 lines, a config excerpt, or a protocol step list") has no non-fabricated
  content on a page about what an activity *is*, and the only step list that would fit is the one lesson 2 owns.
  Faking it would be padded prose and the auditor is told to flag filler (§2). `example` is optional-recommended
  (see below) — if the author includes it, the page is Full in everything but `implementation`, which is fine.
- **priority**: `mid`. Deliberate. `priority` is *interview weight*, not importance (§3) — no interviewer asks
  "what is system design?". Assigning `high` would force Full per §7.1 and force a fabricated `implementation`.
- **estimatedMinutes**: `20`.
- **tags**: `["architecture", "scalability", "distributed-systems"]`.
- **parent**: none (anchor).

### Cost model

System design is choosing, for one set of requirements, which **quality attributes to buy and which to pay for
them with** — you cannot have low latency, strong consistency, low cost and high availability at once, so the
output of a design is a defensible ordering of what you sacrificed first.

Say the cost explicitly: reliability is not free and is *superlinear*. Google's SRE book states that "an
incremental improvement in reliability may cost 100x more than the previous increment," across both infrastructure
redundancy and the opportunity cost of engineers not building features
(<https://sre.google/sre-book/embracing-risk/>).

### Recognition cue

For the anchor page the cue is about the *situation*, not a tool: you are being asked a question with no single
correct answer, where the interviewer supplies a one-line prompt and expects you to supply the constraints. Meta's
own careers guidance says the design round is "45 minutes long", "almost never involve[s] coding", comes in two
flavours (systems design and product design), and that candidates should open by asking clarifying questions about
scale, latency requirements and storage
(<https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/>).

### Variants — the named thing this page teaches

The variants are the **two requirement classes**, and the axis is *how you falsify them*.

- **Functional requirement** — a verb and an object. Falsified by one request.
- **Non-functional requirement** — a number, a percentile and a window. Falsified only over a population of
  requests, which is why it is expressed as an SLI measured against an SLO.

Ground the SLI/SLO/SLA distinction on the SRE book: an **SLI** is a quantitative measure of some aspect of
service (request latency, error rate, throughput, availability); an **SLO** is a target value or range for an SLI,
structured as `SLI ≤ target` or `lower ≤ SLI ≤ upper`; an **SLA** is an explicit or implicit contract with users
that carries consequences — typically financial — for missing the SLO
(<https://sre.google/sre-book/service-level-objectives/>).

Useful secondary framing worth one sentence: the standards world calls these *quality characteristics*, not
non-functional requirements. ISO/IEC 25010:2023 names nine — functional suitability, performance efficiency,
compatibility, interaction capability, reliability, security, maintainability, flexibility, safety
(<https://quality.arc42.org/standards/iso-25010>). AWS's Well-Architected Framework names six pillars covering the
same ground: operational excellence, security, reliability, performance efficiency, cost optimization,
sustainability
(<https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html>). Naming that
three vocabularies describe the same object is a cheap credibility win; do not turn it into a taxonomy tour.

### Tradeoffs — real, with the condition under which each bites

1. **More nines cost superlinearly, and past a point users cannot perceive them.** The SRE book's argument:
   "a user on a 99% reliable smartphone cannot tell the difference between 99.99% and 99.999% service
   reliability" — the user's own device and network degrade first. Bites when a candidate reflexively proposes
   five nines for a consumer product. (<https://sre.google/sre-book/embracing-risk/>)
2. **Availability targets are a business calculation, not an engineering preference.** The SRE book's worked
   example: on a $1M-revenue service, improving 99.9% → 99.99% (a 0.09% improvement) yields ~$900 in additional
   revenue, so it is worth doing only if it costs less than $900. Bites whenever "make it highly available" is
   asserted without a cost side. (same URL)
3. **Over-delivering on a target is itself a cost.** "Users build on the reality of what you offer, rather than
   what you say you'll supply" — Google deliberately took Chubby down on a planned schedule when its uptime
   exceeded its SLO, because dependent teams had started assuming reliability Chubby never promised. Bites in
   design when an internal service's *observed* behaviour silently becomes an *interface*.
   (<https://sre.google/sre-book/service-level-objectives/>)
4. **Averages hide the failure.** The SRE book's Figure 4-1 shows a service whose median latency is ~50 ms while
   the **slowest 5% of requests** (p95) run roughly 20× slower — the book's words are "5% of requests are 20 times
   slower"; the p99 is worse still. **Do not attribute the 20× to the p99.** Bites when a candidate states
   "average latency 100 ms" as a target.
   (same URL)

### Figures the author may state

| Figure | Provenance |
| --- | --- |
| An incremental reliability improvement can cost ~100× the previous increment | <https://sre.google/sre-book/embracing-risk/> — quote as *Google's SRE book argues…*, it is an assertion about Google's own cost structure, not a measured universal |
| 99.9% → 99.99% on a $1M service ≈ $900 of additional revenue; only worth it below that cost | same URL, worked example in the chapter |
| A user on a 99%-reliable phone cannot distinguish 99.99% from 99.999% | same URL |
| p99 latency ≈ 20× the median in the SRE book's illustrative service | <https://sre.google/sre-book/service-level-objectives/> — labelled as *an illustration*, not a rule |
| Example SLO shape: "99% of Get RPC calls complete in under 100 ms"; tiered form 90% < 1 ms / 99% < 10 ms / 99.9% < 100 ms | same URL (the Shakespeare service example) |
| A real mobile-game API's SLOs: 97% availability, 90% of requests < 450 ms, 99% of requests < 900 ms | <https://sre.google/workbook/implementing-slos/> |
| SLI menu by service type — request-driven: availability/latency/quality; pipeline: freshness/correctness/coverage; storage: durability | same URL |
| 99.9% availability ≈ 43.2 min/month of downtime | <https://sre.google/sre-book/availability-table/> — **at most one row, inline. Do not reproduce the table; it belongs to `[[availability]]`.** |
| ISO/IEC 25010:2023 defines nine quality characteristics | <https://quality.arc42.org/standards/iso-25010> |
| AWS Well-Architected has six pillars | <https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html> |
| The Meta design round is 45 minutes and almost never involves coding | <https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/> |

### Failure modes (`pitfalls`, tone `warn` — 4–5 bullets)

- Stating quality attributes with no number — "it should be scalable / highly available / fast" is unfalsifiable
  and reads as junior.
- Collapsing "scale" into one number. It is at least four: read QPS, write QPS, stored data size, and fan-out.
- Confusing SLI (the measurement), SLO (the internal target) and SLA (the contract with penalties). Interviewers
  probe this and it is cheap to get right.
- Reaching for a big-company architecture before the requirements demand it — microservices, Kafka and a cache
  tier proposed at minute two are a signal against you.
- Treating higher availability as monotonically better. See tradeoff 1.

### Corner cases (`cornerCases`, tone `info` — 3–5 bullets)

- 100% availability is the wrong target: past a point, more reliability is *worse* for the service and its users
  (SRE, *Embracing Risk*).
- An SLO you comfortably beat becomes a de-facto interface. The Chubby planned-outage story is the canonical
  example.
- A non-functional target with no percentile and no window cannot be violated, so it cannot be designed against.
- Two functional requirements can hide two different systems: a write path and a read path with different
  latency, consistency and durability targets, which is where `[[read-replicas]]` and `[[what-is-caching]]` enter.
- Requirements that are jointly unsatisfiable — strong consistency *and* low-latency multi-region writes — which
  is `[[cap-theorem]]`, named here and taught there.

### Interview angle

**The question**: "What are the non-functional requirements for this?" — asked in nearly every design round,
usually in the first five minutes.

**The answer that signals depth**: propose *numbers with a percentile and a window*, attach each to a design
consequence, and volunteer which one you would sacrifice first. E.g. for a link shortener: "99.9% availability on
the redirect path — about 43 minutes a month; p99 redirect latency under 100 ms; and I'll take eventual
consistency on click analytics, because I'd rather lose a click count than a redirect."

**The follow-up**: "Why not 99.999%?" — the depth answer is the cost curve, not a shrug: **each increment of
reliability can cost ~100× the previous one** (the SRE book's own figure — *not* "an order of magnitude", which
appears in the book only as a description of the availability improvement, not the cost), the user's own device
is less reliable than the difference, and the money is better spent on the read path.

**Second follow-up worth rehearsing**: "What's the difference between your SLO and your SLA here?" Answer: the SLO
is what we target internally and page on; the SLA is what we promise customers with penalties attached, and it is
deliberately looser than the SLO so that missing the SLO is a warning rather than a breach.

### Worked example (optional but recommended)

Not required at this tier. If included, use the SRE Workbook's mobile-game API — but describe it accurately:
it is a **worked example service**, and 97 / 450 ms / 900 ms are **proposed starter SLOs derived by rounding down
measured values** (97.123%, 432 ms, 891 ms), *not* a real service's published targets. The interesting point is
that the target was read off observed behaviour rather than picked from a nines table — and show the same requirements
written twice, once as a functional list and once as SLOs, so the reader sees the translation
(<https://sre.google/workbook/implementing-slos/>). Two short paragraphs; do not let it grow into a case study.

### Diagram

**`comparison` — functional vs non-functional requirements. Required, placed in `techniques`.**

This is the load-bearing figure: it is the vocabulary the entire 174-lesson track reuses, and the table carries
information the prose cannot compress (five axes × two classes).

```
columns: ["", "Functional requirement", "Non-functional requirement"]
rows:
  "What it states"      | "What the system does"                          | "How well it does it, and under what load"
  "The form it takes"   | "A verb and an object — *a user can shorten a URL*" | "A number, a percentile and a window — *99% of redirects under 100 ms*"
  "How you falsify it"  | "One request passes or fails"                   | "Measured over a population — an SLI aggregated against an SLO"
  "Where it comes from" | "The prompt, plus clarifying questions"         | "Almost never in the prompt — you propose targets and get them confirmed"
  "What it constrains"  | "The API surface and the data model"            | "The topology: replication, caching, sharding, how many regions"
  "Chat-app example"    | "Send a message; show delivery receipts"        | "p99 delivery under 500 ms; 99.9% availability; ordered per conversation"
```

**Second diagram: optional, and only if the prose does not already carry it.** A `comparison` of the coding
interview vs the system design interview (axes: what the input is, whether a correctness oracle exists, what is
graded, time budget, what you leave behind). It is genuinely useful for a reader arriving from the algos track,
but it is *the same kind* as the required table, so include it only if it earns its place. **Do not add an
`architecture` diagram to this page** — there is no topology to show, and a generic client→LB→service→DB box
drawing here is exactly the decoration the rubric flags as a must-fix, and it would also poach
`[[client-server-architecture]]`'s content.

If the `tradeoffs` part uses a table, note in the brief-to-author that a standard two-column tradeoffs table does
not count as a "third figure" for §5 purposes — it is the part's prescribed shape. Prose is equally acceptable
here, since the cost-of-a-nine argument reads better as two short paragraphs.

### Owns / defers

- **Owns**: what system design is; how the interview differs; functional vs non-functional; SLI/SLO/SLA at
  vocabulary depth; the quality-attribute name list; the "everything costs something" thesis.
- **Defers**: the 45-minute procedure and all arithmetic → `[[system-design-interview-framework]]`; the nines
  table and error budgets → `[[availability]]`; each quality attribute's depth → its own ch02 lesson; the
  client/edge/service/data topology → `[[client-server-architecture]]`.

### Sources (4, primary-weighted, all fetched 2026-08-25)

1. Google SRE Book — *Embracing Risk* — <https://sre.google/sre-book/embracing-risk/> (primary; cost of a nine,
   the $1M/$900 calculation, the 99%-phone argument)
2. Google SRE Book — *Service Level Objectives* — <https://sre.google/sre-book/service-level-objectives/>
   (primary; SLI/SLO/SLA definitions, tail-vs-average, the Chubby story)
3. Meta Careers — *Preparing for your software engineering interview at Meta* —
   <https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/> (first-party
   hiring guidance; 45 minutes, no coding, clarifying questions)
4. arc42 Quality Model — *ISO/IEC 25010* — <https://quality.arc42.org/standards/iso-25010> (**standards summary,
   secondary** — ISO's own page returns 403 to automated fetch; label it as a summary of the 2023 revision, not
   as the standard itself)

### Resources (distinct from sources, all fetched)

- Google SRE Workbook — *Implementing SLOs* — <https://sre.google/workbook/implementing-slos/> — `doc`
- AWS Well-Architected Framework — *The pillars* —
  <https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html> — `doc`
- *Designing Data-Intensive Applications* (Kleppmann) — <https://dataintensive.net/> — `article`. Chapter 1 is
  "Reliable, Scalable, and Maintainable Applications" and is the book-length version of this page's thesis.
- Google SRE Book — availability table — <https://sre.google/sre-book/availability-table/> — `doc`

### UNVERIFIED

- The claim, repeated across prep sites, that Meta grades the infra design round on four named competencies
  ("problem navigation, solution design, technical excellence, communication"). It appears only in third-party
  prep-site summaries; it is **not** on metacareers.com. **Do not state it.**
- DDIA's chapter-1 title is corroborated only via O'Reilly's search-result listing
  (`.../9781491903063/ch01.html`), which 403s to automated fetch. Safe to name in a resource label; do not build a
  claim on chapter contents we could not open.

---

## The 4-step interview framework — `system-design-interview-framework`

- **tier**: **Full.** `implementation` (a runnable estimation snippet), worked `example` (the numbers table
  below), `cornerCases` and `relatedStructures` are all sourced here — no padding required.
- **priority**: `high`. Justified: this procedure is executed in *every* system design round, and the track's own
  subtitle in `curriculum.ts` ("End-to-end designs on a reusable 4-step framework") promises it. Full tier is
  therefore mandatory per §7.1, and this brief supplies enough for it.
- **estimatedMinutes**: `35`.
- **tags**: `["architecture", "scalability", "backend"]`.
- **parent**: `"what-is-system-design"`.

### Cost model

A fixed procedure buys you **coverage and pace under ambiguity** — you will always reach a whole design instead
of a beautifully detailed fragment — and costs you **flexibility**: run it rigidly and you produce a generic
design that ignores what makes *this* prompt interesting, and you will burn minutes on steps the prompt did not
need.

### Recognition cue

Any open-ended prompt with a scale word in it and no acceptance criteria — "design X for N users". The cue for
the *framework* is the absence of a spec, not the presence of a technology.

### The four steps (this page's `techniques`)

Ours, and the author should say so plainly: this is a synthesis, and other well-known framings split the same
45 minutes differently.

1. **Requirements (~5 min)** — functional list, then 2–3 *quantified* non-functional targets. This page teaches
   the *eliciting move* only: ask for scale, latency, consistency tolerance, and read/write mix; propose the
   numbers yourself rather than waiting for them; write them where both of you can see them. It does **not**
   define what a functional or non-functional requirement is — `[[what-is-system-design]]` owns that.
2. **Capacity estimation (~5 min)** — convert the requirements into QPS, storage and bandwidth, and name the one
   design decision each number changes.
3. **High-level design (~15 min)** — the API surface and the boxes: client → edge → service → data. Get
   agreement before going deep.
4. **Deep dives (~15 min)** — two or three targeted expansions, chosen by which non-functional target is hardest
   to hit.

That is 40 of 45; the residue is the interviewer's intro and your questions. Say that out loud in the page — the
"45 minutes" is not 45 minutes of design.

**Other framings, named honestly** (this is a short closing paragraph in `techniques`, not a table):

- **ByteByteGo / *System Design Interview* (Alex Xu)** — four steps with published budgets: understand the
  problem and establish design scope (3–10 min), propose high-level design and get buy-in (10–15 min), design
  deep dive (10–25 min), wrap up (3–5 min). Estimation lives inside step 1 and gets its own chapter.
  (<https://bytebytego.com/courses/system-design-interview/a-framework-for-system-design-interviews>)
- **Hello Interview's "delivery framework"** — six steps: Requirements (~5 min), Core Entities (~2 min), API /
  System Interface (~5 min), optional Data Flow (~5 min), High Level Design (~10–15 min), Deep Dives (~10 min).
  (<https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery>)
- **`system-design-primer`** — four steps: outline use cases, constraints and assumptions; create a high-level
  design; design core components; scale the design. Estimation is folded into step 1's "constraints and
  assumptions". (<https://github.com/donnemartin/system-design-primer>)

Two structural differences the author must call out so a reader arriving from another resource is not confused:
ours **hoists estimation to its own step** (ByteByteGo and the primer fold it into requirements), and ours
**folds the API contract and core entities into step 3** (Hello Interview gives each its own step). Ours also has
no dedicated wrap-up; ByteByteGo budgets 3–5 minutes for one. Recommend the author keep the last minute for a
recap of the tradeoffs made — cheap, and it is what the wrap-up step exists for.

### Tradeoffs — where this framework is the outlier

> **Corrected 2026-08-25 after audit.** This section previously described a "live disagreement with named
> holders" between ByteByteGo/`system-design-primer` and Hello Interview. **That disagreement does not exist** —
> all three sources say to ask whether the estimate is needed before doing it. ByteByteGo: *"communicate with
> your interviewer if back-of-the-envelope is necessary before diving into it."* `system-design-primer`'s worked
> solutions: *"clarify with your interviewer if you should run back-of-the-envelope usage calculations."*
> A sourcer must **quote a named position from the page cited for it** before putting it in a table; a
> two-column layout with names attached satisfies the *shape* of rubric §1 while inverting its purpose.

**How much back-of-envelope estimation is worth doing.** The sources converge; *our* framework is the outlier for
hoisting estimation into a fixed step, and the page must say so rather than manufacture an opponent.

| | Estimate upfront, as its own step (ours) | Estimate on demand (all three sources) |
| --- | --- | --- |
| Who argues it | This framework only — a deliberate minority position, taken as a *learning* scaffold | ByteByteGo, `system-design-primer` and Hello Interview alike: ask whether the number is needed first |
| What it buys | Every later choice has a number behind it; you can't hand-wave sharding or cache size | Minutes back for the design itself; no dead arithmetic on the board |
| What it costs | You often compute storage and QPS you never use | You may reach a decision point with no number and stall |
| When it bites | Prompts where the scale is obviously "large and distributed" — Hello Interview's point is that you can just assume as much | Prompts where a single number flips the architecture (does the working set fit one node, or must it shard?) |

**The resolution to teach**: do the arithmetic when the number *changes a decision*, and say which decision out
loud as you do it. Hello Interview's own worked example of a *necessary* estimate is exactly this shape —
computing topic volume to decide whether a single min-heap instance suffices or it has to be sharded. That
reconciles both camps and is the answer that signals depth.

**Second disagreement worth one sentence**: whether the API contract deserves its own step. Hello Interview says
yes (core entities + API before the boxes, on the theory that a concrete contract forces the requirements to be
real); ByteByteGo folds it into high-level design. Nobody credible argues against starting with requirements —
the disagreement is about the *duration* and about what comes second, not about the first step.

### Figures — the worked capacity estimation

**This is the required, load-bearing diagram of the chapter.** Prompt: *design a URL shortener*. Every row below
is either arithmetic the author can show or a cited figure. The author must present A1–A5 as **assumptions the
candidate declares out loud**, not as facts.

Assumptions to state on the page:
- **A1** — 100M new short links created per day.
- **A2** — read:write ratio of 100:1.
- **A3** — peak traffic is 2× average.
- **A4** — a stored record averages ~500 bytes.
- **A5** — links are retained for 5 years.

`numbers` rows (`quantity` / `value` / `derivation`):

| quantity | value | derivation |
| --- | --- | --- |
| Writes/sec (average) | ~1,200 | 100M ÷ 86,400 s = 1,157 |
| Reads/sec (average) | ~116k | 1,157 × 100 (A2) |
| Reads/sec (peak) | ~232k | 116k × 2 (A3) |
| Short-code length, base62 | 7 characters | 62⁶ = 5.68 × 10¹⁰ → exhausted in 5.68×10¹⁰ ÷ 10⁸ = **568 days**; 62⁷ = 3.52 × 10¹² → 35,216 days ≈ **96 years** |
| Bytes per record | ~500 B | 7 B code + ~100 B target URL + 8 B owner id + 8 B created_at + 8 B expiry ≈ 130 B, rounded to 500 B to cover row and index overhead |
| New storage/day | 50 GB | 100M × 500 B |
| Storage at 5 years | ~91 TB | 50 GB × 365 × 5 (A5) |
| Read bandwidth (stored bytes) | ~58 MB/s | 116,000/s × 500 B |
| Hot-set cache, top 10M links | 5 GB | 10M × 500 B — fits one node's RAM, so start with a single cache and defer `[[consistent-hashing]]` |
| **Reality check — Bitly, Feb 2014** | **~2,300 redirects/s** | 6 × 10⁹ decodes/month ÷ (30 × 86,400 s). Source: Bitly engineering blog, <https://word.bitly.com/post/77292911854/joining-bitly-engineering> |

**The last row is the point of the whole table and the author must not drop it.** It shows the assumed prompt is
roughly **50× a real production link shortener's published 2014 traffic**, which makes the teaching concrete: the
7-character code, the single cache node and the 91 TB all follow from A1–A5, not from reality. State the figure
with its 2014 date; it is over a decade old and should be labelled as such.

Each number must also carry **the decision it changes**, stated in prose beside the table:
- 7 vs 6 characters → the key-generation scheme; 6 runs out inside two years.
- 91 TB over 5 years → this does not fit one machine, so `[[sharding]]` is on the table; 50 GB/day is also why
  a TTL or archival tier is worth proposing.
- 5 GB hot set → one cache node is enough, so *don't* introduce a distributed cache yet. This is the highest-value
  move in the whole table: an estimate that lets you argue *against* complexity.
- 232k peak reads/s vs ~1.2k writes/s → the read path is the system; `[[read-replicas]]` and
  `[[what-is-caching]]` before anything else.

### Implementation (`code`, Full tier)

A ~15-line JavaScript `estimate()` taking `{ writesPerDay, readWriteRatio, peakFactor, bytesPerRecord,
retentionYears }` and returning writes/s, reads/s, peak reads/s, daily bytes and retained bytes — the same
arithmetic as the table, so the reader can re-run it with whatever numbers the interviewer hands them.
Caption it as exactly that. Not production code; no rounding helpers, no formatting library. This keeps the
`implementation` part honest without inventing a "protocol".

### Failure modes (`pitfalls`, tone `warn`)

- Spending 15 of 45 minutes on requirements. It is the most common way to run out of time in deep dives, which is
  where the senior signal actually lives.
- Computing storage and QPS you never refer to again. Name the Hello Interview position here — dead arithmetic is
  worse than none, because it consumed minutes and produced no decision.
- Estimating without stating assumptions. An unstated assumption makes the number unfalsifiable and the
  interviewer cannot follow the reasoning, which is what is being graded.
- Precision theatre. 1,157.4 writes/s is not more correct than "about 1.2k"; the extra digits cost time and
  invite arithmetic errors.
- Going deep before the skeleton exists — a beautifully specified cache in front of a system whose write path was
  never drawn.
- Never saying *why* you went into a particular deep dive. Tie each one to the non-functional target it protects.

### Corner cases (`cornerCases`, tone `info`)

- The interviewer changes the scale mid-interview ("now make it 100× that"). Recompute only the rows that move —
  usually storage and whether the hot set still fits one node — rather than restarting the table.
- The prompt is a *product* design question, not an infrastructure one (Meta explicitly runs both kinds). The four
  steps still hold; step 2 shrinks to almost nothing and step 3 becomes mostly API and data model.
- Read-mostly prompts with negligible write volume: estimation collapses to cache sizing and egress bandwidth.
- You run out of time inside deep dives. Say what you *would* have covered and why you ranked it there — an
  unexplored deep dive you can name beats one you silently skipped.
- The 45 minutes includes the interviewer's introduction and your questions; the real design budget is closer to
  40, and building the plan around 45 is how candidates get caught short.

### Interview angle

**The question**: "Before you draw anything — how big is this?" or, equivalently, "why did you pick that
number?"

**The answer that signals depth**: state the assumption, do one line of arithmetic, and immediately name the
decision it settles. "At 100M links a day and 100:1 reads, that's ~1.2k writes/s and ~116k reads/s, so the read
path is the whole design — I'll put a cache in front and the write path can stay simple." The signal is the
*inference*, not the division.

**The follow-up that separates candidates**: "Do you actually need that estimate?" The depth answer names the
disagreement: for most large-scale prompts you can assume "large and distributed" and skip the upfront math, and
you should do arithmetic only where it decides between two architectures — for example whether the working set
fits in one node's memory or has to be sharded. Being able to argue *against* doing the estimate, with a reason,
reads as more senior than reciting the table.

**A third one worth rehearsing**: "You've got ten minutes left — what would you go deep on?" The strong answer
picks the deep dive from the non-functional requirements written down in step 1, closing the loop back to
`[[what-is-system-design]]`.

### Worked example

The URL shortener above, run end to end through the four steps, with the Bitly figure as the reality check. Keep
the high-level-design step deliberately thin — boxes and an API sketch, with everything interesting
forward-linked (`[[what-is-caching]]`, `[[sharding]]`, `[[read-replicas]]`, `[[load-balancers]]`,
`[[database-indexing]]`). The page is teaching *the procedure*, and a full URL-shortener design here would both
overrun and collide with Phase 2's case-study model
([mockup](../improvements/mockups/detail-system-design.html)).

**Consistency with the Phase 2 mockup**: the mockup's headings are "Step 1 · Understand the problem & scope",
"Step 2 · Back-of-the-envelope estimation", "Step 3 · High-level design", "Step 4 · Design deep dive", plus a
"Wrap up". That is the skeleton case studies will render against, and it matches this page's four steps —
including estimation as its own step. Use step names that line up with it, and mention that Phase 2 case studies
follow this shape so the reader recognises it later. The mockup's own worked numbers (5M daily users, ~10 req/s
peak, 16-byte counter keys, ~80 MB) belong to the *rate limiter* case study, **not** to this page — do not import
them; they are unsourced draft figures and one of them ("~50M req/s") does not survive checking.

### Diagram

**Primary, required: `numbers` — the capacity estimation table above, in `example`.** This is the one genuinely
load-bearing figure in chapter 01. Every row carries its derivation, which is the entire pedagogic point (§5).

**Second, recommended: `comparison` — the four steps against what each produces, in `techniques`.** A different
axis from the arithmetic (procedure and time, not quantity), so §5 permits it and it earns its place.

```
columns: ["", "Minutes (of ~40)", "What you leave on the board", "What skipping it costs"]
rows:
  "1. Requirements"        | "~5"  | "A functional list plus 2–3 quantified targets"        | "You design a system nobody asked for and get stopped at minute 20"
  "2. Capacity estimation" | "~5"  | "QPS, storage, and the decision each number settles"   | "Sharding, cache size and node count are all asserted, not argued"
  "3. High-level design"   | "~15" | "Boxes and arrows client→edge→service→data, plus the API surface" | "You go deep before the skeleton exists and the design never connects"
  "4. Deep dives"          | "~15" | "Two or three expansions, each tied to a non-functional target" | "You stay at box level and read as junior"
```

**Do not add an `architecture` diagram.** The obvious candidate — a generic client/LB/service/DB drawing for step
3 — is decoration on this page (the prose already says "boxes and arrows"), and it belongs to
`[[client-server-architecture]]` (ch12) and to Phase 2's case studies. A `sequence` diagram has nothing ordered
in time to show that the step table does not already carry.

The `tradeoffs` estimation table is the part's prescribed shape, not a third figure — note this for the auditor.

### Owns / defers

- **Owns**: the four steps and their budgets; how to elicit requirements in five minutes; all back-of-envelope
  method and arithmetic; time management; the competing framings and the estimation disagreement.
- **Defers**: what functional / non-functional requirements *are*, and SLI/SLO/SLA →
  `[[what-is-system-design]]`; every technology named in step 3 → its own lesson; a complete URL-shortener design
  → Phase 2.

### Sources (4, all fetched 2026-08-25)

1. Meta Careers — *Preparing for your software engineering interview at Meta* —
   <https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/> (**first-party
   hiring guidance** — 45 minutes, no coding, two design types, open with clarifying questions about scale /
   latency / storage)
2. Bitly engineering blog — *Joining Bitly Engineering*, Peter Herndon, 20 Feb 2014 —
   <https://word.bitly.com/post/77292911854/joining-bitly-engineering> (**first-party production figure**:
   ~6 billion decodes per month)
3. ByteByteGo — *A framework for system design interviews* —
   <https://bytebytego.com/courses/system-design-interview/a-framework-for-system-design-interviews>
   (**interview-prep site, label it as one** — cited for its published 4-step structure and minute budgets,
   which are the competing framing this page contrasts with)
4. Hello Interview — *System Design in a Hurry: Delivery* —
   <https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery> (**interview-prep site, label it as
   one** — cited for the six-step delivery framework and for the "calculate only if it influences the design"
   position, which is one half of the named disagreement)

Note for the author and the auditor: §1 ranks prep sites last, and three of these four are interview-focused. That
is defensible *here specifically* — the subject of the page is an interview procedure, so the hiring company's own
guidance and the two most-cited published framings **are** the primary evidence about what the procedure is.
Everywhere else in this chapter and track, primary technical docs must lead.

### Resources (distinct from sources, all fetched)

- `system-design-primer` — <https://github.com/donnemartin/system-design-primer> — `article` (its own four-step
  approach; its appendix carries the Jeff-Dean-attributed latency numbers and a powers-of-two table)
- *Latency Numbers Every Programmer Should Know, By Year* (Colin Scott) —
  <https://colin-scott.github.io/personal_website/research/interactive_latency.html> — `article`. Self-documents
  its provenance (Norvig 2002 + Dean, extrapolated by year). 2020 values: L1 ~3 ns, main memory ~100 ns, SSD
  random read ~16 µs, same-datacenter RTT ~500 µs, disk seek ~5–6 ms, CA↔Netherlands RTT ~150 ms.
- Jeff Dean's latency-numbers gist (jboner) — <https://gist.github.com/jboner/2841832> — `article`. Credits Dean
  and Norvig. **Community-edited and drifting** — it has picked up a 2026 LLM-latency section — so cite it as a
  convenient copy, not as a fixed artefact.
- Google SRE Workbook — *Implementing SLOs* — <https://sre.google/workbook/implementing-slos/> — `doc` (for
  turning step 1's non-functional targets into measurable SLIs)

### UNVERIFIED

- **A2 (read:write 100:1), A3 (peak = 2× average), and the ~100-byte median target URL inside A4** are
  conventional interview assumptions. No primary measurement was found for any of them. They must appear on the
  page **as declared assumptions**, never as facts, and the Bitly reality-check row exists partly to make that
  visible.
- **Our 5 / 5 / 15 / 15 minute split is a synthesis.** The component ranges are corroborated (ByteByteGo:
  3–10 / 10–15 / 10–25 / 3–5; Hello Interview: 5 / 2 / 5 / 5 / 10–15 / 10), but the exact allocation is ours. Say
  "roughly" and do not attribute the split to anyone.
- **The Jeff Dean quote about back-of-envelope calculations** ("estimates you create using a combination of
  thought experiments and common performance numbers…") circulates via ByteByteGo and prep sites. The
  Google-hosted primary (`static.googleusercontent.com/.../stanford-295-talk.pdf`) downloads as a 493 KB PDF but
  no text could be extracted in this environment. **If quoted, attribute it as "ByteByteGo attributes to Jeff
  Dean"; better, don't quote it.**
- ByteByteGo's framework page was freely readable when fetched on 2026-08-25, but the course shows a 0/31
  progress tracker and may be gated for other readers. Fine as a `sources` URL (it resolves); flag if a future
  audit finds it walled.

---

## Sources that failed, were gated, or disagreed

| URL | Outcome |
| --- | --- |
| <https://www.iso.org/standard/78176.html> | **403** to automated fetch. ISO/IEC 25010:2023 is real; substituted <https://quality.arc42.org/standards/iso-25010> and labelled it a standards summary. |
| <https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/> and `/ch01.html` | **403** (paywalled). Used <https://dataintensive.net/> for DDIA instead; the chapter-1 title is corroborated only from O'Reilly's search-result listing. |
| <https://www.metacareers.com/life/preparing-for-your-software-engineering-interview-at-facebook/> | **404**. The live path is `/blog/preparing-for-your-software-engineering-interview-at-meta/`. |
| <https://static.googleusercontent.com/media/research.google.com/en//people/jeff/stanford-295-talk.pdf> | Resolves (493 KB PDF) but text was not extractable locally (no `pdftotext`/`poppler`). Not cited. |
| <https://github.com/ept/ddia-references> | Resolves, but lists only `chapter-NN-refs.md` filenames — no chapter titles. Useless for the ToC question. |
| Colin Scott's page vs the jboner gist | Not a contradiction — same Dean/Norvig lineage — but the gist is community-edited and has accreted a 2026 LLM section that is not Dean's. Prefer Colin Scott when provenance matters. |
| ByteByteGo (4 steps, estimation inside step 1) vs Hello Interview (6 steps, estimation discouraged upfront) vs `system-design-primer` (4 steps, estimation in "constraints and assumptions") | A genuine disagreement, not a sourcing failure. Captured as the named disagreement on the framework page. |
