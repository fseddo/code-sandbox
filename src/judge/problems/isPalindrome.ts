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
  hiddenTests: [
    { args: [""], expected: true },
    { args: ["a"], expected: true },
    { args: [".,"], expected: true },
    { args: ["ab_a"], expected: true },
    { args: ["Able was I ere I saw Elba"], expected: true },
    { args: ["abc"], expected: false },
  ],
  solutions: [
    {
      name: "Clean, then two pointers",
      explanation: `First normalize: lowercase and drop every non-alphanumeric character with a regex. Then walk two pointers inward from both ends — if any mismatched pair turns up it isn't a palindrome. An empty cleaned string never enters the loop, so it returns \`true\`.

\`O(n)\` time, \`O(n)\` for the cleaned copy.`,
      code: {
        javascript: `function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let i = 0;
  let j = cleaned.length - 1;
  while (i < j) {
    if (cleaned[i] !== cleaned[j]) return false;
    i++;
    j--;
  }
  return true;
}`,
        typescript: `function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let i = 0;
  let j = cleaned.length - 1;
  while (i < j) {
    if (cleaned[i] !== cleaned[j]) return false;
    i++;
    j--;
  }
  return true;
}`,
      },
    },
  ],
});
