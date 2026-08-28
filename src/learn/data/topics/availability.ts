import type { LearnTopic } from "@/learn/data/topic";

export const availability = {
  slug: "availability",
  title: "Availability",
  category: "systems",
  archetype: "mechanism",
  parent: "scalability",
  summary:
    "The fraction of time — or of requests — a system serves successfully, and the arithmetic that turns a target with nines in it into minutes you can argue about.",
  tags: ["scalability", "distributed-systems", "observability"],
  priority: "high",
  estimatedMinutes: 25,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "**Availability** is the fraction of a period during which a system does its job successfully. Two " +
          "formulas are in use and they answer slightly different questions. **Time-based availability** is " +
          "uptime ÷ total time — the form AWS leads with, and the shape most SLA headline numbers take. " +
          "**Request-success availability** is successful requests ÷ valid requests; AWS documents it too, and " +
          "Google's SRE book prefers it for globally distributed services, where some replica is always serving " +
          "somewhere and *up* stops being a yes-or-no fact.",
      },
      {
        kind: "prose",
        body:
          "The cost model: nines are bought with redundancy, and the price curve bends the wrong way — each " +
          "increment costs a multiple of the last, not an increment more. So the useful question is never *how do " +
          "we get more nines*. It is *which nine is the last one worth paying for*, and that turns out to be a " +
          "question about money and users rather than about hardware.",
      },
      {
        kind: "numbers",
        caption:
          "Nines to minutes, then topology back to nines. Rows six to eight are the composition rules — hard " +
          "dependencies multiply their availabilities, independent replicas multiply their failure rates, and " +
          "*independent* is the load-bearing word — and the last two convert a target into a dependency " +
          "estimate and an error count.",
        rows: [
          {
            quantity: "99%",
            value: "3.65 days/yr · 7.2 h/month · 14.4 min/day",
            derivation: "Google SRE book availability table (Appendix A).",
          },
          {
            quantity: "99.9%",
            value: "8.76 h/yr · 43.2 min/month · 1.44 min/day",
            derivation: "Same table. AWS's Well-Architected table gives 8 h 45 min/yr — the same figure, rounded.",
          },
          {
            quantity: "99.95%",
            value: "4.38 h/yr · 21.6 min/month",
            derivation: "Same table. AWS's targets table puts online commerce and point-of-sale at this tier.",
          },
          {
            quantity: "99.99%",
            value: "52.6 min/yr · 4.32 min/month · 8.64 s/day",
            derivation: "Same table. AWS gives 52 min/yr; the two sources agree.",
          },
          {
            quantity: "99.999%",
            value: "5.26 min/yr · 25.9 s/month",
            derivation: "Same table.",
          },
          {
            quantity: "A 99.99% service and its two hard dependencies, each 99.99%",
            value: "99.97%",
            derivation: "Availabilities multiply: 0.9999³ = 0.99970. AWS's worked example.",
          },
          {
            quantity: "A 99.99% service calling one 99.9% dependency",
            value: "99.89%",
            derivation: "0.9999 × 0.999 = 0.99890 — a caller cannot be better than what it calls.",
          },
          {
            quantity: "Two independent replicas, each 99.9%",
            value: "99.9999%",
            derivation: "100% − (0.1% × 0.1%) = 100% − 0.0001%. AWS's shortcut: add the nines.",
          },
          {
            quantity: "MTBF 150 days, MTTR 1 hour",
            value: "≈ 99.97%",
            derivation: "MTBF ÷ (MTBF + MTTR) = 3,600 h ÷ 3,601 h. AWS's estimate for a part with no published target.",
          },
          {
            quantity: "2.5M requests/day against a 99.99% daily target",
            value: "250 errors allowed",
            derivation: "2,500,000 × 0.0001. The SRE book's own illustration of availability as request success rate.",
          },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for this the moment a prompt names a target with nines in it, quotes what an hour of downtime " +
          "costs, or says the system must always be up. It fires again whenever a design has exactly one of " +
          "something, though spotting those is [[single-point-of-failure-spof|its own subject]].\n\n" +
          "The move is mechanical: **say the target in minutes before you say anything about architecture.** A " +
          "percentage is an adjective the room nods at; minutes are a quantity it can argue with.\n\n" +
          "The mechanisms that buy those minutes each have their own page — [[load-balancers|load balancers]], " +
          "[[read-replicas|read replicas]], [[message-queues|message queues]], " +
          "[[circuit-breaker-pattern|circuit breakers]]. This one prices the target they serve.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "SLI, SLO, SLA — and the budget that falls out of them",
        body:
          "Three terms get used interchangeably and separate cleanly once you ask *what happens when the number " +
          "is missed*.\n\n" +
          "An **SLI** (service level indicator) is a quantity you can actually compute — the proportion of " +
          "requests that returned 2xx, or that finished under 300 ms. An **SLO** is a target for an SLI over a " +
          "window. An **SLA** is a contract carrying consequences, usually money; the SRE book's test is the " +
          "quick one — if nothing happens when you miss it, it was never an SLA.\n\n" +
          "The **error budget** falls straight out of the SLO. At a 99.9% target, 0.1% of the window is failure " +
          "you are *permitted* to spend — on deploys, migrations, risky experiments. Spending it is not a fault; " +
          "it is the point. Running out is the signal that reliability work now outranks the next feature.",
      },
      {
        kind: "comparison",
        columns: ["", "SLI", "SLO", "SLA"],
        rows: [
          {
            label: "Who agrees to it",
            cells: ["Nobody — it is a measurement", "The team, internally", "You and a customer, in writing"],
          },
          {
            label: "Cost of a miss",
            cells: ["None; the graph just reads lower", "Budget burnt, releases throttled", "Service credits or a penalty"],
          },
          {
            label: "Where the number comes from",
            cells: [
              "Request logs and edge telemetry",
              "What a violation costs the business",
              "Sales and legal, set below the SLO",
            ],
          },
          {
            label: "Checkout API example",
            cells: [
              "% of `POST /checkout` returning 2xx per 5-minute bucket",
              "99.9% of those buckets over 30 days",
              "10% credit if monthly uptime lands under 99.9%",
            ],
          },
        ],
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "This page owns the arithmetic — nines to minutes, and how availabilities compose across a topology. " +
          "The redundancy patterns that produce those numbers belong to " +
          "[[single-point-of-failure-spof|single points of failure]]; why systems break in the first place, and " +
          "where the availability-versus-reliability line falls, belong to [[reliability]].",
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "One service's error budget, spent",
        body:
          "Take a checkout API with a **99.9% SLO on request success over a rolling 30-day window**, carrying " +
          "roughly 2.5M requests a day. Both are assumptions a candidate proposes and gets confirmed, not " +
          "measured facts — the arithmetic is what transfers.\n\n" +
          "The budget in time is **43.2 minutes**, read off the 99.9% row above. In requests it is 0.1% of 75M " +
          "(2.5M × 30), so **75,000 failed requests**. One target, two currencies; quote whichever one the " +
          "incident review already speaks.",
      },
      {
        kind: "prose",
        body:
          "Now spend it. A bad deploy takes checkout down for **12 minutes** before the rollback lands. Three " +
          "weeks later a payment-provider timeout storm burns **8 more**. Twenty minutes gone, **23.2 minutes " +
          "left** — 54% of the budget with nine days still to run.\n\n" +
          "That remainder is a decision, not a scoreboard. Twenty-three minutes buys one more incident of the " +
          "same size, so it buys the ordinary release train and does not buy a risky schema migration on day 29. " +
          "At zero, Google's rule is that launches pause while the effort goes into testing and resilience — " +
          "which is what makes *ship faster* and *be more reliable* arguable against each other rather than " +
          "shouted past each other.",
      },
      {
        kind: "prose",
        body:
          "The contract version of the same number: Amazon's **S3 Standard** SLA pays **10% service credits** " +
          "when monthly uptime falls below **99.9%**, 25% below 99.0%, and 100% below 95.0%. It defines that " +
          "percentage as 100% minus the average of the per-5-minute error rates — so partial degradation is " +
          "priced rather than rounded up to *available*, and a five-minute interval carrying no traffic counts " +
          "as perfect.\n\n" +
          "Note what an SLA is not. It is the number the vendor will pay for, deliberately set beneath the number " +
          "the vendor aims at — an internal target equal to the contract leaves no room to notice trouble before " +
          "the invoice does.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What it costs", "When it bites"],
        rows: [
          {
            label: "Each extra nine",
            cells: [
              "The SRE book measures it flatly: *an incremental improvement in reliability may cost 100× more than the previous increment* — in hardware, and in features not shipped while hardening",
              "The moment *five nines* is said reflexively, with no number behind it",
            ],
          },
          {
            label: "Nines nobody can perceive",
            cells: [
              "Real spend under the client's own error floor; the SRE book puts typical ISP background error rates at 0.01–1%",
              "Consumer products on mobile — *a user on a 99% reliable smartphone cannot tell the difference between 99.99% and 99.999% service reliability*",
            ],
          },
          {
            label: "A target above what it earns back",
            cells: [
              "Redundancy the extra availability cannot repay — the SRE book's worked case values one more nine on a $1M service at $900 a year",
              "Whenever *highly available* is asserted with no revenue figure beside it",
            ],
          },
          {
            label: "Over-delivering",
            cells: [
              "Callers build on observed behaviour, so the surplus quietly becomes your interface",
              "Internal platforms: Google synthesises Chubby outages precisely because its true reliability invited dependencies that could not survive it going down",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "The cost side of a nine climbs steeply and the benefit side is bounded — by the revenue at risk, and " +
          "beneath that by what a client on a phone and an ISP can even detect. Two such curves cross somewhere, " +
          "and the crossing is the target.\n\n" +
          "Which makes it a business number wearing an engineering costume. Derive it from what a violation " +
          "costs, and be ready to name the nine you decided not to buy.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**A health check is not an SLI.** A liveness probe returning 200 while every real request 502s produces a calm dashboard and a furious customer. Measure success at the edge, on live traffic.",
          "**The dependency nobody drew.** Series availability is multiplicative, and the auth, config and feature-flag services sit in the request path even when the picture stops at the database.",
          "**Replicas that fail together.** The parallel formula assumes independence. Two instances in one rack, one AZ, or behind one deploy pipeline are a single component wearing two names — see [[single-point-of-failure-spof|single points of failure]].",
          "**Maintenance windows cut out of the denominator.** AWS advises against the practice directly: users will want the service during those windows, and none of them read your maintenance calendar.",
          "**A target copied off last quarter's graph.** The SRE book warns against choosing a target from current performance — it commits the team to heroics defending a number nobody chose on purpose.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "*You said 99.99% — what does that buy, and what does it cost?* 52.6 minutes a year, 4.32 a month — say those, then the cost curve, then what you would trade away instead.",
          "*How would you know you were meeting it?* Give three answers, not one: the quantity you would compute from request logs — quoted at a percentile, never a mean ([[latency-vs-throughput|latency vs throughput]]) — the internal commitment you would hold it to, and whether money is attached to missing it.",
          "*What happens when you miss it?* Say it is release policy, not accounting — and name who decides. That is what separates someone who has read about error budgets from someone who has been on the wrong side of one.",
          "The strongest version does the money aloud on the interviewer's own revenue figure: incremental availability × revenue protected, against what the redundancy costs. If the redundancy wins, you have just talked yourself out of a nine on the record, which reads as judgement rather than timidity.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "Amazon S3 Service Level Agreement — a real availability contract, with credits",
            url: "https://aws.amazon.com/s3/sla/",
            type: "doc",
          },
          {
            label: "Google SRE Workbook — Implementing SLOs",
            url: "https://sre.google/workbook/implementing-slos/",
            type: "article",
          },
        ],
      },
    ],
  },
  sources: [
    { label: "Google SRE Book — Embracing Risk", url: "https://sre.google/sre-book/embracing-risk/" },
    { label: "Google SRE Book — Service Level Objectives", url: "https://sre.google/sre-book/service-level-objectives/" },
    { label: "Google SRE Book — Availability Table (Appendix A)", url: "https://sre.google/sre-book/availability-table/" },
    {
      label: "AWS Well-Architected, Reliability Pillar — Availability",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html",
    },
  ],
} satisfies LearnTopic;
