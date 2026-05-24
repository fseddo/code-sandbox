import type { LearnTopic } from "@/learn/data/topic";

export const nosqlDatabases = {
  slug: "nosql-databases",
  title: "NoSQL databases",
  category: "databases",
  summary: "Non-relational stores — key-value, document, wide-column, graph — trading joins for scale & flexibility.",
  tags: ["database", "backend", "scalability"],
  sources: [
    { label: "MongoDB — NoSQL explained", url: "https://www.mongodb.com/nosql-explained" },
    { label: "Design Gurus — System design fundamentals", url: "https://www.designgurus.io/blog/system-design-interview-fundamentals" },
  ],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "'NoSQL' covers non-relational stores that trade SQL's rigid schema and joins for flexibility and " +
          "horizontal scale. The families: **key-value** (Redis, DynamoDB), **document** (MongoDB), " +
          "**wide-column** (Cassandra), and **graph** (Neo4j). Many favour availability and partition tolerance " +
          "over strict consistency — the CAP trade-off.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for NoSQL when data is schemaless or denormalized, the access pattern is simple and known " +
          "(lookup by key), or you must scale writes across many nodes. The cost is weaker consistency guarantees " +
          "and limited ad-hoc querying and joins compared to a relational database.",
      },
    ],
  },
} satisfies LearnTopic;
