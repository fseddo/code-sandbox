import { defineProblem } from "../problem";

export const palindromeNumber = defineProblem<[number], boolean>({
  id: "palindrome-number",
  title: "Palindrome Number",
  difficulty: "easy",
  tags: ["math"],
  functionName: "isPalindrome",
  prompt: `Given an integer \`x\`, return \`true\` if \`x\` reads the same backwards as forwards, and \`false\` otherwise.

A negative number is never a palindrome: the leading minus sign has no trailing counterpart (e.g. \`-121\` reversed is \`121-\`). A number ending in \`0\` is a palindrome only if the number itself is \`0\`, since the reversed form would have a leading zero.`,
  constraints: ["-2^31 <= x <= 2^31 - 1"],
  starterCode: {
    javascript: `function isPalindrome(x) {
  // your code here
}`,
    typescript: `function isPalindrome(x: number): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "palindrome", args: [121], expected: true, explanation: "121 reads the same forwards and backwards." },
    { name: "negative", args: [-121], expected: false, explanation: "From left to right it reads -121; from right to left it reads 121-, so it is not a palindrome." },
    { name: "trailing zero", args: [10], expected: false, explanation: "Reversed it would read 01, which is not equal to 10." },
    { name: "single digit", args: [0], expected: true },
  ],
  hiddenTests: [
    { args: [0], expected: true },
    { args: [7], expected: true },
    { args: [-1], expected: false },
    { args: [11], expected: true },
    { args: [12], expected: false },
    { args: [-101], expected: false },
    { args: [1000021], expected: false },
    { args: [100], expected: false },
    { args: [1001], expected: true },
    { args: [12321], expected: true },
    { args: [123421], expected: false },
    { args: [2147483647], expected: false },
    { args: [1147447411], expected: true },
    { args: [-2147483648], expected: false },
    { args: [9009], expected: true },
    { args: [9090], expected: false },
  ],
  source: { origin: "leetcode", frontendId: "9", acRate: 0.6056130058717291, confidence: 0.95 },
  solutions: [
    {
      name: "String reversal",
      explanation: `Negatives are rejected up front. Otherwise stringify \`x\`, reverse the characters, and compare. The string captures any trailing-zero asymmetry (\`"10"\` vs \`"01"\`) without special-casing.

\`O(d)\` time and space in the digit count \`d\`.`,
      code: {
        javascript: `function isPalindrome(x) {
  if (x < 0) return false;
  const s = String(x);
  return s === s.split("").reverse().join("");
}`,
        typescript: `function isPalindrome(x: number): boolean {
  if (x < 0) return false;
  const s = String(x);
  return s === s.split("").reverse().join("");
}`,
      },
    },
    {
      name: "Reverse half the digits",
      explanation: `Reject negatives, and any positive ending in \`0\` other than \`0\` itself (it can't mirror — no leading zero on the front). Then peel digits off the back of \`x\` into \`reversed\` until \`reversed >= x\`; at that point half the number is consumed. The value palindromes iff \`x === reversed\` (even digit count) or \`x === Math.floor(reversed / 10)\` (odd count, dropping the middle digit).

\`O(d)\` time, \`O(1)\` space — never builds the full reverse, so it can't overflow.`,
      code: {
        javascript: `function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === reversed || x === Math.floor(reversed / 10);
}`,
        typescript: `function isPalindrome(x: number): boolean {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === reversed || x === Math.floor(reversed / 10);
}`,
      },
    },
  ],
});
