import { defineAlgoProblem } from "../problem";

export const networkDelayTime = defineAlgoProblem<[number[][], number, number], number>({
  id: "network-delay-time",
  number: 151,
  title: "Network Delay Time",
  difficulty: "medium",
  tags: ["depth-first-search", "breadth-first-search", "graph", "heap-priority-queue"],
  functionName: "networkDelayTime",
  prompt: `You have a network of \`n\` nodes labelled \`1\` to \`n\`. You are given \`times\`, a list of directed travel times \`times[i] = [u, v, w]\` meaning a signal takes \`w\` time to travel from node \`u\` to node \`v\`.

A signal is sent from node \`k\`. Return the **minimum time** for *all* \`n\` nodes to receive the signal. If it is impossible for every node to receive it, return \`-1\`.

The time for all nodes to receive the signal is the *latest* of the shortest arrival times — the signal reaches each node along its fastest route, and you wait for the slowest of those.`,
  constraints: [
    "1 <= k <= n <= 100",
    "1 <= times.length <= 6000",
    "times[i].length == 3",
    "1 <= u, v <= n",
    "u != v",
    "0 <= w <= 100",
    "All pairs (u, v) are unique (no duplicate edges).",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
function networkDelayTime(times, n, k) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
function networkDelayTime(times: number[][], n: number, k: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "signal reaches all four",
      args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2],
      expected: 2,
      explanation: "From node 2: node 1 arrives at t=1, node 3 at t=1, node 4 at t=2. The slowest is 2.",
    },
    {
      name: "single node",
      args: [[], 1, 1],
      expected: 0,
      explanation: "The source is the only node and already has the signal — zero time.",
    },
    {
      name: "node unreachable",
      args: [[[1, 2, 1]], 2, 2],
      expected: -1,
      explanation: "Starting at node 2, there is no edge out of 2, so node 1 never receives the signal.",
    },
  ],
  hiddenTests: [
    // Two nodes, a single edge from the source.
    { args: [[[1, 2, 5]], 2, 1], expected: 5 },
    // Two nodes, edge points the wrong way — node 2 can't reach node 1.
    { args: [[[1, 2, 5]], 2, 2], expected: -1 },
    // A faster two-hop route beats a slow direct edge.
    { args: [[[1, 2, 10], [1, 3, 1], [3, 2, 1]], 3, 1], expected: 2 },
    // Zero-weight edges — instantaneous propagation.
    { args: [[[1, 2, 0], [2, 3, 0]], 3, 1], expected: 0 },
    // A disconnected node never receives the signal.
    { args: [[[1, 2, 3]], 3, 1], expected: -1 },
    // A cycle in the graph — shortest paths still well-defined.
    { args: [[[1, 2, 1], [2, 3, 1], [3, 1, 1]], 3, 1], expected: 2 },
    // Parallel routes of different cost to the same node.
    { args: [[[1, 2, 4], [1, 3, 1], [3, 2, 1], [2, 4, 1]], 4, 1], expected: 3 },
    // Source has no outgoing edges but is the only node — zero.
    { args: [[], 1, 1], expected: 0 },
    // A star: source reaches every leaf directly; the max edge sets the time.
    { args: [[[1, 2, 2], [1, 3, 5], [1, 4, 3]], 4, 1], expected: 5 },
    // A long chain — the time is the total path length.
    { args: [[[1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1]], 5, 1], expected: 4 },
    // A chain where one node hangs off unreachable.
    { args: [[[1, 2, 1], [2, 3, 1]], 4, 1], expected: -1 },
  ],
  source: { origin: "leetcode", frontendId: "743", acRate: 0.5612, confidence: 0.9 },
  solutions: [
    {
      name: "Dijkstra's shortest paths",
      explanation: `The signal reaches each node along its **shortest** weighted path from \`k\`, so the answer is the largest shortest-path distance over all nodes (or \`-1\` if any node is unreachable). With non-negative weights, Dijkstra computes those distances.

Keep a \`dist\` array (all \`Infinity\` except \`dist[k] = 0\`) and a min-priority queue keyed by tentative distance, seeded with \`(0, k)\`. Pop the closest unsettled node, and for each outgoing edge \`u -> v\` of weight \`w\`, relax \`dist[v]\` to \`dist[u] + w\` when that's an improvement, pushing the new \`(dist[v], v)\`. A node is settled the first time it is popped (its distance can't improve after that).

When the queue drains, the answer is \`max(dist[1..n])\` — unless some node is still \`Infinity\`, in which case return \`-1\`.

\`O(E log V)\` time with a binary heap and \`O(V + E)\` space. (This implementation uses a sort-based "pop the current minimum" queue, which keeps the code compact at the cost of an extra log factor — still ample for the constraints.)`,
      code: {
        javascript: `function networkDelayTime(times, n, k) {
  // adj[u] = list of [v, w] edges out of u (nodes are 1-indexed).
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);

  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  // Frontier of (distance, node); we always expand the smallest distance next.
  const frontier = [[0, k]];

  while (frontier.length > 0) {
    // Pull out the node with the current minimum tentative distance.
    frontier.sort((a, b) => a[0] - b[0]);
    const [d, u] = frontier.shift();
    if (d > dist[u]) continue;             // a stale, already-improved entry
    for (const [v, w] of adj[u]) {
      // Relax the edge: a shorter route to v through u?
      if (d + w < dist[v]) {
        dist[v] = d + w;
        frontier.push([dist[v], v]);
      }
    }
  }

  // The time for all nodes is the slowest shortest arrival; Infinity means unreachable.
  let slowest = 0;
  for (let node = 1; node <= n; node++) {
    if (dist[node] === Infinity) return -1;
    slowest = Math.max(slowest, dist[node]);
  }
  return slowest;
}`,
        typescript: `function networkDelayTime(times: number[][], n: number, k: number): number {
  // adj[u] = list of [v, w] edges out of u (nodes are 1-indexed).
  const adj: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);

  const dist = new Array<number>(n + 1).fill(Infinity);
  dist[k] = 0;
  // Frontier of (distance, node); we always expand the smallest distance next.
  const frontier: [number, number][] = [[0, k]];

  while (frontier.length > 0) {
    // Pull out the node with the current minimum tentative distance.
    frontier.sort((a, b) => a[0] - b[0]);
    const [d, u] = frontier.shift()!;
    if (d > dist[u]) continue;             // a stale, already-improved entry
    for (const [v, w] of adj[u]) {
      // Relax the edge: a shorter route to v through u?
      if (d + w < dist[v]) {
        dist[v] = d + w;
        frontier.push([dist[v], v]);
      }
    }
  }

  // The time for all nodes is the slowest shortest arrival; Infinity means unreachable.
  let slowest = 0;
  for (let node = 1; node <= n; node++) {
    if (dist[node] === Infinity) return -1;
    slowest = Math.max(slowest, dist[node]);
  }
  return slowest;
}`,
      },
    },
  ],
});
