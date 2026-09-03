# System design lesson manifest (chapter-builder cache + checklist)

**Purpose.** The `system-design-chapter-builder` workflow's **source of truth for what a chapter contains**, and the
running **check-off list** for the System design track. It plays the same role the
[ByteByteGo problem manifest](study-guide-problem-manifest.md) plays for the algos track: the builder reads its
chapter table here instead of re-deriving the lesson list, and ticks the boxes as pages land.

**Reference curriculum:** AlgoMaster's *System Design* course — [algomaster.io/learn/system-design/course-roadmap](https://algomaster.io/learn/system-design/course-roadmap).
Scraped 2026-08-25: **21 sections / 177 lessons**. The lesson titles + slugs below are the reference's own,
captured from its roadmap sidebar, so the mapping is **high confidence** (unlike the algos manifest, where the
BBG chapter internals were paywalled and had to be recovered from memory + the web).

**Every reference lesson has a derivable URL.** The slugs in the tables below *are* the reference's own slugs,
so a lesson's reference page is `https://algomaster.io/learn/system-design/<slug>` — no lookup table. That is
what makes the **reference-fidelity check** in
[features/system-design-authoring.md](features/system-design-authoring.md) §1a mechanical: the sourcer fetches
it to set each page's scope, and the auditor re-fetches it to check the page stayed there. Where a lesson is
marked **ours, not the reference's**, the row names the reference lesson it borders instead.

**Reference is the *outline*, not the *content*.** We take the curriculum's shape — which concepts, in which
order, grouped how — and author every page original against the rubric in
[features/system-design-authoring.md](features/system-design-authoring.md), sourcing technical claims from
primary docs and the standard references (Kleppmann's *DDIA*, the Google SRE book, AWS/Google/Redis/Postgres
docs, Hello Interview). **No verbatim scraping**, same rule as the problem bank.

## What we changed from the reference

| Change | Why |
| --- | --- |
| Dropped the **Welcome** section (Course Introduction / Roadmap / Join the Community) | Site meta, not content. |
| Dropped **30 Must-Know Concepts** | A listicle index of the other 176 lessons — `/concepts` and the guide sidebar already are that index. |
| Added **The 4-step interview framework** to chapter 01 | The track's own subtitle in [curriculum.ts](../src/learn/data/curriculum.ts) promises it, and Phase 2 case studies are built on it. Authored by us; not a reference lesson. |
| **Case studies deferred to Phase 2** | The reference is concepts-only. "Design a URL shortener"-style pages need a second content model (requirements → estimation → API → high-level → deep dives); mockup already drafted at [improvements/mockups/detail-system-design.html](improvements/mockups/detail-system-design.html). |

**Net: 20 chapters, 174 lessons** (173 reference + 1 ours).

## Status

No chapters built yet. The **prerequisite code has landed** (the four new `Section` kinds, the `ConceptChapter`
curriculum form, topic-level progress, the new tags and article parts) — see
[improvements/system-design-track.md](improvements/system-design-track.md). `system-design-chapter-builder` is
unblocked.

| # | Chapter | Lessons | Built |
| --- | --- | --- | --- |
| 01 | Introduction to System Design | 2 | ☑ |
| 02 | Core Concepts | 8 | ☑ |
| 03 | Networking | 7 | ☐ |
| 04 | Load Balancing | 4 | ☑ |
| 05 | API Fundamentals | 14 | ☐ |
| 06 | Communication Patterns | 11 | ☐ |
| 07 | Caching | 11 | ☐ |
| 08 | Databases | 14 | ☐ |
| 09 | Database Scaling Techniques | 10 | ☐ |
| 10 | Storage Systems | 4 | ☐ |
| 11 | Tradeoffs | 6 | ☐ |
| 12 | Architectural Patterns | 9 | ☐ |
| 13 | Microservices Patterns | 8 | ☐ |
| 14 | Distributed System Fundamentals | 17 | ☐ |
| 15 | Distributed Transactions | 5 | ☐ |
| 16 | Data Structures for Scale | 12 | ☐ |
| 17 | Big Data Processing | 9 | ☐ |
| 18 | Deployment Patterns | 9 | ☐ |
| 19 | Observability | 8 | ☐ |
| 20 | Advanced Security | 6 | ☐ |

**Chapters 01, 02 and 04 are complete** — authored, audited page-by-page, and the chapter-level §8.8 delta
run (2026-09-03). Two of chapter 04's four reference lessons are premium-gated, so their altitude is recorded
as unmeasurable and their delta is a neighbour-derived scope check (§1a).

**§8.8 findings, applied:**

- **Chapter 02** — `cap-theorem` and `consistency-models` each stated "the call is never per system"
  independently. They choose *different objects* (a CAP letter vs a consistency model), so both pages keep
  their own question; `cap-theorem` owns the general rule and `consistency-models` now links to it.
- **Chapter 04** — the reference teaches three TLS patterns by name; our page taught all three behaviours and
  named none, so a reader could describe pass-through and bridging without recognising the words. Named now.
- **Chapter 04** — cookie-based session affinity, the commonest mechanism in practice, appeared only as an L7
  routing input and never as the affinity mechanism. `load-balancers` owns affinity, so it now says how the
  pin is carried.
- **Chapter 04** — the reference's Kubernetes section stays a deliberate drop, recorded in the brief with a
  reason: this is not a Kubernetes course, and the failure shapes are covered vendor-neutrally.

**Chapter 02 is authored and all 8 audited** (2026-08-27). All 8 pages exist, are registered, wired into
[curriculum.ts](../src/learn/data/curriculum.ts), and pass `lintTopics --chapter`, `tsc`, `eslint` and `npm test`.

All eight audited, every finding applied. Every source URL fetched, every figure re-derived by hand, the
§1a delta rebuilt independently per lesson.

**The brief is defective and should not be trusted for a re-author.** Its section list for `consistency-models`
names six headings that do not exist on the reference and misses one that does; its reading time is 1.5× the
real one; its word count for `consistent-hashing` is 2.5× the truth, and the per-lesson budget derived from it
is fiction. The reference lesson for `consistency-models` is now **premium-gated** — its body is unobtainable
live and in every Wayback snapshot — so that page's altitude is recorded as unmeasurable rather than estimated.

Ticks stay ☐ pending the chapter-level §8.8 delta, which is the only pass that can settle two open ownership
questions: whether `cap-theorem` or `consistency-models` owns the Dynamo shopping-cart narrative, and whether
the per-operation rule belongs to `cap-theorem` with the sibling pointing at it.

## Build order

Curriculum order (the table above) is the **reading** order and stays fixed — the reference sequences it
beginner → advanced and later chapters lean on earlier ones. **Build** order front-loads interview weight:

1. **02 Core Concepts** → **04 Load Balancing** → **07 Caching** → **08 Databases** → **09 Database Scaling Techniques** — the five chapters that carry most mid-level interviews, and the vocabulary every later chapter reuses.
2. **03 Networking** → **05 API Fundamentals** → **06 Communication Patterns** → **11 Tradeoffs** — the second tier, plus the `Tradeoffs` chapter, which is cheap once the pairs it compares already exist.
3. **12 Architectural Patterns** → **13 Microservices Patterns** → **14 Distributed System Fundamentals** → **15 Distributed Transactions** — senior/staff territory.
4. ~~**01 Introduction**~~ (built first instead) → **10 Storage Systems** → **16 Data Structures for Scale** → **17 Big Data** → **18 Deployment** → **19 Observability** → **20 Advanced Security** — round out. Chapter 01 lands late on purpose: the 4-step framework page is easiest to write once the concepts it points at exist.

**One chapter per run.** A chapter is a full slice — source → author every lesson → verify → audit → commit —
matching how the algos track was built.

## Column legend

- **Topic slug** — the `LearnTopic.slug`, and therefore the file name in [src/learn/data/topics/](../src/learn/data/topics/) (camelCase file, kebab-case slug) and the route at `/concepts/<slug>` and `/study-guide/system-design/topic/<slug>`. Slugs are taken from the reference so the mapping stays auditable; **rename only where noted**.
- **Seed / notes** — an existing thin topic to harvest before writing from scratch. Ten `systems`/`databases`/`web` topics already exist as ~30-line stubs; a seed row means *read it, keep what's right, rewrite to the rubric* — not *leave it alone*.
- **✓** — tick when the page is authored, audited, and committed. `◐` in the summary table = authored, checks green, audit outstanding.

---

## 01. Introduction to System Design (2)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☑ | What is system design? | `what-is-system-design` | Built 2026-08-25; re-audited to the current rubric 2026-08-30. **Ours by design**: the functional/non-functional requirement taxonomy has no counterpart lesson anywhere in the reference, and `system-design-interview-framework` depends on this page to define it (§1a case 4). Track anchor; `archetype: orientation`. |
| ☑ | The 4-step interview framework | `system-design-interview-framework` | **Ours, not the reference's** — borders [`what-is-system-design`](https://algomaster.io/learn/system-design/what-is-system-design) §"How to Approach a Design Problem", which is what §1a's delta runs against. Requirements → estimation → high-level design → deep dives. Phase 2 case studies render against this skeleton — see [the mockup](improvements/mockups/detail-system-design.html). |

## 02. Core Concepts (8)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Scalability | `scalability` | — |
| ☐ | Availability | `availability` | — |
| ☐ | Reliability | `reliability` | — |
| ☐ | Single Point of Failure (SPOF) | `single-point-of-failure-spof` | — |
| ☐ | Latency vs Throughput vs Bandwidth | `latency-vs-throughput` | — |
| ☐ | Consistent Hashing | `consistent-hashing` | — |
| ☐ | CAP Theorem | `cap-theorem` | — |
| ☐ | Consistency Models | `consistency-models` | — |

## 03. Networking (7)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | OSI Model | `osi` | — |
| ☐ | IP Address | `ip-address` | — |
| ☐ | TCP vs UDP | `tcp-vs-udp` | — |
| ☐ | HTTP/HTTPS | `http-https` | — |
| ☐ | Domain Name System (DNS) | `domain-name-system-dns` | — |
| ☐ | Checksums | `checksums` | — |
| ☐ | Proxy vs Reverse Proxy | `proxy-vs-reverse-proxy` | — |

## 04. Load Balancing (4)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☑ | What are Load Balancers? | `load-balancers` | Built + audited 2026-09-03. Chapter anchor; `archetype: mechanism`. Discharges the health-check/failover promises made by six earlier pages. |
| ☑ | Load Balancing Algorithms | `load-balancing-algorithms` | Built + audited 2026-09-03. `archetype: mechanism` — the brief's Distinction call was corrected by audit; `example` decides this, not `implementation`. |
| ☑ | DNS Load Balancing | `dns-load-balancing` | Built + audited 2026-09-03. **Reference premium-gated** — altitude unmeasurable, delta is a neighbour-derived scope check. |
| ☑ | Anycast Routing | `anycast-routing` | Built + audited 2026-09-03. **Reference premium-gated** — altitude unmeasurable. |

## 05. API Fundamentals (14)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | What is an API? | `what-is-an-api` | — |
| ☐ | Idempotency | `idempotency` | — |
| ☐ | Data Formats | `data-formats` | — |
| ☐ | API Architectural Styles | `api-architectural-styles` | — |
| ☐ | REST API Design | `rest-apis` | Keep the existing `rest-apis` (33 L stub) slug and retitle it *REST API design*; rewrite to the rubric. Reference slug is `rest-api-design` — we diverge here on purpose. |
| ☐ | GraphQL Deep Dive | `graphql` | — |
| ☐ | gRPC Deep Dive | `grpc` | — |
| ☐ | API Gateways | `api-gateways` | — |
| ☐ | Rate Limiting | `rate-limiting` | — |
| ☐ | Authentication vs Authorization | `authentication-authorization` | — |
| ☐ | Session vs Token Based Auth | `session-vs-token-auth` | — |
| ☐ | JWT | `jwt` | — |
| ☐ | OAuth / OAuth2 | `oauth-oauth2` | — |
| ☐ | Single Sign-On (SSO) | `sso` | — |

## 06. Communication Patterns (11)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Long Polling | `long-polling` | — |
| ☐ | WebSockets | `websockets` | — |
| ☐ | Server-Sent Events (SSE) | `server-sent-events` | — |
| ☐ | Webhooks | `webhooks` | — |
| ☐ | WebRTC | `webrtc` | — |
| ☐ | Sync vs Async Communication | `sync-vs-async-communication` | — |
| ☐ | Message Queues | `message-queues` | — |
| ☐ | Pub/Sub | `pub-sub` | — |
| ☐ | Change Data Capture (CDC) | `change-data-capture-cdc` | — |
| ☐ | Delivery Semantics | `delivery-semantics` | — |
| ☐ | Dead Letter Queues | `dead-letter-queues` | — |

## 07. Caching (11)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | What is Caching? | `what-is-caching` | `caching-and-cdns` (34 L stub) — harvest, then delete the old file (it spans two lessons). |
| ☐ | Cache-Aside Pattern | `cache-aside-pattern` | — |
| ☐ | Read-Through vs Write-Through | `read-through-vs-write-through-cache` | — |
| ☐ | Write-Behind Cache | `write-behind-cache` | — |
| ☐ | Caching Strategies Summary | `caching-strategies` | — |
| ☐ | Cache Eviction Policies | `cache-eviction-policies` | — |
| ☐ | Content Delivery Network (CDN) | `content-delivery-network-cdn` | `caching-and-cdns` — harvest the CDN half. |
| ☐ | Distributed Cache Architecture | `distributed-caching` | — |
| ☐ | Cache Invalidation | `cache-invalidation` | — |
| ☐ | Cache Stampede | `cache-stampede` | — |
| ☐ | Cache Warming | `cache-warming` | — |

## 08. Databases (14)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Database Types | `database-types` | `nosql-databases` — harvest the family taxonomy, then delete the old file. |
| ☐ | SQL vs NoSQL | `sql-vs-nosql` | `nosql-databases` — harvest the tradeoff half. |
| ☐ | ACID Transactions | `acid-transactions` | — |
| ☐ | Relational Databases | `relational-databases` | `relational-databases` (33 L stub) — keep slug, rewrite to Full. |
| ☐ | Document Databases | `document-databases` | `mongodb` — keep `mongodb` as the tool page; link `[[mongodb]]`. |
| ☐ | Key-Value Stores | `key-value-stores` | `redis` — keep `redis` as the tool page; link `[[redis]]`. |
| ☐ | Wide Column Databases | `wide-column-databases` | — |
| ☐ | Graph Databases | `graph-databases` | — |
| ☐ | Time Series Databases | `time-series-databases` | — |
| ☐ | Full-Text Search Engines | `full-text-search-engines` | — |
| ☐ | Vector Databases | `vector-databases` | — |
| ☐ | B-Trees and B+ Trees | `b-trees` | — |
| ☐ | LSM Trees | `lsm-trees` | — |
| ☐ | How Databases Guarantee Durability | `how-databases-guarantee-durability` | — |

## 09. Database Scaling Techniques (10)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Indexing | `database-indexing` | Keep the existing `database-indexing` (33 L stub) slug and retitle it *Indexing*; rewrite to the rubric. Reference slug is `indexing` — we diverge here on purpose. |
| ☐ | Vertical Partitioning | `vertical-partitioning` | — |
| ☐ | Query Optimization | `query-optimization` | — |
| ☐ | Read Replicas | `read-replicas` | — |
| ☐ | Denormalization | `denormalization` | — |
| ☐ | Materialized Views | `materialized-views` | — |
| ☐ | Connection Pooling | `connection-pooling` | — |
| ☐ | Sharding | `sharding` | — |
| ☐ | Sharding vs Partitioning | `sharding-vs-partitioning` | — |
| ☐ | Data Compression | `data-compression` | — |

## 10. Storage Systems (4)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Block vs File vs Object Storage | `block-vs-file-vs-object-storage` | — |
| ☐ | Object Storage | `object-storage` | — |
| ☐ | Distributed File Systems | `distributed-file-systems` | — |
| ☐ | Erasure Coding | `erasure-coding` | — |

## 11. Tradeoffs (6)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Vertical vs Horizontal Scaling | `vertical-vs-horizontal-scaling` | — |
| ☐ | Concurrency vs Parallelism | `concurrency-vs-parallelism` | — |
| ☐ | Push vs Pull Architecture | `push-vs-pull-architecture` | — |
| ☐ | Stateful vs Stateless Architecture | `stateful-vs-stateless-architecture` | — |
| ☐ | Long Polling vs WebSockets | `long-polling-vs-websockets` | — |
| ☐ | Strong vs Eventual Consistency | `strong-vs-eventual-consistency` | — |

## 12. Architectural Patterns (9)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Client-Server Architecture | `client-server-architecture` | — |
| ☐ | Monolithic Architecture | `monolithic-architecture` | — |
| ☐ | Microservices Architecture | `microservices-architecture` | — |
| ☐ | Serverless Architecture | `serverless-architecture` | — |
| ☐ | Event-Driven Architecture | `event-driven-architecture` | — |
| ☐ | Peer-to-Peer (P2P) | `peer-to-peer-p2p-architecture` | — |
| ☐ | Hexagonal Architecture | `hexagonal-architecture` | — |
| ☐ | CQRS | `cqrs` | — |
| ☐ | Event Sourcing | `event-sourcing` | — |

## 13. Microservices Patterns (8)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Service Discovery | `service-discovery` | — |
| ☐ | API Gateway Pattern | `api-gateway-pattern` | — |
| ☐ | Backend for Frontend (BFF) | `backend-for-frontend` | — |
| ☐ | Sidecar Pattern | `sidecar-pattern` | — |
| ☐ | Circuit Breaker Pattern | `circuit-breaker-pattern` | — |
| ☐ | Bulkhead Pattern | `bulkhead-pattern` | — |
| ☐ | Strangler Fig Pattern | `strangler-fig-pattern` | — |
| ☐ | Service Mesh | `service-mesh` | — |

## 14. Distributed System Fundamentals (17)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Challenges of Distribution | `challenges-of-distribution` | — |
| ☐ | Network Partitions | `network-partitions` | — |
| ☐ | Split Brain Problem | `split-brain-problem` | — |
| ☐ | Heartbeats | `heartbeats` | — |
| ☐ | Handling Failures in Distributed Systems | `handling-failures-in-distributed-systems` | — |
| ☐ | Clock Synchronization Problem | `clock-synchronization` | — |
| ☐ | Logical Clocks | `logical-clocks` | — |
| ☐ | Lamport Timestamps | `lamport-timestamps` | — |
| ☐ | Vector Clocks | `vector-clocks` | — |
| ☐ | Consensus Algorithms | `consensus-algorithms` | — |
| ☐ | Paxos Algorithm | `paxos-algorithm` | — |
| ☐ | Raft Algorithm | `raft-algorithm` | — |
| ☐ | Leader Election | `leader-election` | — |
| ☐ | Distributed Locks | `distributed-locks` | — |
| ☐ | Gossip Protocol | `gossip-protocol` | — |
| ☐ | CRDTs | `crdts` | — |
| ☐ | Operational Transformation | `operational-transformation` | — |

## 15. Distributed Transactions (5)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | The Problem with Distributed Transactions | `distributed-transactions-problems` | — |
| ☐ | Two-Phase Commit (2PC) | `two-phase-commit-protocol` | — |
| ☐ | Three-Phase Commit (3PC) | `three-phase-commit-3pc` | — |
| ☐ | SAGA Pattern | `saga-pattern` | — |
| ☐ | Outbox Pattern | `outbox-pattern` | — |

## 16. Data Structures for Scale (12)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Introduction | `data-structures-for-scale-introduction` | — |
| ☐ | Geohash | `geohash` | — |
| ☐ | Quad Trees | `quad-tree` | — |
| ☐ | R-Trees | `r-trees` | — |
| ☐ | S2 and H3 | `s2-h3` | — |
| ☐ | Bloom Filters | `bloom-filters` | — |
| ☐ | Cuckoo Filter | `cuckoo-filter` | — |
| ☐ | HyperLogLog | `hyperloglog` | — |
| ☐ | Count-Min Sketch | `count-min-sketch` | — |
| ☐ | MinHash | `minhash` | — |
| ☐ | Skip Lists | `skip-lists` | — |
| ☐ | Merkle Trees | `merkle-trees` | — |

## 17. Big Data Processing (9)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Batch vs Stream Processing | `batch-vs-stream-processing` | — |
| ☐ | MapReduce | `mapreduce` | — |
| ☐ | ETL Pipelines | `etl-pipelines` | — |
| ☐ | Data Lakes | `data-lakes` | — |
| ☐ | Data Warehousing | `data-warehousing` | — |
| ☐ | Data Lakehouse | `data-lakehouse` | — |
| ☐ | Lambda Architecture | `lambda-architecture` | — |
| ☐ | Kappa Architecture | `kappa-architecture` | — |
| ☐ | Streaming Engines | `streaming-engines` | — |

## 18. Deployment Patterns (9)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Deployment Strategies Overview | `deployment-strategies-overview` | — |
| ☐ | CI/CD Pipelines | `ci-cd-pipelines` | — |
| ☐ | Rolling Deployments | `rolling-deployments` | — |
| ☐ | Blue-Green Deployments | `blue-green-deployments` | — |
| ☐ | Canary Releases | `canary-releases` | — |
| ☐ | Feature Flags | `feature-flags` | — |
| ☐ | A/B Testing Infrastructure | `ab-testing-infrastructure` | — |
| ☐ | Schema Migrations | `schema-migrations` | — |
| ☐ | Rollbacks & Immutable Infrastructure | `rollbacks-and-immutable-infrastructure` | — |

## 19. Observability (8)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | Three Pillars of Observability | `three-pillars-observability` | — |
| ☐ | Logging Best Practices | `logging` | — |
| ☐ | Log Aggregation | `log-aggregation` | — |
| ☐ | Correlation IDs | `correlation-ids` | — |
| ☐ | Metrics & Instrumentation | `metrics-instrumentation` | — |
| ☐ | Alert & Monitoring | `alert-monitoring` | — |
| ☐ | Dashboards & Runbooks | `dashboards-runbooks` | — |
| ☐ | Distributed Tracing | `distributed-tracing` | — |

## 20. Advanced Security (6)

| ✓ | Lesson | Topic slug | Seed / notes |
| --- | --- | --- | --- |
| ☐ | SSL/TLS | `ssl-tls` | — |
| ☐ | Encryption at Rest | `encryption-at-rest` | — |
| ☐ | Secrets Management | `secrets-management` | — |
| ☐ | Password Management | `password-management` | — |
| ☐ | RBAC | `rbac` | — |
| ☐ | SAML | `saml` | — |
