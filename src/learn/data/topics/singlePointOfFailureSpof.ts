import type { LearnTopic } from "@/learn/data/topic";

export const singlePointOfFailureSpof = {
  slug: "single-point-of-failure-spof",
  title: "Single point of failure (SPOF)",
  category: "systems",
  archetype: "mechanism",
  parent: "scalability",
  summary:
    "A component whose fault becomes the whole system's failure — the three conditions that make one, the ones that never appear on the diagram, and what redundancy costs to remove them.",
  tags: ["distributed-systems", "architecture", "scalability"],
  priority: "high",
  estimatedMinutes: 20,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A **single point of failure** is a component whose fault becomes the system's failure — in " +
          "Kleppmann's phrasing, a node or network link whose fault leads to failure.\n\n" +
          "Three conditions hold together, and separating them is what turns *there is only one database* into " +
          "an argument. The component is on the **critical path** of something users need; there is **no " +
          "alternative** while it is down; and the **impact is unacceptable** for as long as recovery takes. " +
          "Drop one and it is not a SPOF — it is a component with a workaround, or one whose outage nobody notices.",
      },
      {
        kind: "prose",
        body:
          "Removing one buys a fault that stays a fault instead of spreading. It costs capacity you pay for and " +
          "hope never to use, and it costs **coordination** — two of something must now agree which is " +
          "authoritative.\n\n" +
          "So the question is never *eliminate every SPOF*. It is which to buy out, and which to keep with a " +
          "recovery time you have measured.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "The first pass is trivial: anywhere the diagram has exactly one box. The second pass is the one that " +
          "pays — anywhere two boxes depend on the same third thing. That is **shared fate**, and it is why a " +
          "pair of replicas fails on the same afternoon.\n\n" +
          "In a prompt, the cue is any availability target expressed in nines ([[availability]]), any *must " +
          "survive a region going down*, and any *what happens if X is unreachable*. It fires again the moment " +
          "you add a second of something, because the second one is where coordination enters.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "The redundancy patterns",
        body:
          "Removing a SPOF means standing up a second one and deciding what it does while the first is healthy. " +
          "That decision is the taxonomy.\n\n" +
          "**Active-active** — every replica takes live traffic, so losing one removes capacity rather than " +
          "function; it needs a tier holding no session state " +
          "([[stateful-vs-stateless-architecture|stateless services]]). **Active-passive (hot standby)** — a " +
          "fully provisioned replica stays in sync and is promoted when the primary is declared gone. **Warm " +
          "standby** — provisioned small and lagging, needing a catch-up first. **Cold standby** — a template, " +
          "a backup, and a restore.\n\n" +
          "**Failure-domain isolation** is the odd one out: rather than duplicate the component, you bound how " +
          "much of the system one instance of it can take down — cells, zones, regions, per-tenant shards. When " +
          "a failover fires is [[load-balancers|load balancers]]' subject; how the data got there is " +
          "[[read-replicas|read replicas]]'.",
      },
      {
        kind: "comparison",
        caption: "The axis is what the second copy costs you while the first one is fine.",
        columns: ["", "Cost while healthy", "Recovery time", "What it leaves unfixed"],
        rows: [
          {
            label: "Active-active",
            cells: [
              "No dedicated idle node, but every node carries N/(N−1) headroom — at two nodes that is a full spare, at ten it is 11%",
              "Seconds — drain the failed node, the rest absorb",
              "Concurrent writes need a consistency story ([[consistency-models]])",
            ],
          },
          {
            label: "Active-passive (hot)",
            cells: [
              "A full second copy earning no traffic",
              "Seconds to minutes — promote, then re-point clients",
              "Who is authoritative when the primary is slow rather than dead",
            ],
          },
          {
            label: "Warm standby",
            cells: [
              "Small instances plus the replication stream",
              "Minutes to an hour — scale up, catch up, cut over",
              "Writes accepted after the last successful sync",
            ],
          },
          {
            label: "Cold standby",
            cells: ["Backup storage and a template", "Hours — provision, restore, verify", "Any objective shorter than a shift"],
          },
          {
            label: "Failure-domain isolation",
            cells: [
              "Routing, data placement, headroom held per domain",
              "Unchanged inside the affected domain — only one is affected",
              "The dependency itself; a control plane still spans every domain",
            ],
          },
        ],
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "[[availability]] owns the composition arithmetic — hard dependencies multiply, and replicas that fail " +
          "independently multiply their failure probabilities instead. This page owns what that word costs: " +
          "independence is a property of the topology, not of the formula, and it holds only as far as nothing " +
          "is shared.\n\n" +
          "[[reliability]] owns staying correct while a fault runs. Failure detection ([[heartbeats]]) " +
          "and [[split-brain-problem|split brain]] are ch. 14's; shedding load off a failing dependency is " +
          "ch. 13's ([[circuit-breaker-pattern|circuit breakers]], [[bulkhead-pattern|bulkheads]]).",
      },
    ],
    implementation: [
      {
        kind: "prose",
        heading: "Finding them — five passes, in this order",
        body:
          "Each pass surfaces a class the one before it cannot see, so the order matters more than the " +
          "thoroughness.\n\n" +
          "- **1 · Follow one critical user flow end to end.** Sign-in, add-to-cart, checkout — a flow, not the " +
          "picture. Record every hop, including the ones omitted as *infrastructure*: name resolution, TLS " +
          "termination, the token issuer, the flag lookup.\n" +
          "- **2 · Add what each hop reads at boot.** Config, service discovery, secrets, the image registry. " +
          "None sit on the request path; a restart mid-incident puts all of them there.\n" +
          "- **3 · Walk the recovery path too.** The pipeline that ships the fix, the VPN, the dashboards, the " +
          "person who has done this failover before. Meta's October 2021 outage ran aground here: its primary " +
          "*and* out-of-band network access went down together, so engineers were sent on site — and the " +
          "security hardening that made the data centers hard to enter then slowed the recovery.\n" +
          "- **4 · Group the result by shared fate.** Same host, rack, zone, region, config push, DNS record, " +
          "certificate, upstream provider. Anything two components share is a candidate no box shows.\n" +
          "- **5 · Test the assumption rather than asserting it.** Take the thing away — a game day, a drained " +
          "zone — and watch. Meta credits its rehearsed *storm* drills for bringing traffic back without a " +
          "second collapse; the practice belongs to [[reliability]].",
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "Amazon S3, us-east-1, 28 February 2017",
        body:
          "AWS's published summary is precise enough to read as an anatomy.\n\n" +
          "An engineer debugging the S3 billing system ran a playbook command to remove a small number of " +
          "servers. One input was entered incorrectly and a larger set went — including servers supporting two " +
          "other subsystems. The **index subsystem** holds the metadata and location of every object in the " +
          "region and is required by every GET, LIST, PUT and DELETE. The **placement subsystem** allocates " +
          "storage for new objects and needs index to function.\n\n" +
          "Losing that much capacity forced a full restart of both. AWS notes neither had been completely " +
          "restarted in its larger regions for many years, and that the metadata-integrity safety checks took " +
          "longer than expected. From the 9:37 AM PST command: GET, LIST and DELETE resumed at 12:26 PM " +
          "(**2 h 49 min**), index fully recovered at 1:18 PM (**3 h 41 min**), placement at 1:54 PM " +
          "(**4 h 17 min**).",
      },
      {
        kind: "prose",
        body:
          "The instructive part is not the storage-shaped SPOF; it is the two that no architecture picture " +
          "carries.\n\n" +
          "First, the dependency chain: placement needed index, and EC2 instance launches, EBS volumes " +
          "restoring from snapshot and Lambda needed S3. One subsystem's fault crossed boundaries that looked " +
          "independent on paper.\n\n" +
          "Second, the recovery path was inside the failure. AWS could not update the Service Health Dashboard " +
          "until 11:37 AM — two hours in — because that console itself depended on S3.",
      },
      {
        kind: "architecture",
        caption:
          "The same two shapes in a design you would draw at a whiteboard. Dashed edges are the dependencies " +
          "that appear at boot and during recovery — never on the request path, and never on the diagram.",
        nodes: [
          { id: "client", label: "Client", tier: "client" },
          { id: "dns", label: "DNS zone", tier: "edge", note: "One zone, one provider; its TTL outlives your failover" },
          { id: "lb", label: "Load balancer ×2", tier: "edge", note: "Two boxes, one zone, one config push" },
          { id: "status", label: "Status page", tier: "edge", note: "Reports on what it is hosted inside" },
          { id: "app", label: "App servers ×N", tier: "service" },
          {
            id: "config",
            label: "Config + discovery",
            tier: "service",
            note: "Read at boot by every tier — a hard dependency no request shows",
          },
          { id: "secrets", label: "Secrets + certificates", tier: "service", note: "An expiry is an unscheduled outage" },
          { id: "deploy", label: "Deploy pipeline", tier: "service", note: "The path that ships the fix" },
          {
            id: "primary",
            label: "Primary database",
            tier: "data",
            note: "A deliberate SPOF, defended by a measured failover time",
          },
          { id: "replica", label: "Replica", tier: "data" },
        ],
        edges: [
          { from: "client", to: "dns", label: "resolve" },
          { from: "client", to: "lb", label: "HTTPS" },
          { from: "lb", to: "app", label: "forward" },
          { from: "app", to: "primary", label: "writes" },
          { from: "primary", to: "replica", label: "replication" },
          { from: "lb", to: "config", label: "at boot", dashed: true },
          { from: "app", to: "config", label: "at boot", dashed: true },
          { from: "app", to: "secrets", label: "TLS + credentials", dashed: true },
          { from: "deploy", to: "app", label: "ships the fix", dashed: true },
          { from: "status", to: "primary", label: "reads incident state", dashed: true },
        ],
      },
      {
        kind: "prose",
        body:
          "Both fixes AWS shipped are worth naming, because between them they are the two moves available. The " +
          "tool now removes capacity more slowly and refuses a removal that would take a subsystem below its " +
          "minimum — a floor, which removes the trigger. And partitioning index into **cells** was brought " +
          "forward, so a restart is bounded to one cell.\n\n" +
          "The second move generalises further. Making a shared component genuinely redundant is often " +
          "impossible or ruinous; making its failures small is usually neither.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What you pay", "When it bites"],
        rows: [
          {
            label: "Redundancy that shares fate",
            cells: [
              "Full price for the copy, none of the independence the maths assumed — AWS derives the redundant-component formula for *independent* components only",
              "The instant the shared thing fails, which is the instant you were counting on the copy",
            ],
          },
          {
            label: "Two writers where there was one",
            cells: [
              "A coordination problem you did not have, and a promotion decision that can be wrong",
              "During an ambiguous failure, where a slow primary and a dead one look identical ([[split-brain-problem|split brain]])",
            ],
          },
          {
            label: "Failure-domain isolation",
            cells: [
              "You stop being able to treat the fleet as one pool — every cross-domain operation becomes a design decision",
              "When one request needs data from two domains — and when a control plane quietly spans all of them",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "Which brings the decision this page is for: **which SPOFs you keep.** A single strongly-consistent " +
          "primary, a single region, a single payment provider — each can be the right call, and the defence is " +
          "never *it is redundant*. It is a stated recovery time, a rehearsed failover, and a bounded blast " +
          "radius.\n\n" +
          "A SPOF with a measured recovery time is a risk someone accepted. One nobody has priced is a surprise " +
          "waiting for a Tuesday.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Counting boxes instead of dependencies.** Two app servers reading one config service are one component with a spare front end — and the second box is what makes the picture look safe.",
          "**A failover that has never been fired.** Standby capacity that never served production traffic is untested: the first promotion is where you find the full disk or the lapsed certificate.",
          "**Failing over via DNS and forgetting the TTL.** Resolvers cache past the value you set, so a record swap is a recovery time you do not control ([[domain-name-system-dns|DNS]]).",
          "**A redundant data plane behind a singleton control plane.** Meta's 2021 outage took down a globally redundant backbone with one command, because the audit tool meant to reject it had a bug.",
          "**One person who has done the failover.** A runbook that only works in its author's hands is a SPOF with a holiday calendar.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "*Where are the single points of failure in what you've drawn?* Walk the request path, then the recovery path — the second walk is where the answer stops being the database. Name one thing that is not on the diagram: config, the deploy pipeline, a certificate, the status page.",
          "*You've added a second load balancer. Are you done?* The follow-up is shared fate: same zone, same config push, same DNS record, at what TTL? Then name the problem the second one introduced — deciding who is authoritative.",
          "*What's your recovery time if that database dies?* Two numbers, not one: time to detect, then time to promote. Thirty seconds plus four minutes is defensible; *it fails over automatically* is not.",
          "Price the removal before proposing it. Tie it to the target with the composition arithmetic on [[availability]], then say which SPOFs you keep and what recovery time you accept for each.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "AWS Well-Architected — Use fault isolation to protect your workload",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/use-fault-isolation-to-protect-your-workload.html",
            type: "doc",
          },
          {
            label: "Amazon Builders' Library — Static stability using Availability Zones",
            url: "https://aws.amazon.com/builders-library/static-stability-using-availability-zones/",
            type: "article",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "AWS — Summary of the Amazon S3 Service Disruption in the Northern Virginia (US-EAST-1) Region",
      url: "https://aws.amazon.com/message/41926/",
    },
    {
      label: "Meta Engineering — More details about the October 4 outage",
      url: "https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/",
    },
    {
      label: "Kleppmann — Concurrent and Distributed Systems, University of Cambridge",
      url: "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf",
    },
    {
      label: "AWS Well-Architected, Reliability Pillar — Availability",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html",
    },
  ],
} satisfies LearnTopic;
