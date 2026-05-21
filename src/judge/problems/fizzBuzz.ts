import { defineProblem } from "../problem";

export const fizzBuzz = defineProblem<[number], string[]>({
  id: "fizz-buzz",
  title: "Fizz Buzz",
  difficulty: "easy",
  functionName: "fizzBuzz",
  prompt: `Return a string array \`answer\` of length \`n\` (1-indexed) where for each \`i\` from 1 to \`n\`:

- \`answer[i - 1] === "FizzBuzz"\` if \`i\` is divisible by both 3 and 5;
- \`answer[i - 1] === "Fizz"\` if divisible by 3;
- \`answer[i - 1] === "Buzz"\` if divisible by 5;
- \`answer[i - 1] === String(i)\` otherwise.`,
  starterCode: {
    javascript: `function fizzBuzz(n) {
  // your code here
}`,
    typescript: `function fizzBuzz(n: number): string[] {
  // your code here
}`,
  },
  tests: [
    { name: "n = 3", args: [3], expected: ["1", "2", "Fizz"] },
    { name: "n = 5", args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
    {
      name: "n = 15",
      args: [15],
      expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"],
    },
  ],
});
