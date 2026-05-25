import { defineAlgoProblem } from "../problem";

export const implementQueueUsingStacks = defineAlgoProblem<[string[], number[][]], (number | boolean | null)[]>({
  id: "implement-queue-using-stacks",
  number: 120,
  title: "Implement Queue using Stacks",
  difficulty: "medium",
  tags: ["stack", "queue"],
  functionName: "runQueueOps",
  prompt: `Implement a **first-in, first-out (FIFO) queue** using only stack operations (push / pop / peek / size / empty on a last-in, first-out structure). The queue supports four operations:

- \`"push"\` — add an element \`x\` to the back of the queue. Returns \`null\`.
- \`"pop"\` — remove and return the element at the front of the queue.
- \`"peek"\` — return the element at the front without removing it.
- \`"empty"\` — return \`true\` if the queue is empty, \`false\` otherwise.

You are given the operations as two parallel arrays: \`operations[i]\` is the name of the i-th operation, and \`values[i]\` is its argument list (\`[x]\` for \`"push"\`, \`[]\` for the others). Apply them in order and return an array holding each operation's return value (use \`null\` for \`"push"\`).

\`"pop"\` and \`"peek"\` are only called on a non-empty queue.`,
  constraints: [
    "1 <= operations.length <= 1000",
    "operations[i] is one of \"push\", \"pop\", \"peek\", \"empty\".",
    "1 <= x <= 9 for every \"push\".",
    "At most 1000 calls total; pop/peek are only made on a non-empty queue.",
  ],
  starterCode: {
    javascript: `/**
 * @param {string[]} operations
 * @param {number[][]} values
 * @return {(number | boolean | null)[]}
 */
function runQueueOps(operations, values) {
  // your code here
}`,
    typescript: `/**
 * @param {string[]} operations
 * @param {number[][]} values
 * @return {(number | boolean | null)[]}
 */
function runQueueOps(operations: string[], values: number[][]): (number | boolean | null)[] {
  // your code here
}`,
  },
  examples: [
    {
      name: "push then drain",
      args: [["push", "push", "peek", "pop", "empty"], [[1], [2], [], [], []]],
      expected: [null, null, 1, 1, false],
      explanation: "Push 1 then 2; peek and pop both return 1 (FIFO front); the queue still holds 2, so empty is false.",
    },
    {
      name: "interleaved",
      args: [["push", "pop", "empty"], [[5], [], []]],
      expected: [null, 5, true],
      explanation: "Push 5, pop it back out, queue is now empty.",
    },
  ],
  hiddenTests: [
    { args: [["empty"], [[]]], expected: [true] },
    { args: [["push", "empty"], [[7], []]], expected: [null, false] },
    { args: [["push", "push", "push", "pop", "pop", "pop", "empty"], [[1], [2], [3], [], [], [], []]], expected: [null, null, null, 1, 2, 3, true] },
    { args: [["push", "peek", "push", "peek", "pop", "peek"], [[1], [], [2], [], [], []]], expected: [null, 1, null, 1, 1, 2] },
    { args: [["push", "pop", "push", "pop", "empty"], [[9], [], [4], [], []]], expected: [null, 9, null, 4, true] },
    { args: [["push", "push", "pop", "push", "peek", "pop", "pop", "empty"], [[1], [2], [], [3], [], [], [], []]], expected: [null, null, 1, null, 2, 2, 3, true] },
    { args: [["push", "push", "push", "peek", "pop", "push", "pop", "pop"], [[5], [6], [7], [], [], [8], [], []]], expected: [null, null, null, 5, 5, null, 6, 7] },
    {
      args: [
        ["push", "push", "push", "push", "pop", "pop", "push", "peek", "pop", "pop", "empty"],
        [[1], [2], [3], [4], [], [], [5], [], [], [], []],
      ],
      expected: [null, null, null, null, 1, 2, null, 3, 3, 4, false],
    },
  ],
  source: { origin: "leetcode", frontendId: "232", acRate: 0.668, confidence: 0.93 },
  solutions: [
    {
      name: "Two stacks, lazy transfer",
      explanation: `One stack alone reverses order: popping it returns the most recent push, but a queue needs the *oldest*. Use two stacks. \`inStack\` receives every \`push\`. When a \`pop\` or \`peek\` needs the front and \`outStack\` is empty, pour \`inStack\` into \`outStack\` — that single reversal flips the order so the oldest element is now on top of \`outStack\`. While \`outStack\` is non-empty, front operations read straight off its top; only when it drains do you transfer again.

Each element is moved between stacks at most once, so although a single transfer is \`O(n)\`, every element is pushed and popped a constant number of times overall — \`O(1)\` **amortized** per operation.

\`O(1)\` amortized time per call, \`O(n)\` space for the elements held.`,
      code: {
        javascript: `function runQueueOps(operations, values) {
  const inStack = [];  // newest pushes land here
  const outStack = []; // reversed once, so its top is the queue front
  const result = [];
  // Move everything to outStack only when a front op needs it and outStack is empty.
  const transfer = () => {
    if (outStack.length === 0) {
      while (inStack.length > 0) outStack.push(inStack.pop());
    }
  };
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    if (op === "push") {
      inStack.push(values[i][0]);
      result.push(null);
    } else if (op === "pop") {
      transfer();
      result.push(outStack.pop());
    } else if (op === "peek") {
      transfer();
      result.push(outStack[outStack.length - 1]);
    } else { // "empty"
      result.push(inStack.length === 0 && outStack.length === 0);
    }
  }
  return result;
}`,
        typescript: `function runQueueOps(operations: string[], values: number[][]): (number | boolean | null)[] {
  const inStack: number[] = [];  // newest pushes land here
  const outStack: number[] = []; // reversed once, so its top is the queue front
  const result: (number | boolean | null)[] = [];
  // Move everything to outStack only when a front op needs it and outStack is empty.
  const transfer = (): void => {
    if (outStack.length === 0) {
      while (inStack.length > 0) outStack.push(inStack.pop()!);
    }
  };
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    if (op === "push") {
      inStack.push(values[i][0]);
      result.push(null);
    } else if (op === "pop") {
      transfer();
      result.push(outStack.pop()!);
    } else if (op === "peek") {
      transfer();
      result.push(outStack[outStack.length - 1]);
    } else { // "empty"
      result.push(inStack.length === 0 && outStack.length === 0);
    }
  }
  return result;
}`,
      },
    },
  ],
});
