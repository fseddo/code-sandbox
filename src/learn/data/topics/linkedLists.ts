import type { LearnTopic } from "@/learn/data/topic";

export const linkedLists = {
  slug: "linked-lists",
  title: "Linked lists",
  category: "data-structures",
  summary: "Nodes chained by pointers — O(1) insert/delete at a known spot, but no O(1) random access.",
  tags: ["linked-list"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A linked list is a chain of *nodes*, each holding a value and a `next` pointer to the following node " +
          "(the last points to `null`). Nodes aren't contiguous in memory, so there's no `base + i` trick — " +
          "reaching position `i` means walking `i` links. The payoff is cheap structural edits.",
      },
      {
        kind: "graph",
        directed: true,
        caption: "Each node points to the next; the tail points to null. Follow the arrows — there's no jumping.",
        nodes: ["1", "2", "3", "null"],
        edges: [
          ["1", "2"],
          ["2", "3"],
          ["3", "null"],
        ],
      },
    ],
    operations: [
      {
        kind: "complexity",
        rows: [
          { operation: "access / search by value", average: "O(n)", worst: "O(n)", note: "walk from the head" },
          { operation: "insert / delete at head", average: "O(1)", worst: "O(1)" },
          { operation: "insert / delete after a known node", average: "O(1)", worst: "O(1)", note: "just relink pointers" },
          { operation: "find then delete", average: "O(n)", worst: "O(n)", note: "the find dominates" },
        ],
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a linked list when you insert or delete at the ends or at a node you already hold — those " +
          "are O(1) pointer relinks, where an array would shift O(n) elements. It also underlies queues and " +
          "stacks. Skip it when you need random access or tight iteration — an array's contiguity wins there.",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Linked list vs array",
        body:
          "Arrays give O(1) indexing and better cache locality; linked lists give O(1) insert/delete at a known " +
          "node and grow without reallocating. The recurring interview tells are a `dummy` head node (to dodge " +
          "empty-list edge cases) and the `prev`/`curr`/`next` three-pointer dance for reversing in place.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "A node is just a value plus a next pointer; reversal rewires next as it walks.",
        source:
          "// const node = { val: 1, next: null };\n" +
          "function reverseList(head) {\n" +
          "  let prev = null;\n" +
          "  let curr = head;\n" +
          "  while (curr) {\n" +
          "    const next = curr.next; // save before we overwrite it\n" +
          "    curr.next = prev;       // flip this link backwards\n" +
          "    prev = curr;            // advance both pointers\n" +
          "    curr = next;\n" +
          "  }\n" +
          "  return prev; // new head\n" +
          "}",
      },
    ],
    example: [
      {
        kind: "prose",
        body:
          "**Merge Two Sorted Lists** — *splice two sorted lists into one sorted list.* A `dummy` head lets us " +
          "append without special-casing the first node; we repeatedly attach the smaller head and advance that " +
          "list, then tack on whatever remains.",
      },
      {
        kind: "code",
        lang: "javascript",
        caption: "The dummy head removes the empty-result edge case; one pass, O(1) extra space.",
        source:
          "function mergeTwoLists(l1, l2) {\n" +
          "  const dummy = { val: 0, next: null }; // fake head to append onto\n" +
          "  let tail = dummy;\n" +
          "  while (l1 && l2) {\n" +
          "    // attach the smaller node, then advance that list\n" +
          "    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }\n" +
          "    else { tail.next = l2; l2 = l2.next; }\n" +
          "    tail = tail.next;\n" +
          "  }\n" +
          "  tail.next = l1 ?? l2; // one list is now empty; attach the rest\n" +
          "  return dummy.next;\n" +
          "}",
      },
      { kind: "exampleProblem", problemId: "merge-two-sorted-lists", note: "Now try it yourself." },
      {
        kind: "exampleProblem",
        problemId: "reverse-linked-list-ii",
        note: "The reverse pattern above, applied to a sublist between two positions.",
      },
    ],
  },
} satisfies LearnTopic;
