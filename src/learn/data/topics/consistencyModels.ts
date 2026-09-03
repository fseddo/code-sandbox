import type { LearnTopic } from "@/learn/data/topic";

export const consistencyModels = {
  slug: "consistency-models",
  title: "Consistency models",
  category: "systems",
  archetype: "distinction",
  parent: "scalability",
  summary:
    "The contract for which orderings of reads and writes a store may expose — from linearizable at the top to eventual at the bottom, and the price of each rung.",
  tags: ["distributed-systems", "database", "storage"],
  priority: "high",
  estimatedMinutes: 30,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A **consistency model** is a contract about which histories of reads and writes a storage system is " +
          "allowed to expose. Jepsen frames it as a *safety property* — it says nothing about what the system " +
          "will do, only about what it may never do.\n\n" +
          "[[what-is-system-design]] promised this page would settle *whether a read is guaranteed to see the " +
          "most recent write*. That guarantee has a name — **linearizability** — and it is one end of a " +
          "spectrum with a dozen named points on it, most of which are cheaper and none of which is wrong.",
      },
      {
        kind: "prose",
        body:
          "The cost runs the length of that spectrum. A stronger model forbids more anomalies, and it buys that " +
          "by making nodes agree before answering: an extra round trip to a leader or a quorum on the hot path, " +
          "and no answer at all while the nodes that must agree cannot reach each other. A weaker model answers " +
          "from whichever replica is nearest and keeps answering when the network breaks — and charges you in " +
          "application code that has to tolerate, or reconcile, the anomalies it now permits.\n\n" +
          "None of this is a property of *a database*. It is a property of an operation, and in real stores it " +
          "is usually a flag with a price on it.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for this vocabulary the moment a design has replicas **and** a read path that can land " +
          "somewhere other than where the write did — a follower, a cache, a second region.\n\n" +
          "Then ask the question per data class — [[cap-theorem]] owns why the call is never per system — and " +
          "ask it as: would a user notice the staleness, and would " +
          "it be *wrong*? A like count three seconds behind is nobody's incident. A comment missing from the " +
          "page immediately after you posted it is noticed within one second, by the one user who is certain " +
          "they are right. Those two answers buy different machinery, at very different prices.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "The spectrum, strongest first",
        body:
          "The named models form a lattice rather than a menu. From strict serializability down to PRAM each " +
          "really does imply the one beneath, so a system that hands you the top has already handed you those. " +
          "Below PRAM it branches: read-your-writes and monotonic reads are siblings, and a system can have " +
          "either without the other.\n\n" +
          "**Strict serializability** sits at the top, and Jepsen's map draws it as the join of two otherwise " +
          "disjoint families — multi-object *transaction* models on one side (serializable, snapshot isolation, " +
          "read committed) and single-object *consistency* models on the other. That split is why " +
          "`serializable` and `linearizable` are not synonyms and why a store can advertise one without the " +
          "other. Isolation levels belong to [[acid-transactions|ACID transactions]]; this page walks the " +
          "single-object branch down.\n\n" +
          "**Linearizable** requires every operation to appear to take effect instantaneously, in an order " +
          "consistent with real time. **Sequential** keeps the single agreed order but drops the real-time " +
          "tie, so a process may sit arbitrarily far behind as long as nobody disagrees about the sequence. " +
          "**Causal** keeps only the orderings that could be cause and effect, and lets independent operations " +
          "be observed in different orders by different clients.\n\n" +
          "Below causal the guarantees stop describing the system and start describing one client's session. " +
          "Two of the four get rows below. **Monotonic writes** means a client's " +
          "own writes land in the order it issued them, and **writes-follow-reads** means a write you make " +
          "after reading something lands after what you read. Jepsen bundles the first, second and third of " +
          "those four as **PRAM**. At the floor, **eventual consistency** promises only " +
          "convergence — replicas agree once the writes stop arriving, and says nothing about any read before " +
          "then.",
      },
      {
        kind: "comparison",
        columns: ["Model", "What it forbids", "Availability under a partition", "Where you meet it"],
        caption:
          "Availability classes for the named models are Jepsen's, for an asynchronous network: unavailable = " +
          "some nodes cannot make progress; sticky available = every client attached to a healthy replica " +
          "can, so long as it never moves; totally available = every client can, always. Eventual consistency " +
          "is not on Jepsen's map — its class is the trivial one.",
        rows: [
          {
            label: "Strict serializable",
            cells: [
              "Any history not equivalent to running whole transactions one at a time, in real-time order",
              "Unavailable",
              "Spanner, whose *external consistency* Google documents as its strictest guarantee",
            ],
          },
          {
            label: "Linearizable",
            cells: [
              "Returning a value older than the last completed write to that object",
              "Unavailable",
              "DynamoDB reads with `ConsistentRead: true`; an S3 `GET` after a `PUT`",
            ],
          },
          {
            label: "Sequential",
            cells: [
              "Two processes disagreeing about the order of the same operations",
              "Unavailable",
              "Chiefly a memory-model term — Lamport defined it for multiprocessors, not for stores",
            ],
          },
          {
            label: "Causal",
            cells: [
              "Observing an effect before its cause — the reply before the question",
              "Sticky available",
              "MongoDB causally consistent sessions",
            ],
          },
          {
            label: "Read-your-writes (and PRAM above it)",
            cells: [
              "A client failing to observe its own completed write",
              "Sticky available",
              "Session modes: MongoDB sessions, Cosmos DB's `Session` level",
            ],
          },
          {
            label: "Monotonic reads",
            cells: [
              "One client's successive reads moving backwards in time",
              "Totally available",
              "Rarely sold alone; arrives bundled inside a session guarantee",
            ],
          },
          {
            label: "Eventual",
            cells: [
              "Nothing about any individual read — only permanent divergence after writes stop",
              "Totally available",
              "DynamoDB's default read mode; S3 bucket configuration",
            ],
          },
        ],
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "The models are this page's; the ground around them belongs to neighbours. Why a partition forces " +
          "the choice at all — and why the latency half of the bill arrives on healthy days too — is " +
          "[[cap-theorem]]. Once the vocabulary is in hand, the decision procedure is " +
          "[[strong-vs-eventual-consistency|strong vs eventual consistency]]. When replicas do diverge, the " +
          "machinery that reconciles them is [[vector-clocks|vector clocks]] and [[crdts|CRDTs]]; how the data " +
          "reached a second node at all is [[read-replicas|read replicas]].",
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "One shopping cart, three models",
        body:
          "Amazon's cart is the canonical case because the Dynamo paper argues the requirement out loud: an " +
          "*add to cart* must never be rejected, so the store is designed to be **always writeable**. A " +
          "partition therefore produces two live carts, and the merge happens at read time " +
          "([[cap-theorem]] walks that choice and prices it). What matters here is the model it lands on: " +
          "eventual, with the anomaly pushed into the merge rule. Nobody waits during a partition; someone " +
          "writes and owns that rule, and it is lossy in one direction.",
      },
      {
        kind: "prose",
        body:
          "Now the same cart with only a session guarantee. The customer adds an item and immediately reloads " +
          "the page; the reload is load-balanced onto a replica that hasn't received the write yet.",
      },
      {
        kind: "sequence",
        actors: ["Client", "Primary", "Replica"],
        caption: "A read-your-writes violation, and the cheapest fix for it.",
        steps: [
          { from: "Client", to: "Primary", label: "POST /cart — add item" },
          { from: "Primary", to: "Client", label: "200 OK", dashed: true },
          {
            from: "Primary",
            to: "Replica",
            label: "replicate",
            note: "async — arrives after the read below",
            dashed: true,
          },
          { from: "Client", to: "Replica", label: "GET /cart", note: "balancer picked the nearest replica" },
          { from: "Replica", to: "Client", label: "cart without the item", dashed: true },
          {
            from: "Client",
            to: "Primary",
            label: "GET /cart — session pinned",
            note: "fix: route reads to the primary for a few seconds after a write",
          },
        ],
      },
      {
        kind: "prose",
        body:
          "The fix is routing, not a stronger database — and the guarantee is configuration-shaped, so it is " +
          "easy to believe you have it when you don't. MongoDB's docs are explicit: a causally consistent " +
          "session delivers all four session guarantees *with durability* only with read concern `majority` **and** write concern " +
          "`majority`; drop the read concern to `local` and read-own-writes goes with it.",
      },
      {
        kind: "prose",
        body:
          "Pinning is not free either. The pin has to outlast the replication lag to be worth anything, and " +
          "every pinned read lands back on the primary — the node the replicas were added to spare. A session " +
          "guarantee is cheap because it is narrow: Jepsen is explicit that it covers one client's own view " +
          "and promises nothing about what a second client sees of that write.",
      },
      {
        kind: "prose",
        body:
          "Third version: pay for the strong read. AWS documents DynamoDB's eventually consistent reads as the " +
          "default, and as **half the cost** of strongly consistent ones. So `ConsistentRead: true` is a 2× " +
          "read bill — and it isn't offered everywhere: AWS supports strongly consistent reads on tables and " +
          "local secondary indexes, but not on global secondary indexes or streams.\n\n" +
          "S3 makes the same choice per resource rather than per request. AWS documents strong " +
          "read-after-write for `PUT` and `DELETE` of objects in all Regions, with concurrent writes to one " +
          "key resolved by latest timestamp. *Bucket configuration*, though, stays eventually consistent — " +
          "the docs suggest waiting 15 minutes after enabling versioning before writing.\n\n" +
          "Three models, one cart, and the model was never a property of the database. Azure Cosmos DB makes " +
          "that literal: Microsoft documents five named levels, set as an account default and overridable on " +
          "an individual request.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What you pay", "When the bill arrives"],
        rows: [
          {
            label: "Linearizable reads",
            cells: [
              "A round trip to the leader or a quorum on every read — and in DynamoDB, twice the read charge",
              "On read-heavy and cross-region paths, where that hop *is* the p99; and when the read path turns out to be a secondary index, where AWS doesn't offer the flag at all",
            ],
          },
          {
            label: "Causal and session guarantees",
            cells: [
              "Stickiness — they hold only while the client keeps talking to the same replica",
              "The moment a load balancer re-routes a client mid-session, or the pinned replica restarts",
            ],
          },
          {
            label: "Eventual consistency",
            cells: [
              "A merge rule, written by you, in application code",
              "The first time two clients write one key concurrently. Last-write-wins is a merge rule, and under clock skew it silently discards the loser",
            ],
          },
          {
            label: "Any weak model",
            cells: [
              "No staleness bound unless you measure one yourself",
              "*Eventually* carries no deadline: AWS describes DynamoDB global-table replication as typically within a second — a typical, not a guarantee. Alert on replication lag",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "One of these is routinely mispriced. The latency of a strong read is not a partition-time cost — " +
          "it is charged on every healthy day, which is the argument [[cap-theorem]] carries and this page " +
          "won't repeat.\n\n" +
          "Read the table as a bill rather than a menu. Every row is paid in a different currency — money on " +
          "the first, routing discipline on the second, engineering time on the third, and a monitoring " +
          "obligation on the fourth — which is why they are so rarely traded against each other honestly.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Validating on an idle cluster.** The staleness window is milliseconds when nothing is happening " +
            "and unbounded under load, failover or partition — the anomaly is always available, only the " +
            "window changes. Reproduce it with replication lag *and* with fault injection, not one or the " +
            "other.",
          "**Believing you have a session guarantee because you opened a session.** MongoDB's causal-consistency " +
            "matrix is the cautionary table: read concern `local` with write concern `majority` gives you " +
            "monotonic writes and *none* of the other three. The guarantee comes from the concern pair, not " +
            "from the session object.",
          "**Assuming a session guarantee protects the second reader.** Read-your-writes is scoped to the " +
            "process that did the write; Jepsen is explicit that another client reading the same key gets no " +
            "promise at all. Two users watching the same page are two sessions.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "**Can this read be stale, and for how long?** Answer per data class, not per system. The ledger " +
            "balance is linearizable and pays the leader round trip; the timeline is eventual and a few seconds " +
            "behind is fine; the user's own post has to be read-your-writes, so pin that session to the primary " +
            "briefly. Naming **read-your-writes** is the signal — most answers stop at strong and eventual.",
          "**Users say the like count jumps around. What's happening?** Monotonic reads violated by routing " +
            "successive reads to replicas at different points in the log. Fixes in cost order: sticky routing, " +
            "a session token carrying the last-read position, or serving the counter from one authority.",
          "**You've said the system is AP. What does the application now owe you?** A merge rule, and a named " +
            "one: last-write-wins, union-merge, or a [[crdts|CRDT]] whose merge is commutative so a retried " +
            "delivery changes nothing. The follow-up is usually what happens to a delete, and Dynamo's " +
            "resurfacing cart item is the answer worth having ready.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "Jepsen — Read your writes (one model's page, as a template for the rest)",
            url: "https://jepsen.io/consistency/models/read-your-writes",
            type: "article",
          },
          {
            label: "MongoDB — Causal consistency and read and write concerns",
            url: "https://www.mongodb.com/docs/manual/core/causal-consistency-read-write-concerns/",
            type: "doc",
          },
          {
            label: "Azure Cosmos DB — Consistency levels (five named levels, per-request override)",
            url: "https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels",
            type: "doc",
          },
          {
            label: "Google Cloud — Spanner: TrueTime and external consistency",
            url: "https://cloud.google.com/spanner/docs/true-time-external-consistency",
            type: "doc",
          },
        ],
      },
    ],
  },
  sources: [
    { label: "Jepsen — Consistency Models (the hierarchy and its availability classes)", url: "https://jepsen.io/consistency/models" },
    {
      label: "AWS — DynamoDB read consistency",
      url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html",
    },
    {
      label: "AWS — Amazon S3 data consistency model",
      url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
    },
    {
      label: "DeCandia et al. — Dynamo: Amazon's Highly Available Key-value Store (SOSP 2007)",
      url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
    },
  ],
} satisfies LearnTopic;
