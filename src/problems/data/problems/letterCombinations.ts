import { defineAlgoProblem } from "../problem";

// Order of the returned combinations is unspecified, so deep-equal on one fixed ordering would
// wrongly fail a correct solution. The checker sorts both sides before comparing.
export const letterCombinations = defineAlgoProblem<[string], string[]>({
  id: "letter-combinations-of-a-phone-number",
  number: 27,
  title: "Letter Combinations of a Phone Number",
  difficulty: "medium",
  tags: ["hash-table", "string", "backtracking"],
  functionName: "letterCombinations",
  prompt: `Given a string \`digits\` containing digits from \`2\` to \`9\`, return every letter combination the number could spell. The combinations may be returned in any order.

The digit-to-letter mapping is the one on a telephone keypad: \`2\` → \`abc\`, \`3\` → \`def\`, \`4\` → \`ghi\`, \`5\` → \`jkl\`, \`6\` → \`mno\`, \`7\` → \`pqrs\`, \`8\` → \`tuv\`, \`9\` → \`wxyz\`. Note that \`1\` maps to no letters and never appears in the input.

If \`digits\` is the empty string, return an empty array.`,
  constraints: [
    "0 <= digits.length <= 4",
    "digits[i] is a digit in the range '2' to '9'.",
  ],
  checker: `(actual, args, expected) => {
  if (!Array.isArray(actual) || actual.length !== expected.length) return false;
  const a = [...actual].sort();
  const b = [...expected].sort();
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}`,
  starterCode: {
    javascript: `/**
 * @param {string} digits
 * @return {string[]}
 */
function letterCombinations(digits) {
  // your code here
}`,
    typescript: `/**
 * @param {string} digits
 * @return {string[]}
 */
function letterCombinations(digits: string): string[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "two digits",
      args: ["23"],
      expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"],
      explanation: `2 → "abc" and 3 → "def"; every pairing of one letter from each gives 3 × 3 = 9 combinations.`,
    },
    {
      name: "empty input",
      args: [""],
      expected: [],
      explanation: `No digits means no combinations.`,
    },
    {
      name: "single digit",
      args: ["2"],
      expected: ["a", "b", "c"],
      explanation: `One digit returns its own letters as single-character strings.`,
    },
  ],
  hiddenTests: [
    // Boundary: empty, single digit (smallest and largest letter sets).
    { args: [""], expected: [] },
    { args: ["7"], expected: ["p", "q", "r", "s"] },
    { args: ["9"], expected: ["w", "x", "y", "z"] },
    { args: ["6"], expected: ["m", "n", "o"] },
    // Structural: two four-letter digits, mix of 3- and 4-letter digits.
    {
      args: ["79"],
      expected: [
        "pw", "px", "py", "pz", "qw", "qx", "qy", "qz",
        "rw", "rx", "ry", "rz", "sw", "sx", "sy", "sz",
      ],
    },
    {
      args: ["27"],
      expected: ["ap", "aq", "ar", "as", "bp", "bq", "br", "bs", "cp", "cq", "cr", "cs"],
    },
    // Edge: repeated digit (all-same), so combinations reuse the same letter set.
    {
      args: ["22"],
      expected: ["aa", "ab", "ac", "ba", "bb", "bc", "ca", "cb", "cc"],
    },
    // Anti-hardcode: three digits, none of which appear in the visible examples.
    {
      args: ["456"],
      expected: [
        "gjm", "gjn", "gjo", "gkm", "gkn", "gko", "glm", "gln", "glo",
        "hjm", "hjn", "hjo", "hkm", "hkn", "hko", "hlm", "hln", "hlo",
        "ijm", "ijn", "ijo", "ikm", "ikn", "iko", "ilm", "iln", "ilo",
      ],
    },
    // Scale: four digits with two 4-letter sets → 4 × 4 × 3 × 4 = 192 combinations.
    {
      args: ["7239"],
      expected: [
        "padw", "padx", "pady", "padz", "paew", "paex", "paey", "paez", "pafw", "pafx", "pafy", "pafz",
        "pbdw", "pbdx", "pbdy", "pbdz", "pbew", "pbex", "pbey", "pbez", "pbfw", "pbfx", "pbfy", "pbfz",
        "pcdw", "pcdx", "pcdy", "pcdz", "pcew", "pcex", "pcey", "pcez", "pcfw", "pcfx", "pcfy", "pcfz",
        "qadw", "qadx", "qady", "qadz", "qaew", "qaex", "qaey", "qaez", "qafw", "qafx", "qafy", "qafz",
        "qbdw", "qbdx", "qbdy", "qbdz", "qbew", "qbex", "qbey", "qbez", "qbfw", "qbfx", "qbfy", "qbfz",
        "qcdw", "qcdx", "qcdy", "qcdz", "qcew", "qcex", "qcey", "qcez", "qcfw", "qcfx", "qcfy", "qcfz",
        "radw", "radx", "rady", "radz", "raew", "raex", "raey", "raez", "rafw", "rafx", "rafy", "rafz",
        "rbdw", "rbdx", "rbdy", "rbdz", "rbew", "rbex", "rbey", "rbez", "rbfw", "rbfx", "rbfy", "rbfz",
        "rcdw", "rcdx", "rcdy", "rcdz", "rcew", "rcex", "rcey", "rcez", "rcfw", "rcfx", "rcfy", "rcfz",
        "sadw", "sadx", "sady", "sadz", "saew", "saex", "saey", "saez", "safw", "safx", "safy", "safz",
        "sbdw", "sbdx", "sbdy", "sbdz", "sbew", "sbex", "sbey", "sbez", "sbfw", "sbfx", "sbfy", "sbfz",
        "scdw", "scdx", "scdy", "scdz", "scew", "scex", "scey", "scez", "scfw", "scfx", "scfy", "scfz",
      ],
    },
    // Scale: four 3-letter digits → 3^4 = 81 combinations.
    {
      args: ["2345"],
      expected: [
        "adgj", "adgk", "adgl", "adhj", "adhk", "adhl", "adij", "adik", "adil",
        "aegj", "aegk", "aegl", "aehj", "aehk", "aehl", "aeij", "aeik", "aeil",
        "afgj", "afgk", "afgl", "afhj", "afhk", "afhl", "afij", "afik", "afil",
        "bdgj", "bdgk", "bdgl", "bdhj", "bdhk", "bdhl", "bdij", "bdik", "bdil",
        "begj", "begk", "begl", "behj", "behk", "behl", "beij", "beik", "beil",
        "bfgj", "bfgk", "bfgl", "bfhj", "bfhk", "bfhl", "bfij", "bfik", "bfil",
        "cdgj", "cdgk", "cdgl", "cdhj", "cdhk", "cdhl", "cdij", "cdik", "cdil",
        "cegj", "cegk", "cegl", "cehj", "cehk", "cehl", "ceij", "ceik", "ceil",
        "cfgj", "cfgk", "cfgl", "cfhj", "cfhk", "cfhl", "cfij", "cfik", "cfil",
      ],
    },
    // Edge: leading 4-letter digit then a 3-letter digit (order matters in each combination).
    {
      args: ["92"],
      expected: ["wa", "wb", "wc", "xa", "xb", "xc", "ya", "yb", "yc", "za", "zb", "zc"],
    },
  ],
  source: { origin: "leetcode", frontendId: "17", acRate: 0.6605623802581397, confidence: 0.95 },
  solutions: [
    {
      name: "Backtracking",
      explanation: `Walk the digits left to right, building one combination character by character. At digit index \`i\`, try each letter that digit maps to, append it, recurse to \`i + 1\`, then drop it. When the path length equals \`digits.length\` it's a complete combination — record it. The empty input is handled up front by returning \`[]\`.

If \`n\` is the number of digits, there are up to \`4^n\` combinations and each takes \`O(n)\` to assemble, so \`O(n · 4^n)\` time and \`O(n)\` recursion depth.`,
      code: {
        javascript: `function letterCombinations(digits) {
  if (digits.length === 0) return [];
  const map = {
    "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
    "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
  };
  const result = [];
  const backtrack = (index, path) => {
    if (index === digits.length) {
      result.push(path);
      return;
    }
    for (const letter of map[digits[index]]) {
      backtrack(index + 1, path + letter);
    }
  };
  backtrack(0, "");
  return result;
}`,
        typescript: `function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];
  const map: Record<string, string> = {
    "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
    "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
  };
  const result: string[] = [];
  const backtrack = (index: number, path: string): void => {
    if (index === digits.length) {
      result.push(path);
      return;
    }
    for (const letter of map[digits[index]]) {
      backtrack(index + 1, path + letter);
    }
  };
  backtrack(0, "");
  return result;
}`,
      },
    },
  ],
});
