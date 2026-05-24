// Run a Study Guide problem page's authored `testCases` (PROBLEM_EXTRAS[id].testCases) against the problem's
// stored JS reference solution, on the real tester worker — the auditor agent's entrypoint for checking that
// every authored edge case's `expected` actually matches what the reference produces.
//
//   node scripts/verifyGuideTestCases.mjs <problem-id>
//
// Mirrors scripts/verifyProblems.mjs: transpile the .ts modules with sucrase, eval them with the data-module
// imports stubbed, then feed { args, expected } cases to problemTester.worker.mjs (honoring io + checker).
import { transform } from "sucrase";
import { Worker } from "node:worker_threads";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const problemsDir = path.join(root, "src/problems/data/problems");
const workerPath = path.join(root, "src/problems/algo/tester/problemTester.worker.mjs");
const guidesPath = path.join(root, "src/learn/data/problemGuides.ts");

/** Transpile a .ts module and evaluate it, returning its full export namespace (data modules only — no runtime deps). */
const evalModule = (absPath) => {
  const src = fs.readFileSync(absPath, "utf8");
  const { code } = transform(src, { transforms: ["typescript", "imports"], disableESTransforms: true });
  const mod = { exports: {} };
  const fakeRequire = (id) =>
    id.includes("problem")
      ? {
          defineAlgoProblem: (p) => ({ kind: "algo", ...p }),
          defineBuildProblem: (p) => ({ kind: "build", ...p }),
        }
      : {};
  new Function("module", "exports", "require", code)(mod, mod.exports, fakeRequire);
  return mod.exports;
};

const target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/verifyGuideTestCases.mjs <problem-id>");
  process.exit(2);
}

const testCases = evalModule(guidesPath).PROBLEM_EXTRAS?.[target]?.testCases ?? [];
if (testCases.length === 0) {
  console.log(`No authored guide testCases for "${target}".`);
  process.exit(0);
}

const files = fs
  .readdirSync(problemsDir)
  .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && f !== "index.ts" && f !== "problem.ts");
let problem = null;
for (const file of files) {
  try {
    const candidate = Object.values(evalModule(path.join(problemsDir, file)))[0];
    if (candidate && candidate.id === target) {
      problem = candidate;
      break;
    }
  } catch {
    // a half-written sibling module shouldn't abort the search
  }
}

if (!problem) {
  console.error(`Problem "${target}" not found under ${path.relative(root, problemsDir)}.`);
  process.exit(2);
}
const solution = problem.solutions?.[0]?.code?.javascript;
if (!solution) {
  console.error(`Problem "${target}" has no JS reference solution to verify the cases against.`);
  process.exit(2);
}

const tests = testCases.map((testCase, index) => ({
  name: testCase.note ?? `case ${index + 1}`,
  args: testCase.args,
  expected: testCase.expected,
  hidden: false,
}));

const outcome = await new Promise((resolve) => {
  const worker = new Worker(workerPath, {
    workerData: {
      source: solution,
      language: "javascript",
      functionName: problem.functionName,
      tests,
      io: problem.io ?? null,
      checker: problem.checker ?? null,
    },
  });
  const timer = setTimeout(() => {
    worker.terminate();
    resolve({ status: "timeout" });
  }, 4000);
  worker.on("message", (result) => {
    clearTimeout(timer);
    worker.terminate();
    resolve(result);
  });
  worker.on("error", (error) => {
    clearTimeout(timer);
    resolve({ status: "crashed", message: error.message });
  });
});

if (outcome.status !== "ok") {
  console.log(`FAIL ${target}: ${outcome.status} ${outcome.message ?? ""}`);
  process.exit(1);
}

for (const result of outcome.results) {
  console.log(
    result.passed
      ? `  ✓ ${result.name}`
      : `  ✗ ${result.name} — got ${JSON.stringify(result.actual)} expected ${JSON.stringify(result.expected)}`,
  );
}
const failed = outcome.results.filter((result) => !result.passed);
console.log(
  failed.length === 0
    ? `PASS ${target}: ${outcome.results.length}/${outcome.results.length} guide test cases`
    : `FAIL ${target}: ${failed.length}/${outcome.results.length} guide test cases failed`,
);
process.exit(failed.length === 0 ? 0 : 1);
