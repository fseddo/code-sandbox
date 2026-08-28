import type { LearnTopic } from "@/learn/data/topic";

export const latencyVsThroughput = {
  slug: "latency-vs-throughput",
  title: "Latency vs throughput vs bandwidth",
  category: "systems",
  archetype: "distinction",
  parent: "scalability",
  summary:
    "How long one request takes, how many complete per second, and the ceiling throughput never quite reaches — three numbers that move against each other, and why the one that matters is quoted at a percentile.",
  tags: ["networking", "scalability", "backend"],
  priority: "high",
  estimatedMinutes: 12,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Three questions about the same system, and an answer to one tells you little about the other two. " +
          "**Latency** is how long a single request takes, end to end. **Throughput** is how much work finishes " +
          "per unit of time — requests per second, bytes per second. **Bandwidth** is the ceiling on throughput: " +
          "the maximum rate a path could carry with nothing else in the way. Throughput is what you measure; " +
          "bandwidth is what you were sold.",
      },
      {
        kind: "prose",
        body:
          "The cost model is that you rarely move one without paying in another.\n\n" +
          "**Little's Law** (Little, 1961) is the constraint underneath: `L = λW`, where the average number of " +
          "requests inside the system equals the arrival rate times the time each one spends there. Read it as " +
          "`concurrency = throughput × latency` and the coupling is explicit. At fixed concurrency, doubling " +
          "throughput means halving the time any request is allowed to take.\n\n" +
          "Run it in the direction an interviewer asks for: 50 concurrent workers at 10 ms a request is " +
          "50 ÷ 0.01 s = **5,000 requests/second**. One worker at the same latency is 100. Nothing about the " +
          "code changed — only how many requests are allowed to be in flight at once.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "The cue is a requirement that says *fast* or *handles N users* without saying which one it means. " +
          "Split it before you draw anything. A **p99 target** is a latency requirement and it drives the shape " +
          "of the request path — regions, hops, fan-out. A **QPS number** is a throughput requirement and it " +
          "drives capacity. Answering a QPS question with a caching strategy is the tell that the two got merged.\n\n" +
          "Amazon's Dynamo paper shows the well-formed version of the requirement: a response *within 300ms for " +
          "99.9% of its requests for a peak client load of 500 requests per second*. Latency, percentile and load, " +
          "in one sentence.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Latency decomposes into four delays**, and which one dominates decides which fixes are even " +
          "available. **Propagation** is distance divided by signal speed. **Transmission** is bytes divided by " +
          "link bandwidth — the point where bandwidth enters latency. **Processing** is the work the machine " +
          "does. **Queuing** is time spent waiting behind other requests. Grigorik's *High Performance Browser " +
          "Networking* uses this split and carries the figure that makes it concrete: light in fibre travels at " +
          "roughly two-thirds of `c`. A 6,000 km transatlantic hop therefore costs about 30 ms one way, 60 ms " +
          "round trip, before anyone does any work.\n\n" +
          "That is why *add a cache* is not a universal answer. A cache beside the origin does nothing for a " +
          "propagation delay set by distance; only moving the data closer does, which is what a CDN is.",
      },
      {
        kind: "prose",
        body:
          "**Latency is a distribution, not a number**, so it is quoted at a percentile. The Google SRE book's " +
          "reading: `p99` is the value 99% of requests come in under, so p50 describes the typical request while p99 and p99.9 show a plausible worst case. Two " +
          "consequence follows: measure where the user is. The " +
          "same book notes that client-side latency is often the more user-relevant metric, since server-side " +
          "timing excludes DNS, TLS and the last mile.\n\n" +
          "**Bandwidth bounds throughput without delivering it.** The gap between them is protocol overhead, " +
          "queuing and the slowest hop on the path — and inside the system the same asymmetry holds: throughput " +
          "is set by the slowest stage, so widening anything else changes nothing. Over a fat, long link the binding constraint is the " +
          "**bandwidth-delay product** — bandwidth × round-trip time, the bytes that must be in flight to keep " +
          "the pipe busy; what the transport does about it belongs to [[tcp-vs-udp|TCP vs UDP]].",
      },
      {
        kind: "comparison",
        caption: "The axis is what each number tells you — and what it does not.",
        columns: ["", "Latency", "Throughput", "Bandwidth"],
        rows: [
          {
            label: "Measures",
            cells: ["Time for one request", "Completed work per unit time", "Maximum possible rate"],
          },
          {
            label: "Unit",
            cells: ["ms, at a percentile", "requests/s, bytes/s", "bits/s"],
          },
          {
            label: "Improved by",
            cells: [
              "A shorter path and less work per request — [[what-is-caching|caching]], [[content-delivery-network-cdn|CDNs]]",
              "More parallelism and more capacity — [[load-balancers|load balancers]], [[message-queues|queues]]",
              "A bigger pipe, which is a purchase rather than a design",
            ],
          },
          {
            label: "Does not buy you",
            cells: ["More capacity", "A faster single request", "Throughput you actually observe"],
          },
          {
            label: "Where it bites",
            cells: [
              "User-perceived responsiveness",
              "Peak-hour saturation",
              "Bulk transfer, cross-region replication",
            ],
          },
        ],
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "A product page over 20 services",
        body:
          "Take a product page assembled from **20 backend services in parallel**, each with a **p99 of 50 ms**. " +
          "Both figures are assumptions a candidate would propose and confirm, not measurements.\n\n" +
          "Treat the slow events as independent — an assumption that flatters the design, since real interference " +
          "is correlated. The page is fast only when all 20 dependencies are fast, and 0.99²⁰ = 0.818. So **18% " +
          "of page loads touch at least one dependency in its slowest 1%**. The page's p99 is nowhere near 50 ms, " +
          "because a per-service p99 target was never a page-level target.",
      },
      {
        kind: "numbers",
        caption: "Tail amplification under fan-out. Rows one to three are the paper's hypothetical scenario; rows four to seven are measured.",
        rows: [
          {
            quantity: "Server with 10 ms typical latency and a p99 of 1 s, one server per request",
            value: "1 request in 100 is slow",
            derivation: "The paper's own worked scenario.",
          },
          {
            quantity: "Same servers, request fanned out to 100 of them",
            value: "63% of user requests exceed 1 s",
            derivation: "1 − 0.99¹⁰⁰ = 1 − 0.366; the point marked “x” on the paper's figure.",
          },
          {
            quantity: "1-in-10,000 slow at a single server, fan-out of 2,000",
            value: "Almost 1 in 5 exceed 1 s",
            derivation: "1 − 0.9999²⁰⁰⁰ = 1 − 0.819 ≈ 0.18; the point marked “o”.",
          },
          {
            quantity: "Real Google service — p99 for one random leaf, timed at the root",
            value: "10 ms",
            derivation: "Table 1 of the paper.",
          },
          {
            quantity: "Same service — p99 for 95% of leaves finishing",
            value: "70 ms",
            derivation: "Table 1.",
          },
          {
            quantity: "Same service — p99 for every leaf finishing",
            value: "140 ms",
            derivation: "Table 1. Waiting on the slowest 5% costs 140 − 70 = 70 ms, half the total.",
          },
          {
            quantity: "BigTable read of 1,000 keys across 100 servers, hedged after 10 ms",
            value: "p99.9 falls from 1,800 ms to 74 ms",
            derivation: "The paper's benchmark; the hedge costs roughly 2% more requests.",
          },
        ],
      },
      {
        kind: "prose",
        body:
          "Three moves are open on the 20-service page, and each is priced. A **hedged request** sends a second " +
          "copy to another replica after a short delay and takes whichever answer lands first — the remedy the " +
          "row above measures, paid for in duplicated work. A **tight timeout with a fallback** caps the tail at " +
          "the cost of a degraded page. **Reducing fan-out** removes tails entirely and buys back coupling " +
          "between services.\n\n" +
          "None of the three is *make each service faster*. The paper's own account of where the tail comes from " +
          "explains why: shared resources, background daemons, queueing and maintenance activity. The slow " +
          "request is usually interference, not a slow request.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What you give up", "When it bites"],
        rows: [
          {
            label: "Batching for throughput",
            cells: [
              "The first item in a batch waits for the window to close, so the exchange rate is the window length",
              "A write pipeline sharing a store with an interactive read path",
            ],
          },
          {
            label: "Concurrency past saturation",
            cells: [
              "Queuing delay climbs non-linearly while throughput flattens — Little's Law with concurrency pinned",
              "Load tests that report only the mean at peak",
            ],
          },
          {
            label: "Replicating for capacity",
            cells: [
              "Capacity, not speed — a replica shortens the queue or the distance, and does nothing to the work itself",
              "A design promising lower latency from [[read-replicas|read replicas]] alone",
            ],
          },
          {
            label: "Fanning out for parallelism",
            cells: [
              "Every added dependency multiplies its own tail into the composed response",
              "Any request that touches many services, which is most of them",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "None of these rows is an argument against batching, replicating or fanning out. They are the price to " +
          "name while proposing it, and the exchange rate is the part worth saying out loud: the batch window, " +
          "the saturation point, the percentile you are trading away. Targets themselves — which percentile, at " +
          "what value, over what window — belong to [[availability]].",
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "*You want p99 under 200 ms and the request fans out to 20 services — is that achievable?* Do the arithmetic aloud. If each dependency is itself at 200 ms p99, the composed response is far worse, because the page waits for the slowest of the twenty. Either the per-service budget is much tighter than the page budget, or the fan-out shrinks.",
          "*Is bandwidth just throughput by another name?* No, and the distinction is the page: bandwidth is bought, throughput is achieved, and latency is neither. Reach for the bandwidth-delay product when the prompt replicates across a WAN — a 1 Gbps link at 100 ms RTT holds 12.5 MB in flight, and nothing moves faster until that pipe is full.",
          "The depth signal is naming fixes that attack *variance* rather than the mean: hedged requests, a timeout with a degraded fallback, fewer services on the critical path. The BigTable hedging result above — a p99.9 of 1,800 ms cut to 74 ms for about 2% more load — is the strongest single number available here.",
        ],
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Quoting an average.** The SRE book's Figure 4-1 shows a service with a ~50 ms typical request where *5% of requests are 20 times slower* — a mean hides exactly the tail a target exists to bound. It bites the moment *average latency 100 ms* is offered as a requirement.",
          "**Averaging percentiles.** The mean of two servers' p99 values is not the fleet's p99. Aggregate from raw distributions or histograms, or the number you report is not a percentile of anything.",
          "**Measuring only server-side.** Server timing excludes DNS, TLS and the last mile, which is most of what the user waits for. The dashboard stays green while the product feels slow.",
          "**Assuming replicas cut latency.** They add capacity. A replica only shortens a request if it shortens the queue or the distance — say which one you are claiming ([[scalability]] owns the capacity half).",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "Little's law — the statement and its 1961 proof",
            url: "https://en.wikipedia.org/wiki/Little%27s_law",
            type: "article",
          },
          {
            label: "High Performance Browser Networking — Primer on Latency and Bandwidth",
            url: "https://hpbn.co/primer-on-latency-and-bandwidth/",
            type: "article",
          },
          {
            label: "Google SRE Book — Monitoring Distributed Systems, on distributions over averages",
            url: "https://sre.google/sre-book/monitoring-distributed-systems/",
            type: "article",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "Dean & Barroso — The Tail at Scale (CACM, 2013)",
      url: "https://www.barroso.org/publications/TheTailAtScale.pdf",
    },
    {
      label: "Google SRE Book — Service Level Objectives",
      url: "https://sre.google/sre-book/service-level-objectives/",
    },
    {
      label: "Amazon — Dynamo: Amazon's Highly Available Key-value Store (SOSP 2007)",
      url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
    },
  ],
} satisfies LearnTopic;
