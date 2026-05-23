import { defineAlgoProblem } from "../problem";

export const multiply = defineAlgoProblem<[string, string], string>({
  id: "multiply-strings",
  number: 52,
  title: "Multiply Strings",
  difficulty: "medium",
  tags: ["math", "string", "simulation"],
  functionName: "multiply",
  prompt: `Given two non-negative integers \`num1\` and \`num2\` represented as strings, return their product, also as a string.

The numbers can be far longer than a JavaScript \`number\` can represent exactly, so you must do the multiplication digit by digit (grade-school long multiplication) rather than parsing to a numeric type. Using built-in big-integer types is considered cheating for this exercise.

Neither input has leading zeros (except the number \`"0"\` itself), and the result must not have leading zeros either.`,
  constraints: [
    "1 <= num1.length, num2.length <= 200",
    "num1 and num2 consist of digits only.",
    "Neither has a leading zero, except the value \"0\".",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
function multiply(num1, num2) {
  // your code here
}`,
    typescript: `/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
function multiply(num1: string, num2: string): string {
  // your code here
}`,
  },
  examples: [
    { name: "small", args: ["2", "3"], expected: "6" },
    { name: "multi-digit", args: ["123", "456"], expected: "56088", explanation: "123 × 456 = 56088." },
    { name: "zero factor", args: ["0", "52"], expected: "0", explanation: "Any product with 0 is \"0\" — no leading zeros." },
  ],
  hiddenTests: [
    { args: ["52", "0"], expected: "0" },
    { args: ["0", "0"], expected: "0" },
    { args: ["9", "9"], expected: "81" },
    { args: ["7", "8"], expected: "56" },
    { args: ["11", "11"], expected: "121" },
    { args: ["99", "99"], expected: "9801" },
    { args: ["100", "100"], expected: "10000" },
    { args: ["1", "999999999"], expected: "999999999" },
    { args: ["999", "999"], expected: "998001" },
    { args: ["123456789", "987654321"], expected: "121932631112635269" },
    { args: ["1000000", "1000000"], expected: "1000000000000" },
    { args: ["12345678901234567890", "98765432109876543210"], expected: "1219326311370217952237463801111263526900" },
    { args: ["999999999999999999999999999999", "999999999999999999999999999999"], expected: "999999999999999999999999999998000000000000000000000000000001" },
    { args: ["9".repeat(200), "9".repeat(200)], expected: "9".repeat(199) + "8" + "0".repeat(199) + "1" },
  ],
  source: { origin: "leetcode", frontendId: "43", acRate: 0.44162257921770764, confidence: 0.95 },
  solutions: [
    {
      name: "Grade-school long multiplication",
      explanation: `Multiplying an \`m\`-digit number by an \`n\`-digit number gives at most \`m + n\` digits. Allocate a result buffer of that size. For each pair of digit positions \`(i, j)\`, the product \`num1[i] * num2[j]\` contributes to result positions \`i + j\` (carry) and \`i + j + 1\` (units); accumulate into the buffer and let carries ripple. Finally drop leading zeros.

\`O(m · n)\` time, \`O(m + n)\` space — and crucially every intermediate value is a single-digit product plus carry, so it stays within exact integer range.`,
      code: {
        javascript: `function multiply(num1, num2) {
  if (num1 === "0" || num2 === "0") return "0";
  const m = num1.length;
  const n = num2.length;
  const res = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
      const low = i + j + 1;
      const high = i + j;
      const sum = mul + res[low];
      res[low] = sum % 10;
      res[high] += Math.floor(sum / 10);
    }
  }
  let out = "";
  for (const digit of res) {
    if (!(out === "" && digit === 0)) out += digit;
  }
  return out === "" ? "0" : out;
}`,
        typescript: `function multiply(num1: string, num2: string): string {
  if (num1 === "0" || num2 === "0") return "0";
  const m = num1.length;
  const n = num2.length;
  const res = new Array<number>(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
      const low = i + j + 1;
      const high = i + j;
      const sum = mul + res[low];
      res[low] = sum % 10;
      res[high] += Math.floor(sum / 10);
    }
  }
  let out = "";
  for (const digit of res) {
    if (!(out === "" && digit === 0)) out += digit;
  }
  return out === "" ? "0" : out;
}`,
      },
    },
  ],
});
