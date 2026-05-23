import { defineAlgoProblem } from "../problem";

export const fizzBuzz = defineAlgoProblem<[number], string[]>({
  id: "fizz-buzz",
  number: 11,
  title: "Fizz Buzz",
  difficulty: "easy",
  tags: ["math", "string", "simulation"],
  functionName: "fizzBuzz",
  prompt: `Return a string array \`answer\` of length \`n\` (1-indexed) where for each \`i\` from 1 to \`n\`:

- \`answer[i - 1] === "FizzBuzz"\` if \`i\` is divisible by both 3 and 5;
- \`answer[i - 1] === "Fizz"\` if divisible by 3;
- \`answer[i - 1] === "Buzz"\` if divisible by 5;
- \`answer[i - 1] === String(i)\` otherwise.`,
  constraints: ["1 <= n <= 10^4"],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
function fizzBuzz(n) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @return {string[]}
 */
function fizzBuzz(n: number): string[] {
  // your code here
}`,
  },
  examples: [
    { name: "n = 3", args: [3], expected: ["1", "2", "Fizz"] },
    { name: "n = 5", args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
    {
      name: "n = 15",
      args: [15],
      expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"],
    },
  ],
  hiddenTests: [
    { args: [1], expected: ["1"] },
    { args: [2], expected: ["1", "2"] },
    {
      args: [16],
      expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz", "16"],
    },
  ],
  source: { origin: "leetcode", frontendId: "412" },
  solutions: [
    {
      name: "Modulo check",
      explanation: `Loop \`i\` from 1 to \`n\`. Test divisibility by 15 first — it's the "both" case, so checking 3 or 5 before it would short-circuit and never reach "FizzBuzz". Otherwise push \`"Fizz"\`, \`"Buzz"\`, or the number as a string.

\`O(n)\` time.`,
      code: {
        javascript: `function fizzBuzz(n) {
  const answer = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) answer.push("FizzBuzz");
    else if (i % 3 === 0) answer.push("Fizz");
    else if (i % 5 === 0) answer.push("Buzz");
    else answer.push(String(i));
  }
  return answer;
}`,
        typescript: `function fizzBuzz(n: number): string[] {
  const answer: string[] = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) answer.push("FizzBuzz");
    else if (i % 3 === 0) answer.push("Fizz");
    else if (i % 5 === 0) answer.push("Buzz");
    else answer.push(String(i));
  }
  return answer;
}`,
      },
    },
  ],
});
