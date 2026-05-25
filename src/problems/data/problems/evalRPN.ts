import { defineAlgoProblem } from "../problem";

export const evalRPN = defineAlgoProblem<[string[]], number>({
  id: "evaluate-reverse-polish-notation",
  number: 117,
  title: "Evaluate Reverse Polish Notation",
  difficulty: "medium",
  tags: ["array", "math", "stack"],
  functionName: "evalRPN",
  prompt: `You are given an arithmetic expression in **Reverse Polish Notation** (postfix) as an array of string \`tokens\`. Evaluate it and return the resulting integer.

A token is either an integer (possibly negative) or one of the four operators \`"+"\`, \`"-"\`, \`"*"\`, \`"/"\`. Each operator applies to the two values that immediately precede it.

Notes:
- Division between two integers **truncates toward zero** (so \`6 / -4\` is \`-1\`, not \`-2\`).
- The expression is always valid, every operator has its two operands, and the result fits in a 32-bit signed integer.`,
  constraints: [
    "1 <= tokens.length <= 10^4",
    "Each token is \"+\", \"-\", \"*\", \"/\", or an integer in [-200, 200].",
    "The expression is always a valid postfix expression.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[]} tokens
 * @return {number}
 */
function evalRPN(tokens) {
  // your code here
}`,
    typescript: `/**
 * @param {string[]} tokens
 * @return {number}
 */
function evalRPN(tokens: string[]): number {
  // your code here
}`,
  },
  examples: [
    { name: "simple add", args: [["2", "1", "+", "3", "*"]], expected: 9, explanation: "(2 + 1) * 3 = 9." },
    { name: "with division", args: [["4", "13", "5", "/", "+"]], expected: 6, explanation: "13 / 5 = 2 (truncated), then 4 + 2 = 6." },
    { name: "nested", args: [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], expected: 22 },
  ],
  hiddenTests: [
    { args: [["42"]], expected: 42 },
    { args: [["-3"]], expected: -3 },
    { args: [["3", "4", "+"]], expected: 7 },
    { args: [["5", "1", "2", "+", "4", "*", "+", "3", "-"]], expected: 14 },
    { args: [["6", "-4", "/"]], expected: -1 },
    { args: [["-6", "4", "/"]], expected: -1 },
    { args: [["7", "2", "-"]], expected: 5 },
    { args: [["2", "7", "-"]], expected: -5 },
    { args: [["0", "3", "*"]], expected: 0 },
    { args: [["15", "7", "1", "1", "+", "-", "/", "3", "*"]], expected: 9 },
    { args: [["2", "2", "2", "2", "+", "+", "+"]], expected: 8 },
    { args: [["100", "200", "+", "2", "/"]], expected: 150 },
    { args: [["-200", "-200", "*"]], expected: 40000 },
  ],
  source: { origin: "leetcode", frontendId: "150", acRate: 0.5305, confidence: 0.95 },
  solutions: [
    {
      name: "Operand stack",
      explanation: `Postfix needs no parentheses: when you read an operator, its operands are the two most recently produced values. So push every number onto a stack; on an operator, pop the top two (the second pop is the *left* operand), apply the operation, and push the result back. After the last token a single value remains — the answer.

Truncation toward zero matters for division: \`Math.trunc(a / b)\` drops the fractional part regardless of sign, unlike \`Math.floor\`.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function evalRPN(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      // The two operands are the last two values produced; order matters for - and /.
      const b = stack.pop();
      const a = stack.pop();
      if (token === "+") stack.push(a + b);
      else if (token === "-") stack.push(a - b);
      else if (token === "*") stack.push(a * b);
      else stack.push(Math.trunc(a / b)); // truncate toward zero, not floor
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}`,
        typescript: `function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  for (const token of tokens) {
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      // The two operands are the last two values produced; order matters for - and /.
      const b = stack.pop()!;
      const a = stack.pop()!;
      if (token === "+") stack.push(a + b);
      else if (token === "-") stack.push(a - b);
      else if (token === "*") stack.push(a * b);
      else stack.push(Math.trunc(a / b)); // truncate toward zero, not floor
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}`,
      },
    },
  ],
});
