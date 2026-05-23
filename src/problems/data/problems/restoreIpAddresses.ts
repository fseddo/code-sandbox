import { defineAlgoProblem } from "../problem";

// Multiple valid addresses can be returned in any order, so the checker sorts both sides and
// compares as sets. `expected` is the canonical set; order in the solution's output doesn't matter.
export const restoreIpAddresses = defineAlgoProblem<[string], string[]>({
  id: "restore-ip-addresses",
  number: 99,
  title: "Restore IP Addresses",
  difficulty: "medium",
  tags: ["string", "backtracking"],
  functionName: "restoreIpAddresses",
  prompt: `A valid IPv4 address is four integers in \`0..255\` joined by dots, where no part has a leading zero (so \`"0"\` is valid but \`"01"\` and \`"00"\` are not).

Given a string \`s\` of only digits, return **every** valid IP address that can be formed by inserting three dots into \`s\` without reordering or removing any digit. The addresses may be returned in any order.`,
  constraints: ["1 <= s.length <= 20", "s consists of digits only."],
  checker: `(actual, args, expected) => {
  if (!Array.isArray(actual) || actual.length !== expected.length) return false;
  const norm = (xs) => [...xs].sort();
  const a = norm(actual);
  const b = norm(expected);
  return a.every((v, i) => v === b[i]);
}`,
  starterCode: {
    javascript: `/**
 * @param {string} s
 * @return {string[]}
 */
function restoreIpAddresses(s) {
  // your code here
}`,
    typescript: `/**
 * @param {string} s
 * @return {string[]}
 */
function restoreIpAddresses(s: string): string[] {
  // your code here
}`,
  },
  examples: [
    { name: "two addresses", args: ["25525511135"], expected: ["255.255.11.135", "255.255.111.35"] },
    { name: "all zeros", args: ["0000"], expected: ["0.0.0.0"], explanation: "Each part must be a single 0 — no leading zeros allowed." },
    { name: "many splits", args: ["101023"], expected: ["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"] },
  ],
  hiddenTests: [
    { args: ["1111"], expected: ["1.1.1.1"] },
    { args: ["11"], expected: [] },
    { args: ["010010"], expected: ["0.10.0.10", "0.100.1.0"] },
    { args: ["123456789"], expected: ["123.45.67.89"] },
    { args: ["255255255255"], expected: ["255.255.255.255"] },
    { args: ["2552552552555"], expected: [] },
    { args: ["00000"], expected: [] },
    { args: ["0279245587303"], expected: [] },
    { args: ["12"], expected: [] },
    { args: ["1234"], expected: ["1.2.3.4"] },
    // Boundary: 256 is just over the per-part limit, so it can't be a part on its own.
    { args: ["25612"], expected: ["2.5.6.12", "2.5.61.2", "2.56.1.2", "25.6.1.2"] },
    // Anti-leading-zero: leading-zero parts must be rejected at every length.
    { args: ["0100"], expected: ["0.1.0.0"] },
    // Scale: 13 chars is the longest that can ever yield an address; all-ones max width.
    { args: ["1111111111111"], expected: [] },
  ],
  source: { origin: "leetcode", frontendId: "93", acRate: 0.5600920574284984, confidence: 0.93 },
  solutions: [
    {
      name: "Backtracking over four segments",
      explanation: `Try every length 1–3 for the next segment, accepting it only when it has no leading zero (unless it is exactly \`"0"\`) and its value is \`≤ 255\`. Recurse until four segments are chosen; if the whole string was consumed, join with dots. The branching factor is bounded (≤ 3 per segment, 4 segments), so the search is tiny.

\`O(1)\` effectively — the search tree is bounded regardless of input length.`,
      code: {
        javascript: `function restoreIpAddresses(s) {
  const res = [];
  const valid = (seg) => {
    if (seg.length === 0 || seg.length > 3) return false;
    if (seg.length > 1 && seg[0] === "0") return false;
    return Number(seg) <= 255;
  };
  const backtrack = (start, parts) => {
    if (parts.length === 4) {
      if (start === s.length) res.push(parts.join("."));
      return;
    }
    for (let len = 1; len <= 3 && start + len <= s.length; len++) {
      const seg = s.slice(start, start + len);
      if (valid(seg)) backtrack(start + len, [...parts, seg]);
    }
  };
  backtrack(0, []);
  return res;
}`,
        typescript: `function restoreIpAddresses(s: string): string[] {
  const res: string[] = [];
  const valid = (seg: string): boolean => {
    if (seg.length === 0 || seg.length > 3) return false;
    if (seg.length > 1 && seg[0] === "0") return false;
    return Number(seg) <= 255;
  };
  const backtrack = (start: number, parts: string[]): void => {
    if (parts.length === 4) {
      if (start === s.length) res.push(parts.join("."));
      return;
    }
    for (let len = 1; len <= 3 && start + len <= s.length; len++) {
      const seg = s.slice(start, start + len);
      if (valid(seg)) backtrack(start + len, [...parts, seg]);
    }
  };
  backtrack(0, []);
  return res;
}`,
      },
    },
  ],
});
