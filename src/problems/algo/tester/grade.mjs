// The grading core: transpile a submission, extract its named function, run every case (hydrating
// reference-type I/O, comparing via the authored checker or deep-equal), and report a SubmissionOutcome.
// Environment-agnostic on purpose — it uses `new Function` rather than `node:vm`, so the *same* core runs
// in the browser Web Worker (the live judge) and the Node worker (tests / verifyProblems). The terminable
// worker around it is what bounds infinite loops; this core never sets a timeout itself.

import { transform } from "sucrase";
import { ListNode, TreeNode, GraphNode, hydrate, dehydrate } from "./io.mjs";

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
  typeof value === "string"
    ? value
    : (() => {
        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      })();

/**
 * Grade one submission against its cases. Returns a SubmissionOutcome; never throws (compile-time
 * failures — syntax errors, sucrase failures, a missing function — resolve to `compile-error`).
 */
export const gradeSubmission = ({ source, language, functionName, tests, io, checker }) => {
  try {
    // Transpile TS to JS (sucrase strips types only — no type-checking, which is what a judge wants).
    let code = source;
    if (language === "typescript") {
      code = transform(source, { transforms: ["typescript"], disableESTransforms: true }).code;
    }

    const logs = [];
    const consoleShim = {
      log: (...args) => logs.push(args.map(format).join(" ")),
      error: (...args) => logs.push(args.map(format).join(" ")),
      warn: (...args) => logs.push(args.map(format).join(" ")),
      info: (...args) => logs.push(args.map(format).join(" ")),
    };

    // Authored (trusted) validator for problems with multiple valid answers; replaces deep-equal when present.
    // eslint-disable-next-line no-new-func
    const checkerFn = checker ? new Function(`return (${checker});`)() : null;

    // Wrap the source in a function scope so both `function foo(){}` (hoisted) and `const foo = …`
    // (lexical) resolve, then hand back the reference. Globals are injected as params, not a vm context.
    // eslint-disable-next-line no-new-func
    const factory = new Function(
      "ListNode",
      "TreeNode",
      "GraphNode",
      "console",
      `${code}\n; return typeof ${functionName} === "function" ? ${functionName} : undefined;`,
    );
    const fn = factory(ListNode, TreeNode, GraphNode, consoleShim);
    if (typeof fn !== "function") {
      return {
        status: "compile-error",
        message: `No function named "${functionName}" was found. Define it (e.g. function ${functionName}(…) { … }).`,
      };
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
        // Checker gets `args` post-call (mutations visible) so it can judge in-place answers; deep-equal uses the return.
        const passed = checkerFn ? Boolean(checkerFn(actual, args, test.expected)) : deepEqual(actual, test.expected);
        return { name, args: test.args, passed, expected: test.expected, actual, logs: [...logs], error: null, ms, hidden };
      } catch (error) {
        return {
          name,
          args: test.args,
          passed: false,
          expected: test.expected,
          actual: null,
          logs: [...logs],
          error: error instanceof Error ? error.message : String(error),
          ms: performance.now() - startedAt,
          hidden,
        };
      }
    });

    return { status: "ok", results };
  } catch (error) {
    return { status: "compile-error", message: error instanceof Error ? error.message : String(error) };
  }
};
