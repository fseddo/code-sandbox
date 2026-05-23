import { defineAlgoProblem } from "../problem";

export const longestValidParentheses = defineAlgoProblem<[string], number>({
  id: "longest-valid-parentheses",
  number: 41,
  title: "Longest Valid Parentheses",
  difficulty: "hard",
  tags: ["string", "dynamic-programming", "stack"],
  functionName: "longestValidParentheses",
  prompt: `Given a string \`s\` containing only the characters \`'('\` and \`')'\`, return the length of the longest **contiguous** substring that is well-formed.

A substring is well-formed when every opening parenthesis has a matching closing parenthesis that comes after it and the pairs are properly nested. Return \`0\` if no non-empty valid substring exists.`,
  constraints: [
    "0 <= s.length <= 3 * 10^4",
    "s[i] is either '(' or ')'.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @return {number}
 */
function longestValidParentheses(s) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @return {number}
 */
function longestValidParentheses(s: string): number {
  // your code here
}`,
  },
  examples: [
    { name: "trailing pair", args: ["(()"], expected: 2, explanation: `The longest valid substring is "()" with length 2.` },
    { name: "two pairs", args: [")()())"], expected: 4, explanation: `The longest valid substring is "()()" with length 4.` },
    { name: "empty", args: [""], expected: 0 },
  ],
  hiddenTests: [
    { name: "single open", args: ["("], expected: 0 },
    { name: "single close", args: [")"], expected: 0 },
    { name: "all open", args: ["(((("], expected: 0 },
    { name: "all close", args: ["))))"], expected: 0 },
    { name: "perfectly nested", args: ["(((())))"], expected: 8 },
    { name: "flat run", args: ["()()()"], expected: 6 },
    { name: "valid in the middle", args: [")(()())("], expected: 6 },
    { name: "reset by stray close", args: ["()(()"], expected: 2 },
    { name: "merge across boundary", args: ["()(())"], expected: 6 },
    { name: "long invalid prefix", args: ["((((((((()"], expected: 2 },
    { name: "trailing stray open", args: [")()(())("], expected: 6 },
    {
      name: "scale: fully valid long string",
      args: ["()".repeat(15000)],
      expected: 30000,
    },
    {
      name: "scale: one stray break in the middle",
      args: ["()".repeat(7500) + "(" + "()".repeat(7499)],
      expected: 15000,
    },
  ],
  source: { origin: "leetcode", frontendId: "32", acRate: 0.3880615172674392, confidence: 0.93 },
  solutions: [
    {
      name: "Stack of indices",
      explanation: `Push a sentinel \`-1\` onto a stack to mark the index just before the current valid run. Scan the string: on \`'('\` push its index; on \`')'\` pop. If the stack becomes empty, the \`')'\` is unmatched — push its index as the new boundary. Otherwise the current valid length is \`i - stack.top\`, the distance back to the last unmatched boundary. Track the maximum.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function longestValidParentheses(s) {
  const stack = [-1];
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length === 0) {
        stack.push(i);
      } else {
        best = Math.max(best, i - stack[stack.length - 1]);
      }
    }
  }
  return best;
}`,
        typescript: `function longestValidParentheses(s: string): number {
  const stack: number[] = [-1];
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length === 0) {
        stack.push(i);
      } else {
        best = Math.max(best, i - stack[stack.length - 1]);
      }
    }
  }
  return best;
}`,
      },
    },
  ],
});
