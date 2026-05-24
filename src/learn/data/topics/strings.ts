import type { LearnTopic } from "@/learn/data/topic";

export const strings = {
  slug: "strings",
  title: "Strings",
  category: "data-structures",
  summary: "Immutable character sequences — indexing is O(1), but every 'edit' builds a new string.",
  tags: ["string"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A string is an immutable sequence of characters. In JavaScript, indexing and `length` are O(1), but " +
          "strings can't be changed in place — `slice`, `concat`, and `replace` all build a *new* string. That " +
          "makes repeated concatenation inside a loop a hidden O(n²); accumulate into an array and `join` instead.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Most string problems reduce to array techniques over the characters — two pointers, sliding windows, " +
          "and frequency maps. When you need to mutate, work on an array of characters (or a builder) and join " +
          "at the end, since the string itself is fixed.",
      },
    ],
  },
} satisfies LearnTopic;
