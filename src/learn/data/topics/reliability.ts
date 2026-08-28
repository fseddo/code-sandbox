import type { LearnTopic } from "@/learn/data/topic";

export const reliability = {
  slug: "reliability",
  title: "Reliability",
  category: "systems",
  archetype: "mechanism",
  parent: "scalability",
  summary:
    "Availability asks whether the system answered; reliability asks whether the answer was right — and the machinery that keeps it right only ever runs when something is already broken.",
  tags: ["distributed-systems", "architecture", "observability"],
  priority: "mid",
  estimatedMinutes: 15,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "**Reliability** is a system continuing to produce the *right* answer over time, including while parts " +
          "of it are broken. " +
          "Kleppmann's Cambridge notes supply the vocabulary it rests on. A **fault** is some part of the " +
          "system not working; a **failure** is the system as a whole not working. **Fault tolerance** is the " +
          "whole continuing to work despite faults, up to some maximum number of them.\n\n" +
          "The one-line contrast with its neighbour: [[availability]] asks *did it answer*, reliability asks " +
          "*was the answer right*. A payment API that responds to every request and occasionally charges twice " +
          "scores perfectly on the first question and fails the second, and no uptime graph anywhere will show it.",
      },
      {
        kind: "prose",
        body:
          "You buy it with redundancy *plus* the correctness machinery that makes redundancy safe — idempotency " +
          "keys, retry policies, reconciliation jobs, degradation paths. That is the cost, and it is a peculiar " +
          "one: each of those runs only when something has already gone wrong, so it is simultaneously the " +
          "least-exercised code you own and the code you are relying on at the worst moment.\n\n" +
          "The nines arithmetic, SLOs and error budgets belong to [[availability]]; the redundancy patterns " +
          "that produce them belong to [[single-point-of-failure-spof|single points of failure]]. This page " +
          "is about staying correct.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for this vocabulary the moment a prompt's subject is something that must not be *wrong*: money, " +
          "inventory counts, message delivery, *exactly once*, *must never double-charge*. An uptime target is the " +
          "wrong instrument there, because a wrong answer returned quickly is scored as a success.\n\n" +
          "The second cue is structural rather than semantic — **any design with a retry in it**. A retry is a " +
          "duplicate request that the caller believes is the same request, and that belief is true only if " +
          "somebody made it true.\n\n" +
          "State the correctness requirement out loud before you draw boxes, the way you'd state a percentile " +
          "target ([[latency-vs-throughput|latency vs throughput]]).",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "Four properties that get used as synonyms",
        body:
          "Four words get swapped for one another in design discussions and they promise different things. " +
          "**Fault tolerance** is the mechanism under reliability and availability both — continuing to serve " +
          "with some parts broken. **Durability** is the narrower promise that acknowledged data survives.\n\n" +
          "They come apart in both directions. A system can be up and wrong (a stale read, served fast), or " +
          "down and perfectly correct (a database that refuses writes rather than accept ones it cannot " +
          "commit).\n\n" +
          "Two ratios do the measuring, and they are worth being able to compute. **MTBF** (mean time between " +
          "failures) is operating time ÷ number of failures; **MTTR** (mean time to recover) is total downtime " +
          "÷ number of failures. MTTR is the one people underestimate, because it covers detection, diagnosis, " +
          "repair *and* verification — which is also why it is usually the cheaper half to attack.",
      },
      {
        kind: "comparison",
        caption: "The same four properties by the instrument that would catch a breach, and by where each one is the number that gets quoted.",
        columns: ["", "How it is measured", "Where it is the headline number"],
        rows: [
          {
            label: "Reliability",
            cells: [
              "Error rate on *outcomes*, plus MTBF and MTTR; correctness checks such as reconciliation",
              "Payment, ledger and order systems",
            ],
          },
          {
            label: "Availability",
            cells: [
              "Uptime or request success over a window, against a target — [[availability]] owns the arithmetic",
              "Anything with a published SLA",
            ],
          },
          {
            label: "Fault tolerance",
            cells: [
              "The number and kind of simultaneous faults survived: one node, one rack, one availability zone — and nothing at all to a user, since a masked fault is invisible by construction, which is why only a test confirms it",
              "Quorum databases; also every design that removes a [[single-point-of-failure-spof|single point of failure]]",
            ],
          },
          {
            label: "Durability",
            cells: [
              "Annual probability of object loss; replica count and how far apart the replicas are",
              "Object storage and write-ahead logs",
            ],
          },
        ],
      },
      {
        kind: "prose",
        heading: "What you actually build",
        body:
          "**Graceful degradation** sheds an optional feature to keep the core path alive: serve trending items " +
          "when the recommender is down, and still take the checkout. **Idempotent operations** make a retry " +
          "safe — a second request carrying the same key is recognised, and the stored result returned rather than " +
          "the work executed again " +
          "([[idempotency|idempotency]] goes deeper). **Replication** stops one bad node from being the only " +
          "answer. **Failure injection**, or chaos testing, runs the recovery path on purpose so that an " +
          "incident is not its first execution.\n\n" +
          "Named here, taught elsewhere: [[circuit-breaker-pattern|circuit breakers]] and " +
          "[[bulkhead-pattern|bulkheads]] keep one sick dependency from becoming everyone's problem, backoff " +
          "belongs to [[handling-failures-in-distributed-systems|failure handling]], health checks and failover " +
          "to [[load-balancers|load balancers]]. None of it is verifiable unless " +
          "[[three-pillars-observability|observability]] is watching outcomes and not only status codes.",
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "What actually breaks: Spanner's own incident log",
        body:
          "Ask what makes systems unreliable and the intuitive answer is hardware. Google's own measurement " +
          "disagrees. In *Spanner, TrueTime & The CAP Theorem* (2017), Brewer publishes the internal breakdown " +
          "of Spanner incident causes — weighted by frequency rather than by impact, and counting any " +
          "unexpected event, not only outages.",
      },
      {
        kind: "numbers",
        caption: "Spanner incidents by cause, Brewer 2017.",
        rows: [
          {
            quantity: "User",
            value: "52.5%",
            derivation:
              "Brewer's pie chart of internal Spanner incidents. The largest slice is error by the teams building on Spanner, not by Spanner.",
          },
          {
            quantity: "Bug",
            value: "13.3%",
            derivation:
              "Same chart. Brewer records that the two biggest outages were both software bugs affecting every replica of a database at the same time.",
          },
          {
            quantity: "Cluster",
            value: "12.1%",
            derivation: "Same chart: non-network infrastructure problems, servers and power among them.",
          },
          { quantity: "Other", value: "10.9%", derivation: "Same chart; a grab bag, most of it occurring only once." },
          {
            quantity: "Network",
            value: "7.6%",
            derivation: "Same chart. Bugs beat the network by 1.75× on frequency (13.3 ÷ 7.6).",
          },
          { quantity: "Operator", value: "3.7%", derivation: "Same chart — Google's own operators, the smallest slice." },
        ],
      },
      {
        kind: "prose",
        body:
          "Read the top and bottom rows together. In one of the most carefully engineered distributed databases " +
          "ever built, the causes another replica cannot fix dominate the ones it can. That is the argument for " +
          "spending your reliability budget on containing a wrong answer rather than on preventing every fault.",
      },
      {
        kind: "prose",
        heading: "One timed-out payment write",
        body:
          "A client posts a charge, the API forwards it to the payment service, and the payment service appends " +
          "to the ledger. The commit succeeds; the response is lost on the way back. The client sees a timeout, " +
          "which tells it nothing about whether the money moved. Treat the setup as an assumption, not a " +
          "measured system.\n\n" +
          "Three things the client can do. **Give up** is right whenever the write failed and wrong whenever it " +
          "landed — the customer is billed for an order that shows as failed. **Retry blind** is fine if the " +
          "append is naturally idempotent and a double charge if it is not. **Retry with an idempotency key**, " +
          "minted before the first attempt, lets the ledger store the key beside the row and replay the original " +
          "result when it sees it again. The key must belong to the request, not to the attempt: one generated " +
          "inside the retry loop changes every time and buys nothing.\n\n" +
          "Now the harder case — the ledger is *down* rather than slow. Rejecting the charge protects " +
          "correctness and costs conversion. Accepting it onto a durable queue and settling later protects " +
          "revenue and moves the correctness risk into the reconciler, which nobody exercises on a good day. " +
          "Either is defensible; picking one without naming the requirement it protects is not.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What it costs", "When it bites"],
        rows: [
          {
            label: "Retries",
            cells: [
              "Every retry is a bet that the operation is idempotent — [[idempotency|collecting on that bet]] has the mechanics",
              "Payment, order and messaging paths — precisely where a duplicate is expensive",
            ],
          },
          {
            label: "Graceful degradation",
            cells: [
              "A product decision in engineering clothes: someone has to agree that trending items instead of personalised ones is an acceptable answer, not a broken one",
              "When the fallback ships quietly and nobody owns whether the degraded output is acceptable",
            ],
          },
          {
            label: "The machinery itself",
            cells: [
              "It executes only during incidents, so deliberate injection is the only way to test it — and injection's price is blast radius in production",
              "At the first real failover, which is also its first execution",
            ],
          },
          {
            label: "Hardening vs faster recovery",
            cells: [
              "AWS estimates availability as MTBF ÷ (MTBF + MTTR), and that formula is symmetric. Take a 30-day MTBF and a 4 h recovery, both chosen for the arithmetic: halving recovery to 2 h gives 720 ÷ 722; doubling MTBF to 60 days at 4 h gives 1,440 ÷ 1,444. Both land on 99.72%",
              "When a quarter goes into making a component fail half as often, and automating its failover would have bought the same number for far less",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "One through-line runs under all four rows: the bill is paid in code and process a healthy system " +
          "never executes. That is what makes this work easy to defer and expensive to have deferred — the " +
          "invoice arrives mid-incident, which is a poor moment to learn that the fallback path has a typo in it.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Retry storms.** A dependency that is slow *because* it is overloaded gets hit harder the sicker it becomes, since every caller is now retrying. The *Principles of Chaos Engineering* lists this among the systemic weaknesses worth hunting deliberately; backoff with jitter and a cap on attempts is the floor, and [[handling-failures-in-distributed-systems|failure handling]] has the rest.",
          "**Silent corruption.** Every request returns 200 while the data quietly drifts. No uptime metric can see this — only something that recomputes the answer can: a reconciliation job, a checksum sweep, a shadow read compared against the live one.",
          "**A degraded mode with no switch.** If the only way in is a real outage, you can neither rehearse it nor leave it early. Make it a flag somebody can flip on a Tuesday afternoon.",
          "**Treating replication as protection from bugs.** A replica faithfully applies the write it is handed, including the wrong one, and it does so at full speed. Redundancy answers crashes, not incorrect logic.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "*Your service is 99.99% available — is it reliable?* Say the two are independent axes, then name the instrument that separates them: an SLI computed from reconciled outcomes, not one computed from status codes. Hand the uptime half of the question to [[availability]] and keep the correctness half.",
          "*How do you know your failover works?* You don't, until it has run. Give the *Principles of Chaos Engineering* framing — define steady state as a measurable output, hypothesise it holds, vary real-world events against it, and keep the blast radius small — then say when you would schedule the first one.",
          "*What makes systems unreliable in practice?* Bring the Spanner numbers. More than half of the incidents were user error and software bugs caused nearly twice as many as the network, which moves the discussion from spare hardware to change management — a more senior place for it to be.",
          "Keep the three terms straight under pressure. *This fault does not become a failure, because a quorum of two survives it* is a sentence with content; *it's fault tolerant* is not.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "Principles of Chaos Engineering", url: "https://principlesofchaos.org/", type: "article" },
          {
            label: "Google SRE Book — Testing for Reliability",
            url: "https://sre.google/sre-book/testing-reliability/",
            type: "doc",
          },
          {
            label: "Google SRE Book — Addressing Cascading Failures (graceful degradation and load shedding)",
            url: "https://sre.google/sre-book/addressing-cascading-failures/",
            type: "article",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "Kleppmann — Concurrent and Distributed Systems, Cambridge lecture notes (fault, failure, fault tolerance)",
      url: "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf",
    },
    {
      label: "Brewer — Spanner, TrueTime & The CAP Theorem, Google 2017 (incident causes)",
      url: "https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45855.pdf",
    },
    {
      label: "AWS Well-Architected, Reliability Pillar — Availability (MTBF / MTTR)",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html",
    },
  ],
} satisfies LearnTopic;
