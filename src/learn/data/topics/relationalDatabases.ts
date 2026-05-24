import type { LearnTopic } from "@/learn/data/topic";

export const relationalDatabases = {
  slug: "relational-databases",
  title: "Relational databases",
  category: "databases",
  summary: "Tables, fixed schema, SQL, and ACID transactions — the default for structured, related data.",
  tags: ["database", "backend"],
  sources: [
    { label: "PostgreSQL documentation", url: "https://www.postgresql.org/docs/" },
    { label: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/" },
  ],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A relational database stores data in *tables* of rows and columns with a fixed schema, and links " +
          "tables through keys. It's queried with [[SQL]] and provides [[ACID]] transactions — atomic, " +
          "consistent, isolated, durable — so concurrent writes stay correct. Postgres and MySQL are the common " +
          "engines, and application code usually talks to one through an [[ORM]].",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a relational database as the *default* for structured data with relationships and integrity " +
          "needs — accounts, orders, anything where a transaction must be all-or-nothing. It's less suited to a " +
          "constantly-shifting schema or scaling writes horizontally beyond one primary node — that's where " +
          "[[NoSQL]] comes in.",
      },
    ],
  },
} satisfies LearnTopic;
