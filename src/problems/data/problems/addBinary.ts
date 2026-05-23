import { defineAlgoProblem } from "../problem";

export const addBinary = defineAlgoProblem<[string, string], string>({
  id: "add-binary",
  number: 74,
  title: "Add Binary",
  difficulty: "easy",
  tags: ["math", "string", "bit-manipulation", "simulation"],
  functionName: "addBinary",
  prompt: `Given two binary strings \`a\` and \`b\`, return their sum as a binary string.

Both inputs contain only the characters \`0\` and \`1\` and have no leading zeros, except the string \`"0"\` itself. The result must also have no leading zeros.`,
  constraints: [
    "1 <= a.length, b.length <= 10^4",
    "a and b consist only of '0' or '1' characters.",
    "Each string has no leading zeros except for the value 0 itself.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
function addBinary(a, b) {
  // your code here
}`,
    typescript: `/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
function addBinary(a: string, b: string): string {
  // your code here
}`,
  },
  examples: [
    { name: "with carry", args: ["11", "1"], expected: "100", explanation: "3 + 1 = 4 = 100 in binary." },
    { name: "longer", args: ["1010", "1011"], expected: "10101", explanation: "10 + 11 = 21." },
    { name: "zeros", args: ["0", "0"], expected: "0" },
  ],
  hiddenTests: [
    { args: ["1", "1"], expected: "10" },
    { args: ["0", "1"], expected: "1" },
    { args: ["1", "0"], expected: "1" },
    { args: ["1111", "1111"], expected: "11110" },
    { args: ["1", "111"], expected: "1000" },
    { args: ["100", "110010"], expected: "110110" },
    { args: ["101111", "10"], expected: "110001" },
    { args: ["1010", "1010"], expected: "10100" },
    { args: ["11010", "10110"], expected: "110000" },
    { args: ["11", "11"], expected: "110" },
    { args: ["111", "1"], expected: "1000" },
    // Scale: ~5000-bit all-ones plus a single bit forces a full carry sweep.
    { args: ["1".repeat(5000), "1"], expected: "1" + "0".repeat(5000) },
  ],
  source: { origin: "leetcode", frontendId: "67", acRate: 0.5804976203979977, confidence: 0.95 },
  solutions: [
    {
      name: "Two-pointer digit addition",
      explanation: `Walk both strings from the right, adding the two bits (0 when a string is exhausted) plus the carry. The output bit is \`sum & 1\` and the carry is \`sum >> 1\`. Continue while either pointer is in range or a carry remains, then reverse the collected bits.

Working bit-by-bit avoids any overflow that converting to a \`Number\`/\`BigInt\` would risk on the long inputs.

\`O(max(m, n))\` time, \`O(max(m, n))\` space.`,
      code: {
        javascript: `function addBinary(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  const out = [];
  while (i >= 0 || j >= 0 || carry) {
    const sum = (i >= 0 ? a.charCodeAt(i) - 48 : 0) + (j >= 0 ? b.charCodeAt(j) - 48 : 0) + carry;
    out.push(sum & 1);
    carry = sum >> 1;
    i--;
    j--;
  }
  return out.reverse().join("");
}`,
        typescript: `function addBinary(a: string, b: string): string {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  const out: number[] = [];
  while (i >= 0 || j >= 0 || carry) {
    const sum = (i >= 0 ? a.charCodeAt(i) - 48 : 0) + (j >= 0 ? b.charCodeAt(j) - 48 : 0) + carry;
    out.push(sum & 1);
    carry = sum >> 1;
    i--;
    j--;
  }
  return out.reverse().join("");
}`,
      },
    },
  ],
});
