import type { LearnTopic } from "@/learn/data/topic";

export const matrix = {
  slug: "matrix",
  title: "Matrices & grids",
  category: "data-structures",
  summary: "2D arrays addressed by [row][col] — many grid problems are implicit graphs.",
  tags: ["matrix"],
  priority: "mid",
  estimatedMinutes: 30,
  parts: {
    definition: [
      {
        kind: "prose",
        body:
          "A matrix (2D grid) is an array of arrays addressed by `[row][col]`. Many grid problems are *implicit " +
          "graphs*: each cell is a vertex whose neighbours are the cells up, down, left, and right (sometimes the " +
          "diagonals), so BFS and DFS apply directly without building an explicit graph.",
      },
    ],
    whenToUse: [
      {
        kind: "prose",
        body:
          "Reach for grid BFS/DFS for flood-fill, island-counting, and shortest-path-in-a-maze. Watch for in-place " +
          "transforms (rotate, set-zeroes, spiral) and, above all, careful bounds checking at the edges.",
      },
    ],
  },
} satisfies LearnTopic;
