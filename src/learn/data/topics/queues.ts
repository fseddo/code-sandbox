import type { LearnTopic } from "@/learn/data/topic";

export const queues = {
  slug: "queues",
  title: "Queues",
  category: "data-structures",
  summary: "First-in, first-out — enqueue at the back, dequeue from the front. The engine behind BFS.",
  tags: ["queue"],
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A queue is **FIFO** (first-in, first-out): you enqueue at the back and dequeue from the front. A " +
          "*deque* (double-ended queue) allows adds and removes at both ends. The front-dequeue is exactly the " +
          "operation a plain array does poorly — `array.shift` is O(n) because every element re-indexes.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for a queue for breadth-first traversal, scheduling, and any 'process in arrival order' task. " +
          "For an O(1) queue in JavaScript, use a head index into an array (or two stacks) rather than `shift`.",
      },
    ],
  },
} satisfies LearnTopic;
