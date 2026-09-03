import type { LearnTopic } from "@/learn/data/topic";

export const loadBalancers = {
  slug: "load-balancers",
  title: "Load balancers",
  category: "systems",
  archetype: "mechanism",
  summary:
    "The box that turns one address into a pool of interchangeable machines — what a health check actually " +
    "proves, how many seconds a failover really takes, and what session affinity costs you.",
  tags: ["networking", "scalability", "architecture"],
  priority: "high",
  estimatedMinutes: 20,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A **load balancer** sits in front of a pool of interchangeable instances and picks one of them for " +
          "each request. What it buys is indirection: clients dial one address, and the machines behind it can " +
          "be added, drained, restarted or lost without the client learning any of that. That is the " +
          "precondition for adding capacity by adding machines ([[scalability]]) and for surviving the loss of " +
          "one of them ([[availability]]).\n\n" +
          "You pay for it twice. Once with a component that now sits on every request — one more thing that " +
          "can saturate, misroute, or expire a certificate. And once with a definition of *alive*: the " +
          "balancer routes on the answer to a health check you wrote, so a check that is too shallow keeps a " +
          "broken instance in service, and one that is too eager pulls healthy instances out.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "The cue is the moment a design has **more than one instance of anything on the request path** — a " +
          "second app server, a replica pool, a second region. It fires again whenever a prompt names an " +
          "availability target in nines, because any target above one machine's uptime needs somewhere else " +
          "to send traffic when that machine goes.\n\n" +
          "Two conditions say this is the wrong page. If there is exactly one instance, balancing is not the " +
          "fix and redundancy is — start at " +
          "[[single-point-of-failure-spof|removing the single point of failure]]. If the client must reach " +
          "one *specific* node — a shard's leader, the process holding a session, a named peer — that is " +
          "discovery and routing rather than balancing.\n\n" +
          "The precondition is interchangeability: any instance can serve any request, which means the " +
          "request carries what is needed to serve it ([[stateful-vs-stateless-architecture|stateless " +
          "services]]).",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "Where the balancer sits in the stack",
        body:
          "**L4 balancing** works on connections. The balancer chooses a target when the TCP connection is " +
          "established, then moves bytes between the two sides without reading them, and that one choice " +
          "lasts as long as the connection does.\n\n" +
          "**L7 balancing** terminates the connection itself, parses each HTTP request, and chooses again for " +
          "every one. That is what lets a decision depend on what a request *says* — and it puts the balancer " +
          "inside the TLS boundary, because it has to decrypt before it can read.\n\n" +
          "AWS documents its Application Load Balancer as functioning at the seventh layer of the OSI model " +
          "and its Network Load Balancer at the fourth, which makes that pair a convenient way to keep the " +
          "two straight.",
      },
      {
        kind: "comparison",
        columns: ["", "L4 — connection level", "L7 — request level"],
        rows: [
          {
            label: "Can route on",
            cells: [
              "Source and destination IP and port",
              "Path, host, header, cookie, method — anything in the request",
            ],
          },
          {
            label: "Where TLS ends",
            cells: [
              "At the target; the balancer forwards ciphertext it cannot read",
              "At the balancer, which holds the certificate and re-encrypts to the target or not",
            ],
          },
          {
            label: "Re-decides",
            cells: [
              "Only when a new connection opens",
              "On every request, so a freshly added target takes traffic at once",
            ],
          },
          {
            label: "Work per request",
            cells: [
              "Connection setup, then forwarding — AWS documents NLB as handling millions of requests per second",
              "Parse, match rules, rewrite headers, re-encrypt",
            ],
          },
          {
            label: "Cannot",
            cells: [
              "Retry a request, split traffic by header, or answer with a response of its own",
              "Balance a protocol it does not know how to parse",
            ],
          },
          {
            label: "Typical instances",
            cells: ["AWS NLB, HAProxy in TCP mode, IPVS", "AWS ALB, NGINX, Envoy"],
          },
        ],
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "This page owns the box: what it does when a target dies, and what having one costs. *Which* healthy " +
          "target a request gets is [[load-balancing-algorithms|load balancing algorithms]], including the " +
          "hashes that implement affinity. Spreading traffic before a connection exists is " +
          "[[dns-load-balancing|DNS load balancing]] and [[anycast-routing|anycast routing]]; placing *keyed* " +
          "data across a stateful pool is [[consistent-hashing]]. A balancer that also authenticates, " +
          "rate-limits and versions routes has become an [[api-gateways|API gateway]].",
      },
    ],
    implementation: [
      {
        kind: "prose",
        body:
          "Two shapes of check, and the difference decides what a failover is worth. A **shallow check** asks " +
          "whether the process is up — a handler that returns 200 without consulting anything else. A **deep " +
          "check** asks whether this instance can serve a request: its disk, its worker pool, the " +
          "dependencies it holds open. Deep is the one worth wiring to the balancer, and the design question " +
          "inside it is which dependencies a target is allowed to eject itself over.",
      },
      {
        kind: "code",
        lang: "typescript",
        caption:
          "Every probe is bounded well under the balancer's health-check timeout — 5 seconds on an ALB by " +
          "default — because a check that answers slowly is indistinguishable from a target that is gone.",
        source: `// Shallow: proves the process is listening. It cannot fail while the process can accept a socket.
app.get("/health/live", () => text(200, "ok"));

// Deep: proves *this instance* can serve a request, and answers inside the balancer's timeout.
app.get("/health/ready", async () => {
  const [diskOk, workersOk] = await Promise.all([
    within(200, () => localDiskWritable()),
    within(200, () => workerPoolBelowLimit()),
  ]);
  if (!diskOk || !workersOk) return text(503, "not ready"); // instance-local: eject me

  // The shared database is reported, never asserted. A dependency every target shares
  // fails every check at the same instant, and an empty pool serves nobody.
  const dbOk = await within(300, () => pingPrimary());
  return text(200, dbOk ? "ok" : "ok (degraded: primary unreachable)");
});`,
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "Three app servers behind an ALB, and one of them wedges",
        body:
          "Register three instances in a target group behind an Application Load Balancer. The health check " +
          "then runs on AWS's defaults: a request to the health path every 30 seconds per target, a " +
          "5-second timeout, **2 consecutive failures** to take a target out of service, **5 consecutive " +
          "successes** to put it back. The interval is configurable from 5 to 300 seconds and both thresholds " +
          "from 2 to 10.\n\n" +
          "Those defaults set the length of your outage. An instance that wedges just after a passing check " +
          "is probed again up to 30 seconds later and times out 5 seconds after that; the second probe goes " +
          "out 30 seconds later still, and its timeout is the failure that ejects the target. `30 + 30 + 5 = " +
          "65` seconds, worst case, of requests handed to a target that cannot serve them. Take the interval " +
          "to its 5-second floor with a 2-second timeout and the same threshold and the window closes in " +
          "`5 + 5 + 2 = 12` seconds — paid for with six times the probe traffic and far less tolerance for " +
          "one slow answer.\n\n" +
          "Ejection stops *new* requests, and nothing else. Whatever was already in flight on that target is " +
          "the caller's problem — the balancer will not replay a `POST` it has already forwarded, so the " +
          "client gets a timeout or a 504 and something upstream decides whether that request is safe to " +
          "send again. What happens when every client decides *yes* at the same moment is [[reliability]]'s " +
          "subject.\n\n" +
          "Deploys use the same machinery in reverse. Deregistering a target moves it to a `draining` state " +
          "rather than removing it. AWS documents Elastic Load Balancing as waiting 300 seconds by default " +
          "before completing deregistration, so in-flight requests can finish; a target holding no in-flight " +
          "requests and no active connections is deregistered immediately.\n\n" +
          "Active probing has a blind spot: it asks one synthetic question every 30 seconds while real " +
          "traffic asks harder ones continuously. Envoy closes it with **outlier detection**, which its " +
          "documentation describes as a form of passive health checking. Real responses are watched, a host " +
          "is ejected after a configured run of failures, and it returns after a base ejection time " +
          "multiplied by the number of consecutive ejections — so a repeat offender stays out longer each " +
          "time. Envoy also caps the share of hosts that may be ejected at once, so the failure path itself " +
          "cannot empty the pool.",
      },
      {
        kind: "sequence",
        caption:
          "Serving and probing run on separate clocks. Everything between the wedge and the second failed " +
          "probe goes to a target the balancer still believes in.",
        actors: ["Client", "Load balancer", "App A", "App B"],
        steps: [
          { from: "Load balancer", to: "App B", label: "GET /health/ready", note: "Active probe, every 30 s per target" },
          { from: "App B", to: "Load balancer", label: "200 — stays in the pool", dashed: true },
          { from: "Client", to: "Load balancer", label: "POST /orders" },
          { from: "Load balancer", to: "App B", label: "forwarded to a healthy target" },
          { from: "App B", to: "Load balancer", label: "201", dashed: true },
          { from: "Load balancer", to: "Client", label: "201", dashed: true },
          { from: "App B", to: "App B", label: "connection pool exhausts", note: "t = 0 — the socket still accepts" },
          { from: "Client", to: "Load balancer", label: "POST /orders" },
          { from: "Load balancer", to: "App B", label: "forwarded — B is still in the pool" },
          { from: "Load balancer", to: "Client", label: "504", dashed: true },
          { from: "Load balancer", to: "App B", label: "GET /health/ready", note: "t = 30 s, times out at 35 s — failure 1 of 2" },
          { from: "Load balancer", to: "App B", label: "GET /health/ready", note: "t = 60 s, times out at 65 s — failure 2" },
          { from: "Load balancer", to: "Load balancer", label: "eject B", note: "Pool is now {A}, 65 s after the wedge" },
          { from: "Client", to: "Load balancer", label: "POST /orders" },
          { from: "Load balancer", to: "App A", label: "forwarded — B is out" },
          { from: "App A", to: "Load balancer", label: "201", dashed: true },
          { from: "Load balancer", to: "Client", label: "201", dashed: true },
        ],
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What it costs", "When it bites", "The usual answer"],
        rows: [
          {
            label: "Tight health checks",
            cells: [
              "A tight check cannot tell a stalled instance from a dead one, so it converts latency spikes into capacity loss",
              "A stop-the-world pause or a cold start under load, which is when the pool has least spare capacity to absorb a removal",
              "Set the timeout above the health handler's slowest honest answer, and never eject on one failure",
            ],
          },
          {
            label: "TLS terminated at the balancer",
            cells: [
              "The balancer holds the private key, sees plaintext, and becomes the one place a certificate can expire for everything behind it",
              "A network where traffic between hops must also be encrypted, or one certificate fronting twenty services",
              "Re-encrypt on the hop to the target, or pass connections through at L4 and terminate on the app",
            ],
          },
          {
            label: "Session affinity",
            cells: [
              "Pinning a client to one instance gives up even distribution and the interchangeability the tier was built on",
              "On scale-out, when new targets get only new sessions. And on failure: NGINX documents that a client whose designated server cannot serve it is rebound as if it had never been bound, losing whatever that process held — whether the pin rode a cookie the balancer set or a hash of the client address",
              "Keep the session outside the process, in a shared store or a signed token; pin only what genuinely cannot move",
            ],
          },
          {
            label: "The drain window",
            cells: [
              "Every removal waits out the deregistration delay before the instance can be stopped",
              "A rolling deploy in small batches, where the drain dominates the wall-clock time of the release",
              "Trim the delay to just above your longest legitimate request, and move long work off the request path entirely",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "The deal is worth taking when the pool is genuinely interchangeable and its membership changes — on " +
          "deploys, on failures, under autoscaling. It is a poor one for a fixed pair of machines a client " +
          "can hold a list of and retry itself, and for any protocol whose clients must talk to a node they " +
          "name.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**A health check that cannot fail.** A path answered by the web framework before it touches " +
            "anything proves the port is open and proves nothing else. The instance whose connection pool is " +
            "exhausted keeps passing, keeps taking traffic, and keeps failing every real request — the case " +
            "the check existed for.",
          "**A health check that fails everywhere at once.** Assert a shared dependency inside a per-instance " +
            "check and one database blip marks all of your targets unhealthy in the same second. Healthy " +
            "application servers are then removed for a fault that removing them cannot fix.",
          "**Stopping an instance the moment it deregisters.** Deploy tooling that terminates the process as " +
            "soon as the target leaves the pool turns every in-flight request into a connection reset. The " +
            "instance has to outlive its own deregistration: refuse new work, finish what it holds, then exit.",
          "**Retrying into a pool that is already short.** A balancer set to retry elsewhere on failure " +
            "multiplies load on a tier that has just lost capacity. Cap retries as a fraction of live traffic " +
            "rather than as a per-request allowance.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "**\"What happens when one of those servers dies?\"** *The load balancer routes around it* is the " +
            "answer everyone gives. The one that shows depth names the clock — how often the probe runs, how " +
            "many failures eject, and therefore how many seconds of errors the design has accepted — and " +
            "then says what becomes of the requests already in flight.",
          "**\"L4 or L7 here?\"** Decide from what you need to route on. If nothing above IP and port matters, " +
            "L4 is cheaper and stays out of the way; path-based routing, header canaries or per-tenant rules " +
            "need L7. Naming where TLS terminates usually settles it before the rest of the argument does.",
          "**\"How do sessions survive if requests land on different servers?\"** The trap is to answer " +
            "*sticky sessions* and stop. Lead with the alternative instead, then reach for pinning only with " +
            "its cost spoken out loud — say which requests genuinely cannot move, and what you gave up for " +
            "the ones that could have.",
          "**\"Isn't the balancer now a single point of failure?\"** Yes, which is why it is never one box: " +
            "AWS documents Elastic Load Balancing as creating a load balancer node in every Availability " +
            "Zone you enable, behind one name. The name itself is spread by [[dns-load-balancing|DNS]] or " +
            "[[anycast-routing|anycast]], and the standby taxonomy behind that answer belongs to " +
            "[[single-point-of-failure-spof]].",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "**Long-lived connections never rebalance.** A WebSocket or gRPC stream picks its target once and " +
            "keeps it, so instances added during a spike sit idle until clients reconnect. Bound the maximum " +
            "age of a connection and the pool re-levels itself.",
          "**More than half the pool unhealthy.** Envoy documents a panic threshold, 50% by default: once the " +
            "share of available hosts falls below it, health status is disregarded and traffic is balanced " +
            "across all hosts — or failed outright, if you configure that. Ejecting one host at a time out of " +
            "a cascading overload otherwise arrives at a pool of zero.",
          "**The balancer's own ceiling.** It runs out of something before the backends do — concurrent " +
            "connections, new connections per second, TLS handshakes, or the cost of evaluating its own " +
            "routing rules. Track those limits and alert on the balancer's own metrics, not only on target " +
            "health; discovering them during an incident is the common way.",
          "**A target whose real cost is not its request count.** One expensive endpoint — a report, a large " +
            "upload — makes any count-based fairness fictional, and the balancer has no way to see it. Which " +
            "signal to balance on is [[load-balancing-algorithms|load balancing algorithms]].",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "Envoy — Panic threshold: what a balancer does when most of the pool is unhealthy",
            url: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/panic_threshold",
            type: "doc",
          },
          {
            label: "AWS — Network Load Balancer overview (layer 4, connection-level balancing)",
            url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html",
            type: "doc",
          },
          {
            label: "AWS — Application Load Balancer overview (layer 7, routing on request content)",
            url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html",
            type: "doc",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "AWS — Health checks for Application Load Balancer target groups (intervals, timeouts, thresholds)",
      url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html",
    },
    {
      label: "AWS — Target group attributes: deregistration delay and the draining state",
      url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html",
    },
    {
      label: "Envoy — Outlier detection: passive health checking, ejection time and the ejection cap",
      url: "https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/outlier",
    },
    {
      label: "NGINX — ngx_http_upstream_module: the sticky directive (NGINX Plus)",
      url: "https://nginx.org/en/docs/http/ngx_http_upstream_module.html",
    },
  ],
} satisfies LearnTopic;
