import type { LearnTopic } from "@/learn/data/topic";

export const dnsLoadBalancing = {
  slug: "dns-load-balancing",
  title: "DNS load balancing",
  category: "systems",
  archetype: "mechanism",
  parent: "load-balancers",
  summary:
    "Balancing by handing out different answers — the decision is made before the connection exists, cached by resolvers you do not own, and every property follows from that.",
  tags: ["networking", "scalability"],
  priority: "mid",
  estimatedMinutes: 15,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "**DNS load balancing** spreads traffic by answering one name with different addresses. A resolver " +
          "asks for `api.example.com`, the authoritative server picks records out of a set, and the client " +
          "connects to whatever it was handed. Nothing sits between client and server: the distribution happens " +
          "during name resolution, before the connection exists.\n\n" +
          "That buys cross-region and cross-datacenter spread for the price of a zone file, with no new " +
          "component on the request path to fail. It costs **control**. The answer is cached by a chain of " +
          "resolvers you do not own, for a duration you can only *ask* for.\n\n" +
          "RFC 1035 defines the TTL as the interval a record **may** be cached before the source *should* again " +
          "be consulted — a ceiling rather than a schedule, and §7.3 lets a resolver clamp one it judges too " +
          "long. RFC 8767 tightens the second half to a **MUST** reconsult, then licenses one exception: a " +
          "record whose refresh fails may be served as though it were unexpired.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "The cue is a design that has to split traffic across regions or datacenters, or place a client " +
          "*before* it can reach any load balancer at all. Name resolution is the first hop of every *cold* " +
          "request, " +
          "so no other layer can act earlier — and it is the cheapest distribution available: no capacity, no " +
          "new box, no per-request cost.\n\n" +
          "Wrong page when the choice is between healthy instances inside one datacenter — that is " +
          "[[load-balancers|the load balancer's]] job, decided per request with health information DNS never " +
          "sees. Wrong page too when the requirement is stated in seconds of failover, because the cache chain below " +
          "sets a floor you cannot bid under.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        heading: "Five ways to pick the answer",
        body:
          "Every variant answers one question — *which records go in this response* — and they differ in what " +
          "gets consulted first. AWS documents each of the five below as a Route 53 routing policy, which makes " +
          "that a usable vocabulary.\n\n" +
          "**Round-robin** returns several records for one name and rotates or randomises among them; Route " +
          "53's multivalue-answer policy is the health-aware form, answering with up to eight healthy records " +
          "chosen at random. **Weighted** attaches a share to each record, so a 90/10 pair sends a tenth of new " +
          "resolutions at a new stack. **Latency-based** answers with the endpoint whose measured latency to " +
          "the querying network is lowest. **Geolocation** maps the query's source to a region you enumerated " +
          "and answers with that region's record. **Failover** pairs a primary record with a secondary and " +
          "swaps them when the primary's health check goes unhealthy.",
      },
      {
        kind: "comparison",
        caption: "The axis is what each policy has to know, and what the resulting split is actually a share of.",
        columns: ["", "Needs to know", "The split is a share of", "Operational cost"],
        rows: [
          {
            label: "Round-robin / multivalue",
            cells: [
              "Nothing beyond the record set — plus per-record health, in the multivalue form",
              "Cache entries, not requests",
              "Zone edits",
            ],
          },
          {
            label: "Weighted",
            cells: [
              "A share you assign per record",
              "Resolutions made during the window the weights are live",
              "Zone edits; every re-weighting is another one",
            ],
          },
          {
            label: "Latency-based",
            cells: [
              "Latency measured between networks and endpoints — AWS notes its data covers traffic between users and AWS data centers only",
              "Querying networks, ranked",
              "The provider's measurement network, which you rent rather than run",
            ],
          },
          {
            label: "Geolocation",
            cells: [
              "The source address of the query, mapped to a place",
              "The regions you enumerated",
              "A region map plus a default record — without one, unmapped queries get no answer",
            ],
          },
          {
            label: "Failover",
            cells: [
              "One health check's verdict on the primary",
              "Nothing — it is all-or-nothing for every client",
              "A prober per endpoint, billed per check",
            ],
          },
        ],
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        body:
          "[[domain-name-system-dns|DNS]] owns the protocol itself — records, delegation, how a name resolves. " +
          "This page owns one use of it and what caching does to that use.\n\n" +
          "DNS gets a client to a *site*; [[load-balancers|a load balancer]] then picks the *machine*, with " +
          "[[load-balancing-algorithms|the algorithm it picks by]] a page of its own. " +
          "[[anycast-routing|Anycast]] reaches the same goal in the routing layer, with no per-client answer " +
          "to cache, and a [[content-delivery-network-cdn|CDN]] edge is often both in layers.",
      },
    ],
    example: [
      {
        kind: "prose",
        heading: "Withdrawing a datacenter",
        body:
          "Two sites, `api.example.com` carrying one A record for each, a 60-second TTL, and a health check per " +
          "endpoint. All three of those are chosen values, not defaults. The east site loses its database; " +
          "follow what the withdrawal actually reaches.\n\n" +
          "The health checker notices first, and only after enough consecutive failures to be confident. The " +
          "authoritative server then stops putting the east address in *new* answers. Every resolver already " +
          "holding the old response keeps serving it to its own clients until its own copy expires — and so " +
          "does every OS and every browser process below it. Traffic to the dead site does not stop. It decays.",
      },
      {
        kind: "sequence",
        caption:
          "One lookup, three independent caches. The withdrawal happens at the right-hand edge and reaches the " +
          "left-hand edge only as each cache runs its own copy down.",
        actors: ["Browser", "OS resolver", "Recursive resolver", "Authoritative NS", "East site"],
        steps: [
          {
            from: "Browser",
            to: "Browser",
            label: "check the in-process cache",
            note: "A hit never leaves the process — your nameservers see no query at all",
          },
          { from: "Browser", to: "OS resolver", label: "resolve api.example.com" },
          { from: "OS resolver", to: "OS resolver", label: "check the OS cache" },
          { from: "OS resolver", to: "Recursive resolver", label: "query A api.example.com" },
          {
            from: "Recursive resolver",
            to: "Recursive resolver",
            label: "check the cache",
            note: "On a hit it answers with whatever is left of the TTL and stops here",
          },
          { from: "Recursive resolver", to: "Authoritative NS", label: "query A api.example.com — on a miss only" },
          {
            from: "Authoritative NS",
            to: "Recursive resolver",
            label: "A 203.0.113.10, TTL 60",
            dashed: true,
            note: "The routing policy runs here, once, for this resolver",
          },
          { from: "Recursive resolver", to: "OS resolver", label: "A 203.0.113.10, TTL counting down", dashed: true },
          { from: "OS resolver", to: "Browser", label: "203.0.113.10", dashed: true },
          {
            from: "Browser",
            to: "East site",
            label: "TCP + TLS to 203.0.113.10",
            note: "The balancing decision is already spent; this hop consults nothing",
          },
          {
            from: "Authoritative NS",
            to: "Authoritative NS",
            label: "health check fails — pull the A record",
            note: "Takes effect on the next cache miss, not the next request",
          },
          {
            from: "Browser",
            to: "East site",
            label: "reconnect — still 203.0.113.10",
            note: "Three caches upstream still hold it, each on its own clock",
          },
        ],
      },
      {
        kind: "numbers",
        caption: "The two clocks a DNS failover runs on, and the tail underneath them.",
        rows: [
          {
            quantity: "Health checker declares east down",
            value: "90 s",
            derivation:
              "30 s request interval × 3 consecutive failures. AWS documents intervals of 10 s or 30 s and a consecutive-failure threshold; both values chosen here. Modelled as one prober — Route 53 in fact runs uncoordinated checkers and calls an endpoint unhealthy when 18% or fewer report it healthy",
          },
          {
            quantity: "A TTL-honouring resolver stops handing out the old address",
            value: "≤ 150 s after the fault",
            derivation: "90 s detection + the record's 60 s TTL, assuming the resolver expires on schedule",
          },
          {
            quantity: "OS and browser caches below it expire",
            value: "later, and unmeasured",
            derivation:
              "Each holds its own copy on its own clock and reports to nobody; your nameserver's query volume cannot see them",
          },
          {
            quantity: "Expired answer retained when your nameservers are unreachable",
            value: "1–3 days",
            derivation:
              "RFC 8767's suggested maximum stale timer. It applies to a failed refresh, not to a successful withdrawal — the tail case, not the normal one",
          },
        ],
      },
      {
        kind: "prose",
        body:
          "Two and a half minutes is the floor, and it holds only where every cache honours the number. The " +
          "shape is the lesson: a DNS failover is a decay curve with a long tail.",
      },
    ],
    tradeoffs: [
      {
        kind: "comparison",
        columns: ["", "What you pay", "When it bites"],
        rows: [
          {
            label: "Withdrawal is advisory",
            cells: [
              "The endpoint has to keep answering after you remove its record, so hardware you planned to switch off stays on and the decommission date is not yours to set",
              "Every planned drain, and every incident where the failing site is still healthy enough to accept a connection",
            ],
          },
          {
            label: "Short TTLs for agility",
            cells: [
              "A full resolution round trip before the first byte for every cold client, and the query volume that buys the agility lands on your nameservers",
              "Clients on high-latency links, and pages that resolve several names before anything renders",
            ],
          },
          {
            label: "One resolver, one decision",
            cells: [
              "A resolver serving a million clients takes one answer for all of them, so an even record set does not produce an even load",
              "Populations concentrated behind a few carrier, corporate or public resolvers",
            ],
          },
          {
            label: "Geo and latency policies",
            cells: [
              "They read the query's source address, so you are routing the resolver — AWS documents falling back to the resolver's location whenever it does not send edns-client-subnet",
              "Any population on a centralised public resolver, or a corporate resolver in another continent",
            ],
          },
          {
            label: "Health-checked records",
            cells: [
              "A verdict formed outside your network, by checkers that see only what the public internet sees",
              "An endpoint reachable from your datacenter but not from the checkers' networks — and what a shallow probe proves at all is [[load-balancers|the balancer's]] subject",
            ],
          },
        ],
      },
      {
        kind: "prose",
        body:
          "Which settles the decision: DNS is a **distribution** mechanism that can also fail over, not a " +
          "failover mechanism. Use it to place clients near a site and to shift shares deliberately, and put " +
          "something in the request path behind it — an in-datacenter [[load-balancers|load balancer]], or " +
          "[[anycast-routing|anycast]] one layer down — to cover the seconds the cache chain owns.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "**Planning a cutover around the TTL you set.** RFC 1034 recommends reducing the TTL ahead of an anticipated change and restoring it afterwards — do that, and still read the number as the earliest an answer can change rather than the latest.",
          "**Treating your own TTL as the ceiling.** It binds in one direction only: RFC 1035 §7.3 tells a resolver it may discard or clamp a TTL it judges excessive, and RFC 8767 recommends capping retention at a week. A long TTL is no more enforceable than a short one.",
          "**Expecting an even split out of a multi-record answer.** RFC 1034 says record order within a set is not significant and need not be preserved, and that a resolver library may sort the addresses or return only the best one. Multiple records buy spread, not shares.",
          "**Measuring a withdrawal at the nameserver.** Query volume there describes recursive resolvers and nothing nearer the user, so watch the dead endpoint's own connection count instead — it is the only place the long tail is visible.",
        ],
      },
    ],
    interviewAngle: [
      {
        kind: "callout",
        tone: "tip",
        items: [
          "*How would you fail traffic over to another region?* Give two clocks with a number on each — detection at the prober, then expiry through the cache chain — and say which one you can shrink. Quoting a TTL as the recovery time is the answer that gets pushed on.",
          "*What TTL would you pick?* Treat the number as a bid rather than a setting — 60 seconds for records you expect to move. Then name what a permanently low value costs, because that is the half most answers skip.",
          "*Why not just use DNS round-robin instead of a load balancer?* Because the answer is chosen once per cache entry rather than once per request, and the response carries no live health signal.",
          "*You've put geolocation in front of three regions — what happens when one dies?* A region map has no health input at all, so it keeps answering with the dead region's address. The depth answer composes: geolocation for placement, a failover pair or health-checked records underneath it for liveness.",
        ],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          {
            label: "RFC 1035 — Domain Names (§3.2.1 defines the TTL; §7.3 lets a resolver clamp one it judges too long)",
            url: "https://www.rfc-editor.org/rfc/rfc1035.txt",
            type: "doc",
          },
          {
            label: "AWS — How Amazon Route 53 uses EDNS0 to estimate the location of a user",
            url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-edns0.html",
            type: "doc",
          },
          {
            label: "Cloudflare — Load Balancing documentation",
            url: "https://developers.cloudflare.com/load-balancing/",
            type: "doc",
          },
        ],
      },
    ],
  },
  sources: [
    {
      label: "RFC 1034 — Domain Names: Concepts and Facilities",
      url: "https://www.rfc-editor.org/rfc/rfc1034.txt",
    },
    {
      label: "RFC 8767 — Serving Stale Data to Improve DNS Resiliency",
      url: "https://www.rfc-editor.org/rfc/rfc8767.txt",
    },
    {
      label: "AWS — Choosing a routing policy (Amazon Route 53)",
      url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-latency.html",
    },
    {
      label: "AWS — How Amazon Route 53 determines whether a health check is healthy",
      url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-determining-health-of-endpoints.html",
    },
  ],
} satisfies LearnTopic;
