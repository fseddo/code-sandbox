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

const run = () => {
  const { source, language, functionName, tests } = workerData;

  // Transpile TS to JS (sucrase strips types only — no type-checking, which is what a judge wants).
  let code = source;
  if (language === "typescript") {
    code = transform(source, { transforms: ["typescript"], disableESTransforms: true }).code;
  }

  const logs = [];
  const sandbox = {
    console: {
      log: (...args) => logs.push(args.map(format).join(" ")),
      error: (...args) => logs.push(args.map(format).join(" ")),
      warn: (...args) => logs.push(args.map(format).join(" ")),
      info: (...args) => logs.push(args.map(format).join(" ")),
    },
  };
  const context = vm.createContext(sandbox);

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
    const args = structuredClone(test.args);
    logs.length = 0;
    const startedAt = performance.now();
    try {
      const actual = fn(...args);
      const ms = performance.now() - startedAt;
      return {
        name: test.name ?? `case ${index + 1}`,
        passed: deepEqual(actual, test.expected),
        expected: test.expected,
        actual,
        logs: [...logs],
        error: null,
        ms,
      };
    } catch (error) {
      return {
        name: test.name ?? `case ${index + 1}`,
        passed: false,
        expected: test.expected,
        actual: undefined,
        logs: [...logs],
        error: error instanceof Error ? error.message : String(error),
        ms: performance.now() - startedAt,
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
