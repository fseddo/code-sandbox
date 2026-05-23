import { defineAlgoProblem } from "../problem";

export const simplifyPath = defineAlgoProblem<[string], string>({
  id: "simplify-path",
  number: 78,
  title: "Simplify Path",
  difficulty: "medium",
  tags: ["string", "stack"],
  functionName: "simplifyPath",
  prompt: `Given an absolute Unix-style file path \`path\`, return its **canonical** form.

Apply these rules:
- A single period \`.\` refers to the current directory and is dropped.
- A double period \`..\` moves up one directory; at the root it has no effect.
- Multiple consecutive slashes count as a single slash.
- Any other token is a directory or file name.

The canonical path starts with a single \`/\`, joins remaining names with single slashes, and has no trailing slash (except the root \`/\` itself).`,
  constraints: [
    "1 <= path.length <= 3000",
    "path consists of English letters, digits, '.', '/', and '_'.",
    "path is a valid absolute Unix path beginning with '/'.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string} path
 * @return {string}
 */
function simplifyPath(path) {
  // your code here
}`,
    typescript: `/**
 * @param {string} path
 * @return {string}
 */
function simplifyPath(path: string): string {
  // your code here
}`,
  },
  examples: [
    { name: "trailing slash", args: ["/home/"], expected: "/home", explanation: "The trailing slash is removed." },
    { name: "parent directory", args: ["/home/../usr//bin/"], expected: "/usr/bin", explanation: ".. pops home; the empty token from // is ignored." },
    { name: "above root", args: ["/../"], expected: "/", explanation: ".. at the root stays at the root." },
    { name: "dots in names", args: ["/a/./b/../../c/"], expected: "/c" },
  ],
  hiddenTests: [
    { args: ["/"], expected: "/" },
    { args: ["/..."], expected: "/..." },
    { args: ["/a//b////c/d//././/.."], expected: "/a/b/c" },
    { args: ["/home//foo/"], expected: "/home/foo" },
    { args: ["/../../../"], expected: "/" },
    { args: ["/a/../../b/../c//.//"], expected: "/c" },
    { args: ["/."], expected: "/" },
    { args: ["/abc/.."], expected: "/" },
    { args: ["/x/y/z"], expected: "/x/y/z" },
    { args: ["/...."], expected: "/...." },
    { args: ["//"], expected: "/" },
    { args: ["/.hidden/file"], expected: "/.hidden/file" },
    { args: ["/a_b/c_d/"], expected: "/a_b/c_d" },
    {
      args: ["/" + Array.from({ length: 500 }, (_, i) => `dir${i}`).join("/") + "/" + "../".repeat(250)],
      expected: "/" + Array.from({ length: 250 }, (_, i) => `dir${i}`).join("/"),
    },
  ],
  source: { origin: "leetcode", frontendId: "71", acRate: 0.5058922645094241, confidence: 0.95 },
  solutions: [
    {
      name: "Stack of names",
      explanation: `Split on \`/\` and walk the tokens, maintaining a stack of directory names. Ignore empty tokens and \`.\`; for \`..\` pop the stack if non-empty; otherwise push the name. Join the stack with \`/\` under a leading slash.

\`O(n)\` time, \`O(n)\` space.`,
      code: {
        javascript: `function simplifyPath(path) {
  const stack = [];
  for (const token of path.split("/")) {
    if (token === "" || token === ".") continue;
    if (token === "..") {
      if (stack.length) stack.pop();
    } else {
      stack.push(token);
    }
  }
  return "/" + stack.join("/");
}`,
        typescript: `function simplifyPath(path: string): string {
  const stack: string[] = [];
  for (const token of path.split("/")) {
    if (token === "" || token === ".") continue;
    if (token === "..") {
      if (stack.length) stack.pop();
    } else {
      stack.push(token);
    }
  }
  return "/" + stack.join("/");
}`,
      },
    },
  ],
});
