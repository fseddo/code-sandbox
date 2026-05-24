import type { LearnTopic } from "@/learn/data/topic";

export const arrays = {
  slug: "arrays",
  title: "Arrays",
  category: "data-structures",
  summary: "Contiguous, index-addressable sequences — O(1) random access, but O(n) to insert at the front.",
  tags: ["array"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "An array stores elements in a contiguous, *index-addressable* block, so reading or writing the " +
          "element at position `i` is O(1) — the address is just `base + i`. JavaScript arrays are *dynamic* " +
          "(they grow on demand) and untyped, but the index-access guarantee still holds.",
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "access by index", average: "O(1)", worst: "O(1)" },
          { operation: "push / pop (end)", average: "amortized O(1)", worst: "O(n)", note: "amortized over the occasional grow/copy" },
          { operation: "shift / unshift (front)", average: "O(n)", worst: "O(n)", note: "every element re-indexes" },
          { operation: "indexOf / includes", average: "O(n)", worst: "O(n)" },
          { operation: "splice (middle)", average: "O(n)", worst: "O(n)" },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for an array when order matters and you address elements *by position* — iterating, two-pointer " +
          "scans, or using the end as a stack (`push`/`pop`). Avoid it when your hot path inserts or deletes at " +
          "the *front* or middle: those are O(n) because everything after the gap shifts.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Array vs linked list",
        body:
          "An array wins on random access (O(1) vs O(n)) and cache locality. A linked list wins when you insert " +
          "or delete at a *known* position — O(1) by relinking nodes, vs O(n) to shift an array. Pick by which " +
          "operation is hot.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "End operations are cheap; front operations re-index every element.",
        source:
          "const a = [10, 20, 30];\n" +
          "a.push(40);    // [10,20,30,40] — amortized O(1)\n" +
          "a.pop();       // [10,20,30]    — O(1)\n" +
          "a.unshift(5);  // [5,10,20,30]  — O(n), everything shifts right\n" +
          "a.shift();     // [10,20,30]    — O(n), everything shifts left",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Maximum Subarray** — *find the contiguous subarray with the largest sum.* Kadane's algorithm scans " +
          "once, tracking the best sum *ending at* the current index: either extend the running sum, or start " +
          "fresh at the current element — whichever is larger.",
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "One O(n) pass, O(1) extra space — no nested loop over subarrays.",
        source:
          "function maxSubArray(nums) {\n" +
          "  let best = nums[0];\n" +
          "  let current = nums[0];\n" +
          "  for (let i = 1; i < nums.length; i++) {\n" +
          "    // extend the running sum, or restart at nums[i] — whichever is bigger\n" +
          "    current = Math.max(nums[i], current + nums[i]);\n" +
          "    best = Math.max(best, current);\n" +
          "  }\n" +
          "  return best;\n" +
          "}",
      },
      { kind: "exampleProblem", problemId: "maximum-subarray", note: "Now try it yourself." },
    ],
  },
} satisfies LearnTopic;
