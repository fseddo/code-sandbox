import type { LearnTopic } from "@/learn/data/topic";

export const anycastRouting = {
  slug: "anycast-routing",
  title: "Anycast routing",
  category: "systems",
  archetype: "mechanism",
  parent: "load-balancers",
  summary:
    "One IP address advertised from many places at once — the routing system, not you, decides which site each client reaches.",
  tags: ["networking", "distributed-systems"],
  priority: "low",
  estimatedMinutes: 12,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "**Anycast** is one service address advertised into the routing system from several separate " +
          "locations at once. RFC 4786 calls each location an **anycast node**, and the region of the network " +
          "whose packets land on it a **catchment**. Nothing in the packet names a site: BGP applies its own " +
          "path selection and delivers to whichever advertisement is nearest by those rules.\n\n" +
          "That buys the shortest path the routing system knows about — which RFC 4786 is explicit is not the " +
          "same as the fastest one — plus one address for a worldwide fleet " +
          "instead of a list. It costs you the steering wheel — the decision is made in routers you do not " +
          "operate, and it is re-made whenever their operators change policy or topology.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for anycast when a service runs in many places and any of them can answer any request. The " +
          "cue is that the client should arrive at one of them without an application-level lookup first: DNS " +
          "resolvers, CDN edge sites, NTP, the front door of a network built to absorb attack traffic.\n\n" +
          "It is the wrong page when sites are not interchangeable, when one client must keep reaching one " +
          "specific site, or when you want to send *a chosen share* of traffic somewhere — anycast has no " +
          "weights to set. Inside a single datacenter the tool is a " +
          "[[load-balancers|load balancer]], not a routing announcement.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "Three mechanisms can put a client on a particular site. **Unicast** gives each site its own address. " +
          "**Anycast** gives every site the same address. **[[dns-load-balancing|DNS load balancing]]** hands " +
          "out different answers to the same name.\n\n" +
          "Anycast itself comes in two propagation scopes, and an operator's fleet is a mix of them. A **global " +
          "node** advertises for transit and can be reached from anywhere. A **local node** advertises with " +
          "its propagation fenced — `NO_EXPORT`, or a peering rather than transit import policy — so it " +
          "serves one region and is invisible past it. RFC 4786 recommends the combination as the way to keep " +
          "a fleet stable: a few especially stable global nodes, and many local ones.",
      },
      {
        kind: "comparison",
        columns: ["", "Unicast", "Anycast", "DNS geo-routing"],
        rows: [
          {
            label: "Who decides",
            cells: [
              "Whoever configures or publishes the address",
              "The routing system, by BGP path selection",
              "The authoritative nameserver, per query",
            ],
          },
          {
            label: "When it decides",
            cells: [
              "Once, at configuration time",
              "Continuously — each packet follows the current best path",
              "At resolution time, then frozen until the TTL expires",
            ],
          },
          {
            label: "On site failure",
            cells: [
              "Manually: publish a different address",
              "Withdraw the advertisement; neighbours converge on another site",
              "Answer with a different record and wait out the caches",
            ],
          },
          {
            label: "What breaks",
            cells: [
              "Nothing adapts to where the client is",
              "A route change mid-connection strands a session on a site holding no state for it",
              "The answer is given before any connection exists, so nothing about how it went feeds back",
            ],
          },
        ],
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "The root of the DNS is the deployment the technique was hardened on. The root zone has thirteen " +
          "server identities, `a.root-servers.net` through `m`, run by twelve independent organisations, and " +
          "that count has not changed since 1997 — ICANN's RSSAC023 traces the ceiling to a response-size limit " +
          "that EDNS0 has since relaxed, leaving the number as operational convention. Anycast severs it from " +
          "the number of machines: each identity is " +
          "advertised from as many sites as its operator builds. RFC 4786 names this as a design goal — more " +
          "servers for a zone without enlarging the referral response the parent has to send.\n\n" +
          "The traffic shape is what makes it safe here. A query over UDP is one packet out and one packet " +
          "back, so the routing system only has to hold its decision still for a single round trip; if the " +
          "next query lands somewhere else, nothing was lost. The same property costs you the audit trail — " +
          "from outside, nobody can tell which instance answered. DNS added the NSID option so a client can " +
          "ask the responding server to name itself, and RFC 4786 recommends designing that kind of in-band " +
          "identification into any anycast service.",
      },
      {
        kind: "numbers",
        rows: [
          {
            quantity: "Root server identities",
            value: "13",
            derivation:
              "Fixed set `a.root-servers.net` … `m.root-servers.net`, operated by 12 organisations (root-servers.org).",
          },
          {
            quantity: "Operational instances behind them",
            value: "2,004",
            derivation:
              "Reported by root-servers.org on 1 September 2026; the figure moves as operators add sites.",
          },
          {
            quantity: "Instances per address, mean",
            value: "≈154",
            derivation:
              "2,004 ÷ 13 = 154.2 — a mean across independently-run fleets, not a per-letter target.",
          },
          {
            quantity: "IPv4 space typically burned per service address",
            value: "256 addresses",
            derivation:
              "RFC 4786 §4.4.2: import policies commonly discard prefixes longer than /24, so the covering route is often a /24 → 2^(32−24) = 256.",
          },
        ],
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What you get", "What it costs", "When that bites"],
        rows: [
          {
            label: "Site selection",
            cells: [
              "The shortest path the routing system knows, with no application logic",
              "One globally propagated route per service address, whatever the fleet behind it",
              "The technique stays limited to a handful of Internet-critical services — RFC 4786 says the scaling of this is what stops anycast being a general approach",
            ],
          },
          {
            label: "Load distribution",
            cells: [
              "Demand — and attack traffic — spread coarsely across every site",
              "Catchments are drawn by other networks' policies, not by your capacity",
              "RFC 4786 advises scaling each node far above its average load; a catchment that gains a large access network absorbs it or falls over",
            ],
          },
          {
            label: "Failover",
            cells: [
              "Withdrawing the advertisement drains a site with no client-side change",
              "Convergence takes as long as neighbouring networks take, and oscillating prefixes get dampened",
              "A node that flaps is suppressed by remote routers for an interval that grows with the oscillation, so it stays dark well after it recovers",
            ],
          },
          {
            label: "Entry cost",
            cells: [
              "One address for a worldwide fleet",
              "An AS number, address space you control, and BGP sessions to operate",
              "Without those you rent someone else's footprint — AWS documents Global Accelerator's static addresses as anycast from its edge network — and you inherit their site list",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "The pattern across the rows: anycast trades *control* for *reach*. Three of those four costs are " +
          "recoverable by engineering — identify the node in-band, over-provision the catchment, damp the " +
          "flapping. The fourth is structural: you cannot buy back the routing decision, because it is not " +
          "yours to make.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Reading \"nearest\" as geographic, or as fast.** BGP ranks paths by its own policy rules, not by " +
            "distance or latency. RFC 4786 is blunt that topological nearness does not in general correlate " +
            "with round-trip performance, and that response times may see no reduction and may increase.",
          "**Advertising the route before the service is ready.** Packets arrive the moment the announcement " +
            "propagates. RFC 4786 wants the advertisement coupled to the health of the software on the node, " +
            "so a site that is up in the routing table but down in the application is not answering for a " +
            "whole catchment.",
          "**Putting a long-lived transfer on an anycast address with no recovery path.** A reset upload or " +
            "stream has to start over. RFC 4786 floats splitting such work: anycast the initialisation, then " +
            "hand the sustained phase to a unicast address chosen during setup.",
          "**Testing from one place.** Your office is one catchment out of dozens, and it is the one least " +
            "likely to be broken. RFC 4786 asks for proactive monitoring from many points precisely because a " +
            "misrouted region is invisible from inside it.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "**\"How does a client reach the nearest edge?\"** The answer that lands is that the two compose " +
            "rather than compete on a [[content-delivery-network-cdn|CDN]] front door — one gets a packet to " +
            "a region, the other chooses between regions and can weight that choice.",
          "**\"Is anycast safe for TCP?\"** The defensible answer is neither yes nor no. RFC 7094 states that " +
            "stateful transports do not understand anycast and will fail when routing moves a session, while " +
            "also recording expanding deployment for CDNs. It works in practice because BGP normally holds one " +
            "consistent exit per destination; naming that reason is the depth signal, not claiming it never " +
            "breaks. Compare [[tcp-vs-udp|TCP against UDP]] here.",
          "**\"How does this help under a volumetric attack?\"** RFC 4786's security section gives two effects: " +
            "each node sinks the attack traffic originating in its own catchment, and the work of separating " +
            "good traffic from bad is spread across the fleet. The caveat worth volunteering is that a " +
            "concentrated attack still lands on one catchment.",
          "**\"Where does it sit next to a load balancer?\"** Two levels, not two options — a design that says " +
            "\"anycast to the nearest region, then least-connections within it\" has answered both at once.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "RFC 1546 — Host Anycasting Service (the original proposal)",
            url: "https://www.rfc-editor.org/rfc/rfc1546.txt",
            type: "doc",
          },
          {
            label: "AWS Global Accelerator — How it works",
            url: "https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html",
            type: "doc",
          },
          {
            label: "Root Server Technical Operations Association — live instance map",
            url: "https://root-servers.org/",
            type: "article",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "RFC 4786 — Operation of Anycast Services (BCP 126)",
      url: "https://www.rfc-editor.org/rfc/rfc4786.txt",
    },
    {
      label: "RFC 7094 — Architectural Considerations of IP Anycast",
      url: "https://www.rfc-editor.org/rfc/rfc7094.txt",
    },
    {
      label: "AWS Global Accelerator Developer Guide — What is Global Accelerator?",
      url: "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
    },
  ],
} satisfies LearnTopic;
