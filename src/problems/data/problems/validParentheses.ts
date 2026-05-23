import { defineAlgoProblem } from "../problem";

export const validParentheses = defineAlgoProblem<[string], boolean>({
  id: "valid-parentheses",
  number: 30,
  title: "Valid Parentheses",
  difficulty: "easy",
  tags: ["string", "stack"],
  functionName: "isValid",
  prompt: `Given a string \`s\` containing only the bracket characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, decide whether it is *valid*.

A string is valid when:

- every opening bracket is closed by a matching bracket of the same type, and
- brackets close in the correct order (the most recently opened bracket must be the first to close).

Return \`true\` if \`s\` is valid and \`false\` otherwise. The empty string is valid.`,
  constraints: [
    "1 <= s.length <= 10^4",
    "s consists only of the characters '()[]{}'.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s: string): boolean {
  // your code here
}`,
  },
  examples: [
    { name: "single pair", args: ["()"], expected: true, explanation: "One opening bracket closed by its match." },
    { name: "mixed types", args: ["()[]{}"], expected: true, explanation: "Three independent matched pairs in sequence." },
    { name: "mismatch", args: ["(]"], expected: false, explanation: "'(' is closed by ']', which is the wrong type." },
    { name: "wrong order", args: ["([)]"], expected: false, explanation: "The '(' is closed before the inner '[', so the nesting order is broken." },
  ],
  hiddenTests: [
    { args: ["]"], expected: false },
    { args: ["("], expected: false },
    { args: ["{[]}"], expected: true },
    { args: ["((()))"], expected: true },
    { args: ["(((((("], expected: false },
    { args: ["))))))"], expected: false },
    { args: ["{[()]}{}[]"], expected: true },
    { args: ["([]{})("], expected: false },
    { args: ["{[}]"], expected: false },
    { args: ["()(()))("], expected: false },
    { args: [`${"()".repeat(5000)}`], expected: true },
    { args: [`${"([{".repeat(3333)}${"}])".repeat(3333)}`], expected: true },
  ],
  source: { origin: "leetcode", frontendId: "20", acRate: 0.4417883691551338, confidence: 0.97 },
  solutions: [
    {
      name: "Stack",
      explanation: `Scan left to right. Push every opening bracket onto a stack. On a closing bracket, the top of the stack must be its matching opener — if the stack is empty or the top doesn't match, the string is invalid. After the scan the stack must be empty (no unclosed openers).

A map from each closer to its expected opener keeps the matching check \`O(1)\`.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (stack.pop() !== pairs[ch]) {
      return false;
    }
  }
  return stack.length === 0;
}`,
        typescript: `function isValid(s: string): boolean {
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const stack: string[] = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (stack.pop() !== pairs[ch]) {
      return false;
    }
  }
  return stack.length === 0;
}`,
      },
    },
  ],
});
