import type { LearnTopic } from "@/learn/data/topic";

export const whatIsSystemDesign = {
  slug: "what-is-system-design",
  title: "What is system design?",
  category: "systems",
  archetype: "orientation",
  summary:
    "Choosing which qualities a system buys for one set of requirements — and being able to name what you paid for them with.",
  tags: ["architecture", "scalability", "distributed-systems"],
  priority: "mid",
  estimatedMinutes: 15,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "**System design** turns a one-line ask — *build a link shortener*, *build a group chat* — into a " +
          "concrete arrangement of components, data stores and protocols, plus the reasons that arrangement " +
          "beats the ones you rejected. The artifact is not the drawing. The artifact is a set of choices, each " +
          "attached to a requirement it serves.",
      },
      {
        kind: "prose",
        body:
          "The cost model is the thesis of this whole track: **every quality is bought with another one.** Low " +
          "latency is bought with duplicated data you then have to keep fresh ([[what-is-caching|caching]]); high " +
          "availability is bought with redundancy, and redundancy is bought with hardware, coordination and " +
          "weaker consistency ([[cap-theorem|the CAP theorem]]).\n\n" +
          "In practice no design holds low latency, strong consistency, low cost and high availability at once. " +
          "So a design is " +
          "judged less by what it achieves than by whether you can say what you gave up first, and why that was " +
          "the cheapest thing to lose.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "The two requirement classes",
        body:
          "Every prompt splits into two kinds of requirement, and the axis that separates them is **how you " +
          "falsify one**: a single request settles a **functional requirement**, while a **non-functional " +
          "requirement** can only be judged over a population of them.\n\n" +
          "Miss a functional requirement and you build the wrong feature. Miss a non-functional one and you " +
          "design the wrong *system* — and since the prompt almost never states them, missing them is what " +
          "happens by default unless you go and ask.",
      },
      {
        kind: "comparison",
        columns: ["", "Functional requirement", "Non-functional requirement"],
        rows: [
          {
            label: "What it states",
            cells: ["What the system does", "How well it does it, and under what load"],
          },
          {
            label: "The form it takes",
            cells: [
              "A verb and an object — *a user can shorten a URL*",
              "A number, a percentile and a window — *99% of redirects under 100 ms*",
            ],
          },
          {
            label: "Where it comes from",
            cells: [
              "The prompt, plus clarifying questions",
              "Almost never the prompt — you propose targets and get them confirmed",
            ],
          },
          {
            label: "What it constrains",
            cells: [
              "The API surface and the data model",
              "The topology — replication, caching, [[sharding]], how many regions",
            ],
          },
          {
            label: "Chat-app example",
            cells: [
              "Send a message; show delivery receipts",
              "p99 delivery under 500 ms; 99.9% availability; ordered per conversation",
            ],
          },
        ],
        caption: "The vocabulary the rest of the track reuses.",
      },
      {
        kind: "prose",
        heading: "The qualities you trade",
        body:
          "The non-functional half is drawn from a small reusable list — named here, taught one lesson at a " +
          "time later.\n\n" +
          "- **[[availability|Availability]]** — the fraction of time, or of requests, the system serves " +
          "successfully.\n" +
          "- **[[latency-vs-throughput|Latency and throughput]]** — how long one request takes, quoted at a " +
          "percentile, against how many requests per second the system absorbs. Two different problems.\n" +
          "- **[[reliability|Reliability]]** — whether it keeps producing the *right* answer, which is a " +
          "different question from whether it answers at all.\n" +
          "- **Durability** — the probability that data, once acknowledged, survives.\n" +
          "- **[[consistency-models|Consistency]]** — whether a read is guaranteed to see the most recent write.\n" +
          "- **[[scalability|Scalability]]** — whether adding capacity keeps up with load.\n" +
          "- **Cost** and **maintainability** — the two candidates forget. AWS's Well-Architected framework " +
          "makes them two of its six pillars.\n\n" +
          "Each of these gets a measurement (an **SLI**), a target for that measurement (an **SLO**), and " +
          "sometimes a customer contract with penalties attached (an **SLA**). The [[availability]] lesson owns " +
          "those three and the arithmetic that turns a target into minutes of downtime.",
      },
      {
        kind: "prose",
        heading: "The boxes you choose between",
        body:
          "The other vocabulary is the components, and it is shorter than it looks: almost every design in " +
          "this track is assembled from the same handful. A **client** issues requests. A " +
          "**[[load-balancers|load balancer]]** spreads them across interchangeable, stateless " +
          "**application servers**, which is what lets you add capacity by adding machines. A " +
          "**[[what-is-caching|cache]]** holds what is expensive to recompute; a " +
          "**[[database-types|database]]** holds what has to survive a restart. A " +
          "**[[message-queues|message queue]]** takes work the caller shouldn't wait for. " +
          "**[[three-pillars-observability|Observability]]** watches all of it.\n\n" +
          "Design is deciding which of these you actually need and how many. Start from the smallest thing " +
          "that could work — client, load balancer, application servers, database — and add a box only when a " +
          "requirement demands it. The diagram below shows where each one sits *when it is present*, not a " +
          "starting point to trim down.",
      },
      {
        kind: "architecture",
        nodes: [
          { id: "client", label: "Client", tier: "client", note: "browser, mobile app, another service" },
          { id: "lb", label: "Load balancer", tier: "edge", note: "spreads load, hides dead hosts" },
          { id: "app", label: "Application servers", tier: "service", note: "interchangeable; any one can serve any request" },
          { id: "queue", label: "Message queue", tier: "service", note: "buffers a spike the workers absorb later" },
          { id: "worker", label: "Workers", tier: "service", note: "consume the queue" },
          { id: "cache", label: "Cache", tier: "data", note: "fast, small, allowed to be stale" },
          { id: "db", label: "Database", tier: "data", note: "the one box every other box defers to" },
        ],
        edges: [
          { from: "client", to: "lb", label: "request" },
          { from: "lb", to: "app" },
          { from: "app", to: "cache", label: "read first" },
          { from: "app", to: "db", label: "on miss / on write" },
          { from: "app", to: "queue", label: "enqueue", dashed: true },
          { from: "queue", to: "worker", dashed: true },
          { from: "worker", to: "db" },
        ],
        caption:
          "Where each component sits once a requirement has bought it. Every box is a later lesson, and the " +
          "value of the " +
          "picture is knowing which one to remove when the requirements don't justify it.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "Read [[system-design-interview-framework]] next. This page is the vocabulary and the standard a " +
          "design is judged against — what a requirement is, what the two classes are, which qualities you are " +
          "allowed to trade, and which boxes are on the table. That page is the 45-minute procedure that " +
          "produces one: the step order, the clarifying questions that pull requirements out of an interviewer " +
          "inside five minutes, and the back-of-the-envelope estimation that turns those requirements into a " +
          "component count. No arithmetic happens here; all of it happens there.",
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "Two verbs, two very different systems",
        body:
          "Google's SRE Workbook walks one service end to end — the API behind a mobile game. Its functional " +
          "half is the part you could have guessed from the name: *a player submits a score*, *a player reads " +
          "the leaderboard*. Its non-functional half was measured, not guessed: four weeks of traffic gave " +
          "starter objectives of 97% availability, 90% of requests under 450 ms, and 99% under 900 ms.\n\n" +
          "Look at what the numbers do that the verbs cannot. The 97% is not picked off a table of nines — it " +
          "is the service's own observed success rate, rounded down, which is why it is 97% and not 99.9%. Two " +
          "latency targets rather than one say the tail matters, not just the typical request. Keep the same " +
          "two verbs and move those numbers to 99.99% and 50 ms and you have a different system: replicated, " +
          "cached, multi-region, and an order of magnitude more expensive to run. The verbs never changed.\n\n" +
          "The Workbook also picks its indicators by service shape — request-driven services get availability, " +
          "latency and quality; data pipelines get freshness, correctness and coverage; storage systems get " +
          "durability. Choose the wrong menu and your targets measure nothing anyone cares about.",
      },
    ],
    interviewAngle: [
      {
        kind: "prose",
        body:
          "The question arrives in nearly every design round, usually in the first five minutes: *what are the " +
          "non-functional requirements here?* The answer that signals depth proposes numbers with a percentile " +
          "and a window, attaches each to a design consequence, and volunteers which one you would give up " +
          "first. For a link shortener: \"99.9% availability on the redirect path, p99 redirect latency under " +
          "100 ms, and I'll take eventual consistency on click analytics — I'd rather lose a click count than " +
          "a redirect.\" That last clause is the one that separates candidates: it names the sacrifice before " +
          "anyone asks for it.",
      },
      {
        kind: "callout",
        tone: "tip",
        items: [
          "Give every non-functional number a unit and a window. \"p99 under 200 ms over a rolling 28 days\" invites a design discussion; \"fast\" invites nothing.",
          "Don't reach for a big-company architecture before a requirement demands it — microservices, a message bus and a cache tier proposed at minute two are a signal against you ([[microservices-architecture|microservices]]).",
          "When two requirements fight, say so out loud and pick. Naming the conflict is worth more than resolving it quietly — and some sets are jointly unsatisfiable, which is a real answer ([[cap-theorem|the CAP theorem]]).",
          "Two candidate designs can both be right — the track takes that as its own position, and Meta describes its 45-minute design round as almost never involving code. If you catch yourself hunting for the one intended solution, you are still in coding-interview mode.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "AWS Well-Architected Framework — the six pillars",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html",
            type: "doc",
          },
          {
            label: "arc42 Quality Model — a summary of ISO/IEC 25010:2023's quality characteristics",
            url: "https://quality.arc42.org/standards/iso-25010",
            type: "doc",
          },
          {
            label: "Designing Data-Intensive Applications (Kleppmann) — ch. 1, \"Reliable, Scalable, and Maintainable Applications\"",
            url: "https://dataintensive.net/",
            type: "article",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "Google SRE Book — Service Level Objectives",
      url: "https://sre.google/sre-book/service-level-objectives/",
    },
    {
      label: "Google SRE Workbook — Implementing SLOs (the mobile-game service and its measured targets)",
      url: "https://sre.google/workbook/implementing-slos/",
    },
    {
      label: "Meta Careers — Preparing for your software engineering interview at Meta",
      url: "https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/",
    },
  ],
} satisfies LearnTopic;
