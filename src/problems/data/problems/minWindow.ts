import { defineAlgoProblem } from "../problem";

export const minWindow = defineAlgoProblem<[string, string], string>({
  id: "minimum-window-substring",
  number: 82,
  title: "Minimum Window Substring",
  difficulty: "hard",
  tags: ["hash-table", "string", "sliding-window"],
  functionName: "minWindow",
  prompt: `Given two strings \`s\` and \`t\`, return the **smallest** contiguous substring of \`s\` that contains **every character of \`t\`**, counting duplicates (a character appearing twice in \`t\` must appear at least twice in the window).

If no such window exists, return the empty string \`""\`. The answer is guaranteed to be unique when one exists.`,
  constraints: [
    "1 <= s.length, t.length <= 10^5",
    "s and t consist of uppercase and lowercase English letters.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
function minWindow(s, t) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
function minWindow(s: string, t: string): string {
  // your code here
}`,
  },
  examples: [
    { name: "basic", args: ["ADOBECODEBANC", "ABC"], expected: "BANC", explanation: "BANC is the shortest window holding A, B, and C." },
    { name: "whole string", args: ["a", "a"], expected: "a" },
    { name: "no window", args: ["a", "aa"], expected: "", explanation: "s has only one 'a' but t needs two." },
  ],
  hiddenTests: [
    { args: ["ab", "b"], expected: "b" },
    { args: ["ab", "a"], expected: "a" },
    { args: ["aa", "aa"], expected: "aa" },
    { args: ["abc", "cba"], expected: "abc" },
    { args: ["bba", "ab"], expected: "ba" },
    { args: ["cabwefgewcwaefgcf", "cae"], expected: "cwae" },
    { args: ["aaaaaaaaaaaabbbbbcdd", "abcdd"], expected: "abbbbbcdd" },
    { args: ["abcdef", "xyz"], expected: "" },
    { args: ["ADOBECODEBANC", "ABCC"], expected: "CODEBANC" },
    { args: ["xyzabc", "abc"], expected: "abc" },
    { args: ["abcabcabc", "aabbcc"], expected: "abcabc" },
    { args: ["this is a test string", "tist"], expected: "t stri" },
    { args: ["AB", "AB"], expected: "AB" },
    { args: ["ZZZZZ", "Z"], expected: "Z" },
    { args: ["acbbaca", "aba"], expected: "baca" },
    {
      args: ["a".repeat(50000) + "b" + "a".repeat(49999), "ab"],
      expected: "ab",
    },
  ],
  source: { origin: "leetcode", frontendId: "76", acRate: 0.4753338573221175, confidence: 0.92 },
  solutions: [
    {
      name: "Sliding window with counts",
      explanation: `Tally the characters needed from \`t\`. Expand a right pointer, decrementing the need count; track how many distinct required characters are fully satisfied (\`formed\`). Once all are satisfied, shrink from the left while still valid, recording the smallest window. Each character enters and leaves the window once.

\`O(|s| + |t|)\` time, \`O(1)\` extra space (bounded alphabet).`,
      code: {
        javascript: `function minWindow(s, t) {
  if (t.length > s.length) return "";
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  const required = need.size;
  const window = new Map();
  let formed = 0;
  let left = 0;
  let best = [Infinity, 0, 0];
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window.set(c, (window.get(c) || 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) formed++;
    while (formed === required) {
      if (right - left + 1 < best[0]) best = [right - left + 1, left, right];
      const lc = s[left];
      window.set(lc, window.get(lc) - 1);
      if (need.has(lc) && window.get(lc) < need.get(lc)) formed--;
      left++;
    }
  }
  return best[0] === Infinity ? "" : s.slice(best[1], best[2] + 1);
}`,
        typescript: `function minWindow(s: string, t: string): string {
  if (t.length > s.length) return "";
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  const required = need.size;
  const window = new Map<string, number>();
  let formed = 0;
  let left = 0;
  let best: [number, number, number] = [Infinity, 0, 0];
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window.set(c, (window.get(c) || 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) formed++;
    while (formed === required) {
      if (right - left + 1 < best[0]) best = [right - left + 1, left, right];
      const lc = s[left];
      window.set(lc, window.get(lc)! - 1);
      if (need.has(lc) && window.get(lc)! < need.get(lc)!) formed--;
      left++;
    }
  }
  return best[0] === Infinity ? "" : s.slice(best[1], best[2] + 1);
}`,
      },
    },
  ],
});
