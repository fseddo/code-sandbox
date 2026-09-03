import type { LearnTopic } from "@/learn/data/topic";

export const loadBalancingAlgorithms = {
  slug: "load-balancing-algorithms",
  title: "Load balancing algorithms",
  category: "systems",
  archetype: "mechanism",
  parent: "load-balancers",
  summary:
    "Eight rules for picking a backend, ordered by one axis: what the balancer knows when it decides — and " +
    "what each extra bit of knowledge costs to obtain.",
  tags: ["networking", "scalability", "backend"],
  priority: "high",
  estimatedMinutes: 18,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A **load balancing algorithm** is the rule a balancer applies to pick one backend for one request. " +
          "Every rule sits somewhere on a single axis: *what it knows about the backends at the moment it " +
          "decides*. Round robin knows only its own position in the rotation. Least connections knows how many " +
          "requests each backend is holding right now. A hash knows nothing about the backends at all — it " +
          "knows the request.\n\n" +
          "Climbing that axis buys evenness: the more the rule knows about real load, the less often it hands " +
          "the next request to the one machine already struggling. It is paid for in state. Every signal above " +
          "*position* has to be collected, held per balancer, and trusted while it ages — and a stale signal is " +
          "worse than no signal, because the algorithm acts on it with confidence.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "The choice starts paying when backends stop being interchangeable. Three cues in a prompt. Request " +
          "cost varies wildly — a thumbnail and a 30-second report served by the same pool. Backend capacity " +
          "varies — a mixed instance fleet, or a canary held at a few percent of traffic. Or the *right* " +
          "backend depends on the key, as in a cache cluster or a sharded store, where whoever saw this key " +
          "last is the cheapest place to send it.\n\n" +
          "When none of those hold — identical instances, short uniform requests — round robin is the correct " +
          "answer and the algorithm is not where the risk lives. Spend the time on health checks, timeouts and " +
          "draining, which [[load-balancers|load balancers]] owns.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "The named rules, in the order they climb the axis:\n\n" +
          "- **Random** picks a healthy backend uniformly. Envoy's documentation notes it beats round robin " +
          "when no health checking is configured, because a rotation systematically pushes the successor of " +
          "each failed host into extra traffic and random selection has no such bias.\n" +
          "- **Round robin** walks the pool in order, one request each. **Weighted round robin** repeats " +
          "higher-capacity backends in that rotation, so a machine marked twice the weight comes up twice as " +
          "often.\n" +
          "- **Least connections** counts open sockets, which barely move when a keepalive backend slows; " +
          "**least requests** counts in-flight work, which does rise. **Least response time** ranks on " +
          "recently observed latency instead, so it sees degradation neither count reflects — a dependency " +
          "slowing while concurrency stays flat.\n" +
          "- **Power of two choices** (P2C) samples two backends at random and takes whichever holds less — " +
          "the subject of the worked example below.\n" +
          "- **Locality-aware routing** knows where the backend sits, and prefers one in the caller's zone. " +
          "It buys latency and cross-zone egress cost, and it needs a spillover rule, because clients and " +
          "capacity are never distributed the same way: a zone holding 40% of the callers and 25% of the " +
          "pool will overload if routing is strictly local.\n" +
          "- **Source-IP hash** and **consistent hash** are a different family: they read a key off the request " +
          "and map it to a backend, ignoring load entirely. NGINX's `ip_hash` hashes the first three octets of " +
          "an IPv4 address (the whole address for IPv6), so an entire `/24` is one client as far as it is " +
          "concerned.",
      },
      {
        kind: "comparison",
        heading: "Ordered by what the rule knows when it decides",
        columns: ["", "What it knows", "State it keeps", "What that costs", "Where it breaks"],
        rows: [
          {
            label: "Random",
            cells: [
              "Nothing — not even its own last pick",
              "None",
              "One call to the RNG",
              "Uneven over short runs; capacity ignored",
            ],
          },
          {
            label: "Round robin",
            cells: [
              "Its position in the rotation",
              "One counter",
              "Nothing measurable",
              "A slow backend keeps its turn regardless",
            ],
          },
          {
            label: "Weighted round robin",
            cells: [
              "Static capacity, as configured",
              "Counter plus a weight per backend",
              "A human keeping the weights true",
              "Weights go stale after a resize or instance-type change",
            ],
          },
          {
            label: "Power of two choices",
            cells: [
              "In-flight count of two sampled backends",
              "An in-flight counter per backend",
              "Two counter reads per request",
              "Its own view of in-flight must be current",
            ],
          },
          {
            label: "Least connections",
            cells: [
              "In-flight count of every backend",
              "The same counters, scanned in full",
              "An `O(n)` scan per decision",
              "Long-lived connections stay counted while idle",
            ],
          },
          {
            label: "Least response time",
            cells: [
              "Recent latency per backend",
              "A smoothed latency estimate per backend",
              "Timing every response, plus the smoothing",
              "A fast failure measures as a fast success",
            ],
          },
          {
            label: "Source-IP hash",
            cells: [
              "The client address; nothing about load",
              "Pool membership only",
              "One hash per request",
              "Carrier-grade NAT puts thousands of clients in one bucket",
            ],
          },
          {
            label: "Consistent hash",
            cells: [
              "The request key; nothing about load",
              "A ring or table over the pool",
              "Building and sharing that ring",
              "A hot key is one backend's problem alone",
            ],
          },
        ],
        caption:
          "The last two rows leave the load axis entirely: they know something about the request and nothing " +
          "about the backends.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "[[consistent-hashing]] owns the ring itself — token placement, virtual nodes, how many keys move " +
          "when membership changes. This page takes it only as a routing rule: key affinity bought with load " +
          "blindness.\n\n" +
          "[[load-balancers|load balancers]] owns the box the rule runs inside, including what session " +
          "affinity costs the service tier. And least response time ranks on a latency figure that is a " +
          "distribution rather than a number — [[latency-vs-throughput]] owns percentiles.",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Two samples beat a full scan.** Least connections needs the in-flight count of every backend at " +
          "decision time. For a pool of 100 that is 100 counters read per request, each of which has to be " +
          "current. The obvious saving — read fewer — looks like it should cost accuracy in proportion. It " +
          "does not.\n\n" +
          "Mitzenmacher's *supermarket model* is the reason. Customers arrive as a Poisson stream at `n` " +
          "servers; each picks `d` servers uniformly at random and joins the shortest of those queues; service " +
          "times are exponential with mean 1, and `λ` is the arrival rate per server. Those are the model's " +
          "assumptions, not measurements of any real fleet.\n\n" +
          "With `d = 1` — pure random — the expected time a customer spends in the system is `1/(1 − λ)`, which " +
          "blows up as utilization approaches 1. With `d ≥ 2` it is bounded by a sum growing like the " +
          "*logarithm* of that quantity, which the paper states as an exponential improvement; the longest " +
          "queue is `log log n / log d + O(1)` with high probability. The `log d` in that denominator is the " +
          "whole story about further samples: three choices is a constant factor better than two, not another " +
          "step change.",
      },
      {
        kind: "numbers",
        heading: "The supermarket model at 99% utilization",
        rows: [
          {
            quantity: "Utilization `λ`",
            value: "0.99 (assumed input)",
            derivation:
              "A deliberately hard case — every server busy 99% of the time. Times below are in units of mean " +
              "service time.",
          },
          {
            quantity: "Expected time in system, `d = 1`",
            value: "100",
            derivation: "`1/(1 − λ)` = 1/0.01, the standard queueing result Mitzenmacher compares against (§2.4).",
          },
          {
            quantity: "Expected time in system, `d = 2`",
            value: "≈ 5.4",
            derivation:
              "Corollary 2 gives the time as `Σᵢ λ^((dⁱ − d)/(d − 1))`. For `d = 2` the exponents are 0, 2, 6, " +
              "14, 30, 62, 126, 254. Evaluated at λ = 0.99: 1 + 0.980 + 0.942 + 0.869 + 0.740 + 0.536 + 0.282 " +
              "+ 0.078 = 5.43.",
          },
          {
            quantity: "Expected time in system, `d = 3`",
            value: "≈ 3.9",
            derivation:
              "Same sum, exponents 0, 3, 12, 39, 120, 363: 1 + 0.970 + 0.886 + 0.676 + 0.299 + 0.026 = 3.86. " +
              "Sample two and 100 becomes 5.4; sample three and 5.4 becomes 3.9.",
          },
          {
            quantity: "Counters read per decision, 100 backends",
            value: "2 vs 100",
            derivation:
              "P2C reads the pair it sampled, a full scan reads the pool — 50× fewer reads. Envoy documents " +
              "its two-sample path as `O(1)` against an `O(N)` scan.",
          },
        ],
        caption: "Model outputs, not production measurements — the shape is what transfers.",
      },
      {
        kind: "prose",
        body:
          "Proxies ship this directly. With equal weights, Envoy's `least_request` policy selects N random " +
          "hosts (2 by default) and picks the one with the fewest active requests, which its documentation " +
          "calls nearly as good as a full scan, citing Mitzenmacher. NGINX spells the same rule " +
          "`random two least_conn`.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What it buys", "What it costs", "When that bites"],
        rows: [
          {
            label: "Load-aware picks",
            cells: [
              "Traffic drains off a struggling backend with nobody configuring anything",
              "Each balancer decides from its own view of in-flight work",
              "Several balancers over one pool see the same idle host and all aim at it — the herding Envoy cites P2C's resistance to",
            ],
          },
          {
            label: "Static weights",
            cells: [
              "Capacity differences respected with no measurement at all",
              "A hand-maintained number no health check can verify",
              "A canary dialled to a low weight for launch and never dialled back up",
            ],
          },
          {
            label: "Latency ranking",
            cells: [
              "Reacts to degradation before connection counts move",
              "Smoothing, which delays the very reaction it was bought for",
              "A low-traffic backend whose smoothed estimate is stale because nothing recent has measured it",
            ],
          },
          {
            label: "Key affinity",
            cells: [
              "The same key reaches the same backend, so caches stay warm",
              "The ability to move traffic at all — no weighting, no ramp, no shedding a hot key",
              "A recovered node needs warming: NGINX's `slow_start` is explicitly unavailable with `hash`, `ip_hash` and `random`",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "The ladder saturates early. Going from no knowledge to two samples is the large win; going from two " +
          "samples to the whole pool costs a scan per request and a fleet-wide fresh view, and buys a " +
          "constant. Past that sits adaptive routing on signals the application reports — Envoy's client-side " +
          "weighted round robin recomputes endpoint weights from ORCA load reports — which buys accuracy and " +
          "hands you a feedback loop to tune.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Counting requests instead of work.** In-flight count is a proxy for load, and a poor one when one " +
            "request returns a thumbnail and the next runs a 30-second report. HAProxy's manual makes the " +
            "narrow version of the point: it recommends `leastconn` for long sessions such as LDAP or SQL and " +
            "says it suits short HTTP ones badly.",
          "**Handing a cold backend its full share.** Every load-aware rule favours the emptiest backend — " +
            "which is exactly the one that just booted with cold caches, an empty connection pool and nothing " +
            "compiled yet. Ramp it instead: NGINX's commercial `slow_start` parameter recovers a server's weight " +
            "from zero over a configured interval, and it is off by default.",
          "**Retrying inside the algorithm.** A retry is a second request through the same rule, so a " +
            "timing-out backend re-enters the same decision and can be picked again. Budgeting retries is " +
            "[[load-balancers|the balancer's]] job; [[reliability]] covers where the cascade ends.",
          "**Leaving dead or draining instances in the pool.** Every rule here assumes membership is already " +
            "correct. Hashing adds a second trap: NGINX documents marking a temporarily removed server `down` " +
            "rather than deleting it, so the surviving clients keep their existing mapping.",
          "**Using sticky routing to hide state you never externalised.** Affinity turns a session bug into " +
            "one you meet on deploy, on failover, or when a client's address changes. If moving a user to " +
            "another backend breaks their session, that is a reliability risk expressed in the routing layer.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "*Which algorithm would you use?* — name the signal before the rule. Say what the balancer can see " +
            "and what varies in the workload, then pick. \"Round robin, because the instances are identical " +
            "and requests are uniform\" is a stronger answer than \"least connections\" with no reason.",
          "The standard follow-up on least connections is *why not always use it?* Two answers worth having: " +
            "it costs a scan of the pool per decision, and its view is per-balancer rather than fleet-wide.",
          "**P2C is the depth signal.** One sentence on Corollary 2 — and on why the third sample only buys a " +
            "constant — defends choosing it over least connections in a large pool.",
          "Cache and shard prompts want the key family, not the load family. Say it as a trade — hit rate " +
            "bought with key affinity, load balance given up — and expect [[consistent-hashing]] as the next " +
            "question.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "Mitzenmacher, Richa & Sitaraman — The Power of Two Random Choices: A Survey",
            url: "https://www.eecs.harvard.edu/~michaelm/postscripts/handbook2001.pdf",
            type: "article",
          },
          {
            label: "HAProxy configuration manual — the `balance` keyword and its algorithms",
            url: "https://docs.haproxy.org/3.0/configuration.html",
            type: "doc",
          },
          {
            label: "Maglev: A Fast and Reliable Software Network Load Balancer (Google, NSDI 2016)",
            url: "https://research.google/pubs/maglev-a-fast-and-reliable-software-network-load-balancer/",
            type: "article",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "Mitzenmacher — The Power of Two Choices in Randomized Load Balancing (IEEE TPDS, 2001)",
      url: "https://www.eecs.harvard.edu/~michaelm/postscripts/tpds2001.pdf",
    },
    {
      label: "Envoy — Supported load balancers",
      url: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers",
    },
    {
      label: "NGINX — ngx_http_upstream_module",
      url: "https://nginx.org/en/docs/http/ngx_http_upstream_module.html",
    },
  ],
} satisfies LearnTopic;
