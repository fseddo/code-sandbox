import { defineAlgoProblem } from "../problem";

export const maxPointsOnALine = defineAlgoProblem<[number[][]], number>({
  id: "max-points-on-a-line",
  number: 166,
  title: "Max Points on a Line",
  difficulty: "hard",
  tags: ["math", "hash-table", "array"],
  functionName: "maxPointsOnALine",
  prompt: `Given an array \`points\` where \`points[i] = [x, y]\` is a point on the plane, return the maximum number of points that lie on the same straight line.

No two points in the input are the same. A single point, or a pair of points, always counts as lying on a line.`,
  constraints: [
    "1 <= points.length <= 300",
    "points[i].length == 2",
    "-10^4 <= points[i][0], points[i][1] <= 10^4",
    "All points in the input are unique.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[][]} points
 * @return {number}
 */
function maxPointsOnALine(points) {
  // your code here
}`,
    typescript: `/**
 * @param {number[][]} points
 * @return {number}
 */
function maxPointsOnALine(points: number[][]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "diagonal",
      args: [[[1, 1], [2, 2], [3, 3]]],
      expected: 3,
      explanation: "All three points sit on the line y = x.",
    },
    {
      name: "line plus stragglers",
      args: [[[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]]],
      expected: 4,
      explanation: "(3,2), (4,1), (2,3), and (1,4) all satisfy x + y = 5; the other two points aren't on that line.",
    },
    {
      name: "single point",
      args: [[[0, 0]]],
      expected: 1,
      explanation: "One point trivially counts as lying on a line.",
    },
    {
      name: "two points",
      args: [[[0, 0], [5, 5]]],
      expected: 2,
      explanation: "Any two distinct points always lie on some line together.",
    },
  ],
  hiddenTests: [
    { name: "single point", args: [[[0, 0]]], expected: 1 },
    { name: "two points", args: [[[0, 0], [7, 3]]], expected: 2 },
    { name: "triangle, no three collinear", args: [[[0, 0], [1, 2], [2, 1]]], expected: 2 },
    { name: "vertical line plus off-line point", args: [[[3, -5], [3, 0], [3, 2], [3, 10], [5, 1]]], expected: 4 },
    { name: "horizontal line plus off-line point", args: [[[-2, 4], [0, 4], [3, 4], [9, 4], [1, 0]]], expected: 4 },
    { name: "negative diagonal plus off-line point", args: [[[-3, -3], [-2, -2], [-1, -1], [0, 0], [1, 2]]], expected: 4 },
    {
      name: "sign-normalized slope match",
      args: [[[0, 0], [2, -4], [-1, 2], [4, -8], [1, 1]]],
      expected: 4,
    },
    {
      name: "reduced fraction equivalence (1/3 == 2/6 == 3/9)",
      args: [[[0, 0], [3, 1], [6, 2], [9, 3], [1, 1]]],
      expected: 4,
    },
    {
      name: "two separate lines, neither dominates",
      args: [[[0, 0], [1, 1], [2, 2], [0, 5], [4, 5], [9, 5], [100, -100]]],
      expected: 3,
    },
    {
      name: "big line appears late in the array",
      args: [[[0, 0], [1, 5], [-3, 2], [10, 10], [20, 20], [30, 30], [40, 40]]],
      expected: 5,
    },
    {
      name: "two lines crossing at a shared point",
      args: [[[-2, -2], [0, 0], [2, 2], [-2, 2], [2, -2]]],
      expected: 3,
    },
    {
      name: "numerically close but distinct slope decoy",
      args: [[[0, 0], [3, 1], [6, 2], [9, 3], [100, 33]]],
      expected: 4,
    },
    {
      name: "wide coordinate range, horizontal cluster",
      args: [[[-10000, 5000], [-5000, 5000], [0, 5000], [5000, 5000], [10000, 5000], [3, -9000]]],
      expected: 5,
    },
    {
      name: "vertical line with several decoys",
      args: [[[6, -3], [6, 0], [6, 4], [6, 9], [1, 1], [-2, 7], [10, -10]]],
      expected: 4,
    },
    {
      name: "scale: fifty points, all collinear",
      args: [Array.from({ length: 50 }, (_, i) => [i, 2 * i + 1])],
      expected: 50,
    },
    {
      name: "scale: 300 points on a parabola, no three collinear",
      args: [Array.from({ length: 300 }, (_, i) => [i - 150, (i - 150) * (i - 150)])],
      expected: 2,
    },
    {
      name: "scale: 300 points on one vertical line",
      args: [Array.from({ length: 300 }, (_, i) => [7, i - 100])],
      expected: 300,
    },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "Slope hashing from each focal point",
      explanation: `Fix each point in turn as a "focal point" and compute the slope from it to every other point. Points sharing a slope from the same focal point are collinear with it, so counting slopes in a hash map and taking the max (+1 for the focal point itself) finds the best line through that focal point. The overall answer is the best count across all focal points.

The slope can't be a floating-point \`dy/dx\` — nearby-but-distinct fractions can collide or fail to collide due to precision. Instead, reduce \`(dy, dx)\` by their \`gcd\` to a canonical integer pair, fixing a sign convention (keep \`dx\` non-negative, or \`dx === 0\` with \`dy\` forced positive for vertical lines) so \`(2, -4)\` and \`(-1, 2)\` normalize to the same key.

\`O(n²)\` time (a slope pass from each of \`n\` focal points), \`O(n)\` space for the slope map.`,
      code: {
        javascript: `function maxPointsOnALine(points) {
  const n = points.length;
  // Any 0, 1, or 2 points trivially lie on some line together.
  if (n <= 2) return n;

  // Euclidean gcd, used to reduce a (dy, dx) slope to its canonical integer form.
  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) [a, b] = [b, a % b];
    return a;
  };

  let best = 1;
  // Treat every point in turn as the "focal point" the candidate lines pass through.
  for (let i = 0; i < n; i++) {
    // Fresh bucket per focal point: counts of "how many other points share this slope".
    const slopeCounts = new Map();
    let localBest = 0;
    const [x1, y1] = points[i];
    for (let j = 0; j < n; j++) {
      if (j === i) continue; // never compare the focal point to itself
      let dy = points[j][1] - y1;
      let dx = points[j][0] - x1;
      if (dx === 0) {
        dy = 1; // vertical line sentinel: (1, 0) — avoids dividing by zero
      } else {
        // Reduce to lowest terms so equal ratios always produce the same key,
        // instead of a float dy/dx that can round differently for equal slopes.
        const g = gcd(dy, dx);
        dy /= g;
        dx /= g;
        // Fix the sign so equivalent fractions always share a key.
        if (dx < 0) {
          dy = -dy;
          dx = -dx;
        }
      }
      const key = dy + "/" + dx;
      const count = (slopeCounts.get(key) || 0) + 1;
      slopeCounts.set(key, count);
      if (count > localBest) localBest = count; // track this focal point's best bucket
    }
    // +1 to include the focal point itself.
    if (localBest + 1 > best) best = localBest + 1;
  }
  return best;
}`,
        typescript: `function maxPointsOnALine(points: number[][]): number {
  const n = points.length;
  // Any 0, 1, or 2 points trivially lie on some line together.
  if (n <= 2) return n;

  // Euclidean gcd, used to reduce a (dy, dx) slope to its canonical integer form.
  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) [a, b] = [b, a % b];
    return a;
  };

  let best = 1;
  // Treat every point in turn as the "focal point" the candidate lines pass through.
  for (let i = 0; i < n; i++) {
    // Fresh bucket per focal point: counts of "how many other points share this slope".
    const slopeCounts = new Map<string, number>();
    let localBest = 0;
    const [x1, y1] = points[i];
    for (let j = 0; j < n; j++) {
      if (j === i) continue; // never compare the focal point to itself
      let dy = points[j][1] - y1;
      let dx = points[j][0] - x1;
      if (dx === 0) {
        dy = 1; // vertical line sentinel: (1, 0) — avoids dividing by zero
      } else {
        // Reduce to lowest terms so equal ratios always produce the same key,
        // instead of a float dy/dx that can round differently for equal slopes.
        const g = gcd(dy, dx);
        dy /= g;
        dx /= g;
        // Fix the sign so equivalent fractions always share a key.
        if (dx < 0) {
          dy = -dy;
          dx = -dx;
        }
      }
      const key = \`\${dy}/\${dx}\`;
      const count = (slopeCounts.get(key) || 0) + 1;
      slopeCounts.set(key, count);
      if (count > localBest) localBest = count; // track this focal point's best bucket
    }
    // +1 to include the focal point itself.
    if (localBest + 1 > best) best = localBest + 1;
  }
  return best;
}`,
      },
    },
    {
      name: "Pairwise cross product",
      explanation: `For every pair of points, treat them as defining a candidate line and count how many of the other points are collinear with that pair using the integer cross product \`(x2-x1)(y3-y1) - (y2-y1)(x3-x1) === 0\` (zero cross product means zero area, i.e. collinear) — no slopes or division at all. Track the best count seen across all \`O(n²)\` pairs.

\`O(n³)\` time (a full pass over points for every pair), \`O(1)\` extra space. Simpler to trust since it never computes a slope, but too slow for the largest inputs — included as a correctness cross-check, not the primary approach.`,
      code: {
        javascript: `function maxPointsOnALine(points) {
  const n = points.length;
  // Any 0, 1, or 2 points trivially lie on some line together.
  if (n <= 2) return n;

  let best = 2;
  // Try every pair of points as the two points that define a candidate line.
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[j];
      let count = 2; // the pair itself already lies on its own line
      // Check every other point for collinearity with this pair.
      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue;
        const [x3, y3] = points[k];
        // Cross product of (P2-P1) and (P3-P1): zero area means the three points are collinear.
        const cross = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
        if (cross === 0) count++;
      }
      if (count > best) best = count; // remember the largest line seen so far
    }
  }
  return best;
}`,
        typescript: `function maxPointsOnALine(points: number[][]): number {
  const n = points.length;
  // Any 0, 1, or 2 points trivially lie on some line together.
  if (n <= 2) return n;

  let best = 2;
  // Try every pair of points as the two points that define a candidate line.
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[j];
      let count = 2; // the pair itself already lies on its own line
      // Check every other point for collinearity with this pair.
      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue;
        const [x3, y3] = points[k];
        // Cross product of (P2-P1) and (P3-P1): zero area means the three points are collinear.
        const cross = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
        if (cross === 0) count++;
      }
      if (count > best) best = count; // remember the largest line seen so far
    }
  }
  return best;
}`,
      },
    },
  ],
});
