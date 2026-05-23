import { defineAlgoProblem } from "../problem";

export const getPermutation = defineAlgoProblem<[number, number], string>({
  id: "permutation-sequence",
  number: 67,
  title: "Permutation Sequence",
  difficulty: "hard",
  tags: ["math", "recursion"],
  functionName: "getPermutation",
  prompt: `The set \`[1, 2, 3, ..., n]\` has \`n!\` distinct permutations. Listing them in strictly increasing (lexicographic) order and labelling them \`1\` through \`n!\`, return the \`k\`-th permutation as a string.

For example, with \`n = 3\` the ordered list is \`"123"\`, \`"132"\`, \`"213"\`, \`"231"\`, \`"312"\`, \`"321"\`, so \`k = 3\` gives \`"213"\`.

The result has no separators — each digit \`1..n\` appears exactly once.`,
  constraints: ["1 <= n <= 9", "1 <= k <= n!"],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @param {number} k
 * @return {string}
 */
function getPermutation(n, k) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @param {number} k
 * @return {string}
 */
function getPermutation(n: number, k: number): string {
  // your code here
}`,
  },
  examples: [
    { name: "n=3, k=3", args: [3, 3], expected: "213", explanation: `The 3rd permutation of [1,2,3] in order is "213".` },
    { name: "n=4, k=9", args: [4, 9], expected: "2314" },
    { name: "n=3, k=1", args: [3, 1], expected: "123", explanation: "The first permutation is always ascending." },
  ],
  hiddenTests: [
    { args: [1, 1], expected: "1" },
    { args: [2, 1], expected: "12" },
    { args: [2, 2], expected: "21" },
    { args: [3, 6], expected: "321" },
    { args: [3, 4], expected: "231" },
    { args: [4, 1], expected: "1234" },
    { args: [4, 24], expected: "4321" },
    { args: [4, 17], expected: "3412" },
    { args: [5, 60], expected: "32541" },
    { args: [5, 1], expected: "12345" },
    { args: [5, 120], expected: "54321" },
    { args: [6, 360], expected: "365421" },
    { args: [7, 5040], expected: "7654321" },
    { args: [8, 20160], expected: "48765321" },
    { args: [9, 362880], expected: "987654321" },
    { args: [9, 1], expected: "123456789" },
  ],
  source: { origin: "leetcode", frontendId: "60", acRate: 0.5308893371463589, confidence: 0.97 },
  solutions: [
    {
      name: "Factorial number system",
      explanation: `Fix the first digit, then the second, and so on. With \`n\` unused digits, each choice of the leading digit accounts for \`(n-1)!\` permutations. So the leading digit's index into the sorted pool of remaining digits is \`(k-1) / (n-1)!\`, and the remainder \`(k-1) % (n-1)!\` selects within that block. Remove the chosen digit and repeat for the next position.

Working with \`k-1\` (0-indexed) keeps the integer division clean.

\`O(n²)\` time (the splice per digit), \`O(n)\` space.`,
      code: {
        javascript: `function getPermutation(n, k) {
  const fact = [1];
  for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
  const pool = [];
  for (let i = 1; i <= n; i++) pool.push(i);
  let rem = k - 1;
  let result = "";
  for (let i = n; i >= 1; i--) {
    const idx = Math.floor(rem / fact[i - 1]);
    rem %= fact[i - 1];
    result += pool[idx];
    pool.splice(idx, 1);
  }
  return result;
}`,
        typescript: `function getPermutation(n: number, k: number): string {
  const fact: number[] = [1];
  for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
  const pool: number[] = [];
  for (let i = 1; i <= n; i++) pool.push(i);
  let rem = k - 1;
  let result = "";
  for (let i = n; i >= 1; i--) {
    const idx = Math.floor(rem / fact[i - 1]);
    rem %= fact[i - 1];
    result += pool[idx];
    pool.splice(idx, 1);
  }
  return result;
}`,
      },
    },
  ],
});
