import { defineAlgoProblem } from "../problem";

export const characterReplacement = defineAlgoProblem<[string, number], number>({
  id: "longest-repeating-character-replacement",
  number: 113,
  title: "Longest Repeating Character Replacement",
  difficulty: "medium",
  tags: ["hash-table", "string", "sliding-window"],
  functionName: "characterReplacement",
  prompt: `You are given a string \`s\` and an integer \`k\`. You may choose any character of \`s\` and change it to any other uppercase English letter; you can perform this operation at most \`k\` times.

Return the length of the longest substring that, after at most \`k\` such replacements, contains only one distinct character.`,
  constraints: [
    "1 <= s.length <= 10^5",
    "`s` consists of uppercase English letters.",
    "0 <= k <= s.length",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
function characterReplacement(s, k) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
function characterReplacement(s: string, k: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "replace both ends",
      args: ["ABAB", 2],
      expected: 4,
      explanation: 'Replace the two "A"s with "B"s (or vice versa) to get "BBBB" — length 4.',
    },
    {
      name: "one replacement",
      args: ["AABABBA", 1],
      expected: 4,
      explanation: 'Replace the middle "A" to form "AABBBBA"; the run "BBBB" has length 4.',
    },
    {
      name: "no replacements allowed",
      args: ["AAAA", 0],
      expected: 4,
      explanation: "Already all the same — the whole string qualifies with zero changes.",
    },
  ],
  hiddenTests: [
    { name: "single char", args: ["A", 0], expected: 1 },
    { name: "single char with budget", args: ["A", 5], expected: 1 },
    { name: "all distinct, k covers all but one", args: ["ABCDE", 4], expected: 5 },
    { name: "all distinct, no budget", args: ["ABCDE", 0], expected: 1 },
    { name: "alternating, k = 1", args: ["ABABAB", 1], expected: 3 },
    { name: "answer needs all of k", args: ["AABA", 0], expected: 2 },
    { name: "k larger than length", args: ["AB", 10], expected: 2 },
    { name: "best run is at the start", args: ["AAAB", 0], expected: 3 },
    { name: "best run is at the end", args: ["BAAA", 0], expected: 3 },
    { name: "two characters, balanced", args: ["AABBAABB", 2], expected: 6 },
    { name: "long uniform string", args: ["A".repeat(100000), 0], expected: 100000 },
    {
      name: "scale: alternating with generous budget",
      args: ["AB".repeat(50000), 1],
      expected: 3,
    },
  ],
  source: { origin: "leetcode", frontendId: "424", acRate: 0.5469, confidence: 0.96 },
  solutions: [
    {
      name: "Sliding window with most-frequent count",
      explanation: `A window \`[left, right]\` can be made uniform with at most \`k\` replacements when the number of characters that *aren't* the window's most-frequent character is \`<= k\` — i.e. \`windowLength - maxFreq <= k\`, where \`maxFreq\` is the highest single-letter count inside the window.

Grow \`right\` one step at a time, updating the count of the entering letter and \`maxFreq\`. Whenever \`windowLength - maxFreq > k\` the window can no longer be made uniform, so slide \`left\` forward by one (dropping a letter). Crucially the window never needs to *shrink* below its best width: because \`left\` only ever advances when forced, the window width is monotonically non-decreasing, and its final width is the answer.

\`maxFreq\` is allowed to be stale (we never decrease it when \`left\` moves); that's fine, because a larger answer can only come from a window with an even larger \`maxFreq\`, so the recorded width never overcounts.

\`O(s.length)\` time, \`O(1)\` space (26-letter alphabet).`,
      code: {
        javascript: `function characterReplacement(s, k) {
  const A = 'A'.charCodeAt(0);
  // count[c]: occurrences of letter c inside the current window.
  const count = new Array(26).fill(0);
  let left = 0;
  let maxFreq = 0; // highest single-letter count seen in any window so far
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const enter = s.charCodeAt(right) - A;
    count[enter]++;
    // The dominant letter is the cheapest to keep; everything else must be replaced.
    maxFreq = Math.max(maxFreq, count[enter]);

    // If the non-dominant characters exceed k, this window can't be made uniform.
    while (right - left + 1 - maxFreq > k) {
      count[s.charCodeAt(left) - A]--;
      left++;
    }

    // The window is valid here; its width is a candidate answer.
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
        typescript: `function characterReplacement(s: string, k: number): number {
  const A = 'A'.charCodeAt(0);
  // count[c]: occurrences of letter c inside the current window.
  const count = new Array<number>(26).fill(0);
  let left = 0;
  let maxFreq = 0; // highest single-letter count seen in any window so far
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const enter = s.charCodeAt(right) - A;
    count[enter]++;
    // The dominant letter is the cheapest to keep; everything else must be replaced.
    maxFreq = Math.max(maxFreq, count[enter]);

    // If the non-dominant characters exceed k, this window can't be made uniform.
    while (right - left + 1 - maxFreq > k) {
      count[s.charCodeAt(left) - A]--;
      left++;
    }

    // The window is valid here; its width is a candidate answer.
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      },
    },
  ],
});
