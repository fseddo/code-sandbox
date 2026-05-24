import type { LearnTopic } from "@/learn/data/topic";

export const tries = {
  slug: "tries",
  title: "Tries",
  category: "data-structures",
  summary: "Prefix trees — lookup in O(key length), and shared prefixes share nodes.",
  tags: ["trie"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A trie (prefix tree) stores strings character-by-character along paths from the root, so words sharing " +
          "a prefix share nodes. Lookup and insert take O(L) in the key length L, independent of how many keys " +
          "are stored; a node flag marks the end of a complete word.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a trie for prefix queries — autocomplete, spell-check, word-search boards, and 'does any " +
          "stored word start with this?' It trades memory for fast prefix work that a hash set can't do directly.",
      },
    ],
  },
} satisfies LearnTopic;
