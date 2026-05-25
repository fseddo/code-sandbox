import { defineAlgoProblem } from "../problem";

export const findAnagrams = defineAlgoProblem<[string, string], number[]>({
  id: "find-all-anagrams-in-a-string",
  number: 112,
  title: "Find All Anagrams in a String",
  difficulty: "medium",
  tags: ["hash-table", "string", "sliding-window"],
  functionName: "findAnagrams",
  prompt: `Given two strings \`s\` and \`p\`, return an array of all the start indices of \`p\`'s anagrams in \`s\`.

An anagram of \`p\` is any rearrangement of all of \`p\`'s letters that uses each letter exactly as many times as it appears in \`p\`. A start index \`i\` qualifies when the length-\`p.length\` substring of \`s\` beginning at \`i\` is such an anagram.

Return the indices in ascending order.`,
  constraints: [
    "1 <= s.length, p.length <= 3 * 10^4",
    "`s` and `p` consist of lowercase English letters.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
function findAnagrams(s, p) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
function findAnagrams(s: string, p: string): number[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "two anagrams",
      args: ["cbaebabacd", "abc"],
      expected: [0, 6],
      explanation: 'The substring "cba" at index 0 and "bac" at index 6 are anagrams of "abc".',
    },
    {
      name: "overlapping windows",
      args: ["abab", "ab"],
      expected: [0, 1, 2],
      explanation: '"ab" at 0, "ba" at 1, and "ab" at 2 are all anagrams of "ab".',
    },
    {
      name: "p longer than s",
      args: ["a", "aa"],
      expected: [],
      explanation: '"aa" cannot fit inside "a", so there is no anagram.',
    },
  ],
  hiddenTests: [
    { name: "no anagram present", args: ["abcdef", "gh"], expected: [] },
    { name: "single-char p, all matches", args: ["aaaa", "a"], expected: [0, 1, 2, 3] },
    { name: "single-char p, some matches", args: ["abaca", "a"], expected: [0, 2, 4] },
    { name: "equal length, match", args: ["abc", "cba"], expected: [0] },
    { name: "equal length, no match", args: ["abc", "abd"], expected: [] },
    { name: "anagram at the very end", args: ["xxxabc", "abc"], expected: [3] },
    { name: "anagram at the very start", args: ["abcxxx", "abc"], expected: [0] },
    { name: "repeated letters in p", args: ["baa", "aa"], expected: [1] },
    { name: "all same, longer p", args: ["aaaaa", "aaa"], expected: [0, 1, 2] },
    { name: "counts must match exactly", args: ["aabbcc", "abc"], expected: [] },
    {
      name: "scale: repeated pattern with matches every block",
      args: ["abc".repeat(10000), "cab"],
      expected: Array.from({ length: 3 * 10000 - 2 }, (_, i) => i),
    },
  ],
  source: { origin: "leetcode", frontendId: "438", acRate: 0.5169, confidence: 0.96 },
  solutions: [
    {
      name: "Fixed-size sliding window with a match counter",
      explanation: `Both \`s\` and \`p\` are lowercase letters, so each can be summarized by a 26-slot frequency array. A length-\`p.length\` window of \`s\` is an anagram of \`p\` exactly when its 26 counts equal \`p\`'s counts.

Rather than re-compare all 26 slots each step, track a \`matches\` count of how many of the 26 letters currently agree between the window and \`p\`. When a letter enters or leaves the window, only that one letter's count changes, so \`matches\` is updated in O(1): if a slot transitions into agreement bump \`matches\`, if it transitions out of agreement drop it. The window is an anagram whenever \`matches === 26\`.

\`O(s.length)\` time, \`O(1)\` space (a fixed 26-letter alphabet).`,
      code: {
        javascript: `function findAnagrams(s, p) {
  const result = [];
  if (p.length > s.length) return result;

  const A = 'a'.charCodeAt(0);
  // need[c]: target count of letter c from p; have[c]: count in the current window.
  const need = new Array(26).fill(0);
  const have = new Array(26).fill(0);
  for (const ch of p) need[ch.charCodeAt(0) - A]++;

  // matches: how many of the 26 letter-counts currently agree with p.
  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (need[i] === have[i]) matches++;
  }

  for (let right = 0; right < s.length; right++) {
    // Add the entering letter, adjusting matches for just that slot.
    const enter = s.charCodeAt(right) - A;
    have[enter]++;
    if (have[enter] === need[enter]) matches++;        // moved into agreement
    else if (have[enter] === need[enter] + 1) matches--; // moved out of agreement

    // Once the window is too wide, drop the leftmost letter.
    const left = right - p.length;
    if (left >= 0) {
      const exit = s.charCodeAt(left) - A;
      have[exit]--;
      if (have[exit] === need[exit]) matches++;        // moved into agreement
      else if (have[exit] === need[exit] - 1) matches--; // moved out of agreement
    }

    // All 26 counts agree → this window is an anagram of p.
    if (matches === 26) result.push(right - p.length + 1);
  }
  return result;
}`,
        typescript: `function findAnagrams(s: string, p: string): number[] {
  const result: number[] = [];
  if (p.length > s.length) return result;

  const A = 'a'.charCodeAt(0);
  // need[c]: target count of letter c from p; have[c]: count in the current window.
  const need = new Array<number>(26).fill(0);
  const have = new Array<number>(26).fill(0);
  for (const ch of p) need[ch.charCodeAt(0) - A]++;

  // matches: how many of the 26 letter-counts currently agree with p.
  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (need[i] === have[i]) matches++;
  }

  for (let right = 0; right < s.length; right++) {
    // Add the entering letter, adjusting matches for just that slot.
    const enter = s.charCodeAt(right) - A;
    have[enter]++;
    if (have[enter] === need[enter]) matches++;        // moved into agreement
    else if (have[enter] === need[enter] + 1) matches--; // moved out of agreement

    // Once the window is too wide, drop the leftmost letter.
    const left = right - p.length;
    if (left >= 0) {
      const exit = s.charCodeAt(left) - A;
      have[exit]--;
      if (have[exit] === need[exit]) matches++;        // moved into agreement
      else if (have[exit] === need[exit] - 1) matches--; // moved out of agreement
    }

    // All 26 counts agree → this window is an anagram of p.
    if (matches === 26) result.push(right - p.length + 1);
  }
  return result;
}`,
      },
    },
  ],
});
