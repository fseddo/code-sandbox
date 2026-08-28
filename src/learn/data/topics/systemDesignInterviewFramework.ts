import type { LearnTopic } from "@/learn/data/topic";

export const systemDesignInterviewFramework = {
  slug: "system-design-interview-framework",
  title: "The 4-step interview framework",
  category: "systems",
  archetype: "procedure",
  parent: "what-is-system-design",
  summary:
    "A fixed order of operations for a 45-minute design round — requirements, estimation, boxes, deep dives — " +
    "and the judgement about when to shrink a step.",
  tags: ["architecture", "scalability", "backend"],
  priority: "high",
  estimatedMinutes: 35,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "The **four-step framework** is a fixed order of operations for a design round: pin the requirements, " +
          "size the system, draw it, then go deep. What it buys is **coverage under a clock** — you finish with a " +
          "whole design that has a scale story and two defended decisions, instead of a beautifully detailed " +
          "fragment of one.\n\n" +
          "What it costs is flexibility: run it rigidly and you produce the same generic diagram for every " +
          "prompt and miss whatever made *this* one interesting. Treat it as a default order rather than a " +
          "script — part of what's being graded is knowing which step this prompt doesn't need. " +
          "[[what-is-system-design]] is the vocabulary this procedure assumes; nothing here re-teaches it.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "The cue is the **absence of a spec**, not the presence of a technology: an open-ended prompt with a " +
          "scale word in it and no acceptance criteria — *design X for N users*. Nobody will tell you when you " +
          "are done, so the framework's real job is to supply the missing structure before the silence does. " +
          "Meta runs the round in two flavours, systems and product, and opens both with clarifying questions " +
          "about scale, latency and storage — the framework's first step under a different name.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "The four steps",
        body:
          "**Step 1 · Understand the problem and scope (~5 min).** Get the functional list and two or three " +
          "*quantified* non-functional targets out of the interviewer, and write them where you can both see " +
          "them. [[what-is-system-design]] defines what those two kinds of requirement are; the move here is " +
          "purely how to extract them fast. Ask four questions and stop: what scale (users, writes per day)? " +
          "what latency, at what percentile? how stale may a read be? what is the read/write mix? Then " +
          "**propose the answers yourself** — \"let's say 100M new links a day, 100:1 reads, p99 under " +
          "100 ms\" — and let the interviewer correct you. Proposing is faster than asking, and a corrected " +
          "number is a requirement you didn't have to negotiate for.\n\n" +
          "**Step 2 · Back-of-the-envelope estimation (~5 min).** Convert the requirements into queries per " +
          "second, storage and bandwidth. For every number you compute, name the decision it settles, out loud " +
          "and in the same breath — and if you can't name the decision, don't compute the number.\n\n" +
          "**Step 3 · High-level design (~15 min).** Sketch the request path for the dominant operation " +
          "first, not the whole system. Then name the datastore, and get explicit " +
          "agreement before going deeper — a wrong assumption is still cheap to fix here and expensive to fix " +
          "at minute 35.\n\n" +
          "**Step 4 · Design deep dive (~15 min).** Pick the expansions off whichever step-1 target is hardest " +
          "to hit, and announce each one with its *why* before you draw it. \"Reads are 100× " +
          "writes, so I'll expand the read path\" does two jobs; the same expansion with no preamble does one.\n\n" +
          "That is 40 minutes, not 45. The residue is the interviewer's introduction and your questions at the " +
          "end; planning for a full 45 is a reliable way to get caught short. Keep the last minute for a recap " +
          "of the tradeoffs you took.",
      },
      {
        kind: "comparison",
        columns: ["", "Minutes (of ~40)", "What you leave on the board", "What skipping it costs"],
        rows: [
          {
            label: "1 · Understand the problem & scope",
            cells: [
              "~5",
              "A functional list plus 2–3 quantified targets",
              "You design a system nobody asked for and get stopped at minute 20",
            ],
          },
          {
            label: "2 · Back-of-the-envelope estimation",
            cells: [
              "~5",
              "QPS, storage, and the decision each number settles",
              "Shard count, cache size and node count are asserted, not argued",
            ],
          },
          {
            label: "3 · High-level design",
            cells: [
              "~15",
              "Boxes and arrows client→edge→service→data, plus the API surface",
              "You go deep before the skeleton exists and the design never connects",
            ],
          },
          {
            label: "4 · Design deep dive",
            cells: [
              "~15",
              "Two or three expansions, each tied to a non-functional target",
              "You stay at box level and read as junior",
            ],
          },
        ],
        caption: "The four steps against what each one produces. The minute split is ours, not a published standard.",
      },
    ],
    implementation: [
      {
        kind: "prose",
        heading: "What you write down in the first minute",
        body:
          "Before the first question, put four headings on the board with their budgets — **Requirements** (5), " +
          "**Estimates** (5), **High-level design** (15), **Deep dives** (15) — and leave a blank block under " +
          "the first for functional bullets, non-functional numbers, and a labelled assumption list. The " +
          "headings do two jobs: they make your pacing legible without you narrating it, and an empty block " +
          "under *Estimates* is a visible prompt to ask whether the arithmetic is wanted at all.\n\n" +
          "The arithmetic is the part worth rehearsing, because it has to run in your head while you talk. " +
          "Four shortcuts cover almost every prompt:\n\n" +
          "**A day is ~10⁵ seconds.** 86,400 rounds to 100,000, so *per day ÷ 10⁵ = per second* — 100M/day is " +
          "~1,000/s. The 16% error is far inside the precision anything else here deserves.\n\n" +
          "**1M/day ≈ 12/s**, and scale from there. **Reads = writes × the ratio**, so pin the write rate " +
          "first and never estimate reads directly.\n\n" +
          "**For bytes, round the record to a power of ten, then multiply by the daily count.** 100M × 500 B = " +
          "5 × 10¹⁰ = 50 GB/day; × 365 for a year. A year is ~3 × 10⁷ seconds if you need to go the other way.\n\n" +
          "**Carry one significant figure.** \"~1.2k writes/s\" is the answer; `1,157.4` is the same answer " +
          "with two extra chances to slip under pressure.",
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "A URL shortener, run end to end",
        body:
          "The design below is deliberately thin — the subject is the procedure, not the shortener.\n\n" +
          "**Step 1, five minutes.** Functional: create a short link for a target URL; redirect a short link to " +
          "its target; optionally expire a link and count clicks. Then the assumptions, each said out loud and " +
          "*labelled* as an assumption, because that is what makes it correctable:\n\n" +
          "**A1** — 100M new short links created per day. **A2** — reads outnumber writes 100:1. **A3** — peak " +
          "traffic is 2× average. **A4** — a stored record averages ~500 bytes. **A5** — links are retained for " +
          "five years. **A6** — a hot set of ~10M links (roughly a day of writes, or a Zipf head of about 1%) " +
          "serves most reads.\n\n" +
          "A2, A3, A6 and the ~100-byte median target URL inside A4 are conventional interview assumptions with no " +
          "published measurement behind them. Declared as assumptions they are fine; asserted as facts they " +
          "collapse the moment someone asks where they came from.\n\n" +
          "**Step 2, five minutes.** Every row below is arithmetic over A1–A5 — except the last one.",
      },
      {
        kind: "numbers",
        rows: [
          {
            quantity: "Writes/sec (average)",
            value: "~1.2k",
            derivation: "A1: 100M links/day ÷ 86,400 s = 1,157",
          },
          {
            quantity: "Reads/sec (average)",
            value: "~116k",
            derivation: "A2: 1,157 × 100 = 115,700",
          },
          {
            quantity: "Reads/sec (peak)",
            value: "~232k",
            derivation: "A3: 116k × 2",
          },
          {
            quantity: "Short-code length, base62",
            value: "7 characters",
            derivation:
              "assumes sequential allocation (a random scheme collides long before the space fills, which is " +
              "itself an argument for a counter). 62⁶ = 5.68 × 10¹⁰ → ÷ 10⁸ per day = 568 days; " +
              "62⁷ = 3.52 × 10¹² → 35,216 days ≈ 96 years",
          },
          {
            quantity: "Bytes per record",
            value: "~500 B",
            derivation:
              "A4: 7 B code + ~100 B target URL + 8 B owner id + 8 B created_at + 8 B expiry ≈ 131 B, " +
              "rounded ~4× to 500 B to stay conservative — the estimate only has to hold to an order of magnitude",
          },
          {
            quantity: "New storage/day",
            value: "50 GB",
            derivation: "100M × 500 B = 5 × 10¹⁰ B",
          },
          {
            quantity: "Storage at 5 years",
            value: "~91 TB",
            derivation: "A5: 50 GB × 365 × 5 = 91,250 GB",
          },
          {
            quantity: "Read bandwidth (stored bytes)",
            value: "~58 MB/s",
            derivation: "116,000/s × 500 B = 5.8 × 10⁷ B/s",
          },
          {
            quantity: "Hot set — top 10M links",
            value: "5 GB",
            derivation: "A6: 10M × 500 B = 5 × 10⁹ B — fits in one node's RAM",
          },
          {
            quantity: "Reality check — Bitly, Feb 2014",
            value: "~2,300 redirects/s",
            derivation:
              "Bitly's engineering blog reported ~6 × 10⁹ decodes/month in Feb 2014: " +
              "6 × 10⁹ ÷ (30 × 86,400 s) = 2,315. A decade-old published figure, and the only measured row here.",
          },
        ],
        caption: "Nine rows of arithmetic over six assumptions you declared, plus one number somebody measured.",
      },
      {
        kind: "prose",
        body:
          "**Step 2's output is four decisions, not nine numbers.**\n\n" +
          "*Seven characters, not six.* At 10⁸ writes a day a 6-character base62 space is exhausted in 568 " +
          "days, so the key-generation scheme has to emit 7. This is the number that would have quietly broken " +
          "the design in year two.\n\n" +
          "*~91 TB at five years.* That fits on one machine's disks, but not in its page cache — and no single " +
          "machine serves 232k reads/s off it. *That* is what puts [[sharding]] and [[read-replicas|read replicas]] on the " +
          "table, not the capacity number. The 50 GB a day is why a TTL or an archival tier is worth " +
          "proposing before anyone asks.\n\n" +
          "*5 GB hot set — so argue **against** a distributed cache.* The top 10M links fit in a single node's " +
          "memory, so start with one cache and defer [[consistent-hashing|consistent hashing]] until the working set outgrows it. " +
          "An estimate that buys you *simplicity* is the strongest use of this step; using a number to justify " +
          "adding a component is the easy direction.\n\n" +
          "*232k peak reads/s against ~1.2k writes/s.* The read path is the system. [[what-is-caching|caching]] and " +
          "[[read-replicas|read replicas]] come before anything on the write side.\n\n" +
          "And then the last row — the only measured number in the table. The prompt as assumed is around **50× a real " +
          "production shortener's published traffic**, from over a decade ago. Nothing above is wrong; it is " +
          "just downstream of A1–A5. The design follows from your assumptions, not from reality, which is " +
          "exactly why you state them where the interviewer can push on them.",
      },
      {
        kind: "prose",
        body:
          "**Step 3, fifteen minutes.** Two endpoints: `POST /links {url, ttl?} → {code}` and " +
          "`GET /:code → redirect to target` (see [[rest-apis]] for the contract side). Then four boxes — " +
          "client → [[load-balancers|a load balancer]] → a stateless link service → a key-value store keyed by short code, " +
          "with a cache in front of the read path. Everything interesting here is another lesson's: " +
          "[[database-indexing]] for the lookup, [[rate-limiting|rate limiting]] for the create endpoint, [[what-is-caching|caching]] " +
          "for the read path. Get agreement on the skeleton, then stop drawing.\n\n" +
          "**Step 4, fifteen minutes.** The hardest target here is read latency at 232k/s, so the deep dives " +
          "come off it. How are codes generated without a coordination bottleneck? What does the cache do " +
          "when a viral link misses in a thundering herd? What happens when the store outgrows one node? " +
          "Two done properly beat four sketched.\n\n" +
          "**Last minute.** Name the two tradeoffs you took — one cache node rather than a distributed cache, " +
          "a key-value store rather than a relational one — and what evidence would make you revisit each.",
      },
    ],
    tradeoffs: [
      {
        kind: "prose",
        heading: "What the procedure itself costs",
        body:
          "Rigidity, and it bites whenever the prompt's difficulty is somewhere the template doesn't look: a " +
          "product-design prompt where scale was never in question and step 2 has nothing to compute, or a " +
          "prompt whose whole difficulty lives in one deep dive. The mitigation is to shrink a step out loud, " +
          "with a reason — \"the scale here is obviously large and distributed, so I'll spend two minutes on " +
          "estimates and put the rest into the data model\". A shrunk step with a stated reason still reads as " +
          "a decision; a skipped one reads as an omission.",
      },
      {
        kind: "prose",
        heading: "Where this framework is the outlier",
        body:
          "The 5 / 5 / 15 / 15 split is ours; so is hoisting estimation into a step of its own, and on that " +
          "second point the sources converge against us. ByteByteGo tells you to *\"communicate with your " +
          "interviewer if back-of-the-envelope is necessary before diving into it\"*. `system-design-primer` " +
          "opens its worked solutions the same way. Hello Interview says to calculate only when it will " +
          "directly influence the design, and folds the API contract into its own step besides. All three make " +
          "estimation conditional.",
      },
      {
        kind: "comparison",
        columns: ["", "Estimate upfront, as its own step (ours)", "Estimate on demand (all three sources)"],
        rows: [
          {
            label: "What it buys",
            cells: [
              "Every later choice has a number behind it — you can't hand-wave shard count or cache size",
              "Minutes back for the design itself, and no dead arithmetic left on the board",
            ],
          },
          {
            label: "What it costs",
            cells: [
              "Minutes spent on numbers the design never consults",
              "You can reach a decision point with no number and stall there",
            ],
          },
          {
            label: "When it bites",
            cells: [
              "Product-design prompts, where the constraint is the feature set rather than the load",
              "Prompts where one number flips the architecture — does the working set fit one node, or must it shard?",
            ],
          },
        ],
        caption:
          "We hoist it as a *learning* scaffold: dropping a step you can already execute is far easier than " +
          "inventing one under time pressure. In a real interview, follow the sources — do the arithmetic when " +
          "the number changes a decision, say which decision, and otherwise ask whether it's wanted.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Spending 15 of your 45 minutes on requirements. It is the most common way to run out of time inside " +
            "the deep dives, which is where the senior signal actually lives.",
          "Dead arithmetic — computing storage and QPS you never refer to again. This is every major framework's " +
            "objection to upfront estimation and it is a fair one: a number that settles nothing consumed " +
            "minutes and produced no decision.",
          "Estimating without stating assumptions. An unstated assumption makes the number unfalsifiable, and " +
            "reasoning the interviewer can't follow is reasoning you don't get credit for.",
          "Going deep before the skeleton exists — a beautifully specified cache in front of a system whose " +
            "write path was never drawn. The same bullet covers expanding a component without saying which " +
            "non-functional target the expansion protects.",
          "Restarting the table when the scale moves (\"now make it 100\u00d7 that\"). Recompute only the rows " +
            "that change the design — usually storage, and whether the hot set still fits one node.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "**\"Before you draw anything — how big is this?\"** State the assumption, do one line of arithmetic, " +
            "and name the decision it settles, all in one breath. \"At 100M links a day and 100:1 reads that's " +
            "~1.2k writes/s and ~116k reads/s — so the read path is the whole design: cache in front, write " +
            "path stays simple.\" The signal is the inference, not the division.",
          "**\"Do you actually need that estimate?\"** The depth answer concedes the point rather than " +
            "defending the table, because every published framework says to ask first. For most large-scale " +
            "prompts you can assume \"large and distributed\" and skip the upfront math. Do the arithmetic " +
            "only where it decides between two architectures — whether the working set fits one node's " +
            "memory or has to be sharded. Arguing " +
            "*against* your own estimate, with a reason, reads as more senior than reciting it.",
          "**\"You've got ten minutes left — what would you go deep on?\"** Pick it from the non-functional " +
            "targets you wrote down in step 1 and say which one it protects. That closes the loop back to " +
            "[[what-is-system-design]] and shows step 1 wasn't ceremony.",
          "Announce the plan in the first minute — \"five on requirements, five on estimates, fifteen on the " +
            "design, fifteen on deep dives\" — and then call out the transitions. It costs ten seconds and " +
            "makes your pacing legible rather than something anyone has to infer.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "system-design-primer — its own four-step approach, plus a powers-of-two and latency appendix",
            url: "https://github.com/donnemartin/system-design-primer",
            type: "article",
          },
          {
            label: "Latency Numbers Every Programmer Should Know, By Year (Colin Scott) — self-documents its provenance",
            url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html",
            type: "article",
          },
          {
            label: "The latency-numbers gist (jboner) — a convenient copy, but community-edited and drifting",
            url: "https://gist.github.com/jboner/2841832",
            type: "article",
          },
          {
            label: "Google SRE Workbook — Implementing SLOs, for turning step 1's targets into measurable SLIs",
            url: "https://sre.google/workbook/implementing-slos/",
            type: "doc",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "Meta Careers — Preparing for your software engineering interview at Meta (first-party hiring guidance)",
      url: "https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/",
    },
    {
      label: "Bitly engineering blog — Joining Bitly Engineering, Feb 2014 (first-party production figure)",
      url: "https://word.bitly.com/post/77292911854/joining-bitly-engineering",
    },
    {
      label: "ByteByteGo — A framework for system design interviews (interview-prep site; cited for its published step budgets)",
      url: "https://bytebytego.com/courses/system-design-interview/a-framework-for-system-design-interviews",
    },
    {
      label: "Hello Interview — System Design in a Hurry: Delivery (interview-prep site; cited for the six-step framing and the estimate-on-demand position)",
      url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery",
    },
  ],
} satisfies LearnTopic;
