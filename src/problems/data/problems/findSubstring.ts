import { defineAlgoProblem } from "../problem";

// The answer is a set of start indices in any order, so the checker sorts both sides before comparing.
export const findSubstring = defineAlgoProblem<[string, string[]], number[]>({
  id: "substring-with-concatenation-of-all-words",
  number: 39,
  title: "Substring with Concatenation of All Words",
  difficulty: "hard",
  tags: ["hash-table", "string", "sliding-window"],
  functionName: "findSubstring",
  prompt: `You are given a string \`s\` and an array \`words\` of strings that all have the **same length**. A *concatenated substring* is a substring of \`s\` that is formed by joining every word in \`words\` exactly once, in any order, with no characters in between.

Return the starting indices of all concatenated substrings in \`s\`. The indices may be returned in any order.`,
  constraints: [
    "1 <= s.length <= 10^4",
    "1 <= words.length <= 5000",
    "1 <= words[i].length <= 30",
    "All words[i] have the same length.",
    "s and words[i] consist of lowercase English letters.",
  ],
  checker: `(actual, args, expected) => {
    if (!Array.isArray(actual)) return false;
    if (actual.length !== expected.length) return false;
    const a = [...actual].sort((x, y) => x - y);
    const b = [...expected].sort((x, y) => x - y);
    return a.every((value, index) => value === b[index]);
  }`,
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @param {string[]} words
 * @return {number[]}
 */
function findSubstring(s, words) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @param {string[]} words
 * @return {number[]}
 */
function findSubstring(s: string, words: string[]): number[] {
  // your code here
}`,
  },
  examples: [
    { name: "two words", args: ["barfoothefoobarman", ["foo", "bar"]], expected: [0, 9], explanation: `"barfoo" starts at 0 and "foobar" starts at 9 — both are "foo"+"bar" in some order.` },
    { name: "no match", args: ["wordgoodgoodgoodbestword", ["word", "good", "best", "word"]], expected: [], explanation: `No window contains "word" twice with "good" and "best".` },
    { name: "three words", args: ["barfoofoobarthefoobarman", ["bar", "foo", "the"]], expected: [6, 9, 12] },
  ],
  hiddenTests: [
    { name: "single word repeated", args: ["aaa", ["a", "a"]], expected: [0, 1] },
    { name: "whole string", args: ["abcdef", ["ab", "cd", "ef"]], expected: [0] },
    { name: "no occurrence", args: ["abcabc", ["xx", "yy"]], expected: [] },
    { name: "needle longer than s", args: ["ab", ["abc", "def"]], expected: [] },
    { name: "duplicate words required twice", args: ["aaaaaa", ["aa", "aa", "aa"]], expected: [0] },
    { name: "overlapping starts", args: ["wordgoodgoodgoodbestword", ["word", "good", "best", "good"]], expected: [8] },
    { name: "single one-char word", args: ["abc", ["a"]], expected: [0] },
    { name: "at the very end", args: ["xyzabcdef", ["abc", "def"]], expected: [3] },
    { name: "all positions", args: ["aaaa", ["a", "a"]], expected: [0, 1, 2] },
    { name: "both orderings present", args: ["foobarfoo", ["foo", "bar"]], expected: [0, 3] },
    { name: "no match wrong count", args: ["foofoo", ["foo", "bar"]], expected: [] },
    {
      name: "scale: long string, even-aligned windows",
      args: ["ab".repeat(2000), ["ab", "ab"]],
      expected: Array.from({ length: 1999 }, (_, i) => i * 2),
    },
    {
      name: "scale: many one-char words",
      args: ["x".repeat(1000), Array.from({ length: 100 }, () => "x")],
      expected: Array.from({ length: 901 }, (_, i) => i),
    },
  ],
  source: { origin: "leetcode", frontendId: "30", acRate: 0.3442814477891772, confidence: 0.85 },
  solutions: [
    {
      name: "Sliding window per offset",
      explanation: `Every word has the same length \`w\`; a valid substring spans \`total = words.length * w\` characters. Build a frequency map of the required words. Then run a sliding window for each of the \`w\` possible alignment offsets \`0..w-1\`, stepping word-by-word. Track how many words the current window has consumed; when a word appears more often than needed, shrink the left edge past the earliest copy; when the window holds exactly \`words.length\` words, record its start.

\`O(w · n)\` time (each character is visited a constant number of times per offset), \`O(unique words)\` space.`,
      code: {
        javascript: `function findSubstring(s, words) {
  const w = words[0].length;
  const count = words.length;
  const total = w * count;
  const result = [];
  if (s.length < total) return result;

  const need = new Map();
  for (const word of words) need.set(word, (need.get(word) || 0) + 1);

  for (let offset = 0; offset < w; offset++) {
    let left = offset;
    let consumed = 0;
    const window = new Map();
    for (let right = offset; right + w <= s.length; right += w) {
      const word = s.slice(right, right + w);
      if (need.has(word)) {
        window.set(word, (window.get(word) || 0) + 1);
        consumed++;
        while (window.get(word) > need.get(word)) {
          const leftWord = s.slice(left, left + w);
          window.set(leftWord, window.get(leftWord) - 1);
          left += w;
          consumed--;
        }
        if (consumed === count) {
          result.push(left);
          const leftWord = s.slice(left, left + w);
          window.set(leftWord, window.get(leftWord) - 1);
          left += w;
          consumed--;
        }
      } else {
        window.clear();
        consumed = 0;
        left = right + w;
      }
    }
  }
  return result;
}`,
        typescript: `function findSubstring(s: string, words: string[]): number[] {
  const w = words[0].length;
  const count = words.length;
  const total = w * count;
  const result: number[] = [];
  if (s.length < total) return result;

  const need = new Map<string, number>();
  for (const word of words) need.set(word, (need.get(word) || 0) + 1);

  for (let offset = 0; offset < w; offset++) {
    let left = offset;
    let consumed = 0;
    const window = new Map<string, number>();
    for (let right = offset; right + w <= s.length; right += w) {
      const word = s.slice(right, right + w);
      if (need.has(word)) {
        window.set(word, (window.get(word) || 0) + 1);
        consumed++;
        while ((window.get(word) as number) > (need.get(word) as number)) {
          const leftWord = s.slice(left, left + w);
          window.set(leftWord, (window.get(leftWord) as number) - 1);
          left += w;
          consumed--;
        }
        if (consumed === count) {
          result.push(left);
          const leftWord = s.slice(left, left + w);
          window.set(leftWord, (window.get(leftWord) as number) - 1);
          left += w;
          consumed--;
        }
      } else {
        window.clear();
        consumed = 0;
        left = right + w;
      }
    }
  }
  return result;
}`,
      },
    },
  ],
});
