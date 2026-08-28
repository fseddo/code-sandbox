import type { LearnTopic } from "@/learn/data/topic";

export const capTheorem = {
  slug: "cap-theorem",
  title: "CAP theorem",
  category: "systems",
  archetype: "distinction",
  parent: "scalability",
  summary:
    "Not a menu of three. A conditional: while the network is dropping messages between replicas, refuse some requests or answer with data you cannot prove is current.",
  tags: ["distributed-systems", "database", "architecture"],
  priority: "high",
  estimatedMinutes: 30,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "The **CAP theorem** is a claim about replicated data under network failure. Eric Brewer conjectured " +
          "it in 2000; Gilbert and Lynch proved it in 2002. A store that keeps more than one copy of the same " +
          "data cannot hold **consistency**, **availability** and **partition tolerance** at once.\n\n" +
          "Stated as a menu of three, that is close to useless. Stated as a conditional, it is the sharpest " +
          "tool in distributed systems: *while the network is losing messages between replicas, you must " +
          "either refuse some requests or answer with data you cannot prove is current.*",
      },
      {
        kind: "prose",
        body:
          "Both halves of the cost are real. Choosing consistency costs availability, but only inside the " +
          "partition window — outside it you pay nothing. Choosing availability costs reconciliation: a merge " +
          "rule, plus compensation for whatever happened while the copies disagreed. That bill comes due at " +
          "design time, because a system that never planned for divergence cannot un-fork it afterwards.\n\n" +
          "This is where redundancy sends its invoice. A single copy has no CAP problem at all. The second " +
          "copy buys survivability and, in the same stroke, makes *every replica agrees* and *every replica " +
          "answers* jointly unsatisfiable the moment a link drops — the concrete case of the trade " +
          "[[what-is-system-design|system design]] is built on.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Which one a design wants is usually legible in the prompt. Data carrying an invariant — a balance " +
          "that must not go negative, a seat that must not be double-booked, a username that must be unique — " +
          "is asking for C. A feed, a cart, a like count, a profile: staleness is cheap there and A is the " +
          "default.\n\n" +
          "Ask it per operation rather than per system: the same store usually runs both, and the question is " +
          "which of *this* request's answers you would rather be wrong.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "The three properties, as the proof states them",
        body:
          "Gilbert and Lynch fix all three terms tightly, and the tightness is what makes the theorem say " +
          "anything at all.\n\n" +
          "**Consistency** is *atomic*, equivalently linearizable: there must exist a total order on all " +
          "operations such that each looks as if it completed at a single instant. **Availability** admits no " +
          "exceptions and no deadline — *every request received by a non-failing node must result in a " +
          "response*, with no bound on when. Not usually, " +
          "not within some target: every request, every reachable node. **Partition tolerance** means the " +
          "network may lose arbitrarily many messages between nodes and the guarantees must still hold.\n\n" +
          "Read that way they are not three interchangeable options. P is not a property you buy; it is a " +
          "hazard the network hands you. What is left is the conditional — while messages are being lost, you " +
          "get C or A.",
      },
      {
        kind: "comparison",
        caption: "The three terms, on the axes that actually separate them.",
        columns: ["", "Consistency", "Availability", "Partition tolerance"],
        rows: [
          {
            label: "Where it is configured",
            cells: [
              "Quorum sizes and consistency levels, set per call",
              "Not set directly — it is whatever C leaves behind",
              "Not a setting at all; a fact about the deployment",
            ],
          },
          {
            label: "Scope of the guarantee",
            cells: [
              "One key or one transaction at a time",
              "The whole node: it answers, or it does not",
              "The whole cluster, for as long as messages are lost",
            ],
          },
          {
            label: "How a violation shows up",
            cells: [
              "A client reads a value another client already overwrote",
              "A reachable node errors, hangs, or never replies",
              "Both sides act as if they were the whole cluster",
            ],
          },
          {
            label: "Give it up and you get",
            cells: [
              "AP: answers everywhere, divergence to reconcile",
              "CP: a provably current answer, or none",
              "A design that is only honest on a single node",
            ],
          },
        ],
      },
      {
        kind: "prose",
        heading: "PACELC — the branch that runs when nothing is broken",
        body:
          "CAP speaks only during a partition, which leaves most of a system's life uncovered. Daniel Abadi's " +
          "**PACELC** supplies the missing clause, verbatim:\n\n" +
          "*\"if there is a partition (P), how does the system trade off availability and consistency (A and " +
          "C); else (E), when the system is running normally in the absence of partitions, how does the " +
          "system trade off latency (L) and consistency (C)?\"*\n\n" +
          "His 2012 paper classifies systems on both letters: default Dynamo, Cassandra and Riak as " +
          "**PA/EL**; VoltDB/H-Store, Megastore and BigTable/HBase as **PC/EC**; MongoDB as **PA/EC**; PNUTS " +
          "as **PC/EL**. Products drift, so quote those as the paper's snapshot rather than today's defaults.\n\n" +
          "Abadi and Brewer are not opponents. Both hold that the classic framing is too coarse, and they " +
          "differ on which axis it under-serves. Brewer adds what a system does during and after the " +
          "partition; Abadi adds that replication charges consistency for latency even when nothing is " +
          "broken — *\"CAP is only one of the two major reasons that modern DDBSs reduce consistency.\"*",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "CAP names the axis but not the points on it. Which guarantee an AP store still offers, and what " +
          "linearizable actually promises, belong to [[consistency-models|consistency models]]; the *pick " +
          "one for this workload* framing belongs to " +
          "[[strong-vs-eventual-consistency|strong vs eventual consistency]]. How a " +
          "partition is detected and bounded is [[network-partitions|network partitions]].",
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "Redis Cluster: the minority side gives up on a timer",
        body:
          "**Redis Cluster** shards across masters, replicates asynchronously, and documents its partition " +
          "behaviour rather than claiming a letter. Split it, and the majority side promotes a replica of any " +
          "master it can no longer reach. The minority side keeps accepting writes for up to `NODE_TIMEOUT`; " +
          "those writes are acknowledged and then thrown away when the old master rejoins as a replica of the " +
          "promoted one.\n\n" +
          "So the same cluster is AP for a bounded window, with acknowledged-write loss, and CP afterwards. " +
          "The spec also prices the exposure. Take five masters, each with one replica. After one node is " +
          "lost, just one of the remaining `2N − 1` = 9 nodes is its replica, so a second loss hits it with " +
          "probability 1/9 — about 11% — and takes a shard down.",
      },
      {
        kind: "sequence",
        caption: "One write, one partition, two branches. The reconcile step exists only on the AP branch.",
        actors: ["Client A", "Replica 1", "Replica 2", "Client B"],
        steps: [
          { from: "Client A", to: "Replica 1", label: "write x = 2" },
          {
            from: "Replica 1",
            to: "Replica 2",
            label: "replicate x = 2",
            note: "message lost — the partition starts here",
            dashed: true,
          },
          {
            from: "Replica 1",
            to: "Client A",
            label: "AP: ack now · CP: no ack, the write blocks or fails",
            dashed: true,
          },
          { from: "Client B", to: "Replica 2", label: "read x" },
          {
            from: "Replica 2",
            to: "Client B",
            label: "AP: x = 1, stale · CP: error, cannot prove it is current",
            dashed: true,
          },
          {
            from: "Replica 1",
            to: "Replica 2",
            label: "link heals — reconcile",
            note: "AP owes a merge rule here; CP has nothing to merge",
          },
        ],
      },
      {
        kind: "prose",
        heading: "Dynamo: always writeable",
        body:
          "Amazon's **Dynamo** takes the other branch by policy. Its shopping-cart workload made a rejected " +
          "write the worse outcome — the paper's reasoning is that *\"rejecting customer updates could result " +
          "in a poor customer experience\"* — so *add to cart* has to succeed even when replicas cannot reach " +
          "each other. Conflicting versions are retained, tagged with [[vector-clocks|vector clocks]], and " +
          "reconciled when something reads them; for a cart the merge rule is union, which can resurrect a " +
          "removed item but never drops an added one.\n\n" +
          "Its quorum is a dial rather than a stance: the paper's common configuration is `(N, R, W) = " +
          "(3, 2, 2)`, so `R + W > N` and the read and write sets overlap, with both kept under `N` for " +
          "latency. Same partition as Redis Cluster, opposite answer, and both are published positions rather " +
          "than folklore.",
      },
      {
        kind: "prose",
        heading: "Spanner: technically CP, effectively CA",
        body:
          "Brewer's 2017 note on **Spanner** is the useful edge case, and he states the classification " +
          "himself: *\"during (some) partitions, Spanner chooses C and forfeits A. It is technically a CP " +
          "system.\"* What follows is an empirical argument, not a loophole — Google's private network makes " +
          "that forced choice rare enough that users can treat the system as CA.\n\n" +
          "The evidence he gives: *\"there were no events in which a large set of clusters were partitioned " +
          "from another large set of clusters\"*, the network accounts for 7.6% of Spanner incidents, and " +
          "Chubby measures 99.99958% availability over outages of 30 seconds or more.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "CP — refuse during the partition", "AP — answer during the partition"],
        rows: [
          {
            label: "What the minority side does",
            cells: ["Rejects writes, and usually reads too", "Serves and accepts writes locally"],
          },
          {
            label: "What the client sees",
            cells: [
              "Errors and timeouts, never a stale committed value",
              "An answer — possibly stale, possibly one of several versions",
            ],
          },
          {
            label: "Work owed afterwards",
            cells: ["None; state never forked", "Reconciliation and compensation"],
          },
          {
            label: "Where it bites",
            cells: [
              "An invariant-free workload pays availability for nothing",
              "Every invariant needs a merge rule, and some have none",
            ],
          },
          {
            label: "When the cost ends",
            cells: [
              "Once the link heals and a leader is re-elected — the election itself is the CP branch's lingering cost",
              "Later: divergence outlives the partition until something merges it",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "Picking A is not picking *do nothing*. Brewer's 2012 account gives the AP side a three-phase job: " +
          "detect the start of the partition, enter an explicit partition mode that limits which operations " +
          "run, and then run a recovery that restores state and makes good the mistakes committed while " +
          "divergent.\n\n" +
          "His ATM example is the honest version. Withdrawals are capped at a small amount rather than " +
          "blocked, and overdrafts that slip through are settled afterwards with a fee and an expectation of repayment. The " +
          "invariant is not preserved — it is restored, and something outside the system absorbs the gap. An " +
          "AP design missing that second half is an outage with extra steps.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**\"Pick two of three\" — and its sequel, \"we're a CA system.\"** You never pick P; the network " +
            "hands it to you. Brewer junked the phrasing himself in 2012: *\"the '2 of 3' formulation was " +
            "always misleading because it tended to oversimplify the tensions among properties.\"* Under the " +
            "proof's definitions CA means *not partition tolerant* — undefined behaviour the first time a link " +
            "drops — so one node is the only honest CA deployment.",
          "**Pinning a letter on a whole database.** The call is per operation, and most stores expose the " +
            "dial: Dynamo's `R` and `W`, Cassandra's consistency levels, MongoDB's read and write concerns. " +
            "One cluster can run a CP write path beside an AP read path.",
          "**Confusing CAP's A with an availability target.** The theorem admits no percentile and no " +
            "measurement window; a 99.99% figure is a fraction of time computed over one. Different claim, " +
            "different arithmetic, and [[availability]]'s subject rather than this page's.",
          "**Reading CAP's C as ACID's C.** ACID's consistency says a transaction leaves the declared " +
            "invariants intact; CAP's is linearizability, a claim about ordering across replicas. A " +
            "single-node Postgres is fully ACID-consistent and has no CAP C to discuss at all " +
            "([[acid-transactions|ACID transactions]] covers the other one).",
          "**Picturing a partition as a severed cable.** Brewer's operational definition is a clock: " +
            "*\"a partition is a time bound on communication. Failing to achieve consistency within the time " +
            "bound implies a partition.\"* To the node waiting on a timeout, slow and dead are one event — and the " +
            "cause is more often a bad deploy, a firewall rule or an overloaded box than a cut cable.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "**\"Is this design CP or AP?\"** The strong answer declines that granularity and re-asks per " +
            "operation: the payment ledger is CP, because during a partition an error beats a double-spend; " +
            "the catalogue and the view counts are AP, because stale is fine. Then name what the AP half " +
            "owes — a merge rule, and compensation for what happened while divergent.",
          "**\"Spanner is consistent and highly available. Doesn't that break CAP?\"** No, and the fact is the " +
            "cheap half of the answer. Spend it on the caveat: *effectively CA* is bought with a privately " +
            "owned network and a measured partition rate. None of that transfers to a design running over the " +
            "public internet.",
          "**\"What does CAP say about your design right now, with no partition?\"** Nothing — and saying so " +
            "plainly is the strongest move available on this topic. Follow it with PACELC's else-branch: the " +
            "tradeoff that is live today is consistency against latency, and it shapes far more of the design " +
            "than the partition branch ever will.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "Redis Cluster specification — availability and partition behaviour",
            url: "https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/",
            type: "doc",
          },
          {
            label: "Dynamo: Amazon's Highly Available Key-value Store (SOSP 2007)",
            url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
            type: "article",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label:
        "Gilbert & Lynch — Brewer's Conjecture and the Feasibility of Consistent, Available, " +
        "Partition-Tolerant Web Services (2002)",
      url: "https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf",
    },
    {
      label: "Eric Brewer — CAP Twelve Years Later: How the \"Rules\" Have Changed (2012)",
      url: "https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/",
    },
    {
      label:
        "Daniel Abadi — Consistency Tradeoffs in Modern Distributed Database System Design (PACELC, 2012)",
      url: "https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf",
    },
    {
      label: "Eric Brewer — Spanner, TrueTime & the CAP Theorem (Google, 2017)",
      url: "https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45855.pdf",
    },
  ],
} satisfies LearnTopic;
