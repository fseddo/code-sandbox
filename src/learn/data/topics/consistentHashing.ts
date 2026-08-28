import type { LearnTopic } from "@/learn/data/topic";

export const consistentHashing = {
  slug: "consistent-hashing",
  title: "Consistent hashing",
  category: "systems",
  archetype: "mechanism",
  parent: "scalability",
  summary:
    "Why `hash(key) % n` empties your cache the moment you add a server, how a hash ring bounds the damage " +
    "to about K/n keys, and what virtual nodes cost you in exchange.",
  tags: ["distributed-systems", "scalability", "caching", "database"],
  priority: "high",
  estimatedMinutes: 35,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "**Consistent hashing** puts keys and node identifiers into the same circular hash space and gives " +
          "each key to the first node token clockwise from it. What that buys is a **membership change that " +
          "relocates a bounded slice of the keys** — on the order of `K/n` for `K` keys over `n` nodes — " +
          "rather than nearly all of them. Add a cache server and the other servers keep what they were " +
          "holding.\n\n" +
          "You pay in evenness and in state. A plain ring hands out arcs of wildly different sizes, so the " +
          "technique needs **virtual nodes** to be usable at all; and every client or router has to hold the " +
          "same picture of who owns what. It also fixes only structural imbalance — the count of keys per " +
          "machine, never the traffic aimed at one key.",
      },
      {
        kind: "numbers",
        heading: "What a membership change costs, both ways",
        rows: [
          {
            quantity: "`mod n`, 4 → 5 nodes",
            value: "80% of keys move",
            derivation:
              "A key stays put only when `h mod 4 == h mod 5`. Across any 20 consecutive hashes that holds " +
              "for exactly 4, so one key in five survives and four in five relocate.",
          },
          {
            quantity: "`mod n`, 9 → 10 nodes",
            value: "90%",
            derivation: "Same argument one size up: 1 hash in 10 survives, so 9 in 10 relocate.",
          },
          {
            quantity: "`mod n`, 99 → 100 nodes",
            value: "99%",
            derivation:
              "In general `1/(n+1)` survive — here 1 in 100. The scheme degrades as the fleet grows, the " +
              "opposite of what a scaling mechanism should do.",
          },
          {
            quantity: "Ring, 4 → 5 nodes",
            value: "~20%",
            derivation:
              "The joining node's tokens claim about a fifth of the circle; keys outside those arcs never see " +
              "the change.",
          },
          {
            quantity: "Ring, 9 → 10 nodes",
            value: "~10%",
            derivation: "A tenth of the circle changes hands. Karger et al. prove only that the movement is the minimum needed to keep the load balanced — they call it *smoothness*; the `K/n` form is the standard restatement, as on Wikipedia.",
          },
          {
            quantity: "Ring, 1 of 10 nodes fails",
            value: "~10%",
            derivation: "The departed node held ~`K/10`; its arcs pass to their clockwise successors, and nothing else moves.",
          },
          {
            quantity: "Origin read load right after a 10th cache node joins",
            value: "~90k/s with `mod n` · ~10k/s with a ring",
            derivation:
              "Assumed inputs: 100k reads/s at a 99% hit rate, so 1k misses/s in steady state. Rehashing 90% " +
              "of the keys turns 90k/s cold against the ring's 10k/s — 90× versus 10× normal origin load.",
          },
        ],
        caption: "The first three rows and rows 4–6 are the same event under two schemes. That gap is the whole argument.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "The cue is a **fleet of interchangeable stateful nodes whose size will change** — a cache tier, a " +
          "set of shards, a partition assignment — under autoscaling, failure or growth. Stateful matters: if " +
          "the nodes hold nothing, routing by key buys you nothing. Changing matters more, because the entire " +
          "value of the technique is in what a membership change *doesn't* cost.\n\n" +
          "The cue against it is a datastore that already partitions for you. DynamoDB, Cassandra and Redis " +
          "Cluster do their own key placement, and the right move is one clause naming that it happens " +
          "underneath before you move on. That is the deferral [[system-design-interview-framework]] " +
          "promised: hold this back until the working set outgrows a single cache node, then reach for it in " +
          "the layer you are actually building.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "The ring and its rivals",
        body:
          "**The ring.** Hash node identifiers and keys into one fixed space — a hash function's output read " +
          "as a circle — and walk clockwise from the key to the first node token. A joining token takes its arc " +
          "from the successor it lands in front of, and nobody else is touched. Karger et al. introduced this " +
          "for web caching in 1997; the property they proved is that a join or a departure disturbs only the " +
          "arcs adjacent to it.\n\n" +
          "**Virtual nodes.** Give each physical machine many tokens rather than one. Dynamo states three " +
          "gains. A failed machine's load disperses evenly over the survivors instead of landing on one " +
          "neighbour. A joining machine draws a roughly equal amount from every existing one. And the token " +
          "count per machine can be set from its capacity, so a bigger box takes more of the circle.\n\n" +
          "**Rendezvous (HRW) hashing.** Drop the circle: score every node for the key with " +
          "`hash(key, node)` and hand the key to the highest score. Remove a node and each of its keys is " +
          "promoted to its own runner-up — minimal movement again, with no ring to distribute.\n\n" +
          "**Jump consistent hash.** Lamping and Veach's algorithm computes a bucket number arithmetically in " +
          "about five lines with no stored state. Its published limitation is the deciding one. The buckets " +
          "*\"must be numbered sequentially, which makes it more suitable for data storage applications than " +
          "for distributed web caching\"* — so you can shrink the count from the end, but you cannot pull " +
          "node 7 out of 20.\n\n" +
          "**Fixed partitions.** Hash into a large, permanently fixed number of slots and keep a slot→node " +
          "map; rebalancing moves whole slots and never re-hashes a key. Dynamo calls this Strategy 3, and " +
          "it is what Redis Cluster ships.",
      },
      {
        kind: "comparison",
        columns: ["", "Keys moved on a membership change", "Lookup cost", "Client-side state", "Best fit"],
        rows: [
          {
            label: "Plain ring (one token per node)",
            cells: [
              "~`K/n`, but the arcs are uneven",
              "`O(log n)` binary search",
              "the `n` tokens, sorted",
              "explaining the idea; superseded in practice by the row below",
            ],
          },
          {
            label: "Ring + virtual nodes",
            cells: [
              "~`K/n`, spread over many survivors",
              "`O(log V)` for `V` tokens",
              "all `V` tokens, sorted",
              "elastic clusters — Dynamo, Cassandra",
            ],
          },
          {
            label: "Rendezvous (HRW)",
            cells: [
              "~`K/n`; each key drops to its runner-up",
              "`O(n)` — score every node",
              "just the node list",
              "small `n`, where no ring has to be kept in sync",
            ],
          },
          {
            label: "Jump consistent hash",
            cells: [
              "minimal, and better balanced than the ring per the paper",
              "`O(log n)` arithmetic, no table",
              "none beyond the bucket count",
              "storage clusters resized only at the tail",
            ],
          },
          {
            label: "Fixed slots",
            cells: [
              "whole slots move; no key is ever re-hashed",
              "one array lookup",
              "a slot map, or none if the server redirects",
              "a cluster whose ceiling you can pick up front",
            ],
          },
        ],
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "This page answers *where a key lives*. Which field you hash is a different question, owned by " +
          "**[[sharding|sharding]]** — a shard key that puts an entire tenant behind one value lands that " +
          "tenant on one ring position however good the hash is. " +
          "**[[sharding-vs-partitioning|Sharding vs partitioning]]** untangles the vocabulary, and " +
          "**[[read-replicas|read replicas]]** covers what happens to the copies once the ring has chosen " +
          "their homes. Picking among *stateless* servers is **[[load-balancing-algorithms|load-balancing " +
          "algorithms]]**, where key affinity is a constraint rather than the goal.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "typescript",
        caption:
          "`hash` is any well-distributed 32-bit hash. The search runs over `V = nodes × vnodesPerNode` " +
          "tokens, so a lookup is `O(log V)`; the `% length` on the last line is the only place the circle is " +
          "actually implemented.",
        source: `type Ring = { tokens: number[]; owners: string[] }; // parallel arrays, sorted by token

const buildRing = (nodes: string[], vnodesPerNode: number): Ring => {
  const entries = nodes.flatMap((node) =>
    Array.from({ length: vnodesPerNode }, (_, i) => ({ token: hash(\`\${node}#\${i}\`), node })),
  );
  entries.sort((a, b) => a.token - b.token);
  return { tokens: entries.map((e) => e.token), owners: entries.map((e) => e.node) };
};

const ownerOf = (ring: Ring, key: string): string => {
  const target = hash(key);
  let lo = 0;
  let hi = ring.tokens.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (ring.tokens[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return ring.owners[lo % ring.tokens.length]; // past the last token, wrap to the first
};`,
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "Dynamo's ring, and Redis Cluster's refusal to have one",
        body:
          "Amazon's **Dynamo** is the design most ring questions are really about, so walk one key through " +
          "it. The key hashes to a ring position and the first token clockwise names its **coordinator**, " +
          "which stores the item and replicates it to the next `N−1` nodes around the circle. The paper calls " +
          "that set the key's **preference list**, and records one wrinkle worth repeating. The next `N` ring " +
          "positions may belong to fewer than `N` machines, so Dynamo skips positions until the list holds " +
          "`N` distinct physical nodes.\n\n" +
          "That list is then read and written by quorum. The paper reports `(N, R, W) = (3, 2, 2)` as the " +
          "common configuration across Dynamo instances, measured on a live system running \"a couple hundred " +
          "nodes\": three copies, a read waits for two, a write waits for two. The quorum arithmetic belongs " +
          "to [[consistency-models|consistency models]]; what matters here is that the ring chose the three " +
          "machines and the quorum sits on top of that choice.\n\n" +
          "Now take a machine out. Because its tokens sit all over the circle, no single survivor inherits " +
          "its whole share. A one-token-per-machine ring would hand that entire range to the clockwise " +
          "neighbour, which is why the plain version is a teaching aid rather than a design.\n\n" +
          "**Redis Cluster solves the same problem without a ring**, and that contrast is worth having " +
          "ready. Its key space is a permanently fixed 16,384 slots — `HASH_SLOT = CRC16(key) mod 16384` — " +
          "with each master owning a subset. Resharding hands whole slots between masters, and a client that " +
          "asks the wrong node gets a `MOVED` redirect and updates its map. No token placement and no " +
          "distribution luck; the price is a ceiling, since the slot count caps the cluster at 16,384 masters " +
          "and the spec suggests staying nearer 1,000 nodes. Elasticity on one side of the axis, " +
          "predictability on the other.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "The cost", "When it bites", "What you do about it"],
        rows: [
          {
            label: "Virtual node overhead",
            cells: [
              "Cassandra's docs: every token adds up to `2 × (RF − 1)` neighbours on the ring, so more " +
                "more combinations of node failures can cost availability for part of it, and \"cluster-wide maintenance " +
                "operations are often slowed\"",
              "High token counts on a replicated store",
              "Fewer, better-placed tokens — Cassandra 3.x's deterministic allocator against 2.x's 256 random ones",
            ],
          },
          {
            label: "Access skew untouched",
            cells: [
              "Balances keys per machine, not requests per key",
              "Any Zipf-headed workload — one celebrity account, one trending video",
              "Replicate or salt that key; not more tokens",
            ],
          },
          {
            label: "Token-map state",
            cells: [
              "Every node and client carries the ring, and gossips changes to it — Dynamo measured its " +
                "Strategy 3 as cutting membership state by three orders of magnitude against Strategy 1",
              "High token counts across a large fleet",
              "Fixed partitions rather than free tokens, or a server-side map clients don't hold at all",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "One cost the table can't hold, because it is a duration rather than a quantity: on a datastore the " +
          "bounded reshuffle still has to *move bytes*. A node joining a cluster holding terabytes owns its " +
          "new range the moment the map changes, but cannot serve it until the transfer finishes — so the " +
          "window between those two events is a period of degraded reads that no amount of token tuning " +
          "removes.\n\n" +
          "The deal is worth taking when machines come and go and each holds real data. It is a bad one when " +
          "the fleet is static — you have taken on shared state to solve a problem you don't have.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Hashing an ephemeral identity.** Tokens derived from a pod IP or an auto-generated hostname move " +
            "every restart, so a rolling deploy reshuffles the circle it was supposed to hold still. Hash a " +
            "durable node id you assign yourself.",
          "**Quoting `K/n` without saying which `n`.** A join relocates about `1/(n+1)` of the keys and a " +
            "departure about `1/n`. \"Consistent hashing barely moves anything\" collapses the moment someone " +
            "names a three-node cluster, where a quarter of the keys change owner.",
          "**Assuming the ring moves data.** It reassigns *ownership*; on a database something still has to " +
            "stream those ranges to their new owners, and that transfer is the real cost and duration of a " +
            "scale-up. On a cache nothing is copied — the moved keys are simply misses.",
          "**Treating the token count as a live knob.** Changing it re-places every token on the circle, so " +
            "it is a data migration rather than a config edit. Size it when you size the cluster.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "**\"Why not just `hash(key) % n`?\"** Lead with a number, not with the word *consistent*. State the " +
            "fraction that relocates at the cluster size you just proposed, say what that does to the tier " +
            "behind the cache, then give the bound the ring replaces it with. Naming the technique reads as " +
            "recall; the fraction reads as understanding.",
          "**\"One key is taking 40% of the reads — add more virtual nodes?\"** No, and the *no* is the depth " +
            "signal: tokens even out how many keys a machine holds, and a celebrity key is one key on one " +
            "token however many tokens exist. What works instead: replicate that key across several nodes " +
            "and spread the reads, salt it into `k` suffixes and scatter-gather, or pin it in a " +
            "process-local cache in front of the tier. Standard practice rather than a documented feature " +
            "of any one store.",
          "**\"How many virtual nodes?\"** There is no universal figure, and saying so beats inventing one. " +
            "Cassandra's docs record 256 tokens per node under 2.x's random allocation, and say 3.x's " +
            "deterministic allocator reaches an optimally balanced ring with a much lower count per machine " +
            "— without publishing that count.",
          "**\"Is this even worth bringing up?\"** The prep sources converge, so don't stage a debate. " +
            "Hello Interview: because managed stores partition for you, *\"you typically just need to " +
            "mention that these systems use consistent hashing (or a form of it) under the hood\"*, saving " +
            "the deep dive for infrastructure prompts. Say one clause when you pick a managed store, and go " +
            "deep only when the thing you are being asked to build *is* the router, the cache tier or the " +
            "shard map.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "**Disagreement during the change itself.** While a join propagates, some clients hold the new " +
            "membership and some the old, so a value can be written to one owner and read from another. " +
            "Server-side slot maps sidestep this by making one side authoritative and redirecting the other.",
          "**The cold burst on the successor.** The arc that changes hands arrives as a block of simultaneous " +
            "misses aimed at whatever sits behind the cache — a small fraction of keys can still be a large " +
            "instantaneous spike. See [[cache-stampede|cache stampedes]].",
          "**A flapping node.** A machine that fails health checks intermittently drags its arcs back and " +
            "forth, and on a database each flip is another range transfer. Rings are paired with membership " +
            "detection that is deliberately slow to declare death — see [[heartbeats|heartbeats]].",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "Consistent hashing (Wikipedia) — where the `K/n` restatement comes from, plus the list of systems using it",
            url: "https://en.wikipedia.org/wiki/Consistent_hashing",
            type: "article",
          },
          {
            label: "Apache Cassandra — Dynamo architecture: token rings, vnodes and their cost",
            url: "https://cassandra.apache.org/doc/stable/cassandra/architecture/dynamo.html",
            type: "doc",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "DeCandia et al. — Dynamo: Amazon's Highly Available Key-value Store (SOSP 2007)",
      url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
    },
    {
      label: "Redis cluster specification — 16,384 hash slots, CRC16, MOVED redirects",
      url: "https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/",
    },
    {
      label: "Lamping & Veach — A Fast, Minimal Memory, Consistent Hash Algorithm (jump hash)",
      url: "https://arxiv.org/abs/1406.2294",
    },
    {
      label: "Karger et al. 1997 — the original construction: Θ(log C) replicated buckets, and the smoothness property",
      url: "https://people.csail.mit.edu/karger/Papers/web.pdf",
    },
  ],
} satisfies LearnTopic;
