import { parentPort, workerData } from "node:worker_threads";
import vm from "node:vm";
import { transform } from "sucrase";

/** Structural equality for judge output: handles primitives (incl. NaN), arrays, and plain objects. */
const deepEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") return Number.isNaN(a) && Number.isNaN(b);
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => deepEqual(a[key], b[key]));
};

const format = (value) =>
  typeof value === "string" ? value : (() => {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  })();

/** Singly-linked node, injected as a sandbox global so linked-list solutions can reference `ListNode`. */
class ListNode {
  constructor(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

const arrayToList = (values) => {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) head = new ListNode(values[i], head);
  return head;
};

const listToArray = (node) => {
  const values = [];
  for (let current = node; current !== null && current !== undefined; current = current.next) values.push(current.val);
  return values;
};

const hydrate = (value, shape) => (shape === "linked-list" ? arrayToList(value) : value);
const dehydrate = (value, shape) => (shape === "linked-list" ? listToArray(value) : value);

const run = () => {
  const { source, language, functionName, tests, io, checker } = workerData;

  // Transpile TS to JS (sucrase strips types only — no type-checking, which is what a judge wants).
  let code = source;
  if (language === "typescript") {
    code = transform(source, { transforms: ["typescript"], disableESTransforms: true }).code;
  }

  const logs = [];
  const sandbox = {
    ListNode,
    console: {
      log: (...args) => logs.push(args.map(format).join(" ")),
      error: (...args) => logs.push(args.map(format).join(" ")),
      warn: (...args) => logs.push(args.map(format).join(" ")),
      info: (...args) => logs.push(args.map(format).join(" ")),
    },
  };
  const context = vm.createContext(sandbox);

  // Authored (trusted) validator for problems with multiple valid answers; replaces deep-equal when present.
  const checkerFn = checker ? vm.runInContext(`(${checker})`, context, { timeout: 1000 }) : null;

  // Wrap in a function scope so both `function foo(){}` and `const foo = …` resolve, then hand back the reference.
  const factory = vm.runInContext(
    `(function(){ ${code}\n; return typeof ${functionName} === "function" ? ${functionName} : undefined; })`,
    context,
    { timeout: 1000 },
  );
  const fn = factory();
  if (typeof fn !== "function") {
    parentPort.postMessage({
      status: "compile-error",
      message: `No function named "${functionName}" was found. Define it (e.g. function ${functionName}(…) { … }).`,
    });
    return;
  }

  const results = tests.map((test, index) => {
    const cloned = structuredClone(test.args);
    // Hydrate any reference-type params (e.g. arrays → ListNode) before the call; tests stay plain arrays.
    const args = io?.params ? cloned.map((arg, i) => hydrate(arg, io.params[i])) : cloned;
    const name = test.name ?? `case ${index + 1}`;
    const hidden = Boolean(test.hidden);
    logs.length = 0;
    const startedAt = performance.now();
    try {
      const actual = io?.result ? dehydrate(fn(...args), io.result) : fn(...args);
      const ms = performance.now() - startedAt;
      const passed = checkerFn ? Boolean(checkerFn(actual, test.args, test.expected)) : deepEqual(actual, test.expected);
      // Hidden cases report only pass/fail + timing — expected/actual/logs would leak the probing inputs.
      return {
        name,
        passed,
        expected: hidden ? null : test.expected,
        actual: hidden ? null : actual,
        logs: hidden ? [] : [...logs],
        error: null,
        ms,
        hidden,
      };
    } catch (error) {
      return {
        name,
        passed: false,
        expected: hidden ? null : test.expected,
        actual: null,
        logs: hidden ? [] : [...logs],
        error: error instanceof Error ? error.message : String(error),
        ms: performance.now() - startedAt,
        hidden,
      };
    }
  });

  parentPort.postMessage({ status: "ok", results });
};

try {
  run();
} catch (error) {
  // Errors before/at compile time (syntax errors, sucrase failures, vm timeouts at definition).
  parentPort.postMessage({
    status: "compile-error",
    message: error instanceof Error ? error.message : String(error),
  });
}
