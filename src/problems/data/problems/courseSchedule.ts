import { defineAlgoProblem } from "../problem";

export const courseSchedule = defineAlgoProblem<[number, number[][]], boolean>({
  id: "course-schedule",
  number: 150,
  title: "Course Schedule",
  difficulty: "medium",
  tags: ["depth-first-search", "breadth-first-search", "graph"],
  functionName: "canFinish",
  prompt: `There are \`numCourses\` courses labelled \`0\` to \`numCourses - 1\`. You are given a list \`prerequisites\` where \`prerequisites[i] = [a, b]\` means you must take course \`b\` **before** course \`a\`.

Return \`true\` if it is possible to finish all the courses, and \`false\` otherwise.

It is possible to finish exactly when the prerequisite relation contains **no cycle** — a cycle would mean a course is, transitively, its own prerequisite.`,
  constraints: [
    "1 <= numCourses <= 2000",
    "0 <= prerequisites.length <= 5000",
    "prerequisites[i].length == 2",
    "0 <= a, b < numCourses",
    "All the pairs prerequisites[i] are distinct.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
  // your code here
}`,
    typescript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  // your code here
}`,
  },
  examples: [
    {
      name: "two courses, one prerequisite",
      args: [2, [[1, 0]]],
      expected: true,
      explanation: "Take 0, then 1 — no cycle, so all courses can be finished.",
    },
    {
      name: "mutual prerequisites",
      args: [2, [[1, 0], [0, 1]]],
      expected: false,
      explanation: "0 needs 1 and 1 needs 0 — a cycle, so neither can ever be taken first.",
    },
    { name: "no prerequisites", args: [3, []], expected: true },
  ],
  hiddenTests: [
    // One course, nothing required.
    { args: [1, []], expected: true },
    // A self-loop is a cycle of length 1.
    { args: [1, [[0, 0]]], expected: false },
    // A clean linear chain 0 -> 1 -> 2 -> 3.
    { args: [4, [[1, 0], [2, 1], [3, 2]]], expected: true },
    // A 3-cycle.
    { args: [3, [[1, 0], [2, 1], [0, 2]]], expected: false },
    // A diamond (two paths converging) — still acyclic.
    { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true },
    // A DAG with a back edge buried among valid edges.
    { args: [5, [[1, 0], [2, 1], [3, 2], [4, 3], [1, 4]]], expected: false },
    // Two independent chains, both acyclic.
    { args: [4, [[1, 0], [3, 2]]], expected: true },
    // A cycle living in only one of several components.
    { args: [6, [[1, 0], [2, 1], [4, 3], [3, 4], [5, 4]]], expected: false },
    // Many edges into one course, no cycle (fan-in).
    { args: [4, [[3, 0], [3, 1], [3, 2]]], expected: true },
    // A large acyclic chain of 2000 courses.
    {
      args: [2000, Array.from({ length: 1999 }, (_unused, i) => [i + 1, i])],
      expected: true,
    },
    // A large chain with the final edge closing a cycle.
    {
      args: [2000, [
        ...Array.from({ length: 1999 }, (_unused, i) => [i + 1, i]),
        [0, 1999],
      ]],
      expected: false,
    },
  ],
  source: { origin: "leetcode", frontendId: "207", acRate: 0.4789, confidence: 0.94 },
  solutions: [
    {
      name: "Kahn's algorithm (BFS topological sort)",
      explanation: `Model the courses as a directed graph: an edge \`b -> a\` for each prerequisite \`[a, b]\` ("b unlocks a"). The courses can all be finished iff this graph has no directed cycle, which a topological sort detects directly.

Compute each course's **in-degree** (how many prerequisites it still has). Repeatedly take any course with in-degree \`0\` — it is ready to take — and "remove" it by decrementing the in-degree of every course it unlocks, queuing any that drop to \`0\`. Count how many courses get taken this way. If a cycle exists, the courses inside it can never reach in-degree \`0\`, so the count falls short of \`numCourses\`.

\`O(V + E)\` time — every course and prerequisite edge is processed once — and \`O(V + E)\` space for the adjacency lists and the queue.`,
      code: {
        javascript: `function canFinish(numCourses, prerequisites) {
  // adj[b] lists the courses that b unlocks; indegree[a] counts a's remaining prerequisites.
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indegree[a]++;
  }

  // Start with every course that has no outstanding prerequisite.
  const queue = [];
  for (let c = 0; c < numCourses; c++) {
    if (indegree[c] === 0) queue.push(c);
  }

  let taken = 0;
  while (queue.length > 0) {
    const course = queue.shift();
    taken++;                         // this course is now ready and "taken"
    for (const next of adj[course]) {
      // One prerequisite of next is satisfied; if that was its last, it's ready.
      if (--indegree[next] === 0) queue.push(next);
    }
  }

  // Every course taken means no cycle blocked us.
  return taken === numCourses;
}`,
        typescript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  // adj[b] lists the courses that b unlocks; indegree[a] counts a's remaining prerequisites.
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const indegree = new Array<number>(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indegree[a]++;
  }

  // Start with every course that has no outstanding prerequisite.
  const queue: number[] = [];
  for (let c = 0; c < numCourses; c++) {
    if (indegree[c] === 0) queue.push(c);
  }

  let taken = 0;
  while (queue.length > 0) {
    const course = queue.shift()!;
    taken++;                         // this course is now ready and "taken"
    for (const next of adj[course]) {
      // One prerequisite of next is satisfied; if that was its last, it's ready.
      if (--indegree[next] === 0) queue.push(next);
    }
  }

  // Every course taken means no cycle blocked us.
  return taken === numCourses;
}`,
      },
    },
  ],
});
