import type { LearnTopic } from "@/learn/data/topic";

export const scalability = {
  slug: "scalability",
  title: "Scalability",
  category: "systems",
  archetype: "mechanism",
  summary:
    "Meeting more load by adding capacity rather than rewriting — what the claim actually asserts, the two dimensions capacity comes in, and why the tenth machine returns less than the second.",
  tags: ["scalability", "architecture", "distributed-systems"],
  priority: "high",
  estimatedMinutes: 20,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "**Scalability** is the property that more load can be met by adding capacity rather than by " +
          "redesigning, at a cost that grows no faster than the load it absorbs. The payoff is optionality: a " +
          "traffic forecast becomes a purchasing decision instead of a rewrite.\n\n" +
          "You pay for it in **coordination**. Once capacity is more than one machine, a request may need state " +
          "that lives somewhere else, and that hop is latency, a new failure surface, and a consistency question " +
          "you previously did not have to answer.",
      },
      {
        kind: "prose",
        body:
          "A claim of scalability is a claim about a *curve*, so it means nothing until both axes are named: the " +
          "load quantity that grows, and the resource cost that answers it.\n\n" +
          "*Doubling read traffic costs one more replica and no code change; doubling writes costs a resharding* " +
          "names both, and someone can check it — including where the curve ends, because every design scales " +
          "**from here to there** and then stops.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "The cue is a prompt that names a growth number instead of a feature — *for 10 million users*, " +
          "*during Black Friday*, *it works today but falls over at peak*.\n\n" +
          "The first move is not a diagram. Ask **which number grows**: read QPS, write QPS, stored bytes, or " +
          "fan-out per write ([[system-design-interview-framework]] owns getting those numbers out of a vague " +
          "prompt).\n\n" +
          "When load is flat and the complaint is one slow request, this is the wrong page — that is " +
          "[[latency-vs-throughput|latency, not throughput]].",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "Capacity comes in two dimensions, plus a third move that avoids needing it.\n\n" +
          "**Vertical scaling (scale up)** buys a bigger machine. Nothing about the software changes and no " +
          "request crosses a network it did not cross before, which makes it the cheapest option in engineering " +
          "time. The ceiling is hard, and far higher than most candidates assume. The counterweight is price and " +
          "downtime: the largest instances cost disproportionately more per unit of capacity, and the upgrade is " +
          "usually a restart.\n\n" +
          "**Horizontal scaling (scale out)** puts more machines behind something that spreads work across them. " +
          "There is no ceiling in principle, and AWS's Well-Architected reliability principles recommend it for a " +
          "second reason: replacing one large resource with several small ones reduces the impact of a single " +
          "failure. The precondition **for the service tier** is **statelessness** — an app instance that " +
          "remembers anything between requests cannot be one of N. The data tier scales out the other way: it " +
          "keeps the state and partitions it instead ([[sharding|sharding]]).\n\n" +
          "**Scaling by doing less work** is the one candidates forget: cache, denormalise, precompute, move work " +
          "off the request path. It buys headroom in staleness rather than in machines.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "This page owns the three capacity strategies and the shape of the curve they buy. Everything they " +
          "are made of is elsewhere: *which dimension, when* is " +
          "[[vertical-vs-horizontal-scaling|vertical vs horizontal scaling]]; the precondition is " +
          "[[stateful-vs-stateless-architecture|stateless services]] behind " +
          "[[load-balancers|load balancers]].\n\n" +
          "The per-tier mechanics fill the rest of this track — [[what-is-caching|caching]] for repeated reads, " +
          "[[read-replicas|read replicas]] and [[sharding|sharding]] for the database, " +
          "[[sql-vs-nosql|SQL vs NoSQL]] for engines built to partition from the start, and " +
          "[[message-queues|message queues]] to push work off the request path.",
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "Stack Overflow, February 2016 — nine web servers",
        body:
          "Nick Craver's write-up of Stack Overflow's architecture publishes a full day of production counters " +
          "for 9 February 2016: 209,420,973 HTTP requests, of which 66,294,789 were page loads, served by a web " +
          "tier of **nine** primary servers plus two for staging. Every figure here is that day's measurement.\n\n" +
          "The arithmetic below is the point, and Craver states its conclusion more bluntly than the division " +
          "does: they were down to needing only one web server, and had unintentionally tested that, " +
          "successfully, a few times.",
      },
      {
        kind: "numbers",
        caption:
          "The documented vertical ceiling against one measured system. Rows three to five are arithmetic on the " +
          "published counters.",
        rows: [
          {
            quantity: "Largest single EC2 instance AWS documents",
            value: "1,920 vCPUs · 32 TiB RAM · 200 Gbps",
            derivation: "AWS EC2 U7i product page, size `u7inh-32tb.480xlarge` — vendor-documented, not measured by us.",
          },
          {
            quantity: "Stack Overflow HTTP requests, 9 Feb 2016",
            value: "209,420,973 / day",
            derivation: "Measured counter published in the 2016 architecture post.",
          },
          {
            quantity: "→ site-wide request rate",
            value: "≈ 2,424 req/s",
            derivation: "209,420,973 ÷ 86,400 seconds in a day.",
          },
          {
            quantity: "→ per primary web server",
            value: "≈ 269 req/s",
            derivation: "2,424 ÷ 9 primary web servers (numbered 01–09 in the post).",
          },
          {
            quantity: "Page loads, same day",
            value: "66,294,789 / day ≈ 767/s",
            derivation: "66,294,789 ÷ 86,400. Under a third of requests render a page; the rest are lighter.",
          },
          {
            quantity: "Average question page render",
            value: "22.71 ms",
            derivation: "Measured across 49,180,275 renders that day; the home page averaged 11.80 ms.",
          },
        ],
      },
      {
        kind: "prose",
        body:
          "What makes those numbers possible is the shape of the workload, not a trick. Reads dominate, the hot " +
          "set is cacheable — their two Redis nodes ran below 2% CPU serving it — and rendering is cheap and " +
          "measured. Behind that sits vertical scaling doing the heavy lifting: two SQL Server clusters at " +
          "384 GB and 768 GB of RAM per box, on PCIe SSDs.\n\n" +
          "The nine servers are deliberate over-provisioning, and Craver names the reasons: rolling builds, " +
          "headroom, redundancy. Nine boxes for a one-box load is a different purchase from capacity — it buys " +
          "the ability to lose several and to deploy without a maintenance window ([[availability]]).\n\n" +
          "Where this shape stops is where the rest of the track begins: writes that fan out to many readers, a " +
          "second region, and a working set that outgrows RAM.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What it costs", "When it bites"],
        rows: [
          {
            label: "The second machine",
            cells: [
              "State an instance kept in memory moves behind a network hop, or is given up",
              "The first request routed to a server other than the one holding its session, upload or cached entry",
            ],
          },
          {
            label: "Coordination between nodes",
            cells: [
              "Throughput stops being linear in N and eventually reverses",
              "Write-heavy workloads where nodes must agree — past the peak, each node added returns less than nothing",
            ],
          },
          {
            label: "Scaling out early",
            cells: [
              "Deploys, monitoring, partial failure and a distributed bug class, bought for capacity one box already had",
              "A sharded cluster proposed for a few hundred requests a second per server",
            ],
          },
          {
            label: "Doing less work instead",
            cells: [
              "Staleness, and an invalidation problem that outlives whoever added the cache",
              "The first read that has to reflect a write immediately — the boundary [[cap-theorem]] and [[consistency-models|consistency models]] draw",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "The second row has a model behind it. Neil Gunther's **Universal Scalability Law** writes throughput " +
          "at load N as `X(N) = γN / (1 + α(N−1) + βN(N−1))`. Its three coefficients are γ for ideal linear " +
          "speedup, **α** for contention (queueing on a shared resource), and **β** for coherency (the delay " +
          "while distributed copies of data agree). With β = 0 and γ = 1 it reduces to Amdahl's law, whose " +
          "ceiling is 1/α: added nodes get you asymptotically nowhere, but never backwards.\n\n" +
          "β > 0 is worse than a ceiling. The coherency term grows quadratically, so throughput peaks at " +
          "`Nmax = √((1−α)/β)` and *decreases* beyond it. Take α = 0.05 and β = 0.005 — coefficients assumed " +
          "here to make the shape visible, not measured from any system. Nmax = √(0.95 ÷ 0.005) ≈ 14 nodes, " +
          "worth 5.5× one node's throughput. Thirty-two nodes return 4.3×: more hardware, less work done.\n\n" +
          "Which is why *scale out* is an answer only once you can say what the added nodes have to agree about.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Scaling the tier that wasn't the bottleneck.** Adding app servers to a saturated database makes the database worse — more connections, more lock contention, the same disk. Name the saturated resource before adding anything.",
          "**The shared thing behind the tier you scaled.** A connection pool, a licence server, one writable primary, a single cache node: N instances in front of one of something is still one of that something ([[single-point-of-failure-spof|single points of failure]]).",
          "**Sizing on the average when the prompt named a peak.** A daily mean says nothing about the Monday-morning spike, and hardware is bought for the spike. Quote both, and quote response time at a percentile ([[latency-vs-throughput|latency vs throughput]]).",
          "**Cost climbing faster than load.** A design that absorbs 10× the traffic for 30× the bill has not scaled, it has deferred. Carry a per-request cost beside the capacity plan.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "*You've added a second app server — what breaks?* The depth answer is a list of state: sessions in memory, in-process caches, uploads on local disk, scheduled jobs that now fire twice, anything that assumed there was one of it. Then name the load balancer you just made critical ([[single-point-of-failure-spof|single points of failure]]).",
          "*How far does one machine get you?* Refuse the abstract version. Quote the documented ceiling — one EC2 instance is 1,920 vCPUs and 32 TiB — then the independent point that Stack Overflow's own engineers said nine web servers was eight more than they needed, on 2016 hardware. Arguing for the simpler architecture with evidence lands harder than proposing a cluster.",
          "*Why doesn't doubling the nodes double the throughput?* Name both costs — contention for shared resources, coherency between copies — then the retrograde region past Nmax, where added nodes subtract throughput.",
          "Capacity is always added to a *tier*, so the follow-up is *which one*. Say which saturates first and why you believe it — a number, not a hunch — before naming any mechanism.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "Nick Craver — Stack Overflow: The Hardware, 2016 Edition",
            url: "https://nickcraver.com/blog/2016/03/29/stack-overflow-the-hardware-2016-edition/",
            type: "article",
          },
          {
            label: "Google SRE Book — Handling Overload",
            url: "https://sre.google/sre-book/handling-overload/",
            type: "article",
          },
          {
            label: "AWS Well-Architected — Performance Efficiency Pillar",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html",
            type: "doc",
          },
        ],
      },
    ],
  },
  sources: [
    { label: "AWS — Amazon EC2 U7i High Memory instances", url: "https://aws.amazon.com/ec2/instance-types/u7i/" },
    {
      label: "Nick Craver — Stack Overflow: The Architecture, 2016 Edition",
      url: "https://nickcraver.com/blog/2016/02/17/stack-overflow-the-architecture-2016-edition/",
    },
    {
      label: "Neil Gunther — How to Quantify Scalability (the Universal Scalability Law)",
      url: "https://www.perfdynamics.com/Manifesto/USLscalability.html",
    },
    {
      label: "AWS Well-Architected, Reliability Pillar — Design principles",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html",
    },
  ],
} satisfies LearnTopic;
