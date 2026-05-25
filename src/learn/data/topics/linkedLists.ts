import type { LearnTopic } from "@/learn/data/topic";

export const linkedLists = {
  slug: "linked-lists",
  title: "Linked lists",
  category: "data-structures",
  summary: "Nodes chained by pointers — O(1) insert/delete at a known spot, but no O(1) random access.",
  tags: ["linked-list"],
  priority: "high",
  estimatedMinutes: 60,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A linked list is a chain of *nodes*, each holding a value and a `next` pointer to the following node " +
          "(the last points to `null`). Nodes aren't contiguous in memory, so there's no `base + i` trick — " +
          "reaching position `i` means walking `i` links. The payoff is cheap structural edits: splicing a node " +
          "in or out is a couple of pointer reassignments, no shifting.",
      },
      {
        kind: "listWalkthrough",
        heading: "the chain 1 -> 2 -> 3, and what a head-insert costs",
        nodes: [1, 2, 3],
        frames: [
          {
            caption: "A list is just nodes joined by `next` links; the tail's `next` is `null`. There's no index — to reach a node you follow arrows from the head.",
          },
          {
            pointers: [{ name: "head", at: 0 }],
            caption: "`head` names the first node. Everything you do starts from the pointer you hold.",
          },
          {
            pointers: [{ name: "head", at: 0 }],
            active: [0],
            action: "newNode.next = head",
            caption: "To prepend a value, point the new node's `next` at the current head — no elements move.",
          },
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
          "stacks. In interviews the *prompt* usually hands you a list; the skill being tested is pointer " +
          "surgery — reverse it, find a node from the end, detect a cycle, splice two together — under O(1) " +
          "extra space. Skip linked lists when you need random access or tight cache-friendly iteration: an " +
          "array's contiguity wins there.",
      },
    ],
    techniques: [
      {
        kind: "prose",
        body:
          "**Dummy head** — allocate a throwaway node before the real head and build off it, so prepending or " +
          "deleting the first node needs no special case; return `dummy.next` at the end (*merge two lists*, " +
          "*remove the kth-from-end*, *partition*).\n\n" +
          "**Three-pointer reversal** — carry `prev`, `curr`, and a saved `next`; flip `curr.next` to `prev`, then " +
          "slide all three forward. This rewires the list in place in one pass (*reverse a list*, *reverse a sublist*).\n\n" +
          "**Fast / slow pointers** — advance `fast` two nodes for every one of `slow`. When `fast` reaches the end " +
          "`slow` sits at the midpoint; if the two ever meet, there's a cycle. The basis for the midpoint, cycle, " +
          "and *palindrome* checks.\n\n" +
          "**Two-pass gap** — to act on a node measured from the *end*, send one pointer `k` nodes ahead, then move " +
          "both together; when the leader hits the end, the follower is `k` from the end (*remove nth from end*).",
      },
    ],
    relatedStructures: [
      {
        kind: "prose",
        heading: "Linked list vs array",
        body:
          "Arrays give O(1) indexing and better cache locality; linked lists give O(1) insert/delete at a known " +
          "node and grow without reallocating. The recurring interview tells are a `dummy` head node (to dodge " +
          "empty-list edge cases) and the `prev`/`curr`/`next` three-pointer dance for reversing in place. The " +
          "fast/slow trick is shared with [[two-pointers]] — same idea, applied to nodes instead of indices.",
      },
    ],
    implementation: [
      {
        kind: "code",
        lang: "javascript",
        caption: "A node is just a value plus a next pointer; reversal rewires next as it walks. O(n) time, O(1) space.",
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
          "list, then tack on whatever remains. Here's `2 -> 4` merged with `1 -> 3`:",
      },
      {
        kind: "listWalkthrough",
        heading: "tail builds the merged list a -> b: [2, 4] and [1, 3]",
        nodes: ["d", 1, 2, 3, 4],
        frames: [
          {
            pointers: [{ name: "tail", at: 0 }, { name: "a", at: 2 }, { name: "b", at: 1 }],
            action: "a=2, b=1 → attach b",
            caption: "`d` is the dummy head. Heads are 2 and 1; 1 is smaller, so attach it and advance `b`.",
          },
          {
            pointers: [{ name: "tail", at: 1 }, { name: "a", at: 2 }, { name: "b", at: 3 }],
            active: [1],
            action: "a=2, b=3 → attach a",
            caption: "tail now ends at 1. Heads are 2 and 3; 2 is smaller, attach it and advance `a`.",
          },
          {
            pointers: [{ name: "tail", at: 2 }, { name: "a", at: 4 }, { name: "b", at: 3 }],
            active: [1, 2],
            action: "a=4, b=3 → attach b",
            caption: "Heads are 4 and 3; 3 is smaller, attach it and advance `b` — list b is now exhausted.",
          },
          {
            pointers: [{ name: "tail", at: 3 }, { name: "a", at: 4 }],
            active: [1, 2, 3],
            action: "b empty → tail.next = a",
            caption: "One list is empty, so attach the entire remaining list a (just 4). Done.",
          },
          {
            active: [1, 2, 3, 4],
            caption: "Result: 1 -> 2 -> 3 -> 4. Return `dummy.next`, skipping the throwaway head.",
          },
        ],
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
      {
        kind: "prose",
        body:
          "Each node is attached exactly once and every step is O(1), so the merge is O(n + m) time and O(1) extra " +
          "space — the output reuses the existing nodes rather than copying them.",
      },
      { kind: "exampleProblem", problemId: "merge-two-sorted-lists", note: "Now try it yourself." },
      {
        kind: "exampleProblem",
        problemId: "reverse-linked-list-ii",
        note: "The reverse pattern above, applied to a sublist between two positions.",
      },
    ],
    pitfalls: [
      {
        kind: "callout",
        tone: "warn",
        items: [
          "Save `curr.next` *before* you overwrite it — once you set `curr.next = prev`, the rest of the list is gone unless you stashed it.",
          "Use a `dummy` head whenever the head node itself might change (a delete at position 1, a merge); it removes a whole class of null-head special cases.",
          "Always check `node` *and* `node.next` before reading `node.next.next` — the classic fast-pointer null dereference.",
          "Return the *new* head, not the old one. After a reversal the original `head` is the tail; returning it loses the list.",
        ],
      },
    ],
    cornerCases: [
      {
        kind: "callout",
        tone: "info",
        items: [
          "Empty list (`head === null`).",
          "Single node — many two-pointer setups must still behave (a one-node list is its own reverse and a trivial palindrome).",
          "Two nodes — the smallest case where `slow`/`fast` and pair-swaps actually move.",
          "Operating at the head vs. the tail (the dummy-head case vs. the run-off-the-end case).",
          "All-equal values, which read as palindromes and stress dedup logic.",
        ],
      },
    ],
    practice: [
      {
        kind: "practice",
        essential: ["reverse-linked-list", "remove-nth-node-from-end-of-list"],
        recommended: ["palindrome-linked-list", "intersection-of-two-linked-lists"],
      },
    ],
    resources: [
      {
        kind: "resources",
        items: [
          { label: "NeetCode — Linked List practice set", url: "https://neetcode.io/practice", type: "doc" },
          { label: "Tech Interview Handbook — Linked list cheatsheet", url: "https://www.techinterviewhandbook.org/algorithms/linked-list/", type: "article" },
          { label: "MDN — Working with objects (references)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects", type: "doc" },
        ],
      },
    ],
  },
} satisfies LearnTopic;
