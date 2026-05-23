import { defineAlgoProblem } from "../problem";

export const makeStringSubsequenceCyclic = defineAlgoProblem<[string, string], boolean>({
  id: "make-string-a-subsequence-using-cyclic-increments",
  title: "Make String a Subsequence Using Cyclic Increments",
  difficulty: "medium",
  tags: ["two-pointers", "string", "greedy"],
  functionName: "canMakeSubsequence",
  prompt: `You are given two strings \`str1\` and \`str2\`.

In **one** operation you may pick any set of indices in \`str1\` and increment each chosen character cyclically to the next letter: \`'a' → 'b'\`, \`'b' → 'c'\`, …, \`'z' → 'a'\`.

Return \`true\` if, after performing this operation **at most once**, \`str2\` can be a subsequence of \`str1\`, and \`false\` otherwise. A subsequence keeps the original order but may skip characters.`,
  constraints: [
    "1 <= str1.length <= 10^5",
    "1 <= str2.length <= 10^5",
    "str1 and str2 consist of lowercase English letters.",
  ],
  starterCode: {
    javascript: `function canMakeSubsequence(str1, str2) {
  // your code here
}`,
    typescript: `function canMakeSubsequence(str1: string, str2: string): boolean {
  // your code here
}`,
  },
  examples: [
    {
      name: "increment one char",
      args: ["abc", "ad"],
      expected: true,
      explanation: "Increment str1[2] 'c' to 'd'; then 'a','d' appears in order as a subsequence.",
    },
    {
      name: "wrap around",
      args: ["zc", "ad"],
      expected: true,
      explanation: "Increment 'z'→'a' and 'c'→'d'; 'ad' is then a subsequence.",
    },
    {
      name: "impossible",
      args: ["ab", "d"],
      expected: false,
      explanation: "Neither 'a','b' nor their increments 'b','c' can produce 'd'.",
    },
  ],
  hiddenTests: [
    { args: ["a", "a"], expected: true },
    { args: ["a", "b"], expected: true },
    { args: ["a", "c"], expected: false },
    { args: ["z", "a"], expected: true },
    { args: ["ab", "ab"], expected: true },
    { args: ["ab", "ba"], expected: false },
    { args: ["abc", "abcd"], expected: false },
    { args: ["yz", "za"], expected: true },
    { args: ["aaa", "aaaa"], expected: false },
    { args: ["abcdz", "ace"], expected: true },
    { args: ["abc", "aae"], expected: false },
    {
      name: "scale - exact match needed",
      args: ["ab".repeat(50000), "ab".repeat(40000)],
      expected: true,
    },
    {
      name: "scale - never matchable",
      args: ["a".repeat(100000), "c".repeat(2)],
      expected: false,
    },
  ],
  source: { origin: "authored", confidence: 0.85 },
  solutions: [
    {
      name: "Greedy two pointers",
      explanation: `Walk \`str1\` with pointer \`i\` and \`str2\` with pointer \`j\`. A character \`str1[i]\` can satisfy \`str2[j]\` if it already equals it, **or** if its cyclic increment equals it (\`(str1[i] + 1) mod 26 === str2[j]\`). Whenever it can, advance \`j\`; always advance \`i\`. Since each increment is independent and applied at most once per index, greedily matching the earliest usable character is optimal. If \`j\` reaches the end of \`str2\`, every target was matched.

\`O(n)\` time over \`str1\`, \`O(1)\` extra space.`,
      code: {
        javascript: `function canMakeSubsequence(str1, str2) {
  const next = (ch) =>
    ch === "z" ? "a" : String.fromCharCode(ch.charCodeAt(0) + 1);
  let j = 0;
  for (let i = 0; i < str1.length && j < str2.length; i++) {
    if (str1[i] === str2[j] || next(str1[i]) === str2[j]) j++;
  }
  return j === str2.length;
}`,
        typescript: `function canMakeSubsequence(str1: string, str2: string): boolean {
  const next = (ch: string): string =>
    ch === "z" ? "a" : String.fromCharCode(ch.charCodeAt(0) + 1);
  let j = 0;
  for (let i = 0; i < str1.length && j < str2.length; i++) {
    if (str1[i] === str2[j] || next(str1[i]) === str2[j]) j++;
  }
  return j === str2.length;
}`,
      },
    },
  ],
});
