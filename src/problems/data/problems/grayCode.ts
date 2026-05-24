import { defineAlgoProblem } from "../problem";

// Many valid Gray-code sequences exist, so the checker validates the defining properties rather than
// matching one fixed answer. `expected` carries a known-good sequence (used for length sanity only).
export const grayCode = defineAlgoProblem<[number], number[]>({
  id: "gray-code",
  number: 95,
  title: "Gray Code",
  difficulty: "medium",
  tags: ["math", "backtracking", "bit-manipulation"],
  functionName: "grayCode",
  prompt: `An \`n\`-bit Gray code sequence is an ordering of all \`2^n\` integers in \`[0, 2^n - 1]\` such that:

- it begins with \`0\`,
- every integer appears exactly once,
- adjacent integers differ in exactly one bit, and
- the first and last integers also differ in exactly one bit (it's cyclic).

Given \`n\`, return any valid \`n\`-bit Gray code sequence. **Any** sequence satisfying all four properties is accepted, not one specific ordering.`,
  constraints: ["1 <= n <= 16"],
  checker: `(actual, args, expected) => {
    const n = args[0];
    if (!Array.isArray(actual)) return false;
    if (actual.length !== expected.length) return false;
    if (actual[0] !== 0) return false;
    const seen = new Set();
    for (const v of actual) {
      if (!Number.isInteger(v) || v < 0 || v >= (1 << n)) return false;
      if (seen.has(v)) return false;
      seen.add(v);
    }
    const oneBit = (a, b) => {
      const x = a ^ b;
      return x !== 0 && (x & (x - 1)) === 0;
    };
    for (let i = 1; i < actual.length; i++) {
      if (!oneBit(actual[i - 1], actual[i])) return false;
    }
    return oneBit(actual[actual.length - 1], actual[0]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {number[]}
 */
function grayCode(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {number[]}
 */
function grayCode(n: number): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "two bits", args: [2], expected: [0, 1, 3, 2], explanation: "0,1,3,2 — each step flips one bit, and 2 -> 0 flips one bit too." },
    { name: "one bit", args: [1], expected: [0, 1] },
    { name: "three bits", args: [3], expected: [0, 1, 3, 2, 6, 7, 5, 4] },
  ],
  hiddenTests: [
    { args: [1], expected: [0, 1] },
    { args: [2], expected: [0, 1, 3, 2] },
    { args: [3], expected: [0, 1, 3, 2, 6, 7, 5, 4] },
    { args: [4], expected: Array.from({ length: 16 }, (_, i) => i ^ (i >> 1)) },
    { args: [5], expected: Array.from({ length: 32 }, (_, i) => i ^ (i >> 1)) },
    { args: [6], expected: Array.from({ length: 64 }, (_, i) => i ^ (i >> 1)) },
    { args: [7], expected: Array.from({ length: 128 }, (_, i) => i ^ (i >> 1)) },
    { args: [8], expected: Array.from({ length: 256 }, (_, i) => i ^ (i >> 1)) },
    { args: [10], expected: Array.from({ length: 1024 }, (_, i) => i ^ (i >> 1)) },
    { args: [12], expected: Array.from({ length: 4096 }, (_, i) => i ^ (i >> 1)) },
    { args: [14], expected: Array.from({ length: 16384 }, (_, i) => i ^ (i >> 1)) },
    // Scale: largest case, 2^16 = 65536 entries.
    { args: [16], expected: Array.from({ length: 65536 }, (_, i) => i ^ (i >> 1)) },
  ],
  source: { origin: "leetcode", frontendId: "89", acRate: 0.6491171165709262, confidence: 0.92 },
  solutions: [
    {
      name: "Binary-reflected Gray code formula",
      explanation: `The standard binary-reflected Gray code maps index \`i\` to \`i ^ (i >> 1)\`. Iterating \`i\` from \`0\` to \`2^n - 1\` and emitting that value produces a sequence that starts at 0, hits every value once, and changes exactly one bit between consecutive entries (and cyclically between the last and first).

\`O(2^n)\` time and space — unavoidable, since the output itself has \`2^n\` entries.`,
      code: {
        javascript: `function grayCode(n) {
  const total = 1 << n;
  const result = new Array(total);
  for (let i = 0; i < total; i++) {
    result[i] = i ^ (i >> 1);
  }
  return result;
}`,
        typescript: `function grayCode(n: number): number[] {
  const total = 1 << n;
  const result = new Array<number>(total);
  for (let i = 0; i < total; i++) {
    result[i] = i ^ (i >> 1);
  }
  return result;
}`,
      },
    },
  ],
});
