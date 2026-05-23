import { defineAlgoProblem } from "../problem";

export const isNumber = defineAlgoProblem<[string], boolean>({
  id: "valid-number",
  number: 72,
  title: "Valid Number",
  difficulty: "hard",
  tags: ["string"],
  functionName: "isNumber",
  prompt: `Given a string \`s\`, decide whether it is a valid number.

A valid number is, in order, an optional **sign** (\`+\`/\`-\`), then a **mantissa**, then an optional **exponent**:

- A **mantissa** is either an integer (one or more digits) or a decimal. A decimal is digits with a single \`.\` — the dot may have digits on both sides (\`3.14\`), only before (\`3.\`), or only after (\`.5\`), but a lone \`.\` is not valid.
- An **exponent** is the letter \`e\` or \`E\` followed by an optional sign and **one or more digits** (the exponent itself is always an integer).

There must be no other characters and no surrounding whitespace. Examples of valid numbers: \`"0"\`, \`"-90E3"\`, \`"3.\"\`, \`".5"\`, \`"+6e-1"\`, \`"53.5e93"\`. Invalid: \`"abc"\`, \`"1a"\`, \`"e3"\`, \`"."\`, \`"99e2.5"\`, \`"--6"\`, \`"1e"\`.`,
  constraints: [
    "1 <= s.length <= 20",
    "s consists of only English letters (upper/lower), digits, '+', '-', and '.'.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isNumber(s) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isNumber(s: string): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "integer", args: ["0"], expected: true },
    { name: "letters", args: ["e"], expected: false, explanation: "An exponent letter with no mantissa or digits is not a number." },
    { name: "decimal with sign", args: ["+6e-1"], expected: true },
    { name: "trailing dot in exponent", args: ["99e2.5"], expected: false, explanation: "The exponent must be an integer." },
  ],
  hiddenTests: [
    { args: ["2"], expected: true },
    { args: ["-90E3"], expected: true },
    { args: ["3."], expected: true },
    { args: [".5"], expected: true },
    { args: ["53.5e93"], expected: true },
    { args: ["-.9"], expected: true },
    { args: ["+.8"], expected: true },
    { args: ["46.e3"], expected: true },
    { args: ["abc"], expected: false },
    { args: ["1a"], expected: false },
    { args: ["1e"], expected: false },
    { args: ["e3"], expected: false },
    { args: ["."], expected: false },
    { args: ["+-6"], expected: false },
    { args: ["--6"], expected: false },
    { args: ["95a54e53"], expected: false },
    { args: ["4e+"], expected: false },
    { args: [" 1"], expected: false },
    { args: ["1 "], expected: false },
    { args: ["1.2.3"], expected: false },
    { args: ["+"], expected: false },
    { args: ["6+1"], expected: false },
    { args: ["7e3e4"], expected: false },
    { args: ["0089"], expected: true },
    { args: ["-0.1"], expected: true },
  ],
  source: { origin: "leetcode", frontendId: "65", acRate: 0.2299866350271391, confidence: 0.9 },
  solutions: [
    {
      name: "Single-pass flag scan",
      explanation: `Walk the string once tracking three facts: whether a digit, a dot, and an exponent have appeared.

- A digit always sets \`seenDigit\`.
- A sign is only legal at index 0 or immediately after an \`e\`/\`E\`.
- A dot is illegal if a dot or an exponent has already appeared.
- An \`e\`/\`E\` is illegal if one already appeared **or** no digit has appeared yet; it also resets the digit flag, so the exponent must itself contain a digit.
- Anything else is invalid.

At the end the string is valid only if it contained at least one digit (covering both \`"."\` and \`"1e"\`).

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function isNumber(s) {
  let seenDigit = false;
  let seenDot = false;
  let seenExp = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c >= "0" && c <= "9") {
      seenDigit = true;
    } else if (c === "+" || c === "-") {
      if (i > 0 && s[i - 1] !== "e" && s[i - 1] !== "E") return false;
    } else if (c === ".") {
      if (seenDot || seenExp) return false;
      seenDot = true;
    } else if (c === "e" || c === "E") {
      if (seenExp || !seenDigit) return false;
      seenExp = true;
      seenDigit = false;
    } else {
      return false;
    }
  }
  return seenDigit;
}`,
        typescript: `function isNumber(s: string): boolean {
  let seenDigit = false;
  let seenDot = false;
  let seenExp = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c >= "0" && c <= "9") {
      seenDigit = true;
    } else if (c === "+" || c === "-") {
      if (i > 0 && s[i - 1] !== "e" && s[i - 1] !== "E") return false;
    } else if (c === ".") {
      if (seenDot || seenExp) return false;
      seenDot = true;
    } else if (c === "e" || c === "E") {
      if (seenExp || !seenDigit) return false;
      seenExp = true;
      seenDigit = false;
    } else {
      return false;
    }
  }
  return seenDigit;
}`,
      },
    },
  ],
});
