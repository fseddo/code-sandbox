import { defineAlgoProblem } from "../problem";

export const gasStation = defineAlgoProblem<[number[], number[]], number>({
  id: "gas-station",
  number: 158,
  title: "Gas Station",
  difficulty: "medium",
  tags: ["array", "greedy"],
  functionName: "gasStation",
  prompt: `There are \`n\` gas stations arranged in a circle, numbered \`0\` to \`n - 1\`. You're given two integer arrays \`gas\` and \`cost\`, both of length \`n\`: \`gas[i]\` is the amount of gas available at station \`i\`, and \`cost[i]\` is the amount of gas needed to travel from station \`i\` to station \`i + 1\` (the last station wraps around to station \`0\`).

You begin with an empty tank at a station of your choosing. Return the index of the starting station that lets you travel around the entire circuit once in the forward direction without the tank ever going negative, or \`-1\` if no such station exists.

It is guaranteed that if a valid starting station exists, it is unique.`,
  constraints: [
    "n == gas.length == cost.length",
    "1 <= n <= 10^5",
    "0 <= gas[i], cost[i] <= 10^4",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
function gasStation(gas, cost) {
  // your code here
}`,
    typescript: `/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
function gasStation(gas: number[], cost: number[]): number {
  // your code here
}`,
  },
  examples: [
    {
      name: "unique feasible start",
      args: [
        [1, 2, 3, 4, 5],
        [3, 4, 5, 1, 2],
      ],
      expected: 3,
      explanation:
        "Starting at station 3: tank goes 4 -> 4+5-2=7 -> 7+1-3=5 -> 5+2-4=3 -> 3+3-5=1, completing the loop without going negative.",
    },
    {
      name: "impossible",
      args: [
        [2, 3, 4],
        [3, 4, 3],
      ],
      expected: -1,
      explanation: "Total gas (9) is less than total cost (10), so no starting station can complete the circuit.",
    },
    {
      name: "single station",
      args: [[5], [4]],
      expected: 0,
      explanation: "One station with enough gas to cover its own cost back to itself.",
    },
  ],
  hiddenTests: [
    // Boundary: smallest sizes.
    { args: [[5], [4]], expected: 0 },
    { args: [[4], [5]], expected: -1 },
    { args: [[3, 1], [1, 2]], expected: 0 },
    { args: [[1, 2], [2, 1]], expected: 1 },
    // Edge: all-same values, all-negative net.
    { args: [[4, 4, 4, 4], [4, 4, 4, 4]], expected: 0 },
    { args: [[1, 1, 1], [2, 2, 2]], expected: -1 },
    // Structural: exact-fuel unique start away from 0, answer at the end, multiple greedy resets, slack.
    { args: [[3, 3, 4], [3, 4, 3]], expected: 2 },
    { args: [[1, 1, 1, 10], [2, 2, 2, 1]], expected: 3 },
    { args: [[2, 3, 4, 5, 1, 2], [3, 4, 5, 1, 2, 2]], expected: 3 },
    { args: [[1, 2, 3, 4, 5, 6], [6, 5, 4, 3, 2, 1]], expected: 3 },
    { args: [[7, 1, 1, 1, 1], [1, 1, 1, 1, 1]], expected: 0 },
    // Anti-hardcode: patterns unlike the examples above.
    { args: [[4, 5, 2, 6, 5, 3], [3, 2, 7, 3, 2, 9]], expected: -1 },
    { args: [[6, 1, 7, 2, 4, 5, 3], [5, 8, 2, 4, 3, 1, 2]], expected: 2 },
    // Scale: large feasible circuit with a non-zero start, and a large infeasible circuit.
    {
      args: (() => {
        const n = 10000;
        const gas = Array.from({ length: n }, () => 1);
        const cost = Array.from({ length: n }, () => 1);
        gas[0] = 0;
        cost[0] = 2;
        gas[n - 1] = 3;
        return [gas, cost];
      })(),
      expected: 1,
    },
    {
      args: (() => {
        const n = 10000;
        const gas = Array.from({ length: n }, () => 1);
        const cost = Array.from({ length: n }, (_, i) => (i === 0 ? 2 : 1));
        return [gas, cost];
      })(),
      expected: -1,
    },
  ],
  source: { origin: "authored", confidence: 0.92 },
  solutions: [
    {
      name: "Greedy one pass",
      explanation: `If total gas is less than total cost, no starting station can work, so return \`-1\` immediately. Otherwise a valid, unique starting station is guaranteed to exist.

Walk the stations once, tracking the running tank (\`gas[i] - cost[i]\` accumulated) and a candidate \`start\`. Whenever the tank dips below zero at station \`i\`, none of the stations from the current \`start\` through \`i\` can be a valid start (each would run out of gas by at least the same point), so advance \`start\` to \`i + 1\` and reset the tank to \`0\`. The station survived once the scan finishes is the answer.

\`O(n)\` time, \`O(1)\` space.`,
      code: {
        javascript: `function gasStation(gas, cost) {
  let total = 0; // running gas - cost over the whole circuit, decides feasibility
  let tank = 0; // running gas - cost since the current candidate start
  let start = 0; // current candidate starting station
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i]; // net gas gained (or lost) driving away from station i
    total += diff;
    tank += diff;
    // Ran dry at i: no station from start..i can work either, so try i + 1 next.
    if (tank < 0) {
      start = i + 1;
      tank = 0; // fresh candidate starts with an empty tank
    }
  }
  // Overall shortfall means no station works; otherwise the surviving start is the answer.
  return total < 0 ? -1 : start;
}`,
        typescript: `function gasStation(gas: number[], cost: number[]): number {
  let total = 0; // running gas - cost over the whole circuit, decides feasibility
  let tank = 0; // running gas - cost since the current candidate start
  let start = 0; // current candidate starting station
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i]; // net gas gained (or lost) driving away from station i
    total += diff;
    tank += diff;
    // Ran dry at i: no station from start..i can work either, so try i + 1 next.
    if (tank < 0) {
      start = i + 1;
      tank = 0; // fresh candidate starts with an empty tank
    }
  }
  // Overall shortfall means no station works; otherwise the surviving start is the answer.
  return total < 0 ? -1 : start;
}`,
      },
    },
  ],
});
