# 02. Core Concepts — research brief

Produced by `system-design-chapter-sourcer` on 2026-08-26 for the eight lessons in
[manifest §02](../system-design-lesson-manifest.md#02-core-concepts-8). Rubric:
[system-design-authoring.md](../features/system-design-authoring.md) — §1 (sourcing), **§1a (reference
fidelity)**, §2 (archetypes), §4 (part budgets), §5 (diagram kinds), §6a (economy).

Every URL cited below was fetched during this run. Fetches that failed are listed under
**Sources that failed** at the bottom; do not re-cite those without re-checking. Claims I could not
corroborate from a primary source are collected under **UNVERIFIED**.

---

## Read this first — four rules that bind every author in this chapter

1. **Forward links carry a display label, always.** `vertical-vs-horizontal-scaling`,
   `strong-vs-eventual-consistency`, `sharding`, `read-replicas`, `load-balancers`, `network-partitions`,
   `heartbeats`, `circuit-breaker-pattern`, `bulkhead-pattern`, `what-is-caching`, `message-queues`,
   `three-pillars-observability`, `handling-failures-in-distributed-systems` and every other unbuilt slug
   **must** be written `[[strong-vs-eventual-consistency|strong vs eventual consistency]]`. A bare
   `[[strong-vs-eventual-consistency]]` renders kebab-case in the middle of your sentence and
   `scripts/lintTopics.mjs` flags it. `[[scalability]]`, `[[availability]]` and the other seven slugs in
   *this* chapter are fine bare once the chapter lands, and `[[what-is-system-design]]` /
   `[[system-design-interview-framework]]` / `[[redis]]` / `[[mongodb]]` / `[[relational-databases]]` /
   `[[rest-apis]]` / `[[database-indexing]]` resolve today.
2. **Chapter 01 owns four things and this chapter re-teaches none of them**: the functional/non-functional
   split, the 4-step interview procedure, back-of-envelope estimation, and the default
   client→edge→service→data architecture picture. Link `[[what-is-system-design]]` /
   `[[system-design-interview-framework]]`.
3. **The linter's hard cap is 2,400 words and no page here should come close.** See *Budget* below — the
   §1a altitude test is slack for this chapter and is not the discipline that matters here.
4. **Two figures maximum outside `tradeoffs`.** The linter warns at three. Each lesson below names its
   load-bearing figure and at most one second.

---

## Chapter shape

- **Anchor lesson: `scalability`.** No `parent`; the other seven set `parent: "scalability"`.
  *Sanity check, as asked:* the reference has **no umbrella page** for this chapter — its eight lessons are
  eight peers, and none of the other seven is more general than `scalability`. So the anchor here is a
  **nesting device** for `/concepts` grouping, not a claim that availability or CAP are facets of
  scalability. `scalability` is the right pick anyway: it is the manifest's first lesson, it is the one
  quality every other lesson's cost is denominated in, and it is the only page whose subject spans the whole
  chapter's altitude. **Keep it.** No lesson may write a sentence implying the other seven are sub-topics of
  scaling.
- **Seeds: none.** No existing topic file maps to any of the eight. Nothing to harvest, nothing to delete.
  The only existing `systems` files are chapter 01's two.
- **Already built and linkable today:** `[[what-is-system-design]]`, `[[system-design-interview-framework]]`,
  plus the non-track technology pages `[[redis]]`, `[[mongodb]]`, `[[relational-databases]]`,
  `[[rest-apis]]`, `[[database-indexing]]`. Do **not** link `[[caching-and-cdns]]` or `[[nosql-databases]]`
  — the manifest slates both for deletion; use `[[what-is-caching|caching]]` / `[[sql-vs-nosql|SQL vs NoSQL]]`.
- **Chapter wiring (§8.2):** add
  `{ title: "Core Concepts", topics: ["scalability", "availability", "reliability", "single-point-of-failure-spof", "latency-vs-throughput", "consistent-hashing", "cap-theorem", "consistency-models"] }`
  to `TRACKS["system-design"].chapters` at index 1, after chapter 01.

### Honouring chapter 01's existing forward links

These `[[…]]` already sit in chapter 01's prose. Each page below must actually deliver what was promised:

| Existing link | In | What chapter 01 promised |
| --- | --- | --- |
| `[[availability]]` | `what-is-system-design` (twice) | "the fraction of time the system serves requests successfully" **and** "owns SLI/SLO/SLA and the arithmetic that turns a target into minutes of downtime" |
| `[[latency-vs-throughput]]` | `what-is-system-design` | "how long one request takes, quoted at a percentile, against how many requests per second the system absorbs. Two different problems." |
| `[[consistency-models]]` | `what-is-system-design` | "whether a read is guaranteed to see the most recent write" |
| `[[scalability]]` | `what-is-system-design` | "whether adding capacity keeps up with load" |
| `[[cap-theorem]]` | `what-is-system-design` (×2), `system-design-interview-framework` | "some requirement sets are jointly unsatisfiable"; redundancy costs consistency |
| `[[consistent-hashing]]` | `system-design-interview-framework` | "defer consistent hashing until the working set outgrows one cache node" — so this page must *own the cue for when it is and isn't worth it* |

---

## Ownership map (rubric §8.5 / §8.8) — hand this to every author

The reference itself duplicates heavily across `availability`, `reliability` and `single-point-of-failure-spof`
(all three of its pages teach redundancy, circuit breakers and graceful degradation). **Do not copy that
duplication.** One owner per row; everyone else gets one clause and a link.

| Concept | **Owned by** | Mentioned-with-a-link by | Note |
| --- | --- | --- | --- |
| Definition of scalability; the two scaling axes named | `scalability` | all | |
| Vertical vs horizontal — *the full tradeoff table* | **`vertical-vs-horizontal-scaling` (ch. 11)** | `scalability` names both in one paragraph and links | `scalability` defines the two and says which one *the rest of this track assumes*; it does **not** build the comparison table |
| Statelessness as the precondition for scaling out | `scalability` | `single-point-of-failure-spof` | one clause + `[[stateful-vs-stateless-architecture|stateless services]]` |
| Limits to scaling — Amdahl / Universal Scalability Law, retrograde throughput | `scalability` | — | nobody else touches it |
| **SLI / SLO / SLA** | `availability` | `reliability` (1 clause), `what-is-system-design` (already links in) | |
| **The nines → downtime table and its arithmetic** | `availability` | `reliability`, `single-point-of-failure-spof` (may quote *one* row inline) | |
| **Error budgets** | `availability` | `reliability` | |
| **The economics of a nine — 100× per increment, the $1M/$900 case, the user-perception ceiling, Chubby's deliberate planned downtime** | **`availability`** — the §8.8 call, made explicitly | `reliability` may quote nothing from it | *Why availability, not reliability:* all four claims live in *Embracing Risk* / *Service Level Objectives* and are stated **about an availability target** (the worked example is literally 99.9% → 99.99%), and Chubby's case is about *overshooting an SLO* — the vocabulary `availability` owns. Splitting it would put the SLO story on two pages. `reliability` has more than enough without it. |
| Availability arithmetic **in series and in parallel** | `availability` | `single-point-of-failure-spof` | `availability` owns the maths; SPOF owns the topology it describes |
| **Availability vs reliability — the distinction itself** | **`reliability`** | `availability` (one clause + link, no table) | `reliability` needs the contrast to define itself, and the reference puts the comparison table on that page. `availability` states its own definition and moves on. |
| MTBF / MTTR | `reliability` | `availability` (one clause, for the `MTBF/(MTBF+MTTR)` estimate) | |
| Fault vs failure; fault tolerance | `reliability` | `single-point-of-failure-spof` | |
| Graceful degradation; idempotent retries; chaos/failure testing | `reliability` | `single-point-of-failure-spof` | defer the deep version to `[[handling-failures-in-distributed-systems|failure handling]]` (ch. 14) |
| Circuit breaker, bulkhead | **ch. 13** | `reliability`, `single-point-of-failure-spof` — **name + link only, no explanation** | this is the single likeliest duplication in the chapter |
| **Redundancy patterns** — active-active / active-passive, cold/warm/hot standby, failure-domain and geographic isolation | **`single-point-of-failure-spof`** | `availability`, `reliability` | eliminating a SPOF *is* redundancy; the reference's SPOF page has the strongest treatment |
| Shared fate / correlated failure; the non-obvious SPOFs (DNS, config, secrets, the deploy path, the status page) | `single-point-of-failure-spof` | — | |
| Load balancing (algorithms, health checks, topology) | **`load-balancers` / `load-balancing-algorithms` (ch. 04)** | `scalability`, `single-point-of-failure-spof`, `reliability` — link only | |
| **Percentiles and tail latency** | `latency-vs-throughput` | `availability` (SLOs are quoted at a percentile — one clause), `scalability` | |
| Little's Law; bandwidth-delay product; the four latency components | `latency-vs-throughput` | — | |
| **Hash ring, rehashing, virtual nodes, ring alternatives** | `consistent-hashing` | `scalability` (one clause), `[[sharding|sharding]]` ch. 09 | `scalability` must not explain the ring |
| **Partition tolerance; what a partition forces** | `cap-theorem` | `consistency-models`, `[[network-partitions|network partitions]]` ch. 14 | |
| PACELC | `cap-theorem` | `consistency-models` (one clause) | |
| CP / AP classification of real systems | `cap-theorem` | `consistency-models` | |
| **Eventual consistency; linearizability; the named-model spectrum** | `consistency-models` | `cap-theorem` (one clause each, no definitions) | `cap-theorem` says "AP systems return possibly-stale data"; it does **not** define eventual consistency |
| Read-your-writes / monotonic reads / causal consistency | `consistency-models` | — | |
| Vector clocks / conflict resolution | **ch. 14** (`vector-clocks`) | `consistency-models`, `cap-theorem` — one clause + link | |
| The strong-vs-eventual *decision framing* | **`strong-vs-eventual-consistency` (ch. 11)** | `consistency-models`, `cap-theorem` | `consistency-models` teaches the *models*; ch. 11 teaches the *choice* |
| Spanner incident-cause breakdown (52.5% user, 13.3% bug, …) | `reliability` | — | |
| Brewer's "no large-cluster partitions were observed" + "effectively CA" | `cap-theorem` | — | same paper, different claim — not restatement |

---

## Budget — the chapter-level finding

**Every reference page in this chapter is longer than our whole-page cap.** Their word counts run
~2,400–4,500 against our 2,400-word linter ceiling. So §1a's "2× the reference's reading time" test is
*slack here and cannot be the constraint* — a page could double the reference and still be shorter than it.
The binding discipline is **scope** (the ownership map above) plus these targets:

| Lesson | Reference | Tier | **Our target** | Ratio vs reference |
| --- | --- | --- | --- | --- |
| `scalability` | 8 min, ~3,000 w | Core | **1,200–1,400 w** | ~0.45× |
| `availability` | 9 min, ~2,900 w | Core | **1,300–1,500 w** | ~0.5× |
| `reliability` | 7 min, ~2,500 w | Core | **1,100–1,300 w** | ~0.5× |
| `single-point-of-failure-spof` | 10 min, ~3,000 w | Core | **1,200–1,400 w** | ~0.45× |
| `latency-vs-throughput` | 6 min, ~2,500 w | Core | **1,000–1,200 w** | ~0.45× |
| `consistent-hashing` | 13 min, ~4,500 w | **Full** | **1,700–2,000 w** | ~0.4× |
| `cap-theorem` | 10 min, ~3,000 w | **Full** | **1,500–1,800 w** | ~0.55× |
| `consistency-models` | 14 min (part-paywalled) | **Full** | **1,600–1,900 w** | ~0.45× |

We run **shorter than the reference on every page**, because the reference teaches four siblings' subjects on
each of its pages and we teach one. No §1a length justification is needed anywhere in this chapter. If a page
comes in over 2,000 words, the cause is annexation, not depth — check it against the ownership map.

---

## Scalability — `scalability`

- **archetype**: **mechanism**. It is the chapter anchor but *not* an orientation page: it has a real
  adoption decision (which dimension to add capacity in, and when), real costs, and a real recognition cue.
  Forcing `orientation` would strip `whenToUse` and `tradeoffs` from a page that genuinely has both, and
  would leave the anchor with nothing but vocabulary the other seven pages already own.
  → required: `definition`, `whenToUse`, `techniques`, `example`, `tradeoffs`, `pitfalls`, `interviewAngle`,
  `resources`.
- **reference**: <https://algomaster.io/learn/system-design/scalability> — *What is Scalability? · Measuring
  Scalability · Vertical Scaling (Scale Up) · Horizontal Scaling (Scale Out) · Scaling Different Components ·
  Example: Scaling from 0 to millions of users · Summary · Quiz* — **8 min read, ~2,800–3,200 words**.
- **delta / missing**:
  - *Measuring scalability* (load metrics: RPS, concurrent users, data volume, throughput) → **cover here**,
    compressed to the two questions that matter: *which* number is growing, and does cost grow with it.
    Percentile latency itself → owned by `[[latency-vs-throughput]]`.
  - *Vertical scaling* / *Horizontal scaling* as named strategies → **cover here as definitions only**; the
    tradeoff table is owned by `[[vertical-vs-horizontal-scaling|vertical vs horizontal scaling]]` (ch. 11).
  - *Stateless vs stateful* → **cover here in one clause** (it is the precondition for scaling out), defer to
    `[[stateful-vs-stateless-architecture|stateless services]]` (ch. 11).
  - *Scaling different components* — read replicas, sharding, NoSQL, caching, message queues → **not covered
    here.** Owned by `[[read-replicas|read replicas]]` + `[[sharding|sharding]]` (ch. 09),
    `[[sql-vs-nosql|SQL vs NoSQL]]` (ch. 08), `[[what-is-caching|caching]]` (ch. 07),
    `[[message-queues|message queues]]` (ch. 06). Name them in one sentence as "the rest of this track",
    each linked. **This is the biggest single cut and the page's main drift risk.**
  - *0→millions six-stage progression* → **take its structure, not its subject.** Ours is one measured
    system, below.
- **delta / extraneous**:
  - **Universal Scalability Law / Amdahl** — no counterpart on the reference page. **Justification 1**
    (depth the track adds on purpose): it is the sourced answer to "why doesn't 2× the nodes give 2× the
    throughput", which is the commonest interview follow-up here, and the reference only gestures at
    "performance degradation patterns (linear vs superlinear)".
  - **A real system's measured request-per-server figure** — **justification 1**. The reference's worked
    example is hypothetical; ours is measured.
- **delta / shared**: *what scalability is* → **tie**; keep it to two sentences. *vertical vs horizontal* →
  **theirs is better on restraint** and it is a sibling's subject anyway — take its sequencing (define both,
  then move on), not its length.
- **scope line**: Covers what scalability means, what you measure when you claim it, the two dimensions you
  can add capacity in, and why added capacity stops paying off. Does **not** cover the vertical-vs-horizontal
  tradeoff table (owned by `[[vertical-vs-horizontal-scaling|vertical vs horizontal scaling]]`), any
  per-component scaling technique (`[[sharding|sharding]]`, `[[read-replicas|read replicas]]`,
  `[[what-is-caching|caching]]`, `[[message-queues|message queues]]`), the hash ring (`[[consistent-hashing]]`),
  or percentile latency (`[[latency-vs-throughput]]`).
- **tier**: **Core.** High interview weight in aggregate but almost never asked as a standalone question —
  interviewers ask about *sharding* and *caching*, which are other pages. `implementation` has nothing
  non-fabricated to hold.
- **length note**: **1,200–1,400 words.** Spend them on the *ceiling* — the arithmetic of what one machine
  tops out at and the measured counter-example. Must **not** re-explain: what a load balancer is, what a
  cache is, what sharding is, the client→edge→service→data picture (`[[what-is-system-design]]`).
- **priority**: `high` · **estimatedMinutes**: `20` · **tags**: `["scalability", "architecture", "distributed-systems"]` · **parent**: none (anchor).

### Cost model
Scalability is the property that **cost grows no faster than load** — you buy the ability to absorb 10× the
traffic by adding capacity rather than rewriting. You pay for it in **coordination**: the moment capacity is
more than one machine, every request may need state that lives somewhere else, and that hop is latency,
failure surface and consistency you did not previously have to think about.

### Recognition cue
The prompt names a growth number rather than a feature — *"for 10 million users"*, *"during Black Friday"*,
*"it works today but falls over at peak"*. The follow-up move is to ask **which** number grows: read QPS,
write QPS, stored bytes, or fan-out. They pull the design in different directions
(`[[system-design-interview-framework]]` owns how to extract them).

### Variants — and the axis
- **Vertical (scale up)** — one machine, more of it. Axis: *no coordination cost, hard ceiling.*
- **Horizontal (scale out)** — more machines. Axis: *no ceiling, coordination cost on every request.*
- Name a third that candidates forget: **scaling by doing less work** — caching, denormalising,
  precomputing. Costs staleness rather than machines.

### Tradeoffs, with the condition under which each bites
1. **Scaling out requires stateless services.** Bites the first time a session lives in one server's memory
   and a user's second request lands elsewhere. Link `[[stateful-vs-stateless-architecture|stateless services]]`.
2. **Throughput does not scale linearly, and past a point it goes *backwards*.** The Universal Scalability
   Law adds a coherency term that grows quadratically in N; when its coefficient β > 0 throughput peaks at
   Nmax = √((1−α)/β) and *decreases* beyond it. Bites on write-heavy workloads that need cross-node
   agreement. (<https://www.perfdynamics.com/Manifesto/USLscalability.html>)
3. **The ceiling on vertical scaling is much higher than candidates assume, and reaching for horizontal
   scaling early costs you more than it buys.** Bites when a candidate proposes a sharded cluster for a
   workload one instance would carry. Evidence: the worked example below.

### Figures
| Value | Source / derivation |
| --- | --- |
| Largest single EC2 instance: **1,920 vCPUs, 32 TiB RAM, 200 Gbps** (`u7inh-32tb.480xlarge`) | AWS product page — <https://aws.amazon.com/ec2/instance-types/u7i/> |
| Stack Overflow, 9 Feb 2016: **209,420,973 HTTP requests/day** across **9** primary web servers | <https://nickcraver.com/blog/2016/02/17/stack-overflow-the-architecture-2016-edition/> |
| ⇒ **~2,424 requests/s** site-wide (daily average) | derivation: 209,420,973 ÷ 86,400 |
| ⇒ **~269 requests/s per web server** (daily average) | derivation: 2,424 ÷ 9 |
| **66,294,789 page loads/day** ⇒ **~767/s** | derivation: 66,294,789 ÷ 86,400 (source as above) |
| Question page render, average **22.71 ms**; home page **11.80 ms** | same post; **label as measured 2016 figures**, not current |
| USL: `X(N) = γN / (1 + α(N−1) + βN(N−1))`; reduces to Amdahl's law when β = 0, γ = 1 | <https://www.perfdynamics.com/Manifesto/USLscalability.html> |

### Failure modes
- **Scaling the tier that wasn't the bottleneck.** Adding app servers when the database is saturated makes
  the database worse (more connections, more contention).
- **A shared component that doesn't scale with the tier in front of it** — a connection pool, a licence
  server, a single primary.
- **Coordination that grows superlinearly** — the retrograde region above.
- **Cost scaling faster than load** — an architecture that "scales" only in the sense that you can keep
  paying for it.

### Interview angle
> *"You've added a second app server. What breaks?"*

The depth answer names **state**: sessions, in-process caches, sticky uploads, scheduled jobs that now run
twice, and anything that assumed "there is one of me". Then it names the *new* single point of failure the
change created (the load balancer) and links out to `[[single-point-of-failure-spof]]`. A candidate who
answers "nothing, it just doubles" has never done it.

> *"How far does one machine get you?"*

The depth answer refuses to answer in the abstract, quotes the ceiling figure, and then argues *against*
scaling out — the Stack Overflow numbers. Arguing for simplicity with evidence outranks proposing a cluster.

### Worked example — Stack Overflow, 2016
Take the reference's *progression* structure but invert its lesson. One measured system serving
209M HTTP requests a day on nine web servers, with 384–768 GB RAM SQL boxes and two Redis nodes at
"below 2% CPU", and the author's own note that they have accidentally run the whole site on **one** web
server "successfully, a few times". Show: the per-server arithmetic, what makes it possible (a read-heavy
workload with a cacheable hot set), and where it would break (write fan-out, multi-region, a working set
that stops fitting in RAM). Then say what the *other* direction looks like and hand off to the sibling
lessons. **Label the figures as 2016 measurements.**

### Diagram
- **Load-bearing: `numbers`.** Rows = the table above (one-machine ceiling · SO requests/day · derived
  req/s · derived req/s per server · page renders/s · avg render ms). Every row carries its derivation.
  This is the figure that makes "you probably don't need to scale out yet" defensible rather than contrarian.
- **Second (optional): `architecture`** — the same topology twice is not possible in one figure, so instead
  show *what has to move out of the app server* for horizontal scaling to work: `client` → `edge: load
  balancer` → `service: app ×N (stateless)` → `data: session/cache store`, `data: database`, with node
  `note`s naming what used to live in-process. Skip it if the page is running long; `numbers` alone clears §7.4.

### Owns / defers
Owns: the definition, what you measure, the two axes as *definitions*, the limits (USL/Amdahl), the
one-machine ceiling. Defers: the vertical/horizontal tradeoff table → `[[vertical-vs-horizontal-scaling|vertical vs horizontal scaling]]`;
every per-component technique → chs. 06–09; the ring → `[[consistent-hashing]]`; percentiles →
`[[latency-vs-throughput]]`; the new SPOF → `[[single-point-of-failure-spof]]`.

### Sources (2–4, primary-weighted, all fetched)
1. AWS — EC2 High Memory U7i instances (the vertical ceiling): <https://aws.amazon.com/ec2/instance-types/u7i/>
2. Nick Craver / Stack Overflow — *The Architecture, 2016 Edition* (first-party production figures): <https://nickcraver.com/blog/2016/02/17/stack-overflow-the-architecture-2016-edition/>
3. Neil Gunther — *How to Quantify Scalability* (the USL, from its author): <https://www.perfdynamics.com/Manifesto/USLscalability.html>
4. AWS Well-Architected — Reliability Pillar (for the cost-of-capacity framing): <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html>

---

## Availability — `availability`

- **archetype**: **mechanism**. There is a genuine adoption decision (which target to commit to, and what
  redundancy to buy for it), a genuine cost, and named techniques (SLI/SLO/SLA, error budgets). Not a
  distinction — the reliability contrast is `reliability`'s, one clause here.
  → required: `definition`, `whenToUse`, `techniques`, `example`, `tradeoffs`, `pitfalls`, `interviewAngle`, `resources`.
- **reference**: <https://algomaster.io/learn/system-design/availability> — *What Availability Measures ·
  Measuring Availability · The "Nines" of Availability · Availability in Series vs Parallel · Common Failure
  Modes · Redundancy: The Foundation of Availability · High Availability Patterns · Summary · Quiz* —
  **9 min read, ~2,800–3,000 words**. Tables: nines→downtime; hardware MTBF; standby types; geographic
  redundancy; sync vs async replication. Worked examples: 364/365 = 99.73%; 99.9%³ = 99.7%; two parallel
  servers at 0.1% failure each.
- **delta / missing**:
  - *Measuring availability* (the formula) → **cover here**, both forms: time-based and request-success.
  - *The nines table* → **cover here.** This is the page's centrepiece figure.
  - *Availability in series vs parallel* → **cover here** — it is the arithmetic that turns a topology into
    a number, and it is what makes the SPOF page's advice quantitative.
  - *Common failure modes (hardware/software/network/human)* → **defer to `[[reliability]]`**, which owns
    why systems break; name the category in one clause here.
  - *Redundancy: active-passive / active-active / cold-warm-hot standby / geographic redundancy* →
    **defer to `[[single-point-of-failure-spof]]`.** This page owns the *arithmetic* of redundancy, that
    page owns the *patterns*. **This is the largest single cut on this page.**
  - *High availability patterns — load balancer + health checks, DB replication/failover, queue-based load
    levelling, circuit breaker* → **defer**: `[[load-balancers|load balancers]]` (ch. 04),
    `[[read-replicas|read replicas]]` (ch. 09), `[[message-queues|message queues]]` (ch. 06),
    `[[circuit-breaker-pattern|circuit breakers]]` (ch. 13). Name them in one sentence, linked.
- **delta / extraneous** — this page carries the chapter's biggest justified additions:
  - **SLI / SLO / SLA.** The reference page does **not** cover them anywhere (verified: not in its
    headings, and its own summary omits them). **Justification 2 + 3**: the manifest and chapter 01's
    ownership map both assign them here, and `what-is-system-design` already links in promising them.
  - **Error budgets.** Same justification, same reason.
  - **The economics of a nine** — 100× per increment, the $1M/$900 case, the user-perception ceiling,
    Chubby's deliberate planned downtime. **Justification 1 + 3**: chapter 01 cut it *to this page* by
    name; it is the cost side of the cost model, and without it the page teaches only how to buy nines and
    never when to stop.
  - **A real SLA with money attached** (S3). **Justification 1.**
- **delta / shared**: *the nines table* → **ours is better because we source it** (the Google SRE
  appendix, not an unattributed table) and because we corroborate it against AWS's own targets table.
  *series/parallel arithmetic* → **tie**; take the reference's ordering (formula → series → parallel) and
  use AWS's worked numbers instead of unattributed ones.
- **scope line**: Covers what availability measures, both ways of measuring it, the nines→downtime
  arithmetic, how availability composes in series and in parallel, the SLI/SLO/SLA vocabulary, error
  budgets, and why more nines stop being worth buying. Does **not** cover the redundancy *patterns* that
  produce those numbers (owned by `[[single-point-of-failure-spof]]`), why systems fail or how to make them
  correct (owned by `[[reliability]]`), or load balancing (owned by `[[load-balancers|load balancers]]`).
- **tier**: **Core**, but a dense Core — it carries the chapter's heaviest figure load. Do not promote to
  Full; `implementation` would be a fabricated config excerpt.
- **length note**: **1,300–1,500 words.** Spend them on the **arithmetic**: the nines table, the series /
  parallel composition, and the error-budget calculation done once end to end. Must **not** re-explain:
  redundancy patterns, failover mechanics, what a load balancer does, functional vs non-functional
  requirements (`[[what-is-system-design]]`).
- **priority**: `high` · **estimatedMinutes**: `25` · **tags**: `["scalability", "distributed-systems", "observability"]` · **parent**: `scalability`.

### Cost model
Availability is the fraction of time (or of requests) a system serves successfully. Each additional nine is
bought with redundancy, and **an incremental improvement in reliability may cost 100× more than the previous
increment** — across both hardware and the engineering hours not spent on features
(<https://sre.google/sre-book/embracing-risk/>). So the interesting question is never "how do we get more
nines", it is "which nine is the last one worth paying for".

### Recognition cue
The prompt names a target with nines in it, or names an outage cost, or says "must always be up". Also fires
whenever a component has exactly one of something. The move: convert the nines into **minutes** out loud —
that is what makes the target arguable rather than aspirational.

### Variants — the axis is *what a violation is measured against*
- **SLI** — a quantitative measure of some aspect of the service (request latency, error rate, throughput,
  availability).
- **SLO** — a target value or range for an SLI.
- **SLA** — an explicit or implicit contract with users that carries consequences for missing the SLO.
  (All three: <https://sre.google/sre-book/service-level-objectives/>)
- **Time-based availability** (uptime ÷ total time) vs **request-success availability** (successful ÷ valid
  requests). Google uses the latter for globally distributed services: *"instead of using metrics around
  uptime, we define availability in terms of the request success rate"*
  (<https://sre.google/sre-book/embracing-risk/>). AWS documents both forms
  (<https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html>).

### Tradeoffs
1. **Superlinear cost.** 100× per increment (SRE Book, above). Bites the moment a candidate says "five
   nines" reflexively.
2. **Past a point the user cannot perceive it.** *"A user on a 99% reliable smartphone cannot tell the
   difference between 99.99% and 99.999% service reliability"* (<https://sre.google/sre-book/embracing-risk/>).
   Bites on consumer products with mobile clients.
3. **The target is a business calculation.** SRE Book worked case: on a $1M-revenue service, moving
   99.9% → 99.99% is worth `$1M × 0.0009 = $900`, so it is worth doing only if it costs less than $900.
   Bites whenever "highly available" is asserted with no cost side. (same URL)
4. **Over-delivering is itself a cost.** Users build on observed behaviour, not on your stated target —
   Google's SREs synthesise controlled outages when true failures have not dropped availability below
   target (<https://sre.google/sre-book/service-level-objectives/>). Chubby has had periodic forced outages
   since 2009 for exactly this reason, against a measured 99.99958%
   (<https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45855.pdf>). Bites when
   an internal service's *observed* availability silently becomes its *interface*.
5. **Hard dependencies multiply.** Every hard dependency you add lowers your ceiling before you have written
   a line of code (see the series arithmetic below).

### Figures — the `numbers` table, every row sourced or derived
| Quantity | Value | Source / derivation |
| --- | --- | --- |
| 99% | 3.65 days/yr · 7.2 h/month · 14.4 min/day | Google SRE Book availability table — <https://sre.google/sre-book/availability-table/> |
| 99.9% | 8.76 h/yr · 43.2 min/month · 1.44 min/day | same |
| 99.95% | 4.38 h/yr · 21.6 min/month | same |
| 99.99% | 52.6 min/yr · 4.32 min/month · 8.64 s/day | same |
| 99.999% | 5.26 min/yr · 25.9 s/month | same |
| Cross-check | AWS gives 99.9% = 8 h 45 min/yr, 99.99% = 52 min/yr | <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html> — **the two sources agree**; say so rather than picking one |
| Three hard dependencies at 99.99% each | **99.97%** | AWS worked example: 99.99% × 99.99% × 99.99% |
| Two independent redundant components at 99.9% each | **99.9999%** | AWS: 100% − (0.1% × 0.1%). Shortcut: count the nines and add them |
| MTBF 150 days, MTTR 1 h | **≈ 99.97%** | AWS: Avail = MTBF ÷ (MTBF + MTTR) |
| 2.5M requests/day at a 99.99% daily target | **250 errors allowed** | Google SRE Book, *Embracing Risk* |
| S3 Standard SLA | **99.9%** monthly uptime commitment; 10% credit below 99.9%, 25% below 99.0%, 100% below 95.0% | <https://aws.amazon.com/s3/sla/> — note S3 defines Monthly Uptime Percentage as 100% minus the average of per-5-minute error rates |
| Chubby (Google) | **99.99958%** measured, for 30 s+ outages | Brewer 2017 (Spanner/CAP), URL above |

**Caution for the author:** the SRE table gives 99.99% = 52.6 min/yr and AWS gives 52 min/yr. Both are the
same number rounded differently — present them as agreeing, do not manufacture a discrepancy.

### Failure modes
- **Measuring availability where the user isn't.** A health check that returns 200 while every real request
  502s. Measure at the edge, on real requests.
- **The dependency you forgot to count.** Availability in series is multiplicative and nobody's diagram shows
  the config service.
- **Correlated "redundancy".** The parallel formula assumes independence; two instances in the same rack,
  same AZ, or on the same deploy are not independent. Cross-link `[[single-point-of-failure-spof]]`.
- **Scheduled maintenance excluded from the denominator.** AWS explicitly advises against it: *"your users
  will likely want to use your service during these times"*.
- **A target chosen from current performance.** The SRE Book's advice: *"Don't pick a target based on
  current performance"* — it locks the team into heroics.

### Interview angle
> *"You said 99.99%. What does that buy you, and what does it cost?"*

The depth answer converts to minutes (**52.6 min/yr, 4.32 min/month**) *before* saying anything about
architecture, then names the cost side — 100× per increment — and then names what it would trade away
instead. The strongest version does the $900 arithmetic out loud on the interviewer's own revenue number.

> *"How would you know you were meeting it?"*

The depth answer separates the three: an SLI you can actually compute from request logs, an SLO you commit
to internally, and an SLA only if money is attached. Then it names the error budget and what happens when
it's spent — Google halts releases while reliability work is invested
(<https://sre.google/sre-book/embracing-risk/>).

### Worked example — one service's error budget, end to end
Pick a target (99.9% over a 28-day window), convert to budget (**43.2 minutes/month** from the table, or
`0.001 × 2.5M requests` in request terms), then spend it: one 12-minute deploy incident, one 8-minute
dependency blip, and show what's left and what that permits. Close with the S3 SLA as the contract version:
a **99.9%** commitment with **10% / 25% / 100%** service credits, and the observation that the SLA target is
deliberately *looser* than the internal SLO — the SLA is what you'll pay for, not what you aim at.

### Diagram
- **Load-bearing: `numbers`** — the nines table plus the series / parallel / MTBF rows. Every row's
  `derivation` field is mandatory (the linter enforces it).
- **No second figure.** The topology that would motivate an `architecture` diagram belongs to
  `[[single-point-of-failure-spof]]`; drawing it here is annexation. `diagram: numbers only, because the
  page's teaching is arithmetic and the topology is the sibling's.`

### Owns / defers
Owns: the definition and both formulas, the nines arithmetic, series/parallel composition, SLI/SLO/SLA,
error budgets, the economics of a nine. Defers: redundancy patterns → `[[single-point-of-failure-spof]]`;
failure causes and correctness → `[[reliability]]`; load balancing → `[[load-balancers|load balancers]]`;
replication mechanics → `[[read-replicas|read replicas]]`.

### Sources (all fetched)
1. Google SRE Book — *Service Level Objectives*: <https://sre.google/sre-book/service-level-objectives/>
2. Google SRE Book — *Embracing Risk*: <https://sre.google/sre-book/embracing-risk/>
3. Google SRE Book — *Availability Table* (the nines figures): <https://sre.google/sre-book/availability-table/>
4. AWS Well-Architected, Reliability Pillar — *Availability* (series/parallel/MTBF arithmetic): <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html>

`resources` (distinct from `sources`): the S3 SLA <https://aws.amazon.com/s3/sla/>; the SRE Workbook's
*Implementing SLOs* <https://sre.google/workbook/implementing-slos/>.

---

## Reliability — `reliability`

- **archetype**: **mechanism**. The page teaches techniques you adopt to keep a system doing the right
  thing under fault, with real costs. The availability contrast is a *sub-beat inside `definition` +
  `techniques`*, not the page's shape — so not `distinction`.
  → required: `definition`, `whenToUse`, `techniques`, `example`, `tradeoffs`, `pitfalls`, `interviewAngle`, `resources`.
- **reference**: <https://algomaster.io/learn/system-design/reliability> — *What is Reliability? ·
  Reliability vs Related Concepts (table) · Measuring Reliability (MTBF · MTTR · Error Rate · Data
  Correctness) · Why Systems Become Unreliable (hardware · software bugs · config · human · overload and
  cascading failures) · Key Principles (redundancy · failover · load balancing · monitoring · graceful
  degradation) · Techniques (redundant architectures · data replication · graceful degradation · circuit
  breakers · idempotency) · Summary · Quiz* — **7 min read, ~2,500 words**. Names the 2017 AWS S3 outage.
- **delta / missing**:
  - *Reliability vs availability vs fault tolerance vs durability* → **cover here — this page owns it.**
  - *MTBF / MTTR / error rate / data correctness* → **cover here**, but MTBF→availability conversion is one
    clause with a link to `[[availability]]`.
  - *Why systems become unreliable* → **cover here**, and this is where our evidence beats theirs (below).
  - *Redundancy / failover / load balancing / monitoring* as "key principles" → **defer**:
    `[[single-point-of-failure-spof]]` (redundancy, failover), `[[load-balancers|load balancers]]` (ch. 04),
    `[[three-pillars-observability|observability]]` (ch. 19). One clause each, linked.
  - *Circuit breakers* → **defer whole** to `[[circuit-breaker-pattern|circuit breakers]]` (ch. 13). Name
    and link; do not draw the state machine.
  - *Graceful degradation* and *idempotency for safe retries* → **cover here** (they are correctness
    techniques, which is this page's subject); the deep versions are `[[idempotency|idempotency]]` (ch. 05)
    and `[[handling-failures-in-distributed-systems|failure handling]]` (ch. 14).
  - *The 2017 AWS S3 outage* → **defer to `[[single-point-of-failure-spof]]`**, which owns that incident.
    This page uses a different one.
- **delta / extraneous**:
  - **The Spanner incident-cause breakdown** — no counterpart. **Justification 1**: it is measured evidence
    for the page's central claim (what actually makes systems unreliable is not hardware), against a
    reference that asserts a list.
  - **Fault vs failure as formal terms** — **justification 1**; it is the distinction that makes "fault
    tolerance" mean something, and it is citable from a university course.
  - **Chaos engineering** — **justification 1**; the practice that turns "we have redundancy" into "we know
    the redundancy works". Keep to two sentences plus a `resources` link.
- **delta / shared**: *the reliability-vs-availability contrast* → **theirs is well-shaped; take its
  structure** (a four-way comparison table with one example each) and source ours. *MTBF/MTTR* → **tie**,
  but source ours from AWS rather than asserting a formula.
- **scope line**: Covers what reliability means as distinct from availability, how it is measured
  (MTBF, MTTR, error rate, correctness), what actually causes systems to stop doing the right thing, and the
  techniques that keep a partly-broken system correct. Does **not** cover the nines arithmetic, SLOs or
  error budgets (owned by `[[availability]]`), redundancy patterns (owned by
  `[[single-point-of-failure-spof]]`), or the circuit breaker (owned by
  `[[circuit-breaker-pattern|the circuit breaker pattern]]`).
- **tier**: **Core.** It is the lowest-interview-weight page in the chapter — interviewers ask about
  availability and failure modes by other names.
- **length note**: **1,100–1,300 words.** Spend them on the **distinction** and the **evidence for what
  actually breaks**. Must **not** re-explain: nines, SLOs, error budgets, redundancy topologies, circuit
  breaker states, the S3 outage.
- **priority**: `mid` · **estimatedMinutes**: `20` · **tags**: `["distributed-systems", "architecture", "observability"]` · **parent**: `scalability`.

### Cost model
Reliability is a system continuing to do the **right** thing in the presence of faults. It is bought with
redundancy *plus* the correctness machinery that makes redundancy safe — idempotency keys, retry policies,
reconciliation, degradation paths. The cost is that every one of those is code that only runs when something
is already wrong, so it is the code least likely to be exercised and most likely to be broken. That is why
the practice exists that deliberately breaks things in production.

### Recognition cue
The prompt cares about *correctness under failure*, not just uptime: money, inventory, message delivery,
"exactly once", "must not double-charge". Also: any design with a retry in it.

### Variants — the axis is *what the property promises*
The `comparison` figure. Rows: **reliability** (does the right thing over time) · **availability** (responds
at all) · **fault tolerance** (keeps working with some parts broken) · **durability** (acknowledged data
survives). Columns: *what it asks · what a violation looks like to a user · how it is measured*.
The one-line version to anchor it: availability asks *is it up*; reliability asks *is it right*.

Named techniques (the paragraph half, per §4's labour split): **graceful degradation** (shed the optional
feature, keep the core path), **idempotent operations** (so a retry is safe), **replication** (so one bad
node isn't the answer), **failure injection / chaos testing** (so the recovery path is exercised before an
incident does it).

### Tradeoffs
1. **Every retry is a correctness bet.** Without idempotency, retries turn a timeout into a double write.
   Bites on payment, order and messaging paths — exactly where it matters most.
2. **Graceful degradation is a product decision disguised as an engineering one.** Serving trending items
   instead of personalised recommendations is correct only if the product agrees it is. Bites when the
   fallback silently ships and nobody owns whether it's acceptable.
3. **Reliability machinery is untested by definition.** It runs only during incidents. The mitigation is
   deliberate injection, and the cost of that is blast radius.
4. **MTTR usually buys more than MTBF.** Availability ≈ MTBF ÷ (MTBF + MTTR)
   (<https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html>) — halving
   recovery time is often cheaper than doubling time-between-failures. Bites when a team spends a quarter
   hardening a component instead of automating its failover.

### Figures
| Value | Source |
| --- | --- |
| Spanner internal incidents by cause: **User 52.5% · Bug 13.3% · Cluster 12.1% · Other 10.9% · Network 7.6% · Operator 3.7%** (weighted by frequency, not impact) | Brewer, *Spanner, TrueTime & The CAP Theorem*, 2017 — <https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45855.pdf> |
| Availability estimate from MTBF/MTTR: MTBF 150 days, MTTR 1 h ⇒ **≈99.97%** | AWS Well-Architected — <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html> |
| **Fault** = some part of the system isn't working; **failure** = the system as a whole isn't working; **fault tolerance** = the system as a whole keeps working despite faults | Kleppmann, *Concurrent & Distributed Systems* lecture notes, Cambridge — <https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf> |

The Spanner breakdown is the page's strongest single move: **more than half of the incidents in one of the
most carefully engineered distributed databases ever built were user error, and software bugs outnumbered
network problems nearly 2:1.** That is the sourced answer to "what actually makes systems unreliable".

### Failure modes
- **Retries without idempotency** → duplicated side effects.
- **Retry storms** → a struggling dependency gets hit harder the sicker it gets (name backoff + jitter, one
  clause, link `[[handling-failures-in-distributed-systems|failure handling]]`).
- **A fallback path that has never run.**
- **Silent data corruption** — the failure availability metrics cannot see, because every request returns
  200.
- **Config and deploy as the top cause of incidents**, not hardware (the Spanner figures).

### Interview angle
> *"Your service is 99.99% available. Is it reliable?"*

The depth answer says the two are independent: a payment service that is always up and occasionally
double-charges scores perfectly on availability and fails on reliability, and users lose trust in wrong
answers faster than in downtime. Then it names the measurement that would have caught it — a correctness
SLI, not an uptime one — and links `[[availability]]`.

> *"How do you know your failover works?"*

The depth answer is uncomfortable and correct: you don't, until you've run it. Name chaos engineering's
framing — build a hypothesis about steady-state behaviour, vary real-world events, run in production,
minimise blast radius (<https://principlesofchaos.org/>) — and Google's practice of synthesising Chubby
outages when true failures haven't consumed the budget.

### Worked example — a payment write that times out
One request path, walked: client → API → payment service → ledger. The ledger write succeeds; the response
is lost. Show the three possible client behaviours (give up, retry blind, retry with an idempotency key),
what each costs, and which one a correctness requirement forces. Then show the degradation path when the
ledger is *down* rather than slow (queue and reconcile vs reject) and name which non-functional requirement
each choice protects. Keep it to one path — the temptation to draw the whole system is the length risk here.

### Diagram
- **Load-bearing: `comparison`** — reliability / availability / fault tolerance / durability against *what
  it asks · what a violation looks like · how it's measured*. This is the figure the whole page hangs on and
  it is the one thing the sibling pages must not duplicate.
- **Second (optional): `sequence`** — the timed-out payment write: `Client → API → Ledger` with a dashed lost
  response and a retry, self-call on the ledger for the idempotency-key check. Use it only if the
  `comparison` and the prose leave room.

### Owns / defers
Owns: availability-vs-reliability, fault vs failure, MTBF/MTTR, what actually causes unreliability,
idempotent retries, graceful degradation, failure injection. Defers: nines/SLO/error budget →
`[[availability]]`; redundancy patterns and the S3 outage → `[[single-point-of-failure-spof]]`; circuit
breaker → `[[circuit-breaker-pattern|circuit breakers]]`; retry/backoff depth →
`[[handling-failures-in-distributed-systems|failure handling]]`; idempotency depth →
`[[idempotency|idempotency]]`.

### Sources (all fetched)
1. Kleppmann — *Concurrent and Distributed Systems*, Cambridge lecture notes (fault / failure / fault tolerance / SPOF definitions): <https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf>
2. Brewer — *Spanner, TrueTime & The CAP Theorem*, Google 2017 (incident-cause data): <https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45855.pdf>
3. AWS Well-Architected, Reliability Pillar — *Availability* (MTBF/MTTR): <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html>
4. *Principles of Chaos Engineering*: <https://principlesofchaos.org/>

---

## Single Point of Failure (SPOF) — `single-point-of-failure-spof`

- **archetype**: **mechanism**. It has an adoption decision (which SPOFs to eliminate and which to accept),
  named techniques, and the reference's own "Redundancy Trade-Offs" section confirms a real cost side. The
  five-step identification method goes in `implementation` as a procedure step-list (§4 explicitly allows
  that), **not** as a `procedure` archetype — a procedure page discourages `cornerCases` and would drop the
  tradeoffs that are the point.
  → required: `definition`, `whenToUse`, `techniques`, `example`, `tradeoffs`, `pitfalls`, `interviewAngle`, `resources`.
- **reference**: <https://algomaster.io/learn/system-design/single-point-of-failure-spof> — *Single Point of
  Failure · 1. What Makes Something a SPOF · Example Architecture · 2. Common SPOFs · 3. How to Identify
  SPOFs (3.1 critical user flows · 3.2 runtime and recovery dependencies · 3.3 shared fate · 3.4 failure
  reviews · 3.5 test the assumptions) · 4. Strategies to Reduce SPOFs (4.1 redundancy · 4.2 load balancing
  and health checks · 4.3 data replication and backup · 4.4 geographic and failure-domain isolation ·
  4.5 graceful degradation · 4.6 backpressure, timeouts, circuit breakers · 4.7 monitoring, alerting,
  runbooks) · 5. Redundancy Trade-Offs · Summary · Quiz* — **10 min read, ~2,800–3,200 words**. One
  "Common SPOFs" table by area; one interactive LB-in-front-of-app-servers figure.
- **delta / missing**:
  - *The three conditions that make something a SPOF* (critical dependency, no alternative, unacceptable
    impact) → **cover here.** This is the page's definition and it is better than "a box with one of it".
  - *Common SPOFs by area* (traffic entry, compute, data, cache, messaging, config, secrets, storage,
    network, operations) → **cover here** as the load-bearing figure's content.
  - *Identification method* (3.1–3.5) → **cover here**, compressed to three moves, in `implementation`.
  - *Redundancy / active-active / active-passive / geographic and failure-domain isolation* → **cover here
    — this page owns them** (see the ownership map).
  - *Load balancing and health checks* (4.2) → **defer** to `[[load-balancers|load balancers]]` (ch. 04).
  - *Data replication and backup* (4.3) → **defer** to `[[read-replicas|read replicas]]` (ch. 09); one clause.
  - *Graceful degradation* (4.5) → **defer** to `[[reliability]]`.
  - *Backpressure, timeouts, circuit breakers* (4.6) → **defer** to
    `[[circuit-breaker-pattern|circuit breakers]]` / `[[bulkhead-pattern|bulkheads]]` (ch. 13). Name, link,
    move on.
  - *Monitoring, alerting, runbooks* (4.7) → **defer** to `[[three-pillars-observability|observability]]` (ch. 19).
- **delta / extraneous**:
  - **Two named public postmortems** (AWS S3 2017, Facebook/Meta 2021) — **justification 1**. The reference
    walks a hypothetical architecture; ours walks two incidents with published timelines, and both illustrate
    the *non-obvious* SPOF the reference's diagram cannot show.
  - **The availability arithmetic of removing a SPOF** — cited, not re-derived, from `[[availability]]`.
    **Justification 2** (the sibling owns the derivation; this page owns the topology it applies to).
- **delta / shared**: *the LB-in-front-of-app-servers example* → **theirs is the right starting picture and
  ours should be shorter** — the interesting SPOFs are not the ones in that diagram. *the Common SPOFs
  table* → **tie on structure, ours is better if we ground each row in a real incident class.**
- **scope line**: Covers what makes a component a single point of failure, where they hide (including the
  ones that aren't on the diagram), how to find them, the redundancy patterns that remove them, and when
  keeping one is the right call. Does **not** cover the nines arithmetic (owned by `[[availability]]`),
  correctness-under-fault (owned by `[[reliability]]`), load-balancing algorithms (owned by
  `[[load-balancers|load balancers]]`), or circuit breakers and bulkheads (owned by ch. 13).
- **tier**: **Core.**
- **length note**: **1,200–1,400 words.** Spend them on **the SPOFs that are not on the diagram** — DNS,
  config, secrets, the deploy pipeline, the status page, the shared control plane. Everyone can spot the
  single database. Must **not** re-explain: load-balancing algorithms, replication mechanics, circuit
  breaker states, the nines table.
- **priority**: `high` · **estimatedMinutes**: `20` · **tags**: `["distributed-systems", "architecture", "scalability"]` · **parent**: `scalability`.

### Cost model
A SPOF is a component whose fault becomes a system-wide failure. Removing one buys you a fault that stays a
fault — but redundancy costs money (you pay for capacity you hope never to use), and it costs *coordination*:
two of something must now agree which one is authoritative, which is where split brain, failover storms and
stale reads come from. Some SPOFs are correctly left in place; the interview signal is being able to say
which and why.

### Recognition cue
Anywhere your diagram has exactly one box. Then the second pass, which is the one that matters: anywhere two
boxes *depend on the same third thing* — one DNS zone, one config service, one secret store, one deploy
pipeline, one control plane, one AZ. Kleppmann's definition is the crisp one: a SPOF is a *node or network
link whose fault leads to failure*
(<https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf>).

### Variants — the axis is *what the redundancy costs when idle*
- **Active-active** — all replicas serve; failure removes capacity, not function. Costs: consistency
  coordination.
- **Active-passive / hot standby** — a warm replica takes over; costs: paid-for idle capacity plus a
  failover window.
- **Warm / cold standby** — cheaper, slower to recover; recovery time becomes the SLO risk.
- **Failure-domain isolation (cells, AZs, regions)** — bounds the blast radius rather than removing the
  failure. Costs: routing complexity and data placement.

### Tradeoffs
1. **Redundancy that shares fate isn't redundancy.** Two instances behind one load balancer, in one AZ, on
   one deploy, reading one config service. Bites exactly when you need it. Note the arithmetic: the parallel
   availability formula assumes *independence* (`[[availability]]`).
2. **N+1 turns one failure into a coordination problem.** Split brain, failover flapping, stale primaries.
   Link `[[split-brain-problem|split brain]]` (ch. 14) and `[[heartbeats|heartbeats]]` (ch. 14).
3. **Recovery dependencies are the ones you never test.** The system you need to *fix* the outage may be
   inside the outage.
4. **Some SPOFs stay.** A single strongly-consistent primary is a deliberate choice; the honest answer is a
   bounded recovery time, not a claim that it's redundant.

### Figures / evidence
**AWS S3, us-east-1, 28 Feb 2017** (<https://aws.amazon.com/message/41926/>):
| Fact | Value |
| --- | --- |
| Trigger | a command entered during billing-system debugging removed "a larger set of servers than intended" |
| Subsystems removed | the **index** subsystem (metadata/location for all objects) and the **placement** subsystem (which depends on index) |
| Start | 9:37 AM PST |
| Index serving GET/LIST/DELETE | 12:26 PM PST — **2 h 49 min** (derivation: 09:37→12:26) |
| Index fully recovered | 1:18 PM — **3 h 41 min** |
| Placement recovered | 1:54 PM — **4 h 17 min** |
| Why so long | these subsystems "had not been completely restarted for many years" in larger regions, and safety checks on metadata integrity took longer than expected |
| **The non-obvious SPOF** | the AWS **Service Health Dashboard** could not be updated until 11:37 AM "because of a dependency the SHD administration console has on Amazon S3" |
| Fix | remove capacity more slowly, add safeguards against dropping a subsystem below minimum capacity, and accelerate partitioning the index subsystem into **cells** |

**Meta/Facebook, 4 Oct 2021** (<https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/>):
a backbone-capacity audit command took down all backbone connections; the audit tool's bug failed to stop
it. The DNS servers then *withdrew their own BGP advertisements* — by design, since inability to reach the
data centres indicates an unhealthy network — which removed the company from the internet's routing table.
Remote access ran over the same backbone, so recovery needed engineers physically on site at facilities
"designed with high levels of physical and system security in mind".

Use the two together: S3 is *shared fate through a dependency*, Meta is *shared fate through the control
plane*, and in both cases the recovery path was inside the failure domain.

### Failure modes
- The **status page** or **runbook wiki** hosted on the thing that's down.
- **DNS** — one zone, one provider, one TTL that outlives your failover.
- **The control plane** — config, service discovery, secrets, the CI pipeline that would ship the fix.
- **Human**: one person who knows how to fail it over.
- **Capacity-removal tooling with no floor** — the S3 root cause, precisely.

### Interview angle
> *"Where are the single points of failure in what you've drawn?"*

The weak answer points at the database. The depth answer walks the request path *and then the recovery
path*, names something not on the diagram (DNS, config, the deploy pipeline, the dashboard), and then makes
the cost argument: which of these is worth removing given the availability target — with the parallel
arithmetic from `[[availability]]` to back it.

> *"You've added a second load balancer. Are you done?"*

The depth answer names shared fate: same AZ? same config push? same DNS record with a 300 s TTL? And it
names the new problem redundancy created — who is authoritative — linking
`[[split-brain-problem|split brain]]`.

### Worked example
Walk the **S3 2017 timeline** as a SPOF anatomy: a dependency graph in which the index subsystem was a hard
dependency of everything (including placement, including other AWS services), plus the dashboard's own
dependency on the thing it reported on. Then state the two structural fixes AWS made — a floor on capacity
removal, and **cell partitioning** so a restart is bounded — and generalise: bounding blast radius is often
cheaper than eliminating the dependency.

### Diagram
- **Load-bearing: `architecture`** — the *shared-fate* topology, not the naive one. Nodes:
  `client` (client) · `dns` (edge, note: "one zone, one provider — fails silently via TTL") ·
  `lb` (edge) · `app ×N` (service) · `config` (service, note: "every tier reads it at boot — a hidden hard
  dependency") · `secrets` (service) · `primary db` (data) · `replica` (data) ·
  `status page` (edge, note: "hosted on the thing it reports on"). Edges from every tier to `config`, and
  from `status page` to `primary db` — the crossing edges *are* the teaching, and they are what the
  reference's LB diagram cannot show.
- **Second: none.** The S3 timeline is prose + a table inside `example`; a `sequence` would restate it.
  `diagram: architecture only, because the second figure would restate the worked example's timeline.`

### Owns / defers
Owns: the SPOF definition and its three conditions, where SPOFs hide, how to find them, redundancy patterns,
failure-domain isolation, the redundancy cost argument. Defers: availability arithmetic → `[[availability]]`;
correctness under fault → `[[reliability]]`; LB algorithms → `[[load-balancers|load balancers]]`; circuit
breakers/bulkheads → ch. 13; split brain and heartbeats → ch. 14; observability → ch. 19.

### Sources (all fetched)
1. AWS — *Summary of the Amazon S3 Service Disruption in the Northern Virginia (US-EAST-1) Region*: <https://aws.amazon.com/message/41926/>
2. Meta Engineering — *More details about the October 4 outage*: <https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/>
3. Kleppmann — *Concurrent and Distributed Systems*, Cambridge (the SPOF definition): <https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf>
4. AWS Well-Architected, Reliability Pillar — *Availability* (redundancy arithmetic): <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html>

---

## Latency vs Throughput vs Bandwidth — `latency-vs-throughput`

- **archetype**: **distinction**, exactly as the orchestrator's prior says. The page's teaching *is* the axis
  separating three quantities that candidates conflate; the reference's own spine is three definitions plus a
  summary comparison table across four dimensions.
  → required: `definition`, `techniques` + its `comparison`, `tradeoffs`, `interviewAngle`, `resources`.
  **`implementation` is discouraged** by the linter for this archetype — omit it. `example` is optional and
  **justified here**, because the fan-out arithmetic is what makes the axis land.
- **reference**: <https://algomaster.io/learn/system-design/latency-vs-throughput> — *Latency vs Throughput
  vs Bandwidth · The Highway Analogy · Latency · Components of Latency · Measuring Latency · What Affects
  Latency? · Reducing Latency · Throughput · Throughput vs Bandwidth · Calculating Throughput · What Limits
  Throughput? · Improving Throughput · Bandwidth · Types of Bandwidth · Bandwidth-Delay Product · Summary ·
  Quiz* — **6 min read, ~2,400–2,600 words**. Six tables. Covers percentiles (p50/p95/p99/p99.9), BDP, and
  states `concurrency = throughput × latency` in its summary.
- **delta / missing**:
  - *The four components of latency* — propagation, transmission, processing, queuing → **cover here**, in
    one paragraph. It is the reason "add a cache" is not always the answer.
  - *Percentiles* → **cover here — this page owns tail latency.**
  - *Bandwidth as distinct from throughput* → **cover here.** It is a third of the title.
  - *Bandwidth-delay product* → **cover here in one clause with its formula**; the transport-level treatment
    belongs to `[[tcp-vs-udp|TCP vs UDP]]` (ch. 03).
  - *Reducing latency / improving throughput* (two of the reference's tables) → **compress to one row each
    in our comparison table** and defer the techniques: `[[what-is-caching|caching]]`,
    `[[content-delivery-network-cdn|CDNs]]`, `[[load-balancers|load balancers]]`,
    `[[message-queues|queues]]`. **Do not build a techniques catalogue here** — that is four other chapters.
  - *The highway analogy* → **drop.** Ours earns the same result with the fan-out arithmetic, and an analogy
    is not evidence.
- **delta / extraneous**:
  - **Little's Law stated formally** — the reference states the relation in its summary but not the law.
    **Justification 1**: named and sourced, it is the one-line answer to "how do latency and throughput
    relate", which is the interview question this page exists for.
  - **The tail-at-scale fan-out arithmetic** — no counterpart. **Justification 1**: it is the measured
    reason p99 matters, and it is the strongest single fact on the page.
- **delta / shared**: *percentiles* → **ours is better because we source the amplification** rather than
  asserting "p99 matters". *the three-way summary table* → **theirs is the right shape** — take its
  structure (three columns, four dimensions) and fill it with our sourced rows.
- **scope line**: Covers what each of latency, throughput and bandwidth measures, why improving one need not
  improve another, how latency is quoted (percentiles) and why the tail dominates at scale. Does **not**
  cover any technique for improving them — caching (`[[what-is-caching|caching]]`), CDNs
  (`[[content-delivery-network-cdn|CDNs]]`), load balancing (`[[load-balancers|load balancers]]`),
  queues (`[[message-queues|message queues]]`) — nor transport-level mechanics
  (`[[tcp-vs-udp|TCP vs UDP]]`), nor SLO targets (`[[availability]]`).
- **tier**: **Core.** Short reference, tight scope, and a distinction page's required set is small. Resist
  padding.
- **length note**: **1,000–1,200 words** — the shortest page in the chapter, deliberately. Spend them on
  the **tail-latency amplification arithmetic**. Must **not** re-explain: caching, CDNs, load balancing,
  TCP, or SLOs.
- **priority**: `high` · **estimatedMinutes**: `18` · **tags**: `["networking", "scalability", "backend"]` · **parent**: `scalability`.

### Cost model
Three different questions about the same system: **latency** is how long one request takes, **throughput**
is how many complete per second, **bandwidth** is the ceiling throughput could theoretically reach. Buying
one often costs another — batching raises throughput and raises latency; adding parallelism raises
throughput and, past saturation, raises queuing delay, which is latency. The relation is Little's Law:
`concurrency = throughput × latency`, so you cannot move two of the three independently.

### Recognition cue
The prompt or the requirement mentions "fast" or "handles N users". Ask which: a p99 target is a latency
requirement and drives topology (regions, caching, fan-out); a QPS number is a throughput requirement and
drives capacity. A candidate who answers a QPS question with a caching strategy has confused the two.

### Variants — the axis is *what the number tells you*
| | Latency | Throughput | Bandwidth |
| --- | --- | --- | --- |
| Measures | time for one request | completed work per unit time | maximum possible rate |
| Unit | ms, quoted at a percentile | requests/s, bytes/s | bits/s |
| Improved by | shorter path, less work per request | more parallelism, more capacity | a bigger pipe |
| Does **not** buy you | more capacity | a faster single request | actual throughput |
| Where it bites | user-perceived responsiveness | peak-hour saturation | large transfers, replication |

Also name the **four components of latency** — propagation (distance ÷ speed of light), transmission
(bytes ÷ bandwidth), processing, queuing — because they say which fix applies. And **BDP** =
bandwidth × RTT, the in-flight bytes needed to keep a fat, long link busy.

### Tradeoffs
1. **Batching buys throughput with latency**, and the exchange rate is the batch window. Bites on
   write-heavy pipelines with an interactive read path on the same store.
2. **Averages hide the failure.** The SRE Book's Figure 4-1: a service with ~50 ms typical latency where
   "5% of requests are 20 times slower" (<https://sre.google/sre-book/service-level-objectives/>). Bites the
   moment "average latency 100 ms" is offered as a target. **Do not attribute the 20× to the p99** — the
   book attributes it to the slowest 5%.
3. **Tail latency compounds under fan-out** — see the figures. Bites in any design where one user request
   touches many services, which is most of them.
4. **Throughput past saturation costs latency non-linearly.** Queuing delay is where the two meet.

### Figures — the `numbers` figure, all from Dean & Barroso
| Quantity | Value | Source / derivation |
| --- | --- | --- |
| Server typical 10 ms, p99 = 1 s; request touches **1** server | 1 in 100 requests is slow | Dean & Barroso, *The Tail at Scale* — <https://www.barroso.org/publications/TheTailAtScale.pdf> |
| Same server, request fans out to **100** in parallel | **63%** of user requests exceed 1 s | paper's own figure; derivation: 1 − 0.99¹⁰⁰ = 1 − 0.366 |
| 1-in-10,000 slow at the single server, **2,000**-server fan-out | "almost one in five" | paper; derivation: 1 − 0.9999²⁰⁰⁰ = 1 − 0.819 ≈ 0.18 |
| Real Google service: p99 for a **single random leaf** request, measured at the root | **10 ms** | paper, Table 1 |
| p99 for **95%** of the requests finishing | **70 ms** | paper, Table 1 |
| p99 for **all** requests finishing | **140 ms** | paper, Table 1 — so waiting for the slowest 5% is *half* the total p99 |
| BigTable benchmark: 1,000 keys across 100 servers, hedged request after 10 ms | p99.9 falls **1,800 ms → 74 ms**, at **2%** more requests | paper |
| Little's Law | `L = λW` — concurrency = throughput × latency | Little 1961, *Operations Research* 9(3):383–387 — <https://en.wikipedia.org/wiki/Little%27s_law> |

The paper's own list of variability causes is worth two clauses: shared resources, background daemons,
queueing, and maintenance activity — i.e. the tail is usually *interference*, not the request.

### Failure modes
- Quoting a mean. It is the number least like anyone's experience.
- Quoting p99 over the wrong window, or aggregating percentiles by averaging them (you can't).
- Measuring latency server-side only — the client's view includes DNS, TLS and the last mile.
- Assuming more replicas lowers latency. They raise throughput; they lower latency only if they shorten the
  path (geography) or shorten the queue.

### Interview angle
> *"You want p99 under 200 ms and your request fans out to 20 services. Is that achievable?"*

The depth answer does the amplification arithmetic out loud — if each dependency has a p99 of 200 ms, the
composed p99 is far worse, and the fix is not "make each service faster" but **hedged requests**, tighter
timeouts with fallbacks, or reducing fan-out. Quoting the BigTable hedging result (1,800 ms → 74 ms for 2%
extra load) is the single strongest depth signal available on this page.

> *"What's the difference between throughput and bandwidth?"*

Short, precise answer: bandwidth is the ceiling, throughput is what you actually achieve, and the gap is
protocol overhead, queuing and the slowest hop. Add BDP if the prompt involves replication over a WAN.

### Worked example
The fan-out arithmetic above, applied to one concrete request: a product page assembled from 20 services,
each with a 50 ms p99. Show the composed distribution informally (1 − 0.99²⁰ ≈ 18% of pages hit at least one
slow dependency), then the three fixes and what each costs. **Label the 20-service fan-out and the 50 ms as
assumptions**; only the Dean & Barroso figures are measured.

### Diagram
- **Load-bearing: `comparison`** — the three-column, five-row table above. This *is* the distinction.
- **Second: `numbers`** — the tail-at-scale rows, with derivations. Two figures total, which is the cap.
- No `architecture`, no `sequence`: nothing on this page is about topology or ordering.

### Owns / defers
Owns: the three definitions and the axis, the four latency components, percentiles and tail amplification,
Little's Law, BDP. Defers: every latency/throughput *technique* to chs. 03–09; SLO targets to
`[[availability]]`; scaling capacity to `[[scalability]]`.

### Sources (all fetched)
1. Dean & Barroso — *The Tail at Scale*, CACM 2013: <https://www.barroso.org/publications/TheTailAtScale.pdf>
2. Google SRE Book — *Service Level Objectives* (percentiles vs averages, Figure 4-1): <https://sre.google/sre-book/service-level-objectives/>
3. Little's law (statement and 1961 citation): <https://en.wikipedia.org/wiki/Little%27s_law>
4. Amazon — *Dynamo* (SLAs specified at the 99.9th percentile; the 300 ms / 500 rps example): <https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf>

---

## Consistent Hashing — `consistent-hashing`

- **archetype**: **mechanism**. A technique you adopt, with a real cost, and the one page in the chapter that
  genuinely wants `implementation` (which the `distinction` archetype forbids).
  → required: `definition`, `whenToUse`, `techniques`, `example`, `tradeoffs`, `pitfalls`, `interviewAngle`,
  `resources`; **Full tier** adds `implementation` and `relatedStructures`.
- **reference**: <https://algomaster.io/learn/system-design/consistent-hashing> — *The Problem with Modulo
  Hashing (~800 w) · How Consistent Hashing Works (~600 w; mapping keys / adding nodes / removing nodes) ·
  Virtual Nodes (~400 w) · Replication with Consistent Hashing (~300 w) · Code Implementation (~250 w;
  binary search, O(log V)) · Operational Considerations (~900 w; stable identities, vnode count, hot keys,
  routing vs rebalancing, consistency, alternatives — with a comparison table of ring / rendezvous / jump /
  fixed partitions) · Where Consistent Hashing Works Well (~300 w) · Summary* — **13 min read, ~4,500
  words**. Longest reference page in the chapter.
- **delta / missing**:
  - *The modulo-rehashing problem* → **cover here.** It is the motivation and it is arithmetic, so it is
    cheap and load-bearing.
  - *Ring mechanics: hash space, clockwise assignment, add/remove* → **cover here.**
  - *Virtual nodes* → **cover here.**
  - *Replication with rack/zone awareness* → **cover here in two sentences** (Dynamo's preference list),
    defer depth to `[[read-replicas|replication]]` (ch. 09).
  - *Code implementation (sorted ring + binary search)* → **cover here** as `implementation`.
  - *Operational considerations* — stable identities, vnode count, hot keys, routing vs rebalancing →
    **cover here, compressed**; this is where the reference is longest and where restraint pays.
  - *Alternatives table (rendezvous / jump hash / fixed partitions)* → **cover here** as the `techniques`
    comparison. Our version cites the papers.
  - *Where it works well / when to avoid* → **cover here** as `whenToUse` + the interview angle.
- **delta / extraneous**:
  - **Named real systems with their actual parameters** — Dynamo `(N,R,W) = (3,2,2)`, Cassandra's token
    allocator, Redis Cluster's 16,384 fixed slots. The reference names system *categories* only ("cache
    systems, Dynamo-style databases, Kafka partitioning, CDNs") and no products. **Justification 1.**
  - **The "is this even worth mentioning" disagreement** — **justification 1**, and it is a *real* named
    disagreement (below), not a manufactured one.
  - **Karger et al.'s formal guarantee** (K/n) — **justification 1**; the reference asserts stability, we
    cite the bound.
- **delta / shared**: *modulo → ring → vnodes* sequencing → **theirs is better; take the sequence exactly.**
  It is the right teaching order and we should not invent another. *virtual nodes* → **ours is better if we
  ground it in Dynamo's three stated advantages** rather than asserting "better distribution".
  *alternatives table* → **ours is better because each row cites its paper.**
- **scope line**: Covers why `hash mod n` breaks when n changes, how a hash ring fixes it, what virtual nodes
  buy, the alternatives that beat the ring in specific conditions, and when to reach for any of it in a
  design. Does **not** cover partitioning strategy generally or shard-key choice (owned by
  `[[sharding|sharding]]` and `[[sharding-vs-partitioning|sharding vs partitioning]]`, ch. 09), replication
  mechanics (`[[read-replicas|read replicas]]`), load-balancing algorithms
  (`[[load-balancing-algorithms|load-balancing algorithms]]`, ch. 04), or the general case for scaling out
  (`[[scalability]]`).
- **tier**: **Full.** Highest standalone interview weight in the chapter; the one page an interviewer will
  push on for ten minutes; and it has genuine `implementation` and `relatedStructures` content.
- **length note**: **1,700–2,000 words.** Spend them on the **arithmetic of the two schemes side by side**
  and on `implementation`. Must **not** re-explain: sharding strategy, replication, load balancing, or what
  a hash function is. The reference's 900-word "operational considerations" section is where our page will
  bloat if it isn't watched — compress it to the hot-key point plus one line each on the rest.
- **priority**: `high` · **estimatedMinutes**: `35` · **tags**: `["distributed-systems", "scalability", "caching", "database"]` · **parent**: `scalability`.

### Cost model
Consistent hashing buys you **membership changes that move ~K/n keys instead of nearly all of them** — you
can add or remove a node without invalidating the whole cache or reshuffling the whole dataset. You pay in
**uneven load** (a plain ring gives lumpy ownership, which is why virtual nodes exist), in **lookup state**
(every client or router needs the ring), and in the fact that it solves *structural* imbalance only — a hot
key is still a hot key on whichever node owns it.

### Recognition cue
The design has a **fleet of interchangeable stateful nodes** — cache servers, shards, partitions — and the
fleet's size will change (autoscaling, failure, growth). If the node set is fixed, or if the datastore does
its own partitioning (DynamoDB, Cassandra, Redis Cluster), the correct answer is to name that it happens
underneath and move on. That is the cue `[[system-design-interview-framework]]` already promised: defer it
until the working set outgrows one node.

### Variants — the axis is *what changes when membership changes*
- **Ring (Karger et al.)** — keys map clockwise to the next node token. Adding a node moves only the keys in
  the arc it claims.
- **Ring + virtual nodes** — each physical node holds many tokens. Dynamo's stated advantages: a failed
  node's load disperses evenly across the survivors; a new node absorbs roughly equal amounts from many
  others; and the token count can be tuned per node to reflect heterogeneous hardware
  (<https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf>).
- **Rendezvous (HRW) hashing** — score every node for the key, take the max. No ring state; O(n) per lookup.
- **Jump consistent hash** (Lamping & Veach, Google) — ~5 lines, no storage, better balance, but *"the
  buckets must be numbered sequentially, which makes it more suitable for data storage applications than for
  distributed web caching"* — you cannot remove an arbitrary node
  (<https://arxiv.org/abs/1406.2294>).
- **Fixed partitions / slots** — hash to a large fixed number of partitions, then map partitions to nodes.
  Rebalancing moves whole partitions. This is Dynamo's "Strategy 3" (Q equally-sized partitions, Q/S tokens
  per node) and it is what Redis Cluster does.

### Tradeoffs
1. **Plain ring → uneven ownership.** With few nodes, random token placement gives arcs of very different
   sizes. Bites at small cluster sizes, which is most clusters. Mitigation: virtual nodes.
2. **Virtual nodes → more neighbours, slower maintenance.** Cassandra's docs state each token adds up to
   `2 × (RF − 1)` additional neighbours — raising the probability that some node pair's failure loses a
   quorum — and that "cluster-wide maintenance operations are often slowed"
   (<https://cassandra.apache.org/doc/stable/cassandra/architecture/dynamo.html>).
3. **Virtual nodes do not fix hot keys.** They fix *structural* imbalance (key-count skew), not *access*
   skew. One viral key lands on one token no matter how many tokens exist. Bites in every cache design with
   a Zipf head. Mitigations: replicate the hot key, salt it across k suffixes, or route it specially.
4. **The ring is state that must agree.** Every client (or router) needs the same view of membership;
   disagreement means keys served from the wrong node. This is why fixed-slot designs push the mapping
   server-side with a redirect (Redis Cluster's `MOVED`).
5. **Fixed partitions trade elasticity for predictability** — you must pick the partition count up front and
   it caps cluster size (Redis Cluster: 16,384 slots ⇒ at most 16,384 masters).

### Figures
| Quantity | Value | Source / derivation |
| --- | --- | --- |
| Keys remapped by `hash mod n` when n → n+1 | **n/(n+1)** of all keys | derivation: a key stays put iff `h mod n == h mod (n+1)`, which for uniform h happens with probability 1/(n+1). n=4 ⇒ 80% move; n=9 ⇒ 90%; n=99 ⇒ 99% |
| Keys remapped by consistent hashing when a node joins/leaves | **~K/n** on average (K keys, n nodes) | Karger et al. 1997 — <https://en.wikipedia.org/wiki/Consistent_hashing> |
| ⇒ 10 nodes, adding an 11th | **~9%** of keys move | derivation: 1/11 = 0.0909 |
| Ring lookup cost | **O(log V)** for V total tokens | binary search over the sorted token array (reference + standard implementation) |
| Dynamo's common quorum | **(N, R, W) = (3, 2, 2)**, measured on a live system of "a couple hundred nodes" | <https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf> |
| Redis Cluster | **16,384** hash slots; `HASH_SLOT = CRC16(key) mod 16384`; suggested max ~1,000 nodes | <https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/> |
| Cassandra vnode count | `2.x` used **256** tokens/node with random allocation; `3.x+`'s deterministic allocator achieves optimal balance with far fewer | <https://cassandra.apache.org/doc/stable/cassandra/architecture/dynamo.html> — see UNVERIFIED for the exact modern default |
| Jump consistent hash | ~**5 lines**, zero storage, better balance; buckets must be numbered sequentially | <https://arxiv.org/abs/1406.2294> |

### Failure modes
- **Hot key.** Not solved by the ring. Named above.
- **Unstable node identity.** Hashing on an ephemeral hostname or IP reshuffles the ring on every restart;
  hash on a persistent node id.
- **Ring disagreement between clients** during membership change → keys read from the wrong node.
- **Losing the cache anyway.** A node's departure moves only its arc, but that arc is a cold miss storm on
  the neighbour — link `[[cache-stampede|cache stampedes]]` (ch. 07).
- **Replicas on the same physical node.** With vnodes, the next N ring positions can belong to one machine;
  Dynamo's preference list skips positions to guarantee N *distinct* physical nodes.

### Interview angle
> *"Why not just `hash(key) % n`?"*

The depth answer is arithmetic, not vocabulary: going from 9 to 10 nodes moves **90%** of the keys, so a
routine scale-up empties the cache and the origin takes the full read load. Then the fix and its bound, K/n.

> *"One key is getting 40% of the traffic. Add more virtual nodes?"*

**No** — and this is the follow-up that separates candidates. Virtual nodes fix key-count skew; a hot key is
access skew and lands on exactly one token however many tokens exist. The real answers: replicate the hot
key across several nodes and load-balance reads, salt the key space (`k` suffixes, scatter-gather the
reads), or lift it into a client-side/local cache. (Practitioner consensus; the systemdr and Hello Interview
write-ups both make this exact correction — label these as prep/practitioner sources.)

> *"Should you bring consistent hashing up at all?"*

**A real disagreement, both positions attributable.** Hello Interview argues it is *overused* in interviews:
"most modern distributed systems handle sharding and data distribution for you… you typically just need to
mention that these systems use consistent hashing (or a form of it) under the hood", reserving depth for
infrastructure-from-scratch prompts
(<https://www.hellointerview.com/learn/system-design/core-concepts/consistent-hashing>). The reference course
gives it 13 minutes and a code implementation. **The page's own position** should be: name it in one clause
when you pick a managed store; go deep only when you are being asked to build the router, the cache tier or
the shard map yourself.

### Worked example — Dynamo's ring
Walk one key through Amazon's design: hash to a ring position, walk clockwise to the coordinator, replicate
to the next N−1 *distinct physical* nodes via the preference list (skipping vnode positions on the same
machine), and serve with `(N,R,W) = (3,2,2)` so a read needs 2 of 3 and a write needs 2 of 3. Then show the
membership change: one node leaves, its arcs disperse across many survivors *because* of vnodes rather than
dumping onto one neighbour. Close with the contrast: **Redis Cluster does not use a ring** — 16,384 fixed
slots, `CRC16(key) mod 16384`, resharding moves whole slots and clients follow a `MOVED` redirect. Same
problem, different point on the elasticity/predictability axis.

### Diagram
- **Load-bearing: `numbers`** — the rehash arithmetic side by side: `hash mod n` at n = 4, 9, 99 (80% / 90% /
  99% moved, each with its derivation) against consistent hashing's K/n (25% / 10% / 1%). This single table
  *is* the argument for the technique, and it is derivable rather than asserted.
- **Second: `comparison`** (in `techniques`) — rows: ring · ring+vnodes · rendezvous · jump hash · fixed
  slots; columns: *keys moved on membership change · lookup cost · state each client needs · can you remove
  an arbitrary node? · a system that uses it*.
- **`implementation`**: ~20 lines — build a sorted array of `(tokenHash, nodeId)` for each node × V virtual
  tokens; lookup = binary search for the first token ≥ `hash(key)`, wrapping to index 0. Caption it with the
  O(log V) claim. Do **not** ship production code.
- No `architecture`/`sequence`: the ring is not a tiered topology and §5 forbids the `graph` kind here.

### Owns / defers
Owns: modulo rehashing, the ring, virtual nodes, ring alternatives, hot-key mitigation, the
"is it worth mentioning" call. Defers: shard-key design and partitioning strategy → `[[sharding|sharding]]`
/ `[[sharding-vs-partitioning|sharding vs partitioning]]`; replication and quorum depth → ch. 09 and
`[[consistency-models]]`; cache stampede → `[[cache-stampede|cache stampedes]]`; load-balancing algorithms
→ ch. 04.

### Sources (all fetched)
1. DeCandia et al. — *Dynamo: Amazon's Highly Available Key-value Store*, SOSP 2007: <https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf>
2. Redis — *Redis cluster specification* (the fixed-slot counterexample): <https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/>
3. Lamping & Veach — *A Fast, Minimal Memory, Consistent Hash Algorithm*, Google: <https://arxiv.org/abs/1406.2294>
4. Apache Cassandra — *Dynamo* architecture docs (vnodes, token allocation, the neighbour cost): <https://cassandra.apache.org/doc/stable/cassandra/architecture/dynamo.html>

`resources`: Karger et al. 1997 via <https://en.wikipedia.org/wiki/Consistent_hashing> (for the K/n bound and
the list of adopting systems); Hello Interview's consistent-hashing page (**label it an interview-prep site**)
for the minority position.

---

## CAP Theorem — `cap-theorem`

- **archetype**: **distinction** — the call the orchestrator asked me to make from the reference's shape, and
  the reference's shape settles it: *what CAP really means · the common misreading · the three properties ·
  CP / AP / CA · CAP in real systems · CAP and latency · practical design guidance*. The teaching is an
  **axis** (C vs A, forced only while partitioned), not a component you adopt. `whenToUse` on a mechanism
  reading would have to say "reach for CAP when…", which is incoherent — you don't adopt a theorem.
  → required: `definition`, `techniques` + its `comparison`, `tradeoffs`, `interviewAngle`, `resources`.
  **Add `pitfalls`** — the misreadings are the page's most valuable content and are real, not
  table-filling. **Add `example`** — §2 permits it when one real system makes the axis land, and two do.
  **Omit `implementation`** (linter discourages it for this archetype) and `whenToUse`.
- **reference**: <https://algomaster.io/learn/system-design/cap-theorem> — *CAP Theorem · 1. What CAP Really
  Means · The Common Misreading · 2. The Three Properties (2.1 Consistency · 2.2 Availability · 2.3 Partition
  Tolerance) · 3. CP, AP, and CA (3.1 · 3.2 · 3.3) · 4. CAP in Real Systems · Examples · 5. CAP and Latency ·
  6. Practical Design Guidance (strong consistency where invariants live · availability where staleness is
  acceptable) · Summary · Quiz* — **10 min read, ~2,800–3,200 words**. One replication-flow figure, one
  CP/AP/CA simulation, one "real systems" table mapping *operations* to CAP choices. Covers **PACELC**.
  Names **no** specific products, and does **not** cover criticisms of CAP.
- **delta / missing**:
  - *The three properties, defined precisely* → **cover here**, and this is where we outrank them: use
    Gilbert & Lynch's actual definitions, especially availability = *"every request received by a non-failing
    node must result in a response"*, which is why "CA systems" is a category error.
  - *The common misreading ("pick 2 of 3")* → **cover here**, in `pitfalls`.
  - *CP / AP / CA* → **cover here** as the load-bearing `comparison`.
  - *CAP and latency → PACELC* → **cover here.** Ours cites Abadi.
  - *Practical design guidance (invariants vs staleness)* → **cover here in one compact paragraph**; the
    per-model detail belongs to `[[consistency-models]]` and the decision framing to
    `[[strong-vs-eventual-consistency|strong vs eventual consistency]]` (ch. 11).
  - *"CAP in real systems" per-operation table* → **cover here** — the idea that CAP is chosen *per
    operation*, not per database, is the single most useful thing on the reference page. Keep it.
- **delta / extraneous**:
  - **Named databases with their PACELC classification** — the reference deliberately names none.
    **Justification 1**: Abadi's own paper classifies them, so the claim is quotable rather than folklore.
  - **The criticisms/nuance the reference omits** — Brewer's own retraction of "2 of 3", and Spanner's
    "effectively CA". **Justification 1**, and it is what makes the page defensible under a senior
    interviewer.
  - **Redis Cluster's published partition behaviour** — **justification 1**; a real system whose behaviour
    is neither cleanly CP nor cleanly AP.
- **delta / shared**: *the three properties* → **ours is better because we source the definitions** (the
  reference paraphrases). *CP/AP/CA* → **theirs is better on restraint** — three short subsections, then
  move on; take that shape, do not write a taxonomy. *PACELC* → **ours is better; we cite Abadi and they
  summarise.**
- **scope line**: Covers what the CAP theorem actually claims, why "pick two of three" is a misreading, what
  a system must choose while partitioned, how real systems classify (including PACELC's else-branch), and
  why the choice is made per operation. Does **not** define the consistency models themselves — eventual,
  causal, read-your-writes, linearizable are owned by `[[consistency-models]]` — nor the mechanics of
  partitions (`[[network-partitions|network partitions]]`, ch. 14), nor the strong-vs-eventual *decision*
  (`[[strong-vs-eventual-consistency|strong vs eventual consistency]]`, ch. 11), nor availability targets
  (`[[availability]]` — note CAP's "availability" is a different, absolute notion; say so in one clause).
- **tier**: **Full.** Named in most mid-level interviews and a place where a shallow answer is instantly
  visible.
- **length note**: **1,500–1,800 words.** Spend them on **the misreading and its correction** — that is the
  page's whole value, and it is the thing every other resource gets wrong. Must **not** re-explain: what
  eventual consistency *is*, what a network partition *is* mechanically, how quorums work, availability
  percentages.
- **priority**: `high` · **estimatedMinutes**: `30` · **tags**: `["distributed-systems", "database", "architecture"]` · **parent**: `scalability`.

### Cost model
CAP says nothing about your system most of the time. It says that **during a partition**, a replicated system
must choose: refuse some requests to keep every reader seeing the latest write (**CP**), or answer everywhere
and accept that some answers are stale or will need reconciling (**AP**). The cost of C is availability *only
while partitioned*; the cost of A is reconciliation work you must design for in advance, because it cannot be
retrofitted after divergence.

### Recognition cue
The design has **more than one replica of the same data** and the prompt has an invariant in it — a balance
that must not go negative, a seat that must not be double-booked, a unique username. That is where CP is
being asked for. If the prompt's data is a feed, a cart, a like count or a profile, staleness is cheap and
AP is the default. (Not a `whenToUse` part — fold this into `definition`/`techniques`, since the archetype
omits it.)

### The precise claims, all quotable
- **Gilbert & Lynch (2002)** proved Brewer's conjecture. Their **availability** is absolute: *"every request
  received by a non-failing node must result in a response."* Their consistency is **atomic / linearizable**.
  Results are given for the asynchronous model and for the partially synchronous model.
  (<https://users.ece.cmu.edu/~adrian/731-sp04/readings/GL-cap.pdf>)
- **Brewer, 2012**: *"The '2 of 3' formulation was always misleading because it tended to oversimplify the
  tensions among properties."* And: *"CAP prohibits only a tiny part of the design space: perfect
  availability and consistency in the presence of partitions, which are rare."* Also: *"Operationally, the
  essence of CAP takes place during a timeout"*, and *"a partition is a time bound on communication. Failing
  to achieve consistency within the time bound implies a partition."* His ATM example bounds risk rather
  than eliminating it — withdrawals are capped during a partition and overdrafts are compensated afterwards.
  (<https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/>)
- **Abadi, 2012 — PACELC**: *"if there is a partition (P), how does the system trade off availability and
  consistency (A and C); else (E), when the system is running normally in the absence of partitions, how
  does the system trade off latency (L) and consistency (C)?"* His classifications, verbatim from the paper:
  **PA/EL** — default Dynamo, Cassandra, Riak. **PC/EC** — VoltDB/H-Store, Megastore, BigTable/HBase.
  **PA/EC** — MongoDB. **PC/EL** — PNUTS. His argument: *"CAP is only one of the two major reasons that
  modern DDBSs reduce consistency"*, and the consistency/latency tradeoff is present at all times, not only
  during partitions. (<https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf>)
- **Brewer, 2017 on Spanner**: technically CP — *"during (some) partitions, Spanner chooses C and forfeits
  A. It is technically a CP system"* — but "effectively CA" in practice, at better than five nines, because
  Google controls the network. Chubby measures **99.99958%**. And: *"There were no events in which a large
  set of clusters were partitioned from another large set of clusters."*
  (<https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45855.pdf>)

**Note for the author on §7.12:** every position above is quotable from the URL cited beside it. Do not add a
fifth position to balance a table. Brewer and Abadi *agree* that the classic framing is too coarse; they
differ on which axis it under-serves (recovery/mitigation vs latency). Say that; don't invent a fight.

### Tradeoffs (the `comparison` in `tradeoffs`)
| | **CP — refuse during partition** | **AP — answer during partition** |
| --- | --- | --- |
| What the minority side does | rejects writes (and often reads) | accepts writes locally |
| What the client sees | errors / timeouts, but never a stale committed value | an answer, possibly stale, possibly conflicting |
| Work you must do | none after recovery — state never diverged | detect divergence, merge, compensate (Brewer's three steps: detect → partition mode → recovery) |
| Where it bites | any invariant-free workload pays availability for nothing | any invariant *needs* a merge rule, and some invariants have none |
| Real example | Redis Cluster's minority side stops accepting writes after `NODE_TIMEOUT` | Dynamo is "always writeable" and pushes conflict resolution to reads |

### Figures
| Quantity | Value | Source |
| --- | --- | --- |
| Spanner incidents caused by **network** | **7.6%** of all incidents | Brewer 2017 |
| Chubby measured availability | **99.99958%** (30 s+ outages) | Brewer 2017 |
| Dynamo's tunable quorum | `(N,R,W) = (3,2,2)`; `R + W > N` gives quorum behaviour, and R and W are "usually configured to be less than N, to provide better latency" | Dynamo paper |
| Redis Cluster, N masters each with one replica: probability the majority side is still available after two nodes are partitioned away | `1 − 1/(2N−1)`; at N=5 that is a **11.11%** chance of unavailability | <https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/> |
| Redis Cluster minority-side write window | writes on the minority side may be lost up to `NODE_TIMEOUT`, after which the minority refuses writes | same |

### Failure modes / pitfalls (this page's most valuable part)
- **"Pick two of three."** You do not choose P; the network chooses it. The choice is C-or-A *and only while
  partitioned*.
- **"We're a CA system."** Under Gilbert & Lynch's definitions, CA means "not partition tolerant", which for
  anything multi-node means "undefined behaviour during a partition". Single-node systems are the only
  honest CA.
- **Labelling a whole database CP or AP.** The choice is per operation, and most stores expose knobs
  (Dynamo's R/W, Cassandra's consistency levels, MongoDB's read/write concerns). The reference makes this
  point well; keep it.
- **Confusing CAP's "availability" with an SLO.** CAP's A is absolute — *every* request to *every*
  non-failing node. 99.99% availability is a different claim entirely. Link `[[availability]]`.
- **Forgetting the else-branch.** Most of the time there is no partition, and the live tradeoff is
  consistency vs *latency* — PACELC's point, and the one that actually governs day-to-day design.

### Interview angle
> *"Is your design CP or AP?"*

The depth answer refuses the question as posed and re-asks it per operation: "the payment ledger is CP —
during a partition I'd rather return an error than double-spend; the product catalogue and the read counts
are AP — I'd serve stale data." Then it names what the AP side owes: a merge rule, and compensation for what
happened while divergent.

> *"Spanner claims consistency and high availability. Doesn't that break CAP?"*

The depth answer: no — Spanner is technically CP and forfeits availability during some partitions; its claim
is that Google's network makes those rare enough that users can treat it as CA, which Brewer calls
"effectively CA". Then the honest addition: that argument depends on owning your network and does not
transfer to a system on the public internet.

> *"What does CAP say about your system right now, with no partition?"*

**Nothing** — and saying so is the strongest signal on this page. Then PACELC's else-branch: the live
tradeoff is consistency vs latency, and it is the one that shapes most designs.

### Worked example
Two systems, contrasted on the same event. **Redis Cluster** during a partition: the minority side keeps
serving until `NODE_TIMEOUT`, may lose acknowledged writes (asynchronous replication, last-failover-wins),
then refuses writes; the majority side elects a replica and continues. **Dynamo**: always writeable — writes
are never rejected, conflicting versions are captured with vector clocks and reconciled at read time, because
"rejecting customer updates could result in a poor customer experience" for a shopping cart. Same partition,
opposite choice, and both are documented positions rather than opinions.

### Diagram
- **Load-bearing: `comparison`** — the CP/AP table above (the `tradeoffs` figure). The archetype prescribes
  this shape and it is the page's teaching.
- **Second: `sequence`** — one partition, drawn. Actors: `Client A · Replica 1 · Replica 2 · Client B`.
  Steps: A writes `x=2` to Replica 1 (ok); Replica 1 → Replica 2 replicate (**dashed, marked as lost — the
  partition**); B reads `x` from Replica 2 → **CP branch: error; AP branch: returns stale `x=1`**; after
  heal, Replica 1 → Replica 2 reconcile. This makes "the choice happens in a window, not in the
  architecture" concrete in a way prose cannot.
- Two figures total (the `tradeoffs` comparison doesn't count against the §5 budget), so this is within
  cap either way.

### Owns / defers
Owns: the theorem and its precise definitions, the misreadings, CP/AP/CA, PACELC, per-operation choice, the
Spanner "effectively CA" nuance. Defers: the named consistency models → `[[consistency-models]]`; partition
mechanics and detection → `[[network-partitions|network partitions]]` / `[[heartbeats|heartbeats]]`; the
strong-vs-eventual decision → ch. 11; conflict resolution machinery → `[[vector-clocks|vector clocks]]` /
`[[crdts|CRDTs]]` (ch. 14); availability as a percentage → `[[availability]]`.

### Sources (all fetched)
1. Gilbert & Lynch — *Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services* (the proof): <https://users.ece.cmu.edu/~adrian/731-sp04/readings/GL-cap.pdf>
2. Brewer — *CAP Twelve Years Later: How the "Rules" Have Changed*: <https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/>
3. Abadi — *Consistency Tradeoffs in Modern Distributed Database System Design* (PACELC): <https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf>
4. Brewer — *Spanner, TrueTime & The CAP Theorem*, Google 2017: <https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45855.pdf>

`resources`: the Redis cluster spec (documented partition behaviour) and the Dynamo paper.

---

## Consistency Models — `consistency-models`

- **archetype**: **distinction** — the closest call in the chapter, and the reference's own spine settles it:
  *the replication problem · the coordination cost · what consistency models define · **the consistency
  spectrum** · strong models · weak and intermediate models · client-centric models · how real systems
  expose consistency · choosing the right model*. That is a set of named things ordered along one axis, which
  is a distinction generalised past two columns, not a component walkthrough. A `mechanism` reading would
  demand `implementation` (what would it hold — a linearizability checker?) and `pitfalls` about "adopting
  consistency models".
  → required: `definition`, `techniques` + its `comparison`, `tradeoffs`, `interviewAngle`, `resources`.
  **Add `example`** (§2 permits it when a real system makes the axis land — DynamoDB and S3 both do) and
  **`whenToUse`** (there *is* a per-data-class choice, and the reference has a whole section on it — it is
  not discouraged for this archetype). **Omit `implementation`** — the linter discourages it here.
- **reference**: <https://algomaster.io/learn/system-design/consistency-models> — *Consistency Models · Why
  Consistency is Hard in Distributed Systems · The Replication Problem · The Coordination Cost · What
  Consistency Models Define · The Consistency Spectrum · Strong Consistency Models · Weak and Intermediate
  Consistency Models · Client-Centric Consistency Models · How Real Systems Expose Consistency · Choosing the
  Right Consistency Model · Summary · Quiz* — **14 min read**, and the reference flags it **High Priority**.
  **Everything from "The Consistency Spectrum" onward is behind the reference's paywall** — the headings and
  the first ~700 words were readable, the rest was not. Scope and order are therefore reliable; its per-model
  depth is not observable. Recorded as a partial fetch (see *Sources that failed*).
  Its visible intro defines a consistency model as *which histories of reads and writes the storage system is
  allowed to expose*, and name-drops linearizable reads, serializable transactions, causal consistency,
  read-your-writes, monotonic reads and eventual convergence.
- **delta / missing**:
  - *The replication problem* and *the coordination cost* → **cover here, briefly.** They are the setup.
  - *What a consistency model defines* → **cover here** — the "set of allowed histories" framing is the
    definition that makes the rest coherent, and it matches Jepsen's ("a safety property which declares what
    a system can do").
  - *The spectrum, strong → weak → client-centric* → **cover here.** This is the page.
  - *Client-centric models* (read-your-writes, monotonic reads/writes, writes-follow-reads) → **cover here.**
    They are what a candidate actually needs and the ones most often skipped.
  - *How real systems expose consistency* → **cover here** with real API surfaces.
  - *Choosing the right model* → **cover here in `whenToUse`**, briefly; the full decision framing is
    `[[strong-vs-eventual-consistency|strong vs eventual consistency]]` (ch. 11).
  - Transaction isolation levels (serializable, snapshot isolation, read committed) — the reference's
    coverage is unobservable past the paywall. **Name the two families and their relationship in one
    paragraph** (single-object consistency vs multi-object isolation, which is the confusion Jepsen's map
    exists to dispel) and **defer isolation depth to `[[acid-transactions|ACID transactions]]` (ch. 08)**.
- **delta / extraneous**:
  - **Jepsen's availability classification** (unavailable / sticky available / totally available) —
    **justification 1**. It is the sourced bridge between this page and `[[cap-theorem]]`, and it turns the
    spectrum from a list into an ordering with a consequence.
  - **Real API surfaces with prices attached** (DynamoDB's `ConsistentRead`, S3's strong read-after-write)
    — **justification 1**.
- **delta / shared**: *the spectrum* → **theirs is the right sequence** (strong → weak → client-centric);
  take it. *why consistency is hard* → **theirs is better on restraint** — two paragraphs, not five; ours
  should be shorter still because `[[cap-theorem]]` already set up partitions.
- **scope line**: Covers what a consistency model is, the named models from linearizable down to eventual,
  what each forbids, which ones survive a partition, and how real stores expose the choice. Does **not**
  cover the CAP theorem or PACELC (owned by `[[cap-theorem]]`), transaction isolation levels in depth
  (owned by `[[acid-transactions|ACID transactions]]`), conflict-resolution machinery (owned by
  `[[vector-clocks|vector clocks]]` and `[[crdts|CRDTs]]`), the strong-vs-eventual *decision procedure*
  (owned by `[[strong-vs-eventual-consistency|strong vs eventual consistency]]`), or replication mechanics
  (owned by `[[read-replicas|read replicas]]`).
- **tier**: **Full.** The reference marks it high priority, it is 14 minutes, and "what consistency do you
  need here?" is a standard senior follow-up.
- **length note**: **1,600–1,900 words.** Spend them on the **comparison table** — one row per model, and
  the columns doing real work (what it forbids / does it survive a partition / who offers it). Must **not**
  re-explain: CAP, partitions, quorums, replication topology, or isolation levels.
- **priority**: `high` · **estimatedMinutes**: `30` · **tags**: `["distributed-systems", "database", "storage"]` · **parent**: `scalability`.

### Cost model
A consistency model is a **contract about which orderings of reads and writes a system may expose** — it is
a *safety property*, in Jepsen's phrasing: it says what the system may not do. Stronger models forbid more
anomalies and cost more coordination: round trips, and unavailability whenever the nodes that must agree
cannot reach each other. Weaker models are cheaper and stay up, and charge you in application code that must
tolerate — or reconcile — the anomalies they permit.

### Recognition cue
The design has replicas *and* a read path that could hit a different replica than the write did. Then ask,
per data class: would a user notice, and would it be *wrong*? "My own comment doesn't appear after I post it"
is a read-your-writes violation and users notice immediately; "the like count is 3 seconds stale" is
eventual consistency and nobody notices.

### Variants — the axis is *what the model forbids*, and Jepsen orders them
The load-bearing `comparison`. Rows, in the reference's order (strong → weak → client-centric):

| Model | Forbids | Survives a partition? (Jepsen) | Where you meet it |
| --- | --- | --- | --- |
| **Strict serializable** | any history not equivalent to a real-time serial order | **unavailable** | Spanner, FoundationDB |
| **Linearizable** | reading a value older than the last completed write, on a single object | **unavailable** | etcd/ZooKeeper reads with quorum; DynamoDB `ConsistentRead` on a table |
| **Sequential** | disagreement between processes about *some* single order | **unavailable** | |
| **Causal** | seeing an effect before its cause | **sticky available** | MongoDB causally-consistent sessions |
| **PRAM / read-your-writes / monotonic reads / monotonic writes** | a client seeing its own history go backwards | **sticky available** | session guarantees in most managed stores |
| **Eventual** | nothing, except permanent divergence | **totally available** in practice | DynamoDB default reads, S3 bucket configs, DNS |

Jepsen's classification (which models are impossible to make totally available in an asynchronous network,
which are only *sticky* available, and which are totally available) is at
<https://jepsen.io/consistency/models>. Note in one clause that **snapshot isolation and repeatable read
are incomparable** — each permits phenomena the other forbids — and that the multi-object (isolation) family
is a different axis from the single-object (consistency) one; that is precisely why the map exists.

### Tradeoffs
1. **Linearizable reads cost a round trip to a quorum or the leader**, which is why they are slower, and why
   under geo-replication they are much slower. Abadi's whole PACELC argument is that this cost is present
   *all the time*, not only during partitions — link `[[cap-theorem]]`.
2. **They cost money too, not just latency.** AWS documents that DynamoDB eventually consistent reads are
   **half the cost** of strongly consistent ones, and that strongly consistent reads are **not supported at
   all** on global secondary indexes or streams
   (<https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html>).
   Bites when a design assumes it can just turn strong consistency on.
3. **Sticky availability is a real constraint, not a footnote.** Causal and session guarantees survive a
   partition only if the client keeps talking to the same replica. Bites the moment a load balancer moves a
   client mid-session.
4. **Eventual consistency moves work into your application.** Someone must decide what happens when two
   replicas disagree. Last-write-wins is a decision, and usually a lossy one.
5. **Mixed models are the norm and the confusion.** S3 gives strong read-after-write for objects but
   **eventual** consistency for *bucket configurations* — AWS recommends waiting 15 minutes after enabling
   versioning before writing (<https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html>).

### Figures
| Quantity | Value | Source |
| --- | --- | --- |
| DynamoDB eventually consistent reads | **half the cost** of strongly consistent reads; the default | AWS docs, URL above |
| DynamoDB strongly consistent reads | unsupported on GSIs and streams | same |
| DynamoDB global tables, multi-Region eventual consistency | replicated to other replicas **typically within a second** | same |
| S3 objects | **strong read-after-write** for PUT and DELETE, in all Regions; updates to a single key are atomic; concurrent writers resolve **last-writer-wins** | AWS S3 docs, URL above |
| S3 bucket configurations | **eventually consistent** — wait ~15 minutes after enabling versioning | same |
| Dynamo (the paper) | "always writeable"; conflict resolution pushed to reads; **vector clocks** capture causality between versions | <https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf> |

### Failure modes
- **Read-your-writes violated by a read replica.** The classic: post a comment, get routed to a lagging
  replica, see nothing. Fix: route reads-after-write to the primary, or pin the session.
- **Monotonic reads violated by load balancing.** Refresh twice, see the value go backwards.
- **Last-write-wins silently dropping data**, with clock skew deciding which write survives.
- **Assuming "eventually" has a bound.** It usually doesn't; measure replication lag and alert on it.
- **Confusing isolation with consistency.** "Serializable" is about multi-object transactions;
  "linearizable" is about single-object recency. A store can offer one and not the other.

### Interview angle
> *"Can this read be stale? For how long?"*

The depth answer answers **per data class**, not for the system: "the ledger read is linearizable and I'll
pay the leader round trip; the timeline read is eventually consistent and I'll accept a few seconds; the
user's own post must be read-your-writes, so I'll pin that session to the primary for a short window."
Naming *read-your-writes* by name is the specific signal here — most candidates only know "strong" and
"eventual".

> *"Your users say the like count jumps around. What's happening and how do you fix it?"*

Monotonic reads violated by replica routing. Fixes, in order of cost: sticky routing, session tokens
carrying a read timestamp, or serving the counter from one authority.

> *"You've said the system is AP. What does the application now owe you?"*

A merge rule. Link `[[cap-theorem]]` and `[[vector-clocks|vector clocks]]` / `[[crdts|CRDTs]]`.

### Worked example — one shopping cart, three models
Use Dynamo's own case, then contrast with the managed API. Dynamo chose "always writeable" so a customer can
always add to their cart during a partition, which means two divergent carts and a merge at read time
(vector clocks; the union-merge means a removed item can reappear — say so, it is the famous cost). Then show
what the same choice looks like as an API surface today: DynamoDB's `ConsistentRead` flag, at twice the read
cost and unavailable on GSIs; and S3, which moved from eventual to strong read-after-write for objects but
left bucket configuration eventual. The teaching: the model is a per-operation flag with a price, not a
property of the database.

### Diagram
- **Load-bearing: `comparison`** — the model table above. Six rows, four columns, and every cell doing work.
  This is the page.
- **Second: `sequence`** — a read-your-writes violation, drawn. Actors: `Client · Primary · Replica`. Steps:
  Client → Primary `write comment` ; Primary → Replica `replicate` (dashed, delayed) ; Client → Replica
  `read comments` ; Replica → Client `(comment missing)` (dashed) ; then the fix as a note. This is the
  anomaly candidates most need to *see*.
- No `architecture`: replication topology is `[[read-replicas|read replicas]]`' subject.

### Owns / defers
Owns: what a consistency model is, the named models and their ordering, client-centric/session guarantees,
availability-under-partition per model, how real APIs expose the choice. Defers: CAP/PACELC →
`[[cap-theorem]]`; isolation levels → `[[acid-transactions|ACID transactions]]`; conflict resolution →
`[[vector-clocks|vector clocks]]` / `[[crdts|CRDTs]]`; the decision procedure →
`[[strong-vs-eventual-consistency|strong vs eventual consistency]]`; replication mechanics →
`[[read-replicas|read replicas]]`.

### Sources (all fetched)
1. Jepsen — *Consistency Models* (the hierarchy and the availability classification): <https://jepsen.io/consistency/models>
2. AWS — *DynamoDB read consistency*: <https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html>
3. AWS — *What is Amazon S3?* → *Amazon S3 data consistency model*: <https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html>
4. DeCandia et al. — *Dynamo* (eventual consistency, vector clocks, always-writeable): <https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf>

---

## Chapter-level delta (rubric §8.8) — run this before the chapter ships

1. **The reference teaches redundancy on three pages** (`availability` §6, `reliability` §6–7,
   `single-point-of-failure-spof` §4). Ours teaches it on **one** (`single-point-of-failure-spof`). Verify
   no other page grew a redundancy paragraph.
2. **The reference teaches circuit breakers on three pages.** Ours teaches it on **none** — it is ch. 13.
   Verify all three pages only name-and-link it.
3. **The reference teaches graceful degradation on three pages.** Ours: `reliability` only.
4. **The reference teaches load balancing on four pages.** Ours: none — ch. 04. Link only.
5. **The reference covers SLI/SLO/SLA nowhere in this chapter.** Ours covers it on `availability` only,
   because chapter 01 promised it there. That is a deliberate, recorded addition, not drift.
6. **`consistency-models` and `cap-theorem` will both want to define eventual consistency.** Only
   `consistency-models` may.
7. **`scalability` and `consistent-hashing` will both want to explain rehashing.** Only `consistent-hashing`
   may.
8. Run `node scripts/lintTopics.mjs --chapter scalability availability reliability single-point-of-failure-spof latency-vs-throughput consistent-hashing cap-theorem consistency-models`
   and read the cross-page repetition block — it exists for exactly the failures above.

---

## UNVERIFIED

- **Kleppmann's "avoid the term consistent hashing".** DDIA ch. 6 is widely reported to say consistent
  hashing "doesn't work very well for databases, so it is rarely used in practice" and that it is "best to
  avoid the term consistent hashing and just call it hash partitioning instead." I could **not** fetch the
  book text; I have it only from Hello Interview's paraphrase and a third-party chapter-notes blog. **Do not
  quote it as DDIA's words.** Either omit, or write it as an attributed paraphrase of Hello Interview
  (labelled a prep site) with the book linked at <https://dataintensive.net/>.
- **Cassandra's modern recommended `num_tokens`.** The docs state `2.x` used 256 with random allocation and
  that `3.x+`'s deterministic allocator achieves balance with "much lower number of tokens per physical
  node", but do **not** give the recommended figure on the page I fetched. Commonly cited as 16 — **do not
  assert it.** Write "far fewer" and cite the docs.
- **The reference's `consistency-models` page past its second section is paywalled.** Its headings and their
  order are verified; the depth and worked examples of its sections 3–5 are not. The delta above is built on
  headings only. If the auditor can reach the full page, re-run that lesson's Shared column.
- **The reference's word counts** are the fetch tool's estimates, not exact counts. The stated *reading
  times* are the reference's own and are reliable. Ratios in the Budget table are therefore approximate.
- **Stack Overflow's peak-to-average ratio.** The 2016 post gives daily totals and says they are heavily
  overprovisioned but does not publish a peak req/s. Present the per-server figure as a **daily average** and
  do not derive a peak.
- **The hot-key mitigations for consistent hashing** (replicate, salt, adaptive rebalancing) are practitioner
  consensus reported by prep/practitioner sources, not by a primary doc I fetched. Present them as standard
  practice, not as a cited claim, or source each one to the store that implements it.

## Sources that failed, and disagreements

**Fetch failures (do not cite these URLs):**
- `https://cacm.acm.org/research/the-tail-at-scale/` — **HTTP 403.** Use
  <https://www.barroso.org/publications/TheTailAtScale.pdf> (Barroso's own copy), which I did fetch and
  extract from.
- `https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/40801.pdf` — **404.**
- `https://en.wikipedia.org/wiki/Universal_Scalability_Law` — **404.** Use
  <https://www.perfdynamics.com/Manifesto/USLscalability.html> (Gunther's own site), fetched.
- `https://www.usenix.org/system/files/login/articles/login_winter18_06_gunther.pdf` — **403.**
- `https://jepsen.io/consistency` (the index) carries only framing; the models and their availability classes
  are at `https://jepsen.io/consistency/models`, which is the URL to cite.
- `https://algomaster.io/learn/system-design/consistency-models` — **partially paywalled** (see UNVERIFIED).
  All seven other reference pages fetched cleanly.

**Where sources agree (say so; do not manufacture a disagreement):**
- The Google SRE availability table and AWS's availability-targets table **agree** to rounding on every
  shared row (99.9% ≈ 8.76 h/yr vs "8 hours 45 minutes"; 99.99% ≈ 52.6 min vs "52 minutes").
- Kleppmann's lecture notes, the SRE Book and AWS **agree** on the availability formula and on the
  fault/failure/fault-tolerance vocabulary.
- Brewer (2012) and Abadi (2012) **agree** that "2 of 3" is too coarse; they differ only on which additional
  axis matters most (partition recovery vs the always-present consistency/latency tradeoff). Present that as
  complementary, not as a dispute.

**Genuine, attributable disagreement — exactly one in this chapter:**
- **Whether consistent hashing belongs in a system design interview at all.** Hello Interview argues it is
  overused and that naming it under the hood is usually enough
  (<https://www.hellointerview.com/learn/system-design/core-concepts/consistent-hashing>); the reference
  course gives it thirteen minutes and a code implementation. Both positions are quotable from their pages.
  `consistent-hashing` should state both and take its own position (name it in a clause for managed stores,
  go deep only when building the routing layer yourself).
