# 04. Load Balancing — research brief

**Status: scope + ownership complete; per-lesson sourcing marked `UNVERIFIED` where the author must fetch.**
Written in-session (2026-08-31) after three background attempts at this chapter died to machine sleep. The
reference extraction survived and is reused; the primary-source fetching per lesson is the author's job and is
flagged as such below rather than being invented here.

## Reference extraction — method and results (§1a)

Bodies were extracted from the reference's RSC payload, not from a summarising fetch: reassemble every
`self.__next_f.push([1,"…")]` chunk, JSON-unescape, locate the `NN:T<hex>,` marker, slice `int(hex,16)` **bytes**,
then `raw_decode` the leading JSON object and read its `content` field (the body is markdown inside JSON, not
bare markdown). Script and bodies: scratchpad `extract.mjs`, `<slug>.txt`.

`<title>` and `rel=canonical` were checked against the requested slug on all four — a CDN served the wrong
lesson's HTML under a requested URL earlier in this project, and that check is what catches it.

| Slug | Status | Prose words | Headings | 2× cap |
| --- | --- | --- | --- | --- |
| `load-balancers` | body obtained, identity verified | **2,129** | 24 | 4,258 |
| `load-balancing-algorithms` | body obtained, identity verified | **2,603** | 43 | 5,206 |
| `dns-load-balancing` | **premium-gated** — no `T-block` in a 137,593-char payload | unmeasurable | — | n/a |
| `anycast-routing` | **premium-gated** — same | unmeasurable | — | n/a |

Counting method: markdown `content` with fenced code and HTML comments stripped, then punctuation-split
word count. This runs ~12% above a prose-only count (an earlier pass on the same files reported 1,865 / 2,352),
so **treat these as upper bounds**. Recorded explicitly because a chapter-02 brief overstated a reference by
2.5× and the author then wrote to the budget derived from it.

The gated pair are gated in the live page *and* in both 2026-03-28 Wayback snapshots, and their `.txt` files
are 22-word stubs containing only the identity header and `NO BODY FOUND`. That is a real constraint, not a
fetch failure. **Their altitude is unmeasurable and must be reported as such** — do not estimate from a
"N min read" byline (§1a forbids it). They get a scope check against the reference ToC only.

## Chapter shape

- **anchor**: `load-balancers` (no `parent`; the other three set `parent: "load-balancers"`)
- **curriculum position**: chapter 04, after Core Concepts, before API Fundamentals
- **build order**: this is tier-1 item 2, after 02 Core Concepts

### Inbound debt — six shipped pages already promise this chapter

Verified by reading each file. This chapter is not authoring into empty space; it is discharging promises:

| Promising page | What it promises `load-balancers` delivers |
| --- | --- |
| `reliability`:119 | **health checks and failover** |
| `single-point-of-failure-spof`:63 | **when a failover fires** ("is load balancers' subject") |
| `availability`:104 | load balancers as **a mechanism that buys uptime minutes** |
| `scalability`:76 | stateless services **sit behind** load balancers (the precondition pairing) |
| `what-is-system-design`:114 | the LB **spreads requests across interchangeable, stateless app servers** |
| `latency-vs-throughput`:96 | load balancers as **parallelism and capacity** |
| `system-design-interview-framework`:243 | the LB's place in the worked URL-shortener topology |

**If `load-balancers` ships without health checks and failover, six pages have dead promises.** That is the
single highest-priority coverage requirement in this chapter.

### Ownership map

- **session affinity** → *split, deliberately*. `load-balancers` owns **what it is and what it costs**: pinning
  a client to one instance defeats the statelessness `scalability` names as the precondition for scaling the
  service tier out. `load-balancing-algorithms` owns **IP-hash and consistent-hash as routing algorithms** —
  how they distribute, what happens to the mapping when the pool changes. One clause and a link each way;
  neither page explains the other's half.
- **health checks · connection draining · timeouts · outlier ejection** → `load-balancers`. These are the
  reference's own §5/§6/§10, so they are **Shared, not Extraneous** — no §1a justification needed.
- **retry storms** → `reliability` owns the *cascade*; `load-balancers` owns **what the LB does about it**
  (draining, ejection, timeout budgets) and links. **Corrected 2026-09-03**: this brief also listed
  "retrying without budgets" under `load-balancing-algorithms`' pitfalls, which contradicted the line
  above and produced a live cross-page duplication both authors shipped. The algorithms page keeps only
  the rule-level half — a retry re-enters the same decision and can pick the same backend — and hands
  the budget here.
- **consistent hashing (the ring, virtual nodes)** → `consistent-hashing` (built, ch. 02). Both LB pages link;
  neither re-teaches.
- **the default client→edge→service→data topology diagram** → `what-is-system-design` (built). **No page in
  this chapter redraws it** — a chapter-02 page had exactly that diagram deleted for redrawing it.
- **redundancy taxonomy** (active-active, hot/warm/cold standby, failure-domain isolation) →
  `single-point-of-failure-spof`. This chapter covers *routing during* a failover, never the standby taxonomy.
- **nines arithmetic and composition** → `availability`. Never re-derived here.
- **percentiles and tail latency** → `latency-vs-throughput`. `load-balancing-algorithms` will want p99 when
  discussing least-response-time; one clause and a link.
- **statelessness itself** → `scalability` defers it to `stateful-vs-stateless-architecture` (unwritten).
  Forward-link with a display label; do not teach it here.

### Forward references (link, don't depend on)

`stateful-vs-stateless-architecture`, `api-gateways`, `service-mesh`, `content-delivery-network-cdn`,
`rate-limiting`, `tcp-vs-udp`, `domain-name-system-dns`. All must carry display labels (§6) — a bare hyphenated forward ref
renders kebab-case mid-sentence.

---

## What are Load Balancers? — `load-balancers`

- **archetype**: **mechanism** — a component you adopt. Counterfactual considered: *Orientation*, because it is
  the chapter anchor and reads as a "what is X" page. **Rejected on `whenToUse`**: there is a real adoption
  choice with a sayable trigger (more than one instance of a service, or any availability target in nines) and
  a real rejection condition (a single instance, or a client that must reach one specific node). §2 no longer
  lists "chapter anchor" as an Orientation signal precisely because chapter 02's anchor is a Mechanism page.
- **tier**: Full — `priority: "high"`, and the inbound debt demands depth.
- **priority / estimatedMinutes / tags**: `high` / 20 / `["networking", "scalability", "architecture"]`
- **length note**: budget **1,500–1,800 words**. Spend them on the request path, health checks and the failure
  modes. Do **not** spend them on the L4/L7 taxonomy — one compact table settles it.
- **cost model**: buys a tier you can add and remove machines from without the client knowing; costs you a new
  component on every request path that must not itself fail, plus the health-check configuration that decides
  what "alive" means.
- **recognition cue**: the moment there is more than one instance of anything. Wrong page when there is exactly
  one instance, or when the client must reach a *specific* node (that is service discovery, not balancing).
- **must deliver (inbound debt)**: health checks (what they probe, shallow vs deep, the failure mode of a check
  that passes while the app is broken); failover — *when* it fires and what the LB does with in-flight
  requests; connection draining on deploy.
- **variants**: L4 (transport, connection-level, fast, opaque to content) vs L7 (application, per-request,
  can route on path/header/cookie, terminates TLS). The separating axes for the table: what it can see, what
  it can route on, where TLS terminates, cost per request, what it cannot do.
- **tradeoffs**: each row must name a cost stated nowhere else plus a condition under which it bites (§2's
  row-level falsifier). Candidates: the LB is now on every request path and is itself a SPOF (link, don't
  teach); health-check interval trades detection speed against flapping; TLS termination moves the crypto cost
  and the certificate problem to one place, and makes the LB a decryption point; session affinity buys sticky
  state and costs you even distribution *and* the statelessness scaling wanted.
- **failure modes** (reference §10, all genuinely this page's): LB as bottleneck; health checks that lie in
  both directions; retry storms (defer the cascade to `[[reliability]]`); long-lived connections that never
  rebalance; uneven request cost defeating connection-count fairness.
- **worked example**: `UNVERIFIED` — the author must pick and fetch one. Strongest candidates: AWS ELB/ALB
  documentation for a real health-check and draining configuration, or Envoy's documentation for outlier
  ejection. Whatever is chosen, every figure needs a source or visible arithmetic.
- **diagram**: **`sequence`**, not `architecture`. The topology belongs to `what-is-system-design`; what this
  page owns that no sibling does is the *ordering* — client → LB → health-check state → chosen backend →
  response, with a failed check ejecting a backend mid-sequence. If the author cannot make the sequence carry
  something the prose doesn't, a `comparison` on L4/L7 is the fallback and the page still clears §7.4.
- **owns / defers**: owns health checks, draining, TLS termination, session affinity's *cost*, LB failure
  modes. Defers: the ring to `[[consistent-hashing]]`, the standby taxonomy and "is the LB a SPOF" to
  `[[single-point-of-failure-spof]]`, the retry cascade to `[[reliability]]`, statelessness to
  `[[stateful-vs-stateless-architecture]]`, algorithms to `[[load-balancing-algorithms]]`.
- **sources**: 2–4, primary-weighted. `UNVERIFIED` — author fetches and verifies each before citing. Candidates:
  AWS ELB docs, Envoy docs (health checking / outlier detection), NGINX docs, RFC 7230 for L7 semantics.

---

## Load Balancing Algorithms — `load-balancing-algorithms`

- **archetype**: ~~distinction~~ → **mechanism**. **Corrected 2026-09-03 by audit.** The argument below is
  unsound and is kept only so the error doesn't get made again: it turns on `implementation`, which §2
  lists as optional under *both* Distinction and Mechanism, so its absence cannot discriminate. The
  deciding part is `example` — §2 omits it from Distinction "unless one real system makes the axis
  land", and this page's example is 35% of its words and makes one *rung* land, not the axis. The
  shipped page carries Mechanism's Required set exactly. Superseded reasoning follows:
  The page is a set of named variants separated by an axis, which is §2's literal description of Distinction.
  The counterfactual is *Mechanism*, which is what `consistent-hashing` was judged to be. **The part that
  decides it is `implementation`**: on `consistent-hashing` there is exactly one adoptable artefact and a
  20-line ring to ship, so Mechanism held. Here there are eight algorithms and no single artefact — an
  `implementation` would have to pick one arbitrarily or ship eight. What remains is a set of points ordered
  along one axis with the axis as the teaching. **Distinction**, and note §2 now *requires* `pitfalls` for it —
  the reference's §12 "Common Mistakes" supplies five, so the part will be found rather than filled.
- **tier**: Full within Distinction's set.
- **priority / estimatedMinutes / tags**: `high` / 18 / `["networking", "scalability", "backend"]`
- **length note**: budget **1,400–1,700 words**. The reference spends 2,603 words on eight algorithms plus a
  comparison table; we cannot and should not match that breadth. **Pick the axis and let it do the work.**
- **the axis** (this is the page): *what the algorithm knows when it decides*. Round-robin knows nothing but
  position. Weighted knows static capacity. Least-connections knows current in-flight count. Least-response-
  time knows observed latency. Hash knows the key. Power-of-two-choices knows two random samples. That
  ordering — from no information to full information, and what each extra bit costs to obtain — is the
  teaching, and it is what the reference's flat list does *not* do.
- **cost model**: better distribution is bought with state the balancer must keep and trust; every bit of
  information the algorithm uses is a bit that can be stale, gamed, or expensive to collect.
- **recognition cue**: any design where backends are not interchangeable — uneven request cost, uneven backend
  capacity, or a cache whose hit rate depends on which node sees the key.
- **variants + separating axes for the `comparison`**: what it knows · state kept · what it costs to compute ·
  where it fails. Cap at 8 rows (linter). Suggested rows: round-robin, weighted round-robin,
  least-connections, least-response-time, random, power-of-two-choices, source-IP hash, consistent hash.
- **the one genuinely non-obvious result**: **power of two choices** — sampling two backends at random and
  picking the less loaded gets most of the benefit of full least-loaded knowledge at almost none of the cost.
  This is the page's best content and it has a real citation. `UNVERIFIED` — author must fetch: Mitzenmacher,
  *The Power of Two Choices in Randomized Load Balancing* (1996/2001). Do not state the
  exponential-vs-log-log improvement without the paper in `sources`.
- **pitfalls** (reference §12, all real mistakes, each with a passage on our page that fails to prevent it):
  confusing requests with work (connection count ≠ load when request cost varies); ignoring slow start (a
  cold backend handed full share); retrying without budgets; keeping dead backends in the pool; **using
  sticky routing to hide bad state management** — that last one is the honest framing of session affinity and
  it belongs here rather than on the anchor.
- **owns / defers**: owns the algorithms and the information axis, and IP-hash/consistent-hash *as routing
  algorithms*. Defers the ring and virtual nodes to `[[consistent-hashing]]`, session affinity's *cost* to
  `[[load-balancers]]`, percentiles to `[[latency-vs-throughput]]`.
- **diagram**: `comparison` on the information axis. This is the archetype's prescribed kind and it is
  load-bearing here — the axis cannot be carried in prose without listing all eight twice.
- **sources**: `UNVERIFIED`. Candidates: Mitzenmacher's paper (primary, and the one figure worth having),
  Envoy's load-balancing documentation (it implements and documents most of these), NGINX upstream docs,
  Google's Maglev paper if Maglev is mentioned at all.

---

## DNS Load Balancing — `dns-load-balancing`

**Reference body unobtainable (premium-gated). Altitude: unmeasurable. Delta: scope check against the ToC
only — and the ToC itself is all that was recoverable.**

This is an upgrade, not a loss: DNS is the one subject in this chapter where a prep site was least likely to
be authoritative, and the primaries are excellent and freely available.

- **archetype**: **mechanism**. Counterfactual: *Distinction* (DNS vs L4/L7 balancing) — rejected because the
  page's job is to teach a mechanism with a specific failure mode (TTL and cache disobedience), not to
  separate two things along an axis.
- **tier**: Core.
- **priority / estimatedMinutes / tags**: `mid` / 15 / `["networking", "scalability"]`
- **length note**: budget **1,100–1,400 words**. No reference count to calibrate against; budget from scope.
- **cost model**: buys geographic and cross-datacenter distribution with no box in the request path at all;
  costs you *control* — the decision is cached by resolvers you do not own, for a duration they may ignore.
- **recognition cue**: traffic must be split across regions or datacenters, or before a client can reach any
  load balancer at all. Wrong page when the choice is between healthy instances inside one datacenter.
- **the teaching**: DNS balances by **handing out different answers**, which means it happens *before* the
  connection exists, which means every property follows from cache behaviour. The failure mode that matters:
  **TTL is a request, not a guarantee** — resolvers, OSes and applications all cache, some ignore TTL, and a
  removed record can keep receiving traffic long after it is withdrawn. That is the load-bearing claim and it
  is why DNS is a poor failover mechanism on its own.
- **variants**: round-robin A/AAAA records; weighted records; latency-based routing; geolocation routing;
  health-checked failover records. AWS Route 53's routing policies are a well-documented instance of all five.
- **tradeoffs**: no request-path component to fail vs no per-request control; propagation delay vs zero
  infrastructure; client-side caching defeating withdrawal; no visibility into backend health without an
  explicit health-check integration.
- **pitfalls**: treating TTL as enforceable; using DNS as the *only* failover; assuming clients honour record
  order (many reorder or pick randomly); forgetting that a browser and its OS cache independently.
- **diagram**: `sequence` — resolver chain (client → OS cache → recursive resolver → authoritative), showing
  where the answer is cached and therefore where a withdrawal fails to take effect. This is the page's whole
  argument and prose cannot carry it as well.
- **owns / defers**: owns DNS-based distribution and TTL behaviour. Defers the DNS protocol itself to
  `[[domain-name-system-dns]]`, in-datacenter balancing to `[[load-balancers]]`, anycast to `[[anycast-routing]]`, CDN edge
  selection to `[[content-delivery-network-cdn]]`.
- **sources**: `UNVERIFIED`, but the primaries here are strong and the author should prefer them outright:
  **RFC 1034/1035** (DNS fundamentals, TTL semantics), **RFC 8767** (serving stale data), AWS **Route 53
  routing policies** documentation, Cloudflare's DNS load-balancing docs. Prefer RFCs for TTL semantics —
  vendor docs describe products, RFCs describe the protocol.

---

## Anycast Routing — `anycast-routing`

**Reference body unobtainable (premium-gated). Altitude: unmeasurable. Delta: scope check only.**

- **archetype**: **mechanism**. Counterfactual: *Distinction* (anycast vs unicast) — rejected on the same
  grounds as DNS: the page teaches a mechanism and its failure mode, not a separating axis.
- **tier**: Core. This is the chapter's `low` priority lesson; keep it tight and resist depth it doesn't need.
- **priority / estimatedMinutes / tags**: `low` / 12 / `["networking", "distributed-systems"]`
- **length note**: budget **900–1,200 words**. §3's floor is 10 minutes; this page should sit near it.
- **cost model**: buys the shortest network path and absorbs volumetric attacks by spreading them across
  every site advertising the prefix; costs you the ability to reason about *which* site a given client
  reaches, because BGP decides and BGP changes without telling you.
- **recognition cue**: a globally distributed service where clients should reach the nearest site without any
  application-level routing — DNS resolvers, CDN edges, DDoS absorption. Wrong page for anything inside one
  datacenter or anything requiring session continuity to a specific site.
- **the teaching**: the *same* IP prefix is advertised from many locations, and BGP routes each client to
  whichever is topologically nearest. Two consequences carry the page: **topological nearest is not
  geographically nearest**, and **a routing change can move a client mid-session** — which is why anycast is
  the default for stateless UDP (DNS) and awkward for long-lived TCP, though modern implementations largely
  handle TCP through stable per-site routing.
- **tradeoffs**: shortest path and DDoS absorption vs no control over site selection; automatic failover on
  withdrawal vs convergence time measured in BGP terms; simplicity for the client vs operational complexity
  (you need AS numbers, prefix advertisements, and peering).
- **pitfalls**: assuming geographic proximity; assuming session stickiness; expecting instant failover on
  withdrawal; using anycast for stateful services without a plan for mid-session rerouting.
- **diagram**: `architecture` is tempting and should be **resisted** — it would be a map, not a topology, and
  the tiers model does not express geography. Prefer a `comparison` (unicast vs anycast vs DNS-based
  geo-routing, on axes: who decides, when it decides, what happens on failure, what breaks) — which also
  discharges this page's boundary with `dns-load-balancing` explicitly.
- **owns / defers**: owns anycast and its BGP dependency. Defers DNS-based geo-routing to
  `[[dns-load-balancing]]`, CDN edge architecture to `[[content-delivery-network-cdn]]`, TCP/UDP differences
  to `[[tcp-vs-udp]]`.
- **sources**: `UNVERIFIED`. Candidates: **RFC 4786** (Operation of Anycast Services) — this is the primary
  and should be cited; Cloudflare's anycast documentation; AWS Global Accelerator docs. RFC 4786 is
  authoritative on the mid-session concern and should be preferred over any vendor's framing of it.

---

## Sources that failed, were gated, or need the author's attention

- `dns-load-balancing` and `anycast-routing` reference bodies: **premium-gated**, live and in both 2026-03-28
  Wayback snapshots. Recorded as unmeasurable; not retried.
- Every `sources` list in this brief is marked `UNVERIFIED`. This brief was written in-session under
  interruption pressure and did **not** fetch the primary sources per lesson. **Authors must fetch every URL
  they cite and verify the claim is quotable from it** (§1, §7.12). A brief that hands over an unfetched URL
  is exactly the failure mode that produced a manufactured disagreement in chapter 02 — treat these as
  candidates to verify, never as citations to copy.
- The reference's `load-balancers` §11 covers Kubernetes, service mesh and "AI systems". The manifest has
  `service-mesh` in a later chapter; Kubernetes has no lesson anywhere in the manifest. Recorded as a
  **deliberate drop** — this track is not a Kubernetes course, and the failure *shapes* are covered
  vendor-neutrally by the rest of the page.
