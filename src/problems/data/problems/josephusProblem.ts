import { defineAlgoProblem } from "../problem";

export const josephusProblem = defineAlgoProblem<[number, number], number>({
  id: "josephus-problem",
  number: 167,
  title: "The Josephus Problem",
  difficulty: "medium",
  tags: ["math", "recursion", "simulation"],
  functionName: "josephusProblem",
  prompt: `\`n\` people stand in a circle, numbered \`0\` through \`n - 1\`. Starting the count at person \`0\`, count forward \`k\` people around the circle (wrapping past the end back to the start) and eliminate whoever the count lands on. Counting for the next elimination resumes with the person immediately after the one just removed.

Keep eliminating one person every \`k\` count until a single person is left. Return that survivor's **original** 0-indexed position.

For example, with \`n = 5\` and \`k = 2\`: circle is \`[0, 1, 2, 3, 4]\`. Counting 2 from person 0 lands on person 1 — eliminate them. Counting 2 from person 2 lands on person 3 — eliminate them. Counting 2 from person 4 wraps to person 0 — eliminate them. Counting 2 from person 2 lands on person 4 — eliminate them. Person 2 is the sole survivor.`,
  constraints: ["1 <= n <= 10^5", "1 <= k <= 10^5"],
  starterCode: {
    javascript: `/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
function josephusProblem(n, k) {
  // your code here
}`,
    typescript: `/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
function josephusProblem(n: number, k: number): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "five people, count of two",
      args: [5, 2],
      expected: 2,
      explanation: "Eliminations happen in order 1, 3, 0, 4; person 2 survives.",
    },
    {
      name: "single person",
      args: [1, 5],
      expected: 0,
      explanation: "With only one person in the circle, they survive with no eliminations.",
    },
    {
      name: "seven people, count of three",
      args: [7, 3],
      expected: 3,
      explanation: "Eliminations happen in order 2, 5, 1, 6, 4, 0; person 3 survives.",
    },
  ],
  hiddenTests: [
    { name: "trivial circle, large k", args: [1, 100000], expected: 0 },
    { name: "two people, k = 1", args: [2, 1], expected: 1 },
    { name: "two people, k = 2", args: [2, 2], expected: 0 },
    { name: "k = 1 eliminates the next person every time", args: [6, 1], expected: 5 },
    { name: "survivor at the start of the circle", args: [6, 3], expected: 0 },
    { name: "k larger than n, wraps multiple times", args: [10, 17], expected: 2 },
    { name: "k far larger than n", args: [10, 100], expected: 5 },
    { name: "mid-size, non-trivial k", args: [41, 3], expected: 30 },
    { name: "mid-size, k coprime-ish with n", args: [100, 7], expected: 49 },
    { name: "duplicate-free but unlike the examples", args: [13, 2], expected: 10 },
    { name: "scale: n = 1000", args: [1000, 13], expected: 395 },
    { name: "scale: n = 50000", args: [50000, 3], expected: 11746 },
    { name: "scale: n = k = max bound", args: [100000, 100000], expected: 66028 },
    { name: "scale: k = 1 at max n", args: [100000, 1], expected: 99999 },
  ],
  source: { origin: "authored", confidence: 0.9 },
  solutions: [
    {
      name: "Iterative recurrence (unwind the recursion)",
      explanation: `The recursive Josephus recurrence says: with 1 person, the survivor is trivially position \`0\`. Going from \`m - 1\` people to \`m\` people (adding one more person to the circle and re-running the same elimination rule), the survivor's position shifts by \`k\` positions (mod \`m\`) relative to the smaller circle's survivor: \`J(m) = (J(m - 1) + k) mod m\`.

Unwinding that recurrence from \`m = 2\` up to \`m = n\` avoids recursion overhead and stack depth entirely.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function josephusProblem(n, k) {
  // J(1) = 0: with one person left, they trivially survive.
  let survivor = 0;
  // Rebuild the answer for circles of size 2, 3, ..., n from the smaller circle's survivor.
  for (let people = 2; people <= n; people++) {
    survivor = (survivor + k) % people;
  }
  return survivor;
}`,
        typescript: `function josephusProblem(n: number, k: number): number {
  // J(1) = 0: with one person left, they trivially survive.
  let survivor = 0;
  // Rebuild the answer for circles of size 2, 3, ..., n from the smaller circle's survivor.
  for (let people = 2; people <= n; people++) {
    survivor = (survivor + k) % people;
  }
  return survivor;
}`,
      },
    },
    {
      name: "Direct simulation",
      explanation: `Track the circle as a list of remaining original positions and a current count-start index. Repeatedly compute the eliminated index as \`(current + k - 1) mod circle.length\`, remove that person, and resume counting from the same index (which now points at the next survivor after the removal).

\`O(n²)\` time in the worst case (each removal from an array is \`O(n)\`), \`O(n)\` space — correct, but too slow for the largest inputs.`,
      code: {
        javascript: `function josephusProblem(n, k) {
  const circle = Array.from({ length: n }, (_, i) => i);
  let current = 0;
  while (circle.length > 1) {
    // The kth person counted from "current" (current itself counts as 1).
    current = (current + k - 1) % circle.length;
    circle.splice(current, 1);
  }
  return circle[0];
}`,
        typescript: `function josephusProblem(n: number, k: number): number {
  const circle = Array.from({ length: n }, (_, i) => i);
  let current = 0;
  while (circle.length > 1) {
    // The kth person counted from "current" (current itself counts as 1).
    current = (current + k - 1) % circle.length;
    circle.splice(current, 1);
  }
  return circle[0];
}`,
      },
    },
  ],
});
