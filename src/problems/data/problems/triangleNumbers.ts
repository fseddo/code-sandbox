import { defineAlgoProblem } from "../problem";

export const triangleNumbers = defineAlgoProblem<[number], number>({
  id: "triangle-numbers",
  number: 168,
  title: "Triangle Numbers",
  difficulty: "medium",
  tags: ["math"],
  functionName: "triangleNumbers",
  prompt: `A number triangle is built like Pascal's triangle, but each entry sums **three** neighbors from the row above instead of two.

Row 1 is a single \`1\`. To get row \`r\` (for \`r > 1\`) from row \`r - 1\`: row \`r\` has two more entries than row \`r - 1\`, sticking out by one extra position on each side. Line up row \`r\`'s middle entry with row \`r - 1\`'s middle entry; then every entry of row \`r\` equals the sum of the entry diagonally above-left, the entry directly above, and the entry diagonally above-right in row \`r - 1\` — treating any of those three positions that fall outside row \`r - 1\` as \`0\`.

So row 1 is \`[1]\`, row 2 is \`[1, 1, 1]\`, row 3 is \`[1, 2, 3, 2, 1]\`, row 4 is \`[1, 3, 6, 7, 6, 3, 1]\`, and so on — row \`r\` always has \`2r - 1\` entries.

Given a row number \`n\` (1-indexed), return the **1-indexed position from the left** of the first even value in row \`n\`. If row \`n\` has no even value at all, return \`-1\`.`,
  constraints: [
    "1 <= n <= 10^9",
    "Row values grow combinatorially, so building the actual row is only feasible for small n.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {number}
 */
function triangleNumbers(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {number}
 */
function triangleNumbers(n: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "row 3",
      args: [3],
      expected: 2,
      explanation: "Row 3 is [1, 2, 3, 2, 1]; the first even value, 2, sits at 1-indexed position 2.",
    },
    {
      name: "row 4",
      args: [4],
      expected: 3,
      explanation: "Row 4 is [1, 3, 6, 7, 6, 3, 1]; the first even value, 6, sits at 1-indexed position 3.",
    },
    {
      name: "row 1 has no even value",
      args: [1],
      expected: -1,
      explanation: "Row 1 is just [1] — no even value exists, so the answer is -1.",
    },
  ],
  hiddenTests: [
    { name: "row 2 also has no even value", args: [2], expected: -1 },
    { name: "row 5", args: [5], expected: 2 },
    { name: "row 6", args: [6], expected: 4 },
    { name: "row 7", args: [7], expected: 2 },
    { name: "row 8", args: [8], expected: 3 },
    { name: "row 9", args: [9], expected: 2 },
    { name: "row 10", args: [10], expected: 4 },
    { name: "smallest odd row above the base cases", args: [3], expected: 2 },
    { name: "mid-size odd row", args: [1235], expected: 2 },
    { name: "mid-size row divisible by 4", args: [1236], expected: 3 },
    { name: "mid-size even row, remainder 2 mod 4", args: [1234], expected: 4 },
    { name: "anti-hardcode: larger odd row unlike any example", args: [7777], expected: 2 },
    { name: "anti-hardcode: larger row divisible by 4", args: [8000], expected: 3 },
    { name: "anti-hardcode: larger row, remainder 2 mod 4", args: [8002], expected: 4 },
    { name: "scale: near upper bound, odd", args: [999999999], expected: 2 },
    { name: "scale: upper bound itself, divisible by 4", args: [1000000000], expected: 3 },
    { name: "scale: near upper bound, remainder 2 mod 4", args: [999999998], expected: 4 },
  ],
  source: { origin: "authored", confidence: 0.85 },
  solutions: [
    {
      name: "Closed-form parity formula",
      explanation: `Building row \`n\` directly is \`O(n²)\` and its values overflow long before \`n\` gets large, so the trick is to reason about **parity only**, without ever computing the actual values.

Rows 1 and 2 are all-odd, so they have no even entry. From row 3 on, tracking the pattern of "position of the first even entry" against \`n\`'s residue mod 4 shows a fixed, repeating rule:
- \`n\` odd → the first even value is always at position 2.
- \`n\` even and divisible by 4 → the first even value is always at position 3.
- \`n\` even and \`n % 4 == 2\` → the first even value is always at position 4.

This pattern is a known property of the parity structure of this "trinomial" triangle (each entry mod 2 follows a self-similar, Pascal's-triangle-like fractal driven by \`n\`'s binary representation), and it holds for every \`n >= 3\`.

\`O(1)\` time and space — a couple of modulo checks regardless of how large \`n\` is.`,
      code: {
        javascript: `function triangleNumbers(n) {
  // Rows 1 and 2 are entirely odd: [1] and [1, 1, 1].
  if (n === 1 || n === 2) return -1;

  // From row 3 on, the position of the first even value depends only on n mod 4.
  if (n % 2 === 1) return 2;
  if (n % 4 === 0) return 3;
  return 4; // n even, n % 4 === 2
}`,
        typescript: `function triangleNumbers(n: number): number {
  // Rows 1 and 2 are entirely odd: [1] and [1, 1, 1].
  if (n === 1 || n === 2) return -1;

  // From row 3 on, the position of the first even value depends only on n mod 4.
  if (n % 2 === 1) return 2;
  if (n % 4 === 0) return 3;
  return 4; // n even, n % 4 === 2
}`,
      },
    },
    {
      name: "Brute force: build the row",
      explanation: `Simulate the triangle row by row using a centered array (index \`0\` is the middle of the row), where each entry sums whichever of the up-to-three parents from the previous row exist. Once row \`n\` is built, scan left to right for the first even value.

\`O(n²)\` time to build every row up to \`n\` (only the current and next row are ever live, so space is \`O(n)\`, not \`O(n²)\`), and the entries themselves grow combinatorially — this only works for small \`n\` and would never finish (or fit in memory) anywhere near the \`10^9\` bound, which is exactly why the closed-form formula above is the one actually used.`,
      code: {
        javascript: `function triangleNumbers(n) {
  // row[i] holds the value at centered offset (i - (row.length - 1) / 2).
  let row = [1];
  for (let r = 2; r <= n; r++) {
    const next = new Array(2 * r - 1).fill(0);
    // Row r is one entry longer on each side than row r - 1, so parent index i
    // (in row r - 1) lines up with child indices i, i + 1, i + 2 in "next".
    for (let i = 0; i < row.length; i++) {
      next[i] += row[i];
      next[i + 1] += row[i];
      next[i + 2] += row[i];
    }
    row = next;
  }
  for (let i = 0; i < row.length; i++) {
    if (row[i] % 2 === 0) return i + 1;
  }
  return -1;
}`,
        typescript: `function triangleNumbers(n: number): number {
  // row[i] holds the value at centered offset (i - (row.length - 1) / 2).
  let row: number[] = [1];
  for (let r = 2; r <= n; r++) {
    const next: number[] = new Array(2 * r - 1).fill(0);
    // Row r is one entry longer on each side than row r - 1, so parent index i
    // (in row r - 1) lines up with child indices i, i + 1, i + 2 in "next".
    for (let i = 0; i < row.length; i++) {
      next[i] += row[i];
      next[i + 1] += row[i];
      next[i + 2] += row[i];
    }
    row = next;
  }
  for (let i = 0; i < row.length; i++) {
    if (row[i] % 2 === 0) return i + 1;
  }
  return -1;
}`,
      },
    },
  ],
});
