import { defineAlgoProblem } from "../problem";

// Group order and within-group order are both unconstrained, so deep-equal on one fixed answer
// would wrongly fail a correct solution. `checker` canonicalizes both sides — sort each group's
// strings, then sort the groups — and compares. `expected` is one valid grouping.
export const groupAnagrams = defineAlgoProblem<[string[]], string[][]>({
  id: "group-anagrams",
  number: 14,
  title: "Group Anagrams",
  difficulty: "medium",
  tags: ["array", "hash-table", "string", "sorting"],
  functionName: "groupAnagrams",
  prompt: `Given an array of strings \`strs\`, group the anagrams together. Two strings are anagrams when one is a rearrangement of the other's letters.

Return a list of groups. The groups, and the strings within each group, may be returned in **any order** — the judge accepts any valid grouping.`,
  constraints: [
    "1 <= strs.length <= 10^4",
    "0 <= strs[i].length <= 100",
    "strs[i] consists of lowercase English letters.",
  ],
  checker: `(actual, args, expected) => {
  if (!Array.isArray(actual)) return false;
  const canon = (groups) =>
    JSON.stringify(
      groups
        .map((group) => [...group].sort())
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    );
  return canon(actual) === canon(expected);
}`,
  starterCode: {
    javascript: `function groupAnagrams(strs) {
  // your code here
}`,
    typescript: `function groupAnagrams(strs: string[]): string[][] {
  // your code here
}`,
  },
  examples: [
    {
      name: "basic",
      args: [["eat", "tea", "tan", "ate", "nat", "bat"]],
      expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
      explanation: "eat/tea/ate share the letters a,e,t; tan/nat share a,n,t; bat is alone.",
    },
    {
      name: "empty string",
      args: [[""]],
      expected: [[""]],
    },
    {
      name: "single",
      args: [["a"]],
      expected: [["a"]],
    },
  ],
  hiddenTests: [
    { args: [["", ""]], expected: [["", ""]] },
    { args: [["abc", "bca", "cab"]], expected: [["abc", "bca", "cab"]] },
    { args: [["abc", "def", "ghi"]], expected: [["abc"], ["def"], ["ghi"]] },
    { args: [["a", "a", "a"]], expected: [["a", "a", "a"]] },
    { args: [["ab", "ba", "abc", "cba"]], expected: [["ab", "ba"], ["abc", "cba"]] },
    { args: [["listen", "silent", "enlist"]], expected: [["listen", "silent", "enlist"]] },
    { args: [["x"]], expected: [["x"]] },
    { args: [["aab", "aba", "baa", "abb"]], expected: [["aab", "aba", "baa"], ["abb"]] },
    {
      name: "no two alike",
      args: [["q", "w", "e", "r", "t", "y"]],
      expected: [["q"], ["w"], ["e"], ["r"], ["t"], ["y"]],
    },
    {
      name: "scale - one giant group",
      args: [Array.from({ length: 3000 }, () => "abcde")],
      expected: [Array.from({ length: 3000 }, () => "abcde")],
    },
    {
      name: "scale - all distinct (strictly increasing lengths)",
      args: [Array.from({ length: 1500 }, (_, i) => "a".repeat(i + 1))],
      expected: Array.from({ length: 1500 }, (_, i) => ["a".repeat(i + 1)]),
    },
  ],
  source: { origin: "leetcode", frontendId: "49", acRate: 0.7260668539112993, confidence: 0.9 },
  solutions: [
    {
      name: "Sorted-string key",
      explanation: `Use a hash map keyed by each word's letters sorted into a canonical string — anagrams collapse to the same key. Bucket each word under its key, then return the buckets.

\`O(n · k log k)\` time for \`n\` words of max length \`k\` (the per-word sort), \`O(n · k)\` space.`,
      code: {
        javascript: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const word of strs) {
    const key = [...word].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}`,
        typescript: `function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const word of strs) {
    const key = [...word].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(word);
  }
  return [...groups.values()];
}`,
      },
    },
  ],
});
