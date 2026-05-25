import { defineAlgoProblem } from "../problem";

export const removeAllAdjacentDuplicates = defineAlgoProblem<[string], string>({
  id: "remove-all-adjacent-duplicates-in-string",
  number: 118,
  title: "Remove All Adjacent Duplicates In String",
  difficulty: "easy",
  tags: ["string", "stack"],
  functionName: "removeDuplicates",
  prompt: `You are given a string \`s\` of lowercase letters. A **duplicate removal** deletes two *adjacent* equal characters.

Repeatedly perform duplicate removals on \`s\` until no two adjacent characters are equal, then return the final string. The result is guaranteed to be unique.`,
  constraints: [
    "1 <= s.length <= 10^5",
    "s consists of lowercase English letters.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @return {string}
 */
function removeDuplicates(s) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @return {string}
 */
function removeDuplicates(s: string): string {
  // your code here
}`,
  },
  examples: [
    { name: "one collapse", args: ["abbaca"], expected: "ca", explanation: "Remove \"bb\" to get \"aaca\", then \"aa\" to get \"ca\"." },
    { name: "cascade", args: ["azxxzy"], expected: "ay", explanation: "Remove \"xx\" to get \"azzy\", then the newly adjacent \"zz\" to get \"ay\"." },
    { name: "no removals", args: ["abc"], expected: "abc" },
  ],
  hiddenTests: [
    { args: ["a"], expected: "a" },
    { args: ["aa"], expected: "" },
    { args: ["aaaa"], expected: "" },
    { args: ["aaa"], expected: "a" },
    { args: ["aabb"], expected: "" },
    { args: ["abba"], expected: "" },
    { args: ["abccba"], expected: "" },
    { args: ["abcddcba"], expected: "" },
    { args: ["abcd"], expected: "abcd" },
    { args: ["aabccba"], expected: "a" },
    { args: ["mississippi"], expected: "m" },
    { args: ["aaccaa"], expected: "" },
    // Scale: 10^5 identical letters fully annihilate in pairs; only O(n) stack survives.
    { args: ["a".repeat(100000)], expected: "" },
    // Scale: alternating letters never collapse.
    { args: ["ab".repeat(50000)], expected: "ab".repeat(50000) },
  ],
  source: { origin: "leetcode", frontendId: "1047", acRate: 0.7102, confidence: 0.96 },
  solutions: [
    {
      name: "Character stack",
      explanation: `Build the result on a stack. For each character, if it equals the character currently on top of the stack, the two are an adjacent pair — pop the top instead of pushing, cancelling both. Otherwise push the character. Because a removal can expose a new adjacency underneath, the stack naturally handles the cascade: the next character is compared against whatever is now on top.

The characters left on the stack, in order, are the final string.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function removeDuplicates(s) {
  const stack = [];
  for (const ch of s) {
    // If ch matches the top, they cancel — pop instead of push.
    if (stack.length > 0 && stack[stack.length - 1] === ch) {
      stack.pop();
    } else {
      stack.push(ch);
    }
  }
  return stack.join("");
}`,
        typescript: `function removeDuplicates(s: string): string {
  const stack: string[] = [];
  for (const ch of s) {
    // If ch matches the top, they cancel — pop instead of push.
    if (stack.length > 0 && stack[stack.length - 1] === ch) {
      stack.pop();
    } else {
      stack.push(ch);
    }
  }
  return stack.join("");
}`,
      },
    },
  ],
});
