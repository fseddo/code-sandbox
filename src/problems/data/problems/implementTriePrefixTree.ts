import { defineAlgoProblem } from "../problem";

export const implementTriePrefixTree = defineAlgoProblem<[string[], string[][]], (boolean | null)[]>({
  id: "implement-trie-prefix-tree",
  number: 141,
  title: "Implement Trie (Prefix Tree)",
  difficulty: "medium",
  tags: ["trie", "hash-table", "string", "design"],
  functionName: "runTrieOps",
  prompt: `Design a **trie** (also called a *prefix tree*) — a structure that stores strings character by character so that lookups and prefix queries run in time proportional to the length of the key, not the number of keys stored.

The structure supports three operations:

- \`"insert"\` — add the word \`word\` to the trie. Returns \`null\`.
- \`"search"\` — return \`true\` if the exact \`word\` was previously inserted, otherwise \`false\`.
- \`"startsWith"\` — return \`true\` if any previously inserted word begins with \`prefix\`, otherwise \`false\`.

You are given the operations as two parallel arrays: \`operations[i]\` is the operation name and \`values[i]\` is its argument list (\`[word]\` for \`"insert"\`/\`"search"\`, \`[prefix]\` for \`"startsWith"\`). Apply them in order and return an array holding each operation's return value (\`null\` for every \`"insert"\`, a boolean for \`"search"\` and \`"startsWith"\`).

For example \`["insert","search","search","startsWith","insert","search"]\` with \`[["apple"],["apple"],["app"],["app"],["app"],["app"]]\` returns \`[null, true, false, true, null, true]\`. After inserting \`"apple"\`: \`search("apple")\` is \`true\`; \`search("app")\` is \`false\` because \`"app"\` was never inserted as a complete word; \`startsWith("app")\` is \`true\` because \`"apple"\` begins with \`"app"\`; then \`"app"\` is inserted, so \`search("app")\` becomes \`true\`.`,
  constraints: [
    "1 <= operations.length <= 3 * 10^4",
    "operations[i] is one of \"insert\", \"search\", \"startsWith\".",
    "1 <= word.length, prefix.length <= 2000",
    "word and prefix consist of lowercase English letters only.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[]} operations
 * @param {string[][]} values
 * @return {(boolean | null)[]}
 */
function runTrieOps(operations, values) {
  // your code here
}`,
    typescript: `/**
 * @param {string[]} operations
 * @param {string[][]} values
 * @return {(boolean | null)[]}
 */
function runTrieOps(operations: string[], values: string[][]): (boolean | null)[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "insert, prefix vs full word",
      args: [
        ["insert", "search", "search", "startsWith", "insert", "search"],
        [["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]],
      ],
      expected: [null, true, false, true, null, true],
      explanation:
        "search(\"app\") is false until \"app\" is inserted as a full word, but startsWith(\"app\") is true the moment \"apple\" exists.",
    },
    {
      name: "misses on an empty / unmatched trie",
      args: [
        ["startsWith", "insert", "search", "startsWith"],
        [["a"], ["dog"], ["do"], ["cat"]],
      ],
      expected: [false, null, false, false],
      explanation:
        "startsWith(\"a\") is false on an empty trie; search(\"do\") is false (only \"dog\" was inserted); startsWith(\"cat\") is false (no word starts with it).",
    },
  ],
  hiddenTests: [
    // Single insert then exact search.
    { args: [["insert", "search"], [["a"], ["a"]]], expected: [null, true] },
    // Search for a never-inserted word.
    { args: [["insert", "search"], [["abc"], ["abd"]]], expected: [null, false] },
    // Prefix matches but full word was never inserted.
    { args: [["insert", "search", "startsWith"], [["hello"], ["hell"], ["hell"]]], expected: [null, false, true] },
    // Queries before any insert — empty trie returns false.
    { args: [["search", "startsWith"], [["x"], ["x"]]], expected: [false, false] },
    // Words that are prefixes of each other.
    {
      args: [
        ["insert", "insert", "insert", "search", "search", "search", "startsWith"],
        [["a"], ["ab"], ["abc"], ["a"], ["ab"], ["abc"], ["abc"]],
      ],
      expected: [null, null, null, true, true, true, true],
    },
    // A longer query than any stored word — walk runs off the end of the trie.
    { args: [["insert", "search", "startsWith"], [["ab"], ["abc"], ["abc"]]], expected: [null, false, false] },
    // Re-inserting the same word is idempotent.
    { args: [["insert", "insert", "search"], [["cat"], ["cat"], ["cat"]]], expected: [null, null, true] },
    // Branching: two words sharing a prefix, each searchable independently.
    {
      args: [
        ["insert", "insert", "search", "search", "search", "startsWith"],
        [["car"], ["card"], ["car"], ["card"], ["care"], ["car"]],
      ],
      expected: [null, null, true, true, false, true],
    },
    // startsWith on the exact inserted word is true (a word is a prefix of itself).
    { args: [["insert", "startsWith"], [["test"], ["test"]]], expected: [null, true] },
    // Prefix longer-then-shorter interplay.
    {
      args: [
        ["insert", "startsWith", "search", "insert", "search"],
        [["application"], ["app"], ["app"], ["app"], ["app"]],
      ],
      expected: [null, true, false, null, true],
    },
    // Disjoint words, repeated misses.
    {
      args: [
        ["insert", "insert", "search", "search", "startsWith", "startsWith"],
        [["sun"], ["moon"], ["star"], ["sun"], ["mo"], ["su"]],
      ],
      expected: [null, null, false, true, true, true],
    },
    // All 26 single letters inserted, then a spread of hits and misses.
    {
      args: (() => {
        const ops: string[] = [];
        const vals: string[][] = [];
        for (let c = 0; c < 26; c++) {
          ops.push("insert");
          vals.push([String.fromCharCode(97 + c)]);
        }
        ops.push("search");
        vals.push(["m"]);
        ops.push("search");
        vals.push(["mm"]);
        ops.push("startsWith");
        vals.push(["z"]);
        return [ops, vals] as [string[], string[][]];
      })(),
      expected: (() => {
        const out: (boolean | null)[] = [];
        for (let c = 0; c < 26; c++) out.push(null);
        out.push(true); // "m" was inserted
        out.push(false); // "mm" was not
        out.push(true); // "z" was inserted, so it's a prefix of itself
        return out;
      })(),
    },
    // Scale: insert a few hundred distinct words, then query a known hit, a known miss, and a prefix.
    {
      args: (() => {
        const ops: string[] = [];
        const vals: string[][] = [];
        for (let i = 0; i < 500; i++) {
          ops.push("insert");
          vals.push(["word" + i]);
        }
        ops.push("search");
        vals.push(["word250"]);
        ops.push("search");
        vals.push(["word500"]);
        ops.push("startsWith");
        vals.push(["word"]);
        ops.push("startsWith");
        vals.push(["xyz"]);
        return [ops, vals] as [string[], string[][]];
      })(),
      expected: (() => {
        const out: (boolean | null)[] = [];
        for (let i = 0; i < 500; i++) out.push(null);
        out.push(true); // word250 inserted
        out.push(false); // word500 not inserted (0..499)
        out.push(true); // every word starts with "word"
        out.push(false); // nothing starts with "xyz"
        return out;
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "208", confidence: 0.95 },
  solutions: [
    {
      name: "Trie with a children map and end-of-word flag",
      explanation: `Each trie node holds a map from a character to a child node, plus an \`isEnd\` flag marking whether a complete word terminates there. The root represents the empty prefix.

To **insert** a word, walk from the root one character at a time, creating any missing child, and mark the final node's \`isEnd\`. To **search** for an exact word, walk the same path; the word is present only if every character had a child *and* the final node is flagged as a word end. **startsWith** is the same walk but without the end check — reaching the end of the prefix is enough.

Every operation does \`O(L)\` work for a key of length \`L\`, independent of how many words are stored. We replay the operations in order, pushing \`null\` for each \`insert\` and the boolean result for each query.`,
      code: {
        javascript: `function runTrieOps(operations, values) {
  // A trie node: children keyed by character, plus a flag for "a word ends here".
  const makeNode = () => ({ children: new Map(), isEnd: false });
  const root = makeNode();

  const insert = (word) => {
    let node = root;
    for (const ch of word) {
      // Descend, creating the child path on the fly.
      if (!node.children.has(ch)) node.children.set(ch, makeNode());
      node = node.children.get(ch);
    }
    node.isEnd = true; // the last node closes a complete word
  };

  // Walk the path for \`str\`; return the node it ends on, or null if it falls off the trie.
  const walk = (str) => {
    let node = root;
    for (const ch of str) {
      if (!node.children.has(ch)) return null;
      node = node.children.get(ch);
    }
    return node;
  };

  // An exact word needs the full path AND an end flag at the last node.
  const search = (word) => {
    const node = walk(word);
    return node !== null && node.isEnd;
  };

  // A prefix only needs the full path to exist.
  const startsWith = (prefix) => walk(prefix) !== null;

  const result = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const arg = values[i][0];
    if (op === "insert") {
      insert(arg);
      result.push(null);
    } else if (op === "search") {
      result.push(search(arg));
    } else {
      result.push(startsWith(arg));
    }
  }
  return result;
}`,
        typescript: `type TrieNode = { children: Map<string, TrieNode>; isEnd: boolean };

function runTrieOps(operations: string[], values: string[][]): (boolean | null)[] {
  // A trie node: children keyed by character, plus a flag for "a word ends here".
  const makeNode = (): TrieNode => ({ children: new Map(), isEnd: false });
  const root = makeNode();

  const insert = (word: string): void => {
    let node = root;
    for (const ch of word) {
      // Descend, creating the child path on the fly.
      if (!node.children.has(ch)) node.children.set(ch, makeNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true; // the last node closes a complete word
  };

  // Walk the path for \`str\`; return the node it ends on, or null if it falls off the trie.
  const walk = (str: string): TrieNode | null => {
    let node = root;
    for (const ch of str) {
      if (!node.children.has(ch)) return null;
      node = node.children.get(ch)!;
    }
    return node;
  };

  // An exact word needs the full path AND an end flag at the last node.
  const search = (word: string): boolean => {
    const node = walk(word);
    return node !== null && node.isEnd;
  };

  // A prefix only needs the full path to exist.
  const startsWith = (prefix: string): boolean => walk(prefix) !== null;

  const result: (boolean | null)[] = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const arg = values[i][0];
    if (op === "insert") {
      insert(arg);
      result.push(null);
    } else if (op === "search") {
      result.push(search(arg));
    } else {
      result.push(startsWith(arg));
    }
  }
  return result;
}`,
      },
    },
  ],
});
