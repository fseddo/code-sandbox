import { defineAlgoProblem } from "../problem";

// Multiple orderings can satisfy the same prerequisites (courses with no dependency between them can
// come in either order), so deep-equal on one fixed array would wrongly fail a correct solution. The
// checker instead validates that `actual` is a permutation of every course, honors every prerequisite,
// and matches `expected` only on whether it's empty (the cycle / no-cycle verdict).
export const courseScheduleII = defineAlgoProblem<[number, number[][]], number[]>({
  id: "course-schedule-ii",
  number: 169,
  title: "Course Schedule II",
  difficulty: "medium",
  tags: ["depth-first-search", "breadth-first-search", "graph", "topological-sort"],
  functionName: "findOrder",
  prompt: `There are \`numCourses\` courses labelled \`0\` to \`numCourses - 1\`. You are given a list \`prerequisites\` where \`prerequisites[i] = [a, b]\` means you must take course \`b\` **before** course \`a\`.

Return **an ordering** of all \`numCourses\` courses such that every prerequisite is satisfied (for each pair, \`b\` appears before \`a\`). If multiple valid orderings exist, return any one of them. If it is impossible to finish all courses — the prerequisite relation contains a **cycle** — return an empty array.`,
  constraints: [
    "1 <= numCourses <= 2000",
    "0 <= prerequisites.length <= 5000",
    "prerequisites[i].length == 2",
    "0 <= a, b < numCourses",
    "All the pairs prerequisites[i] are distinct.",
  ],
  checker: `(actual, args, expected) => {
  const [numCourses, prerequisites] = args;
  if (!Array.isArray(actual)) return false;
  if (expected.length === 0) return actual.length === 0;
  if (actual.length !== numCourses) return false;
  const position = new Map();
  for (const course of actual) {
    if (typeof course !== "number" || course < 0 || course >= numCourses || position.has(course)) return false;
    position.set(course, position.size);
  }
  if (position.size !== numCourses) return false;
  for (const [a, b] of prerequisites) {
    if (position.get(b) > position.get(a)) return false;
  }
  return true;
}`,
  starterCode: {
    javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
function findOrder(numCourses, prerequisites) {
  // your code here
}`,
    typescript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "linear chain",
      args: [2, [[1, 0]]],
      expected: [0, 1],
      explanation: "0 has no prerequisites, so it must come first; 1 needs 0.",
    },
    {
      name: "diamond dependency",
      args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]],
      expected: [0, 1, 2, 3],
      explanation: "0 unlocks both 1 and 2, and 3 needs both — any order with 0 first and 3 last works.",
    },
    {
      name: "cycle is impossible",
      args: [2, [[1, 0], [0, 1]]],
      expected: [],
      explanation: "0 needs 1 and 1 needs 0 — a cycle, so no ordering can satisfy both.",
    },
  ],
  hiddenTests: [
    // Boundary: a single course, no prerequisites.
    { args: [1, []], expected: [0] },
    // Boundary: no prerequisites at all — any permutation is valid.
    { args: [3, []], expected: [0, 1, 2] },
    // Edge: a self-loop is a cycle of length 1.
    { args: [1, [[0, 0]]], expected: [] },
    // Edge: a longer cycle buried among otherwise-valid edges.
    { args: [5, [[1, 0], [2, 1], [3, 2], [4, 3], [1, 4]]], expected: [] },
    // Structural: two independent chains — order between them is free.
    { args: [4, [[1, 0], [3, 2]]], expected: [0, 1, 2, 3] },
    // Structural: a cycle in only one of several components.
    { args: [6, [[1, 0], [2, 1], [4, 3], [3, 4], [5, 4]]], expected: [] },
    // Structural: fan-in — many prerequisites converging on one course.
    { args: [4, [[3, 0], [3, 1], [3, 2]]], expected: [0, 1, 2, 3] },
    // Structural: fan-out — one course unlocking many, no shared dependents.
    { args: [4, [[1, 0], [2, 0], [3, 0]]], expected: [0, 1, 2, 3] },
    // Anti-hardcode: reversed input order and a non-trivial dependency graph, unlike the examples.
    { args: [6, [[5, 4], [4, 3], [3, 2], [2, 1], [1, 0], [5, 0]]], expected: [0, 1, 2, 3, 4, 5] },
    // Anti-hardcode: dependencies run from low to high index, so the valid order is descending —
    // catches a solution that hardcodes "ascending index order" instead of actually respecting edges.
    { args: [4, [[0, 1], [1, 2], [2, 3]]], expected: [3, 2, 1, 0] },
    // Anti-hardcode: a wide DAG with no single obvious chain.
    { args: [7, [[2, 0], [2, 1], [4, 2], [5, 2], [6, 4], [6, 5], [3, 1]]], expected: [0, 1, 2, 3, 4, 5, 6] },
    // Scale: a large acyclic chain of 2000 courses.
    {
      args: [2000, Array.from({ length: 1999 }, (_unused, i) => [i + 1, i])],
      expected: Array.from({ length: 2000 }, (_unused, i) => i),
    },
    // Scale: a large chain with the final edge closing a cycle.
    {
      args: [2000, [
        ...Array.from({ length: 1999 }, (_unused, i) => [i + 1, i]),
        [0, 1999],
      ]],
      expected: [],
    },
    // Scale: a wide fan-in/fan-out DAG with many courses depending on a shared root.
    {
      args: [
        1000,
        Array.from({ length: 999 }, (_unused, i) => [i + 1, 0]),
      ],
      expected: Array.from({ length: 1000 }, (_unused, i) => i),
    },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "Kahn's algorithm (BFS topological sort)",
      explanation: `Model the courses as a directed graph: an edge \`b -> a\` for each prerequisite \`[a, b]\` ("b unlocks a"). Compute each course's **in-degree** (how many prerequisites it still has) and start a queue with every course already at in-degree \`0\`. Repeatedly dequeue a course, append it to the order, and decrement the in-degree of everything it unlocks — queuing any that drop to \`0\`.

If every course gets appended, the queue processed the whole graph in a valid order. If a cycle exists, the courses inside it never reach in-degree \`0\`, so fewer than \`numCourses\` get appended — return \`[]\`.

\`O(V + E)\` time and space.`,
      code: {
        javascript: `function findOrder(numCourses, prerequisites) {
  // adj[b] lists the courses that b unlocks; indegree[a] counts a's remaining prerequisites.
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indegree[a]++;
  }

  const queue = [];
  for (let c = 0; c < numCourses; c++) {
    if (indegree[c] === 0) queue.push(c);
  }

  const order = [];
  while (queue.length > 0) {
    const course = queue.shift();
    order.push(course);
    for (const next of adj[course]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }

  return order.length === numCourses ? order : [];
}`,
        typescript: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  // adj[b] lists the courses that b unlocks; indegree[a] counts a's remaining prerequisites.
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const indegree = new Array<number>(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indegree[a]++;
  }

  const queue: number[] = [];
  for (let c = 0; c < numCourses; c++) {
    if (indegree[c] === 0) queue.push(c);
  }

  const order: number[] = [];
  while (queue.length > 0) {
    const course = queue.shift()!;
    order.push(course);
    for (const next of adj[course]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }

  return order.length === numCourses ? order : [];
}`,
      },
    },
  ],
});
