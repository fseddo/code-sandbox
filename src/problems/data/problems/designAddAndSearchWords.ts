import { defineAlgoProblem } from "../problem";

export const designAddAndSearchWords = defineAlgoProblem<[string[], string[][]], (boolean | null)[]>({
  id: "design-add-and-search-words-data-structure",
  number: 142,
  title: "Design Add and Search Words Data Structure",
  difficulty: "medium",
  tags: ["trie", "depth-first-search", "string", "design"],
  functionName: "runWordOps",
  prompt: `Design a structure that stores words and supports searching for a word, where a search pattern may contain the **wildcard** \`.\` that matches **any single letter**.

The structure supports two operations:

- \`"addWord"\` — add the word \`word\` to the structure. Returns \`null\`.
- \`"search"\` — return \`true\` if any stored word matches the pattern \`word\`, otherwise \`false\`. A literal letter must match that exact letter; a \`.\` matches **any one** letter. The pattern matches a stored word only if they are the **same length** and every position matches.

You are given the operations as two parallel arrays: \`operations[i]\` is the operation name and \`values[i]\` is its argument list (\`[word]\` for both operations). Apply them in order and return an array holding each operation's return value (\`null\` for every \`"addWord"\`, a boolean for each \`"search"\`).

For example \`["addWord","addWord","addWord","search","search","search","search"]\` with \`[["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]\` returns \`[null, null, null, false, true, true, true]\`. After adding \`"bad"\`, \`"dad"\`, \`"mad"\`: \`search("pad")\` is \`false\` (no stored word); \`search("bad")\` is \`true\`; \`search(".ad")\` is \`true\` (matches all three); \`search("b..")\` is \`true\` (matches \`"bad"\`).`,
  constraints: [
    "1 <= operations.length <= 10^4",
    "operations[i] is one of \"addWord\", \"search\".",
    "1 <= word.length <= 25",
    "word in addWord consists of lowercase English letters only.",
    "word in search consists of lowercase English letters and the character '.'.",
    "There are at most 3 dots in a search word.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[]} operations
 * @param {string[][]} values
 * @return {(boolean | null)[]}
 */
function runWordOps(operations, values) {
  // your code here
}`,
    typescript: `/**
 * @param {string[]} operations
 * @param {string[][]} values
 * @return {(boolean | null)[]}
 */
function runWordOps(operations: string[], values: string[][]): (boolean | null)[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "wildcards across stored words",
      args: [
        ["addWord", "addWord", "addWord", "search", "search", "search", "search"],
        [["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]],
      ],
      expected: [null, null, null, false, true, true, true],
      explanation:
        "search(\".ad\") matches bad/dad/mad; search(\"b..\") matches bad; search(\"pad\") matches nothing stored.",
    },
    {
      name: "length must match",
      args: [
        ["addWord", "search", "search", "search"],
        [["a"], ["a"], ["."], [".."]],
      ],
      expected: [null, true, true, false],
      explanation:
        "\".\" matches the single-letter \"a\"; \"..\" requires a length-2 word, and none was stored.",
    },
  ],
  hiddenTests: [
    // Search before any add — empty structure.
    { args: [["search"], [["a"]]], expected: [false] },
    // Single add, exact search.
    { args: [["addWord", "search"], [["cat"], ["cat"]]], expected: [null, true] },
    // All-wildcard pattern matches any stored word of that length.
    { args: [["addWord", "search"], [["dog"], ["..."]]], expected: [null, true] },
    // All-wildcard but wrong length.
    { args: [["addWord", "search"], [["dog"], [".."]]], expected: [null, false] },
    // Leading wildcard, multiple candidates.
    {
      args: [
        ["addWord", "addWord", "search", "search"],
        [["cat"], ["bat"], [".at"], [".og"]],
      ],
      expected: [null, null, true, false],
    },
    // Trailing wildcard.
    {
      args: [
        ["addWord", "addWord", "search"],
        [["car"], ["can"], ["ca."]],
      ],
      expected: [null, null, true],
    },
    // Multiple wildcards interspersed.
    {
      args: [
        ["addWord", "search", "search"],
        [["hello"], ["h.l.o"], ["h.l.x"]],
      ],
      expected: [null, true, false],
    },
    // Wildcard must still fail when no stored word fits the fixed letters.
    {
      args: [
        ["addWord", "addWord", "search"],
        [["aaa"], ["bbb"], ["a.b"]],
      ],
      expected: [null, null, false],
    },
    // Words of different lengths sharing a prefix; a search must respect length.
    {
      args: [
        ["addWord", "addWord", "search", "search"],
        [["go"], ["goal"], ["go.."], ["go"]],
      ],
      expected: [null, null, true, true],
    },
    // Duplicate adds are harmless.
    {
      args: [
        ["addWord", "addWord", "search"],
        [["x"], ["x"], ["."]],
      ],
      expected: [null, null, true],
    },
    // Branchy trie where a wildcard must try several children and only one path completes.
    {
      args: [
        ["addWord", "addWord", "addWord", "search", "search"],
        [["abc"], ["abd"], ["xyz"], ["ab."], [".b."]],
      ],
      expected: [null, null, null, true, true],
    },
    // A wildcard path that explores children but dead-ends before the end.
    {
      args: [
        ["addWord", "search"],
        [["abcd"], ["a.c"]],
      ],
      expected: [null, false],
    },
    // Scale: add a few hundred words, then wildcard and literal searches.
    {
      args: (() => {
        const ops: string[] = [];
        const vals: string[][] = [];
        const letters = "abcdefghij";
        for (let i = 0; i < 200; i++) {
          const w = letters[i % 10] + letters[(i * 3) % 10] + letters[(i * 7) % 10];
          ops.push("addWord");
          vals.push([w]);
        }
        ops.push("search");
        vals.push(["a.a"]);
        ops.push("search");
        vals.push(["zzz"]);
        ops.push("search");
        vals.push(["..."]);
        return [ops, vals] as [string[], string[][]];
      })(),
      expected: (() => {
        // Mirror the reference: a set of stored words, then pattern matching.
        const stored = new Set<string>();
        const letters = "abcdefghij";
        const out: (boolean | null)[] = [];
        for (let i = 0; i < 200; i++) {
          const w = letters[i % 10] + letters[(i * 3) % 10] + letters[(i * 7) % 10];
          stored.add(w);
          out.push(null);
        }
        const matches = (pattern: string): boolean => {
          for (const w of stored) {
            if (w.length !== pattern.length) continue;
            let ok = true;
            for (let k = 0; k < w.length; k++) {
              if (pattern[k] !== "." && pattern[k] !== w[k]) {
                ok = false;
                break;
              }
            }
            if (ok) return true;
          }
          return false;
        };
        out.push(matches("a.a"));
        out.push(matches("zzz"));
        out.push(matches("..."));
        return out;
      })(),
    },
  ],
  source: { origin: "leetcode", frontendId: "211", confidence: 0.9 },
  solutions: [
    {
      name: "Trie with wildcard-aware DFS",
      explanation: `Store words in a **trie** — each node has a children map (character → node) and an \`isEnd\` flag. \`addWord\` walks/creates the path and marks the final node, exactly like a plain trie.

\`search\` is where the wildcard lives. Walk the pattern character by character: a **literal** letter follows the one matching child if it exists. A **\`.\`** could match any letter, so it branches — recurse into *every* child and succeed if any branch matches the rest of the pattern. The match succeeds only when the pattern is fully consumed *and* the node we land on has \`isEnd\` set (so the pattern matched a complete word, not just a prefix).

\`addWord\` is \`O(L)\`. A literal search is \`O(L)\`; a search with \`d\` wildcards can fan out to \`O(26^d · L)\` in the worst case, but the constraint caps the wildcards so it stays cheap. We replay the operations, pushing \`null\` for each add and the boolean for each search.`,
      code: {
        javascript: `function runWordOps(operations, values) {
  // Trie node: children keyed by character, plus a flag marking a complete word.
  const makeNode = () => ({ children: new Map(), isEnd: false });
  const root = makeNode();

  const addWord = (word) => {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, makeNode());
      node = node.children.get(ch);
    }
    node.isEnd = true; // last node closes the word
  };

  // Match \`word[i..]\` against the subtree rooted at \`node\`.
  const dfs = (word, i, node) => {
    if (i === word.length) return node.isEnd; // pattern consumed → must be a word end
    const ch = word[i];
    if (ch === ".") {
      // Wildcard: any child could work, so try them all.
      for (const child of node.children.values()) {
        if (dfs(word, i + 1, child)) return true;
      }
      return false;
    }
    // Literal: only the matching child can continue the match.
    const child = node.children.get(ch);
    return child !== undefined && dfs(word, i + 1, child);
  };

  const result = [];
  for (let i = 0; i < operations.length; i++) {
    const arg = values[i][0];
    if (operations[i] === "addWord") {
      addWord(arg);
      result.push(null);
    } else {
      result.push(dfs(arg, 0, root));
    }
  }
  return result;
}`,
        typescript: `type TrieNode = { children: Map<string, TrieNode>; isEnd: boolean };

function runWordOps(operations: string[], values: string[][]): (boolean | null)[] {
  // Trie node: children keyed by character, plus a flag marking a complete word.
  const makeNode = (): TrieNode => ({ children: new Map(), isEnd: false });
  const root = makeNode();

  const addWord = (word: string): void => {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, makeNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true; // last node closes the word
  };

  // Match \`word[i..]\` against the subtree rooted at \`node\`.
  const dfs = (word: string, i: number, node: TrieNode): boolean => {
    if (i === word.length) return node.isEnd; // pattern consumed → must be a word end
    const ch = word[i];
    if (ch === ".") {
      // Wildcard: any child could work, so try them all.
      for (const child of node.children.values()) {
        if (dfs(word, i + 1, child)) return true;
      }
      return false;
    }
    // Literal: only the matching child can continue the match.
    const child = node.children.get(ch);
    return child !== undefined && dfs(word, i + 1, child);
  };

  const result: (boolean | null)[] = [];
  for (let i = 0; i < operations.length; i++) {
    const arg = values[i][0];
    if (operations[i] === "addWord") {
      addWord(arg);
      result.push(null);
    } else {
      result.push(dfs(arg, 0, root));
    }
  }
  return result;
}`,
      },
    },
  ],
});
