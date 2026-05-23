import { defineAlgoProblem } from "../problem";

export const lengthOfLongestSubstring = defineAlgoProblem<[string], number>({
  id: "longest-substring-without-repeating-characters",
  number: 3,
  title: "Longest Substring Without Repeating Characters",
  difficulty: "medium",
  tags: ["hash-table", "string", "sliding-window"],
  functionName: "lengthOfLongestSubstring",
  prompt: `Given a string \`s\`, return the length of the longest contiguous substring that contains no repeated characters.

A substring is a run of consecutive characters from \`s\` (not a subsequence). The answer is a single number — the length of the longest such run — not the substring itself.`,
  constraints: [
    "0 <= s.length <= 5 * 10^4",
    "`s` consists of English letters, digits, symbols, and spaces.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s: string): number {
  // your code here
}`,
  },
  examples: [
    { name: "repeat resets window", args: ["abcabcbb"], expected: 3, explanation: "The longest run without a repeat is `abc`, length 3." },
    { name: "all same", args: ["bbbbb"], expected: 1, explanation: "Every character is `b`, so the longest run is a single `b`." },
    { name: "repeat in the middle", args: ["pwwkew"], expected: 3, explanation: "`wke` has length 3. `pwke` is not a substring (the characters aren't consecutive)." },
    { name: "empty string", args: [""], expected: 0, explanation: "An empty string has no characters, so the length is 0." },
  ],
  hiddenTests: [
    { name: "single char", args: ["a"], expected: 1 },
    { name: "two distinct", args: ["au"], expected: 2 },
    { name: "two same", args: ["aa"], expected: 1 },
    { name: "all distinct", args: ["abcdef"], expected: 6 },
    { name: "answer at the end", args: ["aaabcde"], expected: 5 },
    { name: "answer at the start", args: ["abcdeaaa"], expected: 5 },
    { name: "spaces count", args: ["a b c a b"], expected: 3 },
    { name: "digits and symbols", args: ["a1!a1!2"], expected: 4 },
    { name: "repeat just outside window", args: ["abba"], expected: 2 },
    { name: "uppercase distinct from lowercase", args: ["aAbBcC"], expected: 6 },
    { name: "tricky shrink (dvdf)", args: ["dvdf"], expected: 3 },
    { name: "long repeated single char", args: ["z".repeat(50000)], expected: 1 },
    { name: "scale: long all-distinct cycle", args: [Array.from({ length: 50000 }, (_, i) => String.fromCharCode(33 + (i % 94))).join("")], expected: 94 },
  ],
  source: {
    origin: "leetcode",
    frontendId: "3",
    acRate: 0.3905624970138553,
    confidence: 0.92,
  },
  solutions: [
    {
      name: "Sliding window with last-seen map",
      explanation: `Keep a window \`[start, i]\` that holds only distinct characters. Walk \`i\` over the string, tracking the most recent index of each character in a map. When the current character was last seen at or after \`start\`, the window now contains a duplicate, so jump \`start\` to one past that last occurrence. The best length is the largest \`i - start + 1\` seen.

Each character is visited once and \`start\` only moves forward, so it's \`O(n)\` time and \`O(min(n, alphabet))\` space.`,
      code: {
        javascript: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let start = 0;
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= start) {
      start = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}`,
        typescript: `function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let start = 0;
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const prev = lastSeen.get(ch);
    if (prev !== undefined && prev >= start) {
      start = prev + 1;
    }
    lastSeen.set(ch, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}`,
      },
    },
  ],
});
