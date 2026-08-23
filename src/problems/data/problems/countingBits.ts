import { defineAlgoProblem } from "../problem";

export const countingBits = defineAlgoProblem<[number], number[]>({
  id: "counting-bits",
  number: 163,
  title: "Counting Bits",
  difficulty: "easy",
  tags: ["bit-manipulation", "dynamic-programming"],
  functionName: "countingBits",
  prompt: `Given a non-negative integer \`n\`, return an array \`ans\` of length \`n + 1\` where \`ans[i]\` is the number of \`1\`-bits (the Hamming weight) in the binary representation of \`i\`, for every \`i\` from \`0\` to \`n\`.`,
  constraints: ["0 <= n <= 10^5"],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {number[]}
 */
function countingBits(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {number[]}
 */
function countingBits(n: number): number[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "n = 2",
      args: [2],
      expected: [0, 1, 1],
      explanation: "0 -> 0b0 (0 bits), 1 -> 0b1 (1 bit), 2 -> 0b10 (1 bit).",
    },
    {
      name: "n = 5",
      args: [5],
      expected: [0, 1, 1, 2, 1, 2],
      explanation: "3 -> 0b11 (2 bits), 4 -> 0b100 (1 bit), 5 -> 0b101 (2 bits).",
    },
    { name: "n = 0", args: [0], expected: [0] },
  ],
  hiddenTests: [
    { args: [1], expected: [0, 1] },
    { args: [3], expected: [0, 1, 1, 2] },
    { args: [4], expected: [0, 1, 1, 2, 1] },
    { args: [7], expected: [0, 1, 1, 2, 1, 2, 2, 3] },
    {
      args: [8],
      expected: [0, 1, 1, 2, 1, 2, 2, 3, 1],
      name: "power-of-two boundary",
    },
    {
      args: [15],
      expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4],
      name: "run up to the next power-of-two boundary",
    },
    {
      args: [16],
      expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1],
      name: "power-of-four boundary",
    },
    {
      args: [17],
      expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2],
      name: "one past a power-of-two boundary",
    },
    {
      args: [32],
      expected: [
        0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5,
        1,
      ],
      name: "n = 32",
    },
    {
      args: [200],
      expected: Array.from({ length: 201 }, (_, i) => {
        let count = 0;
        let x = i;
        while (x > 0) {
          count += x & 1;
          x >>= 1;
        }
        return count;
      }),
      name: "larger n, low hundreds",
    },
    {
      args: [100000],
      expected: Array.from({ length: 100001 }, (_, i) => {
        let count = 0;
        let x = i;
        while (x > 0) {
          count += x & 1;
          x >>= 1;
        }
        return count;
      }),
      name: "scale: n at the upper constraint bound",
    },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "DP over dp[x] = dp[x >> 1] + (x & 1)",
      explanation: `Dropping the lowest bit of \`x\` (\`x >> 1\`) halves it, and its bit count has already been computed earlier in the loop as \`dp[x >> 1]\`. That count is exactly the number of set bits above the lowest bit of \`x\`, so we just add back \`x\`'s own lowest bit (\`x & 1\`). Building the array left to right this way visits each index once with only O(1) work per step, instead of counting each number's bits independently.

\`O(n)\` time, \`O(n)\` space for the (required) output array.`,
      code: {
        javascript: `function countingBits(n) {
  const dp = new Array(n + 1);
  dp[0] = 0;
  for (let x = 1; x <= n; x++) {
    // dp[x >> 1] already counted every set bit above the LSB; add x's own LSB back.
    dp[x] = dp[x >> 1] + (x & 1);
  }
  return dp;
}`,
        typescript: `function countingBits(n: number): number[] {
  const dp: number[] = new Array(n + 1);
  dp[0] = 0;
  for (let x = 1; x <= n; x++) {
    // dp[x >> 1] already counted every set bit above the LSB; add x's own LSB back.
    dp[x] = dp[x >> 1] + (x & 1);
  }
  return dp;
}`,
      },
    },
  ],
});
