import { defineAlgoProblem } from "../problem";

export const wordLadder = defineAlgoProblem<[string, string, string[]], number>({
  id: "word-ladder",
  number: 149,
  title: "Word Ladder",
  difficulty: "hard",
  tags: ["hash-table", "string", "breadth-first-search"],
  functionName: "ladderLength",
  prompt: `A **transformation sequence** from \`beginWord\` to \`endWord\` is a sequence of words \`begin -> w1 -> w2 -> ... -> end\` where:

- every adjacent pair of words differs by **exactly one letter**,
- every word *after* \`beginWord\` is present in \`wordList\` (\`beginWord\` itself need not be), and
- all words have the same length.

Given \`beginWord\`, \`endWord\`, and the dictionary \`wordList\`, return the **number of words** in the *shortest* such transformation sequence (counting both ends). If no transformation sequence exists, return \`0\`.`,
  constraints: [
    "1 <= beginWord.length <= 10",
    "endWord.length == beginWord.length",
    "1 <= wordList.length <= 5000",
    "wordList[i].length == beginWord.length",
    "beginWord, endWord, and wordList[i] consist of lowercase English letters.",
    "beginWord != endWord, and all words in wordList are unique.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
function ladderLength(beginWord, endWord, wordList) {
  // your code here
}`,
    typescript: `/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "five-word ladder",
      args: ["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]],
      expected: 5,
      explanation: "hit -> hot -> dot -> dog -> cog has 5 words, and no shorter sequence reaches cog.",
    },
    {
      name: "end word missing",
      args: ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]],
      expected: 0,
      explanation: "cog is not in the dictionary, so no valid sequence can end there.",
    },
    {
      name: "one step",
      args: ["a", "c", ["a", "b", "c"]],
      expected: 2,
      explanation: "a -> c differs by one letter and c is in the list — two words.",
    },
  ],
  hiddenTests: [
    // endWord absent from the dictionary — impossible, return 0.
    { args: ["abc", "abd", []], expected: 0 },
    // endWord present but two letters away with no bridge — unreachable.
    { args: ["hot", "dog", ["hot", "dog"]], expected: 0 },
    // The same pair becomes reachable once an intermediary is added.
    { args: ["hot", "dog", ["hot", "dot", "dog"]], expected: 3 },
    // beginWord one letter from endWord, end in the list — two words.
    { args: ["hit", "hot", ["hot"]], expected: 2 },
    // A longer chain where each hop changes a different position.
    { args: ["cat", "dog", ["cot", "dot", "dog", "cog"]], expected: 4 },
    // beginWord present in the list (allowed) but irrelevant to the count.
    { args: ["hit", "cog", ["hit", "hot", "dot", "dog", "lot", "log", "cog"]], expected: 5 },
    // A four-step ladder with a couple of dead-end words mixed in.
    { args: ["red", "tax", ["ted", "tex", "red", "tax", "tad", "den", "rex", "pee"]], expected: 4 },
    // endWord present but its whole region is disconnected from beginWord.
    { args: ["aaa", "bbb", ["aab", "abb", "bbb", "xyz"]], expected: 4 },
    // A reachable ladder that must route through several intermediaries.
    { args: ["lost", "miss", ["most", "mist", "miss", "fist", "fish"]], expected: 4 },
    // endWord one hop away, with extra noise words present.
    { args: ["lead", "load", ["lend", "load", "bead", "loud"]], expected: 2 },
  ],
  source: { origin: "leetcode", frontendId: "127", acRate: 0.4123, confidence: 0.9 },
  solutions: [
    {
      name: "BFS over the word graph",
      explanation: `Picture each word as a node, with an edge between two words that differ by exactly one letter. The shortest transformation sequence is then the shortest path from \`beginWord\` to \`endWord\` in that graph — and BFS finds shortest paths in an unweighted graph.

Put the dictionary in a set for O(1) membership. BFS level by level from \`beginWord\`; to find a word's neighbours, try every single-letter substitution (each of its positions × 26 letters) and keep those still in the set, removing each from the set as you enqueue it so no word is visited twice. The level number when \`endWord\` is dequeued is the answer (sequence length = levels including the start). If the queue empties without reaching \`endWord\`, return \`0\`.

\`O(N · L² · 26)\` in the worst case for \`N\` words of length \`L\` (each word generates \`L · 26\` candidates, each costing \`O(L)\` to build), and \`O(N · L)\` space for the set and queue.`,
      code: {
        javascript: `function ladderLength(beginWord, endWord, wordList) {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) return 0;        // can never finish on a word not in the list

  let queue = [beginWord];
  let length = 1;                          // beginWord itself is the first word in the sequence
  const a = "a".charCodeAt(0);

  while (queue.length > 0) {
    const next = [];
    for (const word of queue) {
      if (word === endWord) return length; // reached the target at this level
      // Generate every one-letter variation of this word.
      for (let i = 0; i < word.length; i++) {
        for (let k = 0; k < 26; k++) {
          const candidate = word.slice(0, i) + String.fromCharCode(a + k) + word.slice(i + 1);
          if (dict.has(candidate)) {
            dict.delete(candidate);        // claim it so it isn't revisited
            next.push(candidate);
          }
        }
      }
    }
    queue = next;
    length++;                              // advanced one level deeper
  }
  return 0;                                // endWord never reached
}`,
        typescript: `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) return 0;        // can never finish on a word not in the list

  let queue: string[] = [beginWord];
  let length = 1;                          // beginWord itself is the first word in the sequence
  const a = "a".charCodeAt(0);

  while (queue.length > 0) {
    const next: string[] = [];
    for (const word of queue) {
      if (word === endWord) return length; // reached the target at this level
      // Generate every one-letter variation of this word.
      for (let i = 0; i < word.length; i++) {
        for (let k = 0; k < 26; k++) {
          const candidate = word.slice(0, i) + String.fromCharCode(a + k) + word.slice(i + 1);
          if (dict.has(candidate)) {
            dict.delete(candidate);        // claim it so it isn't revisited
            next.push(candidate);
          }
        }
      }
    }
    queue = next;
    length++;                              // advanced one level deeper
  }
  return 0;                                // endWord never reached
}`,
      },
    },
  ],
});
