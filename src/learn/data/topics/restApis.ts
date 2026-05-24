import type { LearnTopic } from "@/learn/data/topic";

export const restApis = {
  slug: "rest-apis",
  title: "REST APIs",
  category: "web",
  summary: "Resources by URL, actions by HTTP verb, stateless requests — the default web API style.",
  tags: ["backend", "api", "networking"],
  sources: [
    { label: "MDN — HTTP request methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" },
    { label: "MDN — An overview of HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
  ],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "REST is an architectural style for HTTP APIs: resources are addressed by URLs (`/users/42`), acted on " +
          "with HTTP verbs (GET, POST, PUT, PATCH, DELETE), and responses carry status codes. It's **stateless** — " +
          "each request stands alone and carries its own authentication.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for REST as the default for resource-oriented services — simple, cacheable, and universally " +
          "supported. Consider GraphQL when clients need to shape exactly which fields they fetch (avoiding over- " +
          "and under-fetching), or gRPC for low-latency internal service-to-service calls.",
      },
    ],
  },
} satisfies LearnTopic;
