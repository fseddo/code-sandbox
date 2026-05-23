import { defineAlgoProblem } from "../problem";

export const fullJustify = defineAlgoProblem<[string[], number], string[]>({
  id: "text-justification",
  number: 75,
  title: "Text Justification",
  difficulty: "hard",
  tags: ["array", "string", "simulation"],
  functionName: "fullJustify",
  prompt: `Given an array of \`words\` and a width \`maxWidth\`, format the text so each line is exactly \`maxWidth\` characters and **fully (left and right) justified**.

Pack as many words onto each line as fit, separated by at least one space. Distribute the extra spaces as evenly as possible between words; if they don't divide evenly, the **left** gaps take the larger counts. A line with a single word, and the **last** line, are **left-justified** — words separated by a single space and the line padded with trailing spaces to \`maxWidth\`.`,
  constraints: [
    "1 <= words.length <= 300",
    "1 <= words[i].length <= 20",
    "words[i] consists of only English letters and symbols.",
    "1 <= maxWidth <= 100",
    "words[i].length <= maxWidth",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[]} words
 * @param {number} maxWidth
 * @return {string[]}
 */
function fullJustify(words, maxWidth) {
  // your code here
}`,
    typescript: `/**
 * @param {string[]} words
 * @param {number} maxWidth
 * @return {string[]}
 */
function fullJustify(words: string[], maxWidth: number): string[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "classic",
      args: [["This", "is", "an", "example", "of", "text", "justification."], 16],
      expected: ["This    is    an", "example  of text", "justification.  "],
      explanation: "The first two lines spread spaces; the last line is left-justified.",
    },
    {
      name: "single-word line",
      args: [["What", "must", "be", "acknowledgment", "shall", "be"], 16],
      expected: ["What   must   be", "acknowledgment  ", "shall be        "],
      explanation: `"acknowledgment" alone is left-justified with trailing spaces.`,
    },
    {
      name: "uneven spread",
      args: [["Science", "is", "what", "we", "understand", "well", "enough", "to", "explain", "to", "a", "computer."], 20],
      expected: ["Science  is  what we", "understand      well", "enough to explain to", "a computer.         "],
    },
  ],
  hiddenTests: [
    { args: [["a"], 1], expected: ["a"] },
    { args: [["a"], 5], expected: ["a    "] },
    { args: [["a", "b", "c"], 3], expected: ["a b", "c  "] },
    { args: [["a", "b", "c", "d"], 5], expected: ["a b c", "d    "] },
    { args: [["word"], 10], expected: ["word      "] },
    { args: [["Listen", "to", "many,", "speak", "to", "a", "few."], 6], expected: ["Listen", "to    ", "many, ", "speak ", "to   a", "few.  "] },
    { args: [["ask", "not", "what", "your", "country"], 7], expected: ["ask not", "what   ", "your   ", "country"] },
    { args: [["here", "we", "go"], 10], expected: ["here we go"] },
    { args: [["aaa", "bb", "cc"], 7], expected: ["aaa  bb", "cc     "] },
    { args: [["x", "y", "z", "w"], 1], expected: ["x", "y", "z", "w"] },
    { args: [["The", "quick", "brown", "fox"], 11], expected: ["The   quick", "brown fox  "] },
    { args: [["Tempor", "fugiat", "occaecat", "ut"], 10], expected: ["Tempor    ", "fugiat    ", "occaecat  ", "ut        "] },
    { args: [["one", "two", "three", "four", "five", "six"], 9], expected: ["one   two", "three    ", "four five", "six      "] },
    // Scale: 120 two-letter words at width 50. Each full line packs exactly 17 words
    // (17*2 + 16 = 50) with single spaces; the 120th word is the left-justified last line.
    { args: [new Array(120).fill("ab"), 50], expected: [
      ...new Array(7).fill(new Array(17).fill("ab").join(" ")),
      "ab" + " ".repeat(48),
    ] },
  ],
  source: { origin: "leetcode", frontendId: "68", acRate: 0.5113965981907789, confidence: 0.9 },
  solutions: [
    {
      name: "Greedy line packing",
      explanation: `Greedily collect words into a line while the running length (current letters + one space per gap + the next word) stays within \`maxWidth\`. Once a line is full:

- If it's the **last** line or holds a **single word**, join with single spaces and pad the right to \`maxWidth\`.
- Otherwise distribute \`maxWidth - totalLetters\` spaces across the \`gaps = count - 1\` slots: each gap gets \`floor(spaces / gaps)\`, and the first \`spaces % gaps\` gaps get one extra, so the leftmost gaps are widest.

\`O(total characters)\` time.`,
      code: {
        javascript: `function fullJustify(words, maxWidth) {
  const result = [];
  let i = 0;
  while (i < words.length) {
    let j = i;
    let lineLen = 0;
    while (j < words.length && lineLen + words[j].length + (j - i) <= maxWidth) {
      lineLen += words[j].length;
      j++;
    }
    const count = j - i;
    const isLast = j === words.length;
    if (count === 1 || isLast) {
      let line = words.slice(i, j).join(" ");
      result.push(line.padEnd(maxWidth));
    } else {
      const gaps = count - 1;
      const totalSpaces = maxWidth - lineLen;
      const base = Math.floor(totalSpaces / gaps);
      const extra = totalSpaces % gaps;
      let line = "";
      for (let k = 0; k < count; k++) {
        line += words[i + k];
        if (k < gaps) line += " ".repeat(base + (k < extra ? 1 : 0));
      }
      result.push(line);
    }
    i = j;
  }
  return result;
}`,
        typescript: `function fullJustify(words: string[], maxWidth: number): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < words.length) {
    let j = i;
    let lineLen = 0;
    while (j < words.length && lineLen + words[j].length + (j - i) <= maxWidth) {
      lineLen += words[j].length;
      j++;
    }
    const count = j - i;
    const isLast = j === words.length;
    if (count === 1 || isLast) {
      const line = words.slice(i, j).join(" ");
      result.push(line.padEnd(maxWidth));
    } else {
      const gaps = count - 1;
      const totalSpaces = maxWidth - lineLen;
      const base = Math.floor(totalSpaces / gaps);
      const extra = totalSpaces % gaps;
      let line = "";
      for (let k = 0; k < count; k++) {
        line += words[i + k];
        if (k < gaps) line += " ".repeat(base + (k < extra ? 1 : 0));
      }
      result.push(line);
    }
    i = j;
  }
  return result;
}`,
      },
    },
  ],
});
