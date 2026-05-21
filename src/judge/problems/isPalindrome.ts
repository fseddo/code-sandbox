import { defineProblem } from "../problem";

export const isPalindrome = defineProblem<[string], boolean>({
  id: "valid-palindrome",
  title: "Valid Palindrome",
  difficulty: "easy",
  functionName: "isPalindrome",
  prompt: `Given a string \`s\`, return \`true\` if it reads the same forwards and backwards after lowercasing and removing every non-alphanumeric character, and \`false\` otherwise.

An empty string (after cleaning) counts as a palindrome.`,
  starterCode: {
    javascript: `function isPalindrome(s) {
  // your code here
}`,
    typescript: `function isPalindrome(s: string): boolean {
  // your code here
}`,
  },
  tests: [
    { name: "classic", args: ["A man, a plan, a canal: Panama"], expected: true },
    { name: "not a palindrome", args: ["race a car"], expected: false },
    { name: "empty after cleaning", args: [" "], expected: true },
    { name: "alphanumeric mix", args: ["0P"], expected: false },
  ],
});
