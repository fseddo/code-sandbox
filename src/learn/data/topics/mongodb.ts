import type { LearnTopic } from "@/learn/data/topic";

export const mongodb = {
  slug: "mongodb",
  title: "MongoDB",
  category: "databases",
  summary: "A document store — JSON-like documents in collections, related data often embedded, not joined.",
  tags: ["database", "backend"],
  sources: [{ label: "MongoDB documentation", url: "https://www.mongodb.com/docs/" }],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "MongoDB is a document database: it stores JSON-like documents (BSON) in *collections*, and unlike a " +
          "relational table, each document can have its own shape. Related data is often **embedded** in one " +
          "document rather than split across joined tables.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for MongoDB when data is naturally document-shaped and read together — a product with its " +
          "variants, a post with its comments — and the schema evolves over time. Avoid it when many-to-many " +
          "joins or multi-document transactions are the norm; that's relational territory.",
      },
    ],
  },
} satisfies LearnTopic;
