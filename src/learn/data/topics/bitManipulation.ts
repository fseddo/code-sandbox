import type { LearnTopic } from "@/learn/data/topic";

export const bitManipulation = {
  slug: "bit-manipulation",
  title: "Bit manipulation",
  category: "algorithms",
  summary: "Operate on binary directly with AND/OR/XOR/shifts — XOR cancels, masks encode small sets.",
  tags: ["bit-manipulation"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "Bit manipulation works on a number's binary representation with AND, OR, XOR, NOT, and shifts. The " +
          "recurring tricks: `x & (x - 1)` clears the lowest set bit, XOR cancels equal values (so it finds a " +
          "lone unpaired number), and a bitmask packs a set of up to ~32 booleans into one integer.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for bit tricks on single-number / XOR problems, subset enumeration via bitmasks, and space-tight " +
          "flag sets. In JavaScript, bitwise operators coerce operands to 32-bit *signed* integers — a gotcha for " +
          "values beyond 2³¹.",
      },
    ],
  },
} satisfies LearnTopic;
