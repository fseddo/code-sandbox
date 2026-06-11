import { defineAlgoProblem } from "../problem";

export const minCostConnectPoints = defineAlgoProblem<[number[][]], number>({
  id: "min-cost-to-connect-all-points",
  number: 152,
  title: "Min Cost to Connect All Points",
  difficulty: "medium",
  tags: ["array", "union-find", "graph"],
  functionName: "minCostConnectPoints",
  prompt: `You are given \`points\`, an array of distinct points on a 2-D plane where \`points[i] = [xi, yi]\`.

The cost of connecting two points is the **Manhattan distance** between them: \`|xi - xj| + |yi - yj|\`.

Return the **minimum total cost** to connect *all* the points so that there is exactly one path between any two of them. (In graph terms: the weight of a minimum spanning tree over the points.)`,
  constraints: [
    "1 <= points.length <= 1000",
    "-10^6 <= xi, yi <= 10^6",
    "All pairs (xi, yi) are distinct.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} points
 * @return {number}
 */
function minCostConnectPoints(points) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} points
 * @return {number}
 */
function minCostConnectPoints(points: number[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "five points",
      args: [[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]],
      expected: 20,
      explanation: "Connecting (0,0)-(2,2)=4, (2,2)-(5,2)=3, (5,2)-(7,0)=4, (5,2)-(3,10)=... the minimum spanning tree totals 20.",
    },
    {
      name: "three points in a line",
      args: [[[3, 12], [-2, 5], [-4, 1]]],
      expected: 18,
      explanation: "(-4,1)-(-2,5)=6 and (-2,5)-(3,12)=12 spans all three for 18.",
    },
    { name: "single point", args: [[[0, 0]]], expected: 0 },
  ],
  hiddenTests: [
    // A single point needs no edges.
    { args: [[[5, 5]]], expected: 0 },
    // Two points — the one edge between them.
    { args: [[[0, 0], [1, 1]]], expected: 2 },
    // Two points sharing a row.
    { args: [[[0, 0], [0, 10]]], expected: 10 },
    // A unit square — the MST uses three of the four sides.
    { args: [[[0, 0], [0, 1], [1, 0], [1, 1]]], expected: 3 },
    // Collinear points — the MST is the chain of adjacent gaps.
    { args: [[[0, 0], [1, 0], [3, 0], [6, 0]]], expected: 6 },
    // Points where a direct long edge is beaten by two short ones.
    { args: [[[0, 0], [10, 0], [5, 1]]], expected: 12 },
    // Negative coordinates.
    { args: [[[-1, -1], [-3, -3], [-5, -5]]], expected: 8 },
    // A plus-shaped cluster around the origin.
    { args: [[[0, 0], [0, 2], [0, -2], [2, 0], [-2, 0]]], expected: 8 },
    // Points with large coordinate spread.
    { args: [[[-1000000, -1000000], [1000000, 1000000]]], expected: 4000000 },
    // Scale: 1000 points on a diagonal line — the MST chains the 999 unit gaps.
    {
      args: [Array.from({ length: 1000 }, (_unused, i) => [i, i])],
      // Each adjacent pair is Manhattan distance 2; 999 edges.
      expected: 999 * 2,
    },
  ],
  source: { origin: "leetcode", frontendId: "1584", acRate: 0.6712, confidence: 0.91 },
  solutions: [
    {
      name: "Prim's algorithm",
      explanation: `Every pair of points is connectable, so the graph is complete and the answer is the weight of its minimum spanning tree. Prim's algorithm grows the tree one point at a time, always adding the cheapest edge that reaches a point not yet in the tree.

Keep \`minDist[i]\` = the cheapest known edge connecting point \`i\` to the growing tree (\`0\` for the seed point, \`Infinity\` otherwise) and a \`inTree\` flag per point. Repeat \`n\` times: pick the not-yet-added point with the smallest \`minDist\`, add its cost to the total, mark it in the tree, then relax every other outside point's \`minDist\` against the Manhattan distance to the just-added point.

This dense \`O(n²)\` formulation (scan all points to find the minimum, then relax all points) avoids building the \`O(n²)\` edge list explicitly and is the right shape for a complete graph. Space is \`O(n)\`.`,
      code: {
        javascript: `function minCostConnectPoints(points) {
  const n = points.length;
  if (n <= 1) return 0;                       // nothing to connect

  const inTree = new Array(n).fill(false);
  // minDist[i] = cheapest edge from point i to the tree built so far.
  const minDist = new Array(n).fill(Infinity);
  minDist[0] = 0;                             // seed the tree at point 0

  let total = 0;
  for (let step = 0; step < n; step++) {
    // Pick the cheapest point not yet in the tree.
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!inTree[i] && (u === -1 || minDist[i] < minDist[u])) u = i;
    }
    inTree[u] = true;
    total += minDist[u];                      // pay for the edge that pulled u in

    // Relax every outside point against its distance to the newly added u.
    for (let v = 0; v < n; v++) {
      if (inTree[v]) continue;
      const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      if (d < minDist[v]) minDist[v] = d;
    }
  }
  return total;
}`,
        typescript: `function minCostConnectPoints(points: number[][]): number {
  const n = points.length;
  if (n <= 1) return 0;                       // nothing to connect

  const inTree = new Array<boolean>(n).fill(false);
  // minDist[i] = cheapest edge from point i to the tree built so far.
  const minDist = new Array<number>(n).fill(Infinity);
  minDist[0] = 0;                             // seed the tree at point 0

  let total = 0;
  for (let step = 0; step < n; step++) {
    // Pick the cheapest point not yet in the tree.
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!inTree[i] && (u === -1 || minDist[i] < minDist[u])) u = i;
    }
    inTree[u] = true;
    total += minDist[u];                      // pay for the edge that pulled u in

    // Relax every outside point against its distance to the newly added u.
    for (let v = 0; v < n; v++) {
      if (inTree[v]) continue;
      const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      if (d < minDist[v]) minDist[v] = d;
    }
  }
  return total;
}`,
      },
    },
  ],
});
